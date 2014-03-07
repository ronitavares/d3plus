//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
// Enter Elements
//------------------------------------------------------------------------------
d3plus.draw.enter = function(vars) {

  // Enter SVG
  vars.svg = vars.parent.selectAll("svg#d3plus").data([0]);
  vars.svg.enter().append("svg")
    .attr("id","d3plus")
    .attr("width",vars.width.value)
    .attr("height",vars.height.value)
    .attr("xmlns","http://www.w3.org/2000/svg")
    .attr("xmlns:xmlns:xlink","http://www.w3.org/1999/xlink")

  // Enter BG Rectangle
  vars.g.bg = vars.svg.selectAll("rect#bg").data(["bg"]);
  vars.g.bg.enter().append("rect")
    .attr("id","bg")
    .attr("fill",vars.style.background)
    .attr("width",vars.width.value)
    .attr("height",vars.height.value)

  // Enter Timeline Group
  vars.g.timeline = vars.svg.selectAll("g#timeline").data(["timeline"])
  vars.g.timeline.enter().append("g")
    .attr("id","timeline")
    .attr("transform","translate(0,"+vars.height.value+")")

  // Enter Key Group
  vars.g.key = vars.svg.selectAll("g#key").data(["key"])
  vars.g.key.enter().append("g")
    .attr("id","key")
    .attr("transform","translate(0,"+vars.height.value+")")

  // Enter Footer Group
  vars.g.footer = vars.svg.selectAll("g#footer").data(["footer"])
  vars.g.footer.enter().append("g")
    .attr("id","footer")
    .attr("transform","translate(0,"+vars.height.value+")")

  // Enter App Clipping Mask
  vars.g.clipping = vars.svg.selectAll("#clipping").data(["clipping"])
  vars.g.clipping.enter().append("clipPath")
    .attr("id","clipping")
    .append("rect")
      .attr("width",vars.app_width)
      .attr("height",vars.app_height)

  // Enter Container Group
  vars.g.container = vars.svg.selectAll("g#container").data(["container"])
  vars.g.container.enter().append("g")
    .attr("id","container")
    .attr("clip-path","url(#clipping)")
    .attr("transform","translate("+vars.margin.left+","+vars.margin.top+")")

  // Enter Zoom Group
  vars.g.zoom = vars.g.container.selectAll("g#zoom").data(["zoom"])
  vars.g.zoom.enter().append("g")
    .attr("id","zoom")
    .attr("transform","translate("+vars.margin.left+","+vars.margin.top+")")

  // Enter App Background Group
  vars.g.app = vars.g.zoom.selectAll("g#app").data(["app"])
  vars.g.app.enter().append("g")
    .attr("id","app")

  // Enter App Group
  vars.g.apps[vars.type.value] = vars.g.app.selectAll("g#"+vars.type.value).data([vars.type.value])
  vars.g.apps[vars.type.value].enter().append("g")
    .attr("id",vars.type.value)

  // Enter Links Group
  vars.g.links = vars.g.zoom.selectAll("g#links").data(["links"])
  vars.g.links.enter().append("g")
    .attr("id","links")

  // Enter Link Focus Group
  vars.g.link_focus = vars.g.zoom.selectAll("g#link_focus").data(["link_focus"])
  vars.g.link_focus.enter().append("g")
    .attr("id","link_focus")
    .attr("opacity",0)

  // Enter App Data Group
  vars.g.data = vars.g.zoom.selectAll("g#data").data(["data"])
  vars.g.data.enter().append("g")
    .attr("id","data")

  vars.defs = vars.svg.selectAll("defs").data(["defs"])
  vars.defs.enter().append("defs")

}
