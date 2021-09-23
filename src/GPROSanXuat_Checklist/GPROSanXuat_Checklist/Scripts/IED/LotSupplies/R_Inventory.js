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
GPRO.namespace('ReportInventory');
GPRO.ReportInventory = function () {

    this.Init = function () {
        RegisterEvent();
        GetMaterialCombobox('inventory_material');
        GetWareHouseCombobox('inventory_warehouse');
    }

    var RegisterEvent = function () {

        $('#inventory_btnView').click(function () {
            GetData();
        });

        $('#inventory_btnExportToExcel').click(function () {
            var mId = $('#inventory_material').data("kendoComboBox").value();
            var whId = $('#inventory_warehouse').data("kendoComboBox").value();
            window.location.href = `/LotSupplies/ExportToExcel_Inventory?mId=${mId}&whId=${whId}`;
        });
    }
    function groupBy(xs, f) {
        return xs.reduce((r, v, i, a, k = f(v)) => ((r[k] || (r[k] = [])).push(v), r), {});
    }
    function GetData() {
        var mId = $('#inventory_material').data("kendoComboBox").value();
        var whId = $('#inventory_warehouse').data("kendoComboBox").value();

        $.ajax({
            url: '/LotSupplies/GetReportInventory',
            type: 'POST',
            data: JSON.stringify({ 'mId': mId, 'whId': whId }),
            contentType: 'application/json',
            beforeSend: function () { $('#loading').show(); },
            success: function (result) {

                if (!result.Data.WarehouseName)
                    GenerateGroupWithWarehouse(groupBy(result.Data.Details, (c) => c.StoreWarehouseId));

                console.log(result.Data);

                const aa = groupBy(result.Data.Details, (c) => c.StoreWarehouseId);
                console.log(aa);
                $.each(aa, (i, item) => {
                    console.log(item);
                });

                const bb = groupBy(result.Data.Details, (c) => c.MaterialId);
                console.log(bb);
                $.each(bb, (i, item) => {
                    console.log(item);
                    $.each(item, (_i, _item) => {
                        console.log(_item);
                    });
                });


                //if (result.Data.length > 0) {
                //    str = "";
                //    $.each(result.Data, function (i, item) {
                //        var total = 0;
                //        var totalmoney = 0;
                //        if (mId == 0) // neu la chon tat ca
                //        {
                //            for (var j = 0; j < item.length; j++) {
                //                if (item[j].MaterialName != null) {

                //                    if (j == 0) // neu la dong dau tien thi thuc hien rowspan ở ô Tên Vật Tư
                //                    {
                //                        str += '<tr class="' + (j % 2 != 0 ? "row_2" : "") + '"><td>' + (j + 1) + '</td><td rowspan="' + item.length + '">' + item[j].MaterialName + ' ( ' + item[j].MaterialCode + ' )</td>';
                //                        str += '<td>' + (item[j].Name != null ? item[j].Name + " (" + item[j].Code + ")" : "") + '</td><td>' + (item[j].Quantity != null ? ParseStringToCurrency(item[j].Quantity) : "") + '</td>';
                //                        str += '<td>' + ((item[j].Quantity != null && item[j].QuantityUsed != null) ? (ParseStringToCurrency(item[j].Quantity - item[j].QuantityUsed)) : "") + '</td>';
                //                        str += '<td>' + (item[j].UnitName != null ? item[j].UnitName : "") + '</td><td>' + (item[j].Price != null ? ParseStringToCurrency(item[j].Price) : "") + '</td>';
                //                        str += '<td>' + (item[j].MoneyTypeName != null ? item[j].MoneyTypeName + " (" + ParseStringToCurrency(item[j].ExchangeRate) + ")" : "") + '</td><td>' + (item[j].TotalMoney != null ? ParseStringToCurrency(item[j].TotalMoney) : "") + '</td>';
                //                        str += '<td>' + (item[j].WareHouseName != null ? item[j].WareHouseName + " (" + item[j].WareHouseCode + ")" : "") + '</td><td>' + (item[j].InputDate != null ? ParseDateToString(new Date(parseJsonDateToDate(item[j].InputDate))) : "") + '</td>';
                //                        str += '<td>' + (item[j].ExpiryDate != null ? ParseDateToString(new Date(parseJsonDateToDate(item[j].ExpiryDate))) : "") + '</td><td>' + (item[j].StatusName != null ? item[j].StatusName : "") + '</td></tr>';
                //                    }
                //                    else {
                //                        str += '<tr class="' + (j % 2 != 0 ? "row_2" : "") + '"><td>' + (j + 1) + '</td>';
                //                        str += '<td>' + (item[j].Name != null ? item[j].Name + " (" + item[j].Code + ")" : "") + '</td><td>' + (item[j].Quantity != null ? ParseStringToCurrency(item[j].Quantity) : "") + '</td>';
                //                        str += '<td>' + ((item[j].Quantity != null && item[j].QuantityUsed != null) ? (ParseStringToCurrency(item[j].Quantity - item[j].QuantityUsed)) : "") + '</td>';
                //                        str += '<td>' + (item[j].UnitName != null ? item[j].UnitName : "") + '</td><td>' + (item[j].Price != null ? ParseStringToCurrency(item[j].Price) : "") + '</td>';
                //                        str += '<td>' + (item[j].MoneyTypeName != null ? item[j].MoneyTypeName + " (" + ParseStringToCurrency(item[j].ExchangeRate) + ")" : "") + '</td><td>' + (item[j].TotalMoney != null ? ParseStringToCurrency(item[j].TotalMoney) : "") + '</td>';
                //                        str += '<td>' + (item[j].WareHouseName != null ? item[j].WareHouseName + " (" + item[j].WareHouseCode + ")" : "") + '</td><td>' + (item[j].InputDate != null ? ParseDateToString(new Date(parseJsonDateToDate(item[j].InputDate))) : "") + '</td>';
                //                        str += '<td>' + (item[j].ExpiryDate != null ? ParseDateToString(new Date(parseJsonDateToDate(item[j].ExpiryDate))) : "") + '</td><td>' + (item[j].StatusName != null ? item[j].StatusName : "") + '</td></tr>';
                //                    }

                //                    total += (item[j].Quantity - item[j].QuantityUsed);
                //                    totalmoney += item[j].TotalMoney;
                //                }
                //            }
                //            str += '<tr><td colspan="4" style="color: red; font-weight: bold; text-align:right; padding-right:20px">' + "Tổng tồn" + '</td>';
                //            str += '<td style="color: red; font-weight: bold">' + ParseStringToCurrency(total) + '</td>';
                //            str += '<td style="color: red; font-weight:bold; text-align:left; padding-left:20px">' + (item.length > 0 ? item[0].UnitName : "") + '</td>';
                //            str += '<td colspan="2" style="color: red; font-weight: bold; text-align:right; padding-right:20px">' + "Tổng Tiền" + '</td>';
                //            str += '<td colspan="5" style="color: red; font-weight: bold; text-align: left; padding-left:20px">' + ParseStringToCurrency(totalmoney) + " VNĐ" + '</td></tr>';
                //            str += '<tr><td colspan="13" style="height:2px; background-color: silver"></td></tr>';
                //        }
                //        else {
                //            for (var j = 0; j < item.length; j++) {
                //                if (item[j].MaterialName != null) {

                //                    if (j == 0) // neu la dong dau tien thi thuc hien rowspan ở ô Tên Vật Tư
                //                    {
                //                        str += '<tr class="' + (j % 2 != 0 ? "row_2" : "") + '"><td>' + (j + 1) + '</td><td rowspan="' + item.length + '">' + item[j].MaterialName + ' ( ' + item[j].MaterialCode + ' )</td>';
                //                        str += '<td>' + (item[j].Name != null ? item[j].Name + " (" + item[j].Code + ")" : "") + '</td><td>' + (item[j].Quantity != null ? ParseStringToCurrency(item[j].Quantity) : "") + '</td>';
                //                        str += '<td>' + ((item[j].Quantity != null && item[j].QuantityUsed != null) ? (ParseStringToCurrency(item[j].Quantity - item[j].QuantityUsed)) : "") + '</td>';
                //                        str += '<td>' + (item[j].UnitName != null ? item[j].UnitName : "") + '</td><td>' + (item[j].Price != null ? ParseStringToCurrency(item[j].Price) : "") + '</td>';
                //                        str += '<td>' + (item[j].MoneyTypeName != null ? item[j].MoneyTypeName + " (" + ParseStringToCurrency(item[j].ExchangeRate) + ")" : "") + '</td><td>' + (item[j].TotalMoney != null ? ParseStringToCurrency(item[j].TotalMoney) : "") + '</td>';
                //                        str += '<td>' + (item[j].WareHouseName != null ? item[j].WareHouseName + " (" + item[j].WareHouseCode + ")" : "") + '</td><td>' + (item[j].InputDate != null ? ParseDateToString(new Date(parseJsonDateToDate(item[j].InputDate))) : "") + '</td>';
                //                        str += '<td>' + (item[j].ExpiryDate != null ? ParseDateToString(new Date(parseJsonDateToDate(item[j].ExpiryDate))) : "") + '</td><td>' + (item[j].StatusName != null ? item[j].StatusName : "") + '</td></tr>';
                //                    }
                //                    else {
                //                        str += '<tr class="' + (j % 2 != 0 ? "row_2" : "") + '"><td>' + (j + 1) + '</td>';
                //                        str += '<td>' + (item[j].Name != null ? item[j].Name + " (" + item[j].Code + ")" : "") + '</td><td>' + (item[j].Quantity != null ? ParseStringToCurrency(item[j].Quantity) : "") + '</td>';
                //                        str += '<td>' + ((item[j].Quantity != null && item[j].QuantityUsed != null) ? (ParseStringToCurrency(item[j].Quantity - item[j].QuantityUsed)) : "") + '</td>';
                //                        str += '<td>' + (item[j].UnitName != null ? item[j].UnitName : "") + '</td><td>' + (item[j].Price != null ? ParseStringToCurrency(item[j].Price) : "") + '</td>';
                //                        str += '<td>' + (item[j].MoneyTypeName != null ? item[j].MoneyTypeName + " (" + ParseStringToCurrency(item[j].ExchangeRate) + ")" : "") + '</td><td>' + (item[j].TotalMoney != null ? ParseStringToCurrency(item[j].TotalMoney) : "") + '</td>';
                //                        str += '<td>' + (item[j].WareHouseName != null ? item[j].WareHouseName + " (" + item[j].WareHouseCode + ")" : "") + '</td><td>' + (item[j].InputDate != null ? ParseDateToString(new Date(parseJsonDateToDate(item[j].InputDate))) : "") + '</td>';
                //                        str += '<td>' + (item[j].ExpiryDate != null ? ParseDateToString(new Date(parseJsonDateToDate(item[j].ExpiryDate))) : "") + '</td><td>' + (item[j].StatusName != null ? item[j].StatusName : "") + '</td></tr>';
                //                    }

                //                    total += (item[j].Quantity - item[j].QuantityUsed);
                //                    totalmoney += item[j].TotalMoney;
                //                }
                //            }
                //            str += '<tr><td colspan="4" style="color: red; font-weight: bold; text-align:right; padding-right:20px">' + "Tổng tồn" + '</td>';
                //            str += '<td style="color: red; font-weight: bold">' + ParseStringToCurrency(total) + '</td>';
                //            str += '<td style="color: red; font-weight:bold; text-align:left; padding-left:20px">' + (item.length > 0 ? item[0].UnitName : "") + '</td>';
                //            str += '<td colspan="2" style="color: red; font-weight: bold; text-align:right; padding-right:20px">' + "Tổng Tiền" + '</td>';
                //            str += '<td colspan="5" style="color: red; font-weight: bold; text-align: left; padding-left:20px">' + ParseStringToCurrency(totalmoney) + " VNĐ" + '</td></tr>';
                //        }
                //    });
                //}

                if (mId == 0)
                    $('#inventory_materialname').html((""));
                else
                    $('#inventory_materialname').html((result.Data.length > 0 ? result.Data[0][0].MaterialName : ""));
                $('#loading').hide();
            }
        });

    }

    GenerateGroupWithWarehouse = (groupObjs) => {
        var str = '<tr><td colspan="11">Không có dữ liệu</td></tr>';

        if (groupObjs) {
            str = "";
            $.each(groupObjs, function (i, item) {
                var total = 0;
                var totalmoney = 0;
                // if (mId == 0) // neu la chon tat ca
                // {
                for (var j = 0; j < item.length; j++) {
                    if (item[j].MaterialName != null) {

                        if (j == 0) // neu la dong dau tien thi thuc hien rowspan ở ô kho
                        {
                            str += `
                                    <tr class="${ (j % 2 != 0 ? "row_2" : "")}">
                                        <td>${(j + 1)}</td>
                                        <td rowspan="${item.length}">${(item[j].StoreWareHouseName != null ? item[j].StoreWareHouseName + " (" + item[j].StoreWareHouseCode + ")" : "")}</td>
                                        <td >${item[j].MaterialName} ( ${item[j].MaterialCode} )</td> 
                                        <td>${ (item[j].Name != null ? item[j].Name + " (" + item[j].Code + ")" : "")}</td>
                                        <td>${(item[j].InputDate != null ? ParseDateToString(new Date(parseJsonDateToDate(item[j].InputDate))) : "")}</td> 
                                        <td>${(item[j].Quantity != null ? ParseStringToCurrency(item[j].Quantity) : "")} <i class="fa fa-arrow-right red"></i> ${((item[j].Quantity != null && item[j].QuantityUsed != null) ? (ParseStringToCurrency(item[j].Quantity - item[j].QuantityUsed)) : "")} ${(item[j].UnitName != null ? item[j].UnitName : "")}</td> 
                                        <td>${(item[j].Price != null ? ParseStringToCurrency(item[j].Price) : "")}</td> 
                                        <td>${(item[j].TotalMoney != null ? ParseStringToCurrency(item[j].TotalMoney) : "")} ${(item[j].MoneyTypeName != null ? item[j].MoneyTypeName : "")} (<span class="red">${ParseStringToCurrency(item[j].ExchangeRate)}</span>)</td> 
                                        <td>${ (item[j].ManufactureDate != null ? ParseDateToString(new Date(parseJsonDateToDate(item[j].ManufactureDate))) : "")}</td>
                                        <td>${ (item[j].WarrantyDate != null ? ParseDateToString(new Date(parseJsonDateToDate(item[j].WarrantyDate))) : "")}</td>
                                        <td>${ (item[j].ExpiryDate != null ? ParseDateToString(new Date(parseJsonDateToDate(item[j].ExpiryDate))) : "")}</td>
                                     </tr>`;
                        }
                        else {
                            str += `
                                    <tr class="${ (j % 2 != 0 ? "row_2" : "")}">
                                        <td>${(j + 1)}</td>
                                        <td >${item[j].MaterialName} ( ${item[j].MaterialCode} )</td> 
                                        <td>${ (item[j].Name != null ? item[j].Name + " (" + item[j].Code + ")" : "")}</td>
                                        <td>${(item[j].InputDate != null ? ParseDateToString(new Date(parseJsonDateToDate(item[j].InputDate))) : "")}</td> 
                                        <td>${(item[j].Quantity != null ? ParseStringToCurrency(item[j].Quantity) : "")} <i class="fa fa-arrow-right red"></i> ${((item[j].Quantity != null && item[j].QuantityUsed != null) ? (ParseStringToCurrency(item[j].Quantity - item[j].QuantityUsed)) : "")} ${(item[j].UnitName != null ? item[j].UnitName : "")}</td> 
                                        <td>${(item[j].Price != null ? ParseStringToCurrency(item[j].Price) : "")}</td> 
                                        <td>${(item[j].TotalMoney != null ? ParseStringToCurrency(item[j].TotalMoney) : "")} ${(item[j].MoneyTypeName != null ? item[j].MoneyTypeName : "")} (<span class="red">${ParseStringToCurrency(item[j].ExchangeRate)}</span>)</td> 
                                        <td>${ (item[j].ManufactureDate != null ? ParseDateToString(new Date(parseJsonDateToDate(item[j].ManufactureDate))) : "")}</td>
                                        <td>${ (item[j].WarrantyDate != null ? ParseDateToString(new Date(parseJsonDateToDate(item[j].WarrantyDate))) : "")}</td>
                                        <td>${ (item[j].ExpiryDate != null ? ParseDateToString(new Date(parseJsonDateToDate(item[j].ExpiryDate))) : "")}</td>
                                     </tr>`;
                        }

                        total += (item[j].Quantity - item[j].QuantityUsed);
                        totalmoney += item[j].TotalMoney;
                    }
                }
                str += `<tr>
                            <td colspan="5" style=" font-weight: bold; text-align:right; padding-right:20px">Tổng tồn</td>';
                            <td style="color: red; font-weight: bold">${ ParseStringToCurrency(total)} ${(item.length > 0 ? item[0].UnitName : "")}</td>'; 
                            <td style=" font-weight: bold; text-align:right; padding-right:20px">Tổng tiền</td>';
                            <td colspan="5" style="color: red; font-weight: bold; text-align: left; padding-left:20px">${ ParseStringToCurrency(totalmoney)} ${(item[0].MoneyTypeName != null ? item[0].MoneyTypeName : "")} (<span class="red">${ParseStringToCurrency(item[0].ExchangeRate)}</span>)</td>
                        </tr> 
                        <tr><td colspan="13" style="height:2px; background-color: silver"></td></tr>`;

            });
        }
        $('#inventory_table1 tbody').empty().html(str);
    }

    GenerateGroupWithMaterial = (groupObjs) => {
        var str = '<tr><td colspan="11">Không có dữ liệu</td></tr>';

        if (groupObjs) {
            str = "";
            $.each(groupObjs, function (i, item) {
                var total = 0;
                var totalmoney = 0;
                // if (mId == 0) // neu la chon tat ca
                // {
                for (var j = 0; j < item.length; j++) {
                    if (item[j].MaterialName != null) {

                        if (j == 0) // neu la dong dau tien thi thuc hien rowspan ở ô kho
                        {
                            str += `
                                    <tr class="${ (j % 2 != 0 ? "row_2" : "")}">
                                        <td>${(j + 1)}</td>
                                        <td >${(item[j].StoreWareHouseName != null ? item[j].StoreWareHouseName + " (" + item[j].StoreWareHouseCode + ")" : "")}</td>
                                        <td rowspan="${item.length}">${item[j].MaterialName} ( ${item[j].MaterialCode} )</td> 
                                        <td>${ (item[j].Name != null ? item[j].Name + " (" + item[j].Code + ")" : "")}</td>
                                        <td>${(item[j].InputDate != null ? ParseDateToString(new Date(parseJsonDateToDate(item[j].InputDate))) : "")}</td> 
                                        <td>${(item[j].Quantity != null ? ParseStringToCurrency(item[j].Quantity) : "")} <i class="fa fa-arrow-right red"></i> ${((item[j].Quantity != null && item[j].QuantityUsed != null) ? (ParseStringToCurrency(item[j].Quantity - item[j].QuantityUsed)) : "")} ${(item[j].UnitName != null ? item[j].UnitName : "")}</td> 
                                        <td>${(item[j].Price != null ? ParseStringToCurrency(item[j].Price) : "")}</td> 
                                        <td>${(item[j].TotalMoney != null ? ParseStringToCurrency(item[j].TotalMoney) : "")} ${(item[j].MoneyTypeName != null ? item[j].MoneyTypeName : "")} (<span class="red">${ParseStringToCurrency(item[j].ExchangeRate)}</span>)</td> 
                                        <td>${ (item[j].ManufactureDate != null ? ParseDateToString(new Date(parseJsonDateToDate(item[j].ManufactureDate))) : "")}</td>
                                        <td>${ (item[j].WarrantyDate != null ? ParseDateToString(new Date(parseJsonDateToDate(item[j].WarrantyDate))) : "")}</td>
                                        <td>${ (item[j].ExpiryDate != null ? ParseDateToString(new Date(parseJsonDateToDate(item[j].ExpiryDate))) : "")}</td>
                                     </tr>`;
                        }
                        else {
                            str += `
                                    <tr class="${ (j % 2 != 0 ? "row_2" : "")}">
                                        <td>${(j + 1)}</td>
                                        <td >${(item[j].StoreWareHouseName != null ? item[j].StoreWareHouseName + " (" + item[j].StoreWareHouseCode + ")" : "")}</td> 
                                        <td>${ (item[j].Name != null ? item[j].Name + " (" + item[j].Code + ")" : "")}</td>
                                        <td>${(item[j].InputDate != null ? ParseDateToString(new Date(parseJsonDateToDate(item[j].InputDate))) : "")}</td> 
                                        <td>${(item[j].Quantity != null ? ParseStringToCurrency(item[j].Quantity) : "")} <i class="fa fa-arrow-right red"></i> ${((item[j].Quantity != null && item[j].QuantityUsed != null) ? (ParseStringToCurrency(item[j].Quantity - item[j].QuantityUsed)) : "")} ${(item[j].UnitName != null ? item[j].UnitName : "")}</td> 
                                        <td>${(item[j].Price != null ? ParseStringToCurrency(item[j].Price) : "")}</td> 
                                        <td>${(item[j].TotalMoney != null ? ParseStringToCurrency(item[j].TotalMoney) : "")} ${(item[j].MoneyTypeName != null ? item[j].MoneyTypeName : "")} (<span class="red">${ParseStringToCurrency(item[j].ExchangeRate)}</span>)</td> 
                                        <td>${ (item[j].ManufactureDate != null ? ParseDateToString(new Date(parseJsonDateToDate(item[j].ManufactureDate))) : "")}</td>
                                        <td>${ (item[j].WarrantyDate != null ? ParseDateToString(new Date(parseJsonDateToDate(item[j].WarrantyDate))) : "")}</td>
                                        <td>${ (item[j].ExpiryDate != null ? ParseDateToString(new Date(parseJsonDateToDate(item[j].ExpiryDate))) : "")}</td>
                                     </tr>`;
                        }

                        total += (item[j].Quantity - item[j].QuantityUsed);
                        totalmoney += item[j].TotalMoney;
                    }
                }
                str += `<tr>
                            <td colspan="5" style=" font-weight: bold; text-align:right; padding-right:20px">Tổng tồn</td>';
                            <td style="color: red; font-weight: bold">${ ParseStringToCurrency(total)} ${(item.length > 0 ? item[0].UnitName : "")}</td>'; 
                            <td  style=" font-weight: bold; text-align:right; padding-right:20px">Tổng tiền</td>';
                            <td colspan="5" style="color: red; font-weight: bold; text-align: left; padding-left:20px">${ ParseStringToCurrency(totalmoney)} ${(item[0].MoneyTypeName != null ? item[0].MoneyTypeName : "")} (<span class="red">${ParseStringToCurrency(item[0].ExchangeRate)}</span>)</td>
                        </tr> 
                        <tr><td colspan="13" style="height:2px; background-color: silver"></td></tr>`;

            });
        }
        $('#inventory_table1 tbody').empty().html(str);
    }


    function GetMaterialCombobox(controlId) {
        $('#' + controlId).kendoComboBox({
            dataTextField: "Code",
            dataValueField: "Value",
            suggest: true,
            placeholder: "Chọn vật tư...",
            filter: "startswith",
            minLength: 1,
            //dataSource: [{ "Value": "1", "Name": "Thiết Bị 1" }, { "Value": "2", "Name": "Thiết Bị 2" }, { "Value": "3", "Name": "Thiết Bị 3" }],
            dataSource: {
                //serverFiltering: true,  // lọc dữ liệu từ phía server
                transport: {
                    read: {
                        dataType: "json",
                        //type:'GET',
                        //contentType:"application/json charset=utf-8",
                        url: "/Material/GetMaterialSelect_FilterByTextInput",
                        //data: JSON.stringify({ text: $('#ECHByTimeRange_equipment').val() }),
                        data: {
                            text: function () {
                                return $('#' + controlId).data("kendoComboBox").text();
                            }
                        },

                    }
                }
            },
        });
    }

    function GetWareHouseCombobox(controlId) {
        $('#' + controlId).kendoComboBox({
            dataTextField: "Code",
            dataValueField: "Value",
            suggest: true,
            placeholder: "Chọn kho...",
            filter: "startswith",
            minLength: 1,
            //dataSource: [{ "Value": "1", "Name": "Thiết Bị 1" }, { "Value": "2", "Name": "Thiết Bị 2" }, { "Value": "3", "Name": "Thiết Bị 3" }],
            dataSource: {
                //serverFiltering: true,  // lọc dữ liệu từ phía server
                transport: {
                    read: {
                        dataType: "json",
                        //type:'GET',
                        //contentType:"application/json charset=utf-8",
                        url: "/WareHouse/GetWareHouseSelect_FilterByTextInput",
                        //data: JSON.stringify({ text: $('#ECHByTimeRange_equipment').val() }),
                        data: {
                            text: function () {
                                return $('#' + controlId).data("kendoComboBox").text();
                            }
                        },

                    }
                }
            },
        });
    }

}
$(document).ready(function () {
    var ReportInventory = new GPRO.ReportInventory();
    ReportInventory.Init();
})