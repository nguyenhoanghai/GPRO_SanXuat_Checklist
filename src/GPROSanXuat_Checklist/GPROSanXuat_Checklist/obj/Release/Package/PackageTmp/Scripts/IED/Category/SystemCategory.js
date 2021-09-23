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

GPRO.namespace('SystemCategory');
GPRO.SystemCategory = function () {
    var Global = {
        UrlAction: {
            GetListSystemCategory: '/Category/GetSystemCategorys',
            SaveSystemCategory: '/Category/SaveSystemCategory'
        },
        Element: {
            JtableSystemCategory: 'jtableSystemCategory',
            popupSystem: 'SystemCategoryModal',
            popupSearch: 'Search_Popup'
        },
        Data: {
            ModelsystemCategory: {}
        }
    }
    this.GetGlobal = function () {
        return Global;
    }

    this.Init = function () {
        RegisterEvent();
        InitListSystemCategory();
        ReloadListSystemCategory();
        BindData(null);
    }

    this.reloadListSystemCategory = function () {
        ReloadListSystemCategory();
    }

    this.initViewModel = function (systemCategory) {
        InitViewModel(systemCategory);
    }

    this.bindData = function (systemCategory) {
        BindData(systemCategory);
    }

    var RegisterEvent = function () {
       
        $('[btn="saveSysCategory"]').click(function () {
            var uploadobj = document.getElementById('SystemUploader');
            if (uploadobj.getqueuecount() > 0) {  //if file upload is null 
                $('#SystemSubmit').click();  // call event upload file
            }
            else {
                SaveSystemCategory();
            }

        })

        //Register event after upload file done the value of [filelist] will be change => call function save your Data 
        $('[SystemFileList]').change(function () {
            if ($('#' + Global.Element.popupSystem).css('display') == 'block') {
                SaveSystemCategory();
            }
        });

        $('[close]').click(function () {
            resetData();
        });

        $('[cancel]').click(function () {
            resetData();
        })

  

        $('[search]').click(function () {
            if ($('#SystemCategory').hasClass('active'))
            { 
                    ReloadListSystemCategory();
                    resetData(); 
            }
        });
    }

    function InitViewModel(systemCategory) {
        var systemCategoryViewModel = {
            Id: 0,
            Category: '',
            Position: 0,
            OrderIndex: '',
            Description: '',
            Icon: '',
            IsViewIcon: true,
            Link: '',
            ModuleId: 0,
            ModuleName: ''
        }
        if (systemCategory != null) {
            systemCategoryViewModel = {
                Id: ko.observable(systemCategory.Id),
                Category: ko.observable(systemCategory.Category),
                Position: ko.observable(systemCategory.Position),
                OrderIndex: ko.observable(systemCategory.OrderIndex),
                Link: ko.observable(systemCategory.Link),
                Icon: ko.observable(systemCategory.Icon),
                IsViewIcon: ko.observable(systemCategory.IsViewIcon),
                Description: ko.observable(systemCategory.Description),
                ModuleId: ko.observable(systemCategory.ModuleId),
                ModuleName: ko.observable(systemCategory.ModuleName)
            };
        }
        return systemCategoryViewModel;
    }

    function BindData(systemCategory) {
        Global.Data.ModelsystemCategory = InitViewModel(systemCategory);
        ko.applyBindings(Global.Data.ModelsystemCategory);
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
                        ReloadListSystemCategory();
                        $('#SystemCategoryModal').modal('hide');
                        resetData();
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

    function InitListSystemCategory() {
        $('#' + Global.Element.JtableSystemCategory).jtable({
            title: 'Danh Sách Nhóm Danh Mục',
            paging: true,
            pageSize: 10,
            pageSizeChangeSystemCategory: true,
            sorting: true,
            selectShow: true,
            actions: {
                listAction: Global.UrlAction.GetListSystemCategory,
                createObjDefault: InitViewModel(null),
                searchAction: Global.Element.popupSearch
            },
            messages: {
                searchRecord: 'Tìm kiếm',
                selectShow: 'Ẩn hiện cột'
            },
            fields: {
                Id: {
                    key: true,
                    create: false,
                    edit: false,
                    list: false
                },
                Category: {
                    visibility: 'fixed',
                    title: "Tên Nhóm Danh Mục",
                    width: "20%",
                    display: function (data) {
                        var text = $('<a class="clickable bold blue" data-toggle="modal" data-target="#SystemCategoryModal" title="Chỉnh sửa thông tin Nhóm Danh Mục Hệ Thống.">' + data.record.Category + '</a>');
                        text.click(function () {
                            BindData(data.record);
                            $('#SysPosition').val(data.record.Position);
                            $('#SysIcon').attr('src', data.record.Icon);
                        });
                        return text;
                    }
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
                            var text = $('<img src=" ' + data.record.Icon + '" style="width : 20px"/>');
                            return text;
                        }
                    }
                },
                IsViewIcon: {
                    title: "ẩn Icon",
                    width: "5%",
                    display: function (data) {
                        var elementDisplay = "";
                        if (data.record.IsViewIcon)
                        { elementDisplay = "<input  type='checkbox' checked='checked' disabled/>"; }
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
                }
            }
        });
    }

    function ReloadListSystemCategory() {
        var searchBy = $('#searchBy').val();
        var keySearch = $('#keyword').val();
        var position = $('#S_Position').val();
        var moduleId = $('[select = "moduId"]').val();
        $('#' + Global.Element.JtableSystemCategory).jtable('load', { 'keyword': keySearch, 'position': 'LEFT', 'moduleId': moduleId });
        $('#' + Global.Element.popupSearch).modal('hide');
    }

    function resetData() {
        $('#SysIcon').attr('src', '/Content/MasterPage/Images/no-image-2.png');
        var uploadobj = document.getElementById('SystemUploader');
        uploadobj.cancelall();

        // search popup 
        $('[select = "moduleId"]').val('0');
        $('#keyword').val(''); 
        $('#S_Position').val('0');
    }
}

$(document).ready(function () {
    var SystemCategory = new GPRO.SystemCategory();
    SystemCategory.Init();
})