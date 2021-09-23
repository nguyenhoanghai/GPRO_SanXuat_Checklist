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
GPRO.namespace('LotSupplies');
GPRO.LotSupplies = function () {
    var Global = {
        UrlAction: {
            GetList: '/LotSupplies/Gets',
            Save: '/LotSupplies/Save',
            Delete: '/LotSupplies/Delete',
        },
        Element: {
            Jtable: 'lot-supplies-jtable',
            Popup: 'lot-supplies-popup', 
        },
        Data: {
            LotSupplies: {},
            key: 0,
            QuantityUsed: 0,
            Index: 0,
            Code: '',
        }
    }
    this.GetGlobal = function () {
        return Global;
    }

    this.Init = function () {
        RegisterEvent();
        InitPopup(); 
        GetLastIndex();
        InitList();
        ReloadList();
        InitDateField();
        //GetCustomerSelect('customerid', 2);
        GetMaterialSelect('lot-supplies-material', 0);
        GetWarehouseSelect('lot-supplies-warehouse');

        GetUnitSelect('lot-supplies-moneytype', 'TIENTE');
        GetUnitSelect('lot-supplies-unit', 'LOVATU');

        //GetStatusSelect('lot-supplies-status');

    }

    var RegisterEvent = function () {

        $('#' + Global.Element.Popup).on('shown.bs.modal', function (e) {

            if (Global.Data.LotSupplies.Id == 0) {
                $('#lot-supplies-moneytype option:first').prop('selected', true);
                $('#lot-supplies-moneytype').change();
            }

            if ($('#lot-supplies-index').val() == '')
                $('#lot-supplies-index').val((Global.Data.Code + (Global.Data.Index + 1)));
        });

        //$('[re_customer]').click(function () {
        //    GetCustomerSelect('customerid', 2);
        //});

        $('[re_material]').click(function () {
            GetMarialSelect('materialid', 0);
        });

        $('[re_warehouse]').click(function () {
            GetWareHouseSelect('warehouseid');
        });

        $('[re_unit]').click(function () {
            GetUnitSelect('unit');
        });

        $('[re_status]').click(function () {
            GetStatusSelect('statusid');
        });

        $('#lot-supplies-quantity').keyup(function () {
            var vl = parseInt($(this).val());
            $('#lot-supplies-currentquantity').html(vl - Global.Data.QuantityUsed);
        });

        $('#lot-supplies-moneytype').change(function () {
            $('#lot-supplies-exchangerate').val($('#lot-supplies-moneytype option:selected').attr('tigia'));
        });

    }

    function InitDateField() {
        $("#lot-supplies-expirydate,#lot-supplies-inputdate").kendoDatePicker({
            format: "dd/MM/yyyy",
        });

        $("#lot-supplies-manufacturedate").kendoDatePicker({
            format: "dd/MM/yyyy ",
            change: function () {
                var value = this.value();
                var dp = $("#lot-supplies-expirydate").data("kendoDatePicker");
                dp.min(value);
                dp = $("#lot-supplies-inputdate").data("kendoDatePicker");
                dp.min(value);
                dp = $("#lot-supplies-warrantydate").data("kendoDatePicker");
                dp.min(value);
            }
        });

        $("#lot-supplies-warrantydate").kendoDatePicker({
            format: "dd/MM/yyyy",
            change: function () {
                var value = this.value();
                var dp = $("#lot-supplies-expirydate").data("kendoDatePicker");
                dp.min(value);
            }
        });
    }
    /**********************************************************************************************************************
                                                            MaterialType
    ***********************************************************************************************************************/
     
    function InitList() {
        $('#' + Global.Element.Jtable).jtable({
            title: 'Danh Sách Lô Vật Tư',
            paging: true,
            pageSize: 10,
            pageSizeChange: true,
            sorting: true,
            selectShow: true,
            actions: {
                listAction: Global.UrlAction.GetList,
                //createAction: Global.Element.Popup,  
            },
            messages: {
                //addNewRecord: 'Thêm mới', 
                selectShow: 'Ẩn hiện cột'
            },
            searchInput: {
                id: 'lot-supplies-keyword',
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
                    title: "Tên - Mã Lô",
                    width: "10%",
                    visibility: 'fixed',
                    display: function (data) {
                        txt = "<span >" + data.record.Name + "</span> (<span class=\"red\">" + data.record.Code + "</span>)";
                        return txt;
                    }
                },
                MaterialId: {
                    title: "Vật Tư",
                    width: "15%",
                    display: function (data) {
                        txt = '<span >' + data.record.strMaterial + '</span>';
                        return txt;
                    }
                },
                WareHouseId: {
                    title: "Kho",
                    width: "15%",
                    display: function (data) {
                        txt = '<span >' + data.record.strWarehouse + '</span>';
                        return txt;
                    }
                },
                InputDate: {
                    title: 'Ngày Nhập',
                    width: '10%',
                    display: function (data) {
                        var date = new Date(parseJsonDateToDate(data.record.InputDate))
                        txt = '<span class="">' + ParseDateToString(date) + '</span>';
                        return txt;
                    }
                },
                ManufactureDate: {
                    title: 'Ngày Sản Xuất',
                    width: '10%',
                    display: function (data) {
                        var date = new Date(parseJsonDateToDate(data.record.ManufactureDate))
                        txt = '<span class="">' + ParseDateToString(date) + '</span>';
                        return txt;
                    }
                },
                WarrantyDate: {
                    title: 'Ngày Bảo Hành',
                    width: '10%',
                    display: function (data) {
                        if (data.record.WarrantyDate != null) {
                            var date = new Date(parseJsonDateToDate(data.record.WarrantyDate))
                            txt = '<span class="">' + ParseDateToString(date) + '</span>';
                            return txt;
                        }
                    }
                },
                ExpiryDate: {
                    title: 'Ngày Hết Hạn',
                    width: '10%',
                    display: function (data) {
                        if (data.record.ExpiryDate != null) {
                            var date = new Date(parseJsonDateToDate(data.record.ExpiryDate))
                            txt = '<span class="">' + ParseDateToString(date) + '</span>';
                            return txt;
                        }
                    }
                },
                QuantityUsed: {
                    title: 'SL Tồn',
                    width: '10%',
                    display: function (data) {
                        txt = `<span class="red">${(data.record.Quantity - data.record.QuantityUsed)}</span> ${data.record.strMaterialUnit}`;
                        return txt;
                    }
                },
                StatusId: {
                    title: 'Trạng Thái',
                    width: '1%',
                    sorting: false,
                    display: function (data) {
                        txt = '<span >' + data.record.strStatus + '</span>';
                        return txt;
                    }
                },
                //Note: {
                //    title: "Mô Tả",
                //    width: "20%",
                //    sorting: false
                //},
                edit: {
                    title: '',
                    width: '1%',
                    sorting: false,
                    display: function (data) {
                        var text = $('<i data-toggle="modal" data-target="#' + Global.Element.Popup + '" title="Chỉnh sửa thông tin" class="fa fa-pencil-square-o clickable blue"  ></i>');
                        text.click(function () { 
                            $('#lot-supplies-Id').val(data.record.Id);
                            $('#lot-supplies-name').val(data.record.Name);
                            $('#lot-supplies-index').val(data.record.Code);

                            $('#lot-supplies-warehouse').val(data.record.WareHouseId);

                            $('#lot-supplies-material').val(data.record.MaterialId);
                            $('#lot-supplies-quantity').val(data.record.Quantity);
                            $('#lot-supplies-unit').val(data.record.MaterialUnitId);

                            $('#lot-supplies-price').val(data.record.Quantity);
                            $('#lot-supplies-moneytype').val(data.record.MoneyTypeId);
                            $('#lot-supplies-exchangerate').val(data.record.ExchangeRate);
                            $('#lot-supplies-currentquantity').html(data.record.Quantity - data.record.QuantityUsed);

                            $('#lot-supplies-specifications-paking').val(data.record.SpecificationsPaking);
                            $('#lot-supplies-status').val((data.record.StatusId)); 
                            Global.Data.QuantityUsed = data.record.QuantityUsed;

                            var d = new Date(parseJsonDateToDate(data.record.InputDate));
                            var dp = $("#lot-supplies-inputdate").data("kendoDatePicker");
                            dp.value(d);

                            var d = new Date(parseJsonDateToDate(data.record.ManufactureDate));
                            var dp = $("#lot-supplies-manufacturedate").data("kendoDatePicker");
                            dp.value(d);

                            var expiry = $("#lot-supplies-expirydate").data("kendoDatePicker");
                            if (data.record.WarrantyDate != null) {
                                d = new Date(parseJsonDateToDate(data.record.WarrantyDate));
                                dp = $("#lot-supplies-warrantydate").data("kendoDatePicker");
                                dp.value(d);
                                expiry.min(d);
                            }

                            if (data.record.ExpiryDate != null) {
                                d = new Date(parseJsonDateToDate(data.record.ExpiryDate));
                                expiry.value(d);
                            }
                            Global.Data.Index = data.record.Index;
                            Global.Data.isEdit = true;

                            if (data.record.StatusId == 9) {
                                // duyệt
                                $(`#lot-supplies-Id,
                                    #lot-supplies-name,
                                    #lot-supplies-index,
                                    #lot-supplies-warehouse,
                                    #lot-supplies-material,
                                    #lot-supplies-quantity,
                                    #lot-supplies-unit,
                                    #lot-supplies-price,
                                    #lot-supplies-moneytype,
                                    #lot-supplies-exchangerate,
                                    #lot-supplies-currentquantity,
                                    #lot-supplies-specifications-paking,
                                    #lot-supplies-inputdate,
                                    #lot-supplies-manufacturedate,
                                    #lot-supplies-expirydate,
                                    #lot-supplies-warrantydate,
                                    #lot-supplies-note,
                                    [lot-supplies-save]`).prop('disabled', true);
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
        $('#' + Global.Element.Jtable).jtable('load', { 'whId': 0, 'greaterThan0': false,'keyword': $('#lot-supplies-keyword').val() });
    }

    function InitPopup() {
        $("#" + Global.Element.Popup).modal({
            keyboard: false,
            show: false
        });

        $('#' + Global.Element.Popup).on('show.bs.modal', function (e) {
            if ($('#lot-supplies-id').val() == '' || $('#lot-supplies-id').val() == '0')
                GetLastIndex();
        });

        $("#" + Global.Element.Popup + ' button[lot-supplies-save]').click(function () {
            if (CheckValidate()) {
                Save('Submited');
            }
        });

        $("#" + Global.Element.Popup + ' button[lot-supplies-cancel]').click(function () {
            $("#" + Global.Element.Popup).modal("hide");
            Global.Data.QuantityUsed = 0;
            $('#lot-supplies-Id').val(0);
            $('#lot-supplies-name').val('');
            $('#lot-supplies-material').val(0);
            $('#lot-supplies-warehouse').val(0);
            $('#lot-supplies-quantity').val(0);
            $('#lot-supplies-unit').val(0);
            $('#lot-supplies-currentquantity').val(0);
            $('#lot-supplies-price').val(0);
            $('#lot-supplies-moneytype').val(0);
            $('#lot-supplies-exchangerate').val(0);
            $("#lot-supplies-inputdate").data("kendoDatePicker").value('');
            $("#lot-supplies-manufacturedate").data("kendoDatePicker").value('');
            $("#lot-supplies-expirydate").data("kendoDatePicker").value('');
            $("#lot-supplies-warrantydate").data("kendoDatePicker").value('');
            $('#lot-supplies-note').val('');
            $('#lot-supplies-specifications-paking').val('');
            $(`#lot-supplies-Id,
                #lot-supplies-name,
                #lot-supplies-index,
                #lot-supplies-warehouse,
                #lot-supplies-material,
                #lot-supplies-quantity,
                #lot-supplies-unit,
                #lot-supplies-price,
                #lot-supplies-moneytype,
                #lot-supplies-exchangerate,
                #lot-supplies-currentquantity,
                #lot-supplies-specifications-paking,
                #lot-supplies-inputdate,
                #lot-supplies-manufacturedate,
                #lot-supplies-expirydate,
                #lot-supplies-warrantydate,
                #lot-supplies-note,
                [lot-supplies-save]`).prop('disabled', false);
        });
    }
     
    function CheckValidate() {
        if ($('#lot-supplies-name').val().trim() == "") {
            GlobalCommon.ShowMessageDialog("Vui lòng nhập Tên Lô Vật Tư.", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        return true;
    }

    function Save(_status) {
        var obj = {
            Id: $('#lot-supplies-Id').val(),
            Name: $('#lot-supplies-name').val(),
            Index: Global.Data.Index,
            MaterialId: $('#lot-supplies-material').val(),
            //CustomerId: 0,
            WareHouseId: $('#lot-supplies-warehouse').val(),
            Quantity: $('#lot-supplies-quantity').val(),
            MaterialUnitId: $('#lot-supplies-unit').val(),
            CurrentQuantity: $('#lot-supplies-currentquantity').val(),
            Price: $('#lot-supplies-price').val(),
            MoneyTypeId: $('#lot-supplies-moneytype').val(),
            ExchangeRate: $('#lot-supplies-exchangerate').val(),
            InputDate: $("#lot-supplies-inputdate").data("kendoDatePicker").value(),
            ManufactureDate: $("#lot-supplies-manufacturedate").data("kendoDatePicker").value(),
            ExpiryDate: $("#lot-supplies-expirydate").val() == '' ? null : $("#lot-supplies-expirydate").data("kendoDatePicker").value(),
            WarrantyDate: $("#lot-supplies-warrantydate").val() == '' ? null : $("#lot-supplies-warrantydate").data("kendoDatePicker").value(),
            Note: $('#lot-supplies-note').val(),
            SpecificationsPaking: $('#lot-supplies-specifications-paking').val(),
            StatusId: $('#lot-supplies-status').val(),
            strStatus: _status,
        }
        if (obj.Id == 0)
            obj.Index += 1;

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
                        $("#" + Global.Element.Popup + ' button[lot-supplies-cancel]').click();
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

    function Delete(Id) {
        $.ajax({
            url: Global.UrlAction.Delete,
            type: 'POST',
            data: JSON.stringify({ 'Id': Id }),
            contentType: 'application/json charset=utf-8',
            beforeSend: function () { $('#loading').show(); },
            success: function (result) {
                $('#loading').hide();
                GlobalCommon.CallbackProcess(result, function () {
                    if (result.Result == "OK")
                        ReloadList();
                    else
                        GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình xử lý.");
                }, false, Global.Element.PopupSize, true, true, function () {

                    var msg = GlobalCommon.GetErrorMessage(result);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
                });
            }
        });
    }

    function GetLastIndex() {
        $.ajax({
            url: '/LotSupplies/GetLastIndex',
            type: 'POST',
            contentType: 'application/json',
            beforeSend: function () { $('#loading').show(); },
            success: function (data) {
                $('#loading').hide();
                Global.Data.Index = parseInt(data.Records);
                Global.Data.Code = data.Data;
                $('#lot-supplies-index').val((Global.Data.Code + (Global.Data.Index + 1)));
            }
        });
    };
}

$(document).ready(function () {
    var lotsupplies = new GPRO.LotSupplies();
    lotsupplies.Init();
})

