//Watch a value in the editor

import {check_function} from '../utils/check_tensor_shape.js'
//Constant
function ConstantNumber()
{
	this.addOutput("value","number");
	this.addProperty( "value", 1.0 );
}

ConstantNumber.title = "Const Number";
ConstantNumber.desc = "Constant number";

ConstantNumber.prototype.onExecute = function()
{
	this.setOutputData(0, parseFloat( this.properties["value"] ) );
}

ConstantNumber.prototype.setValue = function(v)
{
	this.properties.value = v;
}

ConstantNumber.prototype.onDrawBackground = function(ctx)
{
	//show the current value
	this.outputs[0].label = this.properties["value"].toFixed(3);
}


function Watch()
{
	this.size = [60,20];
	this.addInput("value",0,{label:""});
	this.value = 0;
}

Watch.title = "Watch";
Watch.desc = "Show value of input";
Watch.menu_name = "Watch";

Watch.prototype.onExecute = function()
{
	if( this.inputs[0] )	
		this.value = this.getInputData(0);
}

Watch.toString = function( o )
{
	if( o == null )
		return "null";
	else if (o.constructor === Number )
		return o.toFixed(3);
	else if (o.constructor === Array )
	{
		var str = "[";
		for(var i = 0; i < o.length; ++i)
			str += Watch.toString(o[i]) + ((i+1) != o.length ? "," : "");
		str += "]";
		return str;
	}
	else
		return String(o);
}

Watch.prototype.onDrawBackground = function(ctx)
{
	//show the current value
	this.inputs[0].label = Watch.toString(this.value);
}

export {Watch,ConstantNumber}
