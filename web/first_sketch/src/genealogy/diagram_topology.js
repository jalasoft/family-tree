Genealogy.diagram.topology = Genealogy.diagram.topology || {};
Genealogy.diagram.topology.injector = Genealogy.diagram.topology.injector || {};

Genealogy.diagram.topology.injectTopologyInfo = function(model) {

	model.topology = {};

	Genealogy.diagram.topology.injector.injectCanvasWidth(model);
	Genealogy.diagram.topology.injector.injectCanvasHeight(model);
	Genealogy.diagram.topology.injector.injectSizeToUnions(model);
	Genealogy.diagram.topology.injector.injectSizeToVertices(model);
	Genealogy.diagram.topology.injector.injectYPositionToUnions(model);
	Genealogy.diagram.topology.injector.injectXPositionToUnions(model);
	Genealogy.diagram.topology.injector.injectYPositionToVertices(model);
	Genealogy.diagram.topology.injector.injectXPositionToVertices(model);
	Genealogy.diagram.topology.injector.injectNextLayerConnectorCoordinatesToVertices(model);
	Genealogy.diagram.topology.injector.injectNextLayerConnectorCoordinatesToUnions(model);

	return model;
};

Genealogy.diagram.topology.injector.geometry = {
	vertexHorizontalSeparator: 10,
	vertexVerticalSeparator: 40, 
	vertextWidth: 150,
	vertexHeight: 150 * 1.04,
	unionSiblingsConnectionHeight: 20
};

Genealogy.diagram.topology.injector.injectCanvasWidth = function(model) {

	var sizes = model.layers.map(l => l.size());
	var maxSize = Math.max(...sizes);

	var verticesTotalWidth = maxSize * Genealogy.diagram.topology.injector.geometry.vertextWidth;
	var gaps = (maxSize - 1) * Genealogy.diagram.topology.injector.geometry.vertexHorizontalSeparator;

	var totalWidth = verticesTotalWidth + gaps;

	model.topology.width = totalWidth;
};

Genealogy.diagram.topology.injector.injectCanvasHeight = function(model) {
	var layersHeight = model.layers.length * Genealogy.diagram.topology.injector.geometry.vertexHeight;
	var gapsHeight = model.layers.length * Genealogy.diagram.topology.injector.geometry.vertexVerticalSeparator;

	var totalHeight = layersHeight + gapsHeight;

	model.topology.height = totalHeight;
};

Genealogy.diagram.topology.injector.injectSizeToUnions = function(model) {
	model.forEachLayer(layer => {

		layer.forEachUnion(union => {
			let vertexWidthSum = union.vertexCount() * Genealogy.diagram.topology.injector.geometry.vertextWidth;
			let gapWidthSum = (union.vertexCount() - 1) * Genealogy.diagram.topology.injector.geometry.vertexHorizontalSeparator;
			let totalWidth = vertexWidthSum + gapWidthSum;

			union.topology = union.topology || {};
			union.topology.width = totalWidth;
			union.topology.height = Genealogy.diagram.topology.injector.geometry.vertexHeight;
		});
	});
};

Genealogy.diagram.topology.injector.injectYPositionToUnions = function(model) {
	model.forEachLayer((layer, index) => {
		let height = index * Genealogy.diagram.topology.injector.geometry.vertexHeight;
		let gaps = index * Genealogy.diagram.topology.injector.geometry.vertexVerticalSeparator;

		let totalY = height + gaps;

		layer.forEachUnion(union => {
			union.topology.y = totalY;
		});
	});
};

Genealogy.diagram.topology.injector.injectXPositionToUnions = function(model) {
	model.forEachLayer((layer, index) => {
		let previousUnion;
		layer.forEachUnion(union => {
			if (!previousUnion) {
				union.topology.x = 0;
			} else {
				let x = previousUnion.topology.x + previousUnion.topology.width + Genealogy.diagram.topology.injector.geometry.vertexHorizontalSeparator;
				union.topology.x = x;
			}
			previousUnion = union;
		});
	});
};

Genealogy.diagram.topology.injector.injectSizeToVertices = function(model) {
	model.forEachLayer(layer => {
		layer.forEachUnion(union => {
			union.forEachVertex(vertex => {
				vertex.topology = {};
				vertex.topology.width = Genealogy.diagram.topology.injector.geometry.vertextWidth;
				vertex.topology.height = Genealogy.diagram.topology.injector.geometry.vertexHeight;
			});
		});
	});
};

Genealogy.diagram.topology.injector.injectYPositionToVertices = function(model) {
	model.forEachLayer(layer => {
		layer.forEachUnion(union => {
			union.forEachVertex(vertex => {
				vertex.topology.y = union.topology.y;
			});
		});
	});
};

Genealogy.diagram.topology.injector.injectXPositionToVertices = function(model) {
	model.forEachLayer(layer => {
		layer.forEachUnion(union => {
			union.forEachVertex((vertex, index) => {

				let relativeX = index * vertex.topology.width;
				let gap = index * Genealogy.diagram.topology.injector.geometry.vertexHorizontalSeparator;
				let x = union.topology.x + relativeX + gap;
				vertex.topology.x = x;
			});
		});
	});
};

Genealogy.diagram.topology.injector.injectNextLayerConnectorCoordinatesToVertices = function(model) {
	model.forEachLayer(layer => {
		layer.forEachUnion(union => {
			union.forEachVertex(vertex => {
				let x = vertex.topology.x + (vertex.topology.width / 2);
				let y = vertex.topology.y + vertex.topology.height;
				vertex.topology.nextLayerConnector = {};
				vertex.topology.nextLayerConnector.x = x;
				vertex.topology.nextLayerConnector.y = y;
			});
		});
	});
};


Genealogy.diagram.topology.injector.injectNextLayerConnectorCoordinatesToUnions = function(model) {
	model.forEachLayer(layer => {
		layer.forEachUnion(union => {
			let x = union.topology.x + (union.topology.width / 2);
			let y = union.topology.y + union.topology.height + Genealogy.diagram.topology.injector.geometry.unionSiblingsConnectionHeight;
			union.topology.nextLayerConnector = {};
			union.topology.nextLayerConnector.x = x;
			union.topology.nextLayerConnector.y = y;
		});
	});
};