  
  
  Genealogy.renderFamilyTree = function(individual, config) {
    if (!(individual instanceof Genealogy.internal.Individual)) {
      throw new TypeError("A starting person of a family tree must be an individual.");
    }

    var nodeStyle = {
      node_width: 150,
      node_height: 80
    };

    var nodePosition = {
      x: 50,
      y: 50
    };
  
    var painter =  new SVGPainter.SVGDocument({
          width: config.width,
          height: config.height,
          el: config.el
        });

    painter.linearGradient({
      id: 'female',
      x1: 0,
      y1: 0,
      x2: 1,
      y2: 1,
      '0': '#ffb3b3',
      '100': 'white'
    });

    painter.linearGradient({
      id: 'male',
      x1: 0,
      y1: 0,
      x2: 1,
      y2: 1,
      '0': '#66a3ff',
      '100': 'white'
    });

    Genealogy.internal.render(painter, individual, nodeStyle, nodePosition);

    document.querySelector(config.el).appendChild(painter.svg);
};

//--------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------

Genealogy.internal.render = function(painter, individual, style, position) {
      
      var envelope_stroke = "#e0e0eb";
      var envelope_fill = "transparent";

      //envelope
      
      painter.rectangle({
        x: position.x,
        y: position.y,
        rx: 8,
        ry: 8,
        width: style.node_width,
        height: style.node_height,
        stroke: envelope_stroke,
        fill: envelope_fill
      });

      var gap = style.node_width * 0.06;
      var content_x = position.x + (gap / 2);
      var content_y = position.y + (gap / 2);
      var content_width = style.node_width - gap;
      var content_height = style.node_height - gap;
      var genderGradientId = individual.isMale() ? 'male' : 'female';

      //content
      
      painter.rectangle({
        x: content_x,
        y: content_y,
        rx: 8,
        ry: 8,
        width: content_width,
        height: content_height,
        'stroke-width': 0,
        fill: 'url(#'+genderGradientId + ')'
      });


      var content_text_x = position.x + (style.node_width / 2); 
      var name_font_size = 0.2 * content_height;
      var name_y = content_y + (0.25 * content_height);

      //name
      painter.text(individual.name, {
        x: content_text_x,
        y: name_y,
        'text-anchor': 'middle',
        'font-weight': 'bold',
        'font-size': name_font_size
      });
 
      var surname_y = content_y + (0.5 * content_height);
      //surname
      painter.text(individual.surname, {
        x: content_text_x,
        y: surname_y,
        'text-anchor': 'middle',
        'font-weight': 'bold',
        'font-size': name_font_size
      });

      var data_font_size = 0.15 * content_height;

      var birth_y = content_y + (0.75 * content_height);
      var birthText = "* " + individual.birth;

      //birth
      painter.text(birthText, {
        x: content_text_x,
        y: birth_y,
        'text-anchor': 'middle',
        'font-size': data_font_size
      });     

      //decease day
      var decease_y = content_y + (0.92 * content_height);
      var deceaseText = "+ " + individual.decease;
      painter.text(deceaseText, {
        x: content_text_x,
        y: decease_y,
        'text-anchor': 'middle',
        'font-size': data_font_size
      });
  };
