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
GPRO.namespace('Gantt');
GPRO.Gantt = function () {
    var Global = {
        UrlAction: {
            GetOders: '/CheckList/GetChecklistSelect',
            GetById: '/ProjectAnalys/GetGainttLine',
        },
        Element: {
        },
        Data: {
            isDraw: false,
            Checklists: []
        }
    }
    this.GetGlobal = function () {
        return Global;
    }

    this.Init = function () {
        RegisterEvent();
        GetProSelect();
        InitGantt_();
        GetData(0);


    }


    var RegisterEvent = function () {
        $('#proAna').change(function () {
            if ($('#proAna').val() != '') {
                var obj = {};
                $.each(Global.Data.Checklists, function (i, item) {
                    if (item.Name == $('#proAna').val()) {
                        obj = item;
                        return false;
                    }
                });
                if (obj != null)
                    GetData(obj.Value);
            }
        });

        $('#btn-pdf').click(function () {
            if ($('#gantt_here').html() != '') {
                exportGantt("pdf");
            }
        });
        $('#btn-png').click(function () {
            if ($('#gantt_here').html() != '') {
                exportGantt("png");
            }
        });

        $('input:radio[name="zoom"]').change(function () {
            if ($('#proAna').val() != '0') {
                GanttConfig();
                GetData();
            }
        });
    }

    function GetProSelect() {
        $.ajax({
            url: Global.UrlAction.GetOders,
            type: 'POST',
            data: '',
            contentType: 'application/json charset=utf-8',
            success: function (data) {
                GlobalCommon.CallbackProcess(data, function () {
                    if (data.Result == "OK") {
                        var str = '';
                        $.each(data.Records, function (i, item) {
                            str += '<option >' + item.Name + '</option>';
                            Global.Data.Checklists.push(item);
                        });
                        $('#source').empty().html(str);
                    }
                    else
                        GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình sử lý.");
                }, false, Global.Element.PopupGantt, true, true, function () {

                    var msg = GlobalCommon.GetErrorMessage(data);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
                });
            }
        });
    }

    function GetData(Id) {
        $.ajax({
            url: Global.UrlAction.GetById,
            type: 'POST',
            //   data: JSON.stringify({ 'Id': Id }),
            contentType: 'application/json charset=utf-8',
            beforeSend: function () { $('#loading').show(); },
            success: function (data) {
                $('#loading').hide();
                GlobalCommon.CallbackProcess(data, function () {
                    if (data.Result == "OK") {
                        CreateGantt(data.Records);
                    }
                    else
                        GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình sử lý.");
                }, false, Global.Element.PopupGantt, true, true, function () {

                    var msg = GlobalCommon.GetErrorMessage(data);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
                });
            }
        });
    }

    function CreateGantt(objs) {
        var linkId = 1;
        var data = [];
        var link = [];
        //var begin = parseJsonDateToDate(objs.Start);
        //data.push({
        //    id: objs.Id,
        //    text: objs.Name,
        //    type: "project",
        //    order: 0,
        //    progress: 0,
        //    start_date: begin,
        //    end_date: parseJsonDateToDate(objs.End),//parseJsonDateToDate(item.RealEnd),
        //    planned_start: begin,
        //    planned_end: parseJsonDateToDate(objs.End),
        //    open: true,
        //    parent: 0,
        //    status_name: '',
        //    employee: ''
        //});

        //link.push({
        //    id: linkId,
        //    source: 0,
        //    target: objs.Id,
        //    type: '1'
        //});
        //linkId++;

        $.each(objs, function (i, product) {
            data.push({
                id: product.Id,
                text: product.Name,
                type: "",
                order: i,
                progress: 0,
                start_date: parseJsonDateToDate(product.Start),
                end_date: parseJsonDateToDate(product.End),//parseJsonDateToDate(item.RealEnd),
                planned_start: parseJsonDateToDate(product.Start),
                planned_end: parseJsonDateToDate(product.End),
                open: true,
                parent: 0,
                status_name: '',
                employee: ''
            });

            link.push({
                id: linkId,
                source: 0,
                target: product.Id,
                type: '0'
            });
            linkId++;

            if (product.Jobs.length > 0) {
                $.each(product.Jobs, function (iiii, job) {
                    job.Id = job.Id + 100000;
                    var rEnd = new Date();
                    if (job.RealEnd != null)
                        rEnd = parseJsonDateToDate(job.RealEnd);
                    data.push({
                        id: job.Id,
                        text: job.Name,
                        order: iiii,
                        progress: Math.round((rEnd - parseJsonDateToDate(job.End)) / 1000 / 60 / 60 / 24),
                        start_date: parseJsonDateToDate(job.Start),
                        end_date: rEnd,
                        planned_start: parseJsonDateToDate(job.Start),
                        planned_end: parseJsonDateToDate(job.End),
                        open: false,
                        parent: product.Id,
                        status_name: '',
                        employee: '',
                    });
                    link.push({
                        id: linkId,
                        source: product.Id,
                        target: job.Id,
                        type: '0'
                    });
                    linkId++;
                });
            }


        });
        var tasks = {
            data: data,
            links: link
        };

        gantt.clearAll();
        gantt.parse(tasks, "json");

    }

    //export
    function exportGantt(mode) {
        if (mode == "png")
            //gantt.exportToPNG({
            //    header: '<link rel="stylesheet" href="http://dhtmlx.com/docs/products/dhtmlxGantt/common/customstyles.css" type="text/css">'
            //});
            gantt.exportToPNG();
        else if (mode == "pdf")
            gantt.exportToPDF({
                header: '<link rel="stylesheet" href="http://dhtmlx.com/docs/products/dhtmlxGantt/common/customstyles.css" type="text/css">'
            });
    }
    //group
    function showGroups(listname) {
        if (listname) {
            gantt.groupBy({
                groups: gantt.serverList(listname),
                relation_property: listname,
                group_id: "key",
                group_text: "label"
            });
            gantt.sort("start_date");
        } else {
            gantt.groupBy(false);

        }
    }

    function InitGantt_() {
        gantt.config.task_height = 16;
        gantt.config.row_height = 40;
        gantt.locale.labels.baseline_enable_button = 'Set';
        gantt.locale.labels.baseline_disable_button = 'Remove';

        gantt.config.lightbox.sections = [
            { name: "description", height: 70, map_to: "text", type: "textarea", focus: true },
            { name: "time", map_to: "auto", type: "duration" },
            { name: "baseline", map_to: { start_date: "planned_start", end_date: "planned_end" }, button: true, type: "duration_optional" }
        ];
        gantt.config.lightbox.project_sections = [
            { name: "description", height: 70, map_to: "text", type: "textarea", focus: true },
            { name: "time", map_to: "auto", type: "duration", readonly: true },
            { name: "baseline", map_to: { start_date: "planned_start", end_date: "planned_end" }, button: true, type: "duration_optional" }
        ];
        gantt.config.lightbox.milestone_sections = [
            { name: "description", height: 70, map_to: "text", type: "textarea", focus: true },
            { name: "time", map_to: "auto", type: "duration", single_date: true },
            { name: "baseline", single_date: true, map_to: { start_date: "planned_start", end_date: "planned_end" }, button: true, type: "duration_optional" }
        ];

        gantt.locale.labels.section_baseline = "Planned";


        // adding baseline display
        gantt.addTaskLayer(function draw_planned(task) {
            if (task.planned_start && task.planned_end) {
                var sizes = gantt.getTaskPosition(task, task.planned_start, task.planned_end);
                var el = document.createElement('div');
                el.className = 'baseline';
                el.style.left = sizes.left + 'px';
                el.style.width = sizes.width + 'px';
                el.style.top = sizes.top + gantt.config.task_height + 13 + 'px';
                return el;
            }
            return false;
        });

        gantt.templates.task_class = function (start, end, task) {
            if (task.planned_end) {
                var classes = ['has-baseline'];
                if (end.getTime() > task.planned_end.getTime()) {
                    classes.push('overdue');
                }
                return classes.join(' ');
            }
        };

        gantt.templates.rightside_text = function (start, end, task) {
            if (task.planned_end) {
                if (end.getTime() > task.planned_end.getTime()) {
                    var overdue = Math.ceil(Math.abs((end.getTime() - task.planned_end.getTime()) / (24 * 60 * 60 * 1000)));
                    var text = "<b>Trễ hạn: " + overdue + " ngày.</b>";
                    return text;
                }
            }
        };

        gantt.attachEvent("onTaskLoading", function (task) {
            task.planned_start = gantt.date.parseDate(task.planned_start, "xml_date");
            task.planned_end = gantt.date.parseDate(task.planned_end, "xml_date");
            return true;
        });

        GanttConfig();
        gantt.init("gantt_here");
    }

    function GanttConfig() {
        gantt.config.columns = [
            { name: "text", tree: true, width: 150, resize: true },
            { name: "start_date", align: "center", width: 75, resize: true, },
            { name: "planned_end", align: "center", width: 70, resize: true },
            //{ name: "add", width: 44, resize: true, hide: true },
             {
                 name: "progress", width: 80, align: "center",
                 template: function (item) {
                     //  return item.status_name + ' ' + Math.round(item.progress) + "%";
                     return item.status_name;
                 }
             },
        ];

        // full screen
        gantt.attachEvent("onTemplatesReady", function () {
            var toggle = document.createElement("i");
            toggle.className = "fa fa-arrows-alt gantt-fullscreen";
            gantt.toggleIcon = toggle;
            gantt.$container.appendChild(toggle);
            toggle.onclick = function () {
                if (!gantt.getState().fullscreen)
                    gantt.expand();
                else
                    gantt.collapse();
            };
        });
        gantt.attachEvent("onExpand", function () {
            var icon = gantt.toggleIcon;
            if (icon)
                icon.className = icon.className.replace("fa-arrows-alt", "fa-compress");
        });
        gantt.attachEvent("onCollapse", function () {
            var icon = gantt.toggleIcon;
            if (icon)
                icon.className = icon.className.replace("fa-compress", "fa-arrows-alt");
        });

        // color weekend
        gantt.templates.scale_cell_class = function (date) {
            if (date.getDay() == 0 || date.getDay() == 6)
                return "weekend";
        };
        gantt.templates.task_cell_class = function (item, date) {
            if (date.getDay() == 0 || date.getDay() == 6)
                return "weekend"
        };

        // show percent in column
        gantt.templates.progress_text = function (start, end, task) {
            return "<span style='text-align:left; color:#f7e609'>Trể hạn :" + (task.progress>0?task.progress:0) + " ngày.</span>";
        };

        //gantt.config.duration_unit = "hour"; // dvt
        //gantt.config.duration_step = 3;  //
        gantt.config.details_on_dblclick = false;
        //gantt.config.fit_tasks = true;
        //gantt.config.preserve_scroll = false;
        //  gantt.config.readonly = true; // chi xem ko dc thao tac

        //gantt.config.lightbox.sections = [
        //	{name: "description", height: 70, map_to: "text", type: "textarea", focus: true},
        //	{name: "time", type: "duration", map_to: "auto"}
        //];

        gantt.config.date_grid = "%d/%m/%Y";
        gantt.config.drag_move = false;

        gantt.config.scale_height = 90;

        var weekScaleTemplate = function (date) {
            var dateToStr = gantt.date.date_to_str("%d %F");
            var weekNum = gantt.date.date_to_str("(Tuần %W)");
            var endDate = gantt.date.add(gantt.date.add(date, 1, "week"), -1, "day");
            return dateToStr(date) + " <i class='fa fa-arrow-right'></i> " + dateToStr(endDate) + " " + weekNum(date);
        };

        //gantt.config.subscales = [
        //    { unit: "week", step: 1, template: weekScaleTemplate },
        //    { unit: "day", step: 1, date: "%j, %D" },
        //      { unit: "hour", step: 1, date: "%H" }
        //];

        switch ($('input:radio[name="zoom"]:checked').val()) {
            case "week":
                gantt.config.scale_unit = "day";
                gantt.config.date_scale = "%d %M";
                gantt.config.step = 1;
                gantt.config.scale_height = 60;
                gantt.config.min_column_width = 30;
                gantt.config.subscales = [
                      { unit: "hour", step: 1, date: "%H" }
                ];
                // show_scale_options("hour");
                $('#proAna').change();
                break;
            case "trplweek":
                //gantt.config.min_column_width = 70;
                //gantt.config.scale_unit = "day";
                //gantt.config.date_scale = "%d %M";
                gantt.config.scale_unit = "month";
                gantt.config.step = 1;
                gantt.config.date_scale = "%F, %Y";
                gantt.config.min_column_width = 70;
                gantt.config.subscales = [
                   //  { unit: "week", step: 1, template: weekScaleTemplate },
                     { unit: "day", step: 1, date: "%j, %D" },
                ];
                gantt.config.scale_height = 50;
                // show_scale_options("day");
                $('#proAna').change();
                break;
            case "month":
                gantt.config.min_column_width = 70;
                gantt.config.scale_unit = "week";
                gantt.config.date_scale = "Week #%W";
                gantt.config.subscales = [
                      { unit: "day", step: 1, date: "%D" }
                ];
                //   show_scale_options();
                gantt.config.scale_height = 60;
                $('#proAna').change();
                break;
            case "year":
                gantt.config.min_column_width = 70;
                gantt.config.scale_unit = "month";
                gantt.config.date_scale = "%M";
                gantt.config.scale_height = 60;
                //  show_scale_options();
                gantt.config.subscales = [
                      { unit: "week", step: 1, date: "#%W" }
                ];
                $('#proAna').change();
                break;
        }

        gantt.locale.labels.section_baseline = "Planned";


        // cho phep kéo núm thay đổi tiến độ cv
        gantt.config.drag_progress = false;

        //gantt.config.scale_unit = "month";
        //gantt.config.date_scale = "%F, %Y";

        //gantt.config.subscales = [
        //   { unit: "day", step: 1, date: "%j, %D" }
        //];



        gantt.config.drag_resize = false; //ko cho thay doi duration
    }

    function InitGantt(tasks) {
        gantt.config.task_height = 16;
        gantt.config.row_height = 40;
        gantt.config.lightbox.sections = [
            { name: "description", height: 70, map_to: "text", type: "textarea", focus: true },
            { name: "time", height: 72, map_to: "auto", type: "duration" },
            {
                name: "baseline", height: 72, map_to: {
                    start_date: "start_date", end_date: "end_date"
                }, type: "duration_optional"
            }
        ];
        gantt.init("gantt_here");
    }


}
$(document).ready(function () {
    var Gantt = new GPRO.Gantt();
    Gantt.Init();
})