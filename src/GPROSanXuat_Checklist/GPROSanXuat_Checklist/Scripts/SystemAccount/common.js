/// <reference path="/jquery.alerts.js" />
/// <reference path="/Scripts/jquery-1.5.1.min.js" />
/// <reference path="/Scripts/MicrosoftAjax.js" />

$.xhrPool = [];
$.xhrPool.abortAll = function () {
    $(this).each(function (idx, jqXHR) {
        jqXHR.abort();
    });
};

$.ajaxSetup({
    beforeSend: function (jqXHR) {
        $.xhrPool.push(jqXHR);
        //ShowAjaxProcessFull();
    }
});
$(document).ajaxStop(function () {
    $.xhrPool.pop();
    //CloseAjaxProcessFull();
});

$(document).ajaxError(function () {
    $.xhrPool.abortAll();
});

function ShowAjaxProcessFull() {
    var pleaseWaitDialog = $("#ajax-process-full").dialog(
    {
        resizable: false,
        height: 24,
        width: 228,
        modal: true,
        closeText: '',
        bgiframe: true,
        closeOnEscape: false,
        dialogClass: 'alert',
        draggable: false
    });
    $($("#ui-dialog-title-ajax-process-full").parent()).remove();
}

function CloseAjaxProcessFull() {
    var pleaseWaitDialog = $("#ajax-process-full").dialog("close");
}

function datepicker(selector, dateFormat) {
    var dateformat = 'dd/mm/yy';
    if (dateFormat) {
        dateformat = dateFormat;
    }
    $("#" + selector).datepicker({
        dateFormat: dateformat
    });
}

function datetimePicker(selector) {
    $("#" + selector).datetimepicker(
	{
	    showSecond: true,
	    timeFormat: 'hh:mm:ss',
	    dateFormat: 'dd/mm/yy'
	});
}

function parseDate(dateString, format) {
    //dateString = "13/03/2012 13:19:45";
    if (dateString == undefined || dateString == null || dateString.length == 0) {
        return null;
    }
    var reggie = /(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}):(\d{2})/g;
    var dateArray = reggie.exec(dateString);

    if (format && format == "dd/mm/yy") {
        reggie = /(\d{2})\/(\d{2})\/(\d{4})/g;

        dateArray = reggie.exec(dateString);
        dateObject = new Date(
		    (+dateArray[3]),
		    (+dateArray[2]) - 1, // Careful, month starts at 0!
		    (+dateArray[1]),
		    0,
		    0,
		    0
	    );
    }
    else if (format && format == "dd/mm/yy hh:ii") {
        reggie = /(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})/g;
        dateArray = reggie.exec(dateString);
        dateObject = new Date(
		    (+dateArray[3]),
		    (+dateArray[2]) - 1, // Careful, month starts at 0!
		    (+dateArray[1]),
		    (+dateArray[4]),
		    (+dateArray[5]),
		    0
	    );
    }
    else {
        var dateObject = new Date(
		    (+dateArray[3]),
		    (+dateArray[2]) - 1, // Careful, month starts at 0!
		    (+dateArray[1]),
		    (+dateArray[4]),
		    (+dateArray[5]),
		    (+dateArray[6])
	    );
    }

    return dateObject;
}

(function ($) {
    $.DateTime = {
        parseDate: function (dateString, format) {
            //dateString = "13/03/2012 13:19:45";
            if (dateString == undefined || dateString == null || dateString.length == 0) {
                return null;
            }
            var reggie = /(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}):(\d{2})/g;
            var dateArray = reggie.exec(dateString);
            var dateObject = null;
            if (format && format == "dd/mm/yy") {
                var reggie1 = /(\d{2})\/(\d{2})\/(\d{4})/g;

                dateArray = reggie1.exec(dateString);
                dateObject = new Date(
		            (+dateArray[3]),
		            (+dateArray[2]) - 1, // Careful, month starts at 0!
		            (+dateArray[1]),
		            0,
		            0,
		            0
	            );
            }
            else if (format && format == "dd/mm/yy hh:ii") {
                var reggie2 = /(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})/g;
                dateArray = reggie2.exec(dateString);
                dateObject = new Date(
		            (+dateArray[3]),
		            (+dateArray[2]) - 1, // Careful, month starts at 0!
		            (+dateArray[1]),
		            (+dateArray[4]),
		            (+dateArray[5]),
		            0
	            );
            }
            else {
                dateObject = new Date
                (
		            (+dateArray[3]),
		            (+dateArray[2]) - 1, // Careful, month starts at 0!
		            (+dateArray[1]),
		            (+dateArray[4]),
		            (+dateArray[5]),
		            (+dateArray[6])
	                );
            }


            return dateObject;
        }
    };



})(jQuery);

