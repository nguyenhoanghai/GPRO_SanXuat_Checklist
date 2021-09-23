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
GPRO.namespace('Authenticate');
GPRO.Authenticate = function () {
    var Global = {
        UrlAction: {
            AuthenticateLogin: '/Authenticate/LoginAction',
            AuthenticateLostPassword: '/Authenticate/RequestPassword'
        }
    }
    this.GetGlobal = function () {
        return Global;
    }

    this.Init = function () {
        RegisterEvent();
    }

    var RegisterEvent = function () {
        $('[btn="Login"]').click(function () {
            if (checkValidate()) {
                Login();
            }
        });

        $('#refresh').click(function () { getCaptcha(); });

        // goi funtion tao captcha ban dau
        getCaptcha();

        $('[btn="sendRequest"]').click(function () {
            if ($('#autoEmail').hasClass('active')) {
                if ($('#txtEmailUserName').val() == '' || $('#txtEmail').val() == '') {
                    GlobalCommon.ShowMessageDialog("Tên Đăng Nhập và Email không được trống. Vui lòng kiểm tra lại.", function () { }, "Lỗi Nhập Liệu.");
                }
                else {
                    SendUserRequest($('#txtEmailUserName').val(), $('#txtEmail').val(), 1);
                }
            }
            else {
                if ($('#txtAdminUserName').val() == '' || $('#txtUserNote').val() == '') {
                    GlobalCommon.ShowMessageDialog("Tên Đăng Nhập và Email không được trống. Vui lòng kiểm tra lại.", function () { }, "Lỗi Nhập Liệu.");
                }
                else {
                    SendUserRequest($('#txtAdminUserName').val(), $('#txtUserNote').val(), 2);
                }
            }
        });

        $('body').keypress(function (event) {
            if (event.which == 13) {
                $('[btn="Login"]').click();
                return false;
            }
        });
    }

    function Login() {
        $.ajax({
            url: Global.UrlAction.AuthenticateLogin,
            type: 'POST',
            data: JSON.stringify({ 'userName': $('#username').val(), 'password': $('#password').val() }),
            contentType: 'application/json charset=utf-8',
            beforeSend: function () { $('#loading').show(); },
            success: function (data) {
                $('#loading').hide();
                if (data.Result == "ERROR") {
                    if (data.Data == true) {
                        $('#captchaBox').show();
                    }
                    else {
                        $('#captchaBox').hide();
                    }
                    //var msg = GlobalCommon.GetErrorMessage(data);
                    //GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
                    getCaptcha();
                    $('#password').val('');
                    $('#captchaAnswer').val('');
                }
                else {
                    location.href = data.Data;
                }
            }
        });
    }

    function SendUserRequest(userName, mailOrNote, actionRequest) {
        $.ajax({
            url: Global.UrlAction.AuthenticateLostPassword,
            type: 'POST',
            data: JSON.stringify({ 'userName': userName, 'emailOrNote': mailOrNote, 'actionRequest': actionRequest }),
            contentType: 'application/json charset=utf-8',
            beforeSend: function () { $('#loading').show(); },
            success: function (data) {
                $('#loading').hide();
                var msg = GlobalCommon.GetErrorMessage(data);
                if (data.Result == "ERROR") {
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
                }
                else {
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Gửi Yêu Cầu Thành Công.");
                }
            }
        });
    }

    // gọi ajax làm mới captcha
    function getCaptcha() {
        $.ajax({
            type: "GET",
            url: '/Captchar/getcaptcha',
            cache: false,
            success: function (data) {
                if (data.captcha != '' && data.captcha != undefined) {
                    $("#CaptchaImg").attr('src', 'data:image/png;base64,' + data.captcha);
                } else {
                    alert("co loi xay ra!");
                }
            }
        });
    }

    function checkValidate() {
        if ($('#username').val().trim() == '') {
            GlobalCommon.ShowMessageDialog("Tên đăng nhập không được trống.", function () { }, "Lỗi Nhập Liệu.");
            $('#username').focus();
            return false;
        }
        else if ($('#password').val().trim() == '') {
            GlobalCommon.ShowMessageDialog("Mật khẩu không được trống.", function () { }, "Lỗi Nhập Liệu.");
            $('#password').focus();
            return false;

        }
        else {
            if ($('#captchaBox').css('display') == 'block') {
                if ($('#captchaAnswer').val() == '') {
                    GlobalCommon.ShowMessageDialog("Bạn chưa nhập mã xác nhận.", function () { }, "Lỗi Nhập Liệu.");
                    $('#captchaAnswer').focus();
                    return false;
                }
                return true;
            }
            return true;
        }


    }
}

$(document).ready(function () {
    var Authenticate = new GPRO.Authenticate();
    Authenticate.Init();
})