//**************************************************************************************//
//                          FUNCTION FORMAT JSONDATE TO DATE                            //
//                                                                                      //
//                  input( /Date(1297246301973)/) => out  14/2/2011                     //
//**************************************************************************************//
function parseJsonDateToDate(jsonDate) {
    if (jsonDate != null && jsonDate != '') {
        var dateString = jsonDate.substr(6);
        return new Date(parseInt(dateString));
    }
    else {
        return null;
    }
}

//**************************************************************************************//
//                    FUNCTION FORMAT NUMBER TO CURRENCY STYLE                          //
//                                                                                      //
//                            input(10000) => out 10.000                                //
//**************************************************************************************//
function ParseStringToCurrency(money) {
    money += '';
    var x = money.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}

function formatCurrency(total) {
    var neg = false;
    if (total < 0) {
        neg = true;
        total = Math.abs(total);
    }
    return (neg ? "-$" : '$') + parseFloat(total, 10).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,").toString();
}

//**************************************************************************************//
//                              FUNCTION ADD DAY INTO A DATE                            //
//              parameter : date => the date which you wanto add day                    //
//              parameter : days => the number of day which you want add add            //
//**************************************************************************************//

function addDays(theDate, days) {
    return new Date(theDate.getTime() + days * 24 * 60 * 60 * 1000);
}

/**********************************************************************************************************************
 *                                                  CHECK KHÔNG CHO NHẬP CHỮ                                          *      
 **********************************************************************************************************************/
function isNumberKey(evt) {
    var charCode = (evt.which) ? evt.which : event.keyCode;
    if (charCode == 59 || charCode == 46)
        return true;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        GlobalCommon.ShowMessageDialog("Vui lòng nhập số.", function () { }, "Lỗi Nhập liệu");
        return false;
    }
}


function ParseDateToString(date) {
    var dd = date.getDate() < 10 ? ('0' + date.getDate()) : date.getDate();
    dd += '/';
    dd += (date.getMonth() + 1) < 10 ? ('0' + (date.getMonth() + 1)) : (date.getMonth() + 1);
    dd += '/' + date.getFullYear() + ' ';
    return dd;
}

function ParseDateToStringWithoutTime(date) {
    var dd = date.getDate() < 10 ? ('0' + date.getDate()) : date.getDate();
    dd += '/';
    dd += (date.getMonth() + 1) < 10 ? ('0' + (date.getMonth() + 1)) : (date.getMonth() + 1);
    dd += '/' + date.getFullYear() + ' ';
    return dd;
}


function UpSingle(formId, returnId) {
    var form = $('#' + formId)[0];
    var dataString = new FormData(form);
    var a = $.ajax({
        type: "POST",
        url: '/Upload/Single',
        data: dataString,
        cache: false,
        contentType: false,
        processData: false,
        success: function (data) {
            $('#' + returnId).attr("newUrl", data);
            $('#' + returnId).select();
        }
    });
}


// 1/1/2017 10: 10
function ParseDateToString_cl(date) {
    var dd = date.getDate() < 10 ? ('0' + date.getDate()) : date.getDate();
    dd += '/';
    dd += (date.getMonth() + 1) < 10 ? ('0' + (date.getMonth() + 1)) : (date.getMonth() + 1);
    dd += '/' + date.getFullYear() + ' lúc ';
    dd += date.getHours() == 0 ? '00' : date.getHours() < 10 ? ('0' + date.getHours()) : date.getHours();
    dd += ':';
    dd += date.getMinutes() == 0 ? '00' : date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes();
    return dd;
}

function ddMMyyyy(strDate) {
    if (strDate)
        return moment(strDate).format('DD/MM/YYYY');
    return '';
}

function ddMMyyyyHHmm(strDate) {
    if (strDate)
        return moment(strDate).format('DD/MM/YYYY hh:mm a');
    return '';
}

function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('.img-avatar').attr('src', e.target.result);
        }
        reader.readAsDataURL(input.files[0]); // convert to base64 string
    }
}

function getText(value) {
    if (value) return value;
    return '';
}

function getDate(value) {
    if (value) {
        var date = moment(value)
        return txt = '<span class="red ">' + date.format('DD/MM/YYYY') + '</span>';
    }
    return '';
}