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
GPRO.namespace('ReportInventoryByWH');
GPRO.ReportInventoryByWH = function () {

    this.Init = function () {
        RegisterEvent();
        GetWareHouseCombobox('inventory_warehouse');
    }

    var RegisterEvent = function () {

        $('#inventory_btnView').click(function () {
            GetData();
        });

        $('#inventory_btnExportToExcel').click(function () {
            var wId = $('#inventory_warehouse').data("kendoComboBox").value();
            if (wId == "" || wId == null)
                GlobalCommon.ShowMessageDialog("Vui lòng chọn kho.", function () { }, "Thông báo");
            else
                window.location.href = '/LotSupplies/ExportToExcel_InventoryByWH?wId=' + wId;
        });
    }

    function GetData() {
        var wId = $('#inventory_warehouse').data("kendoComboBox").value();
        if (wId == "" || wId == null)
            GlobalCommon.ShowMessageDialog("Vui lòng chọn kho.", function () { }, "Thông báo");
        else {
            $.ajax({
                url: '/LotSupplies/GetReportInventoryByWH',
                type: 'POST',
                data: JSON.stringify({ 'wId': wId }),
                contentType: 'application/json',
                beforeSend: function () { $('#loading').show(); },
                success: function (result) {
                    var str = '<tr><td colspan="13">Không có dữ liệu</td></tr>';
                    if (result.Data.length > 0) {
                        str = "";
                        $.each(result.Data, function (i, item) {
                            var total = 0;
                            var totalmoney = 0;
                            if (wId == 0) // neu la chon tat ca
                            {
                                for (var j = 0; j < item.length; j++) {
                                    if (item[j].WareHouseName != null) {

                                        if (j == 0) // neu la dong dau tien thi thuc hien rowspan ở ô Tên Vật Tư
                                        {
                                            str += '<tr class="' + (j % 2 != 0 ? "row_2" : "") + '"><td>' + (j + 1) + '</td><td rowspan="' + item.length + '">' + item[j].WareHouseName + ' ( ' + item[j].WareHouseCode + ' )</td>';
                                            str += '<td>' + (item[j].Name != null ? item[j].Name + " (" + item[j].Code + ")" : "") + '</td><td>' + (item[j].MaterialName != null ? item[j].MaterialName + " (" + item[j].MaterialCode + ")" : "") + '</td>';
                                            str += '<td>' + (item[j].Quantity != null ? ParseStringToCurrency(item[j].Quantity) : "") + '</td>';
                                            str += '<td>' + ((item[j].Quantity != null && item[j].QuantityUsed != null) ? (ParseStringToCurrency(item[j].Quantity - item[j].QuantityUsed)) : "") + '</td>';
                                            str += '<td>' + (item[j].UnitName != null ? item[j].UnitName : "") + '</td><td>' + (item[j].Price != null ? ParseStringToCurrency(item[j].Price) : "") + '</td>';
                                            str += '<td>' + (item[j].MoneyTypeName != null ? item[j].MoneyTypeName + " (" + ParseStringToCurrency(item[j].ExchangeRate) + ")" : "") + '</td><td>' + (item[j].TotalMoney != null ? ParseStringToCurrency(item[j].TotalMoney) : "") + '</td>';
                                            str += '<td>' + (item[j].InputDate != null ? ParseDateToString(new Date(parseJsonDateToDate(item[j].InputDate))) : "") + '</td>';
                                            str += '<td>' + (item[j].ExpiryDate != null ? ParseDateToString(new Date(parseJsonDateToDate(item[j].ExpiryDate))) : "") + '</td><td>' + (item[j].StatusName != null ? item[j].StatusName : "") + '</td></tr>';
                                        }
                                        else
                                        {
                                            str += '<tr class="' + (j % 2 != 0 ? "row_2" : "") + '"><td>' + (j + 1) + '</td>';
                                            str += '<td>' + (item[j].Name != null ? item[j].Name + " (" + item[j].Code + ")" : "") + '</td><td>' + (item[j].MaterialName != null ? item[j].MaterialName + " (" + item[j].MaterialCode + ")" : "") + '</td>';
                                            str += '<td>' + (item[j].Quantity != null ? ParseStringToCurrency(item[j].Quantity) : "") + '</td>';
                                            str += '<td>' + ((item[j].Quantity != null && item[j].QuantityUsed != null) ? (ParseStringToCurrency(item[j].Quantity - item[j].QuantityUsed)) : "") + '</td>';
                                            str += '<td>' + (item[j].UnitName != null ? item[j].UnitName : "") + '</td><td>' + (item[j].Price != null ? ParseStringToCurrency(item[j].Price) : "") + '</td>';
                                            str += '<td>' + (item[j].MoneyTypeName != null ? item[j].MoneyTypeName + " (" + ParseStringToCurrency(item[j].ExchangeRate) + ")" : "") + '</td><td>' + (item[j].TotalMoney != null ? ParseStringToCurrency(item[j].TotalMoney) : "") + '</td>';
                                            str += '<td>' + (item[j].InputDate != null ? ParseDateToString(new Date(parseJsonDateToDate(item[j].InputDate))) : "") + '</td>';
                                            str += '<td>' + (item[j].ExpiryDate != null ? ParseDateToString(new Date(parseJsonDateToDate(item[j].ExpiryDate))) : "") + '</td><td>' + (item[j].StatusName != null ? item[j].StatusName : "") + '</td></tr>';
                                        }

                                        total += (item[j].Quantity - item[j].QuantityUsed);
                                        totalmoney += item[j].TotalMoney;
                                    }
                                }
                                //str += '<tr><td colspan="5" style="color: red; font-weight: bold; text-align:right; padding-right:20px">' + "Tổng tồn" + '</td>';
                                //str += '<td style="color: red; font-weight: bold">' + ParseStringToCurrency(total) + '</td>';
                                //str += '<td style="color: red; font-weight:bold; text-align:left; padding-left:20px">' + (item.length > 0 ? item[0].UnitName : "") + '</td>';
                                str += '<td colspan="9" style="color: red; font-weight: bold; text-align:right; padding-right:20px">' + "Tổng Tiền" + '</td>';
                                str += '<td colspan="4" style="color: red; font-weight: bold; text-align: left; padding-left:20px">' + ParseStringToCurrency(totalmoney) + " VNĐ" + '</td></tr>';
                                str += '<tr><td colspan="13" style="height:2px; background-color: silver"></td></tr>';
                            }
                            else {
                                for (var j = 0; j < item.length; j++) {
                                    if (item[j].WareHouseName != null) {

                                        if (j == 0) // neu la dong dau tien thi thuc hien rowspan ở ô Tên Vật Tư
                                        {
                                            str += '<tr class="' + (j % 2 != 0 ? "row_2" : "") + '"><td>' + (j + 1) + '</td><td rowspan="' + item.length + '">' + item[j].WareHouseName + ' ( ' + item[j].WareHouseCode + ' )</td>';
                                            str += '<td>' + (item[j].Name != null ? item[j].Name + " (" + item[j].Code + ")" : "") + '</td><td>' + (item[j].MaterialName != null ? item[j].MaterialName + " (" + item[j].MaterialCode + ")" : "") + '</td>';
                                            str += '<td>' + (item[j].Quantity != null ? ParseStringToCurrency(item[j].Quantity) : "") + '</td>';
                                            str += '<td>' + ((item[j].Quantity != null && item[j].QuantityUsed != null) ? (ParseStringToCurrency(item[j].Quantity - item[j].QuantityUsed)) : "") + '</td>';
                                            str += '<td>' + (item[j].UnitName != null ? item[j].UnitName : "") + '</td><td>' + (item[j].Price != null ? ParseStringToCurrency(item[j].Price) : "") + '</td>';
                                            str += '<td>' + (item[j].MoneyTypeName != null ? item[j].MoneyTypeName + " (" + ParseStringToCurrency(item[j].ExchangeRate) + ")" : "") + '</td><td>' + (item[j].TotalMoney != null ? ParseStringToCurrency(item[j].TotalMoney) : "") + '</td>';
                                            str += '<td>' + (item[j].InputDate != null ? ParseDateToString(new Date(parseJsonDateToDate(item[j].InputDate))) : "") + '</td>';
                                            str += '<td>' + (item[j].ExpiryDate != null ? ParseDateToString(new Date(parseJsonDateToDate(item[j].ExpiryDate))) : "") + '</td><td>' + (item[j].StatusName != null ? item[j].StatusName : "") + '</td></tr>';
                                        }
                                        else
                                        {
                                            str += '<tr class="' + (j % 2 != 0 ? "row_2" : "") + '"><td>' + (j + 1) + '</td>';
                                            str += '<td>' + (item[j].Name != null ? item[j].Name + " (" + item[j].Code + ")" : "") + '</td><td>' + (item[j].MaterialName != null ? item[j].MaterialName + " (" + item[j].MaterialCode + ")" : "") + '</td>';
                                            str += '<td>' + (item[j].Quantity != null ? ParseStringToCurrency(item[j].Quantity) : "") + '</td>';
                                            str += '<td>' + ((item[j].Quantity != null && item[j].QuantityUsed != null) ? (ParseStringToCurrency(item[j].Quantity - item[j].QuantityUsed)) : "") + '</td>';
                                            str += '<td>' + (item[j].UnitName != null ? item[j].UnitName : "") + '</td><td>' + (item[j].Price != null ? ParseStringToCurrency(item[j].Price) : "") + '</td>';
                                            str += '<td>' + (item[j].MoneyTypeName != null ? item[j].MoneyTypeName + " (" + ParseStringToCurrency(item[j].ExchangeRate) + ")" : "") + '</td><td>' + (item[j].TotalMoney != null ? ParseStringToCurrency(item[j].TotalMoney) : "") + '</td>';
                                            str += '<td>' + (item[j].InputDate != null ? ParseDateToString(new Date(parseJsonDateToDate(item[j].InputDate))) : "") + '</td>';
                                            str += '<td>' + (item[j].ExpiryDate != null ? ParseDateToString(new Date(parseJsonDateToDate(item[j].ExpiryDate))) : "") + '</td><td>' + (item[j].StatusName != null ? item[j].StatusName : "") + '</td></tr>';
                                        }

                                        total += (item[j].Quantity - item[j].QuantityUsed);
                                        totalmoney += item[j].TotalMoney;
                                    }
                                }
                                //str += '<tr><td colspan="4" style="color: red; font-weight: bold; text-align:right; padding-right:20px">' + "Tổng tồn" + '</td>';
                                //str += '<td style="color: red; font-weight: bold">' + ParseStringToCurrency(total) + '</td>';
                                //str += '<td style="color: red; font-weight:bold; text-align:left; padding-left:20px">' + (item.length > 0 ? item[0].UnitName : "") + '</td>';
                                str += '<td colspan="9" style="color: red; font-weight: bold; text-align:right; padding-right:20px">' + "Tổng Tiền" + '</td>';
                                str += '<td colspan="4" style="color: red; font-weight: bold; text-align: left; padding-left:20px">' + ParseStringToCurrency(totalmoney) + " VNĐ" + '</td></tr>';
                            }
                        });
                    }
                    $('#inventory_table1 tbody').empty().html(str);
                    if (wId == 0)
                        $('#inventory_warehousename').html((""));
                    else
                        $('#inventory_warehousename').html((result.Data.length > 0 ? result.Data[0][0].WareHouseName : ""));
                    $('#loading').hide();
                }
            });
        }
    }
}
$(document).ready(function () {
    var ReportInventoryByWH = new GPRO.ReportInventoryByWH();
    ReportInventoryByWH.Init();
})