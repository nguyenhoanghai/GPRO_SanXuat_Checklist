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
            GetList: '/ProductionFile/Gets',
            Get: '/ProductionFile/GetById',
            Save: '/ProductionFile/Save',
            Delete: '/ProductionFile/Delete',
            Create: '/ProductionFile/Create/0',
            GetContent: '/TemplateFile/GetById',
        },
        Element: {
            Jtable: 'pro-file-jtable',
            PopupSearch: 'pro-file-popup-search',
            Popup: 'pro-file-popup'
        },
        Data: {
            ProductionFile: {},
            Id: 0,

            ControlsArr: [],
            wating: false,
            isClick: false,
            Code: '',
            Index: 0,
            isApprove: false
        }
    }
    this.GetGlobal = function () {
        return Global;
    }

    this.Init = function () {
        RegisterEvent();
        InitSearchPopup();
        InitPopup();
        InitList();
        ReloadList();
        InitDatePicker();
        GetTemplateFileSelect('pro-file-template');
        GetEmployeeSelect('pro-file-employee');
        $(`#${Global.Element.Popup} [pro-file-export]`).hide();
    }

    var RegisterEvent = function () {

        $('#pf_iframe').load(function () {
            var iframe = $('#pf_iframe').contents();
            iframe.find("#pf_btnback").click(function () {
                $("#" + Global.Element.Popup).modal('hide');
                Global.Data.Id = 0;
                ReloadList();
            });
        });

        $('#' + Global.Element.Popup + ' button[pro-file-close]').click(function () {
            Global.Data.Id = 0;
            //ReloadList();
        });

        $('[re-pro-file-template]').click(function () {
            GetTemplateFileSelect('pro-file-template');
        });

        $('#pro-file-template').change(function () {
            if ($(this).val() != '0' && !Global.Data.wating) {
                GetContent();
            }
        });
    }

    function InitDatePicker() {
        $('#pro-file-approveddate').kendoDatePicker({
            format: 'dd/MM/yyyy',
        });
    }

    function InitList() {
        $('#' + Global.Element.Jtable).jtable({
            title: 'Danh Sách biểu mẫu',
            paging: true,
            pageSize: 10,
            pageSizeChange: true,
            sorting: true,
            selectShow: false,
            actions: {
                listAction: Global.UrlAction.GetList,
                // createActionUrl: Global.UrlAction.Create,
                createAction: Global.Element.Popup,
            },
            messages: {
                addNewRecord: 'Thêm mới',
            },
            searchInput: {
                id: 'pro-file-keyword',
                className: 'search-input',
                placeHolder: 'Nhập từ khóa ...',
                keyup: function (evt) {
                    if (evt.keyCode == 13)
                        ReloadList();
                }
            },
            datas: {
                jtableId: Global.Element.Jtable
            },
            rowInserted: function (event, data) {
                if (data.record.Id == Global.Data.mTypeId) {
                    var $a = $('#' + Global.Element.Jtable).jtable('getRowByKey', data.record.Id);
                    $($a.children().find('.aaa')).click();
                }
            },
            fields: {
                Id: {
                    key: true,
                    create: false,
                    edit: false,
                    list: false
                },
                Name: {
                    title: "Tên biểu mẫu",
                    width: "10%",
                    display: function (data) {
                        var txt = '<span>' + data.record.Name + '</span>';
                        return txt;
                    }
                },
                //ProductionBatchId: {
                //    visibility: 'Lô Sản Xuất',
                //    title: "Tên Lô",
                //    width: "10%",
                //    display: function (data) {
                //        var txt = '<span>' + data.record.ProductionBatchName + '</span>';
                //        return txt;
                //    }
                //},
                IsApproved: {
                    title: "TT Duyệt",
                    width: "5%",
                    sorting: false,
                    display: function (data) {
                        var txt = '';
                        if (data.record.IsApproved)
                            txt = '<i class="fa fa-check-square-o"><i/>';
                        else
                            txt = '<i class="fa fa-square-o" ></i>';
                        return txt;
                    }
                },
                ApprovedDate: {
                    title: "Ngày Duyệt",
                    width: "5%",
                    display: function (data) {
                        var txt = '';
                        if (data.record.ApprovedDate != null) {
                            var date = new Date(parseJsonDateToDate(data.record.ApprovedDate))
                            txt = '<span class="">' + ParseDateToString(date) + '</span>';
                        }
                        return txt;
                    }
                },
                ApprovedUser: {
                    title: 'Người Duyệt',
                    width: '5%',
                    display: function (data) {
                        var txt = '';
                        if (data.record.ApprovedUser != null) {
                            txt = '<span class="red  ">' + data.record.ApproverName + '</span>';
                        }
                        return txt;
                    }
                },
                CodeUrl: {
                    title: 'Mã tệp',
                    width: '5%',
                },
                edit: {
                    title: '',
                    width: '1%',
                    sorting: false,
                    display: function (data) {
                        var text = $('<i data-toggle="modal" data-target="#' + Global.Element.Popup + '"  title="Chỉnh sửa thông tin" class="fa fa-pencil-square-o clickable blue"  ></i>');
                        text.click(function () {
                            Get(data.record.Index);
                            $('#pro-file-id').val(data.record.Id)
                            Global.Data.Id = data.record.Id;
                            // $('#pf_iframe').attr('src', "/ProductionFile/Create/" + data.record.Index);
                            //window.location.href = "/ProductionFile/Create/" + data.record.Index;
                        });
                        return text;
                    }
                },
                Delete: {
                    title: '',
                    width: "3%",
                    sorting: false,
                    display: function (data) {
                        if (!data.record.IsApprove) {
                            var text = $('<button title="Xóa" class="jtable-command-button jtable-delete-command-button"><span>Xóa</span></button>');
                            text.click(function () {
                                GlobalCommon.ShowConfirmDialog('Bạn có chắc chắn muốn xóa?', function () {
                                    Delete(data.record.Id);
                                }, function () { }, 'Đồng ý', 'Hủy bỏ', 'Thông báo');
                            });
                            return text;
                        }
                    }
                }
            }
        });
    }

    function ReloadList() {
        $('#' + Global.Element.Jtable).jtable('load', { 'keyword': $('#pro-file-keyword').val() });
    }

    function InitSearchPopup() {
        $('#' + Global.Element.PopupSearch + ' button[pro-file-search]').click(function () {
            ReloadList();
            $('#' + Global.Element.PopupSearch + ' #pro-file-keyword').val('');
        });

        $('#' + Global.Element.PopupSearch + ' button[pro-file-close]').click(function () {
            $("#" + Global.Element.PopupSearch).modal("hide");
            $('#' + Global.Element.PopupSearch + ' #pro-file-keyword').val('');
        });
    }

    function InitPopup() {
        $("#" + Global.Element.Popup).modal({
            keyboard: false,
            show: false
        });

        $('#' + Global.Element.Popup).on('shown.bs.modal', function (e) {
            if ($('#pro-file-id').val() == '0' || $('#pro-file-id').val() == '')
                GetNewCode();
        });

        $(`#${Global.Element.Popup} [pro-file-save]`).click(() => {
            if (CheckValidate())
                Save(false);
        });

        $(`#${Global.Element.Popup} [pro-file-save-approve]`).click(() => {
            if (CheckValidate())
                Save(true);
        });

        $(`#${Global.Element.Popup} [pro-file-cancel]`).click(() => {
            $('#pro-file-id').val(0);
            $('#pro-file-name').val('');
            $('#pro-file-name').prop('disabled', false);
            $('#pro-file-codeurl').html('');
            $('#pro-file-template').val(0);
            $('#pro-file-content-area').empty();
            Global.Data.ControlsArr.length = 0;
            $("#" + Global.Element.Popup).modal("hide");
            $('[bieu-mau-box]').show();

            $(`#${Global.Element.Popup} [pro-file-export]`).hide();
            $(`#${Global.Element.Popup} [pro-file-save],#${Global.Element.Popup} [pro-file-save-approve]`).show();
            Global.Data.isApprove = false;
        });

        $(`#${Global.Element.Popup} [pro-file-export]`).click(() => {
            ExportToWord();
        });
    }

    function CheckValidate() {
        if ($('#pro-file-name').val() == "") {
            GlobalCommon.ShowMessageDialog("Vui lòng nhập tên biểu mẫu.", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        else if ($('#pro-file-template').val() == "") {
            GlobalCommon.ShowMessageDialog("Vui lòng chọn mẫu biểu mẫu.", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        //else if ($('#pf_requirement').val() == "") {
        //    GlobalCommon.ShowMessageDialog("Vui lòng chọn Lô Sản Xuất.", function () { }, "Lỗi Nhập liệu");
        //    return false;
        //}
        //else if ($('#pf_isapproved').prop('checked') && $('#pf_approveduser').val() == "0") {
        //    GlobalCommon.ShowMessageDialog("Vui lòng chọn Người Duyệt.", function () { }, "Lỗi Nhập liệu");
        //    return false;
        //}
        //else if ($('#pf_isapproved').prop('checked') && $('#pf_approveddate').val().trim() == "") {
        //    GlobalCommon.ShowMessageDialog("Vui lòng chọn Ngày Duyệt.", function () { }, "Lỗi Nhập liệu");
        //    return false;
        //}
        return true;
    }

    function Save(isApprove) {
        var productionfileObj = GetData(isApprove);
        $.ajax({
            url: Global.UrlAction.Save,
            type: 'POST',
            data: JSON.stringify({ 'obj': productionfileObj }),
            contentType: 'application/json charset=utf-8',
            beforeSend: function () { $('#loading').show(); },
            success: function (result) {
                $('#loading').hide();
                GlobalCommon.CallbackProcess(result, function () {
                    if (result.Result == "OK") {
                        ReloadList();
                        $(`#${Global.Element.Popup} [pro-file-cancel]`).click();
                    }
                    else
                        GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình xử lý.");
                }, false, Global.Element.PopupSize, true, true, function () {

                    var msg = GlobalCommon.GetErrorMessage(result);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
                });
            }
        });
    }

    function GetData(isApprove) {
        $.each(Global.Data.ControlsArr, function (i, item) {
            switch (item.ControlType) {
                case 1://textbox 
                case 4://select 
                case 5://textarea
                    item.Value = $('#pro-file-content-area #' + item.ControlName + '').val(); break;
                case 2://checkbox
                case 3://radio
                    item.Value = $('#pro-file-content-area #' + item.ControlName + ':checked').val(); break;
            }
            $('#pro-file-content-area #' + item.ControlName + '').change();
        });

        var HTML = $('#pro-file-content-area').html();

        var obj = {
            Id: $('#pro-file-id').val(),
            Name: $('#pro-file-name').val(),
            TemplateFileId: $('#pro-file-template').val(),
            //  RequireId: $('#pf_requirement').val(),
            IsApproved: isApprove,
            //  ApprovedDate: $('#pf_approveddate').val() != null ? $('#pf_approveddate').data("kendoDatePicker").value() : null,
            // ApprovedUser: $('#pf_approveduser').val() == '0' ? null : $('#pf_approveduser').val(),
            Index: Global.Data.Index,
            Content: HTML,
            Controls: Global.Data.ControlsArr
        }
        return obj;
    }

    function Delete(Id) {
        $.ajax({
            url: Global.UrlAction.Delete,
            type: 'POST',
            data: JSON.stringify({ 'Id': Id }),
            contentType: 'application/json charset=utf-8',
            beforeSend: function () { $('#loading').show(); },
            success: function (result) {
                $('#loading').hide();
                GlobalCommon.CallbackProcess(result, function () {
                    if (result.Result == "OK")
                        ReloadList();
                    else
                        GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình xử lý.");
                }, false, Global.Element.PopupSize, true, true, function () {

                    var msg = GlobalCommon.GetErrorMessage(result);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
                });
            }
        });
    }

    function GetContent() {
        $.ajax({
            url: Global.UrlAction.GetContent,
            type: 'POST',
            data: JSON.stringify({ 'Id': $('#pro-file-template').val() }),
            contentType: 'application/json charset=utf-8',
            beforeSend: function () { $('#loading').show(); },
            success: function (result) {
                $('#loading').hide();
                GlobalCommon.CallbackProcess(result, function () {
                    if (result.Data != null) {
                        $('#pro-file-content-area').empty().html(result.Data.Content);
                        if (result.Data.Controls.length > 0) {
                            $.each(result.Data.Controls, function (i, item) {
                                Global.Data.ControlsArr.push({
                                    Id: 0,
                                    ControlName: item.ControlName,
                                    ControlType: item.ControlType,
                                    Value: item.Value,
                                });
                            });
                        }
                        GetEmployeeSelect('nhanvien');
                        GetMaterialSelect('vattu', 0);
                        GetUnitSelect('donvitinh', 'vattu');
                        GetMaterialSelect('sanpham', 0);
                        //GetProductionBatchSelect('losanxuat');
                        RegisterControl();
                        RegisterAddDeleteRowControl();
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
        if ($('#pro-file-content-area input[type="checkbox"]').length > 0) {
            $.each($('#pro-file-content-area  input[type="checkbox"]'), function (i, item) {
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

        if ($('#pro-file-content-area input[type="radio"]').length > 0) {
            $('#pro-file-content-area input[type="radio"]').click(function () {
                var id = $(this).attr('id');
                $('#content-area input[name="' + id + '"]').removeAttr('checked');
                $(this).attr('checked', true);
                $(this).prop('checked', true);
            });
        }

        if ($('#pro-file-content-area input[type="text"]').length > 0) {
            $('#pro-file-content-area :input[type="text"]').change(function () {
                $(this).attr('value', $(this).val());
            });
        }

        if ($('#pro-file-content-area textarea').length > 0) {
            $('#pro-file-content-area textarea').change(function () {
                $(this).html($(this).val());
            });
        }

        if ($('#pro-file-content-area select').length > 0) {
            $('#pro-file-content-area select').change(function () {
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

    function RegisterAddDeleteRowControl() {
        if ($('#pro-file-content-area .btn-add-row').length > 0) {
            $('#pro-file-content-area .btn-add-row').click(function () {
                var tbody = $($(this).parents()[2]);
                var trs = tbody.children();
                var lasttr = trs[trs.length - 2]

                var newRow = $(lasttr.outerHTML);
                var inputs = $(newRow.find('input[type="text"]'));
                if (inputs.length > 0) {
                    $.each(inputs, function (i, item) {
                        var name = $(item).attr('id');
                        name = name + "1";
                        $(item).attr('id', name);
                        $(item).attr('name', name);
                        $(item).attr('value', '');

                        Global.Data.ControlsArr.push({
                            Id: 0,
                            ControlName: name,
                            ControlType: 1,
                            Value: '',
                        });
                    });
                }

                var checkboxs = $(newRow.find('input[type="checkbox"]'));
                if (checkboxs.length > 0) {
                    $.each(checkboxs, function (i, item) {
                        var name = $(item).attr('id');
                        name = name + "1";
                        $(item).attr('id', name);
                        $(item).attr('name', name);


                        Global.Data.ControlsArr.push({
                            Id: 0,
                            ControlName: name,
                            ControlType: 2,
                            Value: null,
                        });
                    });
                }

                var radios = $(newRow.find('input[type="radio"]'));
                if (radios.length > 0) {
                    $.each(radios, function (i, item) {
                        var name = $(item).attr('id');
                        name = name + "1";
                        $(item).attr('id', name);
                        $(item).attr('name', name);

                        Global.Data.ControlsArr.push({
                            Id: 0,
                            ControlName: name,
                            ControlType: 3,
                            Value: null,
                        });
                    });
                }

                var selects = $(newRow.find('select'));
                if (selects.length > 0) {
                    $.each(selects, function (i, item) {
                        var name = $(item).attr('id');
                        name = name + "1";
                        $(item).attr('id', name);
                        $(item).attr('name', name);
                        $(item).val(0);
                        Global.Data.ControlsArr.push({
                            Id: 0,
                            ControlName: name,
                            ControlType: 4,
                            Value: '0',
                        });
                    });
                }

                var textareas = $(newRow.find('textarea'));
                if (textareas.length > 0) {
                    $.each(textareas, function (i, item) {
                        var name = $(item).attr('id');
                        name = name + "1";
                        $(item).attr('id', name);
                        $(item).attr('name', name);
                        $(item).val('');
                        Global.Data.ControlsArr.push({
                            Id: 0,
                            ControlName: name,
                            ControlType: 5,
                            Value: '',
                        });
                    });
                }

                $(newRow[0].outerHTML).insertBefore('.tr-action-row');
                RegisterControl();
            });
        }

        if ($('#pro-file-content-area .btn-delete-last-row').length > 0) {
            $('#pro-file-content-area .btn-delete-last-row').click(function () {
                var tbody = $($(this).parents()[2]);
                var trs = tbody.children();
                if (trs.length > 2) {
                    var lasttr = $(trs[trs.length - 2]);
                    var inputs = $(lasttr.find('input[type="text"]'));
                    console.log(Global.Data.ControlsArr.length);
                    if (inputs.length > 0) {
                        $.each(inputs, function (i, item) {
                            var name = $(item).attr('id');
                            var index = Global.Data.ControlsArr.findIndex(x => x.ControlName == name);
                            Global.Data.ControlsArr.slice(index, 1);
                        });
                    }

                    var checkboxs = $(lasttr.find('input[type="checkbox"]'));
                    if (checkboxs.length > 0) {
                        $.each(checkboxs, function (i, item) {
                            var name = $(item).attr('id');
                            var index = Global.Data.ControlsArr.findIndex(x => x.ControlName == name);
                            Global.Data.ControlsArr.slice(index, 1);
                        });
                    }

                    var radios = $(lasttr.find('input[type="radio"]'));
                    if (radios.length > 0) {
                        $.each(radios, function (i, item) {
                            var name = $(item).attr('id');
                            var index = Global.Data.ControlsArr.findIndex(x => x.ControlName == name);
                            Global.Data.ControlsArr.slice(index, 1);
                        });
                    }

                    var selects = $(lasttr.find('select'));
                    if (selects.length > 0) {
                        $.each(selects, function (i, item) {
                            var name = $(item).attr('id');
                            var index = Global.Data.ControlsArr.findIndex(x => x.ControlName == name);
                            Global.Data.ControlsArr.slice(index, 1);
                        });
                    }

                    var textareas = $(lasttr.find('textarea'));
                    if (textareas.length > 0) {
                        $.each(textareas, function (i, item) {
                            var name = $(item).attr('id');
                            var index = Global.Data.ControlsArr.findIndex(x => x.ControlName == name);
                            Global.Data.ControlsArr.slice(index, 1);
                        });
                    }

                    console.log(Global.Data.ControlsArr.length);
                    $(lasttr).remove();
                }
            });
        }
    }

    function GetNewCode() {
        $.ajax({
            url: '/ProductionFile/GetNewCode',
            type: 'POST',
            contentType: 'application/json',
            beforeSend: function () { $('#loading').show(); },
            success: function (data) {
                $('#loading').hide();
                Global.Data.Index = parseInt(data.Data.Value);
                Global.Data.Code = data.Data.Name;
                var code = `${Global.Data.Code}${Global.Data.Index}`;
                $('#pro-file-codeurl').html(code);
            }
        });
    }

    function Get(index) {
        $.ajax({
            url: Global.UrlAction.Get,
            type: 'POST',
            data: JSON.stringify({ 'index': index }),
            contentType: 'application/json charset=utf-8',
            beforeSend: function () { $('#loading').show(); },
            success: function (result) {
                GlobalCommon.CallbackProcess(result, function () {
                    SetData(result.Data);
                }, false, Global.Element.PopupSize, true, true, function () {
                    $('#loading').hide();
                    var msg = GlobalCommon.GetErrorMessage(result);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
                });
            }
        });
    }

    function SetData(obj) {
        $('#pro-file-id').val(obj.Id);
        $('#pro-file-name').val(obj.Name);
        $('[bieu-mau-box]').hide();
        if (obj.IsApproved) {
            Global.Data.isApprove = true;
        }

        $('#pro-file-content-area').empty().html(obj.Content);
        $('#pro-file-codeurl').html(obj.CodeUrl);
        GetEmployeeSelect('nhanvien');
        GetMaterialSelect('vattu', 0);
        GetUnitSelect('donvitinh', 'vattu');
        GetMaterialSelect('sanpham', 0);
        //GetProductionBatchSelect('losanxuat');
        RegisterControl();
        RegisterAddDeleteRowControl();

        var timer = setInterval(function () {
            if (obj.Controls.length > 0) {
                $.each(obj.Controls, function (i, item) {
                    Global.Data.ControlsArr.push({
                        Id: item.Id,
                        ControlName: item.ControlName,
                        ControlType: item.ControlType,
                        Value: item.Value,
                    });

                    if (item.ControlType == 4)
                        $('#pro-file-content-area #' + item.ControlName).val(item.Value);
                });
            }
            clearInterval(timer);

            if (Global.Data.isApprove) {
                $(`#${Global.Element.Popup} [pro-file-export]`).show();
                $(`#${Global.Element.Popup} [pro-file-save],#${Global.Element.Popup} [pro-file-save-approve]`).hide();
                $('#pro-file-content-area .tr-action-row').remove();
                $('#pro-file-content-area input,#pro-file-content-area select,#pro-file-content-area textarea,#pro-file-name').prop('disabled', true);
            }
            $('#loading').hide();
        }, 3000);
    }


    function ExportToWord() {
        $('#word-content').html($('#pro-file-content-area').html());

        $('#word-content .tr-action-row').remove();
        if (Global.Data.ControlsArr.length > 0) {
            $.each(Global.Data.ControlsArr, function (i, item) {
                //Global.Data.ControlsArr.push({
                //    Id: item.Id,
                //    ControlName: item.ControlName,
                //    ControlType: item.ControlType,
                //    Value: item.Value,
                //});

                if (item.ControlType == 4)
                    $('#word-content #' + item.ControlName).val(item.Value);
            });
        }

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

}
$(document).ready(function () {
    var productionfile = new GPRO.ProductionFile();
    productionfile.Init();
})

