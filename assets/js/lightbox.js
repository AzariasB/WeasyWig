/* 
 * Created by : Azarias
 * Date : January 2014
 */


$(function () {
    $('body').on('click', 'img', function () {
        var $img = $('<img/>')
                .attr("src", $(this).attr("src"))
                .css({
                    "cursor": "default",
                    "height": "50vh",
                    "width": "auto",
                    "position" : "fixed",
                    "top" : "50%",
                    "left" : "50%",
                    "transform" : "translate(-50%,-50%)"
                });
        var div = $('<div/>')
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
        div.append($img);
        div.click(function () {
            div.fadeOut(function () {
                div.remove();
            });

        });
        $('body').append(div);
        div.fadeIn();
    });
});
