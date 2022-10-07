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
GPRO.namespace('EmployeeSkill');
GPRO.EmployeeSkill = function () {
    var Global = {
        UrlAction: {
            GetLists: '/EmployeeSkill/Gets',
            Save: '/EmployeeSkill/Save',
            Delete: '/EmployeeSkill/Delete',
        },
        Element: {
            Jtable: 'ek-jtable',
            Popup: 'popup-ek',
        },
        Data: {
            IsInsert: true,
            skillId: null,
            skillLevelId: null
        }
    }
    this.GetGlobal = function () {
        return Global;
    }

    this.Init = function () {
        RegisterEvent();        
        InitPopup(); 
        InitList();        
        GetSkillGroupSelect('ek-skill-group');
        GetEmployeeSelect('ek-employee');
       // ReloadList();
    }

    var RegisterEvent = function () {
        $('#ek-skill-group').change(() => {
            if ($('#ek-skill-group').val() && $('#ek-skill-group').val() != '0')
                GetSkillSelect('ek-skill', $('#ek-skill-group').val());
        });

        $('#ek-skill').change(() => {
            if (Global.Data.skillId) {
                $('#ek-skill').val(Global.Data.skillId);
                Global.Data.skillId = null;
            }

            if ($('#ek-skill').val() && $('#ek-skill').val() != '0')
                GetSkillLevelSelect('ek-skill-level', $('#ek-skill').val());
        });


        $('#ek-skill-level').change(() => {
            if (Global.Data.skillLevelId) {
                $('#ek-skill-level').val(Global.Data.skillLevelId);
                Global.Data.skillLevelId = null;
            }
        });
         
        $('[re-skill-group]').click(() => {
            GetSkillGroupSelect('ek-skill-group');
        })

        $('[re-skill]').click(() => {
            if ($('#ek-skill-group').val() && $('#ek-skill-group').val() != '0')
                GetSkillSelect('ek-skill', $('#ek-skill-group').val());
        })

        $('[re-skill-level]').click(() => {
            if ($('#ek-skill').val() && $('#ek-skill').val() != '0')
                GetSkillLevelSelect('ek-skill-level', $('#ek-skill').val());
        })

        $('[re-employee]').click(() => {
            GetEmployeeSelect('ek-employee');
        })
    }

    function InitPopup() {
        $("#" + Global.Element.Popup).modal({
            keyboard: false,
            show: false
        });

        $('#' + Global.Element.Popup).on('shown.bs.modal', function () {
            //$('div.divParent').attr('currentPoppup', Global.Element.Popupskill.toUpperCase());
        });

        $("#" + Global.Element.Popup + ' button[save]').click(function () {
            if (CheckValidate()) {
                Save();
            }
        });

        $("#" + Global.Element.Popup + ' button[cancel]').click(function () {
            $("#" + Global.Element.Popup).modal("hide");
            $('#ek-id').val('0');
            $('#ek-employee').val('');
            
        });
    }

    function CheckValidate() {
        if ($('#ek-employee').val().trim() == "") {
            GlobalCommon.ShowMessageDialog("Vui lòng chọn nhân viên.", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        else if ($('#ek-skill-group').val().trim() == "") {
            GlobalCommon.ShowMessageDialog("Vui lòng chọn nhóm kỹ năng.", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        else if ($('#ek-skill').val().trim() == "") {
            GlobalCommon.ShowMessageDialog("Vui lòng chọn kỹ năng.", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        else if ($('#ek-skill-level').val().trim() == "") {
            GlobalCommon.ShowMessageDialog("Vui lòng chọn cấp độ kỹ năng.", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        return true;
    }

    function Save () {
        var obj = {
            Id: $('#ek-id').val(),
            EmployeeId: $('#ek-employee').val(),
            SkillLevelId: $('#ek-skill-level').val()  
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
                        $('#ek-id').val('0'); 
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
    
    function InitList() {
        $('#' + Global.Element.Jtable).jtable({
            title: 'Danh sách kỹ năng nhân viên',
            paging: true,
            pageSize: 1000,
            pageSizeChange: true,
            sorting: true,
            selectShow: false,
            actions: {
                listAction: Global.UrlAction.GetLists,
                createAction: Global.Element.Popup,
            },
            messages: {
                addNewRecord: 'Thêm mới',
            },
            searchInput: {
                id: 'ek-keyword',
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
                EmployeeName: {
                    visibility: 'fixed',
                    title: "Nhân viên ",
                    width: "15%",
                },
                SkillGroupName: {
                    visibility: 'fixed',
                    title: "Nhóm kỹ năng",
                    width: "15%",
                },
                SkillName: {
                    visibility: 'fixed',
                    title: "Kỹ năng",
                    width: "15%",
                },
                SkillLevel: {
                    visibility: 'fixed',
                    title: "Cấp độ kỹ năng",
                    width: "15%",
                },
                Coefficient: {
                    title: "Hệ số cấp kỹ năng",
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
                         
                        var btnEdit = $('<i data-toggle="modal" data-target="#' + Global.Element.Popup + '" title="Chỉnh sửa thông tin" class="fa fa-pencil-square-o clickable blue"  ></i>');
                        btnEdit.click(function () {
                            //ReloadList();
                            $('#ek-id').val(parent.record.Id);
                            $('#ek-employee').val(parent.record.EmployeeId);
                            $("#ek-skill-group").val(parent.record.SkillGroupId);
                            Global.Data.skillId = parent.record.SkillId;
                            Global.Data.skillLevelId = parent.record.SkillLevelId;                             
                            Global.Data.IsInsert = false;
                        });
                        div.append(btnEdit);

                        var deleteBtn = $('<i title="Xóa" class="fa fa-trash-o "> </i>');
                        deleteBtn.click(function () {
                            GlobalCommon.ShowConfirmDialog('Bạn có chắc chắn muốn xóa?', function () {
                                Delete(parent.record.Id);
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
        var keySearch = $('#ek-keyword').val();
        $('#' + Global.Element.Jtable).jtable('load', { 'keyword': keySearch });
    }
     
}

$(document).ready(function () {
    var obj = new GPRO.EmployeeSkill();
    obj.Init();
});
