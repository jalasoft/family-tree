  
  Genealogy.DiagramModelBuilder = (function() {
    
    var newVertex = function(individual, isLead) {
        return new Genealogy.diagram.model.Vertex({
              name: individual.name,
              surname: individual.surname,
              birth: individual.birth ? individual.birth.toString() : undefined,
              decease: individual.decease ? individual.decease.toString() : undefined,
              gender: individual.gender
            }, isLead);
    };

    var newUnion = function(individual, level) {
        var vertex = newVertex(individual, true); 
        var siblingVertices = individual.siblings.map(s => newVertex(s, false));
            
        return new Genealogy.diagram.model.Union([vertex, ...siblingVertices]);
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
              this.layers[this.level] = new Genealogy.diagram.model.Layer(this.level);
            }

            this.layers[this.level].putUnion(union);

            this.level++;
        };

        this.leave = function(individual) {
            this.level--;
            this.stack.pop();
        };

        Object.defineProperty(this, "model", {
          enumerable: true,
          get() {
            return new Genealogy.diagram.model.DiagramModel(this.layers);
          }
        });
    };
  })();

  //-------------------------------------------------------------------------------------------------------------

