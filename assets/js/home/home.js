/* 
 Parallax, project delete
 and google maps API gestion
 */


/* global google */

(function () {
    /*
     * 
     */
    var navMoving = false;
    if ($(window).scrollTop() === 0) {
        $('object[hidden]').first().removeAttr('hidden');
    }

    $('#parallax').css('background-position-y', '0%');
    $('#map_panel').accordion({
        'active': false,
        'collapsible': true,
        'disabled': true,
        'heightStyle': "content"
    });

    $(window).scroll(function () {
        //Simple parallax
        var height = $(window).height();
        var scrollPos = $(window).scrollTop();

        $("#heading_buttons").toggleClass("clone", (scrollPos > height));
        var percent = (scrollPos / $(document).height()) * 100;
        $('#parallax').css('background-position-y', percent + '%');


        $('object[hidden]').attr('hidden', function (index, attr) {
            if ($(this).closest('.row').offset().top <= scrollPos + height) {
                return null;
            } else {
                return "";
            }
        });

        if (!navMoving) {
            $('#heading_buttons a').each(function () {
                var target = $(this).attr('href');
                var tOffset = $(target).offset().top;
                if (tOffset < scrollPos && tOffset + height/2 > scrollPos) {
                    resetCurrent($(this));
                    return false;//Break out of the loop
                }
            });
        }

    });

    $('a[id^="remove_"').click(function () {
        if (confirm("Do you really want to delete this project ?")) {
            var fileToRemove = $(this).attr('id').replace('remove_', '');
            $.post('destroy.php', {projectName: fileToRemove}, function (data) {
                var res = JSON.parse(data);
                if (res) {
                    //reload page
                    window.location.reload();
                }
            });
        }
    });


    $('#heading_buttons a').click(function (event) {
        event.preventDefault();
        resetCurrent($(this));
        swingTo($($(this).attr('href')));
    });

    $('#to_top').click(function () {
        swingTo($('#Projects'));
        return false;
    });

    function swingTo($target) {
        navMoving = true;
        $('body').animate({
            scrollTop: $target.offset().top
        }, 500, 'swing', function () {
            navMoving = false;
        });
    }

    function resetCurrent($nwCurrent) {
        $('#heading_buttons a').removeClass('current');
        $nwCurrent.addClass('current');
    }
})();



//Google maps stuff
function initMap() {
    var key = 'AIzaSyB4wcYndpXCDGPxRRm5r5yhIJOfoyE8Fi8',
            url = 'https://maps.googleapis.com/maps/api/geocode/json',
            myLatLng = {lat: 45.502831, lng: 6.05431}, origin,
            directionsService = new google.maps.DirectionsService,
            directionsDisplay = new google.maps.DirectionsRenderer;

    var image = {
        url: 'assets/images/home/marker.png',
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


    var contentString = '<div id="content" style="color : black;" >' +
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
            'Montmélian - France.</p>' + '<img width="100" class="img-responsive" src="assets/images/home/api.png" />' +
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

    directionsDisplay.setMap(map);
    directionsDisplay.setPanel(document.getElementById('direction'));

    //marker.addListener('mouseover', addAnimation);
    marker.addListener('click', function () {
        infowindow.open(map, marker);
    });


    function travelFrom(formatedAdress) {
        directionsService.route({
            origin: formatedAdress,
            destination: new google.maps.LatLng(myLatLng.lat, myLatLng.lng),
            travelMode: google.maps.TravelMode.DRIVING
        }, function (response, status) {
            if (status === google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(response);
                displayPanel(response);
            } else {
                window.alert('Directions request failed due to ' + status);
            }
        });
    }

    function displayPanel(response) {
        $('#map_panel').accordion("option", {
            'active': 0,
            'disabled': false
        });


        var nwDirection = "From : ";
        setTimeout(function () {
            $('table.adp-placemark td.adp-text').each(function (index) {
                console.log(index);
                if ($(this).text())
                    nwDirection += $(this).text();
                if (index === 0) {
                    nwDirection += "<br/>To : ";
                }
            });
            $("#map_panel h3").html(nwDirection);

        }, 10);
    }

    google.maps.event.addListener(map, "rightclick", function (event) {
        travelFrom(event.latLng);
    });


}
