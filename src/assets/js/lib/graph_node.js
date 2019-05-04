

import {GraphBase } from './graph_base'
import {LLink} from './graph_link'

// *************************************************************
//   Node CLASS                                          *******
// *************************************************************

/*
	title: string
	pos: [x,y]
	size: [x,y]

	input|output: every connection
		+  { name:string, type:string, pos: [x,y]=Optional, direction: "input"|"output", links: Array });

	general properties:
		+ clip_area: if you render outside the node, it will be cliped
		+ unsafe_execution: not allowed for safe execution
		+ skip_repeated_outputs: when adding new outputs, it wont show if there is one already connected
		+ resizable: if set to false it wont be resizable with the mouse
		+ horizontal: slots are distributed horizontally
		+ widgets_up: widgets start from the top of the node
	
	flags object:
		+ collapsed: if it is collapsed

	supported callbacks:
		+ onAdded: when added to graph
		+ onRemoved: when removed from graph
		+ onStart:	when the graph starts playing
		+ onStop:	when the graph stops playing
		+ onDrawForeground: render the inside widgets inside the node
		+ onDrawBackground: render the background area inside the node (only in edit mode)
		+ onMouseDown
		+ onMouseMove
		+ onMouseUp
		+ onMouseEnter
		+ onMouseLeave
		+ onExecute: execute the node
		+ onPropertyChanged: when a property is changed in the panel (return true to skip default behaviour)
		+ onGetInputs: returns an array of possible inputs
		+ onGetOutputs: returns an array of possible outputs
		+ onBounding: in case this node has a bigger bounding than the node itself (the callback receives the bounding as [x,y,w,h])
		+ onDblClick: double clicked in the node
		+ onInputDblClick: input slot double clicked (can be used to automatically create a node connected)
		+ onOutputDblClick: output slot double clicked (can be used to automatically create a node connected)
		+ onSerialize: to add extra info when serializing (the callback receives the object that should be filled with the data)
		+ onSelected
		+ onDeselected
		+ onDropItem : DOM item dropped over the node
		+ onDropFile : file dropped over the node
		+ onConnectInput : if returns false the incoming connection will be canceled
		+ onConnectionsChange : a connection changed (new one or removed) (GraphBase.INPUT or GraphBase.OUTPUT, slot, true if connected, link_info, input_info )
*/

/**
* Base Class for all the node type classes
* @class LGraphNode
* @param {String} name a name for the node
*/

function LGraphNode(title)
{
	this._ctor(title);
}

LGraphNode.prototype._ctor = function( title )
{
	this.title = title || "Unnamed";
	this.size = [GraphBase.NODE_WIDTH,60];
	this.graph = null;

	this._pos = new Float32Array(10,10);

	Object.defineProperty( this, "pos", {
		set: function(v)
		{
			if(!v || v.length < 2)
				return;
			this._pos[0] = v[0];
			this._pos[1] = v[1];
		},
		get: function()
		{
			return this._pos;
		},
		enumerable: true
	});

	this.id = -1; //not know till not added
	this.type = null;

	//inputs available: array of inputs
	this.inputs = [];
	this.outputs = [];
	this.connections = [];

	//local data
	this.properties = {}; //for the values
	this.properties_info = []; //for the info

	this.flags = {};
}

/**
* configure a node from an object containing the serialized info
* @method configure
*/
LGraphNode.prototype.configure = function(info)
{
	if(this.graph)
		this.graph._version++;

	for (var j in info)
	{
		if(j == "properties")
		{
			//i dont want to clone properties, I want to reuse the old container
			for(var k in info.properties)
			{
				this.properties[k] = info.properties[k];
				if(this.onPropertyChanged)
					this.onPropertyChanged(k,info.properties[k]);
			}
			continue;
		}

		if(info[j] == null)
			continue;

		else if (typeof(info[j]) == 'object') //object
		{
			if(this[j] && this[j].configure)
				this[j].configure( info[j] );
			else
				this[j] = GraphBase.cloneObject(info[j], this[j]);
		}
		else //value
			this[j] = info[j];
	}

	if(!info.title)
		this.title = this.constructor.title;

	if(this.onConnectionsChange)
	{
		if(this.inputs)
		for(var i = 0; i < this.inputs.length; ++i)
		{
			var input = this.inputs[i];
			var link_info = this.graph ? this.graph.links[ input.link ] : null;
			this.onConnectionsChange( GraphBase.INPUT, i, true, link_info, input ); //link_info has been created now, so its updated
		}

		if(this.outputs)
		for(var i = 0; i < this.outputs.length; ++i)
		{
			var output = this.outputs[i];
			if(!output.links)
				continue;
			for(var j = 0; j < output.links.length; ++j)
			{
				var link_info = this.graph ? this.graph.links[ output.links[j] ] : null;
				this.onConnectionsChange( GraphBase.OUTPUT, i, true, link_info, output ); //link_info has been created now, so its updated
			}
		}
	}

	if( this.onConfigure )
		this.onConfigure( info );
}

/**
* serialize the content
* @method serialize
*/

