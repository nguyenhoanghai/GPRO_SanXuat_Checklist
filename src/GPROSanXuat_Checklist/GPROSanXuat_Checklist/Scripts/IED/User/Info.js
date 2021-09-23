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
            ChangeAvatar: '/User/ChangeAvatar',
            ChangeInfo: '/User/ChangeInfo',
            ChangePass: '/User/ChangePass',
        },
    }
    this.GetGlobal = function () {
        return Global;
    }

    this.Init = function () {
        RegisterEvent();
    }
    var RegisterEvent = function () {
        $('#info input,#btnSave,#pass,#btnSavePass,#btnCancel').hide();
        $('#btnChange').click(function () {
            $('abc,#btnChange,#btnPass').hide();
            $('#info input ,#btnSave,#btnCancel').show();
        });

        $('#btnPass').click(function () {
            $('#info,#btnSave,#btnPass,#btnChange').hide();
            $('#pass,#btnSavePass,#btnCancel').show();
        });

        $('#btnCancel').click(function () {
            $('#info input,#btnSave,#pass,#btnSavePass,#btnCancel').hide();
            $('abc,#info,#btnChange,#btnPass').show();
        });

        $('#btnUpload').click(function () {
            $('#uploadControl').click();
        });

        $('#uploadControl').change(function () {
            SaveSingleFile('uploadControl', 'uploadHidden');
        });

        $('#uploadHidden').change(function () {
            $('#avatar').attr('src', $(this).val());
            ChangeAvatar();
        });

        $('#btnSave').click(function () {
            ChangeInfo();
        });

        $('#btnSavePass').click(function () {
            ChangePass();
        });
    }

    function ChangeAvatar() {
        $.ajax({
            url: Global.UrlAction.ChangeAvatar,
            type: 'POST',
            data: JSON.stringify({ 'img': $('#uploadHidden').val().trim() }),
            contentType: 'application/json charset=utf-8',
            beforeSend: function () { $('#loading').show(); },
            success: function (data) {
                GlobalCommon.CallbackProcess(data, function () {
                    if (data.Result == "OK")
                        alert('thay doi thanh cong');
                    $('#loading').hide();
                }, false, '', true, true, function () {
                    var msg = GlobalCommon.GetErrorMessage(data);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
                });
            }
        });
    }

    function ChangeInfo() {
        $.ajax({
            url: Global.UrlAction.ChangeInfo,
            type: 'POST',
            data: JSON.stringify({ 'mail': $('#email').val(), 'first': $('#first').val(), 'last': $('#last').val() }),
            contentType: 'application/json charset=utf-8',
            beforeSend: function () { $('#loading').show(); },
            success: function (data) {
                GlobalCommon.CallbackProcess(data, function () {
                    if (data.Result == "OK") {
                        alert('Thay đổi thành công');
                        location.reload();
                    }
                    $('#loading').hide();
                }, false, '', true, true, function () {
                    var msg = GlobalCommon.GetErrorMessage(data);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
                });
            }
        });
    }

    function ChangePass() {
        $.ajax({
            url: Global.UrlAction.ChangePass,
            type: 'POST',
            data: JSON.stringify({ 'oldPass': $('#oldPass').val(), 'newPass': $('#newPass').val(), }),
            contentType: 'application/json charset=utf-8',
            beforeSend: function () { $('#loading').show(); },
            success: function (data) {
                if (data.Result == "OK") {
                    alert('Thay đổi thành công');
                    $('#btnCancel').click();
                }
                else
                    GlobalCommon.ShowMessageDialog(data.ErrorMessages[0].Message, function () { }, "Đã có lỗi xảy ra.");
                $('#loading').hide();
            }
        });
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
});