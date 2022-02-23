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
GPRO.namespace('ReportDaily');
GPRO.ReportDaily = function () {
    var Global = {
        UrlAction: {
            Gets: '/ProductivityReport/GetProductivityDaily', 
            Export: '/ProductivityReport/export_ProductivityDaily',
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

        GetWorkshopSelect('report-daily-workshop');
        GetProductSelect('report-daily-product');
        RegisterEvent();
        InitDatePicker();
    }

    var RegisterEvent = function () {
        $('#report-daily-workshop').change(function () {
            if ($('#report-daily-workshop').val() != undefined)
                GetFloorSelect('report-daily-floor', $('#report-daily-workshop').val());
        });

        $('#report-daily-floor').change(function () {
            if ($('#report-daily-floor').val() != undefined)
                GetLineSelect('report-daily-line', $('#report-daily-floor').val());
        });

        $('#report-daily-line').change(function () {
            if ($('#report-daily-line').val() != undefined)
                ReloadTable();
        });

        $('#btn-report-daily-view').click(function () {
            Gets();
        });

        $('#btn-report-daily-excel').click(function () {
            var _from = $("#report-daily-from").data("kendoDatePicker");
            var _to = $("#report-daily-to").data("kendoDatePicker");
            if (_from.value && _to.value && $('#report-daily-floor').val() != undefined)
                window.location.href = Global.UrlAction.Export + `?floorId=${$('#report-daily-floor').val()}&from=${moment(_from.value()).format('DD/MM/YYYY')}&to=${moment(_to.value()).format('DD/MM/YYYY')}&type=${$('#report-daily-type').val()}`;
        });
    }


    function Gets() {
        var _from = $("#report-daily-from").data("kendoDatePicker");
        var _to = $("#report-daily-to").data("kendoDatePicker");
        var type = $('#report-daily-type').val();

        if (_from.value && _to.value && $('#report-daily-floor').val() != undefined)
            $.ajax({
                url: Global.UrlAction.Gets,
                type: 'POST',
                data: JSON.stringify({ 'floorId': $('#report-daily-floor').val(), 'from': _from.value(), 'to': _to.value(), 'type': type }),
                contentType: 'application/json charset=utf-8',
                beforeSend: function () { $('#loading').show(); },
                success: function (data) {
                    $('#loading').hide();
                    console.log(data.Records);
                    console.log(data.Data);
                    var tb = $('#table-report-daily');
                    var head = $(`#table-report-daily  thead`);
                    head.empty();
                    var tr = $(`<tr></tr>`);
                    tr.append('<td>Ngày</td>');
                    data.Data.map(item => {
                        tr.append(`<td>${item.Name}</td>`);
                    })

                    head.append(tr);

                    var _body = $(`#table-report-daily tbody `);
                    _body.empty();
                    if (data.Records.length > 0) {

                        data.Records.map(item => {
                            tr = $(`<tr></tr>`);

                            tr.append(`<td>${item.Date}</td>`);
                            data.Data.map(_item => {
                                var found = item.Lines.filter(x => x.LineId == _item.Id)[0];
                                if (found)
                                    if (type == '1')
                                        tr.append(`<td>${found.BTPThoatChuyenNgay - found.BTPThoatChuyenNgayGiam}/${found.DinhMucNgay}</td>`);
                                    else
                                        tr.append(`<td>${found.ThucHienNgay - found.ThucHienNgayGiam}/${found.DinhMucNgay}</td>`);
                                else
                                    tr.append(`<td>0</td>`);
                            })
                            _body.append(tr);
                        })

                        tr = $(`<tr></tr>`);
                        tr.append(`<td>Tổng</td>`);
                        data.Data.map(_item => {
                            tr.append(`<td>${_item.IdDen}/${_item.STTReadNS}</td>`); 
                        })
                        _body.append(tr);
                    }

                }
            });
    }

    function InitDatePicker() {
        $("#report-daily-from").kendoDatePicker({
            format: "dd/MM/yyyy",
            change: function () {
                var value = this.value();
                if (value != null) {
                    var dp = $("#report-daily-to").data("kendoDatePicker");
                    dp.min(value);
                }
            },
            value: new Date()
        });

        $("#report-daily-to").kendoDatePicker({
            format: "dd/MM/yyyy",
            min: new Date()
        });
    }
}

$(document).ready(function () {
    var obj = new GPRO.ReportDaily();
    obj.Init();
});
