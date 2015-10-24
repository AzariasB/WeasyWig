
/* global easyModal, Weasywig, _ */

(function () {

    var JS = {
        "name": "Javascript",
        'components': {
            'tabs': {
                "name": "Tabs",
                "possibleParent": "*",
                "questions": [function () {
                        return {
                            'type': easyModal.types.PROMPT,
                            'options': {
                                input: 'number',
                                title: 'How many tabs ? (max 5)',
                                size: 'modal-sm',
                                min : 1,
                                max : 5
                            },
                        };
                    }, function (precRes) {
                        var content = $('<div/>');
                        _.each(_.range(precRes), function () {
                            var num = '<input type="text" class="form-control easyModal-input" />';
                            content.append($(num));
                        });
                        return {
                            'type': easyModal.types.CUSTOM,
                            'options': {
                                'title': 'Title of each tab',
                                'content': content
                            },
                            'callback': function (modal, event) {
                                var titles = [],
                                        texts = $(modal).find('input[type="text"]'),
                                        navTmpl = _.template('<li role="presentation" class="<% first ? print("active") : print(""); %>"><a href="#<%= ref %>" aria-controls="home" role="tab" data-toggle="tab"><%= title %></a></li>'),
                                        panTmpl = _.template('<div role="tabpanel" class="tab-pane fade <% first ? print("in active") : print(""); %>" id="<%= ref %>"><div class="available"></div></div>');
                                _.each(texts, function (input) {
                                    titles.push($(input).val());
                                });
                                var $ul = $('<ul/>', {'class': 'nav nav-tabs', 'role': 'tablist'});
                                var $content = $('<div/>').addClass('tab-content');
                                _.each(titles, function (title, index) {
                                    var ref = title.toLowerCase();
                                    var first = index === 0;
                                    var navT = navTmpl({first: first, ref: ref, title: title});
                                    $ul.append($(navT));
                                    var pane = panTmpl({first: first, ref: ref});
                                    $content.append($(pane));
                                });
                                return {
                                    'DOM': $ul[0].outerHTML + $content[0].outerHTML
                                };
                            }
                        };
                    }]
            },
            "accordion": {
                "name": "Accordion",
                "template": "accordion",
                "possibleParent": "*",
                "questions": [
                    function () {
                        return {
                            type: easyModal.types.PROMPT,
                            'options': {
                                'title': 'Number of accordion (max 5) ?',
                                'input': 'number',
                                'size': 'modal-sm',
                                min : 1,
                                max : 5
                            },
                        };
                    },
                    function (numberOfAcc) {
                        var self = JS.components.accordion;
                        var conteneur = "";
                        _.each(_.range(numberOfAcc), function (index) {
                            conteneur += $(easyModal.templates.inputs.text).val("Accordion-" + index)[0].outerHTML;
                        });
                        return {
                            'type': easyModal.types.CUSTOM,
                            options: {
                                'content': conteneur,
                                'title': 'Title of each accordion'
                            },
                            'callback': function (modal, event) {
                                var titles = [];
                                _.each($(modal).find('.easyModal-input'), function (input) {
                                    titles.push($(input).val());
                                });
                                return {
                                    'templatePath': self.template,
                                    'generator': function (xml) {
                                        var $el = $(xml);
                                        var $pan = $el.find('.panel');
                                        _.each(titles, function (title, index) {
                                            var $clone = $pan.clone();
                                            var first = index === 0;
                                            $clone.find('.panel-heading').attr({id: 'heading-' + index});
                                            $clone.find('.panel-title a').attr({href: '#collaspe-' + index}).text(title);
                                            first && $clone.find('.panel-collapse').addClass('in');
                                            $clone.find('.panel-collapse').attr({id: 'collaspe-' + index});
                                            $el.append($clone);
                                        });
                                        $el.find('.panel').first().remove();
                                        return $el[0];
                                    }
                                };
                            }
                        };
                    }
                ]
            },
            "carousel": {
                "name": "Carousel",
                "possibleParent": "*",
                "template": "carousel",
                "questions": [function () {
                        return {
                            'type': easyModal.types.PROMPT,
                            'options': {
                                'input': 'number',
                                'title': 'Number of slides ? (max 10)',
                                'size': 'modal-sm',
                                min : 1,
                                max : 10
                            }
                        };
                    }, function (slides) {
                        var inputs = '';
                        _.each(_.range(slides), function () {
                            inputs += $(easyModal.templates.inputs.url).attr({'value' : 'http://img01.deviantart.net/7961/i/2009/339/c/1/minimal_dark_wallpaper_by_zeconcept.jpg'})[0].outerHTML;
                        });

                        return {
                            'type': easyModal.types.CUSTOM,
                            'options': {
                                'title': 'picture url of each slides',
                                'content': inputs
                            },
                            'callback': function (modal, event) {
                                var imgs = [];
                                _.each($(modal).find('.easyModal-input'), function (input) {
                                    imgs.push($(input).val());
                                });
                                var self = JS.components.carousel;
                                return {
                                    'templatePath' : self.template,
                                    'generator' : function(xml){
                                        var $el = $(xml);
                                        var $baseItem = $el.find('.item');
                                        var $container = $el.find('.carousel-inner');
                                        var $ol = $el.find('.carousel-indicators');
                                        _.each(imgs,function(url,index){
                                            var first = index === 0;
                                            var $li = $('<li data-target="#weasywig-carousel" data-slide-to="' + index + '"></li>');
                                            first && $li.addClass('active');
                                            $ol.append($li);
                                            var $item = $baseItem.clone();
                                            first && $item.addClass('active');
                                            $item.find('.carousel-image').attr({src : url});
                                            $container.append($item);
                                        });
                                        $el.find('.item').first().remove();
                                        return $el[0];
                                    }
                                };
                            }
                        };
                    }]
            }
        }
    }

    Weasywig.addComponent(JS);
})();