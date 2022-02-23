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
GPRO.namespace('ReportBTP');
GPRO.ReportBTP = function () {
    var Global = {
        UrlAction: {
            Gets: '/ProductivityReport/Gets',
            GetBTPs: '/ProductivityReport/GetBTPs',
            ExportBTPs: '/ProductivityReport/export_btp',
            //Save: '/Assignment/Save',
            //Delete: '/Assignment/Delete',
            //Finish: '/Assignment/Finish',

            //GetPOs: '/PO/Gets_PC',

            //GetCodes: '/lenhsx/GetCodes',
            //GetByCode: '/lenhsx/GetByCode',

            //GetNXs: '/Assignment/GetNXs',
            //GetNXGios: '/Assignment/GetNXGios'
        },
        Element: {
            JtableProduct: 'jtable-report-btp',


            //Popup: 'popup-asign',

            //PopupNX: 'popup-a-nx',
            //JtableNX: 'jtable-a-nx',

            //PopupNX_H: 'popup-a-nx-gio',
            //JtableNX_H: 'jtable-a-nx-gio',
        },
        Data: {
            Products: [],
            ProductId: 0,
            LenhProductId: 0,
            SLCu: 0,
            Unit: '',
            SLConLai: 0,
            cspId: 0,
            strDate: '',
            lineId: 0
        }
    }
    this.GetGlobal = function () {
        return Global;
    }

    this.Init = function () {
        // GetLenhCodes();

        GetWorkshopSelect('report-btp-workshop');
        GetProductSelect('report-btp-product');
        RegisterEvent();
        //InitList();
        ////ReloadList();
        //InitPopup();

        //InitPopupPO();
        //InitTablePO();

        //InitTableProduct();
        // ReloadTable();

        //InitPopupNX();
        // InitTable();
        InitDatePicker();
    }

    var RegisterEvent = function () {
        $('#report-btp-workshop').change(function () {
            if ($('#report-btp-workshop').val() != undefined)
                GetFloorSelect('report-btp-floor', $('#report-btp-workshop').val());
        });

        $('#report-btp-floor').change(function () {
            if ($('#report-btp-floor').val() != undefined)
                GetLineSelect('report-btp-line', $('#report-btp-floor').val());
        });

        $('#report-btp-line').change(function () {
            if ($('#report-btp-line').val() != undefined)
                ReloadTable();
        });

        $('#btn-report-btp-view').click(function () {
            GetBTPs();
        });

        $('#btn-report-btp-excel').click(function () {
            var _from = $("#report-btp-from").data("kendoDatePicker");
            var _to = $("#report-btp-to").data("kendoDatePicker");
            if (_from.value && _to.value && $('#report-btp-floor').val() != undefined)
                window.location.href = Global.UrlAction.ExportBTPs + `?floorId=${$('#report-btp-floor').val()}&from=${moment(_from.value()).format('DD/MM/YYYY')}&to=${moment(_to.value()).format('DD/MM/YYYY')}`;
        });
    }



    //function GetBTPs(lenhProId) {
    //    $.ajax({
    //        url: Global.UrlAction.GetBTPs,
    //        type: 'POST',
    //        data: JSON.stringify({ 'lenhProId': lenhProId }),
    //        contentType: 'application/json charset=utf-8',
    //        beforeSend: function () { $('#loading').show(); },
    //        success: function (data) {
    //            $('#loading').hide();

    //        }
    //    });
    //}

    function GetBTPs() {
        var _from = $("#report-btp-from").data("kendoDatePicker");
        var _to = $("#report-btp-to").data("kendoDatePicker");
        if (_from.value && _to.value && $('#report-btp-floor').val() != undefined)
            $.ajax({
                url: Global.UrlAction.GetBTPs,
                type: 'POST',
                data: JSON.stringify({ 'floorId': $('#report-btp-floor').val(), 'from': _from.value(), 'to': _to.value() }),
                contentType: 'application/json charset=utf-8',
                beforeSend: function () { $('#loading').show(); },
                success: function (data) {
                    $('#loading').hide();
                    console.log(data.Records);
                    console.log(data.Data);
                    var tb = $('#table-report-btp');
                    var head = $(`#table-report-btp  thead`);
                    head.empty();
                    var tr = $(`<tr></tr>`);
                    tr.append('<td>Ngày</td>');
                    data.Data.map(item => {
                        tr.append(`<td>${item.Name}</td>`);
                    })

                    head.append(tr);

                    var _body = $(`#table-report-btp tbody `);
                    _body.empty();
                    if (data.Records.length > 0) {

                        data.Records.map(item => {
                            tr = $(`<tr></tr>`);

                            tr.append(`<td>${item.Date}</td>`);
                            data.Data.map(_item => {
                                var found = item.Lines.filter(x => x.LineId == _item.Id)[0];
                                if (found)
                                    tr.append(`<td>${found.BTPTang - found.BTPGiam}</td>`);
                                else
                                    tr.append(`<td>0</td>`);
                            })
                            _body.append(tr);
                        })

                        tr = $(`<tr></tr>`);
                        tr.append(`<td>Tổng</td>`);
                        data.Data.map(_item => {

                            tr.append(`<td>${_item.IdDen}</td>`);

                            // tr.append(`<td>0</td>`);
                        })
                        _body.append(tr);
                    }

                }
            });
    }

    function InitDatePicker() {
        $("#report-btp-from").kendoDatePicker({
            format: "dd/MM/yyyy",
            change: function () {
                var value = this.value();
                if (value != null) {
                    var dp = $("#report-btp-to").data("kendoDatePicker");
                    dp.min(value);
                }
            },
            value: new Date()
        });

        $("#report-btp-to").kendoDatePicker({
            format: "dd/MM/yyyy",
            min: new Date()
        });
    }
}

$(document).ready(function () {
    var obj = new GPRO.ReportBTP();
    obj.Init();
});
