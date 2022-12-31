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
GPRO.namespace('ProductionPlanMonth');
GPRO.ProductionPlanMonth = function () {
    var Global = {
        UrlAction: {
            GetList: '/PMSReport/GetProductionPlanInMonth',
            Excel: '/PMSReport/Excel_ProductionPlanMonth',
        },
        Element: {
            Table: 'pro-plan-month-jtable'
        },
        Data: {
            days: parseInt($('#pro-plan-month-jtable').attr('ngay')),
            month: moment().month(),
            year: moment().year()
        }
    }
    this.GetGlobal = function () {
        return Global;
    }

    this.Init = function () {
        RegisterEvent();
        // GetPhaseSelect(0)
        //GetLenhSelect('production-progress-lenh'); 
        ReloadTable();
    }

    var RegisterEvent = function () {
        $('#production-progress-btnExportToExcel').click(function () {
            window.location.href = Global.UrlAction.Excel + "?cspId=" + $('#production-progress-lenh-pro').val();
        })
    }


    function ReloadTable() {
        let $tableBody = $('#' + Global.Element.Table + ' tbody');
        $tableBody.empty();
        $.ajax({
            url: Global.UrlAction.GetList,
            type: 'POST',
            data: '',
            contentType: 'application/json charset=utf-8',
            success: function (data) {
                if (data == "ERROR") {
                    let tr = $('<tr> </tr>');
                    tr.append(` <td colspan="13">Không có dữ liệu phân công sản xuất</td> `);
                    $tableBody.append(tr);
                }
                else {
                    let objs = JSON.parse(data);
                    if (objs) {

                        objs.forEach((item, i) => {
                            let tr = $(`<tr> <td class="${i % 2 != 0 ? "bob" : ""}">${item.LineName}</td>  </tr>`);
                            for (var ii = moment().date(); ii <= Global.Data.days; ii++) {
                                let _date = moment(new Date(Global.Data.year, Global.Data.month, ii));
                                if (_date.weekday() == 0) // sunday
                                    tr.append(`<td class="${i % 2 != 0 ? "bob" : ""}  "></td>`);
                                else {
                                    if (ii >= moment().date()) {
                                        let $td = $(`<td class="${i % 2 != 0 ? "bob" : ""} "></td>`);
                                        for (var y = 0; y < item.Products.length; y++) {
                                            if (moment(item.Products[y].StartDate).isBefore(_date) && moment(item.Products[y].EndDate).isAfter(_date)) {

                                                let div = $(`<div class="${getClass(item.Products[y].HasProduction)}"></div>`);
                                                if (item.Products[y].CustName)
                                                    div.append(`Khách hàng: ${getText(item.Products[y].CustName)} </br>`);
                                                div.append(`Sản phẩm: ${item.Products[y].ProName}</br>`);
                                                div.append(`Kế hoạch: ${item.Products[y].ProPlan}</br>`);
                                                div.append(`Vào chuyền: ${ddMMyyyy(item.Products[y].StartDate)}</br >`);
                                                $td.append(div);

                                                tr.append($td);
                                            }
                                        }
                                    }
                                    else
                                        tr.append(`<td class="${i % 2 != 0 ? "bob" : ""}">-</td>`);
                                }
                            }
                            $tableBody.append(tr);
                        });
                    }
                }
            }
        });
    }

    function getClass(hasProduction) {
        if (hasProduction > 0)
            return "confirmed";
        return "planned";
    }
}
$(document).ready(function () {
    var obj = new GPRO.ProductionPlanMonth();
    obj.Init();
})