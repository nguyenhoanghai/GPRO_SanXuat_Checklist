function GetCategoriesSelect(moduleId, controlId, value) {
    if (moduleId != '0') {
        $.ajax({
            url: '/Category/GetSelect',
            type: 'POST',
            data: JSON.stringify({ 'ModuleId': moduleId }),
            contentType: 'application/json charset=utf-8',
            // beforeSend: function () { $('#loading').show(); },
            success: function (data) {
                //   $('#loading').hide();
                if (data.Result == "OK") {
                    var str = '';
                    if (data.Data != null && data.Data.length > 0) {
                        $.each(data.Data, function (index, item) {
                            str += '<option value="' + item.Value + '" ' + (item.Value == value ? "selected" : "") + '>' + item.Name + '</option>';
                        });
                    }
                    $('[' + controlId + ']').empty().append(str);
                    $('#' + controlId).empty().append(str);
                    $('[' + controlId + ']').trigger('liszt:updated');
                }
                else
                    GlobalCommon.ShowMessageDialog('Lỗi', function () { }, "Đã có lỗi xảy ra trong quá trình sử lý.");
            }
        });
    }
}

function GetTimeTypePrepareSelect(controlId) {
    $.ajax({
        url: '/TimePrepare/GetTimeTypePreparesSelectList',
        type: 'POST',
        data: '',
        contentType: 'application/json charset=utf-8',
        success: function (data) {
            if (data.Result == "OK") {
                var str = ' <option value="0"> Không có dữ liệu </option>';
                if (data.Data.length > 0) {
                    str = ' <option value="0">- Chọn Loại Thời Gian -</option>';
                    $.each(data.Data, function (index, item) {
                        str += ' <option value="' + item.Value + '">' + item.Name + '</option>';
                    });
                }
                $('#' + controlId).empty().append(str);
                $('#' + controlId).trigger('liszt:updated');
            }
            else
                GlobalCommon.ShowMessageDialog('Lỗi', function () { }, "Đã có lỗi xảy ra trong quá trình xử lý.");
        }
    });
}

function GetWorkersLevelSelect(controlName) {
    $.ajax({
        url: '/WorkerLevel/GetSelectList',
        type: 'POST',
        data: '',
        contentType: 'application/json charset=utf-8',
        success: function (data) {
            GlobalCommon.CallbackProcess(data, function () {
                if (data.Result == "OK") {
                    if (data.Data.length > 0) {
                        var str = ' <option value="0"> Không có Bậc thợ </option>';
                        if (data.Data.length > 0) {
                            str = ' <option value="0">- - Chọn Bậc thợ - -</option>';
                            $.each(data.Data, function (index, item) {
                                str += ' <option value="' + item.Value + '">' + item.Name + '</option>';
                            });
                        }
                        $('#' + controlName).empty().append(str);
                        $('#' + controlName).trigger('liszt:updated');
                    }
                }
            }, false, '', true, true, function () {
                var msg = GlobalCommon.GetErrorMessage(data);
                GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
            });
        }
    });
}

function GetProductSelect(controlName) {
    $.ajax({
        url: '/Product/GetSelectList',
        type: 'POST',
        data: '',
        contentType: 'application/json charset=utf-8',
        success: function (data) {
            GlobalCommon.CallbackProcess(data, function () {
                if (data.Result == "OK") {
                    if (data.Data.length > 0) {
                        var str = '';
                        if (data.Data.length > 0) {
                            $.each(data.Data, function (index, item) {                                
                                str += ` <option value="${item.Value}" custId="${item.Data}" unit="${item.Data2}" custName="${item.Code}">${item.Name}</option>`;
                            });
                        }
                        $('#' + controlName).empty().append(str).change();
                        $('[' + controlName + ']').empty().append(str).change();
                        $('#' + controlName).trigger('liszt:updated');
                    }
                }
            }, false, '', true, true, function () {
                var msg = GlobalCommon.GetErrorMessage(data);
                GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
            });
        }
    });
}

