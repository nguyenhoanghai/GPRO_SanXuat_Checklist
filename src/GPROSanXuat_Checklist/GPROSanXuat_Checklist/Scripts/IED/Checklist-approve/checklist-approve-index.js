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
GPRO.namespace('ChecklistApprove');
GPRO.ChecklistApprove = function () {
    var Global = {
        UrlAction: {
            GetPOs: '/PO/Gets',
            GetProducts: '/Product/Gets',

            Gets: '/Checklist/Gets',
            Save: '/Checklist/Save',
            Delete: '/Checklist/Delete',

            GetEmployees: '/user/GetSelectList',
        },
        Element: {
            JtablePO: 'jtable-checklist-po',
            JtableProduct: 'jtable-checklist-product',
            PopupPO: 'popup-checklist-po',
            PopupProduct: 'popup-checklist-product',

            PopupChecklist: 'popup-checklist',
        },
        Data: {
            IsInsert: true,
            ProductInfo: {
                POId: null,
                ProductId: 0,
                CustomerId: 0,
                ProductUnit: '',
                ObjectType: 1
            },
            Checklists: [],
            EmployeeeArr: []
        }
    }
    this.GetGlobal = function () {
        return Global;
    }

    this.Edit = (id) => {
        bindObj(id);
    }

    this.Info = (id) => {
        window.location.href = '/checklistapprove/info?Id=' + id;
    }

    this.Export = (id) => {
        window.location.href = '/checklist/ExportExcel?Id=' + id;
    }

    this.Delete = (id) => {
        GlobalCommon.ShowConfirmDialog('Bạn có chắc chắn muốn xóa?', function () {
            DeleteChecklist(id);
        }, function () { }, 'Đồng ý', 'Hủy bỏ', 'Thông báo');
    }

    this.Init = function () {
        RegisterEvent();
        GetUsers();
        InitTablePO();
        InitTableProduct();
        InitPopup();
        InitPopupPO();
        InitPopupProduct();
        GetChecklistTemplateSelect('checklist-template-select');
        GetStatusSelect('checklist-status', 'CheckList');
        GetLineSelect('checklist-line', 1);
        Gets();
        $('#checklist-type-select').change();
    }

    var RegisterEvent = function () {
        $('[re-checklist-type]').click(() => { GetChecklistTypeSelect('checklist-type-select') });

        $('#checklist-search').keypress((evt) => {
            if (evt.keyCode == 13)
                Gets();
        });

        $('[re_template]').click(() => { GetChecklistTemplateSelect('checklist-template-select'); })

        $('[re_line]').click(() => { GetLineSelect('checklist-line', 1); })
        $('[re_status]').click(() => { GetStatusSelect('checklist-status', 'CheckList'); });

        $('#checklist-type-select').change(function () {
            switch ($('#checklist-type-select').val()) {
                case '0'://nhan su
                    $('.div-sp-po').hide();
                    $('.related-box').removeClass('col-md-10').addClass('col-md-6');
                    break;
                case '1'://sp
                    $('.div-sp-po').show();
                    $('#btn-checklist-po').hide();
                    $('#btn-checklist-product').show();
                    $('.related-box').removeClass('col-md-6').addClass('col-md-10');
                    break;
                case '2'://po
                    $('.related-box').removeClass('col-md-6').addClass('col-md-10');
                    $('.div-sp-po').show();
                    $('#btn-checklist-po').show();
                    $('#btn-checklist-product').hide();
                    break;
            }
        })
    }

    //#region PO
    InitPopupPO = () => {
        $("#" + Global.Element.PopupPO).modal({
            keyboard: false,
            show: false
        });

        $('#' + Global.Element.PopupPO).on('shown.bs.modal', function () {
            $('div.divParent').attr('currentPoppup', Global.Element.PopupPO.toUpperCase());
        });

        $("#" + Global.Element.PopupPO + ' button[popup-checklist-po-cancel]').click(function () {
            $("#checklist-keyword-po").val('');
            $('div.divParent').attr('currentPoppup', '');
            $("#" + Global.Element.PopupPO).modal("hide");
            $('#' + Global.Element.PopupChecklist).modal('show');
            $('div.divParent').attr('currentPoppup', Global.Element.PopupChecklist.toUpperCase());
        });

        $('#btn-checklist-po').click(() => {
            ReloadTablePO();
            $('#' + Global.Element.PopupChecklist).modal('hide');
        });

        $('#btn-checklist-po').keypress((evt) => {
            if (evt.keyCode == 'Enter')
                ReloadTablePO();
        })
    }

    InitTablePO = () => {
        $('#' + Global.Element.JtablePO).jtable({
            title: 'Danh sách PO',
            paging: true,
            pageSize: 1000,
            pageSizeChange: true,
            sorting: true,
            selectShow: false,
            selecting: true, //Enable selecting
            multiselect: false, //Allow multiple selecting
            selectingCheckboxes: true, //Show checkboxes on first column
            actions: {
                listAction: Global.UrlAction.GetPOs,
            },
            //messages: {
            //     searchRecord: 'Tìm kiếm',
            //    selectShow: 'Ẩn hiện cột'
            //},
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
                    title: "Mã ",
                    width: "10%",
                    display: function (data) {
                        var txt = $('<span class="blue bold">' + data.record.Code + '</span>');
                        txt.click(function () {
                            var str = `<ul><li>PO: <b>${data.record.Code} </b></li> 
                                            <li>Khách hàng: <b>${data.record.CustomerName}</b></li> 
                                            <li>Qui cách: <b>${getText(data.record.Specifications)}</b></li>
                                            <li>Đặc tả: <b>${getText(data.record.Note)}</b></li></ul> `;
                            Global.Data.ProductInfo = {
                                POId: data.record.Id,
                                ProductId: data.record.ProductId,
                                CustomerId: data.record.CustomerId,
                                ProductUnit: data.record.ProductUnit,
                                ObjectType: 2
                            };

                            $('#span-pro-unit').html(data.record.ProductUnit);
                            $('#checklist-product-info').empty().append(str);
                            $('#' + Global.Element.PopupPO).modal('hide');
                            $('#' + Global.Element.PopupChecklist).modal('show');
                        });
                        return txt;
                    }
                },
                Name: {
                    visibility: 'fixed',
                    title: "Tên ",
                    width: "20%",
                },
                ProductName: {
                    title: "Sản phẩm",
                    width: "10%",

                },
                CustomerName: {
                    title: "Khách hàng",
                    width: "20%",
                    sorting: false,
                },
                Specifications: {
                    title: "Qui cách",
                    width: "20%",
                    sorting: false,
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
        $('#' + Global.Element.JtablePO).jtable('load', { 'keyword': $('#checklist-keyword-po').val() });
    }
    //#endregion

    //#region Product
    InitPopupProduct = () => {
        $("#" + Global.Element.PopupProduct).modal({
            keyboard: false,
            show: false
        });

        $('#' + Global.Element.PopupProduct).on('shown.bs.modal', function () {
            $('div.divParent').attr('currentPoppup', Global.Element.PopupProduct.toUpperCase());
        });

        $("#" + Global.Element.PopupProduct + ' button[popup-checklist-product-cancel]').click(function () {
            $("#checklist-keyword-product").val('');
            $('div.divParent').attr('currentPoppup', '');
            $("#" + Global.Element.PopupProduct).modal("hide");
            $('#' + Global.Element.PopupChecklist).modal('show');
            $('div.divParent').attr('currentPoppup', Global.Element.PopupChecklist.toUpperCase());
        });

        $('#btn-checklist-product').click(() => {
            ReloadTableProduct();
            $('#' + Global.Element.PopupChecklist).modal('hide');
        });

        $('#btn-checklist-product').keypress((evt) => {
            if (evt.keyCode == 'Enter')
                ReloadTableProduct();
        })
    }

    InitTableProduct = () => {
        $('#' + Global.Element.JtableProduct).jtable({
            title: 'Danh sách sản phẩm',
            paging: true,
            pageSize: 1000,
            pageSizeChange: true,
            sorting: true,
            selectShow: false,
            selecting: true, //Enable selecting
            multiselect: false, //Allow multiple selecting
            selectingCheckboxes: true, //Show checkboxes on first column
            actions: {
                listAction: Global.UrlAction.GetProducts,
            },
            //messages: {
            //    searchRecord: 'Tìm kiếm',
            //    selectShow: 'Ẩn hiện cột'
            //},
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
                        var txt = $('<span class="blue bold"><b>' + data.record.Name + '</b></span>');
                        txt.click(function () {
                            var str = `<ul><li>PO:</li>
                                            <li>Sản phẩm:<b> ${data.record.Name} </b></li>
                                            <li>Khách hàng:<b> ${data.record.CustomerName}</b></li>
                                            <li>Size:<b> ${data.record.SizeName}</b></li>
                                            <li>Qui cách: </li>
                                            <li>Đặc tả:<b> ${getText(data.record.Note)}</b></li></ul> `;
                            Global.Data.ProductInfo = {
                                POId: null,
                                ProductId: data.record.Id,
                                CustomerId: data.record.CustomerId,
                                ProductUnit: data.record.UnitName,
                                ObjectType: 1
                            }
                            $('#span-pro-unit').html(data.record.UnitName);
                            $('#checklist-product-info').empty().append(str);
                            $('#' + Global.Element.PopupProduct).modal('hide');
                            $('#' + Global.Element.PopupChecklist).modal('show');
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

    ReloadTableProduct = () => {
        $('#' + Global.Element.JtableProduct).jtable('load', { 'keyword': $('#checklist-keyword-product').val() });
    }
    //#endregion

    Gets = () => {
        Global.Data.Checklists.length = 0;
        $.ajax({
            url: Global.UrlAction.Gets,
            type: 'POST',
            data: JSON.stringify({ 'keyword': $('#checklist-search').val() }),
            contentType: 'application/json charset=utf-8',
            success: function (data) {
                if (data.Result == "OK") {
                    var table = $('.table-checklist tbody');
                    table.empty();
                    var str = '<tr><td colspan="12" style="text-align:center">Không có dữ liệu </tr></td>';
                    var objs = JSON.parse(data.Records);
                    if (objs.length > 0) {
                        str = '';
                        objs.forEach(x => {
                            str += `<tr>
                                        <td>${x.Name}</td>
                                        <td>${getText(x.LineName)}</td >
                                        <td> </td>
                                        <td> </td>
                                        <td>${getText(x.CustomerName)}</td>
                                        <td>${getText(x.ProductName)}</td>
                                        <td>${x.Productivity}</td>
                                        <td>${x.ProductionDays}</td>
                                        <td><span class="bold red">${x.Quantities}</span> ${getText(x.ProductUnit)}</td>                                        
                                        <td>${getDate(x.InputDate)}</td>
                                        <td>${getDate(x.EndDate)}</td>
                                        <td>${getDate(x.DeliveryDate)}</td>
                                        <td>${x.StatusName}</td>
                                        <td>
                                            <i onClick="Edit(${x.Id})" class="fa fa-pencil-square-o clickable blue hide" title="Cập nhật thông tin checklist"   ></i>
                                            <i onClick="Info(${x.Id})" class="fa fa-list-alt clickable blue" title="Xem chi tiết checklist"  ></i>
                                            <i onClick="Export(${x.Id})" class="fa fa-file-excel-o clickable blue hide" title="Xuất report checklist"  ></i>
                                            <i onClick="Delete(${x.Id})" class="fa fa-trash clickable red hide" title="Xóa checklist"  ></i>
                                        </td>
                                    </tr>`;
                            Global.Data.Checklists.push(x);
                        });
                    }
                    table.append(str);
                }
                else
                    GlobalCommon.ShowMessageDialog('Lỗi', function () { }, "Đã có lỗi xảy ra trong quá trình xử lý.");
            }
        });
    }

    InitPopup = () => {
        $("#" + Global.Element.PopupChecklist).modal({
            keyboard: false,
            show: false
        });

        $('#' + Global.Element.PopupChecklist).on('shown.bs.modal', function () {
            $('div.divParent').attr('currentPoppup', Global.Element.PopupChecklist.toUpperCase());
            $("#checklist-type-select").val(Global.Data.ParentId);
        });

        $("#" + Global.Element.PopupChecklist + ' button[checklist-save]').click(function () {
            if ($('#checklist-name').val().trim() == "") {
                GlobalCommon.ShowMessageDialog("Vui lòng nhập tên checklist.", function () { }, "Lỗi Nhập liệu");
            }
            else if ($('#checklist-template-select').val().trim() == "0" && $('#checklist-id').val() == '0') {
                GlobalCommon.ShowMessageDialog("Vui lòng chọn mẫu checklist.", function () { }, "Lỗi Nhập liệu");
            }
            else
                SaveChecklist();
        });
        $("#" + Global.Element.PopupChecklist + ' button[checklist-cancel]').click(function () {
            $('#checklist-id').val('0');
            $('#checklist-note').val('');
            $("#checklist-name").val('');
            $('#checklist-product-info').empty();
            $("#checklist-quantities,#checklist-productiondays,#checklist-productivity").val(1);
            Global.Data.ProductInfo = {
                POId: null,
                ProductId: 0,
                CustomerId: 0,
                ProductUnit: '',
                ObjectType: 1
            };
            $('div.divParent').attr('currentPoppup', '');
            $('#checklist-template-select,#btn-checklist-po,#btn-checklist-product').prop('disabled', false);
            $('#checklist-related-employee').data("kendoMultiSelect").value("");
            $("#" + Global.Element.PopupChecklist).modal("hide");
            Gets();
        });
    }

    SaveChecklist = () => {
        var obj = {
            Id: $('#checklist-id').val(),
            Name: $('#checklist-name').val(),
            Note: $('#checklist-note').val(),
            TemplateId: $('#checklist-template-select').val(),
            POId: Global.Data.ProductInfo.POId,
            ProductId: Global.Data.ProductInfo.ProductId,
            CustomerId: Global.Data.ProductInfo.CustomerId,
            ObjectType: $('#checklist-type-select').val(),
            LineId: $('#checklist-line').val(),
            ProductionDays: $('#checklist-productiondays').val(),
            Quantities: $('#checklist-quantities').val(),
            Productivity: $('#checklist-productivity').val(),
            DeliveryDate: $('#checklist-dilivery-date').data("kendoDatePicker").value(),
            InputDate: $('#checklist-input-date').data("kendoDatePicker").value(),
            EndDate: $('#checklist-end-date').data("kendoDatePicker").value(),
            StatusId: $('#checklist-status').val(),
            RelatedEmployees: $('#checklist-related-employee').data("kendoMultiSelect").value().toString(),
        }

        if (obj.ObjectType == '0') {
            obj.POId = null;
            obj.ProductId = null;
            obj.LineId = null;
            obj.CustomerId = null;
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
                        if (result.Data && result.Data != 0)
                            window.location.href = '/checklist/admininfo?Id=' + result.Data;
                        else
                            $("#" + Global.Element.PopupChecklist + ' button[checklist-cancel]').click();
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

    DeleteChecklist = (Id) => {
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
                }, false, Global.Element.PopupChecklist, true, true, function () {

                    var msg = GlobalCommon.GetErrorMessage(data);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
                });
            }
        });
    }

    bindObj = (id) => {
        var found = Global.Data.Checklists.filter(x => x.Id == id)[0];
        if (found) {
            $('#checklist-id').val(found.Id);
            $('#checklist-line').val(found.LineId);
            $("#checklist-name").val(found.Name);
            $("#checklist-quantities").val(found.Quantities);

            $("#checklist-productiondays").val(found.ProductionDays);
            $("#checklist-productivity").val(found.Productivity);
            $("#checklist-status").val(found.StatusId);
            $("#checklist-note").val(found.Note);

            if (found.RelatedEmployees)
                $('#checklist-related-employee').data("kendoMultiSelect").value(JSON.parse('[' + found.RelatedEmployees + ']'));
            else
                $('#checklist-related-employee').data("kendoMultiSelect").value("");

            var deliveryDateInput = $("#checklist-dilivery-date").data("kendoDatePicker");
            var inputDateInput = $("#checklist-input-date").data("kendoDatePicker");
            var endDateInput = $("#checklist-end-date").data("kendoDatePicker");
            var _deliveryDate = undefined;
            var _inputDate = undefined;
            var _endDate = undefined;

            if (found.InputDate) {
                _inputDate = new Date(moment(found.InputDate));
                inputDateInput.value(kendo.toString(_inputDate, 'dd/MM/yyyy'));
            }
            if (found.EndDate) {
                _endDate = new Date(moment(found.EndDate));
                endDateInput.value(kendo.toString(_endDate, 'dd/MM/yyyy'));
            }
            if (found.DeliveryDate) {
                _deliveryDate = new Date(moment(found.DeliveryDate));
                deliveryDateInput.value(kendo.toString(_deliveryDate, 'dd/MM/yyyy'));
                inputDateInput.min(kendo.toString(_deliveryDate, 'dd/MM/yyyy'));
            }

            deliveryDateInput.trigger("change");
            inputDateInput.trigger("change");

            var str = `<ul>
                            <li>PO:</li>
                            <li>Sản phẩm:<b> ${found.ProductName} </b></li>
                            <li>Khách hàng:<b> ${found.CustomerName}</b></li>
                            <li>Size:<b> ${found.SizeName}</b></li>
                            <li>Qui cách: </li>
                            <li>Đặc tả:<b>  </b></li>
                        </ul> `;
            $('#span-pro-unit').html(found.ProductUnit);
            $('#checklist-product-info').empty().append(str);
            $('#checklist-template-select,#btn-checklist-po,#btn-checklist-product').prop('disabled', true);
            $("#" + Global.Element.PopupChecklist).modal("show");
        }
        else {
            alert('Không tìm thấy thông tin');
        }
    }

    getText = (value) => {
        if (value) return value;
        return '';
    }

    getDate = (value) => {
        if (value) {
            var date = moment(value)
            return txt = '<span class="red ">' + date.format('DD/MM/YYYY') + '</span>';
        }
        return '';
    }

    GetUsers = () => {
        $.ajax({
            url: Global.UrlAction.GetEmployees,
            type: 'POST',
            data: JSON.stringify({ 'userIds': null }),
            contentType: 'application/json charset=utf-8',
            beforeSend: function () { $('#loading').show(); },
            success: function (data) {
                $('#loading').hide();
                GlobalCommon.CallbackProcess(data, function () {
                    if (data.Result == "OK") {
                        var option2 = '';
                        if (data.Records != null && data.Records.length > 0) {
                            $.each(data.Records, function (i, item) {
                                Global.Data.EmployeeeArr.push(item);
                                option2 += '<option value="' + item.Value + '">' + item.Name + '</option> ';
                            });
                        }

                        $('#checklist-related-employee').empty().append(option2);
                        $('#checklist-related-employee').kendoMultiSelect().data("kendoMultiSelect");
                        var multiselect = $('#checklist-related-employee').data("kendoMultiSelect");

                        multiselect.refresh();
                    }
                    else
                        GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình xử lý.");
                }, false, Global.Element.PopupOrderAnalys, true, true, function () {

                    var msg = GlobalCommon.GetErrorMessage(data);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
                });
            }
        });
    }

} 
