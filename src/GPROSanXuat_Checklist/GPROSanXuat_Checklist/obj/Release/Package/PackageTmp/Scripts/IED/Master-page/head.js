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
GPRO.namespace('Head');
GPRO.Head = function () {
    var Global = {
        UrlAction: {
            ChangePassword:'/user/ChangePass',
            ChangeInfo: '/user/ChangeInfo'
        },
        Element: {
            PopupChangePass: 'popup-user-change-pass',
            PopupUserInfo: 'popup_userInfo'
        },
        Data: {

        }
    }
    this.GetGlobal = function () {
        return Global;
    }

    this.Init = function () {
        RegisterEvent();
        InitPopupChangePass();
        InitPopupInfo();
    }


    var RegisterEvent = function () {
        $('#Logout').click(function () {
            window.location.href = '/Authenticate/Logout';
        });

        $('[btn="userProfile"]').click(function () {
            window.location.href = '/UserProFile/Index';
        });


        $('#p-file-upload').change(function () {
            readURL(this, 'img-avatar');
        });

        $('#p-btn-file-upload').click(function () {
            $('#p-file-upload').click();
        });

        // Register event after upload file done the value of [filelist] will be change => call function save your Data 
        $('#p-file-upload').select(function () {
            UpdateInfo();
        });

    }

    function UpdateInfo( ) { 
        $.ajax({
            url: Global.UrlAction.ChangeInfo,
            type: 'post',
            data: JSON.stringify({ 'name': $('#ui-name').val(), 'email': $('#ui-email').val(), 'avatar': $('#p-file-upload').attr('newurl') }),
            contentType: 'application/json',
            beforeSend: function () { $('#loading').show(); },
            success: function (result) {
                $('#loading').hide();
                GlobalCommon.CallbackProcess(result, function () {
                    if (result.Result == "OK") { 
                        window.location.reload();                             
                    }
                }, false, Global.Element.PopupLine, true, true, function () {
                    var msg = GlobalCommon.GetErrorMessage(result);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình xử lý.");
                });
            }
        });
    }
     
    function InitPopupInfo() {
        $("#" + Global.Element.PopupUserInfo).modal({
            keyboard: false,
            show: false
        });

        $("#" + Global.Element.PopupUserInfo + ' button[ui-save]').click(function () {
            var _firstName = $('#ui-name').val(); 
            if (_firstName == undefined || _firstName == '') {
                GlobalCommon.ShowMessageDialog("Vui lòng nhập họ tên.", function () { $('#ui-first-name').focus(); }, "Lỗi Nhập liệu");
                return false;
            } 
            else
                if ($('#p-file-upload').val() != '')
                    UploadPicture("p-file-upload", 'p-file-upload');
                else {
                    UpdateInfo( );
                }
        });

        $("#" + Global.Element.PopupUserInfo + ' button[ui-close]').click(function () {
            $("#" + Global.Element.PopupUserInfo).modal("hide");            
            $('div.divParent').attr('currentPoppup', '');
        });
    }
      
    function InitPopupChangePass() {
        $("#" + Global.Element.PopupChangePass).modal({
            keyboard: false,
            show: false
        });

        $("#" + Global.Element.PopupChangePass + ' button[save-change-pass]').click(function () {
            var oldPass = $('#user-old-pass').val();
            var newPass = $('#user-new-pass').val();
            var newCFPass = $('#user-cf-old-pass').val();
            if (oldPass == undefined || oldPass == '') {
                GlobalCommon.ShowMessageDialog("Vui lòng nhập mật khẩu cũ.", function () { $('#user-old-pass').focus(); }, "Lỗi Nhập liệu");
                return false;
            }
            else if (newPass == undefined || newPass == '') {
                GlobalCommon.ShowMessageDialog("Vui lòng nhập mật khẩu mới.", function () { $('#user-old-pass').focus(); }, "Lỗi Nhập liệu");
                return false;
            }
            else if (newCFPass == undefined || newCFPass == '') {
                GlobalCommon.ShowMessageDialog("Vui lòng nhập xác nhận mật khẩu mới.", function () { $('#user-old-pass').focus(); }, "Lỗi Nhập liệu");
                return false;
            }
            else if (newCFPass !== newPass) {
                GlobalCommon.ShowMessageDialog("Xác nhận mật khẩu mới không khớp.", function () { $('#user-old-pass').focus(); }, "Lỗi Nhập liệu");
                return false;
            }
            else
                ChangePassword(oldPass, newPass);
        });

        $("#" + Global.Element.PopupChangePass + ' button[close-change-pass]').click(function () {
            $("#" + Global.Element.PopupChangePass).modal("hide");
            $('#user-old-pass').val('');
           $('#user-new-pass').val('');
              $('#user-cf-old-pass').val('');
        });
    }

    ChangePassword = (oldPass, newPass) => {
        $.ajax({
            url: Global.UrlAction.ChangePassword,
            type: 'POST',
            data: JSON.stringify({ 'oldPass': oldPass, 'newPass': newPass }),
            contentType: 'application/json charset=utf-8',
            beforeSend: function () { $('#loading').show(); },
            success: function (data) {
                $('#loading').hide();
                GlobalCommon.CallbackProcess(data, function () {
                    if (data.Result == "OK") {
                        $('#Logout').click();
                    }
                }, false, Global.Element.PopupLine, true, true, function () {
                    var msg = GlobalCommon.GetErrorMessage(data);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
                });
            }
        });
    }

}
$(document).ready(function () {
    var obj = new GPRO.Head();
    obj.Init();
});