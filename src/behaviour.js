window.onload = function() {

    var selectedChapter = 0;

    $(".menu-entry").first().addClass("selected")
    $(".chapter").first().fadeIn();


    $(".menu-entry").each(function(index) {
        var that = this;
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

};

function resetSketch(resetButton) {
    var sketchUrl = resetButton.dataset.url;
    var res = $("body").find("[data-processing-sources='" + sketchUrl + "']");
    var canvas = res[0];

    var newCanvas = $(canvas).replaceWith('<canvas class="sketch"></canvas>');
    console.log(newCanvas);

    //console.log(canvas);
    
    // TODO:getInstanceByID seems to be buggy
    //var instance = Processing.getInstanceById(canvas.id);
    //instance.exit();
    //var context = canvas.getContext('2d');
    //context.clearRect(0, 0, canvas.width, canvas.height);

    Processing.loadSketchFromSources(newCanvas[0], [sketchUrl]);    
}





