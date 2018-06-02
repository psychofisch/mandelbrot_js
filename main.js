//author: psychofisch

var iterations = 100,
	mbScale = 10,
	limits,
	mbCtx,
	ctx,
	mandelbrotCanvas,
	canvas,
	pixiApp,
	graphics;

function main() {
	if(limits == undefined)
	{
		limits = {};
		limits.left = -2;
		limits.top = 1;
		limits.width = 3;
		limits.height = -2;
	}
	
	resizePixi();
	//drawPixi();
	drawPixiShader();
	
	// resize();
	// draw();
}

function recalcClick()
{
	// drawPixi();
	// draw();
	drawPixiShader();
}

function draw()
{	
	var redraw = false;
	if(canvas.height != window.innerHeight || canvas.width != window.innerWidth)
	{
		resize();
		
		redraw = true;
	}

	var tmpIt = document.querySelector("#iterationsBox").value;
	var tmpScale = document.querySelector("#resolutionBox").value;
	
	if(!redraw && (tmpIt == iterations && tmpScale == mbScale))
	{
		return;
	}
	
	iterations = tmpIt;
	mbScale = tmpScale;
	
	mandelbrotCanvas.height = Math.abs(limits.height) * mbScale;
	mandelbrotCanvas.width = Math.abs(limits.width) * mbScale;
	mbCtx = mandelbrotCanvas.getContext('2d');

	ctx.fillStyle = 'black';
	ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

	mbCtx.fillStyle = 'darkgrey';
	mbCtx.fillRect(0, 0, mandelbrotCanvas.width, mandelbrotCanvas.height);

	var fac = ctx.canvas.height/mbCtx.canvas.height;
	
	ctx.save();
	ctx.scale(fac, fac);
	
	console.time("calculation time");
	
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

	console.timeEnd("calculation time");
	
	// var z = math.complex(0, 0);
	// var c = math.complex(0, 1);
	// var res = isInMandelbrot(c, 10);
	ctx.drawImage(mbCtx.canvas, 0, 0);
	ctx.restore();
}

function resize()
{
	if(canvas == undefined)
		canvas = document.querySelector("#viewport");
	
	var arLimits = Math.abs(limits.width/limits.height);
	var arWindow = Math.abs(window.innerWidth/window.innerHeight);
	
	if(arWindow > arLimits)
	{
		canvas.height = window.innerHeight;
		canvas.width = window.innerHeight * arLimits;
	}
	else
	{
		canvas.width = window.innerWidth;
		canvas.height = window.innerWidth / arLimits;
	}
	
	ctx = canvas.getContext("2d");

	if (!ctx) {
		alert("Unable to initialize context.");
		return;
	}

	ctx.imageSmoothingEnabled = false;

	mandelbrotCanvas = document.createElement('canvas');
}

function resizePixi()
{
	var size = {};
	var arLimits = Math.abs(limits.width/limits.height);
	var arWindow = Math.abs(window.innerWidth/window.innerHeight);
	
	if(arWindow > arLimits)
	{
		size.width = window.innerHeight * arLimits;
		size.height = window.innerHeight;
	}
	else
	{
		size.width = window.innerWidth;
		size.height = window.innerWidth / arLimits;
	}
	
	if(pixiApp != undefined)
		pixiApp.destroy(true);
	
	pixiApp = new PIXI.Application(size.width, size.height);
	document.body.appendChild(pixiApp.view);	
}

function drawPixi()
{	
	var redraw = false;
	if(pixiApp.screen.height != window.innerHeight || pixiApp.screen.width != window.innerWidth)
	{
		resizePixi();
		redraw = true;
	}

	var tmpIt = document.querySelector("#iterationsBox").value;
	var tmpScale = document.querySelector("#resolutionBox").value;
	
	if(!redraw && (tmpIt == iterations && tmpScale == mbScale))
	{
		return;
	}
	
	iterations = tmpIt;
	mbScale = tmpScale;
	
	var size = {};
	size.height = Math.abs(limits.height) * mbScale;
	size.width = Math.abs(limits.width) * mbScale;
	
	//mbCtx = mandelbrotCanvas.getContext('2d');
	var graphics = new PIXI.Graphics();
	
	var fac = pixiApp.screen.height/size.height;
	
	graphics.scale.x = fac;
	graphics.scale.y = fac;
	
	//ctx.fillStyle = 'black';
	//ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	
	graphics.beginFill(parseInt(tinycolor('darkgrey').toHex(),16));
	graphics.drawRect(0, 0, size.width, size.height);
	//mbCtx.fillStyle = 'darkgrey';
	//mbCtx.fillRect(0, 0, mandelbrotCanvas.width, mandelbrotCanvas.height);

	var fac = pixiApp.screen.height/size.height;
	
	//ctx.save();
	//ctx.scale(fac, fac);
	
	console.time("calculation time");
	
	var current = math.complex(0, 0);
	for(var y = 0; y < size.height; y++)
	{
		current.im = limits.top + ((y/size.height) * limits.height);
		for(var x = 0; x < size.width; x++)
		{
			current.re = limits.left + ((x/size.width) * limits.width);
			
			var res = isInMandelbrot(current, iterations);
			
			//console.log(current + " : " + res);
			
			var ratio = res / iterations;
			var grey = ratio * 255;
			var r = grey;
			var g = 0;
			var b = 255 - grey;
			
			var color = tinycolor.fromRatio({ h: 1-ratio, s: 1, v: ratio * 2 }).toHex();			
			graphics.beginFill(parseInt(color, 16));
			graphics.drawRect(x, y, 1, 1);
		}
	}

	console.timeEnd("calculation time");
	
	//ctx.drawImage(mbCtx.canvas, 0, 0);
	//ctx.restore();
	pixiApp.stage.addChild(graphics);
}

