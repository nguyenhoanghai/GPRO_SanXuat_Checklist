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
GPRO.namespace('Position');
GPRO.Position = function () {
    var Global = {
        UrlAction: {
            _GetLists: '/Positiontype/Gets',
            _Save: '/Positiontype/Save',
            _Delete: '/Positiontype/Delete',

            GetLists: '/Position/Gets',
            Save: '/Position/Save',
            Delete: '/position/Delete',
        },
        Element: {
            Jtable: 'position-type-jtable',
            Popup: 'position-type-popup',
            PopupPosition: 'popup-position',
            Search: 'position-type-popup-search',
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
        InitList();
        ReloadList();
        InitPopup();
        InitSearchPopup();

        InitPopupType();
        GetPositionTypeSelect('position-type-select');
    }

    var RegisterEvent = function () {

    }

    function InitList() {
        $('#' + Global.Element.Jtable).jtable({
            title: 'Quản lý loại chức vụ',
            paging: true,
            pageSize: 1000,
            pageSizeChange: true,
            sorting: true,
            selectShow: false,
            actions: {
                listAction: Global.UrlAction._GetLists,
                // createAction: Global.Element.Popup,
            },
            messages: {
                // addNewRecord: 'Thêm mới',
            },
            searchInput: {
                id: 'position-keyword',
                className: 'search-input',
                placeHolder: 'Nhập từ khóa ...',
                keyup: function (evt) {
                    if (evt.keyCode == 13)
                        ReloadList();
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
                    title: "Mã loại ",
                    width: "10%",
                },
                Name: {
                    visibility: 'fixed',
                    title: "Tên loại",
                    width: "15%",
                },
                Note: {
                    title: "Mô Tả ",
                    width: "20%",
                    sorting: false,
                },
                actions: {
                    title: ' ',
                    width: '8%',
                    sorting: false,
                    edit: false,
                    display: function (parent) {
                        var div = $('<div class="table-action"></div>');

                        var $img = $('<i class="fa fa-list-ol clickable red aaa" title="Click xem sanh sách chức vụ ' + parent.record.Name + '"></i>');
                        $img.click(function () {
                            Global.Data.ParentId = parent.record.Id;
                            $("#position-type-select").val(parent.record.Id);
                            $('#' + Global.Element.Jtable).jtable('openChildTable',
                                $img.closest('tr'),
                                {
                                    title: '<span class="red">Danh sách chức vụ thuộc loại : ' + parent.record.Name + '</span>',
                                    paging: true,
                                    pageSize: 1000,
                                    pageSizeChange: true,
                                    sorting: true,
                                    selectShow: false,
                                    actions: {
                                        listAction: Global.UrlAction.GetLists + '?typeId=' + parent.record.Id,
                                        createAction: Global.Element.PopupPosition,
                                    },
                                    messages: {
                                        addNewRecord: 'Thêm mới',
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
                                        OIndex: {
                                            visibility: 'fixed',
                                            title: "STT",
                                            width: "3%",
                                        },
                                        Name: {
                                            visibility: 'fixed',
                                            title: "Tên chức vụ",
                                            width: "15%",
                                        },
                                        Note: {
                                            title: "Mô Tả ",
                                            width: "20%",
                                            sorting: false,
                                        },
                                        actions: {
                                            title: '',
                                            width: '5%',
                                            sorting: false,
                                            display: function (data) {
                                                var div = $('<div class="table-action"></div>');
                                                var editbtn = $('<i data-toggle="modal" data-target="#' + Global.Element.PopupPosition + '" title="Chỉnh sửa thông tin" class="fa fa-pencil-square-o "  ></i>');
                                                editbtn.click(function () {
                                                    $('#position-id').val(data.record.Id);
                                                    $('#position-note').val(data.record.Note);
                                                    $("#position-name").val(data.record.Name);
                                                    $("#position-type-select").val(data.record.PositionTypeId);
                                                    $('#position-index').val(data.record.OIndex);
                                                    Global.Data.ParentId = data.record.PositionTypeId;
                                                    Global.Data.IsInsert = false;
                                                });
                                                div.append(editbtn);

                                                var deleteBtn = $('<i title="Xóa" class="fa fa-trash-o "> </i>');
                                                deleteBtn.click(function () {
                                                    GlobalCommon.ShowConfirmDialog('Bạn có chắc chắn muốn xóa?', function () {
                                                        Delete(data.record.Id);
                                                    }, function () { }, 'Đồng ý', 'Hủy bỏ', 'Thông báo');
                                                });
                                                div.append(deleteBtn);

                                                return div;
                                            }
                                        }
                                    }
                                }, function (data) { //opened handler
                                    data.childTable.jtable('load');
                                });
                        });
                        div.append($img);

                        var btnEdit = $('<i data-toggle="modal" data-target="#' + Global.Element.Popup + '" title="Chỉnh sửa thông tin" class="fa fa-pencil-square-o clickable blue"  ></i>');
                        btnEdit.click(function () {
                            ReloadList();
                            $('#position-type-id').val(parent.record.Id);
                            $('#position-type-note').val(parent.record.Note);
                            $("#position-type-name").val(parent.record.Name);
                            $("#position-type-code").val(parent.record.Code);
                            Global.Data.IsInsert = false;
                        });
                        //div.append(btnEdit);

                        var deleteBtn = $('<i title="Xóa" class="fa fa-trash-o "> </i>');
                        deleteBtn.click(function () {
                            GlobalCommon.ShowConfirmDialog('Bạn có chắc chắn muốn xóa?', function () {
                                DeleteType(parent.record.Id);
                            }, function () { }, 'Đồng ý', 'Hủy bỏ', 'Thông báo');
                        });
                        //div.append(deleteBtn);

                        return div;
                    }
                } 
            }
        });
    }

    function ReloadList() {
        var keySearch = $('#position-keyword').val();
        $('#' + Global.Element.Jtable).jtable('load', { 'keyword': keySearch });
    }

    function CheckValidate() {
        if ($('#position-name').val().trim() == "") {
            GlobalCommon.ShowMessageDialog("Vui lòng nhập Tên chức vụ.", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        return true;
    }

    function SavePosition() {
        var obj = {
            Id: $('#position-id').val(),
            Name: $('#position-name').val(),
            Note: $('#position-note').val(),
            PositionTypeId: $('#position-type-select').val(),
            OIndex: $('#position-index').val()
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
                        ReloadList();
                        $('#position-id').val('0');
                        $('#position-note').val('');
                        $("#position-name").val('');
                        $('#position-type-select').val(Global.Data.ParentId);
                        if (!Global.Data.IsInsert) {
                            $("#" + Global.Element.PopupPosition + ' button[cancel]').click();
                            $('div.divParent').attr('currentPoppup', '');
                        }
                        Global.Data.IsInsert = true;
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

    function Delete(Id) {
        $.ajax({
            url: Global.UrlAction.Delete,
            type: 'POST',
            data: JSON.stringify({ 'Id': Id }),
            contentType: 'application/json charset=utf-8',
            beforeSend: function () { $('#loading').show(); },
            success: function (data) {
                $('#loading').hide();
                if (data.Result == "OK") {
                    ReloadList();
                }
                else
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình xử lý.");

            }
        });
    }

    function InitPopup() {
        $("#" + Global.Element.PopupPosition).modal({
            keyboard: false,
            show: false
        });

        $('#' + Global.Element.PopupPosition).on('shown.bs.modal', function () {
            //$('div.divParent').attr('currentPoppup', Global.Element.Popupposition.toUpperCase());
        });

        $("#" + Global.Element.PopupPosition + ' button[save]').click(function () {
            if (CheckValidate()) {
                SavePosition();
            }
        });

        $("#" + Global.Element.PopupPosition + ' button[cancel]').click(function () {
            $("#" + Global.Element.PopupPosition).modal("hide");
            $('#position-id').val('0');
            $('#position-note').val('');
            $("#position-name").val('');
            $('#position-type-select').val(Global.Data.ParentId);
        });
    }

    InitSearchPopup = () => {
        $('#' + Global.Element.Search).on('shown.bs.modal', function () {
            // $('div.divParent').attr('currentPoppup', Global.Element.Search.toUpperCase());
        });

        $('[position-close]').click(function () {
            $('#position-keyword').val('');
            $('div.divParent').attr('currentPoppup', '');
        });

        $('[position-search]').click(function () {
            ReloadList();
            $('#position-keyword').val('');
            $('[position-close]').click();
        });
    }

    //----------------------------------------------------
    function CheckValidate_Type() {
        if ($('#position-type-code').val().trim() == "") {
            GlobalCommon.ShowMessageDialog("Vui lòng nhập mã loại chức vụ.", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        else if ($('#position-type-name').val().trim() == "") {
            GlobalCommon.ShowMessageDialog("Vui lòng nhập tên loại chức vụ.", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        return true;
    }

    function SaveType() {
        var obj = {
            Id: $('#position-type-id').val(),
            Code: $('#position-type-code').val(),
            Name: $('#position-type-name').val(),
            Note: $('#position-type-note').val()
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
                        ReloadList();
                        GetPositionTypeSelect('position-type-select');
                        $('#position-type-id').val('0');
                        $('#position-type-note').val('');
                        $("#position-type-name").val('');
                        $("#position-type-code").val('');
                        if (!Global.Data.IsInsert) {
                            $("#" + Global.Element.Popupposition + ' button[position-type-cancel]').click();
                            $('div.divParent').attr('currentPoppup', '');
                        }
                        Global.Data.IsInsert = true;
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

    function DeleteType(Id) {
        $.ajax({
            url: Global.UrlAction._Delete,
            type: 'POST',
            data: JSON.stringify({ 'Id': Id }),
            contentType: 'application/json charset=utf-8',
            beforeSend: function () { $('#loading').show(); },
            success: function (data) {
                $('#loading').hide();
                if (data.Result == "OK") {
                    ReloadList();
                    GetPositionTypeSelect('position-type-select');
                }
                else
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình xử lý.");
            }
        });
    }

    function InitPopupType() {
        $("#" + Global.Element.Popup).modal({
            keyboard: false,
            show: false
        });

        $('#' + Global.Element.Popup).on('shown.bs.modal', function () {
            $('div.divParent').attr('currentPoppup', Global.Element.Popup.toUpperCase());
        });

        $("#" + Global.Element.Popup + ' button[save]').click(function () {
            if (CheckValidate_Type()) {
                SaveType();
            }
        });

        $("#" + Global.Element.Popup + ' button[cancel]').click(function () {
            $("#" + Global.Element.Popup).modal("hide");
            $('#position-type-id').val('0');
            $('#position-type-note').val('');
            $("#position-type-name").val('');
            $("#position-type-code").val('');
        });
    }

}

$(document).ready(function () {
    var obj = new GPRO.Position();
    obj.Init();
});
