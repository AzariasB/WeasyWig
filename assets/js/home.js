/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


/* global google */

(function () {
    $(window).scrollTop(0);
    $('#parallax').css('background-position-y', '0%');

    $(window).scroll(function () {
        //Simple parallax
        var scrollPos = $(window).scrollTop();
        var percent = (scrollPos / $(document).height()) * 100;
        $('#parallax').css('background-position-y', percent + '%');
    });



    $('a[id^="remove_"').click(function () {
        if (confirm("Do you really want to delete this project ?")) {
            var fileToRemove = $(this).attr('id').replace('remove_', '');
            $.post('destroy.php', {projectName: fileToRemove}, function (data) {
                console.log(data);
                var res = JSON.parse(data);
                if (res) {
                    //reload page
                    window.location.reload();
                }
            });
        }
    });
})();



//Google maps stuff
function initMap() {
    var myLatLng = {lat: 45.502831, lng: 6.05431};
    var image = {
        url: 'assets/images/marker.png',
        // This marker is 20 pixels wide by 32 pixels high.
        size: new google.maps.Size(64, 64),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(32, 64)
    };
    // Shapes define the clickable region of the icon. The type defines an HTML
    // <area> element 'poly' which traces out a polygon as a series of X,Y points.
    // The final coordinate closes the poly by connecting to the first coordinate.
    var shape = {
        coords: [16, 0, 64, 0, 48, 64, 0, 64],
        type: 'poly'
    };

    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        center: myLatLng
    });
    var contentString = '<div id="content">' +
            '<div id="siteNotice">' +
            '</div>' +
            '<h1 id="firstHeading" class="firstHeading">WeasyiWig</h1>' +
            '<div id="bodyContent">' +
            '<p><b>WeasyWig</b>, is a French company ' +
            'situated in Savoie, next to Chambéry, in a little city called Montmélian. ' +
            'The company is creating websites and help maintains some others. ' +
            'A lot of company asked Weasywig to create a tool so that they can create themself a webpage ' +
            'without any knowledge in html/css/javascript. Because of the size of the project ' +
            'the company decided to work hard on it, using the well-known and usefull css framework "Boostrap". ' +
            'After a lot of months of works, the company realeased the Weasywig editor. ' +
            'The editor can create a readable and valid web page in just twenty clicks. ' +
            '</p><p>However, if the company wants to add their own components for some reasons, the company developped an API ' +
            'that is well documented and is really easy to use. The only dependencie of the application is jquery and jquery-ui</p>' +
            '<p> Weasywig, copyright 2015 ' +
            'Montmélian - France.</p>' +
            '</div>' +
            '</div>';

    var infowindow = new google.maps.InfoWindow({
        content: contentString
    });
    var marker = new google.maps.Marker({position: myLatLng,
        map: map,
        icon: image,
        shape: shape,
        title: 'WeasyWig Company'
    });
    //marker.addListener('mouseover', addAnimation);
    marker.addListener('mouseout', removeAnimation);
    marker.addListener('click', function () {
        infowindow.open(map, marker);
    });

    function addAnimation() {
        marker.setAnimation(google.maps.Animation.BOUNCE);
    }


    function removeAnimation() {
        marker.setAnimation(null);
    }

}