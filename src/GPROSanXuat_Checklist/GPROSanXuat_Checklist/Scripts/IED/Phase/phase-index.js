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
GPRO.namespace('Phase');
GPRO.Phase = function () {
    var Global = {
        UrlAction: {
            Gets: '/Phase/Gets',
            Save: '/Phase/Save',
            Delete: '/Phase/Delete',
        },
        Element: {
            Jtable: 'jtable-phase',
            Popup: 'popup-phase'
        },
        Data: {
            isInsert: true
        }
    }
    this.GetGlobal = function () {
        return Global;
    }

    this.Init = function () {
        RegisterEvent();
        InitJtable();
        ReloadJtable();
        InitPopup();
    }


    var RegisterEvent = function () {

    }

    function BindData(obj) {
        $('#phase-id').val(0);
        $('#phase-stt').val(1);
        $('#phase-type').val(1);
        $('#phase-name').val('');
        $('#phase-note').val('');
        if (obj) {
            $('#phase-id').val(obj.Id);
            $('#phase-type').val(obj.Type);
            $('#phase-stt').val(obj.Index);
            $('#phase-name').val(obj.Name);
            $('#phase-note').val(obj.Note);
        }
    }

    function Save() {
        var obj = {
            Id: $('#phase-id').val(),
            Index: $('#phase-stt').val(),
            Type: $('#phase-type').val(),
            Name: $('#phase-name').val(),
            Note: $('#phase-note').val(),
        };
        $.ajax({
            url: Global.UrlAction.Save,
            type: 'post',
            data: JSON.stringify(obj),
            contentType: 'application/json',
            beforeSend: function () { $('#loading').show(); },
            success: function (result) {
                $('#loading').hide();
                GlobalCommon.CallbackProcess(result, function () {
                    if (result.Result == "OK") {
                        BindData(null);
                        ReloadJtable();
                        if (!Global.Data.isInsert)
                            $("#" + Global.Element.Popup + ' button[phase-cancel]').click();
                        Global.Data.isInsert = true;
                    }
                }, false, Global.Element.PopupWorkShop, true, true, function () {
                    var msg = GlobalCommon.GetErrorMessage(result);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình xử lý.");
                });
            }
        });
    }

    function InitJtable() {
        $('#' + Global.Element.Jtable).jtable({
            title: 'Danh sách công đoạn',
            paging: true,
            pageSize: 1000,
            pageSizeChange: true,
            sorting: true,
            selectShow: false,
            actions: {
                listAction: Global.UrlAction.Gets,
                createAction: Global.Element.Popup
            },
            messages: {
                addNewRecord: 'Thêm mới',
            },
            searchInput: {
                id: 'phase-keyword',
                className: 'search-input',
                placeHolder: 'Nhập từ khóa ...',
                keyup: function (evt) {
                    if (evt.keyCode == 13)
                        ReloadJtable();
                }
            },
            fields: {
                Id: {
                    key: true,
                    create: false,
                    edit: false,
                    list: false
                },
                Type: {
                    visibility: 'fixed',
                    title: "Loại công đoạn",
                    width: "10%",
                    display: (data) => {
                        if (data.record.Type == 1)
                            return '<span>BTP hoàn chỉnh</span>';
                        return '<span>Hoàn tất</span>';
                    }
                },
                Index: {
                    title: "STT",
                    width: "5%",
                },
                Name: {
                    title: "Tên công đoạn",
                    width: "20%",
                },
                Note: {
                    title: "Ghi chú",
                    width: "20%",
                    sorting: false
                },
                edit: {
                    title: '',
                    width: '5%',
                    sorting: false,
                    display: function (data) {
                        var div = $('<div class="table-action"></div>');
                        var text = $('<i data-toggle="modal" data-target="#' + Global.Element.Popup + '" title="Chỉnh sửa thông tin" class="fa fa-pencil-square-o "  ></i>');
                        text.click(function () {
                            BindData(data.record);
                            Global.Data.isInsert = false;
                        });
                        div.append(text);

                        var btnDelete = $('<i title="Xóa" class="fa fa-trash-o  "> </button>');
                        btnDelete.click(function () {
                            GlobalCommon.ShowConfirmDialog('Bạn có chắc chắn muốn xóa?', function () {
                                Delete(data.record.Id);
                            }, function () { }, 'Đồng ý', 'Hủy bỏ', 'Thông báo');
                        });
                        div.append(btnDelete);
                        return div;
                    }
                } 
            }
        });
    }

    function ReloadJtable() {
        $('#' + Global.Element.Jtable).jtable('load', { 'keyword': $('#phase-keyword').val() });
    }

    function Delete(Id) {
        $.ajax({
            url: Global.UrlAction.Delete,
            type: 'POST',
            data: JSON.stringify({ 'Id': Id }),
            contentType: 'application/json charset=utf-8', beforeSend: function () { $('#loading').show(); },
            success: function (data) {
                $('#loading').hide();
                GlobalCommon.CallbackProcess(data, function () {
                    if (data.Result == "OK") {
                        ReloadJtable();
                    }
                }, false, Global.Element.PopupWorkShop, true, true, function () {
                    var msg = GlobalCommon.GetErrorMessage(data);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
                });
            }
        });
    }

    function InitPopup() {
        $("#" + Global.Element.Popup).modal({
            keyboard: false,
            show: false
        });
        $("#" + Global.Element.Popup + ' button[phase-save]').click(function () {
            if (CheckValidate()) {
                Save();
            }
        });
        $("#" + Global.Element.Popup + ' button[phase-cancel]').click(function () {
            $("#" + Global.Element.Popup).modal("hide");
            BindData(null);
            $('div.divParent').attr('currentPoppup', '');
        });

        $('#' + Global.Element.Popup).on('shown.bs.modal', function () {
            $('div.divParent').attr('currentPoppup', Global.Element.Popup.toUpperCase());
        });
    }


    function CheckValidate() {
        if ($('#phase-stt').val().trim() == "") {
            GlobalCommon.ShowMessageDialog("Vui lòng chọn nhập thứ tự công đoạn.", function () { }, "Lỗi Nhập liệu");
            $('#phase-stt').focus();
            return false;
        }
        else if ($('#phase-name').val().trim() == "") {
            GlobalCommon.ShowMessageDialog("Vui lòng nhập Tên công đoạn.", function () { }, "Lỗi Nhập liệu");
            $('#phase-name').focus();
            return false;
        }
        return true;
    }
}
$(document).ready(function () {
    var obj = new GPRO.Phase();
    obj.Init();
})
