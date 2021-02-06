import { Construct } from "constructs";

import * as k8s from "./imports/k8s";

export interface STSOptions {
  /**
   * The Kubernetes namespace where this app to be deployed.
   * @default 'default'
   */
  readonly namespace?: string;

  /**
   * The Docker image to use for this app.
   */
  readonly image: string;

  /**
   * Number of replicas.
   * @default 3
   */
  readonly defaultReplicas?: number;

  /**
   * The Volume size of our DB in string, e.g 10Gi, 20Gi
   */
  readonly volumeSize?: string;

  /**
   * The storage class to use for our PVC
   */
  readonly storageClass?: string;

  /**
   * Resources requests for the DB.
   * @default - Requests = { CPU = 200m, Mem = 256Mi }, Limits = { CPU = 400m, Mem = 512Mi }
   */
  readonly resources?: ResourceRequirements;
}

export interface ResourceRequirements {
  /**
   * Maximum resources for the web app.
   * @default - CPU = 400m, Mem = 512Mi
   */
  readonly limits?: ResourceQuantity;

  /**
   * Required resources for the web app.
   * @default - CPU = 200m, Mem = 256Mi
   */
  readonly requests?: ResourceQuantity;
}

export interface ResourceQuantity {
  /**
   * @default - no limit
   */
  readonly cpu?: string;

  /**
   * @default - no limit
   */
  readonly memory?: string;
}

/**
 * MongoDB Stateful Set class.
 */

export class MyMongo extends Construct {
  public readonly name: string;
  public readonly namespace: string;

