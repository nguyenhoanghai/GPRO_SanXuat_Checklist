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
            GetCheckList: '/CheckList/GetAllCheckList',
            GetAllJob: '/CheckList/GetAllJob',
            Excel: '/CheckList/Excel2',
        },
        Element: {

        },
        Data: {
            ChecklistArr: [],
            ProductArr: [],
            ProTimeArr: []
        }
    }
    this.GetGlobal = function () {
        return Global;
    }

    this.Init = function () {
        RegisterEvent();
        GetOrganSelect('organ');
        GetCheckList();
    }


    var RegisterEvent = function () { 

        $('[re_order]').click(function () {
            GetCheckList();
        });

        $('[re_ogan]').click(function () {
     GetOrganSelect('organ'); 
        });

        $('[close]').click(function () {
            $('#keyword').val('');
            $('#searchBy').val();
        });

        $('#order').change(function () {
            var str = '';
            if (Global.Data.ProductArr.length > 0) {
                $.each(Global.Data.ProductArr, function (i, item) {
                    if (item.Parent == parseInt($('#order').val()))
                        str += '<option value="' + item.Id + '">' + item.Name + '</option>';
                });

                if (str == '')
                    str += '<option value="0">không có dữ liệu</option>';
            }
            else
                str += '<option value="0">không có dữ liệu</option>';
            $('#product').empty().append(str).change();
        });

        $('#product').change(function () {
            var str = '';
            if (Global.Data.ProTimeArr.length > 0) {
                $.each(Global.Data.ProTimeArr, function (i, item) {
                    if (item.Parent == parseInt($('#product').val()))
                        str += '<option value="' + item.Id + '">' + item.Name + '</option>';
                });

                if (str == '')
                    str += '<option value="0">không có dữ liệu</option>';
            }
            else
                str += '<option value="0">không có dữ liệu</option>';
            $('#proTime').empty().append(str).change();
        });

        $('#btnSearch').click(function () {
            if(CheckValaidate())
                GetAllJob();
        });

        $('[findExcel]').click(function () {
            window.location.href = Global.UrlAction.Excel + "?proTimeId=" + $("#proTime").val() +  '&&clType=' + $('#cl_type').val() + '&&Organ=' + $('#organ').val();
        });
    }

    function GetCheckList() {
        $.ajax({
            url: Global.UrlAction.GetCheckList,
            type: 'post',
            data: JSON.stringify({ 'keyword': '' }),
            contentType: 'application/json',
            beforeSend: function () { $('#loading').show(); },
            success: function (result) {
                $('#loading').hide();
                GlobalCommon.CallbackProcess(result, function () {
                    if (result.Result == "OK") {
                        Global.Data.ChecklistArr.length = 0;
                        Global.Data.ProductArr.length = 0;
                        Global.Data.ProTimeArr.length = 0;
                        var cl = '', pro = '', proTime = '';
                        if (result.Data != null && result.Data.length > 0) {
                            $.each(result.Data, function (i, item) {
                                Global.Data.ChecklistArr.push({
                                    Id: item.Id,
                                    Name: item.Name
                                });
                                cl += '<option value="' + item.Id + '">' + item.Name + '</option>';
                                if (item.Products != null && item.Products.length > 0) {
                                    $.each(item.Products, function (ii, product) {
                                        if (i == 0)
                                            pro += '<option value="' + product.Id + '">' + product.Name + '</option>';
                                        Global.Data.ProductArr.push({
                                            Id: product.Id,
                                            Parent: item.Id,
                                            Name: product.Name
                                        });

                                        if (product.ProductTimes != null && product.ProductTimes.length > 0) {
                                            $.each(product.ProductTimes, function (iii, productTime) {
                                                if (i == 0)
                                                    proTime += '<option value="' + productTime.Id + '">' + productTime.Name + '</option>';

                                                Global.Data.ProTimeArr.push({
                                                    Id: productTime.Id,
                                                    Parent: product.Id,
                                                    Name: productTime.Name
                                                });
                                            });
                                        }
                                        else
                                            proTime += '<option value="0">không có dữ liệu</option>';
                                    });
                                }
                                else
                                    pro += '<option value="0">không có dữ liệu</option>';
                            });
                        }
                        else
                            cl += '<option value="0">không có dữ liệu</option>';
                        $('#order').empty().append(cl).change();
                        $('#product').empty().append(pro).change();
                        $('#proTime').empty().append(pro).change();
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

    function GetAllJob() {
        $.ajax({
            url: Global.UrlAction.GetAllJob,
            type: 'post',
            data: JSON.stringify({ 'proTimeId': $('#proTime').val(), 'isGetReport': true, 'clType': $('#cl_type').val(), 'Organ': $('#organ').val() }),
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
            var currentParent = 0;
            $.each(objs, function (i, item) {
                tr += '<tr>';
                tr += '     <td>' + item.Index + '</td>';
                if (currentParent != item.PartOfOrganId) {
                    tr += '     <td rowspan="' + item.PartOfOrganCount + '">' + item.PartOfOrganName + '</td>';
                    currentParent = item.PartOfOrganId;
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
                tr += '     <td>' + (item.Note != null ? item.Note :"")+ '</td>';
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
    $("#switch_lcd").kendoMobileSwitch({
        onLabel: "Yes",
        offLabel: "No"
    });
    var CheckList = new GPRO.CheckList();
    CheckList.Init();
})