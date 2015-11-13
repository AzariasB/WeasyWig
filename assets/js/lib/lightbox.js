/* 
 * Created by : Azarias
 */


$(function () {
    $('body').on('click', 'img', function () {
        if (!$(this).hasClass('over-picture')) {
            var divSrc = $(this).attr("aria-describedby");
            var imgTitle = $(this).attr("title") || $("#" + divSrc).text();
            var $img = $('<img/>')
                    .attr({
                        "src": $(this).attr("src"),
                        "class": "over-picture"
                    })
                    .css({
                        "cursor": "default",
                        "height": "50vh",
                        "width": "auto",
                        "max-width": "90vw",
                        "position": "fixed",
                        "top": "50%",
                        "left": "50%",
                        "transform": "translate(-50%,-50%)"
                    });

            var $div = $('<div/>')
                    .css({
                        "position": "fixed",
                        "background-color": "rgba(255,255,255,0.6)",
                        "height": "100vh",
                        "width": "100vw",
                        "top": 0,
                        "left": 0,
                        "display": "none",
                        "z-index": 1031
                    });
            $div.append($img);
            if (imgTitle) {
                var $tex = $('<p/>')
                        .text(imgTitle)
                        .css({
                            "height": "50px",
                            "font-size": "2em",
                            "bottom": -10,
                            "width": "100vw",
                            "position": "fixed",
                            "text-align": "center",
                            "color": "white",
                            "background-color": "rgba(0,0,0,0.8)"
                        });
                $div.append($tex);
            }


            disableScroll();
            $div.click(function () {
                $div.fadeOut(function () {
                    $div.remove();
                    enableScroll();
                });

            });
            
            $('body').append($div);
            $div.fadeIn();
        }
    });

    // left: 37, up: 38, right: 39, down: 40,
    // spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
    var keys = {37: 1, 38: 1, 39: 1, 40: 1};

    function preventDefault(e) {
        e = e || window.event;
        if (e.preventDefault)
            e.preventDefault();
        e.returnValue = false;
    }

    function preventDefaultForScrollKeys(e) {
        if (keys[e.keyCode]) {
            preventDefault(e);
            return false;
        }
    }

    function disableScroll() {
        if (window.addEventListener) // older FF
            window.addEventListener('DOMMouseScroll', preventDefault, false);
        window.onwheel = preventDefault; // modern standard
        window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
        window.ontouchmove = preventDefault; // mobile
        document.onkeydown = preventDefaultForScrollKeys;
    }

    function enableScroll() {
        if (window.removeEventListener)
            window.removeEventListener('DOMMouseScroll', preventDefault, false);
        window.onmousewheel = document.onmousewheel = null;
        window.onwheel = null;
        window.ontouchmove = null;
        document.onkeydown = null;
    }
});