LGraphNode.prototype.serialize = function()
{
	//create serialization object
	var o = {
		id: this.id,
		type: this.type,
		pos: this.pos,
		size: this.size,
		flags: GraphBase.cloneObject(this.flags),
		mode: this.mode
	};

	//special case for when there were errors
	if( this.constructor === LGraphNode && this.last_serialization )
		return this.last_serialization;

	if( this.inputs )
		o.inputs = this.inputs;

	if( this.outputs )
	{
		//clear outputs last data (because data in connections is never serialized but stored inside the outputs info)
		for(var i = 0; i < this.outputs.length; i++)
			delete this.outputs[i]._data;
		o.outputs = this.outputs;
	}

	if( this.title && this.title != this.constructor.title )
		o.title = this.title;

	if( this.properties )
		o.properties = GraphBase.cloneObject( this.properties );

	if( !o.type )
		o.type = this.constructor.type;

	if( this.color )
		o.color = this.color;
	if( this.bgcolor )
		o.bgcolor = this.bgcolor;
	if( this.boxcolor )
		o.boxcolor = this.boxcolor;
	if( this.shape )
		o.shape = this.shape;

	if(this.onSerialize)
	{
		if( this.onSerialize(o) )
			console.warn("node onSerialize shouldnt return anything, data should be stored in the object pass in the first parameter");
	}

	return o;
}


/* Creates a clone of this node */
LGraphNode.prototype.clone = function()
{
	var node = GraphBase.createNode(this.type);
	if(!node)
		return null;

	//we clone it because serialize returns shared containers
	var data = GraphBase.cloneObject( this.serialize() );

	//remove links
	if(data.inputs)
		for(var i = 0; i < data.inputs.length; ++i)
			data.inputs[i].link = null;

	if(data.outputs)
		for(var i = 0; i < data.outputs.length; ++i)
		{
			if(data.outputs[i].links)
				data.outputs[i].links.length = 0;
		}

	delete data["id"];
	//remove links
	node.configure(data);

	return node;
}


/**
* serialize and stringify
* @method toString
*/

LGraphNode.prototype.toString = function()
{
	return JSON.stringify( this.serialize() );
}
//LGraphNode.prototype.unserialize = function(info) {} //this cannot be done from within, must be done in GraphBase


/**
* get the title string
* @method getTitle
*/

LGraphNode.prototype.getTitle = function()
{
	return this.title || this.constructor.title;
}



// Execution *************************
/**
* sets the output data
* @method setOutputData
* @param {number} slot
* @param {*} data
*/
LGraphNode.prototype.setOutputData = function(slot, data)
{
	if(!this.outputs)
		return;

	//this maybe slow and a niche case
	//if(slot && slot.constructor === String)
	//	slot = this.findOutputSlot(slot);

	if(slot == -1 || slot >= this.outputs.length)
		return;

	var output_info = this.outputs[slot];
	if(!output_info)
		return;

	//store data in the output itself in case we want to debug
	output_info._data = data;

	//if there are connections, pass the data to the connections
	if( this.outputs[slot].links )
	{
		for(var i = 0; i < this.outputs[slot].links.length; i++)
		{
			var link_id = this.outputs[slot].links[i];
			this.graph.links[ link_id ].data = data;
		}
	}
}

/**
* Retrieves the input data (data traveling through the connection) from one slot
* @method getInputData
* @param {number} slot
* @param {boolean} force_update if set to true it will force the connected node of this slot to output data into this link
* @return {*} data or if it is not connected returns undefined
*/
LGraphNode.prototype.getInputData = function( slot, force_update )
{
	if(!this.inputs)
		return; //undefined;

	if(slot >= this.inputs.length || this.inputs[slot].link == null)
		return;

	var link_id = this.inputs[slot].link;
	var link = this.graph.links[ link_id ];
	if(!link) //bug: weird case but it happens sometimes
		return null;

	if(!force_update)
		return link.data;

	//special case: used to extract data from the incomming connection before the graph has been executed
	var node = this.graph.getNodeById( link.origin_id );
	if(!node)
		return link.data;

	if(node.updateOutputData)
		node.updateOutputData( link.origin_slot );
	else if(node.onExecute)
		node.onExecute();

	return link.data;
}

/**
* Retrieves the input data from one slot using its name instead of slot number
* @method getInputDataByName
* @param {String} slot_name
* @param {boolean} force_update if set to true it will force the connected node of this slot to output data into this link
* @return {*} data or if it is not connected returns null
*/
LGraphNode.prototype.getInputDataByName = function( slot_name, force_update )
{
	var slot = this.findInputSlot( slot_name );
	if( slot == -1 )
		return null;
	return this.getInputData( slot, force_update );
}


/**
* tells you if there is a connection in one input slot
* @method isInputConnected
* @param {number} slot
* @return {boolean}
*/
LGraphNode.prototype.isInputConnected = function(slot)
{
	if(!this.inputs)
		return false;
	return (slot < this.inputs.length && this.inputs[slot].link != null);
}

/**
* tells you info about an input connection (which node, type, etc)
* @method getInputInfo
* @param {number} slot
* @return {Object} object or null { link: id, name: string, type: string or 0 }
*/
LGraphNode.prototype.getInputInfo = function(slot)
{
	if(!this.inputs)
		return null;
	if(slot < this.inputs.length)
		return this.inputs[slot];
	return null;
}

/**
* returns the node connected in the input slot
* @method getInputNode
* @param {number} slot
* @return {LGraphNode} node or null
*/
LGraphNode.prototype.getInputNode = function( slot )
{
	if(!this.inputs)
		return null;
	if(slot >= this.inputs.length)
		return null;
	var input = this.inputs[slot];
	if(!input || input.link === null)
		return null;
	var link_info = this.graph.links[ input.link ];
	if(!link_info)
		return null;
	return this.graph.getNodeById( link_info.origin_id );
}


/**
* returns the value of an input with this name, otherwise checks if there is a property with that name
* @method getInputOrProperty
* @param {string} name
* @return {*} value
*/
LGraphNode.prototype.getInputOrProperty = function( name )
{
	if(!this.inputs || !this.inputs.length)
		return this.properties ? this.properties[name] : null;

	for(var i = 0, l = this.inputs.length; i < l; ++i)
	{
		var input_info = this.inputs[i];
		if(name == input_info.name && input_info.link != null)
		{
			var link = this.graph.links[ input_info.link ];
			if(link)
				return link.data;
		}
	}
	return this.properties[ name ];
}




