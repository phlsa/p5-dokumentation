

docify.ready = function() {

    var selectedChapter = 0;
    
    $(".menu-entry").first().addClass("selected")
    $(".chapter").first().fadeIn();


    $( ".menu-entry" ).each(function( index ) {
        var that = this;
        $(this).click( function() {
            var dir = 1;
            if (index > selectedChapter) {
                dir = -1;
            }

            $( ".menu-entry:nth-child("+(selectedChapter+1)+")" ).removeClass("selected");
            $( ".chapter:nth-child("+(selectedChapter+1)+")" ).fadeOut({ 
                progress: function(obj, p, r) {
                    $(obj.elem).css("top", 30+dir*(p)*50);
                }
            });
            selectedChapter = index;
            $( ".menu-entry:nth-child("+(selectedChapter+1)+")" ).addClass("selected");
            $( ".chapter:nth-child("+(selectedChapter+1)+")" ).fadeIn({ 
                progress:function(obj, p, r) {
                    $(obj.elem).css("top", 30-dir*(1-p)*50);
                }
            });
        });
    });
/*
    $(".menu-entry").click(function(e) {
        console.log(e);

    });
*/

};

