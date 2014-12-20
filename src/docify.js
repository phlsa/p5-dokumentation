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
  _.each(numberedArray(1, attemptSections), function(i) {

    // Attempt to load the headline file of a section
    loadText(cat(basePath, "/", i, "/headline.txt"), function(headlineResponse) {
      var section = {headline: headlineResponse, text: "", sketches: []};
      console.log(section);

      // Attempt to load text file
      console.log ("Attempting to load: " + cat(basePath, "/", i, "/text.txt"));
      loadText(cat(basePath, "/", i, "/text.txt"), function(textResponse) {
        console.log("Loaded some text.txt");
        section.text = textResponse;
      });
      
      // Attempt to load sketches
      _.each(numberedArray(1, attemptSketches), function(j) {
        loadText(cat(basePath, "/", i, "/", j, ".pde"), function(pdeResponse) {
          section.sketches[j] = cat(basePath, "/", i, "/", j, ".pde");
        });
      });

      allContent[i] = section;
    });
  });

  return allContent;
}

function loadText(path, successFunction) {
  $.ajax({
    url: path,
    dataType: "text",
    success: successFunction
  });
}

function numberedArray(from, to) {
  var ar = [];
  for (var i=from; i<=to; i++) {ar.push(i)}
  return ar;
}