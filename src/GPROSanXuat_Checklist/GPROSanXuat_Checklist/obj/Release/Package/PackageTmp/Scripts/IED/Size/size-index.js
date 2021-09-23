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
GPRO.namespace('Size');
GPRO.Size = function () {
    var Global = {
        UrlAction: {
            GetLists: '/Size/Gets',
            Save: '/Size/Save',
            Delete: '/Size/Delete',
        },
        Element: {
            JtableSize: 'jtable-size',
            PopupSize: 'popup-size', 
        },
        Data: {
            IsInsert: true
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
    }

    var RegisterEvent = function () {

    }

    function CheckValidate() {
        if ($('#size-name').val().trim() == "") {
            GlobalCommon.ShowMessageDialog("Vui lòng nhập Tên kích cỡ.", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        return true;
    }

    function SaveSize() {
        var obj = {
            Id: $('#size-id').val(),
            Name: $('#size-name').val(),
            Note: $('#size-note').val(),
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
                        $('#size-id').val('0');
                        $('#size-note').val('');
                        $("#size-name").val('');
                        if (!Global.Data.IsInsert) {
                            $("#" + Global.Element.PopupSize + ' button[size-cancel]').click();
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

    function InitList() {
        $('#' + Global.Element.JtableSize).jtable({
            title: 'Quản lý kích cỡ',
            paging: true,
            pageSize: 1000,
            pageSizeChange: true,
            sorting: true,
            selectShow: false,
            actions: {
                listAction: Global.UrlAction.GetLists,
                createAction: Global.Element.PopupSize, 
            },
            messages: {
                addNewRecord: 'Thêm mới',  
            },
            searchInput: {
                id: 'Size-keyword',
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
                    title: "Tên kích cỡ",
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
                        var text = $('<i data-toggle="modal" data-target="#' + Global.Element.PopupSize + '" title="Chỉnh sửa thông tin" class="fa fa-pencil-square-o clickable blue"  ></i>');
                        text.click(function () {
                            ReloadList();
                            $('#size-id').val(data.record.Id);
                            $('#size-note').val(data.record.Note);
                            $("#size-name").val(data.record.Name);
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
        });
    }

    function ReloadList() {
        var keySearch = $('#Size-keyword').val();
        $('#' + Global.Element.JtableSize).jtable('load', { 'keyword': keySearch });
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
                }, false, Global.Element.PopupSize, true, true, function () {

                    var msg = GlobalCommon.GetErrorMessage(data);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
                });
            }
        });
    }

    function InitPopup() {
        $("#" + Global.Element.PopupSize).modal({
            keyboard: false,
            show: false
        });

        $('#' + Global.Element.PopupSize).on('shown.bs.modal', function () {
            $('div.divParent').attr('currentPoppup', Global.Element.PopupSize.toUpperCase());
        });

        $("#" + Global.Element.PopupSize + ' button[size-save]').click(function () {
            if (CheckValidate()) {
                SaveSize();
            }
        });

        $("#" + Global.Element.PopupSize + ' button[size-cancel]').click(function () {
            $("#" + Global.Element.PopupSize).modal("hide");
            $('#size-id').val('0');
            $('#size-note').val('');
            $("#size-name").val('');
        });
    }
     

}

$(document).ready(function () {
    var Size = new GPRO.Size();
    Size.Init();
});
