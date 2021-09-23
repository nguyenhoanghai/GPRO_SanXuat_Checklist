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
GPRO.namespace('Accessory');
GPRO.Accessory = function () {
    var Global = {
        UrlAction: {
            _GetLists: '/accessorytype/Gets',
            _Save: '/accessorytype/Save',
            _Delete: '/accessorytype/Delete',

            GetLists: '/accessory/Gets',
            Save: '/accessory/Save',
            Delete: '/accessory/Delete',
        },
        Element: {
            Jtable: 'jtable-accessory-type',
            Popupaccessorytype: 'popup-accessory-type',
            Searchaccessorytype: 'accessory-type-search-popup',

            Popupaccessory: 'popup-accessory',
        },
        Data: {
            IsInsert: true,
            ParentId: 0,
        }
    }
    this.GetGlobal = function () {
        return Global;
    }

    this.Init = function () {
        RegisterEvent();
        InitJTable();
        ReloadTable();
        InitPopup();
        InitPopupaccessorytype();
        InitSearchPopupaccessorytype();
        GetAccessoryTypeSelect('accessory-type-select');
        GetUnitSelect('accessory-unit', 6);
    }

    var RegisterEvent = function () {
        $('[re-accessory-type]').click(() => { GetAccessoryTypeSelect('accessory-type-select') });

        $('#accessory-file-upload').change(function () {
            readURL(this);
        });

        $('#accessory-btn-file-upload').click(function () {
            $('#accessory-file-upload').click();
        });

        // Register event after upload file done the value of [filelist] will be change => call function save your Data 
        $('#accessory-file-upload').select(function () {
            Saveaccessory();
        });
    }

    InitJTable = () => {
        $('#' + Global.Element.Jtable).jtable({
            title: 'Quản lý nhóm phụ liệu',
            paging: true,
            pageSize: 1000,
            pageSizeChange: true,
            sorting: true,
            selectShow: true,
            actions: {
                listAction: Global.UrlAction._GetLists,
                createAction: Global.Element.Popupaccessorytype,
                searchAction: Global.Element.Searchaccessorytype,
            },
            messages: {
                addNewRecord: 'Thêm mới',
                searchRecord: 'Tìm kiếm',
                selectShow: 'Ẩn hiện cột'
            },
            rowInserted: function (event, data) {
                if (data.record.Id == Global.Data.ParentId) {
                    var $a = $('#' + Global.Element.Jtable).jtable('getRowByKey', data.record.Id);
                    $($a.children().find('.aaa')).click();
                }
            },
            datas: {
                jtableId: Global.Element.Jtable
            },
            fields: {
                Id: {
                    key: true,
                    create: false,
                    edit: false,
                    list: false
                },
                Code: {
                    title: "Mã nhóm phụ liệu",
                    width: "20%",
                },
                Name: {
                    visibility: 'fixed',
                    title: "Tên nhóm phụ liệu",
                    width: "20%",
                },
                Note: {
                    title: "Mô Tả ",
                    width: "20%",
                    sorting: false,
                },
                Detail: {
                    title: 'DS phụ liệu',
                    width: '3%',
                    sorting: false,
                    edit: false,
                    display: function (parent) {
                        var $img = $('<i class="fa fa-list-ol clickable red aaa" title="Click xem sanh sách phụ liệu ' + parent.record.Name + '"></i>');
                        $img.click(function () {
                            Global.Data.ParentId = parent.record.Id;
                            $('#' + Global.Element.Jtable).jtable('openChildTable',
                                $img.closest('tr'),
                                {
                                    title: '<div >Danh sách phụ liệu thuộc : <span class="red">' + parent.record.Name + '</span></div>',
                                    paging: true,
                                    pageSize: 1000,
                                    pageSizeChange: true,
                                    sorting: true,
                                    selectShow: true,
                                    actions: {
                                        listAction: Global.UrlAction.GetLists + '?parentId=' + parent.record.Id,
                                        createAction: Global.Element.Popupaccessory,
                                    },
                                    messages: {
                                        addNewRecord: 'Thêm mới',
                                        selectShow: 'Ẩn hiện cột'
                                    },
                                    fields: {
                                        ParentId: {
                                            type: 'hidden',
                                            defaultValue: parent.record.Id
                                        },
                                        Id: {
                                            key: true,
                                            create: false,
                                            edit: false,
                                            list: false
                                        },
                                        Image: {
                                            title: " ",
                                            width: "3%",
                                            display: function (data) {
                                                var text = $('<img src="' + data.record.Image + '" width="40"/>');
                                                if (data.record.Image != null) {
                                                    return text;
                                                }
                                            },
                                            sorting: false,
                                        },
                                        Code: {
                                            title: "Mã phụ liệu",
                                            width: "20%",
                                        },
                                        Name: {
                                            visibility: 'fixed',
                                            title: "Tên phụ liệu",
                                            width: "20%",
                                        },
                                        UnitName: {
                                            title: "Đơn vị tính",
                                            width: "20%",
                                        },
                                        Note: {
                                            title: "Mô Tả ",
                                            width: "20%",
                                            sorting: false,
                                        },
                                        edit: {
                                            title: '',
                                            width: '1%',
                                            sorting: false,
                                            display: function (data) {
                                                var text = $('<i data-toggle="modal" data-target="#' + Global.Element.Popupaccessory + '" title="Chỉnh sửa thông tin" class="fa fa_tb fa-pencil-square-o clickable blue"  ></i>');
                                                text.click(function () {
                                                    $('#accessory-id').val(data.record.Id);
                                                    $('#accessory-note').val(data.record.Note);
                                                    $("#accessory-code").val(data.record.Code);
                                                    $("#accessory-name").val(data.record.Name);
                                                    $("#accessory-unit").val(data.record.UnitId);
                                                    $("#accessory-type-select").val(data.record.accessorytypeId);
                                                    if (data.record.Image)
                                                        $('.img-avatar').attr('src', data.record.Image);
                                                    Global.Data.ParentId = data.record.accessorytypeId;
                                                    Global.Data.IsInsert = false;
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
                                                        Deleteaccessory(data.record.Id);
                                                    }, function () { }, 'Đồng ý', 'Hủy bỏ', 'Thông báo');
                                                });
                                                return text;

                                            }
                                        }
                                    }
                                }, function (data) { //opened handler
                                    data.childTable.jtable('load');
                                });
                        });
                        return $img;
                    }
                },
                edit: {
                    title: '',
                    width: '1%',
                    sorting: false,
                    display: function (data) {
                        var text = $('<i data-toggle="modal" data-target="#' + Global.Element.Popupaccessorytype + '" title="Chỉnh sửa thông tin" class="fa fa-pencil-square-o clickable blue"  ></i>');
                        text.click(function () {
                            $('#accessory-type-id').val(data.record.Id);
                            $('#accessory-type-note').val(data.record.Note);
                            $("#accessory-type-name").val(data.record.Name);
                            $("#accessory-type-code").val(data.record.Code);
                            Global.Data.IsInsert = false;
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
                                Deleteaccessorytype(data.record.Id);
                            }, function () { }, 'Đồng ý', 'Hủy bỏ', 'Thông báo');
                        });
                        return text;

                    }
                }
            }
        });
    }

    ReloadTable = () => {
        var keySearch = $('#accessory-type-keyword').val();
        $('#' + Global.Element.Jtable).jtable('load', { 'keyword': keySearch });
    }


    InitPopup = () => {
        $("#" + Global.Element.Popupaccessory).modal({
            keyboard: false,
            show: false
        });

        $('#' + Global.Element.Popupaccessory).on('shown.bs.modal', function () {
            $('div.divParent').attr('currentPoppup', Global.Element.Popupaccessory.toUpperCase());
            $("#accessory-type-select").val(Global.Data.ParentId);
        });

        $("#" + Global.Element.Popupaccessory + ' button[accessory-save]').click(function () {
            if ($('#accessory-code').val().trim() == "") {
                GlobalCommon.ShowMessageDialog("Vui lòng nhập mã phụ liệu.", function () { }, "Lỗi Nhập liệu");
            }
            else if ($('#accessory-name').val().trim() == "") {
                GlobalCommon.ShowMessageDialog("Vui lòng nhập tên phụ liệu.", function () { }, "Lỗi Nhập liệu");
            }
            else if ($('#accessory-unit').val().trim() == "") {
                GlobalCommon.ShowMessageDialog("Vui lòng chọn đơn vị tính.", function () { }, "Lỗi Nhập liệu");
            }
            else {
                if ($('#accessory-file-upload').val() != '')
                    UpSingle("accessory-form-upload", "accessory-file-upload");
                else
                    Saveaccessory();
            }
        });

        $("#" + Global.Element.Popupaccessory + ' button[accessory-cancel]').click(function () {
            resetData();
            $('div.divParent').attr('currentPoppup', '');
            $("#" + Global.Element.Popupaccessory).modal("hide");
        });
    }

    Saveaccessory = () => {
        var obj = {
            Id: $('#accessory-id').val(),
            Name: $('#accessory-name').val(),
            Code: $('#accessory-code').val(),
            Note: $('#accessory-note').val(),
            UnitId: $('#accessory-unit').val(),
            TypeId: $('#accessory-type-select').val(),
            Image: $('#accessory-file-upload').attr('newurl')
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
                        ReloadTable();
                        resetData();
                        if (!Global.Data.IsInsert) {
                            $("#" + Global.Element.Popupaccessory + ' button[accessory-cancel]').click();
                        }
                        else
                            Global.Data.IsInsert = true;
                    }
                    else
                        GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình xử lý.");
                }, false, Global.Element.PopupModule, true, true, function () {
                    var msg = GlobalCommon.GetErrorMessage(result);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình xử lý.");
                });
            }
        });
    }

    resetData = () => {
        $("#accessory-id").val(0);
        $("#accessory-code").val('');
        $("#accessory-name").val('');
        $("#accessory-note").val('');
        $('.img-avatar').attr('src', '../Content/Img/no-image.png');
        $('#accessory-file-upload').attr('newurl', '');
        $('#accessory-file-upload').val('');
    }

    Deleteaccessory = (Id) => {
        $.ajax({
            url: Global.UrlAction.Delete,
            type: 'POST',
            data: JSON.stringify({ 'Id': Id }),
            contentType: 'application/json charset=utf-8',
            beforeSend: function () { $('#loading').show(); },
            success: function (data) {
                $('#loading').hide();
                GlobalCommon.CallbackProcess(data, function () {
                    if (data.Result == "OK") {
                        ReloadTable();
                    }
                    else
                        GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình xử lý.");
                }, false, Global.Element.Popupaccessory, true, true, function () {

                    var msg = GlobalCommon.GetErrorMessage(data);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
                });
            }
        });
    }

    readURL = (input) => {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $('.img-avatar').attr('src', e.target.result);
            }
            reader.readAsDataURL(input.files[0]); // convert to base64 string
        }
    }

    InitPopupaccessorytype = () => {
        $("#" + Global.Element.Popupaccessorytype).modal({
            keyboard: false,
            show: false
        });

        $('#' + Global.Element.Popupaccessorytype).on('shown.bs.modal', function () {
            $('div.divParent').attr('currentPoppup', Global.Element.Popupaccessorytype.toUpperCase());
        });

        $("#" + Global.Element.Popupaccessorytype + ' button[accessory-type-save]').click(function () {
            if ($('#accessory-type-name').val().trim() == "")
                GlobalCommon.ShowMessageDialog("Vui lòng nhập tên nhóm phụ liệu.", function () { }, "Lỗi Nhập liệu");
            else
                Saveaccessorytype();
        });
        $("#" + Global.Element.Popupaccessorytype + ' button[accessory-type-cancel]').click(function () {
            $('#accessory-type-id').val('0');
            $('#accessory-type-note').val('');
            $("#accessory-type-name").val('');
            $('div.divParent').attr('currentPoppup', '');
            $("#" + Global.Element.Popupaccessorytype).modal("hide");
        });
    }

    InitSearchPopupaccessorytype = () => {
        $("#" + Global.Element.Searchaccessorytype).modal({
            keyboard: false,
            show: false
        });

        $('#' + Global.Element.Searchaccessorytype).on('shown.bs.modal', function () {
            $('div.divParent').attr('currentPoppup', Global.Element.Searchaccessorytype.toUpperCase());
        });

        $("#" + Global.Element.Searchaccessorytype + ' button[accessory-type-search]').click(function () {
            ReloadTable();

            $("#" + Global.Element.Searchaccessorytype + ' button[accessory-type-close]')
        });

        $("#" + Global.Element.Searchaccessorytype + ' button[accessory-type-close]').click(function () {
            $('#accessory-type-keyword').val('');
            $('div.divParent').attr('currentPoppup', '');
            $("#" + Global.Element.Searchaccessorytype).modal("hide");
        });
    }

    Saveaccessorytype = () => {
        var obj = {
            Id: $('#accessory-type-id').val(),
            Name: $('#accessory-type-name').val(),
            Code: $('#accessory-type-code').val(),
            Note: $('#accessory-type-note').val(),
        }
        $.ajax({
            url: Global.UrlAction._Save,
            type: 'post',
            data: ko.toJSON(obj),
            contentType: 'application/json',
            beforeSend: function () { $('#loading').show(); },
            success: function (result) {
                $('#loading').hide();
                GlobalCommon.CallbackProcess(result, function () {
                    if (result.Result == "OK") {
                        ReloadTable();
                        resetDataType();
                        GetaccessorytypeSelect('accessory-type-select')
                        if (!Global.Data.IsInsert) {
                            $("#" + Global.Element.Popupaccessorytype + ' button[accessory-type-cancel]').click();
                        }
                        else
                            Global.Data.IsInsert = true;
                    }
                    else
                        GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình xử lý.");
                }, false, Global.Element.PopupModule, true, true, function () {
                    var msg = GlobalCommon.GetErrorMessage(result);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình xử lý.");
                });
            }
        });
    }

    resetDataType = () => {
        $("#accessory-type-id").val(0);
        $("#accessory-type-code").val('');
        $("#accessory-type-name").val('');
        $("#accessory-type-note").val('');
    }

    Deleteaccessorytype = (Id) => {
        $.ajax({
            url: Global.UrlAction._Delete,
            type: 'POST',
            data: JSON.stringify({ 'Id': Id }),
            contentType: 'application/json charset=utf-8',
            beforeSend: function () { $('#loading').show(); },
            success: function (data) {
                $('#loading').hide();
                GlobalCommon.CallbackProcess(data, function () {
                    if (data.Result == "OK") {
                        ReloadTable();
                        GetaccessorytypeSelect('accessory-type-select')
                    }
                    else
                        GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình xử lý.");
                }, false, Global.Element.Popupaccessory, true, true, function () {
                    var msg = GlobalCommon.GetErrorMessage(data);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
                });
            }
        });
    }


}

$(document).ready(function () {
    var obj = new GPRO.Accessory();
    obj.Init();
});
