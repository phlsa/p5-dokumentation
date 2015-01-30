var ownSketchIdCounter = 0;

docify.ready = function() {

    var selectedChapter = 0;
    initializeSketches($(".chapter:nth-child(" + (selectedChapter + 1) + ")"));

    $(".menu-entry").first().addClass("selected")
    $(".chapter").first().fadeIn();

    $(".menu-entry").each(function(index) {
        var that = this;

        if ($(that).text().charAt(0) == ' ' || $(that).text().charAt(0) == '\t') {
            $(that).addClass('subchapter');
        }

        $(this).click(function() {
            var scrollY = window.pageYOffset;

            var chapterTop = $(".chapter:nth-child(" + (selectedChapter + 1) + ")").css("top");
            chapterTop = parseInt(chapterTop);

            var dir = 1;
            if (index > selectedChapter) {
                dir = -1;
            }

            stopSketches($(".chapter:nth-child(" + (selectedChapter + 1) + ")"));
            $(".menu-entry:nth-child(" + (selectedChapter + 1) + ")").removeClass("selected");
            $(".chapter:nth-child(" + (selectedChapter + 1) + ")").fadeOut({
                progress: function(obj, p, r) {
                    //$(obj.elem).css("top", chapterTop + dir * (p) * 50);
                    window.scrollTo(0, (1 - p) * scrollY);
                }
            });

            selectedChapter = index;
            initializeSketches($(".chapter:nth-child(" + (selectedChapter + 1) + ")"));
            $(".menu-entry:nth-child(" + (selectedChapter + 1) + ")").addClass("selected");
            $(".chapter:nth-child(" + (selectedChapter + 1) + ")").fadeIn({
                progress: function(obj, p, r) {
                    //$(obj.elem).css("top", chapterTop - dir * (1 - p) * 50);
                }
            });
        });
    });

    $(".t3").each(function(index) {
        if ($(this).text().length < 250) {
            $(this).addClass("one-coloumn");
        }
    });

    $("p:has(code)").addClass("code");
    $("p.code").prev("p.code").addClass("not-last");
    /*
        $(".image").each(function(index) {
            console.log( $(this).
        });
    */
};

function stopSketches(chapter) {
    var sketches = chapter.find('canvas');
    
    _.each(sketches, function(sketch) {
        // remember dimensions of the sketch
        var w = sketch.getAttribute('width');
        var h = sketch.getAttribute('height');
        var sketchUrl = sketch.getAttribute('data-processing-sources');

        $(sketch).replaceWith('<canvas id="p5sketch' + ownSketchIdCounter + '" class="sketch" data-processing-sources="' + sketchUrl + '"></canvas>')
        var newCanvas = $('canvas#p5sketch' + ownSketchIdCounter);
        newCanvas.css({
            width: w + "px",
            height: h + "px"
        });

        ownSketchIdCounter++;
    });

}

function initializeSketches(chapter) {
    var sketches = chapter.find('canvas');
    _.each(sketches, function(sketch) {
        Processing.loadSketchFromSources(sketch, [sketch.getAttribute('data-processing-sources')]);
    });
}

function resetSketch(resetButton) {
    var sketchUrl = resetButton.dataset.url;
    var res = $("body").find("[data-processing-sources='" + sketchUrl + "']");
    var sketch = res[0];

    // remember dimensions of the sketch
    var w = sketch.getAttribute('width');
    var h = sketch.getAttribute('height');

    $(sketch).replaceWith('<canvas id="p5sketch' + ownSketchIdCounter + '" class="sketch" data-processing-sources="' + sketchUrl + '"></canvas>')
    var newCanvas = $('canvas#p5sketch' + ownSketchIdCounter);
    newCanvas.css({
        width: w + "px",
        height: h + "px"
    }); // set the new canvas to the remembered dimensions to prevent the page from jumping

    Processing.loadSketchFromSources(newCanvas[0], [sketchUrl]);

    ownSketchIdCounter++;
}