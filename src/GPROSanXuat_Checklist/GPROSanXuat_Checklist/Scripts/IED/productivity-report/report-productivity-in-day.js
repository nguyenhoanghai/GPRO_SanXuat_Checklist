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
GPRO.namespace('ReportInDay');
GPRO.ReportInDay = function () {
    var Global = {
        UrlAction: {
            Gets: '/ProductivityReport/GetProductityInDay',
            Export: '/ProductivityReport/export_ProductityInDay'
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
            Gets();
        });

        $('#btn-report-inday-excel').click(function () { 
            if ($('#report-inday-floor').val() != undefined)
                window.location.href = Global.UrlAction.Export + `?floorId=${$('#report-inday-floor').val()}&type=${$('#report-inday-type').val()} `;
        });
    }

    function Gets() {
        if ($('#report-inday-floor').val() != undefined)
            $.ajax({
                url: Global.UrlAction.Gets,
                type: 'POST',
                data: JSON.stringify({ 'floorId': $('#report-inday-floor').val(), 'type': $('#report-inday-type').val() }),
                contentType: 'application/json charset=utf-8',
                beforeSend: function () { $('#loading').show(); },
                success: function (data) {
                    $('#loading').hide();
                    console.log(data.Records);
                    console.log(data.Data);
                    var tb = $('#table-report-inday');
                    var head = $(`#table-report-inday  thead`);
                    head.empty();
                    var tr = $(`<tr></tr>`);
                    tr.append('<td>Chuyền</td>');
                    data.Data.map(item => {
                        tr.append(`<td>${item.Name}</td>`);
                    })

                    head.append(tr);
                    // tb.append(head);
                    var _body = $(`#table-report-inday tbody `);
                    _body.empty();
                    if (data.Records.length > 0) {

                        data.Records.map(item => {
                            tr = $(`<tr></tr>`);

                            tr.append(`<td>${item.Name}</td>`);
                            data.Data.map(_item => {
                                var found = item.Times.filter(x => x.Name == _item.Name)[0];
                                if (found)
                                    if ($('#report-inday-type').val() == '1')
                                        tr.append(`<td>${found.TC}/${found.NormsHour}</td>`);
                                    else
                                        tr.append(`<td>${found.KCS}/${found.NormsHour}</td>`);
                                else
                                    tr.append(`<td>0/0</td>`);
                            })
                            _body.append(tr);
                        })

                        tr = $(`<tr></tr>`);
                        tr.append(`<td>Tổng</td>`);
                        data.Data.map(_item => {
                            if ($('#report-inday-type').val() == '1')
                                tr.append(`<td>${_item.TC}/${_item.NormsHour}</td>`);
                            else
                                tr.append(`<td>${_item.KCS}/${_item.NormsHour}</td>`);
                        })
                        _body.append(tr);
                    }

                }
            });
    }

}

$(document).ready(function () {
    var obj = new GPRO.ReportInDay();
    obj.Init();
});
