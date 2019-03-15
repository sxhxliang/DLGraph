var mainarea = null;
var graphcanvas = null

var getPixelRatio = function (context) {
	var backingStore = context.backingStorePixelRatio ||
			context.webkitBackingStorePixelRatio ||
			context.mozBackingStorePixelRatio ||
			context.msBackingStorePixelRatio ||
			context.oBackingStorePixelRatio ||
			context.backingStorePixelRatio || 1;
	return (window.devicePixelRatio || 1) / backingStore;
};


const onNodeDblClickedCallBack = function(n) { 
	console.log('onSelected',n)
	// console.log(n.title)
	// console.log(n.title)
	// console.log(n.title)
	// console.log(n.title)
	createWidgetsDialog(n)

}

function initGraph(){
	var graph = new LGraph();

	graphcanvas = new LGraphCanvas("#graphcanvas", graph, {ratio:2, collapsed_show_title:false});
	graphcanvas.onNodeDblClicked = onNodeDblClickedCallBack

	var node_const = LiteGraph.createNode("pytorch/Conv1d");
	
	
	node_const.pos = [200,200];
	graph.add(node_const);

	var node_watch = LiteGraph.createNode("pytorch/Conv1d");
	node_watch.pos = [500,200];
	graph.add(node_watch);

	node_const.connect(0, node_watch, 0 );

	graph.start()
}

window.onload = function(){

	LiteGUI.init(); 

	var mainmenu = new LiteGUI.Menubar("mainmenubar");
	LiteGUI.add( mainmenu );

	mainarea = new LiteGUI.Area({ id: "mainarea", height: "calc( 100% - 20px )", main:true, inmediateResize: true});
	LiteGUI.add( mainarea );
 
	//create main canvas to test redraw
	var canvas = document.createElement("canvas");
	// const canvas = createHiDPICanvas(100, 100, 2);
	// canvas.width = canvas.height = 100;
	canvas.id='graphcanvas'
	canvas.times = 0;

	canvas.redraw = function() {
		var rect = canvas.parentNode.getClientRects()[0];

		canvas.style.width = rect.width+ 'px';
		canvas.style.height = rect.height+ 'px';
		graphcanvas.resize(rect.width*2,rect.height*2)
	}

	mainarea.onresize = function() { canvas.redraw(); };
	mainarea.content.appendChild(canvas);
	
	// var search = document.createElement("div");
	// var dialog = document.createElement("div");
	// dialog.className = "litegraph litesearchbox graphdialog rounded";
	// dialog.innerHTML = "<span class='name'>Search</span> <input autofocus type='text' class='value rounded'/><div class='helper'></div>";
	// // console.log(dialog.className)
	// mainarea.content.appendChild(dialog);

	initGraph()
	//split mainarea
	createSidePanel();

	mainarea.getSection(0).split("vertical",[null,"100px"],true);
	mainarea.getSection(0).onresize = function() {
		canvas.redraw();
	};

	var docked_bottom = new LiteGUI.Panel({ id: "bottom_panel", title:"Docked panel",hide:true});
	mainarea.getSection(0).getSection(1).add( docked_bottom );
	LiteGUI.bind( docked_bottom,"closed",function() { LiteGUI.mainarea.getSection(0).merge() });
	//mainarea.resize();

	// var dialog = createWidgetsDialog();
	// var dialog2 = createTableDialog();

	mainmenu.add("file/new");
	mainmenu.add("file/open");
	mainmenu.add("file/save");
	mainmenu.add("edit/undo");
	mainmenu.add("edit/redo");
	mainmenu.add("edit/");
	mainmenu.add("edit/copy", { callback: function(){ console.log("COPY"); } });
	mainmenu.add("edit/paste");
	mainmenu.add("edit/clear");
		
	mainmenu.add("view/bottom panel", { callback: function() { docked_bottom.show(); } });
	mainmenu.add("view/fixed size", { callback: function() { LiteGUI.setWindowSize(1000,600); } });
	mainmenu.add("view/");
	mainmenu.add("view/side panel", { callback: function() { createSidePanel(); } });
	mainmenu.add("view/maximize", { callback: function() { LiteGUI.setWindowSize(); } });

	mainmenu.add("debug/dialog", { callback: function() { 
		createDialog();
	}});

	mainmenu.add("debug/message", { callback: function() { 
		LiteGUI.showMessage("This is an example of message");
	}});

	mainmenu.add("debug/modal", { callback: function() { 
		var dialog = new LiteGUI.Panel("blarg",{width:300,height:100,close:true, content:"This is an example of modal dialog"}); 
		dialog.makeModal();
		dialog.addButton("Accept",{ close: true });
		dialog.addButton("Cancel",{ close: 'fade' });
	}});

	canvas.redraw();
};

function createSidePanel()
{
	mainarea.split("horizontal",[null,240],true);

	var docked = new LiteGUI.Panel("right_panel", {title:'Inspector', close: true});

	mainarea.getSection(1).add( docked );

	//docked.dockTo( mainarea.getSection(1).content,"full");
	//docked.show();
	LiteGUI.bind( docked, "closed", function() { mainarea.merge(); });

	window.sidepanel = docked;

	updateSidePanel( docked );
}

