let input = document.getElementById("input");
let contentWrapper = document.getElementById('content-wrapper');

(
	async () => {
		await onchange();
		let canvas = document.getElementById('canvas');
		let image = await new CanvasImage(canvas);
		let buttonsWrapper = document.getElementById("buttons-wrapper");
		let optionsWrapper = document.getElementById("options-wrapper");
		let subOptionsWrapper = document.getElementById("sub-options-wrapper");
		let positionWrapper = document.getElementById("position-wrapper");
		let trimWrapper = document.getElementById("trim-wrapper");
		let trimSection = document.getElementById("trim-section");
		let trimBlock = document.getElementById("trim-block");
		let trimButton = document.getElementById("trim-button");
		let nameClass;
		let event_state = {};
		let original = image.originalSize;

		contentWrapper.classList.add('visible');
		image.resizeImage();

		window.onresize = function () {
			image.resizeImage();
		};

		function startResize(e) {
			e.preventDefault();
			e.stopPropagation();
			saveEventState(e);
			document.addEventListener('mousemove', resizing);
			document.addEventListener('mouseup', endResize);
		}

		function endResize(e) {
			e.preventDefault();
			document.removeEventListener('mouseup', endResize);
			document.removeEventListener('mousemove', resizing);
		}

		function saveEventState(e) {
			event_state.container_width = trimSection.clientWidth;
			event_state.container_height = trimSection.clientHeight;
			event_state.container_left = +trimSection.style.left.match(/\d*/)[0];
			event_state.container_top = +trimSection.style.top.match(/\d*/)[0];
			event_state.parent_left = trimWrapper.offsetLeft;
			event_state.parent_top = trimWrapper.offsetTop;
			event_state.mouse_x = (e.clientX || e.pageX) + window.scrollX;
			event_state.mouse_y = (e.clientY || e.pageY) + window.scrollY;
			event_state.evnt = e;
		}

		function resizing(e) {
			let mouse = {}, width, height, left, top;
			let min_width = 60;
			let min_height = 60;
			let max_width = trimWrapper.clientWidth;
			let max_height = trimWrapper.clientHeight;

			mouse.x = (e.clientX || e.pageX) + window.scrollX;
			mouse.y = (e.clientY || e.pageY) + window.scrollY;

			if (event_state.evnt.target.className.indexOf("trim-handle-se") !== -1) {
				width = mouse.x - (event_state.container_left + event_state.parent_left);
				height = mouse.y - (event_state.container_top + event_state.parent_top);
				left = event_state.container_left;
				top = event_state.container_top;
			} else if (event_state.evnt.target.className.indexOf("trim-handle-sw") !== -1) {
				width = event_state.container_width - (mouse.x - (event_state.container_left + event_state.parent_left));
				height = mouse.y - (event_state.container_top + event_state.parent_top);
				left = mouse.x - event_state.parent_left;
				top = event_state.container_top;
			} else if (event_state.evnt.target.className.indexOf("trim-handle-nw") !== -1) {
				width = event_state.container_width - (mouse.x - (event_state.container_left + event_state.parent_left));
				height = event_state.container_height - (mouse.y - (event_state.container_top + event_state.parent_top));
				left = mouse.x - event_state.parent_left;
				top = mouse.y - event_state.parent_top;
			} else if (event_state.evnt.target.className.indexOf("trim-handle-ne") !== -1) {
				width = mouse.x - (event_state.container_left + event_state.parent_left);
				height = event_state.container_height - (mouse.y - (event_state.container_top + event_state.parent_top));
				left = event_state.container_left;
				top = mouse.y - event_state.parent_top;
			}

			if (width >= min_width && height >= min_height && width <= max_width && height <= max_height) {
				trimSection.style.width = width + "px";
				trimSection.style.height = height + "px";
				trimSection.style.left = left + "px";
				trimSection.style.top = top + "px";

				if (top <= 0) {
					trimSection.style.top = 0 + "px";
					trimSection.style.height = (height + top) + "px";
				}
				if (left <= 0) {
					trimSection.style.left = 0 + "px";
					trimSection.style.width = (width + left) + "px";
				}
				if (height + top > max_height) {
					trimSection.style.height = (max_height - top) + "px";
				}
				if (width + left > max_width) {
					trimSection.style.width = (max_width - left) + "px";
				}
			}
		}

		function startMoving(e) {
			e.preventDefault();
			e.stopPropagation();
			saveEventState(e);
			document.addEventListener('mousemove', moving);
			document.addEventListener('mouseup', endMoving);
		}

		function endMoving(e) {
			e.preventDefault();
			document.removeEventListener('mouseup', endMoving);
			document.removeEventListener('mousemove', moving);
		}

		function moving(e) {
			let mouse = {}, left, top;
			let max_width = trimWrapper.clientWidth;
			let max_height = trimWrapper.clientHeight;
			let width = trimSection.clientWidth;
			let height = trimSection.clientHeight;
			e.preventDefault();
			e.stopPropagation();

			mouse.x = (e.clientX || e.pageX) + window.scrollX;
			mouse.y = (e.clientY || e.pageY) + window.scrollY;
			left = mouse.x - (event_state.mouse_x - event_state.container_left);
			top = mouse.y - (event_state.mouse_y - event_state.container_top);

			trimSection.style.left = left + "px";
			trimSection.style.top = top + "px";

			if (top <= 0) {
				trimSection.style.top = 0 + "px";
			}
			if (left <= 0) {
				trimSection.style.left = 0 + "px";
			}
			if (top + height > max_height) {
				trimSection.style.top = max_height - height + "px";
			}
			if (left + width > max_width) {
				trimSection.style.left = max_width - width + "px";
			}
		}

		optionsWrapper.addEventListener("click", function (ev) {

			if (ev.target.className.indexOf("icon-") !== -1) {
				nameClass = ev.target.className.substring(5);

				subOptionsWrapper.classList.add(nameClass);
				buttonsWrapper.classList.add('visible');
				optionsWrapper.classList.add('visible');

				if (subOptionsWrapper.className === 'trim') {
					trimWrapper.classList.add('visible');
					image.resizeImage();
				}
			}
		});

		buttonsWrapper.addEventListener("click", function (ev) {

			function resetValueInput() {
				let inputRange = document.getElementById(nameClass + 'Input');
				let outputRange = document.getElementById(nameClass + 'Output');

				if (inputRange !== null) {
					inputRange.value = 0;
					outputRange.innerHTML = "0";
				}
			}

			function hideSubOptionMenu() {
				subOptionsWrapper.classList.remove(nameClass);
				buttonsWrapper.classList.remove('visible');
				optionsWrapper.classList.remove('visible');
				trimWrapper.classList.remove('visible');
			}

			if (ev.target.className.indexOf("cancel") !== -1) {
				image.reset(original);
				image.originalSize = original;
				image.resizeImage();
				resetValueInput();
				hideSubOptionMenu();
			}

			if (ev.target.className.indexOf("save") !== -1) {
				let saveData = image.getData();

				image.originalSize = saveData;
				original = saveData;
				image.resizeImage();
				resetValueInput();
				hideSubOptionMenu();
			}

			if (ev.target.className.indexOf("download") !== -1) {
				let downloadBlock = document.getElementById("download");
				let downloadImage = canvas.toDataURL(image.image.type);
				let downloadLink = document.getElementById("download-link");

				downloadLink.href = downloadImage;
				downloadLink.setAttribute("download", image.image.use);
				downloadLink.click();
			}
		});

		subOptionsWrapper.addEventListener('input', function (ev) {
			let algorithm, result;
			let coef = ev.target.value;

			switch (nameClass) {
				case 'blur':
					algorithm = new GaussBlur(image.rgbPixels(image.originalSize), original);
					result = algorithm.gaussBlur((coef * 0.1) * 5);
					image.colorPixels(result, image.originalSize);
					break;
				case 'contrast':
					image.transform(image.contrastFilter, (coef * 12.8));
					break;
				case 'brightness':
					image.transform(image.brightnessFilter, (coef * 12.8));
					break;
				case 'sharpness':
					let factor = (coef * 0.2);
					let sharpness = [
						[0, -factor, 0],
						[-factor, 4 * factor + 1, -factor],
						[0, -factor, 0]
					];
					image.convolve(sharpness, 0, 0);
					break;
				case 'invert':
					image.transform(image.invertFilter, (coef * 0.1));
					break;
				case 'saturate':
					image.transform(image.saturateFilter, (coef * 0.1));
					break;
				case 'sepia':
					image.transform(image.sepiaFilter, (coef * 0.1));
					break;
				case 'grayscale':
					image.transform(image.greyScaleFilter, (coef * 0.1));
					break;
				default:
					break;
			}
		});

		positionWrapper.addEventListener("click", function (ev) {
			const canvas = document.getElementById("canvas");
			const width = canvas.width;
			const height = canvas.height;
			const src = new Uint32Array(image.originalSize.data.buffer);
			const nameClass = ev.target.className.substring(5);

			switch (nameClass) {
				case 'rotate-left':
					image.processCanvas(height, width, function (dst) {
						let newWidth = height;
						let newHeight = width;
						for (let y = 0; y < newHeight; y++) {
							for (let x = 0; x < newWidth; x++) {
								dst[y * newWidth + x] = src[x * width + (width - y - 1)];
							}
						}
					});
					break;
				case 'rotate-right':
					image.processCanvas(height, width, function (dst) {
						let newWidth = height;
						let newHeight = width;
						for (let y = 0; y < newHeight; y++) {
							for (let x = 0; x < newWidth; x++) {
								dst[y * newWidth + x] = src[(height - x - 1) * width + y];
							}
						}
					});
					break;
				case 'flip-horizontal':
					image.processCanvas(width, height, function (dst) {
						for (let y = 0; y < height; y++) {
							for (let x = 0; x < width; x++) {
								dst[y * width + x] = src[y * width + (width - x - 1)];
							}
						}
					});
					break;
				case 'flip-vertical':
					image.processCanvas(width, height, function (dst) {
						for (let y = 0; y < height; y++) {
							for (let x = 0; x < width; x++) {
								dst[y * width + x] = src[(height - y - 1) * width + x];
							}
						}
					});
					break;
				default:
					break;
			}
			image.resizeImage();
		});

		trimButton.addEventListener("click", function () {
			let scale = (+canvas.style.transform.match(/\d+\.*\d*/)[0]);
			let width = +trimSection.style.width.match(/\d*/)[0] / scale,
				height = +trimSection.style.height.match(/\d*/)[0] / scale,
				left = +trimSection.style.left.match(/\d*/)[0] / scale,
				top = +trimSection.style.top.match(/\d*/)[0] / scale;

			let trimImage = canvas.getContext("2d").getImageData(left, top, width, height);
			canvas.width = width;
			canvas.height = height;
			canvas.getContext("2d").putImageData(trimImage, 0, 0);
			image.resizeImage();
		});

		trimSection.addEventListener("mousedown", startResize);
		trimBlock.addEventListener("mousedown", startMoving);
	}
)();

