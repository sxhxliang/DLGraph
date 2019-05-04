// var _ = require('lodash');

// import {GraphConfig } from './lib/base/config'
// import {GraphBaseFunc } from './lib/graph_base'
// import {GraphCommonFunc} from './lib/common'

import {GraphBase} from './lib/graph_base'

import {LLink} from './lib/graph_link'
import {LGraphNode} from './lib/graph_node'
import {LGraphGroup} from './lib/graph_group'

import {LGraph} from './lib/graph'
import {LGraphCanvas} from './lib/graph_canvas'

import {ContextMenu} from './lib/graph_gui'


const Graph = GraphBase;

// Graph Container
Graph.LGraph = LGraph
Graph.LGraphCanvas = LGraphCanvas

// Graph svg Object
Graph.LLink = LLink
Graph.LGraphNode = LGraphNode
Graph.LGraphGroup = LGraphGroup
// GUI
Graph.ContextMenu = ContextMenu

// Config: register Nodes
Graph.ConfigNodes = function(nodeConfig){
	for (var key in nodeConfig) {
		this.registerNodeType(key, nodeConfig[key])
	}
}

  
const LiteGraph = Graph
export {LiteGraph}