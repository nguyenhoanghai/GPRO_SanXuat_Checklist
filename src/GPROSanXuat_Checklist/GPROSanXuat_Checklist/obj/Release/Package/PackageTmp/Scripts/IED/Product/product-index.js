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
GPRO.namespace('Product');
GPRO.Product = function () {
    var Global = {
        UrlAction: {
            GetListProduct: '/Product/Gets',
            SaveProduct: '/Product/Save',
            DeleteProduct: '/Product/Delete',
        },
        Element: {
            JtableProduct: 'jtableProduct',
            PopupProduct: 'popup_Product',
            Search: 'pSearch_Popup',
            ProDeGroupView_Popup: 'ProDeGroupView_Popup',
            ProDeGroupAdd_Popup: 'ProDeGroupAdd_Popup'
        },
        Data: {
            ModelProduct: {},
            ModelProDeGroup: {},
            ProductId: 0,
            ProductName: '',
            ParentID: 0,
            Node: '',
            treeSelectId: 0,
            ProDeGroupList: [],
            ProDeGroupId: 0,
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

        GetCustomerSelect('pcustomer');
        GetSizeSelect('psize');
        GetUnitSelect('punit', 'SANPHAM');
    }

    var RegisterEvent = function () {
        $("#proIsPrivate").kendoMobileSwitch({
            onLabel: "Nội bộ",
            offLabel: "Tất cả"
        });

        $('#p-file-upload').change(function () {
            readURL(this);
        });

        $('#p-btn-file-upload').click(function () {
            $('#p-file-upload').click();
        });

        // Register event after upload file done the value of [filelist] will be change => call function save your Data 
        $('#p-file-upload').select(function () {
            SaveProduct();
        });

        $('[re_customer]').click(() => { GetCustomerSelect('pcustomer'); })
        $('[re_size]').click(() => { GetSizeSelect('psize'); })
        $('[re_unit]').click(() => { GetUnitSelect('punit', 'SANPHAM'); })
    }

    resetData = () => {
        $("#pid").val(0);
        $("#pname").val('');
        $("#pdes").val('');
        $('.img-avatar').attr('src', '../Content/Img/no-image.png');
        $('#p-file-upload').attr('newurl', '');
        $('#p-file-upload').val('');
    }

    function SaveProduct() {
        var obj = {
            Id: $("#pid").val(),
            Name: $("#pname").val(),
            Code: $("#pcustomer option:selected").text(),
            Note: $("#pdes").val(),
            SizeId: $("#psize").val(),
            UnitId: $("#punit").val(),
            IsPrivate: $("#proIsPrivate").data("kendoMobileSwitch").check(),
            CustomerId: $("#pcustomer").val(),
            Image: $('#p-file-upload').attr('newurl')
        }
        $.ajax({
            url: Global.UrlAction.SaveProduct,
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
                            $("#" + Global.Element.PopupProduct + ' button[pcancel]').click();
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
        $('#' + Global.Element.JtableProduct).jtable({
            title: 'Quản lý sản phẩm',
            paging: true,
            pageSize: 1000,
            pageSizeChange: true,
            sorting: true,
            selectShow: true,
            actions: {
                listAction: Global.UrlAction.GetListProduct,
                createAction: Global.Element.PopupProduct, 
            },
            messages: {
                addNewRecord: 'Thêm mới', 
                selectShow: 'Ẩn hiện cột'
            },
            searchInput: {
                id: 'pkeyword',
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
                Name: {
                    visibility: 'fixed',
                    title: "Tên sản phẩm",
                    width: "20%",
                },
                CustomerName: {
                    title: "Khách hàng",
                    width: "5%",
                },
                SizeName: {
                    title: "Kích cỡ",
                    width: "5%",
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
                        var text = $('<i data-toggle="modal" data-target="#' + Global.Element.PopupProduct + '" title="Chỉnh sửa thông tin" class="fa fa-pencil-square-o clickable blue"  ></i>');
                        text.click(function () {
                            $("#pcustomer").val(data.record.CustomerId);
                            $("#psize").val(data.record.SizeId);
                            $("#pid").val(data.record.Id);
                            $("#pname").val(data.record.Name);
                            $("#pdes").val(data.record.Note);
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
        var keySearch = $('#pkeyword').val(); 
        $('#' + Global.Element.JtableProduct).jtable('load', { 'keyword': keySearch  });
    }

    function Delete(Id) {
        $.ajax({
            url: Global.UrlAction.DeleteProduct,
            type: 'POST',
            data: JSON.stringify({ 'Id': Id }),
            contentType: 'application/json charset=utf-8',
            success: function (data) {
                GlobalCommon.CallbackProcess(data, function () {
                    if (data.Result == "OK") {
                        ReloadList();
                        BindData(null);
                    }
                    else
                        GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình xử lý.");
                }, false, Global.Element.PopupProduct, true, true, function () {

                    var msg = GlobalCommon.GetErrorMessage(data);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
                });
            }
        });
    }

    function InitPopup() {
        $("#" + Global.Element.PopupProduct).modal({
            keyboard: false,
            show: false
        });

        $('#' + Global.Element.PopupProduct).on('shown.bs.modal', function () {
            $('div.divParent').attr('currentPoppup', Global.Element.PopupProduct.toUpperCase());
        });

        $("#" + Global.Element.PopupProduct + ' button[psave]').click(function () {
            if (CheckValidate()) {
                if ($('#p-file-upload').val() != '')
                    UpSingle("p-form-upload", "p-file-upload");
                else
                    SaveProduct();
            }
        });

        $("#" + Global.Element.PopupProduct + ' button[pcancel]').click(function () {
            $("#" + Global.Element.PopupProduct).modal("hide");
            resetData();
        });
    }

    function CheckValidate() {
        if ($('#pname').val().trim() == "") {
            GlobalCommon.ShowMessageDialog("Vui lòng nhập Tên sản phẩm.", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        else if ($('#pcustomer').val().trim() == "") {
            GlobalCommon.ShowMessageDialog("Vui lòng chọn khách hàng.", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        else if ($('#psize').val().trim() == "") {
            GlobalCommon.ShowMessageDialog("Vui lòng chọn kích cỡ.", function () { }, "Lỗi Nhập liệu");
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

        $("#" + Global.Element.Search + ' button[psearch]').click(function () {
            ReloadList();
            $("#" + Global.Element.Search + ' button[pclose]').click();
        });

        $("#" + Global.Element.Search + ' button[pclose]').click(function () {
            $("#" + Global.Element.Search).modal("hide");
            $('#psearchBy').val('1');
            $('#pkeyword').val('');
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
    var Product = new GPRO.Product();
    Product.Init();
});
