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
GPRO.namespace('PO');
GPRO.PO = function () {

    var Global = {
        UrlAction: {
            Gets: '/PO/Gets',
            GetById: '/PO/GetById',
            GetProducts: '/Product/GetSelectList',
            Save: '/PO/Save',
            Delete: '/PO/Delete',
        },
        Element: {
            Jtable: 'jtable-po',
            JtableDetail: 'jtable-detail-po',
            Popup: 'popup-po',
            Search: 'po-search-popup',
            PopupView: 'po-view-popup'
        },
        Data: {
            IsInsert: true,
            custId: 0,
            Img: '',
            Childs: [],
            Products: [],
            approve: false
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
        InitPopupSearch();
        GetCustomerSelect('po-customer');
        GetUnitSelect('po-unit', 'tiente');
        addEmptyChild();
        InitTableDetail()
        ReloadTableDetail();
        GetProducts();
        GetStatusSelect('po-status', 'AppStatus');
        InitPopupView();
        $("#po-delivery-date").kendoDatePicker({
            format: "dd/MM/yyyy",
            // min: new Date()
        });
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
            title: 'Danh sách phiếu báo giá',
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
                Code: {
                    visibility: 'fixed',
                    title: "Mã phiếu",
                    width: "10%",
                },
                CustomerName: {
                    title: "Khách hàng",
                    width: "20%",
                    sorting: false,
                },
                Total: {
                    title: "Tổng Tiền - Tỷ Giá",
                    width: "15%",
                    sorting: false,
                    display: function (data) {
                        var txt = `<span class="bold red">${ParseStringToCurrency(data.record.Total)}</span> ${data.record.MoneyTypeName} <i class="fa fa-arrow-right blue"></i> <span class="bold red">${ParseStringToCurrency(data.record.Exchange)}</span>`;
                        return txt;
                    }
                },
                DeliveryDate: {
                    title: 'Ngày giao hàng',
                    width: '5%',
                    display: function (data) {
                        var txt = "";
                        if (data.record.DeliveryDate != null) {
                            var date = new Date(parseJsonDateToDate(data.record.DeliveryDate))
                            txt = '<span class="bold blue">' + ParseDateToString(date) + '</span>';
                        }
                        else
                            txt = '<span class="">' + "" + '</span>';
                        return txt;
                    }
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
                Note: {
                    title: "Ghi chú",
                    width: "20%",
                    sorting: false,
                },
                edit: {
                    title: '',
                    width: '1%',
                    sorting: false,
                    display: function (data) {
                        var text = $('<i data-toggle="modal" data-target="#' + Global.Element.Popup + '" title="Chỉnh sửa thông tin" class="fa fa-pencil-square-o clickable blue"  ></i>');
                        text.click(function () {
                            $('#po-id').val(data.record.Id);
                            $('#po-code').val(data.record.Code);
                            $('#po-customer').val(data.record.CustomerId);
                            $('#po-phone').val(data.record.Phone); 
                            $('#po-delivery-date').data("kendoDatePicker").value(new Date(moment(data.record.DeliveryDate)));
                             
                            $('#po-unit').val(data.record.MoneyUnitId).change();
                            $('#po-exchange').val(data.record.Exchange);
                            $('#po-status').val(data.record.StatusId);
                            $('#po-note').val(data.record.Note);
                            GetById(data.record.Id, false);
                            Global.Data.IsInsert = false;
                            if (data.record.StatusId == 9) {
                                Global.Data.approve = true;
                                $('#po-customer,#po-phone,#po-delivery-date,#po-unit,#po-exchange,#po-status,#po-note,[po-save]').prop('disabled', true);
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

        var search = $('<input type="text" id="po-keyword"  class="search-input" placeholder="Nhập mã phiếu ..." />');
        search.keyup(function (evt) {
            if (evt.keyCode == 13)
                ReloadTable();
        })
        $(`#${Global.Element.Jtable} .jtable-toolbar`).prepend(search);
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
            if ($('#po-id').val() == '' || $('#po-id').val() == '0') {
                $('#po-unit').change();
                $('#po-code').val(moment().format('DDMMYYYY-hhmmss'));
            }
        });

        $("#" + Global.Element.Popup + ' button[po-save]').click(function () {
            // if (CheckValidate()) {                 
            Save();
            // }
        });
        $("#" + Global.Element.Popup + ' button[po-cancel]').click(function () {
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
        $('#po-delivery-date').data("kendoDatePicker").value(new Date( ));
        $('#po-status').val(0);
        $('#po-customer').val(0);
        $('#po-note').val('');
        Global.Data.Childs.length = 0;
        Global.Data.approve = false;
        addEmptyChild();
        ReloadTableDetail();
        $('#po-customer,#po-phone,#po-delivery-date,#po-unit,#po-exchange,#po-status,#po-note,[po-save]').removeAttr('disabled');
    }

    GetById = (Id, getTemplate) => {
        $.ajax({
            url: Global.UrlAction.GetById,
            type: 'POST',
            data: JSON.stringify({ 'poid': Id, 'getTemplate': getTemplate }),
            contentType: 'application/json charset=utf-8',
            success: function (data) {
                GlobalCommon.CallbackProcess(data, function () {
                    if (data.Result == "OK") {
                        if (getTemplate) {
                            ViewFile(data.Data, data.Records);
                        }
                        else {
                            Global.Data.Childs.length = 0;
                            data.Data.Details.map((item, i) => {
                                Global.Data.Childs.push({
                                    Id: item.Id,
                                    Index: i + 1,
                                    ProductId: item.ProductId,
                                    ProductName: item.ProductName,
                                    Quantities: item.Quantities,
                                    Price: item.Price,
                                    Total: item.Price * item.Quantities,
                                    StartDate: item.StartDate,
                                    EndDate: item.EndDate,
                                    DeliveryDate: item.DeliveryDate
                                });
                            });
                            if (data.Data.StatusId != 9)
                                addEmptyChild();
                            ReloadTableDetail();
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

    Save = () => {
        var obj = {
            Id: $('#po-id').val(),
            Code: $('#po-code').val(),
            CustomerId: $('#po-customer').val(),
            Phone: $('#po-phone').val(),
            DeliveryDate: $('#po-delivery-date').data("kendoDatePicker").value(),
            MoneyUnitId: $('#po-unit').val(),
            Exchange: parseFloat($('#po-exchange').val()),
            StatusId: $('#po-status').val(),
            Note: $('#po-note').val(),
            Details: Global.Data.Childs
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

                        if (!Global.Data.IsInsert) {
                            $("#" + Global.Element.Popup + ' button[po-cancel]').click();
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
        if ($('#po-name').val().trim() == "") {
            GlobalCommon.ShowMessageDialog("Vui lòng nhập Tên khách hàng.", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        else if ($('#po-product').val().trim() == "") {
            GlobalCommon.ShowMessageDialog("Vui lòng chọn sản phẩm.", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        return true;
    }



    addEmptyChild = () => {
        Global.Data.Childs.push({
            Id: 0,
            Index: Global.Data.Childs.length + 1,
            ProductId: 0,
            ProductName: '',
            Quantities: 0,
            Price: 0,
            Total: 0,
            StartDate: undefined,
            EndDate: undefined,
            DeliveryDate: undefined
        });
    }

    function InitTableDetail() {
        $('#' + Global.Element.JtableDetail).jtable({
            title: 'Danh sách sản phẩm',
            pageSize: 100,
            pageSizeChange: true,
            // selectShow: true,
            sorting: false,
            actions: {
                listAction: Global.Data.Childs,
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
                ProductName: {
                    title: "Sản phẩm",
                    width: "45%",
                    display: function (data) {
                        if (Global.Data.approve)
                            return `<span>${data.record.ProductName}</span>`;

                        var txt = $('<input class="form-control" code_' + data.record.Index + ' list="products-po" type="text" value="' + data.record.ProductName + '" />');
                        txt.change(function () {
                            var code = txt.val().trim();
                            if (Global.Data.Products.length > 0 && code != '') {
                                var flag = false;
                                var found = Global.Data.Childs.filter(x => x.ProductName.trim() == code)[0];
                                if (found) {
                                    GlobalCommon.ShowMessageDialog('Sản phẩm này đã tồn tại trong danh sách. Vui lòng kiểm tra lại.', function () {
                                        txt.val(data.record.ProductName);
                                    }, "Lỗi nhập liệu");
                                }
                                else {
                                    $.each(Global.Data.Products, function (i, item) {
                                        if (item.Name.trim() == code) {
                                            $.each(Global.Data.Childs, function (ii, mani) {
                                                if (mani.Index == data.record.Index) {
                                                    mani.ProductId = item.Value;
                                                    mani.ProductName = item.Name;
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
                                        if (Global.Data.Childs.length == data.record.Index)
                                            addEmptyChild();
                                        ReloadTableDetail();
                                        if (Global.Data.Childs.length - 1 == data.record.Index) {
                                            $('[code_' + Global.Data.Childs.length + ']').focus();
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
                Price: {
                    title: "Đơn giá",
                    width: "5%",
                    display: function (data) {
                        if (Global.Data.approve)
                            return `<span>${ParseStringToCurrency(data.record.Price)}</span>`;

                        var txt = $('<input class="form-control center" loop type="text" value="' + data.record.Price + '"  onkeypress="return isNumberKey(event)"/>');
                        txt.change(function () {
                            var _price = parseFloat(txt.val());
                            Global.Data.Childs[data.record.Index - 1].Price = _price;
                            Global.Data.Childs[data.record.Index - 1].Total = Global.Data.Childs[data.record.Index - 1].Quantities * _price;
                            ReloadTableDetail();
                        });
                        txt.click(function () { txt.select(); })
                        return txt;
                    }
                },
                Quantities: {
                    title: "Số lượng",
                    width: "5%",
                    display: function (data) {
                        if (Global.Data.approve)
                            return `<span>${ParseStringToCurrency(data.record.Quantities)}</span>`;

                        var txt = $('<input class="form-control center" loop type="text" value="' + data.record.Quantities + '"  onkeypress="return isNumberKey(event)"/>');
                        txt.change(function () {
                            var _quantities = parseFloat(txt.val());
                            Global.Data.Childs[data.record.Index - 1].Quantities = _quantities;
                            Global.Data.Childs[data.record.Index - 1].Total = Global.Data.Childs[data.record.Index - 1].Price * _quantities;
                            ReloadTableDetail();
                        });
                        txt.click(function () { txt.select(); })
                        return txt;
                    }
                },
                Total: {
                    title: "Thành tiền",
                    width: "2%",
                    display: function (data) {
                        var txt = '<span class="red bold">' + ParseStringToCurrency(data.record.Total) + '</span>';
                        return txt;
                    }
                },
                StartDate: {
                    title: 'Ngày bắt đầu(DK)',
                    width: '5%',
                    display: function (data) {
                        var div = $(`<div> <div>`);
                        var input1 = $(`<input type="text" class="form-control center" disabled style="border-right:none; width:100px; position:absolute" /> `);
                        var input2 = $(` <input type="date" class="form-control center" style="width:140px"/> `);

                        input2.change(function () {
                            input1.val(moment(input2.val()).format('DD/MM/YYYY'));
                            data.record.StartDate = moment(input2.val());
                        });
                        if (data.record.StartDate)
                            input1.val(moment(data.record.StartDate).format('DD/MM/YYYY'));
                        div.append(input1);
                        div.append(input2);
                        return div;
                    }
                },
                EndDate: {
                    title: 'Ngày kết thúc(DK)',
                    width: '5%',
                    display: function (data) {
                        var div = $(`<div> <div>`);
                        var input1 = $(`<input type="text" class="form-control center" disabled style="border-right:none; width:100px; position:absolute" /> `);
                        var input2 = $(` <input type="date" class="form-control center" style="width:140px"/> `);

                        input2.change(function () {
                            input1.val(moment(input2.val()).format('DD/MM/YYYY'));
                            data.record.EndDate = moment(input2.val());
                        });
                        if (data.record.EndDate)
                            input1.val(moment(data.record.EndDate).format('DD/MM/YYYY'));
                        div.append(input1);
                        div.append(input2);
                        return div;
                    }
                },
                DeliveryDate: {
                    title: 'Ngày giao hàng(DK)',
                    width: '5%',
                    display: function (data) {
                        var div = $(`<div> <div>`);
                        var input1 = $(`<input type="text" class="form-control center" disabled style="border-right:none; width:100px; position:absolute" /> `);
                        var input2 = $(` <input type="date" class="form-control center" style="width:140px"/> `);
                        
                        input2.change(function () {
                            input1.val(moment(input2.val()).format('DD/MM/YYYY'));
                            data.record.DeliveryDate = moment(input2.val());
                        });
                        if (data.record.DeliveryDate)
                            input1.val(moment(data.record.DeliveryDate).format('DD/MM/YYYY'));
                        div.append(input1);
                        div.append(input2);
                        return div;
                    }
                },
                Delete: {
                    title: '',
                    width: "3%",
                    sorting: false,
                    display: function (data) {
                        if (data.record.ProductId && !Global.Data.approve) {
                            var text = $('<button title="Xóa" class="jtable-command-button jtable-delete-command-button"><span>Xóa</span></button>');
                            text.click(function () {
                                GlobalCommon.ShowConfirmDialog('Bạn có chắc chắn muốn xóa?', function () {
                                    var oldIndex = data.record.Index - 1;
                                    Global.Data.Childs.splice(oldIndex, 1);
                                    for (var i = oldIndex; i < Global.Data.Childs.length; i++) {
                                        Global.Data.Childs[i].Index = i + 1;
                                    }
                                    ReloadTableDetail();
                                }, function () { }, 'Đồng ý', 'Hủy bỏ', 'Thông báo');
                            });
                            return text;
                        }
                        return '';
                    }
                }
            }
        });
    }

    function ReloadTableDetail() {
        var _total = 0;
        if (Global.Data.Childs.length > 0) {
            $.each(Global.Data.Childs, function (i, item) {
                if (item.ProductName) {
                    var price = parseFloat(item.Price);
                    var quantities = parseFloat(item.Quantities);
                    if (!isNaN(price) && !isNaN(quantities)) {
                        _total += (quantities * price);
                    }
                }
            });
        }
        $('#total-po').html(ParseStringToCurrency(_total));
        $('#jtable-detail-po #selectHideShowColumn').remove();
        $('#jtable-detail-po .jtable-column-header').removeAttr('style')
        $('#' + Global.Element.JtableDetail).jtable('load');

        //$(`input[type="date"]`).on("change", function () {
        //    this.setAttribute(
        //        "data-date",
        //        moment(this.value, "YYYY-MM-DD")
        //            .format(this.getAttribute("data-date-format"))
        //    )
        //}).trigger("change")
    }

    function GetProducts() {
        $.ajax({
            url: Global.UrlAction.GetProducts,
            type: 'POST',
            data: '',
            contentType: 'application/json charset=utf-8',
            success: function (data) {
                GlobalCommon.CallbackProcess(data, function () {
                    if (data.Result == "OK") {
                        var option = '';
                        if (data.Data != null && data.Data.length > 0) {
                            $.each(data.Data, function (i, item) {
                                Global.Data.Products.push(item);
                                //option += '<option value="' + item.Code + '" /> ';
                                option += '<option value="' + item.Name + '" /> ';
                            });
                        }
                        $('#products-po').append(option);
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

}

$(document).ready(function () {
    var PO = new GPRO.PO();
    PO.Init();

});