async function onchange() {
	return new Promise(resolve => {
		input.onchange = () => {
			resolve(true)
		};
	})
}

class CanvasImage {
	constructor(canvas) {
		this.context = canvas.getContext('2d');
		this.image = new Image();
		this.canvas = canvas;

		return (async () => {
			await this.initImage();
			return new Promise(resolve => resolve(this))
		})()
	}

	async initImage() {
		await this.srcImage();
		return new Promise((resolve) => {
			this.image.onload = () => {
				this.canvas.width = this.image.width;
				this.canvas.height = this.image.height;
				this.context.drawImage(this.image, 0, 0, this.image.width, this.image.height);
				this.originalSize = this.getData();
				resolve(true)
			};
		})
	}

	async srcImage() {
		let file = input.files[0];
		let reader = new FileReader();
		reader.readAsDataURL(file);

		return new Promise((resolve) => {
			reader.onload = () => {
				let parts = file.name.split('.');

				this.image.src = reader.result;
				this.image.type = file.type;
				this.image.use = parts[0];
				resolve(true)
			};
		})
	};

	getData() {
		return this.context.getImageData(0, 0, this.context.canvas.width, this.context.canvas.height);
	};

	setData(data) {
		return this.context.putImageData(data, 0, 0);
	};

	reset(original) {
		let reset = this.rgbPixels(original);
		this.colorPixels(reset, original);
	};

