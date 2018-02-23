Genealogy.private.diagram = Genealogy.private.diagram || {};

//HierarchyDiagram. = HierarchyDiagram.definition || {};

Genealogy.private.diagram.Vertex = function(info, isLead) {
	this.info = info;
	this.isLead = isLead;
};

Genealogy.private.diagram.Vertex.toString = function() {
	return `Vertex[lead=${this.isLead}, info=${this.info.toString()}]`;
};

Genealogy.private.diagram.Union = function(vertices) {
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

Genealogy.private.diagram.Union.prototype.addNextUnion = function(key, union) {
	this.nextUnions.map[key] = union;
};


