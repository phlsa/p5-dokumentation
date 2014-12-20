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

      // Attempt to load text file
      loadText(cat(basePath, "/", i, "/text.txt"), function(textResponse) {
        section.text = textResponse;
      });
      
      // Attempt to load sketches
      _.each(numberedArray(1, attemptSketches), function(j) {
        var sketchItem = {url: "", text:"", isPDE: false};

        loadText(cat(basePath, "/", i, "/", j, ".pde"), function(pdeResponse) {
          sketchItem.url = cat(basePath, "/", i, "/", j, ".pde");
          sketchItem.isPDE = true;
          section.sketches[j] = sketchItem;
        });
        loadText(cat(basePath, "/", i, "/", j, ".png"), function(pngResponse) {
          sketchItem.url = cat(basePath, "/", i, "/", j, ".png");
          sketchItem.isPDE = false;
          section.sketches[j] = sketchItem;
        });
        loadText(cat(basePath, "/", i, "/", j, ".txt"), function(itemTextResponse) {
          sketchItem.text = itemTextResponse;
          section.sketches[j] = sketchItem;
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