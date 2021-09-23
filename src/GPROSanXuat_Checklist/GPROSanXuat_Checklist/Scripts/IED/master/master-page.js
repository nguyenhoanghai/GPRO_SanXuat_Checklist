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
GPRO.namespace('Master');
GPRO.Master = function () {
    var Global = {
        UrlAction: {

        },
        Element: {

        },
        Data: {

        }
    }
    this.GetGlobal = function () {
        return Global;
    }

    this.Init = function () {
        RegisterEvent();
        if ($.cookie('sound') == undefined)
            $.cookie('sound', '');
        $('#menu_toggle').click();

        GetAlert();
        setInterval(function () { GetAlert(); }, 5000);

        //  RequestAlarm();
        setInterval(function () { RequestAlarm(); }, 50000);

        //$.playSound("/Sounds/sound", $.cookie('sound'))
    }

    var RegisterEvent = function () {
        $('#alarm_dropdown').mouseleave(function () {
            $('#alarm_dropdown').hide();
        });

        $('#alert_dropdown').mouseleave(function () {
            $('#alert_dropdown').hide();
        });

        $('#icon-cl').click(function () {
            CloseNotify();
        });

        $('#icon-speaker').click(function () {
            if ($(this).hasClass('fa-volume-off')) {
                $($('audio')[0]).prop('muted', false);
                $(this).removeClass('fa-volume-off');
                $(this).addClass('fa-volume-up');
                $.cookie('sound', '');
            }
            else {
                $($('audio')[0]).prop('muted', true);
                $(this).addClass('fa-volume-off');
                $(this).removeClass('fa-volume-up');
                $.cookie('sound', 'muted');
            }
        });

        $('#bell').click(function () {
            if ($('#alarm_dropdown li').length > 0)
                $('#alarm_dropdown').show();
        });

        $('#alert').click(function () {
            if ($('#alert_dropdown li').length > 0)
                $('#alert_dropdown').show();
        });
    }

    function GetAlert() {
        $.ajax({
            url: '/CheckListuser/GetAlerts',
            type: 'POST',
            data: '',
            contentType: 'application/json charset=utf-8',
            success: function (data) {
                if (data.Result == "OK")
                    DrawAlert(data.Data);
                else
                    alert(data.ErrorMessages[0].Message, function () { }, "Đã có lỗi xảy ra trong quá trình sử lý.");
            }
        });
    }

    function DrawAlert(objs) {
        var str = '';
        if (objs.Alerts != null && objs.Alerts.length > 0) {
            $.each(objs.Alerts, function (i, item) {
                var d = new Date(parseJsonDateToDate(item.CreatedDate));
                str += '<li><div data-toggle="modal" data-target="#myModal" onclick="GetJobDetail(' + item.JobId + ')" style="cursor:pointer" class="mod-unread phenom">';
                str += '    <div style="display:flex"><div class="phenom-creator">';
                str += '        <div  class="member js-show-mem-menu">';
                str += '            <div><img src="' + item.Icon + '"   alt=" " title=" " class="member-avatar"></div>';
                str += '        </div>';
                str += '    </div>';
                str += '    <div class="phenom-desc">' + item.Alert;
                if (item.ObjectType != 20) {
                    str += '        <div class="comment-container">';
                    str += '            <div class="action-comment markeddown js-comment">';
                    str += '                <div class="current-comment js-friendly-links js-open-card">' + item.MainContent;

                    str += '                </div>';
                    str += '            </div>';
                    str += '        </div>';
                }
                str += '    </div></div>';
                str += '    <p class="phenom-meta quiet"><span  class="date" title="' + ParseDateToString(d) + '">' + ParseDateToString_cl(d) + '</span></p>';
                str += '    <div class="phenom-close" onclick="DisableAlert(' + item.Id + ')">';
                str += '        <span class="fa fa-times" title=""> </span>';
                str += '    </div>';
                str += '</div> </li>';
            });
            str += '<label class="control-label" style="padding:0 15px">Bạn có <span class="red bold" id="unread">' + objs.Unread + '</span> thông báo mới.</label> <a target="_blank" href="/Alert/Index"><i>Xem tất cả.</i></a>  ';
            $('.header-notifications').addClass('new-notifications');
            $('.fa-bell-o').addClass('red');
            $('[newNotify]').html(objs.Unread).show();
        }
        else {
            str += '<li><p class="empty" style="padding: 24px 6px;"><span>Không có thông báo</span></p></li>';
            $('.fa-bell-o').removeClass('red');
            $('[newNotify]').hide();
        }
        $('#menu2').html(str);
    }

    function DisableAlert(id) {
        $.ajax({
            url: Global.UrlAction.DisableAlert,
            type: 'POST',
            data: JSON.stringify({ 'Id': id }),
            contentType: 'application/json charset=utf-8',
        });
    }

    function RequestAlarm() {
        $.ajax({
            url: '/ChecklistUser/RequestAlarm',
            type: 'POST',
            data: '',
            contentType: 'application/json charset=utf-8',
            success: function (data) {
                if (data != null) {
                    processAlarm(data.Alarms);
                    processReference(data.Refer);
                }
                else {
                    $('#job-alarm').hide();
                    $('#job-alarm').html(0);
                }
            }
        });
    }

    function processAlarm(data) {
        if (data != null && data.length > 0) {
            var box = $('.no-content-box');
            var alramDropdown = $('#menu1');
            box.empty();
            alramDropdown.empty();
            var alarmCount = 0;
            $.each(data, function (o, item) {
                if (!item.IsStopAlarm) {
                    var ul = $('<ul></ul>');
                    ul.append('<li>Dự Án : <span class="red ">' + item.ProjectName + '</span></li>');
                    // ul.append('<li>Sản phẩm : <span class="red ">' + item.CommoName + '</span></li>');
                    // ul.append('<li>Lô sản xuất : <span class="red ">' + item.ProTimeName + '</span></li>');
                    ul.append('<li>Bước công việc : <span class="red ">' + item.JobStepName + '</span></li>');
                    ul.append('<li>Công việc : <span class="red ">' + item.Name + '</span></li>');
                    ul.append('<li>Trạng thái công việc : <span class="red ">' + GetStatus(item.StatusId) + '</span></li>');
                    ul.append('<li>Ngày hết hạn : <span class="red ">' + ddMMyyyyHHmm(item.EndDate) + '</span></li>');
                    box.append(ul);
                    alarmCount++;
                }

                var lii = '<li><a>';
                lii += '<span class="image"><img src="' + item.CurrentUserIcon + '" alt="Profile Image" style="margin-right:17px" /></span>';
                lii += '<span><span>' + item.EmployeeName + '</span> </span>';
                lii += '<span class="message">';
                lii += 'Dự Án : <span class="red ">' + item.ProjectName + '</span></br>';
                // lii += 'Sản phẩm : <span class="red ">' + item.CommoName + '</span> </br>';
                // lii += 'Lô sản xuất : <span class="red ">' + item.ProTimeName + '</span></br> ';
                // if (typeof (item.JobGroupName) != "undefined" && item.JobGroupName != "")
                lii += 'Bước công việc : <span class="red ">' + item.JobStepName + '</span></br> ';
                lii += 'Công Việc : <span class="red ">' + item.Name + '</span></br> ';
                lii += 'Trạng thái công việc : <span class="red ">' + GetStatus(item.StatusId) + '</span></br> ';
                lii += 'Ngày hết hạn : <span class="red ">' + ddMMyyyyHHmm(item.EndDate) + '</span>';
                lii += '</span>';
                lii += '</a></li>';

                alramDropdown.append(lii);
            });
            $('#lockNo').html('');
            if (alarmCount > 0)
                callAlert();

            if (data.length > 0)
                $('#lockNo').html(data.length);

            $('#job-alarm').show();
            $('#job-alarm').html(data.length);

        }
        else {
            $('#job-alarm').hide();
            $('#job-alarm').html(0);
            $('#lockNo').html('');
        }
    }



    function processReference(data) {
        if (data != null && data.length > 0) {
            var box = $('.no-content-box');
            var alertDropdown = $('#alert_dropdown ul');
            // box.empty();
            var str = $('<div></div>');
            alertDropdown.empty();
            var alarmCount = 0;
            $.each(data, function (o, item) {
                if (!item.IsStopAlarm) {
                    var ul = $('<ul></ul>');
                    var li = $();
                    ul.append('<li>Dự Án : <span class="red ">' + item.ProjectName + '</span></li>');
                    ul.append('<li>Công Việc : <span class="red ">' + item.Name + '</span></li>');
                    ul.append('<li>Người phụ trách : <span class="red ">' + item.EmployeeName + '</span></li>');
                    ul.append('<li>Trạng thái công việc : <span class="red ">' + item.PercentComplete + '%</span></li>');
                    ul.append('<li>Ngày hết hạn : <span class="red ">' + parseJsonDateToDate(item.TimeEnd).toLocaleString() + '</span></li>');
                    str.append(ul);
                    alarmCount++;
                }

                var lii = $('<li></li>');
                var ul1 = $('<ul></ul>');
                ul1.append('<li>Dự Án : <span class="red ">' + item.ProjectName + '</span></li>');
                ul1.append('<li>Người phụ trách : <span class="red ">' + item.EmployeeName + '</span></li>');
                if (typeof (item.JobGroupName) != "undefined" && item.JobGroupName != "")
                    ul1 += 'Nhóm Công Việc : <span class="red ">' + item.JobGroupName + '</span></br> ';
                ul1.append('<li>Công Việc : <span class="red ">' + item.Name + '</span></li>');
                ul1.append('<li>Trạng thái công việc : <span class="red ">' + item.PercentComplete + '%</span></li>');
                ul1.append('<li>Ngày hết hạn : <span class="red ">' + parseJsonDateToDate(item.TimeEnd).toLocaleString() + '</span></li>');
                lii.append(ul1);
                alertDropdown.append(lii);
            });
            if (alarmCount > 0) {
                var as = setInterval(function () {
                    box.empty().append(str);
                    callAlert();
                    clearInterval(as);
                }, 15000);
            }
            $('#alert-alarm').show();
            $('#alert-alarm').html(data.length);
        }
        else {
            $('#alert-alarm').hide();
            $('#alert-alarm').html(0);
        }
    }


    function callAlert() {
        //var sound = new Audio('/Sounds/sound.mp3');
        //sound.loop = true;
        // sound.play();


        $.playSound("/Sounds/sound", $.cookie('sound'))
        var ab = setInterval(function () {
            $.playSound("/Sounds/sound", $.cookie('sound'))
        }, 4000);
        $('#notify_box').show();
        $('#icon-speaker').removeClass('fa-volume-off');
        $('#icon-speaker').removeClass('fa-volume-up');
        if ($.cookie('sound') == '')
            $('#icon-speaker').addClass('fa-volume-up');
        else
            $('#icon-speaker').addClass('fa-volume-off');

        var a = setInterval(function () {
            CloseNotify();
            clearInterval(a);
            clearInterval(ab);
        }, 50000);
    }
    function CloseNotify() {
        $('#notify_box').hide();
        $.removeSound();
    }
}

