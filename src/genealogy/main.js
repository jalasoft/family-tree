var Genealogy = Genealogy || {};

Genealogy.constructFamilyTree = function(individual, config) {
    if (!(individual instanceof Genealogy.Individual)) {
      throw new TypeError("A starting person of a family tree must be an individual.");
    }

    var builder = new Genealogy.DiagramModelBuilder();
    individual.traverseAncestors(builder);
    
    var model = builder.model;
    Genealogy.diagram.topology.injectTopologyInfo(model);
    
    console.log(model);

    let svgDocument = Genealogy.diagram.renderer.render(model);

    return {
      el: svgDocument.svg,
      listeners: [],
      addSelectionListener: function(listener) {
        this.listeners.push(listener);
      }
    };
};