function updateSidePanel( root )
{
	root = root || window.sidepanel;
	root.content.innerHTML = "";

	//tabs 
	var tabs_widget = new LiteGUI.Tabs();
	tabs_widget.addTab("Info");
	tabs_widget.addTab("Tree", {selected:true, width: "100%", height: 200});
	tabs_widget.addTab("Extra");

	tabs_widget.getTabContent("Info").appendChild( LiteGUI.createElement( "strong",null,"Example of code inside tab container") );

	//tree
	var mytree = { id: "Rootnode", 
			children: [
				{ id: "Child1" },
				{ id: "Child2", children: [
					{ id: "SubChild1" },
					{ id: "SubChild2" },
					{ id: "SubChild3" },
					{ id: "SubChild4" }
				]},
				{ id: "Child3" },
			]};

	var litetree = new LiteGUI.Tree( mytree, { allow_rename: true });
	LiteGUI.bind( litetree.root, "item_selected", function(e) {
		console.log("Node selected: ", e.detail); 
	});
	var tree_tab_content = tabs_widget.getTabContent("Tree");
	tree_tab_content.appendChild( litetree.root )

	litetree.insertItem( {id:"FOO"}, "Child2",2 );
	//litetree.removeItem( "SubChild1" );
	//litetree.moveItem( "FOO", "Child3" );
	litetree.insertItem( {id:"MAX"}, "Child1" );
	root.add( tabs_widget );

	//side panel widget
	var widgets = new LiteGUI.Inspector();
	widgets.onchange = function(name,value,widget) {
		console.log("Widget change: " + name + " -> " + value );
	};
	root.content.appendChild(widgets.root);

	// widgets.addSeparator();


	widgets.addSection("NOTE");
	widgets.addString("Type","Layer");
	widgets.addStringButton("OptName","layer1", { callback_button: function(v) { console.log("Button: " + v); } });
	widgets.addTextarea(null,"Applies a 1D convolution over an input signal composed of several input planes.", {height: 100});



	widgets.addSection("Parameters");
	widgets.addVector2("vector2",[10,20], {min:0});
	widgets.addVector3("vector3",[10,20,30], {min:0});
	widgets.addVector4("vector4",[0.1,0.2,0.3,0.4], {min:0});
	widgets.addCheckbox("checkbox",true,{callback: function(value) { console.log("Checkbox pressed: " + value); } });
	widgets.addButton("Serialize","Save",{callback: function(name) { console.log("Button pressed: " + name); } });
	widgets.addButtons("Serialize",["Save","Load","New"],{callback: function(name) { console.log("Button pressed: " + name); } });
	widgets.addButton(null,"Save");
	widgets.addSeparator();
	// widgets.addColor("Color",[0,1,0]);
	// widgets.addPad("Pad",[0.5,0.5], function(v){ console.log(v); });
	// widgets.addFile("File","test.png");
	// widgets.addLine("Line",[[0.5,1],[0.75,0.25]],{defaulty:0,width:120}); 

	//mainarea.resize();
}

function createWidgetsDialog(n)
{
	//test floating panel
	var name = n.title + " Config";
	var DialogId = name + n.id
	var dialog = new LiteGUI.Dialog({ id: DialogId, title:name, close: true, minimize: true, width: 300, scroll: true, resizable:true, draggable: true, detachable: true });
	dialog.show('fade');

	var widgets = new LiteGUI.Inspector();

	widgets.addInfo('OptType',n.data.category);
	widgets.addInfo('Package',n.data.package);

	var attributes = n.data.attributes

	for(i in attributes){
		var attr = attributes[i]
		var def_val = 0
		if(attr.default){
			const def_val= attr.default
			if(def_val.constructor = Array){
				// widgets.str(attr.name,def_val, {min:0});
				widgets.addNumber(attr.name,def_val[0], {min:0});
			} 

		}else{
			widgets.addNumber(attr.name,0, {min:0});
		}
		
		// widgets.addSeparator();
	

	}
	
	
	// widgets.addTextarea("textarea","a really long silly text");
	widgets.addButton(null,"Save", { callback: function() { updateSidePanel(); } });

	dialog.add(widgets);

	return dialog;
}

function createTableDialog()
{
	var dialog = new LiteGUI.Dialog( { title:"Table dialog", close: true, minimize: true, width: 300, scroll: true, resizable:true, draggable: true} );
	dialog.show();
	dialog.setPosition( 200,200 );
	dialog.addButton("Randomize", inner );

	var table = new LiteGUI.Table({scrollable:true});
	dialog.add( table );

	table.setColumns(["Name",{ name: "Age", width: 50 },"Address"]);

	var data = [];

	for(var i = 0; i < 10; ++i)
		data.push({
				name: randomName(),
				age: 30,
				address: "none"
			});

	inner();

	function randomName(){
		var names = ["Phil","Smith","Gregory","Martin","James","Coleman","Jerry","Helen","Mary"];
		var name = [];
		name.push( names[Math.floor(Math.random()*names.length)] );
		name.push( names[Math.floor(Math.random()*names.length)] );
		return name.join(" ");
	}

	function inner()
	{
		for(var i in data)
			data[i].age = (Math.random() * 100)|0;

		table.setRows( data, true );
	}
}