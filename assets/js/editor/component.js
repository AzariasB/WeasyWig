


/* global Weasywig, easyModal, _ */
(function (root) {
    var COMPONENT = {
        "name": "Components",
        "components": {
            "glyphicons": {
                "name": "Glyphicons",
                "possibleParent": "*",
                "questions": [function () {
                        var template = _.template('<button type="submit" class="btn btn-default"><i class="glyphicon glyphicon-<%= glyph %>" ></i> </button>');

                        var allGlyphs = '';
                        _.each(Weasywig.glyphicons, function (glyph) {
                            allGlyphs += template({glyph: glyph});
                        });

                        return {
                            'type': easyModal.types.CUSTOM,
                            'options': {
                                title: 'Image',
                                content: allGlyphs,
                                buttons: '<h3>Click on a glyphicon to choose it</h3>'
                            },
                            'callback': function (modal, event) {
                                var submitClass = $(event.submit).find('i')[0].className;
                                return {'DOM': '<i class="' + submitClass + '" ></i>'};
                            }
                        };
                    }],
            },
            "dropDown": {
                "name": "Dropdown",
                "template": "dropdown",
                "possibleParent": "*",
                "questions": [function () {
                        var self = COMPONENT.components.dropDown;
                        return {
                            'type': easyModal.types.TEXTNAREA,
                            'options': {
                                title: 'Dropdown',
                                textLabel: 'Button text',
                                areaLabel: 'Coma-separated dropdown values'
                            },
                            'callback': function (modal, event, title, textArea) {
                                return {
                                    'templatePath': self.template,
                                    generator: function (ajaxHTML) {
                                        var $el = $(ajaxHTML);
                                        //Changing the button title
                                        $el.find('#dLabel').html(title + '<span class="caret"></span>');
                                        _.each(textArea.split(","), function (val) {
                                            var template = _.template('<li><a href="#"><%= action %></a></li>');
                                            var $li = $(template({action: val}));
                                            $el.find('#dp_ul').append($li);
                                        });
                                        return $el[0];
                                    }
                                };

                            }
                        };
                    }],
            },
            "breadcrums": {
                "name": "Breadcrumbs",
                "possibleParent": "*",
                "questions": [function () {

                        return {
                            'type': easyModal.types.PROMPT,
                            'options': {
                                title: 'Breadcrumbs',
                                placeholder: "Comma-separated values",
                                size: 'modal-lg'
                            },
                            'callback': function (modal, event, res) {
                                var values = res.split(",");
                                var $ol = $('<ol/>').addClass('breadcrumb');
                                _.each(values, function (crumb) {
                                    var $li = $('<li/>').html('<a href="#">' + crumb + '</a>');
                                    $ol.append($li);
                                });
                                return {
                                    'DOM': $ol[0]
                                };
                            }
                        };
                    }],
            },
            "label": {
                "name": "Labels",
                "possibleParent": "*",
                "questions": [function () {
                        return {
                            'type': easyModal.types.TEXTNDROPDOWN,
                            'options': {
                                title: 'Label',
                                textLabel: 'Label content',
                                selectLabel: 'Label type',
                                selectVal: Weasywig.variations
                            },
                            'callback': function (modal, event, res, index, variation) {
                                var template = _.template('<span class="label label-<%= variation %>"><%= content %></span>');
                                return {
                                    'DOM': template({'variation': variation, 'content': res})
                                };
                            }
                        };
                    }],
            },
            "list": {
                "name": "List Group",
                "possibleParent": "*",
                "questions": [function () {
                        return {
                            'type': easyModal.types.PROMPT,
                            'options': {
                                title: 'List of elements',
                                input: 'textarea',
                                placeholder: 'Comma-separated elements'
                            },
                            'callback': function (modal, event, res) {
                                var $ul = $('<ul/>').addClass('list-group');
                                _.each(res.split(','), function (li) {
                                    var $li = $('<li/>').addClass('list-group-item').text(li);
                                    $ul.append($li);
                                });
                                return {
                                    'DOM': $ul[0]
                                };
                            }
                        };
                    }],
            },
            "panel": {
                "name": "Panel",
                "template": "panel",
                "possibleParent": "*",
                "questions": [function () {
                        var self = COMPONENT.components.panel;
                        return {
                            'type': easyModal.types.PROMPT,
                            'options': {
                                title: 'Dropdown',
                                placeholder : 'Panel title'
                            },
                            'callback': function (modal, event,title) {
                                return {
                                    'templatePath': self.template,
                                    generator: function (ajaxRes) {
                                        var $el = $(ajaxRes);
                                        $el.find('.panel-title').text(title);
                                        $el.find('.panel-body').empty().append($('<div/>').addClass('available'));
                                        return $el[0];
                                    },
                                }
                            }
                        };
                    }],
            }
        }
    };

    Weasywig.addComponent(COMPONENT);
})();