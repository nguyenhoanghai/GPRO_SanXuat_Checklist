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
GPRO.namespace('Receiption');
GPRO.Receiption = function () {
    var Global = {
        UrlAction: {
            Get: '/Receiption/GetById',
            Save: '/Receiption/Save',

        },
        Element: {
            Jtable: 'jtableReceiption',
        },
        Data: {
            ReceiptionModel: {}
        }
    }
    this.GetGlobal = function () {
        return Global;
    }

    this.Init = function () {
        RegisterEvent();
        InitDatePicker();
        GetWareHouseSelect('warehouse');
        GetMoneyTypeSelect('moneytype', 1);
        GetEmployeeSelect('approveduser');
        $('#isapproved').change();

        $('#customertype').change();

        if ($('#Id').val() != '0')
            var inter = setInterval(function () { Get(); clearInterval(inter); }, 500);
    }

    var RegisterEvent = function () {
        $('#btnBack').click(function () {
            window.location.href = '/Receiption/Index';
        });

        $('#btnSave').click(function () {
            if (CheckValidate())
                Save();
        });

        $('#exchangerate').on("keypress", function () {
            return isNumberKey(event);
        });

        $('#customertype').change(function () {
            GetCustomerSelectByType('customer', $(this).val());
        });

        $('[re_moneytype]').click(function () {
            GetMoneyTypeSelect('moneytype', 1);
        });

        $('[re_warehouse]').click(function () {
            GetWareHouseSelect('warehouse');
        });

        $('[re_customer]').click(function () {
            GetCustomerSelectByType('customer', $('#customertype').val());
        });

        $('[re_approveduser]').click(function () {
            GetEmployeeSelect('approveduser');
        });

        $('#isapproved').change(function () {
            var datepicker = $("#approveddate").data("kendoDatePicker");
            if (!$('#isapproved').prop('checked')) {
                $('#approveduser').attr('disabled', true);
                datepicker.enable(false);
            }
            else {
                $('#approveduser').attr('disabled', false);
                datepicker.enable(true);
            }
        });
    }

    function InitDatePicker() {
        $("#dateofaccounting").kendoDatePicker({
            format: "dd/MM/yyyy",
        });

        $("#approveddate").kendoDatePicker({
            format: "dd/MM/yyyy",
        });
    }

    function SelectCustomerByType() {
        var type = parseInt($('#customertype').val());
        GetCustomerSelectByType('customer', type);
    }

    /*********************************************************************************************************************
                                                            TestRecords
    ***********************************************************************************************************************/
    function Get() {
        $.ajax({
            url: Global.UrlAction.Get,
            type: 'POST',
            data: JSON.stringify({ 'Id': $('#Id').val() }),
            contentType: 'application/json charset=utf-8',
            success: function (result) {
                GlobalCommon.CallbackProcess(result, function () {
                    SetData(result.Data);
                }, false, Global.Element.PopupSize, true, true, function () {

                    var msg = GlobalCommon.GetErrorMessage(result);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
                });
            }
        });
    }

    function Save() {
        var obj = GetData();

        $.ajax({
            url: Global.UrlAction.Save,
            type: 'POST',
            data: JSON.stringify({ 'obj': obj }),
            contentType: 'application/json charset=utf-8',
            success: function (result) {
                if (result.Result == "OK")
                    $('#btnBack').click();
                else
                    GlobalCommon.ShowMessageDialog(result.ErrorMessages[0].Message, function () { }, 'Lỗi');
            }
        });
    }

    function SetData(obj) {
        $('#Id').val(obj.Id);
        $('#code').val(obj.Code);
        $('#name').val(obj.Name);
        $('#warehouse').val(obj.WareHouseId);
        $('#customertype').val(obj.CustomerType).change();
        var interval = setInterval(function () { $('#customer').val(obj.CustomerId); clearInterval(interval) }, 1000);
        $('#trader').val(obj.Trader);
        $('#moneytype').val(obj.MoneyTypeId);
        $('#exchangerate').val(obj.ExchangeRate);
        $('#transactiontype').val(obj.TransactionType);
        //$('#dateofaccounting').val(ParseDateToString(parseJsonDateToDate(obj.DateOfAccounting)));
        $('#dateofaccounting').data("kendoDatePicker").value((obj.DateOfAccounting != null ? parseJsonDateToDate(obj.DateOfAccounting) : null));
        $('#isapproved').prop('checked', obj.IsApproved).change();
        $('#approveduser').val((obj.ApprovedUser != null ? obj.ApprovedUser : 0));
        $('#approveddate').data("kendoDatePicker").value((obj.ApprovedDate != null ? parseJsonDateToDate(obj.ApprovedDate) : null));
        $('#note').val(obj.Note);
        if (obj.IsApproved)
            $('.modal-footer #btnSave').remove();
    }

    function GetData() {
        var obj = {
            Id: $('#Id').val(),
            Code: $('#code').val(),
            Name: $('#name').val(),
            WareHouseId: $('#warehouse').val(),
            CustomerType: $('#customertype').val(),
            CustomerId: $('#customer').val(),
            Trader: $('#trader').val(),
            MoneyTypeId: $('#moneytype').val(),
            ExchangeRate: $('#exchangerate').val(),
            TransactionType: $('#transactiontype').val(),
            DateOfAccounting: $('#dateofaccounting').val(),
            IsApproved: $('#isapproved').prop('checked'),
            ApprovedDate: $('#approveddate').data("kendoDatePicker").value(),
            ApprovedUser: $('#approveduser').val(),
            Note: $('#note').val(),
        }
        return obj;
    }

    function CheckValidate() {
        if ($('#name').val().trim() == "") {
            GlobalCommon.ShowMessageDialog("Vui lòng nhập Tên Phiếu.", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        else if ($('#warehouse').val() == "") {
            GlobalCommon.ShowMessageDialog("Vui lòng chọn Kho.", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        else if ($('#customertype').val() == "") {
            GlobalCommon.ShowMessageDialog("Vui lòng Loại Khách Hàng.", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        else if ($('#customer').val() == "") {
            GlobalCommon.ShowMessageDialog("Vui lòng chọn Khách Hàng.", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        else if ($('#moneytype').val() == "") {
            GlobalCommon.ShowMessageDialog("Vui lòng chọn Loại Tiền Tệ", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        else if ($('#exchangerate').val() == "") {
            GlobalCommon.ShowMessageDialog("Vui lòng nhập Tỉ Giá.", function () { $('#exchangerate').focus(); }, "Lỗi Nhập liệu");
            return false;
        }
        else if (parseFloat($('#exchangerate').val()) == 0) {
            GlobalCommon.ShowMessageDialog("Tỉ Giá không thể là 0. Vui lòng nhập lại.", function () { $('#exchangerate').focus(); }, "Lỗi Nhập liệu");
            return false;
        }
        else if ($('#transactiontype').val().trim() == "") {
            GlobalCommon.ShowMessageDialog("Vui lòng chọn Hình Thức Giao Dịch.", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        else if ($('#dateofacccounting').val() == '') {
            GlobalCommon.ShowMessageDialog("Vui lòng chọn Ngày Hoạch Toán.", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        else if ($('#isapproved').prop('checked') == true) {
            if ($('#approveduser').val() == "0") {
                GlobalCommon.ShowMessageDialog("Vui lòng chọn Người Duyệt.", function () { }, "Lỗi Nhập liệu");
                return false;
            }
            else {
                if ($('#approveddate').val() == "") {
                    GlobalCommon.ShowMessageDialog("Vui lòng chọn Ngày Duyệt.", function () { }, "Lỗi Nhập liệu");
                    return false;
                }
            }

        }
        return true;
    }
}
$(document).ready(function () {
    var Receiption = new GPRO.Receiption();
    Receiption.Init();
})