/**
* tells you the last output data that went in that slot
* @method getOutputData
* @param {number} slot
* @return {Object}  object or null
*/
LGraphNode.prototype.getOutputData = function(slot)
{
	if(!this.outputs)
		return null;
	if(slot >= this.outputs.length)
		return null;

	var info = this.outputs[slot];
	return info._data;
}


/**
* tells you info about an output connection (which node, type, etc)
* @method getOutputInfo
* @param {number} slot
* @return {Object}  object or null { name: string, type: string, links: [ ids of links in number ] }
*/
LGraphNode.prototype.getOutputInfo = function(slot)
{
	if(!this.outputs)
		return null;
	if(slot < this.outputs.length)
		return this.outputs[slot];
	return null;
}


/**
* tells you if there is a connection in one output slot
* @method isOutputConnected
* @param {number} slot
* @return {boolean}
*/
LGraphNode.prototype.isOutputConnected = function(slot)
{
	if(!this.outputs)
		return false;
	return (slot < this.outputs.length && this.outputs[slot].links && this.outputs[slot].links.length);
}

/**
* tells you if there is any connection in the output slots
* @method isAnyOutputConnected
* @return {boolean}
*/
LGraphNode.prototype.isAnyOutputConnected = function()
{
	if(!this.outputs)
		return false;
	for(var i = 0; i < this.outputs.length; ++i)
		if( this.outputs[i].links && this.outputs[i].links.length )
			return true;
	return false;
}


/**
* retrieves all the nodes connected to this output slot
* @method getOutputNodes
* @param {number} slot
* @return {array}
*/
LGraphNode.prototype.getOutputNodes = function(slot)
{
	if(!this.outputs || this.outputs.length == 0)
		return null;

	if(slot >= this.outputs.length)
		return null;

	var output = this.outputs[slot];
	if(!output.links || output.links.length == 0)
		return null;

	var r = [];
	for(var i = 0; i < output.links.length; i++)
	{
		var link_id = output.links[i];
		var link = this.graph.links[ link_id ];
		if(link)
		{
			var target_node = this.graph.getNodeById( link.target_id );
			if( target_node )
				r.push( target_node );
		}
	}
	return r;
}

/**
* Triggers an event in this node, this will trigger any output with the same name
* @method trigger
* @param {String} event name ( "on_play", ... ) if action is equivalent to false then the event is send to all
* @param {*} param
*/
LGraphNode.prototype.trigger = function( action, param )
{
	if( !this.outputs || !this.outputs.length )
		return;

	if(this.graph)
		this.graph._last_trigger_time = GraphBase.getTime();

	for(var i = 0; i < this.outputs.length; ++i)
	{
		var output = this.outputs[ i ];
		if(!output || output.type !== GraphBase.EVENT || (action && output.name != action) )
			continue;
		this.triggerSlot( i, param );
	}
}

/**
* Triggers an slot event in this node
* @method triggerSlot
* @param {Number} slot the index of the output slot
* @param {*} param
* @param {Number} link_id [optional] in case you want to trigger and specific output link in a slot
*/
LGraphNode.prototype.triggerSlot = function( slot, param, link_id )
{
	if( !this.outputs )
		return;

	var output = this.outputs[ slot ];
	if( !output )
		return;

	var links = output.links;
	if(!links || !links.length)
		return;

	if(this.graph)
		this.graph._last_trigger_time = GraphBase.getTime();

	//for every link attached here
	for(var k = 0; k < links.length; ++k)
	{
		var id = links[k];
		if( link_id != null && link_id != id ) //to skip links
			continue;
		var link_info = this.graph.links[ links[k] ];
		if(!link_info) //not connected
			continue;
		link_info._last_time = GraphBase.getTime();
		var node = this.graph.getNodeById( link_info.target_id );
		if(!node) //node not found?
			continue;

		//used to mark events in graph
		var target_connection = node.inputs[ link_info.target_slot ];

		if(node.onAction)
			node.onAction( target_connection.name, param );
		else if(node.mode === GraphBase.ON_TRIGGER)
		{
			if(node.onExecute)
				node.onExecute(param);
		}
	}
}

/**
* clears the trigger slot animation
* @method clearTriggeredSlot
* @param {Number} slot the index of the output slot
* @param {Number} link_id [optional] in case you want to trigger and specific output link in a slot
*/
LGraphNode.prototype.clearTriggeredSlot = function( slot, link_id )
{
	if( !this.outputs )
		return;

	var output = this.outputs[ slot ];
	if( !output )
		return;

	var links = output.links;
	if(!links || !links.length)
		return;

	//for every link attached here
	for(var k = 0; k < links.length; ++k)
	{
		var id = links[k];
		if( link_id != null && link_id != id ) //to skip links
			continue;
		var link_info = this.graph.links[ links[k] ];
		if(!link_info) //not connected
			continue;
		link_info._last_time = 0;
	}
}

/**
* add a new property to this node
* @method addProperty
* @param {string} name
* @param {*} default_value
* @param {string} type string defining the output type ("vec3","number",...)
* @param {Object} extra_info this can be used to have special properties of the property (like values, etc)
*/
LGraphNode.prototype.addProperty = function( name, default_value, type, extra_info )
{
	var o = { name: name, type: type, default_value: default_value };
	if(extra_info)
		for(var i in extra_info)
			o[i] = extra_info[i];
	if(!this.properties_info)
		this.properties_info = [];
	this.properties_info.push(o);
	if(!this.properties)
		this.properties = {};
	this.properties[ name ] = default_value;
	return o;
}

