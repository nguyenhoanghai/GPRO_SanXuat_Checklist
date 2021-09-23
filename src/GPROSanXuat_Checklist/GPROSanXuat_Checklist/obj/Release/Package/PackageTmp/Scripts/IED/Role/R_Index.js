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
            GetListRole: '/Role/Gets',
            CreateRole: '/Role/Create',
            DeleteRole: '/Role/Delete'
        },
        Element: {
            JtableRole: 'jtableRole'
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
        InitListRole();
        ReloadListRole();
        BindData(null);
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
    function BindData(role) {
        Global.Data.ModelRole = InitViewModel(role);
        ko.applyBindings(Global.Data.ModelRole);
    }

    function InitListRole() {
        $('#' + Global.Element.JtableRole).jtable({
            title: 'Quản Lý Nhóm Quyền',
            paging: true,
            pageSize: 1000,
            pageSizeChange: true,
            sorting: true,
            selectShow: true,
            actions: {
                listAction: Global.UrlAction.GetListRole,
                searchAction: Global.Element.PopupRole,
                createActionUrl: Global.UrlAction.CreateRole
            },
            messages: {
                searchRecord: 'Tìm kiếm',
                selectShow: 'Ẩn hiện cột',
                addNewRecord: 'Thêm Nhóm Quyền',
            },
            fields: {
                Id: {
                    key: true,
                    create: false,
                    edit: false,
                    list: false
                },
                RoleName: {
                    visibility: 'fixed',
                    title: "Tên Nhóm Quyền",
                    width: "20%",
                    display: function (data) {
                        var text = $('<a class="SystemClass" title="Đây là quyền Hệ Thống.\nBạn không được thao tác trên Quyền Hệ Thống">' + data.record.RoleName + '</a>');;
                        if (!data.record.IsSystem) {
                            text = $('<a class="  bold blue" data-toggle="modal" data-target="#myModal" title="Chỉnh sửa thông tin Quyền Tài Khoản">' + data.record.RoleName + '</a>');
                            //text.click(function () {
                            //    window.location.href = Global.UrlAction.CreateRole + '/' + data.record.Id;
                            //});
                        }
                        return text;
                    }
                },
                IsSystem: {
                    title: "Quyền Hệ Thống",
                    width: "3%",
                    display: function (data) {
                        var elementDisplay = "";
                        if (data.record.IsSystem) { elementDisplay = "<input  type='checkbox' checked='checked' disabled/>"; }
                        else {
                            elementDisplay = "<input  type='checkbox' disabled />";
                        }
                        return elementDisplay;
                    }
                },
                Decription: {
                    title: "Mô Tả",
                    width: "20%",
                },
                edit: {
                    title: '',
                    width: '1%',
                    sorting: false,
                    display: function (data) {
                        if (!data.record.IsSystem) {
                            var text = $('<i title="Chỉnh sửa thông tin" class="fa fa-pencil-square-o clickable blue"  ></i>');
                            text.click(function () {
                                var win = window.open((Global.UrlAction.CreateRole + '/' + data.record.Id), '_blank');
                                win.focus();
                            });
                            return text;
                        }
                    }
                },
                Delete: {
                    title: '',
                    width: "3%",
                    sorting: false,
                    display: function (data) {
                        var text = '';
                        if (!data.record.IsSystem) {
                            text = $('<button title="Xóa" class="jtable-command-button jtable-delete-command-button"><span>Xóa</span></button>');
                            text.click(function () {
                                GlobalCommon.ShowConfirmDialog('Bạn có chắc chắn muốn xóa?', function () {
                                    Delete(data.record.Id);
                                }, function () { }, 'Đồng ý', 'Hủy bỏ', 'Thông báo');
                            });
                        }
                        return text;
                    }
                }
            }
        });
    }
    function ReloadListRole() {
        var keySearch = $('#txtSearch').val();
        $('#' + Global.Element.JtableRole).jtable('load', { 'keyword': keySearch });
    }
    function Delete(Id) {
        $.ajax({
            url: Global.UrlAction.DeleteRole,
            type: 'POST',
            data: JSON.stringify({ 'id': Id }),
            contentType: 'application/json charset=utf-8',
            beforeSend: function () { $('#loading').show(); },
            success: function (data) {
                $('#loading').hide();
                GlobalCommon.CallbackProcess(data, function () {
                    if (data.Result == "OK") {
                        ReloadListRole();
                    }
                    else
                        GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình sử lý.");
                }, false, Global.Element.PopupModule, true, true, function () {
                    var msg = GlobalCommon.GetErrorMessage(data);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình xóa.");
                });
            }
        });
    }
    function CheckValidate() {
        if ($('[txt="RoleName"]').val() == "") {
            GlobalCommon.ShowMessageDialog("Vui lòng nhập tên Role.", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        else if ($('[select="categoryId"]').val() == "0") {
            GlobalCommon.ShowMessageDialog("Vui lòng chọn Role Category.", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        return true;
    }
}
$(document).ready(function () {
    var Role = new GPRO.Role();
    Role.Init();
})

