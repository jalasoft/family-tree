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

