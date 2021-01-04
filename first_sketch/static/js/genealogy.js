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


  Genealogy.newMale = function(config) {
    if (!config) {
      throw new TypeError("Config must not be undefined or null when a new male is about to be created.");
    }

    return new Genealogy.Individual(Genealogy.GENDER_MALE, config);
  };

  Genealogy.newFemale = function(config) {
    if (!config) {
      throw new TypeError("Config must not be undefined or null when a new female is about to be created.");
    }

    return new Genealogy.Individual(Genealogy.GENDER_FEMALE, config);
  };

  Genealogy.GENDER_MALE = "male";
  Genealogy.GENDER_FEMALE = "female";

  //--------------------------------------------------------------------------------------------------------------------------------
  //--------------------------------------------------------------------------------------------------------------------------------
  //--------------------------------------------------------------------------------------------------------------------------------

  Genealogy.Individual = function(gender, config) {
    if (!config.surname) {
      throw new TypeError("At least surname must be known when defining a person.");
    }

    this.name = config.name ? config.name : undefined;
    this.surname = config.surname;
    this.hasImage = config.hasImage;
    
    if (config.birth) {
      this.birth = new Genealogy.Date(config.birth);
    }

    if (config.decease) {
      this.decease = new Genealogy.Date(config.decease);
    }

    this.gender = gender;
    this.parentRelationship = undefined;
    this.relationships = [];

  };

  //--------------------------------------------------------------------------------------------------------------------------------

  Genealogy.Individual.prototype.isMale = function() {
    return this.gender == Genealogy.GENDER_MALE;
  };

  //--------------------------------------------------------------------------------------------------------------------------------
  
  Genealogy.Individual.prototype.isFemale = function() {
    return this.gender == Genealogy.GENDER_FEMALE;
  };

  //--------------------------------------------------------------------------------------------------------------------------------
  
  Genealogy.Individual.prototype.inRelationWith = function(anotherIndividual) {
  
    if (!(anotherIndividual instanceof Genealogy.Individual)) {
      throw new TypeError("Individual expected to be in a relationship.");
    }

    if (this.gender == anotherIndividual.gender) {
      throw new TypeError("Two individuals of the same sex cannot produce a child.");
    }

    var mother = this.isFemale() ? this : anotherIndividual;
    var father = this.isMale() ? this : anotherIndividual;

    var newRelationship = new Genealogy.Relationship({
      father: father,
      mother: mother
    });

    this.relationships.push(newRelationship);
    anotherIndividual.relationships.push(newRelationship);

    return newRelationship;
  };
  
  //--------------------------------------------------------------------------------------------------------------------------------

  Genealogy.Individual.prototype.traverseAncestors = function(visitor) {

    if (!visitor) {
      throw new TypeError("Visitor to walk throught inheritance tree must be defined.");
    }

    if (!visitor.enter || (typeof visitor.enter) !== "function") {
      throw new TypeError("Visitor must have function 'enter(individual)'");
    }

    if (!visitor.leave || (typeof visitor.leave) !== "function") {
      throw new TypeError("Visitor must have function 'leave(individual)'");
    }

    visitor.enter(this);

    if (!this.parentRelationship) {
      visitor.leave(this);
      return;
    }

    if (this.parentRelationship.father) {
      this.parentRelationship.father.traverseAncestors(visitor);
    }

    if (this.parentRelationship.mother) {
      this.parentRelationship.mother.traverseAncestors(visitor);
    }

    visitor.leave(this);
  };

  //--------------------------------------------------------------------------------------------------------------------------------
  
  Genealogy.Individual.prototype.toString = function() {
    return `Individual[${this.id}]`;
  };

  //--------------------------------------------------------------------------------------------------------------------------------
  
  Object.defineProperty(Genealogy.Individual.prototype, "father", {
      enumerable: true,
      get() {
        return this.parentRelationship ? this.parentRelationship.father : undefined;
      }
  });

  //--------------------------------------------------------------------------------------------------------------------------------
  
  Object.defineProperty(Genealogy.Individual.prototype, "mother", {
      enumerable: true,
      get() {
        return this.parentRelationship ? this.parentRelationship.mother : undefined;
      }
  });

  //--------------------------------------------------------------------------------------------------------------------------------

  Object.defineProperty(Genealogy.Individual.prototype, "siblings", {
      enumerable: true,
      get() {
        return this.parentRelationship ? this.parentRelationship.children.filter(s => s != this) : [];
      }
  });

  //--------------------------------------------------------------------------------------------------------------------------------

  Object.defineProperty(Genealogy.Individual.prototype, "id", {
    enumerable: true,
    configurable: false,
    get() {

      var name;
      if (this.name) {
        name = this.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "") + "_";
      } else {
        name = "";
      }

      var surname = this.surname.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");

      var birthYear = this.birth && this.birth.year ? "_" + this.birth.year: "";
      var deceaseYear = this.decease && this.decease.year ? "_" + this.decease.year : "";

      return `${name}${surname}${birthYear}${deceaseYear}`;
    }
  });
  //--------------------------------------------------------------------------------------------------------------------------------
  //--------------------------------------------------------------------------------------------------------------------------------

  Genealogy.Date = function(config) {
    this.day = config.day;
    this.month = config.month;
    this.year = config.year;
  };

  Genealogy.Date.prototype.toString = function() {
      var day = this.day && this.month ? this.day + "." + this.month + "." : "";
      return day + this.year;
  };