function GetCustomerSelect(controlName) {
    $.ajax({
        url: '/Customer/GetSelectList',
        type: 'POST',
        data: '',
        contentType: 'application/json charset=utf-8',
        success: function (data) {
            GlobalCommon.CallbackProcess(data, function () {
                if (data.Result == "OK") {
                    if (data.Data.length > 0) {
                        var str = '';
                        if (data.Data.length > 0) {
                            $.each(data.Data, function (index, item) {
                                str += ' <option value="' + item.Value + '">' + item.Name + '</option>';
                            });
                        }
                        $('#' + controlName).empty().append(str);
                        $('[' + controlName + ']').empty().append(str);
                        $('#' + controlName).trigger('liszt:updated');
                    }
                }
            }, false, '', true, true, function () {
                var msg = GlobalCommon.GetErrorMessage(data);
                GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
            });
        }
    });
}

function GetWorkshopSelect(controlName) {
    $.ajax({
        url: '/Workshop/GetSelect',
        type: 'POST',
        data: '',
        contentType: 'application/json charset=utf-8',
        success: function (data) {
            GlobalCommon.CallbackProcess(data, function () {
                if (data.Result == "OK") {
                    if (data.Data.length > 0) {
                        var str = '';
                        if (data.Data.length > 0) {
                            $.each(data.Data, function (index, item) {
                                str += ' <option value="' + item.Value + '">' + item.Name + '</option>';
                            });
                        }
                        $('#' + controlName).empty().append(str).change();
                        $('[' + controlName + ']').empty().append(str).change();
                        $('#' + controlName).trigger('liszt:updated');
                    }
                }
            }, false, '', true, true, function () {
                var msg = GlobalCommon.GetErrorMessage(data);
                GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
            });
        }
    });
}

function GetFloorSelect(controlName, workshopId) {
    $.ajax({
        url: '/floor/GetSelectList',
        type: 'POST',
        data: JSON.stringify({ 'workshopId': workshopId }),
        contentType: 'application/json charset=utf-8',
        success: function (data) {
            GlobalCommon.CallbackProcess(data, function () {
                if (data.Result == "OK") {
                    if (data.Data.length > 0) {
                        var str = '';
                        if (data.Data.length > 0) {
                            $.each(data.Data, function (index, item) {
                                str += `<option value="${item.Value}">${item.Name} - ${item.Code}</option>`;
                            });
                        }
                        $('#' + controlName).empty().append(str).change();
                        $('[' + controlName + ']').empty().append(str).change();
                        $('#' + controlName).trigger('liszt:updated');
                    }
                }
            }, false, '', true, true, function () {
                var msg = GlobalCommon.GetErrorMessage(data);
                GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
            });
        }
    });
}

function GetLineSelect(controlName, floorId) {
    $.ajax({
        url: '/Line/GetSelect',
        type: 'POST',
        data: JSON.stringify({ 'floorId': floorId }),
        contentType: 'application/json charset=utf-8',
        success: function (data) {
            GlobalCommon.CallbackProcess(data, function () {
                if (data.Result == "OK") {
                    if (data.Data.length > 0) {
                        var str = '';
                        if (data.Data.length > 0) {
                            $.each(data.Data, function (index, item) {
                                str += ' <option labours = "' + item.Data + '" value="' + item.Value + '">' + item.Name + '</option>';
                            });
                        }
                        $('#' + controlName).empty().append(str).change();
                        $('[' + controlName + ']').empty().append(str).change();
                        $('#' + controlName).trigger('liszt:updated');
                    }
                }
            }, false, '', true, true, function () {
                var msg = GlobalCommon.GetErrorMessage(data);
                GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
            });
        }
    });
}


function GetPhaseGroupSelect(controlName) {
    $.ajax({
        url: '/PhaseGroup/GetSelect',
        type: 'POST',
        data: '',
        contentType: 'application/json charset=utf-8',
        success: function (data) {
            GlobalCommon.CallbackProcess(data, function () {
                if (data.Result == "OK") {
                    if (data.Data.length > 0) {
                        var str = '';
                        if (data.Data.length > 0) {
                            $.each(data.Data, function (index, item) {
                                str += ' <option value="' + item.Value + '">' + item.Name + '</option>';
                            });
                        }
                        $('#' + controlName).empty().append(str);
                        $('[' + controlName + ']').empty().append(str);
                        $('#' + controlName).trigger('liszt:updated');
                    }
                }
            }, false, '', true, true, function () {
                var msg = GlobalCommon.GetErrorMessage(data);
                GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
            });
        }
    });
}

