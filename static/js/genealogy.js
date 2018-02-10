const Genealogy = {};
Genealogy.internal = {};

  Genealogy.newMale = function(config) {
    if (!config) {
      throw new TypeError("Config must not be undefined or null when a new male is about to be created.");
    }

    return new Genealogy.internal.Individual(Genealogy.GENDER_MALE, config);
  };

  Genealogy.newFemale = function(config) {
    if (!config) {
      throw new TypeError("Config must not be undefined or null when a new female is about to be created.");
    }

    return new Genealogy.internal.Individual(Genealogy.GENDER_FEMALE, config);
  };

  Genealogy.GENDER_MALE = "male";
  Genealogy.GENDER_FEMALE = "female";

  //--------------------------------------------------------------------------------------------------------------------------------
  //--------------------------------------------------------------------------------------------------------------------------------
  //--------------------------------------------------------------------------------------------------------------------------------

  Genealogy.internal.Individual = function(gender, config) {
    if (!config.surname) {
      throw new TypeError("At least surname must be known when defining a person.");
    }

    this.name = config.name ? config.name : undefined;
    this.surname = config.surname;
    this.hasImage = config.hasImage;
    
    if (config.birth) {
      this.birth = new Genealogy.internal.Date(config.birth);
    }

    if (config.decease) {
      this.decease = new Genealogy.internal.Date(config.decease);
    }

    this.gender = gender;
    this.parentRelationship = undefined;
    this.relationships = [];

  };

  //--------------------------------------------------------------------------------------------------------------------------------

  Genealogy.internal.Individual.prototype.isMale = function() {
    return this.gender == Genealogy.GENDER_MALE;
  };

  //--------------------------------------------------------------------------------------------------------------------------------
  
  Genealogy.internal.Individual.prototype.isFemale = function() {
    return this.gender == Genealogy.GENDER_FEMALE;
  };

  //--------------------------------------------------------------------------------------------------------------------------------
  
  Genealogy.internal.Individual.prototype.inRelationWith = function(anotherIndividual) {
  
    if (!(anotherIndividual instanceof Genealogy.internal.Individual)) {
      throw new TypeError("Individual expected to be in a relationship.");
    }

    var newRelationship = Genealogy.newRelationship(this, anotherIndividual);

    this.relationships.push(newRelationship);
    anotherIndividual.relationships.push(newRelationship);

    return newRelationship;
  };
  
  //--------------------------------------------------------------------------------------------------------------------------------

  Genealogy.internal.Individual.prototype.walk = function(visitor) {

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
      this.parentRelationship.father.walk(visitor);
    }

    if (this.parentRelationship.mother) {
      this.parentRelationship.mother.walk(visitor);
    }

    visitor.leave(this);
  };

  //--------------------------------------------------------------------------------------------------------------------------------
  
  Genealogy.internal.Individual.prototype.toString = function() {
    return `Individual[${this.id}]`;
  };

  //--------------------------------------------------------------------------------------------------------------------------------
  
  Object.defineProperty(Genealogy.internal.Individual.prototype, "father", {
      enumerable: true,
      get() {
        return this.parentRelationship ? this.parentRelationship.father : undefined;
      }
  });

  //--------------------------------------------------------------------------------------------------------------------------------
  
  Object.defineProperty(Genealogy.internal.Individual.prototype, "mother", {
      enumerable: true,
      get() {
        return this.parentRelationship ? this.parentRelationship.mother : undefined;
      }
  });

  //--------------------------------------------------------------------------------------------------------------------------------

  Object.defineProperty(Genealogy.internal.Individual.prototype, "siblings", {
      enumerable: true,
      get() {
        return this.parentRelationship ? this.parentRelationship.children.filter(s => s != this) : [];
      }
  });

  //--------------------------------------------------------------------------------------------------------------------------------

  Object.defineProperty(Genealogy.internal.Individual.prototype, "id", {
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

  Genealogy.internal.Date = function(config) {
    this.day = config.day;
    this.month = config.month;
    this.year = config.year;
  };

  Genealogy.internal.Date.prototype.toString = function() {
      var day = this.day && this.month ? this.day + "." + this.month + "." : "";
      return day + this.year;
  };


Genealogy.newRelationship = function(person1, person2) {
    if (!(person1 instanceof Genealogy.internal.Individual) || !(person2 instanceof Genealogy.internal.Individual)) {
      throw new TypeError("Any individual that is about to be part of a relationship must be an individual.");
    }

    var father = person1.isMale() ? person1 : person2.isMale() ? person2 : undefined;
    var mother = person1.isFemale() ? person1 : person2.isFemale() ? person2 : undefined;

    if (!father) {
      throw new TypeError("None of the provided two persons is a male to be set as a father of a new relationship.");
    }

    if (!mother) {
      throw new TypeError("None of the provided two persons is a female to be set as a mother of a new relationship.");
    }

    return new Genealogy.internal.Relationship({
      mother: mother,
      father: father
    });
  };


//--------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------

Genealogy.internal.Relationship = function(config) {
    this.mother = config.mother;
    this.father = config.father;
    this.children = [];
 };

  Genealogy.internal.Relationship.prototype.having = function(individual) {
  if (!(individual instanceof Genealogy.internal.Individual)) {
    throw new TypeError("Individual expected as a child of a relationship.");
  }

  this.children.push(individual);
  individual.parentRelationship = this;
  return this;
};



Genealogy.internal.Relationship.prototype.since = function(config) {
    this.since = new Genealogy.internal.Date(config);
    return this;
};

/*
Genealogy.internal.Relationship.prototype.addChild = function(child) {
  if (!(child instanceof Genealogy.internal.Individual)) {
    throw new TypeError("Individual expected as a child to be added to a relationship.");
  }

  this.children.push(child);
  return this;
};*/


Genealogy.internal.node = Genealogy.internal.node || {};

//----------------------------------------------------------------------------------------------------------------------

Genealogy.internal.node.IndividualNode = function(individual) {
		this.individual = individual;
};

//----------------------------------------------------------------------------------------------------------------------

Genealogy.internal.node.IndividualNode.prototype.colors = {
	infoEnvelopeStroke: "#e0e0eb",
    infoEnvelopeFill: "transparent"
};

Genealogy.internal.node.IndividualNode.prototype.geometry = (function() {
	
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

	return {
		size: size,
	
		width: width,
    	height: height,
    
    	pictureWidth: pictureWidth,
		pictureHeight: pictureHeight,

		infoEnvelopeWidth: infoEnvelopeWidth,
		infoEnvelopeHeight: infoEnvelopeHeight,

		infoWidth: infoWidth,
		infoHeight: infoHeight,

		gap: gap,

		nameFontSize: nameFontSize,

		textAnchorX: textAnchorX,
		dataFontSize: dataFontSize,
		
		nameAnchorY: nameAnchorY,
		surnameAnchorY: surnameAnchorY,
		birthAnchorY: birthAnchorY,
		deceaseAnchorY: deceaseAnchorY
	};
})();

//----------------------------------------------------------------------------------------------------------------------

Genealogy.internal.node.IndividualNode.prototype.render = function(pencil, x, y) {
	this.renderImage(pencil, x, y);
	this.renderInfoEnvelopeBox(pencil, x, y);
	this.renderInfoBox(pencil, x, y);
	this.renderName(pencil, x, y);
	this.renderSurname(pencil, x, y);
	this.renderBirth(pencil, x, y);
    this.renderDecease(pencil, x, y);  
};

//----------------------------------------------------------------------------------------------------------------------

Genealogy.internal.node.IndividualNode.prototype.renderImage = function(pencil, x, y) {
	if (!this.individual.hasImage) {
		return;
	}

    var x_pos = x + ((this.geometry.width - this.geometry.pictureWidth) / 2);
    var y_pos = y;
    var imageUrl = window.location.origin + "/individual/" + this.individual.id + ".jpg";

    pencil.image({
        	x: x_pos,
        	y: y_pos,
        	width: this.geometry.pictureWidth,
        	height: this.geometry.pictureHeight,
        	href: imageUrl
        	});	
};

Genealogy.internal.node.IndividualNode.prototype.renderInfoEnvelopeBox = function(pencil, x, y) {
	var x_pos = x;
    var y_pos = y + this.geometry.pictureHeight;

    pencil.rectangle({
        x: x_pos,
        y: y_pos,
        rx: 8,
        ry: 8,
        width: this.geometry.infoEnvelopeWidth,
        height: this.geometry.infoEnvelopeHeight,
        stroke: this.colors.infoEnvelopeStroke,
        fill: this.colors.infoEnvelopeFill
      });
};

Genealogy.internal.node.IndividualNode.prototype.renderInfoBox = function(pencil, x, y) {
      var x_pos = x + this.geometry.gap;
      var y_pos = y + this.geometry.pictureHeight + this.geometry.gap;

      var genderGradientId = this.individual.isMale() ? 'male' : 'female';

      //info
      pencil.rectangle({
        x: x_pos,
        y: y_pos,
        rx: 8,
        ry: 8,
        width: this.geometry.infoWidth,
        height: this.geometry.infoHeight,
        'stroke-width': 0,
        fill: 'url(#'+genderGradientId + ')'
      });
};

Genealogy.internal.node.IndividualNode.prototype.renderName = function(pencil, x, y) {
		
	var x_pos = x + this.geometry.textAnchorX;
	var y_pos = y + this.geometry.nameAnchorY;

     pencil.text(this.individual.name, {
        x: x_pos,
        y: y_pos,
        'text-anchor': 'middle',
        'font-weight': 'bold',
        'font-size': this.geometry.nameFontSize
      });
};

Genealogy.internal.node.IndividualNode.prototype.renderSurname = function(pencil, x, y) {
		
	var x_pos = x + this.geometry.textAnchorX;
	var y_pos = y + this.geometry.surnameAnchorY;

     pencil.text(this.individual.surname, {
        x: x_pos,
        y: y_pos,
        'text-anchor': 'middle',
        'font-weight': 'bold',
        'font-size': this.geometry.nameFontSize
      });
};

Genealogy.internal.node.IndividualNode.prototype.renderBirth = function(pencil, x, y) {
	if (!this.individual.birth) {
		return;
	}

	var x_pos = x + this.geometry.textAnchorX;
	var y_pos = y + this.geometry.birthAnchorY;
    var birthText = "* " + this.individual.birth.toString();

    pencil.text(birthText, {
          x: x_pos,
          y: y_pos,
          'text-anchor': 'middle',
          'font-size': this.geometry.dataFontSize
        });     
};

Genealogy.internal.node.IndividualNode.prototype.renderDecease = function(pencil, x, y) {
	if (!this.individual.decease) {
		return;
	}

	var x_pos = x + this.geometry.textAnchorX;
	var y_pos = y + this.geometry.deceaseAnchorY;

    var deceaseText = "+ " + this.individual.decease;
      
    pencil.text(deceaseText, {
          x: x_pos,
          y: y_pos,
          'text-anchor': 'middle',
          'font-size': this.geometry.dataFontSize
     });
};

Genealogy.internal.node.IndividualNode.prototype.siblingsConnectorCoordinates = function(x, y) {
	return {
		x: x + (this.geometry.width / 2),
		y: y + this.geometry.height
	};
};
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

