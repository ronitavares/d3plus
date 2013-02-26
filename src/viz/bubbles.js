vizwhiz.viz.bubbles = function() {

  //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  // Public Variables with Default Settings
  //-------------------------------------------------------------------

  var width = 300,
      height = 300,
      value_var = "value",
      id_var = "id",
      text_var = "name",
      grouping = "category";

  //===================================================================


  function chart(selection) {
    selection.each(function(data, i) {

      //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
      // Private Variables
      //-------------------------------------------------------------------
      
      var this_selection = this,
          timing = 500,
          stroke_width = 1,
          groups = {},
          value_extent = d3.extent(d3.values(data),function(d){ return d[value_var]; }),
            value_map = d3.scale.linear().domain(value_extent).range([1,4]);

      //===================================================================
      
      //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
      // Calculate positioning for each bubble
      //-------------------------------------------------------------------
        
      data.forEach(function(value,index){
        if (!groups[value[grouping]]) { groups[value[grouping]] = 0 }
        groups[value[grouping]] += value[value_var] ? value_map(value[value_var]) : value_map(value_extent[0])
      })
      
      if (grouping == "id") {
        
        if(data.length == 1) {
          var columns = 1,
              rows = 1
        } else {
          var rows = Math.ceil(Math.sqrt(data.length/(width/height))),
              columns = Math.ceil(Math.sqrt(data.length*(width/height)))
        }
        
        while ((rows-1)*columns >= data.length) rows--
        
        var r = 0, c = 0
        data.forEach(function(d){
          d.cx = ((width/columns)*c)+((width/columns)/2)
          d.cy = ((height/rows)*r)+((height/rows)/2)
          d.width = (width/columns)
          d.height = (height/rows)

          if (c < columns-1) c++
          else {
            c = 0
            r++
          }
          
        })
        
      } else if (Object.keys(groups).length == 2) {
        
        var total = 0
        for (var g in groups) total += groups[g]

        data.forEach(function(d){
          if (d[grouping] == false) var offset = width*(groups["true"]/total)
          else var offset = 0
          d.width = width*(groups[d[grouping]]/total)
          d.height = height
          d.cx = (d.width/2)+offset
          d.cy = height/2
        })
        
      } else {

        var groups_tm = [],
            positions = {}
        
        for (var i in groups) {
          groups_tm.push({'key': i, 'values': Math.sqrt(groups[i])})
        }
        
        var tm = d3.layout.treemap()
          .round(false)
          .size([width,height])
          .value(function(d) { return d.values; })
          .sort(function(a,b) {
            return a.values - b.values
          })
          .nodes({"name": "root", "children": groups_tm})

        tm.forEach(function(value,index){
          if (value.name != 'root') {
            positions[value.key] = {
              'width': value.dx,
              'height': value.dy,
              'x': value.x+value.dx/2,
              'y': value.y+value.dy/2
            }
          }
        })

        data.forEach(function(d){
          d.cx = positions[d[grouping]].x
          d.cy = positions[d[grouping]].y
          d.width = positions[d[grouping]].width
          d.height = positions[d[grouping]].height
        })
        
      }

      var constraints = [d3.min(data,function(d){return d.width/Math.ceil(Math.sqrt(groups[d[grouping]]))})/2,
                         d3.min(data,function(d){return d.height/Math.ceil(Math.sqrt(groups[d[grouping]]))})/2],
          max_size = d3.min(constraints)*0.9
          
      if (grouping != 'id') max_size = max_size*1.75
      else max_size = max_size*0.8
      var node_size = d3.scale.linear().domain(value_extent).range([max_size/4,max_size])
      
      data.forEach(function(d){
        if (value_var != 'none') var size = d[value_var] ? node_size(d[value_var]) : node_size(value_extent[0])
        else var size = max_size
        d.radius = size
      })
        
      //===================================================================
      
      //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
      // Set up initial SVG and groups
      //-------------------------------------------------------------------
      
      // Select the svg element, if it exists.
      var svg = d3.select(this_selection).selectAll("svg").data([data]);
      
      var svg_enter = svg.enter().append("svg")
        .attr('width',width)
        .attr('height',height);
        
      svg_enter.append('g')
        .attr('class','bubbles');
        
      svg_enter.append('g')
        .attr('class','labels');
        
      // Create group outside of zoom group for info panel
      svg_enter.append("g")
        .attr("class","info")
        
      //===================================================================
      
      //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
      // New nodes and links enter, initialize them here
      //-------------------------------------------------------------------

      var bubble = d3.select("g.bubbles").selectAll("circle")
        .data(data, function(d) { return d[id_var] })
        
      bubble.enter().append("circle")
        .attr("fill", function(d){ return d.color; })
        .attr("r",0)
        .attr("cx", function(d){ return d.cx; })
        .attr("cy", function(d){ return d.cy; })
        .attr("stroke-width",2)
        .attr("stroke", function(d){ return d.color; })
        .on(vizwhiz.evt.over, function(d){

        })
        .on(vizwhiz.evt.out, function(d){

        })
        .on(vizwhiz.evt.click, function(d) {
          console.log(d)
        });
      
      //===================================================================
      
      //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
      // Update, for things that are already in existance
      //-------------------------------------------------------------------
        
      bubble.transition().duration(timing)
        .attr("r", function(d){ return d.radius; })
        .attr('cx', function(d) { return d.x })
        .attr('cy', function(d) { return d.y })
        .style('fill-opacity', function(d){
          if (d.available) return 1
          return 0.25
        });
        
      svg.transition().duration(timing)
        .attr("width", width)
        .attr("height", height);
          
      //===================================================================
      
      //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
      // Exit, for nodes and links that are being removed
      //-------------------------------------------------------------------

      bubble.exit().transition().duration(timing)
        .attr('opacity',0)
        .attr('r',0)
        .remove()

      //===================================================================
      
      //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
      // Force layout, to control hit detection
      //-------------------------------------------------------------------
      
      d3.layout.force()
        .friction(0.2)
        .charge(0)
        .gravity(0)
        .size([width,height])
        .nodes(data)
        .on("tick",function(e) {
          
          bubble
            .each(function(d) {
              d.y += (d.cy - d.y) * e.alpha;
              d.x += (d.cx - d.x) * e.alpha;
              if (grouping != 'id') {
                for (var group in groups) {
                  if (group == "true") var g = true
                  else if (group == "false") var g = false
                  else var g = group
                  
                  var nodegroup = data.filter(function(d){ return d[grouping] == g; }),
                      q = d3.geom.quadtree(nodegroup),
                      i = 0,
                      n = nodegroup.length;
                  
                  while (++i < n) {
                    q.visit(collide(nodegroup[i]))
                  }
                }
              }
            })
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });
            
        }).start()
        
      // Resolve collisions between nodes.
      function collide(node) {
        var r = node.radius + node_size.domain()[1] + (stroke_width*2),
            nx1 = node.x - r,
            nx2 = node.x + r,
            ny1 = node.y - r,
            ny2 = node.y + r;
        return function(quad, x1, y1, x2, y2) {
          if (quad.point && (quad.point !== node)) {
            var x = node.x - quad.point.x,
                y = node.y - quad.point.y,
                l = Math.sqrt(x * x + y * y),
                r = node.radius + quad.point.radius + (stroke_width*2);
            if (l < r) {
              l = (l - r) / l * .5;
              node.x -= x *= l;
              node.y -= y *= l;
              quad.point.x += x;
              quad.point.y += y;
            }
          }
          return x1 > nx2
              || x2 < nx1
              || y1 > ny2
              || y2 < ny1;
        };
      }

      //===================================================================
      
    });
    
    return chart;
    
  }


  //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  // Expose Public Variables
  //-------------------------------------------------------------------

  chart.width = function(x) {
    if (!arguments.length) return width;
    width = x;
    return chart;
  };

  chart.height = function(x) {
    if (!arguments.length) return height;
    height = x;
    return chart;
  };

  chart.grouping = function(x) {
    if (!arguments.length) return grouping;
    grouping = x;
    return chart;
  };
  
  chart.value_var = function(x) {
    if (!arguments.length) return value_var;
    value_var = x;
    return chart;
  };
  
  chart.id_var = function(x) {
    if (!arguments.length) return id_var;
    id_var = x;
    return chart;
  };
  
  chart.text_var = function(x) {
    if (!arguments.length) return text_var;
    text_var = x;
    return chart;
  };

  //===================================================================


  return chart;
};