/**
* add many new propertys to this node
* @method addPropertyByJson
* @param {string} name
* @param {*} default_value
* @param {string} type string defining the output type ("vec3","number",...)
* @param {Object} extra_info this can be used to have special properties of the property (like values, etc)
*/
LGraphNode.prototype.addPropertyByJson = function(extra_info)
{
	if(!this.properties)
		this.properties = {};
	if(extra_info)
		for(var i in extra_info)
			if(i == 'null') continue;
			this.properties[ i ] = extra_info[i]

	return this.properties;
}


//connections

/**
* add a new output slot to use in this node
* @method addOutput
* @param {string} name
* @param {string} type string defining the output type ("vec3","number",...)
* @param {Object} extra_info this can be used to have special properties of an output (label, special color, position, etc)
*/
LGraphNode.prototype.addOutput = function(name,type,extra_info)
{
	var o = { name: name, type: type, links: null };
	if(extra_info)
		for(var i in extra_info)
			o[i] = extra_info[i];

	if(!this.outputs)
		this.outputs = [];
	this.outputs.push(o);
	if(this.onOutputAdded)
		this.onOutputAdded(o);
	this.size = this.computeSize();
	this.setDirtyCanvas(true,true);
	return o;
}

/**
* add a new output slot to use in this node
* @method addOutputs
* @param {Array} array of triplets like [[name,type,extra_info],[...]]
*/
LGraphNode.prototype.addOutputs = function(array)
{
	for(var i = 0; i < array.length; ++i)
	{
		var info = array[i];
		var o = {name:info[0],type:info[1],link:null};
		if(array[2])
			for(var j in info[2])
				o[j] = info[2][j];

		if(!this.outputs)
			this.outputs = [];
		this.outputs.push(o);
		if(this.onOutputAdded)
			this.onOutputAdded(o);
	}

	this.size = this.computeSize();
	this.setDirtyCanvas(true,true);
}

/**
* remove an existing output slot
* @method removeOutput
* @param {number} slot
*/
LGraphNode.prototype.removeOutput = function(slot)
{
	this.disconnectOutput(slot);
	this.outputs.splice(slot,1);
	for(var i = slot; i < this.outputs.length; ++i)
	{
		if( !this.outputs[i] || !this.outputs[i].links )
			continue;
		var links = this.outputs[i].links;
		for(var j = 0; j < links.length; ++j)
		{
			var link = this.graph.links[ links[j] ];
			if(!link)
				continue;
			link.origin_slot -= 1;
		}
	}

	this.size = this.computeSize();
	if(this.onOutputRemoved)
		this.onOutputRemoved(slot);
	this.setDirtyCanvas(true,true);
}

/**
* add a new input slot to use in this node
* @method addInput
* @param {string} name
* @param {string} type string defining the input type ("vec3","number",...), it its a generic one use 0
* @param {Object} extra_info this can be used to have special properties of an input (label, color, position, etc)
*/
LGraphNode.prototype.addInput = function(name,type,extra_info)
{
	type = type || 0;
	var o = {name:name,type:type,link:null};
	if(extra_info)
		for(var i in extra_info)
			o[i] = extra_info[i];

	if(!this.inputs)
		this.inputs = [];
	this.inputs.push(o);
	this.size = this.computeSize();
	if(this.onInputAdded)
		this.onInputAdded(o);
	this.setDirtyCanvas(true,true);
	return o;
}

/**
* add several new input slots in this node
* @method addInputs
* @param {Array} array of triplets like [[name,type,extra_info],[...]]
*/
LGraphNode.prototype.addInputs = function(array)
{
	for(var i = 0; i < array.length; ++i)
	{
		var info = array[i];
		var o = {name:info[0], type:info[1], link:null};
		if(array[2])
			for(var j in info[2])
				o[j] = info[2][j];

		if(!this.inputs)
			this.inputs = [];
		this.inputs.push(o);
		if(this.onInputAdded)
			this.onInputAdded(o);
	}

	this.size = this.computeSize();
	this.setDirtyCanvas(true,true);
}

/**
* remove an existing input slot
* @method removeInput
* @param {number} slot
*/
LGraphNode.prototype.removeInput = function(slot)
{
	this.disconnectInput(slot);
	this.inputs.splice(slot,1);
	for(var i = slot; i < this.inputs.length; ++i)
	{
		if(!this.inputs[i])
			continue;
		var link = this.graph.links[ this.inputs[i].link ];
		if(!link)
			continue;
		link.target_slot -= 1;
	}
	this.size = this.computeSize();
	if(this.onInputRemoved)
		this.onInputRemoved(slot);
	this.setDirtyCanvas(true,true);
}

/**
* add an special connection to this node (used for special kinds of graphs)
* @method addConnection
* @param {string} name
* @param {string} type string defining the input type ("vec3","number",...)
* @param {[x,y]} pos position of the connection inside the node
* @param {string} direction if is input or output
*/
LGraphNode.prototype.addConnection = function(name,type,pos,direction)
{
	var o = {
		name: name,
		type: type,
		pos: pos,
		direction: direction,
		links: null
	};
	this.connections.push( o );
	return o;
}

