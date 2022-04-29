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
GPRO.namespace('ReportInDay2');
GPRO.ReportInDay2 = function () {
    var Global = {
        UrlAction: { 
            _Gets: '/ProductivityReport/GetProductivityDaily_SH', 
            _Export: '/ProductivityReport/export_ProductivityDaily_SH',            
        },
        Element: {
        },
        Data: {
        }
    }
    this.GetGlobal = function () {
        return Global;
    }

    this.Init = function () {

        GetWorkshopSelect('report-inday-workshop');
        GetProductSelect('report-inday-product');
        RegisterEvent();
        var _body = $(`.table-ngay tbody `);
        _body.empty();
    }

    var RegisterEvent = function () {
        $('#report-inday-workshop').change(function () {
            if ($('#report-inday-workshop').val() != undefined)
                GetFloorSelect('report-inday-floor', $('#report-inday-workshop').val());
        });

        $('#report-inday-floor').change(function () {
            if ($('#report-inday-floor').val() != undefined)
                GetLineSelect('report-inday-line', $('#report-inday-floor').val());
        });


        $('#btn-report-inday-view').click(function () { 
            _Gets();
        });

        $('#btn-report-inday-excel').click(function () {
            if ($('#report-inday-floor').val() != undefined)
                 window.location.href = Global.UrlAction._Export + `?floorId=${$('#report-inday-floor').val()}  `;
        });
    }
     
    function _Gets() {
        if ($('#report-inday-floor').val() != undefined)
            $.ajax({
                url: Global.UrlAction._Gets,
                type: 'POST',
                data: JSON.stringify({ 'floorId': $('#report-inday-floor').val() }),
                contentType: 'application/json charset=utf-8',
                beforeSend: function () { $('#loading').show(); },
                success: function (data) {
                    $('#loading').hide();
                    console.log(data.Records);
                    console.log(data.Data);
                    //var tb = $('#table-report-inday');
                    //var head = $(`#table-report-inday  thead`);
                    //head.empty();
                    //var tr = $(`<tr></tr>`);
                    //tr.append('<td>Chuyền</td>');
                    //data.Data.map(item => {
                    //    tr.append(`<td>${item.Name}</td>`);
                    //})

                    //head.append(tr);
                    // tb.append(head);
                    var _body = $(`.table-ngay tbody `);
                    _body.empty();
                    var lines = JSON.parse(data.Records);

                    if (lines && lines.length > 0) {
                        lines.map(item => {
                            tr = $(`<tr class="row-color">
                                        <td rowspan="19">${item.LineName}</td>
                                        <td rowspan="19">${item.CurrentLabors}</td>
                                        <td rowspan="19">${item.CustName}</td>
                                        <td rowspan="19">${item.CommoName}</td>
                                        <td rowspan="19">${item.PriceCM}</td>
                                        <td rowspan="3" class="col-tim">Bán thành phẩm</td>
                                        <td class="col-tim">cấp trong ngày</td>
                                        <td>${((item.LK_BTP - item.LK_BTP_G) - (item.BTP_Day - item.BTP_Day_G))}</td>
                                        <td>${(item.LK_BTP - item.LK_BTP_G)}</td>
                                        <td>${(item.SanLuongKeHoach - (item.LK_BTP - item.LK_BTP_G))}</td>
                                        ${getWorkingTimes(item.workingTimes, item, 'col-sum', 0)}                                        
                                    </tr>`);
                            _body.append(tr);

                            tr = $(`<tr>
                                        <td class="col-tim">Tồn trên chuyền</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        ${getWorkingTimes(item.workingTimes, item, '', 1)}  
                                    </tr>`);
                            _body.append(tr);

                            tr = $(`<tr>
                                        <td class="col-tim">Vốn trên chuyền</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        ${getWorkingTimes(item.workingTimes, item, '', 2)}  
                                    </tr>`);
                            _body.append(tr);

                            tr = $(`<tr>
                                        <td rowspan="5" class="col-tim">Sản lượng (PCS)</td>
                                        <td class="col-tim">kế hoạch</td>
                                        <td class="col-green">${item.SanLuongKeHoach}</td>
                                        <td> </td>
                                        <td> </td>
                                        ${getWorkingTimes(item.workingTimes, item, '', 3)}  
                                    </tr>`);
                            _body.append(tr);

                            tr = $(`<tr>
                                        <td class="col-tim">Thực hiện</td>
                                        <td class="col-sum">${ (item.LuyKeBTPThoatChuyen - (item.TC_Day - item.TC_Day_G))}</td>
                                        <td>${item.LuyKeBTPThoatChuyen}</td>
                                        <td>${item.SanLuongKeHoach - item.LuyKeBTPThoatChuyen}</td>
                                        ${getWorkingTimes(item.workingTimes, item, 'col-sum', 4)}  
                                    </tr>`);
                            _body.append(tr);

                            tr = $(`<tr> 
                                        <td class="col-tim">chênh lệch</td>
                                        <td class="col-yellow">${ (item.SanLuongKeHoach - (item.LuyKeBTPThoatChuyen - (item.TC_Day - item.TC_Day_G)))}</td>
                                        <td></td>
                                        <td></td>
                                        ${getWorkingTimes(item.workingTimes, item, 'col-yellow', 5)}  
                                    </tr>`);
                            _body.append(tr);

                            var lktruocHomNay = item.LuyKeBTPThoatChuyen - (item.TC_Day - item.TC_Day_G);
                            var tile = 0;
                            if (lktruocHomNay > 0)
                                tile = Math.round((lktruocHomNay / item.SanLuongKeHoach) * 100);
                            tr = $(`<tr> 
                                        <td class="col-tim">Tỉ lệ % TH/KH</td>
                                        <td >${tile}%</td>
                                        <td></td>
                                        <td></td>
                                        ${getWorkingTimes(item.workingTimes, item, '', 6)}  
                                    </tr>`);
                            _body.append(tr);

                            tr = $(`<tr> 
                                        <td class="col-tim">Hiệu xuất</td>
                                        <td > </td>
                                        <td></td>
                                        <td></td>
                                        ${getWorkingTimes(item.workingTimes, item, '', 7)}  
                                    </tr>`);
                            _body.append(tr);

                            tr = $(`<tr> 
                                        <td class="col-tim" rowspan="6">KCS (PCS)</td>
                                        <td class="col-tim">Kiểm đạt</td>
                                        <td class="col-sum">${(item.LuyKeTH - (item.TH_Day - item.TH_Day_G))}</td>
                                        <td>${item.LuyKeTH }</td>
                                        <td>${  (item.SanLuongKeHoach - item.LuyKeTH)}</td>
                                        ${getWorkingTimes(item.workingTimes, item, 'col-sum', 8)}  
                                    </tr>`);
                            _body.append(tr);

                            tr = $(`<tr> 
                                        <td class="col-tim">Không đạt (lỗi)</td>
                                        <td > </td>
                                        <td></td>
                                        <td></td>
                                        ${getWorkingTimes(item.workingTimes, item, 'col-yellow', 9)}  
                                    </tr>`);
                            _body.append(tr);

                            tr = $(`<tr> 
                                       <td class="col-tim">LK chưa kiểm</td>
                                        <td class="col-sum">${ (item.LuyKeBTPThoatChuyen - (item.TC_Day - item.TC_Day_G)) - (item.LuyKeTH - (item.TH_Day - item.TH_Day_G)) }</td>
                                        <td></td>
                                        <td>${(item.SanLuongKeHoach - (item.LuyKeBTPThoatChuyen - (item.TC_Day - item.TC_Day_G)))}</td>
                                        ${getWorkingTimes(item.workingTimes, item, '', 10)}  
                                    </tr>`);
                            _body.append(tr);

                            tr = $(`<tr> 
                                        <td class="col-tim">Tỉ lệ % KĐ/TH</td>
                                        <td >${(((item.LuyKeTH - (item.TH_Day - item.TH_Day_G)) > 0 && (item.LuyKeBTPThoatChuyen - (item.TC_Day - item.TC_Day_G)) > 0) ? Math.round(((item.LuyKeTH - (item.TH_Day - item.TH_Day_G)) /  (item.LuyKeBTPThoatChuyen - (item.TC_Day - item.TC_Day_G))) * 100) : 0)}%</td>
                                        <td></td>
                                        <td></td>
                                        ${getWorkingTimes(item.workingTimes, item, '', 11)}  
                                    </tr>`);
                            _body.append(tr);

                            tr = $(`<tr> 
                                        <td class="col-tim">Tỉ lệ % KĐ/KH</td>
                                        <td >${((item.LuyKeTH - (item.TH_Day - item.TH_Day_G)) > 0 ? Math.round((((item.LuyKeTH - (item.TH_Day - item.TH_Day_G)) /  item.SanLuongKeHoach) * 100)) : 0)}% </td>
                                        <td></td>
                                        <td></td>
                                        ${getWorkingTimes(item.workingTimes, item, '', 12)}  
                                    </tr>`);
                            _body.append(tr);

                            tr = $(`<tr> 
                                        <td class="col-tim">Hiệu xuất</td>
                                        <td > </td>
                                        <td></td>
                                        <td></td>
                                        ${getWorkingTimes(item.workingTimes, item, '', 13)}  
                                    </tr>`);
                            _body.append(tr);

                            tr = $(`<tr> 
                                        <td class="col-tim" rowspan="3">Hoàn thành (PCS)</td>
                                        <td class="col-tim">Ủi</td>
                                        <td  class="col-sum">${item.lkUi}</td>
                                        <td></td>
                                        <td></td>
                                        ${getWorkingTimes(item.workingTimes, item, '', 14)}  
                                    </tr>`);
                            _body.append(tr);

                            tr = $(`<tr>  
                                        <td class="col-tim">Giao hoàn thành</td>
                                        <td  class="col-sum">${item.lkHoanThanh}</td>
                                        <td></td>
                                        <td></td>
                                        ${getWorkingTimes(item.workingTimes, item, '', 15)}  
                                    </tr>`);
                            _body.append(tr);

                            tr = $(`<tr>  
                                        <td class="col-tim">Đóng thùng</td>
                                        <td  class="col-sum">${item.lkDongThung}</td>
                                        <td></td>
                                        <td></td>
                                        ${getWorkingTimes(item.workingTimes, item, '', 16)}  
                                    </tr>`);
                            _body.append(tr);

                            tr = $(`<tr>  
                                        <td class="col-sum" colspan="2">Doanh thu (USD)</td>
                                        <td class="col-green"></td>
                                        <td class="col-green"></td>
                                        <td class="col-green"></td>
                                        ${getWorkingTimes(item.workingTimes, item, 'col-green', 17)}  
                                    </tr>`);
                            _body.append(tr);

                            tr = $(`<tr>  
                                        <td class="col-sum" colspan="2">Thu nhập BQ</td>
                                        <td class="col-green"> </td>
                                        <td class="col-green"></td>
                                        <td class="col-green"></td>
                                        ${getWorkingTimes(item.workingTimes, item, 'col-green', 18)}  
                                    </tr>`);
                            _body.append(tr); 
                        })
                    }
                }
            });
    }


    getWorkingTimes = (times, line, cls, type) => {
        var tds = '';
        var TCtoNow = 0;
        var KCSToNow = 0;
        if (times && times.length > 0) {
            times.map((item, y) => {
                TCtoNow += item.TC;
                KCSToNow += item.KCS;
                // var workTimeToNow = (item.TimeEnd - item.TimeStart).TotalMinutes * (y + 1);
                var diffInMinutes = moment('2020/12/01 ' + item.TimeEnd).diff(moment('2020/12/01 ' + item.TimeStart), 'minutes')
                var workTimeToNow = diffInMinutes * (y + 1);

                switch (type) {
                    case 0: tds += `<td class='${cls}'>${item.BTP}</td>`; break;
                    case 1: tds += `<td class='${cls}'>${item.BTPInLine}</td>`; break;
                    case 2: tds += `<td class='${cls}'>${item.Lean}</td>`; break;
                    case 3: tds += `<td class='${cls}'>${item.NormsHour}</td>`; break;
                    case 4: tds += `<td class='${cls}'>${item.TC}</td>`; break;
                    case 5:
                        var vl = item.TC - item.NormsHour;
                        tds += `<td class='${cls}'>${vl}</td>`; break;
                    case 6: tds += `<td class='${cls}'>${(item.TC > 0 && item.NormsHour > 0 ? Math.Round((item.TC / item.NormsHour) * 100) : 0)}%</td>`; break;
                    case 7:
                        var hieusuat = ((TCtoNow * Math.round((line.ProductionTime * 100) / line.HieuSuatNgay)) / (line.CurrentLabors * (workTimeToNow * 60)));
                        if (!hieusuat)
                            hieusuat = 0;
                        tds += `<td class='${cls}'>${hieusuat}</td>`; break;
                    case 8: tds += `<td class='${cls}'>${item.KCS}</td>`; break;
                    case 9: tds += `<td class='${cls}'>${item.Error}</td>`; break;
                    case 10: tds += `<td class='${cls}'>${TCtoNow - KCSToNow}</td>`; break;
                    case 11: tds += `<td class='${cls}'>${((item.TC > 0 && item.KCS > 0) ? Math.round(((item.KCS / item.TC) * 100)) : 0)}%</td>`; break;
                    case 12: tds += `<td class='${cls}'>${((item.KCS > 0 && item.NormsHour > 0) ? Math.round(((item.KCS / item.NormsHour) * 100)) : 0)}%</td>`; break;
                    case 13:
                        var hieusuat = ((KCSToNow * Math.round((line.ProductionTime * 100) / line.HieuSuatNgay)) / (line.CurrentLabors * (workTimeToNow * 60)));
                        if (!hieusuat)
                            hieusuat = 0;
                        tds += `<td class='${cls}'>${Math.round(hieusuat * 100)}%</td>`; break;
                    case 14: tds += `<td class='${cls}'>${item.Ui}</td>`; break;
                    case 15: tds += `<td class='${cls}'>${item.HoanThanh}</td>`; break;
                    case 16: tds += `<td class='${cls}'>${item.DongThung}</td>`; break;
                    case 18: tds += `<td class='${cls}'>${Math.ceil( (item.KCS * line.Price) / line.CurrentLabors)}</td>`; break;
                    default: tds += `<td class='${cls}'></td>`; break;
                }

            });
            switch (type) {
                case 0: tds += `<td class='${cls}'>${line.BTP_Day - line.BTP_Day_G}</td>`; break;
                case 3: tds += `<td class='${cls}'>${line.NormsDay}</td>`; break;
                case 4: tds += `<td class='${cls}'>${line.TC_Day - line.TC_Day_G}</td>`; break;
                case 5:
                    var vl = (line.TC_Day - line.TC_Day_G) - line.NormsDay;
                    tds += `<td class='${cls}'>${vl}</td>`; break;
                case 6: tds += `<td class='${cls}'>${((line.TC_Day - line.TC_Day_G) > 0 && line.NormsDay > 0 ? Math.Round(((line.TC_Day - line.TC_Day_G) / line.NormsDay) * 100) : 0)}%</td>`; break;
                case 8: tds += `<td class='${cls}'>${line.TH_Day - line.TH_Day_G}</td>`; break;
                case 8: tds += `<td class='${cls}'>${line.Err_Day - line.Err_Day_G}</td>`; break;
                case 11: tds += `<td class='${cls}'>${(((line.TC_Day - line.TC_Day_G) > 0 && (line.TH_Day - line.TH_Day_G) > 0) ? Math.round((((line.TH_Day - line.TH_Day_G) / (line.TC_Day - line.TC_Day_G)) * 100)) : 0)}%</td>`; break;
                case 12: tds += `<td class='${cls}'>${((line.TH_Day - line.TH_Day_G) > 0 && line.NormsDay > 0 ? Math.round((((line.TH_Day - line.TH_Day_G) / line.NormsDay) * 100)) : 0)}%</td>`; break;

                case 14: tds += `<td class='${cls}'>${line.Ui}</td>`; break;
                case 15: tds += `<td class='${cls}'>${line.HoanThanh}</td>`; break;
                case 16: tds += `<td class='${cls}'>${line.DongThung}</td>`; break;
                case 18: tds += `<td class='${cls}'>${Math.ceil( ((line.TH_Day - line.TH_Day_G) * line.Price) / line.CurrentLabors)}</td>`; break;
                default: tds += `<td class='${cls}'></td>`; break;
            }
        }
        return tds;
    }
}

$(document).ready(function () {
    var obj = new GPRO.ReportInDay2();
    obj.Init();
});
