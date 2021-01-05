const SVGPencil = (function(){

	const NS = "http://www.w3.org/2000/svg";
	const XlinkNS = "http://www.w3.org/1999/xlink";
	
	const initDocument = function(config) {
		//var parent = document.querySelector(config.el);
		var svg = document.createElementNS(NS, "svg");
		//parent.appendChild(svg);

		svg.setAttribute("xmlns", NS);
		svg.setAttribute("xmlns:xlink", XlinkNS);
		svg.setAttribute('width', config.width);
		svg.setAttribute('height', config.height);	
		//
		return svg;
	};	

	const attributesApplier = function applyAttributes(target, config) {
		Object.keys(config).forEach(k => {
				var value = config[k];
				target.setAttribute(k, value);
		});
	};

	return {
		SVGDocument: function(config) {
			this.NS = NS;
			this.XlinkNS = XlinkNS;
			this.applyAttributes = attributesApplier;
			this.svg = initDocument(config);

		}
	};
})();


SVGPencil.SVGDocument.prototype.rectangle = function(config) {

	var prim = document.createElementNS(this.NS, "rect");

	this.applyAttributes(prim, config);
	this.svg.appendChild(prim);

	return prim;
};

SVGPencil.SVGDocument.prototype.text = function(value, config) {
	var prim = document.createElementNS(this.NS, "text");

	this.applyAttributes(prim, config);

	var textNode = document.createTextNode(value);
	prim.appendChild(textNode);

	this.svg.appendChild(prim);
	return prim;
};

SVGPencil.SVGDocument.prototype.image = function(config) {
	var prim = document.createElementNS(this.NS, "image");

	this.applyAttributes(prim, config);
	this.svg.appendChild(prim);

	return prim;
};

SVGPencil.SVGDocument.prototype.linearGradient = function(config) {


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

	this.svg.insertAdjacentElement('afterbegin', gradientElement);
};

SVGPencil.SVGDocument.prototype.line = function(config) {

	var prim = document.createElementNS(this.NS, "line");
	this.applyAttributes(prim, config);

	this.svg.appendChild(prim);

	return prim;
};

