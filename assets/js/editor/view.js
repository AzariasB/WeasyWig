
/* global  _, Weasywig, easyModal, STATES, Mousetrap, Contextmenu, KeyboardEvent */

var MainView = function () {
    this.currentParent = null;
    this.currentOrder = 0; //To be able to 'rollback'
    this.currentState = null;
    this.projectName = null;
    this.contextmenuTarget = null;
    this.dblClickTarget = null;
    this.el = 'body';

    this.regexs = {
        'text': /^a|h[1-6]|p$/ //Regex of tagname where you can edit text
    };

    this.componentTemplate = '<div class="panel panel-default">\
<div class="panel-heading" role="tab" id="panel_heading_<%= index %>">\
 <h4 class="panel-title">\
 <a role="button" data-toggle="collapse" data-parent="#panels" href="#collaspe_<%= index %>" aria-expanded="true" aria-controls="collapseOne">\
 <%= title %> <i class="glyphicon glyphicon-chevron-down"></i>\
</a>\
 </h4>\
 </div>\
<div id="collaspe_<%= index %>" class="panel-collapse collapse" role="tabpanel" aria-labelledby="panel_heading_<%= index %>">\
<ul class="list-group list-unstyled" ></ul></div></div>';
    this.events = {
        'click .available': "displaySidebar",
        'click .remove_sidebar': "removeSidebar",
        'click #save_button': "save",
        'click #undo_button': "undo",
        'click #add_row': "addRow",
        'submit #search_form': "searchBlock",
        'click #root': 'endContextmenu',
        'contextmenu #root': 'beginContextmenu',
        'dblclick #root': 'editText',
    };

    this.shortcuts = {
        'mod+s': 'save',
        'mod+z': 'undo',
        'mod+right': 'nextState',
        'mod+left': 'previousState',
        'mod+r': 'restart',
        'mod+h': 'goHome',
        'enter': 'endContextmenu'
    };

    this.init();
};

