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
GPRO.namespace('PhaseGroup');
GPRO.PhaseGroup = function () {
    var Global = {
        UrlAction: {
            GetListPhaseGroup: '/PhaseGroup/Gets',
            SavePhaseGroup: '/PhaseGroup/Save',
            DeletePhaseGroup: '/PhaseGroup/Delete',
        },
        Element: {
            JtablePhaseGroup: 'Jtable-PhaseGroup',
            PopupPhaseGroup: 'popup_PhaseGroup',
            Search: 'pgSearch_Popup'
        },
        Data: {
            ModelPhaseGroup: {},
            IsInsert: true
        }
    }
    this.GetGlobal = function () {
        return Global;
    }

    this.Init = function () {
        _GetWorkshopSelect('pgworkshop');

    }

    this.reloadListPhaseGroup = function () {
        ReloadListPhaseGroup();
    }

    this.initViewModel = function (phaseGroup) {
        InitViewModel(phaseGroup);
    }

    this.bindData = function (phaseGroup) {
        BindData(phaseGroup);
    }

    var RegisterEvent = function () {
        $('#' + Global.Element.PopupPhaseGroup).on('shown.bs.modal', function () {
            $('div.divParent').attr('currentPoppup', Global.Element.PopupPhaseGroup.toUpperCase());
        });
        $('#' + Global.Element.Search).on('shown.bs.modal', function () {
            $('div.divParent').attr('currentPoppup', Global.Element.Search.toUpperCase());
        });

        $('[pgclose]').click(function () {
            $('#pgkeyword').val('');
            $('#pgsearchBy').val('1');
            $('div.divParent').attr('currentPoppup', '');
        });

        $('[pgsearch]').click(function () {
            ReloadList();
            $('[pgclose]').click();
        });
    }

    function InitViewModel(phaseGroup) {
        if (!phaseGroup) {
            $('#pgid').val(0);
            $('#pgcode').val('');
            $('#pgname').val('');
            $('#pgMinLevel').val(0);
            $('#pgMaxLevel').val(0);
            $('#pgdes').val('');
            $("#pgworkshop").data("kendoMultiSelect").value('');
        }
        else {
            $('#pgid').val(phaseGroup.Id);
            $('#pgcode').val(phaseGroup.Code);
            $('#pgname').val(phaseGroup.Name);
            $('#pgMinLevel').val(phaseGroup.MinLevel);
            $('#pgMaxLevel').val(phaseGroup.MaxLevel);
            $('#pgdes').val(phaseGroup.Description);
            if (phaseGroup.intWorkshopIds != null)
                $("#pgworkshop").data("kendoMultiSelect").value(phaseGroup.intWorkshopIds);
            else
                $("#pgworkshop").data("kendoMultiSelect").value('');
        }
        return phaseGroup;
    }

    function BindData(phaseGroup) {
        Global.Data.ModelPhaseGroup = InitViewModel(phaseGroup);
        //  ko.applyBindings(Global.Data.ModelPhaseGroup, document.getElementById(Global.Element.PopupPhaseGroup));
    }

    function InitList() {
        $('#' + Global.Element.JtablePhaseGroup).jtable({
            title: 'Danh Sách cụm công đoạn',
            paging: true,
            pageSize: 1000,
            pageSizeChange: true,
            sorting: true,
            selectShow: true,
            actions: {
                listAction: Global.UrlAction.GetListPhaseGroup,
                createAction: Global.Element.PopupPhaseGroup,
                createObjDefault: InitViewModel(null),
                searchAction: Global.Element.Search,
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
                //Code: {
                //    title: "Mã cụm công đoạn",
                //    width: "5%",
                //},
                Name: {
                    visibility: 'fixed',
                    title: "Tên cụm công đoạn",
                    width: "15%",
                },
                MinLevel: {
                    title: "Cấp độ Nhỏ Nhất",
                    width: "5%",
                    display: function (data) {
                        txt = '<span class="red bold">' + data.record.MinLevel + '</span>';
                        return txt;
                    }
                },
                MaxLevel: {
                    title: "Cấp độ Lớn Nhất",
                    width: "5%",
                    display: function (data) {
                        txt = '<span class="red bold">' + data.record.MaxLevel + '</span>';
                        return txt;
                    }
                },
                Description: {
                    title: "Mô Tả",
                    width: "20%",
                    sorting: false
                },
                edit: {
                    title: '',
                    width: '1%',
                    sorting: false,
                    display: function (data) {
                        var text = $('<i data-toggle="modal" data-target="#' + Global.Element.PopupPhaseGroup + '" title="Chỉnh sửa thông tin" class="fa fa-pencil-square-o clickable blue"  ></i>');
                        text.click(function () {
                            BindData(data.record);
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
        var keySearch = $('#pgkeyword').val();
        var searchBy = $('#pgsearchBy').val();
        $('#' + Global.Element.JtablePhaseGroup).jtable('load', { 'keyword': keySearch, 'searchBy': searchBy });
    }

    function SavePhaseGroup() {
        var obj = {
            Id: $('#pgid').val(),
            Name: $('#pgname').val(),
            Code: $('#pgcode').val(),
            MinLevel: $('#pgMinLevel').val(),
            MaxLevel: $('#pgMaxLevel').val(),
            Description: $('#pgdes').val(),
            WorkshopIds: $('#pgworkshop').data("kendoMultiSelect").value().toString()
        };
        $.ajax({
            url: Global.UrlAction.SavePhaseGroup,
            type: 'post',
            data: ko.toJSON(obj),
            contentType: 'application/json',
            beforeSend: function () { $('#loading').show(); },
            success: function (result) {
                $('#loading').hide();
                GlobalCommon.CallbackProcess(result, function () {
                    if (result.Result == "OK") {
                        ReloadList();
                        BindData(null);
                        if (!Global.Data.IsInsert) {
                            $("#" + Global.Element.PopupPhaseGroup + ' button[pgcancel]').click();
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
            url: Global.UrlAction.DeletePhaseGroup,
            type: 'POST',
            data: JSON.stringify({ 'Id': Id }),
            contentType: 'application/json charset=utf-8',
            success: function (data) {
                GlobalCommon.CallbackProcess(data, function () {
                    if (data.Result == "OK") {
                        ReloadList();
                    }
                    else
                        GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình xử lý.");
                }, false, Global.Element.PopupPhaseGroup, true, true, function () {

                    var msg = GlobalCommon.GetErrorMessage(data);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
                });
            }
        });
    }

    function CheckValidate() {
        if ($('#pgname').val().trim() == "") {
            GlobalCommon.ShowMessageDialog("Vui lòng nhập Tên .", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        else if ($('#pgMinLevel').val().trim() == '') {
            GlobalCommon.ShowMessageDialog("Vui lòng Nhập Chỉ số Nhỏ Nhất.", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        else if ($('#pgMaxLevel').val().trim == '') {
            GlobalCommon.ShowMessageDialog("Vui lòng nhập chỉ số Lớn Nhất.", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        else if (parseFloat($('#pgMinLevel').val()) > parseFloat($('#pgMaxLevel').val())) {
            GlobalCommon.ShowMessageDialog("Chỉ số Nhỏ nhất không được lớn hơn Chỉ Số Lớn Nhất.", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        return true;
    }

    function InitPopup() {
        $('#' + Global.Element.PopupPhaseGroup + ' button[pgsave]').click(function () {
            if (CheckValidate())
                SavePhaseGroup();
        });

        $('#' + Global.Element.PopupPhaseGroup + ' button[pgcancel]').click(function () {
            $("#" + Global.Element.PopupPhaseGroup).modal("hide");
            BindData(null);
        });
    }

    function _GetWorkshopSelect(controlName) {
        $.ajax({
            url: '/Workshop/GetSelect',
            type: 'POST',
            data: '',
            contentType: 'application/json charset=utf-8',
            success: function (data) {
                GlobalCommon.CallbackProcess(data, function () {
                    if (data.Result == "OK") {
                        if (data.Data.length > 0) {
                            var str = '';
                            if (data.Data.length > 0) {
                                $.each(data.Data, function (index, item) {
                                    str += ' <option value="' + item.Value + '">' + item.Name + '</option>';
                                });
                            }
                            $('#' + controlName).empty().append(str);
                            $('#' + controlName).kendoMultiSelect().data("kendoMultiSelect");
                        }
                    }
                    RegisterEvent();
                    InitList();
                    ReloadList();
                    InitPopup();
                    BindData(null);
                }, false, '', true, true, function () {
                    var msg = GlobalCommon.GetErrorMessage(data);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
                    RegisterEvent();
                    InitList();
                    ReloadList();
                    InitPopup();
                    BindData(null);
                });
            }
        });
    }

}

$(document).ready(function () {

    var PhaseGroup = new GPRO.PhaseGroup();
    PhaseGroup.Init();

})