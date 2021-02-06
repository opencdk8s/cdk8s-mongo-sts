# API Reference

**Classes**

Name|Description
----|-----------
[MyMongo](#cdk8s-mongo-sts-mymongo)|MongoDB Stateful Set class.


**Structs**

Name|Description
----|-----------
[ResourceQuantity](#cdk8s-mongo-sts-resourcequantity)|*No description*
[ResourceRequirements](#cdk8s-mongo-sts-resourcerequirements)|*No description*
[STSOptions](#cdk8s-mongo-sts-stsoptions)|*No description*



## class MyMongo 🔹 <a id="cdk8s-mongo-sts-mymongo"></a>

MongoDB Stateful Set class.

__Implements__: [IConstruct](#constructs-iconstruct)
__Extends__: [Construct](#constructs-construct)

### Initializer




```ts
new MyMongo(scope: Construct, name: string, opts: STSOptions)
```

* **scope** (<code>[Construct](#constructs-construct)</code>)  *No description*
* **name** (<code>string</code>)  *No description*
* **opts** (<code>[STSOptions](#cdk8s-mongo-sts-stsoptions)</code>)  *No description*
  * **image** (<code>string</code>)  The Docker image to use for this app. 
  * **defaultReplicas** (<code>number</code>)  Number of replicas. __*Default*__: 3
  * **namespace** (<code>string</code>)  The Kubernetes namespace where this app to be deployed. __*Default*__: 'default'
  * **resources** (<code>[ResourceRequirements](#cdk8s-mongo-sts-resourcerequirements)</code>)  Resources requests for the DB. __*Default*__: Requests = { CPU = 200m, Mem = 256Mi }, Limits = { CPU = 400m, Mem = 512Mi }
  * **storageClass** (<code>string</code>)  The storage class to use for our PVC. __*Optional*__
  * **volumeSize** (<code>string</code>)  The Volume size of our DB in string, e.g 10Gi, 20Gi. __*Optional*__



### Properties


Name | Type | Description 
-----|------|-------------
**name**🔹 | <code>string</code> | <span></span>
**namespace**🔹 | <code>string</code> | <span></span>



## struct ResourceQuantity 🔹 <a id="cdk8s-mongo-sts-resourcequantity"></a>






Name | Type | Description 
-----|------|-------------
**cpu**?🔹 | <code>string</code> | __*Default*__: no limit
**memory**?🔹 | <code>string</code> | __*Default*__: no limit



## struct ResourceRequirements 🔹 <a id="cdk8s-mongo-sts-resourcerequirements"></a>






Name | Type | Description 
-----|------|-------------
**limits**?🔹 | <code>[ResourceQuantity](#cdk8s-mongo-sts-resourcequantity)</code> | Maximum resources for the web app.<br/>__*Default*__: CPU = 400m, Mem = 512Mi
**requests**?🔹 | <code>[ResourceQuantity](#cdk8s-mongo-sts-resourcequantity)</code> | Required resources for the web app.<br/>__*Default*__: CPU = 200m, Mem = 256Mi



## struct STSOptions 🔹 <a id="cdk8s-mongo-sts-stsoptions"></a>






Name | Type | Description 
-----|------|-------------
**image**🔹 | <code>string</code> | The Docker image to use for this app.
**defaultReplicas**?🔹 | <code>number</code> | Number of replicas.<br/>__*Default*__: 3
**namespace**?🔹 | <code>string</code> | The Kubernetes namespace where this app to be deployed.<br/>__*Default*__: 'default'
**resources**?🔹 | <code>[ResourceRequirements](#cdk8s-mongo-sts-resourcerequirements)</code> | Resources requests for the DB.<br/>__*Default*__: Requests = { CPU = 200m, Mem = 256Mi }, Limits = { CPU = 400m, Mem = 512Mi }
**storageClass**?🔹 | <code>string</code> | The storage class to use for our PVC.<br/>__*Optional*__
**volumeSize**?🔹 | <code>string</code> | The Volume size of our DB in string, e.g 10Gi, 20Gi.<br/>__*Optional*__



