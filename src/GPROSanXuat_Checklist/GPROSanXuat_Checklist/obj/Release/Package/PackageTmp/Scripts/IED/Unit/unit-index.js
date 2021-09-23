if (typeof GPRO == 'undefined' || !GPRO) {
    var GPRO = {};
}

GPRO.namespace = function () {
    var a = arguments,
        o = null,
        i, j, d;
    for (i = 0; i < a.length; i = i + 1) {
        d = ('' + a[i]).split('.');
        o = GPRO;
        for (j = (d[0] == 'GPRO') ? 1 : 0; j < d.length; j = j + 1) {
            o[d[j]] = o[d[j]] || {};
            o = o[d[j]];
        }
    }
    return o;
}
GPRO.namespace('Unit');
GPRO.Unit = function () {
    var Global = {
        UrlAction: {
            _GetLists: '/Unittype/Gets',
            _Save: '/Unittype/Save',
            _Delete: '/Unittype/Delete',

            GetLists: '/Unit/Gets',
            Save: '/Unit/Save',
            Delete: '/Unit/Delete',
        },
        Element: {
            Jtable: 'jtable-unit-type',
            PopupUnitType: 'popup-unit-type',
            SearchUnitType: 'unit-type-search-popup',

            PopupUnit: 'popup-unit', 
        },
        Data: {
            IsInsert: true,
            ParentId: 0,
        }
    }
    this.GetGlobal = function () {
        return Global;
    }

    this.Init = function () {
        RegisterEvent();
        InitJTable();
        ReloadTable();
        InitPopup();
        InitPopupUnitType();
        InitSearchPopupUnitType();
        GetUnitTypeSelect('unit-type-select')
    }

    var RegisterEvent = function () {
        $('[re-unit-type]').click(() => { GetUnitTypeSelect('unit-type-select') });
    }
     
    InitJTable = () => {
        $('#' + Global.Element.Jtable).jtable({
            title: 'Quản lý loại đơn vị',
            paging: true,
            pageSize: 1000,
            pageSizeChange: true,
            sorting: true,
            selectShow: false,
            actions: {
                listAction: Global.UrlAction._GetLists,
                createAction: Global.Element.PopupUnitType, 
            },
            messages: {
                addNewRecord: 'Thêm mới', 
            },
            searchInput: {
                id: 'unit-type-keyword',
                className: 'search-input',
                placeHolder: 'Nhập từ khóa ...',
                keyup: function (evt) {
                    if (evt.keyCode == 13)
                        ReloadTable();
                }
            },
            rowInserted: function (event, data) {
                if (data.record.Id == Global.Data.ParentId) {
                    var $a = $('#' + Global.Element.Jtable).jtable('getRowByKey', data.record.Id);
                    $($a.children().find('.aaa')).click();
                }
            },
            datas: {
                jtableId: Global.Element.Jtable
            },
            fields: {
                Id: {
                    key: true,
                    create: false,
                    edit: false,
                    list: false
                },
                Code: {
                    visibility: 'fixed',
                    title: "Mã",
                    width: "10%",
                },
                Name: { 
                    title: "Tên loại đơn vị",
                    width: "20%",
                },
                Note: {
                    title: "Mô Tả ",
                    width: "20%",
                    sorting: false,
                },
                Detail: {
                    title: 'DS đơn vị',
                    width: '3%',
                    sorting: false,
                    edit: false,
                    display: function (parent) {
                        var $img = $('<i class="fa fa-list-ol clickable red aaa" title="Click xem sanh sách đơn vị ' + parent.record.Name + '"></i>');
                        $img.click(function () {
                            Global.Data.ParentId = parent.record.Id;
                            $("#unit-type-select").val(parent.record.Id);
                            $('#' + Global.Element.Jtable).jtable('openChildTable',
                                $img.closest('tr'),
                                {
                                    title: '<span class="red">Danh sách đơn vị thuộc : ' + parent.record.Name + '</span>',
                                    paging: true,
                                    pageSize: 1000,
                                    pageSizeChange: true,
                                    sorting: true,
                                    selectShow: true,
                                    actions: {
                                        listAction: Global.UrlAction.GetLists + '?typeId=' + parent.record.Id,
                                        createAction: Global.Element.PopupUnit,
                                    },
                                    messages: {
                                        addNewRecord: 'Thêm mới',
                                        selectShow: 'Ẩn hiện cột'
                                    },
                                    fields: {
                                        ParentId: {
                                            type: 'hidden',
                                            defaultValue: parent.record.Id
                                        },
                                        Id: {
                                            key: true,
                                            create: false,
                                            edit: false,
                                            list: false
                                        },
                                        Name: {
                                            visibility: 'fixed',
                                            title: "Tên đơn vị",
                                            width: "20%",
                                        },
                                        Note: {
                                            title: "Mô Tả ",
                                            width: "20%",
                                            sorting: false,
                                        },
                                        edit: {
                                            title: '',
                                            width: '1%',
                                            sorting: false,
                                            display: function (data) {
                                                var text = $('<i data-toggle="modal" data-target="#' + Global.Element.PopupUnit + '" title="Chỉnh sửa thông tin" class="fa fa_tb fa-pencil-square-o clickable blue"  ></i>');
                                                text.click(function () {
                                                    $('#unit-id').val(data.record.Id);
                                                    $('#unit-note').val(data.record.Note);
                                                    $("#unit-name").val(data.record.Name);
                                                    $("#unit-type-select").val(data.record.UnitTypeId);
                                                    Global.Data.ParentId = data.record.UnitTypeId;
                                                    Global.Data.IsInsert = false;
                                                });
                                                return text;
                                            }
                                        },
                                        Delete: {
                                            title: '',
                                            width: "3%",
                                            sorting: false,
                                            display: function (data) {
                                                var text = $('<button title="Xóa" class="jtable-command-button jtable-delete-command-button"><span>Xóa</span></button>');
                                                text.click(function () {
                                                    GlobalCommon.ShowConfirmDialog('Bạn có chắc chắn muốn xóa?', function () {
                                                        DeleteUnit(data.record.Id);
                                                    }, function () { }, 'Đồng ý', 'Hủy bỏ', 'Thông báo');
                                                });
                                                return text;

                                            }
                                        }
                                    }
                                }, function (data) { //opened handler
                                    data.childTable.jtable('load');
                                });
                        });
                        return $img;
                    }
                },
                edit: {
                    title: '',
                    width: '1%',
                    sorting: false,
                    display: function (data) {
                        var text = $('<i data-toggle="modal" data-target="#' + Global.Element.PopupUnitType + '" title="Chỉnh sửa thông tin" class="fa fa-pencil-square-o clickable blue"  ></i>');
                        text.click(function () {
                            $('#unit-type-id').val(data.record.Id);
                            $('#unit-type-code').val(data.record.Code);
                            $('#unit-type-note').val(data.record.Note);
                            $("#unit-type-name").val(data.record.Name);
                            Global.Data.IsInsert = false;
                        });
                        return text;
                    }
                },
                Delete: {
                    title: '',
                    width: "3%",
                    sorting: false,
                    display: function (data) {
                        var text = $('<button title="Xóa" class="jtable-command-button jtable-delete-command-button"><span>Xóa</span></button>');
                        text.click(function () {
                            GlobalCommon.ShowConfirmDialog('Bạn có chắc chắn muốn xóa?', function () {
                                DeleteUnitType(data.record.Id);
                            }, function () { }, 'Đồng ý', 'Hủy bỏ', 'Thông báo');
                        });
                        return text;

                    }
                }
            }
        });
    }

    ReloadTable = () => {
        var keySearch = $('#unit-type-keyword').val();
        $('#' + Global.Element.Jtable).jtable('load', { 'keyword': keySearch });
    }


    InitPopup = () => {
        $("#" + Global.Element.PopupUnit).modal({
            keyboard: false,
            show: false
        });

        $('#' + Global.Element.PopupUnit).on('shown.bs.modal', function () {
            $('div.divParent').attr('currentPoppup', Global.Element.PopupUnit.toUpperCase());
            $("#unit-type-select").val(Global.Data.ParentId);
        });

        $("#" + Global.Element.PopupUnit + ' button[unit-save]').click(function () {
            if ($('#unit-name').val().trim() == "") {
                GlobalCommon.ShowMessageDialog("Vui lòng nhập Tên Đơn vị.", function () { }, "Lỗi Nhập liệu");
            }
            else
                SaveUnit();
        });
        $("#" + Global.Element.PopupUnit + ' button[unit-cancel]').click(function () {
            $('#unit-id').val('0'); 
            $('#unit-note').val('');
            $("#unit-name").val('');
            $('div.divParent').attr('currentPoppup', '');
            $("#" + Global.Element.PopupUnit).modal("hide");
        });
    }
     
    SaveUnit = () => {
        var obj = {
            Id: $('#unit-id').val(), 
            Name: $('#unit-name').val(),
            Note: $('#unit-note').val(),
            UnitTypeId: $('#unit-type-select').val()
        }

        $.ajax({
            url: Global.UrlAction.Save,
            type: 'post',
            data: ko.toJSON(obj),
            contentType: 'application/json',
            beforeSend: function () { $('#loading').show(); },
            success: function (result) {
                $('#loading').hide();
                GlobalCommon.CallbackProcess(result, function () {
                    if (result.Result == "OK") {
                        ReloadTable();
                        if (!Global.Data.IsInsert) {
                            $("#" + Global.Element.PopupUnit + ' button[unit-cancel]').click();
                        }
                        else {
                            $('#unit-id').val('0');
                            $('#unit-note').val('');
                            $("#unit-name").val('');
                            Global.Data.IsInsert = true;
                        }
                    }
                    else
                        GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình xử lý.");
                }, false, Global.Element.PopupModule, true, true, function () {
                    var msg = GlobalCommon.GetErrorMessage(result);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình xử lý.");
                });
            }
        });
    }

    DeleteUnit = (Id) => {
        $.ajax({
            url: Global.UrlAction.Delete,
            type: 'POST',
            data: JSON.stringify({ 'Id': Id }),
            contentType: 'application/json charset=utf-8',
            beforeSend: function () { $('#loading').show(); },
            success: function (data) {
                $('#loading').hide();
                GlobalCommon.CallbackProcess(data, function () {
                    if (data.Result == "OK") {
                        ReloadTable();
                    }
                    else
                        GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình xử lý.");
                }, false, Global.Element.PopupUnit, true, true, function () {

                    var msg = GlobalCommon.GetErrorMessage(data);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
                });
            }
        });
    }




    InitPopupUnitType = () => {
        $("#" + Global.Element.PopupUnitType).modal({
            keyboard: false,
            show: false
        });

        $('#' + Global.Element.PopupUnitType).on('shown.bs.modal', function () {
            $('div.divParent').attr('currentPoppup', Global.Element.PopupUnitType.toUpperCase());
        });

        $("#" + Global.Element.PopupUnitType + ' button[unit-type-save]').click(function () {
            if ($('#unit-type-code').val().trim() == "")
                GlobalCommon.ShowMessageDialog("Vui lòng nhập mã loại đơn vị.", function () { $('#unit-type-code').focus(); }, "Lỗi Nhập liệu");
            else if ($('#unit-type-name').val().trim() == "")
                GlobalCommon.ShowMessageDialog("Vui lòng nhập tên loại đơn vị.", function () { }, "Lỗi Nhập liệu");
            else
                SaveUnitType();
        });
        $("#" + Global.Element.PopupUnitType + ' button[unit-type-cancel]').click(function () {
            $('#unit-type-id').val('0');
            $('#unit-type-note').val('');
            $('#unit-type-code').val('');
            $("#unit-type-name").val('');
            $('div.divParent').attr('currentPoppup', '');
            $("#" + Global.Element.PopupUnitType).modal("hide");
        });
    }

    InitSearchPopupUnitType = () => {
        $("#" + Global.Element.SearchUnitType).modal({
            keyboard: false,
            show: false
        });

        $('#' + Global.Element.SearchUnitType).on('shown.bs.modal', function () {
            $('div.divParent').attr('currentPoppup', Global.Element.SearchUnitType.toUpperCase());
        });

        $("#" + Global.Element.SearchUnitType + ' button[unit-type-search]').click(function () {
            ReloadTable();

            $("#" + Global.Element.SearchUnitType + ' button[unit-type-close]')
        });

        $("#" + Global.Element.SearchUnitType + ' button[unit-type-close]').click(function () {
            $('#unit-type-keyword').val('');
            $('div.divParent').attr('currentPoppup', '');
            $("#" + Global.Element.SearchUnitType).modal("hide");
        });
    }

    SaveUnitType = () => {
        var obj = {
            Id: $('#unit-type-id').val(),
            Code: $('#unit-type-code').val(),
            Name: $('#unit-type-name').val(),
            Note: $('#unit-type-note').val(),
        }
        $.ajax({
            url: Global.UrlAction._Save,
            type: 'post',
            data: ko.toJSON(obj),
            contentType: 'application/json',
            beforeSend: function () { $('#loading').show(); },
            success: function (result) {
                $('#loading').hide();
                GlobalCommon.CallbackProcess(result, function () {
                    if (result.Result == "OK") {
                        ReloadTable();
                        GetUnitTypeSelect('unit-type-select')
                        if (!Global.Data.IsInsert) {
                            $("#" + Global.Element.PopupUnitType + ' button[unit-type-cancel]').click();
                        }
                        else {
                            $('#unit-type-id').val('0');
                            $('#unit-type-note').val('');
                            $("#unit-type-name").val('');
                            Global.Data.IsInsert = true;
                        }
                    }
                    else
                        GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình xử lý.");
                }, false, Global.Element.PopupModule, true, true, function () {
                    var msg = GlobalCommon.GetErrorMessage(result);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình xử lý.");
                });
            }
        });
    }

    DeleteUnitType = (Id) => {
        $.ajax({
            url: Global.UrlAction._Delete,
            type: 'POST',
            data: JSON.stringify({ 'Id': Id }),
            contentType: 'application/json charset=utf-8',
            beforeSend: function () { $('#loading').show(); },
            success: function (data) {
                $('#loading').hide();
                GlobalCommon.CallbackProcess(data, function () {
                    if (data.Result == "OK") {
                        ReloadTable();
                        GetUnitTypeSelect('unit-type-select')
                    }
                    else
                        GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình xử lý.");
                }, false, Global.Element.PopupUnit, true, true, function () {
                    var msg = GlobalCommon.GetErrorMessage(data);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
                });
            }
        });
    }

}

$(document).ready(function () {
    var Unit = new GPRO.Unit();
    Unit.Init();
});