  constructor(scope: Construct, name: string, opts: STSOptions) {
    super(scope, name);

    const volumerequest = {
      storage: k8s.Quantity.fromString(String(opts.volumeSize)),
    };
    const defaultReplicas = opts.defaultReplicas ?? 3;
    const replicas = defaultReplicas;
    const imageName = opts.image;
    const namespace = opts.namespace ?? "default";
    this.namespace = namespace;
    const resources = {
      limits: convertQuantity(opts.resources?.limits, {
        cpu: "400m",
        memory: "512Mi",
      }),
      requests: convertQuantity(opts.resources?.requests, {
        cpu: "200m",
        memory: "256Mi",
      }),
    };
    const labels = { db: name };

    const serviceOpts: k8s.KubeServiceProps = {
      metadata: {
        namespace: namespace,
        name: name,
      },
      spec: {
        type: "ClusterIP",
        clusterIP: "None",
        ports: [{ port: 27017, targetPort: k8s.IntOrString.fromNumber(27017) }],
        selector: labels,
      },
    };
    const svc = new k8s.KubeService(this, "service", serviceOpts);
    this.name = svc.name;

    const clusterroleOpts: k8s.KubeClusterRoleProps = {
      metadata: {
        namespace: namespace,
        name: "get-pods-role",
      },
      rules: [
        {
          verbs: ["list"],
          apiGroups: ["*"],
          resources: ["pods"],
        },
      ],
    };
    const clusterrole = new k8s.KubeClusterRole(
      this,
      "clusterrole",
      clusterroleOpts
    );
    this.name = clusterrole.name;

    const serviceaccountOpts: k8s.KubeServiceAccountProps = {
      metadata: {
        namespace: namespace,
        name: name,
      },
    };
    const sa = new k8s.KubeServiceAccount(
      this,
      "serviceaccount",
      serviceaccountOpts
    );
    this.name = sa.name;

    const bindingOpts: k8s.KubeClusterRoleBindingProps = {
      roleRef: {
        kind: "ClusterRole",
        apiGroup: "",
        name: "get-pods-role",
      },
      metadata: {
        namespace: namespace,
        name: name,
      },
      subjects: [
        {
          kind: "ServiceAccount",
          name: name,
          namespace: namespace,
        },
      ],
    };
    const clusterrolebinding = new k8s.KubeClusterRoleBinding(
      this,
      "rolebinding",
      bindingOpts
    );
    this.name = clusterrolebinding.name;

    const pvcProps: k8s.KubePersistentVolumeClaimProps = {
      metadata: {
        name: name,
      },
      spec: {
        accessModes: ["ReadWriteOnce"],
        storageClassName: opts.storageClass,
        resources: {
          requests: volumerequest,
        },
      },
    };

    const stsOpts: k8s.KubeStatefulSetProps = {
      metadata: {
        namespace: namespace,
        name: name,
      },
      spec: {
        serviceName: name,
        selector: { matchLabels: labels },
        replicas: replicas,
        template: {
          metadata: { labels: labels },
          spec: {
            containers: [
              {
                name: "mongo-sidecar",
                image: "cvallance/mongo-k8s-sidecar",
                env: [
                  {
                    name: "MONGO_SIDECAR_POD_LABELS",
                    value: `db=${name}`,
                  },
                  {
                    name: "KUBE_NAMESPACE",
                    value: namespace,
                  },
                  {
                    name: "MONGODB_DATABASE",
                    value: "admin",
                  },
                  {
                    name: "MONGODB_USERNAME",
                    valueFrom: {
                      secretKeyRef: {
                        key: "username",
                        name: name,
                      },
                    },
                  },
                  {
                    name: "MONGODB_PASSWORD",
                    valueFrom: {
                      secretKeyRef: {
                        key: "password",
                        name: name,
                      },
                    },
                  },
                ],
              },
              {
                name: name,
                image: imageName,
                env: [
                  {
                    name: "MONGO_INITDB_ROOT_USERNAME",
                    valueFrom: {
                      secretKeyRef: {
                        key: "username",
                        name: name,
                      },
                    },
                  },
                  {
                    name: "MONGO_INITDB_ROOT_PASSWORD",
                    valueFrom: {
                      secretKeyRef: {
                        key: "password",
                        name: name,
                      },
                    },
                  },
                ],
                resources: resources,
                ports: [
                  {
                    containerPort: 27017,
                  },
                ],
                args: [
                  "--replSet",
                  "rs0",
                  "--bind_ip",
                  "0.0.0.0",
                  "--dbpath",
                  "/data/db",
                  "--oplogSize",
                  "128",
                ],
                volumeMounts: [
                  {
                    name: name,
                    mountPath: "/data/db",
                  },
                ],
              },
            ],
            terminationGracePeriodSeconds: 10,
            serviceAccountName: name,
            nodeSelector: {
              database: name,
            },
            securityContext: {
              fsGroup: 999,
              runAsGroup: 999,
              runAsUser: 999,
            },
          },
        },
        volumeClaimTemplates: [pvcProps],
      },
    };

    const sts = new k8s.KubeStatefulSet(this, "sts", stsOpts);
    this.name = sts.name;
  }
}

/**
 * Converts a `ResourceQuantity` type to a k8s.Quantity map.
 *
 * If `user` is defined, the values provided there (or lack thereof) will be
 * passed on. This means that if the user, for example, did not specify a value
 * for `cpu`, this value will be omitted from the resource requirements. This is
 * intentional, in case the user intentionally wants to omit a constraint.
 *
 * If `user` is not defined, `defaults` are used.
 */

function convertQuantity(
  user: ResourceQuantity | undefined,
  defaults: { cpu: string; memory: string }
): { [key: string]: k8s.Quantity } {
  // defaults
  if (!user) {
    return {
      cpu: k8s.Quantity.fromString(defaults.cpu),
      memory: k8s.Quantity.fromString(defaults.memory),
    };
  }

  const result: { [key: string]: k8s.Quantity } = {};

  if (user.cpu) {
    result.cpu = k8s.Quantity.fromString(user.cpu);
  }

  if (user.memory) {
    result.memory = k8s.Quantity.fromString(user.memory);
  }

  return result;
}