$(document).ready(function () {
    var obj = new GPRO.Master();
    obj.Init();


});

function GetJobDetail(jobId) {
    $.ajax({
        url: '/CheckListuser/GetJobById',
        type: 'POST',
        data: JSON.stringify({ 'jobId': jobId }),
        contentType: 'application/json charset=utf-8',
        beforeSend: function () { $('#loading').show(); },
        success: function (data) {
            $('#loading').hide();
            if (data.Result == "OK") {
                $('#jobId').val(data.Data.Id);
                $('#jobName').html(data.Data.Name); //jobId
                $('#jobGroupName').html(data.Data.JobGroupName);
                $('#statusName').html(data.Data.StatusName);
                $('#jobRequired').html(data.Data.JobContent);
                $('#employeeName').attr('src', data.Data.EmployIcon);
                //  $('#employeeName').attr('srcset', data.Data.Icon);
                $('#employeeName').attr('alt', data.Data.EmployName);
                $('#employeeName').attr('title', data.Data.EmployName);
                $('#currentUser').attr('src', data.Data.CurrentUserIcon);
                // $('#currentUser').attr('srcset', data.Data.CurrentUserIcon);
                $('#currentUser').attr('alt', data.Data.CurrentUserName);
                $('#currentUser').attr('title', data.Data.CurrentUserName);

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
                        str += '            <a class="attachment-thumbnail-details-options-item dark-hover js-download" href="' + item.Url + '" target="_blank" >';
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
        }
    });
}

function GetStatus(id) {
    var str = '';
    switch (id) {
        case 1: str = "Soạn thảo"; break;
        case 2: str = "Đang xử lý"; break;
        case 4: str = "Lỗi"; break;
        case 3: str = "Chờ duyệt"; break;
        case 5: str = "Hoàn thành"; break;
    }
    return str;
}

