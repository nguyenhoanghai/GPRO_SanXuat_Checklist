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
GPRO.namespace('CheckList');
GPRO.CheckList = function () {
    var Global = {
        UrlAction: {
            Get: '/CheckList/FindJobInTime',
            Excel: '/CheckList/Excel',
        },
        Element: {

        },
        Data: {
            ChecklistArr: [],
            ProductArr: [],
            ProTimeArr: [],
            day: 0,
            month: 0,
            year: 0,
        }
    }
    this.GetGlobal = function () {
        return Global;
    }

    this.Init = function () {
        var now = new Date();
        Global.Data.dd = now.getDate();
        Global.Data.mm = now.getMonth();
        Global.Data.yy = now.getFullYear();
        RegisterEvent();
        if ($('#amen').val() == '0')
            $('[doituong]').hide();
        $('#cl_type').change();
    }


    var RegisterEvent = function () {
        $('#cl_type').change(function () {
            var select = parseInt($(this).val());
            switch (select) {
                case 0: // nv
                    if ($('#amen').val() == '1')
                        GetAllEmployee('organ');
                    break;
                case 1: // organ
                    if ($('#amen').val() == '1')
                        GetOrganSelect('organ');
                    break;
                case 2: // cty

                    break;
            }
        });

        $('[re_ogan]').click(function () {
            var select = parseInt($('#cl_type').val());
            switch (select) {
                case 0: // nv
                    if ($('#amen').val() == '1')
                        GetAllEmployee('organ');
                    break;
                case 1: // organ
                    if ($('#amen').val() == '1')
                        GetOrganSelect('organ');
                    break;
            }
        });

        $('[close]').click(function () {
            $('#keyword').val('');
            $('#searchBy').val();
        });


        $('#btnSearch').click(function () {
            if (CheckValaidate())
                GetAllJob();
        });

        $("#J_start").kendoDatePicker({
            format: "dd/MM/yyyy",
            value: new Date(Global.Data.yy, Global.Data.mm, Global.Data.dd),
            change: function () {
                var value = this.value();
                var dp = $("#J_end").data("kendoDatePicker");
                dp.min(value);
            }
        });

        $("#J_end").kendoDatePicker({
            format: "dd/MM/yyyy",
            value: new Date(Global.Data.yy, Global.Data.mm, Global.Data.dd),
        });

        $('[findExcel]').click(function () {
            window.location.href = Global.UrlAction.Excel + "?start=" + $("#J_start").val() + "&&end=" + $("#J_end").val() + '&&clType=' + $('#cl_type').val() + '&&Organ=' + $('#organ').val() + '&&IsTracuu=false';
        });

    }


    function GetAllJob() {
        $.ajax({
            url: Global.UrlAction.Get,
            type: 'post',
            data: JSON.stringify({ 'start': $("#J_start").data("kendoDatePicker").value(), 'end': $("#J_end").data("kendoDatePicker").value(), 'clType': $('#cl_type').val(), 'Organ': $('#organ').val(), 'IsTracuu': false }),
            contentType: 'application/json',
            beforeSend: function () { $('#loading').show(); },
            success: function (result) {
                $('#loading').hide();
                GlobalCommon.CallbackProcess(result, function () {
                    if (result.Result == "OK") {
                        if (result.Data != null) {
                            $('#quanKH').html(result.Data.Quantity);
                            $('#quanTT').html(result.Data.QuantityTT);
                            $('#start').html(result.Data.Start);
                            $('#end').html(result.Data.End);
                            $('#realEnd').html(result.Data.RealEnd);
                            $('#input').html(result.Data.InputDate);
                            DrawTable(result.Data.Jobs);
                        }
                        else {
                            $('table.tb-report tbody').empty().append('<tr><td colspan="16">Không có dữ liệu</td></tr>');
                            $('#quanKH').html('');
                            $('#quanTT').html('');
                            $('#start').html('');
                            $('#end').html('');
                            $('#realEnd').html('');
                            $('#input').html('');
                        }
                    }
                    else
                        GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình sử lý.");
                }, false, Global.Element.PopupModule, true, true, function () {
                    var msg = GlobalCommon.GetErrorMessage(result);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình sử lý.");
                });
            }
        });
    }

    function DrawTable(objs) {
        var tr = '';
        if (objs != null && objs.length > 0) {
            var currentParent = 0, groupID = 0;
            $.each(objs, function (i, item) {
                tr += '<tr>';
                tr += '     <td>' + item.Index + '</td>';

                if (currentParent != item.ProTimeId) {
                    tr += '     <td rowspan="' + item.Rows + '">' + item.CheckListName + '</td>';
                    currentParent = item.ProTimeId;
                }

                if (groupID != item.PartOfOrganId) {
                    tr += '     <td rowspan="' + item.PartOfOrganCount + '">' + item.PartOfOrganName + '</td>';
                    groupID = item.PartOfOrganId;
                }
                tr += '     <td  > ' + item.JobName + '</td>';
                tr += '     <td>' + item.OrganName + ' |<span class="red"> ' + item.UserName + '</span> </td>';
                tr += '     <td>' + item.End + '</td>';
                tr += '     <td>' + item.RealEnd + '</td>';
                tr += '     <td> </td>';

                if (item.Errors == null || item.Errors.length == 0)
                    tr += '     <td class="red boder-red"> </td><td class="red boder-red"> </td><td class="red boder-red"> </td><td class="red boder-red"> </td><td class="red boder-red"> </td><td class="red boder-red"> </td><td class="red boder-red"> </td>';
                else {
                    tr += '     <td class="red boder-red">';
                    $.each(item.Errors, function (e, errItem) {
                        tr += '<div >' + errItem.sms + '</div>';
                    });
                    tr += '     </td>';
                    tr += '     <td class="red boder-red">';
                    $.each(item.Errors, function (e, errItem) {
                        tr += '<div >' + errItem.Start + '</div>';
                    });
                    tr += '     </td>';
                    tr += '     <td class="red boder-red">';
                    $.each(item.Errors, function (e, errItem) {
                        tr += '<div >' + errItem.User + '</div>';
                    });
                    tr += '     </td>';
                    tr += '     <td class="red boder-red">';
                    $.each(item.Errors, function (e, errItem) {
                        tr += '<div >' + errItem.Solution + '</div>';
                    });
                    tr += '     </td>';
                    tr += '     <td class="red boder-red">';
                    $.each(item.Errors, function (e, errItem) {
                        tr += '<div >' + errItem.End + '</div>';
                    });
                    tr += '     </td>';
                    tr += '     <td class="red boder-red">';
                    $.each(item.Errors, function (e, errItem) {
                        tr += '<div >' + errItem.RealEnd + '</div>';
                    });
                    tr += '     </td>';
                    tr += '     <td class="red boder-red">';
                    $.each(item.Errors, function (e, errItem) {
                        tr += '<div >' + (errItem.Reason != null ? errItem.Reason : "") + '</div>';
                    });
                    tr += '     </td>';
                }
                tr += '     <td class="' + (item.StatusId == 2 ? "red" : "") + '">' + item.Result + '</td>';
                tr += '     <td>' + (item.Note != null ? item.Note : "") + '</td>';
                tr += '</tr>';
            });
            $('table.tb-report tbody').empty().append(tr);
        }
        else
            $('table.tb-report tbody').empty().append('<tr><td colspan="16">Không có dữ liệu</td></tr>');
    }

    function CheckValaidate() {
        if ($('#product').val() == "0") {
            GlobalCommon.ShowMessageDialog("Vui lòng chọn Sản phẩm.", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        else if ($('#proTime').val() == "0") {
            GlobalCommon.ShowMessageDialog("Vui lòng chọn lô Sản phẩm.", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        return true;
    }
}
$(document).ready(function () {
    var CheckList = new GPRO.CheckList();
    CheckList.Init();
})