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
    //money += '';
    //var x = money.split('.');
    //var x1 = x[0];
    //var x2 = x.length > 1 ? '.' + x[1] : '';
    //var rgx = /(\d+)(\d{3})/;
    //while (rgx.test(x1)) {
    //    x1 = x1.replace(rgx, '$1' + ',' + '$2');
    //}
    //return x1 + x2;

    return (money+'').replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
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
    if (charCode > 31 && (charCode < 48 || charCode > 57))
    { GlobalCommon.ShowMessageDialog("Vui lòng nhập số.", function () { }, "Lỗi Nhập liệu"); }
}

/**********************************************************************************************************************
 *                                                  GENERATE SLIDESHOW                                                *      
 **********************************************************************************************************************/
function GenSlideShow(files, controlName) {
    if (files != null) {
        var str = '';
        for (var i = 0; i < files.length; i++) {
            switch (files[i].FileType.trim().toLowerCase()) {
                case 'jpg':
                case 'png':
                case 'gif':
                case 'ico':
                    str += '<img alt="' + files[i].Name + '" src="' + files[i].Path.substr(1, files[i].Path.length) + '" data-image="' + files[i].Path.substr(1, files[i].Path.length) + '" data-description="' + files[i].Description + '">';
                    break;
                case 'exe':
                    str += '<img alt="' + files[i].Name + '" src="/Content/UniteGallery/images/exe.png" data-image="' + files[i].Path.substr(1, files[i].Path.length) + '" data-description="' + files[i].Description + '">';
                    break;
                case 'rar':
                    str += '<img alt="' + files[i].Name + '" src="/Content/UniteGallery/images/winRar.png" data-image="' + files[i].Path.substr(1, files[i].Path.length) + '" data-description="' + files[i].Description + '">';
                    break;
                case 'zip':
                    str += '<img alt="' + files[i].Name + '" src="/Content/UniteGallery/images/WinZip.png" data-image="' + files[i].Path.substr(1, files[i].Path.length) + '" data-description="' + files[i].Description + '">';
                    break;
                case 'mp3':
                    str += '<img alt="' + files[i].Name + '" src="/Content/UniteGallery/images/mp3.png" data-type="html5video" data-image="/Content/UniteGallery/images/mp3.png" data-videomp4="' + files[i].Path.substr(1, files[i].Path.length) + '" data-description="' + files[i].Description + '">';
                    break;
                case 'mp4':
                    str += '<img alt="' + files[i].Name + '" src="/Content/UniteGallery/images/logomp4.png" data-type="html5video" data-image="/Content/UniteGallery/images/logomp4.png" data-videomp4="' + files[i].Path.substr(1, files[i].Path.length) + '"   data-description="' + files[i].Description + '">'
                    break;
                case 'doc':
                case 'docx':
                    str += '<img alt="' + files[i].Name + '" src="/Content/UniteGallery/images/word.png" data-image="' + files[i].Path.substr(1, files[i].Path.length) + '" data-description="' + files[i].Description + '">';
                    break;
                case 'xls':
                case 'xlsx':
                    str += '<img alt="' + files[i].Name + '" src="/Content/UniteGallery/images/Excel.png" data-image="' + files[i].Path.substr(1, files[i].Path.length) + '" data-description="' + files[i].Description + '">';
                    break;
                case 'ppt':
                case 'pptx':
                    str += '<img alt="' + files[i].Name + '" src="/Content/UniteGallery/images/ppt.png" data-image="' + files[i].Path.substr(1, files[i].Path.length) + '" data-description="' + files[i].Description + '">';
                    break;
                case 'txt':
                    str += '<img alt="' + files[i].Name + '" src="/Content/UniteGallery/images/Notepad.png" data-image="' + files[i].Path.substr(1, files[i].Path.length) + '" data-description="' + files[i].Description + '">';
                    break;
                case 'pdf':
                    str += '<img alt="' + files[i].Name + '" src="/Content/UniteGallery/images/pdf.png" data-image="' + files[i].Path.substr(1, files[i].Path.length) + '" data-description="' + files[i].Description + '">';
                    break;
            }
        }
        $('#' + controlName).empty().append(str);
        $('#' + controlName).unitegallery();
    }
}

