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
GPRO.namespace('TemplateChecklistEdit');
GPRO.TemplateChecklistEdit = function () {
    var Global = {
        UrlAction: {
            GetLists: '/TemplateChecklist/Gets',
            Save: '/TemplateChecklist/Save',
            Edit: '/TemplateChecklist/Edit',
            Delete: '/TemplateChecklist/Delete',


            GetJobSteps: '/TemplateCL_JobStep/Gets',
            SaveJobStep: '/TemplateCL_JobStep/Save',
            DeleteJobStep: '/TemplateCL_JobStep/Delete',

            GetJobs: '/TemplateCL_Job/Gets',
            SaveJob: '/TemplateCL_Job/Save',
            DeleteJob: '/TemplateCL_Job/Delete',
        },
        Element: {
            Jtable: 'jtable-template-checklist',
            PopupJobStep: 'popup-template-checklist-job-step',
            PopupTableJob: 'popup-template-checklist-table-job',
            JtableJob: 'jtable-template-checklist-job',
            PopupJob: 'popup-template-checklist-job',
            PopupEdit: 'popup-template-checklist-edit'
        },
        Data: {
            IsInsert: true,
            TemplateId: 0,
            JobSteps: [],
            JobStepId: 0,
            Jobs: [],
            ParentJobId: undefined
        }
    }
    this.GetGlobal = function () { return Global; }

    this.GetJobSteps = (templateId) => {
        Global.Data.TemplateId = templateId
        GetJobSteps();
    }

    this.BindJobStep = (id) => { BindJobStep(id); }

    this.DeleteJobStep = (id) => {
        GlobalCommon.ShowConfirmDialog('Bạn có chắc chắn muốn xóa?', function () {
            DeleteJobStep(id);
        }, function () { }, 'Đồng ý', 'Hủy bỏ', 'Thông báo');
    }

    this.reloadTableJob = (id) => {
        $('#' + Global.Element.PopupEdit).modal("hide");
        Global.Data.JobStepId = id;
        var found = Global.Data.JobSteps.filter(x => x.Id == id)[0];
        if (found) {
            $("#" + Global.Element.PopupTableJob + " .modal-title span").html(found.Name); 
            GetJobs();
        }
        else {
            alert('Không tìm thấy thông tin');
        }
    }

    this.AddJob = (id) => {
        if (id == 0) {
            Global.Data.ParentJobId = undefined;
        }
        else
            Global.Data.ParentJobId = id;
        $("#" + Global.Element.PopupJob).modal("show");
    }

    this.EditJob = (id) => {
        var found = Global.Data.Jobs.filter(x => x.Id == id)[0];
        if (found) {
            $('#template-checklist-job-id').val(found.Id);
            $('#template-checklist-job-content').val(found.JobContent);
            $("#template-checklist-job-name").val(found.Name);
            $("#template-checklist-job-index").val(found.JobIndex);
            $("#" + Global.Element.PopupJob).modal("show");
            $("#template-checklist-job-view-report").bootstrapToggle(found.HasViewProductivity?'on':'off')
        }
        else {
            alert('Không tìm thấy thông tin');
        }
    }

    this.DeleteJob = (id) => {
        GlobalCommon.ShowConfirmDialog('Bạn có chắc chắn muốn xóa?', function () {
            DeleteJob(id);
        }, function () { }, 'Đồng ý', 'Hủy bỏ', 'Thông báo');
    }


    this.Init = function () {
        RegisterEvent();
        InitPopupJobStep();

        InitPopupTableJob();
        //InitTableJob();
        InitPopupJob();
    }

    var RegisterEvent = function () {
        //$("#template-checklist-job-view-report").kendoMobileSwitch({
        //    onLabel: "Có",
        //    offLabel: "Không"
        //});

        $("#template-checklist-job-view-report").bootstrapToggle();
    }

    BindJobStep = (id) => {
        var found = Global.Data.JobSteps.filter(x => x.Id == id)[0];
        if (found) {
            $('#template-checklist-job-step-id').val(found.Id);
            $('#template-checklist-job-step-content').val(found.JobStepContent);
            $("#template-checklist-job-step-name").val(found.Name);
            $("#template-checklist-job-step-index").val(found.StepIndex);
        }
        else {
            alert('Không tìm thấy thông tin');
        }
    }

    function GetJobSteps() {
        $.ajax({
            url: Global.UrlAction.GetJobSteps,
            type: 'post',
            data: ko.toJSON({ 'parentId': Global.Data.TemplateId }),
            contentType: 'application/json',
            beforeSend: function () { $('#loading').show(); },
            success: function (result) {
                $('#loading').hide();
                GlobalCommon.CallbackProcess(result, function () {
                    if (result.Result == "OK") {
                        var parentBox = $('[step-job-box]');
                        parentBox.empty();
                        Global.Data.JobSteps.length = 0;
                        var html = '<div>Chưa có bước công việc.</div>';
                        if (result.Records && result.Records.length > 0) {
                            html = '';
                            Global.Data.JobSteps = result.Records;
                            $.each(result.Records, (i, item) => {
                                html += ` 
                                <div class="box-item" >
                                    <div> ${item.StepIndex}</div>
                                    <div>${item.Name}</div>
                                    <div>${item.JobStepContent}</div>
                                    <div class="action">
                                        <i class="fa fa-list" title="Danh sách công việc" onClick="_ReloadTableJob(${item.Id})" data-toggle="modal" data-target="#${Global.Element.PopupTableJob}"> </i>
                                        <i class="fa fa-edit" title="Cập nhật thông tin bước công việc" onClick="BindJobStep(${item.Id})" data-toggle="modal" data-target="#${Global.Element.PopupJobStep}"> </i>
                                        <i class="fa fa-trash" title="Xóa bước công việc" onClick="DeleteJobStep(${item.Id})"  > </i>
                                    </div>
                                </div>`;
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

    function InitPopupJobStep() {
        $("#" + Global.Element.PopupJobStep).modal({
            keyboard: false,
            show: false
        });

        $('#' + Global.Element.PopupJobStep).on('shown.bs.modal', function () {
            $('div.divParent').attr('currentPoppup', Global.Element.PopupJobStep.toUpperCase());
        });

        $("#" + Global.Element.PopupJobStep + ' button[template-checklist-job-step-save]').click(function () {
            if (ValidateJobStep()) {
                SaveJobStep();
            }
        });

        $("#" + Global.Element.PopupJobStepPopup + ' button[template-checklist-job-step-cancel]').click(function () {
            $("#" + Global.Element.PopupJobStep).modal("hide");
            $('#template-checklist-job-step-id').val('0');
            $('#template-checklist-job-step-content').val('');
            $("#template-checklist-job-step-name").val('');
            $("#template-checklist-job-step-index").val(1);
        });
    }

    function SaveJobStep() {
        var obj = {
            TemplateId: Global.Data.TemplateId,
            Id: $('#template-checklist-job-step-id').val(),
            StepIndex: $('#template-checklist-job-step-index').val(),
            Name: $('#template-checklist-job-step-name').val(),
            JobStepContent: $('#template-checklist-job-step-content').val(),
        }

        $.ajax({
            url: Global.UrlAction.SaveJobStep,
            type: 'post',
            data: ko.toJSON(obj),
            contentType: 'application/json',
            beforeSend: function () { $('#loading').show(); },
            success: function (result) {
                $('#loading').hide();
                GlobalCommon.CallbackProcess(result, function () {
                    if (result.Result == "OK") {
                        //ReloadList();
                        $('#template-checklist-job-step-id').val('0');
                        $('#template-checklist-job-step-content').val('');
                        $("#template-checklist-job-step-index").val('1');
                        $("#template-checklist-job-step-name").val('');
                        //if (!Global.Data.IsInsert) {
                        $("#" + Global.Element.PopupJobStep + ' button[template-checklist-job-step-cancel]').click();
                        //    $('div.divParent').attr('currentPoppup', '');
                        //}
                        //Global.Data.IsInsert = true;
                        GetJobSteps();
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

    function ValidateJobStep() {
        if ($('#template-checklist-job-step-index').val().trim() == "") {
            GlobalCommon.ShowMessageDialog("Vui lòng nhập số thứ tự bước công việc.", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        if ($('#template-checklist-job-step-name').val().trim() == "") {
            GlobalCommon.ShowMessageDialog("Vui lòng nhập Tên bước công việc.", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        return true;
    }

    function DeleteJobStep(_id) {
        $.ajax({
            url: Global.UrlAction.DeleteJobStep,
            type: 'POST',
            data: JSON.stringify({ 'Id': _id }),
            contentType: 'application/json charset=utf-8',
            beforeSend: function () { $('#loading').show(); },
            success: function (data) {
                $('#loading').hide();
                GlobalCommon.CallbackProcess(data, function () {
                    if (data.Result == "OK") {
                        GetJobSteps();
                    }
                    else
                        GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình xử lý.");
                }, false, Global.Element.Popup, true, true, function () {

                    var msg = GlobalCommon.GetErrorMessage(data);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
                });
            }
        });
    }


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
            $('div.divParent').attr('currentPoppup', Global.Element.PopupTableJob.toUpperCase());
        });

        $("#" + Global.Element.PopupJob + ' button[template-checklist-job-save]').click(function () {
            SaveJob();
        });

        $("#" + Global.Element.PopupJob + ' button[template-checklist-job-cancel]').click(function () {
            $("#" + Global.Element.PopupJob).modal("hide");
            ResetJobForm();
        });
    }

    SaveJob = () => {
        $("#template-checklist-job-view-report").bootstrapToggle()
        var obj = {
            Template_JobStepId: Global.Data.JobStepId,
            ParentId: Global.Data.ParentJobId,
            Id: $('#template-checklist-job-id').val(),
            JobIndex: $('#template-checklist-job-index').val(),
            Name: $('#template-checklist-job-name').val(),
            JobContent: $('#template-checklist-job-content').val(),
            HasViewProductivity: $("#template-checklist-job-view-report").prop('checked') ,
        }

        $.ajax({
            url: Global.UrlAction.SaveJob,
            type: 'post',
            data: ko.toJSON(obj),
            contentType: 'application/json',
            beforeSend: function () { $('#loading').show(); },
            success: function (result) {
                $('#loading').hide();
                GlobalCommon.CallbackProcess(result, function () {
                    if (result.Result == "OK") {
                        //ReloadTableJob();
                        $('#template-checklist-job-id').val('0');
                        $('#template-checklist-job-content').val('');
                        $("#template-checklist-job-index").val('1');
                        $("#template-checklist-job-name").val('');
                        //if (!Global.Data.IsInsert) {
                        $("#" + Global.Element.PopupJob + ' button[template-checklist-job-cancel]').click();
                        //    $('div.divParent').attr('currentPoppup', '');
                        //}
                        //Global.Data.IsInsert = true;
                        GetJobs();
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

    DeleteJob = (_id) => {
        $.ajax({
            url: Global.UrlAction.DeleteJob,
            type: 'POST',
            data: JSON.stringify({ 'Id': _id }),
            contentType: 'application/json charset=utf-8',
            beforeSend: function () { $('#loading').show(); },
            success: function (data) {
                $('#loading').hide();
                GlobalCommon.CallbackProcess(data, function () {
                    if (data.Result == "OK") {
                        GetJobs();
                    }
                    else
                        GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình xử lý.");
                }, false, Global.Element.Popup, true, true, function () {

                    var msg = GlobalCommon.GetErrorMessage(data);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
                });
            }
        });
    }

    GetJobs = () => {
        var parentBox = $('[table-jobs]');
        parentBox.empty();
        Global.Data.Jobs.length = 0;
        $.ajax({
            url: Global.UrlAction.GetJobs,
            type: 'post',
            data: ko.toJSON({ 'parentId': Global.Data.JobStepId }),
            contentType: 'application/json',
            beforeSend: function () { $('#loading').show(); },
            success: function (result) {
                $('#loading').hide();
                GlobalCommon.CallbackProcess(result, function () {
                    if (result.Result == "OK") {
                        var html = `<div class="div-item" style="color:blue; font-weight:600"><i class="fa fa-server"></i> ${$('[group-name]').html()} <div class="div-item-action"><i class="fa fa-plus" onClick="JobAction(0,1)"></i></div></div>`;
                        if (result.Records && result.Records.length > 0) {
                            Global.Data.Jobs = result.Records;
                            $.each(result.Records, (i, item) => {
                                html += ` 
                                    <div class="div-item"><i class="fa fa-space"></i><i class="fa fa-caret-right"></i> ${item.Name} <div class="div-item-action"><i class="fa fa-plus" onClick="JobAction(${item.Id},1)"></i> <i class="fa fa-edit"  onClick="JobAction(${item.Id},2)"></i> <i class="fa fa-trash"  onClick="JobAction(${item.Id},3)"></i></div></div>
                                    `;
                                if (item.SubItems && item.SubItems.length > 0) {
                                    html = DrawSubItems(html, item.SubItems, '<i class="fa fa-space"></i><i class="fa fa-space"></i>')
                                }
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

    ResetJobForm = () => {
        Global.Data.ParentJobId = undefined;
        $('#template-checklist-job-id').val(0);
        $('#template-checklist-job-content').val('');
        $("#template-checklist-job-name").val('');
        $("#template-checklist-job-index").val('');
        $("#template-checklist-job-view-report").prop("checked", false).change();  
    }

    DrawSubItems = (html, items, dotted) => {
        $.each(items, (i, item) => {
            Global.Data.Jobs.push(item);
            html += ` 
                                    <div class="div-item">${(dotted + '<i class="fa fa-caret-right"></i>')} ${item.Name} <div class="div-item-action"><i class="fa fa-plus" onClick="JobAction(${item.Id},1)"></i> <i class="fa fa-edit"  onClick="JobAction(${item.Id},2)"></i> <i class="fa fa-trash"  onClick="JobAction(${item.Id},3)"></i></div></div>
                                    `;
            if (item.SubItems && item.SubItems.length > 0) {
                html = DrawSubItems(html, item.SubItems, (dotted + '<i class="fa fa-space"></i>'))
            }
        });
        return html;
    }



    InitSearchPopup = () => {
        $('#' + Global.Element.Search).on('shown.bs.modal', function () {
            $('div.divParent').attr('currentPoppup', Global.Element.Search.toUpperCase());
        });

        $('[template-checklist-close]').click(function () {
            $('#template-checklist-keyword').val('');
            $('div.divParent').attr('currentPoppup', '');
        });

        $('[template-checklist-search]').click(function () {
            ReloadList();
            $('#template-checklist-keyword').val('');
            $('[template-checklist-close]').click();
        });
    }

}


