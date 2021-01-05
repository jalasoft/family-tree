
Genealogy.diagram.renderer = Genealogy.diagram.renderer || {};

//----------------------------------------------------------------------------------------------------------------------

Genealogy.diagram.renderer.renderNode = (function() {
		
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
      var infoEnvelopeStroke = "#e0e0eb";
      var infoEnvelopeFill = "transparent";

    function renderImage(svgDocument, vertex) {
        if (!vertex.hasImage) {
          return;
        }

        var x_pos = x + ((width - pictureWidth) / 2);
        var y_pos = y;
        var imageUrl = window.location.origin + "/individual/" + vertex.image + ".jpg";

        svgDocument.image({
            x: x_pos,
            y: y_pos,
            width: pictureWidth,
            height: pictureHeight,
            href: imageUrl
        }); 
    }

    function renderInfoEnvelopeBox(svgDocument, vertex) {
        var x_pos = vertex.topology.x;
        var y_pos = vertex.topology.y + pictureHeight;

        svgDocument.rectangle({
            x: x_pos,
            y: y_pos,
            rx: 8,
            ry: 8,
            width: infoEnvelopeWidth,
            height: infoEnvelopeHeight,
            stroke: infoEnvelopeStroke,
            fill: infoEnvelopeFill
        });
    }

    function renderInfoBox(svgDocument, vertex) {
      var x_pos = vertex.topology.x + gap;
      var y_pos = vertex.topology.y + pictureHeight + gap;

      var genderGradientId = vertex.info.gender;

      //info
      svgDocument.rectangle({
        x: x_pos,
        y: y_pos,
        rx: 8,
        ry: 8,
        width: infoWidth,
        height: infoHeight,
        'stroke-width': 0,
        fill: 'url(#'+genderGradientId + ')'
      });
    }

    function renderName(svgDocument, vertex) {
    
      var x_pos = vertex.topology.x + textAnchorX;
      var y_pos = vertex.topology.y + nameAnchorY;

     svgDocument.text(vertex.info.name, {
        x: x_pos,
        y: y_pos,
        'text-anchor': 'middle',
        'font-weight': 'bold',
        'font-size': nameFontSize
      });
    }

    function renderSurname(svgDocument, vertex) {
    
        var x_pos = vertex.topology.x + textAnchorX;
        var y_pos = vertex.topology.y + surnameAnchorY;

        svgDocument.text(vertex.info.surname, {
          x: x_pos,
          y: y_pos,
          'text-anchor': 'middle',
          'font-weight': 'bold',
          'font-size': nameFontSize
      });
    }

    function renderBirth(svgDocument, vertex) {
      if (!vertex.info.birth) {
        return;
      }

      var x_pos = vertex.topology.x + textAnchorX;
      var y_pos = vertex.topology.y + birthAnchorY;
      var birthText = "* " + vertex.info.birth;

      svgDocument.text(birthText, {
          x: x_pos,
          y: y_pos,
          'text-anchor': 'middle',
          'font-size': dataFontSize
      });     
    }

    function renderDecease(svgDocument, vertex) {
      if (!vertex.info.decease) {
        return;
      }

      var x_pos = vertex.topology.x + textAnchorX;
      var y_pos = vertex.topology.y + deceaseAnchorY;

      var deceaseText = "+ " + vertex.info.decease;
      
      svgDocument.text(deceaseText, {
          x: x_pos,
          y: y_pos,
          'text-anchor': 'middle',
          'font-size': dataFontSize
      });
    }

    return function(svgDocument, vertex) {
        renderImage(svgDocument, vertex);
        renderInfoEnvelopeBox(svgDocument, vertex);
        renderInfoBox(svgDocument, vertex);
        renderName(svgDocument, vertex);
        renderSurname(svgDocument, vertex);
        renderBirth(svgDocument, vertex);
        renderDecease(svgDocument, vertex);
    };
})();
