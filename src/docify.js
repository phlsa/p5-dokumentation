var attemptSections = 50;
var attemptSketches = 50;

var cat = String.concat;

$('body').append(render());

function render() {
  var source = $('#section-template').html();
  var template = Handlebars.compile(source);
  var html = template(data);
  return html;
}

function parseContent(basePath) {
  var allContent = [];
  for (var i=0; i<attemptSections; i++) {
    // Attempt to load the headline file of a section
    loadText(cat(basePath, "/", i, "/headline.txt"), function(headlineResponse) {
      var section = {headline: headlineResponse, text: "", sketches: []};
      // Attempt to load text file
      loadText(cat(basePath, "/text.txt"), function(textResponse) {
        section.text = textResponse;
      });
      // Attempt to load sketches
      for (var j=0; j<attemptSketches; j++) {
        loadText(cat(basePath, "/", i, "/", j, ".pde"), function(pdeResponse) {
          section.sketches[j] = cat(basePath, "/", i, "/", j, ".pde");
        });
      }
      allContent[i] = section;
    });
  }
  return allContent;
}

function loadText(path, success) {
  $.ajax({
    url: path, 
    success: success,
    dataType: "text"
  });
}