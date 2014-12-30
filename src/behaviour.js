var ownSketchIdCounter = 0;

docify.ready = function() {

    var selectedChapter = 0;

    $(".menu-entry").first().addClass("selected")
    $(".chapter").first().fadeIn();


    $(".menu-entry").each(function(index) {
        var that = this;

        if ($(that).text().charAt(0)==' ' || $(that).text().charAt(0)=='\t') {
            $(that).addClass('subchapter');
        }

        $(this).click(function() {
            var dir = 1;
            if (index > selectedChapter) {
                dir = -1;
            }

            $(".menu-entry:nth-child(" + (selectedChapter + 1) + ")").removeClass("selected");
            $(".chapter:nth-child(" + (selectedChapter + 1) + ")").fadeOut({
                progress: function(obj, p, r) {
                    $(obj.elem).css("top", 30 + dir * (p) * 50);
                }
            });
            selectedChapter = index;
            $(".menu-entry:nth-child(" + (selectedChapter + 1) + ")").addClass("selected");
            $(".chapter:nth-child(" + (selectedChapter + 1) + ")").fadeIn({
                progress: function(obj, p, r) {
                    $(obj.elem).css("top", 30 - dir * (1 - p) * 50);
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

function resetSketch(resetButton) {
    var sketchUrl = resetButton.dataset.url;
    var res = $("body").find("[data-processing-sources='" + sketchUrl + "']");
    var canvas = res[0];

    $(canvas).replaceWith('<canvas id="p5sketch' + ownSketchIdCounter + '" class="sketch" data-processing-sources="' + sketchUrl + '"></canvas>');
    var newCanvas = $('canvas#p5sketch' + ownSketchIdCounter);

    Processing.loadSketchFromSources(newCanvas[0], [sketchUrl]);

    ownSketchIdCounter++;
}