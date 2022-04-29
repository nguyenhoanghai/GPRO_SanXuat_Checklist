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
GPRO.namespace('LinePart');
GPRO.LinePart = function () {
    var Global = {
        UrlAction: {
            Gets: '/LinePart/Gets',
            Save: '/LinePart/Save ',
            Delete: '/LinePart/Delete ',
        },
        Element: {
            Jtable: 'line-part-jtable',
            Popup: 'line-part-popup',
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
        InitPopup();
        GetWorkshopSelect('line-part-workshop'); 

    }


    var RegisterEvent = function () {
        $('[re-workshop]').click(function () {
            GetWorkshopSelect('line-part-workshop');
        });

        $('[re-floor]').click(function () {
            if ($('#line-part-workshop').val() != '0' || $('#line-part-workshop').val() != 0)
                GetFloorSelect('line-part-floor', $('#line-part-workshop').val());
        });

        $('[re-line]').click(function () {
            if ($('#line-part-floor').val() != '0' || $('#line-part-floor').val() != 0)
                GetLineSelect('line-part-line', $('#line-part-floor').val());
        });

        $('#line-part-workshop').change(() => {
            if ($('#line-part-workshop').val() != '0' || $('#line-part-workshop').val() != 0)
                GetFloorSelect('line-part-floor', $('#line-part-workshop').val());
        })

        $('#line-part-floor').change(() => {
            if ($('#line-part-floor').val() != '0' || $('#line-part-floor').val() != 0)
                GetLineSelect('line-part-line', $('#line-part-floor').val());
        })

        $('#line-part-line').change(() => {
            if ($('#line-part-line').val() != '0' || $('#line-part-line').val() != 0)
                ReloadList();
        })

    }

    function BindData(Line) {
        if (Line) {
            $('#line-part-id').val(Line.Id);
            $('#line-part-code').val(Line.Code);
            $('#line-part-name').val(Line.Name);
            $('#line-part-note').val(Line.Note);
        }
        else {
            $('#line-part-id').val(0);
            $('#line-part-code').val('');
            $('#line-part-name').val('');
            $('#line-part-note').val('');
        }
    }

    function Save() {
        var obj = {
            Id: $('#line-part-id').val(),
            Code: $('#line-part-code').val(),
            Name: $('#line-part-name').val(),
            Note: $('#line-part-note').val(),
            LineId: $('#line-part-line').val(),
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

    function InitList() {
        $('#' + Global.Element.Jtable).jtable({
            title: 'Danh sách tổ',
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
                id: 'line-part-search',
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
                    title: "Mã tổ",
                    width: "6%",
                },
                Name: {
                    visibility: 'fixed',
                    title: "Tên tổ",
                    width: "10%",
                },

                Note: {
                    title: "Mô Tả",
                    width: "20%",
                    sorting: false
                },
                edit: {
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
        $('#' + Global.Element.Jtable).jtable('load', { 'keyword': $('#line-part-search').val(), 'lineId': $('#line-part-line').val() });
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
        if ($('#line-part-code').val().trim() == "") {
            GlobalCommon.ShowMessageDialog("Vui lòng nhập mã.", function () { }, "Lỗi Nhập liệu");
            $('#line-part-code').focus();
            return false;
        }
        else if ($('#line-part-name').val().trim() == "") {
            GlobalCommon.ShowMessageDialog("Vui lòng nhập Tên.", function () { }, "Lỗi Nhập liệu");
            $('#line-part-name').focus();
            return false;
        }
        return true;
    }
}
$(document).ready(function () {
    var obj = new GPRO.LinePart();
    obj.Init();
});