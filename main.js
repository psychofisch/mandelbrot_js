//author: psychofisch

function main() {
	const canvas = document.querySelector("#viewport");

	if(!canvas)
	{
		alert("Unable to find #viewport.");
		return;
	}

	canvas.height = window.innerHeight;
	canvas.width = window.innerWidth;

	// Initialize the GL context
	const ctx = canvas.getContext("2d");

	// Only continue if WebGL is available and working
	if (!ctx) {
		alert("Unable to initialize context.");
		return;
	}

	ctx.imageSmoothingEnabled = false;

	var mandelbrotCanvas = document.createElement('canvas');
	var mbScale = 50;
	mandelbrotCanvas.height = 2 * mbScale;
	mandelbrotCanvas.width = 3 * mbScale;
	mbCtx = mandelbrotCanvas.getContext('2d');

	ctx.fillStyle = 'aliceblue';
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	mbCtx.fillStyle = 'darkgrey';
	mbCtx.fillRect(0, 0, mandelbrotCanvas.width, mandelbrotCanvas.height);

	var limits = {};
	limits.left = -2;
	limits.top = 1;
	limits.width = 3;
	limits.height = -2;

	var current = math.complex(0, 0);
	for(var y = 0; y < mandelbrotCanvas.height; y++)
	{
		current.im = limits.top + ((y/mandelbrotCanvas.height) * limits.height);
		for(var x = 0; x < mandelbrotCanvas.width; x++)
		{
			current.re = limits.left + ((x/mandelbrotCanvas.width) * limits.width);
			
			var res = isInMandelbrot(current, 100);
			
			//console.log(current + " : " + res);
			
			// var res = iterate(current, 2);
			// if(res.length() < 2)
			if(res)
				mbCtx.fillStyle = 'green';
			else
				mbCtx.fillStyle = 'darkgrey';
			
			//mbCtx.fillStyle = 'rgb(' + Math.floor(255 * x/mandelbrotCanvas.width) + ',' + Math.floor(255 * y/mandelbrotCanvas.height) + ',0)';
			mbCtx.fillRect(x, y, 1, 1);
		}
	}

	// var z = math.complex(0, 0);
	// var c = math.complex(0, 1);
	// var res = isInMandelbrot(c, 10);

	var fac = ctx.canvas.height/mbCtx.canvas.height;
	ctx.save();
	ctx.scale(fac, fac);
	ctx.drawImage(mbCtx.canvas, 0, 0);
	ctx.restore();
}

function isInMandelbrot(c, maxIt)
{
	if(maxIt <= 0)
	{
		return c;
	}
	
	var it = maxIt;
	var first = math.complex(0, 0);
	var tmp = math.complex(0, 0);
	
	while(it > 0)
	{
		first = fx(tmp, c);
		tmp = first.clone();
		
		//console.log(tmp + " with length of " + tmp.abs());
		
		if(tmp.abs() > 2)
		{
			return false;
		}
		
		it--;
	}
	
	return true;
}

function iterate(c, it)
{
	if(it <= 0)
	{
		return c;
	}
	
	var first = new Victor(0, 0);
	var tmp = new Victor(0, 0);
	
	while(it > 0)
	{
		first = fx(tmp, c);
		tmp = first;
		console.log(it + ": " + tmp);
		it--;
	}
	return tmp;
}

function fx(z, c)
{
	var result;
	result = z.clone();
	result = math.multiply(result, result);
	result = math.add(result, c);
	return result;
}
