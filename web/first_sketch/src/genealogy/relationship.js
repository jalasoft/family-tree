
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