/**
* computes the size of a node according to its inputs and output slots
* @method computeSize
* @param {number} minHeight
* @return {number} the total size
*/
LGraphNode.prototype.computeSize = function( minHeight, out )
{
	var rows = Math.max( this.inputs ? this.inputs.length : 1, this.outputs ? this.outputs.length : 1);
	var size = out || new Float32Array([0,0]);
	rows = Math.max(rows, 1);
	var font_size = GraphBase.NODE_TEXT_SIZE; //although it should be graphcanvas.inner_text_font size
	size[1] = (this.constructor.slot_start_y || 0) + rows * (font_size + 1) + 4;
	if( this.widgets && this.widgets.length )
		size[1] += this.widgets.length * (GraphBase.NODE_WIDGET_HEIGHT + 4) + 8;

	var font_size = font_size;
	var title_width = compute_text_size( this.title );
	var input_width = 0;
	var output_width = 0;

	if(this.inputs)
		for(var i = 0, l = this.inputs.length; i < l; ++i)
		{
			var input = this.inputs[i];
			var text = input.label || input.name || "";
			var text_width = compute_text_size( text );
			if(input_width < text_width)
				input_width = text_width;
		}

	if(this.outputs)
		for(var i = 0, l = this.outputs.length; i < l; ++i)
		{
			var output = this.outputs[i];
			var text = output.label || output.name || "";
			var text_width = compute_text_size( text );
			if(output_width < text_width)
				output_width = text_width;
		}

	size[0] = Math.max( input_width + output_width + 10, title_width );
	size[0] = Math.max( size[0], GraphBase.NODE_WIDTH );
	if(this.widgets && this.widgets.length)
		size[0] = Math.max( size[0], GraphBase.NODE_WIDTH * 1.5 );

	if(this.onResize)
		this.onResize(size);

	function compute_text_size( text )
	{
		if(!text)
			return 0;
		return font_size * text.length * 0.6;
	}

	return size;
}

/**
* Allows to pass 
* 
* @method addWidget
* @return {Object} the created widget
*/
LGraphNode.prototype.addWidget = function( type, name, value, callback, options )
{
	if(!this.widgets)
		this.widgets = [];
	var w = {
		type: type.toLowerCase(),
		name: name,
		value: value,
		callback: callback,
		options: options || {}
	};

	if(w.options.y !== undefined )
		w.y = w.options.y;

	if( !callback )
		console.warn("GraphBase addWidget('button',...) without a callback");
	if( type == "combo" && !w.options.values )
		throw("GraphBase addWidget('combo',...) requires to pass values in options: { values:['red','blue'] }");
	this.widgets.push(w);
	return w;
}

LGraphNode.prototype.addCustomWidget = function( custom_widget )
{
	if(!this.widgets)
		this.widgets = [];
	this.widgets.push(custom_widget);
	return custom_widget;
}


/**
* returns the bounding of the object, used for rendering purposes
* bounding is: [topleft_cornerx, topleft_cornery, width, height]
* @method getBounding
* @return {Float32Array[4]} the total size
*/
LGraphNode.prototype.getBounding = function( out )
{
	out = out || new Float32Array(4);
	out[0] = this.pos[0] - 4;
	out[1] = this.pos[1] - GraphBase.NODE_TITLE_HEIGHT;
	out[2] = this.size[0] + 4;
	out[3] = this.size[1] + GraphBase.NODE_TITLE_HEIGHT;

	if( this.onBounding )
		this.onBounding( out );
	return out;
}

/**
* checks if a point is inside the shape of a node
* @method isPointInside
* @param {number} x
* @param {number} y
* @return {boolean}
*/
LGraphNode.prototype.isPointInside = function( x, y, margin, skip_title )
{
	margin = margin || 0;

	var margin_top = this.graph && this.graph.isLive() ? 0 : 20;
	if(skip_title)
		margin_top = 0;
	if(this.flags && this.flags.collapsed)
	{
		//if ( distance([x,y], [this.pos[0] + this.size[0]*0.5, this.pos[1] + this.size[1]*0.5]) < GraphBase.NODE_COLLAPSED_RADIUS)
		if( isInsideRectangle( x, y, this.pos[0] - margin, this.pos[1] - GraphBase.NODE_TITLE_HEIGHT - margin, (this._collapsed_width||GraphBase.NODE_COLLAPSED_WIDTH) + 2 * margin, GraphBase.NODE_TITLE_HEIGHT + 2 * margin ) )
			return true;
	}
	else if ( (this.pos[0] - 4 - margin) < x && (this.pos[0] + this.size[0] + 4 + margin) > x
		&& (this.pos[1] - margin_top - margin) < y && (this.pos[1] + this.size[1] + margin) > y)
		return true;
	return false;
}

/**
* checks if a point is inside a node slot, and returns info about which slot
* @method getSlotInPosition
* @param {number} x
* @param {number} y
* @return {Object} if found the object contains { input|output: slot object, slot: number, link_pos: [x,y] }
*/
LGraphNode.prototype.getSlotInPosition = function( x, y )
{
	//search for inputs
	var link_pos = new Float32Array(2);
	if(this.inputs)
		for(var i = 0, l = this.inputs.length; i < l; ++i)
		{
			var input = this.inputs[i];
			this.getConnectionPos( true,i, link_pos );
			if( isInsideRectangle(x, y, link_pos[0] - 10, link_pos[1] - 5, 20,10) )
				return { input: input, slot: i, link_pos: link_pos, locked: input.locked };
		}

	if(this.outputs)
		for(var i = 0, l = this.outputs.length; i < l; ++i)
		{
			var output = this.outputs[i];
			this.getConnectionPos(false,i,link_pos);
			if( isInsideRectangle(x, y, link_pos[0] - 10, link_pos[1] - 5, 20,10) )
				return { output: output, slot: i, link_pos: link_pos, locked: output.locked };
		}

	return null;
}

