var nunjucks = require('nunjucks')
import {template} from './modelTemplate.js'

function EdgeNode (id) {
  this.id = id;
  this.afters = [];
  this.indegree = 0;
}

function topsort (edges) {
  var nodes = {};
  var result = [];
  var queue = [];

  // build data structres
  edges.forEach(function (edge) {
    var fromEdge = edge[0];
    var fromStr = fromEdge //.toString();
    var fromNode;

    if (!(fromNode = nodes[fromStr])) {
      fromNode = nodes[fromStr] = new EdgeNode(fromEdge);
    }

    edge.forEach(function (toEdge) {
      // since from and to are in same array, we'll always see from again, so make sure we skip it..
      if (toEdge == fromEdge) {
        return;
      }

      var toEdgeStr = toEdge.toString();

      if (!nodes[toEdgeStr]) {
        nodes[toEdgeStr] = new EdgeNode(toEdge);
      }
      nodes[toEdgeStr].indegree++;
      fromNode.afters.push(toEdge);
    });
  });

  // topsort
  var keys = Object.keys(nodes);
  keys.forEach(function (key) {
    if (nodes[key].indegree === 0) {
      queue.push(key);
    }
  });
  while (queue.length !== 0) {
    let vertex = queue.shift();
    result.push(nodes[vertex].id);

    nodes[vertex].afters.forEach(function (after) {
      var afterStr = after.toString();

      nodes[afterStr].indegree--;
      if (nodes[afterStr].indegree === 0) {
        queue.push(afterStr);
      }
    });
  }

  return result;
}


function TemplateRender(graph,option){


  const edges = []
  const nodeLinks = {}
  const links = graph['links']

  const inputs = []
  const inputIds = []
  const outputs = []
  const outputIds = []
  const GraphNodes = []
  const GraphNodesMap = {}
  const inputNames ={}
  
  var prefix = ''
  var modelName = 'Model'
  // if(option.prefix){
  //   prefix = option.prefix;
  // }
  // if(option.modelName){
  //   modelName = option.modelName;
  // }

  const record_node_output_name = {}
  const forwardOut = []

  const forwardStrs = []
  var forwardStr = ''


  links.forEach(link => {
    var ori = link[1]
    var taget = link[3]
    edges.push([ori,taget])

    if(!nodeLinks.hasOwnProperty(ori)){
      nodeLinks[ori]= {'inputs':[],'outputs':[]}
    }
    nodeLinks[ori]['outputs'].push(taget)

    if(!nodeLinks.hasOwnProperty(taget)){
      nodeLinks[taget]= {'inputs':[],'outputs':[]}
    }

    nodeLinks[taget]['inputs'].push(ori)

  });


  graph['nodes'].forEach(node => {
    
      var node_type = node['type'].split('/')[1]  
      var opt = true

      if(node_type == 'GlobalInput'){
        opt = false
        inputs.push(node['properties']['name'])
        inputIds.push(node['id'])
        inputNames[node['id']] = node['properties']['name']
      }

      if(node_type == 'GlobalOutput'){
          opt = false
          outputs.push(node['properties']['name'])
          outputIds.push(node['id'])
        }
          
      var opt_node = {'type':node_type,'name':node_type+'_'+ node['id'],'opt':opt}

      if(opt){
        var params = []
        var key
        for(key in node['properties']){
          
            if(['transposed','null','GlobalInput','GlobalOutput'].indexOf(key)!=-1) continue
            if(node['properties'][key] != ''){
                var param = key +'='+ node['properties'][key]
              
                params.push(param)
            }
        }
        opt_node['params'] = params.join(',')
        GraphNodes.push(opt_node)
        GraphNodesMap[node['id']] = opt_node
      }
    });

  // 图排序
  var nodeSorted = topsort(edges);

  nodeSorted.forEach(id => {
    var out_name = 'out'
    var new_out_name
    if(inputIds.indexOf(id) != -1){
      var out_name = 'out'+id
      forwardStr = out_name + ' = '+ inputNames[id]
      record_node_output_name[id] = out_name
      console.log(forwardStr)
      forwardStrs.push(forwardStr)

    }else if(outputIds.indexOf(id) != -1){
      var curInputNames = []
      var ids = nodeLinks[id]['inputs']
      ids.forEach(id => {
        curInputNames.push(record_node_output_name[id])
      });
      console.log('out',curInputNames[0])
      forwardOut.push(curInputNames[0])
      // var beforeIdOutIds = nodeLinks[ids[0]]['outputs']

    }else{
      // console.log(id)
      var ids = nodeLinks[id]['inputs']
      var ods = nodeLinks[id]['outputs']
      var curInputNames = []
      ids.forEach(id => {
        curInputNames.push(record_node_output_name[id])
      });
      // console.log(curInputNames)
        // 判断 计算路径是否分叉
      var beforeIdOutIds = nodeLinks[ids[0]]['outputs']
      // out_name = curInputNames[0]

      if(beforeIdOutIds.length>1){
          new_out_name = 'out' + id
      }else{
          new_out_name = curInputNames[0]
      }

      forwardStr = new_out_name + ' = self.'+ prefix+ GraphNodesMap[id]['name']+'('+out_name+')'
      record_node_output_name[id] = new_out_name
      console.log(forwardStr)
      forwardStrs.push(forwardStr)
    }
  });

  const _context = {
    CLASSNAME: modelName,
    PREFIX: prefix,
    INPUTS: inputs.join(','),
    INPUTNAMES:inputNames,
    INPUTSIDS:inputIds,
    OUTPUTSIDS:outputIds,
    OUTPUTS:'['+forwardOut.join(',')+']',
    ORDERLINKS: nodeLinks,
    OPTNODES: GraphNodes,
    FORWARDOPTS:forwardStrs,
    OPTNODESMAP: GraphNodesMap
  };

  // console.log(nodeSorted);
  // console.log(nodeLinks)
  // console.log(GraphNodesMap)
  // console.log(GraphNodes)
  // _context['ORDERLINKS'] = nodeLinks
  // _context['OPTNODES'] = GraphNodes
  // _context['OPTNODESMAP'] = GraphNodesMap

  var res = nunjucks.renderString(template, _context);
  // console.log(res)
  return res
}

export {TemplateRender}