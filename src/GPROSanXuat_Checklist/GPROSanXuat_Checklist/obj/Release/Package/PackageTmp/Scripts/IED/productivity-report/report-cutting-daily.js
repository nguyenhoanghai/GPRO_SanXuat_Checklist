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
GPRO.namespace('ReportCuttingDaily');
GPRO.ReportCuttingDaily = function () {
    var Global = {
        UrlAction: {
            Gets: '/ProductivityReport/GetCuttings',
            Export: '/ProductivityReport/export_Cuttings',
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

        GetWorkshopSelect('report-cutting-workshop');
        GetProductSelect('report-cutting-product');
        RegisterEvent();
        InitDatePicker();
    }

    var RegisterEvent = function () {
        $('#report-cutting-workshop').change(function () {
            if ($('#report-cutting-workshop').val() != undefined)
                GetFloorSelect('report-cutting-floor', $('#report-cutting-workshop').val());
        });

        $('#report-cutting-floor').change(function () {
            if ($('#report-cutting-floor').val() != undefined)
                GetLineSelect('report-cutting-line', $('#report-cutting-floor').val());
        });

        $('#report-cutting-line').change(function () {
            if ($('#report-cutting-line').val() != undefined)
                ReloadTable();
        });

        $('#btn-report-cutting-view').click(function () {
            Gets();
        });

        $('#btn-report-cutting-excel').click(function () {
            var _from = $("#report-cutting-from").data("kendoDatePicker");
            var _to = $("#report-cutting-to").data("kendoDatePicker");
            if (_from.value && _to.value && $('#report-cutting-floor').val() != undefined)
                window.location.href = Global.UrlAction.Export + `?floorId=${$('#report-cutting-floor').val()}&from=${moment(_from.value()).format('DD/MM/YYYY')}&to=${moment(_to.value()).format('DD/MM/YYYY')}&type=1`;
        });
    }


    function Gets() {
        var _from = $("#report-cutting-from").data("kendoDatePicker");
        var _to = $("#report-cutting-to").data("kendoDatePicker");
        var type = 1;

        if (_from.value && _to.value && $('#report-cutting-floor').val() != undefined)
            $.ajax({
                url: Global.UrlAction.Gets,
                type: 'POST',
                data: JSON.stringify({ 'floorId': $('#report-cutting-floor').val(), 'from': _from.value(), 'to': _to.value(), 'type': type }),
                contentType: 'application/json charset=utf-8',
                beforeSend: function () { $('#loading').show(); },
                success: function (data) {
                    $('#loading').hide();
                    console.log(data.Records);
                    console.log(data.Data);
                    var tb = $('#table-report-cutting');
                    var head = $(`#table-report-cutting  thead`);
                    head.empty();
                    var tr = $(`<tr></tr>`);
                    tr.append('<td>Ngày</td>');
                    data.Data.map(item => {
                        tr.append(`<td>${item.Name}</td>`);
                    })

                    head.append(tr);

                    var _body = $(`#table-report-cutting tbody `);
                    _body.empty();
                    if (data.Records.length > 0) {

                        data.Records.map(item => {
                            tr = $(`<tr></tr>`);

                            tr.append(`<td>${item.Date}</td>`);
                            data.Data.map(_item => {
                                var founds = item.Phases.filter(x => x.PhaseId == _item.Value);
                                var sanluong = 0;
                                if (founds) {
                                    var _tang = founds.filter(x => x.CommandTypeId == 4);
                                    if (_tang && _tang.length > 0)
                                        sanluong = _tang.sum('Quantity') ;
                                    var _giam = founds.filter(x => x.CommandTypeId != 4);
                                    if (_giam && _giam.length > 0)
                                        sanluong -= _giam.sum('x.Quantity') ;
                                }

                                tr.append(`<td>${sanluong}</td>`);
                            })
                            _body.append(tr);
                        })

                        tr = $(`<tr></tr>`);
                        tr.append(`<td>Tổng</td>`);
                        data.Data.map(_item => {
                            tr.append(`<td>${_item.Data}</td>`);
                        })
                        _body.append(tr);
                    }

                }
            });
    }

    function InitDatePicker() {
        $("#report-cutting-from").kendoDatePicker({
            format: "dd/MM/yyyy",
            change: function () {
                var value = this.value();
                if (value != null) {
                    var dp = $("#report-cutting-to").data("kendoDatePicker");
                    dp.min(value);
                }
            },
            value: new Date()
        });

        $("#report-cutting-to").kendoDatePicker({
            format: "dd/MM/yyyy",
            min: new Date()
        });
    }

    Array.prototype.sum = function (prop) {
        var total = 0
        for (var i = 0, _len = this.length; i < _len; i++) {
            total += this[i][prop]
        }
        return total
    }
}

$(document).ready(function () {
    var obj = new GPRO.ReportCuttingDaily();
    obj.Init();
});
