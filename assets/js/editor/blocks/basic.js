


/* global Weasywig, easyModal, _ */

(function () {
    var BASIC = {
        "name": "Basic CSS",
        "components": {
            "grid": {
                "name": "Grid System",
                "template": "grid",
                "possibleParent": "*",
                "questions": [
                    function () {
                        return {
                            'type': easyModal.types.PROMPT,
                            'options': {
                                input: 'number',
                                title: 'How many columns ?',
                                size: 'modal-sm',
                                min: 1,
                                max: 12
                            }
                            //Don't need a callback to check or change the returned value
                        };
                    },
                    function (precRes) {
                        var numberInput = parseInt(12 / precRes);
                        var inputTNumber = '<div class="tiny-number col-xs-' + numberInput + '" >' + '<input value="' + numberInput + '" type="number" class="easyModal-input form-control" /></div>';
                        var size = precRes > 6 ? 'modal-lg' : 'modal-md';
                        var content = "";
                        _.each(_.range(precRes), function () {
                            content += inputTNumber;
                        });
                        return {
                            'type': easyModal.types.CUSTOM,
                            'options': {
                                title: 'Weight for each column',
                                content: '<div class="row">' + content + '</div>',
                                size: size
                            },
                            'callback': function (modal, event, columns) {
                                var mArray = columns || [];
                                var totalCol = 0;
                                var numbers = $(modal).find('.easyModal-input');
                                _.each(numbers, function (number) {
                                    var val = parseInt($(number).val());
                                    totalCol += val;
                                    mArray.push(val);
                                });
                                if (totalCol > 12 || totalCol < 1) {
                                    throw new easyModal.missingException("The number must be betweend 1 and 12");
                                } else {
                                    var renderedElem = "";
                                    _.each(mArray, function (weight) {
                                        var $col = $('<div/>', {
                                            class: 'available col-xs-' + weight
                                        });
                                        renderedElem += $col[0].outerHTML;
                                    });
                                    var self = this;
                                    return {
                                        'DOM': renderedElem,
                                        'templatePath': self.template
                                    };
                                }
                            }
                        };
                    }
                ]
            },
            "heading": {
                "name": "Heading",
                "template": "heading",
                "possibleParent": "*",
                "questions": [function () {
                        return {
                            'type': easyModal.types.TEXTNDROPDOWN,
                            'options': {
                                title: 'Heading informations',
                                textLabel: 'Heading content',
                                selectLabel: 'Heading type',
                                selectVal: ['&lt;h1&gt;', '&lt;h2&gt;', '&lt;h3&gt;', '&lt;h4&gt;', '&lt;h5&gt;'],
                            },
                            'callback': function (modal, event, textVal, selectIndex) {
                                var heading = $('<h' + (selectIndex || 1) + '/>').text(textVal);
                                return {
                                    'DOM': heading
                                };

                            }
                        };
                    }],
            },
            "text": {
                "name": "Simple text",
                "template": "heading",
                "possibleParent": "*",
                "questions": [function () {
                        return {
                            'type': easyModal.types.TEXTNDROPDOWN,
                            'options': {
                                title: 'Simple text',
                                textLabel: 'Just a litlle text',
                                input: 'textarea',
                                selectLabel: 'Text alignement',
                                selectVal: ['left', 'center', 'right', 'justify']
                            },
                            'callback': function (modal, event, textContent, index, align) {
                                var text = $('<p/>')
                                        .addClass('text-' + (align || 'left'))
                                        .text(textContent);
                                return {
                                    'DOM': text
                                };
                            }
                        };
                    }],
            },
            "button": {
                "name": "Button",
                "possibleParent": "*",
                "questions": [function () {
                        return {
                            'type': easyModal.types.TEXTNDROPDOWN,
                            'options': {
                                title: 'Button',
                                textLabel: 'Click me',
                                selectLabel: 'Button type',
                                selectVal: ['default', 'primary', 'success', 'warning', 'danger']
                            },
                            'callback': function (modal, event, textContent, selIndex, btnType) {
                                var text = $('<button/>')
                                        .addClass('btn btn-' + (btnType || 'default'))
                                        .text(textContent);
                                return {
                                    'DOM': text
                                };
                            }
                        };
                    }]
            },
            "image": {
                "name": "Picture",
                "possibleParent": "*",
                "questions": [function () {
                        return {
                            'type': easyModal.types.TEXTNDROPDOWN,
                            'options': {
                                title: 'Image',
                                textLabel: '',
                                input: 'url',
                                selectLabel: 'Picture size',
                                selectVal: Weasywig.pictureSize
                            },
                            'callback': function (modal, event, url, sIndex, size) {
                                var text = $('<img/>')
                                        .attr({src: url})
                                        .addClass('image-responsive ' + (Weasywig.stringToSize(size)) || 'col-xs-6');
                                return {
                                    'DOM': text
                                };

                            }
                        };
                    }],
            }
        }
    };
    Weasywig.addComponent(BASIC);
})();