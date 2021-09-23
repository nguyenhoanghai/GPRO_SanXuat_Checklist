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
GPRO.namespace('CheckList');
GPRO.CheckList = function () {
    var Global = {
        UrlAction: {
            Gets: '/CheckListuser/GetAllCheckList',
            GetJobs: '/CheckListuser/GetAllJob',
            UpdateStatus: '/CheckListuser/ChangeJobStatus',
            GetJobDetail: '/CheckListuser/GetJobById',

            SaveComment: '/CheckListuser/SaveComment',
            DeleteComment: '/CheckListuser/DeleteComment',

            SaveAttach: '/CheckListuser/SaveAttach',
            DeleteAttach: '/CheckListuser/DeleteAttach',
            GetFileInfo: '/Common/GetFileInfo',

            GetEmployee: '/User/GetSelectList',

            GetAlerts: '/CheckListuser/GetAlerts',
            DisableAlert: '/CheckListuser/DisableAlert',

            SaveError: '/CheckListuser/SaveError',
            DeleteError: '/CheckListuser/DeleteError',

            SaveErrorPro: '/CheckListuser/SaveErrorPro',
            SaveErrorResult: '/CheckListuser/SaveErrorResult'
        },
        Element: {
            PopupAttach: 'modal_attach',
            PopupError_Add: 'modal_Error_add',
            PopupError_Pro: 'modal_Error_process',
            PopupError_Result: 'modal_Error_result'
        },
        Data: {
            commentId: '',
            JobErrId: 0,
            PMSUrl: '',
            userId: 0,
            FileUrl: '',
            RelatedEmployees: ''
        }
    }
    this.GetGlobal = function () {
        return Global;
    }

    this.GetJobDetail = function (jobId) {
        GetJobDetail(jobId);
    }

    this.DeleteAttachment = function (Id) {
        GlobalCommon.ShowConfirmDialog('Bạn có chắc chắn muốn xóa?', function () {
            DeleteAttachment(Id);
        }, function () { }, 'Đồng ý', 'Hủy bỏ', 'Thông báo');
    }

    this.DisableAlert = function (id) {
        DisableAlert(id);
    }

    this.Init = function () {
        Global.Data.userId = parseInt($('#Id').attr('userId'));
        RegisterEvent();
        GetCheckLists(1);
        if ($('#Id').val() != '0')
            GetJobs();

        InitPopupAttach();
       // GetEmployee();

        GetAlert();
        setInterval(function () { GetAlert(); }, 60000);
        InitPopupError_Add();
        InitPopupError_Process();
        InitPopupError_Result();
        InitDateField();
        $('#err_result').prop('checked', true).change();
    }

    var RegisterEvent = function () {
        $('#Logout').click(function () {
            window.location.href = '/Authenticate/Logout';
        });

        $('#txtComment').keyup(function () {
            if ($(this).val().trim() != '')
                $('#btnComment').attr('disabled', false);
            else
                $('#btnComment').attr('disabled', true);
        });

        $('#btnComment').click(function () {
            if ($('#txtComment').val().trim() != '')
                SaveComment();
        });

        $('#searchbox').change(function () {
            GetCheckLists(2);
        });

        $('#sortable-div .sortable-list').sortable({
            connectWith: '#sortable-div .sortable-list',
            placeholder: 'placeholder',
            update: function (event, ui) {
                UpdateStatus(ui.item.attr('myid'), $($(ui.item.parent()).parent()).attr('myid'));
            }
        });

        $('.js-boards-menu').click(function () {
            if ($('#boardPopup').hasClass('is-shown'))
                $('#boardPopup').removeClass('is-shown');
            else
                $('#boardPopup').addClass('is-shown');
        });

        $('#btnError ').click(function () {
            $('#myModal').css('z-index', 1030);
        });

        //$('.js-attach,#btnError ').click(function () {
        //    $('#myModal').css('z-index', 1030);
        //});

        $('#att_nhactoi').keypress(function (evt) {
            if (event.keyCode == 64) {
                $('#att_nhactoi_list').removeClass('hidden');
                $('#att_nhactoi').attr('disabled', true);
            }
        });

        $('.tbnDecapComment').click(function () {
            var locationObj = $('.tbnDecapComment').offset();
            $('#abc').modal('show');
            $('#abc .modal-content').css({ 'top': (locationObj.top - 41), 'left': (locationObj.left - 700) });
            Global.Data.commentId = 'txtComment';
        });

        $('.att_note').click(function () {
            var locationObj = $('.att_note').offset();
            $('#abc').modal('show');
            $('#abc .modal-content').css({ 'top': (locationObj.top - 41), 'left': (locationObj.left - 700) });
            Global.Data.commentId = 'att_note';
        });

        $('.header-notifications').click(function () {
            $('.mod-notifications').addClass('is-shown');
        });
        $('.header-member').click(function () {
            $('.dropdown-usermenu').addClass('show');
        });

        $('.dropdown-usermenu').blur(function () {
            $('.dropdown-usermenu').removeClass('show');
        })

        $('.pop-over-header-close-btn').click(function () {
            $('.mod-notifications').removeClass('is-shown');
        });

        $('.err_content').click(function () {
            var locationObj = $('.err_content').offset();
            $('#abc').modal('show');
            $('#abc').css('z-index', 2000);
            $('#abc .modal-content').css({ 'top': (locationObj.top - 41), 'left': (locationObj.left - 700) });
            Global.Data.commentId = 'err_member';
        });

        $('.err_solution').click(function () {
            var locationObj = $('.err_solution').offset();
            $('#abc').modal('show');
            $('#abc').css('z-index', 2000);
            $('#abc .modal-content').css({ 'top': (locationObj.top - 41), 'left': (locationObj.left - 700) });
            Global.Data.commentId = 'err_solution';
        });

        $('.err_sms').click(function () {
            var locationObj = $('.err_sms').offset();
            $('#abc').modal('show');
            $('#abc').css('z-index', 2000);
            $('#abc .modal-content').css({ 'top': (locationObj.top - 41), 'left': (locationObj.left - 700) });
            Global.Data.commentId = 'err_sms';
        });

        $('#err_result').change(function () {
            $('.kt,.kkt').removeClass('hidden');
            if ($(this).prop('checked'))
                $('.kkt').addClass('hidden');
            else
                $('.kt').addClass('hidden');
        });

        $('#att_code').change(function () { GetFileInfo(); });

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
            data: JSON.stringify({ 'jobId': $('#jobId').val(), 'name': fileName, 'code': filePath, 'note': '' }),
            contentType: 'application/json charset=utf-8',
            beforeSend: function () { $('#loading').show(); },
            success: function (data) {
                $('#loading').hide();
                GlobalCommon.CallbackProcess(data, function () {
                    if (data.Result == "OK") {
                        $('#p-file-upload').val('');
                        GetJobDetail($('#jobId').val());
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

    function InitDateField() {
        $("#err_time").kendoDateTimePicker({
            format: "dd/MM/yyyy hh:mm tt",
            // value: new Date(Global.Data.yy, Global.Data.mm, Global.Data.dd),
            change: function () {
                //var value = this.value();
                //var dp = $("#jg_end").data("kendoDateTimePicker");
                //dp.min(value);
            }
        });

        $("#err_finishDK").kendoDateTimePicker({
            format: "dd/MM/yyyy hh:mm tt",
        });

        $("#err_finishTT").kendoDateTimePicker({
            format: "dd/MM/yyyy hh:mm tt",
        });


    }

    /******************************************************************************************************/
    /*******************************************        CHECLIST       ******************************************/
    /******************************************************************************************************/
    function GetCheckLists(times) {
        $.ajax({
            url: Global.UrlAction.Gets,
            type: 'POST',
            data: JSON.stringify({ 'Keyword': $('#searchbox').val() }),
            contentType: 'application/json charset=utf-8',
            success: function (data) {
                GlobalCommon.CallbackProcess(data, function () {
                    if (data.Result == "OK")
                        DrawChecklist(data.Data, times);
                    else
                        GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình sử lý.");
                }, false, Global.Element.PopupCheckList, true, true, function () {

                    var msg = GlobalCommon.GetErrorMessage(data);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
                });
            }
        });
    }

    function DrawChecklist(objs, times) {
        var str = '';
        if (objs.length > 0) {
            $.each(objs, function (i, item) {
                str += `
                        <div class="main-box">
                            <a href="/CheckListuser/index/${item.Value}"   title="${item.Name}">
                                <div class="div-1" ></div>
                                <div class="div-2" ></div>
                                <div class="div-3">
                                    <div >${item.Name}</div>
                                </div> 
                            </a>
                        </div> `;


                //str += '<h3> ' + item.Name + ' <span class="circle-number">' + item.Products.length + '</span></h3>';
                //str += '<div>';
                //if (item.Products.length > 0) {
                //    str += '<ul class="sidebar-boards-list js-board-list">';
                //    $.each(item.Products, function (ii, Pro) {
                //        str += '<li class="compact-board-tile"> ' + Pro.Name + ' <span class="circle-number small">' + Pro.ProductTimes.length + '</span>';
                //        if (Pro.ProductTimes.length > 0) {
                //            str += '<ul>';
                //            $.each(Pro.ProductTimes, function (iii, ProTime) {
                //                str += '<li><a href="/CheckList/View/' + ProTime.Id + '"> ' + ProTime.Name + '</a></li>';
                //            });
                //            str += '</ul>';
                //        }
                //        str += '</li>';
                //    });
                //    str += '</ul>';
                //}
                //str += '</div>';
            });
        }
        $('#accordion').empty().html(str);
        //if (times == 1)
        //    $("#accordion").accordion();
        //else
        //    $("#accordion").accordion('destroy').accordion();
    }

    /******************************************************************************************************/
    /*******************************************        JOBS       ******************************************/
    /******************************************************************************************************/
    function GetJobs() {
        $.ajax({
            url: Global.UrlAction.GetJobs,
            type: 'POST',
            data: JSON.stringify({ 'checklistId': $('#Id').val() }),
            contentType: 'application/json charset=utf-8',
            beforeSend: function () { $('#loading').show(); },
            success: function (data) {
                GlobalCommon.CallbackProcess(data, function () {
                    if (data.Result == "OK") {
                        DrawJob(data.Data);
                        Global.Data.RelatedEmployees = data.Data.RelatedEmployees;
                        GetEmployee();
                    }
                    else
                        GlobalCommon.ShowMessageDialog(msg, function () { $('#loading').hide(); }, "Đã có lỗi xảy ra trong quá trình sử lý.");
                }, false, Global.Element.PopupCheckList, true, true, function () {

                    var msg = GlobalCommon.GetErrorMessage(data);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
                });
            }
        });
    }

    function DrawJob(obj) {
        var str = '';
        $('#editorJob').empty();
        $('#ProcessJobs').empty();
        $('#ErrorJobs').empty();
        $('#ApproveJobs').empty()
        $('#DoneJobs').empty();

        if (obj.EditorJobs.length > 0) {
            $.each(obj.EditorJobs, function (i, item) {
                str += '<li data-toggle="modal" data-target="#myModal" onclick="getDetail(' + item.Id + ')" myid="' + item.Id + '" class="sortable-item ' + (item.EmployeeId == Global.Data.userId ? "blue bold" : "") + '">' + item.Name;
                if (item.CommentCount > 0) {
                    str += '<div class="badges">';
                    str += '    <span class="js-badges">';
                    str += '        <div class="badge is-unread-notification" title="Thông báo chưa đọc"><span class="badge-icon icon-sm fa fa-bell-o"></span><span class="badge-text">1</span></div>';
                    if (item.CommentCount > 0)
                        str += '        <div class="badge" title="Bình luận"><i class="fa fa-comment-o"></i><span class="badge-text">' + item.CommentCount + '</span></div>';
                    if (item.Attachs.length > 0)
                        str += '        <div class="badge" title="Các tập tin đính kèm"><span class="fa fa-paperclip"></span><span class="badge-text">' + item.Attachs.length > 0 ? item.Attachs.length : "0" + '</span></div>';
                    str += '    </span>';
                    str += '    <span class="js-plugin-badges"><span></span></span>';
                    str += '</div>';
                }
                if (item.EmployeeId != null) {
                    str += '<div class="list-card-members js-list-card-members">';
                    str += '<div class="member js-member-on-card-menu" data-idmem="52e29daeb8525ea46967580c">';
                    str += '<img class="member-avatar" height="30" width="30" src="' + item.CurrentUserIcon + '" srcset="' + item.CurrentUserIcon + '" alt="' + item.EmployName + '" title="' + item.EmployName + '">';
                    str += '<span class="member-gold-badge" title="Thành viên này có Trello Gold."></span>';
                    str += '</div>';
                    str += '</div>';
                }
                str += '</li>';
            });
            $('#editorJob').html(str);
            str = '';
        }
        if (obj.ProcessJobs.length > 0) {
            $.each(obj.ProcessJobs, function (i, item) {
                str += '<li data-toggle="modal" data-target="#myModal" onclick="getDetail(' + item.Id + ')" myid="' + item.Id + '" class="sortable-item ' + (item.EmployeeId == Global.Data.userId ? "blue bold" : "") + '">' + item.Name;
                if (item.CommentCount > 0) {
                    str += '<div class="badges">';
                    str += '    <span class="js-badges">';
                    str += '        <div class="badge is-unread-notification" title="Thông báo chưa đọc"><span class="badge-icon icon-sm fa fa-bell-o"></span><span class="badge-text">1</span></div>';
                    if (item.CommentCount > 0)
                        str += '        <div class="badge" title="Bình luận"><i class="fa fa-comment-o"></i><span class="badge-text">' + item.CommentCount + '</span></div>';
                    if (item.Attachs.length > 0)
                        str += '        <div class="badge" title="Các tập tin đính kèm"><span class="fa fa-paperclip"></span><span class="badge-text">1</span></div>';
                    str += '    </span>';
                    str += '    <span class="js-plugin-badges"><span></span></span>';
                    str += '</div>';
                }
                if (item.EmployeeId != null) {
                    str += '<div class="list-card-members js-list-card-members">';
                    str += '<div class="member js-member-on-card-menu" data-idmem="52e29daeb8525ea46967580c">';
                    str += '<img class="member-avatar" height="30" width="30" src="' + item.CurrentUserIcon + '" srcset="' + item.CurrentUserIcon + '" alt="' + item.EmployName + '" title="' + item.EmployName + '">';
                    str += '<span class="member-gold-badge" title="Thành viên này có Trello Gold."></span>';
                    str += '</div>';
                    str += '</div>';
                }
                str += '</li>';
            });
            $('#ProcessJobs').html(str);
            str = '';
        }
        if (obj.ErrorJobs.length > 0) {
            $.each(obj.ErrorJobs, function (i, item) {
                str += '<li data-toggle="modal" data-target="#myModal" onclick="getDetail(' + item.Id + ')" myid="' + item.Id + '" class="sortable-item ' + (item.EmployeeId == Global.Data.userId ? "blue bold" : "") + '">' + item.Name;
                if (item.CommentCount > 0) {
                    str += '<div class="badges">';
                    str += '    <span class="js-badges">';
                    str += '        <div class="badge is-unread-notification" title="Thông báo chưa đọc"><span class="badge-icon icon-sm fa fa-bell-o"></span><span class="badge-text">1</span></div>';
                    if (item.CommentCount > 0)
                        str += '        <div class="badge" title="Bình luận"><i class="fa fa-comment-o"></i><span class="badge-text">' + item.CommentCount + '</span></div>';
                    if (item.Attachs.length > 0)
                        str += '        <div class="badge" title="Các tập tin đính kèm"><span class="fa fa-paperclip"></span><span class="badge-text">1</span></div>';
                    str += '    </span>';
                    str += '    <span class="js-plugin-badges"><span></span></span>';
                    str += '</div>';
                }
                if (item.EmployeeId != null) {
                    str += '<div class="list-card-members js-list-card-members">';
                    str += '<div class="member js-member-on-card-menu" data-idmem="52e29daeb8525ea46967580c">';
                    str += '<img class="member-avatar" height="30" width="30" src="' + item.CurrentUserIcon + '" srcset="' + item.CurrentUserIcon + '" alt="' + item.EmployName + '" title="' + item.EmployName + '">';
                    str += '<span class="member-gold-badge" title="Thành viên này có Trello Gold."></span>';
                    str += '</div>';
                    str += '</div>';
                }
                str += '</li>';
            });
            $('#ErrorJobs').html(str);
            str = '';
        }
        if (obj.ApproveJobs.length > 0) {
            $.each(obj.ApproveJobs, function (i, item) {
                str += '<li  data-toggle="modal" data-target="#myModal" onclick="getDetail(' + item.Id + ')" myid="' + item.Id + '" class="sortable-item ' + (item.EmployeeId == Global.Data.userId ? "blue bold" : "") + '">' + item.Name;
                if (item.CommentCount > 0) {
                    str += '<div class="badges">';
                    str += '    <span class="js-badges">';
                    str += '        <div class="badge is-unread-notification" title="Thông báo chưa đọc"><span class="badge-icon icon-sm fa fa-bell-o"></span><span class="badge-text">1</span></div>';
                    if (item.CommentCount > 0)
                        str += '        <div class="badge" title="Bình luận"><i class="fa fa-comment-o"></i><span class="badge-text">' + item.CommentCount + '</span></div>';
                    if (item.Attachs.length > 0)
                        str += '        <div class="badge" title="Các tập tin đính kèm"><span class="fa fa-paperclip"></span><span class="badge-text">1</span></div>';
                    str += '    </span>';
                    str += '    <span class="js-plugin-badges"><span></span></span>';
                    str += '</div>';
                }
                if (item.EmployeeId != null) {
                    str += '<div class="list-card-members js-list-card-members">';
                    str += '<div class="member js-member-on-card-menu" data-idmem="52e29daeb8525ea46967580c">';
                    str += '<img class="member-avatar" height="30" width="30" src="' + item.CurrentUserIcon + '" srcset="' + item.CurrentUserIcon + '" alt="' + item.EmployName + '" title="' + item.EmployName + '">';
                    str += '<span class="member-gold-badge" title="Thành viên này có Trello Gold."></span>';
                    str += '</div>';
                    str += '</div>';
                }
                str += '</li>';
            });
            $('#ApproveJobs').html(str);
            str = '';
        }
        if (obj.DoneJobs.length > 0) {
            $.each(obj.DoneJobs, function (i, item) {
                str += '<li data-toggle="modal" data-target="#myModal" onclick="getDetail(' + item.Id + ')" myid="' + item.Id + '" class="sortable-item ' + (item.EmployeeId == Global.Data.userId ? "blue bold" : "") + '">' + item.Name;
                if (item.CommentCount > 0) {
                    str += '<div class="badges">';
                    str += '    <span class="js-badges">';
                    str += '        <div class="badge is-unread-notification" title="Thông báo chưa đọc"><span class="badge-icon icon-sm fa fa-bell-o"></span><span class="badge-text">1</span></div>';
                    if (item.CommentCount > 0)
                        str += '        <div class="badge" title="Bình luận"><i class="fa fa-comment-o"></i><span class="badge-text">' + item.CommentCount + '</span></div>';
                    if (item.Attachs.length > 0)
                        str += '        <div class="badge" title="Các tập tin đính kèm"><span class="fa fa-paperclip"></span><span class="badge-text">1</span></div>';
                    str += '    </span>';
                    str += '    <span class="js-plugin-badges"><span></span></span>';
                    str += '</div>';
                }
                if (item.EmployeeId != null) {
                    str += '<div class="list-card-members js-list-card-members">';
                    str += '<div class="member js-member-on-card-menu" data-idmem="52e29daeb8525ea46967580c">';
                    str += '<img class="member-avatar" height="30" width="30" src="' + item.CurrentUserIcon + '" srcset="' + item.CurrentUserIcon + '" alt="' + item.EmployName + '" title="' + item.EmployName + '">';
                    str += '<span class="member-gold-badge" title="Thành viên này có Trello Gold."></span>';
                    str += '</div>';
                    str += '</div>';
                }
                str += '</li>';
            });
            $('#DoneJobs').html(str);
            str = '';
        }
        $('#loading').hide();
    }

    function UpdateStatus(jobId, statusId) {
        $.ajax({
            url: Global.UrlAction.UpdateStatus,
            type: 'POST',
            data: JSON.stringify({ 'jobId': jobId, 'statusId': statusId }),
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
                                str += '            <a class="attachment-thumbnail-details-options-item dark-hover js-download" href="' + (Global.Data.PMSUrl + item.Url) + '" target="_blank" >';
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

    /******************************************************************************************************/
    /*******************************************        COMMENT       ******************************************/
    /******************************************************************************************************/
    function SaveComment() {
        $.ajax({
            url: Global.UrlAction.SaveComment,
            type: 'POST',
            data: JSON.stringify({ 'jobId': $('#jobId').val(), 'comment': $('#txtComment').val() }),
            contentType: 'application/json charset=utf-8',
            beforeSend: function () { $('#loading').show(); },
            success: function (data) {
                $('#loading').hide();
                GlobalCommon.CallbackProcess(data, function () {
                    if (data.Result == "OK") {
                        $('#txtComment').val('');
                        GetJobDetail($('#jobId').val());
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

    /******************************************************************************************************/
    /*******************************************        ATTACHMENT       ******************************************/
    /******************************************************************************************************/
    function InitPopupAttach() {
        $("#" + Global.Element.PopupAttach).modal({
            keyboard: false,
            show: false
        });

        $("#" + Global.Element.PopupAttach + ' button[save]').click(function () {
            if (CheckValidate()) {
                SaveAttach();
            }
        });
        $("#" + Global.Element.PopupAttach + ' button[cancel]').click(function () {
            $("#" + Global.Element.PopupAttach).modal("hide");
            $('#myModal').css('z-index', 1040);
            $('#att_name').val('');
            $('#att_code').val('');
        });
    }

    function CheckValidate() {
        if ($('#att_code').val() == "") {
            GlobalCommon.ShowMessageDialog("Vui lòng nhập mã tệp.", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        return true;
    }

    function SaveAttach() {
        $.ajax({
            url: Global.UrlAction.SaveAttach,
            type: 'POST',
            data: JSON.stringify({ 'jobId': $('#jobId').val(), 'name': $('#att_name').val(), 'code': Global.Data.FileUrl, 'note': $('#att_note').val() }),
            contentType: 'application/json charset=utf-8',
            beforeSend: function () { $('#loading').show(); },
            success: function (data) {
                $('#loading').hide();
                GlobalCommon.CallbackProcess(data, function () {
                    if (data.Result == "OK") {
                        $("#" + Global.Element.PopupAttach + ' button[cancel]').click();
                        GetJobDetail($('#jobId').val());
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

    function DeleteAttachment(id) {
        $.ajax({
            url: Global.UrlAction.DeleteAttach,
            type: 'POST',
            data: JSON.stringify({ 'jobId': $('#jobId').val(), 'Id': id }),
            contentType: 'application/json charset=utf-8',
            beforeSend: function () { $('#loading').show(); },
            success: function (data) {
                $('#loading').hide();
                GlobalCommon.CallbackProcess(data, function () {
                    if (data.Result == "OK") {
                        GetJobDetail($('#jobId').val());
                    }
                    else
                        GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình sử lý.");
                }, false, Global.Element.PopupCheckList, true, true, function () {

                    var msg = GlobalCommon.GetErrorMessage(data);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
                });
            }
        });
    };

    function GetFileInfo() {
        $.ajax({
            url: Global.UrlAction.GetFileInfo,
            type: 'POST',
            data: JSON.stringify({ 'type': $('#att_type').val(), 'code': $('#att_code').val() }),
            contentType: 'application/json charset=utf-8',
            beforeSend: function () { $('#loading').show(); },
            success: function (data) {
                GlobalCommon.CallbackProcess(data, function () {
                    $('#loading').hide();
                    if (data.Result == "OK" && data.Data != null) {
                        $('#att_name').html(data.Data.Name);
                        Global.Data.FileUrl = data.Data.Code;
                        $("#div_web").html('<object type="text/html" data="' + (Global.Data.PMSUrl + data.Data.Code) + '" ></object>');
                    }
                    else
                        GlobalCommon.ShowMessageDialog("Không tìm thấy tệp với mã bạn vừa nhập. Vui lòng kiểm tra lại.", function () { $('#att_code').select(); }, "Lỗi lấy thông tin tệp.");
                }, false, Global.Element.PopupCheckList, true, true, function () {

                    var msg = GlobalCommon.GetErrorMessage(data);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
                });
            }
        });
    }
    /******************************************************************************************************/
    /*******************************************        EMPLOYEE       ******************************************/
    /******************************************************************************************************/
    function GetEmployee() {
        $.ajax({
            url: Global.UrlAction.GetEmployee,
            type: 'POST',
            data: JSON.stringify({ 'userIds': Global.Data.RelatedEmployees }),
            contentType: 'application/json charset=utf-8',
            beforeSend: function () { $('#loading').show(); },
            success: function (data) {
                $('#loading').hide();
                GlobalCommon.CallbackProcess(data, function () {
                    if (data.Result == "OK")
                        GenEmployee(data.Records);
                    else
                        GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình sử lý.");
                }, false, Global.Element.PopupCheckList, true, true, function () {

                    var msg = GlobalCommon.GetErrorMessage(data);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
                });
            }
        });
    }

    function GenEmployee(objs) {
        var source = [];
        $.each(objs, function (i, item) {
            source.push({
                Id: item.Value,
                Name: item.Name,
                UserName: item.Data1,
                Icon: (item.Code == null ? '' : item.Code)
            });
        });

        var autocomplete = $("#customers").kendoAutoComplete({
            minLength: 1,
            dataTextField: "UserName",
            headerTemplate: '<div class="dropdown-header k-widget k-header">' +
                '<span>Hình</span>' +
                '<span>Tên</span>' +
                '</div>',
            footerTemplate: 'Total #: instance.dataSource.total() # items found',
            template: '<span class="k-state-default" style="background-image: url(\'#:data.Icon#\')"></span>' +
                '<span class="k-state-default"><h3>#:data.UserName #</h3><p>#:data.Name #</p></span>',
            dataSource: source,
            height: 400,
            select: function (e) {
                var item = this.dataItem(e.item.index())
                var text = item.UserName;
                $('#' + Global.Data.commentId).val(($('#' + Global.Data.commentId).val() + '@' + text + ' '));
                $('#abc').modal('hide');
                Global.Data.commentId = '';

            },
            close: function (e) {
                $("#customers").kendoAutoComplete();
                var autocomplete = $("#customers").data("kendoAutoComplete");
                autocomplete.value("");
                autocomplete.trigger("change");
                autocomplete.refresh();
            }
        }).data("kendoAutoComplete");
        //autocomplete.search("A");

        var autocomplete = $("#employeeSelect").kendoAutoComplete({
            minLength: 1,
            dataTextField: "UserName",
            headerTemplate: '<div class="dropdown-header k-widget k-header">' +
                '<span>Hình</span>' +
                '<span>Tên</span>' +
                '</div>',
            footerTemplate: 'Total #: instance.dataSource.total() # items found',
            template: '<span class="k-state-default" style="background-image: url(\'#:data.Icon#\')"></span>' +
                '<span class="k-state-default"><h3>#:data.UserName #</h3><p>#:data.Name #</p></span>',
            dataSource: source,
            height: 400,
            select: function (e) {
                var item = this.dataItem(e.item.index())
                var text = item.UserName;
                $('#' + Global.Data.commentId).val(($('#' + Global.Data.commentId).val() + '@' + text + ' '));
                $('#abc').modal('hide');
                Global.Data.commentId = '';

            },
            close: function (e) {
                //$("#workshop").kendoAutoComplete();
                //var autocomplete = $("#workshop").data("kendoAutoComplete");
                //autocomplete.value("");
                //autocomplete.trigger("change");
                //autocomplete.refresh();
            }
        }).data("kendoAutoComplete");
    }

    /******************************************************************************************************/
    /*******************************************        ALERT       ******************************************/
    /******************************************************************************************************/
    function GetAlert() {
        $.ajax({
            url: Global.UrlAction.GetAlerts,
            type: 'POST',
            data: '',
            contentType: 'application/json charset=utf-8',
            success: function (data) {
                GlobalCommon.CallbackProcess(data, function () {
                    if (data.Result == "OK") {
                        DrawAlert(data.Data.Alerts);
                        $('#unread').html(data.Data.Unread);
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

    function DrawAlert(objs) {
        var str = '';
        if (objs != null && objs.length > 0) {
            $.each(objs, function (i, item) {
                var d = new Date(parseJsonDateToDate(item.CreatedDate));
                str += '<div data-toggle="modal" data-target="#myModal" onclick="getDetail(' + item.JobId + ')" style="cursor:pointer" class="mod-unread phenom">';
                str += '    <div class="phenom-creator">';
                str += '        <div  class="member js-show-mem-menu">';
                str += '            <div><img src="' + item.Icon + '"   alt=" " title=" " class="member-avatar"></div>';
                str += '        </div>';
                str += '    </div>';
                str += '    <div class="phenom-desc">' + item.Alert;
                if (item.ObjectType != 20 && item.MainContent != null && item.MainContent != '') {
                    str += '        <div class="comment-container">';
                    str += '            <div class="action-comment markeddown js-comment">';
                    str += '                <div class="current-comment js-friendly-links js-open-card">' + item.MainContent;

                    str += '                </div>';
                    str += '            </div>';
                    str += '        </div>';
                }
                str += '    </div>';
                str += '    <p class="phenom-meta quiet"><span  class="date" title="' + ParseDateToString(d) + '">' + ParseDateToString_cl(d) + '</span></p>';
                str += '    <div class="phenom-close" onclick="DisableAlert(' + item.Id + ')">';
                str += '        <span class="fa fa-times" title=""> </span>';
                str += '    </div>';
                str += '</div> ';
            });
            $('.header-notifications').addClass('new-notifications');
        }
        else {
            str += '<p class="empty" style="padding: 24px 6px;"><span>Không có thông báo</span></p>';
            $('.header-notifications').removeClass('new-notifications');
        }
        $('#popupContent').html(str);
    }

    function DisableAlert(id) {
        $.ajax({
            url: Global.UrlAction.DisableAlert,
            type: 'POST',
            data: JSON.stringify({ 'Id': id }),
            contentType: 'application/json charset=utf-8',
        });
    }

    /******************************************************************************************************/
    /*******************************************        ERROR ADD       ******************************************/
    /******************************************************************************************************/
    function InitPopupError_Add() {
        $("#" + Global.Element.PopupError_Add).modal({
            keyboard: false,
            show: false
        });

        $("#" + Global.Element.PopupError_Add + ' [save]').click(function () {
            if (CheckValidate_Err())
                SaveError();
        });
        $("#" + Global.Element.PopupError_Add + ' [cancel]').click(function () {
            $("#" + Global.Element.PopupError_Add).modal("hide");
            $('#myModal').css('z-index', 1040);
            $('#err_member').val('');
            $('#err_time').val('');
        });
    }

    function CheckValidate_Err() {
        if ($('#err_member').val() == "") {
            GlobalCommon.ShowMessageDialog("Vui lòng Nhập nội dung lỗi phát sinh cần thông báo.", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        else if ($('#err_time').val() == "") {
            GlobalCommon.ShowMessageDialog("Vui lòng chọn thời điểm phát sinh lỗi.", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        return true;
    }

    function SaveError() {
        $.ajax({
            url: Global.UrlAction.SaveError,
            type: 'POST',
            data: JSON.stringify({ 'jobId': $('#jobId').val(), 'code': $('#err_code').val(), 'time': $("#err_time").data("kendoDateTimePicker").value(), 'note': $('#err_member').val() }),
            contentType: 'application/json charset=utf-8',
            beforeSend: function () { $('#loading').show(); },
            success: function (data) {
                $('#loading').hide();
                GlobalCommon.CallbackProcess(data, function () {
                    if (data.Result == "OK") {
                        $("#" + Global.Element.PopupError_Add + ' button[cancel]').click();
                        GetJobs();
                        GetJobDetail($('#jobId').val());
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

    function DeleteError(id) {
        $.ajax({
            url: Global.UrlAction.DeleteError,
            type: 'POST',
            data: JSON.stringify({ 'jobId': $('#jobId').val(), 'Id': id }),
            contentType: 'application/json charset=utf-8',
            beforeSend: function () { $('#loading').show(); },
            success: function (data) {
                $('#loading').hide();
                GlobalCommon.CallbackProcess(data, function () {
                    if (data.Result == "OK") {
                        GetJobDetail($('#jobId').val());
                    }
                    else
                        GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình sử lý.");
                }, false, Global.Element.PopupCheckList, true, true, function () {

                    var msg = GlobalCommon.GetErrorMessage(data);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
                });
            }
        });
    };

    /******************************************************************************************************/
    /*******************************************        ERROR PROCESSING       ******************************************/
    /******************************************************************************************************/
    function InitPopupError_Process() {
        $("#" + Global.Element.PopupError_Pro).modal({
            keyboard: false,
            show: false
        });

        $("#" + Global.Element.PopupError_Pro + ' [save]').click(function () {
            if (CheckValidate_ErrPro())
                SaveErrorPro();
        });

        $("#" + Global.Element.PopupError_Pro + ' [cancel]').click(function () {
            $("#" + Global.Element.PopupError_Pro).modal("hide");
            $('#myModal').css('z-index', 1040);
            $('#err_solution').val('');
            $('#err_finishDK').val('');
        });
    }

    function CheckValidate_ErrPro() {
        if ($('#err_solution').val() == "") {
            GlobalCommon.ShowMessageDialog("Vui lòng Nhập hướng giải quyết lỗi phát sinh.", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        else if ($('#err_finishDK').val() == "") {
            GlobalCommon.ShowMessageDialog("Vui lòng chọn thời gian kết thúc dự kiến.", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        return true;
    }

    function SaveErrorPro() {
        $.ajax({
            url: Global.UrlAction.SaveErrorPro,
            type: 'POST',
            data: JSON.stringify({ 'jobId': $('#jobId').val(), 'JobErrId': Global.Data.JobErrId, 'time': $("#err_finishDK").data("kendoDateTimePicker").value(), 'note': $('#err_solution').val() }),
            contentType: 'application/json charset=utf-8',
            beforeSend: function () { $('#loading').show(); },
            success: function (data) {
                $('#loading').hide();
                GlobalCommon.CallbackProcess(data, function () {
                    if (data.Result == "OK") {
                        $("#" + Global.Element.PopupError_Pro + ' button[cancel]').click();
                        GetJobs();
                        GetJobDetail($('#jobId').val());                        
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
    /******************************************************************************************************/
    /*******************************************        ERROR RESULT       ******************************************/
    /******************************************************************************************************/
    function InitPopupError_Result() {
        $("#" + Global.Element.PopupError_Result).modal({
            keyboard: false,
            show: false
        });

        $("#" + Global.Element.PopupError_Result + ' [save]').click(function () {
            if (CheckValidate_ErrResult())
                SaveErrorResult();
        });

        $("#" + Global.Element.PopupError_Result + ' [cancel]').click(function () {
            $("#" + Global.Element.PopupError_Result).modal("hide");
            $('#myModal').css('z-index', 1040);
            $('#err_finishTT').val('');
            $('#err_warning').val('');
            $('#err_sms').val('');
        });
    }

    function CheckValidate_ErrResult() {
        if (!$('#err_result').prop('checked') && $('#err_reasion').val() == "") {
            GlobalCommon.ShowMessageDialog("Vui lòng Nhập lý do không hoàn thành.", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        else if ($('#err_result').prop('checked') && $('#err_finishTT').val() == "") {
            GlobalCommon.ShowMessageDialog("Vui lòng chọn thời gian kết thúc thực tế.", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        else if ($('#err_sms').val() == "") {
            GlobalCommon.ShowMessageDialog("Vui lòng chọn người liên quan nhận được thông báo.", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        return true;
    }

    function SaveErrorResult() {
        $.ajax({
            url: Global.UrlAction.SaveErrorResult,
            type: 'POST',
            data: JSON.stringify({ 'jobId': $('#jobId').val(), 'JobErrId': Global.Data.JobErrId, 'result': ($('#err_result').prop('checked') ? 1 : 2), 'time': $("#err_finishTT").data("kendoDateTimePicker").value(), 'sms': $('#err_sms').val(), 'reason': $('#err_reasion').val(), 'warning': $('#err_warning').val() }),
            contentType: 'application/json charset=utf-8',
            beforeSend: function () { $('#loading').show(); },
            success: function (data) {
                $('#loading').hide();
                GlobalCommon.CallbackProcess(data, function () {
                    if (data.Result == "OK") {
                        $("#" + Global.Element.PopupError_Result + ' button[cancel]').click();
                        GetJobs();
                        GetJobDetail($('#jobId').val());
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
}
