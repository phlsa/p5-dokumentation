var attemptSections = 50;
var attemptSketches = 50;
var passedSectionAttempts = 0;

var cat = String.concat;
var docify = {};

render();

function render() {
  var source = $('#section-template').html();
  var template = Handlebars.compile(source);
  var data = parseContent('./content');
  docify.onDataLoad = function() {
    console.log(_.compact(data));
    var html = template(_.compact(data));
    $('body').append(html);
    docify.ready();
  }
}

function parseContent(basePath) {
  var allContent = [];
  _.each(numberedArray(1, attemptSections), function(i) {

    // Attempt to load the headline file of a section
    loadText(cat(basePath, "/", i, "/headline.txt"), function(headlineResponse) {
      var section = {title: headlineResponse, text: "", sketches: []};
      
      // Setup loading for sub-items
      var sketchPlaceholderArray = numberedArray(1, attemptSketches);
      var sketchesQueriedCount = 0;
      var sketchAttemptFinished = function() {
        sketchesQueriedCount++;
        if (sketchesQueriedCount == sketchPlaceholderArray.length+1) { // +1 because we're simply counting the global description as a sketch item
          sectionAttemptFinished();
        }
      }

      // Attempt to load text file
      loadText(cat(basePath, "/", i, "/text.txt"), function(textResponse) {
        section.text = textResponse;
        sketchAttemptFinished();
      }, sketchAttemptFinished);

      // Attempt to load sketches
      _.each(sketchPlaceholderArray, function(j) {
        var sketchItem = {url: "", text:"", isPDE: false};
        var itemsQueriedCount = 0;
        var itemAttemptFinished = function() {
          itemsQueriedCount++;
          if (itemsQueriedCount == 3) {
            sketchAttemptFinished();
          }
        }

        loadText(cat(basePath, "/", i, "/", j, ".pde"), function(pdeResponse) {
          sketchItem.url = cat(basePath, "/", i, "/", j, ".pde");
          sketchItem.isPDE = true;
          section.sketches[j] = sketchItem;
          itemAttemptFinished();
        }, itemAttemptFinished);
        loadText(cat(basePath, "/", i, "/", j, ".png"), function(pngResponse) {
          sketchItem.url = cat(basePath, "/", i, "/", j, ".png");
          sketchItem.isPDE = false;
          section.sketches[j] = sketchItem;
          itemAttemptFinished()
        }, itemAttemptFinished);
        loadText(cat(basePath, "/", i, "/", j, ".txt"), function(itemTextResponse) {
          sketchItem.text = itemTextResponse;
          section.sketches[j] = sketchItem;
          itemAttemptFinished();
        }, itemAttemptFinished);
      });

      allContent[i] = section;
    }, sectionAttemptFinished);
  });

  return allContent;
}

function sectionAttemptFinished() {
  passedSectionAttempts++;
  checkAllAttemptsFinished();
}

function checkAllAttemptsFinished() {
  if (passedSectionAttempts == attemptSketches) {
    _.delay(docify.onDataLoad, 200);
  }
}

function loadText(path, successFunction, errorFunction) {
  $.ajax({
    url: path,
    dataType: "text",
    success: successFunction,
    error: errorFunction,
  });
}

function numberedArray(from, to) {
  var ar = [];
  for (var i=from; i<=to; i++) {ar.push(i)}
  return ar;
}