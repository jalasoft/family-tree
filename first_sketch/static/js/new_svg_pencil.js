const SVGPencil = (function(){

	const NS = "http://www.w3.org/2000/svg";
	const XlinkNS = "http://www.w3.org/1999/xlink";
	
	const createRootElement = function(config) {

		const svg = document.createElementNS(NS, "svg");

		svg.setAttribute("xmlns", NS);
		svg.setAttribute("xmlns:xlink", XlinkNS);
		
		if (config.width && config.height) {
			svg.setAttribute('width', config.width);
			svg.setAttribute('height', config.height);	
		}

		if (config.viewBox) {
			svg.setAttribute('viewBox', config.viewBox);
		}
		return svg;
	};	

	const attributesApplier = function applyAttributes(target, config) {
		Object.keys(config).forEach(k => {
				var value = config[k];
				target.setAttribute(k, value);
		});
	};

	return function(config) {
		if (this === window) {
			throw new Error("SVGPencil must be created wtih new keyword.");
		}

		this.NS = NS;
		this.XlinkNS = XlinkNS;
		this.applyAttributes = attributesApplier;
		this.el = createRootElement(config);
	};
})();


SVGPencil.prototype.rectangle = function(config) {

	var prim = document.createElementNS(this.NS, "rect");

	this.applyAttributes(prim, config);
	this.el.appendChild(prim);

	return prim;
};

SVGPencil.prototype.circle = function(config) {

	const elm = document.createElementNS(this.NS, "circle");

	this.applyAttributes(elm, config);
	this.el.appendChild(elm);

	return this;
}

SVGPencil.prototype.text = function(value, config) {
	var prim = document.createElementNS(this.NS, "text");

	this.applyAttributes(prim, config);

	var textNode = document.createTextNode(value);
	prim.appendChild(textNode);

	this.el.appendChild(prim);
	return prim;
};

SVGPencil.prototype.image = function(config) {
	var prim = document.createElementNS(this.NS, "image");

	this.applyAttributes(prim, config);
	this.el.appendChild(prim);

	return prim;
};

SVGPencil.prototype.linearGradientDef = function(config) {

	/*
	if (!this.defs) {
		this.defs = document.createElement("defs");
		this.el.insertAdjacentElement('afterbegin', this.defs);
	}*/

	var gradientElement = document.createElementNS(this.NS, "linearGradient");

	gradientElement.setAttribute("id", config.id);

	if (Number.isInteger(config.x1) && 
		Number.isInteger(config.x2) && 
		Number.isInteger(config.y1) && 
		Number.isInteger(config.y2)) {
		
		gradientElement.setAttribute("x1", config.x1);
		gradientElement.setAttribute("y1", config.y1);
		gradientElement.setAttribute("x2", config.x2);
		gradientElement.setAttribute("y2", config.y2);
	}

	Object.keys(config).map(k => parseInt(k)).filter(k => !isNaN(k)).forEach(stop => {
		var stopElement = document.createElementNS(this.NS, "stop");
		stopElement.setAttribute("offset", stop + "%");
		stopElement.setAttribute("stop-color", config[stop]);

		gradientElement.appendChild(stopElement);
	});

	//this.defs.appendChild(gradientElement);
	this.el.insertAdjacentElement('afterbegin', gradientElement);
	return this;
};

SVGPencil.prototype.line = function(config) {

	var prim = document.createElementNS(this.NS, "line");
	this.applyAttributes(prim, config);

	this.el.appendChild(prim);

	return prim;
};