function GetApplyPressureSelect(controlName) {
    $.ajax({
        url: '/MType/GetApplyPressures',
        type: 'POST',
        data: '',
        contentType: 'application/json charset=utf-8',
        success: function (data) {
            if (data.Result == "OK") {
                var str = '<option val="0" value="0"> --Chọn số lớp cắt-- </option>';
                if (data.Data.length > 0) {
                    $.each(data.Data, function (index, item) {
                        str += ' <option value="' + item.Id + '" val="' + item.Value + '">' + item.Level + '</option>';
                    });
                }
                $('#' + controlName).empty().append(str);
                $('[' + controlName + ']').empty().append(str);
            }
            else
                GlobalCommon.ShowMessageDialog('Lỗi lấy thư viện lớp cắt', function () { }, "Đã có lỗi xảy ra trong quá trình xử lý.");
        }
    });
}

function GetETypeSelect(controlName) {
    $.ajax({
        url: '/EquipmentType/GetSelects',
        type: 'POST',
        data: '',
        contentType: 'application/json charset=utf-8',
        success: function (data) {
            GlobalCommon.CallbackProcess(data, function () {
                if (data.Result == "OK") {
                    if (data.Data.length > 0) {
                        var str = '';
                        if (data.Data.length > 0) {
                            $.each(data.Data, function (index, item) {
                                str += ' <option value="' + item.Value + '">' + item.Name + '</option>';
                            });
                        }
                        $('#' + controlName).empty().append(str);
                        $('[' + controlName + ']').empty().append(str);
                        $('#' + controlName).trigger('liszt:updated');
                    }
                }
            }, false, '', true, true, function () {
                var msg = GlobalCommon.GetErrorMessage(data);
                GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
            });
        }
    });
}

function GetEGroupSelect(controlName) {
    $.ajax({
        url: '/EquipmentGroup/GetSelects',
        type: 'POST',
        data: '',
        contentType: 'application/json charset=utf-8',
        success: function (data) {
            GlobalCommon.CallbackProcess(data, function () {
                if (data.Result == "OK") {
                    if (data.Data.length > 0) {
                        var str = '';
                        if (data.Data.length > 0) {
                            $.each(data.Data, function (index, item) {
                                str += ' <option value="' + item.Value + '">' + item.Name + '</option>';
                            });
                        }
                        $('#' + controlName).empty().append(str);
                        $('[' + controlName + ']').empty().append(str);
                        $('#' + controlName).trigger('liszt:updated');
                    }
                }
            }, false, '', true, true, function () {
                var msg = GlobalCommon.GetErrorMessage(data);
                GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
            });
        }
    });
}

function GetUnitSelect(controlName, typeCode) {
    $.ajax({
        url: '/Unit/GetSelectList',
        type: 'POST',
        data: JSON.stringify({ 'typeCode': typeCode }),
        contentType: 'application/json charset=utf-8',
        success: function (data) {
            GlobalCommon.CallbackProcess(data, function () {
                if (data.Result == "OK") {
                    if (data.Data.length > 0) {
                        var str = '';
                        if (data.Data.length > 0) {
                            $.each(data.Data, function (index, item) {
                                str += ` <option value='${item.Value}' note='${item.Code}'>${item.Name}</option>`;
                            });
                        }
                        $('#' + controlName).empty().append(str).change();
                        $('[' + controlName + ']').empty().append(str).change();
                        $('#' + controlName).trigger('liszt:updated');
                    }
                }
            }, false, '', true, true, function () {
                var msg = GlobalCommon.GetErrorMessage(data);
                GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
            });
        }
    });
}

function GetUnitTypeSelect(controlId) {
    $.ajax({
        url: '/unittype/GetSelectList',
        type: 'POST',
        data: '',
        contentType: 'application/json charset=utf-8',
        success: function (data) {
            if (data.Result == "OK") {
                var str = ' <option value="0"> Không có dữ liệu </option>';
                if (data.Data.length > 0) {
                    // str = ' <option value="0">- Chọn Loại Thời Gian -</option>';
                    str = ' ';
                    $.each(data.Data, function (index, item) {
                        str += ' <option value="' + item.Value + '">' + item.Name + '</option>';
                    });
                }
                $('#' + controlId).empty().append(str);
                $('[' + controlId + ']').empty().append(str);
                $('#' + controlId).trigger('liszt:updated');
            }
            else
                GlobalCommon.ShowMessageDialog('Lỗi', function () { }, "Đã có lỗi xảy ra trong quá trình xử lý.");
        }
    });
}


