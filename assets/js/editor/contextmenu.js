/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


/* global easyModal */

(function () {
    var root = typeof self === 'object' && self.self === self && self ||
            typeof global === 'object' && global.global === global && global || this;

    var colorRegex = /^rgb\((\s*\d{1,3}\s*,){2}\s*\d{1,3}\s*\)$/;
    var grayRegex = /^rgb\((\s*51\s*,){2}\s*51\s*\)$/;

    function testColor(color) {
        var dummy = $('<div/>').css({'display': 'none', 'color': color})[0];
        var retColor = window.getComputedStyle(document.body.appendChild(dummy)).color;
        document.body.removeChild(dummy);
        if (!colorRegex.test(retColor) || grayRegex.test(retColor) && (!grayRegex.test(color) || color !== 'gray' || color !== 'grey' || color !== '#333' || color !== '#333333')) {
            //If the color is not valid, the 'default' color is gray, but if the asked color was not gray, then it's not a valid color
            throw new easyModal.missingException("The given color is not valid");
        } else {
            return true;//valid color
        }
    }

    function alterBorder(target, boderproperty, value) {
        var $t = $(target);
        if ($t.css('border-style') === 'none' || $t.css('border-width') === '0px' || $t.css('border-color') === 'none') {
            //Border not existing, we have to create one
            $t.css({
                'border-style': 'solid',
                'border-width': '1px',
                'border-color': 'black'
            });
        }
        $t.css(boderproperty, value);
    }

    var Contextmenu = [
        {
            "name": "Edit text",
            "action": function (target, view) {
                var options = {
                    'title': "Change text",
                    'size': 'modal-lg',
                    'placeholder ': $(target).text()
                };

                view.showModal(easyModal.types.PROMPT, options, function (modal, event, res) {
                    $(target).text(res);
                });
            }
        },
        {
            "name": "Change font color",
            "action": function (target, view) {
                var currentColor = $(target).css('color');
                var options = {
                    'title': 'New font color',
                    'size': 'modal-sm',
                    'placeholder': currentColor
                };


                view.showModal(easyModal.types.PROMPT, options, function (modal, event, res) {
                    if (testColor(res)) {
                        $(target).css('color', res);
                    }
                });
            }
        },
        {
            "name": "Change background-color",
            "action": function (target, view) {
                var currentColor = $(target).css('background-color');
                var options = {
                    'title': 'New font color',
                    'size': 'modal-sm',
                    'placeholder': currentColor
                };


                view.showModal(easyModal.types.PROMPT, options, function (modal, event, res) {
                    if (testColor(res)) {
                        $(target).css('background-color', res);
                    }
                });
            }
        },
        {
            "name": "Change font size",
            "action": function (target, view) {
                var currentFontSize = $(target).css('font-size');
                var options = {
                    'title': 'New font size',
                    'size': 'modal-sm',
                    'placeholder': 'current : ' + currentFontSize
                };
                var sizeRegex = /^(xx-small|x-small|small|medium|large|x-large|xx-large|smaller|larger)$|^(\d{1,4})(em|pt|cm|mm|px|in|pc)$/;

                view.showModal(easyModal.types.PROMPT, options, function (modal, event, res) {
                    if (!sizeRegex.test(res) && isNaN(parseInt(res))) {
                        throw new easyModal.missingException("The given unit does not exists in css");
                    } else if (!isNaN(parseInt(res))) {
                        /*
                         * parseInt() will find the number in the string
                         * so, if the res is '10px', parseInt will return 10, instead of NaN
                         * thanks javascript !
                         */
                        $(target).css('font-size', res);
                    }else {
                        $(target).css('font-size', res);
                    }
                });

            }
        },
        {
            "name": "Change border",
            "submenu": [
                {
                    "name": "Color",
                    "action": function (target) {
                        var options = {
                            'title': "Change border color",
                            'placeholder': "blue"
                        };
                        this.showModal(easyModal.types.PROMPT, options, function (modal, event, res) {
                            if (testColor(res)) {
                                alterBorder(target, 'border-color', res);
                            }
                        });
                    }
                },
                {
                    "name": "Size",
                    "action": function (target, view) {
                        var borderRegex = /^(medium|thin|thick|\d{1,2}px)$/;
                        var options = {
                            'title': 'Change border width',
                            'placeholder': 'medium'
                        };
                        view.showModal(easyModal.types.PROMPT, options, function (modal, event, res) {
                            if (borderRegex.test(res)) {
                                alterBorder(target, 'border-width', res);
                            }
                        });
                    }
                },
                {
                    "name": "Sytle",
                    "action": function (target, view) {
                        var options = {
                            'title': 'Change border style',
                            'values': ['dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset'],
                            'selectLabel': 'Choose a style'
                        };
                        view.showModal(easyModal.types.SELECT, options, function (modal, event, index, value) {
                            alterBorder(target, 'border-style', value);
                        });
                    }
                }
            ]
        },
        {
            "name": "Remove",
            'submenu': [
                {
                    'name': 'Make available',
                    'action': function (target) {
                        $(target).parent().empty().addClass('available');
                    },
                },
                {
                    'name': 'Destroy',
                    'action': function (target) {
                        $(target).remove();
                    }
                },
                {
                    "name": "You can see..",
                    "submenu": [
                        {
                            "name": "How far ?",
                            "submenu": [
                                {
                                    "name": "Really far"
                                },
                                {
                                    "name": "Can we go ?",
                                }
                            ]
                        }
                    ]
                }
            ]
        },
    ];

    root.Contextmenu = Contextmenu;

})();