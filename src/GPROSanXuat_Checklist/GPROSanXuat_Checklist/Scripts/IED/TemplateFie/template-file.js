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
            GetList: '/TemplateFile/Gets',
            GetById: '/TemplateFile/GetById',
            Save: '/TemplateFile/Save',
            Delete: '/TemplateFile/Delete'
        },
        Element: {
            Jtable: 'jtable-template-file',
            PopupSearch: 'popup-search-template-file',
            Popup: 'popup-template-file',
        },
        Data: {
            TeamplateFile: {},
            Id: 0,
            Index: 0,
            Code: '',
            ControlArr: [],
            tempType: $('#jtable-template-file').attr('templateType'),
            tempTypeId: $('#jtable-template-file').attr('tempTypeId')
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
        GetEmployeeSelect('template-file-approved-user');
        //  InitDatePicker();
    }

    var RegisterEvent = function () {
        $('#' + Global.Element.Popup).on('shown.bs.modal', function (e) {
            if (Global.Data.Id == 0)
                $('#template-file-iframe').attr('src', "/TemplateFile/Create/0");
        });

        $('#template-file-iframe').load(function () {
            var iframe = $('#template-file-iframe').contents();
            iframe.find("#tf_btnBack").click(function () {
                $("#" + Global.Element.Popup).modal('hide');
                Global.Data.Id = 0;
                ReloadList();
            });
        });

        $('#' + Global.Element.Popup + ' button[template-file-close]').click(function () {
            Global.Data.Id = 0;
            //ReloadList();
        });
    }

    /**********************************************************************************************************************
                                                            TemplateFile
    ***********************************************************************************************************************/

    function InitList() {
        $('#' + Global.Element.Jtable).jtable({
            title: 'Danh sách mẫu biểu mẫu',
            paging: true,
            pageSize: 10,
            pageSizeChange: true,
            sorting: true,
            selectShow: false,
            actions: {
                listAction: Global.UrlAction.GetList, 
                createAction: Global.Element.Popup, 
            },
            messages: {
                addNewRecord: 'Thêm mới',  
            },
            searchInput: {
                id: 'keyword',
                className: 'search-input',
                placeHolder: 'Nhập từ khóa ...',
                keyup: function (evt) {
                    if (evt.keyCode == 13)
                        ReloadList();
                }
            },
            fields: {
                Id: {
                    key: true,
                    create: false,
                    edit: false,
                    list: false
                },
                Index: {
                    title: "Mã Biểu Mẫu",
                    width: "7%",
                    display: function (data) {
                        return '<span>' + data.record.Code + '</span>';
                    }
                },
                Name: {
                    visibility: 'fixed',
                    title: "Tên Biểu Mẫu",
                    width: "20%",
                },
                IsApprove: {
                    title: 'TT Duyệt',
                    width: '3%',
                    display: function (data) {
                        var txt = '';
                        if (data.record.IsApprove)
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
                            txt = '<span class="red  ">' + data.record.ApproveUserName + '</span>';
                        }
                        return txt;
                    }
                },
                //Note: {
                //    title: "Ghi Chú",
                //    width: "20%",
                //    sorting: false
                //},
                edit: {
                    title: '',
                    width: '1%',
                    sorting: false,
                    display: function (data) {
                        var text = $('<i data-toggle="modal" data-target="#' + Global.Element.Popup + '"  title="Chỉnh sửa thông tin" class="fa fa-pencil-square-o clickable blue"  ></i>');
                        text.click(function () {
                            Global.Data.Id = data.record.Id;
                            Global.Data.Index = data.record.Index;
                            //window.open('/TemplateFile/Create/' + data.record.Id ); // mở sang 1 tab khác
                            //window.location.href = "/TemplateFile/Create/" + data.record.Id;
                            // $('#template-file-iframe').attr('src', "/TemplateFile/Create/" + data.record.Id);
                            getById(data.record.Id);
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
        $('#' + Global.Element.Jtable).jtable('load', { 'type': Global.Data.tempType, 'keyword': $('#keyword').val() });
    }

    function InitSearchPopup() {
        $('#' + Global.Element.PopupSearch + ' button[template-file-search]').click(function () {
            ReloadList();
            $('#' + Global.Element.PopupSearch + ' #template-file-keyword').val('');
        });

        $('#' + Global.Element.PopupSearch + ' button[template-file-close]').click(function () {
            $("#" + Global.Element.PopupSearch).modal("hide");
            $('#' + Global.Element.PopupSearch + ' #template-file-keyword').val('');
        });
    }

    function InitPopup() {
        $("#" + Global.Element.Popup).modal({ keyboard: false, show: false });

        $('#' + Global.Element.Popup).on('shown.bs.modal', function () {
            $('div.divParent').attr('currentPoppup', Global.Element.Popup.toUpperCase());
            if ($('#template-file-id').val() == '' || $('#template-file-id').val() == '0') {
                GetLastIndex();
                var inter = setInterval(function () { $('#tf_index').val(Global.Data.Code + (Global.Data.LastIndex + 1)); clearInterval(inter); }, 1000);
            }
        });

        $('[template-file-save]').click(function () {
            if (CheckValidate()) {
                Save(false);
            }
        });

        $('[template-file-approve]').click(function () {
            if (CheckValidate()) {
                Save(true);
            }
        });

        $('[template-file-cancel]').click(() => {
            $("#" + Global.Element.Popup).modal("hide");

            $('#template-file-id').val(0);
            $('#template-file-name').val('');
            $('#template-file-note').val('');
            //$('#template-file-approve').prop('checked', false).change();
            //$('#template-file-approved-date').data("kendoDatePicker").value(null);
            //$('#template-file-approved-user').val(0);
            CKEDITOR.instances.templateFileEditor.setData('');
            $('.modal-footer [template-file-save],.modal-footer [template-file-approve]').show();
        });

        //$('#template-file-approve').change(function () {
        //    var datepicker = $("#template-file-approved-date").data("kendoDatePicker");
        //    if (!$('#template-file-approve').prop('checked')) {
        //        $('#template-file-approved-user').attr('disabled', true);
        //        datepicker.enable(false);
        //    }
        //    else {
        //        $('#template-file-approved-user').attr('disabled', false);
        //        datepicker.enable(true);
        //    }
        //});

        //$('[re_employee]').click(function () {
        //    GetEmployeeSelect('template-file-approved-user');
        //});
    }

    function Delete(Id) {
        $.ajax({
            url: Global.UrlAction.Delete,
            type: 'POST',
            data: JSON.stringify({ 'Id': Id }),
            contentType: 'application/json charset=utf-8',
            success: function (result) {
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

    getById = (Id) => {
        $.ajax({
            url: Global.UrlAction.GetById,
            type: 'POST',
            data: JSON.stringify({ 'Id': Id }),
            contentType: 'application/json charset=utf-8',
            beforeSend: function () { $('#loading').show(); },
            success: function (result) {
                $('#loading').hide();
                GlobalCommon.CallbackProcess(result, function () {
                    if (result.Result == "OK")
                        if (result.Data) {
                            $('#template-file-id').val(result.Data.Id);
                            $('#template-file-code').val(result.Data.Code);
                            $('#template-file-name').val(result.Data.Name);
                            //$('#template-file-approve').prop('checked', result.Data.IsApprove).change();
                            //$('#template-file-approved-user').val((result.Data.ApprovedUser != null ? result.Data.ApprovedUser : 0));
                            //$('#template-file-approved-date').data("kendoDatePicker").value((result.Data.ApprovedDate != null ? new Date(moment(result.Data.ApprovedDate)) : null));
                            $('#template-file-note').val(result.Data.Note);
                            CKEDITOR.instances.templateFileEditor.setData(result.Data.Content);
                            if (result.Data.IsApprove)
                                $('.modal-footer [template-file-save],.modal-footer [template-file-approve]').hide();
                        }
                        else
                            GlobalCommon.ShowMessageDialog(msg, function () { }, "Lỗi Not Found");
                    else
                        GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình xử lý.");
                }, false, Global.Element.PopupSize, true, true, function () {

                    var msg = GlobalCommon.GetErrorMessage(result);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
                });
            }
        });
    }

    GetLastIndex = () => {
        $.ajax({
            url: '/TemplateFile/GetLastIndex',
            type: 'POST',
            contentType: 'application/json',
            beforeSend: function () { $('#loading').show(); },
            success: function (data) {
                $('#loading').hide();
                Global.Data.LastIndex = parseInt(data.Records);
                Global.Data.Code = data.Data;
                $('#template-file-code').val(Global.Data.Code + (Global.Data.LastIndex + 1));
            }
        });
    }

    //function InitDatePicker() {
    //    $('#template-file-approved-date').kendoDatePicker({
    //        format: 'dd/MM/yyyy',
    //    });
    //}

    function Save(isApprove) {
        var templatefileObj = GetData(isApprove);
        $.ajax({
            url: Global.UrlAction.Save,
            type: 'POST',
            data: JSON.stringify({ 'obj': templatefileObj }),
            contentType: 'application/json charset=utf-8',
            beforeSend: function () { $('#loading').show(); },
            success: function (result) {
                $('#loading').hide();
                GlobalCommon.CallbackProcess(result, function () {
                    if (result.Result == "OK")
                        $('[template-file-cancel]').click();
                    else
                        GlobalCommon.ShowMessageDialog(msg, function () { }, "Lỗi");
                }, false, Global.Element.PopupSize, true, true, function () {
                    var msg = GlobalCommon.GetErrorMessage(result);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
                });
            }
        });
    }

    function GetData(isApprove) {
        var html = CKEDITOR.instances.templateFileEditor.getData();
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

        var index = Global.Data.Index;
        if ($('#template-file-id').val() == '0') // neu la them moi
            index += 1;

        var obj = {
            Id: $('#template-file-id').val(),
            //Code: $('#code').val(),
            Name: $('#template-file-name').val(),
            Index: index,
            Note: $('#template-file-note').val(),
            IsApprove: isApprove,
            // ApprovedDate: $('#template-file-approved-date').data("kendoDatePicker").value(),
            // ApprovedUser: $('#template-file-approved-user').val(),
            Content: html,
            Controls: Global.Data.ControlArr,
            TemplateFileTypeId: Global.Data.tempTypeId
        }
        return obj;
    }

    function CheckValidate() {
        if ($('#template-file-name').val() == "") {
            GlobalCommon.ShowMessageDialog("Vui lòng nhập Tên Biểu Mẫu.", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        else if ($('#template-file-approve').prop('checked') && $('#template-file-approved-user').val() == "0") {
            GlobalCommon.ShowMessageDialog("Vui lòng chọn Người Duyệt.", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        else if ($('#template-file-approve').prop('checked') && $('#template-file-approved-date').val().trim() == "") {
            GlobalCommon.ShowMessageDialog("Vui lòng chọn Ngày Duyệt.", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        return true;
    }
}
$(document).ready(function () {
    if (CKEDITOR.env.ie && CKEDITOR.env.version < 9)
        CKEDITOR.tools.enableHtml5Elements(document);
    CKEDITOR.config.height = 450;
    CKEDITOR.config.width = 'auto';

    var obj = new GPRO.TemplateFile();
    obj.Init();
    CKEDITOR.replace('templateFileEditor');
})

