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
GPRO.namespace('Status');
GPRO.Status = function () {
    var Global = {
        UrlAction: {
            _GetLists: '/Statustype/Gets',
            _Save: '/Statustype/Save',
            _Delete: '/Statustype/Delete',

            GetLists: '/Status/Gets',
            Save: '/Status/Save',
            Delete: '/Status/Delete',
        },
        Element: {
            JtableStatus: 'status-type-jtable',
            Popup: 'status-type-popup',
            PopupStatus: 'popup-status',
            Search: 'status-type-popup-search',
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
        GetStatusTypeSelect('status-type-select');
    }

    var RegisterEvent = function () {

    }

    function InitList() {
        $('#' + Global.Element.JtableStatus).jtable({
            title: 'Quản lý loại trạng thái',
            paging: true,
            pageSize: 1000,
            pageSizeChange: true,
            sorting: true,
            selectShow: false,
            actions: {
                listAction: Global.UrlAction._GetLists,
                createAction: Global.Element.Popup, 
            },
            messages: {
                addNewRecord: 'Thêm mới', 
            },
            searchInput: {
                id: 'status-keyword',
                className: 'search-input',
                placeHolder: 'Nhập từ khóa ...',
                keyup: function (evt) {
                    if (evt.keyCode == 13)
                        ReloadList();
                }
            }, 
            rowInserted: function (event, data) {
                if (data.record.Id == Global.Data.ParentId) {
                    var $a = $('#' + Global.Element.JtableStatus).jtable('getRowByKey', data.record.Id);
                    $($a.children().find('.aaa')).click();
                }
            },
            datas: {
                jtableId: Global.Element.JtableStatus
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
                    width: "20%",
                },
                Name: {
                    visibility: 'fixed',
                    title: "Tên loại",
                    width: "20%",
                },
                Note: {
                    title: "Mô Tả ",
                    width: "20%",
                    sorting: false,
                },
                Detail: {
                    title: 'DS trạng thái',
                    width: '3%',
                    sorting: false,
                    edit: false,
                    display: function (parent) {
                        var $img = $('<i class="fa fa-list-ol clickable red aaa" title="Click xem sanh sách trạng thái ' + parent.record.Name + '"></i>');
                        $img.click(function () {
                            Global.Data.ParentId = parent.record.Id;
                            $("#status-type-select").val(parent.record.Id);
                            $('#' + Global.Element.JtableStatus).jtable('openChildTable',
                                $img.closest('tr'),
                                {
                                    title: '<span class="red">Danh sách trạng thái thuộc : ' + parent.record.Name + '</span>',
                                    paging: true,
                                    pageSize: 1000,
                                    pageSizeChange: true,
                                    sorting: true,
                                    selectShow: false,
                                    actions: {
                                        listAction: Global.UrlAction.GetLists + '?typeId=' + parent.record.Id,
                                        createAction: Global.Element.PopupStatus,
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
                                        Name: {
                                            visibility: 'fixed',
                                            title: "Tên trạng thái",
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
                                                var text = $('<i data-toggle="modal" data-target="#' + Global.Element.PopupStatus + '" title="Chỉnh sửa thông tin" class="fa fa_tb fa-pencil-square-o clickable blue"  ></i>');
                                                text.click(function () {
                                                    $('#status-id').val(data.record.Id);
                                                    $('#status-note').val(data.record.Note);
                                                    $("#status-name").val(data.record.Name);
                                                    $("#status-type-select").val(data.record.StatusTypeId);
                                                    Global.Data.ParentId = data.record.StatusTypeId;
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
                                                        Delete(data.record.Id);
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
                        var text = $('<i data-toggle="modal" data-target="#' + Global.Element.Popup + '" title="Chỉnh sửa thông tin" class="fa fa-pencil-square-o clickable blue"  ></i>');
                        text.click(function () {
                            ReloadList();
                            $('#status-type-id').val(data.record.Id);
                            $('#status-type-note').val(data.record.Note);
                            $("#status-type-name").val(data.record.Name);
                            $("#status-type-code").val(data.record.Code);
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
                                DeleteType(data.record.Id);
                            }, function () { }, 'Đồng ý', 'Hủy bỏ', 'Thông báo');
                        });
                        return text;

                    }
                }
            }
        });
    }

    function ReloadList() {
        var keySearch = $('#status-keyword').val();
        $('#' + Global.Element.JtableStatus).jtable('load', { 'keyword': keySearch });
    }

    function CheckValidate() {
        if ($('#status-name').val().trim() == "") {
            GlobalCommon.ShowMessageDialog("Vui lòng nhập Tên Trạng thái.", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        return true;
    }

    function SaveStatus() {
        var obj = {
            Id: $('#status-id').val(),
            Name: $('#status-name').val(),
            Note: $('#status-note').val(),
            StatusTypeId: $('#status-type-select').val()
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
                        $('#status-id').val('0');
                        $('#status-note').val('');
                        $("#status-name").val('');
                        $('#status-type-select').val(Global.Data.ParentId);
                        if (!Global.Data.IsInsert) {
                            $("#" + Global.Element.PopupStatus + ' button[status-cancel]').click();
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
                GlobalCommon.CallbackProcess(data, function () {
                    if (data.Result == "OK") {
                        ReloadList();
                    }
                    else
                        GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình xử lý.");
                }, false, Global.Element.PopupStatus, true, true, function () {

                    var msg = GlobalCommon.GetErrorMessage(data);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
                });
            }
        });
    }

    function InitPopup() {
        $("#" + Global.Element.PopupStatus).modal({
            keyboard: false,
            show: false
        });

        $('#' + Global.Element.PopupStatus).on('shown.bs.modal', function () {
            $('div.divParent').attr('currentPoppup', Global.Element.PopupStatus.toUpperCase());
        });

        $("#" + Global.Element.PopupStatus + ' button[status-save]').click(function () {
            if (CheckValidate()) {
                SaveStatus();
            }
        });

        $("#" + Global.Element.PopupStatus + ' button[status-cancel]').click(function () {
            $("#" + Global.Element.PopupStatus).modal("hide");
            $('#status-id').val('0');
            $('#status-note').val('');
            $("#status-name").val('');
            $('#status-type-select').val(Global.Data.ParentId);
        });
    }

    InitSearchPopup = () => {
        $('#' + Global.Element.Search).on('shown.bs.modal', function () {
            $('div.divParent').attr('currentPoppup', Global.Element.Search.toUpperCase());
        });

        $('[status-close]').click(function () {
            $('#status-keyword').val('');
            $('div.divParent').attr('currentPoppup', '');
        });

        $('[status-search]').click(function () {
            ReloadList();
            $('#status-keyword').val('');
            $('[status-close]').click();
        });
    }

    //----------------------------------------------------
    function CheckValidate_Type() {
        if ($('#status-type-code').val().trim() == "") {
            GlobalCommon.ShowMessageDialog("Vui lòng nhập mã loại trạng thái.", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        else if ($('#status-type-name').val().trim() == "") {
            GlobalCommon.ShowMessageDialog("Vui lòng nhập tên loại trạng thái.", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        return true;
    }

    function SaveType() {
        var obj = {
            Id: $('#status-type-id').val(),
            Code: $('#status-type-code').val(),
            Name: $('#status-type-name').val(),
            Note: $('#status-type-note').val()
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
                        GetStatusTypeSelect('status-type-select');
                        $('#status-type-id').val('0');
                        $('#status-type-note').val('');
                        $("#status-type-name").val('');
                        $("#status-type-code").val('');
                        if (!Global.Data.IsInsert) {
                            $("#" + Global.Element.PopupStatus + ' button[status-type-cancel]').click();
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
                GlobalCommon.CallbackProcess(data, function () {
                    if (data.Result == "OK") {
                        ReloadList();
                        GetStatusTypeSelect('status-type-select');
                    }
                    else
                        GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình xử lý.");
                }, false, Global.Element.PopupStatus, true, true, function () {

                    var msg = GlobalCommon.GetErrorMessage(data);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
                });
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

        $("#" + Global.Element.Popup + ' button[status-type-save]').click(function () {
            if (CheckValidate_Type()) {
                SaveType();
            }
        });

        $("#" + Global.Element.Popup + ' button[status-type-cancel]').click(function () {
            $("#" + Global.Element.Popup).modal("hide");
            $('#status-type-id').val('0');
            $('#status-type-note').val('');
            $("#status-type-name").val('');
            $("#status-type-code").val('');
        });
    }

}

$(document).ready(function () {
    var Status = new GPRO.Status();
    Status.Init();
});
