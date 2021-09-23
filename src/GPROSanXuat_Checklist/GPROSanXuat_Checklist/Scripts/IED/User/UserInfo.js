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
            SaveUser: '/UserProFile/SaveUser',
        },
        Element: {
            PopupUser: 'popup_User',
            popupPassWord: 'popup_PassWord',
            popupEmail: 'popup_Email'
        },
        Data: {
            UserInfoModel: {},
        }
    }
    this.GetGlobal = function () {
        return Global;
    }

    this.Init = function () {
        RegisterEvent();
        InitPopupUser();
        InitpopupPassWord();
        InitpopupEmail();

    }
    var RegisterEvent = function () {
        $('[cancel]').click(function () {
        });
        $('[btn="editName"]').click(function () {
            ShowPopupUser();
        });
        $('[btn="editPass"]').click(function () {
            ShowPopupPassWord();
        });
        $('[btn="editEmail"]').click(function () {
            ShowPopupEmail();
        });
        $('[btn="editImage"]').click(function () {
            var uploadobj = document.getElementById('uploader');
            if (uploadobj.getqueuecount() > 0) {  //if file upload is null 
                $('#submit').click();  // call event upload file
            }
        });

        // Register event after upload file done the value of [filelist] will be change => call function save your Data 
        $('[filelist]').change(function () {
            SaveUser();  
        });
    }
    function SaveUser() {
        Global.Data.UserInfoModel.ImagePath = $('[filelist]').val();
        Global.Data.UserInfoModel.Id = $('#UserId').val();
        Global.Data.UserInfoModel.UserName = $('#UserName').val();
        Global.Data.UserInfoModel.FisrtName = $('#FirstName1').val();
        Global.Data.UserInfoModel.LastName = $('#LastName1').val();
        Global.Data.UserInfoModel.Email = $('#NewEmail').val();
        Global.Data.UserInfoModel.PassWord = $('#PassWord').val();
        Global.Data.UserInfoModel.OldPassWord = $('#OldPassWord').val();
        $.ajax({
            url: Global.UrlAction.SaveUser,
            type: 'post',
            data: ko.toJSON(Global.Data.UserInfoModel),
            contentType: 'application/json',
            success: function (result) {
                window.location.href = "/UserProFile/Index";
                GlobalCommon.CallbackProcess(result, function () {
                    if (result.Result == "OK") {
                        GlobalCommon.ShowConfirmDialog('Thành Công', function () {
                        }, function () { }, 'OK');
                    }
                }, false, Global.Element.PopupUser, true, true, function () {
                    var msg = GlobalCommon.GetErrorMessage(result);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình sử lý.");
                });
            }
        });
    }
    function InitPopupUser() {
        $("#" + Global.Element.PopupUser).modal({
            keyboard: false,
            show: false
        });
        $("#" + Global.Element.PopupUser + ' button[save]').click(function () {
            Global.Data.UserInfoModel.Status = 1;
            SaveUser();
            $("#" + Global.Element.PopupUser).modal("hide");
            //window.location.href = "/UserProFile/Index";
        });
        $("#" + Global.Element.PopupUser + ' button[cancel]').click(function () {
            $("#" + Global.Element.PopupUser).modal("hide");
        });
    }

    function InitpopupPassWord() {
        $("#" + Global.Element.popupPassWord).modal({
            keyboard: false,
            show: false
        });
        $("#" + Global.Element.popupPassWord + ' button[save]').click(function () {
            Global.Data.UserInfoModel.Status = 2;
            if (CheckValidatePassWord()) {
                SaveUser();
                $("#" + Global.Element.popupPassWord).modal("hide");
                //window.location.href = "/UserProFile/Index";
            }
        });
        $("#" + Global.Element.popupPassWord + ' button[cancel]').click(function () {
            //$("#" + Global.Element.popupPassWord).modal("hide");
        });
    }
    function InitpopupEmail() {
        $("#" + Global.Element.popupEmail).modal({
            keyboard: false,
            show: false
        });
        $("#" + Global.Element.popupEmail + ' button[save]').click(function () {
            Global.Data.UserInfoModel.Status = 3;
            if (CheckValidateEmail()) {
                SaveUser();
                $("#" + Global.Element.popupEmail).modal("hide");
                window.location.href = "/UserProFile/Index";
            }
        });
        $("#" + Global.Element.popupEmail + ' button[cancel]').click(function () {
            $("#" + Global.Element.popupEmail).modal("hide");
        });
    }

    function ShowPopupUser() {
        $('#' + Global.Element.PopupUser).modal('show');
    }
    function ShowPopupEmail() {
        $('#' + Global.Element.popupEmail).modal('show');
    }
    function ShowPopupPassWord() {
        $('#' + Global.Element.popupPassWord).modal('show');
    }
    function CheckValidateEmail() {
        if ($('#OldEmail').val() != $('#NewEmail').val()) {
            GlobalCommon.ShowMessageDialog("Vui Lòng Xác Nhận Đúng Email.", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        else {
            return true;
        }
    }
    function CheckValidatePassWord() {
        if ($('#PassWord').val().trim() != $('#RePassWord').val().trim()) {
            GlobalCommon.ShowMessageDialog("Vui Lòng Xác Nhận Đúng Mật Khẩu.", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        return true;
    }
}
$(document).ready(function () {
    var User = new GPRO.User();
    User.Init();
})
function isNumberKey(evt) {
    var charCode = (evt.which) ? evt.which : event.keyCode;
    if (charCode == 59 || charCode == 46)
        return true;
    if (charCode > 31 && (charCode < 48 || charCode > 57))
    { GlobalCommon.ShowMessageDialog("Vui lòng nhập số.", function () { }, "Lỗi Nhập liệu"); }
}