	convolve(matrix, divisor, offset) {
		let olddata = this.originalSize;
		let oldpx = olddata.data;
		let newdata = this.context.createImageData(olddata);
		let newpx = newdata.data;
		let len = newpx.length;
		let res = 0;
		let w = this.originalSize.width;
		let m = [].concat(matrix[0], matrix[1], matrix[2]);

		if (!divisor) {
			divisor = m.reduce(function (a, b) {
				return a + b;
			}) || 1;
		}

		for (let i = 0; i < len; i++) {
			if ((i + 1) % 4 === 0) {
				newpx[i] = oldpx[i];
				continue;
			}
			res = 0;
			let these = [
				oldpx[i - w * 4 - 4] || oldpx[i],
				oldpx[i - w * 4] || oldpx[i],
				oldpx[i - w * 4 + 4] || oldpx[i],
				oldpx[i - 4] || oldpx[i],
				oldpx[i],
				oldpx[i + 4] || oldpx[i],
				oldpx[i + w * 4 - 4] || oldpx[i],
				oldpx[i + w * 4] || oldpx[i],
				oldpx[i + w * 4 + 4] || oldpx[i]
			];
			for (let j = 0; j < 9; j++) {
				res += these[j] * m[j];
			}
			res /= divisor;
			if (offset) {
				res += offset;
			}
			newpx[i] = res;
		}
		this.setData(newdata);
	};

