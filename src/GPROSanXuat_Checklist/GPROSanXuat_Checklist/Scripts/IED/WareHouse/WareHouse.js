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
GPRO.namespace('WareHouse');
GPRO.WareHouse = function () {
    var Global = {
        UrlAction: {
            GetList: '/WareHouse/Gets',
            Save: '/WareHouse/Save',
            Delete: '/WareHouse/Delete',
        },
        Element: {
            Jtable: 'warehouse-jtable',
            Popup: 'warehouse-popup',
            PopupSearch: 'warehouse-popup-search',
        },
        Data: {
            WareHouse: {},
            key: 0,
            Index: 0,
            Code: ''
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
    }

    var RegisterEvent = function () {

    }

    function InitList() {
        $('#' + Global.Element.Jtable).jtable({
            title: 'Danh sách kho',
            paging: true,
            pageSize: 10,
            pageSizeChange: true,
            sorting: true,
            selectShow: false,
            actions: {
                listAction: Global.UrlAction.GetList,
                createAction: Global.Element.Popup, 
            },
            messages: {
                addNewRecord: 'Thêm mới', 
            },
            searchInput: {
                id: 'warehouse-keyword',
                className: 'search-input',
                placeHolder: 'Nhập từ khóa ...',
                keyup: function (evt) {
                    if (evt.keyCode == 13)
                        ReloadList();
                }
            },
            fields: {
                Id: {
                    key: true,
                    create: false,
                    edit: false,
                    list: false
                },
                Name: {
                    visibility: 'fixed',
                    title: "Tên Kho",
                    width: "15%",
                },
                Index: {
                    title: "Mã Kho",
                    width: "10%",
                    display: function (data) {
                        return '<span >' + data.record.Code + '</span>';
                    }
                },
                IsAgency: {
                    title: 'Đại Lý',
                    width: '1%',
                    sorting: false,
                    display: function (data) {
                        var txt = '';
                        if (data.record.IsAgency)
                            txt = '<i class="fa fa-check-square-o"><i/>';
                        else
                            txt = '<i class="fa fa-square-o" ></i>';
                        return txt;
                    }
                },
                Note: {
                    title: "Mô Tả",
                    width: "20%",
                    sorting: false
                },
                edit: {
                    title: '',
                    width: '1%',
                    sorting: false,
                    display: function (data) {
                        var text = $('<i data-toggle="modal" data-target="#' + Global.Element.Popup + '" title="Chỉnh sửa thông tin" class="fa fa-pencil-square-o clickable blue"  ></i>');
                        text.click(function () {
                            $('#warehouse-id').val(data.record.Id);
                            $('#warehouse-index').val((Global.Data.Code + data.record.Index));
                            $('#warehouse-name').val(data.record.Name);
                            $('#warehouse-isagency').prop('checked', data.record.IsAgency).change();;
                            $('#warehouse-note').val(data.record.Note);
                            Global.Data.Index = data.record.Index;
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
        });
    }

    function ReloadList() {
        $('#' + Global.Element.Jtable).jtable('load', { 'keyword': $('#warehouse-keyword').val() });
    }

    function InitPopup() {
        $("#" + Global.Element.Popup).modal({
            keyboard: false,
            show: false,
        });

        $('#' + Global.Element.Popup).on('show.bs.modal', function (e) {
            if ($('#warehouse-id').val() == '' || $('#warehouse-id').val() == '0')
                GetLastIndex();

        });

        $("#" + Global.Element.Popup + ' button[warehouse-save]').click(function () {
            if (CheckValidate()) {
                Save();
            }
        });
        $("#" + Global.Element.Popup + ' button[warehouse-cancel]').click(function () {
            $("#" + Global.Element.Popup).modal("hide");
            ResetForm();
        });
    }

    function InitSearchPopup() {
        $('#' + Global.Element.PopupSearch + ' button[warehouse-search]').click(function () {
            ReloadList();
        });

        $('#' + Global.Element.PopupSearch + ' button[warehouse-close]').click(function () {
            $("#" + Global.Element.PopupSearch).modal("hide");

        });
    }

    function CheckValidate() {
        if ($('#warehouse-name').val().trim() == "") {
            GlobalCommon.ShowMessageDialog("Vui lòng nhập Tên Kho.", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        return true;
    }

    function Save() {
        var obj = {
            Id: $('#warehouse-id').val(),
            Index: Global.Data.Index,
            Name: $('#warehouse-name').val(),
            Note: $('#warehouse-note').val(),
            IsAgency: $('#warehouse-isagency').prop('checked')
        }
        if (obj.Id == 0)
            obj.Index += 1;
        $.ajax({
            url: Global.UrlAction.Save,
            type: 'POST',
            data: ko.toJSON(obj),
            contentType: 'application/json',
            beforeSend: function () { $('#loading').show(); },
            success: function (result) {
                $('#loading').hide();
                GlobalCommon.CallbackProcess(result, function () {
                    if (result.Result == "OK") {
                        ReloadList();
                        $("#" + Global.Element.Popup + ' button[warehouse-cancel]').click();
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
            success: function (result) {
                GlobalCommon.CallbackProcess(result, function () {
                    $('#loading').hide();
                    if (result.Result == "OK") {
                        ReloadList();
                    }
                    else
                        GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình xử lý.");
                }, false, Global.Element.PopupSize, true, true, function () {

                    var msg = GlobalCommon.GetErrorMessage(result);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
                });
            }
        });
    }

    function GetLastIndex() {
        $.ajax({
            url: '/WareHouse/GetLastIndex',
            type: 'POST',
            contentType: 'application/json',
            beforeSend: function () { $('#loading').show(); },
            success: function (data) {
                $('#loading').hide();
                Global.Data.Index = parseInt(data.Records);
                Global.Data.Code = data.Data;
                $('#warehouse-index').val((Global.Data.Code + (Global.Data.Index + 1)));
            }
        });
    };

    function ResetForm() {
        $('#warehouse-id').val(0);
        $('#warehouse-index').val('');
        $('#warehouse-name').val('');
        $('#warehouse-isagency').prop('checked', false).change();
        $('#warehouse-note').val('');
    }
}

$(document).ready(function () {
    var obj = new GPRO.WareHouse();
    obj.Init();
})

