# cdk8s-mongo-sts

Create a Replicated, Password protected MongoDB Statefulset on Kubernetes, powered by the [cdk8s project](https://cdk8s.io) 🚀

## Overview

**cdk8s-sts-mongo** is a [cdk8s](https://cdk8s.io) library, and also uses [cvallance/mongo-k8s-sidecar](https://github.com/cvallance/mongo-k8s-sidecar) to manage the MongoDB replicaset.

```typescript
new MyMongo(this, 'dev', {
    image: 'mongo',
    namespace: 'databases',
    defaultReplicas: 3,
    volumeSize: '10Gi',
    storageClass: 'gp2',
});
```

Create a secret for your DB that starts with the same name as your Statefulset with the following keys :

```
username
password
```

See [this](https://kubernetes.io/docs/concepts/configuration/secret/) for documentation on Kubernetes secrets.

Then the Kubernetes manifests created by `cdk8s synth` command will have Kubernetes resources such as `Statefulset`, `Service`, `ClusterRole`, `ClusterRoleBinding`, `ServiceAccount` as follows.

<details>
<summary>manifest.k8s.yaml</summary>

```yaml
apiVersion: v1
kind: Service
metadata:
  name: dev
  namespace: databases
spec:
  clusterIP: None
  ports:
    - port: 27017
      targetPort: 27017
  selector:
    db: dev
  type: ClusterIP
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: get-pods-role
  namespace: databases
rules:
  - apiGroups:
      - "*"
    resources:
      - pods
    verbs:
      - list
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: dev
  namespace: databases
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: dev
  namespace: databases
roleRef:
  apiGroup: ""
  kind: ClusterRole
  name: get-pods-role
subjects:
  - kind: ServiceAccount
    name: dev
    namespace: databases
---
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: dev
  namespace: databases
spec:
  replicas: 3
  selector:
    matchLabels:
      db: dev
  serviceName: dev
  template:
    metadata:
      labels:
        db: dev
    spec:
      containers:
        - env:
            - name: MONGO_SIDECAR_POD_LABELS
              value: db=dev
            - name: KUBE_NAMESPACE
              value: databases
            - name: MONGODB_DATABASE
              value: admin
            - name: MONGODB_USERNAME
              valueFrom:
                secretKeyRef:
                  key: username
                  name: dev
            - name: MONGODB_PASSWORD
              valueFrom:
                secretKeyRef:
                  key: password
                  name: dev
          image: cvallance/mongo-k8s-sidecar
          name: mongo-sidecar
        - args:
            - --replSet
            - rs0
            - --bind_ip
            - 0.0.0.0
            - --dbpath
            - /data/db
            - --oplogSize
            - "128"
          env:
            - name: MONGO_INITDB_ROOT_USERNAME
              valueFrom:
                secretKeyRef:
                  key: username
                  name: dev
            - name: MONGO_INITDB_ROOT_PASSWORD
              valueFrom:
                secretKeyRef:
                  key: password
                  name: dev
          image: mongo
          name: dev
          ports:
            - containerPort: 27017
          resources:
            limits:
              cpu: 400m
              memory: 512Mi
            requests:
              cpu: 200m
              memory: 256Mi
          volumeMounts:
            - mountPath: /data/db
              name: dev
      nodeSelector:
        database: dev
      securityContext:
        fsGroup: 999
        runAsGroup: 999
        runAsUser: 999
      serviceAccountName: dev
      terminationGracePeriodSeconds: 10
  volumeClaimTemplates:
    - metadata:
        name: dev
      spec:
        accessModes:
          - ReadWriteOnce
        resources:
          requests:
            storage: 10Gi
        storageClassName: gp2
```

</details>

## Installation

### TypeScript

Use `npm` or `yarn` to install.

```shell
$ npm install -s cdk8s-mongo-sts
```

or

```shell
$ yarn add cdk8s-mongo-sts
```

### Python

```shell
$ pip install cdk8s-mongo-sts
```

## Contribution

1. Fork ([https://github.com/Hunter-Thompson/cdk8s-mongo-sts/fork](https://github.com/Hunter-Thompson/cdk8s-mongo-sts/fork))
2. Bootstrap the repo:
  
    ```bash
    npx projen   # generates package.json 
    yarn install # installs dependencies
    ```
3. Development scripts:
   |Command|Description
   |-|-
   |`yarn compile`|Compiles typescript => javascript
   |`yarn watch`|Watch & compile
   |`yarn test`|Run unit test & linter through jest
   |`yarn test -u`|Update jest snapshots
   |`yarn run package`|Creates a `dist` with packages for all languages.
   |`yarn build`|Compile + test + package
   |`yarn bump`|Bump version (with changelog) based on [conventional commits]
   |`yarn release`|Bump + push to `master`
4. Create a feature branch
5. Commit your changes
6. Rebase your local changes against the master branch
7. Create a new Pull Request (use [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) for the title please)

## Licence

[Apache License, Version 2.0](./LICENSE)

## Author

[Hunter-Thompson](https://github.com/Hunter-Thompson)
