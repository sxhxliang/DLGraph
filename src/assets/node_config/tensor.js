// import 


const tensorNodeMetas = [ 
  {
    "name": "Tensor.ones",
    "schema": {
      "attributes": [
        {
          "name": "size",
          "default": 128
        },
      ],
      "category": "Tensor",
      "package": "torch.Tensor"
    }
  },{
    "name": "Tensor.zeros",
    "schema": {
      "attributes": [
        {
          "name": "size",
          "default": 128
        },
      ],
      "category": "Tensor",
      "package": "torch.Tensor"
    }
  },{
    "name": "Tensor1d",
    "schema": {
      "attributes": [
        {
          "name": "size",
          "default": 128
        },
      ],
      "category": "Tensor",
      "package": "torch.Tensor"
    }
  },
  {
    "name": "Tensor2d",
    "schema": {
      "attributes": [
        {
          "name" : "size",
          "default": [128,128]
        }
      ],
      "category": "Tensor",
      "package": "torch.Tensor"
    }
  },{
    "name": "Tensor3d",
    "schema": {
      "attributes": [
        {
          "name" : "size",
          "default": [3,128,128]
        }
      ],
      "category": "Tensor",
      "package": "torch.Tensor"
    }
  },{
    "name": "Tensor4d",
    "schema": {
      "attributes": [
        {
          "name" : "size",
          "default": [1,3,128,128]
        }
      ],
      "category": "Tensor",
      "package": "torch.Tensor"
    }
  }]

const framework = 'Tensor'
var tensorNodes = []
var i = 0
for(i in tensorNodeMetas){
  // console.log(i)
  var item = tensorNodeMetas[i]
  
  item.func =function()
  {
    this.addOutput("out");
    this.addProperty( "value", 1.0 );
  }

  item.func.title = item.name;
  item.func.desc = item.schema.package;
  item.func.data = item.schema

  item.func.prototype.onExecute = function()
  {
    const v = [1,2,3,4]
    this.setOutputData(0, v);
  }
  var node = {
    
  }
  // LiteGraph.registerNodeType(, item.func);
  node.menu_name = framework +'/'+ item.name
  node.name = item.name
  node.func = item.func
  tensorNodes.push(node)

}
export {tensorNodes, tensorNodeMetas}
