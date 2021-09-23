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
GPRO.namespace('Line');
GPRO.Line = function () {
    var Global = {
        UrlAction: {
            GetListLine: '/Line/Gets',
            SaveLine: '/Line/Save ',
            DeleteLine: '/Line/Delete ',
        },
        Element: {
            JtableLine: 'jtableLine',
            PopupLine: 'popup_Line',
        },
        Data: {
            ModelLine: {},
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
        GetFloorSelect('line_floor',0);
    }


    var RegisterEvent = function () {
        $('[re_line_floor]').click(function () {
            GetFloorSelect('line_floor',0);
        });
    }
      
    function BindData(Line) {
        if (Line) {
            $('#line-id').val(Line.Id);
            $('#lineCode').val(Line.Code);
            $('#lineName').val(Line.Name);
            $('#lineCountOfLabours').val(Line.Labours);
            $('#line-note').val(Line.Note);
            $('#line_floor').val(Line.FloorId);
        }
        else {
            $('#line-id').val(0);
            $('#lineCode').val('');
            $('#lineName').val('');
            $('#lineCountOfLabours').val(1);
            $('#line-note').val('');
        }
    }

    function SaveLine() { 
        var obj = {
            Id: $('#line-id').val(),
            Code: $('#lineCode').val(),
            Name: $('#lineName').val(),
             Labours: $('#lineCountOfLabours').val(),
            Note: $('#line-note').val(),
            FloorId: $('#line_floor').val(),
        }
        $.ajax({
            url: Global.UrlAction.SaveLine,
            type: 'post',
            data: JSON.stringify(obj),
            contentType: 'application/json',
            beforeSend: function () { $('#loading').show(); },
            success: function (result) {
                $('#loading').hide();
                GlobalCommon.CallbackProcess(result, function () {
                    if (result.Result == "OK") {
                        if (!Global.Data.isCreate) {
                            $("#" + Global.Element.PopupLine + ' button[cancel_line]').click();
                            Global.Data.isCreate = true;
                        }
                        BindData(null);
                        ReloadList();
                    }
                }, false, Global.Element.PopupLine, true, true, function () {
                    var msg = GlobalCommon.GetErrorMessage(result);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình xử lý.");
                });
            }
        });
    }

    function InitList() {
        $('#' + Global.Element.JtableLine).jtable({
            title: 'Danh sách Chuyền',
            paging: true,
            pageSize: 1000,
            pageSizeChange: true,
            sorting: true,
            selectShow: false,
            actions: {
                listAction: Global.UrlAction.GetListLine,
                createAction: Global.Element.PopupLine,
            },
            messages: {
                addNewRecord: 'Thêm mới',
            },
            searchInput: {
                id: 'linetxtSearch',
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
                WorkShopId: {
                    title: "Phân Xưởng",
                    width: "10%",
                    sorting:false,
                    display: function (data) {
                        txt = '<span class=" bold">' + data.record.WorkShopName + '</span>';
                        return txt;
                    }
                },
                FloorId: {
                    title: "Lầu",
                    width: "10%",
                    display: function (data) {
                        txt = '<span class=" bold">' + data.record.FloorName + '</span>';
                        return txt;
                    }
                },
                Code: {
                    title: "Mã Chuyền",
                    width: "6%",
                },
                Name: {
                    visibility: 'fixed',
                    title: "Tên Chuyền",
                    width: "20%",
                },
                Labours: {
                    title: "LĐ Định Biên",
                    width: "5%",
                    display: function (data) {
                        txt = '<span class="red bold">' + data.record.Labours + ' (LĐ)</span>';
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
                        var text = $('<i data-toggle="modal" data-target="#' + Global.Element.PopupLine + '" title="Chỉnh sửa thông tin" class="fa fa-pencil-square-o clickable blue"  ></i>');
                        text.click(function () { 
                            BindData(data.record);
                            Global.Data.isCreate = false;
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
        $('#' + Global.Element.JtableLine).jtable('load', { 'keyword': $('#linetxtSearch').val() });
    }

    function Delete(Id) {
        $.ajax({
            url: Global.UrlAction.DeleteLine,
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
                }, false, Global.Element.PopupLine, true, true, function () {
                    var msg = GlobalCommon.GetErrorMessage(data);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
                });
            }
        });
    }

    function InitPopup() {
        $("#" + Global.Element.PopupLine).modal({
            keyboard: false,
            show: false
        });

        $('#' + Global.Element.PopupLine).on('shown.bs.modal', function () {
            $('div.divParent').attr('currentPoppup', Global.Element.PopupLine.toUpperCase());
        });

        $("#" + Global.Element.PopupLine + ' button[save_line]').click(function () {
            if (CheckValidate())
                SaveLine();
        });

        $("#" + Global.Element.PopupLine + ' button[cancel_line]').click(function () {
            $("#" + Global.Element.PopupLine).modal("hide");
            BindData(null);
            $('div.divParent').attr('currentPoppup', '');
        });
    }

    function CheckValidate() {
        if ($('#lineName').val().trim() == "") {
            GlobalCommon.ShowMessageDialog("Vui lòng nhập Tên.", function () { }, "Lỗi Nhập liệu");
            $('#lineName').focus();
            return false;
        }
        else if ($('#lineCountOfLabours').val().trim() == "") {
            GlobalCommon.ShowMessageDialog("Vui lòng Nhập số Lao Động Định Biên.", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        else if (parseInt($('#lineCountOfLabours').val()) <= 0) {
            GlobalCommon.ShowMessageDialog("Vui lòng Nhập số Lao Động Định Biên lớn hơn 0.", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        else if ($('#line_floor').val() == "0") {
            GlobalCommon.ShowMessageDialog("Vui lòng chọn lầu.", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        return true;
    }
}
$(document).ready(function () {
    var obj = new GPRO.Line();
    obj.Init();
});