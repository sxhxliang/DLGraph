
import {pytorchNodes, pytorchNodeMetas} from './pytorch.js'
import {Subgraph,GlobalInput,GlobalOutput} from './base.js'
import {tensorNodes} from './tensor.js'
import {Watch,ConstantNumber} from './event.js'

// var nodeConfig = function(LiteGraph){

//   LiteGraph.registerNodeType("graph/Subgraph", Subgraph);
//   LiteGraph.registerNodeType("graph/GlobalInput", GlobalInput);
//   LiteGraph.registerNodeType("graph/GlobalOutput", GlobalOutput);


//   tensorNodes.forEach(item=>{
//     LiteGraph.registerNodeType(item.menu_name,item.func)
//   })
//   pytorchNodes.forEach(item=>{
//     LiteGraph.registerNodeType(item.menu_name,item.func)
//   })

//   LiteGraph.registerNodeType("basic/watch", Watch);
//   LiteGraph.registerNodeType("basic/ConstantNumber", ConstantNumber);
  
// }

const nodeConfig = {}
nodeConfig["graph/Subgraph"] = Subgraph
nodeConfig["graph/GlobalInput"] = GlobalInput
nodeConfig["graph/GlobalOutput"] = GlobalOutput

tensorNodes.forEach(item=>{
  nodeConfig[item.menu_name] = item.func
})
pytorchNodes.forEach(item=>{
  nodeConfig[item.menu_name] = item.func
})

// nodeConfig["graph/Subgraph"] = Subgraph
// nodeConfig["graph/Subgraph"] = Subgraph


export {nodeConfig}