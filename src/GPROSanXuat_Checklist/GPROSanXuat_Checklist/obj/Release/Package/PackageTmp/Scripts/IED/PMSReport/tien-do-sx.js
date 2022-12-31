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
GPRO.namespace('ProductionProgress');
GPRO.ProductionProgress = function () {
    var Global = {
        UrlAction: {
            GetList: '/PMSReport/GetTienDoSX',
            Excel: '/PMSReport/Excel_TienDoSX',
        },
        Element: {
            Table: 'production-progress-jtable'
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
        GetPhaseSelect(0)
        GetLenhSelect('production-progress-lenh');
    }

    var RegisterEvent = function () {
        $('[re-production-progress-lenh]').click(function () {
            GetLenhSelect('production-progress-lenh');
        });

        $('#production-progress-lenh').change(function () {
            GetLenhProductSelect('production-progress-lenh-pro', $('#production-progress-lenh').val());
        })

        $('#production-progress-lenh-pro').change(function () { ReloadTable(); });

        $('#production-progress-btnView').click(function () {
            ReloadTable();
        });

        $('#production-progress-btnExportToExcel').click(function () {
            window.location.href = Global.UrlAction.Excel + "?cspId=" + $('#production-progress-lenh-pro').val();
        })
    }

    function GetPhaseSelect(_type) {
        Global.Data.phases.length = 0;
        $.ajax({
            url: '/phase/GetSelectList',
            type: 'POST',
            data: JSON.stringify({ 'type': _type }),
            contentType: 'application/json charset=utf-8',
            success: function (data) {
                if (data.Result == "OK") {
                    if (data.Data.length > 0) {
                        str = ' ';
                        $.each(data.Data, function (index, item) {
                            Global.Data.phases.push(item);
                        });
                    }
                }
                else
                    GlobalCommon.ShowMessageDialog('Lỗi', function () { }, "Đã có lỗi xảy ra trong quá trình xử lý.");
            }
        });
    }

    function ReloadTable() {
        let $tableBody = $('#' + Global.Element.Table + ' tbody');
        let $tableHead = $('#' + Global.Element.Table + ' thead');
        $tableHead.empty();
        $tableBody.empty();
        $.ajax({
            url: Global.UrlAction.GetList,
            type: 'POST',
            data: JSON.stringify({ 'cspId': $('#production-progress-lenh-pro').val() }),
            contentType: 'application/json charset=utf-8',
            success: function (data) {
                if (data == "ERROR") {
                    let tr = $('<tr> </tr>');
                    tr.append(` <th>Chuyền</th>
                                    <th>Thông tin</th>
                                    <th>Kế hoạch</th>
                                    <th>Công đoạn</th> ` );
                    $tableHead.append(tr);
                    tr = $('<tr> </tr>');
                    tr.append(` <td colspan="4">Không có dữ liệu phân công sản xuất</td> ` );
                    $tableBody.append(tr);
                }
                else {
                    let objs = JSON.parse(data);
                    if (objs) {
                        let tr = $('<tr> </tr>');
                        tr.append(` <th>Chuyền</th>
                                    <th>Thông tin</th>
                                    <th>Kế hoạch</th>
                                    <th>Công đoạn</th> ` );
                        if (objs[0].Months) {
                            objs[0].Months.forEach((item, i) => {
                                tr.append(`<th>${item.Name}</th>`);
                            })
                        }
                        $tableHead.append(tr);
                        objs.forEach((item, i) => {
                            tr = $(`<tr > </tr>`);
                            tr.append(`<td class="${i % 2 != 0 ? "bob" : ""}" rowspan="${Global.Data.phases.length}">${item.LineName}</td>`);
                            if (i == 0) {
                                tr.append(`<td rowspan="${Global.Data.phases.length * objs.length}">Khách hàng: <span>${item.CustName}</span> <br/> Sản phẩm: <span>${item.ProName}</span></td>`);
                            }

                            tr.append(`<td class="${i % 2 != 0 ? "bob" : ""}" rowspan="${Global.Data.phases.length}">Sản lượng: <span>${item.ProductionPlan}</span> <br/>Ngày vào chuyền: <span>${ddMMyyyy(item.StartDate)}</span></td>`);
                            tr.append(`<td class="${i % 2 != 0 ? "bob" : ""} phase-name" >${Global.Data.phases[0].Name}</td>`);
                            item.Months.forEach((_month, ii) => {
                                let _fPhase = _month.Phases.filter(x => Global.Data.phases[0].Value == x.PhaseId)[0];
                                tr.append(`<td class="${i % 2 != 0 ? "bob" : ""}">${_fPhase ? ("<span class='green'>"+_fPhase.Plan+"</span>/"+_fPhase.Products) : "0"}</td>`);
                            })
                            $tableBody.append(tr);


                            Global.Data.phases.forEach((_phase, ii) => {
                                if (ii > 0) {
                                    tr = $('<tr> </tr>');
                                    tr.append(`<td class="${i % 2 != 0 ? "bob" : ""} phase-name">${_phase.Name}</td>`);
                                    item.Months.forEach((_month, ii) => {
                                        let _fPhase = _month.Phases.filter(x => _phase.Value == x.PhaseId)[0];
                                        tr.append(`<td class="${i % 2 != 0 ? "bob" : ""}">${_fPhase ? ("<span class='green'>" + _fPhase.Plan + "</span>/" + _fPhase.Products) : "0"}</td>`);
                                    })
                                    $tableBody.append(tr);
                                }
                            });
                        });
                    }
                }
            }
        });
    }

}
$(document).ready(function () {
    var obj = new GPRO.ProductionProgress();
    obj.Init();
})