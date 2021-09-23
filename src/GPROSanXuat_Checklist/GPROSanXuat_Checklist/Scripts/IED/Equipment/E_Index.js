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
GPRO.namespace('Equipment');
GPRO.Equipment = function () {
    var Global = {
        UrlAction: {
            GetListEquipment: '/Equipment/Gets',
            SaveEquipment: '/Equipment/Save',
            DeleteEquipment: '/Equipment/Delete',
            GetListEquipmentTypeAtt: '/Equipment/GetListEquipmentTypeAttribute',
            GetListEquipmentAttribute: '/Equipment/GetListEquipmentAttribute',

        },
        Element: {
            JtableEquipment: 'jtableEquipment',
            PopupEquipment: 'popup_Equipment',
            PopupSearch: 'popup_SearchEquipment'
        },
        Data: {
            ModelEquipment: {},
            EquipmentId: 0,
            att: [],
            IsInsert: true
        }
    }
    this.GetGlobal = function () {
        return Global;
    }

    this.Init = function () {
        GetEGroupSelect('elistEquipmentGroup');
        GetETypeSelect('elistEquipmentType');
        RegisterEvent();
        InitList();
        ReloadList();
        InitPopup();
        BindData(null);
    }

    this.reloadListEquipment = function () {
        ReloadListEquipment();
    }

    this.initViewModel = function (Equipment) {
        InitViewModel(Equipment);
    }

    this.bindData = function (Equipment) {
        BindData(Equipment);
    }

    var RegisterEvent = function () {
        $('#' + Global.Element.PopupEquipment).on('shown.bs.modal', function () {
            $('div.divParent').attr('currentPoppup', Global.Element.PopupEquipment.toUpperCase());
        });
        $('#' + Global.Element.PopupSearch).on('shown.bs.modal', function () {
            $('div.divParent').attr('currentPoppup', Global.Element.PopupSearch.toUpperCase());
        });
        $('[re_egroup]').click(function () {
            GetEGroupSelect('elistEquipmentGroup');

        });
        $('[re_etype]').click(function () {
            GetETypeSelect('elistEquipmentType');
        });


        $('[esearch]').click(function () {
            ReloadList();
            $("#ekeyword").val('');
            $('div.divParent').attr('currentPoppup', '');
        });

        $("#elistEquipmentType").change(function () {
            var id = $(this).val();
            var url = Global.UrlAction.GetListEquipmentTypeAtt + "/" + id;
            $.getJSON(url, function (datas) {
                $('#myTable').empty();
                if (datas.length > 0) {
                    var str = '';
                    $.each(datas, function (i, item) {
                        var a = i + 1;
                        str += '    <div class="col-md-4 form-group ">';
                        str += '        <label class="control-label">' + datas[i].Name + ' <span class="required-class">*</span></label>';
                        str += '        <input class="form-control" value="0"  id="type' + a + '" type="text" />';
                        str += '    </div>';
                        Global.Data.att.push('type' + a);
                    });
                    $('#myTable').empty().append(str);
                }
            });
        });
    }

    function InitViewModel(Equipment) {
        var EquipmentViewModel = {
            Id: 0,
            Code: '',
            Name: '',
            Expend: 0,
            CompanyID: 0,
            Description: '',
            EquipmentTypeId: '',
            EquipmentGroupId: 0,
        };
        if (Equipment != null) {
            EquipmentViewModel = {
                Id: ko.observable(Equipment.Id),
                Code: ko.observable(Equipment.Code),
                Name: ko.observable(Equipment.Name),
                Expend: ko.observable(Equipment.Expend),
                CompanyID: ko.observable(Equipment.CompanyID),
                Description: ko.observable(Equipment.Description),
                EquipmentTypeId: ko.observable(Equipment.EquipmentTypeId),
                EquipmentGroupId: ko.observable(Equipment.EquipmentGroupId),
            };
        }
        return EquipmentViewModel;
    }

    function BindData(Equipment) {
        Global.Data.ModelEquipment = InitViewModel(Equipment);
        ko.applyBindings(Global.Data.ModelEquipment, document.getElementById(Global.Element.PopupEquipment));
    }

    function SaveEquipment() {
        var a = [];
        $.each(Global.Data.att, function (i, item) {
            a.push($('#' + item).val());
        });
        for (var r = a.length; r < 20; r++) {
            a.push("");
        }

        Global.Data.ModelEquipment.Code = $('#eCode').val();
        Global.Data.ModelEquipment.Name = $('#eName').val();
        Global.Data.ModelEquipment.Expend = $('#eexpend').val();
        Global.Data.ModelEquipment.Description = $('#eDescription').val();
        Global.Data.ModelEquipment.EquipmentTypeId = $('#elistEquipmentType').val();
        Global.Data.ModelEquipment.EquipmentGroupId = $('#elistEquipmentGroup').val();
        $.ajax({
            url: Global.UrlAction.SaveEquipment,
            type: 'post',
            data: JSON.stringify({ 'ModelEquipment': Global.Data.ModelEquipment, 'a': a }),
            contentType: 'application/json',
            beforeSend: function () { $('#loading').show(); },
            success: function (result) {
                $('#loading').hide();
                GlobalCommon.CallbackProcess(result, function () {
                    $('#loading').hide();
                    if (result.Result == "OK") {
                        ReloadList();
                        if (!Global.Data.IsInsert) {
                            $("#" + Global.Element.PopupEquipment + ' button[ecancel]').click();
                            $('div.divParent').attr('currentPoppup', '');
                        }
                        Global.Data.IsInsert = true;
                    }
                }, false, Global.Element.PopupEquipment, true, true, function () {
                    var msg = GlobalCommon.GetErrorMessage(result);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình sử lý.");
                });
            }
        });
    }

    function InitList() {
        $('#' + Global.Element.JtableEquipment).jtable({
            title: 'Danh sách Thiết Bị',
            paging: true,
            pageSize: 1000,
            pageSizeChange: true,
            sorting: true,
            selectShow: true,
            actions: {
                listAction: Global.UrlAction.GetListEquipment,
                createAction: Global.Element.PopupEquipment,
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
                },
                edit: {
                    title: '',
                    width: '1%',
                    sorting: false,
                    display: function (data) {
                        var text = $('<i data-toggle="modal" data-target="#' + Global.Element.PopupEquipment + '" title="Chỉnh sửa thông tin" class="fa fa-pencil-square-o clickable blue"  ></i>');
                        text.click(function () {
                            Global.Data.IsInsert = false;
                            BindData(data.record);
                            $('#elistEquipmentType').val(data.record.EquipmentTypeId);
                            $('#elistEquipmentGroup').val(data.record.EquipmentGroupId);
                            $('#eexpend').val(data.record.Expend);
                            $('#eName').val(data.record.Name);
                            $('#eCode').val(data.record.Code);
                            $('#eDescription').val(data.record.Description);
                            var id = data.record.Id;
                            Global.Data.ModelEquipment.Id = id;

                            var str = '';
                            if (data.record.EquipAtts.length > 0) {
                                var str = '';
                                $.each(data.record.EquipAtts, function (i, item) {
                                    var a = i + 1;
                                    str += '    <div class="col-md-4 form-group ">';
                                    str += '        <label class="control-label">' + item.Name + ' <span class="required-class">*</span></label>';
                                    str += '        <input class="form-control" value="' + item.Value + '"  id="type' + a + '" type="text" />';
                                    str += '    </div>';
                                    Global.Data.att.push('type' + a);
                                });
                            }
                            $('#myTable').empty().append(str);
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

    function ReloadList() {
        $('#' + Global.Element.JtableEquipment).jtable('load', { 'keyword': $('#ekeyword').val(), 'searchBy': $('#esearchBy').val() });
        $('#' + Global.Element.PopupSearch).modal('hide');
    }

    function Delete(Id) {
        $.ajax({
            url: Global.UrlAction.DeleteEquipment,
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
                }, false, Global.Element.PopupEquipment, true, true, function () {
                    var msg = GlobalCommon.GetErrorMessage(data);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
                });
            }
        });
    }

    function InitPopup() {
        $("#" + Global.Element.PopupEquipment).modal({
            keyboard: false,
            show: false
        });
        $("#" + Global.Element.PopupEquipment + ' button[esave]').click(function () {
            if (CheckValidate()) {
                SaveEquipment();
            }
        });
        $("#" + Global.Element.PopupEquipment + ' button[ecancel]').click(function () {
            $("#" + Global.Element.PopupEquipment).modal("hide");
            BindData(null);
        });
    }

    function CheckValidate() {
        if ($('#eName').val().trim() == "") {
            GlobalCommon.ShowMessageDialog("Vui lòng nhập Tên.", function () { }, "Lỗi Nhập liệu");
            $('#eName').focus();
            return false;
        }
        return true;
    }
}
$(document).ready(function () {
    var Equipment = new GPRO.Equipment();
    Equipment.Init();
});