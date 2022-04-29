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
GPRO.namespace('EmployeeList');
GPRO.EmployeeList = function () {
    var Global = {
        UrlAction: {
            GetList: '/Employee/Gets',
            SaveEmployee: '/Employee/Save',
            DeleteEmployee: '/Employee/Delete',

        },
        Element: {
            Jtable: 'jtableEmployee',
            PopupEmployee: 'popup_Employee',
        },
        Data: {
            ModelEmployee: {},
            IsInsert: true
        }
    }
    this.GetGlobal = function () {
        return Global;
    }

    this.Init = function () {
        RegisterEvent();
        InitList();
        ReloadList();
        InitPopup();
        $('[re-e-user]').click();
    }

    var RegisterEvent = function () {
        $("#eGender").bootstrapToggle( );

        $("#EBirthday").kendoDatePicker({
            format: "dd/MM/yyyy",
        });

        $('#e-file-upload').change(function () {
            readURL(this);
        });

        $('#e-btn-file-upload').click(function () {
            $('#e-file-upload').click();
        });

        $('#e-file-upload').select(function () {
            SaveEmployee();
        });

        $('[re-e-user]').click(function () {
            GetUserSelect('e-user');
        });
    }

    function InitList() {
        $('#' + Global.Element.Jtable).jtable({
            title: 'Quản Lý Nhân Viên',
            paging: true,
            pageSize: 1000,
            pageSizeChange: true,
            sorting: true,
            selectShow: false,
            actions: {
                listAction: Global.UrlAction.GetList,
                createAction: Global.Element.PopupEmployee,
            },
            messages: {
                addNewRecord: 'Thêm nhân viên',
            },
            searchInput: {
                id: 'ekeyword',
                className: 'search-input',
                placeHolder: 'Nhập từ khóa ...',
                keyup: function (evt) {
                    if (evt.keyCode == 13)
                        ReloadList();
                }
            },
            fields: {
                Id: {
                    key: true,
                    create: false,
                    edit: false,
                    list: false
                },
                Image: {
                    title: ' ',
                    width: '5%',
                    sorting: false,
                    display: function (data) {
                        var text = $('<img style = "width:60px" src="' + data.record.Image + '"  />');
                        if (data.record.Image != null) {
                            return text;
                        }
                        return '';
                    }
                },
                UserId: {
                    title: 'TK hệ thống',
                    width: '10%',
                    display: function (data) {
                        return data.record.UserName;
                    }
                },
                Code: {
                    title: 'Mã Nhân Viên',
                    width: '10%'
                },
                FullName: {
                    visibility: 'fixed',
                    title: "Tên Nhân Viên",
                    width: "20%",
                },

                Birthday: {
                    title: 'Ngày Sinh',
                    width: '10%',
                    display: function (data) {
                        date = new Date(parseJsonDateToDate(data.record.Birthday));
                        txt = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
                        return txt;
                    }
                },
                Gender: {
                    title: 'Giới Tính',
                    width: '5%',
                    display: function (data) {
                        var text = '';
                        if (data.record.Gender)
                            text = $('<i class="fa fa-male" style="font-size:26px"></i> ');
                        else
                            text = $('<i class="fa fa-female blue"  style="font-size:26px"></i> ');
                        return text;
                    }
                },
                Email: {
                    title: "Email",
                    width: "20%",
                },
                Mobile: {
                    title: "Điện thoại",
                    width: "20%",
                },
                edit: {
                    title: '',
                    width: '1%',
                    sorting: false,
                    display: function (data) {
                        var text = $('<i data-toggle="modal" data-target="#' + Global.Element.PopupEmployee + '" title="Chỉnh sửa thông tin" class="fa fa-pencil-square-o clickable blue"  ></i>');
                        text.click(function () {
                            var date = new Date(parseJsonDateToDate(data.record.Birthday));
                            var datepicker = $("#EBirthday").data("kendoDatePicker");
                            datepicker.value(new Date(date.getFullYear(), date.getMonth(), date.getDate()));
                            datepicker.trigger("change");

                           $("#eGender").prop("checked",data.record.Gender).change(); 

                            $('#e-id').val(data.record.Id);
                            $('#e-user').val((data.record.UserId ? data.record.UserId : 0));
                            $('#ecode').val(data.record.Code);
                            $('#efirst').val(data.record.FirstName);
                            $('#elast').val(data.record.LastName);
                            $('#e-email').val(data.record.Email);
                            $('#e-phone').val(data.record.Mobile);
                            if (data.record.Image)
                                $('.img-avatar').attr('src', data.record.Image);
                            Global.Data.IsInsert = false;
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

    function ReloadList() {
        $('#' + Global.Element.Jtable).jtable('load', { 'keyword': $('#ekeyword').val() });
    }

    function Delete(Id) {
        $.ajax({
            url: Global.UrlAction.DeleteEmployee,
            type: 'POST',
            data: JSON.stringify({ 'Id': Id }),
            contentType: 'application/json charset=utf-8',
            success: function (data) {
                GlobalCommon.CallbackProcess(data, function () {
                    if (data.Result == "OK") {
                        ReloadList();
                    }
                    else
                        GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình sử lý.");
                }, false, Global.Element.PopupEmployeeList, true, true, function () {

                    var msg = GlobalCommon.GetErrorMessage(data);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
                });
            }
        });
    }

    function InitPopup() {
        $("#" + Global.Element.PopupEmployee).modal({
            keyboard: false,
            show: false
        });
        $('#' + Global.Element.PopupEmployee).on('shown.bs.modal', function () {
            $('div.divParent').attr('currentPoppup', Global.Element.PopupEmployee.toUpperCase());
        });

        $("#" + Global.Element.PopupEmployee + ' button[esave]').click(function () {
            if (CheckValidate())
                if ($('#e-file-upload').val() != '')
                    UpSingle("e-form-upload", "e-file-upload");
                else
                    SaveEmployee();
        });

        $("#" + Global.Element.PopupEmployee + ' button[ecancel]').click(function () {
            $("#" + Global.Element.PopupEmployee).modal("hide");
            setToDefault();
            $('div.divParent').attr('currentPoppup', '');
        });
    }

    function setToDefault() {
        var date = new Date();
        var datepicker = $("#EBirthday").data("kendoDatePicker");
        datepicker.value(new Date(date.getFullYear(), date.getMonth(), date.getDate()));
        datepicker.trigger("change");

         $("#eGender").prop("checked", false).change(); 

        $('#e-id').val(0);
        $('#e-user').val(0);
        $('#ecode').val('');
        $('#efirst').val('');
        $('#elast').val('');
        $('#e-email').val('');
        $('#e-phone').val('');
    }

    function CheckValidate() {
        if ($('#ecode').val().trim() == '') {
            GlobalCommon.ShowMessageDialog("Bạn chưa nhập mã nhân viên.", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        else if ($('#efirst').val().trim() == '') {
            GlobalCommon.ShowMessageDialog("Bạn chưa nhập họ.", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        else if ($('#elast').val().trim() == '') {
            GlobalCommon.ShowMessageDialog("Bạn chưa nhập tên.", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        else if ($('#EBirthday').val().trim() == '') {
            GlobalCommon.ShowMessageDialog("Bạn chưa chọn ngày sinh.", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        return true;
    }

    function SaveEmployee() {
        var obj = {
            Id: $('#e-id').val(),
            UserId: $('#e-user').val(),
            FirstName: $('#efirst').val(),
            LastName: $('#elast').val(),
            Gender: $("#eGender").prop("checked"),
            Birthday: $("#EBirthday").data("kendoDatePicker").value(),
            Mobile: $('#e-phone').val(),
            Code: $('#ecode').val(),
            Email: $('#e-email').val(),
            Picture: $('#e-file-upload').attr('newurl')
        };

        $.ajax({
            url: Global.UrlAction.SaveEmployee,
            type: 'post',
            data: JSON.stringify(obj),
            contentType: 'application/json',
            beforeSend: function () { $('#loading').show(); },
            success: function (result) {
                $('#loading').hide();
                GlobalCommon.CallbackProcess(result, function () {
                    if (result.Result == "OK") {
                        ReloadList();
                        setToDefault();
                        if (!Global.Data.IsInsert)
                            $("#" + Global.Element.PopupEmployee + ' button[ecancel]').click();
                        Global.Data.IsInsert = true;
                    }
                    else
                        GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình sử lý.");
                }, false, Global.Element.PopupModule, true, true, function () {
                    var msg = GlobalCommon.GetErrorMessage(result);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình sử lý.");
                });
            }
        });
    }
}
$(document).ready(function () {
    var EmployeeList = new GPRO.EmployeeList();
    EmployeeList.Init();
});