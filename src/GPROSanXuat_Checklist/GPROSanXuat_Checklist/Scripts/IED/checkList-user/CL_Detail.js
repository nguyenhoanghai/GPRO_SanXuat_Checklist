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
GPRO.namespace('CL_Detail');
GPRO.CL_Detail = function () {
    var Global = {
        UrlAction: {
            GetOrgan: '/CheckList/GetOrganization',
            SaveOrgan: '/CheckList/SaveOrgan',
            DeleteOrgan: '/CheckList/DeleteOrgan',
            GetParentJob: '/ProjectAnalys/GetParentJob',
            GetLastIndex: '/ProjectAnalys/GetLastIndex',

            GetJobDetailsAndERefernceByPM_JobId: '/ProjectAnalys/GetJobDetailsAndERefernceByPM_JobId',
            ApproveJobResult: '/ProjectAnalys/ApproveJobResult',

            ChangeJobStatusFromOnCreateToProcessing: '/ProjectAnalys/ChangeJobStatusFromOnCreateToProcessing',
            UserSendErrorMessage: '/ProjectAnalys/UserSendErrorMessage',

            GetDataForJob: '/DataCenter/GetDataForJob',
            GetOrganSelectList: '/ProjectAnalys/GetOrganSelectList',
            GetSuggest: '/ProjectAnalys/GetSuggestModel',

            GetAllEmployee: '/ProjectAnalys/GetAllEmployee',

            GetJobGroupById: '/ProjectAnalys/GetPMJobGroupById',
            SaveJobGroup: '/ProjectAnalys/SavePM_JobGroup',
            DeleteJobGroup: '/ProjectAnalys/DeletePM_JobGroup',

            GetJobSelectList: '/Job/GetJobSelectList',
            GetJob: '/ProjectAnalys/GetPM_Jobs',
            SaveJob: '/ProjectAnalys/SavePM_Job',
            DeleteJob: '/ProjectAnalys/DeletePM_Job',

            UpdateJob: '/ProjectAnalys/UpdatePM_JobResults',

            GetlistProRequire: '/CheckList/GetlistProRequire',
            SaveProRequire: '/CheckList/SaveProRequire',
            DeleteProRequire: '/CheckList/DeleteProRequire',
        },
        Element: {
            Popup_Create_Organ: 'Create_Organ_popup',
            jtableJobGroup: 'jtable_JobGroup',
            Popup_Create_JobGroup: 'Create_JobGroup_popup',
            Popup_Create_Job: 'Create_Job_popup',
            Update_Job_popup: 'Update_Job_popup',

            Jtable_JobDetail: 'Jtable_JobDetail',
            Jtable_EReference: 'Jtable_EReference',

            Popup_Approve_Job: 'Approve_Job_popup',

            Jtable_JHistory: 'jtable_JobHistory',

            Jtable_JobErr: 'pm_jobErr',
            JobErr_popup: 'JobErr_popup',

            jtableProRequire: 'jtable_ProRequire',
            Popup_Create_ProRequire: 'popup_Create_ProRequire'
        },
        Data: {
            EmployeeeArr: [],
            JobErrArr: [],
            JobDetailArr: [],
            JobEReferenceArr: [],
            IsE_ReferenceChange: false,
            IsDetailChange: false,
            IsSaveAndFinishWork: false,
            IsErrChange: false,
            Organs: [],
            OrganId: 0,
            IsAdmin: false,
            IsUseIED: false,
            CompanyId: 0,
            RelationCompanyId: '',
            day: 0,
            month: 0,
            year: 0,
            OrganStart: null,
            OrganEnd: null,
            CL_OrganId: 0,
            JobErr_OrganId: 0,
            JGroupStatusId: 0,
            JGroupPercent: 0,
            JobGroupId: 0,
            LastIndex: 0,
            ProductTime: 0,
            workingTime: 8,
            Labours: 0,
            EditQuantity: 0,
            Quantity: 0,
            AllQuantity: 0,
            unit: '',
            OrderDetailId: 0,
            ProTimeStart: null,
            ProTimeEnd: null
        }
    }
    this.GetGlobal = function () {
        return Global;
    }

    this.Init = function () {
        $('#jtable_JobGroup,#jtable_ProRequire').hide();
        var now = new Date();
        GetOrganSelectList();
        GetAllEmployee();
        Global.Data.dd = now.getDate();
        Global.Data.mm = now.getMonth();
        Global.Data.yy = now.getFullYear();
        RegisterEvent();
        InitDate();
        GetOrgan();
        InitPopupCreateOrgan();
        InitPopupCreateJobGroup();
        InitListJobGroup();
        InitPopupProRequire();
        GetJobSelect('job', 0);
        InitPopupCreateJob();
        InitListEmployeeReference();
        InitListJobDetail();
        InitPopupJobErr();
        InitListJobError();
        GetParentJob();

        InitListProRequire();
        GetLineSelect('prore_line');

    }

    var RegisterEvent = function () {
        $('#tab_Error').click(function () { ReloadListJobErr(); });

        $('#tab_ERefer').click(function () {
            if (Global.Data.JobEReferenceArr.length == 0)
                AddEmployeeReferenceEmptyObject();
            ReloadListEmployeeReference();
        });

        $('[add_detail]').click(function () { SaveJobDetail(); });
        $('[btnSuggest]').click(function () {
            $('#box_suggest').hide();
            GetSuggest($('[job]').val(), Global.Data.CommoId, new Date(), false);
            $('#' + Global.Element.Popup_Create_Job).css('z-index', 1040);
        });

        $('[re_status]').click(function () { GetStatusSelect('status'); });
        $('[re_jgroup]').click(function () { GetJobGroupSelect('jobgroup', 0); });
        $('[re_job]').click(function () { GetJobSelect('job', 0); });
        $('[re_partofor]').click(function () { GetPartOfOrganSelectByOrganId('PartOfOrganization', Global.Data.ObjectId, 0); });
        $('[re_jEmploy]').click(function () { GetEmployeeSelectByOrganId('J_employee', Global.Data.ObjectId, 0); });

        $('[suggest]').click(function () {
            $('#start_suggest').attr('dt', $(this).attr('dt'));
            $('#box_suggest').css('display', 'block');
            var dp = $("#start_suggest").data("kendoDateTimePicker");
            dp.value('');
            GlobalCommon.ShowMessageDialog('Vui lòng chọn thời điểm bắt đầu công việc.', function () { $("#start_suggest").focus(); }, "Thông Báo");
        });

        $('[re_owner]').click(function () { GetEmployeeSelectByOrganId('owner', Global.Data.OrganId, 0); });
        $('#IsHasRHomebus').change(function () { $('#RHomebusTitle').attr('disable', true); if ($(this).prop('checked')) $('#RHomebusTitle').attr('disable', false); });
        $('[re_parentjob]').click(function () { GetParentJob(); });
        $('[job]').click(function () { $("#J_start").data("kendoDateTimePicker").trigger("change"); });

        $('[prore_line]').change(function () {
            Global.Data.Labours = parseInt($('[prore_line] option:selected').attr('labour'));
            $('#prore_labour').html($('[prore_line] option:selected').attr('labour'));
            $('#prore_endWork').html($('[prore_line] option:selected').attr('code'));
            $('#prore_hours').val(Global.Data.workingTime); ResetNormsOfDay();
        })
        $('#J_employee').change(function () {
            $('#J_endOld').html($('#J_employee option:selected').attr('code'));
        });


    }

    function InitDate() {
        $("#prore_start").kendoDateTimePicker({
            format: "dd/MM/yyyy hh:mm tt",
            value: new Date(Global.Data.yy, Global.Data.mm, Global.Data.dd),
            change: function () {
                TinhGoiy();
                var value = this.value();
                var dp = $("#prore_end").data("kendoDateTimePicker");
                dp.min(value);

            }
        });

        $("#prore_end").kendoDateTimePicker({
            format: "dd/MM/yyyy hh:mm tt",
            value: new Date(Global.Data.yy, Global.Data.mm, Global.Data.dd),
        });

        $("#J_start").kendoDateTimePicker({
            format: "dd/MM/yyyy hh:mm tt",
            change: function () {
                var value = this.value();
                if (value != null) {
                    var dp = $("#J_end").data("kendoDateTimePicker");
                    dp.min(value);
                    dp = $("#J_reminder").data("kendoDateTimePicker");
                    dp.min(value);
                    if ($('[job]').val() != null && $('[job]').val() != 0 && $("#J_start").val() != '') {
                        var item = $('[job] option:selected');
                        var d = item.attr('day');
                        var h = item.attr('hours');
                        var m = item.attr('minutes');
                        var date = new Date(value);
                        date.addDays(d);
                        date.addHours(h);
                        date.addMinutes(m);
                        $('#J_endGY').html(ParseDateToString(date));
                        $("#J_end").data("kendoDateTimePicker").value(date);
                    }
                    else
                        $('#J_endGY').html('');
                }
            }
        });

        $("#J_end").kendoDateTimePicker({
            format: "dd/MM/yyyy hh:mm tt",
            change: function () {
                if (value != null) {
                    var value = this.value();
                    var dp = $("#J_reminder").data("kendoDateTimePicker");
                    dp.max(value);
                }
            }
        });

        $("#J_reminder").kendoDateTimePicker({
            format: "dd/MM/yyyy hh:mm tt",
        });

        $("#serchTime").kendoDatePicker({
            format: "dd/MM/yyyy ",
            change: function () {
                if (this.value() != null)
                    GetSuggest($('[job]').val(), Global.Data.CommoId, new Date(this.value()), true);
            }
        });

        $("#start_suggest").kendoDateTimePicker({
            format: "dd/MM/yyyy hh:mm tt",
            change: function () {
                var dt = parseInt($("#start_suggest").attr('dt'))
                var value = this.value();
                var cur = new Date(value);
                var endDate = new Date(value);
                endDate.setDate(endDate.getDate() + dt);
                var dp = $("#J_end").data("kendoDateTimePicker");
                var max = dp.max();
                var maxD = new Date(max);
                if (endDate > maxD)
                    GlobalCommon.ShowMessageDialog('Khoảng thời gian bạn vừa chọn không hợp lệ.\nBởi vì Thời gian bắt đầu công việc cộng với số ngày bạn vừa chọn => ngày kết thúc \ncông việc sẽ là ngày :<i class="red">' + (endDate.getDate() + '/' + (endDate.getMonth() + 1) + '/' + endDate.getFullYear()) + '</i> lớn hơn ngày kết thúc của nhóm công việc \nlà ngày : <i class="red">' + (maxD.getDate() + '/' + (maxD.getMonth() + 1) + '/' + maxD.getFullYear()) + '</i>.\nVui lòng kiểm tra lại hoặc thay đổi ngày kết thúc của Nhóm công việc cho phù hợp.', function () { }, "Lỗi Nhập liệu");
                else {
                    GlobalCommon.ShowConfirmDialog('Bạn vừa chọn ngày bắt đầu là :<i class="red">' + (cur.getDate() + '/' + (cur.getMonth() + 1) + '/' + cur.getFullYear()) + '</i> và ngày kết thúc sẽ là :<i class="red">' + (endDate.getDate() + '/' + (endDate.getMonth() + 1) + '/' + endDate.getFullYear()) + '</i>.\n Bạn có chấp nhận gợi ý không ?', function () {
                        dp = $("#J_start").data("kendoDateTimePicker");
                        dp.value(cur);
                        dp = $("#J_end").data("kendoDateTimePicker");
                        dp.value(endDate);
                        $('#Job_history_popup').modal('hide');
                        $('#' + Global.Element.Popup_Create_Job).css('z-index', 1041);
                    }, function () {
                        $('#box_suggest').hide();
                    }, 'Đồng ý', 'Hủy bỏ', 'Thông báo');
                }
            }
        });

        $("#c_start").kendoDateTimePicker({
            format: "dd/MM/yyyy hh:mm tt",
            change: function () {
                var value = this.value();
                if (value != null) {
                    var dp = $("#c_end").data("kendoDateTimePicker");
                    dp.min(value);
                }
            }
        });

        $("#c_end").kendoDateTimePicker({
            format: "dd/MM/yyyy hh:mm tt",
        });

        $("#o_start").kendoDatePicker({
            format: "dd/MM/yyyy",
            change: function () {
                var value = this.value();
                if (value != null) {
                    var dp = $("#o_end").data("kendoDatePicker");
                    dp.min(value);
                }
            }
        });

        $("#o_end").kendoDatePicker({
            format: "dd/MM/yyyy",
        });

        $("#og_start").kendoDateTimePicker({
            format: "dd/MM/yyyy hh:mm tt",
            change: function () {
                var value = this.value();
                if (value != null) {
                    var dp = $("#og_end").data("kendoDateTimePicker");
                    dp.min(value);
                }
            }
        });

        $("#og_end").kendoDateTimePicker({
            format: "dd/MM/yyyy hh:mm tt"
        });


        $("#copy_start").kendoDateTimePicker({
            format: "dd/MM/yyyy hh:mm tt"
        });

        $("#jErr_time1").kendoDateTimePicker({
            format: "dd/MM/yyyy hh:mm tt",
            change: function () {
                var value = this.value();
                if (value != null) {
                    var dp = $("#jErr_time2").data("kendoDateTimePicker");
                    dp.min(value);
                    var dp = $("#jErr_time3").data("kendoDateTimePicker");
                    dp.min(value);
                }
            }
        });

        $("#jErr_time2").kendoDateTimePicker({
            format: "dd/MM/yyyy hh:mm tt",
        });

        $("#jErr_time3").kendoDateTimePicker({
            format: "dd/MM/yyyy hh:mm tt",
        });
    }

    /*----------------------------------------------------------------------------------------------------------------*/
    /*-------------------------------------------        ORGANIZATION       ------------------------------------------*/
    /*----------------------------------------------------------------------------------------------------------------*/
    function InitPopupCreateOrgan() {
        $("#" + Global.Element.Popup_Create_Organ).modal({
            keyboard: false,
            show: false
        });

        $("#" + Global.Element.Popup_Create_Organ + ' button[save]').click(function () {
            if (Global.Data.OrganId == '0')
                GlobalCommon.ShowMessageDialog("Vui lòng Chọn Phòng Ban.", function () { }, "Lỗi Nhập liệu");
            else if ($('#owner').val() == '0')
                GlobalCommon.ShowMessageDialog("Vui lòng Chọn Người Phụ Trách.", function () { }, "Lỗi Nhập liệu");
            else
                SaveOrgan();
        });

        $("#" + Global.Element.Popup_Create_Organ + ' button[cancel]').click(function () {
            $("#" + Global.Element.Popup_Create_Organ).modal("hide");
            $('#owner').val('0');
            $('#owner').prop('disabled', true);
            $('#Organ_Des').val('');
            Global.Data.OrganId = '0';
            var dropDownContent = '<div style="position: relative; margin-left: 3px; margin-top: 5px;"> - - Chọn Phòng Ban - - </div>';
            $("#dropDownButton").jqxDropDownButton('setContent', dropDownContent);
        });
    }

    function SaveOrgan() {
        var obj = {
            Id: $('#cl_o_Id').val(),
            CL_ProTimeId: $('#ProTimeId').val(),
            OrganId: Global.Data.OrganId,
            EmployeeId: $('#owner').val(),
            StartDate: $("#og_start").data("kendoDateTimePicker").value(),
            EndDate: $("#og_end").data("kendoDateTimePicker").value(),
            RealEnd: null,
            Note: $('#Organ_Des').val(),
        };

        $.ajax({
            url: Global.UrlAction.SaveOrgan,
            type: 'post',
            data: ko.toJSON(obj),
            contentType: 'application/json',
            beforeSend: function () { $('#loading').show(); },
            success: function (result) {
                $('#loading').hide();
                GlobalCommon.CallbackProcess(result, function () {
                    if (result.Result == "OK") {
                        GetOrgan();
                        $("#" + Global.Element.Popup_Create_Organ + ' button[cancel]').click();
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

    function DeleteOrgan(Id) {
        $.ajax({
            url: Global.UrlAction.DeleteOrgan,
            type: 'POST',
            data: JSON.stringify({ 'Id': Id }),
            contentType: 'application/json charset=utf-8',
            beforeSend: function () { $('#loading').show(); },
            success: function (data) {
                $('#loading').hide();
                GlobalCommon.CallbackProcess(data, function () {
                    if (data.Result == "OK")
                        GetOrgan();
                    else
                        GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình xử lý.");
                }, false, Global.Element.PopupOrderAnalys, true, true, function () {
                    var msg = GlobalCommon.GetErrorMessage(data);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
                });
            }
        });
    }

    function GetOrgan() {
        $.ajax({
            url: Global.UrlAction.GetOrgan,
            type: 'POST',
            data: JSON.stringify({ 'ProTimeId': $('#ProTimeId').val() }),
            contentType: 'application/json charset=utf-8',
            success: function (data) {
                GlobalCommon.CallbackProcess(data, function () {
                    if (data.Result == "OK") {
                        $('#des').html('<span>' + data.Data.OrderName + '</span> <i class="fa fa-arrow-right red"></i> <span>' + data.Data.ProName + '</span> <i class="fa fa-arrow-right red"></i> <span>' + data.Data.ProTimeName + '</span>')
                        Global.Data.ProductTime = data.Data.ProductTime;
                        $('#prore_producttime').html(data.Data.ProductTime);
                        $('[unitName]').html(data.Data.UnitName);
                        Global.Data.unit = data.Data.UnitName;
                        $('[prore_productName]').html(data.Data.ProName);
                        Global.Data.Quantity = data.Data.Quantity;

                        var date = new Date(parseJsonDateToDate(data.Data.Start));
                        Global.Data.ProTimeStart = date; 
                        var date1 = new Date(parseJsonDateToDate(data.Data.End));
                        Global.Data.ProTimeEnd = date1;
                        var start = $("#prore_start").data("kendoDateTimePicker");
                        var end = $("#prore_end").data("kendoDateTimePicker");

                     //   start.min(kendo.toString(date, 'dd/MM/yyyy hh:mm tt'));
                        start.min(new Date(date.getFullYear(), date.getMonth(), date.getDate(), 1, 0, 0, 0));
                       // start.value(kendo.toString(date, 'dd/MM/yyyy hh:mm tt'));
                        start.max(kendo.toString(date1, 'dd/MM/yyyy hh:mm tt'));
                       // start.trigger("change");

                        end.value(date1);
                        end.max(kendo.toString(date1, 'dd/MM/yyyy hh:mm tt'));
                        end.trigger("change");
                        DrawTree(data.Data);
                        Global.Data.OrderDetailId = data.Data.ObjectId;
                    }
                    else
                        GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình sử lý.");
                }, false, Global.Element.PopupJob, true, true, function () {
                    var msg = GlobalCommon.GetErrorMessage(data);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
                });
            }
        });
    }

    function DrawTree(objs) {
        $('#jqxTree').jqxTree('clear');
        var data = [];
        data.push({
            'id': 0,
            'parentid': -1,
            'text': '<span style=\'color: red; font-weight:bold; font-size:16px\'>' + objs.ProTimeName + '</span>',
            'value': '0',
            'icon': '/Images/Company.png',
            'iconsize': 14
        });
        var st = $("#og_start").data("kendoDateTimePicker");
        var ed = $("#og_end").data("kendoDateTimePicker");
        var stD = new Date(parseJsonDateToDate(objs.Start));
        var edD = new Date(parseJsonDateToDate(objs.End));
        st.min(stD);
        ed.min(stD);
        st.max(edD);
        ed.max(edD);

        Global.Data.Organs.length = 0;
        $.each(objs.Organs, function (i, item) {
            data.push({
                'id': item.Id,
                'parentid': 0,
                // 'text': '<span style=\'color: red; font-weight:bold; font-size:16px\'>' + objs.ProTimeName + '</span>',
                'text': item.OrganName,
                'value': item.Id,
                'icon': '/Images/Company.png',
                'iconsize': 12
            });
            Global.Data.Organs.push(item);
        });

        var source =
        {
            datatype: "json",
            datafields: [
                { name: 'id' },
                { name: 'parentid' },
                { name: 'text' },
                { name: 'value' },
                { name: 'icon' },
            ],
            id: 'id',
            localdata: data
        };
        // create data adapter.
        var dataAdapter = new $.jqx.dataAdapter(source);
        dataAdapter.dataBind();
        var records = dataAdapter.getRecordsHierarchy('id', 'parentid', 'items', [{ name: 'text', map: 'label' }]);

        // Create jqxTree
        $('#jqxTree').jqxTree({ source: records, width: '100%' });

        ////refresh 
        $('#jqxTree').jqxTree('refresh');
        if (Global.Data.TreeSelectItem != null)
            $('#jqxTree').jqxTree('expandItem', Global.Data.TreeSelectItem);

        var contextMenu = $("#jqxMenu").jqxMenu({ width: '250px', height: '114px', autoOpenPopup: false, mode: 'popup' });
        var clickedItem = null;

        var attachContextMenu = function () {
            // open the context menu when the user presses the mouse right button.
            $("#jqxTree li").on('mousedown', function (event) {
                var target = $(event.target).parents('li:first')[0];

                var rightClick = isRightClick(event);
                if (rightClick && target != null) {
                    $("#jqxTree").jqxTree('selectItem', target);
                    var scrollTop = $(window).scrollTop();
                    var scrollLeft = $(window).scrollLeft();
                    contextMenu.jqxMenu('open', parseInt(event.clientX) + 5 + scrollLeft, parseInt(event.clientY) + 5 + scrollTop);
                    return false;
                }
            });
        }

        attachContextMenu();
        $("#jqxTree").jqxTree('expandItem', $('#0')[0]);
    }

    function isRightClick(event) {
        var rightclick;
        if (!event) var event = window.event;
        if (event.which) rightclick = (event.which == 3);
        else if (event.button) rightclick = (event.button == 2);
        return rightclick;
    }

    $('#jqxTree').on('select', function (event) {
        var args = event.args;
        var selectItem = $('#jqxTree').jqxTree('getItem', args.element);
        Global.Data.CL_OrganId = parseInt(selectItem.id);
        GetLastJobIndex();
        var curObj = null;
        $.each(Global.Data.Organs, function (i, item) {
            if (item.Id == selectItem.id) {
                curObj = item;
                return false;
            }
        });
        if (selectItem.level == 0) {
            $('[type="3a"],#' + Global.Element.jtableJobGroup).hide();
            $('[type="3"],[type="4"],#' + Global.Element.jtableProRequire).show();
            ReloadListProRequire();
        }
        else {
            $('[type="3"],[type="4"],#' + Global.Element.jtableProRequire).hide();
            $('[type="3a"],#' + Global.Element.jtableJobGroup).show();
            ReloadListJobGroup();
        }

        $('#jqxMenu').css('opacity', '1');
        $('#jqxMenu').css('height', '58px');
        Global.Data.OrganId = curObj != null ? curObj.OrganId : 0;
        GetPartOfOrganSelectByOrganId('PartOfOrganization', curObj != null ? curObj.OrganId : 0, 0);
        GetEmployeeSelectByOrganId('owner', curObj != null ? curObj.OrganId : 0, null);
        //   $('#' + Global.Element.JtableOrder).css('display', 'none');
        //   $('#' + Global.Element.jtableJobGroup).css('display', 'block');

        if (curObj != null) {
            Global.Data.OrganStart = curObj.StartDate;
            Global.Data.OrganEnd = curObj.EndDate;
            var startdate = new Date(parseJsonDateToDate(curObj.StartDate));
            var enddate = new Date(parseJsonDateToDate(curObj.EndDate));
            var dp = $("#J_start").data("kendoDateTimePicker");
            dp.min(kendo.toString(startdate, 'dd/MM/yyyy hh:mm tt'));
            dp.max(kendo.toString(enddate, 'dd/MM/yyyy hh:mm tt'));
            dp.value(kendo.toString(startdate, 'dd/MM/yyyy hh:mm tt'));
            dp.trigger("change");

            dp = $("#J_end").data("kendoDateTimePicker");
            dp.min(kendo.toString(startdate, 'dd/MM/yyyy hh:mm tt'));
            dp.max(kendo.toString(enddate, 'dd/MM/yyyy hh:mm tt'));
            dp.value(startdate);
            dp.trigger("change");
        }

        if (!Global.Data.IsAdmin) {
            $('#jqxMenu').css('opacity', '0');
        }
    });

    // disable the default browser's context menu.
    $(document).on('contextmenu', function (e) {
        if ($(e.target).parents('.jqx-tree').length > 0) {
            return false;
        }
        return true;
    });

    $("#jqxMenu").on('itemclick', function (event) {
        var item = $.trim($(event.args).text());
        var selectedItem = $('#jqxTree').jqxTree('selectedItem');
        switch (item) {
            case "Phân công sản xuất":
                $("#jtable_ProRequire").show();
                $("#jtable_JobGroup").hide();

                break;
            case "Tạo Phòng Ban":
                $("#jqxMenu").jqxMenu('close');
                $('#' + Global.Element.Popup_Create_Organ).modal('show');
                break;
            case "Xóa":
                if (selectedItem != null) {
                    GlobalCommon.ShowConfirmDialog('Bạn có chắc chắn muốn xóa?', function () {
                        DeleteOrgan(selectedItem.id);
                    }, function () { }, 'Đồng ý', 'Hủy bỏ', 'Thông báo');
                }
                break;
            case "Xem Thông Tin":
                if (selectedItem != null) {
                    var obj = {};
                    $.each(Global.Data.Organs, function (index, item) {
                        if (item.Id == parseInt(selectedItem.id)) {
                            obj = item;
                            return;
                        }
                    });
                    $('#cl_o_Id').val(obj.Id)
                    Global.Data.Id = obj.Id;
                    var dropDownContent = '<div style="position: relative; margin-left: 3px; margin-top: 5px;">' + obj.OrganName + '</div>';
                    $("#dropDownButton").jqxDropDownButton('setContent', dropDownContent);
                    $('#Organ_Des').val(obj.Note);

                    var startdate = new Date(parseJsonDateToDate(obj.StartDate));
                    var enddate = new Date(parseJsonDateToDate(obj.EndDate));
                    var dp = $("#og_start").data("kendoDateTimePicker");
                    dp.value(startdate);

                    var dp2 = $("#og_end").data("kendoDateTimePicker");
                    dp2.value(enddate);

                    $('#' + Global.Element.Popup_Create_Organ).modal('show');
                    GetEmployeeSelectByOrganId('owner', obj.OrganId, obj.EmployeeId);
                    Global.Data.OrganId = obj.OrganId;
                }
                break;
        }
        if (Global.Data.position != 0)
            Global.Data.height = Global.Data.position;
    });

    function InitPopupApproveJob() {
        $("#" + Global.Element.Popup_Approve_Job).modal({
            keyboard: false,
            show: false
        });

        $("#" + Global.Element.Popup_Approve_Job + ' button[save]').click(function () {
            if ($('#input[name="app"]:checked').val() == '0' && $('#err_msg').val().trim() == '') {
                GlobalCommon.ShowMessageDialog("Vui lòng Nhập Lý Do Bạn không duyệt kết thúc Công Việc.", function () { }, "Lỗi Nhập liệu");
            }
            else {
                ApproveJobResult();
            }
        });

        $("#" + Global.Element.Popup_Approve_Job + ' button[cancel]').click(function () {
            $("#" + Global.Element.Popup_Approve_Job).modal("hide");
            $('input[name="app"][value="true"]').prop('checked', true);
            $('#err_msg').val('');
            $('#box_err').css('display', 'none');
        });
    }

    function ResetJobBox() {
        $('#J_Id').val('0');
        Global.Data.JobId = 0;
        $('[job]').val('0');
        $('#J_employee').val('0');
        $('#J_Code').val('');
        $('#J_OrderIndex').val((Global.Data.LastIndex + 1));
        $('#J_Des').val('');
        $('#J_percent').val('0');
        $('[user_err]').val('');
        $('#J_ErrorMe2').val('');

        Global.Data.JobDetailArr.length = 0;
        Global.Data.JobEReferenceArr.length = 0;
        Global.Data.IsDetailChange = false;
        Global.Data.IsE_ReferenceChange = false;
        Global.Data.IsErrChange = false;
        Global.Data.JobErrArr.length = 0;

        Global.Data.IsSaveAndFinishWork = false;
        Global.Data.IsPM_JobApprove = false;
        Global.Data.IsRequiredApprove = false;

        $('[job]').prop('disabled', false);
        $('#J_Des').prop('disabled', false);
        $('#status').prop('disabled', false);
        $('#J_percent').prop('disabled', false);
        $('#J_start').prop('disabled', false);

        var abc = $("#J_start").data("kendoDateTimePicker");
        abc.value(new Date(parseJsonDateToDate(Global.Data.OrganStart)).toString('dd/MM/yyyy hh:mm tt'));
        abc.trigger("change");

        $('#J_end').prop('disabled', false);
        $('#J_reminder').prop('disabled', false);
        $('#J_ErrorMe').prop('disabled', false);
        $('#J_employee').prop('disabled', false);
        $('#' + Global.Element.Popup_Create_Job + ' button[save]').prop('disabled', false);
        $('#' + Global.Element.Popup_Create_Job + ' button[save_app]').prop('disabled', false);
        $('#' + Global.Element.Popup_Create_Job + ' button[err]').prop('disabled', false);
        $('#tab_Error').css('display', 'block');
        ClearDataDetail();

        $('#FollwEmployee').data("kendoMultiSelect").value("");
        $("#FollwEmployee").data("kendoMultiSelect").enable(true);

    }

    function InitPopupUpdateJob() {
        $("#" + Global.Element.Update_Job_popup).modal({
            keyboard: false,
            show: false
        });

        $("#" + Global.Element.Update_Job_popup + ' button[save]').click(function () {
            if (($('#J_TypeOfCheck').val() == '1' || $('#J_TypeOfCheck').val() == '3') && $('#JJ_Quantity_Cu').val().trim() == '') {
                GlobalCommon.ShowMessageDialog("Vui lòng Nhập Số Lượng Thực Tế.", function () { }, "Lỗi Nhập liệu");
            }
            else if (($('#J_TypeOfCheck').val() == '2' || $('#J_TypeOfCheck').val() == '3') && $('#JJ_CheckResult').val().trim() == '') {
                GlobalCommon.ShowMessageDialog("Vui lòng Nhập Kết Quả Kiểm Tra Công Việc.", function () { }, "Lỗi Nhập liệu");
            }
            else if (($('#J_TypeOfCheck').val() == '2' || $('#J_TypeOfCheck').val() == '3') && !$('input[Name="JJ_IsPass"][value="0"]').prop('checked') && !$('input[Name="JJ_IsPass"][value="1"]').prop('checked')) {
                GlobalCommon.ShowMessageDialog("Vui lòng Đánh Giá Kết Quả Công Việc.", function () { }, "Lỗi Nhập liệu");
            }
            else if (($('#J_TypeOfCheck').val() == '2' || $('#J_TypeOfCheck').val() == '3') && $('input[Name="JJ_IsPass"][value="1"]').prop('checked') && $('#JJ_ErrorMe').val().trim() == "") {
                GlobalCommon.ShowMessageDialog("Vui lòng Nguyên Nhân Công Việc bị Lỗi vào ô Thông Tin lỗi .", function () { }, "Lỗi Nhập liệu");
                return false;
            }
            else {
                UpdateJob();
                $("#" + Global.Element.Update_Job_popup + ' button[cancel]').click();
            }
        });

        $("#" + Global.Element.Update_Job_popup + ' button[cancel]').click(function () {
            $("#" + Global.Element.Update_Job_popup).modal("hide");
            $('#J_Id').val('0');
            $('#J_Name').val('');
            $('#J_Code').val('');
            $('#J_OrderIndex').val(Global.Data.LastIndex + 1);
            $('#status').val('');
            $('#J_Des').val('');
            $('#J_percent').val('0');
        });
    }


    /**********************************************************************************************************************************
     *                                                   ORGANIZATION TREE VIEW                                                       *
     **********************************************************************************************************************************/
    function GetOrganSelectList() {
        $.ajax({
            url: Global.UrlAction.GetOrganSelectList,
            type: 'POST',
            data: '',
            contentType: 'application/json charset=utf-8',
            beforeSend: function () { $('#loading').show(); },
            success: function (data) {
                $('#loading').hide();
                GlobalCommon.CallbackProcess(data, function () {
                    if (data.Result == "OK") {
                        CreateOrganizationTree(data.Records);
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

    function CreateOrganizationTree(Organs) {
        $("#dropDownButton").jqxDropDownButton({ width: 230, height: 28 });
        $("#jErr_organ").jqxDropDownButton({ width: 230, height: 28 });
        $('#OrganTree').on('select', function (event) {
            var args = event.args;
            var item = $('#OrganTree').jqxTree('getItem', args.element);
            // gan id 
            Global.Data.OrganId = item.id;
            //
            var dropDownContent = '<div style="position: relative; margin-left: 3px; margin-top: 5px;">' + item.label + '</div>';
            $("#dropDownButton").jqxDropDownButton('setContent', dropDownContent);

            //
            if (Global.Data.OrganId != '0')
                GetEmployeeSelectByOrganId('owner', Global.Data.OrganId, null);
            else
                $('#owner').prop('disabled', true);
        });

        $('#OrganTree2').on('select', function (event) {
            var args = event.args;
            var item = $('#OrganTree2').jqxTree('getItem', args.element);
            // gan id 
            Global.Data.JobErr_OrganId = item.id;
            //
            var dropDownContent = '<div style="position: relative; margin-left: 3px; margin-top: 5px;">' + item.label + '</div>';
            $("#jErr_organ").jqxDropDownButton('setContent', dropDownContent);

        });

        //clear old item
        $('#OrganTree').jqxTree('clear');
        $('#OrganTree2').jqxTree('clear');

        //
        var data = [];
        var obj = {
            'id': 0,
            'parentid': -1,
            'text': 'Công ty',
            'value': '0',
            //  'icon': '/Images/Folder.png'
        }
        data.push(obj);
        if (Organs != null && Organs.length > 0) {
            for (var i = 0; i < Organs.length; i++) {
                obj = {
                    'id': Organs[i].OrganizationId,
                    'parentid': Organs[i].ParentId,
                    'text': Organs[i].Name,
                    'value': '',
                    //  'icon': '/Images/note-list.png'
                }
                data.push(obj);
            }
        }

        // prepare the data
        var source =
        {
            datatype: "json",
            datafields: [
                { name: 'id' },
                { name: 'parentid' },
                { name: 'text' },
                { name: 'value' },
                { name: 'icon' }
            ],
            id: 'id',
            localdata: data
        };
        // create data adapter.
        var dataAdapter = new $.jqx.dataAdapter(source);
        // perform Data Binding.
        dataAdapter.dataBind();
        // get the tree items. The first parameter is the item's id. The second parameter is the parent item's id. The 'items' parameter represents 
        // the sub items collection name. Each jqxTree item has a 'label' property, but in the JSON data, we have a 'text' field. The last parameter 
        // specifies the mapping between the 'text' and 'label' fields.  
        var records = dataAdapter.getRecordsHierarchy('id', 'parentid', 'items', [{ name: 'text', map: 'label' }]);

        // Create jqxTree
        $('#OrganTree').jqxTree({ source: records, width: '300px' });
        $('#OrganTree2').jqxTree({ source: records, width: '300px' });

        //refresh
        $('#OrganTree').jqxTree('refresh');
        $('#OrganTree2').jqxTree('refresh');
        //$('#OrganTree').css('visibility', 'hidden');

        if (Organs.length > 0 && typeof (Organs) != 'undefined') {
            var dropDownContent = '<div style="position: relative; margin-left: 3px; margin-top: 5px;">- Chọn Phòng Ban -</div>';
            $("#dropDownButton").jqxDropDownButton('setContent', dropDownContent);
            $("#jErr_organ").jqxDropDownButton('setContent', dropDownContent);
        }
        else {
            var dropDownContent = '<div style="position: relative; margin-left: 3px; margin-top: 5px;">Không có dữ liệu phòng ban</div>';
            $("#dropDownButton").jqxDropDownButton('setContent', dropDownContent);
            $("#jErr_organ").jqxDropDownButton('setContent', dropDownContent);
        }
    }

    /**********************************************************************************************************************************
     *                                                 JOB GROUP                                                       *
     **********************************************************************************************************************************/
    function InitPopupCreateJobGroup() {
        $("#" + Global.Element.Popup_Create_JobGroup).modal({
            keyboard: false,
            show: false
        });

        $("#" + Global.Element.Popup_Create_JobGroup + ' button[save]').click(function () {
            if (Global.Data.IsAdmin) {
                if ($('[jobGroup]').val() == '0')
                    GlobalCommon.ShowMessageDialog("Vui lòng Chọn  Nhóm Công Việc.", function () { }, "Lỗi Nhập liệu");
                else if ($('#OrderIndex').val() == '')
                    GlobalCommon.ShowMessageDialog("Vui lòng Chọn số Thứ tự Nhóm Công Việc.", function () { }, "Lỗi Nhập liệu");
                else if ($('#PartOfOrganization').val() == '0')
                    GlobalCommon.ShowMessageDialog("Vui lòng Chọn Bộ Phận Phòng Ban.", function () { }, "Lỗi Nhập liệu");
                else
                    SaveJobGroup();
            }
            else
                $("#" + Global.Element.Popup_Create_JobGroup + ' button[cancel]').click();
        });

        $("#" + Global.Element.Popup_Create_JobGroup + ' button[cancel]').click(function () {
            $("#" + Global.Element.Popup_Create_JobGroup).modal("hide");
            $('#JobGId').val('0');
            $('#Name').val('');
            $('#Code').val('');
            $('#OrderIndex').val(0);
            $('#JobG_Des').val('');
            $('#PartOfOrganization').val(0);
            $('#IsHasRHomebus').prop('checked', true);
            $('#RHomebusTitle').val('');
            Global.Data.JGroupStatusId = 0;
            Global.Data.JGroupPercent = 0;
        });
    }

    function InitListJobGroup() {
        $('#' + Global.Element.jtableJobGroup).jtable({
            title: '<span class="red">Danh sách công việc phân công </span>',
            paging: true,
            pageSize: 10,
            pageSizeChange: true,
            sorting: true,
            selectShow: true,
            rowInserted: function (event, data) {
                if (data.record.Id == Global.Data.JobGroupId) {
                    var $a = $('#' + Global.Element.jtableJobGroup).jtable('getRowByKey', data.record.Id);
                    $($a.children().find('.aaa')).click();
                }
            },
            actions: {
                listAction: Global.UrlAction.GetJob,
                createAction: Global.Element.Popup_Create_Job
            },
            messages: {
                addNewRecord: 'Thêm mới',
                selectShow: 'Ẩn hiện cột'
            },
            datas: {
                jtableId: Global.Element.jtableJobGroup,
            },
            fields: {
                Id: {
                    key: true,
                    create: false,
                    edit: false,
                    list: false
                },
                OrderIndex: {
                    title: "STT",
                    width: "3%",
                },
                StatusId: {
                    title: "Trạng Thái",
                    width: "5%",
                    display: function (data) {
                        var txt = '';
                        switch (data.record.StatusId) {
                            case 0: txt = '<span class="lightgray">Soạn thảo</span>'; break;
                            case 1: txt = '<span class="blue">Đang xử lý</span>'; break;
                            case 2: txt = '<span re class="white">Đang xử lý lỗi phát sinh</span>'; break;
                            case 3: txt = '<span class="green">Chờ duyệt</span>'; break;
                            case 4: txt = '<span >Hoàn thành</span>'; break;
                        };
                        return txt;
                    }
                },
                //RequiredApprove: {
                //    title: 'YC Duyệt',
                //    width: '3%',
                //    display: function (data) {
                //        if (data.record.RequiredApprove) {
                //            if (Global.Data.IsAdmin)
                //                var txt = $('<button title="Công Việc Hoàn Thành đang yêu cầu Duyệt" data-toggle="modal" data-target="#Approve_Job_popup" class="jtable-command-button jtable-re-app-command-button"></button>');
                //            else
                //                var txt = $('<button title="Đã yêu cầu Duyệt hoàn thành công việc." class="jtable-command-button jtable-re-app-command-button"></button>');
                //            txt.click(function () {
                //                Global.Data.JobId = data.record.Id
                //            });
                //            return txt;
                //        }
                //    }
                //},
                //IsApprove: {
                //    title: 'Duyệt',
                //    width: '3%',
                //    display: function (data) {
                //        if (data.record.IsApprove) {
                //            var txt = $('<button title="đã Duyệt" class="jtable-command-button jtable-app-command-button"></button>');
                //            return txt;
                //        }
                //    }
                //},
                Name: {
                    title: 'Tên Công Việc',
                    width: '10%',
                },
                EmployeeId: {
                    title: 'Người Phụ Trách',
                    width: '7%',
                    display: function (data) {
                        var txt = '';
                        $('#J_employee option').each(function (i, item) {
                            if (parseInt(item.value) == data.record.EmployeeId) {
                                txt = '<span>' + item.label + '</span>';
                                return false;
                            }
                        });
                        return txt;
                    }
                },
                TimeStart: {
                    title: 'TG Bắt Đầu',
                    width: '10%',
                    display: function (data) {
                        var date = new Date(parseJsonDateToDate(data.record.TimeStart))
                        txt = '<span class="">' + ParseDateToString(date) + '</span>';
                        return txt;
                    }
                },
                TimeEnd: {
                    title: 'TG Kết Thúc (Dự Kiến)',
                    width: '10%',
                    display: function (data) {
                        var date = new Date(parseJsonDateToDate(data.record.TimeEnd))
                        var txt = '<span class="red bold">' + ParseDateToString(date) + '</span>';
                        return txt;
                    }
                },
                RealTimeEnd: {
                    title: 'TG Kết Thúc (Thực Tế)',
                    width: '10%',
                    display: function (data) {
                        if (data.record.RealTimeEnd != null) {
                            var date = new Date(parseJsonDateToDate(data.record.RealTimeEnd))
                            var txt = '<span class="red bold">' + ParseDateToString(date) + '</span>';
                            return txt;
                        }
                    }
                },
                PartOfOrganName: {
                    title: "Bộ Phận",
                    width: "5%",
                    display: function (data) {
                        var txt = '';
                        $('#PartOfOrganization option').each(function (i, item) {
                            if (parseInt(item.value) == data.record.PartOfOrganId) {
                                txt = '<span class="red bold">' + item.label + '</span>';
                                return false;
                            }
                        });
                        return txt;
                    }
                },
                //PercentComplete: {
                //    title: "Tiến độ",
                //    width: "5%",
                //    display: function (data) {
                //        txt = '<span class="red bold">' + data.record.PercentComplete + '%</span>';
                //        return txt;
                //    }
                //},
                //UpdatedDate: {
                //    title: "Ngày Cập Nhật Mới Nhất",
                //    width: "5%",
                //    display: function (data) {
                //        if (data.record.UpdatedDate != null) {
                //            var date = new Date(parseJsonDateToDate(data.record.UpdatedDate))
                //            var txt = '<span class="red bold">' + ParseDateToString(date) + '</span>';
                //            return txt;
                //        }
                //    }
                //},
                //UpdatedUser: {
                //    title: "Người Cập Nhật Cuối",
                //    width: "5%",
                //    display: function (data) {
                //        if (data.record.UpdatedUserName != null) {
                //            var txt = '<span class="red bold">' + data.record.UpdatedUserName + '</span>';
                //            return txt;
                //        }
                //    }
                //},
                view: {
                    title: '',
                    width: '1%',
                    sorting: false,
                    display: function (data) {
                        var text = $('<i class="fa fa-eye clickable font-20" title="Xem chi tiết công việc"> </i>');
                        text.click(function () {
                            window.location.href = '/CheckList/View/' + data.record.Id;
                        });
                        return text;
                    }
                },
                edit: {
                    title: '',
                    width: '1%',
                    sorting: false,
                    display: function (data) {
                        var text = $('<i class="fa fa-pencil-square-o clickable blue font-20" data-toggle="modal" data-target="#' + Global.Element.Popup_Create_Job + '" title="Chỉnh sửa thông tin"> </i>');
                        text.click(function () {
                            if (!data.record.IsApprove && !Global.Data.IsAdmin && data.record.StatusId == 5) // neu trang thai la khoi tao thi moi chay ham nay 
                                ChangeJobStatusFromOnCreateToProcessing(data.record.Id);

                            GetJobDetailsAndERefernceByPM_JobId(data.record.Id, data.record.IsApprove);
                            Global.Data.JobId = data.record.Id;
                            Global.Data.JobGroupId = data.record.PM_JobGroupId;
                            Global.Data.IsPM_JobApprove = data.record.IsApprove;
                            Global.Data.IsRequiredApprove = data.record.RequiredApprove;
                            Global.Data.IsErrChange = data.record.IsErrChange;

                            $('[job]').val(data.record.JobId);
                            $('[job]').change();
                            $('#J_OrderIndex').val(data.record.OrderIndex);
                            $('#J_Des').val(data.record.UserMessage);
                            $('#status').val(data.record.StatusId);
                            $('#J_percent').val(data.record.PercentComplete);
                            $('#J_Content').val(data.record.JobContent);
                            $('#jobtype').val(data.record.JobType);
                            $('#FollwEmployee').data("kendoMultiSelect").value(JSON.parse('[' + data.record.FollowEmployeeIds + ']'));

                            var date = new Date(parseJsonDateToDate(data.record.TimeStart));
                            var date1 = new Date(parseJsonDateToDate(data.record.TimeEnd));
                            var date2 = new Date(parseJsonDateToDate(data.record.ReminderDate));
                            var start = $("#J_start").data("kendoDateTimePicker");
                            var end = $("#J_end").data("kendoDateTimePicker");
                            var remin = $("#J_reminder").data("kendoDateTimePicker");

                            start.value(kendo.toString(date, 'dd/MM/yyyy hh:mm tt'));
                            start.max(kendo.toString(date1, 'dd/MM/yyyy hh:mm tt'));
                            start.trigger("change");

                            end.value(date1);
                            end.trigger("change");
                            //  end.min(date);

                            remin.value(date2);
                            remin.trigger("change");
                            //    remin.min(date);
                            //  remin.max(date1);

                            $('#J_ErrorMe1').val(data.record.ErrorMessage);
                            $('#J_ErrorMe2').val(data.record.ErrorMessage);
                            $('#J_employee').val(data.record.EmployeeId);
                            ReloadListJobDetail();
                            ReloadListEmployeeReference();

                            Global.Data.JobErrArr.length = 0;
                            $.each(data.record.JobErrArr, function (i, item) {
                                Global.Data.JobErrArr.push({
                                    Id: item.Id,
                                    PM_JobId: item.PM_JobId,
                                    Index: (i + 1),
                                    ErrorMessage: item.ErrorMessage,
                                    TimeError: new Date(parseJsonDateToDate(item.TimeError)),
                                    TimeFinish_DK: new Date(parseJsonDateToDate(item.TimeFinish_DK)),
                                    TimeFinish_TT: item.TimeFinish_TT == null ? null : new Date(parseJsonDateToDate(item.TimeFinish_TT)),
                                    OrganId: item.OrganId,
                                    OrganName: item.OrganName,
                                    Solution: item.Solution,
                                    ReasonNotFinish: item.ReasonNotFinish,
                                    Warning: item.Warning
                                });
                            });
                            ReloadListJobErr();

                            if (data.record.IsApprove) {
                                $('[job]').prop('disabled', true);
                                $('#J_Des').prop('disabled', true);
                                $('#status').prop('disabled', true);
                                $('#J_percent').prop('disabled', true);
                                $('#J_start').prop('disabled', true);
                                $('#J_end').prop('disabled', true);
                                $('#J_reminder').prop('disabled', true);
                                $('#J_ErrorMe1').prop('disabled', true);
                                $('#J_employee').prop('disabled', true);
                                $("#FollwEmployee").data("kendoMultiSelect").enable(false);
                                //$("#" + Global.Element.Popup_Create_Job + ' button[save]').prop('disabled', true);

                                //$('#' + Global.Element.Popup_Create_Job + ' button[save_app]').prop('disabled', true);
                                //$('#' + Global.Element.Popup_Create_Job + ' button[err]').prop('disabled', true);
                                //$('#tab_Error').css('display', 'none');
                            }

                            //if (Global.Data.IsAdmin) {
                            //    $('#tab_Error').css('display', 'none');
                            //}

                            if ((!Global.Data.IsAdmin && data.record.RequiredApprove) || data.record.IsApprove) {
                                $('#' + Global.Element.Popup_Create_Job + ' button[save]').prop('disabled', true);
                                $('#' + Global.Element.Popup_Create_Job + ' button[save_app]').prop('disabled', true);
                                $('#' + Global.Element.Popup_Create_Job + ' button[err]').prop('disabled', true);
                                $('#tab_Error').css('display', 'none');
                            }



                            //$('#JobGId').val(data.record.Id);
                            //$('[jobGroup]').val(data.record.JobGroupId);
                            $('#PartOfOrganization').val(data.record.PartOfOrganId);
                            //$('#Code').val(data.record.Code);
                            //$('#Name').val(data.record.Name);
                            //$('#OrderIndex').val(data.record.OrderIndex);
                            //$('#JobG_Des').val(data.record.Note);
                            //Global.Data.JGroupPercent = data.record.PercentComplete;
                            //Global.Data.JGroupStatusId = data.record.StatusId;
                            $('#IsHasRHomebus').prop('checked', data.record.IsHasRHomebus);
                            $('#RHomebusTitle').val(data.record.RHomebusTitle);
                            if (data.record.IsHasRHomebus)
                                $('#RHomebusTitle').prop('disabled', false);
                            else
                                $('#RHomebusTitle').prop('disabled', true);

                            //var date = new Date(parseJsonDateToDate(data.record.StartDate));
                            //$('#jg_start').data("kendoDateTimePicker").value(date);
                            //date = new Date(parseJsonDateToDate(data.record.EndDate));
                            //$('#jg_end').data("kendoDateTimePicker").value(date);
                        });
                        return text;
                    }
                },
                Delete: {
                    title: '',
                    width: "2%",
                    sorting: false,
                    display: function (data) {
                        if (Global.Data.IsAdmin) {
                            var text = $('<button title="Xóa" class="jtable-command-button jtable-delete-command-button"><span>Xóa</span></button>');
                            text.click(function () {
                                GlobalCommon.ShowConfirmDialog('Bạn có chắc chắn muốn xóa?', function () {
                                    DeleteJob(data.record.Id);
                                }, function () { }, 'Đồng ý', 'Hủy bỏ', 'Thông báo');
                            });
                            return text;
                        }
                    }
                }
            }
        });
    }

    function ReloadListJobGroup() {
        $('#' + Global.Element.jtableJobGroup).jtable('load', { 'Id': Global.Data.CL_OrganId, 'OrganId': Global.Data.OrganId, 'isAdmin': Global.Data.IsAdmin });
        if (!Global.Data.IsAdmin)
            $('#' + Global.Element.jtableJobGroup + ' span.jtable-toolbar-item-add-record:contains("Thêm mới")').css('display', 'none');
    }

    function ParseDateToString(date) {
        var dd = date.getDate() < 10 ? ('0' + date.getDate()) : date.getDate();
        dd += '/';
        dd += (date.getMonth() + 1) < 10 ? ('0' + (date.getMonth() + 1)) : (date.getMonth() + 1);
        dd += '/' + date.getFullYear() + ' ';
        dd += date.getHours() == 0 ? '00' : date.getHours() < 10 ? ('0' + date.getHours()) : date.getHours();
        dd += ':';
        dd += date.getMinutes() == 0 ? '00' : date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes();
        dd += ':';
        dd += date.getSeconds() == 0 ? '00' : date.getSeconds() < 10 ? ('0' + date.getSeconds()) : date.getSeconds();
        return dd;
    }

    /**********************************************************************************************************************************
    *                                                 JOB                                                        *
    **********************************************************************************************************************************/
    function InitPopupCreateJob() {
        $("#" + Global.Element.Popup_Create_Job).modal({
            keyboard: false,
            show: false
        });

        $("#" + Global.Element.Popup_Create_Job + ' button[save]').click(function () {
            if (Global.Data.IsAdmin && !Global.Data.IsPM_JobApprove) {
                if ($('[job]').val() == '0') {
                    GlobalCommon.ShowMessageDialog("Vui lòng chọn Công Việc.", function () { }, "Lỗi Nhập liệu");
                }
                else if ($('#J_start').val().trim() == "") {
                    GlobalCommon.ShowMessageDialog("Vui lòng chọn Ngày Bắt Đầu Công Việc.", function () { }, "Lỗi Nhập liệu");
                    return false;
                }
                else if ($('J_Id').val() == '0' && new Date($('#J_start').attr('date')) < new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())) {
                    GlobalCommon.ShowMessageDialog("Ngày Bắt Đầu Công Việc không được nhỏ hơn ngày hiện tại", function () { }, "Lỗi Nhập liệu");
                    return false;
                }
                else if ($('#J_end').val().trim() == "") {
                    GlobalCommon.ShowMessageDialog("Vui lòng chọn Ngày Kết Thúc Công Việc.", function () { }, "Lỗi Nhập liệu");
                    return false;
                }
                else if (new Date($('#J_start').attr('date')) > new Date($('#J_end').attr('date'))) {
                    GlobalCommon.ShowMessageDialog("Ngày Kết Thúc Công Việc không được nhỏ hơn Ngày Bắt Đầu Công Việc.", function () { }, "Lỗi Nhập liệu");
                    return false;
                }
                else {
                    SaveJob();
                }
            }
            else if (!Global.Data.IsAdmin && Global.Data.JobId != 0 && !Global.Data.IsPM_JobApprove)
                SaveJob();
            else
                $("#" + Global.Element.Popup_Create_Job + ' button[cancel]').click();

        });

        $("#" + Global.Element.Popup_Create_Job + ' button[cancel]').click(function () {
            $("#" + Global.Element.Popup_Create_Job).modal("hide");
            ResetJobBox();
        });

        $("#" + Global.Element.Popup_Create_Job).on('shown.bs.modal', function () {
            var minDate = new Date(parseJsonDateToDate(Global.Data.OrganStart));
            var maxDate = new Date(parseJsonDateToDate(Global.Data.OrganEnd));

            var dp = $("#J_start").data("kendoDateTimePicker");
            dp.min(minDate);
            dp.max(maxDate);
            //dp.value(minDate);

            var bb = $("#J_reminder").data("kendoDateTimePicker");
            bb.min(minDate);
            bb.max(maxDate);
            //bb.value(maxDate);

            var cc = $("#J_end").data("kendoDateTimePicker");
            cc.min(minDate);
            cc.max(maxDate);
            //cc.value(maxDate);

            cc = $("#start_suggest").data("kendoDateTimePicker");
            cc.min(minDate);
            cc.max(maxDate);

            ReloadListJobDetail();
            ReloadListEmployeeReference();
            if ($('#J_OrderIndex').val() == '')
                $('#J_OrderIndex').val(Global.Data.LastIndex + 1);
        });

        $("#" + Global.Element.Popup_Create_Job + ' button[err]').click(function () {
            if ($('[user_err]').val().trim() == '') {
                GlobalCommon.ShowMessageDialog("Vui lòng Nhập thông tin lỗi Bạn cần báo cáo lên Người Quản Lý.", function () { }, "Lỗi Nhập liệu");
                return false;
            }
            else {
                UserSendErrorMessage();
            }
        });
    }

    function CheckUserPermision() {
        if (!Global.Data.IsAdmin) {
            $('#tab_infor, #JInfo').hide();
            $('#tab_infor, #JInfo').removeClass('active');
            $('#tab_detail , #JDetail').addClass('active');
            $('#add_detail_box').hide();
            // neu chua co nut tra viec thi them vao
            if ($('#' + Global.Element.Popup_Create_Job + ' .modal-footer button[save_app]').length == 0) {
                var $button = $('<button save_app class="btn btn-danger"><div class="button-image image-save"></div> Lưu & Báo Xong</button>');
                $button.click(function () {
                    if (!Global.Data.IsAdmin && !Global.Data.IsPM_JobApprove) {
                        Global.Data.IsSaveAndFinishWork = true;
                        SaveJob();
                    }
                });
                $('#' + Global.Element.Popup_Create_Job + ' .modal-footer').append($button);
            }
        }
    }

    function SaveJob() {
        var obj = {
            Id: Global.Data.JobId,
            PM_JobGroupId: Global.Data.JobGroupId,
            JobId: $('[job]').val(),
            Name: $('[job] option:selected').text(),
            OrderIndex: parseInt($('#J_OrderIndex').val()),
            TimeStart: $('#J_start').data("kendoDateTimePicker").value(),
            TimeEnd: $('#J_end').data("kendoDateTimePicker").value(),
            RealTimeEnd: null,
            ReminderDate: $('#J_reminder').data("kendoDateTimePicker").value(),
            EmployeeId: $('#J_employee').val(),
            StatusId: $('#status').val(),
            PercentComplete: $('#J_percent').val() == '' ? 0 : $('#J_percent').val(),
            ErrorMessage: $('#J_ErrorMe').val(),
            Note: $('#J_Des').val(),
            JobContent: $('#J_Content').val(),
            JobType: $('#jobtype').val(),
            FollowEmployeeIds: $('#FollwEmployee').data("kendoMultiSelect").value().toString(),
            ApproveStatus: null,
            ApproveMessage: '',
            Details: Global.Data.JobDetailArr,
            EReferences: Global.Data.JobEReferenceArr,
            IsE_ReferenceChange: Global.Data.IsE_ReferenceChange,
            IsDetailChange: Global.Data.IsDetailChange,
            JobErrArr: Global.Data.JobErrArr,
            IsErrChange: Global.Data.IsErrChange,
            IsAdmin: Global.Data.IsAdmin,
            IsSaveAndFinishWork: Global.Data.IsSaveAndFinishWork,
            PartOfOrganId: $('#PartOfOrganization').val(),
            IsHasRHomebus: $('#IsHasRHomebus').prop('checked'),
            RHomebusTitle: $('#RHomebusTitle').val(),
            ParentId: $('[parentjob]').val() == 0 ? null : $('[parentjob]').val(),
            CL_OrganId: Global.Data.CL_OrganId
        }
        Global.Data.ModelJob = obj;
        $.ajax({
            url: Global.UrlAction.SaveJob,
            type: 'post',
            data: ko.toJSON(Global.Data.ModelJob),
            contentType: 'application/json',
            beforeSend: function () { $('#loading').show(); },
            success: function (result) {
                $('#loading').hide();
                GlobalCommon.CallbackProcess(result, function () {
                    if (result.Result == "OK") {
                        ReloadListJobGroup();
                        ResetJobBox();
                        GetLastJobIndex();
                        $("#" + Global.Element.Popup_Create_Job + ' button[cancel]').click();
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

    function DeleteJob(Id) {
        $.ajax({
            url: Global.UrlAction.DeleteJob,
            type: 'POST',
            data: JSON.stringify({ 'Id': Id }),
            contentType: 'application/json charset=utf-8',
            beforeSend: function () { $('#loading').show(); },
            success: function (data) {
                $('#loading').hide();
                GlobalCommon.CallbackProcess(data, function () {
                    if (data.Result == "OK") {
                        GlobalCommon.ShowMessageDialog('Xóa Thành Công !.', function () { }, "Thông Báo");
                        ReloadListJobGroup();
                        GetLastJobIndex();
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

    function ChangeJobStatusFromOnCreateToProcessing(jobId) {
        $.ajax({
            url: Global.UrlAction.ChangeJobStatusFromOnCreateToProcessing,
            type: 'post',
            data: JSON.stringify({ 'PM_JobId': jobId }),
            contentType: 'application/json',
            success: function (result) {
                GlobalCommon.CallbackProcess(result, function () {
                }, false, Global.Element.PopupModule, true, true, function () {
                    var msg = GlobalCommon.GetErrorMessage(result);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình xử lý.");
                });
            }
        });
    }

    function GetJobDetailsAndERefernceByPM_JobId(PM_JobId, IsApprove) {
        $.ajax({
            url: Global.UrlAction.GetJobDetailsAndERefernceByPM_JobId,
            type: 'POST',
            data: JSON.stringify({ 'PM_JobId': PM_JobId }),
            contentType: 'application/json charset=utf-8',
            beforeSend: function () { $('#loading').show(); },
            success: function (data) {
                $('#loading').hide();
                GlobalCommon.CallbackProcess(data, function () {
                    if (data.Result == "OK") {
                        // detail
                        Global.Data.JobDetailArr.length = 0;
                        if (data.Data != null) {
                            $.each(data.Data, function (i, item) {
                                item.Result = item.Result == null ? '' : item.Result;
                                Global.Data.JobDetailArr.push(item);
                            });
                        }
                        // employee Reference
                        Global.Data.JobEReferenceArr.length = 0;
                        if (data.Records != null) {
                            $.each(data.Records, function (i, item) {
                                $.each(Global.Data.EmployeeeArr, function (e, Employ) {
                                    if (Employ.Value == item.EmployeeId) {
                                        item.Name = Employ.Name;
                                        return false;
                                    }
                                });
                                item.ReminderDate = parseJsonDateToDate(item.ReminderDate);
                                Global.Data.JobEReferenceArr.push(item);
                            });
                        }

                        if (Global.Data.IsAdmin && !IsApprove) {
                            //  AddEmptyObject();
                            AddEmployeeReferenceEmptyObject();
                        }
                        ReloadListJobDetail();
                        ReloadListEmployeeReference();
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

    function ApproveJobResult() {
        $.ajax({
            url: Global.UrlAction.ApproveJobResult,
            type: 'post',
            data: JSON.stringify({ 'PM_JobId': Global.Data.JobId, 'IsApprove': $('input[name="app"]:checked').val(), 'ErrorMessage': $('#err_msg').val() }),
            contentType: 'application/json',
            beforeSend: function () { $('#loading').show(); },
            success: function (result) {
                $('#loading').hide();
                GlobalCommon.CallbackProcess(result, function () {
                    if (result.Result == "OK") {
                        GlobalCommon.ShowMessageDialog(result.Message, function () { }, "Thông Báo");
                        ReloadListJobGroup();
                        $("#" + Global.Element.Popup_Approve_Job + ' button[cancel]').click();
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

    function UserSendErrorMessage() {
        $.ajax({
            url: Global.UrlAction.UserSendErrorMessage,
            type: 'post',
            data: JSON.stringify({ 'PM_JobId': Global.Data.JobId, 'Message': $('[user_err]').val() }),
            contentType: 'application/json',
            beforeSend: function () { $('#loading').show(); },
            success: function (result) {
                $('#loading').hide();
                GlobalCommon.CallbackProcess(result, function () {
                    if (result.Result == "OK") {
                        GlobalCommon.ShowMessageDialog(result.Message, function () { }, "Thông Báo");
                        ReloadListJobGroup();
                        $("#" + Global.Element.Popup_Create_Job + ' button[cancel]').click();
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

    /**********************************************************************************************************************************
    *                                                 JOB DETAIL                                                      *
    **********************************************************************************************************************************/
    function InitListJobDetail() {
        $('#' + Global.Element.Jtable_JobDetail).jtable({
            title: 'Chi tiết Công Việc',
            selectShow: true,
            actions: {
                listAction: Global.Data.JobDetailArr
            },
            messages: {
                selectShow: 'Ẩn hiện cột'
            },
            fields: {
                Id: {
                    key: true,
                    create: false,
                    edit: false,
                    list: false
                },
                Index: {
                    title: "STT",
                    width: "2%",
                },
                //Name: {
                //    title: "Tên Chi Tiết",
                //    width: "10%",
                //    display: function (data) {
                //        if (Global.Data.IsAdmin && !Global.Data.IsPM_JobApprove) {
                //            var text = $('<a class="clickable blue bold">' + data.record.Name + '</a>');
                //            text.click(function () {
                //                $('[common]').attr('d_id', data.record.Id);
                //                $('[common]').attr('index', data.record.Index);
                //                $('#isUseData').prop('checked', false);
                //                $('#use_data_box').hide();
                //                $('#not_use').hide();
                //                if (data.record.IsUseData) {
                //                    $('#use_data_box').show();
                //                    $('[isdata]').prop('checked', true);
                //                    if (data.record.IsAutoDone)
                //                        $('input[name="isautoDone"][val="true"]').attr('checked', true);
                //                    else
                //                        $('input[name="isautoDone"][val="false"]').attr('checked', true);

                //                    $('#Name_1').val(data.record.ObjectId);
                //                    $('#d_quantity').val(data.record.Quantity);
                //                    $('#min_quantity').val(data.record.Min_Quantity);
                //                }
                //                else {
                //                    $('#not_use').show();
                //                    $('#Name_2').val(data.record.Name);
                //                    $('#required').val(data.record.Required);
                //                    $('[isdata]').prop('checked', false);
                //                }
                //                $('[add_detail]').hide();
                //                $('[update_detail]').show();
                //            });
                //        }
                //        else {
                //            var text = $('<span class="bold">' + data.record.Name + '</span>');
                //            $('#add_detail_box').hide();
                //        }
                //        return text;
                //    }
                //}, 
                Required: {
                    title: "Yêu Cầu",
                    width: "50%",
                    //display: function (data) {
                    //    if (Global.Data.IsAdmin && !Global.Data.IsPM_JobApprove) {
                    //        var text = $('<textarea re_' + data.record.Index + ' style="width:95%">' + data.record.Required + '</textarea>');
                    //        text.change(function () {
                    //            $.each(Global.Data.JobDetailArr, function (i, item) {
                    //                if ((i + 1) == data.record.Index) {
                    //                    item.Required = text.val();
                    //                    return false;
                    //                }
                    //            });
                    //            Global.Data.IsDetailChange = true;
                    //        });
                    //        text.focusout(function () {
                    //            $('[n_' + (Global.Data.JobDetailArr.length) + ']').focus();
                    //        });
                    //    }
                    //    else {
                    //        var text = $('<span class="blue">' + data.record.Required + '</span>');
                    //    }
                    //    return text;
                    // }
                },
                Result: {
                    title: "Kết Quả Thực Hiện",
                    width: "10%",
                    display: function (data) {
                        if (Global.Data.IsAdmin || Global.Data.IsPM_JobApprove || Global.Data.IsRequiredApprove || data.record.IsAutoDone) {
                            var text = $('<span>' + data.record.Result + '</span>');
                        }
                        else {
                            var text = $('<textarea style="width:95%">' + data.record.Result + '</textarea>');
                            text.change(function () {
                                $.each(Global.Data.JobDetailArr, function (i, item) {
                                    if ((i + 1) == data.record.Index) {
                                        item.Result = text.val();
                                        return false;
                                    }
                                });
                            });
                        }
                        return text;
                    }
                },
                IsPass: {
                    title: "Xong ?",
                    width: "2%",
                    display: function (data) {
                        if (data.record.IsPass)
                            var text = $('<button title="Ấn đổi trạng thái Chi Tiết Công Việc." class="jtable-command-button jtable-checked-command-button"></button>');
                        else
                            var text = $('<button title="Ấn đổi trạng thái Chi Tiết Công Việc." class="jtable-command-button jtable-unchecked-command-button"></button>');

                        if (!Global.Data.IsPM_JobApprove && !Global.Data.IsRequiredApprove && !data.record.IsAutoDone) {
                            text.click(function () {
                                $.each(Global.Data.JobDetailArr, function (i, item) {
                                    if ((i + 1) == data.record.Index) {
                                        if (text.hasClass('jtable-unchecked-command-button')) {
                                            text.removeClass('jtable-unchecked-command-button');
                                            text.addClass('jtable-checked-command-button');
                                            item.IsPass = true;
                                        }
                                        else {
                                            text.addClass('jtable-unchecked-command-button');
                                            text.removeClass('jtable-checked-command-button');
                                            item.IsPass = false;
                                        }
                                        return false;
                                    }
                                });
                            });
                        }
                        return text;
                    }
                },
                Delete: {
                    title: '',
                    width: "3%",
                    sorting: false,
                    display: function (data) {
                        if (Global.Data.IsAdmin && !Global.Data.IsPM_JobApprove) {
                            var text = $('<button title="Xóa" class="jtable-command-button jtable-delete-command-button"><span>Xóa</span></button>');
                            text.click(function () {
                                GlobalCommon.ShowConfirmDialog('Bạn có chắc chắn muốn xóa?', function () {
                                    var oldIndex = data.record.Index - 1;
                                    Global.Data.JobDetailArr.splice(oldIndex, 1);
                                    for (var i = oldIndex; i < Global.Data.JobDetailArr.length; i++) {
                                        Global.Data.JobDetailArr[i].Index = i + 1;
                                    }
                                    ReloadListJobDetail();
                                    Global.Data.IsDetailChange = true;
                                }, function () { }, 'Đồng ý', 'Hủy bỏ', 'Thông báo');
                            });
                            return text;
                        }
                    }
                }
            }
        });
    }

    function ReloadListJobDetail() {
        $('#' + Global.Element.Jtable_JobDetail).jtable('load');
    }

    function ClearDataDetail() {
        $('#Name_1').val(0);
        $('#Name_2').val('');
        $('#d_quantity').val(0);
        $('#min_quantity').val(100);
        $('#required').val('');
        $('input[name="isautoDone"][value="true"]').attr('checked', true);

        $('[common]').attr('d_id', 0);
        $('[common]').attr('index', 0);
        $('[common]').prop('checked', false);
        $('[isdata]').prop('checked', false);
        $('[isUseData]').click();
        $('[add_detail]').show();
        $('[update_detail]').hide();
        $('#add_detail_box').show();
    }

    function SaveJobDetail() {
        var isUseData = $('[isdata]').prop('checked');
        var index = parseInt($('[common]').attr('index'));
        // add new 
        var obj = {
            Id: $('[common]').attr('d_id'),
            PM_JobId: Global.Data.JobId,
            Index: Global.Data.JobDetailArr.length + 1,
            IsAutoDone: false,
            Required: $('#required').val(),
            Result: '',
            IsPass: false
        };
        if (isUseData) {
            if ($('[job] option:selected').attr('hasMenu') == 'true') {
                obj.Name = $('#Name_1 option:selected').text();
                obj.ObjectId = $('#Name_1').val();
                obj.Quantity = $('#d_quantity').val();
                obj.Min_Quantity = $('#min_quantity').val();
            }
            else
                obj.Name = $('#Name_3').val();
            obj.IsAutoDone = $('[isauto]:checked').attr('val') == 'true' ? true : false;
        }
        Global.Data.JobDetailArr.push(obj);
        ReloadListJobDetail();
        ClearDataDetail();
        Global.Data.IsDetailChange = true;
    }

    function CheckJobDetailValidate() {
        var isUseData = $('[isdata]').prop('checked');
        var isHasMenu = $('[job] option:selected').attr('hasMenu') == 'true' ? true : false;

        if (isUseData && isHasMenu && $('#Name_1').val() == '0') {
            GlobalCommon.ShowMessageDialog('Vui lòng chọn <span class="red bold">Tên Chi Tiết</span>.', function () { }, "Lỗi Nhập liệu");
            return false;
        }
        else if (isUseData && isHasMenu && $('#d_quantity').val() == '0') {
            GlobalCommon.ShowMessageDialog('Vui lòng nhập <span class="red bold">Số Lượng Yêu cầu</span>.', function () { }, "Lỗi Nhập liệu");
            return false;
        }
        else if (isUseData && isHasMenu && $('#min_quantity').val() == '0') {
            GlobalCommon.ShowMessageDialog('Vui lòng chọn <span class="red bold">Số Lượng tối thiểu. </span>.', function () { }, "Lỗi Nhập liệu");
            return false;
        }
        else if (isUseData && !isHasMenu && $('#Name_3').val() == '0') {
            GlobalCommon.ShowMessageDialog('Vui lòng chọn <span class="red bold">Tên Chi Tiết</span>.', function () { }, "Lỗi Nhập liệu");
            return false;
        }
        else if (!isUseData && $('#Name_2').val().trim() == '') {
            GlobalCommon.ShowMessageDialog('Vui lòng nhập <span class="red bold">Tên Chi Tiết</span>.', function () { }, "Lỗi Nhập liệu");
            return false;
        }
        else if (!isUseData && $('#required').val().trim() == '') {
            GlobalCommon.ShowMessageDialog('Vui lòng nhập <span class="red bold">Yêu Cầu</span>.', function () { }, "Lỗi Nhập liệu");
            return false;
        }
        return true;
    }


    /**********************************************************************************************************************************
    *                                                 JOB ERROR                                                      *
    **********************************************************************************************************************************/
    function InitPopupJobErr() {
        $("#" + Global.Element.JobErr_popup).modal({
            keyboard: false,
            show: false
        });

        $("#" + Global.Element.JobErr_popup + ' button[save]').click(function () {
            SaveJobErr();
        });

        $("#" + Global.Element.JobErr_popup + ' button[cancel]').click(function () {
            $("#" + Global.Element.JobErr_popup).modal("hide");
            $("#" + Global.Element.Popup_Create_Job).css('z-index', 1050);
            // ResetJobBox();
        });

        $("#" + Global.Element.JobErr_popup).on('shown.bs.modal', function () {
            var minDate = new Date(parseJsonDateToDate(Global.Data.JGroupStart));
            var maxDate = new Date(parseJsonDateToDate(Global.Data.JGroupEnd));

            var dp = $("#jErr_time1").data("kendoDateTimePicker");
            dp.min(minDate);
            dp.max(maxDate);

            var bb = $("#jErr_time2").data("kendoDateTimePicker");
            bb.min(minDate);
            bb.max(maxDate);

            var cc = $("#jErr_time3").data("kendoDateTimePicker");
            cc.min(minDate);
            cc.max(maxDate);

            ReloadListJobErr();
            $("#" + Global.Element.JobErr_popup).css('z-index', 1050);
            $("#" + Global.Element.Popup_Create_Job).css('z-index', 990);
            Global.Data.JobErr_OrganId = 0;
            var dropDownContent = '<div style="position: relative; margin-left: 3px; margin-top: 5px;"> - - Chọn Phòng Ban - - </div>';
            $("#dropDownButton").jqxDropDownButton('setContent', dropDownContent);
            $('#OrganTree').css('visibility', 'hidden');
        });

        $("#" + Global.Element.JobErr_popup + ' button[err]').click(function () {
            if ($('[user_err]').val().trim() == '') {
                GlobalCommon.ShowMessageDialog("Vui lòng Nhập thông tin lỗi Bạn cần báo cáo lên Người Quản Lý.", function () { }, "Lỗi Nhập liệu");
                return false;
            }
            else {
                UserSendErrorMessage();
            }
        });
    }

    function InitListJobError() {
        $('#' + Global.Element.Jtable_JobErr).jtable({
            title: 'Danh sách sự cố',
            selectShow: true,
            actions: {
                listAction: Global.Data.JobErrArr,
                createAction: Global.Element.JobErr_popup
            },
            messages: {
                selectShow: 'Ẩn hiện cột',
                addNewRecord: 'Thêm SC',
            },
            fields: {
                Id: {
                    key: true,
                    create: false,
                    edit: false,
                    list: false
                },
                ErrorMessage: {
                    title: "Nội dung SC",
                    width: "20%",
                },
                Solution: {
                    title: "Biện pháp khắc phục",
                    width: "20%",
                },
                OrganName: {
                    title: "ĐV khắc phục",
                    width: "10%",
                },
                ReasonNotFinish: {
                    title: "Nguyên nhân không HT",
                    width: "10%",
                },
                Warning: {
                    title: "Cảnh báo",
                    width: "10%",
                },
                TimeError: {
                    title: "Thời điểm SC",
                    width: "10%",
                    display: function (data) {
                        if (data.record.TimeError != null) {
                            //  var date = new Date(parseJsonDateToDate(data.record.TimeError))
                            //  var txt = '<span class="red bold">' + ParseDateToString(date) + '</span>';
                            var txt = '<span class="red bold">' + ParseDateToString(data.record.TimeError) + '</span>';
                            return txt;
                        }
                    }
                },
                TimeFinish_DK: {
                    title: "Kết thúc DK",
                    width: "10%",
                    display: function (data) {
                        if (data.record.TimeFinish_DK != null) {
                            // var date = new Date(parseJsonDateToDate(data.record.TimeFinish_DK))
                            // var txt = '<span class="red bold">' + ParseDateToString(date) + '</span>';
                            var txt = '<span class="red bold">' + ParseDateToString(data.record.TimeFinish_DK) + '</span>';
                            return txt;
                        }
                    }
                },
                TimeFinish_TT: {
                    title: "Kết thúc TT",
                    width: "10%",
                    display: function (data) {
                        if (data.record.TimeFinish_TT != null) {
                            // var date = new Date(parseJsonDateToDate(data.record.TimeFinish_TT))
                            //  var txt = '<span class="red bold">' + ParseDateToString(date) + '</span>';
                            var txt = '<span class="red bold">' + ParseDateToString(data.record.TimeFinish_TT) + '</span>';
                            return txt;
                        }
                    }
                },
                Delete: {
                    title: '',
                    width: "3%",
                    sorting: false,
                    display: function (data) {
                        if (Global.Data.IsAdmin && !Global.Data.IsPM_JobApprove) {
                            var text = $('<button title="Xóa" class="jtable-command-button jtable-delete-command-button"><span>Xóa</span></button>');
                            text.click(function () {
                                GlobalCommon.ShowConfirmDialog('Bạn có chắc chắn muốn xóa?', function () {
                                    var oldIndex = data.record.Index - 1;
                                    Global.Data.JobErrArr.splice(oldIndex, 1);
                                    for (var i = oldIndex; i < Global.Data.JobErrArr.length; i++) {
                                        Global.Data.JobErrArr[i].Index = i + 1;
                                    }
                                    ReloadListJobErr();
                                    Global.Data.IsErrChange = true;
                                }, function () { }, 'Đồng ý', 'Hủy bỏ', 'Thông báo');
                            });
                            return text;
                        }
                    }
                }
            }
        });
    }

    function ReloadListJobErr() { $('#' + Global.Element.Jtable_JobErr).jtable('load'); }
    function SaveJobErr() {
        // add new 
        var obj = {
            Id: 0,
            PM_JobId: Global.Data.JobId,
            Index: Global.Data.JobErrArr.length + 1,
            ErrorMessage: $('#jErr_sms').val(),
            TimeError: $('#jErr_time1').data("kendoDateTimePicker").value(),
            TimeFinish_DK: $('#jErr_time2').data("kendoDateTimePicker").value(),
            TimeFinish_TT: $('#jErr_time3').val() == '' ? null : $('#jErr_time3').data("kendoDateTimePicker").value(),
            OrganId: Global.Data.JobErr_OrganId,
            OrganName: $('#jErr_organ').val(),
            Solution: $('#jErr_solution').val(),
            ReasonNotFinish: $('#jErr_reason').val(),
            Warning: $('#Warning').val(),
        };

        Global.Data.JobErrArr.push(obj);
        $("#" + Global.Element.JobErr_popup + ' button[cancel]').click();
        ReloadListJobErr();
        Global.Data.IsErrChange = true;

    }

    function CheckJobDetailValidate() {
        var isUseData = $('[isdata]').prop('checked');
        var isHasMenu = $('[job] option:selected').attr('hasMenu') == 'true' ? true : false;

        if (isUseData && isHasMenu && $('#Name_1').val() == '0') {
            GlobalCommon.ShowMessageDialog('Vui lòng chọn <span class="red bold">Tên Chi Tiết</span>.', function () { }, "Lỗi Nhập liệu");
            return false;
        }
        else if (isUseData && isHasMenu && $('#d_quantity').val() == '0') {
            GlobalCommon.ShowMessageDialog('Vui lòng nhập <span class="red bold">Số Lượng Yêu cầu</span>.', function () { }, "Lỗi Nhập liệu");
            return false;
        }
        else if (isUseData && isHasMenu && $('#min_quantity').val() == '0') {
            GlobalCommon.ShowMessageDialog('Vui lòng chọn <span class="red bold">Số Lượng tối thiểu. </span>.', function () { }, "Lỗi Nhập liệu");
            return false;
        }
        else if (isUseData && !isHasMenu && $('#Name_3').val() == '0') {
            GlobalCommon.ShowMessageDialog('Vui lòng chọn <span class="red bold">Tên Chi Tiết</span>.', function () { }, "Lỗi Nhập liệu");
            return false;
        }
        else if (!isUseData && $('#Name_2').val().trim() == '') {
            GlobalCommon.ShowMessageDialog('Vui lòng nhập <span class="red bold">Tên Chi Tiết</span>.', function () { }, "Lỗi Nhập liệu");
            return false;
        }
        else if (!isUseData && $('#required').val().trim() == '') {
            GlobalCommon.ShowMessageDialog('Vui lòng nhập <span class="red bold">Yêu Cầu</span>.', function () { }, "Lỗi Nhập liệu");
            return false;
        }
        return true;
    }

    /**********************************************************************************************************************************
    *                                                 EMPLOYEE REFERENCE                                                      *
    **********************************************************************************************************************************/
    function InitListEmployeeReference() {
        $('#' + Global.Element.Jtable_EReference).jtable({
            title: 'Người Liên Quan',
            selectShow: true,
            actions: {
                listAction: Global.Data.JobEReferenceArr
            },
            messages: {
                selectShow: 'Ẩn hiện cột'
            },
            fields: {
                Id: {
                    key: true,
                    create: false,
                    edit: false,
                    list: false
                },
                Index: {
                    title: "STT",
                    width: "2%",
                },
                Name: {
                    title: "Tên Nhân Viên",
                    width: "10%",
                    display: function (data) {
                        if (Global.Data.IsAdmin && !Global.Data.IsPM_JobApprove) {
                            var text = $('<input n_' + data.record.Index + ' list="employees" type="text" style="width:95%" Value="' + data.record.Name + '" />');
                            text.change(function () {
                                if (text.val().trim() != '') {
                                    var flag = false;
                                    //ktra trùng
                                    $.each(Global.Data.JobEReferenceArr, function (i, item) {
                                        if (item.Name.trim() == text.val().trim()) {
                                            flag = true;
                                            return false;
                                        }
                                    });
                                    if (flag) {
                                        GlobalCommon.ShowMessageDialog('Nhân Viên : <span class="red bold">"' + text.val() + '"</span> đã được chọn trong Danh Sách.\nVui lòng kiểm tra lại .', function () { }, "Nhân Viên đã được chọn");
                                        text.val('');
                                    }
                                    else {
                                        $.each(Global.Data.EmployeeeArr, function (i, item) {
                                            if (item.Name.trim() == text.val().trim()) {
                                                data.record.Name = item.Name;
                                                data.record.EmployeeId = item.Value;
                                                flag = true;
                                                Global.Data.IsE_ReferenceChange = true;
                                                return false;
                                            }
                                        });
                                        if (!flag) {
                                            GlobalCommon.ShowMessageDialog('Không tìm thấy thông tin của Nhân Viên : <span class="red bold">"' + text.val() + '"</span> này trong Danh Sách.\nVui lòng kiểm tra lại .', function () { }, "Không Tìm Thấy Nhân Viên");
                                            text.val('');
                                        }
                                        else {
                                            if (Global.Data.JobEReferenceArr.length == data.record.Index && text.val().trim() != '') {
                                                AddEmployeeReferenceEmptyObject();
                                                ReloadListEmployeeReference();
                                                $('[re_' + (Global.Data.JobEReferenceArr.length - 1) + ']').focus();
                                                $('#' + Global.Element.Popup_Create_Job + ' .modal-body').scrollTop($('#' + Global.Element.Popup_Create_Job + ' .modal-body').height());
                                            }
                                        }
                                    }
                                }
                            });
                        }
                        else {
                            var text = $('<span >' + data.record.Name + '</span>');
                        }
                        return text;
                    }
                },
                ReminderDate: {
                    title: "Ngày Nhắc Việc",
                    width: "7%",
                    display: function (data) {

                        if (Global.Data.IsAdmin && !Global.Data.IsPM_JobApprove) {
                            var text = $('<input id="re_' + data.record.Index + '" re_' + data.record.Index + ' date="" type="text" class="date" /> ');
                            text.focusout(function () {
                                $('[n_' + (Global.Data.JobEReferenceArr.length) + ']').focus();
                            });
                        }
                        else {
                            var text = '';
                            if (data.record.ReminderDate != '') {
                                var date = new Date(data.record.ReminderDate)
                                text = '<span class="red bold">' + ParseDateToString(date) + '</span>';
                            }
                        }

                        var inter = setInterval(function () {
                            var d = new Date(Global.Data.yy, Global.Data.mm, Global.Data.dd);
                            if (data.record.ReminderDate != null && (data.record.ReminderDate + '').trim() != '') {
                                var date = new Date((data.record.ReminderDate + ''));
                                if ((date) == 'Invalid Date')
                                    date = new Date(parseJsonDateToDate(data.record.ReminderDate));

                                d = date;
                            }
                            var en = $("#J_end").data("kendoDateTimePicker");
                            var st = $("#J_start").data("kendoDateTimePicker");
                            $('#re_' + data.record.Index).kendoDatePicker({
                                format: "dd/MM/yyyy",
                                value: d,
                                min: st.value(),
                                max: en.value(),
                                change: function () {
                                    var vl = this.value();
                                    $.each(Global.Data.JobEReferenceArr, function (i, item) {
                                        if (item.Index == data.record.Index) {
                                            item.ReminderDate = vl;
                                            Global.Data.IsE_ReferenceChange = true;
                                            return false;
                                        }
                                    });
                                }
                            });
                            clearInterval(inter);
                        }, 100);
                        return text;
                    }
                },
                Delete: {
                    title: '',
                    width: "3%",
                    sorting: false,
                    display: function (data) {
                        if (Global.Data.IsAdmin && !Global.Data.IsPM_JobApprove) {
                            var text = $('<button title="Xóa" class="jtable-command-button jtable-delete-command-button"><span>Xóa</span></button>');
                            text.click(function () {
                                GlobalCommon.ShowConfirmDialog('Bạn có chắc chắn muốn xóa?', function () {
                                    var oldIndex = data.record.Index - 1;
                                    Global.Data.JobEReferenceArr.splice(oldIndex, 1);
                                    for (var i = oldIndex; i < Global.Data.JobEReferenceArr.length; i++) {
                                        Global.Data.JobEReferenceArr[i].Index = i + 1;
                                    }
                                    ReloadListEmployeeReference();
                                }, function () { }, 'Đồng ý', 'Hủy bỏ', 'Thông báo');
                            });
                            return text;
                        }
                    }
                }
            }
        });
    }

    function ReloadListEmployeeReference() {
        $('#' + Global.Element.Jtable_EReference).jtable('load');
    }

    function AddEmployeeReferenceEmptyObject() {
        var obj = {
            Id: 0,
            Index: Global.Data.JobEReferenceArr.length + 1,
            EmployeeId: 0,
            Name: '',
            ReminderDate: ''
        }
        Global.Data.JobEReferenceArr.push(obj);
    }

    function GetAllEmployee() {
        $.ajax({
            url: Global.UrlAction.GetAllEmployee,
            type: 'POST',
            data: '',
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
                                Global.Data.EmployeeeArr.push(item);
                                option += '<option value="' + item.Name + '" /> ';
                                option2 += '<option value="' + item.Value + '">' + item.Name + '</option> ';
                            });
                        }
                        $('#employees').empty().append(option);
                        $('#FollwEmployee').empty().append(option2);
                        $('#FollwEmployee').kendoMultiSelect().data("kendoMultiSelect");
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

    function GetParentJob() {
        $.ajax({
            url: Global.UrlAction.GetParentJob,
            type: 'POST',
            data: JSON.stringify({ 'ProtimeId': $('#ProTimeId').val() }),
            contentType: 'application/json charset=utf-8',
            beforeSend: function () { $('#loading').show(); },
            success: function (data) {
                $('#loading').hide();
                GlobalCommon.CallbackProcess(data, function () {
                    if (data.Result == "OK") {
                        var str = '';
                        $.each(data.Records, function (i, item) {
                            str += '<option  value="' + item.Value + '">' + item.Name + '</option>';
                        });
                        $('[parentJob]').empty().append(str);
                    }
                    else
                        GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình xử lý.");
                }, false, '', true, true, function () {
                    var msg = GlobalCommon.GetErrorMessage(data);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
                });
            }
        });
    }

    function GetLastJobIndex() {
        $.ajax({
            url: Global.UrlAction.GetLastIndex,
            type: 'POST',
            data: JSON.stringify({ 'Id': Global.Data.CL_OrganId }),
            contentType: 'application/json charset=utf-8',
            success: function (data) {
                if (data.Result == "OK") {
                    Global.Data.LastIndex = data.Records;
                    $('#J_OrderIndex').val((Global.Data.phaseLastIndex + 1));
                }
                else
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình xử lý.");
            }
        });
    }

    function setColor() {
        $($($('[re]').parent()).parent()).css({ 'background': 'red', 'color': 'white' });
    }

    /*************************************************************************************************************************************
    *                                                 PRODUCTION REQUIRE                                                                 *
    **************************************************************************************************************************************/
    function InitPopupProRequire() {
        $('#' + Global.Element.Popup_Create_ProRequire).on('shown.bs.modal', function (e) {
            $('[prore_line]').change();
            if ($('#proRe_Id').val() == '0' || $('#proRe_Id').val() == '') {
                $('#prore_ReQuantity').val(Global.Data.Quantity - Global.Data.AllQuantity);
                $("#prore_start").data("kendoDateTimePicker").value( Global.Data.ProTimeStart );
              //  $("#prore_end").data("kendoDateTimePicker").value(kendo.toString(Global.Data.ProTimeEnd, 'dd/MM/yyyy hh:mm tt'));
 }
        });
        $("#" + Global.Element.Popup_Create_ProRequire).modal({ keyboard: false, show: false });
        $("#" + Global.Element.Popup_Create_ProRequire + ' button[save]').click(function () {
            if (Global.Data.IsAdmin) {
                if ($('[prore_line]').val() == '')
                    GlobalCommon.ShowMessageDialog("Vui lòng chọn chuyền sản xuất.", function () { $('[prore_line]').select(); }, "Lỗi Nhập liệu");
                else if ($('#prore_hours').val() == '')
                    GlobalCommon.ShowMessageDialog("Vui lòng nhập thời gian làm việc.", function () { $('#prore_hours').select(); }, "Lỗi Nhập liệu");
                else if ($('#prore_ReQuantity').val() == '')
                    GlobalCommon.ShowMessageDialog("Vui lòng nhập sản lượng phân công sản xuất.", function () { $('#prore_ReQuantity').select(); }, "Lỗi Nhập liệu");
                else if ($('#prore_start').val() == '')
                    GlobalCommon.ShowMessageDialog("Vui lòng chọn thời gian bắt đầu sản xuất.", function () { $('#prore_ReQuantity').select(); }, "Lỗi Nhập liệu");
                else if ($('#prore_end').val() == '')
                    GlobalCommon.ShowMessageDialog("Vui lòng chọn thời gian kết thúc sản xuất.", function () { $('#prore_ReQuantity').select(); }, "Lỗi Nhập liệu");
                else
                    SaveProRequire();
            }
            else
                $("#" + Global.Element.Popup_Create_ProRequire + ' button[cancel]').click();
        });
        $("#" + Global.Element.Popup_Create_ProRequire + ' button[cancel]').click(function () {
            $("#" + Global.Element.Popup_Create_ProRequire).modal("hide");
            $('#proRe_Id').val('0');
            Global.Data.workingTime = 8;
            $('#prore_hours').val(Global.Data.workingTime);
            $('#prore_ReQuantity').val('1');
            $('#prore_CuQuantity').val('0');
            $('#prore_Note').val('');
            Global.Data.EditQuantity = 0;
            $('#prore_end').val("");
            $("#end-switch").data("kendoMobileSwitch").check(false);
        });
        $("#end-switch").kendoMobileSwitch({
            onLabel: "Có",
            offLabel: "Không"
        });
        $('#prore_hours').change(function () { Global.Data.workingTime = parseFloat($('#prore_hours').val()); ResetNormsOfDay() });
        $('#prore_ReQuantity').change(function () {
            if (Global.Data.Quantity < ((Global.Data.AllQuantity + parseInt($('#prore_ReQuantity').val())) - Global.Data.EditQuantity)) {
                GlobalCommon.ShowMessageDialog("Theo số liệu lô sản xuất thì bạn chỉ còn phân công được : " + (Global.Data.Quantity - (Global.Data.AllQuantity - Global.Data.EditQuantity)) + " (" + Global.Data.unit + ").<br/>Vui lòng kiểm tra lại.", function () { $('[prore_line]').select(); }, "Lỗi Nhập liệu");
                $('#prore_ReQuantity').val(Global.Data.Quantity - (Global.Data.AllQuantity - Global.Data.EditQuantity));
            }
            TinhGoiy();
        });
    }

    function InitListProRequire() {
        $('#' + Global.Element.jtableProRequire).jtable({
            title: '<span class="blue">Danh sách phân công sản xuất</span>',
            paging: true,
            pageSize: 10,
            pageSizeChange: true,
            sorting: true,
            selectShow: true,
            actions: {
                listAction: Global.UrlAction.GetlistProRequire,
                createAction: Global.Element.Popup_Create_ProRequire
            },
            messages: {
                addNewRecord: 'Thêm phân công',
                selectShow: 'Ẩn hiện cột'
            },
            fields: {
                Id: {
                    key: true,
                    create: false,
                    edit: false,
                    list: false
                },
                LineId: {
                    title: 'Chuyền',
                    width: '20%',
                    display: function (data) {
                        txt = '<span  >' + data.record.LineName + '</span> Giờ';
                        return txt;
                    }
                },
                WorkingTime: {
                    title: "TG làm việc",
                    width: "5%",
                    display: function (data) {
                        txt = '<span class="bold red">' + data.record.WorkingTime + '</span> Giờ';
                        return txt;
                    }
                },
                ReQuantity: {
                    title: 'SL phân công',
                    width: '5%',
                    display: function (data) {
                        Global.Data.AllQuantity += data.record.ReQuantity;
                        var txt = '<span class="red bold">' + data.record.ReQuantity + '</span> ' + Global.Data.unit;
                        return txt;
                    }
                },
                CuQuantity: {
                    title: 'Tiến độ sản xuất',
                    width: '5%',
                    display: function (data) {
                        var txt = '<span class="red bold">' + data.record.CuQuantity + '</span> ' + Global.Data.unit;
                        return txt;
                    }
                },
                StartDate: {
                    title: 'TG Bắt Đầu',
                    width: '5%',
                    display: function (data) {
                        var date = new Date(parseJsonDateToDate(data.record.StartDate))
                        txt = '<span class="">' + ParseDateToString(date) + '</span>';
                        return txt;
                    }
                },
                EndDate: {
                    title: 'TG Kết Thúc (Dự Kiến)',
                    width: '5%',
                    display: function (data) {
                        var date = new Date(parseJsonDateToDate(data.record.EndDate))
                        var txt = '<span class="red bold">' + ParseDateToString(date) + '</span>';
                        return txt;
                    }
                },
                IsDone: {
                    title: 'Kết thúc SX',
                    width: "7%",
                    display: function (data) {
                        var txt = '<i class="fa fa-square-o"></span>';
                        if (data.record.IsDone)
                            txt = '<i class="fa fa-check red"></span>';
                        return txt;
                    }
                },
                //RealEnd: {
                //    title: 'TG Kết Thúc (Thực Tế)',
                //    width: '5%',
                //    display: function (data) {
                //        if (data.record.RealEnd != null) {
                //            var date = new Date(parseJsonDateToDate(data.record.RealEnd))
                //            var txt = '<span class="red bold">' + ParseDateToString(date) + '</span>';
                //            return txt;
                //        }
                //    }
                //},
                edit: {
                    title: '',
                    width: '1%',
                    sorting: false,
                    display: function (data) {
                        var text = $('<i class="fa fa-pencil-square-o clickable blue font-20" data-toggle="modal" data-target="#' + Global.Element.Popup_Create_ProRequire + '" title="Chỉnh sửa thông tin"> </i>');
                        text.click(function () {
                            $('#proRe_Id').val(data.record.Id);
                            $('[prore_line]').val(data.record.LineId);
                            Global.Data.workingTime = data.record.WorkingTime;
                            $('#prore_hours').val(data.record.WorkingTime);
                            Global.Data.EditQuantity = data.record.ReQuantity;
                            $('#prore_ReQuantity').val(data.record.ReQuantity);
                            $('#prore_CuQuantity').val(data.record.CuQuantity);
                            $('#prore_Note').val(data.record.Note);
                            var date = new Date(parseJsonDateToDate(data.record.StartDate));
                            var date1 = new Date(parseJsonDateToDate(data.record.EndDate));
                            var start = $("#prore_start").data("kendoDateTimePicker");
                            var end = $("#prore_end").data("kendoDateTimePicker");
                            start.value(kendo.toString(date, 'dd/MM/yyyy hh:mm tt'));
                            start.trigger("change");
                            end.value(date1);
                            end.trigger("change");
                            $("#end-switch").data("kendoMobileSwitch").check(data.record.IsDone);
                            ResetNormsOfDay();
                        });
                        return text;
                    }
                },
                Delete: {
                    title: '',
                    width: "2%",
                    sorting: false,
                    display: function (data) {
                        if (Global.Data.IsAdmin) {
                            var text = $('<button title="Xóa" class="jtable-command-button jtable-delete-command-button"><span>Xóa</span></button>');
                            text.click(function () {
                                GlobalCommon.ShowConfirmDialog('Bạn có chắc chắn muốn xóa?', function () {
                                    DeleteProRequire(data.record.Id);
                                }, function () { }, 'Đồng ý', 'Hủy bỏ', 'Thông báo');
                            });
                            return text;
                        }
                    }
                }
            }
        });
    }

    function ReloadListProRequire() {
        Global.Data.AllQuantity = 0;
        $('#' + Global.Element.jtableProRequire).jtable('load', { 'Id': $('#ProTimeId').val() });
        if (!Global.Data.IsAdmin)
            $('#' + Global.Element.jtableProRequire + ' span.jtable-toolbar-item-add-record:contains("Thêm mới")').css('display', 'none');
    }
    function ResetNormsOfDay() { $('#prore_normsOfDay').html(Math.ceil(((Global.Data.workingTime * 3600) / Global.Data.ProductTime) * Global.Data.Labours)); TinhGoiy(); }
    function SaveProRequire() {
        var obj = {
            Id: $('#proRe_Id').val(),
            LineId: $('[prore_line]').val(),
            WorkingTime: parseFloat($('#prore_hours').val()),
            ReQuantity: $('#prore_ReQuantity').val(),
            CuQuantity: $('#prore_CuQuantity').val(),
            IsDone: $("#end-switch").data("kendoMobileSwitch").check(),
            StartDate: $('#prore_start').data("kendoDateTimePicker").value(),
            EndDate: $('#prore_end').data("kendoDateTimePicker").value(),
            Note: $('#prore_Note').val(),
            CL_ProTimeId: $('#ProTimeId').val(),
            OrderDetailId: Global.Data.OrderDetailId
        }
        $.ajax({
            url: Global.UrlAction.SaveProRequire,
            type: 'post',
            data: ko.toJSON(obj),
            contentType: 'application/json',
            beforeSend: function () { $('#loading').show(); },
            success: function (result) {
                $('#loading').hide();
                GlobalCommon.CallbackProcess(result, function () {
                    if (result.Result == "OK") {
                        ReloadListProRequire();
                        $("#" + Global.Element.Popup_Create_ProRequire + ' button[cancel]').click();
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
    function DeleteProRequire(Id) {
        $.ajax({
            url: Global.UrlAction.DeleteProRequire,
            type: 'POST',
            data: JSON.stringify({ 'Id': Id }),
            contentType: 'application/json charset=utf-8',
            beforeSend: function () { $('#loading').show(); },
            success: function (data) {
                $('#loading').hide();
                GlobalCommon.CallbackProcess(data, function () {
                    if (data.Result == "OK")
                        ReloadListProRequire();
                    else
                        GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình xử lý.");
                }, false, Global.Element.PopupOrderAnalys, true, true, function () {
                    var msg = GlobalCommon.GetErrorMessage(data);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
                });
            }
        });
    }
    function TinhGoiy() {
        if ($('#prore_start').val() != '' && Global.Data.Labours > 0) {
            var soluong = parseInt($('#prore_ReQuantity').val());
            var dm = parseInt($('#prore_normsOfDay').html());
            var ngaylv = Math.ceil(soluong / dm);
            var bd = new Date($('#prore_start').data("kendoDateTimePicker").value());
            bd.setDate(bd.getDate() + ngaylv);
            $('#end-date-sugest').html(ParseDateToString(bd));

            $('#prore_end').data("kendoDateTimePicker").value( bd );

            //var e = $('#prore_end').data("kendoDateTimePicker");
            //e.value(bd);
        }
    }


}