function GetUserSelect(controlId) {
    $.ajax({
        url: '/user/GetSelectList',
        type: 'POST',
        data: JSON.stringify({'userIds':''}),
        contentType: 'application/json charset=utf-8',
        success: function (data) {
            if (data.Result == "OK") {
                var str = ' <option value="0"> Không có dữ liệu </option>';
                if (data.Records.length > 0) {
                    // str = ' <option value="0">- Chọn Loại Thời Gian -</option>';
                    str = ' ';
                    $.each(data.Records, function (index, item) {
                        str += ' <option value="' + item.Value + '">' + item.Name + '</option>';
                    });
                }
                $('#' + controlId).empty().append(str);
                $('[' + controlId + ']').empty().append(str);
                $('#' + controlId).trigger('liszt:updated');
            }
            else
                GlobalCommon.ShowMessageDialog('Lỗi', function () { }, "Đã có lỗi xảy ra trong quá trình xử lý.");
        }
    });
}

function GetSizeSelect(controlId) {
    $.ajax({
        url: '/size/GetSelectList',
        type: 'POST',
        data: '',
        contentType: 'application/json charset=utf-8',
        success: function (data) {
            if (data.Result == "OK") {
                var str = ' <option value="0"> Không có dữ liệu </option>';
                if (data.Data.length > 0) {
                    // str = ' <option value="0">- Chọn Loại Thời Gian -</option>';
                    str = ' ';
                    $.each(data.Data, function (index, item) {
                        str += ' <option value="' + item.Value + '">' + item.Name + '</option>';
                    });
                }
                $('#' + controlId).empty().append(str);
                $('[' + controlId + ']').empty().append(str);
                $('#' + controlId).trigger('liszt:updated');
            }
            else
                GlobalCommon.ShowMessageDialog('Lỗi', function () { }, "Đã có lỗi xảy ra trong quá trình xử lý.");
        }
    });
}

function GetAccessoryTypeSelect(controlId) {
    $.ajax({
        url: '/accessorytype/GetSelectList',
        type: 'POST',
        data: '',
        contentType: 'application/json charset=utf-8',
        success: function (data) {
            if (data.Result == "OK") {
                var str = ' <option value="0"> Không có dữ liệu </option>';
                if (data.Data.length > 0) {
                    // str = ' <option value="0">- Chọn Loại Thời Gian -</option>';
                    str = ' ';
                    $.each(data.Data, function (index, item) {
                        str += ' <option value="' + item.Value + '">' + item.Name + '</option>';
                    });
                }
                $('#' + controlId).empty().append(str);
                $('[' + controlId + ']').empty().append(str);
                $('#' + controlId).trigger('liszt:updated');
            }
            else
                GlobalCommon.ShowMessageDialog('Lỗi', function () { }, "Đã có lỗi xảy ra trong quá trình xử lý.");
        }
    });
}

function GetChecklistTemplateSelect(controlId) {
    $.ajax({
        url: '/TemplateChecklist/GetSelectList',
        type: 'POST',
        data: '',
        contentType: 'application/json charset=utf-8',
        success: function (data) {
            if (data.Result == "OK") {
                var str = ' <option value="0"> Không có dữ liệu </option>';
                if (data.Data.length > 0) {
                    // str = ' <option value="0">- Chọn Loại Thời Gian -</option>';
                    str = ' ';
                    $.each(data.Data, function (index, item) {
                        str += ' <option value="' + item.Value + '">' + item.Name + '</option>';
                    });
                }
                $('#' + controlId).empty().append(str);
                $('[' + controlId + ']').empty().append(str);
                $('#' + controlId).trigger('liszt:updated');
            }
            else
                GlobalCommon.ShowMessageDialog('Lỗi', function () { }, "Đã có lỗi xảy ra trong quá trình xử lý.");
        }
    });
}

