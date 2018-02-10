  
  
  Genealogy.constructFamilyTree = function(individual, config) {
    if (!(individual instanceof Genealogy.internal.Individual)) {
      throw new TypeError("A starting person of a family tree must be an individual.");
    }

    var nodeStyle = {
      node_size: 150,
    };

    var nodePosition = {
      x: 50,
      y: 50
    };
  
    var painter =  new SVGPainter.SVGDocument({
          width: config.width,
          height: config.height,
          el: config.el
        });

    painter.linearGradient({
      id: 'female',
      x1: 0,
      y1: 0,
      x2: 1,
      y2: 1,
      '0': '#ffb3b3',
      '100': 'white'
    });

    painter.linearGradient({
      id: 'male',
      x1: 0,
      y1: 0,
      x2: 1,
      y2: 1,
      '0': '#66a3ff',
      '100': 'white'
    });


    var personalNode = new Genealogy.internal.node.IndividualNode(individual);
    
    var siblingsNode = new Genealogy.internal.node.IndividualWithSiblingsNode(personalNode);
    siblingsNode.render(painter, 50, 50);

    /*
    Genealogy.internal.renderer.render(painter, individual, nodeStyle, nodePosition);
    */
    /*
    let walker = new Genealogy.internal.renderer.Walker();
    individual.walk(walker);
    let buckets = walker.buckets;
    console.log(buckets);
*/
    return {
      el: painter.svg,
      listeners: [],
      addSelectionListener: function(listener) {
        this.listeners.push(listener);
      }
    };
};

  //-------------------------------------------------------------------------------------------------------------

  Genealogy.internal.renderer = {};

  Genealogy.internal.renderer.TopologyFactory = (function() {
    
    var newVertex = function(individual, isLead) {
        return new HierarchyDiagram.Vertex({
          name: individual.name,
          surname: individual.surname,
          birth: individual.birth,
          decease: individual.decease,
          gender: individual.gender
        }, isLead);
    };

    var newUnion = function(individual, level) {
        var vertex = newVertex(individual, true); 
        var siblingVertices = individual.siblings.map(s => newVertex(s, false));
            
        return new HierarchyDiagram.Union([vertex, ...siblingVertices]);
    };

    return function () {
        this.level = 0;
        this.stack = [];
        this.layers = [];
        
        this.enter = function(individual) {
    
            var union = newUnion(individual, this.level);
            
            if (this.stack.length > 0) {
              let childUnion = [...this.stack].pop();

              if (individual.isMale()) {
                childUnion.addNextUnion("m", union);
              }

              if (individual.isFemale()) {
                childUnion.addNextUnion("f", union);
              }
            }

            this.stack.push(union);

            if (!this.layers[this.level]) {
              this.layers[this.level] = [];
            }
            this.layers[this.level].push(union);

            this.level++;
        };

        this.leave = function(individual) {
            this.level--;
            this.stack.pop();
        };
    };
  })();

  //-------------------------------------------------------------------------------------------------------------

