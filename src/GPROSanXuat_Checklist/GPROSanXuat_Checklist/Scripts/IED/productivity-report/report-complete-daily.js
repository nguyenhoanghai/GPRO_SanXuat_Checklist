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
GPRO.namespace('ReportCompleteDaily');
GPRO.ReportCompleteDaily = function () {
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

        GetWorkshopSelect('report-complete-workshop');
        GetProductSelect('report-complete-product');
        RegisterEvent();
        InitDatePicker();
    }

    var RegisterEvent = function () {
        $('#report-complete-workshop').change(function () {
            if ($('#report-complete-workshop').val() != undefined)
                GetFloorSelect('report-complete-floor', $('#report-complete-workshop').val());
        });

        $('#report-complete-floor').change(function () {
            if ($('#report-complete-floor').val() != undefined)
                GetLineSelect('report-complete-line', $('#report-complete-floor').val());
        });

        $('#report-complete-line').change(function () {
            if ($('#report-complete-line').val() != undefined)
                ReloadTable();
        });

        $('#btn-report-complete-view').click(function () {
            Gets();
        });

        $('#btn-report-complete-excel').click(function () {
            var _from = $("#report-complete-from").data("kendoDatePicker");
            var _to = $("#report-complete-to").data("kendoDatePicker");
            if (_from.value && _to.value && $('#report-complete-floor').val() != undefined)
                window.location.href = Global.UrlAction.Export + `?floorId=${$('#report-complete-floor').val()}&from=${moment(_from.value()).format('DD/MM/YYYY')}&to=${moment(_to.value()).format('DD/MM/YYYY')}&type=2`;
        });
    }


    function Gets() {
        var _from = $("#report-complete-from").data("kendoDatePicker");
        var _to = $("#report-complete-to").data("kendoDatePicker");
        var type = 2;

        if (_from.value && _to.value && $('#report-complete-floor').val() != undefined)
            $.ajax({
                url: Global.UrlAction.Gets,
                type: 'POST',
                data: JSON.stringify({ 'floorId': $('#report-complete-floor').val(), 'from': _from.value(), 'to': _to.value(), 'type': type }),
                contentType: 'application/json charset=utf-8',
                beforeSend: function () { $('#loading').show(); },
                success: function (data) {
                    $('#loading').hide();
                    console.log(data.Records);
                    console.log(data.Data);
                    var tb = $('#table-report-complete');
                    var head = $(`#table-report-complete  thead`);
                    head.empty();
                    var tr = $(`<tr></tr>`);
                    tr.append('<td>Ngày</td>');
                    data.Data.map(item => {
                        tr.append(`<td>${item.Name}</td>`);
                    })

                    head.append(tr);

                    var _body = $(`#table-report-complete tbody `);
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
        $("#report-complete-from").kendoDatePicker({
            format: "dd/MM/yyyy",
            change: function () {
                var value = this.value();
                if (value != null) {
                    var dp = $("#report-complete-to").data("kendoDatePicker");
                    dp.min(value);
                }
            },
            value: new Date()
        });

        $("#report-complete-to").kendoDatePicker({
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
    var obj = new GPRO.ReportCompleteDaily();
    obj.Init();
});
