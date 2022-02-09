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

GPRO.namespace('User');
GPRO.User = function () {
    var Global = {
        UrlAction: {
            GetList: '/User/Gets',
            Save: '/User/Save',
            Delete: '/User/Delete',
            UnLock: '/User/UnLockTimeUser',
            ChangePass: '/User/ChangePassword',
            ChangeState: '/User/ChangeUserState',
            GetRoles: '/User/GetRoles',
            UploadFile: '/UploadFile/Upload'
        },
        Element: {
            JtableUser: 'jtableUser',
            popupCreateUser: 'userModal',
            popupSearch: 'Search_popup'
        },
        Data: {
            ModelUser: {},
            UserContextId: 0,
            ChangePic: false
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
    }

    this.BindindUsercontextId = function (userContextId) {
        Global.Data.UserContextId = userContextId;
    }

    this.reloadListUser = function () {
        ReloadListUser();
    } 

    var RegisterEvent = function () {
         
        $('[btn="updatePassword"]').click(function () {
            if (checkValidateUpdatePass()) {
                ChangePassword();
            }
        });

        // Register event after upload file done the value of [filelist] will be change => call function save your Data 
        $('[filelist]').select(function () {
            Global.Data.ChangePic = true;
            Save();
        });

        $('[search]').click(function () {
            ReloadListUser();
            ResetSearchPopupData();
            $('[close-search]').click();
        });

        $('[close-search]').click(function () {
            ResetSearchPopupData();
            $('div.divParent').attr('currentPoppup', '');
        });

        $('#' + Global.Element.popupCreateUser).on('shown.bs.modal', function () {
            $('div.divParent').attr('currentPoppup', Global.Element.popupCreateUser.toUpperCase());
        });
        $('#' + Global.Element.popupSearch).on('shown.bs.modal', function () {
            $('div.divParent').attr('currentPoppup', Global.Element.popupSearch.toUpperCase());
        });
    }

    function UnLockTime(Id) {
        $.ajax({
            url: Global.UrlAction.UnLock,
            type: 'POST',
            data: JSON.stringify({ 'id': Id }),
            contentType: 'application/json charset=utf-8',
            beforeSend: function () { $('#loading').show(); },
            success: function (data) {
                $('#loading').hide();
                GlobalCommon.CallbackProcess(data, function () {
                    if (data.Result == "OK") {
                        ReloadListUser();
                    }
                    else
                        GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình sử lý.");
                }, false, Global.Element.PopupArea, true, true, function () {
                    var msg = GlobalCommon.GetErrorMessage(data);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình xóa.");
                });
            }
        });
    }

    function ChangePassword() {
        $.ajax({
            url: Global.UrlAction.ChangePass,
            type: 'POST',
            data: JSON.stringify({ 'id': $('[txt="userId"]').val(), 'Password': $('[txt="txtNewPass"]').val() }),
            contentType: 'application/json charset=utf-8',
            beforeSend: function () { $('#loading').show(); },
            success: function (data) {
                $('#loading').hide();
                GlobalCommon.CallbackProcess(data, function () {
                    if (data.Result == "OK") {
                        ReloadListUser();
                        $('#fogotPassModal').modal('hide');
                        BindData(null);
                    }
                    else
                        GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình sử lý.");
                }, false, Global.Element.PopupArea, true, true, function () {
                    var msg = GlobalCommon.GetErrorMessage(data);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình xóa.");
                });
            }
        });
    }

    function ChangeUserState(Id) {
        $.ajax({
            url: Global.UrlAction.ChangeState,
            type: 'POST',
            data: JSON.stringify({ 'id': Id }),
            contentType: 'application/json charset=utf-8',
            beforeSend: function () { $('#loading').show(); },
            success: function (data) {
                $('#loading').hide();
                GlobalCommon.CallbackProcess(data, function () {
                    if (data.Result == "OK") {
                        ReloadListUser();
                    }
                    else
                        GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình sử lý.");
                }, false, Global.Element.PopupArea, true, true, function () {
                    var msg = GlobalCommon.GetErrorMessage(data);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình xóa.");
                });
            }
        });
    }
    //
    function CheckValidate() {

        if ($('[txt="userName"]').val() == "") {
            GlobalCommon.ShowMessageDialog("Vui lòng nhập tên Tài Khoản.", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        else if ($('[txt="txtpass"]').val().trim() == "" && $('[txt="userId"]').val() == "0") {
            GlobalCommon.ShowMessageDialog("Vui lòng nhập Mật Khẩu.", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        else if (($('[txt="txtpass"]').val() != $('[txt="txtcpass"]').val() && $('[txt="userId"]').val() == "0") || ($('[txt="txtpass"]').val() != $('[txt="txtcpass"]').val() && $('[txt="userId"]').val() != "0" && $('#required').val() == "1")) {
            GlobalCommon.ShowMessageDialog("Mật Khẩu không khớp.", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        else if ($('[txt="txtho"]').val() == "") {
            GlobalCommon.ShowMessageDialog("Vui lòng nhập Họ.", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        else if ($('[txt="txtTen"]').val() == "") {
            GlobalCommon.ShowMessageDialog("Vui lòng nhập Tên.", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        //else if ($('[select="categoryId"]').val() == "") {
        //    GlobalCommon.ShowMessageDialog("Vui lòng chọn Menu Category.", function () { }, "Lỗi Nhập liệu");
        //    return false;
        //}
        return true;
    }

    function checkValidateUpdatePass() {
        if ($('[txt="txtNewPass"]').val() == "") {
            GlobalCommon.ShowMessageDialog("Vui lòng nhập Mật Khẩu.", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        else if ($('[txt="txtConfirmNewPass"]').val() == "") {
            GlobalCommon.ShowMessageDialog("Vui lòng nhập xác nhận Mật Khẩu.", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        else if ($('[txt="txtConfirmNewPass"]').val() != $('[txt="txtNewPass"]').val()) {
            GlobalCommon.ShowMessageDialog("Mật Khẩu không giống nhau.", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        return true;
    }
    
    function ResetSearchPopupData() {
        $('#keyword').val('');
        $('#searchBy').val(0);
        $('#isblock').prop('checked', false);
        $('#ischangepass').prop('checked', false);
        $('#istimeblock').prop('checked', false);
        $('#isforgotpass').prop('checked', false);
    }
 
    function BindData(user) {
        if (user) {
            $('[txt="userId"]').val(user.Id);
            $('[txt="userName"]').val(user.UserName);
            $('[txt="txtpass"]').val(user.PassWord);
            $('[txt="txtTen"]').val(user.LastName);
            $('[txt="txtho"]').val(user.FirstName);
            $('[txt="email"]').val(user.Email); 
        }
        else {
            $('[txt="userId"]').val(0);
            $('[txt="userName"]').val('');
            $('[txt="txtpass"]').val('');
            $('[txt="txtTen"]').val('');
            $('[txt="txtho"]').val('');
            $('[txt="email"]').val('');
            $("#userRoles").data("kendoMultiSelect").value('');
            $("#workshops").data("kendoMultiSelect").value('');
        }
    }

    function InitPopup() {
        $('#' + Global.Element.popupCreateUser + ' button[saveUser]').click(function () {
            if ($('#uploader').val() != '')
                UpSingle("FormUpload", "uploader");
            else
                Save();
        });

        $('#' + Global.Element.popupCreateUser + ' button[cancel]').click(function () {
            $("#" + Global.Element.popupCreateUser).modal("hide");
            BindData(null);
            $('div.divParent').attr('currentPoppup', '');
        });
    }

    function Save() {
        var user = {
            Id: $('[txt="userId"]').val(),
            UserName: $('[txt="userName"]').val(),
            PassWord: $('[txt="txtpass"]').val(),
            LastName: $('[txt="txtTen"]').val(),
            FirstName: $('[txt="txtho"]').val(),
            Email: $('[txt="email"]').val(),
            ImagePath: $('[filelist]').attr('newurl'),
            IsForgotPassword: false,
            NoteForgotPassword: $('#userRoles').data("kendoMultiSelect").value().toString(),
            IsLock: false,
            UserRoles: null,
            UserCategoryId: $('#UserCategory').val(),
            ChangePic: Global.Data.ChangePic,
            WorkshopIds: $('#workshops').data("kendoMultiSelect").value().toString()
        }
        $.ajax({
            url: Global.UrlAction.Save,
            type: 'post',
            data: ko.toJSON(user),
            contentType: 'application/json',
            beforeSend: function () { $('#loading').show(); },
            success: function (result) {
                $('#loading').hide();
                GlobalCommon.CallbackProcess(result, function () {
                    if (result.Result == "OK") {
                        ReloadList();
                        $('#' + Global.Element.popupCreateUser + ' button[cancel]').click();
                    }
                    else
                        GlobalCommon.ShowMessageDialog("", function () { }, "Đã có lỗi xảy ra trong quá trình sử lý.");
                }, false, Global.Element.PopupArea, true, true, function () {
                    var msg = GlobalCommon.GetErrorMessage(result);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình sử lý.");
                });
            }
        });
    }

    function InitList() {
        $('#' + Global.Element.JtableUser).jtable({
            title: 'Danh Sách Tài Khoản',
            paging: true,
            pageSize: 1000,
            pageSizeChange: true,
            sorting: true,
            selectShow: true,
            actions: {
                listAction: Global.UrlAction.GetList,
                createAction: Global.Element.popupCreateUser,
                searchAction: Global.Element.popupSearch
            },
            messages: {
                addNewRecord: 'Thêm Tài Khoản',
                searchRecord: 'Tìm kiếm',
                selectShow: 'Ẩn hiện cột',
            },
            fields: {
                Id: {
                    key: true,
                    create: false,
                    edit: false,
                    list: false
                },
                LockedTime: {
                    title: '',
                    width: '3%',
                    display: function (data) {
                        if (data.record.LockedTime != null) {
                            var text = $('<button title="Mở khóa Thời Gian cho Tài Khoản ' + data.record.UserName + '" class="jtable-command-button image-icon image-lockTime"><span>Xóa</span></button>');
                            var dateLock = new Date(parseInt((data.record.LockedTime).substr(6)));
                            var today = new Date().getTime();
                            if (dateLock > today) {
                                text.click(function () {
                                    GlobalCommon.ShowConfirmDialog("Bạn có chắc chắn muốn mở khóa cho Tài Khoản ?", function () {
                                        UnLockTime(data.record.Id);
                                    }, function () { }, 'Đồng ý', 'Hủy bỏ', 'Mở Khóa Thời Gian');
                                });
                                return text;
                            }
                        }
                    }
                },
                IsForgotPassword: {
                    title: '',
                    width: '3%',
                    display: function (data) {
                        if (data.record.IsForgotPassword) {
                            var text = $('<button title="Tài Khoản ' + data.record.UserName + ' đang yêu cầu cấp lại Mật Khẩu." class="jtable-command-button image-icon image-requiredPass" data-toggle="modal" data-target="#fogotPassModal"><span>Xóa</span></button>');
                            text.click(function () {
                                BindData(data.record);
                            })
                            return text;
                        }
                    }
                },
                UserName: {
                    visibility: 'fixed',
                    title: "Tên Đăng Nhập",
                    width: "20%",
                },
                RoleNames: {
                    title: 'Nhóm quyền TK',
                    display: function (data) {
                        var text = '<span >' + data.record.RoleNames + '</span> ';
                        return text;
                    }
                },
                FirstName: {
                    title: "Họ Tên",
                    width: "20%",
                    display: function (data) {
                        txt = data.record.FirstName + ' ' + data.record.LastName;
                        return txt;
                    }
                },
                Email: {
                    title: "Email",
                    width: "20%",
                },
                ImagePath: {
                    title: "Hình",
                    width: "3%",
                    display: function (data) {
                        var text = $('<img src="' + data.record.ImagePath + '" width="40"/>');
                        if (data.record.ImagePath != null) {
                            return text;
                        }
                    }
                },
                IsRequireChangePW: {
                    visibility: 'hidden',
                    title: 'YC đổi MK',
                    width: '1%',
                    display: function (data) {
                        var elementDisplay = "";
                        if (data.record.IsShow) { elementDisplay = "<input  type='checkbox' checked='checked' disabled/>"; }
                        else {
                            elementDisplay = "<input  type='checkbox' disabled />";
                        }
                        return elementDisplay;
                    }
                },
                IsLock: {
                    title: '',
                    width: '3%',
                    display: function (data) {
                        var text = $('');
                        if (data.record.IsLock) {
                            text = $('<button title="Tài khoản không bị khóa. Nhấn vào để khóa." class="jtable-command-button image-icon image-lockAcc"><span>Xóa</span></button>');
                        }
                        else {
                            text = $('<button title="Tài khoản không bị khóa. Nhấn vào để khóa." class="jtable-command-button image-icon image-unlockAcc"><span>Xóa</span></button>');
                        }
                        text.click(function () {
                            GlobalCommon.ShowConfirmDialog("Bạn có chắc chắn muốn thay đổi trạng thái Tài Khoản ?", function () {
                                ChangeUserState(data.record.Id);
                            }, function () { }, 'Đồng ý', 'Hủy bỏ', 'Thay đổi trạng thái');
                        });
                        return text;
                    }
                },
                edit: {
                    title: '',
                    width: '1%',
                    sorting: false,
                    display: function (data) {
                        var text = $('<i data-toggle="modal" data-target="#' + Global.Element.popupCreateUser + '" title="Chỉnh sửa thông tin" class="fa fa-pencil-square-o clickable blue"  ></i>');
                        text.click(function () {
                            if (data.record.IsRequireChangePW) {
                                $('#passwordRow').show();
                                data.record.PassWord = '';
                                $('#required').val('1')
                            }
                           // $('#rowUsername').hide();
                            $('[txt="userName"]').prop('disabled', true);

                            if (data.record.UserRoleIds != null)
                                $("#userRoles").data("kendoMultiSelect").value(data.record.UserRoleIds);
                            else
                                $("#userRoles").data("kendoMultiSelect").value('');

                            if (data.record.intWorkshopIds != null)
                                $("#workshops").data("kendoMultiSelect").value(data.record.intWorkshopIds);
                            else
                                $("#workshops").data("kendoMultiSelect").value('');

                            //do data vao modal
                            BindData(data.record);
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
        $('#' + Global.Element.JtableUser).jtable('load', { 'keyword': $('#keyword').val(), 'searchBy': $('#searchBy').val(), 'isBlock': $('#isblock').is(':checked'), 'isRequiredChangePass': $('#ischangepass').is(':checked'), 'isTimeBlock': $('#istimeblock').is(':checked'), 'isForgotPass': $('#isforgotpass').is(':checked') });
        $('#' + Global.Element.popupSearch).modal('hide');
    }

    function Delete(Id) {
        $.ajax({
            url: Global.UrlAction.Delete,
            type: 'POST',
            data: JSON.stringify({ 'id': Id }),
            contentType: 'application/json charset=utf-8',
            beforeSend: function () { $('#loading').show(); },
            success: function (data) {
                $('#loading').hide();
                GlobalCommon.CallbackProcess(data, function () {
                    if (data.Result == "OK") {
                        ReloadList();
                    }
                    else
                        GlobalCommon.ShowMessageDialog("", function () { }, "Đã có lỗi xảy ra trong quá trình sử lý.");
                }, false, Global.Element.PopupArea, true, true, function () {
                    var msg = GlobalCommon.GetErrorMessage(data);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình xóa.");
                });
            }
        });
    }
    
}

$(document).ready(function () {
    var User = new GPRO.User();
    User.Init();
    $("#userRoles").kendoMultiSelect().data("kendoMultiSelect");
    $("#workshops").kendoMultiSelect().data("kendoMultiSelect");

    // show column username when button add click
    $('.jtable-toolbar-item-add-record').click(function () {
      //  $('#rowUsername').show();
        $('[txt="userName"]').prop('disabled', false);
        $('#passwordRow').show();
    });
});