/**
* returns the input slot with a given name (used for dynamic slots), -1 if not found
* @method findInputSlot
* @param {string} name the name of the slot
* @return {number} the slot (-1 if not found)
*/
LGraphNode.prototype.findInputSlot = function(name)
{
	if(!this.inputs)
		return -1;
	for(var i = 0, l = this.inputs.length; i < l; ++i)
		if(name == this.inputs[i].name)
			return i;
	return -1;
}

/**
* returns the output slot with a given name (used for dynamic slots), -1 if not found
* @method findOutputSlot
* @param {string} name the name of the slot
* @return {number} the slot (-1 if not found)
*/
LGraphNode.prototype.findOutputSlot = function(name)
{
	if(!this.outputs) return -1;
	for(var i = 0, l = this.outputs.length; i < l; ++i)
		if(name == this.outputs[i].name)
			return i;
	return -1;
}

/**
* connect this node output to the input of another node
* @method connect
* @param {number_or_string} slot (could be the number of the slot or the string with the name of the slot)
* @param {LGraphNode} node the target node
* @param {number_or_string} target_slot the input slot of the target node (could be the number of the slot or the string with the name of the slot, or -1 to connect a trigger)
* @return {Object} the link_info is created, otherwise null
*/
LGraphNode.prototype.connect = function( slot, target_node, target_slot )
{
	target_slot = target_slot || 0;

	if(!this.graph) //could be connected before adding it to a graph
	{
		console.log("Connect: Error, node doesnt belong to any graph. Nodes must be added first to a graph before connecting them."); //due to link ids being associated with graphs
		return null;
	}


	//seek for the output slot
	if( slot.constructor === String )
	{
		slot = this.findOutputSlot(slot);
		if(slot == -1)
		{
			if(GraphBase.debug)
				console.log("Connect: Error, no slot of name " + slot);
			return null;
		}
	}
	else if(!this.outputs || slot >= this.outputs.length)
	{
		if(GraphBase.debug)
			console.log("Connect: Error, slot number not found");
		return null;
	}

	if(target_node && target_node.constructor === Number)
		target_node = this.graph.getNodeById( target_node );
	if(!target_node)
		throw("target node is null");

	//avoid loopback
	if(target_node == this)
		return null;

	//you can specify the slot by name
	if(target_slot.constructor === String)
	{
		target_slot = target_node.findInputSlot( target_slot );
		if(target_slot == -1)
		{
			if(GraphBase.debug)
				console.log("Connect: Error, no slot of name " + target_slot);
			return null;
		}
	}
	else if( target_slot === GraphBase.EVENT )
	{
		//search for first slot with event?
		/*
		//create input for trigger
		var input = target_node.addInput("onTrigger", GraphBase.EVENT );
		target_slot = target_node.inputs.length - 1; //last one is the one created
		target_node.mode = GraphBase.ON_TRIGGER;
		*/
		return null;
	}
	else if( !target_node.inputs || target_slot >= target_node.inputs.length )
	{
		if(GraphBase.debug)
			console.log("Connect: Error, slot number not found");
		return null;
	}

	//if there is something already plugged there, disconnect
	if(target_node.inputs[ target_slot ].link != null )
		target_node.disconnectInput( target_slot );

	//why here??
	//this.setDirtyCanvas(false,true);
	//this.graph.connectionChange( this );

	var output = this.outputs[slot];

	//allows nodes to block connection
	if(target_node.onConnectInput)
		if( target_node.onConnectInput( target_slot, output.type, output ) === false)
			return null;

	var input = target_node.inputs[target_slot];
	var link_info = null;

	if( GraphBase.isValidConnection( output.type, input.type ) )
	{
		link_info = new LLink( this.graph.last_link_id++, input.type, this.id, slot, target_node.id, target_slot );

		//add to graph links list
		this.graph.links[ link_info.id ] = link_info;

		//connect in output
		if( output.links == null )
			output.links = [];
		output.links.push( link_info.id );
		//connect in input
		target_node.inputs[target_slot].link = link_info.id;
		if(this.graph)
			this.graph._version++;
		if(this.onConnectionsChange)
			this.onConnectionsChange( GraphBase.OUTPUT, slot, true, link_info, output ); //link_info has been created now, so its updated
		if(target_node.onConnectionsChange)
			target_node.onConnectionsChange( GraphBase.INPUT, target_slot, true, link_info, input );
		if( this.graph && this.graph.onNodeConnectionChange )
		{
			this.graph.onNodeConnectionChange( GraphBase.INPUT, target_node, target_slot, this, slot );
			this.graph.onNodeConnectionChange( GraphBase.OUTPUT, this, slot, target_node, target_slot );
		}
	}

	this.setDirtyCanvas(false,true);
	this.graph.connectionChange( this, link_info );

	return link_info;
}