	transform(fn, factor) {
		let olddata = this.originalSize;
		let oldpx = olddata.data;
		let newdata = this.context.createImageData(olddata);
		let newpx = newdata.data;
		let res = [];
		let len = newpx.length;
		for (let i = 0; i < len; i += 4) {
			res = fn.call(this, oldpx[i], oldpx[i + 1], oldpx[i + 2], oldpx[i + 3], factor, i);
			newpx[i] = res[0];
			newpx[i + 1] = res[1];
			newpx[i + 2] = res[2];
			newpx[i + 3] = res[3];
		}
		this.setData(newdata);
	}

	greyScaleFilter(r, g, b, a, factor) {
		let avg = 0.3 * r + 0.59 * g + 0.11 * b;
		return [avg * factor + r * (1 - factor), avg * factor + g * (1 - factor), avg * factor + b * (1 - factor), 255];
	}

	saturateFilter(r, g, b, a, factor) {
		let avg = 0.3 * r + 0.59 * g + 0.11 * b;
		r = -avg * factor + r * (1 + factor);
		g = -avg * factor + g * (1 + factor);
		b = -avg * factor + b * (1 + factor);

		if (r > 255) r = 255;
		if (g > 255) g = 255;
		if (b > 255) b = 255;
		if (r < 0) r = 0;
		if (g < 0) g = 0;
		if (b < 0) b = 0;

		return [r, g, b, 255];
	}

	sepiaFilter(r, g, b, a, factor) {
		let avg = 0.3 * r + 0.59 * g + 0.11 * b;
		return [(avg * factor + r * (1 - factor)) + (100 * factor), (avg * factor + g * (1 - factor)) + (50 * factor), avg * factor + b * (1 - factor), 255];
	}

