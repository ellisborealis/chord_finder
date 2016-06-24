// math functions
// Array.prototype.max = function() {
	// return Math.max.apply(null, this);
// };
// Array.prototype.min = function() {
	// return Math.min.apply(null, this);
// };
// http://stackoverflow.com/questions/1063007/arr-sort-does-not-sort-integers-correctly
function sortNumber(a,b) {
    return a - b;
}
// http://jszen.com/best-way-to-get-unique-values-of-an-array-in-javascript.7.html
Array.prototype.unique = function()
{
	var n = {},r=[];
	for(var i = 0; i < this.length; i++) 
	{
		if (!n[this[i]]) 
		{
			n[this[i]] = true; 
			r.push(this[i]); 
		}
	}
	return r;
}
function trueModulus(number, divisor)
{
	return ((number % divisor) + divisor) % divisor;
}
function roundTowardZero(doubleValue)
{
	if(doubleValue > 0)
	{
		return Math.floor(doubleValue);
	}
	else
	{
		return Math.ceil(doubleValue);
	}
}
function negOrPos(number)
{
	if(number < 0)
	{
		return -1;
	}
	else
	{
		return 1;
	}
}
function evenOrOdd(number)
{
	if(trueModulus(number,2) == 0)
	{
		return 1;
	}
	else
	{
		return -1;
	}
}