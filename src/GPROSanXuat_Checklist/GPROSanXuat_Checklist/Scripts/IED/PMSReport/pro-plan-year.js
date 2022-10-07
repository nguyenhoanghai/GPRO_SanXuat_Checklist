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
GPRO.namespace('ProductionPlanYear');
GPRO.ProductionPlanYear = function () {
    var Global = {
        UrlAction: {
            GetList: '/PMSReport/GetProductionPlanInYear',
            Excel: '/PMSReport/Excel_ProductionPlanInYear',
        },
        Element: {
            Table: 'pro-plan-year-jtable'
        },
        Data: {
            phases: []
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
                            for (var ii = 1; ii <= 12; ii++) {
                                let _founds = item.Months.filter(x => x.Month == ii);
                                if (_founds) {
                                    let $td = $(`<td class="${i % 2 != 0 ? "bob" : ""} "></td>`);
                                    _founds.forEach(_month => {
                                        let div = $(`<div class="${getClass(_month.HasProduction)}"></div>`);
                                        if (_month.CustName)
                                            div.append(`Khách hàng: ${getText(_month.CustName)} </br>`);
                                        div.append(`Sản phẩm: ${_month.ProName}</br>`);
                                        div.append(`Kế hoạch: ${_month.ProPlan}</br>`);
                                        div.append(`Vào chuyền: ${ddMMyyyy(_month.StartDate)}</br >`);
                                        $td.append(div);
                                    });
                                    tr.append($td);
                                }
                                else {
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
        if (hasProduction>0)
            return "confirmed";
        return "planned";
    }
}
$(document).ready(function () {
    var obj = new GPRO.ProductionPlanYear();
    obj.Init();
})