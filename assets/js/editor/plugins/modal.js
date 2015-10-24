
/* global _ */

(function () {

// Baseline setup
// --------------

// Establish the root object, `window` (`self`) in the browser, `global`
// on the server, or `this` in some virtual machines. We use `self`
// instead of `window` for `WebWorker` support.
    var root = typeof self === 'object' && self.self === self && self ||
            typeof global === 'object' && global.global === global && global ||
            this;
    var easyModal = function (obj) {
        if (obj instanceof easyModal)
            return obj;
        if (!(this instanceof easyModal))
            return new easyModal(obj);
    };
    root.easyModal = easyModal;
    // the base DOM structure needed to create a modal

    easyModal.templates = {
        dialog:
                "<div class='modal fade' tabindex='-1' role='dialog' aria-hidden='true'>" +
                "<div class='modal-dialog'>" +
                "<div class='modal-content'>" +
                "<div class='modal-body text-center'><div class='easyModal-body'></div></div>" +
                "</div>" +
                "</div>" +
                "</div>",
        header:
                "<div class='modal-header'>" +
                "<h4 class='modal-title'></h4>" +
                "</div>",
        footer:
                "<div class='modal-footer'></div>",
        closeButton:
                "<button type='button' class='close' data-dismiss='modal' aria-hidden='true'>&times;</button>",
        form:
                "<form class='form-inline'></form>",
        submitButton:
                "<button type='submit' class='btn btn-success' >Ok</button>",
        cancelButton:
                "<button type='button' class='btn btn-default' data-dismiss='modal' >Cancel</button>",
        inputs: {
            text:
                    "<input id='textInput' class='easyModal-input easyModal-input-text form-control' autocomplete=off type=text />",
            textarea:
                    "<textarea class='easyModal-input easyModal-input-textarea form-control'></textarea>",
            email:
                    "<input class='easyModal-input easyModal-input-email form-control' autocomplete='off' type='email' />",
            date:
                    "<input class='easyModal-input easyModal-input-date form-control' autocomplete=off type='date' />",
            time:
                    "<input class='easyModal-input easyModal-input-time form-control' autocomplete=off type='time' />",
            number:
                    "<input class='easyModal-input easyModal-input-number form-control' autocomplete=off type='number' />",
            url:
                    '<input name="easyModal-url" class="easyModal-input easyModal-input-url form-control autcomplete=off type="url" />',
        }
    };
    easyModal.types = {
        "CUSTOM": 1,
        "ALERTT": 2,
        "PROMPT": 3,
        "TEXTNDROPDOWN": 4,
        'TEXTNAREA': 5,
        'CONFIRM': 6,
        'SELECT': 7
    };
    easyModal.defaultOptions = {
        title: 'Modal',
        size: 'modal-md',
        buttons: easyModal.templates.cancelButton + easyModal.templates.submitButton,
        content: '',
        showCallback: function (modal) {
            $(modal).find('.easyModal-input').first().focus();
        },
        submitCallback: null
    };
    easyModal.missingException = function (message) {
        this.message = message;
        this.name = "modalException";
    };
    easyModal.badNumberException = function (lower, upper) {
        this.message = 'The number must be between ' + lower + ' and ' + upper;
        this.name = 'badNumberException';
    };
    //Completely custom easyModal

    easyModal.custom = function (options) {
        /*
         * Options :
         *  - title
         *  - content
         *  - buttons
         *  - submitCallback
         *  - showCallback
         *  - size
         */

        var hasSubmitted = false,
                submitTriggerer = null,
                main = $(easyModal.templates.dialog);
        main.find('.modal-dialog').addClass(options.size || "");
        var form = $(easyModal.templates.form),
                body = main.find('.modal-body'),
                header = $(easyModal.templates.header),
                footer = $(easyModal.templates.footer);
        main.find('.modal-content').append(form);
        body.prepend(header);
        body.append(footer);
        form.append(body);
        header.prepend($(easyModal.templates.closeButton));
        header.find('.modal-title').text(options.title || "");
        body.find('.easyModal-body').html(options.content || "");
        footer.html(options.buttons || (easyModal.templates.cancelButton + easyModal.templates.submitButton));
        main.modal();
        form.on("submit", function (event) {
            submitTriggerer = $(document.activeElement);
            event.preventDefault();
            hasSubmitted = true;
            main.modal('hide');
        });
        main.on("shown.bs.modal", function (event) {
            options.showCallback ? options.showCallback.call(this, main, event) :
                    main.find('.easyModal-input').length ? main.find('.easyModal-input').first().focus() : "";
        });
        main.on('hide.bs.modal', function (hideEvent) {
            //Call callback if form was submitted
            var events = {
                'hide': hideEvent,
                'submit': submitTriggerer
            };
            if (hasSubmitted && options.submitCallback) {
                try {
                    options.submitCallback.call(this, main, events);
                    //If event is cancelled, reset the 'hasSubmitted' var
                    if (hideEvent.isDefaultPrevented()) {
                        hasSubmitted = false;
                    }
                } catch (ex) {
                    hasSubmitted = false;
                    throw ex;
                }

            } else {
                //Setting the modal to null => meaning the event is 'cancelled'
                options.submitCallback && options.submitCallback.call(this, null, events);
            }
        });
        main.on("hidden.bs.modal", function () {
            main.remove();
            hasSubmitted = false;
            submitTriggerer = null;
        });
    };
    /*
     * All the common possible functions :
     *  - alert
     *  - confirm
     *  - prompt
     *  - textNDropdown
     */

    /**
     * Simple alert to inform the user
     * 
     * @param {string} title
     * @param {function} callback
     */
    easyModal.alert = function (title, callback) {
        var options;
        if (_.isObject(title)) {//More than one options ... (but why ?)
            options = fusionOptions(title);
        } else if (_.isString(title)) {//Only the title (most common call)
            options = $.extend(options, easyModal.defaultOptions, {title: title});
        }
        options.buttons = this.templates.submitButton;

        if (callback && _.isFunction(callback)) {
            options.submitCallback = callback;
        }

        this.custom(options);
    };
    /*
     * 
     * @param {Object} options
     * @param {function} callback
     */
    easyModal.textNArea = function (options, callback) {
        var options = fusionOptions(options);
        var text = this.setPlaceholder(this.templates.inputs.text, (options.textLabel));
        var area = this.setPlaceholder(this.templates.inputs.textarea, (options.areaLabel));
        options.content = text + area;
        options.submitCallback = function (modal, event) {
            if (modal !== null) {
                var textVal = $(modal).find('.easyModal-input-text').val();
                var areaVal = $(modal).find('.easyModal-input-textarea').val();
                if (!textVal || !areaVal) {
                    throw new easyModal.missingException("All the area must be filled");
                }

            }
            callback(modal, event, textVal, areaVal);
        };
        this.custom(options);
    };


    /*
     * Complex modal :
     *  - A title for the modal
     *  - A label for the text input
     *  - An array of values for the dropdown
     *  - And of course a callback
     */
    easyModal.textNDropDown = function (modalOptions, callback) {
        var options = fusionOptions(modalOptions);
        var mainInput = easyModal.templates.inputs[modalOptions.input] || easyModal.templates.inputs.text;
        var textContent = $(mainInput).attr({placeholder: modalOptions.textLabel})[0].outerHTML;
        options.content = '<fieldset>' + textContent + createSelectFromValues(modalOptions.selectVal, modalOptions.selectLabel) + '</fieldset>';
        options.submitCallback = function (modal, event) {
            //Text input value
            if (modal !== null) {
                var textVal = $(modal).find('.easyModal-input').val();
                if (!textVal) {
                    throw new easyModal.missingException("The text can't be empty");
                }

                var selectIndex = $(modal).find('select.form-control')[0].selectedIndex;
                var selectVal = $(modal).find('select.form-control').find(':selected').val();
            }
            callback(modal, event, textVal, selectIndex, selectVal);
        };
        this.custom(options);
    };

    /*
     * Prompt options :
     *  - size
     *  - input type
     *  - title
     */
    easyModal.prompt = function (pOptions, callback, context) {
        var options = fusionOptions(pOptions);
        options.content = $(easyModal.templates.inputs[pOptions.input] || easyModal.templates.inputs.text).attr({placeholder: (pOptions.placeholder || "...")});
        options.submitCallback = function (modal, event) {
            if (modal !== null) {
                var val = modal.find('.easyModal-input').val();
                if (!val) {
                    throw new easyModal.missingException("The input cannot be empty");
                }
                //If number, return int
                if (options.input && (options.input === 'number')) {
                    var val = parseInt(val);
                    if (isNaN(val)) {
                        throw new easyModal.missingException("The text entered is not a number");
                    } else if (pOptions.min && val < pOptions.min || pOptions.max && val > pOptions.max) {
                        throw new easyModal.badNumberException(pOptions.min, pOptions.max);
                    }
                }
                callback.call(context, modal, event, val);

            }
        };
        this.custom(options);
    };

    easyModal.select = function (options, callback) {
        var opt = fusionOptions(options);
        opt.content = createSelectFromValues(options.values, options.selectLabel);
        opt.submitCallback = function (modal, event) {
            if (modal !== null) {
                var selectIndex = $(modal).find('select.form-control')[0].selectedIndex;
                if (selectIndex === 0) {
                    throw new easyModal.missingException("You must choose a value");
                }
                var selectVal = $(modal).find('select.form-control').find(':selected').val();
                callback(modal, event, selectIndex, selectVal);
            }
        };
        this.custom(opt);
    };


    /**
     * Ask the user to confirm the action
     * 
     * @param {object} options
     * @param {function} callback
     * @param {object} context
     */
    easyModal.confirm = function (options, callback, context) {
        var opti = fusionOptions(options);

        opti.content = '<p>' + (options.text || "") + '</p>';
        opti.submitCallback = function (modal, event) {
            if (modal !== null) {
                callback.call(context, modal, event, true);
            } else {
                callback.call(context, modal, event, false);
            }
        };
        this.custom(opti);
    };


    easyModal.setPlaceholder = function (obj, placeholder) {
        return $(obj).attr({placeholder: (placeholder || "...")})[0].outerHTML;
    };

    function fusionOptions(optObj) {
        var ezDefault = easyModal.defaultOptions;
        if (_.isString(optObj)) {//Just set the title
            return $.extend({}, ezDefault, {'title': optObj});
        } else {
            return $.extend({}, ezDefault, optObj);
        }
    }


    function createSelectFromValues(values, title) {
        var selectOptions = ' <option value="" disabled selected >' + (title || "pick one") + '</option>';
        _.each(values, function (val) {
            selectOptions += '<option value="' + val + '" >' + val + '</option>';
        });
        return '<select class="form-control form-group">' + selectOptions + '</select>';
    }
})();