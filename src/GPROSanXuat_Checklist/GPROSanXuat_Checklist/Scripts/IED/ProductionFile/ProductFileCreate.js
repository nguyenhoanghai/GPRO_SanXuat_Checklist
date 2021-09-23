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
GPRO.namespace('ProductionFile');
GPRO.ProductionFile = function () {
    var Global = {
        UrlAction: {
            Get: '/ProductionFile/GetById',
            Save: '/ProductionFile/Save',
            GetContent: '/TemplateFile/GetById',

        },
        Element: {
            Jtable: 'jtableProductionFile',
            PopupSearch: 'popup_SearchProductionFile',
        },
        Data: {
            ControlsArr: [],
            wating: false,
            isClick: false
        }
    }
    this.GetGlobal = function () {
        return Global;
    }

    this.Init = function () {
        RegisterEvent();
        GetTemplateFileSelect('pf_templatefileid');
        //  GetProductionBatchSelect('pf_requirement');
        GetRequireSelect('pf_requirement');
        GetEmployeeSelect('employee');
        InitDatePicker();
        $('#pf_isapproved').change();
        if ($('#pf_Id').val() != '0') {
            Global.Data.wating = true;
            var inter = setInterval(function () {
                Get();
                clearInterval(inter);
                Global.Data.wating = false
            }, 3000);
        }
        else
        {
            var inter = setInterval(function () {
                $('#pf_templatefileid').change(); clearInterval(inter);
            }, 1000);
        }
    }

    var RegisterEvent = function () {
        //$('#pf_btnback').click(function () {
        //    //window.location.href = '/ProductionFile/Index';
        //    window.location.href = '/';
        //});

        $('#pf_btnSave').click(function () {
            if (CheckValidate())
                Save();
        });

        $('#pf_isapproved').change(function () {
            var datepicker = $("#pf_approveddate").data("kendoDatePicker");
            if (!$('#pf_isapproved').prop('checked')) {
                datepicker.enable(false);
                $('#pf_approveduser').prop('disabled', true);
            }
            else {
                datepicker.enable(true);
                $('#pf_approveduser').prop('disabled', false);
            }
        });

        $('#pf_templatefileid').change(function () {
            if ($(this).val() != '0' && !Global.Data.wating) {
                GetContent();
            }
        });

        $('[re_requirement]').click(function () {
            // GetProductionBatchSelect('pf_requirement');
            GetRequireSelect('pf_requirement');
        });

        $('[re_templatefileid]').click(function () {
            GetTemplateFileSelect('pf_templatefileid');
        });

        $('[re_employee]').click(function () {
            GetEmployeeSelect('employee');
        });

        //$("#pf_btnExport").click(function (event) {  //xuất ra file word
        //    $("#content-area").wordExport();
        //});

        $('#pf_btnExport').click(function () {
            ExportToWord();
        });
    }

    function InitDatePicker() {
        $('#pf_approveddate').kendoDatePicker({
            format: 'dd/MM/yyyy',
        });
    }

    function GetContent() {
        $.ajax({
            url: Global.UrlAction.GetContent,
            type: 'POST',
            data: JSON.stringify({ 'Id': $('#pf_templatefileid').val() }),
            contentType: 'application/json charset=utf-8',
            success: function (result) {
                GlobalCommon.CallbackProcess(result, function () {
                    if (result.Data != null) {
                        $('#content-area').empty().html(result.Data.Content);
                        if (result.Data.Controls.length > 0) {
                            $.each(result.Data.Controls, function (i, item) {
                                Global.Data.ControlsArr.push({
                                    Id: 0,
                                    ControlName: item.ControlName,
                                    ControlType: item.ControlType,
                                    Value: item.Value,
                                    TemplateControlId: item.Id,
                                });
                            });
                        }
                        GetEmployeeSelect('nhanvien');
                        GetMarialSelect('vattu', 0);
                        GetUnitSelect('donvitinh');
                        GetMarialSelect('sanpham', 0);
                        GetProductionBatchSelect('losanxuat');
                        RegisterControl();
                    }
                }, false, Global.Element.PopupSize, true, true, function () {
                    var msg = GlobalCommon.GetErrorMessage(result);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
                });
            }
        });
    }

    function RegisterControl() {
        var flag = true;
        if ($('#content-area input[type="checkbox"]').length > 0) {
            $.each($('#content-area  input[type="checkbox"]'), function (i, item) {
                var id = $(this).attr('name');
                if (typeof (id) == 'undefined') {
                    id = 'auto_cb_' + i;
                    $(this).attr('name', id);
                }

                $(item).click(function () { Global.Data.isClick = true; });

                $(item).change(function () {
                    if (Global.Data.isClick) {
                        if (typeof ($(this).attr('checked')) == 'undefined')
                            $(this).attr('checked', true);
                        else
                            //  $('#' + Global.Data.infor_tab + ' input[name="' + id + '"]').removeAttr('checked');
                            $(this).removeAttr('checked');
                        Global.Data.HasSaved = false;
                        Global.Data.isClick = false;
                    }
                });
            });
        }

        if ($('#content-area input[type="radio"]').length > 0) {
            $('#content-area input[type="radio"]').click(function () {
                var id = $(this).attr('id');
                $('#content-area input[name="' + id + '"]').removeAttr('checked');
                $(this).attr('checked', true);
                $(this).prop('checked', true);
            });
        }

        if ($('#content-area input[type="text"]').length > 0) {
            $('#content-area :input[type="text"]').change(function () {
                $(this).attr('value', $(this).val());
            });
        }

        if ($('#content-area textarea').length > 0) {
            $('#content-area textarea').change(function () {
                $(this).html($(this).val());
            });
        }

        if ($('#content-area select').length > 0) {
            $('#content-area select').change(function () {
                var id = $(this).attr('name');
                var vl = $('#' + id).val();
                $.each($('#' + id + ' option'), function (i, item) {
                    $('#' + id + ' option[value=' + $(item).attr('value') + ']').removeAttr("selected");
                });

                $('#' + id + ' option[value=' + vl + ']').attr('selected', 'selected');
                $('#' + id).val(vl);
            });
        }
    }

    function ExportToWord() {
        $('#word-content').html($('#content-area').html());
        var value = '';
        var span = '';
        // var html = $('#word-content').prop('outerHTML');
        //selectbox
        $.each($('#word-content select'), function (i, item) {
            //$('#word-content select[name="losanxuat-lô-sản xuất"] option')
            value = $('#word-content select[name="' + $(item).attr('id') + '"] option:selected').text();
            //var content = $('#word-content input[name="' + $(item).attr('id') + '"]').val.text();
            span = '<span style="color:red" >' + value + '</span>';
            //var span = '<span>' + content + '<span>';
            $('#word-content select[name="' + $(item).attr('id') + '"]').replaceWith(span);
            //$('#word-content input[name="' + $(item).attr('id') + '"]').replaceWith(span);
        });
        //textbox
        $.each($('#word-content input[type="text"]'), function (i, item) {
            value = $('#word-content input[name="' + $(item).attr('id') + '"]').val();
            span = '<span style="color:red; text-align:center" >' + value + '</span>';
            $('#word-content input[name="' + $(item).attr('id') + '"]').replaceWith(span);
        });
        //textarea
        $.each($('#word-content textarea'), function (i, item) {
            value = $('#word-content textarea[name="' + $(item).attr('id') + '"]').val().split('\n');
            span = '<span style="color:red; text-align:center" >' + value + '</span>';
            $('#word-content textarea[name="' + $(item).attr('id') + '"]').replaceWith(span);
        });
        //checkbox
        $.each($('#word-content input[type="checkbox"]'), function (i, item) {
            if ($(this).attr('checked')) // truyen cai name vao no moi biet la thang nao chứ
            {
                //value = '<i class="fa fa-check-square-o"><i/>';
                //value = "OK";
                value = '<img src="/Content/Layout/icheck/flat/checked-checkbox.gif"/>';
                span = '<span>' + value + '</span>';
            }
            else {
                //element.removeAttr("checked");
                //value = '<i class="fa fa-square-o" ></i>';
                //value = "Not OK";
                value = '<img src="/Content/Layout/icheck/flat/unchecked-checkbox.gif"/>';
                span = '<span>' + value + '</span>';
            }

            //span = '<span>' + value + '</span>';
            $(this).replaceWith(span);
        });

        $("#word-content").wordExport();
        //$("#word-content").detach();
    }

    /**********************************************************************************************************************
                                                            TestSample
    ***********************************************************************************************************************/
    function Get() {
        $.ajax({
            url: Global.UrlAction.Get,
            type: 'POST',
            data: JSON.stringify({ 'Id': $('#pf_Id').val() }),
            contentType: 'application/json charset=utf-8',
            success: function (result) {
                GlobalCommon.CallbackProcess(result, function () {
                    SetData(result.Data);
                }, false, Global.Element.PopupSize, true, true, function () {

                    var msg = GlobalCommon.GetErrorMessage(result);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
                });
            }
        });
    }

    function SetData(obj) {
        $('#pf_Id').val(obj.Id);
        $('#pf_templatefileid').val(obj.TemplateFileId);
        $('#pf_requirement').val(obj.RequireId);
        var approveddate = new Date(parseJsonDateToDate(obj.ApprovedDate));
        $('#pf_approveddate').data("kendoDatePicker").value(approveddate);
        $('#pf_approveduser').val(obj.ApprovedUser);
        $('#pf_isapproved').prop('checked', obj.IsApproved).change();
        if (obj.IsApproved)
            $('#pf_btnSave').remove();
        $('#content-area').empty().html(obj.Content);
        $('#pf_codeurl').html(obj.CodeUrl);
        GetEmployeeSelect('nhanvien');
        GetMarialSelect('vattu', 0);
        GetUnitSelect('donvitinh');
        GetMarialSelect('sanpham', 0);
        GetProductionBatchSelect('losanxuat');
        RegisterControl();

        var timer = setInterval(function () {
            if (obj.Controls.length > 0) {
                $.each(obj.Controls, function (i, item) {
                    Global.Data.ControlsArr.push({
                        Id: item.Id,
                        ControlName: item.ControlName,
                        ControlType: item.ControlType,
                        Value: item.Value,
                        TemplateControlId: item.TemplateControlId,
                    });

                    if (item.ControlType == 4)
                        $('#content-area #' + item.ControlName).val(item.Value);
                });
            }
            clearInterval(timer);
        }, 1000);
    }

    function CheckValidate() {
        if ($('#pf_templatefileid').val() == "") {
            GlobalCommon.ShowMessageDialog("Vui lòng chọn Biểu Mẫu.", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        else if ($('#pf_requirement').val() == "") {
            GlobalCommon.ShowMessageDialog("Vui lòng chọn Lô Sản Xuất.", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        else if ($('#pf_isapproved').prop('checked') && $('#pf_approveduser').val() == "0") {
            GlobalCommon.ShowMessageDialog("Vui lòng chọn Người Duyệt.", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        else if ($('#pf_isapproved').prop('checked') && $('#pf_approveddate').val().trim() == "") {
            GlobalCommon.ShowMessageDialog("Vui lòng chọn Ngày Duyệt.", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        return true;
    }

    function Save() {
        var productionfileObj = GetData();
        $.ajax({
            url: Global.UrlAction.Save,
            type: 'POST',
            data: JSON.stringify({ 'obj': productionfileObj }),
            contentType: 'application/json charset=utf-8',
            success: function (result) {
                GlobalCommon.CallbackProcess(result, function () {
                    if (result.Result == "OK")
                        $("#pf_btnback").click();
                    else
                        GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình xử lý.");
                }, false, Global.Element.PopupSize, true, true, function () {

                    var msg = GlobalCommon.GetErrorMessage(result);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
                });
            }
        });
    }

    function GetData() {
        $.each(Global.Data.ControlsArr, function (i, item) {
            switch (item.ControlType) {
                case 1://textbox 
                case 4://select 
                case 5://textarea
                    item.Value = $('#content-area #' + item.ControlName + '').val(); break;
                case 2://checkbox
                case 3://radio
                    item.Value = $('#content-area #' + item.ControlName + ':checked').val(); break;
            }
            $('#content-area #' + item.ControlName + '').change();
        });

        var HTML = $('#content-area').html();

        var obj = {
            Id: $('#pf_Id').val(),
            TemplateFileId: $('#pf_templatefileid').val(),
            RequireId: $('#pf_requirement').val(),
            IsApproved: $('#pf_isapproved').prop('checked'),
            ApprovedDate: $('#pf_approveddate').val() != null ? $('#pf_approveddate').data("kendoDatePicker").value() : null,
            ApprovedUser: $('#pf_approveduser').val() == '0' ? null : $('#pf_approveduser').val(),
            Index: $('#pf_index').val(),
            Content: HTML,
            Controls: Global.Data.ControlsArr
        }
        return obj;
    }
}


$(document).ready(function () {
    var productionfile = new GPRO.ProductionFile();
    productionfile.Init();
})