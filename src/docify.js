/*Handlebars.registerHelper('sectionlist', function() {
  console.log("sectionlist: ");
  console.log(this);

  return obj.sections;
});*/

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
    var cleanedSections = cleanUpData(data.sections);
    data.sections = cleanedSections;
    var html = template(data);
    $('body').append(html);
    docify.ready();
    //initializeSketches();
  }
}

function cleanUpData(data) {
  return _.map(_.compact(data), function(item) {
    item.sketches = _.compact(item.sketches);
    return item;
  });
}

function parseContent(basePath) {
  //var allContent = [];
  var allContent = {sections:[]};

  // Attempt to load the header texts
  loadText(cat(basePath, "/course.txt"), function(res) {
    allContent.course = res;
  });
  loadText(cat(basePath, "/semester.txt"), function(res) {
    allContent.semester = res;
  });
  loadText(cat(basePath, "/teacher.txt"), function(res) {
    allContent.teacher = res;
  });
  loadText(cat(basePath, "/student.txt"), function(res) {
    allContent.student = res;
  });


  _.each(numberedArray(1, attemptSections), function(i) {

    // Attempt to load the headline file of a section
    loadText(cat(basePath, "/", i, "/headline.txt"), function(headlineResponse) {
      var section = {
        title: headlineResponse,
        text: "",
        sketches: []
      };

      // Setup loading for sub-items
      var sketchPlaceholderArray = numberedArray(1, attemptSketches);
      var sketchesQueriedCount = 0;
      var sketchAttemptFinished = function() {
        sketchesQueriedCount++;
        if (sketchesQueriedCount == sketchPlaceholderArray.length + 1) { // +1 because we're simply counting the global description as a sketch item
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
        var sketchItem = {
          url: "",
          text: "",
          isPDE: false
        };
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
        loadText(cat(basePath, "/", i, "/", j, ".jpg"), function(jpgResponse) {
          sketchItem.url = cat(basePath, "/", i, "/", j, ".jpg");
          sketchItem.isPDE = false;
          section.sketches[j] = sketchItem;
          itemAttemptFinished()
        }, itemAttemptFinished);
        loadText(cat(basePath, "/", i, "/", j, ".jpeg"), function(jpgResponse) {
          sketchItem.url = cat(basePath, "/", i, "/", j, ".jpeg");
          sketchItem.isPDE = false;
          section.sketches[j] = sketchItem;
          itemAttemptFinished()
        }, itemAttemptFinished);
        loadText(cat(basePath, "/", i, "/", j, ".png"), function(pngResponse) {
          sketchItem.url = cat(basePath, "/", i, "/", j, ".png");
          sketchItem.isPDE = false;
          section.sketches[j] = sketchItem;
          itemAttemptFinished()
        }, itemAttemptFinished);
        loadText(cat(basePath, "/", i, "/", j, ".svg"), function(svgResponse) {
          sketchItem.url = cat(basePath, "/", i, "/", j, ".svg");
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

      //allContent[i] = section;
      allContent.sections[i] = section;
    }, sectionAttemptFinished);
  });
  console.log(allContent);
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
  for (var i = from; i <= to; i++) {
    ar.push(i)
  }
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
  return cat('<p>', str.replace(/\n{3,}/g, "\n\n")                  // make sure there are no more than two newlines in a row
                       .split("\n\n").join("</p><p>"), '</p>')      // convert double newlines into <p></p> tags
                       .split("\n").join("<br>")                    // replace single newlines with <br> tags
                       .replace(/\<code\>\<br\>/g, "<code>");       // remove newlines right after opening <code> tags
}

function cat() {
  return _.reduce(arguments, function(memo, item) {
    return memo + item;
  }, "");
}