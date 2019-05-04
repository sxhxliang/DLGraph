
import {LGraphNode} from '../graph_node'
import {GraphConfig} from './config'
import {GraphCommonFunc} from './common'

const GraphBaseFunc = {
    
    /**
	* Register a node class so it can be listed when the user wants to create a new one
	* @method registerNodeType
	* @param {String} type name of the node and path
	* @param {Class} base_class class containing the structure of a node
	*/

	registerNodeType: function(type, base_class)
	{
		if(!base_class.prototype)
			throw("Cannot register a simple object, it must be a class with a prototype");
		base_class.type = type;

		if(GraphConfig.debug)
			console.log("Node registered: " + type);

		var categories = type.split("/");
		var classname = base_class.name;

		var pos = type.lastIndexOf("/");
		base_class.category = type.substr(0,pos);

		if(!base_class.title)
			base_class.title = classname;
		//info.name = name.substr(pos+1,name.length - pos);

		//extend class
		if(base_class.prototype) //is a class
			for(var i in LGraphNode.prototype)
				if(!base_class.prototype[i])
					base_class.prototype[i] = LGraphNode.prototype[i];

		Object.defineProperty( base_class.prototype, "shape",{
			set: function(v) {
				switch(v)
				{
					case "default": delete this._shape; break;
					case "box": this._shape = GraphConfig.BOX_SHAPE; break;
					case "round": this._shape = GraphConfig.ROUND_SHAPE; break;
					case "circle": this._shape = GraphConfig.CIRCLE_SHAPE; break;
					case "card": this._shape = GraphConfig.CARD_SHAPE; break;
					default:
						this._shape = v;
				}
			},
			get: function(v)
			{
				return this._shape;
			},
			enumerable: true
		});

		this.registered_node_types[ type ] = base_class;
		if(base_class.constructor.name)
			this.Nodes[ classname ] = base_class;

		//warnings
		if(base_class.prototype.onPropertyChange)
			console.warn("GraphConfig node class " + type + " has onPropertyChange method, it must be called onPropertyChanged with d at the end");

		if( base_class.supported_extensions )
		{
			for(var i in base_class.supported_extensions )
				this.node_types_by_file_extension[ base_class.supported_extensions[i].toLowerCase() ] = base_class;
		}
	},

	/**
	* Create a new node type by passing a function, it wraps it with a propper class and generates inputs according to the parameters of the function.
	* Useful to wrap simple methods that do not require properties, and that only process some input to generate an output.
	* @method wrapFunctionAsNode
	* @param {String} name node name with namespace (p.e.: 'math/sum')
	* @param {Function} func
	* @param {Array} param_types [optional] an array containing the type of every parameter, otherwise parameters will accept any type
	* @param {String} return_type [optional] string with the return type, otherwise it will be generic
	*/
	wrapFunctionAsNode: function( name, func, param_types, return_type )
	{
		var params = Array(func.length);
		var code = "";
		var names = GraphCommonFunc.getParameterNames( func );
		for(var i = 0; i < names.length; ++i)
			code += "this.addInput('"+names[i]+"',"+(param_types && param_types[i] ? "'" + param_types[i] + "'" : "0") + ");\n";
		code += "this.addOutput('out',"+( return_type ? "'" + return_type + "'" : 0 )+");\n";
		var classobj = Function(code);
		classobj.title = name.split("/").pop();
		classobj.desc = "Generated from " + func.name;
		console.log('wrapFunctionAsNode',classobj.desc)
		classobj.prototype.onExecute = function onExecute()
		{
			for(var i = 0; i < params.length; ++i)
				params[i] = this.getInputData(i);
			var r = func.apply( this, params );
			this.setOutputData(0,r);
		}
		this.registerNodeType( name, classobj );
	},

	/**
	* Adds this method to all nodetypes, existing and to be created
	* (You can add it to LGraphNode.prototype but then existing node types wont have it)
	* @method addNodeMethod
	* @param {Function} func
	*/
	addNodeMethod: function( name, func )
	{
		LGraphNode.prototype[name] = func;
		for(var i in this.registered_node_types)
		{
			var type = this.registered_node_types[i];
			if(type.prototype[name])
				type.prototype["_" + name] = type.prototype[name]; //keep old in case of replacing
			type.prototype[name] = func;
		}
	},

	/**
	* Create a node of a given type with a name. The node is not attached to any graph yet.
	* @method createNode
	* @param {String} type full name of the node class. p.e. "math/sin"
	* @param {String} name a name to distinguish from other nodes
	* @param {Object} options to set options
	*/

	createNode: function( type, title, options )
	{
		var base_class = this.registered_node_types[type];
		if (!base_class)
		{
			if(GraphConfig.debug)
				console.log("GraphNode type \"" + type + "\" not registered.");
			return null;
		}

		var prototype = base_class.prototype || base_class;

		title = title || base_class.title || type;

		var node = null;

		if( GraphConfig.catch_exceptions )
		{
			try
			{
				node = new base_class( title );
			}
			catch (err)
			{
				console.error(err);
				return null;
			}
		}
		else
			node = new base_class( title );
	

		node.type = type;
		
		// console.log('node',node)
		// define base_class attributes 
		// then set node's attr
		if(!node.title && title) node.title = title;
		if(!node.data&&base_class.data) node.data = base_class.data;
		if(!node.properties){
			node.properties = {};
			if(base_class.data.attributes){
				base_class.data.attributes.forEach(item => {
					node.properties[item['name']] = ''
					if(item.default!==undefined) node.properties[item['name']] = item.default
				});
			}
		}
		if(!node.properties_info) node.properties_info = [];
		if(!node.flags) node.flags = {};
		if(!node.size) node.size = node.computeSize();
		if(!node.pos) node.pos = GraphConfig.DEFAULT_POSITION.concat();
		if(!node.mode) node.mode = GraphConfig.ALWAYS;

		//extra options
		if(options)
		{
			for(var i in options)
				node[i] = options[i];
		}

		return node;
	},

	/**
	* Returns a registered node type with a given name
	* @method getNodeType
	* @param {String} type full name of the node class. p.e. "math/sin"
	* @return {Class} the node class
	*/

	getNodeType: function(type)
	{
		return this.registered_node_types[type];
	},


	/**
	* Returns a list of node types matching one category
	* @method getNodeType
	* @param {String} category category name
	* @return {Array} array with all the node classes
	*/

	getNodeTypesInCategory: function( category, filter )
	{
		var r = [];
		for(var i in this.registered_node_types)
		{
			var type = this.registered_node_types[i];
			if(filter && type.filter && type.filter != filter)
				continue;

			if(category == "" )
			{
				if (type.category == null)
					r.push(type);
			}
			else if (type.category == category)
				r.push(type);
		}

		return r;
	},

	/**
	* Returns a list with all the node type categories
	* @method getNodeTypesCategories
	* @return {Array} array with all the names of the categories
	*/

	getNodeTypesCategories: function()
	{
		var categories = {"":1};
		for(var i in this.registered_node_types)
			if(this.registered_node_types[i].category && !this.registered_node_types[i].skip_list)
				categories[ this.registered_node_types[i].category ] = 1;
		var result = [];
		for(var i in categories)
			result.push(i);
		return result;
	},

	//debug purposes: reloads all the js scripts that matches a wilcard
	reloadNodes: function (folder_wildcard)
	{
		var tmp = document.getElementsByTagName("script");
		//weird, this array changes by its own, so we use a copy
		var script_files = [];
		for(var i in tmp)
			script_files.push(tmp[i]);


		var docHeadObj = document.getElementsByTagName("head")[0];
		folder_wildcard = document.location.href + folder_wildcard;

		for(var i in script_files)
		{
			var src = script_files[i].src;
			if( !src || src.substr(0,folder_wildcard.length ) != folder_wildcard)
				continue;

			try
			{
				if(GraphConfig.debug)
					console.log("Reloading: " + src);
				var dynamicScript = document.createElement("script");
				dynamicScript.type = "text/javascript";
				dynamicScript.src = src;
				docHeadObj.appendChild(dynamicScript);
				docHeadObj.removeChild(script_files[i]);
			}
			catch (err)
			{
				if(GraphConfig.throw_errors)
					throw err;
				if(GraphConfig.debug)
					console.log("Error while reloading " + src);
			}
		}

		if(GraphConfig.debug)
			console.log("Nodes reloaded");
	},

	//separated just to improve if it doesnt work
	cloneObject: function(obj, target)
	{
		if(obj == null) return null;
		var r = JSON.parse( JSON.stringify( obj ) );
		if(!target) return r;

		for(var i in r)
			target[i] = r[i];
		return target;
	},

	isValidConnection: function( type_a, type_b )
	{
		if( !type_a ||  //generic output
			!type_b || //generic input
			type_a == type_b || //same type (is valid for triggers)
			type_a == GraphConfig.EVENT && type_b == GraphConfig.ACTION )
        return true;

		// Enforce string type to handle toLowerCase call (-1 number not ok)
		type_a = String(type_a); 
		type_b = String(type_b);
		type_a = type_a.toLowerCase();
		type_b = type_b.toLowerCase();

		// For nodes supporting multiple connection types
		if( type_a.indexOf(",") == -1 && type_b.indexOf(",") == -1 )
			return type_a == type_b;

		// Check all permutations to see if one is valid
		var supported_types_a = type_a.split(",");
		var supported_types_b = type_b.split(",");
		for(var i = 0; i < supported_types_a.length; ++i)
			for(var j = 0; j < supported_types_b.length; ++j)
				if( supported_types_a[i] == supported_types_b[j] )
					return true;

		return false;
	},
	registerSearchboxExtra: function( node_type, description, data )
	{
		this.searchbox_extras[ description ] = { type: node_type, desc: description, data: data };
	},
	closeAllContextMenus: function( ref_window ){
		ref_window = ref_window || window;

		var elements = ref_window.document.querySelectorAll(".litecontextmenu");
		if(!elements.length)
			return;

		var result = [];
		for(var i = 0; i < elements.length; i++)
			result.push(elements[i]);

		for(var i in result)
		{
			if(result[i].close)
				result[i].close();
			else if(result[i].parentNode)
				result[i].parentNode.removeChild( result[i] );
		}
	}
};

export {GraphBaseFunc};