<template>

</template>

<style>
@import "../assets/css/litegui.css";
@import "../assets/css/litegraph-theme.css";
</style>

<script>
import { LiteGUI } from "../assets/js/litegui.js";
import { LiteGraph } from "../assets/js/litegraph_hd_vue.js";
// import {LiteGraph} from '../assets/js/litegraph_vue.js'
import { nodeConfig } from "../assets/node_config/index.js";
import { gLayout } from "../assets/js/graph_layout.js";
import {TemplateRender} from '../assets/template/compiler.js'
var dagre = require("dagre");

export default {
  name: "HelloWorld",
  data() {
    return {
      code:'',
      msg: "Welcome to Your Vue.js App",
      canvas_ratio: 1,
      mainarea: null,
      sidepanel: null,
      docked_bottom: null,
      canvas: null,
      graph: null,
      graphcanvas: null,
      nodecfg: {}
    };
  },
  mounted: function() {
    this.registerNodeType();
    this.init();
  },
  methods: {
    getPixelRatio(context) {
      var backingStore =
        context.backingStorePixelRatio ||
        context.webkitBackingStorePixelRatio ||
        context.mozBackingStorePixelRatio ||
        context.msBackingStorePixelRatio ||
        context.oBackingStorePixelRatio ||
        context.backingStorePixelRatio ||
        1;
      return (window.devicePixelRatio || 1) / backingStore;
    },
    registerNodeType() {
      nodeConfig(LiteGraph);
    },
    init() {
      const _this = this;
      LiteGUI.init();

      var mainmenu = new LiteGUI.Menubar("mainmenubar");
      LiteGUI.add(mainmenu);

      this.mainarea = new LiteGUI.Area({
        id: "mainarea",
        height: "calc( 100% - 20px )",
        main: true,
        inmediateResize: true
      });
      LiteGUI.add(this.mainarea);

      //create main canvas to test redraw
      this.canvas = document.createElement("canvas");
      this.canvas.id = "graphcanvas";
      this.canvas.times = 0;

      this.mainarea.onresize = function() {
        _this.redraw();
      };
      this.mainarea.content.appendChild(this.canvas);

      // initGraph
      this.graph = new LiteGraph.LGraph();

      this.canvas_ratio = this.getPixelRatio(this.canvas.getContext("2d"));

      this.graphcanvas = new LiteGraph.LGraphCanvas(
        "#graphcanvas",
        this.graph,
        { ratio: this.canvas_ratio, collapsed_show_title: false }
      );
      this.graphcanvas.onNodeDblClicked = this.onNodeDblClickedCallBack;
      this.setmainmenu(this, mainmenu);
      this.redraw();
    },
    configpannel(){

      //split this.mainarea
      this.createSidePanel();

      this.mainarea.getSection(0).split("vertical", [null, "100px"], true);
      this.mainarea.getSection(0).onresize = function() {
        _this.redraw();
      };

      this.docked_bottom = new LiteGUI.Panel({
        id: "bottom_panel",
        title: "Docked panel",
        hide: true
      });
      this.mainarea
        .getSection(0)
        .getSection(1)
        .add(this.docked_bottom);
      LiteGUI.bind(this.docked_bottom, "closed", function() {
        LiteGUI.mainarea.getSection(0).merge();
      });
     
    },

    redraw() {
      var rect = this.canvas.parentNode.getClientRects()[0];

      this.canvas.style.width = rect.width + "px";
      this.canvas.style.height = rect.height + "px";
      // console.log(rect.width,rect.height,this.graphcanvas)
      this.graphcanvas.resize(
        rect.width * this.canvas_ratio,
        rect.height * this.canvas_ratio
      );
    },
    setmainmenu(_this, mainmenu) {
      mainmenu.add("file/new");
      mainmenu.add("file/open");
      mainmenu.add("file/save");

      mainmenu.add("edit/undo");
      mainmenu.add("edit/redo");
      // mainmenu.add("edit/");
      mainmenu.add("edit/copy", {
        callback: function() {
          console.log("COPY");
        }
      });
      mainmenu.add("edit/paste");
      mainmenu.add("edit/clear");

      // mainmenu.add("view/bottom panel", { callback: function() { _this.docked_bottom.show(); } });
      // mainmenu.add("view/fixed size", { callback: function() { LiteGUI.setWindowSize(1000,600); } });
      // mainmenu.add("view/");
      // mainmenu.add("view/side panel", { callback: function() { _this.createSidePanel(); } });
      // mainmenu.add("view/maximize", { callback: function() { LiteGUI.setWindowSize(); } });

      mainmenu.add("save", {
        callback: function() {
          _this.saveGraph();
        }
      });
      mainmenu.add("load", {
        callback: function() {
          const data = {"last_node_id":13,"last_link_id":12,"nodes":[{"id":2,"type":"graph/GlobalInput","pos":[165,9.5],"size":{"0":140,"1":19},"flags":{},"mode":0,"outputs":[{"name":"input_367","type":null,"links":[1]}],"properties":{"name":"input_426","type":null}},{"id":3,"type":"pytorch/Conv1d","pos":[165,78.5],"size":{"0":138.75518798828125,"1":19},"flags":{},"mode":0,"inputs":[{"name":"in","type":0,"link":1}],"outputs":[{"name":"out","links":[2]}],"properties":{"output_padding":"","in_channels":"","out_channels":"","groups":1,"transposed":false,"padding":[0],"dilation":[1],"stride":[1],"bias":true}},{"id":4,"type":"pytorch/BatchNorm1d","pos":[165,147.5],"size":{"0":140,"1":19},"flags":{},"mode":0,"inputs":[{"name":"in","type":0,"link":2}],"outputs":[{"name":"out","links":[3]}],"properties":{}},{"id":5,"type":"pytorch/ReLU","pos":[165,216.5],"size":{"0":140,"1":19},"flags":{},"mode":0,"inputs":[{"name":"in","type":0,"link":3}],"outputs":[{"name":"out","links":[4,5]}],"properties":{"inplace":false,"threshold":0,"value":0}},{"id":7,"type":"pytorch/Conv1d","pos":[70,285.5],"size":{"0":140,"1":19},"flags":{},"mode":0,"inputs":[{"name":"in","type":0,"link":4}],"outputs":[{"name":"out","links":[7]}],"properties":{"output_padding":"","in_channels":"","out_channels":"","groups":1,"transposed":false,"padding":[0],"dilation":[1],"stride":[1],"bias":true}},{"id":6,"type":"pytorch/Conv1d","pos":[260,285.5],"size":{"0":140,"1":19},"flags":{},"mode":0,"inputs":[{"name":"in","type":0,"link":5}],"outputs":[{"name":"out","links":[6]}],"properties":{"output_padding":"","in_channels":"","out_channels":"","groups":1,"transposed":false,"padding":[0],"dilation":[1],"stride":[1],"bias":true}},{"id":9,"type":"pytorch/BatchNorm1d","pos":[70,354.5],"size":{"0":140,"1":19},"flags":{},"mode":0,"inputs":[{"name":"in","type":0,"link":7}],"outputs":[{"name":"out","links":[9]}],"properties":{}},{"id":8,"type":"pytorch/BatchNorm1d","pos":[260,354.5],"size":{"0":140,"1":19},"flags":{},"mode":0,"inputs":[{"name":"in","type":0,"link":6}],"outputs":[{"name":"out","links":[8]}],"properties":{}},{"id":11,"type":"pytorch/ReLU","pos":[70,423.5],"size":{"0":140,"1":19},"flags":{},"mode":0,"inputs":[{"name":"in","type":0,"link":9}],"outputs":[{"name":"out","links":[11]}],"properties":{"inplace":false,"threshold":0,"value":0}},{"id":10,"type":"pytorch/ReLU","pos":[260,423.5],"size":{"0":140,"1":19},"flags":{},"mode":0,"inputs":[{"name":"in","type":0,"link":8}],"outputs":[{"name":"out","links":[10]}],"properties":{"inplace":false,"threshold":0,"value":0}},{"id":12,"type":"graph/GlobalOutput","pos":[70,492.5],"size":{"0":140,"1":19},"flags":{},"mode":0,"inputs":[{"name":"output_491","type":0,"link":11}],"properties":{"name":"output_698","type":0}},{"id":13,"type":"graph/GlobalOutput","pos":[260,492.5],"size":{"0":140,"1":19},"flags":{},"mode":0,"inputs":[{"name":"output_593","type":0,"link":10}],"properties":{"name":"output_167","type":0}}],"links":[[1,2,0,3,0,0],[2,3,0,4,0,0],[3,4,0,5,0,0],[4,5,0,7,0,0],[5,5,0,6,0,0],[6,6,0,8,0,0],[7,7,0,9,0,0],[8,8,0,10,0,0],[9,9,0,11,0,0],[10,10,0,13,0,0],[11,11,0,12,0,0]],"groups":[],"config":{}}

          _this.graph.configure(data);
        }
      });
      mainmenu.add("run", {
        callback: function() {
          _this.runGraph();
        }
      });

      mainmenu.add("stop", {
        callback: function() {
          _this.stopGraph();
        }
      });

      mainmenu.add("format", {
        callback: function() {
          
          var data = _this.graph.serialize()

          var nodes = data['nodes'];
          const edges = data['links'];

          data['nodes'] == []

      
          const g = new dagre.graphlib.Graph();
          g.setGraph({});
          g.setDefaultEdgeLabel(function() {
            return {};
          });


          nodes.forEach(node => {
            node['width'] = node.size[0]
            node['height'] = node.size[1]
            g.setNode(node.id, node);
          });

          // Add edges to the graph.
          edges.forEach(edge => {
            g.setEdge(edge[1], edge[3]);
          });

          dagre.layout(g);

          nodes = []
          g.nodes().forEach(function(v) {
            var node = g.node(v);
            node["pos"] = [node.x, node.y];
            nodes.push(node)
          });
          data.nodes = nodes
      
          _this.graph.configure(data);
          _this.graphcanvas.setZoom(1.5,[0,0])
          
        }
      });

      mainmenu.add("check", {
        callback: function() {
          _this.checkGraph();
        }
      });
       mainmenu.add("gencode", {
        callback: function() {
          _this.genCode();
        }
      });
    },
    genCode(){
      var res = TemplateRender(this.graph.serialize(true));
      console.log(res)
      this.code = res
    },
    checkGraph() {
      console.log('graph',this.graph);
      
    },
    runGraph() {
      console.log("runGrap");
      this.graph.start();
    },
    stopGraph() {
      console.log("stopGrap");
      this.graph.stop();
    },
    saveGraph() {
      console.log("saveGraph");
      console.log(JSON.stringify(this.graph.serialize(true)));
    },

    onNodeDblClickedCallBack(n) {
      console.log("onSelected", n);
      this.createWidgetsDialog(n);
    },
    createSidePanel() {
      this.mainarea.split("horizontal", [null, 240], true);

      var docked = new LiteGUI.Panel("right_panel", {
        title: "Inspector",
        close: true
      });

      this.mainarea.getSection(1).add(docked);

      //docked.dockTo( mainarea.getSection(1).content,"full");
      //docked.show();
      LiteGUI.bind(docked, "closed", function() {
        this.mainarea.merge();
      });
      this.sidepanel = docked;

      this.updateSidePanel(docked);
    },
    updateSidePanel(root) {
      root = root || this.sidepanel;
      root.content.innerHTML = "";

      //tabs
      var tabs_widget = new LiteGUI.Tabs();
      tabs_widget.addTab("Info");
      tabs_widget.addTab("Tree", {
        selected: true,
        width: "100%",
        height: 200
      });
      tabs_widget.addTab("Extra");

      tabs_widget
        .getTabContent("Info")
        .appendChild(
          LiteGUI.createElement(
            "strong",
            null,
            "Example of code inside tab container"
          )
        );

      //tree
      var mytree = {
        id: "Rootnode",
        children: [
          { id: "Child1" },
          {
            id: "Child2",
            children: [
              { id: "SubChild1" },
              { id: "SubChild2" },
              { id: "SubChild3" },
              { id: "SubChild4" }
            ]
          },
          { id: "Child3" }
        ]
      };

      var litetree = new LiteGUI.Tree(mytree, { allow_rename: true });
      LiteGUI.bind(litetree.root, "item_selected", function(e) {
        console.log("Node selected: ", e.detail);
      });
      var tree_tab_content = tabs_widget.getTabContent("Tree");
      tree_tab_content.appendChild(litetree.root);

      litetree.insertItem({ id: "FOO" }, "Child2", 2);
      //litetree.removeItem( "SubChild1" );
      //litetree.moveItem( "FOO", "Child3" );
      litetree.insertItem({ id: "MAX" }, "Child1");
      root.add(tabs_widget);

      //side panel widget
      var widgets = new LiteGUI.Inspector();
      widgets.onchange = function(name, value, widget) {
        console.log("Widget change: " + name + " -> " + value);
      };
      root.content.appendChild(widgets.root);

      // widgets.addSeparator();

      widgets.addSection("NOTE");
      widgets.addString("Type", "Layer");
      widgets.addStringButton("OptName", "layer1", {
        callback_button: function(v) {
          console.log("Button: " + v);
        }
      });
      widgets.addTextarea(
        null,
        "Applies a 1D convolution over an input signal composed of several input planes.",
        { height: 100 }
      );

      widgets.addSection("Parameters");
      widgets.addVector2("vector2", [10, 20], { min: 0 });
      widgets.addVector3("vector3", [10, 20, 30], { min: 0 });
      widgets.addVector4("vector4", [0.1, 0.2, 0.3, 0.4], { min: 0 });
      widgets.addCheckbox("checkbox", true, {
        callback: function(value) {
          console.log("Checkbox pressed: " + value);
        }
      });
      widgets.addButton("Serialize", "Save", {
        callback: function(name) {
          console.log("Button pressed: " + name);
        }
      });
      widgets.addButtons("Serialize", ["Save", "Load", "New"], {
        callback: function(name) {
          console.log("Button pressed: " + name);
        }
      });
      widgets.addButton(null, "Save");
      widgets.addSeparator();
      // widgets.addColor("Color",[0,1,0]);
      // widgets.addPad("Pad",[0.5,0.5], function(v){ console.log(v); });
      // widgets.addFile("File","test.png");
      // widgets.addLine("Line",[[0.5,1],[0.75,0.25]],{defaulty:0,width:120});

      //mainarea.resize();
    },
    createWidgetsDialog(n) {
      //test floating panel
      const _this = this;
      var name = n.title + " Config";
      var DialogId = name + n.id;
      var dialog = new LiteGUI.Dialog({
        id: DialogId,
        title: name,
        close: true,
        minimize: true,
        width: 300,
        scroll: true,
        resizable: true,
        draggable: true,
        detachable: true
      });
      dialog.show("fade");

      var widgets = new LiteGUI.Inspector();

      widgets.addInfo("OptType", n.data.category);
      widgets.addInfo("Package", n.data.package);

      var attributes = n.data.attributes;
      var i = 0;
      for (i in attributes) {
        var attr = attributes[i];
        var def_val = 0;

        var val = "";
        if (this.nodecfg[n.id]) {
          val = this.nodecfg[n.id][attr.name];
        } else {
          if (attr.default) {
            const def_val = attr.default;
            // if(def_val.constructor = Array){
            //   // widgets.str(attr.name,def_val, {min:0});
            //   // widgets.addNumber(attr.name,def_val[0], {min:0});
            // }
            val = def_val;
            // continue
          }
        }

        widgets.addString(attr.name, val);

        // widgets.addSeparator();
      }

      widgets.addButton(null, "Save", {
        callback: function() {
          console.log(widgets.values);
          // _this.updateSidePanel();
          _this.nodecfg[n.id] = widgets.values;
          // console.log(_this.nodecfg[n.id]);
          // name, default_value, type, extra_info
          n.addPropertyByJson(widgets.values)
        }
      });

      dialog.add(widgets);
      return dialog;
    },
    createTableDialog() {
      var dialog = new LiteGUI.Dialog({
        title: "Table dialog",
        close: true,
        minimize: true,
        width: 300,
        scroll: true,
        resizable: true,
        draggable: true
      });
      dialog.show();
      dialog.setPosition(200, 200);
      dialog.addButton("Randomize", inner);

      var table = new LiteGUI.Table({ scrollable: true });
      dialog.add(table);

      table.setColumns(["Name", { name: "Age", width: 50 }, "Address"]);

      var data = [];

      for (var i = 0; i < 10; ++i)
        data.push({
          name: randomName(),
          age: 30,
          address: "none"
        });

      inner();

      function randomName() {
        var names = [
          "Phil",
          "Smith",
          "Gregory",
          "Martin",
          "James",
          "Coleman",
          "Jerry",
          "Helen",
          "Mary"
        ];
        var name = [];
        name.push(names[Math.floor(Math.random() * names.length)]);
        name.push(names[Math.floor(Math.random() * names.length)]);
        return name.join(" ");
      }

      function inner() {
        for (var i in data) data[i].age = (Math.random() * 100) | 0;

        table.setRows(data, true);
      }
    }
  }
};
</script>