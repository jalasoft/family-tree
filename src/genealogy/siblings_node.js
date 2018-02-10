Genealogy.internal.node = Genealogy.internal.node || {};

Genealogy.internal.node.IndividualWithSiblingsNode = function(individual_node) {
	if (!individual_node) {
		throw new TypeError("Individual must be defined.");
	}

	this.leader = individual_node;
	
	var siblingNodes = individual_node.individual.siblings.map(i => new Genealogy.internal.node.IndividualNode(i));
	this.all = [individual_node, ...siblingNodes];
};

//----------------------------------------------------------------------------------------------------------------------

Genealogy.internal.node.IndividualWithSiblingsNode.prototype.colors = (function() {
	var lineColor = "#e0e0eb";

	return {
		lineColor: "#e0e0eb"
	};
})();

Genealogy.internal.node.IndividualWithSiblingsNode.prototype.geometry = (function() {

	var gap = 10;
	var siblingConnectorLength = 30;
	

	return {
		gap: gap,
		siblingConnectorLength: siblingConnectorLength
	};
})();

Genealogy.internal.node.IndividualWithSiblingsNode.prototype.forEachNode = function(x, y, fn) {
 	var actualX = x;
 	this.all.forEach(function(individualNode) {
		fn.call(this, actualX, y, individualNode);

		const offset = individualNode.geometry.width + this.geometry.gap;
		actualX += offset;
	}.bind(this));

};

//----------------------------------------------------------------------------------------------------------------------

Genealogy.internal.node.IndividualWithSiblingsNode.prototype.render = function(pencil, x, y) {
	
	let previousCoordinates;

	this.forEachNode(x, y, function(x, y, node) {
		node.render(pencil, x, y);

		const coordinates = node.siblingsConnectorCoordinates(x, y);
		
		//vertical line
		pencil.line({
			x1: coordinates.x,
			y1: coordinates.y,
			x2: coordinates.x,
			y2: coordinates.y + this.geometry.siblingConnectorLength,
			stroke: this.colors.lineColor
		});

		//horizontal line
		if (previousCoordinates) {
			pencil.line({
				x1: previousCoordinates.x,
				y1: previousCoordinates.y + this.geometry.siblingConnectorLength,
				x2: coordinates.x,
				y2: coordinates.y + this.geometry.siblingConnectorLength,
				stroke: this.colors.lineColor
			});
		}

		previousCoordinates = coordinates;
	});
};