function GetStatusSelect(controlId) {
    $.ajax({
        url: '/Status/GetSelectList',
        type: 'POST',
        data: '',
        contentType: 'application/json charset=utf-8',
        success: function (data) {
            if (data.Result == "OK") {
                var str = ' <option value="0"> Không có dữ liệu </option>';
                if (data.Data.length > 0) {
                    // str = ' <option value="0">- Chọn Loại Thời Gian -</option>';
                    str = ' ';
                    $.each(data.Data, function (index, item) {
                        str += ' <option value="' + item.Value + '">' + item.Name + '</option>';
                    });
                }
                $('#' + controlId).empty().append(str);
                $('[' + controlId + ']').empty().append(str);
                $('#' + controlId).trigger('liszt:updated');
            }
            else
                GlobalCommon.ShowMessageDialog('Lỗi', function () { }, "Đã có lỗi xảy ra trong quá trình xử lý.");
        }
    });
}

function GetEmployeeSelect(controlId) {
    $.ajax({
        url: '/employee/GetSelectList',
        type: 'POST',
        data: '',
        contentType: 'application/json charset=utf-8',
        // beforeSend: function () { $('#loading').show(); },
        success: function (data) {
            //    $('#loading').hide();
            if (data.Result == "OK") {
                // var option = '';
                var option2 = '';
                if (data.Records != null && data.Records.length > 0) {
                    $.each(data.Records, function (i, item) {
                        //Global.Data.EmployeeeArr.push(item);
                        //  option += '<option value="' + item.Name + '" /> ';
                        option2 += '<option value="' + item.Value + '">' + item.Name + '</option> ';
                    });
                }
                $('#' + controlId).empty().append(option2);
                $('[' + controlId + ']').empty().append(option2);
                $('#' + controlId).trigger('liszt:updated');
                //$('#checklist-job-step-employee,#checklist-job-employee').empty().append(option2);
                //$('#checklist-job-step-related-employee,#checklist-job-related-employee').empty().append(option2);
                //$('#checklist-job-step-related-employee,#checklist-job-related-employee').kendoMultiSelect().data("kendoMultiSelect");
            }
            else
                GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình xử lý.");
        }
    });
}

function GetWarehouseSelect(controlId) {
    $.ajax({
        url: '/warehouse/GetSelectList',
        type: 'POST',
        data: '',
        contentType: 'application/json charset=utf-8',
        success: function (data) {
            if (data.Result == "OK") {
                var str = ' <option value="0"> Không có dữ liệu </option>';
                if (data.Data.length > 0) {
                    // str = ' <option value="0">- Chọn Loại Thời Gian -</option>';
                    str = ' ';
                    $.each(data.Data, function (index, item) {
                        str += ' <option value="' + item.Value + '">' + item.Name + '</option>';
                    });
                }
                $('#' + controlId).empty().append(str);
                $('[' + controlId + ']').empty().append(str);
                $('#' + controlId).trigger('liszt:updated');
            }
            else
                GlobalCommon.ShowMessageDialog('Lỗi', function () { }, "Đã có lỗi xảy ra trong quá trình xử lý.");
        }
    });
}

function GetMaterialTypeSelect(controlName) {
    $.ajax({
        url: '/materialtype/GetSelectList',
        type: 'POST',
        data: '',
        contentType: 'application/json charset=utf-8',
        success: function (data) {
            GlobalCommon.CallbackProcess(data, function () {
                if (data.Result == "OK") {
                    if (data.Data.length > 0) {
                        var str = '';
                        if (data.Data.length > 0) {
                            $.each(data.Data, function (index, item) {
                                str += `<option value="${item.Value}" rate="${item.Code}">${item.Name}</option>`;
                            });
                        }
                        $('#' + controlName).empty().append(str);
                        $('[' + controlName + ']').empty().append(str);
                        $('#' + controlName).trigger('liszt:updated');
                    }
                }
            }, false, '', true, true, function () {
                var msg = GlobalCommon.GetErrorMessage(data);
                GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
            });
        }
    });
}

function GetMaterialSelect(controlName, MtypeId) {
    $.ajax({
        url: '/Material/GetSelectList',
        type: 'POST',
        data: JSON.stringify({ 'MtypeId': MtypeId }),
        contentType: 'application/json charset=utf-8',
        success: function (data) {
            if (data.Result == "OK") {
                if (data.Data.length > 0) {
                    var str = '';
                    if (data.Data.length > 0) {
                        $.each(data.Data, function (index, item) {
                            str += `<option value="${item.Value}" unit="${item.Code}">${item.Name}</option>`;
                        });
                    }
                    $('#' + controlName).empty().append(str);
                    $('[' + controlName + ']').empty().append(str);
                    $('#' + controlName).trigger('liszt:updated');
                }
            }
            else
                GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình xử lý.");
        }
    });
}