Genealogy.Relationship = function(config) {
    this.mother = config.mother;
    this.father = config.father;
    this.children = [];
 };

  Genealogy.Relationship.prototype.having = function(individual) {
  if (!(individual instanceof Genealogy.Individual)) {
    throw new TypeError("Individual expected as a child of a relationship.");
  }

  this.children.push(individual);
  individual.parentRelationship = this;
  return this;
};

Genealogy.Relationship.prototype.since = function(config) {
    this.since = new Genealogy.Date(config);
    return this;
};

  
  Genealogy.DiagramModelBuilder = (function() {
    
    var newVertex = function(individual, isLead) {
        return new Genealogy.diagram.model.Vertex({
              name: individual.name,
              surname: individual.surname,
              birth: individual.birth ? individual.birth.toString() : undefined,
              decease: individual.decease ? individual.decease.toString() : undefined,
              gender: individual.gender
            }, isLead);
    };

    var newUnion = function(individual, level) {
        var vertex = newVertex(individual, true); 
        var siblingVertices = individual.siblings.map(s => newVertex(s, false));
            
        return new Genealogy.diagram.model.Union([vertex, ...siblingVertices]);
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
              this.layers[this.level] = new Genealogy.diagram.model.Layer(this.level);
            }

            this.layers[this.level].putUnion(union);

            this.level++;
        };

        this.leave = function(individual) {
            this.level--;
            this.stack.pop();
        };

        Object.defineProperty(this, "model", {
          enumerable: true,
          get() {
            return new Genealogy.diagram.model.DiagramModel(this.layers);
          }
        });
    };
  })();

  //-------------------------------------------------------------------------------------------------------------


Genealogy.diagram = Genealogy.diagram || {};

Genealogy.diagram.model = Genealogy.diagram.model || {};

Genealogy.diagram.model.Vertex = function(info, isLead) {
	this.info = info;
	this.isLead = isLead;
};

Genealogy.diagram.model.Vertex.toString = function() {
	return `Vertex[lead=${this.isLead}, info=${this.info.toString()}]`;
};

//-----------------------------------------------------------------------------------------------

Genealogy.diagram.model.Union = function(vertices) {
	this.vertices = vertices;

	var leads = vertices.filter(f => f.isLead);
	if (leads.length != 1) {
		throw new TypeError("No lead present in union vertices.");
	}

	this.lead = leads[0];
	this.nextUnions = {
		info: {},
		map: Object.create(null)
	};
};

Genealogy.diagram.model.Union.prototype.addNextUnion = function(key, union) {
	this.nextUnions.map[key] = union;
};

Genealogy.diagram.model.Union.prototype.vertexCount = function() {
	return this.vertices.length;
};

Genealogy.diagram.model.Union.prototype.forEachVertex = function(callback) {
	this.vertices.forEach(callback);
};

Genealogy.diagram.model.Union.prototype.isSingle = function() {
	return this.vertices.length == 1;
};
//-----------------------------------------------------------------------------------------------

Genealogy.diagram.model.Layer = function(level) {
	this.level = level;
	this.unions = [];
};

Genealogy.diagram.model.Layer.prototype.size = function() {
	return this.unions.length;
};

Genealogy.diagram.model.Layer.prototype.putUnion = function(union) {
	this.unions.push(union);
};

Genealogy.diagram.model.Layer.prototype.forEachVertex = function(callback) {
	this.unions.forEach(u => {
			u.vertices.forEach(v => {
				callback(v);
			});
		});
};

Genealogy.diagram.model.Layer.prototype.forEachUnion = function(callback) {
	this.unions.forEach(callback);
};

//-----------------------------------------------------------------------------------------------

Genealogy.diagram.model.DiagramModel = function(layers) {
	this.layers = layers;
};

Genealogy.diagram.model.DiagramModel.prototype.forEachLayer = function(callback) {
	this.layers.forEach(callback);
};


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

Genealogy.diagram.renderer = Genealogy.diagram.renderer || {};