function drawPixiShader()
{	
	var redraw = false;
	if(pixiApp.screen.height != window.innerHeight || pixiApp.screen.width != window.innerWidth)
	{
		resizePixi();
		redraw = true;
	}

	var tmpIt = document.querySelector("#iterationsBox").value;
	var tmpScale = document.querySelector("#resolutionBox").value;
	
	if(!redraw && (tmpIt == iterations && tmpScale == mbScale))
	{
		return;
	}
	
	iterations = tmpIt;
	mbScale = tmpScale;
	
	var size = {};
	size.height = Math.abs(limits.height) * mbScale;
	size.width = Math.abs(limits.width) * mbScale;
	
	if(graphics != undefined)
		graphics.destroy();
	
	graphics = new PIXI.Graphics();
	
	graphics.cacheAsBitmap = true;
	
	//var fac = pixiApp.screen.height/size.height;
	
	pixiApp.stage.addChild(graphics);
	graphics.width = size.width;
	graphics.height = size.height;
	
	//graphics.scale.x = fac;
	//graphics.scale.y = fac;
	
	graphics.beginFill(parseInt(tinycolor('darkgrey').toHex(),16));
	graphics.drawRect(0, 0, size.width, size.height);
	
	// complex numbers: https://github.com/julesb/glsl-util/blob/master/complexvisual.glsl
	var fragSource = `
		
		precision mediump float;

		varying vec2 vTextureCoord;
		
		//limits.left = -2;
		//limits.top = 1;
		//limits.width = 3;
		//limits.height = -2;
		
		uniform vec4 limits;
		uniform vec2 dimension;
		uniform vec4 filterArea;
		
		vec2 mapCoord(vec2 coord)
		{
			coord *= filterArea.xy;
			coord += filterArea.zw;

			return coord;
		}

		vec2 unmapCoord(vec2 coord)
		{
			coord -= filterArea.zw;
			coord /= filterArea.xy;

			return coord;
		}
		
		vec2 cx_mul(vec2 a, vec2 b)
		{
			return vec2(a.x*b.x-a.y*b.y, a.x*b.y+a.y*b.x);
		}

		vec2 fx(vec2 z, vec2 c)
		{
			vec2 result = z;
			result = cx_mul(result, result);
			result += c;
			return result;
		}
		
		int isInMandelbrot(vec2 c)
		{
			vec2 tmp;
			
			for(int i = 0; i < 100; i++)
			{
				tmp = fx(tmp, c);
				
				//console.log(tmp + " with length of " + tmp.abs());
				
				if(length(tmp) > 2.0)
				{
					return i;
				}
			}
			
			return 100;
		}
		
		void main(){
			vec3 col = vec3(0.0);
			vec2 coords = vTextureCoord;
			coords = mapCoord(coords) / dimension;
			
			coords.x = limits.x + (coords.x * limits.z);
			coords.y = limits.y + (coords.y * limits.w);
			int its = isInMandelbrot(coords);
			col = vec3(float(its)/100.0);
			
			//col.r = coords.x;
			//col.g = coords.y;
			
			gl_FragColor = vec4(col,1.0);
		}
	`;
	
	var filter = new PIXI.Filter(null, fragSource);
	
	filter.apply = function(filterManager, input, output)
	{
	  this.uniforms.dimension[0] = input.sourceFrame.width
	  this.uniforms.dimension[1] = input.sourceFrame.height
    
	  //console.log(filterManager);
	  //console.log(input);
	  //console.log(output);
	  //
	  //debugger;
	  
	  // draw the filter...
	  filterManager.applyFilter(this, input, output);
	}
	
	filter.uniforms.limits[0] = limits.left;
	filter.uniforms.limits[1] = limits.top;
	filter.uniforms.limits[2] = limits.width;
	filter.uniforms.limits[3] = limits.height;
	
	graphics.filters = [filter];
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