/**
* disconnect one output to an specific node
* @method disconnectOutput
* @param {number_or_string} slot (could be the number of the slot or the string with the name of the slot)
* @param {LGraphNode} target_node the target node to which this slot is connected [Optional, if not target_node is specified all nodes will be disconnected]
* @return {boolean} if it was disconnected succesfully
*/
LGraphNode.prototype.disconnectOutput = function( slot, target_node )
{
	if( slot.constructor === String )
	{
		slot = this.findOutputSlot(slot);
		if(slot == -1)
		{
			if(GraphBase.debug)
				console.log("Connect: Error, no slot of name " + slot);
			return false;
		}
	}
	else if(!this.outputs || slot >= this.outputs.length)
	{
		if(GraphBase.debug)
			console.log("Connect: Error, slot number not found");
		return false;
	}

	//get output slot
	var output = this.outputs[slot];
	if(!output || !output.links || output.links.length == 0)
		return false;

	//one of the output links in this slot
	if(target_node)
	{
		if(target_node.constructor === Number)
			target_node = this.graph.getNodeById( target_node );
		if(!target_node)
			throw("Target Node not found");

		for(var i = 0, l = output.links.length; i < l; i++)
		{
			var link_id = output.links[i];
			var link_info = this.graph.links[ link_id ];

			//is the link we are searching for...
			if( link_info.target_id == target_node.id )
			{
				output.links.splice(i,1); //remove here
				var input = target_node.inputs[ link_info.target_slot ];
				input.link = null; //remove there
				delete this.graph.links[ link_id ]; //remove the link from the links pool
				if(this.graph)
					this.graph._version++;
				if(target_node.onConnectionsChange)
					target_node.onConnectionsChange( GraphBase.INPUT, link_info.target_slot, false, link_info, input ); //link_info hasnt been modified so its ok
				if(this.onConnectionsChange)
					this.onConnectionsChange( GraphBase.OUTPUT, slot, false, link_info, output );
				if( this.graph && this.graph.onNodeConnectionChange )
					this.graph.onNodeConnectionChange( GraphBase.OUTPUT, this, slot );
				if( this.graph && this.graph.onNodeConnectionChange )
				{
					this.graph.onNodeConnectionChange( GraphBase.OUTPUT, this, slot );
					this.graph.onNodeConnectionChange( GraphBase.INPUT, target_node, link_info.target_slot );
				}
				break;
			}
		}
	}
	else //all the links in this output slot
	{
		for(var i = 0, l = output.links.length; i < l; i++)
		{
			var link_id = output.links[i];
			var link_info = this.graph.links[ link_id ];
			if(!link_info) //bug: it happens sometimes
				continue;

			var target_node = this.graph.getNodeById( link_info.target_id );
			var input = null;
			if(this.graph)
				this.graph._version++;
			if(target_node)
			{
				input = target_node.inputs[ link_info.target_slot ];
				input.link = null; //remove other side link
				if(target_node.onConnectionsChange)
					target_node.onConnectionsChange( GraphBase.INPUT, link_info.target_slot, false, link_info, input ); //link_info hasnt been modified so its ok
				if( this.graph && this.graph.onNodeConnectionChange )
					this.graph.onNodeConnectionChange( GraphBase.INPUT, target_node, link_info.target_slot );
			}
			delete this.graph.links[ link_id ]; //remove the link from the links pool
			if(this.onConnectionsChange)
				this.onConnectionsChange( GraphBase.OUTPUT, slot, false, link_info, output );
			if( this.graph && this.graph.onNodeConnectionChange )
			{
				this.graph.onNodeConnectionChange( GraphBase.OUTPUT, this, slot );
				this.graph.onNodeConnectionChange( GraphBase.INPUT, target_node, link_info.target_slot );
			}
		}
		output.links = null;
	}


	this.setDirtyCanvas(false,true);
	this.graph.connectionChange( this );
	return true;
}

/**
* disconnect one input
* @method disconnectInput
* @param {number_or_string} slot (could be the number of the slot or the string with the name of the slot)
* @return {boolean} if it was disconnected succesfully
*/
LGraphNode.prototype.disconnectInput = function( slot )
{
	//seek for the output slot
	if( slot.constructor === String )
	{
		slot = this.findInputSlot(slot);
		if(slot == -1)
		{
			if(GraphBase.debug)
				console.log("Connect: Error, no slot of name " + slot);
			return false;
		}
	}
	else if(!this.inputs || slot >= this.inputs.length)
	{
		if(GraphBase.debug)
			console.log("Connect: Error, slot number not found");
		return false;
	}

	var input = this.inputs[slot];
	if(!input)
		return false;

	var link_id = this.inputs[slot].link;
	this.inputs[slot].link = null;

	//remove other side
	var link_info = this.graph.links[ link_id ];
	if( link_info )
	{
		var target_node = this.graph.getNodeById( link_info.origin_id );
		if(!target_node)
			return false;

		var output = target_node.outputs[ link_info.origin_slot ];
		if(!output || !output.links || output.links.length == 0)
			return false;

		//search in the inputs list for this link
		for(var i = 0, l = output.links.length; i < l; i++)
		{
			if( output.links[i] == link_id )
			{
				output.links.splice(i,1);
				break;
			}
		}

		delete this.graph.links[ link_id ]; //remove from the pool
		if(this.graph)
			this.graph._version++;
		if( this.onConnectionsChange )
			this.onConnectionsChange( GraphBase.INPUT, slot, false, link_info, input );
		if( target_node.onConnectionsChange )
			target_node.onConnectionsChange( GraphBase.OUTPUT, i, false, link_info, output );
		if( this.graph && this.graph.onNodeConnectionChange )
		{
			this.graph.onNodeConnectionChange( GraphBase.OUTPUT, target_node, i );
			this.graph.onNodeConnectionChange( GraphBase.INPUT, this, slot );
		}
	}

	this.setDirtyCanvas(false,true);
	this.graph.connectionChange( this );
	return true;
}

