
Genealogy.internal.node = Genealogy.internal.node || {};

//----------------------------------------------------------------------------------------------------------------------

Genealogy.internal.node.IndividualNode = function(individual) {
		this.individual = individual;
};

//----------------------------------------------------------------------------------------------------------------------

Genealogy.internal.node.IndividualNode.prototype.colors = {
	infoEnvelopeStroke: "#e0e0eb",
    infoEnvelopeFill: "transparent"
};

Genealogy.internal.node.IndividualNode.prototype.sizes = (function() {
	
	var size = 150;
	
	var width = size;
    var height = size * 1.04;
    
    var pictureWidth = size * 0.54;
	var pictureHeight = pictureWidth;

	var infoEnvelopeWidth = size;
	var infoEnvelopeHeight = size * 0.5;

	var gap = (infoEnvelopeWidth * 0.06) / 2;

	var infoWidth = infoEnvelopeWidth - (2 * gap);
	var infoHeight = infoEnvelopeHeight - (2 * gap);

	var nameFontSize = 0.2 * infoEnvelopeHeight;
	var dataFontSize = 0.15 * infoEnvelopeHeight;

	var textAnchorX = infoWidth / 2;

	var nameAnchorY = pictureHeight + gap + infoHeight * 0.25; 
	var surnameAnchorY = pictureHeight + gap + infoHeight * 0.5;
	var birthAnchorY = pictureHeight + gap + infoHeight * 0.75;
	var deceaseAnchorY = pictureHeight + gap + infoHeight * 0.92;

	return {
		size: size,
	
		width: width,
    	height: height,
    
    	pictureWidth: pictureWidth,
		pictureHeight: pictureHeight,

		infoEnvelopeWidth: infoEnvelopeWidth,
		infoEnvelopeHeight: infoEnvelopeHeight,

		infoWidth: infoWidth,
		infoHeight: infoHeight,

		gap: gap,

		nameFontSize: nameFontSize,

		textAnchorX: textAnchorX,
		dataFontSize: dataFontSize,
		
		nameAnchorY: nameAnchorY,
		surnameAnchorY: surnameAnchorY,
		birthAnchorY: birthAnchorY,
		deceaseAnchorY: deceaseAnchorY
	};
})();

//----------------------------------------------------------------------------------------------------------------------

Object.defineProperty(Genealogy.internal.node.IndividualNode.prototype, "width", {
	enumerable: true,
	get() {
		return this.sizes.width;
	}
});

//----------------------------------------------------------------------------------------------------------------------

Genealogy.internal.node.IndividualNode.prototype.render = function(pencil, x, y) {
	this.renderImage(pencil, x, y);
	this.renderInfoEnvelopeBox(pencil, x, y);
	this.renderInfoBox(pencil, x, y);
	this.renderName(pencil, x, y);
	this.renderSurname(pencil, x, y);
	this.renderBirth(pencil, x, y);
    this.renderDecease(pencil, x, y);  
};

//----------------------------------------------------------------------------------------------------------------------

Genealogy.internal.node.IndividualNode.prototype.renderImage = function(pencil, x, y) {
	if (!this.individual.hasImage) {
		return;
	}

    var x_pos = x + ((this.sizes.width - this.sizes.pictureWidth) / 2);
    var y_pos = y;
    var imageUrl = window.location.origin + "/individual/" + this.individual.id + ".jpg";

    pencil.image({
        	x: x_pos,
        	y: y_pos,
        	width: this.sizes.pictureWidth,
        	height: this.sizes.pictureHeight,
        	href: imageUrl
        	});	
};

Genealogy.internal.node.IndividualNode.prototype.renderInfoEnvelopeBox = function(pencil, x, y) {
	var x_pos = x;
    var y_pos = y + this.sizes.pictureHeight;

    pencil.rectangle({
        x: x_pos,
        y: y_pos,
        rx: 8,
        ry: 8,
        width: this.sizes.infoEnvelopeWidth,
        height: this.sizes.infoEnvelopeHeight,
        stroke: this.colors.infoEnvelopeStroke,
        fill: this.colors.infoEnvelopeFill
      });
};

Genealogy.internal.node.IndividualNode.prototype.renderInfoBox = function(pencil, x, y) {
      var x_pos = x + this.sizes.gap;
      var y_pos = y + this.sizes.pictureHeight + this.sizes.gap;

      var genderGradientId = this.individual.isMale() ? 'male' : 'female';

      //info
      pencil.rectangle({
        x: x_pos,
        y: y_pos,
        rx: 8,
        ry: 8,
        width: this.sizes.infoWidth,
        height: this.sizes.infoHeight,
        'stroke-width': 0,
        fill: 'url(#'+genderGradientId + ')'
      });
};

Genealogy.internal.node.IndividualNode.prototype.renderName = function(pencil, x, y) {
		
	var x_pos = x + this.sizes.textAnchorX;
	var y_pos = y + this.sizes.nameAnchorY;

     pencil.text(this.individual.name, {
        x: x_pos,
        y: y_pos,
        'text-anchor': 'middle',
        'font-weight': 'bold',
        'font-size': this.sizes.nameFontSize
      });
};

Genealogy.internal.node.IndividualNode.prototype.renderSurname = function(pencil, x, y) {
		
	var x_pos = x + this.sizes.textAnchorX;
	var y_pos = y + this.sizes.surnameAnchorY;

     pencil.text(this.individual.surname, {
        x: x_pos,
        y: y_pos,
        'text-anchor': 'middle',
        'font-weight': 'bold',
        'font-size': this.sizes.nameFontSize
      });
};

Genealogy.internal.node.IndividualNode.prototype.renderBirth = function(pencil, x, y) {
	if (!this.individual.birth) {
		return;
	}

	var x_pos = x + this.sizes.textAnchorX;
	var y_pos = y + this.sizes.birthAnchorY;
    var birthText = "* " + this.individual.birth.toString();

    pencil.text(birthText, {
          x: x_pos,
          y: y_pos,
          'text-anchor': 'middle',
          'font-size': this.sizes.dataFontSize
        });     
};

Genealogy.internal.node.IndividualNode.prototype.renderDecease = function(pencil, x, y) {
	if (!this.individual.decease) {
		return;
	}

	var x_pos = x + this.sizes.textAnchorX;
	var y_pos = y + this.sizes.deceaseAnchorY;

    var deceaseText = "+ " + this.individual.decease;
      
    pencil.text(deceaseText, {
          x: x_pos,
          y: y_pos,
          'text-anchor': 'middle',
          'font-size': this.sizes.dataFontSize
     });
};

Genealogy.internal.node.IndividualNode.prototype.siblingsConnectorCoordinates = function(x, y) {
	return {
		x: x + (this.sizes.width / 2),
		y: y + this.sizes.height
	};
};