	invertFilter(r, g, b, a, factor) {
		return [r * (1 - factor) + (255 - r) * factor, g * (1 - factor) + (255 - g) * factor, b * (1 - factor) + (255 - b) * factor, 255];
	}

	contrastFilter(r, g, b, a, factor) {
		let contrast = (259 * (factor + 255)) / (255 * (259 - factor));
		return [contrast * (r - 128) + 128, contrast * (g - 128) + 128, contrast * (b - 128) + 128, 255];
	}

	brightnessFilter(r, g, b, a, factor) {
		r += factor;
		g += factor;
		b += factor;

		if (r > 255) r = 255;
		if (g > 255) g = 255;
		if (b > 255) b = 255;
		if (r < 0) r = 0;
		if (g < 0) g = 0;
		if (b < 0) b = 0;

		return [r, g, b, 255];
	}

	processCanvas(width, height, func) {
		const canvas = document.getElementById("canvas");
		canvas.width = width;
		canvas.height = height;
		const ctx = this.canvas.getContext('2d');
		const outImg = ctx.createImageData(width, height);
		const dst = new Uint32Array(outImg.data.buffer);
		func(dst);
		this.originalSize = outImg;
		ctx.putImageData(outImg, 0, 0);
	}

	trimSetSize(canvas) {
		let trimWrapper = document.getElementById("trim-wrapper");
		let trimSection = document.getElementById("trim-section");
		let scale = (+canvas.style.transform.match(/\d+\.*\d*/)[0]);

		if (trimWrapper.className === "visible") {
			trimWrapper.style.width = canvas.width.toString() * scale + "px";
			trimWrapper.style.height = canvas.height.toString() * scale + "px";
			trimSection.style.width = canvas.width.toString() * scale + "px";
			trimSection.style.height = canvas.height.toString() * scale + "px";
			trimSection.style.left = 0 + "px";
			trimSection.style.top = 0 + "px";
		}
	}

	resizeImage() {
		let canvas = this.canvas;
		let landscape = this.canvas.parentElement;
		let scaleWidth = (landscape.offsetWidth - 20) / canvas.offsetWidth;
		let scaleHeight = (landscape.offsetHeight - 20) / canvas.offsetHeight;

		if (canvas.offsetWidth > canvas.offsetHeight) {
			this.checkSizeImage(landscape.offsetWidth, landscape.offsetHeight, canvas.offsetWidth, canvas.offsetHeight, scaleWidth, scaleHeight);
		} else {
			this.checkSizeImage(landscape.offsetHeight, landscape.offsetWidth, canvas.offsetHeight, canvas.offsetWidth, scaleHeight, scaleWidth);
		}

		this.trimSetSize(this.canvas);
	};

	checkSizeImage(landscapeParamOne, landscapeParamTwo, canvasParamOne, canvasParamTwo, scaleParamOne, scaleParamTwo) {
		if (landscapeParamOne <= canvasParamOne) {
			this.canvas.style.transform = "scale(" + scaleParamOne + "," + scaleParamOne + ")";

			if (landscapeParamTwo <= canvasParamTwo * scaleParamOne) {
				this.canvas.style.transform = "scale(" + scaleParamTwo + "," + scaleParamTwo + ")";
			}
		} else {
			this.canvas.style.transform = "scale(1)";
		}
	}

	opacityPixels() {
		const opacity = [];

		let data = this.originalSize;
		let dataPx = data.data;

		for (let i = 0; i < dataPx.length; i += 4) {
			opacity.push(dataPx[i + 3]);
		}

		return opacity;
	}

	generateMatrix() {
		let vector = this.rgbPixels();

		return vector.reduce((prev, cur, i, a) => !(i % this.data.width) ? prev.concat([a.slice(i, i + this.data.width)]) : prev, []);
	};

