/* 
 * Created by : Azarias
 */


$(function () {
    $('body').on('click', 'img', function () {
        var divSrc = $(this).attr("aria-describedby")
        var imgTitle = $("#" + divSrc).text();
        var $img = $('<img/>')
                .attr({
                    "src": $(this).attr("src")
                })
                .css({
                    "cursor": "default",
                    "height": "50vh",
                    "width": "auto",
                    "position": "fixed",
                    "top": "50%",
                    "left": "50%",
                    "transform": "translate(-50%,-50%)"
                });
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

        var $div = $('<div/>')
                .css({
                    "position": "fixed",
                    "background-color": "rgba(0,0,0,0.6)",
                    "height": "100vh",
                    "width": "100vw",
                    "top": 0,
                    "left": 0,
                    "display": "none",
                    "z-index": 1031
                });
        $div.append($img);
        $div.append($tex);
        $div.click(function () {
            $div.fadeOut(function () {
                $div.remove();
            });

        });
        $('body').append($div);
        $div.fadeIn();
    });
});
