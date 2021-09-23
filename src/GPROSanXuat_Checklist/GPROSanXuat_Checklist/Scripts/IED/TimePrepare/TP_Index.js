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
GPRO.namespace('TimePrepare');
GPRO.TimePrepare = function () {
    var Global = {
        UrlAction: {
            GetList_: '/TimePrepare/Gets?timeTypeId=',
            Save_: '/TimePrepare/Save',
            Delete_: '/TimePrepare/Delete',

            GetList: '/TimePrepare/Gets_',
            Save: '/TimePrepare/Save_',
            Delete: '/TimePrepare/Delete_',
        },
        Element: {
            Jtable_: 'jtable-TimePrepare',
            Popup_: 'popup_TimePrepare',

            Jtable: 'jtable-TimeTypePrepare',
            Popup: 'popup_TimeTypePrepare',
            PopupSearch: 'popup_TimeTypePrepare-search',
        },
        Data: {
            Model: {},
            Model_: {},
            ParentId: 0,
            IsInsert:true
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
        InitPopup_();
        GetTimeTypePrepareSelect('tptimeTypeId');
    }

    var RegisterEvent = function () {
        $("#timetypeisPublic").kendoMobileSwitch({
            onLabel: "Tất cả",
            offLabel: "Nội bộ"
        });
        $('[reType]').click(function () {
            GetTimeTypePrepareSelect('tptimeTypeId');
        });

        //search
        $('[closetype]').click(function () { 
            $('#tpsearchBy').val('1'); 
            $('div.divParent').attr('currentPoppup', '');
        });

        $('[searchtype]').click(function () { 
                ReloadList();
                $('[closetype]').click();
                $('#tpkeyword').val('');
        });
        $('#' + Global.Element.Popup).on('shown.bs.modal', function () {
            $('div.divParent').attr('currentPoppup', Global.Element.Popup.toUpperCase());
        });
        $('#' + Global.Element.PopupSearch).on('shown.bs.modal', function () {
            $('div.divParent').attr('currentPoppup', Global.Element.PopupSearch.toUpperCase());
        });
    }

    /**********************************************************************************************************************
                                                        TIME TYPE PREPARE
    ***********************************************************************************************************************/
    function InitModel(timeTypePrepare) {
        var switchInstance = $("#timetypeisPublic").data("kendoMobileSwitch");
        var timeTypePrepareViewModel = {
            Id: 0,
            Name: '',
            Code: '',
            IsPublic: false,
            Description: ''
        };
        switchInstance.check(false);
        if (timeTypePrepare != null) {
            timeTypePrepareViewModel = {
                Id: ko.observable(timeTypePrepare.Id),
                Name: ko.observable(timeTypePrepare.Name),
                Code: ko.observable(timeTypePrepare.Code),
                IsPublic: ko.observable(timeTypePrepare.IsPublic),
                Description: ko.observable(timeTypePrepare.Description),
            };
            switchInstance.check(timeTypePrepare.IsPublic);
        }
        return timeTypePrepareViewModel;
    }

    function BindData(timeTypePrepare) {
        Global.Data.Model = InitModel(timeTypePrepare);
        ko.applyBindings(Global.Data.Model, document.getElementById(Global.Element.Popup));
    }

    function InitList() {
        $('#' + Global.Element.Jtable).jtable({
            title: 'Danh Sách Loại Thời Gian Chuẩn Bị',
            paging: true,
            pageSize: 1000,
            pageSizeChange: true,
            sorting: true,
            selectShow: true,
            actions: {
                listAction: Global.UrlAction.GetList,
                createAction: Global.Element.Popup,
                createObjDefault: BindData(null),
                searchAction: Global.Element.PopupSearch,
            },
            messages: {
                addNewRecord: 'Thêm mới',
                searchRecord: 'Tìm kiếm',
                selectShow: 'Ẩn hiện cột'
            },
            rowInserted: function (event, data) {
                if (data.record.Id == Global.Data.ParentId) {
                    var $a = $('#' + Global.Element.Jtable).jtable('getRowByKey', data.record.Id);
                    $($a.children().find('.aaa')).click();
                }
            },
            datas: {
                jtableId: Global.Element.Jtable
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
                    title: "Tên ",
                    width: "20%",
                },
                //Code: {
                //    title: "Mã",
                //    width: "5%",
                //},
                IsPublic: {
                    title: "Sử dụng Chung",
                    width: "5%",
                    display: function (data) {
                        txt = '';
                        if (data.record.IsPublic)
                            txt = '<input type=\'checkbox\' disabled checked /> ';
                        else
                            txt = '<input type=\'checkbox\' disabled  /> ';
                        return txt;
                    }
                },

                Description: {
                    title: "Mô Tả",
                    width: "20%",
                    sorting: false
                },
                Detail: {
                    title: 'DS thời gian chuẩn bị',
                    width: '3%',
                    sorting: false,
                    edit: false,
                    display: function (parent) {
                        var $img = $('<i class="fa fa-list-ol clickable red aaa" title="Click Xem Danh sách thời gian chuẩn bị ' + parent.record.Name + '"></i>');
                        $img.click(function () {
                            Global.Data.ParentId = parent.record.Id;
                            $('#' + Global.Element.Jtable).jtable('openChildTable',
                                    $img.closest('tr'),
                                    {
                                        title: '<span class="red">Danh sách thời gian chuẩn bị thuộc loại : ' + parent.record.Name + '</span>',
                                        paging: true,
                                        pageSize: 1000,
                                        pageSizeChange: true,
                                        sorting: true,
                                        selectShow: true,
                                        actions: {
                                            listAction: Global.UrlAction.GetList_ + '' + parent.record.Id,
                                            createAction: Global.Element.Popup_,
                                            createObjDefault: BindData_(null),
                                        },
                                        messages: {
                                            addNewRecord: 'Thêm mới',
                                            selectShow: 'Ẩn hiện cột'
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
                                                title: "Tên ",
                                                width: "20%",
                                            },
                                            //Code: {
                                            //    title: "Mã",
                                            //    width: "5%",
                                            //}, 
                                            TMUNumber: {
                                                title: "Chỉ số TMU",
                                                width: "20%",
                                                display: function (data) {
                                                    txt = ParseStringToCurrency(data.record.TMUNumber);
                                                    return txt;
                                                }
                                            },
                                            Description: {
                                                title: "Mô Tả",
                                                sorting: false,
                                                width: "20%"
                                            },
                                            edit: {
                                                title: '',
                                                width: '1%',
                                                sorting: false,
                                                display: function (data) {
                                                    var text = $('<i data-toggle="modal" data-target="#' + Global.Element.Popup_ + '" title="Chỉnh sửa thông tin" class="fa fa_tb fa-pencil-square-o clickable blue"  ></i>');
                                                    text.click(function () {
                                                        BindData_(data.record);
                                                        $('#tptimeTypeId').val(data.record.TimeTypePrepareId);
                                                        $('#tpTMU').val(data.record.TMUNumber);
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
                                                            Delete_(data.record.Id);
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
                            BindData(data.record);
                            if (data.record.IsPublic)
                                $('#timetypeisPublic').bootstrapToggle('on');
                            else
                                $('#timetypeisPublic').bootstrapToggle('off');

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
        var keySearch = $('#tpkeyword').val();
        var searchBy = $('#tpsearchBy').val();
        $('#' + Global.Element.Jtable).jtable('load', { 'keyword': keySearch, 'searchBy': parseInt(searchBy) });
    }

    function Save() {
        Global.Data.Model.IsPublic =$("#timetypeisPublic").data("kendoMobileSwitch").check();
        $.ajax({
            url: Global.UrlAction.Save,
            type: 'post',
            data: ko.toJSON(Global.Data.Model),
            contentType: 'application/json',
            beforeSend: function () { $('#loading').show(); },
            success: function (result) {
                $('#loading').hide();
                GlobalCommon.CallbackProcess(result, function () {
                    if (result.Result == "OK") {
                        ReloadList();
                        BindData(null);
                        GetTimeTypePrepareSelect('tptimeTypeId');
                        if (!Global.Data.IsInsert)
                            $("#" + Global.Element.Popup + ' button[cancel-type]').click();
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
            success: function (data) {
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

    function CheckValidate() {
        if ($('#name-timetype').val().trim() == "") {
            GlobalCommon.ShowMessageDialog("Vui lòng nhập Tên Loại Thời Gian .", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        return true;
    }

    function InitPopup() {
        $("#" + Global.Element.Popup).modal({
            keyboard: false,
            show: false
        });
        $("#" + Global.Element.Popup + ' button[save-type]').click(function () {
            if (CheckValidate()) {
                Save();
            }
        });
        $("#" + Global.Element.Popup + ' button[cancel-type]').click(function () {
            $("#" + Global.Element.Popup).modal("hide");
            BindData(null);
            $('div.divParent').attr('currentPoppup', '');
        });
    }
     
    /**********************************************************************************************************************
                                                            TIME PREPARE
    ***********************************************************************************************************************/

    function InitModel_(timePrepare) {
        var timePrepareViewModel = {
            Id: 0,
            Name: '',
            Code: '',
            TimeTypePrepareId: 0,
            TMUNumber: 0,
            Description: ''
        };
        if (timePrepare != null) {
            timePrepareViewModel = {
                Id: ko.observable(timePrepare.Id),
                Name: ko.observable(timePrepare.Name),
                Code: ko.observable(timePrepare.Code),
                TimeTypePrepareId: ko.observable(timePrepare.TimeTypePrepareId),
                TMUNumber: ko.observable(timePrepare.TMUNumber),
                Description: ko.observable(timePrepare.Description),
            };
        }
        return timePrepareViewModel;
    }

    function BindData_(timePrepare) {
        Global.Data.Model_ = InitModel_(timePrepare);
        ko.applyBindings(Global.Data.Model_, document.getElementById(Global.Element.Popup_));
    }

    function Save_() {
        Global.Data.Model_.TimeTypePrepareId = $('#tptimeTypeId').val();
        Global.Data.Model_.TMUNumber = parseFloat($('#tpTMU').val())
        $.ajax({
            url: Global.UrlAction.Save_,
            type: 'post',
            data: ko.toJSON(Global.Data.Model_),
            contentType: 'application/json',
            beforeSend: function () { $('#loading').show(); },
            success: function (result) {
                $('#loading').hide();
                GlobalCommon.CallbackProcess(result, function () {
                    if (result.Result == "OK") {
                        ReloadList();
                        BindData_(null);
                        if (!Global.Data.IsInsert)
                            $("#" + Global.Element.Popup_ + ' button[cancel-time]').click();
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

    function Delete_(Id) {
        $.ajax({
            url: Global.UrlAction.Delete_,
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
                }, false, Global.Element.PopupSize, true, true, function () {

                    var msg = GlobalCommon.GetErrorMessage(data);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
                });
            }
        });
    }

    function CheckValidate_() {
        if ($('#name-time').val().trim() == "") {
            GlobalCommon.ShowMessageDialog("Vui lòng nhập Tên .", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        if ($('#tptimeTypeId').val() == "0") {
            GlobalCommon.ShowMessageDialog("Vui lòng chọn Loại Thời Gian .", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        if ($('#tpTMU').val().trim() == "") {
            GlobalCommon.ShowMessageDialog("Vui lòng nhập chỉ số TMU .", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        return true;
    }

    function InitPopup_() {
        $("#" + Global.Element.Popup_).modal({
            keyboard: false,
            show: false
        });
        $("#" + Global.Element.Popup_ + ' button[save-time]').click(function () {
            if (CheckValidate_())
                Save_();
        });
        $("#" + Global.Element.Popup_ + ' button[cancel-time]').click(function () {
            $("#" + Global.Element.Popup_).modal("hide");
            BindData_(null);
        });
    }

}

$(document).ready(function () {
    var TimePrepare = new GPRO.TimePrepare();
    TimePrepare.Init();
})