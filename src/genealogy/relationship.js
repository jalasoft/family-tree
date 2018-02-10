
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
