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
GPRO.namespace('ReportJob');
GPRO.ReportJob = function () {
    var Global = {
        UrlAction: {
            Gets: '/ChecklistJob/GetReports',
            Export: '/ChecklistJob/export',
            GetJobDetail: '/CheckListuser/GetJobById',
            GetEmployees: '/user/GetSelectList',
        },
        Element: {
            PopupJob: 'popup-checklist-job'
        },
        Data: {
            EmployeeeArr: [],
            RelatedEmployees: ''
        }
    }
    this.GetGlobal = function () {
        return Global;
    }

    this.GetById = (id) => {
        GetJobDetail(id);
    }

    this.Init = function () {

        // GetWorkshopSelect('report-cutting-workshop');
        //GetProductSelect('report-cutting-product');
        RegisterEvent();
        InitDatePicker();
        InitPopupJob();
        GetEmployees();
    }

    var RegisterEvent = function () {
        $('[re_jemploy]').click(() => { GetEmployees(); });

        $('#report-cutting-workshop').change(function () {
            if ($('#report-cutting-workshop').val() != undefined)
                GetFloorSelect('report-cutting-floor', $('#report-cutting-workshop').val());
        });

        $('#report-cutting-floor').change(function () {
            if ($('#report-cutting-floor').val() != undefined)
                GetLineSelect('report-cutting-line', $('#report-cutting-floor').val());
        });

        $('#report-cutting-line').change(function () {
            if ($('#report-cutting-line').val() != undefined)
                ReloadTable();
        });

        $('#btn-report-job-view').click(function () {
            Gets();
        });

        $('#btn-report-job-excel').click(function () {
            var _from = $("#report-cutting-from").data("kendoDatePicker");
            var _to = $("#report-cutting-to").data("kendoDatePicker");
            if (_from.value && _to.value && $('#report-cutting-floor').val() != undefined)
                window.location.href = Global.UrlAction.Export + `?floorId=${$('#report-cutting-floor').val()}&from=${moment(_from.value()).format('DD/MM/YYYY')}&to=${moment(_to.value()).format('DD/MM/YYYY')}&type=1`;
        });
    }


    function Gets() {
        var _from = $("#report-cutting-from").data("kendoDatePicker");
        var _to = $("#report-cutting-to").data("kendoDatePicker");
        var type = 1;

        //if (_from.value && _to.value && $('#report-job-floor').val() != undefined)
        $.ajax({
            url: Global.UrlAction.Gets,
            type: 'POST',
            //  data: JSON.stringify({ 'floorId': $('#report-cutting-floor').val(), 'from': _from.value(), 'to': _to.value(), 'type': type }),
            data: JSON.stringify({ 'filter': $('#report-job').val() }),
            contentType: 'application/json charset=utf-8',
            beforeSend: function () { $('#loading').show(); },
            success: function (data) {
                $('#loading').hide();

                var _body = $(`#table-report-job tbody `);
                _body.empty();
                if (data.Records.length > 0) {

                    data.Records.map(item => {
                        tr = $(`<tr></tr>`);

                        tr.append(`<td><a style="cursor:pointer" onClick="_GetJob(${item.Id})"> ${item.ProjectName} <i class="fa fa-arrow-right blue"></i> ${item.JobStepName} <i class="fa fa-arrow-right blue"></i> ${item.Name}</a></td>`);
                        tr.append(`<td> ${item.JobContent} </td>`); 
                        tr.append(`<td>${item.EmployName}</td>`);
                        tr.append(`<td>${ddMMyyyyHHmm(item.StartDate)}</td >`);
                        tr.append(`<td>${ddMMyyyyHHmm(item.EndDate)}</td>`);
                        tr.append(`<td>${ddMMyyyyHHmm(item.RealEndDate)}</td>`);
                        tr.append(`<td class="${getStatusCls(item.StatusId, item)}">${item.StatusName}</td>`);

                        _body.append(tr);
                    })

                }

            }
        });
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
    function GetJobDetail(jobId) { 
        $.ajax({
            url: Global.UrlAction.GetJobDetail,
            type: 'POST',
            data: JSON.stringify({ 'jobId': jobId }),
            contentType: 'application/json charset=utf-8',
            beforeSend: function () { $('#loading').show(); },
            success: function (data) {
                $('#loading').hide();
                $("#" + Global.Element.PopupJob).modal("show");
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
}
 
