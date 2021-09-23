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

GPRO.namespace('Menu');
GPRO.Menu = function () {
    var Global = {
        UrlAction: {
            GetListMenu: '/Menu/Gets',
            SaveMenu: '/Menu/Save',
            DeleteMenu: '/Menu/Delete',
        },
        Element: {
            JtableMenu: 'jtableMenu',
            PopupMenu: 'menupopup',
            Search: 'menuSearch_Popup'
        },
        Data: {
            ModelMenu: {},
            UploadFile: null
        }
    }
    this.GetGlobal = function () {
        return Global;
    }

    this.Init = function () {
        RegisterEvent();
        InitListMenu();
        ReloadListMenu();
        BindData(null);
        InitPopup();
        $('#Module').change();
    }

    this.reloadListMenu = function () {
        ReloadListMenu();
    }

    this.initViewModel = function (menu) {
        InitViewModel(menu);
    }

    this.bindData = function (menu) {
        BindData(menu);
    }

    var RegisterEvent = function () {

        $('#searchBy').change(function () {
            switch ($('#searchBy').val()) {
                case '1':
                case '3':
                    $('#key').show();
                    $('#cate').hide();
                    $('#modu').hide();
                    break;
                case '2':
                    $('#key').hide();
                    $('#cate').show();
                    $('#modu').hide();
                    break;
                case '4':
                    $('#key').hide();
                    $('#cate').hide();
                    $('#modu').show();
                    break;
            }
        })

        $('[close]').click(function () {
          
        });


        $('[search]').click(function () {
            if ($('#Menu').hasClass('active')) {
                if ($('#searchBy').val() == '')
                    GlobalCommon.ShowMessageDialog("Bạn chưa chọn kiểu tìm kiếm.", function () { }, "Lỗi Nhập liệu");
                else if (($('#searchBy').val() == '1' || $('#searchBy').val() == '3') && $('#keyword').val().trim() == '')
                    GlobalCommon.ShowMessageDialog("Bạn chưa nhập từ khóa cần tìm.", function () { }, "Lỗi Nhập liệu");
                else if ($('#searchBy').val() == '2' && $('[select = "cateId"]').val() == '0')
                    GlobalCommon.ShowMessageDialog("Bạn chưa chọn tên Nhóm Danh Mục.", function () { }, "Lỗi Nhập liệu");
                else if ($('#searchBy').val() == '4' && $('[select = "moduId"]').val() == '0')
                    GlobalCommon.ShowMessageDialog("Bạn chưa chọn tên Hệ Thống.", function () { }, "Lỗi Nhập liệu");
                else {
                    ReloadListMenu();
                    ResetData();
                    $('#searchBy').val('')
                    $('#keyword').val('');
                    $('[select = "cateId"]').val('0');
                    $('[select = "moduId"]').val('0');
                }
            }
        });

        $('#Module').change(function () {
            GetCategoriesSelect($(this).val(), 'categoryid', 0);
        })

    }

    function InitViewModel(menu) {
        var menuViewModel = {
            Id: 0,
            MenuName: '',
            MenuCategoryId: 0,
            CategoryName: '',
            OrderIndex: 0,
            Link: '',
            IsShow: true,
            Icon: '',
            IsViewIcon: true,
            Description: '',
            ModuleId: 0,
            ModuleName: ''
        }
        if (menu != null) {
            menuViewModel = {
                Id: ko.observable(menu.Id),
                MenuName: ko.observable(menu.MenuName),
                MenuCategoryId: ko.observable(menu.MenuCategoryId),
                CategoryName: ko.observable(menu.CategoryName),
                OrderIndex: ko.observable(menu.OrderIndex),
                Link: ko.observable(menu.Link),
                IsShow: ko.observable(menu.IsShow),
                Icon: ko.observable(menu.Icon),
                IsViewIcon: ko.observable(menu.IsViewIcon),
                Description: ko.observable(menu.Description),
                Module: ko.observable(menu.ModuleId),
                ModuleName: ko.observable(menu.ModuleName)
            };
        }
        return menuViewModel;
    }

    function BindData(menu) {
        Global.Data.ModelMenu = InitViewModel(menu);
        ko.applyBindings(Global.Data.ModelMenu, document.getElementById(Global.Element.PopupMenu));
    }

    function InitListMenu() {
        $('#' + Global.Element.JtableMenu).jtable({
            title: 'Quản Lý Danh Mục',
            paging: true,
            pageSize: 1000,
            pageSizeChange: true,
            sorting: true,
            selectShow: false,
            actions: {
                listAction: Global.UrlAction.GetListMenu,
                createAction: Global.Element.PopupMenu,
                createObjDefault: InitViewModel(null), 
            },
            messages: {
                addNewRecord: 'Thêm dữ liệu', 
            },
            searchInput: {
                id: 'keyword',
                className: 'search-input',
                placeHolder: 'Nhập từ khóa ...',
                keyup: function (evt) {
                    if (evt.keyCode == 13)
                        ReloadList_();
                }
            },
            fields: {
                Id: {
                    key: true,
                    create: false,
                    edit: false,
                    list: false
                },
                MenuName: {
                    visibility: 'fixed',
                    title: "Tên Danh Mục",
                    width: "20%",
                },
                ModuleName: {
                    title: 'Hệ Thống',
                    width: ' 20%'
                },
                CategoryName: {
                    title: "Tên Nhóm Danh Mục",
                    width: "20%",
                },
                Link: {
                    title: "Đường dẫn",
                    width: "20%",
                },
                OrderIndex: {
                    title: "Vị trí",
                    width: "3%",
                },
                //IsShow: {
                //    title: "hiện Danh Mục",
                //    width: "3%",
                //    display: function (data) {
                //        var elementDisplay = "";
                //        if (data.record.IsShow)
                //        { elementDisplay = "<input  type='checkbox' checked='checked' disabled/>"; }
                //        else {
                //            elementDisplay = "<input  type='checkbox' disabled />";
                //        }
                //        return elementDisplay;
                //    }
                //},
                //Icon: {
                //    title: "Icon",
                //    width: "3%",
                //    display: function (data) {
                //        if (data.record.Icon != null) {
                //            var text = $('<img src="' + data.record.Icon + '" style="width : 20px"  />');
                //            return text;
                //        }
                //    }
                //},
                edit: {
                    title: '',
                    width: '1%',
                    sorting: false,
                    display: function (data) {
                        var text = $('<i data-toggle="modal" data-target="#' + Global.Element.PopupMenu + '" title="Chỉnh sửa thông tin" class="fa fa-pencil-square-o clickable blue"  ></i>');
                        text.click(function () { 
                            $('#Module').val(data.record.ModuleId);
                            GetCategoriesSelect(data.record.ModuleId, 'categoryid', data.record.MenuCategoryId);
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

    function ReloadListMenu() { 
        $('#' + Global.Element.JtableMenu).jtable('load', { 'keyword': $('#keyword').val() });
       }

    function InitPopup() {
        $('#' + Global.Element.PopupMenu + ' button[save]').click(function () {
            if (CheckValidate()) {
                SaveMenu();
            }
        });

        $('#' + Global.Element.PopupMenu + ' button[cancel]').click(function () {
            $("#" + Global.Element.PopupMenu).modal("hide");
            $('#key').hide();
            $('#cate').hide();
            $('#modu').hide();
            $('#keyword').val('');
            //$('#S_Position').val(1);
            $('#searchBy').val('');
            $('[select = "categoryId"]').val('0');
            $('[select = "moduleId"]').val('0');
            BindData(null);
        });
    }
     
    function SaveMenu() {
        Global.Data.ModelMenu.MenuCategoryId = $('#MenuCategory').val();
        Global.Data.ModelMenu.ModuleId = $('#Module').val();
        Global.Data.ModelMenu.Icon = ''; // $('[filelist]').val();
        $.ajax({
            url: Global.UrlAction.SaveMenu,
            type: 'post',
            data: ko.toJSON(Global.Data.ModelMenu),
            contentType: 'application/json',
            beforeSend: function () { $('#loading').show(); },
            success: function (result) {
                $('#loading').hide();
                GlobalCommon.CallbackProcess(result, function () {
                    $('#myModal').modal('hide');
                    if (result.Result == "OK") {
                        ReloadListMenu();
                        $('#' + Global.Element.PopupMenu + ' button[cancel]').click();
                    }
                    else {
                        GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình sử lý.");
                    }
                }, false, Global.Element.PopupModule, true, true, function () {
                    var msg = GlobalCommon.GetErrorMessage(result);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình sử lý.");
                });
            }
        });
    }

    function Delete(Id) {
        $.ajax({
            url: Global.UrlAction.DeleteMenu,
            type: 'POST',
            data: JSON.stringify({ 'id': Id }),
            contentType: 'application/json charset=utf-8',
            beforeSend: function () { $('#loading').show(); },
            success: function (data) {
                $('#loading').hide();
                GlobalCommon.CallbackProcess(data, function () {
                    if (data.Result == "OK") {
                        ReloadListMenu();
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
        if ($('[txt="menuName"]').val() == "") {
            GlobalCommon.ShowMessageDialog("Vui lòng nhập Tên Danh Mục.", function () { }, "Lỗi Nhập liệu");
            return false;
        } else if ($('#Module').val() == "0") {
            GlobalCommon.ShowMessageDialog("Vui lòng Hệ Thống cho Danh Mục.", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        else if ($('#MenuCategory').val() == "0") {
            GlobalCommon.ShowMessageDialog("Vui lòng chọn Nhóm danh Mục.", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        return true;
    }
     
}

$(document).ready(function () {
    var Menu = new GPRO.Menu();
    Menu.Init();
})
