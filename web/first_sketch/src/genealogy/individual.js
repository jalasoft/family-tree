
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
