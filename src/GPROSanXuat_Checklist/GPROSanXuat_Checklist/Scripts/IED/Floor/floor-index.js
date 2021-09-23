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
GPRO.namespace('Floor');
GPRO.Floor = function () {
    var Global = {
        UrlAction: {
            Gets: '/floor/Gets',
            Save : '/floor/Save',
            Delete : '/floor/Delete',
        },
        Element: {
            Jtable : 'jtable-floor',
            Popup : 'popup-floor' 
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
        $('[re-workshop]').click();
    }
     

    var RegisterEvent = function () {   
        $('[re-workshop]').click(() => {
            GetWorkshopSelect('floor-wk-id');
        })
    }

    function BindData(obj) {
        $('#floor-id').val(0);
        $('#floor-wk-id').val(0);
        $('#floor-name').val('');
        $('#floor-note').val('');
        if (obj) {
            $('#floor-id').val(obj.Id);
            $('#floor-wk-id').val(obj.WorkshopId);
            $('#floor-name').val(obj.Name);
            $('#floor-note').val(obj.Note);
        }
    }

    function Save () {
        var obj = {
            Id: $('#floor-id').val(),
            WorkshopId: $('#floor-wk-id').val(), 
            Name: $('#floor-name').val(),
            Note: $('#floor-note').val(),
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
                            $("#" + Global.Element.Popup + ' button[floor-cancel]').click();
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
            title: 'Danh sách lầu',
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
                id: 'floor-keyword',
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
                WorkshopName: {
                    visibility: 'fixed',
                    title: "Phân xưởng",
                    width: "20%",
                },
                Name: { 
                    title: "Tên lầu",
                    width: "20%",
                }, 
                Note: {
                    title: "Ghi chú",
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
                            BindData(data.record);
                            Global.Data.isInsert = false;
                        });
                        return text;
                    }
                },
                Delete: {
                    title: 'Xóa',
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

    function ReloadJtable() {
        $('#' + Global.Element.Jtable).jtable('load', { 'keyword': $('#floor-keyword').val() });
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
        $("#" + Global.Element.Popup + ' button[floor-save]').click(function () {
            if (CheckValidate()) {
                Save ();
            }
        });
        $("#" + Global.Element.Popup + ' button[floor-cancel]').click(function () {
            $("#" + Global.Element.Popup).modal("hide");
            BindData(null);
            $('div.divParent').attr('currentPoppup', '');
        });

        $('#' + Global.Element.Popup).on('shown.bs.modal', function () {
            $('div.divParent').attr('currentPoppup', Global.Element.Popup.toUpperCase());
        });
    }

     
    function CheckValidate() {
        if ($('#floor-wk-id').val().trim() == "") {
            GlobalCommon.ShowMessageDialog("Vui lòng chọn Phân Xưởng.", function () { }, "Lỗi Nhập liệu");
            $('#floor-wk-id').focus();
            return false;
        }
        else if ($('#floor-name').val().trim() == "") {
            GlobalCommon.ShowMessageDialog("Vui lòng nhập Tên lầu.", function () { }, "Lỗi Nhập liệu");
            $('#floor-name').focus();
            return false;
        }
        return true;
    }
}
$(document).ready(function () {
    var obj = new GPRO.Floor();
    obj.Init();
})
