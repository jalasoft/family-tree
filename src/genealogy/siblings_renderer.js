Genealogy.diagram.renderer.renderSiblingsConnections = (function() {

	function renderVertexConnectors(svgDocument, union) {
		union.forEachVertex(vertex => {
			svgDocument.line({
				x1: vertex.topology.nextLayerConnector.x,
				y1: vertex.topology.nextLayerConnector.y,
				x2: vertex.topology.nextLayerConnector.x,
				y2: union.topology.nextLayerConnector.y,
				stroke: "#e0e0eb"
			});
		});
	}

	function renderSiblingConnection(svgDocument, union) {
		if (union.isSingle()) {
			return;
		}

		let previousVertex;
		union.forEachVertex(vertex => {
			if (!previousVertex) {
				previousVertex = vertex;
				return;
			}

			svgDocument.line({
				x1: previousVertex.topology.nextLayerConnector.x,
				y1: union.topology.nextLayerConnector.y,
				x2: vertex.topology.nextLayerConnector.x,
				y2: union.topology.nextLayerConnector.y,
				stroke: "#e0e0eb"
			});

			previousVertex = vertex;
		});
	}

	return function(svgDocument, union) {
		renderVertexConnectors(svgDocument, union);
		renderSiblingConnection(svgDocument, union);
	};
})();