	rgbPixels(original) {
		let redMas = [];
		let greenMas = [];
		let blueMas = [];
		let canvas = document.getElementById("canvas");
		canvas.width = original.width;
		canvas.height = original.height;

		let data = original;
		let dataPx = data.data;

		for (let i = 0; i < dataPx.length; i += 4) {
			redMas.push(dataPx[i]);
			greenMas.push(dataPx[i + 1]);
			blueMas.push(dataPx[i + 2]);
		}

		return {
			r: redMas,
			g: greenMas,
			b: blueMas
		}
	}

	colorPixels(dataPx, original) {
		let rY = dataPx.r;
		let gY = dataPx.g;
		let bY = dataPx.b;
		let opacity = this.opacityPixels();

		let olddata = original;
		let newdata = this.context.createImageData(olddata);
		let newpx = newdata.data;

		for (let i = 0, j = 0; i < newpx.length; i += 4, j++) {
			newpx[i] = rY[j];
			newpx[i + 1] = gY[j];
			newpx[i + 2] = bY[j];
			newpx[i + 3] = opacity[j];
		}
		this.setData(newdata);
	}

}

class EqualizationHistogram {
	constructor(data, size) {
		this.data = data;
		this.width = size.width;
		this.height = size.height;
		this.colorYUV = this.convertRGBtoYUV();
		this.histogram = this.histogramImage(this.colorYUV);
	}

	convertRGBtoYUV() {
		let Y = [];
		let U = [];
		let V = [];
		let totalPixels = this.width * this.height;
		let rY = this.data.r;
		let gY = this.data.g;
		let bY = this.data.b;

		for (let i = 0; i < totalPixels; i++) {
			Y[i] = 0.2126 * rY[i] + 0.7152 * gY[i] + 0.0722 * bY[i];
			U[i] = -0.0999 * rY[i] - 0.3360 * gY[i] + 0.4360 * bY[i];
			V[i] = 0.6150 * rY[i] - 0.5586 * gY[i] - 0.0563 * bY[i];
		}

		return {
			y: Y,
			u: U,
			v: V
		}
	}

	convertYUVtoRGB(y) {
		let R = [];
		let G = [];
		let B = [];
		let totalPixels = this.width * this.height;
		let Y = y;
		let U = this.colorYUV.u;
		let V = this.colorYUV.v;

		for (let i = 0; i < totalPixels; i++) {
			R[i] = Math.abs(Math.round(Y[i] + 1.2803 * V[i]));
			G[i] = Math.abs(Math.round(Y[i] - 0.2148 * U[i] - 0.3805 * V[i]));
			B[i] = Math.abs(Math.round(Y[i] + 2.1279 * U[i]));
		}

		return {
			r: R,
			g: G,
			b: B
		}
	}

	histogramImage(data) {
		let brightness = data.y;

		let histogram = brightness.reduce((acc, el) => {
			let pixel = Math.round(el);

			acc[pixel] = (acc[pixel] || 0) + 1;

			return acc;
		}, {});

		return histogram;
	}

	cdf(histogram) {
		let cdf = [];

		let sum = Object.keys(histogram).reduce((res, key) => {
			cdf.push(res);

			return res + histogram[key];
		}, 0);

		cdf.shift();
		cdf.push(sum);

		return cdf;
	}

	cdfMin(histogram) {
		let histogramValues = Object.values(histogram);
		let minValue = Math.min(...histogramValues);
		let minValuesObj = {};

		Object.keys(histogram).forEach(function (key) {
			if (histogram[key] !== minValue) {
				minValuesObj[key] = histogram[key];
			}
		});

		let histogramKeys = Object.keys(minValuesObj);
		let minKey = Math.min(...histogramKeys);

		return minValuesObj[minKey]
	}

	equalizationHistogram() {
		let brightness = this.colorYUV.y;
		let histogram = this.histogram;
		let cdf = this.cdf(histogram);
		let cdfMin = this.cdfMin(histogram);
		let totalPixels = this.width * this.height;
		let pixelValues = cdf.map(value => Math.abs(Math.round(((value - cdfMin) / (totalPixels - 1)) * 255)));

		Object.keys(histogram).forEach(function (key, i) {
			histogram[key] = pixelValues[i];
		});

		let y = brightness.map(function (value) {
			let pixelBrightness = Math.abs(Math.round(value));

			pixelBrightness = histogram[pixelBrightness];

			return pixelBrightness
		});

		let result = this.convertYUVtoRGB(y);

		return result;
	}
}