/**********************************************************************************************************************
 *                                                  GET AREA BY COUNTRY                                               *      
 **********************************************************************************************************************/
function GetAreaByCountry(Id, selectedValue, controlName) {
    $.ajax({
        url: '/Area/GetAreaByCountryId',
        type: 'POST',
        data: JSON.stringify({ 'countryId': Id }),
        contentType: 'application/json charset=utf-8',
        beforeSend: function () { $('#loading').show(); },
        success: function (data) {
            GlobalCommon.CallbackProcess(data, function () {
                if (data.Result == "OK") {
                    var str = ' <option value="0"> Không có Dữ Liệu</option>';
                    if (data.Data.length > 0) {
                        str = ' <option value="0"> --- Chọn Khu Vực --- </option>';
                        $.each(data.Data, function (index, item) {
                            if (selectedValue != null && selectedValue == item.Value)
                                str += ' <option selected="selected" value="' + item.Value + '">' + item.Name + '</option>';
                            else
                                str += ' <option value="' + item.Value + '">' + item.Name + '</option>';
                        });
                    }
                    $('#' + controlName).empty().append(str);
                    $('#' + controlName).val(selectedValue);
                    $('#' + controlName).change();
                }
                $('#loading').hide();
            }, false, '', true, true, function () {
                var msg = GlobalCommon.GetErrorMessage(data);
                GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
            });
        }
    });
}

/**********************************************************************************************************************
 *                                                  GET PROVINCE BY AREA                                                *      
 **********************************************************************************************************************/
function GetProvinceByArea(Id, selectedValue, controlName) {
    $.ajax({
        url: '/Province/GetProvinceByAreaId',
        type: 'POST',
        data: JSON.stringify({ 'areaId': Id }),
        contentType: 'application/json charset=utf-8',
        beforeSend: function () { $('#loading').show(); },
        success: function (data) {
            GlobalCommon.CallbackProcess(data, function () {
                if (data.Result == "OK") {
                    var str = '';
                    $.each(data.Data, function (index, item) {
                        if (selectedValue != null && selectedValue == item.Value)
                            str += ' <option selected value="' + item.Value + '">' + item.Name + '</option>';
                        else
                            str += ' <option value="' + item.Value + '">' + item.Name + '</option>';
                    });
                    $('#' + controlName).empty().append(str);
                    $('#' + controlName).change();
                }
                $('#loading').hide();
            }, false, '', true, true, function () {
                var msg = GlobalCommon.GetErrorMessage(data);
                GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
            });
        }
    });
}

/**********************************************************************************************************************
 *                                                  SEND DATA TO PROJECTMANAGEMENT                                              *      
 **********************************************************************************************************************/
function SendData(actionUrl, objectSends, _moduleName, _sendType) {
    var str = JSON.stringify(objectSends);
    $.ajax({
        url: actionUrl,
        type: 'post',
        data: { data: str, moduleName: _moduleName, sendType: _sendType },
        contentType: 'application/json',
        crossDomain: true,
        dataType: 'jsonp',
    });
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

function ParseDateToStringWithoutTime(date) {
    var dd = date.getDate() < 10 ? ('0' + date.getDate()) : date.getDate();
    dd += '/';
    dd += (date.getMonth() + 1) < 10 ? ('0' + (date.getMonth() + 1)) : (date.getMonth() + 1);
    dd += '/' + date.getFullYear() + ' ';
    return dd;
}

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



function SaveSingleFile(uploadId, hiddenId) {
    var formData = new FormData();
    var totalFiles = document.getElementById(uploadId).files.length;
    for (var i = 0; i < totalFiles; i++) {
        var file = document.getElementById(uploadId).files[i];
        formData.append("FileUpload", file);
    }
    var a = $.ajax({
        type: "POST",
        url: '/UploadFile/Single',
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        success: function (data) {
            $('#' + hiddenId).val(data);
            $('#' + hiddenId).change();
        }
    });
}



