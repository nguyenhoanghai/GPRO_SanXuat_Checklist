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
GPRO.namespace('Alert');
GPRO.Alert = function () {
    var Global = {
        UrlAction: {
            Gets: '/Alert/Gets',
            Change: '/Alert/ChangeStatus',
            Delete: '/Alert/Delete',
            GetJobDetail: '/CheckListuser/GetJobById',
        },
        Element: {
            Jtable  : 'jtableAlert',
            Popup: 'myModal'
        },
        Data: {
            PMSUrl:''
        }
    }
    this.GetGlobal = function () {
        return Global;
    }

    this.Init = function () {
        RegisterEvent();
        InitList ();
        ReloadList (); 
    }

   

    var RegisterEvent = function () { 
    }
     
 
    function InitList () {
        $('#' + Global.Element.Jtable  ).jtable({
            title: 'Danh sách tin nhắn',
            paging: true,
            pageSize: 50,
            pageSizeChange : true,
            sorting: true,
            selectShow: false,
            actions: {
                listAction: Global.UrlAction.Gets 
            },
            messages: { 
            },
            fields: {
                Id: {
                    key: true,
                    create: false,
                    edit: false,
                    list: false
                },
                IsViewed: {
                    title: "",
                    width: "2%",
                    display: function (data) {
                        var text = $('<i class="fa ' + ((data.record.IsViewed ? "fa-envelope-open-o blue" : "fa-envelope-o red")) + ' "></i>');
                        return text;
                    }
                },
                Title: {
                    title: "Dự án",
                    width: "50%", 
                },
                Alert: {
                    title: "Nội dung",
                    width: "50%",
                    sorting: false
                },
                edit: {
                    title: '',
                    width: '1%',
                    sorting: false,
                    display: function (data) {
                        var text = $('<i data-toggle="modal" data-target="#' + Global.Element.Popup + '" title="Chỉnh sửa thông tin" class="fa fa-pencil-square-o clickable blue"  ></i>');
                        text.click(function () { 
                            GetJobDetail(data.record.JobId);
                            if (!data.record.IsViewed)
                                Change(data.record.Id);
                        });
                        return text;
                    }
                },
                Delete: {
                    title: '',
                    width: "3%",
                    sorting: false,
                    display: function (data) {
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
        });
    }

    function ReloadList () {         $('#' + Global.Element.Jtable  ).jtable('load' );    }

    function Delete(Id) {
        $.ajax({
            url: Global.UrlAction.Delete ,
            type: 'POST',
            data: JSON.stringify({ 'Id': Id }),
            contentType: 'application/json charset=utf-8',
            success: function (data) {
                GlobalCommon.CallbackProcess(data, function () {
                    if (data.Result == "OK") {
                        ReloadList (); 
                    }
                    else
                        GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình sử lý.");
                }, false, Global.Element.Popup, true, true, function () {

                    var msg = GlobalCommon.GetErrorMessage(data);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
                });
            }
        });
    }
  
    function Change(Id) {
        $.ajax({
            url: Global.UrlAction.Change,
            type: 'POST',
            data: JSON.stringify({ 'Id': Id }),
            contentType: 'application/json charset=utf-8',
            success: function (data) {
                ReloadList()
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
                        $('#jobName').html(data.Data.Name); jobId
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
                                str += '            <a class="attachment-thumbnail-details-options-item dark-hover js-download" href="' + ($('#'+Global.Element.Jtable).attr('url') + item.Url) + '" target="_blank" >';
                                str += '                <span class="fa fa-eye"></span><span class="attachment-thumbnail-details-options-item-text js-direct-link">Xem</span>';
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

}
$(document).ready(function () { 
    var a = new GPRO.Alert();
    a.Init();
})