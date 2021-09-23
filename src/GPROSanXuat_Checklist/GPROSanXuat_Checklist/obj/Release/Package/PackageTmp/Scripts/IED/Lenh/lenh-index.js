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
GPRO.namespace('Lenh');
GPRO.Lenh = function () {

    var Global = {
        UrlAction: {
            Gets: '/Lenhsx/Gets',
            GetById: '/Lenhsx/GetById',
            Save: '/Lenhsx/Save',
            Delete: '/Lenhsx/Delete',

            GetPOs: '/PO/GetFilters',
            GetProducts: '/Product/Gets',
            GetMaterials: '/Material/GetSelectList'
        },
        Element: {
            Jtable: 'lenh-jtable',
            Popup: 'lenh-popup',
            JtableProduct: 'lenh-jtable-product',
            JtableMaterial: 'lenh-jtable-material',


            PopupPO: 'popup-lenh-po',
            PopupProduct: 'popup-lenh-product',
            JtableProductFilter: 'jtable-checklist-product',
            JtablePOFilter: 'jtable-checklist-po',


            Search: 'po-search-popup',
            PopupView: 'po-view-popup'
        },
        Data: {
            IsInsert: true,
            custId: 0,
            Img: '',
            LenhProducts: [],
            LenhMaterials: [],
            Products: [],
            Materials: [],
            approve: false,

        }
    }
    this.GetGlobal = function () {
        return Global;
    }

    this.Init = function () {
        RegisterEvent();
        InitTable();
        ReloadTable();
        InitPopup();
        //InitPopupSearch();
        //GetCustomerSelect('po-customer');
        //GetUnitSelect('po-unit', 'tiente');

        InitPopupPO();
        InitTablePO();

        InitPopupProductFilter();
        InitTableProductFilter();


        InitTableProduct();
        ReloadTableProduct();

        addEmptyMaterial();
        InitTableMaterial();
        ReloadTableMaterial();


        GetMaterials();
        //GetStatusSelect('po-status', 'AppStatus');
        //InitPopupView();

        $("#lenh-date, #lenh-startdate").kendoDatePicker({
            format: "dd/MM/yyyy",
            //min: new Date()
        });

        GetEmployeeSelect('lenh-employee')
    }

    var RegisterEvent = function () {
        $('#po-product').change(() => {
            var opt = $('#po-product option:selected');
            $('#po-customer').val(opt.attr('custName'));
        });

        $('#po-unit').change(() => {
            var opt = $('#po-unit option:selected');
            $('#po-exchange').val(opt.attr('note'));
        });

        $('[re_customer]').click(() => { GetCustomerSelect('po-customer'); })
    }

    InitTable = () => {
        $('#' + Global.Element.Jtable).jtable({
            title: 'Danh sách lệnh sản xuất',
            paging: true,
            pageSize: 1000,
            pageSizeChange: true,
            sorting: true,
            selectShow: true,
            actions: {
                listAction: Global.UrlAction.Gets,
                createAction: Global.Element.Popup,
                // searchAction: Global.Element.Search,
            },
            messages: {
                addNewRecord: 'Thêm mới',
                // searchRecord: 'Tìm kiếm',
                selectShow: 'Ẩn hiện cột'
            },
            fields: {
                Id: {
                    key: true,
                    create: false,
                    edit: false,
                    list: false
                },
                CreatedDate: {
                    title: 'Ngày lập lệnh',
                    width: '5%',
                    display: function (data) {
                        return '<span class="bold blue">' + ddMMyyyy(data.record.CreatedDate) + '</span>';
                    }
                },
                Code: {
                    visibility: 'fixed',
                    title: "Mã lệnh",
                    width: "10%",
                },
                EmployeeId: {
                    title: "Người phụ trách",
                    width: "20%",
                    sorting: false,
                    display: function (data) {
                        return getText(data.record.EmployeeName);
                    }
                },
                StartDate: {
                    title: 'Ngày bắt đầu',
                    width: '5%',
                    display: function (data) {
                        var txt = "";
                        if (data.record.StartDate != null) {
                            txt = '<span class="bold blue">' + ddMMyyyy(data.record.StartDate) + '</span>';
                        }
                        else
                            txt = '<span class="">' + "" + '</span>';
                        return txt;
                    }
                },
                Note: {
                    title: "Nội dung",
                    width: "20%",
                    sorting: false,
                },
                StatusId: {
                    title: "Trạng thái",
                    width: "5%",
                    display: function (data) {
                        var cls = '';
                        switch (data.record.StatusId) {
                            case 7: break;
                            case 8: cls = 'blue'; break;
                            case 9: cls = 'red'; break;
                        }
                        var txt = `<span class="${cls}">${data.record.StatusName}</span>`;
                        return txt;
                    }
                },
                edit: {
                    title: '',
                    width: '1%',
                    sorting: false,
                    display: function (data) {
                        var text = $('<i data-toggle="modal" data-target="#' + Global.Element.Popup + '" title="Chỉnh sửa thông tin" class="fa fa-pencil-square-o clickable blue"  ></i>');
                        text.click(function () {
                            $('#lenh-id').val(data.record.Id);
                            $('#lenh-code').val(data.record.Code);
                            $('#lenh-employee').val(data.record.EmployeeId);
                            $('#lenh-note').val(data.record.Note);

                            $('#lenh-startdate').data("kendoDatePicker").value(new Date(moment(data.record.StartDate)));
                            $('#lenh-date').data("kendoDatePicker").value(new Date(moment(data.record.CreatedDate)));

                            Global.Data.IsInsert = false;
                            if (data.record.StatusId != 7) {
                                Global.Data.approve = true;
                                $('#lenh-code,#lenh-employee,#lenh-note,#lenh-startdate,#lenh-date,[lenh-save],[lenh-save-draft],#btn-checklist-po,#btn-checklist-product').prop('disabled', true);
                            }
                            Global.Data.LenhMaterials.length = 0;
                            Global.Data.LenhProducts.length = 0;
                            if (data.record.Products) {
                                data.record.Products.map((x, i) => {
                                    x.Index = i + 1;
                                    Global.Data.LenhProducts.push(x);
                                });
                                ReloadTableProduct();
                            }

                            if (data.record.Materials) {
                                data.record.Materials.map((x, i) => {
                                    x.Index = i + 1;
                                    Global.Data.LenhMaterials.push(x);
                                });
                                if (data.record.StatusId == 7)
                                    addEmptyMaterial();
                                ReloadTableMaterial();
                            }

                        });
                        return text;
                    }
                },
                Delete: {
                    title: '',
                    width: "3%",
                    sorting: false,
                    display: function (data) {
                        if (data.record.StatusId == 9) {
                            var btn = $(`<i data-toggle="modal" data-target="#${Global.Element.PopupView}" title="Chỉnh sửa thông tin" class="fa fa-file-word-o red"></i>`);
                            btn.click(() => {
                                GetById(data.record.Id, true);
                            })
                            return btn;
                        }
                        else {
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
            }
        });
    }

    ReloadTable = () => {
        var keySearch = $('#po-keyword').val();
        $('#' + Global.Element.Jtable).jtable('load', { 'keyword': keySearch });
    }

    InitPopup = () => {
        $("#" + Global.Element.Popup).modal({
            keyboard: false,
            show: false
        });

        $('#' + Global.Element.Popup).on('shown.bs.modal', function () {
            $('div.divParent').attr('currentPoppup', Global.Element.Popup.toUpperCase());
            //if ($('#po-id').val() == '' || $('#po-id').val() == '0') {
            //    $('#po-unit').change();
            //    $('#po-code').val(moment().format('DDMMYYYY-hhmmss'));
            //}
        });

        $("#" + Global.Element.Popup + ' button[lenh-save-draft]').click(function () {
            // if (CheckValidate()) {
            Save('Draft');
            // }
        });

        $("#" + Global.Element.Popup + ' button[lenh-save]').click(function () {
            if (CheckValidate()) {
                Save('Approved');
            }
        });

        $("#" + Global.Element.Popup + ' button[lenh-cancel]').click(function () {
            $("#" + Global.Element.Popup).modal("hide");
            setToDefault();
        });
    }

    InitPopupSearch = () => {
        $("#" + Global.Element.Search).modal({
            keyboard: false,
            show: false
        });

        $('#' + Global.Element.Search).on('shown.bs.modal', function () {
            $('div.divParent').attr('currentPoppup', Global.Element.Search.toUpperCase());
        });

        $("#" + Global.Element.Search + ' button[po-search]').click(function () {
            ReloadTable();
            $("#" + Global.Element.Search + ' button[po-close]').click();
        });

        $("#" + Global.Element.Search + ' button[po-close]').click(function () {
            $("#" + Global.Element.Search).modal("hide");
            $('#po-keyword').val('');
            $('div.divParent').attr('currentPoppup', '');
        });
    }

    setToDefault = () => {
        $('#po-id').val(0);
        $('#po-code').val('');
        $('#po-phone').val('');
        $('#po-delivery-date').val('');
        $('#po-status').val(0);
        $('#po-customer').val(0);
        $('#po-note').val('');
        Global.Data.LenhProducts.length = 0;
        Global.Data.LenhMaterials.length = 0;
        Global.Data.approve = false;

        addEmptyMaterial();
        ReloadTableProduct();
        ReloadTableMaterial();
        $('#lenh-code,#lenh-employee,#lenh-note,#lenh-startdate,#lenh-date,[lenh-save],[lenh-save-draft],#btn-checklist-po,#btn-checklist-product').removeAttr('disabled');
    }

    GetById = (Id, getTemplate) => {
        $.ajax({
            url: Global.UrlAction.GetById,
            type: 'POST',
            data: JSON.stringify({ 'poid': Id }),
            contentType: 'application/json charset=utf-8',
            success: function (data) {
                GlobalCommon.CallbackProcess(data, function () {
                    if (data.Result == "OK") {
                        if (getTemplate) {
                            ViewFile(data.Data, data.Records);
                        }
                        else {
                            Global.Data.LenhProducts.length = 0;
                            data.Data.Details.map((item, i) => {
                                Global.Data.LenhProducts.push({
                                    Id: item.Id,
                                    Index: i + 1,
                                    ProductId: item.ProductId,
                                    ProductName: item.ProductName,
                                    Quantities: item.Quantities,
                                    Price: item.Price,
                                    Total: item.Price * item.Quantities
                                });
                            });
                            if (data.Data.StatusId == 7) {
                                addEmptyMaterial()
                            }

                            ReloadTableProduct();
                            ReloadTableMaterial();
                        }
                    }
                    else
                        GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình xử lý.");
                }, false, Global.Element.Popup, true, true, function () {

                    var msg = GlobalCommon.GetErrorMessage(data);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
                });
            }
        });
    }

    Save = (status) => {
        var obj = {
            Id: $('#lenh-id').val(),
            Code: $('#lenh-code').val(),
            StartDate: $('#lenh-startdate').data("kendoDatePicker").value(),
            CreatedDate: $('#lenh-date').data("kendoDatePicker").value(),
            Note: $('#lenh-note').val(),
            Products: Global.Data.LenhProducts,
            Materials: Global.Data.LenhMaterials,
            EmployeeId: $('#lenh-employee').val(),
            StatusId: getStatusId(status) 
        };
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
                        setToDefault();

                        // if (!Global.Data.IsInsert) {
                        $("#" + Global.Element.Popup + ' button[lenh-cancel]').click();
                        $('div.divParent').attr('currentPoppup', '');
                        // }
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

    Delete = (Id) => {
        $.ajax({
            url: Global.UrlAction.Delete,
            type: 'POST',
            data: JSON.stringify({ 'Id': Id }),
            contentType: 'application/json charset=utf-8',
            success: function (data) {
                GlobalCommon.CallbackProcess(data, function () {
                    if (data.Result == "OK") {
                        ReloadTable();
                    }
                    else
                        GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình xử lý.");
                }, false, Global.Element.Popup, true, true, function () {

                    var msg = GlobalCommon.GetErrorMessage(data);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
                });
            }
        });
    }

    CheckValidate = () => {
        if ($('#lenh-code').val().trim() == "") {
            GlobalCommon.ShowMessageDialog("Vui lòng nhập mã lệnh.", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        else if ($('#lenh-date').val().trim() == "") {
            GlobalCommon.ShowMessageDialog("Vui lòng chọn ngày lập lệnh.", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        else if ($('#lenh-startdate').val().trim() == "") {
            GlobalCommon.ShowMessageDialog("Vui lòng chọn ngày bắt đầu sản xuất.", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        else if ($('#lenh-employee').val().trim() == "") {
            GlobalCommon.ShowMessageDialog("Vui lòng chọn nhân viên phụ trách.", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        else if (!Global.Data.LenhProducts) {
            GlobalCommon.ShowMessageDialog("Vui lòng chọn ít nhất 1 sản phẩm cho lệnh sản xuất.", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        else if (Global.Data.LenhMaterials && Global.Data.LenhMaterials.length < 2) {
            GlobalCommon.ShowMessageDialog("Vui lòng chọn ít nhất 1 vật tư cho lệnh sản xuất.", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        return true;
    }







    function InitTableProduct() {
        $('#' + Global.Element.JtableProduct).jtable({
            title: 'Danh sách sản phẩm',
            pageSize: 100,
            pageSizeChange: true,
            // selectShow: true,
            sorting: false,
            actions: {
                listAction: Global.Data.LenhProducts,
            },
            messages: {
                //  selectShow: 'Ẩn hiện cột'
            },
            fields: {
                Id: {
                    key: true,
                    create: false,
                    edit: false,
                    list: false
                },
                Index: {
                    title: "STT",
                    width: "3%"
                },
                POCode:
                {
                    title: "Mã PO",
                    width: "10%"
                },
                ProductName: {
                    title: "Sản phẩm",
                    width: "45%"
                },
                Quantity: {
                    title: "Số lượng PO còn lại",
                    width: "7%",
                    display: function (data) {
                        return `${ParseStringToCurrency(data.record.Quantity)} <span class="bold red">${data.record.UnitName}</span>`;
                    }
                },
                Quantities_PC: {
                    title: "Số lượng phân bổ",
                    width: "5%",
                    display: function (data) {
                        if (Global.Data.approve)
                            return `<span>${ParseStringToCurrency(data.record.Quantities_PC)}</span>`;

                        var txt = $('<input class="form-control text-center" loop type="text" value="' + data.record.Quantities_PC + '"  onkeypress="return isNumberKey(event)"/>');
                        txt.change(function () {
                            var _quantities = parseFloat(txt.val());
                            if (!_quantities) {
                                GlobalCommon.ShowMessageDialog('Số lượng phân bổ sản xuất phải lớn hơn 0.', function () { ReloadTableProduct(); }, "Lỗi nhập liệu");
                            }
                            else {
                                if (data.record.PODetailId && data.record.Quantity < _quantities)
                                    GlobalCommon.ShowMessageDialog(`Số lượng phân bổ sản xuất phải lớn hơn 0 và bé hơn số lượng yêu cầu của PO là : <span class="bold red">${data.record.Quantity}</span>`, function () { ReloadTableProduct(); }, "Lỗi nhập liệu");
                                else {
                                    Global.Data.LenhProducts[data.record.Index - 1].Quantities_PC = _quantities;
                                    ReloadTableProduct();
                                }
                            }
                        });
                        txt.click(function () { txt.select(); })
                        return txt;
                    }
                },
                Delete: {
                    title: '',
                    width: "3%",
                    sorting: false,
                    display: function (data) {
                        //if (data.record.ProductId && !Global.Data.approve) {
                        var text = $('<button title="Xóa" class="jtable-command-button jtable-delete-command-button"><span>Xóa</span></button>');
                        text.click(function () {
                            GlobalCommon.ShowConfirmDialog('Bạn có chắc chắn muốn xóa?', function () {
                                var oldIndex = data.record.Index - 1;
                                Global.Data.LenhProducts.splice(oldIndex, 1);
                                for (var i = oldIndex; i < Global.Data.LenhProducts.length; i++) {
                                    Global.Data.LenhProducts[i].Index = i + 1;
                                }
                                ReloadTableProduct();
                            }, function () { }, 'Đồng ý', 'Hủy bỏ', 'Thông báo');
                        });
                        return text;
                        //}
                        // return '';
                    }
                }
            }
        });
    }

    function ReloadTableProduct() {
        $('#' + Global.Element.JtableProduct).jtable('load');
    }


    InitPopupView = () => {
        $("#" + Global.Element.PopupView).modal({
            keyboard: false,
            show: false
        });

        $('#' + Global.Element.PopupView).on('shown.bs.modal', function () {
            $('div.divParent').attr('currentPoppup', Global.Element.PopupView.toUpperCase());
            if ($('#po-id').val() == '' || $('#po-id').val() == '0') {
                $('#po-unit').change();
                $('#po-code').val(moment().format('DDMMYYYY-hhmmss'));
            }
        });

        $("#" + Global.Element.PopupView + ' button[po-export]').click(function () {
            $('#po-word-content').html($('#po-file-content-area').html());
            $("#po-word-content").wordExport();
        });
        $("#" + Global.Element.PopupView + ' button[po-cancel]').click(function () {
            $("#" + Global.Element.PopupView).modal("hide");
        });
    }

    ViewFile = (po, template) => {
        if (template) {
            var _content = template.Content;
            _content = _content.replaceAll('{{ma-phieu}}', po.Code);
            _content = _content.replaceAll('{{ten-khach-hang}}', po.CustomerName.trim().toUpperCase());
            _content = _content.replaceAll('{{tien-te}}', po.MoneyTypeName.trim());
            _content = _content.replaceAll('{{ngay-giao-hang}}', ddMMyyyy(po.DeliveryDate));
            $('#po-file-content-area').empty().html(_content);
            var table = $('#po-file-content-area #table-details tbody');
            var strHtml = '';
            var total = 0;
            $.each(po.Details, (i, item) => {
                total += item.Quantities * item.Price;
                strHtml += `<tr>
                                <td style="text-align:center; border:1px solid black">${i + 1}</td>
                                <td style="text-align:center; border:1px solid black">${item.ProductName}</td>
                                <td style="text-align:center; border:1px solid black">${item.ProductUnit}</td>
                                <td style="text-align:center; border:1px solid black">${ParseStringToCurrency(item.Quantities)}</td>
                                <td style="text-align:center; border:1px solid black">${ParseStringToCurrency(item.Price)}</td>
                                <td style="text-align:center; border:1px solid black">${ParseStringToCurrency(item.Quantities * item.Price)}</td >
                            </tr> `;
            });
            strHtml += `<tr>
                                <td colspan="5" style="text-align:right !important;font-weight:600; border:1px solid black">Tổng tiền  </td> 
                                <td style="text-align:center; font-weight:600; border:1px solid black">${ParseStringToCurrency(total)}</td >
                            </tr> `;
            table.append(strHtml);
        }
        else
            GlobalCommon.ShowMessageDialog("Phiếu báo giá hiện tại vẫn chưa có biểu mẫu. Vui lòng tạo biểu mẫu cho phiếu báo giá.", function () { }, "Lỗi biểu mẫu");

    }

    //#region material 
    addEmptyMaterial = () => {
        Global.Data.LenhMaterials.push({
            Id: 0,
            Index: Global.Data.LenhMaterials.length + 1,
            MaterialId: 0,
            MaterialName: '',
            Quantity: '',
            //  Quantities_PC: 0,
            UnitName: ''
        });
    }

    function GetMaterials() {
        $.ajax({
            url: Global.UrlAction.GetMaterials,
            type: 'POST',
            data: JSON.stringify({ 'MtypeId': 0 }),
            contentType: 'application/json charset=utf-8',
            success: function (data) {
                GlobalCommon.CallbackProcess(data, function () {
                    if (data.Result == "OK") {
                        var option = '';
                        if (data.Data != null && data.Data.length > 0) {
                            $.each(data.Data, function (i, item) {
                                Global.Data.Materials.push(item);
                                option += '<option value="' + item.Name + '" /> ';
                            });
                        }
                        $('#lenh-material').append(option);
                    }
                    else
                        GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình xử lý.");
                }, false, Global.Element.PopupProductType, true, true, function () {

                    var msg = GlobalCommon.GetErrorMessage(data);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
                });
            }
        });
    }

    function InitTableMaterial() {
        $('#' + Global.Element.JtableMaterial).jtable({
            title: 'Danh sách vật tư',
            pageSize: 100,
            pageSizeChange: true,
            // selectShow: true,
            sorting: false,
            actions: {
                listAction: Global.Data.LenhMaterials,
            },
            messages: {
                //  selectShow: 'Ẩn hiện cột'
            },
            fields: {
                Id: {
                    key: true,
                    create: false,
                    edit: false,
                    list: false
                },
                Index: {
                    title: "STT",
                    width: "3%"
                },
                MaterialName: {
                    title: "Vật tư",
                    width: "45%",
                    display: function (data) {
                        if (Global.Data.approve)
                            return `<span>${data.record.MaterialName}</span>`;

                        var txt = $('<input class="form-control" code_' + data.record.Index + ' list="lenh-material" type="text" value="' + data.record.MaterialName + '" />');
                        txt.change(function () {
                            var code = txt.val().trim();
                            if (Global.Data.Materials.length > 0 && code != '') {
                                var flag = false;
                                var found = Global.Data.LenhMaterials.filter(x => x.MaterialName.trim() == code)[0];
                                if (found) {
                                    GlobalCommon.ShowMessageDialog('Vật tư này đã tồn tại trong danh sách. Vui lòng kiểm tra lại.', function () {
                                        txt.val(data.record.MaterialName);
                                    }, "Lỗi nhập liệu");
                                }
                                else {
                                    $.each(Global.Data.Materials, function (i, item) {
                                        if (item.Name.trim() == code) {
                                            $.each(Global.Data.LenhMaterials, function (ii, mani) {
                                                if (mani.Index == data.record.Index) {
                                                    mani.MaterialId = item.Value;
                                                    mani.MaterialName = item.Name;
                                                    mani.UnitName = item.Code;
                                                    mani.Quantities = 1;//item.Double;
                                                    flag = true;
                                                    return false;
                                                }
                                            });
                                            return false;
                                        }
                                    });
                                    if (!flag) {
                                        GlobalCommon.ShowMessageDialog('Không tìm thấy thông tin của sản phẩm này trong hệ thống.\nVui lòng kiểm tra lại.', function () { }, "Không Tìm Thấy sản phẩm");
                                    }

                                    if (flag) {
                                        if (Global.Data.LenhMaterials.length == data.record.Index)
                                            addEmptyMaterial();
                                        ReloadTableMaterial();
                                        if (Global.Data.LenhMaterials.length - 1 == data.record.Index) {
                                            $('[code_' + Global.Data.LenhMaterials.length + ']').focus();
                                            $('#Create-ManipulationVersion-Popup .modal-body').scrollTop($('#Create-ManipulationVersion-Popup .modal-body').height());
                                        }
                                        else
                                            $('#Create-ManipulationVersion-Popup .modal-body').scrollTop($('#Create-ManipulationVersion-Popup .modal-body').scrollTop());
                                    }
                                }
                            }
                        });
                        txt.keypress(function (e) {
                            var charCode = (e.which) ? e.which : event.keyCode;
                            if (charCode == 13) {
                                txt.change();
                            }
                        });
                        txt.click(function () { txt.select(); })
                        return txt;
                    }
                },
                //Quantities: {
                //    title: "Số lượng có sẳn",
                //    width: "5%",
                //    display: function (data) {
                //        return `${data.record.Quantities} <span class="bold blue">${data.record.UnitName}</span>`;
                //   }
                //},
                Quantity: {
                    title: "Số lượng yêu cầu",
                    width: "5%",
                    display: function (data) {
                        if (Global.Data.approve)
                            return `<span>${ParseStringToCurrency(data.record.Quantity)}</span>`;

                        var txt = $('<input class="form-control text-center" loop type="text" value="' + data.record.Quantity + '"  onkeypress="return isNumberKey(event)"/>');
                        txt.change(function () {
                            var _quantities = parseFloat(txt.val());
                            Global.Data.LenhMaterials[data.record.Index - 1].Quantity = _quantities;
                            ReloadTableMaterial();
                        });
                        txt.click(function () { txt.select(); })
                        return txt;
                    }
                },
                UnitName: {
                    title: "ĐVT",
                    width: "5%",
                    display: function (data) {
                        return ` <span class="bold red">${data.record.UnitName}</span>`;
                    }
                },
                Delete: {
                    title: '',
                    width: "3%",
                    sorting: false,
                    display: function (data) {
                        //  if (data.record.ProductId && !Global.Data.approve) {
                        var text = $('<button title="Xóa" class="jtable-command-button jtable-delete-command-button"><span>Xóa</span></button>');
                        text.click(function () {
                            GlobalCommon.ShowConfirmDialog('Bạn có chắc chắn muốn xóa?', function () {
                                var oldIndex = data.record.Index - 1;
                                Global.Data.LenhMaterials.splice(oldIndex, 1);
                                for (var i = oldIndex; i < Global.Data.LenhMaterials.length; i++) {
                                    Global.Data.LenhMaterials[i].Index = i + 1;
                                }
                                ReloadTableMaterial();
                            }, function () { }, 'Đồng ý', 'Hủy bỏ', 'Thông báo');
                        });
                        return text;
                        // }
                        // return '';
                    }
                }
            }
        });
    }

    function ReloadTableMaterial() {
        //var _total = 0;
        //if (Global.Data.LenhMaterials.length > 0) {
        //    $.each(Global.Data.LenhMaterials, function (i, item) {
        //        if (item.ProductName) {
        //            var price = parseFloat(item.Price);
        //            var quantities = parseFloat(item.Quantities);
        //            if (!isNaN(price) && !isNaN(quantities)) {
        //                _total += (quantities * price);
        //            }
        //        }
        //    });
        //}
        //$('#total-po').html(ParseStringToCurrency(_total));
        //$('#jtable-detail-po #selectHideShowColumn').remove();
        //$('#jtable-detail-po .jtable-column-header').removeAttr('style')
        $('#' + Global.Element.JtableMaterial).jtable('load');
    }
    //#endregion

    
    //#region PO
    InitPopupPO = () => {
        $("#" + Global.Element.PopupPO).modal({
            keyboard: false,
            show: false
        });

        $('#' + Global.Element.PopupPO).on('shown.bs.modal', function () {
            //$('div.divParent').attr('currentPoppup', Global.Element.PopupPO.toUpperCase());
            //$('#' + Global.Element.Popup).modal('hide');
        });

        $("#" + Global.Element.PopupPO + ' button[popup-checklist-po-cancel]').click(function () {
            $("#checklist-keyword-po").val('');
           // $('div.divParent').attr('currentPoppup', '');
            $("#" + Global.Element.PopupPO).modal("hide");
            $('#' + Global.Element.Popup).modal('show'); 
        });

        $('#btn-checklist-po').click(() => {
            ReloadTablePO();
            $('#' + Global.Element.Popup).modal('hide');
        });

        $('#btn-checklist-po').keypress((evt) => {
            if (evt.keyCode == 'Enter')
                ReloadTablePO();
        })
    }

    InitTablePO = () => {
        $('#' + Global.Element.JtablePOFilter).jtable({
            title: 'Danh sách PO',
            paging: true,
            pageSize: 1000,
            pageSizeChange: true,
            sorting: true,
            selectShow: false,
            selecting: false, //Enable selecting
            multiselect: false, //Allow multiple selecting
            selectingCheckboxes: false, //Show checkboxes on first column
            actions: {
                listAction: Global.UrlAction.GetPOs,
            },
            searchInput: {
                id: 'checklist-keyword-po',
                className: 'search-input',
                placeHolder: 'Tìm theo mã - tên PO',
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
                Code: {
                    title: "Mã PO",
                    width: "10%",
                    display: function (data) {
                        var txt = $('<span class="blue bold clickable">' + data.record.Code + '</span>');
                        txt.click(function () {
                            if (data.record.Quantities - data.record.Quantities_Lenh > 0) {
                                var found = Global.Data.LenhProducts.filter(x => x.ProductId == data.record.Id && x.PODetailId == data.record.Id)[0];
                                if (found)
                                    GlobalCommon.ShowMessageDialog('PO Sản phẩm này đã tồn tại trong danh sách. Vui lòng kiểm tra lại.',
                                        function () {
                                        }, "Lỗi trùng PO sản phẩm");
                                else {
                                    Global.Data.LenhProducts.push({
                                        Id: 0,
                                        ProductId: data.record.ProductId,
                                        ProductName: data.record.ProductName,
                                        UnitName: data.record.ProductUnit,
                                        PODetailId: data.record.Id,
                                        POCode: data.record.Code,
                                        Quantity: (data.record.Quantities - data.record.Quantities_Lenh),
                                        Quantities_PC: 1,
                                        Index: Global.Data.LenhProducts.length + 1
                                    });
                                    ReloadTableProduct();
                                    $('#' + Global.Element.Popup).modal('show');
                                    $('#' + Global.Element.PopupPO).modal('hide');
                                }
                            }
                            else
                                GlobalCommon.ShowMessageDialog('PO đã được phân công hết. Vui lòng chọn PO khác.',
                                    function () { }, "Lỗi trùng PO sản phẩm");
                        });
                        return txt;
                    }
                },
                CustomerName: {
                    title: "Khách hàng",
                    width: "20%",
                    sorting: false,
                },
                ProductName: {
                    title: "Sản phẫm",
                    width: "10%",

                },
                Quantities: {
                    title: "Số lượng",
                    width: "10%",
                    display: function (data) {
                        return `${(data.record.Quantities)} <span class="red bold">${data.record.ProductUnit}</span>`;
                    }
                },
                Quantities_Lenh: {
                    title: "Số lượng có thể phân công",
                    width: "10%",
                    display: function (data) {
                        return `${(data.record.Quantities - data.record.Quantities_Lenh)} <span class="red bold">${data.record.ProductUnit}</span>`;
                    }
                },
                Note: {
                    title: "Ghi chú",
                    width: "20%",
                    sorting: false,
                }
            }
        });
    }

    ReloadTablePO = () => {
        $('#' + Global.Element.JtablePOFilter).jtable('load', { 'keyword': $('#checklist-keyword-po').val() });
    }
    //#endregion

    //#region Product
    InitPopupProductFilter = () => {
        $("#" + Global.Element.PopupProduct).modal({
            keyboard: false,
            show: false
        });

        $('#' + Global.Element.PopupProduct).on('shown.bs.modal', function () {
            //$('div.divParent').attr('currentPoppup', Global.Element.PopupProduct.toUpperCase());
        });

        $("#" + Global.Element.PopupProduct + ' button[popup-checklist-product-cancel]').click(function () {
             $("#checklist-keyword-product").val('');
           // $('div.divParent').attr('currentPoppup', '');
            $("#" + Global.Element.PopupProduct).modal("hide");
            $('#' + Global.Element.Popup).modal('show');
           // $('div.divParent').attr('currentPoppup', Global.Element.PopupChecklist.toUpperCase());
        });

        $('#btn-checklist-product').click(() => {
            ReloadTableProductFilter();
            $('#' + Global.Element.Popup).modal('hide');
        });

        $('#btn-checklist-product').keypress((evt) => {
            if (evt.keyCode == 'Enter')
                ReloadTableProductFilter();
        })
    }

    InitTableProductFilter = () => {
        $('#' + Global.Element.JtableProductFilter).jtable({
            title: 'Danh sách sản phẩm',
            paging: true,
            pageSize: 1000,
            pageSizeChange: true,
            sorting: true,
            selectShow: false,
            selecting: false, //Enable selecting
            multiselect: false, //Allow multiple selecting
            selectingCheckboxes: false, //Show checkboxes on first column
            actions: {
                listAction: Global.UrlAction.GetProducts,
            },
            searchInput: {
                id: 'checklist-keyword-product',
                className: 'search-input',
                placeHolder: 'Tìm theo mã - tên sản phẩm',
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
                    title: "Tên ",
                    width: "10%",
                    display: function (data) {
                        var txt = $('<span class="blue bold clickable"><b>' + data.record.Name + '</b></span>');
                        txt.click(function () {
                            var found = Global.Data.LenhProducts.filter(x => x.ProductId == data.record.Id && !x.PODetailId)[0];
                            if (found)
                                GlobalCommon.ShowMessageDialog('Sản phẩm này đã tồn tại trong danh sách. Vui lòng kiểm tra lại.',
                                    function () {
                                    }, "Lỗi trùng sản phẩm");
                            else {
                                Global.Data.LenhProducts.push({
                                    Id: 0,
                                    ProductId: data.record.Id,
                                    ProductName: data.record.Name,
                                    UnitName: data.record.UnitName,
                                    PODetailId: undefined,
                                    POCode: '',
                                    Quantity: 0,
                                    Quantities_PC: 1,
                                    Index: Global.Data.LenhProducts.length + 1
                                });
                                ReloadTableProduct();
                                $('#' + Global.Element.Popup).modal('show');
                                $('#' + Global.Element.PopupProduct).modal('hide');
                            }
                        });
                        return txt;
                    }
                },
                CustomerName: {
                    title: "Khách hàng",
                    width: "20%",
                    sorting: false,
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
                    title: "Ghi chú",
                    width: "20%",
                    sorting: false,
                }
            }
        });
    }

    ReloadTableProductFilter = () => {
        $('#' + Global.Element.JtableProductFilter).jtable('load', { 'keyword': $('#checklist-keyword-product').val() });
    }
    //#endregion
}

$(document).ready(function () {
    var obj = new GPRO.Lenh();
    obj.Init();
});
