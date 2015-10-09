

/* global _ */

(function () {

// Baseline setup
// --------------

// Establish the root object, `window` (`self`) in the browser, `global`
// on the server, or `this` in some virtual machines. We use `self`
// instead of `window` for `WebWorker` support.
    var root = typeof self === 'object' && self.self === self && self ||
            typeof global === 'object' && global.global === global && global || this;

    var Weasywig = function (obj) {
        if (obj instanceof Weasywig)
            return obj;
        if (!(this instanceof Weasywig))
            return new Weasywig(obj);
    };

    root.Weasywig = Weasywig;
    Weasywig.version = '0.1';

    Weasywig.components = [];
    Weasywig.pictureSize = ['extra-small', 'small', 'mean', 'large', 'extra-large'];
    Weasywig.variations = ['default', 'primary', 'success', 'info', 'warning', 'danger'];
    Weasywig.glyphicons = ['adjust', 'align-center', 'align-justify', 'align-left', 'align-right', 'arrow-down', 'arrow-left', 'arrow-right', 'arrow-up', 'asterisk', 'backward', 'ban-circle', 'barcode', 'bell', 'bold', 'book', 'bookmark', 'briefcase', 'bullhorn', 'calendar', 'camera', 'certificate', 'check', 'chevron-down', 'chevron-left', 'chevron-right', 'chevron-up', 'circle-arrow-down', 'circle-arrow-left', 'circle-arrow-right', 'circle-arrow-up', 'cloud', 'cloud-download', 'cloud-upload', 'cog', 'collapse-down', 'collapse-up', 'comment', 'compressed', 'copyright-mark', 'credit-card', 'cutlery', 'dashboard', 'download', 'download-alt', 'earphone', 'edit', 'eject', 'envelope', 'euro', 'exclamation-sign', 'expand', 'export', 'eye-close', 'eye-open', 'facetime-video', 'fast-backward', 'fast-forward', 'file', 'film', 'filter', 'fire', 'flag', 'flash', 'floppy-disk', 'floppy-open', 'floppy-remove', 'floppy-save', 'floppy-saved', 'folder-close', 'folder-open', 'font', 'forward', 'fullscreen', 'gbp', 'gift', 'glass', 'globe', 'hand-down', 'hand-left', 'hand-right', 'hand-up', 'hd-video', 'hdd', 'header', 'headphones', 'heart', 'heart-empty', 'home', 'import', 'inbox', 'indent-left', 'indent-right', 'info-sign', 'italic', 'leaf', 'link', 'list', 'list-alt', 'lock', 'log-in', 'log-out', 'magnet', 'map-marker', 'minus', 'minus-sign', 'move', 'music', 'new-window', 'off', 'ok', 'ok-circle', 'ok-sign', 'open', 'paperclip', 'pause', 'pencil', 'phone', 'phone-alt', 'picture', 'plane', 'play', 'play-circle', 'plus', 'plus-sign', 'print', 'pushpin', 'qrcode', 'question-sign', 'random', 'record', 'refresh', 'registration-mark', 'remove', 'remove-circle', 'remove-sign', 'repeat', 'resize-full', 'resize-horizontal', 'resize-small', 'resize-vertical', 'retweet', 'road', 'save', 'saved', 'screenshot', 'sd-video', 'search', 'send', 'share', 'share-alt', 'shopping-cart', 'signal', 'sort', 'sort-by-alphabet', 'sort-by-alphabet-alt', 'sort-by-attributes', 'sort-by-attributes-alt', 'sort-by-order', 'sort-by-order-alt', 'sound-5-1', 'sound-6-1', 'sound-7-1', 'sound-dolby', 'sound-stereo', 'star', 'star-empty', 'stats', 'step-backward', 'step-forward', 'stop', 'subtitles', 'tag', 'tags', 'tasks', 'text-height', 'text-width', 'th', 'th-large', 'th-list', 'thumbs-down', 'thumbs-up', 'time', 'tint', 'tower', 'transfer', 'trash', 'tree-conifer', 'tree-deciduous', 'unchecked', 'upload', 'usd', 'user', 'volume-down', 'volume-off', 'volume-up', 'warning-sign', 'wrench', 'zoom-in', 'zoom-out']
    Weasywig.askingState = false;
    Weasywig.currentQuestion = -1;
    
    Weasywig.addComponent = function (comp) {
        this.components.push(comp);
    };
    Weasywig.getComponents = function () {
        return this.components;
    };

    Weasywig.ajaxRendering = function (templateName, domObject, callback) {
        var self = this;
        if (templateName !== null) {
            $.ajax({
                'url': 'assets/templates/' + templateName + '.html',
                method: 'GET',
                cache: false,
                success: function (xml) {
                    var html = '<p class="text-danger" >An error occured</p>';
                    if (domObject !== null) {
                        html = self.addObjToElem(xml, domObject);
                    } else if (callback && _.isFunction(callback)) {
                        html = callback.call(self, xml);
                    }
                    self.view && self.view.endRendering(html);
                },
            });
        } else {
            var $baseDiv = $('<div/>').addClass('parent');
            var rendered = this.addObjToElem($baseDiv[0], domObject);
            this.view && this.view.endRendering(rendered);
        }
    };

    Weasywig.ajaxSave = function (projectName, dom, callback, context) {
        $.ajax({
            'url': 'saver.php',
            'method': 'POST',
            'cache': false,
            data: {
                'content': dom,
                'projectName': projectName
            },
            success: function (data) {
                callback.call(context,data);
            }
        });
    };

    Weasywig.ajaxGetSave = function (projectName, $root) {
        $root.load('assets/saves/' + projectName + '.html');
        Weasywig.view.updateOrder();
    };

    Weasywig.addObjToElem = function (parent, element) {
        var $part = $(parent);
        if ($part.hasClass('parent')) {
            $part.append($(element));
        } else {
            if ($part.find('.parent').length) {
                $part.find('.parent').append($(element));
            }
        }
        return $part[0];
    };

    Weasywig.setView = function (view) {
        this.view = view;
    };

    Weasywig.askQuestions = function (element, prevAnswer) {
        prevAnswer = prevAnswer || null;
        var questions = element.questions;
        this.askingState = true;
        this.currentQuestion++;
        //If there is no question or we finished asking all the questions
        if (!questions || this.currentQuestion === questions.length || prevAnswer && prevAnswer.end) {
            this.lastQuestion(prevAnswer, questions[this.currentQuestion], element);
        } else { // Some more questions to ask
            askQuestion(prevAnswer, questions[this.currentQuestion], element);
        }

    };

    Weasywig.endAsking = function () {
        this.askingState = false;
        this.currentQuestion = -1;
    };

    Weasywig.lastQuestion = function (domNTemplate) {
        this.ajaxRendering(domNTemplate.templatePath || null, domNTemplate.DOM || null, domNTemplate.generator || null);
        this.endAsking();
    };

    /*------------------
     * Useful functions 
     * ----------------
     */

    Weasywig.stringToSize = function (string) {
        switch (string) {
            case 'extra-small':
                return 'col-xs-1';
            case 'small' :
                return 'col-xs-4'
            case 'mean' :
                return 'col-xs-6';
            case 'large' :
                return 'col-xs-9';
            case 'extra-large' :
                return 'col-xs-12';
        }
    };

    function askQuestion(prevAnswer, question, element) {
        console.log("askquestion");
        var answ = (prevAnswer && prevAnswer.data) || prevAnswer;
        var template = question(answ);
        Weasywig.view.showModal(template.type, template.options, function (modal, events, res) {
            console.log(modal);
            if (modal === null) { //User canceled
                Weasywig.endAsking();
            } else {
                if (!template.callback && res) {//Only have an answer to return
                    Weasywig.askQuestions(element, res);
                } else if (template.callback) {
                    /*
                     * Here's a tricky part : the modal callback can return an unknown number
                     * of arguments, and the 'processAnswer' expect the same number of arguments
                     */
                    var args = [modal, events];
                    for (var i = 2; i < arguments.length; i++) {
                        args.push(arguments[i]);
                    }
                    var answer = template.callback.apply(this, args);
                    if (!events.hide.isDefaultPrevented()) {
                        Weasywig.askQuestions(element, answer);
                    }
                } else {//Not normal, one the two below must be valid
                    Weasywig.endAsking();
                }

            }
        });
    }

})();