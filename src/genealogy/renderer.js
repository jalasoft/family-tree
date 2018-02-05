  
  
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
    
    var siblingsNode = new Genealogy.internal.node.SiblingsNode(personalNode);
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

  Genealogy.internal.renderer.Walker = function() {
    this.buckets = [];
    this.level = 0;
  };

  Genealogy.internal.renderer.Walker.prototype.enter = function(individual) {
    if (!this.buckets[this.level]) {
      this.buckets[this.level] = [];
    }

    var node = new Genealogy.internal.node.SiblingsNode(individual);
    
    this.buckets[this.level].push(node);
    this.level++;
  };

  Genealogy.internal.renderer.Walker.prototype.leave = function(individual) {
    this.level--;
  };
  //-------------------------------------------------------------------------------------------------------------

