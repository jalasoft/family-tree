
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

  Genealogy.internal.dateToStringPropertyDefinition = {
    value: function() {
      var day = this.day && this.month ? this.day + "." + this.month + "." : "";
      return day + this.year;
    }
  };

  Genealogy.internal.Individual = function(gender, config) {
    if (!config.surname) {
      throw new TypeError("At least surname must be known when defining a person.");
    }

    this.name = config.name ? config.name : undefined;
    this.surname = config.surname;

    if (config.birth) {
      this.birth = Object.assign({}, config.birth);
      Object.defineProperty(this.birth, "toString", Genealogy.internal.dateToStringPropertyDefinition);
    }

    if (this.decease) {
      this.decease = Object.assign({}, config.decease);
      Object.defineProperty(this.decease, "toString", Genealogy.internal.dateToStringPropertyDefinition);
    }

    this.gender = gender;
    
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

  Genealogy.internal.Individual.prototype.setAttribute = function(key, value) {
    this.customAttributes[key] = value;
  };

  //--------------------------------------------------------------------------------------------------------------------------------

  Genealogy.internal.Individual.prototype.getAttribute = function(key) {
    return this.customAttributes[key];
  };

  //--------------------------------------------------------------------------------------------------------------------------------

