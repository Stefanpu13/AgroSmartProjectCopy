/// <reference path="../_references.js" />
var UnitController = function () { };

UnitController.prototype = {
    containerId: null,
    unitPersister: null,
    accessToken: null,
    oldInput: null,

    init: function (containerId, accesToken) {
        this.containerId = containerId;
        this.accessToken = accesToken;
        this.unitPersister = new UnitPersister();
        this.unitPersister.init();        
    },

    generateLayout: function () {
        var units;
        var self = this;
        this.unitPersister.list(this.accessToken, function (data) {
            units = data;
            var listHtml = unitView.getUnitList(self.containerId + '-units-list', units);
            $('#' + self.containerId).html(listHtml);

            self.attachHandlers();
        }, function () {
        });
    },

    attachHandlers: function () {
        var self = this;

        var unitName = '';

        var assignedUser = {};

        if (IS_ADMIN) {
            $('#main-container-units-list').on('mouseenter', 'td.editable', function (e) {
                $('td.editable').trigger('mouseleave');
                $(this).append($('<span class="glyphicon glyphicon-pencil"></span>'));
                $('span.glyphicon-pencil').tooltip({
                    placement: 'right',
                    title: 'Промени име' 
                })
            });
           // .find('td.editable')
        };        

        $('#main-container-units-list').on('mouseleave', 'td.editable', function (e) {
            $(this).find('span.glyphicon-pencil:last').remove();
        });

        $("#main-container-units-list").on('click', 'span.glyphicon-pencil', function (e, data) {
            $('#cancel-unit-form').trigger('click', unitName);
            $('#cancel-user-form').trigger('click');

            $(this).parent().removeClass('editable');            

            //self.oldInput = $(this).parent();
            //var newHtml = unitView.getFormInput(self.oldInput.text());
            //unitName = self.oldInput.text();
            //$(this).parent().html(newHtml);            
            unitName = $(this).parent().clone().children().remove().end().text();
            var newHtml = unitView.getFormInput(unitName);
            $(this).parent().html(newHtml);
        })

        $("#main-container-units-list").on('click', '#cancel-unit-form', function (e, data) {
            $(this).closest('td').addClass('editable');
            if (data === undefined) {
                $(this).closest('td').html(unitName);
            } else {
                $(this).closest('td').html(data);
            }
        })

        $("#main-container-units-list").on('click', '#ok-unit-form', function (e) {
            unitName = $(this).closest('td').find('input').val();
            if (!unitName) {
                return;
            };

            var updatedUnit = {
                id: $(this).closest('td').attr('id'),
                name: unitName
            };

            $(this).closest('td').addClass('editable');
            $(this).closest('td').html(unitName);
            
            self.unitPersister.updateUnit(self.accessToken, updatedUnit, function (data) {

            }, function () {

            });
        })

        $("#main-container-units-list").on('click', '#btn-select-user', function (e) {
            $('#cancel-user-form').trigger('click');
            $('#cancel-unit-form').trigger('click');
            var users;
            var that = this;
            self.unitPersister.getAllUnassignedUsers(self.accessToken, function (data) {
                users = data;
                var selectHtml = unitView.getSelectInput(users);
                $(that).parent().html(selectHtml);


            }, function () {

            });
        })

        $("#main-container-units-list").on('click', '#cancel-user-form', function (e, data) {
            if (data === undefined) {
           //     $(this).closest('td').html(unitName);
            } else {
           //     $(this).closest('td').html(data);
            }

            $(this).closest('td').html('<buton class="btn btn-default btn-sm" id="btn-select-user"><span class="glyphicon glyphicon-plus"></span></button>');
        })

        $("#main-container-units-list").on('click', '#ok-user-form', function (e) {
            assignedUser.id = $(this).closest('td').find('#usersDropDown option:selected').val();
            if (!assignedUser.id) {
                return;
            }

            assignedUser.username = $(this).closest('td').find('#usersDropDown option:selected').text();
               
            var assignedUserHtml = '<div>' + assignedUser.username +
                                        '<buton class="btn btn-default btn-sm" id="btn-remove-user"><span class="glyphicon glyphicon-remove"></span></button>' +
                                   '</div>';
            var userWithUnit = {
                userId: assignedUser.id,
                unitId: $(this).parents('tr').find('td.editable').attr('id'),
                unitName: $(this).parents('tr').find('td.editable').text()
            };

            $(this).closest('td').attr('id', assignedUser.id);
            $(this).closest('td').html(assignedUserHtml);  
            self.unitPersister.assigneUserToUnit(self.accessToken, userWithUnit, function (data) {

            }, function () {
            });
        })

        $("#main-container-units-list").on('click', '#btn-remove-user', function (e) {
            userId = $(this).closest('td').attr('id');
            //assignedUser.username = $(this).closest('td').find('#usersDropDown option:selected').text();

            var unassignedHtml = '<buton class="btn btn-default btn-sm" id="btn-select-user"><span class="glyphicon glyphicon-plus"></span></button>';
            //var userWithUnit = {
            //    userId: assignedUser.id,
            //    unitId: $(this).parents('tr').find('td.editable').attr('id'),
            //    unitName: $(this).parents('tr').find('td.editable').text(),
            //};

            $(this).closest('td').removeAttr('id');
            $(this).closest('td').html(unassignedHtml);
            self.unitPersister.unassigneUserFromUnit(self.accessToken, userId, function (data) {
                
            }, function () {

            });
        })

        $('#add-unit-form').tooltip({
            placement: 'left',
            title: 'Добави машина'
        })

        $('#main-container-units-list').tooltip({
            placement: 'right',
            title: 'Добави потребител',
            selector: '#btn-select-user'
        })        

        $('tbody').tooltip({
            placement: 'right',
            title: 'Премахни потребител',
            selector: '#btn-remove-user'
        })

        $('#add-unit-form').on('click', function (e) {
            e.preventDefault();

            var addUnitHtml = unitView.getNewUnitForm(self.containerId + '-add-unit');
            $(this).after(addUnitHtml);

            $(this).hide();
        })

        //    $('#main-container > .panel-body').on('click', '#btn-cancel-unit', function (e) {
        $('#panel-units').on('click', '#btn-cancel-unit', function (e) {
            e.preventDefault();
            $('#' + self.containerId + '-add-unit').remove();

            $('#add-unit-form').show();
        })

        //  $('#main-container > .panel-body').on('click', '#btn-add-unit', function (e) {
        $('#panel-units').on('click', '#btn-add-unit', function (e) {
            e.preventDefault();
            var newUnitName = $(this).parents('form').find('input').val();

            var newUnit = {
                name: newUnitName
            };

            self.unitPersister.addUnit(self.accessToken, newUnit, function (data) {
                var updateListHtml = unitView.getOnlyListOfUnits(data);
                $('#main-container-units-list tbody').empty();
                $('#main-container-units-list tbody').html(updateListHtml);

            }, function () {

            });

            $('#btn-cancel-unit').trigger('click');
        })
    }    
};