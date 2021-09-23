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
GPRO.namespace('Materials');
GPRO.Materials = function () {
    var Global = {
        UrlAction: {
            Gets: '/Materials/Gets',
            Save: '/Materials/Save',
            Delete: '/Materials/Delete',
        },
        Element: {
            JtableMaterials: 'jtable-materials',
            PopupMaterials: 'popup-materials',
            Search: 'materials-search-popup', 
        },
        Data: { 
            IsInsert: true
        }
    }
    this.GetGlobal = function () {
        return Global;
    }

    this.Init = function () {
        RegisterEvent();
        InitList();
        ReloadList();
        InitPopup();
        InitPopupSearch();
         
        GetUnitSelect('materials-unit',6);
    }
     
    var RegisterEvent = function () {
        $("#materials-isPrivate").kendoMobileSwitch({
            onLabel: "Nội bộ",
            offLabel: "Tất cả"
        });

        $('#materials-file-upload').change(function () {
            readURL(this);
        });

        $('#materials-btn-file-upload').click(function () {
            $('#materials-file-upload').click();
        });

        // Register event after upload file done the value of [filelist] will be change => call function save your Data 
        $('#materials-file-upload').select(function () {
            Save ();
        });

    }

    resetData = () => {
        $("#materials-id").val(0);
        $("#materials-code").val('');
        $("#materials-name").val('');
        $("#materials-note").val('');
        $('.img-avatar').attr('src', '../Content/Img/no-image.png');
        $('#materials-file-upload').attr('newurl', '');
        $('#materials-file-upload').val('');
    }

    function Save () {
        var obj = {
            Id: $("#materials-id").val(),
            Name: $("#materials-name").val(),
            Code: $("#materials-code").val(),
            Note: $("#materials-note").val(),
            UnitId: $("#materials-unit").val(),
            IsPrivate: $("#materials-isPrivate").data("kendoMobileSwitch").check(),
            Image: $('#materials-file-upload').attr('newurl')
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
                        resetData();
                        if (!Global.Data.IsInsert) {
                            $("#" + Global.Element.PopupMaterials + ' button[materials-cancel]').click();
                            $('div.divParent').attr('currentPoppup', '');
                        }
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

    function InitList() {
        $('#' + Global.Element.JtableMaterials).jtable({
            title: 'Quản lý nguyên liệu',
            paging: true,
            pageSize: 1000,
            pageSizeChange: true,
            sorting: true,
            selectShow: true,
            actions: {
                listAction: Global.UrlAction.Gets,
                createAction: Global.Element.PopupMaterials,
                searchAction: Global.Element.Search,
            },
            messages: {
                addNewRecord: 'Thêm mới',
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
                    title: "Mã",
                    width: "20%",
                },
                Name: {
                    visibility: 'fixed',
                    title: "Tên nguyên liệu",
                    width: "20%",
                },
                UnitName: {
                    title: "Đơn vị tính",
                    width: "5%",
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
                        var text = $('<i data-toggle="modal" data-target="#' + Global.Element.PopupMaterials + '" title="Chỉnh sửa thông tin" class="fa fa-pencil-square-o clickable blue"  ></i>');
                        text.click(function () {
                            $("#materials-unit").val(data.record.UnitId);
                            $("#materials-code").val(data.record.Code);
                            $("#materials-id").val(data.record.Id);
                            $("#materials-name").val(data.record.Name);
                            $("#materials-note").val(data.record.Note);
                            if (data.record.Image)
                                $('.img-avatar').attr('src', data.record.Image);
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
        var keySearch = $('#materials-keyword').val(); 
        $('#' + Global.Element.JtableMaterials).jtable('load', { 'keyword': keySearch  });
    }

    function Delete(Id) {
        $.ajax({
            url: Global.UrlAction.Delete,
            type: 'POST',
            data: JSON.stringify({ 'Id': Id }),
            contentType: 'application/json charset=utf-8',
            success: function (data) {
                GlobalCommon.CallbackProcess(data, function () {
                    if (data.Result == "OK") {
                        ReloadList(); 
                    }
                    else
                        GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình xử lý.");
                }, false, Global.Element.PopupMaterials, true, true, function () {

                    var msg = GlobalCommon.GetErrorMessage(data);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
                });
            }
        });
    }

    function InitPopup() {
        $("#" + Global.Element.PopupMaterials).modal({
            keyboard: false,
            show: false
        });

        $('#' + Global.Element.PopupMaterials).on('shown.bs.modal', function () {
            $('div.divParent').attr('currentPoppup', Global.Element.PopupMaterials.toUpperCase());
        });

        $("#" + Global.Element.PopupMaterials + ' button[materials-save]').click(function () {
            if (CheckValidate()) {
                if ($('#materials-file-upload').val() != '')
                    UpSingle("materials-form-upload", "materials-file-upload");
                else
                    Save ();
            }
        });

        $("#" + Global.Element.PopupMaterials + ' button[materials-cancel]').click(function () {
            $("#" + Global.Element.PopupMaterials).modal("hide");
            resetData();
        });
    }

    function CheckValidate() {
       if ($('#materials-code').val().trim() == "") {
            GlobalCommon.ShowMessageDialog("Vui lòng nhập mã nguyên liệu.", function () { }, "Lỗi Nhập liệu");
            return false;
        } 
        else if ($('#materials-name').val().trim() == "") {
            GlobalCommon.ShowMessageDialog("Vui lòng nhập Tên nguyên liệu.", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        else if ($('#materials-unit').val().trim() == "") {
            GlobalCommon.ShowMessageDialog("Vui lòng chọn đơn vị tính.", function () { }, "Lỗi Nhập liệu");
            return false;
        } 
        return true;
    }

    function InitPopupSearch() {
        $("#" + Global.Element.Search).modal({
            keyboard: false,
            show: false
        });

        $('#' + Global.Element.Search).on('shown.bs.modal', function () {
            $('div.divParent').attr('currentPoppup', Global.Element.Search.toUpperCase());
        });

        $("#" + Global.Element.Search + ' button[materials-search]').click(function () {
            ReloadList();
            $("#" + Global.Element.Search + ' button[materials-close]').click();
        });

        $("#" + Global.Element.Search + ' button[materials-close]').click(function () {
            $("#" + Global.Element.Search).modal("hide");
             $('#materials-keyword').val('');
            $('div.divParent').attr('currentPoppup', '');
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
}

$(document).ready(function () {
    var Materials = new GPRO.Materials();
    Materials.Init();
});
