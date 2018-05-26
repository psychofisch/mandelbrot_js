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
	var mbScale = 100;
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

	var fac = ctx.canvas.height/mbCtx.canvas.height;
	ctx.save();
	ctx.scale(fac, fac);
	
	console.time("test");
	
	var iterations = 100;
	
	var current = math.complex(0, 0);
	for(var y = 0; y < mandelbrotCanvas.height; y++)
	{
		current.im = limits.top + ((y/mandelbrotCanvas.height) * limits.height);
		for(var x = 0; x < mandelbrotCanvas.width; x++)
		{
			current.re = limits.left + ((x/mandelbrotCanvas.width) * limits.width);
			
			var res = isInMandelbrot(current, iterations);
			
			//console.log(current + " : " + res);
			
			// if(res.length() < 2)
			// if(res)
				// mbCtx.fillStyle = 'green';
			// else
				// mbCtx.fillStyle = 'darkgrey';
			
			var ratio = res / iterations;
			var grey = ratio * 255;
			var r = grey;
			var g = 0;
			var b = 255 - grey;
			//mbCtx.fillStyle = 'rgb(' + grey + ',' + grey + ',' + grey + ')';
			//mbCtx.fillStyle = 'rgb(' + r + ',' + g + ',' + b + ')';
			
			mbCtx.fillStyle = tinycolor.fromRatio({ h: 1-ratio, s: 1, v: ratio * 2 }).toRgbString();
			
			//mbCtx.fillStyle = 'rgb(' + Math.floor(255 * x/mandelbrotCanvas.width) + ',' + Math.floor(255 * y/mandelbrotCanvas.height) + ',0)';
			mbCtx.fillRect(x, y, 1, 1);
		}
	}

	console.timeEnd("test");
	
	// var z = math.complex(0, 0);
	// var c = math.complex(0, 1);
	// var res = isInMandelbrot(c, 10);
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
	var tmp = math.complex(0, 0);
	
	for(var i = 0; i < maxIt; i++)
	{
		tmp = fx(tmp, c);
		
		//console.log(tmp + " with length of " + tmp.abs());
		
		if(tmp.abs() > 2)
		{
			return i;
		}
	}
	
	return maxIt;
}

function fx(z, c)
{
	var result = z.clone();
	result = math.multiply(result, result);
	result = math.add(result, c);
	return result;
}
