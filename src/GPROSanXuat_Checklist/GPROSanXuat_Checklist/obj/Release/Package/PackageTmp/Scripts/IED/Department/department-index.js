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
GPRO.namespace('Department');
GPRO.Department = function () {
    var Global = {
        UrlAction: {
            Gets: '/Department/Gets',
            Save: '/Department/Save ',
            Delete: '/Department/Delete ',
        },
        Element: {
            Jtable: 'department-jtable',
            Popup: 'department-popup',
        },
        Data: {
            isCreate: true
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
    function InitList() {
        $('#' + Global.Element.Jtable).jtable({
            title: 'Danh sách phòng ban',
            paging: true,
            pageSize: 1000,
            pageSizeChange: true,
            sorting: true,
            selectShow: false,
            actions: {
                listAction: Global.UrlAction.Gets,
                createAction: Global.Element.Popup,
            },
            messages: {
                addNewRecord: 'Thêm mới',
            },
            searchInput: {
                id: 'department-search',
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
                Code: {
                    title: "STT",
                    width: "3%",
                },
                Code: {
                    title: "Mã  ",
                    width: "6%",
                },
                Name: {
                    visibility: 'fixed',
                    title: "Tên  ",
                    width: "10%",
                },

                Note: {
                    title: "Mô Tả",
                    width: "20%",
                    sorting: false
                },
                actions: {
                    title: '',
                    width: '5%',
                    sorting: false,
                    display: function (data) {
                        var div = $('<div class="table-action"></div>');
                        var btnEdit = $('<i data-toggle="modal" data-target="#' + Global.Element.Popup + '" title="Chỉnh sửa thông tin" class="fa fa-pencil-square-o clickable blue"  ></i>');
                        btnEdit.click(function () {
                            BindData(data.record);
                            Global.Data.isCreate = false;
                        });
                        div.append(btnEdit);
                        var btnDelete = $('<i title="Xóa" class="fa fa-trash-o"></i>');
                        btnDelete.click(function () {
                            GlobalCommon.ShowConfirmDialog('Bạn có chắc chắn muốn xóa?', function () {
                                Delete(data.record.Id);
                            }, function () { }, 'Đồng ý', 'Hủy bỏ', 'Thông báo');
                        });
                        div.append(btnDelete);
                        return div;
                    }
                },
            }
        });
    }

    function ReloadList() {
        $('#' + Global.Element.Jtable).jtable('load', { 'keyword': $('#department-search').val() });
    }

    function BindData(obj) {
        if (obj) {
            $('#department-id').val(obj.Id);
            $('#department-code').val(obj.Code);
            $('#department-name').val(obj.Name);
            $('#department-note').val(obj.Note);
        }
        else {
            $('#department-id').val(0);
            $('#department-code').val('');
            $('#department-name').val('');
            $('#department-note').val('');
        }
    }

    function Save() {
        var obj = {
            Id: $('#department-id').val(),
            OIndex: $('#department-index').val(),
            Code: $('#department-code').val(),
            Name: $('#department-name').val(),
            Note: $('#department-note').val(), 
        }
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
                        if (!Global.Data.isCreate) {
                            $("#" + Global.Element.Popup + ' button[cancel]').click();
                            Global.Data.isCreate = true;
                        }
                        BindData(null);
                        ReloadList();
                    }
                    else
                        GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình xử lý.");
                }, false, Global.Element.Popup, true, true, function () {
                        var msg = GlobalCommon.GetErrorMessage(result);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
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
                    if (data.Result == "OK")
                        ReloadList();
                    else
                        GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình xử lý.");
                }, false, Global.Element.Popup, true, true, function () {
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

        $('#' + Global.Element.Popup).on('shown.bs.modal', function () {
            //  $('div.divParent').attr('currentPoppup', Global.Element.PopupLine.toUpperCase());
        });

        $("#" + Global.Element.Popup + ' button[save]').click(function () {
            if (CheckValidate())
                Save();
        });

        $("#" + Global.Element.Popup + ' button[cancel]').click(function () {
            $("#" + Global.Element.Popup).modal("hide");
            BindData(null);
            $('div.divParent').attr('currentPoppup', '');
        });
    }

    function CheckValidate() {
        if ($('#department-index').val().trim() == "") {
            GlobalCommon.ShowMessageDialog("Vui lòng nhập số thứ tự.", function () { }, "Lỗi Nhập liệu");
            $('#department-index').focus();
            return false;
        }
        else if ($('#department-code').val().trim() == "") {
            GlobalCommon.ShowMessageDialog("Vui lòng nhập mã.", function () { }, "Lỗi Nhập liệu");
            $('#department-code').focus();
            return false;
        }
        else if ($('#department-name').val().trim() == "") {
            GlobalCommon.ShowMessageDialog("Vui lòng nhập Tên.", function () { }, "Lỗi Nhập liệu");
            $('#department-name').focus();
            return false;
        }
        return true;
    }
}
$(document).ready(function () {
    var obj = new GPRO.Department();
    obj.Init();
});