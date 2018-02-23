Genealogy.diagram.renderer = Genealogy.diagram.renderer || {};

Genealogy.diagram.renderer.render = function(model) {
	var nodeStyle = {
      node_size: 150,
    };

    var nodePosition = {
      x: 50,
      y: 50
    };
  
    var svgDocument =  new SVGPencil.SVGDocument({
          width: model.topology.width,
          height: model.topology.height
    });

    svgDocument.linearGradient({
      id: 'female',
      x1: 0,
      y1: 0,
      x2: 1,
      y2: 1,
      '0': '#ffb3b3',
      '100': 'white'
    });

    svgDocument.linearGradient({
      id: 'male',
      x1: 0,
      y1: 0,
      x2: 1,
      y2: 1,
      '0': '#66a3ff',
      '100': 'white'
    });


    model.forEachLayer(layer => {
    	layer.forEachUnion(union => {
    		union.forEachVertex(vertex => {
    			Genealogy.diagram.renderer.renderNode(svgDocument, vertex);
    		});
    		Genealogy.diagram.renderer.renderSiblingsConnections(svgDocument, union);
    	});
    });
    
/*
    var personalNode = new Genealogy.internal.node.IndividualNode(individual);
    
    var siblingsNode = new Genealogy.internal.node.IndividualWithSiblingsNode(personalNode);
    siblingsNode.render(svgDocument, 50, 50);
    */

    return svgDocument;
};


