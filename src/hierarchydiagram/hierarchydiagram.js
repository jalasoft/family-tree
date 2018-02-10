var HierarchyDiagram = HierarchyDiagram || {};

//HierarchyDiagram. = HierarchyDiagram.definition || {};

HierarchyDiagram.Vertex = function(info, isLead) {
	this.info = info;
	this.isLead = isLead;
//df
};

HierarchyDiagram.Union = function(vertices) {
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

HierarchyDiagram.Union.prototype.addNextUnion = function(key, union) {
	this.nextUnions.map[key] = union;
};


