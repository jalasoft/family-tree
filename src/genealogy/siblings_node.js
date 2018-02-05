Genealogy.internal.node = Genealogy.internal.node || {};

Genealogy.internal.node.SiblingsNode = function(individual_node) {
	if (!individual_node) {
		throw new TypeError("Individual must be defined.");
	}

	this.leader = individual_node;
	
	var siblingNodes = individual_node.individual.siblings.map(i => new Genealogy.internal.node.IndividualNode(i));
	this.all = [individual_node, ...siblingNodes];
};

Genealogy.internal.node.SiblingsNode.prototype.colors = (function() {
	var lineColor = "#e0e0eb";

	return {
		lineColor: "#e0e0eb"
	};
})();

Genealogy.internal.node.SiblingsNode.prototype.sizes = (function() {

	var gap = 10;
	var siblingConnectorLength = 30;
	

	return {
		gap: gap,
		siblingConnectorLength: siblingConnectorLength,
		lineColor: "#e0e0eb"
	};
})();

Genealogy.internal.node.SiblingsNode.prototype.render = function(pencil, x, y) {
	var actualX = x;
	var previousLineCoordinates;

	this.all.forEach(i => {
		i.render(pencil, actualX, y);
		const lineCoordinates = this.renderSiblingConnector(pencil, actualX, y, i);

		if (previousLineCoordinates) {
			this.renderSiblingConnectorConnection(pencil, lineCoordinates, previousLineCoordinates);
		}

		previousLineCoordinates = lineCoordinates;
		actualX += i.width + this.sizes.gap;
	});
};

Genealogy.internal.node.SiblingsNode.prototype.renderSiblingConnector = function(pencil, x, y, individual_node) {

	var coordinates = individual_node.siblingsConnectorCoordinates(x, y);

	var lineCoordinates = {
		x1: coordinates.x,
		y1: coordinates.y,
		x2: coordinates.x,
		y2: coordinates.y + this.sizes.siblingConnectorLength
	};

	pencil.line({
		x1: lineCoordinates.x1,
		y1: lineCoordinates.y1,
		x2: lineCoordinates.x2,
		y2: lineCoordinates.y2,
		stroke: this.colors.lineColor
	});

	return lineCoordinates;
};

Genealogy.internal.node.SiblingsNode.prototype.renderSiblingConnectorConnection = function(pencil, lineCoordinates, previousLineCoordinates) {
	pencil.line({
		x1: previousLineCoordinates.x2,
		y1: previousLineCoordinates.y2,
		x2: lineCoordinates.x2,
		y2: lineCoordinates.y2,
		stroke: this.colors.lineColor
	});
};