var dagre = require("dagre");



function gNodeEdge(nodes_in_order,nodes_by_id,graph_links) {
  var nodes = []
  var edges = []

  nodes_in_order.forEach(node => {

    if(node['type']=='graph/GlobalInput'){
       var opls = node['outputs']
       if(opls.length>0){
        opls.forEach(ol => {
          var ols = ol['links']
          ols.forEach(lid => {
            graph_links[lid]
          });
        });
       }

    }
    
  });

  for (var id in graph_links) {
    graph_links[id]
  }


  return [nodes_in_order,]
}


function gLayout1(nodes,edges){
  var g = new dagre.graphlib.Graph();

  // Set an object for the graph label
  g.setGraph({});

  // Default to assigning a new object as a label for each new edge.
  g.setDefaultEdgeLabel(function() { return {}; });

  // Add nodes to the graph. The first argument is the node id. The second is
  // metadata about the node. In this case we're going to add labels to each of
  // our nodes.
  g.setNode(1,    { label: "Kevin Spacey",  width: 144, height: 100 });
  g.setNode(2,  { label: "Saul Williams", width: 160, height: 100 });
  g.setNode(3,      { label: "Brad Pitt",     width: 108, height: 100 });
  g.setNode(4,      { label: "Harrison Ford", width: 168, height: 100 });
  g.setNode(5,    { label: "Luke Wilson",   width: 144, height: 100 });
  g.setNode(6,     { label: "Kevin Bacon",   width: 121, height: 100 });

  // Add edges to the graph.
  g.setEdge(1, 2);
  g.setEdge(2, 3);
  g.setEdge(3, 4);
  // g.setEdge("swilliams", "kbacon");
  // g.setEdge("bpitt",     "kbacon");
  // g.setEdge("hford",     "lwilson");
  // g.setEdge("lwilson",   "kbacon");

  dagre.layout(g);

  g.nodes().forEach(function(v) {
    console.log("Node " + v + ": " + JSON.stringify(g.node(v)));
  });
  g.edges().forEach(function(e) {
  console.log("Edge " + e.v + " -> " + e.w + ": " + JSON.stringify(g.edge(e)));
  });
}



function gLayout(nodes,edges) {
 
  var g = new dagre.graphlib.Graph();
  g.setGraph({});
  g.setDefaultEdgeLabel(function() { return {}; });

  nodes.forEach(node => {
    g.setNode(node.id,  { label: node.title,  width: node.size[0], height: node.size[1] });
    
  });

  // Add edges to the graph.
  for (var id in edges) {
    var edge = edges[id]
    g.setEdge(edge.origin_id, edge.target_id);
  }

  dagre.layout(g);

  g.nodes().forEach(function(v) {
      console.log("Node " + v + ": " + JSON.stringify(g.node(v)));
  });
  g.edges().forEach(function(e) {
    console.log("Edge " + e.v + " -> " + e.w + ": " + JSON.stringify(g.edge(e)));
  });


}
export {gLayout}