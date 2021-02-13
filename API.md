# API Reference

**Classes**

Name|Description
----|-----------
[MyMongo](#opencdk8s-cdk8s-mongo-sts-mymongo)|MongoDB Stateful Set class.


**Structs**

Name|Description
----|-----------
[ResourceQuantity](#opencdk8s-cdk8s-mongo-sts-resourcequantity)|*No description*
[ResourceRequirements](#opencdk8s-cdk8s-mongo-sts-resourcerequirements)|*No description*
[STSOptions](#opencdk8s-cdk8s-mongo-sts-stsoptions)|*No description*



## class MyMongo 🔹 <a id="opencdk8s-cdk8s-mongo-sts-mymongo"></a>

MongoDB Stateful Set class.

__Implements__: [IConstruct](#constructs-iconstruct)
__Extends__: [Construct](#constructs-construct)

### Initializer




```ts
new MyMongo(scope: Construct, name: string, opts: STSOptions)
```

* **scope** (<code>[Construct](#constructs-construct)</code>)  *No description*
* **name** (<code>string</code>)  *No description*
* **opts** (<code>[STSOptions](#opencdk8s-cdk8s-mongo-sts-stsoptions)</code>)  *No description*
  * **image** (<code>string</code>)  The Docker image to use for this app. 
  * **createStorageClass** (<code>boolean</code>)  Option to create storage class, if enabled, a storage class will be created for the statefulset. __*Default*__: true
  * **defaultReplicas** (<code>number</code>)  Number of replicas. __*Default*__: 3
  * **namespace** (<code>string</code>)  The Kubernetes namespace where this app to be deployed. __*Default*__: 'default'
  * **nodeSelectorParams** (<code>Map<string, string></code>)  nodeSelector params. __*Default*__: undefined
  * **resources** (<code>[ResourceRequirements](#opencdk8s-cdk8s-mongo-sts-resourcerequirements)</code>)  Resources requests for the DB. __*Default*__: Requests = { CPU = 200m, Mem = 256Mi }, Limits = { CPU = 400m, Mem = 512Mi }
  * **storageClassName** (<code>string</code>)  The storage class to use for our PVC. __*Default*__: 'gp2-expandable'
  * **storageClassParams** (<code>Map<string, string></code>)  Storage class params. __*Default*__: { type = gp2, fsType: ext4 }
  * **volumeProvisioner** (<code>string</code>)  Each StorageClass has a provisioner that determines what volume plugin is used for provisioning PVs. __*Default*__: 'kubernetes.io/aws-ebs'
  * **volumeSize** (<code>string</code>)  The Volume size of our DB in string, e.g 10Gi, 20Gi. __*Optional*__



### Properties


Name | Type | Description 
-----|------|-------------
**name**🔹 | <code>string</code> | <span></span>
**namespace**🔹 | <code>string</code> | <span></span>



## struct ResourceQuantity 🔹 <a id="opencdk8s-cdk8s-mongo-sts-resourcequantity"></a>






Name | Type | Description 
-----|------|-------------
**cpu**?🔹 | <code>string</code> | __*Default*__: no limit
**memory**?🔹 | <code>string</code> | __*Default*__: no limit



## struct ResourceRequirements 🔹 <a id="opencdk8s-cdk8s-mongo-sts-resourcerequirements"></a>






Name | Type | Description 
-----|------|-------------
**limits**?🔹 | <code>[ResourceQuantity](#opencdk8s-cdk8s-mongo-sts-resourcequantity)</code> | Maximum resources for the web app.<br/>__*Default*__: CPU = 400m, Mem = 512Mi
**requests**?🔹 | <code>[ResourceQuantity](#opencdk8s-cdk8s-mongo-sts-resourcequantity)</code> | Required resources for the web app.<br/>__*Default*__: CPU = 200m, Mem = 256Mi



## struct STSOptions 🔹 <a id="opencdk8s-cdk8s-mongo-sts-stsoptions"></a>






Name | Type | Description 
-----|------|-------------
**image**🔹 | <code>string</code> | The Docker image to use for this app.
**createStorageClass**?🔹 | <code>boolean</code> | Option to create storage class, if enabled, a storage class will be created for the statefulset.<br/>__*Default*__: true
**defaultReplicas**?🔹 | <code>number</code> | Number of replicas.<br/>__*Default*__: 3
**namespace**?🔹 | <code>string</code> | The Kubernetes namespace where this app to be deployed.<br/>__*Default*__: 'default'
**nodeSelectorParams**?🔹 | <code>Map<string, string></code> | nodeSelector params.<br/>__*Default*__: undefined
**resources**?🔹 | <code>[ResourceRequirements](#opencdk8s-cdk8s-mongo-sts-resourcerequirements)</code> | Resources requests for the DB.<br/>__*Default*__: Requests = { CPU = 200m, Mem = 256Mi }, Limits = { CPU = 400m, Mem = 512Mi }
**storageClassName**?🔹 | <code>string</code> | The storage class to use for our PVC.<br/>__*Default*__: 'gp2-expandable'
**storageClassParams**?🔹 | <code>Map<string, string></code> | Storage class params.<br/>__*Default*__: { type = gp2, fsType: ext4 }
**volumeProvisioner**?🔹 | <code>string</code> | Each StorageClass has a provisioner that determines what volume plugin is used for provisioning PVs.<br/>__*Default*__: 'kubernetes.io/aws-ebs'
**volumeSize**?🔹 | <code>string</code> | The Volume size of our DB in string, e.g 10Gi, 20Gi.<br/>__*Optional*__



