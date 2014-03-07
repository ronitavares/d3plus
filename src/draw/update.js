//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
// Updating Elements
//------------------------------------------------------------------------------
d3plus.draw.update = function(vars) {

  // Update Parent Element
  vars.parent.transition().duration(vars.style.timing.transitions)
    .style("width",vars.width.value+"px")
    .style("height",vars.height.value+"px")

  // Update SVG
  vars.svg.transition().duration(vars.style.timing.transitions)
      .attr("width",vars.width.value)
      .attr("height",vars.height.value)

  // Update Background Rectangle
  vars.g.bg.transition().duration(vars.style.timing.transitions)
      .attr("width",vars.width.value)
      .attr("height",vars.height.value)

  // Update App Clipping Rectangle
  vars.g.clipping.select("rect").transition().duration(vars.style.timing.transitions)
    .attr("width",vars.app_width)
    .attr("height",vars.app_height)

  // Update Container Groups
  vars.g.container.transition().duration(vars.style.timing.transitions)
    .attr("transform","translate("+vars.margin.left+","+vars.margin.top+")")

}
