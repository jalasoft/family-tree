  
  
  Genealogy.constructFamilyTree = function(individual, config) {
    if (!(individual instanceof Genealogy.internal.Individual)) {
      throw new TypeError("A starting person of a family tree must be an individual.");
    }

    var nodeStyle = {
      node_size: 150,
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

    Genealogy.internal.renderer.render(painter, individual, nodeStyle, nodePosition);

    let walker = new Genealogy.internal.renderer.Walker();
    individual.walk(walker);

    let buckets = walker.buckets;
    console.log(buckets);

    return {
      el: painter.svg
    };
};

Genealogy.internal.renderer = {};

//--------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------
  
Genealogy.internal.renderer.render = function(painter, individual, style, position) {
      
      var envelope_stroke = "#e0e0eb";
      var envelope_fill = "transparent";



      var picture_width = style.node_size * 0.60;
      var picture_height = style.node_size * 0.60;    
      var picture_x = position.x + ((style.node_size - picture_width) / 2);
      var picture_y = position.y;      


      var imageUrl = window.location.origin + "/individual/" + individual.id + ".jpg";

      painter.image({
        x: picture_x,
        y: picture_y,
        width: picture_width,
        height: picture_height,
        href: imageUrl
      });

      var info_envelope_x = position.x;
      var info_envelope_y = position.y + picture_height;
      var info_envelope_width = style.node_size;
      var info_envelope_height = style.node_size * 0.5;

      painter.rectangle({
        x: info_envelope_x,
        y: info_envelope_y,
        rx: 8,
        ry: 8,
        width: info_envelope_width,
        height: info_envelope_height,
        stroke: envelope_stroke,
        fill: envelope_fill
      });

      
      var gap = (info_envelope_width * 0.06) / 2;
      var info_x = position.x + gap;
      var info_y = picture_y + picture_height + gap;
      var info_width = info_envelope_width - (2 * gap);
      var info_height = info_envelope_height - (2 * gap);
      var genderGradientId = individual.isMale() ? 'male' : 'female';

      //content
      
      painter.rectangle({
        x: info_x,
        y: info_y,
        rx: 8,
        ry: 8,
        width: info_width,
        height: info_height,
        'stroke-width': 0,
        fill: 'url(#'+genderGradientId + ')'
      });

      
      var info_text_x = position.x + (style.node_size / 2); 
      var name_font_size = 0.2 * info_envelope_height;
      var info_name_y = info_y + (0.25 * info_height);

      //name
      painter.text(individual.name, {
        x: info_text_x,
        y: info_name_y,
        'text-anchor': 'middle',
        'font-weight': 'bold',
        'font-size': name_font_size
      });
 

      var info_surname_y = info_y + (0.5 * info_height);
      //surname
      painter.text(individual.surname, {
        x: info_text_x,
        y: info_surname_y,
        'text-anchor': 'middle',
        'font-weight': 'bold',
        'font-size': name_font_size
      });

      var data_font_size = 0.15 * info_envelope_height;

      if (individual.birth) {
        var birth_y = info_y + (0.75 * info_height);
        var birthText = "* " + individual.birth.toString();

        //birth
        painter.text(birthText, {
          x: info_text_x,
          y: birth_y,
          'text-anchor': 'middle',
          'font-size': data_font_size
        });     
      }

      if (individual.decease) {
        var decease_y = info_y + (0.92 * content_height);
        var deceaseText = "+ " + individual.decease;
      
        painter.text(deceaseText, {
          x: info_text_x,
          y: decease_y,
          'text-anchor': 'middle',
          'font-size': data_font_size
        });
      }
  };

  //-------------------------------------------------------------------------------------------------------------

  Genealogy.internal.renderer.Walker = function() {
    this.buckets = [];
    this.level = 0;
  };

  Genealogy.internal.renderer.Walker.prototype.enter = function(individual) {
    if (!this.buckets[this.level]) {
      this.buckets[this.level] = [];
    }

    this.buckets[this.level].push(individual);
    this.level++;
  };

  Genealogy.internal.renderer.Walker.prototype.leave = function(individual) {
    this.level--;
  };

  //-------------------------------------------------------------------------------------------------------------
  
  Genealogy.internal.renderer.CoordinatesResolver = function(buckets) {
    //dfd
  };
