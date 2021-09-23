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
GPRO.namespace('EGroup');
GPRO.EGroup = function () {
    var Global = {
        UrlAction: {
            GetListEGroup: '/EquipmentGroup/Gets',
            SaveEGroup: '/EquipmentGroup/Save',
            DeleteEGroup: '/EquipmentGroup/Delete',

            GetListEquipment: '/Equipment/Gets',
            AddGroupEquipment: '/Equipment/AddGroupEquipment',
        },
        Element: {
            JtableEGroup: 'jtable_E_Group',
            PopupEGroup: 'popup_E_Group',
            PopupSearch: 'egpopup_Search',

            JtableEquipment: 'jtableEquipment',
            PopupAddE: 'popup_E', 
        },
        Data: {
            ModelEGroup: {},
            EquipmentIds: [],
            E_GroupId: 0,
            IsInsert: true
        }
    }
    this.GetGlobal = function () {
        return Global;
    }

    this.Init = function () {
        RegisterEvent();
        InitList ();
        ReloadList ();
        InitList_();
        InitPopup();
    }

    var RegisterEvent = function () {
        $('#' + Global.Element.PopupEGroup).on('shown.bs.modal', function () {
            $('div.divParent').attr('currentPoppup', Global.Element.PopupEGroup.toUpperCase());
        });
        $('#' + Global.Element.PopupSearch).on('shown.bs.modal', function () {
            $('div.divParent').attr('currentPoppup', Global.Element.PopupSearch.toUpperCase());
        });

        //search
        $('[egclose]').click(function () {
            $('#egkeyword').val('');
            $('#egsearchBy').val('1'); 
            $('div.divParent').attr('currentPoppup', '');
        });

        $('[egsearch]').click(function () {
            ReloadList();
            $('[egclose]').click(); 
        });

        // gom nhóm
        $('[addgroup]').click(function () {
            var $selectedRows = $('#' + Global.Element.JtableEquipment).jtable('selectedRows');
            if ($selectedRows.length > 0) {
                var successCount = 0;
                var flag = false;
                //Show selected rows
                $selectedRows.each(function () {
                    var record = $(this).data('record');
                    Global.Data.EquipmentIds.push(record.Id);
                });
                if (Global.Data.EquipmentIds.length > 0) {
                    AddGroupEquipment();
                }
            }
            else {
                GlobalCommon.ShowMessageDialog("Không có Công Đoạn nào được chọn. Vui lòng kiểm tra lại.!", function () { }, "Thông báo Chưa chọn Công Đoạn");
            }
        });
    }

    /**********************************************************************************************************************
                                                             
    ***********************************************************************************************************************/
    this.reloadListEGroup = function () {
        ReloadListEGroup();
    }

    this.initViewModel = function (EGroup) {
        InitViewModel(EGroup);
    }

    this.bindData = function (EGroup) {
        BindData(EGroup);
    }

    function InitEGroupViewModel(EGroup) {
        var EGroupViewModel = {
            Id: 0,
            GroupName: '',
            GroupCode: '',
            Icon: '',
            Note: ''
        };
        if (EGroup != null) {
            EGroupViewModel = {
                Id: ko.observable(EGroup.Id),
                GroupName: ko.observable(EGroup.GroupName),
                GroupCode: ko.observable(EGroup.GroupCode),
                Icon: ko.observable(EGroup.Icon),
                Note: ko.observable(EGroup.Note),
            };
        }
        return EGroupViewModel;
    }

    function BindEGroupData(EGroup) {
        Global.Data.ModelEGroup = InitEGroupViewModel(EGroup);
        ko.applyBindings(Global.Data.ModelEGroup, document.getElementById(Global.Element.PopupEGroup));
    }

    function InitList () {
        $('#' + Global.Element.JtableEGroup).jtable({
            title: 'Danh Sách Nhóm Thiết Bị',
            paging: true,
            pageSize: 1000,
            pageSizeChange : true,
            sorting: true,
            selectShow: true,
            actions: {
                listAction: Global.UrlAction.GetListEGroup,
                createAction: Global.Element.PopupEGroup,
                createObjDefault: BindEGroupData(null),
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
                GroupCode: {
                    title: "Mã Nhóm TB",
                    width: "5%",
                },
                GroupName: {
                    visibility: 'fixed',
                    title: "Tên Nhóm TB",
                    width: "20%", 
                },
                Note: {
                    title: "Mô Tả Nhóm TB",
                    width: "20%",
                    sorting: false,
                },
                Group: {
                    visibility: 'fixed',
                    title: "chọn TB",
                    width: "20%",
                    sorting: false,
                    display: function (data) {
                        var text = $('<a class="clickable" data-toggle="modal" data-target="#' + Global.Element.PopupAddE + '" title="Chỉnh sửa thông tin">Chọn TB</a>');
                        text.click(function () {
                            ReloadList_();
                            Global.Data.E_GroupId = data.record.Id;
                        });
                        return text;
                    }
                },
                edit: {
                    title: '',
                    width: '1%',
                    sorting: false,
                    display: function (data) {
                        var text = $('<i data-toggle="modal" data-target="#' + Global.Element.PopupEGroup + '" title="Chỉnh sửa thông tin" class="fa fa-pencil-square-o clickable blue"  ></i>');
                        text.click(function () {
                            BindEGroupData(data.record);
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
                                DeleteEGroup(data.record.Id);
                            }, function () { }, 'Đồng ý', 'Hủy bỏ', 'Thông báo');
                        });
                        return text;

                    }
                }
            }
        });
    }

    function ReloadList () {
        $('#' + Global.Element.JtableEGroup).jtable('load', { 'keyword': $('#egkeyword').val(), 'searchBy': $('#egsearchBy').val() });
    }

    function SaveEGroup() { 
        $.ajax({
            url: Global.UrlAction.SaveEGroup,
            type: 'post',
            data: ko.toJSON(Global.Data.ModelEGroup),
            contentType: 'application/json',
            beforeSend: function () { $('#loading').show(); },
            success: function (result) {
                $('#loading').hide();
                GlobalCommon.CallbackProcess(result, function () {
                    if (result.Result == "OK") {
                        ReloadList(); 
                        BindEGroupData(null);
                        if (!Global.Data.IsInsert) {
                            $("#" + Global.Element.PopupEGroup + ' button[egcancel]').click();
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

    function DeleteEGroup(Id) {
        $.ajax({
            url: Global.UrlAction.DeleteEGroup,
            type: 'POST',
            data: JSON.stringify({ 'Id': Id }),
            contentType: 'application/json charset=utf-8',
            success: function (data) {
                GlobalCommon.CallbackProcess(data, function () {
                    if (data.Result == "OK") {
                        ReloadList();
                        BindEGroupData(null);
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

    function CheckEGroupValidate() {
        if ($('#egname').val().trim() == "") {
            GlobalCommon.ShowMessageDialog("Vui lòng nhập Tên Nhóm Thiết Bị .", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        return true;
    }

    function InitPopup() {
        $("#" + Global.Element.PopupEGroup).modal({
            keyboard: false,
            show: false
        });
        $("#" + Global.Element.PopupEGroup + ' button[egsave]').click(function () {
             if (CheckEGroupValidate()) { 
                    SaveEGroup(); 
            }
        });
        $("#" + Global.Element.PopupEGroup + ' button[egcancel]').click(function () {
            $("#" + Global.Element.PopupEGroup).modal("hide");
            BindEGroupData(null);
        });
    }

    /*************************************************/
    function InitList_() {
        $('#' + Global.Element.JtableEquipment).jtable({
            title: 'Danh sách Thiết Bị',
            paging: true,
            pageSize: 1000,
            pageSizeChange: true,
            sorting: true,
            selectShow: true,
            selecting: true, //Enable selecting
            multiselect: true, //Allow multiple selecting
            selectingCheckboxes: true, //Show checkboxes on first column
            actions: {
                listAction: Global.UrlAction.GetListEquipment,
                //searchAction: Global.Element.PopupSearch,
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
                    title: "Tên Thiết Bị",
                    width: "20%",
                },
                Code: {
                    title: "Mã Thiết Bị",
                    width: "5%",
                },
                EquipmentTypeName: {
                    title: "Loại Thiết Bị",
                    width: "10%",
                    display: function (data) {
                        txt = '<span class="red">' + data.record.EquipmentTypeName + '</span>';
                        return txt;
                    }
                },
                EGroupName: {
                    title: "Nhóm Thiết Bị",
                    width: "10%",
                    display: function (data) {
                        txt = '<span class="red">' + data.record.EGroupName + '</span>';
                        return txt;
                    }
                },
                Description: {
                    title: "Mô Tả Thiết Bị",
                    width: "20%",
                    sorting: false,
                }
            }
        });
    }

    function ReloadList_() {
        $('#' + Global.Element.JtableEquipment).jtable('load', { 'keyword': '', 'searchBy': 0 });
        //  $('#' + Global.Element.PopupSearch).modal('hide');
    }

    function AddGroupEquipment() {
        $.ajax({
            url: Global.UrlAction.AddGroupEquipment,
            type: 'POST',
            data: JSON.stringify({ 'E_Ids': Global.Data.EquipmentIds, 'EGroupId': Global.Data.E_GroupId }),
            contentType: 'application/json charset=utf-8',
            success: function (data) {
                GlobalCommon.CallbackProcess(data, function () {
                    if (data.Result == "OK") {
                        GlobalCommon.ShowMessageDialog('Lưu Thành Công.', function () { }, "Thông Báo");
                        Global.Data.EquipmentIds.length = 0;
                        $('#' + Global.Element.PopupAddE).modal('hide');
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
}

$(document).ready(function () {
    var EGroup = new GPRO.EGroup();
    EGroup.Init();
});