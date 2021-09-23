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
GPRO.namespace('EquipmentType');
GPRO.EquipmentType = function () {
    var Global = {
        UrlAction: {
            GetListEquipmentType: '/EquipmentType/Gets',
            SaveEquipmentType: '/EquipmentType/Save',
            DeleteEquipmentType: '/EquipmentType/Delete',
            CheckDelete: '/EquipmentType/CheckDelete',

            GetListEquipmentTypeAttribute: '/EquipmentType/GetETypeAttr',
            SaveEquipmentTypeAttribute: '/EquipmentType/SaveETypeAttr',
            DeleteEquipmentTypeAttribute: '/EquipmentType/DeleteETypeAttr',
        },
        Element: {
            JtableEquipmentType: 'jtableEquipmentType',
            PopupEquipmentType: 'popup_EquipmentType',
            PopupSearch: 'popup_SearchEquipmentType',

            popup_attr: 'popup_EquipmentTypeAttribute',
        },
        Data: {
            ModelEquipmentType: {},
            EquipmentTypeId: 0,
            ModelEquipmentTypeAttribute: {}
        }
    }
    this.GetGlobal = function () {
        return Global;
    }

    this.Init = function () {
        RegisterEvent();
        InitListEquipmentType();
        ReloadListEquipmentType();
        BindData(null);
        InitPopupSearch();
    }

    this.reloadListEquipmentType = function () {
        ReloadListEquipmentType();
    }

    this.initViewModel = function (EquipmentType) {
        InitViewModel(EquipmentType);
    }

    this.bindData = function (EquipmentType) {
        BindData(EquipmentType);
    }

    var RegisterEvent = function () {
        $("#eIsUseForTime").kendoMobileSwitch({
            onLabel: "Có",
            offLabel: "Không"
        });
        $('#' + Global.Element.PopupEquipmentType).on('shown.bs.modal', function () {
            $('div.divParent').attr('currentPoppup', Global.Element.PopupEquipmentType.toUpperCase());
        });
        $('#' + Global.Element.PopupSearch).on('shown.bs.modal', function () {
            $('div.divParent').attr('currentPoppup', Global.Element.PopupSearch.toUpperCase());
        });

        $('[etcancel]').click(function () {
            BindData(null);
            $('#eType_default').val('0')
            $('#eType_default').prop('disabled', false);
            $('div.divParent').attr('currentPoppup', '');
        });

        $('[etsave]').click(function () {
            if (CheckValidate()) {
                SaveEquipmentType();
            }
        });

        $('[etsearch]').click(function () {
            ReloadListEquipmentType();
        })
        //attr
        $('[cancel_attr]').click(function () {
            BindData_Attr(null);
            $('#etName_attr').prop('disabled', false);
            $('#etindex').prop('disabled', false);
        });

        $('[save_attr]').click(function () {
            if (CheckValidate_Attr()) {
                SaveEquipmentTypeAttribute();
            }
        });
    }

    /********************************************************************************************************************        
    *                                                    EQUIPMENT TYPE  
    ********************************************************************************************************************/
    function InitViewModel(EquipmentType) {

        var EquipmentTypeViewModel = {
            Id: 0,
            Code: '',
            Name: '',
            CompanyID: 0,
            Description: '',
            IsDefault: false,
            EquipTypeDefaultId: null
        };

        if (EquipmentType != null) {
            EquipmentTypeViewModel = {
                Id: ko.observable(EquipmentType.Id),
                Code: ko.observable(EquipmentType.Code),
                Name: ko.observable(EquipmentType.Name),
                CompanyID: ko.observable(EquipmentType.CompanyID),
                IsDefault: ko.observable(EquipmentType.IsDefault),
                Description: ko.observable(EquipmentType.Description),
                EquipTypeDefaultId: ko.observable(EquipmentType.EquipTypeDefaultId),
            };

        }
        return EquipmentTypeViewModel;
    }
    function BindData(EquipmentType) {
        Global.Data.ModelEquipmentType = InitViewModel(EquipmentType);
        ko.applyBindings(Global.Data.ModelEquipmentType, document.getElementById(Global.Element.PopupEquipmentType));
    }
    function SaveEquipmentType() {
        if ($('#eType_default').val() != '0') {
            Global.Data.ModelEquipmentType.EquipTypeDefaultId = $('#eType_default').val();
        }
        $.ajax({
            url: Global.UrlAction.SaveEquipmentType,
            type: 'post',
            data: ko.toJSON(Global.Data.ModelEquipmentType),
            contentType: 'application/json',
            beforeSend: function () { $('#loading').show(); },
            success: function (result) {
                $('#loading').hide();
                GlobalCommon.CallbackProcess(result, function () {
                    if (result.Result == "OK") {
                        $('[etcancel]').click();
                        ReloadListEquipmentType();
                    }
                }, false, Global.Element.PopupEquipmentType, true, true, function () {
                    var msg = GlobalCommon.GetErrorMessage(result);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình xử lý.");
                });
            }
        });
    }
    function InitListEquipmentType() {
        $('#' + Global.Element.JtableEquipmentType).jtable({
            title: 'Danh sách Bộ phận',
            paging: true,
            pageSize: 1000,
            pageSizeChange: true,
            sorting: true,
            selectShow: true,
            actions: {
                listAction: Global.UrlAction.GetListEquipmentType,
                createAction: Global.Element.PopupEquipmentType,
                createObjDefault: InitViewModel(null),
                searchAction: Global.Element.PopupSearch,
            },
            messages: {
                addNewRecord: 'Thêm mới',
                searchRecord: 'Tìm kiếm',
                selectShow: 'Ẩn hiện cột'
            },
            datas: {
                jtableId: Global.Element.JtableEquipmentType
            },
            rowInserted: function (event, data) {
                if (data.record.Id == Global.Data.EquipmentTypeId) {
                    var $a = $('#' + Global.Element.JtableEquipmentType).jtable('getRowByKey', data.record.Id);
                    $($a.children().find('.aaa')).click();
                }
            },
            fields: {
                Id: {
                    key: true,
                    create: false,
                    edit: false,
                    list: false
                },
                //Code: {
                //    title: "Mã Bộ phận",
                //    width: "10%",
                //},
                Name: {
                    visibility: 'fixed',
                    title: "Tên Bộ phận",
                    width: "20%",
                },
                AddAtribute: {
                    visibility: 'fixed',
                    title: "Thuộc Tính Bộ phận",
                    width: "20%",
                    sorting: false,
                    display: function (eqip) {
                        var $img = $('<a href="#" class="clickable red aaa"   title="Thêm Thuộc Tính Bộ phận.">Xem Thuộc Tính Bộ phận</a>');
                        $img.click(function () {
                            Global.Data.EquipmentTypeId = eqip.record.Id;
                            $('#' + Global.Element.JtableEquipmentType).jtable('openChildTable',
                                $img.closest('tr'),
                                {
                                    title: 'Danh sách Thuộc Tính của Bộ phận : ' + eqip.record.Name,
                                    paging: true,
                                    pageSize: 1000,
                                    pageSizeChange: true,
                                    sorting: true,
                                    selectShow: true,
                                    actions: {
                                        listAction: Global.UrlAction.GetListEquipmentTypeAttribute + '?equipId=' + eqip.record.Id,
                                        createAction: Global.Element.popup_attr,
                                        createObjDefault: BindData_Attr(null),
                                    },
                                    messages: {
                                        addNewRecord: 'Thêm mới',
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
                                            title: "Tên Thuộc Tính",
                                            width: "20%",
                                            display: function (data) {
                                                var text = $('<a class="clickable bold blue" data-toggle="modal" data-target="#' + Global.Element.popup_attr + '" title="Chỉnh sửa thông tin.">' + data.record.Name + '</a>');
                                                text.click(function () {
                                                    BindData_Attr(data.record);
                                                    if (data.record.IsDefault) {
                                                        $('#Name_attr').prop('disabled', true);
                                                        $('#index').prop('disabled', true);
                                                    }
                                                });
                                                return text;
                                            }
                                        },
                                        OrderIndex: {
                                            title: "Thứ Tự Sắp Xếp",
                                            width: "3%",
                                        },
                                        EquipmentTypeName: {
                                            title: "Bộ phận",
                                            width: "20%",
                                        },
                                        //IsUseForTime: {
                                        //    title: "IsUseForTime",
                                        //    width: "5%",
                                        //    display: function (data) {
                                        //        var elementDisplay = "";
                                        //        if (data.record.IsUseForTime)
                                        //        { elementDisplay = "<input  type='checkbox' checked='checked' disabled/>"; }
                                        //        else {
                                        //            elementDisplay = "<input  type='checkbox' disabled />";
                                        //        }
                                        //        return elementDisplay;
                                        //    }
                                        //},
                                        Delete: {
                                            title: '',
                                            width: "3%",
                                            sorting: false,
                                            display: function (data) {
                                                var text = $('<button title="Xóa" class="jtable-command-button jtable-delete-command-button"><span>Xóa</span></button>');
                                                text.click(function () {
                                                    GlobalCommon.ShowConfirmDialog('Bạn có chắc chắn muốn xóa?', function () {
                                                        Delete_Atrr(data.record.Id);
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
                Description: {
                    title: "Mô Tả",
                    width: "20%",
                    sorting: false,
                },
                edit: {
                    title: '',
                    width: '1%',
                    sorting: false,
                    display: function (data) {
                        var text = $('<i data-toggle="modal" data-target="#' + Global.Element.PopupEquipmentType + '" title="Chỉnh sửa thông tin" class="fa fa-pencil-square-o clickable blue"  ></i>');
                        text.click(function () {
                            BindData(data.record);
                            if (data.record.EquipTypeDefaultId != null)
                                $('#eType_default').val(data.record.EquipTypeDefaultId);
                            else
                                $('#eType_default').val('0');

                            $('#eType_default').prop('disabled', true);
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
                                CheckDelete(data.record.Id);
                            }, function () { }, 'Đồng ý', 'Hủy bỏ', 'Thông báo');
                        });
                        return text;

                    }
                }
            }
        });
    }
    function ReloadListEquipmentType() {
        $('#' + Global.Element.JtableEquipmentType).jtable('load', { 'keyword': $('#etkeyword').val(), 'searchBy': $('#etsearchBy').val() });
        $('#' + Global.Element.PopupSearch).modal('hide');
    }
    function CheckDelete(Id) {
        $.ajax({
            url: Global.UrlAction.CheckDelete,
            type: 'POST',
            data: JSON.stringify({ 'Id': Id }),
            contentType: 'application/json charset=utf-8',
            beforeSend: function () { $('#loading').show(); },
            success: function (data) {
                $('#loading').hide();
                GlobalCommon.CallbackProcess(data, function () {
                    if (data.Result == "ERROR") {
                        GlobalCommon.ShowConfirmDialog('Đã Có Thiết Bị Tồn Tại Thuộc Tính Của Bộ phận Này.Bạn Có Muốn Xóa Tất Cả ?', function () {
                            Delete(Id);
                        }, function () { }, 'Đồng ý', 'Hủy bỏ', 'Thông báo');
                    }
                    else
                        Delete(Id);
                }, false, Global.Element.PopupEquipmentType, true, true, function () {
                    var msg = GlobalCommon.GetErrorMessage(data);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
                });

            }
        });
    }
    function Delete(Id) {
        $.ajax({
            url: Global.UrlAction.DeleteEquipmentType,
            type: 'POST',
            data: JSON.stringify({ 'Id': Id }),
            contentType: 'application/json charset=utf-8',
            beforeSend: function () { $('#loading').show(); },
            success: function (data) {
                $('#loading').hide();
                GlobalCommon.CallbackProcess(data, function () {
                    if (data.Result == "OK")
                        ReloadListEquipmentType();
                }, false, Global.Element.PopupEquipmentType, true, true, function () {
                    var msg = GlobalCommon.GetErrorMessage(data);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
                });
            }
        });
    }
    function CheckValidate() {
        if ($('#etName').val().trim() == "") {
            GlobalCommon.ShowMessageDialog("Vui lòng nhập Tên.", function () { }, "Lỗi Nhập liệu");
            $('#etName').focus();
            return false;
        }
        return true;
    }
    function InitPopupSearch() {
        $("#" + Global.Element.PopupSearch).modal({
            keyboard: false,
            show: false
        });
        $("#" + Global.Element.PopupSearch + ' button[etsearch]').click(function () {
            ReloadList();
            $("#" + Global.Element.PopupSearch + ' button[etclose]').click();

        });
        $("#" + Global.Element.PopupSearch + ' button[etclose]').click(function () {
            $("#" + Global.Element.PopupSearch).modal("hide");
            $('#etkeyword').val('');
            $('div.divParent').attr('currentPoppup', '');
        });
    }
    /********************************************************************************************************************        
    *                                                    EQUIPMENT TYPE  ATTRIBUTE
    ********************************************************************************************************************/
    function InitViewModel_Atrr(EquipmentTypeAttribute) {
        var switchInstance = $("#eIsUseForTime").data("kendoMobileSwitch");
        var EquipmentTypeAttributeViewModel = {
            Id: 0,
            Name: '',
            OrderIndex: '',
            EquipmentTypeId: 0,
            IsUseForTime: true,
            IsDefault: false
        }; switchInstance.check(false);
        if (EquipmentTypeAttribute != null) {
            EquipmentTypeAttributeViewModel = {
                Id: ko.observable(EquipmentTypeAttribute.Id),
                Name: ko.observable(EquipmentTypeAttribute.Name),
                OrderIndex: ko.observable(EquipmentTypeAttribute.OrderIndex),
                EquipmentTypeId: ko.observable(EquipmentTypeAttribute.EquipmentTypeId),
                IsUseForTime: ko.observable(EquipmentTypeAttribute.IsUseForTime),
                IsDefault: ko.observable(EquipmentTypeAttribute.IsDefault),
            };
            switchInstance.check(EquipmentTypeAttribute.IsUseForTime);
        }
        return EquipmentTypeAttributeViewModel;
    }

    function BindData_Attr(EquipmentTypeAttribute) {
        Global.Data.ModelEquipmentTypeAttribute = InitViewModel_Atrr(EquipmentTypeAttribute);
        ko.applyBindings(Global.Data.ModelEquipmentTypeAttribute, document.getElementById(Global.Element.popup_attr));
    }

    function SaveEquipmentTypeAttribute() {
        Global.Data.ModelEquipmentTypeAttribute.IsUseForTime = $("#eIsUseForTime").data("kendoMobileSwitch").check();
        Global.Data.ModelEquipmentTypeAttribute.EquipmentTypeId = Global.Data.EquipmentTypeId;
        $.ajax({
            url: Global.UrlAction.SaveEquipmentTypeAttribute,
            type: 'post',
            data: ko.toJSON(Global.Data.ModelEquipmentTypeAttribute),
            contentType: 'application/json',
            beforeSend: function () { $('#loading').show(); },
            success: function (result) {
                $('#loading').hide();
                GlobalCommon.CallbackProcess(result, function () {
                    if (result.Result == "OK") {
                        $('[cancel_attr]').click();
                        ReloadListEquipmentType();
                    }
                }, false, Global.Element.PopupEquipmentTypeAttribute, true, true, function () {
                    var msg = GlobalCommon.GetErrorMessage(result);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình xử lý.");
                });
            }
        });
    }

    function Delete_Atrr(Id) {
        $.ajax({
            url: Global.UrlAction.DeleteEquipmentTypeAttribute,
            type: 'POST',
            data: JSON.stringify({ 'Id': Id }),
            contentType: 'application/json charset=utf-8',
            beforeSend: function () { $('#loading').show(); },
            success: function (data) {
                $('#loading').hide();
                GlobalCommon.CallbackProcess(data, function () {
                    if (data.Result == "OK") {
                        ReloadListEquipmentType();
                    }
                }, false, Global.Element.PopupEquipmentTypeAttribute, true, true, function () {
                    var msg = GlobalCommon.GetErrorMessage(data);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
                });
            }
        });
    }

    function CheckValidate_Attr() {
        if ($('#etName_attr').val().trim() == "") {
            GlobalCommon.ShowMessageDialog("Vui lòng nhập Tên.", function () { }, "Lỗi Nhập liệu");
            $('#etName_attr').focus();
            return false;
        }
        return true;
    }
}
$(document).ready(function () {
    var EquipmentType = new GPRO.EquipmentType();
    EquipmentType.Init();
})