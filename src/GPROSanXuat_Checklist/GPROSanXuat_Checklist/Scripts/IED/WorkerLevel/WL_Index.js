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
GPRO.namespace('WorkersLevel');
GPRO.WorkersLevel = function () {
    var Global = {
        UrlAction: {
            GetList: '/WorkerLevel/GetList',
            Save: '/WorkerLevel/Save',
            Delete: '/WorkerLevel/Delete',
        },
        Element: {
            Jtable: 'jtableWorkersLevel',
            Popup: 'popup_WorkersLevel',
            PopupSearch: 'popup_SearchWorkersLevel'
        },
        Data: {
            Model: {},
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
        InitPopupSearch();
        BindData(null);
    }


    var RegisterEvent = function () {
        $("#wlIsPrivate").kendoMobileSwitch({
            onLabel: "Tất cả",
            offLabel: "Nội bộ"
        });
        $('#' + Global.Element.Popup).on('shown.bs.modal', function () {
            $('div.divParent').attr('currentPoppup', Global.Element.Popup.toUpperCase());
        });
        $('#' + Global.Element.PopupSearch).on('shown.bs.modal', function () {
            $('div.divParent').attr('currentPoppup', Global.Element.PopupSearch.toUpperCase());
        });
    }
    function InitViewModel(WorkersLevel) {
        var switchInstance = $("#wlIsPrivate").data("kendoMobileSwitch");
        var WorkersLevelViewModel = {
            Id: 0,
            Coefficient: 0,
            Name: '',
            CompanyId: 0,
            Note: '',
            IsPrivate: false
        };
        switchInstance.check(true);
        if (WorkersLevel != null) {
            WorkersLevelViewModel = {
                Id: ko.observable(WorkersLevel.Id),
                Coefficient: ko.observable(WorkersLevel.Coefficient),
                Name: ko.observable(WorkersLevel.Name),
                CompanyId: ko.observable(WorkersLevel.CompanyId),
                Note: ko.observable(WorkersLevel.Note),
                IsPrivate: false
            };
            switchInstance.check(WorkersLevel.IsPrivate);
        }
        return WorkersLevelViewModel;
    }
    function BindData(WorkersLevel) {
        Global.Data.Model = InitViewModel(WorkersLevel);
        ko.applyBindings(Global.Data.Model, document.getElementById(Global.Element.Popup));
    }
    function Save() {
        var obj = {
            Id: $("#wlId").val(),
            Coefficient: parseFloat($('#wlCoefficient').val().trim()),
            Name: $("#wlName").val(),
            CompanyId: 0,
            Note: $("#wlNote").val(),
            IsPrivate: $("#wlIsPrivate").data("kendoMobileSwitch").check()
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
                        $("#wlId").val(0);
                        $('#wlCoefficient').val(0);
                        $("#wlName").val("");
                        $("#wlNote").val("");
                        var switchInstance = $("#wlIsPrivate").data("kendoMobileSwitch");
                        switchInstance.check(false);
                        if (!Global.Data.IsInsert)
                            $("#" + Global.Element.Popup + ' button[wlcancel]').click();
                        Global.Data.IsInsert = true;
                    }
                }, false, Global.Element.PopupWorkersLevel, true, true, function () {
                    var msg = GlobalCommon.GetErrorMessage(result);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình xử lý.");
                });
            }
        });
    }
    function InitList() {
        $('#' + Global.Element.Jtable).jtable({
            title: 'Danh sách Bậc Thợ',
            paging: true,
            pageSize: 1000,
            pageSizeChange: true,
            sorting: true,
            selectShow: true,
            actions: {
                listAction: Global.UrlAction.GetList,
                createAction: Global.Element.Popup,
                createObjDefault: InitViewModel(null),
                searchAction: Global.Element.PopupSearch,
            },
            messages: {
                addNewRecord: 'Thêm mới',
                searchRecord: 'Tìm kiếm',
                selectShow: 'Ẩn hiện cột'
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
                    title: "Tên Bậc thợ",
                    width: "20%",
                },
                Coefficient: {
                    title: "Hệ số",
                    width: "10%",
                },
                Note: {
                    title: "Ghi chú",
                    width: "20%",
                    sorting: false,
                },
                edit: {
                    title: '',
                    width: '1%',
                    sorting: false,
                    display: function (data) {
                        var text = $('<i data-toggle="modal" data-target="#' + Global.Element.Popup + '" title="Chỉnh sửa thông tin" class="fa fa-pencil-square-o clickable blue"  ></i>');
                        text.click(function () { 
                            $("#wlId").val(data.record.Id);
                            $('#wlCoefficient').val(data.record.Coefficient);
                            $("#wlName").val(data.record.Name);
                            $("#wlNote").val(data.record.Note);
                            var switchInstance = $("#wlIsPrivate").data("kendoMobileSwitch");
                            switchInstance.check(data.record.IsPrivate);
                            Global.Data.IsInsert = false;
                        });
                        return text;
                    }
                },
                Delete: {
                    title: ' ',
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
        $('#' + Global.Element.Jtable).jtable('load', { 'keyword': $('#wltxtSearch').val() });
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
                }, false, Global.Element.PopupWorkersLevel, true, true, function () {

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
        $("#" + Global.Element.Popup + ' button[wlsave]').click(function () {
            if (CheckValidate()) {
                Save();
            }
        });
        $("#" + Global.Element.Popup + ' button[wlcancel]').click(function () {
            $("#" + Global.Element.Popup).modal("hide");
            BindData(null);
            $('div.divParent').attr('currentPoppup', '');
        });
    }
    function InitPopupSearch() {
        $("#" + Global.Element.PopupSearch).modal({
            keyboard: false,
            show: false
        });
        $("#" + Global.Element.PopupSearch + ' button[wlsearch]').click(function () {
            ReloadList();
            $("#" + Global.Element.PopupSearch + ' button[wlclose]').click();

        });
        $("#" + Global.Element.PopupSearch + ' button[wlclose]').click(function () {
            $("#" + Global.Element.PopupSearch).modal("hide");
            $('#wltxtSearch').val('');
            $('div.divParent').attr('currentPoppup', '');
        });
    }

    function CheckValidate() {
        if ($('#wlName').val().trim() == "") {
            GlobalCommon.ShowMessageDialog("Vui lòng nhập Tên Bậc Thợ.", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        else if ($('#wlCoefficient').val().trim() == "") {
            GlobalCommon.ShowMessageDialog("Vui lòng nhập Hệ số Bậc Thợ.", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        else if (parseFloat($('#wlCoefficient').val().trim()) <= 0) {
            GlobalCommon.ShowMessageDialog("Hệ số Bậc Thợ phải lớn hơn 0.", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        return true;
    }
}

$(document).ready(function () {
    var WorkersLevel = new GPRO.WorkersLevel();
    WorkersLevel.Init();
})