class GaussBlur {
	constructor(data, size) {
		this.data = data;
		this.width = size.width;
		this.height = size.height;
	}

	boxesForGauss(sigma) {
		let n = 3;
		let wIdeal = Math.sqrt((12 * sigma * sigma / n) + 1);
		let wl = Math.floor(wIdeal);
		if (wl % 2 == 0) wl--;
		let wu = wl + 2;

		let mIdeal = (12 * sigma * sigma - n * wl * wl - 4 * n * wl - 3 * n) / (-4 * wl - 4);
		let m = Math.round(mIdeal);

		let sizes = [];
		for (let i = 0; i < n; i++) sizes.push(i < m ? wl : wu);
		return sizes;
	}

	gaussBlur(radius) {
		let tmpMas = [];
		let bxs = this.boxesForGauss(radius);

		for (let key in this.data) {
			if (this.data.hasOwnProperty(key)) {
				this.boxBlur(this.data[key], tmpMas, this.width, this.height, (bxs[0] - 1) / 2);
				this.boxBlur(tmpMas, this.data[key], this.width, this.height, (bxs[1] - 1) / 2);
				this.boxBlur(this.data[key], tmpMas, this.width, this.height, (bxs[2] - 1) / 2);
			}
		}

		return this.data;
	}

	boxBlur(dataMas, tmpMas, width, height, radius) {
		for (let i = 0; i < dataMas.length; i++) tmpMas[i] = dataMas[i];

		this.boxBlurH(tmpMas, dataMas, width, height, radius);
		this.boxBlurT(dataMas, tmpMas, width, height, radius);
	}

	boxBlurH(dataMas, tmpMas, width, height, radius) {
		let iarr = 1 / (radius + radius + 1);

		for (let i = 0; i < height; i++) {
			let ti = i * width, li = ti, ri = ti + radius;
			let fv = dataMas[ti], lv = dataMas[ti + width - 1], val = (radius + 1) * fv;

			for (let j = 0; j < radius; j++) {
				val += dataMas[ti + j];
			}

			for (let j = 0; j <= radius; j++) {
				val += dataMas[ri++] - fv;
				tmpMas[ti++] = Math.round(val * iarr);
			}

			for (let j = radius + 1; j < width - radius; j++) {
				val += dataMas[ri++] - dataMas[li++];
				tmpMas[ti++] = Math.round(val * iarr);
			}

			for (let j = width - radius; j < width; j++) {
				val += lv - dataMas[li++];
				tmpMas[ti++] = Math.round(val * iarr);
			}
		}
	}

	boxBlurT(dataMas, tmpMas, width, height, radius) {
		let iarr = 1 / (radius + radius + 1);

		for (let i = 0; i < width; i++) {
			let ti = i, li = ti, ri = ti + radius * width;
			let fv = dataMas[ti], lv = dataMas[ti + width * (height - 1)], val = (radius + 1) * fv;

			for (let j = 0; j < radius; j++) {
				val += dataMas[ti + j * width];
			}

			for (let j = 0; j <= radius; j++) {
				val += dataMas[ri] - fv;
				tmpMas[ti] = Math.round(val * iarr);
				ri += width;
				ti += width;
			}

			for (let j = radius + 1; j < height - radius; j++) {
				val += dataMas[ri] - dataMas[li];
				tmpMas[ti] = Math.round(val * iarr);
				li += width;
				ri += width;
				ti += width;
			}

			for (let j = height - radius; j < height; j++) {
				val += lv - dataMas[li];
				tmpMas[ti] = Math.round(val * iarr);
				li += width;
				ti += width;
			}
		}
	}
}