/**
* returns the center of a connection point in canvas coords
* @method getConnectionPos
* @param {boolean} is_input true if if a input slot, false if it is an output
* @param {number_or_string} slot (could be the number of the slot or the string with the name of the slot)
* @param {vec2} out [optional] a place to store the output, to free garbage
* @return {[x,y]} the position
**/
LGraphNode.prototype.getConnectionPos = function( is_input, slot_number, out )
{
	out = out || new Float32Array(2);
	var num_slots = 0;
	if( is_input && this.inputs )
		num_slots = this.inputs.length;
	if( !is_input && this.outputs )
		num_slots = this.outputs.length;

	if(this.flags.collapsed)
	{
		var w = (this._collapsed_width || GraphBase.NODE_COLLAPSED_WIDTH);
		if( this.horizontal )
		{
			out[0] = this.pos[0] + w * 0.5; 
			if(is_input)
				out[1] = this.pos[1] - GraphBase.NODE_TITLE_HEIGHT;
			else
				out[1] = this.pos[1];
		}
		else
		{
			if(is_input)
				out[0] = this.pos[0];
			else
				out[0] = this.pos[0] + w;
			out[1] = this.pos[1] - GraphBase.NODE_TITLE_HEIGHT * 0.5;
		}
		return out;
	}

	if(is_input && slot_number == -1)
	{
		out[0] = this.pos[0] + 10;
		out[1] = this.pos[1] + 10;
		return out;
	}

	//hardcoded pos
	if(is_input && num_slots > slot_number && this.inputs[ slot_number ].pos)
	{
		out[0] = this.pos[0] + this.inputs[slot_number].pos[0];
		out[1] = this.pos[1] + this.inputs[slot_number].pos[1];
		return out;
	}
	else if(!is_input && num_slots > slot_number && this.outputs[ slot_number ].pos)
	{
		out[0] = this.pos[0] + this.outputs[slot_number].pos[0];
		out[1] = this.pos[1] + this.outputs[slot_number].pos[1];
		return out;
	}

	//horizontal distributed slots
	if(this.horizontal)
	{
		out[0] = this.pos[0] + (slot_number + 0.5) * (this.size[0] / num_slots);
		if(is_input)
			out[1] = this.pos[1] - GraphBase.NODE_TITLE_HEIGHT;
		else
			out[1] = this.pos[1] + this.size[1];
		return out;
	}
	
	//default
	if(is_input)
		out[0] = this.pos[0];
	else
		out[0] = this.pos[0] + this.size[0] + 1;
	out[1] = this.pos[1] + 10 + slot_number * GraphBase.NODE_SLOT_HEIGHT + (this.constructor.slot_start_y || 0);
	return out;
}

/* Force align to grid */
LGraphNode.prototype.alignToGrid = function()
{
	this.pos[0] = GraphBase.CANVAS_GRID_SIZE * Math.round(this.pos[0] / GraphBase.CANVAS_GRID_SIZE);
	this.pos[1] = GraphBase.CANVAS_GRID_SIZE * Math.round(this.pos[1] / GraphBase.CANVAS_GRID_SIZE);
}


/* Console output */
LGraphNode.prototype.trace = function(msg)
{
	if(!this.console)
		this.console = [];
	this.console.push(msg);
	if(this.console.length > LGraphNode.MAX_CONSOLE)
		this.console.shift();

	this.graph.onNodeTrace(this,msg);
}

/* Forces to redraw or the main canvas (LGraphNode) or the bg canvas (links) */
LGraphNode.prototype.setDirtyCanvas = function(dirty_foreground, dirty_background)
{
	if(!this.graph)
		return;
	this.graph.sendActionToCanvas("setDirty",[dirty_foreground, dirty_background]);
}

LGraphNode.prototype.loadImage = function(url)
{
	var img = new Image();
	img.src = GraphBase.node_images_path + url;
	img.ready = false;

	var that = this;
	img.onload = function() {
		this.ready = true;
		that.setDirtyCanvas(true);
	}
	return img;
}

//safe LGraphNode action execution (not sure if safe)
/*
LGraphNode.prototype.executeAction = function(action)
{
	if(action == "") return false;

	if( action.indexOf(";") != -1 || action.indexOf("}") != -1)
	{
		this.trace("Error: Action contains unsafe characters");
		return false;
	}

	var tokens = action.split("(");
	var func_name = tokens[0];
	if( typeof(this[func_name]) != "function")
	{
		this.trace("Error: Action not found on node: " + func_name);
		return false;
	}

	var code = action;

	try
	{
		var _foo = eval;
		eval = null;
		(new Function("with(this) { " + code + "}")).call(this);
		eval = _foo;
	}
	catch (err)
	{
		this.trace("Error executing action {" + action + "} :" + err);
		return false;
	}

	return true;
}
*/

/* Allows to get onMouseMove and onMouseUp events even if the mouse is out of focus */
LGraphNode.prototype.captureInput = function(v)
{
	if(!this.graph || !this.graph.list_of_graphcanvas)
		return;

	var list = this.graph.list_of_graphcanvas;

	for(var i = 0; i < list.length; ++i)
	{
		var c = list[i];
		//releasing somebody elses capture?!
		if(!v && c.node_capturing_input != this)
			continue;

		//change
		c.node_capturing_input = v ? this : null;
	}
}

/**
* Collapse the node to make it smaller on the canvas
* @method collapse
**/
LGraphNode.prototype.collapse = function( force )
{
	this.graph._version++;
	if(this.constructor.collapsable === false && !force)
		return;
	if(!this.flags.collapsed)
		this.flags.collapsed = true;
	else
		this.flags.collapsed = false;
	this.setDirtyCanvas(true,true);
}

/**
* Forces the node to do not move or realign on Z
* @method pin
**/

LGraphNode.prototype.pin = function(v)
{
	this.graph._version++;
	if(v === undefined)
		this.flags.pinned = !this.flags.pinned;
	else
		this.flags.pinned = v;
}

LGraphNode.prototype.localToScreen = function(x,y, graphcanvas)
{
	return [(x + this.pos[0]) * graphcanvas.scale + graphcanvas.offset[0],
		(y + this.pos[1]) * graphcanvas.scale + graphcanvas.offset[1]];
}

export{LGraphNode}