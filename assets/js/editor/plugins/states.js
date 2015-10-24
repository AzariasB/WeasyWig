                                                                                                                                                                            /* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


(function () {

    var root = typeof self === 'object' && self.self === self && self ||
            typeof global === 'object' && global.global === global && global || this;

    var STATES = [
        {
            'name': "Edition",
            'action': 'Back to edition mode',
            'default': true
        },
        {
            'name': 'Result',
            'action': 'See result',
            'entering': function (view) {
                view.removeSidebar();
                view.changeAvailable('available', 'wasAv');
                view.toggleMainRoot();
            },
            'exiting': function (view) {
                view.changeAvailable('wasAv', 'available');
                view.toggleMainRoot();
            }
        },
        {
            'name': 'Code edition',
            'action': 'Edit source code',
            'entering': function (view) {
                view.removeSidebar();
                $('#root').addClass('hidden');
                //So that the user can't modify the root
                this.tmpRoot = $(".mainRoot");
                $("#root").find('.mainRoot').remove();

                var code = $('#root').html();
                $('#code_edition').removeClass('hidden').text(code);
            },
            'exiting': function () {
                var htmlRes = $('#code_edition').text();
                $("#root").html($(htmlRes)).removeClass('hidden').append(this.tmpRoot);
                delete this.tmpRoot;
                $('#code_edition').addClass('hidden');
            }

        },
        {
            'name' : 'Help',
            'action' : 'Help',
            'entering' : function(view){
                this.saveHtml = $('#root').html();
                $("#root").load('assets/html/help.html');
            },
            'exiting' : function(){
                $("#root").html(this.saveHtml);
                delete this.saveHtml;
            }
        }
    ];

    root.STATES = STATES;

})();