//----------------------------------------------------------------------------------------------------------------------

Genealogy.diagram.renderer.renderNode = (function() {
		
      var size = 150;
      var width = size;
      var height = size * 1.04;
      var pictureWidth = size * 0.54;
      var pictureHeight = pictureWidth;
      var infoEnvelopeWidth = size;
      var infoEnvelopeHeight = size * 0.5;
      var gap = (infoEnvelopeWidth * 0.06) / 2;
      var infoWidth = infoEnvelopeWidth - (2 * gap);
      var infoHeight = infoEnvelopeHeight - (2 * gap);
      var nameFontSize = 0.2 * infoEnvelopeHeight;
      var dataFontSize = 0.15 * infoEnvelopeHeight;
      var textAnchorX = infoWidth / 2;
      var nameAnchorY = pictureHeight + gap + infoHeight * 0.25; 
      var surnameAnchorY = pictureHeight + gap + infoHeight * 0.5;
      var birthAnchorY = pictureHeight + gap + infoHeight * 0.75;
      var deceaseAnchorY = pictureHeight + gap + infoHeight * 0.92;
      var infoEnvelopeStroke = "#e0e0eb";
      var infoEnvelopeFill = "transparent";

    function renderImage(svgDocument, vertex) {
        if (!vertex.hasImage) {
          return;
        }

        var x_pos = x + ((width - pictureWidth) / 2);
        var y_pos = y;
        var imageUrl = window.location.origin + "/individual/" + vertex.image + ".jpg";

        svgDocument.image({
            x: x_pos,
            y: y_pos,
            width: pictureWidth,
            height: pictureHeight,
            href: imageUrl
        }); 
    }

    function renderInfoEnvelopeBox(svgDocument, vertex) {
        var x_pos = vertex.topology.x;
        var y_pos = vertex.topology.y + pictureHeight;

        svgDocument.rectangle({
            x: x_pos,
            y: y_pos,
            rx: 8,
            ry: 8,
            width: infoEnvelopeWidth,
            height: infoEnvelopeHeight,
            stroke: infoEnvelopeStroke,
            fill: infoEnvelopeFill
        });
    }

    function renderInfoBox(svgDocument, vertex) {
      var x_pos = vertex.topology.x + gap;
      var y_pos = vertex.topology.y + pictureHeight + gap;

      var genderGradientId = vertex.info.gender;

      //info
      svgDocument.rectangle({
        x: x_pos,
        y: y_pos,
        rx: 8,
        ry: 8,
        width: infoWidth,
        height: infoHeight,
        'stroke-width': 0,
        fill: 'url(#'+genderGradientId + ')'
      });
    }

    function renderName(svgDocument, vertex) {
    
      var x_pos = vertex.topology.x + textAnchorX;
      var y_pos = vertex.topology.y + nameAnchorY;

     svgDocument.text(vertex.info.name, {
        x: x_pos,
        y: y_pos,
        'text-anchor': 'middle',
        'font-weight': 'bold',
        'font-size': nameFontSize
      });
    }

    function renderSurname(svgDocument, vertex) {
    
        var x_pos = vertex.topology.x + textAnchorX;
        var y_pos = vertex.topology.y + surnameAnchorY;

        svgDocument.text(vertex.info.surname, {
          x: x_pos,
          y: y_pos,
          'text-anchor': 'middle',
          'font-weight': 'bold',
          'font-size': nameFontSize
      });
    }

    function renderBirth(svgDocument, vertex) {
      if (!vertex.info.birth) {
        return;
      }

      var x_pos = vertex.topology.x + textAnchorX;
      var y_pos = vertex.topology.y + birthAnchorY;
      var birthText = "* " + vertex.info.birth;

      svgDocument.text(birthText, {
          x: x_pos,
          y: y_pos,
          'text-anchor': 'middle',
          'font-size': dataFontSize
      });     
    }

    function renderDecease(svgDocument, vertex) {
      if (!vertex.info.decease) {
        return;
      }

      var x_pos = vertex.topology.x + textAnchorX;
      var y_pos = vertex.topology.y + deceaseAnchorY;

      var deceaseText = "+ " + vertex.info.decease;
      
      svgDocument.text(deceaseText, {
          x: x_pos,
          y: y_pos,
          'text-anchor': 'middle',
          'font-size': dataFontSize
      });
    }

    return function(svgDocument, vertex) {
        renderImage(svgDocument, vertex);
        renderInfoEnvelopeBox(svgDocument, vertex);
        renderInfoBox(svgDocument, vertex);
        renderName(svgDocument, vertex);
        renderSurname(svgDocument, vertex);
        renderBirth(svgDocument, vertex);
        renderDecease(svgDocument, vertex);
    };
})();

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