function GetStatusSelect(controlName, typeCode) {
    $.ajax({
        url: '/status/GetSelectList',
        type: 'POST',
        data: JSON.stringify({ 'typeCode': typeCode }),
        contentType: 'application/json charset=utf-8',
        success: function (data) {
            if (data.Result == "OK") {
                if (data.Data.length > 0) {
                    var str = '';
                    if (data.Data.length > 0) {
                        $.each(data.Data, function (index, item) {
                            str += ' <option value="' + item.Value + '">' + item.Name + '</option>';
                        });
                    }
                    $('#' + controlName).empty().append(str);
                    $('[' + controlName + ']').empty().append(str);
                    $('#' + controlName).trigger('liszt:updated');
                }
            }
            else
                GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình xử lý.");
        }
    });
}

function GetStatusTypeSelect(controlId) {
    $.ajax({
        url: '/statustype/GetSelectList',
        type: 'POST',
        data: '',
        contentType: 'application/json charset=utf-8',
        success: function (data) {
            if (data.Result == "OK") {
                var str = ' <option value="0"> Không có dữ liệu </option>';
                if (data.Data.length > 0) {
                    // str = ' <option value="0">- Chọn Loại Thời Gian -</option>';
                    str = ' ';
                    $.each(data.Data, function (index, item) {
                        str += ' <option value="' + item.Value + '">' + item.Name + '</option>';
                    });
                }
                $('#' + controlId).empty().append(str);
                $('[' + controlId + ']').empty().append(str);
                $('#' + controlId).trigger('liszt:updated');
            }
            else
                GlobalCommon.ShowMessageDialog('Lỗi', function () { }, "Đã có lỗi xảy ra trong quá trình xử lý.");
        }
    });
}

function GetTemplateFileSelect(controlId) {
    $.ajax({
        url: '/TemplateFile/GetSelectList',
        type: 'POST',
        contentType: 'application/json charset=utf-8',
        success: function (result) {
            GlobalCommon.CallbackProcess(result, function () {
                if (result.Result == "OK") {
                    var str = '<option value="0">Không có dữ liệu</option>';
                    if (result.Data.length > 0) {
                        str = '';
                        $.each(result.Data, function (index, item) {
                            str += '<option value="' + item.Value + '" >' + item.Name + '</option>';
                        });
                    }
                    $('#' + controlId).empty().append(str).change();
                    $('[' + controlId + ']').empty().append(str).change();
                    $('#' + controlId).trigger('liszt:updated');
                }
                else
                    alert(msg, function () { }, "Đã có lỗi xảy ra trong quá trình xử lý.");
            }, false, '', true, true, function () {

                var msg = GlobalCommon.GetErrorMessage(result);
                GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
            });
        }
    });
}

function GetPOSelect(controlId) {
    $.ajax({
        url: '/PO/GetSelectList',
        type: 'POST',
        contentType: 'application/json charset=utf-8',
        success: function (result) {
            GlobalCommon.CallbackProcess(result, function () {
                if (result.Result == "OK") {
                    var str = '<option value="0">Không có dữ liệu</option>';
                    if (result.Data.length > 0) {
                        str = '';
                        $.each(result.Data, function (index, item) {
                            if (item.Value == 0)
                                str += `<option value="${item.Value}" >${item.Name}</option>`;
                            else
                                str += `<option value="${item.Value}" >${item.Code} | ${item.Name}</option>`;
                        });
                    }
                    $('#' + controlId).empty().append(str).change();
                    $('[' + controlId + ']').empty().append(str).change();
                    $('#' + controlId).trigger('liszt:updated');
                }
                else
                    alert(msg, function () { }, "Đã có lỗi xảy ra trong quá trình xử lý.");
            }, false, '', true, true, function () {

                var msg = GlobalCommon.GetErrorMessage(result);
                GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
            });
        }
    });
}

function getStatusId(name) {
    switch (name) {
        case 'NotStated': return 1;
        case 'Doing': return 2;
        case 'Cheking': return 3; 
        case 'Error': return 4;
        case 'Done': return 5; 
        case 'Draft': return 7;
        case 'Submited': return 8;
        case 'Approved': return 9; 
    }
}

