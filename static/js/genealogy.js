const Genealogy = {};
Genealogy.internal = {};

  Genealogy.newMale = function(config) {
    if (!config) {
      throw new TypeError("Config must not be undefined or null when a new male is about to be created.");
    }

    config.gender = Genealogy.GENDER_MALE;
    return new Genealogy.internal.Individual(config);
  };

  Genealogy.newFemale = function(config) {
    if (!config) {
      throw new TypeError("Config must not be undefined or null when a new female is about to be created.");
    }

    config.gender = Genealogy.GENDER_FEMALE;
    return new Genealogy.internal.Individual(config);
  };

  Genealogy.GENDER_MALE = "male";
  Genealogy.GENDER_FEMALE = "female";

  //--------------------------------------------------------------------------------------------------------------------------------
  //--------------------------------------------------------------------------------------------------------------------------------
  //--------------------------------------------------------------------------------------------------------------------------------

  Genealogy.internal.Individual = function(config) {
  
    this.name = config.name ? config.name : "????";
    this.surname = config.surname ? config.surname : "????";
    this.birth = config.birth ? config.birth : "????";
    this.decease = config.decease ? config.decease : "????";
    this.gender = config.gender ? config.gender : "????";
    
    this.parentRelationship = undefined;
    this.relationships = [];

    this.customAttributes = Object.create(null);
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

    if (this.parentRelationship) {
      this.parentRelationship.father.walk(visitor);
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
      return `${this.name}_${this.surname}_${this.birth}`;
    }
  });

  //--------------------------------------------------------------------------------------------------------------------------------

  Genealogy.internal.Individual.prototype.setAttribute = function(key, value) {
    this.customAttributes[key] = value;
  };

  //--------------------------------------------------------------------------------------------------------------------------------

  Genealogy.internal.Individual.prototype.getAttribute = function(key) {
    return this.customAttributes[key];
  };

  //--------------------------------------------------------------------------------------------------------------------------------



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



Genealogy.internal.Relationship.prototype.since = function(date) {
    this.since = date;
    return this;
};

Genealogy.internal.Relationship.prototype.addChild = function(child) {
  if (!(child instanceof Genealogy.internal.Individual)) {
    throw new TypeError("Individual expected as a child to be added to a relationship.");
  }

  this.children.push(child);
  return this;
};

  
  
  Genealogy.constructFamilyTree = function(individual, config) {
    if (!(individual instanceof Genealogy.internal.Individual)) {
      throw new TypeError("A starting person of a family tree must be an individual.");
    }

    var nodeStyle = {
      node_width: 150,
      node_height: 80
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

    Genealogy.internal.renderer.render(painter, individual, nodeStyle, nodePosition);

    let walker = new Genealogy.internal.renderer.Walker();
    individual.walk(walker);

    let buckets = walker.buckets;
    console.log(buckets);

    return {
      el: painter.svg
    };
};

Genealogy.internal.renderer = {};

//--------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------

Genealogy.internal.renderer.render = function(painter, individual, style, position) {
      
      var envelope_stroke = "#e0e0eb";
      var envelope_fill = "transparent";

      //envelope
      
      painter.rectangle({
        x: position.x,
        y: position.y,
        rx: 8,
        ry: 8,
        width: style.node_width,
        height: style.node_height,
        stroke: envelope_stroke,
        fill: envelope_fill
      });

      var gap = style.node_width * 0.06;
      var content_x = position.x + (gap / 2);
      var content_y = position.y + (gap / 2);
      var content_width = style.node_width - gap;
      var content_height = style.node_height - gap;
      var genderGradientId = individual.isMale() ? 'male' : 'female';

      //content
      
      painter.rectangle({
        x: content_x,
        y: content_y,
        rx: 8,
        ry: 8,
        width: content_width,
        height: content_height,
        'stroke-width': 0,
        fill: 'url(#'+genderGradientId + ')'
      });


      var content_text_x = position.x + (style.node_width / 2); 
      var name_font_size = 0.2 * content_height;
      var name_y = content_y + (0.25 * content_height);

      //name
      painter.text(individual.name, {
        x: content_text_x,
        y: name_y,
        'text-anchor': 'middle',
        'font-weight': 'bold',
        'font-size': name_font_size
      });
 
      var surname_y = content_y + (0.5 * content_height);
      //surname
      painter.text(individual.surname, {
        x: content_text_x,
        y: surname_y,
        'text-anchor': 'middle',
        'font-weight': 'bold',
        'font-size': name_font_size
      });

      var data_font_size = 0.15 * content_height;

      var birth_y = content_y + (0.75 * content_height);
      var birthText = "* " + individual.birth;

      //birth
      painter.text(birthText, {
        x: content_text_x,
        y: birth_y,
        'text-anchor': 'middle',
        'font-size': data_font_size
      });     

      //decease day
      var decease_y = content_y + (0.92 * content_height);
      var deceaseText = "+ " + individual.decease;
      painter.text(deceaseText, {
        x: content_text_x,
        y: decease_y,
        'text-anchor': 'middle',
        'font-size': data_font_size
      });
  };

  //-------------------------------------------------------------------------------------------------------------

  Genealogy.internal.renderer.Walker = function() {
    this.buckets = [];
    this.level = 0;
  };

  Genealogy.internal.renderer.Walker.prototype.enter = function(individual) {
    if (!this.buckets[this.level]) {
      this.buckets[this.level] = [];
    }

    this.buckets[this.level].push(individual);
    this.level++;
  };

  Genealogy.internal.renderer.Walker.prototype.leave = function(individual) {
    this.level--;
  };

  //-------------------------------------------------------------------------------------------------------------
  
  Genealogy.internal.renderer.CoordinatesResolver = function(buckets) {
    //dfd
  };
