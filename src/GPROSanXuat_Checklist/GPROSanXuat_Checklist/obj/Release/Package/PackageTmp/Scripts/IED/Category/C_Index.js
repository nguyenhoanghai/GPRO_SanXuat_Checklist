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

GPRO.namespace('MenuCategory');
GPRO.MenuCategory = function () {
    var Global = {
        UrlAction: {
            Gets: '/Category/Gets',
            Save: '/Category/Save',
            Delete: '/Category/Delete',
            Search: '/Category/Search',

            Gets_: '/Category/Gets_',
            Save_: '/Category/Save_'
        },
        Element: {
            Jtable: 'jtableCategory',
            Jtable_: 'jtableSystemCategory',
            popupAdd: 'categoryModal',
            popupAdd_: 'SystemCategoryModal',
            popupSearch: 'Search_Popup'
        },
        Data: {

        }
    }
    this.GetGlobal = function () {
        return Global;
    }

    this.Init = function () {
        RegisterEvent();
        InitPopup()
        InitList();
        ReloadList();
        InitList_();
    }


    var RegisterEvent = function () {
        $('[search]').click(function () {
            if ($('#Category').hasClass('active')) {

                ReloadListMenuCategory();
                ResetData();
            }
        });

        $('[liCategory]').click(function () {
            ReloadList();
        });

        $('[liCategorySystem]').click(function () {
            ReloadList_();
        });
    }

    function InitPopup() {
        $('#' + Global.Element.popupAdd + ' button[saveCategory]').click(function () {
            Save();
        });

        $('#' + Global.Element.popupAdd + ' button[cancel]').click(function () {
            $("#" + Global.Element.popupAdd).modal("hide");
            $('[txt="menuId"]').val(0);
            $('[txt="categoryName"]').val('');
            $('[order]').val(0);
            $('[des]').val('');
            $('[link]').val('');
            $('[select="moduleId"]').val(0);
        });
    }

    function Save() {
        var obj = {
            Id: $('[txt="menuId"]').val(),
            Name: $('[txt="categoryName"]').val(),
            Position: 'LEFT',
            OrderIndex: $('[order]').val(),
            Description: $('[des]').val(),
            Icon: '',
            IsViewIcon: true,
            Link: $('[link]').val(),
            ModuleId: $('[select="moduleId"]').val()
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
                        $('#' + Global.Element.popupAdd + ' button[cancel]').click();
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

    function InitList() {
        $('#' + Global.Element.Jtable).jtable({
            title: 'Danh Sách Nhóm Danh Mục',
            paging: true,
            pageSize: 1000,
            pageSizeChange: true,
            sorting: true,
            selectShow: false,
            actions: {
                listAction: Global.UrlAction.Gets,
                createAction: Global.Element.popupAdd 
            },
            messages: {
                addNewRecord: 'Thêm mới' 
            },
            searchInput: {
                id: 'keyword',
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
                Name: {
                    visibility: 'fixed',
                    title: "Tên Nhóm Danh Mục",
                    width: "20%",
                },
                ModuleName: {
                    title: 'Hệ Thống',
                    width: ' 20%'
                },
                Position: {
                    title: "Vị Trí",
                    width: "20%",
                    options: { 'LEFT': 'Bên Trái', 'TOP': 'Bên Trên' }
                },
                OrderIndex: {
                    title: "Số TT",
                    width: "5%",
                },
                Link: {
                    title: "Đường dẫn",
                    width: "20%",
                },
                Icon: {
                    title: "Icon",
                    width: "5%",
                    display: function (data) {
                        if (data.record.Icon != null) {
                            var text = $('<img src="' + data.record.Icon + '" style="width : 20px"/>');
                            return text;
                        }
                    }
                },
                IsViewIcon: {
                    title: "ẩn Icon",
                    width: "5%",
                    display: function (data) {
                        var elementDisplay = "";
                        if (data.record.IsViewIcon) { elementDisplay = "<input  type='checkbox' checked='checked' disabled/>"; }
                        else {
                            elementDisplay = "<input  type='checkbox' disabled />";
                        }
                        return elementDisplay;
                    }
                },
                Description: {
                    title: "Mô tả",
                    width: "20%",
                    type: 'textModule',
                    list: false
                },
                edit: {
                    title: '',
                    width: '1%',
                    sorting: false,
                    display: function (data) {
                        var text = $('<i data-toggle="modal" data-target="#' + Global.Element.popupAdd + '" title="Chỉnh sửa thông tin" class="fa fa-pencil-square-o clickable blue"  ></i>');
                        text.click(function () {
                            $('[txt="menuId"]').val(data.record.Id);
                            $('[txt="categoryName"]').val(data.record.Name);
                            $('[order]').val(data.record.OrderIndex);
                            $('[des]').val(data.record.Description);
                            $('[link]').val(data.record.Link);
                            $('[select="moduleId"]').val(data.record.ModuleId);
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
        $('#' + Global.Element.Jtable).jtable('load', { 'keyword': $('#keyword').val() }); 
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
                        GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình sử lý.");
                }, false, Global.Element.PopupMenu, true, true, function () {
                    var msg = GlobalCommon.GetErrorMessage(data);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
                    ReloadListMenuCategory();
                });
            }
        });
    }

    function CheckValidate() {
        if ($('[txt="categoryName"]').val() == "") {
            GlobalCommon.ShowMessageDialog("Vui lòng nhập tên Nhóm Danh Mục.", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        else if ($('#Module').val() == "0") {
            GlobalCommon.ShowMessageDialog("Vui lòng chọn Hệ Thống.", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        return true;
    }




    /***********************************************/
    function InitPopup_() {
        $('#' + Global.Element.popupAdd_ + ' button[saveCategory]').click(function () {
            Save();
        });

        $('#' + Global.Element.popupAdd_ + ' button[cancel]').click(function () {
            $("#" + Global.Element.popupAdd_).modal("hide");
            $('[txt="menuId"]').val(0);
            $('[txt="categoryName"]').val('');
            $('[order]').val(0);
            $('[des]').val('');
            $('[link]').val('');
            $('[select="moduleId"]').val(0);
        });
    }

    function SaveSystemCategory() {
        Global.Data.ModelsystemCategory.Position = $('#SysPosition').val();
        Global.Data.ModelsystemCategory.Icon = $('[SystemFileList]').val();
        $.ajax({
            url: Global.UrlAction.SaveSystemCategory,
            type: 'post',
            data: ko.toJSON(Global.Data.ModelsystemCategory),
            contentType: 'application/json',
            beforeSend: function () { $('#loading').show(); },
            success: function (result) {
                $('#loading').hide();
                GlobalCommon.CallbackProcess(result, function () {
                    if (result.Result == "OK") {
                        ReloadList_();
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

    function InitList_() {
        $('#' + Global.Element.Jtable_).jtable({
            title: 'Danh sách nhóm danh mục hệ thống',
            //paging: true,
            //pageSize: 50,
            //pageSizeChange: true,
            sorting: true,
            selectShow: false,
            actions: {
                listAction: Global.UrlAction.Gets_  
            },
            messages: { 
            },
            searchInput: {
                id: 's-keyword',
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
                Name: {
                    visibility: 'fixed',
                    title: "Tên Nhóm Danh Mục",
                    width: "20%",
                },
                ModuleName: {
                    title: 'Hệ Thống',
                    width: ' 20%'
                },
                Position: {
                    title: "Vị Trí",
                    width: "20%",
                    options: { 'LEFT': 'Bên Trái', 'TOP': 'Bên Trên' }
                },
                OrderIndex: {
                    title: "Số TT",
                    width: "5%",
                },
                Link: {
                    title: "Đường dẫn",
                    width: "20%",
                },
                //Icon: {
                //    title: "Icon",
                //    width: "5%",
                //    display: function (data) {
                //        if (data.record.Icon != null) {
                //            var text = $('<img src=" ' + data.record.Icon + '" style="width : 20px"/>');
                //            return text;
                //        }
                //    }
                //},
                //IsViewIcon: {
                //    title: "ẩn Icon",
                //    width: "5%",
                //    display: function (data) {
                //        var elementDisplay = "";
                //        if (data.record.IsViewIcon)
                //        { elementDisplay = "<input  type='checkbox' checked='checked' disabled/>"; }
                //        else {
                //            elementDisplay = "<input  type='checkbox' disabled />";
                //        }
                //        return elementDisplay;
                //    }
                //},
                Description: {
                    title: "Mô tả",
                    width: "20%",
                    type: 'textModule',
                    list: false
                },
                //edit: {
                //    title: '',
                //    width: '1%',
                //    sorting: false,
                //    display: function (data) {
                //        var text = $('<i data-toggle="modal" data-target="#' + Global.Element.popupAdd_ + '" title="Chỉnh sửa thông tin" class="fa fa-pencil-square-o clickable blue"  ></i>');
                //        text.click(function () {
                //            $('[txt="menuId"]').val(data.record.Id);
                //            $('[txt="categoryName"]').val(data.record.Name);
                //            $('[order]').val(data.record.OrderIndex);
                //            $('[des]').val(data.record.Description);
                //            $('[link]').val(data.record.Link);
                //            $('[select="moduleId"]').val(data.record.ModuleId);
                //        });
                //        return text;
                //    }
                //},
            }
        });
    }

    function ReloadList_() { 
        $('#' + Global.Element.Jtable_).jtable('load', { 'keyWord': $('#s-keyword').val()  }); 
    }

}

$(document).ready(function () {
    var MenuCategory = new GPRO.MenuCategory();
    MenuCategory.Init();

})

