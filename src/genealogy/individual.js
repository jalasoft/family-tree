
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
  
  Genealogy.internal.Individual = function(config) {
  
    this.name = config.name ? config.name : "????";
    this.surname = config.surname ? config.surname : "????";
    this.birth = config.birth ? config.birth : "????";
    this.decease = config.decease ? config.decease : "????";
    this.gender = config.gender ? config.gender : "????";
    
    this.parentRelationship = undefined;
    this.relationships = [];
  };

  Genealogy.internal.Individual.prototype.isMale = function() {
    return this.gender == Genealogy.GENDER_MALE;
  }

  Genealogy.internal.Individual.prototype.isFemale = function() {
    return this.gender == Genealogy.GENDER_FEMALE;
  }

  Genealogy.internal.Individual.prototype.inRelationWith = function(anotherIndividual) {
  
    if (!(anotherIndividual instanceof Genealogy.internal.Individual)) {
      throw new TypeError("Individual expected to be in a relationship.");
    }

    var newRelationship = Genealogy.newRelationship(this, anotherIndividual);

    this.relationships.push(newRelationship);
    anotherIndividual.relationships.push(newRelationship);

    return newRelationship;
  }

  Genealogy.internal.Individual.prototype.toString = function() {
    return `Individual[${this.id}]`
  }

  Object.defineProperty(Genealogy.internal.Individual.prototype, "id", {
    enumerable: true,
    configurable: false,
    get() {
      return `${this.name}_${this.surname}_${this.birth}`;
    }
  });