function setDataToFormWithTmpl(data, tmpl, elementDisplay) {
    $("#" + elementDisplay).empty();
    $("#" + tmpl).tmpl(data)
	.appendTo("#" + elementDisplay);
}

function setDataToFormWithTmplNonEmpty(data, tmpl, elementDisplay) {
    $("#" + tmpl).tmpl(data)
	.appendTo("#" + elementDisplay);
}

function setDataToErrorFormWithTmpl(data, elementDisplay, isSelector) {
    var tmpl = "template_error_message";
    if (isSelector == null || isSelector == false || isSelector == "false") {
        $($($("#" + elementDisplay).parent()).parent()).show();
        $("#" + elementDisplay).empty();
        $("#" + tmpl).tmpl(data)
		.appendTo("#" + elementDisplay);

    }
    else {

        $(elementDisplay).empty();
        $("#" + tmpl).tmpl(data)
		.appendTo(elementDisplay);
        $($($(elementDisplay).parent()).parent()).show();
        //window.location = "#message"
    }
}

function convertJsonDateTimeToJs(jsonDate) {
    return new Date(+jsonDate.replace(/\/Date\((-?\d+)\)\//gi, "$1"));
}

String.prototype.format = String.prototype.f = function () {
    var s = this,
			i = arguments.length;

    while (i--) {
        s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
    }
    return s;
};

function FormatDateToString(date, formatstring) {
    return dateFormat(date, formatstring);
}

function FormatDateJsonToString(datejson, formatstring) {
    if (datejson == null)
        return "";
    var date = convertJsonDateTimeToJs(datejson);
    if (formatstring) {
        return dateFormat(date, formatstring);
    }
    else {
        return dateFormat(date, "dd/mm/yyyy HH:MM:ss");
    }
}

function FormatDateToStringBySelector(Selector, addDay) {
    var datetime = $("#" + Selector).datetimepicker('getDate');
    if (addDay != null) {
        var now = new Date();
        if (datetime.getDate() == now.getDate()) {
            var day = now.getDate() - addDay;
            datetime = datetime.setDate(day);
        }
    }
    return $.format.date(datetime, "MM/dd/yy HH:mm:ss");
}

function FormatDateToStringObj(object, arrProperty, arrSelector) {
    $.each(arrProperty, function (index, obj) {
        var datetime = $("#" + arrSelector[index]).val();
        object[obj] = parseDate(datetime, "dd/mm/yy hh:ii:ss");
    });
    return object;
}

function _showModelErrors(data, elementForm, isForm, isShowSummary) {
    GlobalCommon.ClearErrorStatus(elementForm);
    if (data.ErrorMessages == null || data.ErrorMessages.length <= 0) {
        if (data.Message != null) {
            var primary_message = '<strong>' + data.Message + '</strong><br/>';
            $('#' + elementForm + ' .alert #alert_content').html('').append(primary_message).parent().show();
        }
        return;
    }

    $.each(data.ErrorMessages, function (idata, odata) {
        if (isForm == true) {
            var message = '<ul><li>' + odata.Message + '</li></ul>';
            var item_tmp = $('#' + elementForm + ' label[bindmessage="' + odata.MemberName + '"]').html('').append(odata.Message).attr('title', odata.Message);
            var item_parent = item_tmp.parent().parent();
            if (item_parent.hasClass('control-group') == true) {
                item_parent.addClass('error');
            }
        }
        else {
            var message = '<ul><li>' + odata.Message + '</li></ul>';
            var item_tmp = $('#' + elementForm + ' label[bindmessage="' + odata.MemberName + '"]').html('').append('(*)').attr('title', odata.Message);
            var item_parent = item_tmp.parent().parent();
            if (item_parent.hasClass('control-group') == true) {
                item_parent.addClass('error');
            }
        }
    });
    if (isShowSummary == true) {
        var message = '<ul>';
        $.each(data.ErrorMessages, function (idata, odata) {
            message += '<li>' + odata.Message + '</li>';
        });
        message += '</ul>';
        if (data.Message != null && data.Message != undefined && data.Message != NaN) {
            var primary_message = '<strong>' + data.Message + '</strong><br/>';
        }
        $('#' + elementForm + ' .alert #alert_content').html('').append(primary_message).append(message).parent().show();
        $('#' + elementForm).height("auto");

        $('#' + elementForm).find('[data-dismiss="alert"]').unbind("click");
        $('#' + elementForm).find('[data-dismiss="alert"]').click(function () {
            $('#' + elementForm).find('div.alert').hide();
        });
    }

}

var GlobalCommon = {
    Flag: {
        IsAdvanceSearch: false
    },
    CallbackProcess: function (result, fn, showAlertError, elementForm, isForm, isShowSummary, errorFn) {
        // Xử lý sau khi trả về từ server
        if (result.ErrorMessages && result.ErrorMessages.length > 0) {
            if (result.StatusCode == 401) {
                if (result.ErrorMessages.length == 1) {
                    //alert(result.ErrorMessages[0].Message);
                    GlobalCommon.ShowMessageDialog(result.ErrorMessages[0].Message, null, "Thông báo");
                }
                else {
                    //alert("Bạn không quyền truy cập dữ liệu");
                    GlobalCommon.ShowMessageDialog("Bạn không có quyền truy cập dữ liệu.", null, "Thông báo");
                }
            }
            else if (result.StatusCode == 403) {
                if (result.ErrorMessages && result.ErrorMessages.length == 1) {
                    GlobalCommon.ShowMessageDialog(result.ErrorMessages[0].Message, null, "Thông báo");
                }
                else {
                    GlobalCommon.ShowMessageDialog("Bạn chưa đăng nhập.", null, "Thông báo");
                }
            }
            else {
                try {
                    if (showAlertError != null && showAlertError == true) {
                        //alert("Đã có lỗi xảy ra. Vui lòng kiểm tra lại thông tin.");
                        GlobalCommon.ShowMessageDialog("Đã có lỗi xảy ra. Vui lòng kiểm tra lại thông tin.", null, "Thông báo");
                    }
                    _showModelErrors(result, elementForm, isForm, isShowSummary);
                    if (errorFn) {
                        errorFn();
                    }
                }
                catch (err) {
                    alert(err);
                }
            }
            CloseAjaxProcessFull();
        }
        else {
            if (fn) fn();
        }
    },
    ErrorAjaxProcess: function () {

    },
    Redirect: {
        RefreshPage: function () {
            window.location = window.location.pathname;
        },
        HomePage: function () {
            window.location = "/";
        },
        LogoutRequest: function () {
            window.location = "/Account/LogOff";
        }
    },
    ShowConfirmDialog: function (message, YesFn, NoFn, yesText, noText, title) {
        jCustomConfirm(message, title, YesFn, NoFn, yesText, noText);
        $("#popup_overlay").css("background-color", "#666").css("opacity", "0.5");
    },
    CloseConfirmDialog: function () {
        jConfirmClose();
    },
    ShowMessageDialog: function (message, fn, title) {
        jAlert(message, title, function (r) {
            if (r) {
                if (fn) fn();
            }
        });
        $("#popup_overlay").css("background-color", "#666").css("opacity", "0.5");
    },
    CloseMessageDialog: function () {
        jConfirmClose();
    },
    GetErrorMessage: function (result) {
        var message = "";
        for (var i = 0; i < result.ErrorMessages.length; i++) {
            message += result.ErrorMessages[i].Message + "<br/>";
        }
        return message;
    },
    ClearErrorStatus: function (elementForm) {
        if (elementForm) {
            $('#' + elementForm).find('div.alert').hide();
            $('#' + elementForm).find(".control-group").removeClass("error");
            //bindmessage="Name" class="help-inline"
            $('#' + elementForm).find("label.help-inline[bindmessage]").html("");
            $('#' + elementForm).find("label.help-inline[bindmessage]").removeAttr("title");
        }
    }
}

function GetDataToDLL(url, arrid, name, value, isdefault, fn, arrParameter) {
    $.ajax({
        url: url,
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            if (data.Result == "OK") {
                $.each(data.Data, function (index, obj) {
                    var option = "<option value='" + obj['' + value + ''] + "'>" + obj['' + name + ''] + "</option>";
                    $.each(arrid, function (index, id) {
                        $('#' + id).append(option);
                        if (isdefault && obj.IsDefault) {
                            $('#' + id).val(obj['' + value + '']);
                            $('#' + id).attr("defaultvalue", obj['' + value + '']);
                        }
                    });
                });

                if (fn != null)
                    fn();
            }
        },
        error: function () {

        },
        beforeSend: function () {
            ShowAjaxProcessFull();
        },
        complete: function () {
            CloseAjaxProcessFull();
        }
    });
}

function RegisterAjaxProcess(selector) {
    if (selector) {
        $(selector).ajaxStart(function () {
            ShowAjaxProcessFull();
        });
        $(selector).ajaxComplete(function () {
            CloseAjaxProcessFull();
        });
    }
    else {
        $("body").ajaxStart(function () {
            ShowAjaxProcessFull();
        });
        $("body").ajaxStart(function () {
            CloseAjaxProcessFull();
        });
    }
}


// Read a page's GET URL variables and return them as an associative array.
function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

function ConvertProcessStatus(processStatusId) {
    var text = "";
    switch (processStatusId) {
        case 1:
            {
                text = "Khởi tạo";
                break;
            }
        case 2:
            {
                text = "Đang duyệt";
                break;
            }
        case 4:
            {
                text = "Đã duyệt";
                break;
            }
        case 8:
            {
                text = "Không được duyệt";
                break;
            }
        case 16:
            {
                text = "Đang xử lý";
                break;
            }
        case 32:
            {
                text = "Hoàn thành";
                break;
            }
        default:
            {
                text = "Không xác định";
                break;
            }
    }
    return text;
}

function ResetDefaulValue(idParent) {
    $("#" + idParent).find("[defaultvalue]").each(function (index, obj) {
        $(obj).val($(obj).attr("defaultvalue"));
        if ($(obj)[0].type == 'checkbox') {
            var value = $(obj).attr('defaultvalue');
            if (value == 'true') {
                $(obj).attr('checked', true);
            }
            else {
                $(obj).attr('checked', false);
            }
        }
    });
}

function GroupValidation(validateName, effect, all) {
    var original = $('input[' + validateName + '],input[type="text"][' + validateName + '], input[type="checkbox"][' + validateName + '],input[type="radio"][' + validateName + '],input[type="file"][' + validateName + '],select[' + validateName + '],textarea[' + validateName + ']'),
        destination = $('a[' + validateName + '],button[' + validateName + '],input[type="button"][' + validateName + '],input[type="submit"][' + validateName + ']');

    _change(false);

    var valid = true;
    $.each(original, function (i, o) {
        $(original).on("keydown", function (event) {
            if (_checkSumRequired(original)) {
                _change(true);
            }
            else {
                _change(false);
            }
        });
        $(original).on("change", function (event) {
            if (_checkSumRequired(original)) {
                _change(true);
            }
            else {
                _change(false);
            }
        });
    })

    function _checkSumRequired(os) {
        var valid = true;
        for (var i = 0; i < os.length; i++) {
            var check = _checkRequired(os[i]);
            if (!all) {
                if (check)
                    return true;
            }
            valid = valid && check;
        }
        return valid;
    }

    function _checkRequired(o) {
        var str = '';
        switch (o.type.toLowerCase()) {
            case 'text': {
                str = $(o).val().replace(/ /g, '');
                if (str.length <= 0 || str == undefined || str == "" || str == null || str <= 0) {
                    return false;
                } else {
                    return true;
                }
            } break;
            case 'select': {
                str = $(o).val().replace(/ /g, '');
                if (str.length <= 0 || str == undefined || str == "" || str == null || str <= 0) {
                    return false;
                } else {
                    return true;
                }
            } break;
            case 'textarea': {
                str = $(o).val().replace(/ /g, '');
                if (str.length <= 0 || str == undefined || str == "" || str == null || str <= 0) {
                    return false;
                } else {
                    return true;
                }
            } break;
            case 'radio': {
                str = $(o).val().replace(/ /g, '');
                if (str.length <= 0 || str == undefined || str == "" || str == null || str <= 0) {
                    return false;
                } else {
                    return true;
                }
            } break;
            case 'checkbox': {
                str = $(o).val().replace(/ /g, '');
                if (str.length <= 0 || str == undefined || str == "" || str == null || str <= 0) {
                    return false;
                } else {
                    return true;
                }
            } break;
            case 'file': {
                str = $(o).val().replace(/ /g, '');
                if (str.length <= 0 || str == undefined || str == "" || str == null || str <= 0) {
                    return false;
                } else {
                    return true;
                }
            } break;
            default: {
                str = $(o).val().replace(/ /g, '');
                if (str.length <= 0 || str == undefined || str == "" || str == null || str <= 0) {
                    return false;
                } else {
                    return true;
                }
            } break;
        }
    }

    function _change(valid) {
        if (valid) {
            var eff = 'disabled';
            if (typeof effect == 'string' && $.trim(effect).toLowerCase() == 'hide')
            { eff == 'hide' }
            else if (typeof effect == 'string' && $.trim(effect).toLowerCase() == 'disabled')
            { eff = 'disabled' };
            $.each(destination, function (i, o) {
                if (eff == 'hide') {
                    $(o).show();
                }
                else {
                    $(o).removeAttr(eff)
                }
            })
        }
        else {
            var eff = 'disabled';
            if (typeof effect == 'string' && $.trim(effect).toLowerCase() == 'hide')
            { eff == 'hide' }
            else if (typeof effect == 'string' && $.trim(effect).toLowerCase() == 'disabled')
            { eff = 'disabled' };
            $.each(destination, function (i, o) {
                if (eff == 'hide') {
                    $(o).hide();
                }
                else {
                    $(o).attr(eff, 'disabled')
                }
            })
        }
    }


}