MainView.prototype = {
    init: function () {
        Weasywig.setView(this);
        $(document).tooltip();
        this.setEvents();
        this.setShortcuts(this.shortcuts);
        this.setStates(STATES);
        this.setContextmenu(Contextmenu);
        this.errorHandle();
        var comp = Weasywig.getComponents();
        this.addComponents(comp);
        this.setAutoCompletion();

        if (window.location.hash) {
            this.setProjectName(window.location.hash.substr(1), false);
        }
        if (this.projectName) {
            this.getExistingProject(this.projectName);//Let the loader load
        } else {//Remove the loader and display the core editor
            this.endLoading();
        }
    },
    endLoading: function () {
        $("#loader").fadeOut(function () {
            $("#editor_core").removeAttr('hidden');
        });
    },
    editText: function (event) {
        var $target = $(event.target);
        var targetType = $target.prop("tagName").toLowerCase();
        if (this.regexs.text.test(targetType)) {
            $change = targetType === 'p' ?
                    $('<textarea/>', {
                        text: $target.text(),
                        class: 'form-control'
                    }) :
                    $('<input/>', {
                        type: 'text',
                        value: $target.text(),
                        class: 'mousetrap form-control'
                    });
            $target.text("");
            $target.prepend($change);
            this.dblClickTarget = $change;
        }
    },
    endTextEdit: function (event) {
        if (this.dblClickTarget && event.target !== this.dblClickTarget[0]) {
            var val = this.dblClickTarget.val().replace("\n", "<br/>") || this.dblClickTarget.text().replace("\n", "<br/>") || "Error";
            this.dblClickTarget.parent().html(val);
            this.dblClickTarget.remove();
            this.dblClickTarget = null;
        }
    },
    errorHandle: function () {
        var self = this;
        window.onerror = function () {
            var obj = arguments[4] || null;
            if (obj instanceof easyModal.missingException || obj instanceof easyModal.badNumberException) {
                self.handlingModalError(obj);
                return true;
            } else {
                return false;
            }
        };
    },
    restart: function () {
        var options = {
            'title': 'Restart',
            'text': 'Do you really want to restart ?'
        };
        this.showModal(easyModal.types.CONFIRM, options, this.restartConfirm);
    },
    restartConfirm: function (modal, event, confirmed) {
        if (confirmed) {
            this.removeSidebar();
            this.currentOrder = 0;
            this.currentParent = null;
            $('#root').empty().append($('<div/>').addClass('available mainRoot'));
        }
    },
    goHome: function () {
        window.location.assign('index.php');
    },
    handlingModalError: function (ex) {
        this.showMessage(ex.message);
        $('.modal .form-inline').addClass('has-error');
        setTimeout(function () {
            $('.modal .form-inline').removeClass('has-error');
        }, 3000);
    },
    changeAvailable: function (before, after) {
        $('.' + before).each(function () {
            $(this).addClass(after).removeClass(before);
        });
    },
    changeNav: function (nwText, btnToHide) {
        $('#current_mode').text(nwText);
        this.hideMode(btnToHide);
    },
    /**
     * Search for one of the available blocks
     * displayed in the sidebar
     * 
     * @param {type} event
     */
    searchBlock: function (event) {
        event.preventDefault();
        var $target = $("#search_block");
        var val = $target.val();
        this.removeAllClass('found');
        this.searchForBlock(val);

    },
    removeAllClass: function (className) {
        $('.' + className).each(function () {
            console.log($(this).text());
            $(this).removeClass(className);
        });
    },
    searchForBlock: function (blockName) {
        $('#wrapper .panel-collapse').each(function () {
            var $aS = $(this).find("ul li a");
            var found = false;
            $aS.each(function () {
                if ($(this).text().toLowerCase().indexOf(blockName.toLowerCase($aS)) > -1) {
                    $(this).parent().addClass('found');
                    found = true;
                }
            });
            found ? $(this).collapse('show') : $(this).collapse('hide');

        });
    },
    /**
     *  hide/show the main div of the editor
     */
    toggleMainRoot: function () {
        $(".mainRoot").toggleClass('hidden');
    },
    /**
     * Hide a state option in the dropdown
     * 
     * @param {number} stateToHideIndex
     * @returns {boolean} if the state to hide was found
     */
    hideMode: function (stateToHideIndex) {
        var found = false;
        _.each(_.range(STATES.length), function (stIndex) {
            var $btn = $('#action_' + stIndex);
            if (stIndex === stateToHideIndex) {
                $btn.addClass('hidden');
                found = true;
            } else {
                $btn.removeClass('hidden');
            }
        });
        return found;
    },
    /**
     *  Undo method
     *  TODO : implement a better way to under ALL the actions
     */
    undo: function () {
        if (this.currentOrder >= 1) {
            var $toRemove = $('div[data-order="' + (this.currentOrder - 1) + '"]').first();
            $toRemove.parent().addClass('available');
            $toRemove.remove();
            this.currentOrder--;
        } else {
            throw "Can't undo nothing";
        }
    },
    getExistingProject: function (projName) {
        var self = this;
        Weasywig.ajaxGetSave(projName, $("#root"), function () {
            //Wait for pictures to load
            $.when($("#root").find('img').load()).done(function () {
                self.endLoading();
            });
        });
    },
    /**
     * To set the last modification that was made
     * Usefull when loading an external file
     */
    updateOrder: function () {
        var greaterOrder = this.currentOrder;
        $('div[data-order]').each(function () {
            var orderInt = parseInt($(this).attr('data-order'));
            if (orderInt > greaterOrder) {
                greaterOrder = orderInt;
            }
        });
        this.currentOrder = parseInt(greaterOrder);
    },
    /*
     * Show the menu when the user right-click
     * 
     * @param {object} event the 'righ-click' event
     */
    showContextmenu: function (event) {
        this.contextmenuTarget = event.target;
        $("#contextMenu").finish().toggle(100).
                css({
                    top: event.pageY + "px",
                    left: event.pageX + "px"
                });
    },
    /*
     * Hide the menu when the user click out ot it
     */
    hideContextmenu: function () {
        this.contextmenuTarget = null;
        $(".contextmenu").each(function () {
            $(this).hide(100);
        });
    },
    /*
     * Add the divs for the contextmenu
     * with the given array of opt
     * 
     * @param {array} options
     */
    setContextmenu: function (options) {
        var $mainUl = $('#contextMenu');
        this.createUls(options, null, $mainUl);
    },
    /**
     * This function handle the end of all the current 'activities'
     * such as contextmenu or the dblclick edition
     * 
     * @param {object} e click event
     */
    endContextmenu: function (e) {
        if (!$(e.target).parents("#contextmenu").length > 0) {
            this.hideContextmenu();
            //Hide contextemenu and all childs
        }

        if (this.dblClickTarget) {
            if (e instanceof KeyboardEvent) {
                this.endTextEdit({target: null});
            } else {
                this.endTextEdit(e);
            }
        }
    },
    beginContextmenu: function (event) {
        var self = this;
        //activate the custom 
        if (this.currentState === 0) {
            // Avoid the real one
            event.preventDefault();
            // Show contextmenu if parent is not an 'available' div
            if(!$(event.target).hasClass('available')){
                this.showContextmenu(event);
                this.removeSidebar();   
            }
        }
    },
    createUls: function (menus, trigerrer, parent) {
        if (trigerrer) {
            $(trigerrer).mouseenter(function (event) {
                var $target = $(event.target);
                var pos = $target.offset();
                var leftPos = $target.width() + parseInt($target.css('padding-right').replace('px', '')) * 2;
                if (pos.left + leftPos + $(parent).width() > $(document).width()) {//dispaly the submen on the left
                    leftPos = -$(parent).width();
                }
                $(parent).css({
                    top: pos.top,
                    left: pos.left + leftPos
                });
                $(parent).show();
            });

            $(trigerrer).mouseleave(function () {
                //If the mouse is not on the just-created menu, then hide it
                if (!$(parent).is(':hover')) {
                    $(parent).hide(100);
                }
            });
        }

        var self = this;
        _.each(menus, function (option) {
            var $li = $('<li/>').addClass('list-group-item').text(option.name);
            if (option.submenu) {
                $li.html($li.html() + '<i class="glyphicon glyphicon-play " ></i>');
                var $ul = $('<ul/>').addClass('contextmenu list-group');
                $(parent).after($ul);
                self.createUls(option.submenu, $li, $ul);
            }
            $li.click(function (event) {
                try {
                    option.action && option.action.call(self, self.contextmenuTarget, self);
                    self.hideContextmenu();
                } catch (ex) {
                    self.showMessage(ex.message || ex, false);
                }
            });
            $li.mouseleave(function (event) {
                var stillContext = false;
                $('.contextmenu').each(function () {
                    if ($(this).is(':hover')) {
                        stillContext = true;
                    }
                });
                if (trigerrer !== null && !stillContext) {
                    $('.contextmenu').each(function () {
                        if (!$(this).attr('id')) {//Do not destroy the root
                            $(this).hide(100);
                        }
                    });
                }
            });
            $(parent).append($li);
        });
    },
    setEvents: function () {
        var self = this;
        _.each(this.events, function (funcName, action) {
            var decomposed = action.split(' ');
            decomposed[1] = self.keyWordToObject(decomposed[1]);
            $('body').on(decomposed[0], decomposed[1], function (event) {
                try {
                    $.proxy(self[funcName](event), self);
                } catch (ex) {
                    self.showMessage(ex, false);
                }
            });
        });
    },
    /*
     * Return existing object corresponding to the string
     * 
     * @param {string} keyword
     * @returns {window|document|string} the corresponding object (if found) else the same string
     */
    keyWordToObject: function (keyword) {
        switch (keyword) {
            case 'document' :
                return document;
            case 'window' :
                return window;
            default:
                return keyword;
        }
    },
    setShortcuts: function (shortcuts) {
        var self = this;
        _.each(shortcuts, function (funct, combinaison) {
            Mousetrap.bind(combinaison, function (event) {
                try {
                    if (!self[funct]) {
                        throw "The function '" + funct + '\' does not exists';
                    }
                    self[funct](event);
                } catch (ex) {
                    self.showMessage(ex.message || ex, false);
                }
                return false;//Prevent default
            });
        });
    },
    setStates: function (states) {
        var self = this;
        _.each(states, function (state, index) {
            if (state.default) {
                $("#current_mode").text(state.name);
                self.currentState = index;
            }
            var li = '<li><a id="action_' + index + '" class="' + (state.default && " hidden" || "") + '" href="javascript:void(0)">' + state.action + '</a></li>';
            $("#states_choice").append($(li));
        });
        this.setStateEvent();
    },
    nextState: function () {
        this.changeState((this.currentState + 1) % (STATES.length));
    },
    previousState: function () {
        var nwState = this.currentState === 0 ? STATES.length - 1 : this.currentState - 1;
        this.changeState(nwState);
    },
    setStateEvent: function () {
        var self = this;
        $('a[id^="action_"]').on('click', function () {
            var index = $(this).attr('id');
            index = parseInt(index.replace('action_', ''));
            if (!isNaN(index)) {
                self.changeState(index);
            }
        });
    },
    /*
     * This is the state manager
     * That calls the functions of states when entering and exiting.
     * 
     * @param {number} stateIndex
     * @return {boolean} if the changing happened without exception.
     */
    changeState: function (stateIndex) {
        var oldState = STATES[this.currentState];
        var nwState = STATES[stateIndex];
        try {
            oldState.exiting && oldState.exiting.call(STATES, this);
            nwState.entering && nwState.entering.call(STATES, this);
            this.currentState = stateIndex;
            this.changeNav(nwState.name, stateIndex);
            return true;
        } catch (ex) {
            this.showMessage(ex, false);
            return false;
        }

    },
    /*
     * Save the project
     */
    save: function () {
        if (this.projectName) {
            this.callAjaxSave(this.projectName);
        } else {
            this.launchSaveModal();
        }
    },
    callAjaxSave: function (pjName) {
        var content = $('#root').html().trim();
        Weasywig.ajaxSave(pjName, content, this.confirmSave, this);
    },
    launchSaveModal: function () {
        var self = this;
        this.showModal(easyModal.types.PROMPT, 'Project name', function (modal, event, res) {
            if (modal !== null) {
                self.setProjectName(res, true);
            }
        });
    },
    setProjectName: function (name, save) {
        this.projectName = name;
        document.title = name;
        window.location.hash = name;
        save && this.callAjaxSave(name);
    },
    confirmSave: function (data) {
        try {
            data = JSON.parse(data);
            this.showMessage(data.message, data.success);
        } catch (ex) {
            console.error(data);
            console.error(ex);
        }
    },
    /*
     * 
     * @param {string} content the message content
     * @param {boolean} isSuccess if the message to display is about a success (green) or a fail (red)
     * @returns {undefined}
     */
    showMessage: function (content, isSuccess) {
        var $msg = $('.editor-message');
        $msg.text(content);
        var messageClass = isSuccess ? 'success' : 'error';
        $msg.addClass('show ' + messageClass);
        setTimeout(function () {
            $msg.removeClass('show').removeClass(messageClass);
        }, 4000);
    },
    removeSidebar: function () {
        this.currentParent = null;
        $("#wrapper").addClass('toggled');
        $("#search_block").val("").focusout();
        this.removeAllClass('found');
    },
    displaySidebar: function (event) {
        this.currentParent = event.target;
        $("#wrapper").removeClass('toggled');
        $("#search_block").focus();
    },
    addComponents: function (componentsList) {
        var self = this;
        _.each(componentsList, function (el, index) {
            self.addComponent(el, index);
        });
    },
    /**
     * Add every available components to the DOM
     * 
     * 
     * @param {type} comp
     * @param {type} index
     */
    addComponent: function (comp, index) {
        var template = _.template(this.componentTemplate);
        var compiled = template({'index': index, 'title': comp.name || ""});
        var $query = $($.parseHTML(compiled));
        _.each(comp.components, function (el) {
            var $mComponent = $('<li/>')
                    .append($('<a/>')
                            .text(el.name)
                            .attr('href', 'javascript:void(0)')
                            .click(function () {
                                Weasywig.askQuestions(el, null);
                            })
                            );
            $query.find('ul').append($mComponent);
        });
        $("#panels").append($query);
    },
    setAutoCompletion: function () {
        var autoCompletOptions = [];
        $('#panels').find('ul>li>a').each(function () {
            autoCompletOptions.push($(this).text());
        });
        $('#search_block').autocomplete({
            source: autoCompletOptions,
            autoFocus: true
        });
    },
    /*
     * 
     * @param {type} type
     * @param {type} options
     * @param {type} callback
     * @returns {undefined}
     */
    showModal: function (type, options, callback) {
        switch (type) {
            case easyModal.types.CUSTOM :
                options.submitCallback = callback;
                easyModal.custom(options);
                break;
            case easyModal.types.PROMPT :
                easyModal.prompt(options, callback, this);
                break;
            case easyModal.types.ALERT :
                easyModal.alert(options.title, callback);
                break;
            case easyModal.types.TEXTNDROPDOWN :
                easyModal.textNDropDown(options, callback);
                break;
            case easyModal.types.TEXTNAREA :
                easyModal.textNArea(options, callback);
                break;
            case easyModal.types.CONFIRM :
                easyModal.confirm(options, callback, this);
                break;
            case easyModal.types.SELECT :
                easyModal.select(options, callback);
                break;
            default :
                break;
        }

    },
    addRow: function () {
        if (this.currentParent && !this.isRoot(this.currentParent)) {
            var $par = $(this.currentParent);
            $par.removeClass('available');
            var html = $par.html();
            $par.empty();
            var $oldRow = $('<div/>').html(html).addClass('available');//Can be modified
            var $nwRow = $('<div/>').addClass('available');
            $par.append($oldRow).append($nwRow);

            this.currentParent = null;
            this.removeSidebar();
        } else {
            throw "Can't create a new Row here";
        }
    },
    endRendering: function (html) {
        if (this.currentParent) {
            var $el = $(html);

            //'Save' the order
            var order = this.currentOrder;
            $el.attr('data-order', order);
            $(this.currentParent).append($(html));
            this.currentOrder++;
            //Indicate that the parent is occupied
            $(this.currentParent).removeClass('available');
            //If at the root => remove current root and create another one (CSS solving problem)
            if (this.isRoot(this.currentParent)) {
                $(this.currentParent).addClass('taken');
                this.changeRoot();
            }
            this.removeSidebar();
        }
    },
    isRoot: function (domElem) {
        return $(domElem).hasClass('mainRoot') || $(domElem).parent().is('#root');
    },
    changeRoot: function () {
        $(this.currentParent).removeClass('mainRoot');
        var $nwRoot = $('<div/>', {
            class: 'available mainRoot',
        });
        $('#root').append($nwRoot);
    },
    getCurrentParent: function () {
        return this.currentParent;
    },
};
/*
 * 
 * 
 */

(function () {
    var mView = new MainView();
})();

