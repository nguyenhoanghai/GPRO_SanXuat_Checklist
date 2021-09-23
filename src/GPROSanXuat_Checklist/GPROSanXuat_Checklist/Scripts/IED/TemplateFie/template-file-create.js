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
GPRO.namespace('TemplateFile');
GPRO.TemplateFile = function () {
    var Global = {
        UrlAction: {
            Get: '/TemplateFile/GetById',
            Save: '/TemplateFile/Save',
        },
        Element: {
            Jtable: 'jtableTemplateFile',
            PopupSearch: 'popup_SearchTemplateFile',
        },
        Data: {
            TemplateFile: {},
            ControlArr: [],
            objectIndex: 0,
            LastIndex: 0,
            Code: '',
        }
    }
    this.GetGlobal = function () {
        return Global;
    }

    this.Init = function () {
        RegisterEvent();
        GetEmployeeSelect('employee');
        InitDatePicker();
        $('#tf_isapprove').change();


        if ($('#tf_Id').val() != '0')
            var inter = setInterval(function () { Get(); clearInterval(inter); }, 1000);
        else {
            GetLastIndex();
            var inter = setInterval(function () { $('#tf_index').val(Global.Data.Code + (Global.Data.LastIndex + 1)); clearInterval(inter); }, 1000);
        }
    }

    var RegisterEvent = function () {
        //$('#tf_btnBack').click(function () {
        //    window.location.href = '/';
        //    //window.location.href = '/TemplateFile/Index';
        //});

        $('#tf_btnSave').click(function () {
            if (CheckValidate()) {
                Save();
            }
        });

        $('#tf_isapprove').change(function () {
            var datepicker = $("#tf_approveddate").data("kendoDatePicker");
            if (!$('#tf_isapprove').prop('checked')) {
                $('#tf_approveduser').attr('disabled', true);
                datepicker.enable(false);
            }
            else {
                $('#tf_approveduser').attr('disabled', false);
                datepicker.enable(true);
            }
        });

        $('[re_employee]').click(function () {
            GetEmployeeSelect('employee');
        });
    }

    function InitDatePicker() {
        $('#tf_approveddate').kendoDatePicker({
            format: 'dd/MM/yyyy',
        });
    }

    function Get() {
        $.ajax({
            url: Global.UrlAction.Get,
            type: 'POST',
            data: JSON.stringify({ 'Id': $('#tf_Id').val() }),
            contentType: 'application/json charset=utf-8',
            success: function (result) {
                GlobalCommon.CallbackProcess(result, function () {
                    Global.Data.objectIndex = result.Data.Index;  // Luu lai Index de luu sau khi sua thong tin
                    SetData(result.Data);
                }, false, Global.Element.PopupSize, true, true, function () {
                    var msg = GlobalCommon.GetErrorMessage(result);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
                });
            }
        });
    }

    function SetData(obj) {
        if (obj.Controls.length > 0) {
            $.each(obj.Controls, function (i, item) {
                Global.Data.ControlArr.push({
                    Id: item.Id,
                    ControlName: item.ControlName,
                    ControlType: item.ControlType,
                    Value: item.Value,
                    Checked: item.Checked,
                    TemplateId: item.TemplateId
                });
            });
        }
        $('#tf_index').val(obj.Code);
        $('#tf_name').val(obj.Name);
        $('#tf_note').val(obj.Note);
        $('#tf_isapprove').prop('checked', obj.IsApprove).change();
        $('#tf_approveduser').val((obj.ApprovedUser != null ? obj.ApprovedUser : 0));
        $('#tf_approveddate').data("kendoDatePicker").value((obj.ApprovedDate != null ? parseJsonDateToDate(obj.ApprovedDate) : null));
        CKEDITOR.instances.editor1.setData(obj.Content);
        if (obj.IsApprove)
            $('.modal-footer #tf_btnSave').remove();
    }

    function CheckValidate() {
        if ($('#tf_name').val() == "") {
            GlobalCommon.ShowMessageDialog("Vui lòng nhập Tên Biểu Mẫu.", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        else if ($('#tf_isapprove').prop('checked') && $('#tf_approveduser').val() == "0") {
            GlobalCommon.ShowMessageDialog("Vui lòng chọn Người Duyệt.", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        else if ($('#tf_isapprove').prop('checked') && $('#tf_approveddate').val().trim() == "") {
            GlobalCommon.ShowMessageDialog("Vui lòng chọn Ngày Duyệt.", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        return true;
    }

    function Save() {
        var templatefileObj = GetData();
        $.ajax({
            url: Global.UrlAction.Save,
            type: 'POST',
            data: JSON.stringify({ 'obj': templatefileObj }),
            contentType: 'application/json charset=utf-8',
            success: function (result) {
                GlobalCommon.CallbackProcess(result, function () {
                    if (result.Result == "OK")
                        $('#tf_btnBack').click();
                    else
                        GlobalCommon.ShowMessageDialog(msg, function () { }, "Lỗi");
                }, false, Global.Element.PopupSize, true, true, function () {
                    var msg = GlobalCommon.GetErrorMessage(result);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
                });
            }
        });
    }

    function GetData() {
        var html = CKEDITOR.instances.editor1.getData();
        $('#html_content').empty().html(html);

        Global.Data.ControlArr.length = 0;
        // lay input tag
        $('#html_content input').each(function () {
            if ($(this).attr('action') != "undefined" && $(this).attr('action') == "formula") {
                $(this).attr('formula', $(this).val());
                $(this).val(0);
            }
            var id = $(this).attr('name');
            if (typeof (id) != 'undefined') {
                $(this).attr('id', id);
                var flag = false;
                var typeid = 0;
                var checked = null;

                // ktra trung
                if (Global.Data.ControlArr.length > 0) {
                    $.each(Global.Data.ControlArr, function (i, item) {
                        if (id == item.Name && typeid != 3) {
                            flag = true;
                            return false;
                        }
                    });
                }
                if (!flag) {
                    switch ($(this).attr('type')) {
                        case 'text':
                            typeid = 1;
                            break;
                        case 'radio':
                            typeid = 3;
                            checked = (typeof ($(this).attr('checked')) != 'undefined' ? $(this).attr('checked') : null);
                            break;
                        case 'checkbox':
                            typeid = 2;
                            checked = (typeof ($(this).attr('checked')) != 'undefined' ? $(this).attr('checked') : null);
                            break;
                    }

                    // them
                    Global.Data.ControlArr.push({
                        Id: 0,
                        ControlName: id,
                        ControlType: typeid,
                        Value: $(this).val(),
                        Checked: checked,
                        TemplateId: 0
                    });
                }
            }
        });

        // get select tag
        $('#html_content select').each(function () {
            var id = $(this).attr('name');
            if (typeof (id) != 'undefined') {
                $(this).attr('id', id);
                $(this).attr(id.substring(0, id.indexOf('-')), '');
                var flag = false;
                // ktra trung
                if (Global.Data.ControlArr.length > 0) {
                    $.each(Global.Data.ControlArr, function (i, item) {
                        if (id == item.Name) {
                            flag = true;
                            return false;
                        }
                    });
                }
                if (!flag) {
                    // them
                    Global.Data.ControlArr.push({
                        Id: 0,
                        ControlName: id,
                        ControlType: 4,
                        Value: $('#html_content select[name="' + id + '"] option:selected').text(),
                        Checked: $(this).val(),
                        TemplateId: 0
                    });
                }
            }
        });

        // get textarea tag
        $('#html_content textarea').each(function () {
            var id = $(this).attr('name');
            if (typeof (id) != 'undefined') {
                $(this).attr('id', id);
                var flag = false;
                // ktra trung
                if (Global.Data.ControlArr.length > 0) {
                    $.each(Global.Data.ControlArr, function (i, item) {
                        if (id == item.Name) {
                            flag = true;
                            return false;
                        }
                    });
                }
                if (!flag) {
                    // them
                    Global.Data.ControlArr.push({
                        Id: 0,
                        ControlName: id,
                        ControlType: 5,
                        Value: $(this).val(),
                        Checked: false,
                        TemplateId: 0
                    });
                }
            }
        });

        html = $('#html_content').html();

        var index;
        if ($('#tf_Id').val() == '0') // neu la them moi
            index = Global.Data.LastIndex + 1;
        else
            index = Global.Data.objectIndex;
        var obj = {
            Id: $('#tf_Id').val(),
            //Code: $('#code').val(),
            Name: $('#tf_name').val(),
            Index: index,
            Note: $('#tf_note').val(),
            IsApprove: $('#tf_isapprove').prop('checked'),
            ApprovedDate: $('#tf_approveddate').data("kendoDatePicker").value(),
            ApprovedUser: $('#tf_approveduser').val(),
            Content: html,
            Controls: Global.Data.ControlArr
        }

        return obj;
    }

    function GetLastIndex() {
        $.ajax({
            url: '/TemplateFile/GetLastIndex',
            type: 'POST',
            contentType: 'application/json',
            success: function (data) {
                Global.Data.LastIndex = parseInt(data.Records);
                Global.Data.Code = data.Data;
            }
        });
    }
}

$(document).ready(function () {
    if (CKEDITOR.env.ie && CKEDITOR.env.version < 9)
        CKEDITOR.tools.enableHtml5Elements(document);
    CKEDITOR.config.height = 450;
    CKEDITOR.config.width = 'auto';

    var templatefile = new GPRO.TemplateFile();
    templatefile.Init();
    CKEDITOR.replace('editor1');
})