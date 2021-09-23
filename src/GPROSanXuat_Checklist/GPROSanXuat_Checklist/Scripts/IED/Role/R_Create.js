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

GPRO.namespace('Role');
GPRO.Role = function () {
    var Global = {
        UrlAction: {
            SaveRole: '/Role/Save'
        },
        Element: {
            PermissionOfRole: 'checkPermissions'
        },
        Data: {
            ModelRole: {}
        }
    }
    this.GetGlobal = function () {
        return Global;
    }
    this.Init = function () {
        RegisterEvent();
        //BindData(null);
    }
    this.reloadListRole = function () {
        ReloadListRole();
    }
    this.initViewModel = function (role) {
        InitViewModel(role);
    }
    this.bindData = function (role) {
        BindData(role);
    }
    var RegisterEvent = function () {
        $('[btn="save"]').click(function () {
            if (CheckValidate()) {
                SaveRole();
            }
        });
        // checkbox check all event
        $('input[cmd="checkAll"]').change(function () {
            var $feature = $($($(this).parent().parent()).find('ul'));
            var permissions = $feature.find('input');
            if ($(this).prop('checked') == true) {
                $.each(permissions, function (i, v) {
                    $(v).prop('checked', 'checked');
                })
            }
            else {
                $.each(permissions, function (i, v) {
                    $(v).prop('checked', '');
                })
            }
        });
        // uncheckAll if one of the children are uncheck
        $('input[cmd="permission"]').change(function () {
            if (!$(this).prop('checked')) {
                var id = $(this).attr('name');
                var parent = $($($(this).parent().parent().parent().parent()).find('input[cmd="checkAll"]'));
                parent.prop('checked', '');
            }
        });
    }

    function InitViewModel(role) {
        var roleViewModel = {
            Id: 0,
            RoleName: '',
            Decription: '',
            IsSystem: false
        }
        if (role != null) {
            roleViewModel = {
                Id: ko.observable(role.Id),
                RoleName: ko.observable(role.RoleName),
                Decription: ko.observable(role.Decription),
                IsSystem: ko.observable(role.IsSystem)
            };
        }
        return roleViewModel;
    }

    function SaveRole() {
        var listPermission = [];
        $('[cmd="' + Global.Element.PermissionOfRole + '"]').find('input[cmd="permission"]').each(function (i, item) {
            if ($(this).prop('checked')) {
                listPermission.push($(this).val());
            }
        });
        var id = $('#id').val();
        var roleName = $('#roleName').val();
        var description = $('#description').val();
        $.ajax({
            url: Global.UrlAction.SaveRole,
            type: 'post',
            data: JSON.stringify({ 'id': id, 'roleName': roleName, 'description': description, 'listPermission': listPermission }),
            contentType: 'application/json',
            beforeSend: function () { $('#loading').show(); },
            success: function (result) {
                $('#loading').hide();
                GlobalCommon.CallbackProcess(result, function () {
                    if (result.Result == "OK") {
                      //  window.location.href = "/Role/Index";
                        GlobalCommon.ShowMessageDialog("Lưu thành công.", function () { }, "Thông báo");
                    }
                    else
                        GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình sử lý.");
                }, false, Global.Element.PopupModule, true, true, function () {
                    var msg = GlobalCommon.GetErrorMessage(result);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình sử lý.");
                });
            }
        });
    }

    function CheckValidate() {
        if ($('#roleName').val() == "") {
            GlobalCommon.ShowMessageDialog("Vui lòng nhập tên Nhóm Quyền.", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        return true;
    }
}

$(document).ready(function () {
    var Role = new GPRO.Role();
    Role.Init();
})

