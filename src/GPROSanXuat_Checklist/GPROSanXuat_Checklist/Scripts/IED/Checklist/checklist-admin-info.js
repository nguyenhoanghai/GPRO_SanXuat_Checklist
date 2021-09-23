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
GPRO.namespace('ChecklistAdminInfo');
GPRO.ChecklistAdminInfo = function () {
    var Global = {
        UrlAction: {
            Get: '/Checklist/GetById',
            GetEmployees: '/user/GetSelectList',
            UpdateJobStep: '/ChecklistJobStep/AdminUpdate',
            //Delete: '/Checklist/Delete',
            GetJobs: '/ChecklistJob/GetByParentId',
            UpdateJob: '/ChecklistJob/AdminUpdate',
            GetJobDetail: '/CheckListuser/GetJobById',
            SaveAttach: '/CheckListuser/SaveAttach',
            DeleteAttach: '/CheckListuser/DeleteAttach',
            UpdateStatus: '/ChecklistJob/donejob',
        },
        Element: {
            PopupJobStep: 'popup-checklist-job-step',

            PopupTableJob: 'popup-checklist-table-job',
            PopupJob: 'popup-checklist-job'
        },
        Data: {
            Id: 0,
            JobStepId: 0,
            Checklist: {},
            JobSteps: [],
            Jobs: [],
            EmployeeeArr: [],
            RelatedEmployees: ''
        }
    }
    this.GetGlobal = function () {
        return Global;
    }
    this.BindJobStep = (id) => { BindJobStep(id); }

    this.reloadTableJob = (id) => {
        Global.Data.JobStepId = id;
        var found = Global.Data.JobSteps.filter(x => x.Id == id)[0];
        if (found) {
            $("#" + Global.Element.PopupTableJob + " .modal-title span").html(found.Name);
            GetJobs(found.Id);
        }
        else {
            alert('Không tìm thấy thông tin');
        }
    }

    this.EditJob = (id) => {
        BindJob(id);
    }

    this.Init = function () {
        //RegisterEvent();
        //InitTablePO();
        //InitTableProduct();
        ////ReloadTable();
        InitPopupTableJob();
        InitPopupJob();
        //InitPopupProduct();
        ////InitPopupChecklistType();
        ////InitSearchPopupChecklistType();
        //GetChecklistTemplateSelect('checklist-template-select');
        //GetStatusSelect('checklist-status');
        //GetLineSelect('checklist-line', 1);
        GetById();
        InitDatePicker();
        InitPopupJobStep();
        // GetEmployees();
        RegisterEvent();
    }

    var RegisterEvent = function () {
        $('[re-checklist-type]').click(() => { GetChecklistTypeSelect('checklist-type-select') });
        $('[re_jemploy]').click(() => { GetEmployees(); });

        $('#p-btn-file-upload').click(() => {
            $('#p-file-upload').click();
        });

        $('#p-file-upload').change(function () {
            if (this.files && this.files[0]) {
                UpFile(this.files[0].name);
            }
        });
    }

    function UpFile(fileName) {
        var form = $('#p-form-upload')[0];
        var dataString = new FormData(form);
        $.ajax({
            type: "POST",
            url: '/Upload/Single',
            data: dataString,
            cache: false,
            contentType: false,
            processData: false,
            success: function (data) {
                SaveAttachFile(fileName, data)
            }
        });
    }

    function SaveAttachFile(fileName, filePath) {
        $.ajax({
            url: Global.UrlAction.SaveAttach,
            type: 'POST',
            data: JSON.stringify({ 'jobId': $('#checklist-job-id').val(), 'name': fileName, 'code': filePath, 'note': '' }),
            contentType: 'application/json charset=utf-8',
            beforeSend: function () { $('#loading').show(); },
            success: function (data) {
                $('#loading').hide();
                GlobalCommon.CallbackProcess(data, function () {
                    if (data.Result == "OK") {
                        $('#p-file-upload').val('');
                        GetJobDetail($('#checklist-job-id').val());
                    }
                    else
                        GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình sử lý.");
                }, false, Global.Element.PopupCheckList, true, true, function () {

                    var msg = GlobalCommon.GetErrorMessage(data);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
                });
            }
        });
    }

    GetById = () => {
        $.ajax({
            url: Global.UrlAction.Get,
            type: 'POST',
            data: JSON.stringify({ 'Id': Global.Data.Id, 'isFull': true }),
            contentType: 'application/json charset=utf-8',
            success: function (data) {
                if (data.Result == "OK") {
                    var table = $('.table-checklist tbody');
                    table.empty();
                    var str = '<tr><td colspan="12" style="text-align:center">Không có dữ liệu </tr></td>';
                    var obj = JSON.parse(data.Records);
                    Global.Data.Checklist = obj;

                    $('.checklist-filter-box').html(`Thông tin checklist <span class="red">${obj.Name}</span>`)
                    if (obj) {
                        str = `<tr>
                                    <td> </td>
                                    <td> </td>
                                    <td> </td>
                                    <td>${getText(obj.CustomerName)   }</td >
                                    <td>${getText(obj.ProductName)}</td>
                                    <td>${obj.Productivity}</td>
                                    <td>${obj.ProductionDays}</td>
                                    <td><span class="bold red">${obj.Quantities}</span> ${getText(obj.ProductUnit)}</td>
                                    <td>${DDMMYYYY(obj.DeliveryDate)}</td>
                                    <td>${DDMMYYYY(obj.InputDate)}</td>
                                    <td class="${getStatusCls(obj.StatusId, obj)}" >${obj.StatusName}</td> 
                                </tr>`;
                        $('#span-pro-unit').html(obj.ProductUnit);
                        var parentBox = $('[step-job-box]');
                        parentBox.empty();
                        Global.Data.JobSteps.length = 0;
                        var html = '<div>Chưa có bước công việc.</div>';
                        if (obj.JobSteps && obj.JobSteps.length > 0) {
                            html = '';
                            Global.Data.JobSteps = obj.JobSteps;
                            $.each(obj.JobSteps, (i, item) => {
                                html += ` 
                                <div class="box-item" >
                                    <div class="index-col"><div>${item.StepIndex}</div><div >
                                        <i class="fa fa-list" title="Danh sách công việc" onClick="_ReloadTableJob(${item.Id})" data-toggle="modal" data-target="#${Global.Element.PopupTableJob}"> </i>
                                        <i class="fa fa-edit red" title="Cập nhật thông tin bước công việc" onClick="BindJobStep(${item.Id})" data-toggle="modal" data-target="#${Global.Element.PopupJobStep}"> </i>
                                     </div></div>
                                    <div>${item.Name}</div>
                                    <div>${item.JobStepContent}</div>
                                    <div class="info-col">                                        
                                        <div class="col">
                                            <div>Bắt đầu</div>
                                            <div>Start date</div>
                                            <div>${DDMMYYYY(item.StartDate)}</div>
                                        </div>
                                        <div class="col">
                                            <div>KH Nhận</div>
                                            <div>Receive date</div>
                                            <div>${DDMMYYYY(item.EndDate)}</div>
                                        </div>
                                       
                                    </div> 
                                    <div class="col">
                                            <div>Cập nhật</div>
                                            <div>Update date</div>
                                            <div class="${getStatusCls(item.StatusId, item)}">${DDMMYYYY_hhmm(item.UpdatedDate)}</div>
                                        </div>
                                </div>`;
                            });
                        }
                        parentBox.append(html);
                    }
                    table.append(str);
                    Global.Data.RelatedEmployees = obj.RelatedEmployees;
                    GetEmployees();
                }
                else
                    GlobalCommon.ShowMessageDialog('Lỗi', function () { }, "Đã có lỗi xảy ra trong quá trình xử lý.");
            }
        });
    }

    getText = (value) => {
        if (value) return value;
        return '...';
    }

    DDMMYYYY = (value) => {
        if (value) {
            var date = moment(value);
            return `<span class="red ">${date.format('DD/MM/YYYY')} </span>`;
        }
        return '...';
    }

    DDMMYYYY_hhmm = (value) => {
        if (value) {
            var date = moment(value)
            return `<span class="red ">${date.format('DD/MM/YYYY, hh:mm A')}</span>`;
        }
        return '...';
    }

    getStatusCls = (statusId, obj) => {
        var cls = '';
        switch (statusId) {
            case 1: cls = 'not-yet'; break;
            case 2:
            case 3: cls = 'doing'; break;
            case 4: cls = 'error'; break;
            case 5: cls = 'done'; break;
        }

        if (statusId == 5 && obj.EndDate) {
            var end = moment(obj.EndDate);
            if (obj.RealEndDate) {
                var realEnd = moment(obj.RealEndDate);
                if (realEnd.isAfter(end))
                    cls = 'done-tre';
            }
        }
        return cls;
    }

    InitDatePicker = () => {
        $("#checklist-job-step-start").kendoDateTimePicker({
            format: "dd/MM/yyyy hh:mm tt",
            change: function () {
                var value = this.value();
                var endDateInput = $("#checklist-job-step-end").data("kendoDateTimePicker");
                var reminderInput = $("#checklist-job-step-reminder").data("kendoDateTimePicker");
                endDateInput.min(value);
                reminderInput.min(value);
            }
        });

        $("#checklist-job-step-end").kendoDateTimePicker({
            format: "dd/MM/yyyy hh:mm tt",
            change: function () {
                var value = this.value();
                var startDateInput = $("#checklist-job-step-start").data("kendoDateTimePicker");
                var reminderInput = $("#checklist-job-step-reminder").data("kendoDateTimePicker");
                startDateInput.max(value);
                reminderInput.max(value);
            }
        });

        $("#checklist-job-step-reminder, #checklist-job-reminder").kendoDateTimePicker({
            format: "dd/MM/yyyy hh:mm tt",
        });

        $("#checklist-job-start").kendoDateTimePicker({
            format: "dd/MM/yyyy hh:mm tt",
            change: function () {
                var value = this.value();
                var endDateInput = $("#checklist-job-end").data("kendoDateTimePicker");
                var reminderInput = $("#checklist-job-reminder").data("kendoDateTimePicker");
                endDateInput.min(value);
                reminderInput.min(value);
            }
        });

        $("#checklist-job-end").kendoDateTimePicker({
            format: "dd/MM/yyyy hh:mm tt",
            change: function () {
                var value = this.value();
                var startDateInput = $("#checklist-job-start").data("kendoDateTimePicker");
                var reminderInput = $("#checklist-job-reminder").data("kendoDateTimePicker");
                startDateInput.max(value);
                reminderInput.max(value);
            }
        });
    }

    GetEmployees = () => {
        $.ajax({
            url: Global.UrlAction.GetEmployees,
            type: 'POST',
            data: JSON.stringify({ 'userIds': Global.Data.RelatedEmployees }),
            contentType: 'application/json charset=utf-8',
            beforeSend: function () { $('#loading').show(); },
            success: function (data) {
                $('#loading').hide();
                GlobalCommon.CallbackProcess(data, function () {
                    if (data.Result == "OK") {
                        var option = '';
                        var option2 = '';
                        if (data.Records != null && data.Records.length > 0) {
                            $.each(data.Records, function (i, item) {
                                if (i > 0) {
                                    Global.Data.EmployeeeArr.push(item);
                                    option += '<option value="' + item.Data2 + '" /> ';
                                    option2 += '<option value="' + item.Value + '"><div style="height:100px">' + item.Data2 + '</div></option> ';
                                }
                            });
                        }

                        var multiselect = $("#checklist-job-step-related-employee,#checklist-job-related-employee").data("kendoMultiSelect");
                        if (multiselect) {
                            //'multiselect exists - destroying and recreating'
                            $('#checklist-job-step-related-employee,#checklist-job-related-employee').data('kendoMultiSelect').destroy();
                            $('#checklist-job-step-related-employee,#checklist-job-related-employee').unwrap('.k-multiselect').show().empty();
                            $(".k-multiselect-wrap").remove(); 
                        }

                        $('#checklist-job-step-employee,#checklist-job-employee').empty().append(option2);

                        $('#checklist-job-step-related-employee,#checklist-job-related-employee').empty().append(option2);
                        $('#checklist-job-step-related-employee,#checklist-job-related-employee').kendoMultiSelect();
                        //.data("kendoMultiSelect");
                       // var multiselect = $('#checklist-job-step-related-employee,#checklist-job-related-employee').data("kendoMultiSelect");

                       // multiselect.refresh();

                    }
                    else
                        GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình xử lý.");
                }, false, Global.Element.PopupOrderAnalys, true, true, function () {

                    var msg = GlobalCommon.GetErrorMessage(data);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
                });
            }
        });
    }

    //#region Job step
    InitPopupJobStep = () => {
        $("#" + Global.Element.PopupJobStep).modal({
            keyboard: false,
            show: false
        });

        $('#' + Global.Element.PopupJobStep).on('shown.bs.modal', function () {
            $('div.divParent').attr('currentPoppup', Global.Element.PopupJobStep.toUpperCase());
        });

        $("#" + Global.Element.PopupJobStep + ' button[checklist-job-step-save]').click(function () {
            if (ValidateJobStep()) {
                SaveJobStep();
            }
        });

        $("#" + Global.Element.PopupJobStepPopup + ' button[checklist-job-step-cancel]').click(function () {
            $("#" + Global.Element.PopupJobStep).modal("hide");
            $('#checklist-job-step-id').val('0');
            $('#checklist-job-step-content').val('');
            $("#checklist-job-step-name").val('');
            $("#checklist-job-step-index").val(1);
        });
    }

    SaveJobStep = () => {
        var obj = {
            Id: $('#checklist-job-step-id').val(),
            StepIndex: $('#checklist-job-step-index').html(),
            Name: $('#checklist-job-step-name').val(),
            JobStepContent: $('#checklist-job-step-content').val(),

            StartDate: $('#checklist-job-step-start').data("kendoDateTimePicker").value(),
            EndDate: $('#checklist-job-step-end').data("kendoDateTimePicker").value(),
            ReminderDate: $('#checklist-job-step-reminder').data("kendoDateTimePicker").value(),
            EmployeeId: $('#checklist-job-step-employee').val(),
            RelatedEmployees: $('#checklist-job-step-related-employee').data("kendoMultiSelect").value().toString(),
            Note: $('#checklist-job-step-note').val(),
            Quantities: $('#checklist-job-step-quantities').val(),
        }

        $.ajax({
            url: Global.UrlAction.UpdateJobStep,
            type: 'post',
            data: ko.toJSON(obj),
            contentType: 'application/json',
            beforeSend: function () { $('#loading').show(); },
            success: function (result) {
                $('#loading').hide();
                GlobalCommon.CallbackProcess(result, function () {
                    if (result.Result == "OK") {
                        GetById();
                        $("#" + Global.Element.PopupJobStep + ' button[checklist-job-step-cancel]').click();
                    }
                    else
                        GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình xử lý.");
                }, false, Global.Element.PopupModule, true, true, function () {
                    var msg = GlobalCommon.GetErrorMessage(result);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình xử lý.");
                });
            }
        });
    }

    ValidateJobStep = () => {
        //if ($('#checklist-job-step-index').val().trim() == "") {
        //    GlobalCommon.ShowMessageDialog("Vui lòng nhập số thứ tự bước công việc.", function () { }, "Lỗi Nhập liệu");
        //    return false;
        //}
        //if ($('#checklist-job-step-name').val().trim() == "") {
        //    GlobalCommon.ShowMessageDialog("Vui lòng nhập Tên bước công việc.", function () { }, "Lỗi Nhập liệu");
        //    return false;
        //}
        return true;
    }

    BindJobStep = (id) => {
        var found = Global.Data.JobSteps.filter(x => x.Id == id)[0];
        if (found) {
            $('#checklist-job-step-id').val(found.Id);
            $('#checklist-job-step-content').val(found.JobStepContent);
            $("#checklist-job-step-name").val(found.Name);
            $("#checklist-job-step-index").html(found.StepIndex);

            $("#checklist-job-step-employee").val(found.EmployeeId);
            $("#checklist-job-step-quantities").val(found.Quantities);
            $("#checklist-job-step-note").val(found.Note);

            if (found.RelatedEmployees)
                $('#checklist-job-step-related-employee').data("kendoMultiSelect").value(JSON.parse('[' + found.RelatedEmployees + ']'));
            else
                $('#checklist-job-step-related-employee').data("kendoMultiSelect").value("");

            var startDateInput = $("#checklist-job-step-start").data("kendoDateTimePicker");
            var endDateInput = $("#checklist-job-step-end").data("kendoDateTimePicker");
            var reminderInput = $("#checklist-job-step-reminder").data("kendoDateTimePicker");
            var _startDate = undefined;
            var _endDate = undefined;
            var _reminderDate = undefined;
            if (found.StartDate) {
                _startDate = new Date(moment(found.StartDate));
                startDateInput.value(kendo.toString(_startDate, 'dd/MM/yyyy hh:mm tt'));
                endDateInput.min(kendo.toString(_startDate, 'dd/MM/yyyy hh:mm tt'));
                reminderInput.min(kendo.toString(_startDate, 'dd/MM/yyyy hh:mm tt'));
            }

            if (found.EndDate) {
                _endDate = new Date(moment(found.EndDate));
                endDateInput.value(kendo.toString(_endDate, 'dd/MM/yyyy hh:mm tt'));
                startDateInput.max(kendo.toString(_endDate, 'dd/MM/yyyy hh:mm tt'));
                reminderInput.max(kendo.toString(_endDate, 'dd/MM/yyyy hh:mm tt'));
            }

            if (found.ReminderDate) {
                _reminderDate = new Date(moment(found.ReminderDate));
                reminderInput.value(kendo.toString(_reminderDate, 'dd/MM/yyyy hh:mm tt'));
            }
            startDateInput.trigger("change");
            endDateInput.trigger("change");
            reminderInput.trigger("change");
        }
        else {
            alert('Không tìm thấy thông tin');
        }
    }
    //#endregion

    //#region Job
    InitPopupTableJob = () => {
        $("#" + Global.Element.PopupTableJob).modal({
            keyboard: false,
            show: false
        });

        $('#' + Global.Element.PopupTableJob).on('shown.bs.modal', function () {
            $('div.divParent').attr('currentPoppup', Global.Element.PopupTableJob.toUpperCase());

        });

        $("#" + Global.Element.PopupTableJob + ' button[template-checklist-table-job-cancel]').click(function () {
            $("#" + Global.Element.PopupTableJob).modal("hide");
            $('#' + Global.Element.PopupEdit).modal("show");
        });
    }

    InitPopupJob = () => {
        $("#" + Global.Element.PopupJob).modal({
            keyboard: false,
            show: false
        });

        $('#' + Global.Element.PopupJob).on('shown.bs.modal', function () {
            $("#" + Global.Element.PopupTableJob).modal("hide");
            $('div.divParent').attr('currentPoppup', Global.Element.PopupJob.toUpperCase());
        });

        $("#" + Global.Element.PopupJob + ' button[checklist-job-save]').click(function () {
            SaveJob();
        });

        $("#" + Global.Element.PopupJob + ' button[checklist-job-cancel]').click(function () {
            $("#" + Global.Element.PopupJob).modal("hide");
            $("#" + Global.Element.PopupTableJob).modal("show");
            // ResetJobForm();
        });

        $('[checklist-done]').click(() => {
            DoneJob();
        })
    }

    GetJobs = (_jobStepId) => {
        var parentBox = $('[checklist-table-jobs]');
        parentBox.empty();
        Global.Data.Jobs.length = 0;
        $.ajax({
            url: Global.UrlAction.GetJobs,
            type: 'post',
            data: ko.toJSON({ 'parentId': _jobStepId }),
            contentType: 'application/json',
            beforeSend: function () { $('#loading').show(); },
            success: function (result) {
                $('#loading').hide();
                GlobalCommon.CallbackProcess(result, function () {
                    if (result.Result == "OK") {
                        var html = `<div class="div-item" style="color:blue; font-weight:600"><i class="fa fa-server"></i> ${$('[group-name]').html()} <div class="div-item-action"> </div></div>`;
                        if (result.Records && result.Records.length > 0) {
                            // Global.Data.Jobs = result.Records;
                            Global.Data.Jobs.length = 0;
                            $.each(result.Records, (i, item) => {
                                html += `<div style="cursor:pointer" class="div-item ${getStatusCls(item.StatusId, item)}" onClick="JobAction(${item.Id},2)">
                                            <i class="fa fa-space"></i><i class="fa fa-caret-right"></i>
                                            <b>${item.Name}</b> - Phụ trách: <b>${getText(item.EmployeeName)}</b> - Bắt đầu: <b>${DDMMYYYY_hhmm(item.StartDate)}</b> - Kết thúc: <b>${DDMMYYYY_hhmm(item.EndDate)}</b>
                                         </div >`;
                                html = DrawSubItems(html, item.SubItems, '<i class="fa fa-space"></i><i class="fa fa-space"></i>')
                                Global.Data.Jobs.push(item);
                            });
                        }
                        parentBox.append(html);
                    }
                    else
                        GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình xử lý.");
                }, false, Global.Element.PopupModule, true, true, function () {
                    var msg = GlobalCommon.GetErrorMessage(result);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình xử lý.");
                });
            }
        });
    }

    DrawSubItems = (html, items, dotted) => {
        $.each(items, (i, item) => {
            html += `<div style="cursor:pointer" class="div-item ${getStatusCls(item.StatusId, item)}" onClick="JobAction(${item.Id},2)">${(dotted + '<i class="fa fa-caret-right"></i>')} 
                        <b>${item.Name}</b> - Phụ trách: <b>${getText(item.EmployeeName)}</b> - Bắt đầu: <b>${DDMMYYYY_hhmm(item.StartDate)}</b> - Kết thúc: <b>${DDMMYYYY_hhmm(item.EndDate)}</b>
                     </div>`;
            if (item.SubItems && item.SubItems.length > 0) {
                html = DrawSubItems(html, item.SubItems, (dotted + '<i class="fa fa-space"></i>'))
            }
            Global.Data.Jobs.push(item);
        });
        return html;
    }

    BindJob = (id) => {
        //var found = Global.Data.Jobs.filter(x => x.Id == id)[0];
        //if (found) {
        //    $('#checklist-job-id').val(found.Id);
        //    $('#checklist-job-content').val(found.JobContent);
        //    $("#checklist-job-name").val(found.Name);
        //    $("#checklist-job-index").html(found.JobIndex);

        //    $("#checklist-job-employee").val(found.EmployeeId);
        //    $("#checklist-job-quantities").val(found.Quantities);
        //    $("#checklist-job-note").val(found.Note);

        //    if (found.RelatedEmployees)
        //        $('#checklist-job-related-employee').data("kendoMultiSelect").value(JSON.parse('[' + found.RelatedEmployees + ']'));
        //    else
        //        $('#checklist-job-related-employee').data("kendoMultiSelect").value("");

        //    var startDateInput = $("#checklist-job-start").data("kendoDateTimePicker");
        //    var endDateInput = $("#checklist-job-end").data("kendoDateTimePicker");
        //    var reminderInput = $("#checklist-job-reminder").data("kendoDateTimePicker");
        //    var _startDate = undefined;
        //    var _endDate = undefined;
        //    var _reminderDate = undefined;
        //    if (found.StartDate) {
        //        _startDate = new Date(moment(found.StartDate));
        //        startDateInput.value(kendo.toString(_startDate, 'dd/MM/yyyy hh:mm tt'));
        //        endDateInput.min(kendo.toString(_startDate, 'dd/MM/yyyy hh:mm tt'));
        //        reminderInput.min(kendo.toString(_startDate, 'dd/MM/yyyy hh:mm tt'));
        //    }

        //    if (found.EndDate) {
        //        _endDate = new Date(moment(found.EndDate));
        //        endDateInput.value(kendo.toString(_endDate, 'dd/MM/yyyy hh:mm tt'));
        //        startDateInput.max(kendo.toString(_endDate, 'dd/MM/yyyy hh:mm tt'));
        //        reminderInput.max(kendo.toString(_endDate, 'dd/MM/yyyy hh:mm tt'));
        //    }

        //    if (found.ReminderDate) {
        //        _reminderDate = new Date(moment(found.ReminderDate));
        //        reminderInput.value(kendo.toString(_reminderDate, 'dd/MM/yyyy hh:mm tt'));
        //    }
        //    startDateInput.trigger("change");
        //    endDateInput.trigger("change");
        //    reminderInput.trigger("change");
        //    $("#" + Global.Element.PopupJob).modal("show");
        //}
        //else {
        //    alert('Không tìm thấy thông tin');
        //}

        GetJobDetail(id);
    }

    SaveJob = () => {
        var obj = {
            Id: $('#checklist-job-id').val(),
            JobIndex: $('#checklist-job-index').html(),
            Name: $('#checklist-job-name').val(),
            JobContent: $('#checklist-job-content').val(),

            StartDate: $('#checklist-job-start').data("kendoDateTimePicker").value(),
            EndDate: $('#checklist-job-end').data("kendoDateTimePicker").value(),
            ReminderDate: $('#checklist-job-reminder').data("kendoDateTimePicker").value(),
            EmployeeId: $('#checklist-job-employee').val(),
            RelatedEmployees: $('#checklist-job-related-employee').data("kendoMultiSelect").value().toString(),
            Note: $('#checklist-job-note').val(),
            Quantities: $('#checklist-job-quantities').val(),
        }

        $.ajax({
            url: Global.UrlAction.UpdateJob,
            type: 'post',
            data: ko.toJSON(obj),
            contentType: 'application/json',
            beforeSend: function () { $('#loading').show(); },
            success: function (result) {
                $('#loading').hide();
                GlobalCommon.CallbackProcess(result, function () {
                    if (result.Result == "OK") {
                        GetJobs(Global.Data.JobStepId);
                        $("#" + Global.Element.PopupJob + ' button[checklist-job-cancel]').click();
                    }
                    else
                        GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình xử lý.");
                }, false, Global.Element.PopupModule, true, true, function () {
                    var msg = GlobalCommon.GetErrorMessage(result);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình xử lý.");
                });
            }
        });
    }

    function GetJobDetail(jobId) {
        $.ajax({
            url: Global.UrlAction.GetJobDetail,
            type: 'POST',
            data: JSON.stringify({ 'jobId': jobId }),
            contentType: 'application/json charset=utf-8',
            beforeSend: function () { $('#loading').show(); },
            success: function (data) {
                $('#loading').hide();
                GlobalCommon.CallbackProcess(data, function () {
                    if (data.Result == "OK") {
                        $('#checklist-job-id').val(data.Data.Id);
                        $('#checklist-job-content').val(data.Data.JobContent);
                        $("#checklist-job-name").val(data.Data.Name);
                        $("#checklist-job-index").html(data.Data.JobIndex);

                        $("#checklist-job-employee").val(data.Data.EmployeeId);
                        $("#checklist-job-quantities").val(data.Data.Quantities);
                        $("#checklist-job-note").val(data.Data.Note);

                        if (data.Data.RelatedEmployees)
                            $('#checklist-job-related-employee').data("kendoMultiSelect").value(JSON.parse('[' + data.Data.RelatedEmployees + ']'));
                        else
                            $('#checklist-job-related-employee').data("kendoMultiSelect").value("");

                        var startDateInput = $("#checklist-job-start").data("kendoDateTimePicker");
                        var endDateInput = $("#checklist-job-end").data("kendoDateTimePicker");
                        var reminderInput = $("#checklist-job-reminder").data("kendoDateTimePicker");
                        var _startDate = undefined;
                        var _endDate = undefined;
                        var _reminderDate = undefined;
                        if (data.Data.StartDate) {
                            _startDate = new Date(moment(data.Data.StartDate));
                            startDateInput.value(kendo.toString(_startDate, 'dd/MM/yyyy hh:mm tt'));
                            endDateInput.min(kendo.toString(_startDate, 'dd/MM/yyyy hh:mm tt'));
                            reminderInput.min(kendo.toString(_startDate, 'dd/MM/yyyy hh:mm tt'));
                        }

                        if (data.Data.EndDate) {
                            _endDate = new Date(moment(data.Data.EndDate));
                            endDateInput.value(kendo.toString(_endDate, 'dd/MM/yyyy hh:mm tt'));
                            startDateInput.max(kendo.toString(_endDate, 'dd/MM/yyyy hh:mm tt'));
                            reminderInput.max(kendo.toString(_endDate, 'dd/MM/yyyy hh:mm tt'));
                        }

                        if (data.Data.ReminderDate) {
                            _reminderDate = new Date(moment(data.Data.ReminderDate));
                            reminderInput.value(kendo.toString(_reminderDate, 'dd/MM/yyyy hh:mm tt'));
                        }
                        startDateInput.trigger("change");
                        endDateInput.trigger("change");
                        reminderInput.trigger("change");
                        $("#" + Global.Element.PopupJob).modal("show");



                        //$('#jobId').val(data.Data.Id);
                        //$('#jobName').html(data.Data.Name); //jobId
                        //$('#jobGroupName').html(data.Data.JobGroupName);
                        //$('#statusName').html(data.Data.StatusName);
                        //$('#jobRequired').html(data.Data.JobContent);
                        //$('#employeeName').attr('src', data.Data.EmployIcon);
                        ////  $('#employeeName').attr('srcset', data.Data.Icon);
                        //$('#employeeName').attr('alt', data.Data.EmployName);
                        //$('#employeeName').attr('title', data.Data.EmployName);
                        //$('#currentUser').attr('src', data.Data.CurrentUserIcon);
                        //// $('#currentUser').attr('srcset', data.Data.CurrentUserIcon);
                        //$('#currentUser').attr('alt', data.Data.CurrentUserName);
                        //$('#currentUser').attr('title', data.Data.CurrentUserName);

                        var str = '';
                        if (data.Data.Comments.length > 0) {
                            $.each(data.Data.Comments, function (i, item) {
                                var d = new Date(parseJsonDateToDate(item.CreatedDate));
                                if (item.CType == 2) {
                                    str += '<div class="phenom mod-other-type">';
                                    str += '<div class="phenom-creator">';
                                    str += '<div class="member js-show-mem-menu" idmember="57b13868ed15d816f0d4ffb0">';
                                    str += '<img class="member-avatar"  src="' + item.Icon + '" srcset="' + item.Icon + '" alt="' + item.UserName + '" title="' + item.UserName + ')"> ';
                                    str += '</div>';
                                    str += '</div>';
                                    str += '<div class="phenom-desc">';
                                    str += item.Comment;
                                    str += '</div>';
                                    str += '<p class="phenom-meta quiet">';
                                    str += '<a class="date js-hide-on-sending js-highlight-link" dt="2017-02-23T03:41:50.105Z" href="#" title="' + ParseDateToString(d) + '">' + ParseDateToString_cl(d) + '</a>';
                                    str += '</p>';
                                    str += '</div>';
                                }
                                else {
                                    str += '<div class="phenom mod-comment-type">';
                                    str += '    <div class="phenom-creator">';
                                    str += '        <div class="member js-show-mem-menu" idmember="57b13868ed15d816f0d4ffb0">';
                                    str += '            <img class="member-avatar"  src="' + item.Icon + '" srcset="' + item.Icon + '" alt="' + item.UserName + '" title="' + item.UserName + ')"> ';
                                    str += '        </div>';
                                    str += '    </div>';
                                    str += '    <div class="phenom-desc">';
                                    str += '        <span class="inline-member js-show-mem-menu" idmember="57b13868ed15d816f0d4ffb0"><span class="u-font-weight-bold">' + item.UserName + '</span>' + (item.Type == 2 ? ' <span class="red">đã phát một thông báo lỗi phát sinh</span>' : '') + '</span> ';
                                    str += '        <div class="comment-container">';
                                    str += '            <div class="action-comment markeddown js-comment" dir="auto">';
                                    str += '                <div class="current-comment js-friendly-links js-open-card">';
                                    str += '                    <p>' + item.Comment + '</p>';
                                    str += '                </div>';
                                    str += '                <div class="comment-box">';
                                    str += '                    <textarea class="comment-box-input js-text" tabindex="1" placeholder="" style="">' + item.Comment + '</textarea>';
                                    str += '                    <div class="comment-box-options">';
                                    str += '                        <a class="comment-box-options-item js-comment-add-attachment" href="#" title="Thêm tập tin đính kèm..."><span class="icon-sm icon-attachment"></span></a>';
                                    str += '                        <a class="comment-box-options-item js-comment-mention-member" href="#" title="Đề cập một thành viên..."><span class="icon-sm icon-mention"></span></a>';
                                    str += '                        <a class="comment-box-options-item js-comment-add-emoji" href="#" title="Thêm biểu tượng cảm xúc..."><span class="icon-sm icon-emoji"></span></a>';
                                    str += '                        <a class="comment-box-options-item js-comment-add-card" href="#" title="Thêm thẻ..."><span class="icon-sm icon-card"></span></a>';
                                    str += '                    </div>';
                                    str += '                </div>';
                                    str += '            </div>';
                                    str += '        </div>';
                                    str += '    </div>';
                                    str += '    <p class="phenom-meta quiet">';
                                    str += '        <a class="date js-hide-on-sending js-highlight-link" dt="2017-02-23T03:41:50.105Z" href="#" title="' + ParseDateToString(d) + '">' + ParseDateToString_cl(d) + '</a>';
                                    //if (data.Data.CurrentUserId == item.CreatedUser && !item.IsErrorLog && item.Status == 0)
                                    //    str += '        <span class="js-hide-on-sending"> - <a class="js-edit-action" href="#">Chỉnh sửa</a> - <a class="js-confirm-delete-action" href="#">Xoá</a></span>';
                                    //else if (data.Data.CurrentUserId == item.CreatedUser && item.IsErrorLog && item.UserProcessId == 0 && item.Status == 0)
                                    //    str += '        <span class="js-hide-on-sending"><a class="js-confirm-delete-action" href="#">Xoá</a></span>';
                                    if (data.Data.CurrentUserId != item.CreatedUser && item.UserProcessId == 0 && item.IsErrorLog && item.Status == 0)
                                        str += '        <span class="js-hide-on-sending"> - <a class="js-edit-action " onclick="hideModal(' + item.JobErrId + ');" data-toggle="modal" data-target="#modal_Error_process">Tiếp nhận xử lý lỗi</a></span>';
                                    else if (item.UserProcessId != 0 && data.Data.CurrentUserId == item.UserProcessId && item.Status == 0)
                                        str += '        <span class="js-hide-on-sending"> - <a class="js-edit-action " onclick="hideModal(' + item.JobErrId + ');" data-toggle="modal" data-target="#modal_Error_result">Trả kết quả xử lý lỗi</a></span>';

                                    str += '    </p>';
                                    str += '</div>';
                                }
                            });
                        }
                        $('#actionList').empty().html(str);

                        str = '';
                        if (data.Data.Attachs.length > 0) {
                            $.each(data.Data.Attachs, function (i, item) {
                                var d = new Date(parseJsonDateToDate(item.CreatedDate));
                                str += '<div class="attachment-thumbnail">';
                                str += '    <span class="attachment-thumbnail-preview js-open-viewer" href="#" target="_blank" title="' + item.Name + '" style=""><span class="fa fa-file blue"> </span></span>';
                                str += '    <p class="attachment-thumbnail-details js-open-viewer">';
                                str += '        <span class="attachment-thumbnail-details-title js-attachment-thumbnail-details" href=" " title="' + item.Name + '" target="_blank">' + item.Name + '';
                                str += '           <span class="u-block quiet">' + item.UserName + ' đã thêm <span class="date" title="' + ParseDateToString(d) + '">' + ParseDateToString_cl(d) + '</span></span>';
                                str += '        </span>';
                                str += '        <span class="quiet attachment-thumbnail-details-options">';
                                str += '            <a class="attachment-thumbnail-details-options-item dark-hover js-download" href="' + (item.Url) + '" target="_blank" >';
                                str += '                <span class="fa fa-eye"></span><span class="attachment-thumbnail-details-options-item-text js-direct-link">Xem</span>';
                                str += '            </a>';
                                str += '            <a class="attachment-thumbnail-details-options-item attachment-thumbnail-details-options-item-delete dark-hover js-confirm-delete" onclick="deleteAtt(' + item.Id + ')">';
                                str += '                <span class="fa fa-trash"></span> <span class="attachment-thumbnail-details-options-item-text">Xoá</span>';
                                str += '            </a>';
                                str += '        </span>';
                                str += '    </p>';
                                str += '</div>';
                            });
                        }
                        $('.js-attachment-list').empty().html(str);
                    }
                    else
                        GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình sử lý.");
                }, false, Global.Element.PopupCheckList, true, true, function () {

                    var msg = GlobalCommon.GetErrorMessage(data);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
                });
            }
        });
    }

    function DoneJob() {
        $.ajax({
            url: Global.UrlAction.UpdateStatus,
            type: 'POST',
            data: JSON.stringify({ 'jobId': $('#checklist-job-id').val() }),
            contentType: 'application/json charset=utf-8',
            beforeSend: function () { $('#loading').show(); },
            success: function (data) {
                $('#loading').hide();
                if (data.Result == 'NOPERMISSION') {
                    GlobalCommon.ShowMessageDialog(data.ErrorMessages[0].Message, function () {
                        GetJobs();
                    }, "Lỗi");
                }
                else if (data.Result == "ERROR")
                    GlobalCommon.ShowMessageDialog(data.ErrorMessages[0].Message, function () { }, "Đã có lỗi xảy ra trong quá trình sử lý.");
                else {
                    GetJobs(Global.Data.JobStepId);
                    $("#" + Global.Element.PopupJob + ' button[checklist-job-cancel]').click();
                }
            }
        });
    }
    //#endregion
}

