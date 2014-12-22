var attemptSections = 50;
var attemptSketches = 50;
var passedSectionAttempts = 0;

var docify = {};

render();

function render() {
  var source = $('#section-template').html();
  var template = Handlebars.compile(source);
  var data = parseContent('./content');
  docify.onDataLoad = function() {
    var cleanedData = cleanUpData(data);
    console.log(cleanedData);
    var html = template(cleanedData);
    $('body').append(html);
    docify.ready();
    initializeSketches();
  }
}

function cleanUpData(data) {
  return _.map(_.compact(data), function(item) {
    item.sketches = _.compact(item.sketches);
    return item;
  });
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
        section.text = paragraphify(textResponse);
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
          sketchItem.text = paragraphify(itemTextResponse);
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

function initializeSketches() {
  var sketches = $('canvas');
  _.each(sketches, function(sketch) {
    Processing.loadSketchFromSources(sketch, [sketch.getAttribute('data-processing-sources')]);
  });
}

function paragraphify(str) {
  //string.replace(/\n{2,}/g, "\n");
  return cat('<p>', str.replace(/\n{2,}/g, "\n").split("\n\n").join("</p><p>"), '</p>').split("\n").join("<br>");
}

function cat() {
  return _.reduce(arguments, function(memo, item) {
    return memo+item;
  }, "");
}