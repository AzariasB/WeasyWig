
/* global _ */

(function () {
    var docsFile,
            $dps = $("#doc_parts"),
            $doc = $("#documentation"),
            mainDoc = /^#\w+$/,
            subDoc = /^#\w+\/\w+$/,
            docHeight = $(document).height(),
            $progress,
            oldHash;

    $("#progressbar").progressbar();
    $progress = $("#progressbar").progressbar('instance');
    $progress.value(0);

    $.getJSON('assets/json/documentation.json', getDocumentation);
    $('body').on('click', 'a[href^="#"]', function () {
        //To scroll even if the hash is the same
        if (window.location.hash === $(this).attr('href')) {
            $(window).trigger('hashchange');
        }
    });

    function changeDarkness(e, ui) {
        var $t = $("body");
        var colVal = ui.value;
        var bgVal = 255 -ui.value;
        var color = 'rgb(' + colVal + ',' + colVal + ',' + colVal + ')';
        var background = 'rgb(' + bgVal + ',' + bgVal + ',' + bgVal + ');';
        $t.css({
            'color' : color,
            'background-color' : background
        });
    }

    function changeTextSize(e, ui) {
        console.log(ui.value + 100);
        $("#documentation").css('font-size', ui.value + 100 + '%');
    }

    $("#range_dark").slider({
        'max': 255,
        'min': 0,
        'slide': changeDarkness
    });

    $("#range_size").slider({
        'max': 100,
        'min': 0,
        'slide': changeTextSize
    });

    $(window).scroll(function () {
        $progress.value((($(window).scrollTop()) / (docHeight - $(window).height())) * (100));
    });

    function getDocumentation(json) {
        docsFile = json.docs;
        getHTMLDoc(0);
    }

    function getHTMLDoc(index) {
        if (docsFile[index]) {
            var htmlFile = docsFile[index];
            var $dummy = $('<div/>');
            $dummy.load('assets/documentation/' + htmlFile + '.html ', function () {
                $dps.append($(this).find('.dropdown'));
                var $row = $(this).find('.documentation').hide();
                $doc.append($row);
                getHTMLDoc(index + 1);
            });
        } else {
            //It was the last load
            loadHash();
        }
    }

    function loadHash() {
        if (!window.location.hash) {
            window.location.hash = 'doc_general';
        }
        $(window).trigger('hashchange');

    }

    function changeDoc(oldDoc, nwDocId, callback) {
        if (oldDoc) {
            $doc.find(oldDoc).fadeOut('fast', function () {
                $doc.find(nwDocId).fadeIn('fast', function () {
                    callback && callback();
                    docHeight = $(document).height();

                });
            });
        } else {
            $doc.find(nwDocId).fadeIn('fast', function () {
                callback && callback();
                docHeight = $(document).height();
            });
        }
    }

    function changeSubDoc(parent, subDoc) {
        var $parent = $doc.find(parent);
        var $son = $(parent).find(subDoc);
        if ($parent.is(':hidden')) {
            //If subdoc is hidden, we have to change of doc
            changeDoc(oldHash, parent, function () {
                scrollTo($son);
            });
            oldHash = parent;
        } else {
            scrollTo($son);
        }
    }

    function scrollTo(target) {
        var dest;
        if (typeof target === 'object') {
            var $tar = $("#documentation").find(target);
            if ($tar.length) {
                var $tar = $doc.find(target);
                dest = $tar.offset().top - 60;
            }
        } else if (typeof target === 'number') {
            dest = target;
        }
        $('body').animate({
            scrollTop: dest
        }, 500, 'swing');
    }



    $(window).on('hashchange', function () {
        var nwHash = window.location.hash;
        if (mainDoc.test(nwHash)) {
            changeDoc(oldHash, nwHash, function () {
                scrollTo(0);
            });
            oldHash = nwHash;
        } else if (subDoc.test(nwHash)) {
            var parent = nwHash.substr(0, nwHash.indexOf('/'));
            var sonDoc = nwHash.substr(nwHash.indexOf('/') + 1, nwHash.length);
            changeSubDoc(parent, '#' + sonDoc);
        }
    });

    $(document).tooltip();

})();
