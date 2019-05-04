//API *************************************************
// like rect but rounded corners
// if(this.CanvasRenderingContext2D)
// CanvasRenderingContext2D.prototype.roundRect = function (x, y, width, height, radius, radius_low) {
//   if ( radius === undefined ) {
//     radius = 5;
//   }

//   if(radius_low === undefined)
// 	 radius_low  = radius;

//   this.moveTo(x + radius, y);
//   this.lineTo(x + width - radius, y);
//   this.quadraticCurveTo(x + width, y, x + width, y + radius);

//   this.lineTo(x + width, y + height - radius_low);
//   this.quadraticCurveTo(x + width, y + height, x + width - radius_low, y + height);
//   this.lineTo(x + radius_low, y + height);
//   this.quadraticCurveTo(x, y + height, x, y + height - radius_low);
//   this.lineTo(x, y + radius);
//   this.quadraticCurveTo(x, y, x + radius, y);
// }

const GraphCommonFunc = {}
function compareObjects(a,b)
{
	for(var i in a)
		if(a[i] != b[i])
			return false;
	return true;
}
GraphCommonFunc.compareObjects = compareObjects;

function distance(a,b)
{
	return Math.sqrt( (b[0] - a[0]) * (b[0] - a[0]) + (b[1] - a[1]) * (b[1] - a[1]) );
}
GraphCommonFunc.distance = distance;

function colorToString(c)
{
	return "rgba(" + Math.round(c[0] * 255).toFixed() + "," + Math.round(c[1] * 255).toFixed() + "," + Math.round(c[2] * 255).toFixed() + "," + (c.length == 4 ? c[3].toFixed(2) : "1.0") + ")";
}
GraphCommonFunc.colorToString = colorToString;

function isInsideRectangle( x,y, left, top, width, height)
{
	if (left < x && (left + width) > x &&
		top < y && (top + height) > y)
		return true;
	return false;
}
GraphCommonFunc.isInsideRectangle = isInsideRectangle;

//[minx,miny,maxx,maxy]
function growBounding( bounding, x,y)
{
	if(x < bounding[0])
		bounding[0] = x;
	else if(x > bounding[2])
		bounding[2] = x;

	if(y < bounding[1])
		bounding[1] = y;
	else if(y > bounding[3])
		bounding[3] = y;
}
GraphCommonFunc.growBounding = growBounding;

//point inside boundin box
function isInsideBounding(p,bb)
{
	if (p[0] < bb[0][0] ||
		p[1] < bb[0][1] ||
		p[0] > bb[1][0] ||
		p[1] > bb[1][1])
		return false;
	return true;
}
GraphCommonFunc.isInsideBounding = isInsideBounding;

//boundings overlap, format: [ startx, starty, width, height ]
function overlapBounding(a,b)
{
	var A_end_x = a[0] + a[2];
	var A_end_y = a[1] + a[3];
	var B_end_x = b[0] + b[2];
	var B_end_y = b[1] + b[3];

	if ( a[0] > B_end_x ||
		a[1] > B_end_y ||
		A_end_x < b[0] ||
		A_end_y < b[1])
		return false;
	return true;
}
GraphCommonFunc.overlapBounding = overlapBounding;

//Convert a hex value to its decimal value - the inputted hex must be in the
//	format of a hex triplet - the kind we use for HTML colours. The function
//	will return an array with three values.
function hex2num(hex) {
	if(hex.charAt(0) == "#") hex = hex.slice(1); //Remove the '#' char - if there is one.
	hex = hex.toUpperCase();
	var hex_alphabets = "0123456789ABCDEF";
	var value = new Array(3);
	var k = 0;
	var int1,int2;
	for(var i=0;i<6;i+=2) {
		int1 = hex_alphabets.indexOf(hex.charAt(i));
		int2 = hex_alphabets.indexOf(hex.charAt(i+1));
		value[k] = (int1 * 16) + int2;
		k++;
	}
	return(value);
}

GraphCommonFunc.hex2num = hex2num;

//Give a array with three values as the argument and the function will return
//	the corresponding hex triplet.
function num2hex(triplet) {
	var hex_alphabets = "0123456789ABCDEF";
	var hex = "#";
	var int1,int2;
	for(var i=0;i<3;i++) {
		int1 = triplet[i] / 16;
		int2 = triplet[i] % 16;

		hex += hex_alphabets.charAt(int1) + hex_alphabets.charAt(int2);
	}
	return(hex);
}


GraphCommonFunc.num2hex = num2hex;

function getParameterNames(func) {
    return (func + '')
      .replace(/[/][/].*$/mg,'') // strip single-line comments
      .replace(/\s+/g, '') // strip white space
      .replace(/[/][*][^/*]*[*][/]/g, '') // strip multi-line comments  /**/
      .split('){', 1)[0].replace(/^[^(]*[(]/, '') // extract the parameters
      .replace(/=[^,]+/g, '') // strip any ES6 defaults
      .split(',').filter(Boolean); // split & filter [""]
}

//timer that works everywhere
if(typeof(performance) != "undefined")
	GraphCommonFunc.getTime = performance.now.bind(performance);
else if(typeof(Date) != "undefined" && Date.now)
	GraphCommonFunc.getTime = Date.now.bind(Date);
else if(typeof(process) != "undefined")
	GraphCommonFunc.getTime = function(){
		var t = process.hrtime();
		return t[0]*0.001 + t[1]*(1e-6);
	}
else
	GraphCommonFunc.getTime = function getTime() { return (new Date).getTime(); }
	

GraphCommonFunc.getParameterNames = getParameterNames;

export {GraphCommonFunc}