(function(global){
var LiteGraph = global.LiteGraph;

//Converter
function Converter()
{
	this.addInput("in","*");
	this.size = [60,20];
}

Converter.title = "Converter";
Converter.desc = "type A to type B";

Converter.prototype.onExecute = function()
{
	var v = this.getInputData(0);
	if(v == null)
		return;

	if(this.outputs)
		for(var i = 0; i < this.outputs.length; i++)
		{
			var output = this.outputs[i];
			if(!output.links || !output.links.length)
				continue;

			var result = null;
			switch( output.name )
			{
				case "number": result = v.length ? v[0] : parseFloat(v); break;
				case "vec2": 
				case "vec3": 
				case "vec4": 
					var result = null;
					var count = 1;
					switch(output.name)
					{
						case "vec2": count = 2; break;
						case "vec3": count = 3; break;
						case "vec4": count = 4; break;
					}

					var result = new Float32Array( count );
					if( v.length )
					{
						for(var j = 0; j < v.length && j < result.length; j++)
							result[j] = v[j];
					}
					else
						result[0] = parseFloat(v);
					break;
			}
			this.setOutputData(i, result);
		}
}

Converter.prototype.onGetOutputs = function() {
	return [["number","number"],["vec2","vec2"],["vec3","vec3"],["vec4","vec4"]];
}

LiteGraph.registerNodeType("pytorch/converter", Converter );

//Conv1d
function Conv1d()
{
	this.addInput("in");
	this.addOutput("out");
}

Conv1d.title = "Conv1d";
Conv1d.desc = "removes the type";
Conv1d.data = {
	"category": "Layer",
	"package": "torch.nn.modules.conv"
}

Conv1d.prototype.onExecute = function()
{
	var v = this.getInputData(0);
	this.setOutputData(0, v);
}

LiteGraph.registerNodeType("pytorch/Conv1d", Conv1d);

})(this);