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
GPRO.namespace('Skill');
GPRO.Skill = function () {
    var Global = {
        UrlAction: {
            _GetLists: '/skillgroup/Gets',
            _Save: '/skillgroup/Save',
            _Delete: '/skillgroup/Delete',

            GetLists: '/skill/Gets',
            Save: '/skill/Save',
            Delete: '/skill/Delete',

            GetSkillLevels: '/skilllevel/Gets',
            SaveSkillLevel: '/skilllevel/Save',
        },
        Element: {
            Jtable: 'skill-group-jtable',
            Popup: 'skill-group-popup',
            Popupskill: 'popup-skill',
            Search: 'skill-group-popup-search',

            JtableLevel: 'skill-level-jtable',
            PopupLevel: 'popup-skill-level',
        },
        Data: {
            IsInsert: true,
            ParentId: 0,
            skillId: 0,
            levelObj: null
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

        InitPopupType();
        GetSkillGroupSelect('skill-group-select');
        GetEGroupSelect('skill-e-group');
        InitListSkillLevel();
        $('#skill-type').change();
    }

    var RegisterEvent = function () {
        $('#skill-type').change(() => {
            switch ($('#skill-type').val()) {
                case '0': $('[box-tb],[box-cd]').addClass('hide'); break;
                case '1': $('[box-tb]').removeClass('hide'); break;
                case '2': $('[box-cd]').removeClass('hide'); break;
            }
        });

        $('[re-e-group]').click(() => {
            GetEGroupSelect('skill-e-group');
        })
    }

    function InitList() {
        $('#' + Global.Element.Jtable).jtable({
            title: 'Quản lý nhóm kỹ năng',
            paging: true,
            pageSize: 1000,
            pageSizeChange: true,
            sorting: true,
            selectShow: false,
            actions: {
                listAction: Global.UrlAction._GetLists,
                createAction: Global.Element.Popup,
            },
            messages: {
                addNewRecord: 'Thêm mới',
            },
            searchInput: {
                id: 'skill-group-keyword',
                className: 'search-input',
                placeHolder: 'Nhập từ khóa ...',
                keyup: function (evt) {
                    if (evt.keyCode == 13)
                        ReloadList();
                }
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
                Code: {
                    visibility: 'fixed',
                    title: "Mã nhóm ",
                    width: "5%",
                },
                Name: {
                    visibility: 'fixed',
                    title: "Tên nhóm",
                    width: "15%",
                },
                Coefficient: {
                    title: "Hệ số",
                    width: "5%",
                },
                Note: {
                    title: "Mô Tả ",
                    width: "20%",
                    sorting: false,
                },
                actions: {
                    title: ' ',
                    width: '8%',
                    sorting: false,
                    edit: false,
                    display: function (parent) {
                        var div = $('<div class="table-action"></div>');

                        var $img = $('<i class="fa fa-list-ol clickable red aaa" title="Click xem sanh sách nhóm kỹ năng ' + parent.record.Name + '"></i>');
                        $img.click(function () {
                            Global.Data.ParentId = parent.record.Id;
                            $("#skill-group-select").val(parent.record.Id);
                            $('#' + Global.Element.Jtable).jtable('openChildTable',
                                $img.closest('tr'),
                                {
                                    title: '<span class="red">Danh sách kỹ năng thuộc nhóm : ' + parent.record.Name + '</span>',
                                    paging: true,
                                    pageSize: 1000,
                                    pageSizeChange: true,
                                    sorting: true,
                                    selectShow: false,
                                    actions: {
                                        listAction: Global.UrlAction.GetLists + '?typeId=' + parent.record.Id,
                                        createAction: Global.Element.Popupskill,
                                    },
                                    messages: {
                                        addNewRecord: 'Thêm mới',
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
                                            title: "Tên kỹ năng",
                                            width: "15%",
                                        },
                                        EGroupName: {
                                            title: "Thiết bị",
                                            width: "20%",
                                        },
                                        PhaseName: {
                                            title: "Công đoạn",
                                            width: "20%",
                                        },
                                        Note: {
                                            title: "Mô Tả ",
                                            width: "20%",
                                            sorting: false,
                                        },
                                        actions: {
                                            title: '',
                                            width: '5%',
                                            sorting: false,
                                            display: function (data) {
                                                var div = $('<div class="table-action"></div>');
                                                var detailbtn = $('<i data-toggle="modal" data-target="#' + Global.Element.PopupLevel + '" title="Click xem thông tin cấp độ kỹ năng" class="fa fa-list-ol"  ></i>');
                                                detailbtn.click(() => {
                                                    Global.Data.skillId = data.record.Id;
                                                    ReloadListSkillLevel();
                                                });
                                                div.append(detailbtn);

                                                var editbtn = $('<i data-toggle="modal" data-target="#' + Global.Element.Popupskill + '" title="Chỉnh sửa thông tin" class="fa fa-pencil-square-o "  ></i>');
                                                editbtn.click(function () {
                                                    $('#skill-id').val(data.record.Id);
                                                    $('#skill-note').val(data.record.Note);
                                                    $("#skill-name").val(data.record.Name);
                                                    $("#skill-group-select").val(data.record.SkillGroupId);
                                                    $('#skill-index').val(data.record.OIndex);
                                                    $('#skill-coeff').val(data.record.Coefficient);
                                                    Global.Data.ParentId = data.record.SkillGroupId;
                                                    Global.Data.IsInsert = false;
                                                });
                                                div.append(editbtn);

                                                var deleteBtn = $('<i title="Xóa" class="fa fa-trash-o "> </i>');
                                                deleteBtn.click(function () {
                                                    GlobalCommon.ShowConfirmDialog('Bạn có chắc chắn muốn xóa?', function () {
                                                        Delete(data.record.Id);
                                                    }, function () { }, 'Đồng ý', 'Hủy bỏ', 'Thông báo');
                                                });
                                                div.append(deleteBtn);

                                                return div;
                                            }
                                        }
                                    }
                                }, function (data) { //opened handler
                                    data.childTable.jtable('load');
                                });
                        });
                        div.append($img);

                        var btnEdit = $('<i data-toggle="modal" data-target="#' + Global.Element.Popup + '" title="Chỉnh sửa thông tin" class="fa fa-pencil-square-o clickable blue"  ></i>');
                        btnEdit.click(function () {
                            //ReloadList();
                            $('#skill-group-id').val(parent.record.Id);
                            $('#skill-group-note').val(parent.record.Note);
                            $("#skill-group-name").val(parent.record.Name);
                            $("#skill-group-coeff").val(parent.record.Coefficient);
                            $("#skill-group-code").val(parent.record.Code);
                            Global.Data.IsInsert = false;
                        });
                        div.append(btnEdit);

                        var deleteBtn = $('<i title="Xóa" class="fa fa-trash-o "> </i>');
                        deleteBtn.click(function () {
                            GlobalCommon.ShowConfirmDialog('Bạn có chắc chắn muốn xóa?', function () {
                                DeleteType(parent.record.Id);
                            }, function () { }, 'Đồng ý', 'Hủy bỏ', 'Thông báo');
                        });
                        div.append(deleteBtn);

                        return div;
                    }
                }
            }
        });
    }

    function ReloadList() {
        var keySearch = $('#skill-group-keyword').val();
        $('#' + Global.Element.Jtable).jtable('load', { 'keyword': keySearch });
    }

    function CheckValidate() {
        if ($('#skill-name').val().trim() == "") {
            GlobalCommon.ShowMessageDialog("Vui lòng nhập tên kỹ năng.", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        //else if ($('#skill-coeff').val().trim() == "") {
        //    GlobalCommon.ShowMessageDialog("Vui lòng nhập hệ số kỹ năng.", function () { }, "Lỗi Nhập liệu");
        //    return false;
        //}
        return true;
    }

    function Saveskill() {
        var obj = {
            Id: $('#skill-id').val(),
            Code: $('#skill-code').val(),
            Name: $('#skill-name').val(),
            Note: $('#skill-note').val(),
            SkillGroupId: $('#skill-group-select').val(),
            EquipmentGroupId: $('#skill-e-group').val(),
            PhaseId: $('#skill-phase').val(),
            Coefficient: $('#skill-coeff').val()
        }
        switch ($('#skill-type').val()) {
            case '0':
                obj.EquipmentGroupId = null;
                obj.PhaseId = null;
                break;
            case '1': 
                obj.PhaseId = null;
                break;
            case '2':
                obj.EquipmentGroupId = null; 
                break;
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
                        $('#skill-id').val('0');
                        $('#skill-note').val('');
                        $("#skill-code").val('');
                        $("#skill-name").val('');
                        $('#skill-type').val(0).change();
                        $('#skill-group-select').val(Global.Data.ParentId);
                        if (!Global.Data.IsInsert) {
                            $("#" + Global.Element.Popupskill + ' button[cancel]').click();
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
            url: Global.UrlAction.Delete,
            type: 'POST',
            data: JSON.stringify({ 'Id': Id }),
            contentType: 'application/json charset=utf-8',
            beforeSend: function () { $('#loading').show(); },
            success: function (data) {
                $('#loading').hide();
                if (data.Result == "OK") {
                    ReloadList();
                }
                else
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình xử lý.");

            }
        });
    }

    function InitPopup() {
        $("#" + Global.Element.Popupskill).modal({
            keyboard: false,
            show: false
        });

        $('#' + Global.Element.Popupskill).on('shown.bs.modal', function () {
            //$('div.divParent').attr('currentPoppup', Global.Element.Popupskill.toUpperCase());
        });

        $("#" + Global.Element.Popupskill + ' button[save]').click(function () {
            if (CheckValidate()) {
                Saveskill();
            }
        });

        $("#" + Global.Element.Popupskill + ' button[cancel]').click(function () {
            $("#" + Global.Element.Popupskill).modal("hide");
            $('#skill-id').val('0');
            $('#skill-note').val('');
            $("#skill-name").val('');
            $('#skill-group-select').val(Global.Data.ParentId);
            $('#skill-type').val(0).change();
        });
    }


    //----------------------------------------------------
    function CheckValidate_Type() {
        if ($('#skill-group-code').val().trim() == "") {
            GlobalCommon.ShowMessageDialog("Vui lòng nhập mã nhóm kỹ năng.", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        else if ($('#skill-group-name').val().trim() == "") {
            GlobalCommon.ShowMessageDialog("Vui lòng nhập tên nhóm kỹ năng.", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        else if ($('#skill-group-coeff').val().trim() == "") {
            GlobalCommon.ShowMessageDialog("Vui lòng nhập hệ số nhóm kỹ năng.", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        return true;
    }

    function SaveType() {
        var obj = {
            Id: $('#skill-group-id').val(),
            Code: $('#skill-group-code').val(),
            Name: $('#skill-group-name').val(),
            Coefficient: $('#skill-group-coeff').val(),
            Note: $('#skill-group-note').val()
        }

        $.ajax({
            url: Global.UrlAction._Save,
            type: 'post',
            data: ko.toJSON(obj),
            contentType: 'application/json',
            beforeSend: function () { $('#loading').show(); },
            success: function (result) {
                $('#loading').hide();
                GlobalCommon.CallbackProcess(result, function () {
                    if (result.Result == "OK") {
                        ReloadList();
                        GetSkillGroupSelect('skill-group-select');
                        $('#skill-group-id').val('0');
                        $('#skill-group-note').val('');
                        $("#skill-group-name").val('');
                        $("#skill-group-code").val('');
                        $("#skill-group-coeff").val('1');
                        if (!Global.Data.IsInsert) {
                            $("#" + Global.Element.Popup + ' button[cancel]').click();
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

    function DeleteType(Id) {
        $.ajax({
            url: Global.UrlAction._Delete,
            type: 'POST',
            data: JSON.stringify({ 'Id': Id }),
            contentType: 'application/json charset=utf-8',
            beforeSend: function () { $('#loading').show(); },
            success: function (data) {
                $('#loading').hide();
                if (data.Result == "OK") {
                    ReloadList();
                    GetSkillGroupSelect('skill-group-select');
                }
                else
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình xử lý.");
            }
        });
    }

    function InitPopupType() {
        $("#" + Global.Element.Popup).modal({
            keyboard: false,
            show: false
        });

        $('#' + Global.Element.Popup).on('shown.bs.modal', function () {
            $('div.divParent').attr('currentPoppup', Global.Element.Popup.toUpperCase());
        });

        $("#" + Global.Element.Popup + ' button[save]').click(function () {
            if (CheckValidate_Type()) {
                SaveType();
            }
        });

        $("#" + Global.Element.Popup + ' button[cancel]').click(function () {
            $("#" + Global.Element.Popup).modal("hide");
            $('#skill-group-id').val('0');
            $('#skill-group-note').val('');
            $("#skill-group-name").val('');
            $("#skill-group-coeff").val(0);
            $("#skill-group-code").val('');
        });
    }


    function InitListSkillLevel() {
        $('#' + Global.Element.JtableLevel).jtable({
            title: 'Danh sách cấp độ kỹ năng',
            paging: true,
            pageSize: 1000,
            pageSizeChange: true,
            sorting: true,
            selectShow: false,
            actions: {
                listAction: Global.UrlAction.GetSkillLevels,
                //createAction: Global.Element.PopupLevel,
            },
            messages: {
                //addNewRecord: 'Thêm mới',
            },
            //searchInput: {
            //    id: 'skill-level-keyword',
            //    className: 'search-input',
            //    placeHolder: 'Nhập từ khóa ...',
            //    keyup: function (evt) {
            //        if (evt.keyCode == 13)
            //            ReloadListSkillLevel();
            //    }
            //},
            fields: {
                Id: {
                    key: true,
                    create: false,
                    edit: false,
                    list: false
                },
                Name: {
                    visibility: 'fixed',
                    title: "Cấp độ",
                    width: "20%",
                },
                Coefficient: {
                    title: "Hệ số",
                    width: "5%",
                    display: function (data) {
                        var input = $('<input class="form-control" value="' + data.record.Coefficient + '" type="text" onkeypress="return isNumberKey(event)" />');
                        input.keypress((evt) => {
                            if (evt.keyCode == 13) {
                                if (isNaN(input.val())) {

                                }
                                else {
                                    var _obj = data.record;
                                    _obj.Coefficient = parseFloat(input.val());
                                    UpdateLevel(_obj);
                                }
                            }
                            else return true;
                        });
                        input.focusout(() => { ReloadListSkillLevel(); })
                        return input;
                    }
                },
                Note: {
                    title: "Ghi chú ",
                    width: "20%",
                    sorting: false,
                    display: function (data) {
                        var input = $('<textarea class="form-control">' + getText(data.record.Note) + '</textarea>');
                        input.focusout(() => {
                            if (input.val() != data.record.Note) {
                                var _obj = data.record;
                                _obj.Note = parseFloat(input.val());
                                UpdateLevel(_obj);
                            }
                        })
                        return input;
                    }
                },
                /*
                edit: {
                    title: '',
                    width: '1%',
                    sorting: false,
                    display: function (data) {
                        var text = $('<i data-toggle="modal" data-target="#' + Global.Element.PopupSize + '" title="Chỉnh sửa thông tin" class="fa fa-pencil-square-o clickable blue"  ></i>');
                        text.click(function () {
                            ReloadList();
                            $('#size-id').val(data.record.Id);
                            $('#size-note').val(data.record.Note);
                            $("#size-name").val(data.record.Name);
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
                */
            }
        });
    }

    function ReloadListSkillLevel() {
        $('#' + Global.Element.JtableLevel).jtable('load', { 'skillId': Global.Data.skillId });
    }

    function UpdateLevel(obj) {
        $.ajax({
            url: Global.UrlAction.SaveSkillLevel,
            type: 'post',
            data: ko.toJSON(obj),
            contentType: 'application/json',
            beforeSend: function () { $('#loading').show(); },
            success: function (result) {
                $('#loading').hide();
                GlobalCommon.CallbackProcess(result, function () {
                    if (result.Result == "OK") {
                        ReloadListSkillLevel();
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

}

$(document).ready(function () {
    var obj = new GPRO.Skill();
    obj.Init();
});
