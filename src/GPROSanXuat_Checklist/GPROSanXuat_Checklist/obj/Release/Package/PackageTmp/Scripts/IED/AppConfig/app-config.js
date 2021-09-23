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
GPRO.namespace('AppConfig');
GPRO.AppConfig = function () {
    var Global = {
        UrlAction: {
            Gets: '/AppConfig/Gets',
            Save: '/AppConfig/Save',
        },
        Element: {
            Jtable: 'jtable-app-config',
            PopupSearch: 'popup-search-app-config',
            Popup: 'popup-app-config',
        },
        Data: {
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
        InitPopupSearch();

    }

    var RegisterEvent = function () {
        $('#cf_name, #cf_code').attr("disabled", true);
    }


    function InitList() {
        $('#' + Global.Element.Jtable).jtable({
            title: 'Danh Sách Cấu Hình',
            paging: true,
            pageSize: 10,
            pageSizeChange: true,
            sorting: true,
            selectShow: false,
            actions: {
                listAction: Global.UrlAction.Gets, 
            },
            messages: {  
            },
            datas: {
                jtableId: Global.Element.Jtable
            },
            searchInput: {
                id: 'app-config-keyword',
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
                Name: {
                    visibility: 'fixed',
                    title: "Tên Cấu Hình",
                    width: "20%",
                },
                Code: {
                    title: "Mã Cấu Hình",
                    width: "10%",
                },
                Value: {
                    title: "Giá Trị",
                    width: "10%",
                },
                Note: {
                    title: "Ghi Chú",
                    width: "20%",
                    sorting: false
                },
                edit: {
                    title: '',
                    width: '1%',
                    sorting: false,
                    display: function (data) {
                        var text = $('<i data-toggle="modal" data-target="#' + Global.Element.Popup + '" title="Chỉnh sửa thông tin" class="fa fa_tb fa-pencil-square-o clickable blue"></i>');
                        text.click(function () {
                            $('#app-config-id').val(data.record.Id);
                            $('#app-config-name').val(data.record.Name);
                            $('#app-config-code').val(data.record.Code);
                            $('#app-config-value').val(data.record.Value);
                            $('#app-config-note').val(data.record.Note);
                            Global.Data.IsInsert = false;
                        });
                        return text;
                    }
                }
            }
        });
    }

    function ReloadList() {
        $('#' + Global.Element.Jtable).jtable('load', { 'keyword': $('#app-config-keyword').val() });
        $('#' + Global.Element.PopupSearch).modal('hide');
    }

    function InitPopup() {
        $("#" + Global.Element.Popup).modal({
            keyboard: false,
            show: false
        });

        $('#' + Global.Element.Popup + ' button[app-config-save]').click(function () {
            if (CheckValidate())
                Save();
        });

        $('#' + Global.Element.Popup + ' button[app-config-cancel]').click(function () {
            $("#" + Global.Element.Popup).modal("hide");
            resetForm();
        });
    }

    function CheckValidate() {
        if ($('#app-config-code').val().trim() == "") {
            GlobalCommon.ShowMessageDialog("Vui lòng nhập mã.", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        else if ($('#app-config-name').val().trim() == "") {
            GlobalCommon.ShowMessageDialog("Vui lòng nhập tên.", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        else if ($('#app-config-value').val().trim() == "") {
            GlobalCommon.ShowMessageDialog("Vui lòng nhập giá trị.", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        return true;
    }

    function Save() {
        var obj = {
            Id: $('#app-config-id').val(),
            Name: $('#app-config-name').val(),
            Code: $('#app-config-code').val(),
            Value: $('#app-config-value').val(),
            Note: $('#app-config-note').val()
        };
        $.ajax({
            url: Global.UrlAction.Save,
            type: 'POST',
            data: ko.toJSON(obj),
            contentType: 'application/json charset=utf-8',
            success: function (result) {
                if (result.Result == "OK") {
                    ReloadList();
                    resetForm();
                    if (!Global.Data.IsInsert) {
                        $("#" + Global.Element.Popup + ' button[app-config-cancel]').click();
                        $('div.divParent').attr('currentPoppup', '');
                    }
                    Global.Data.IsInsert = true;
                }
                else
                    GlobalCommon.ShowMessageDialog(result.ErrorMessages[0].Message, function () { }, 'Lỗi');
            }
        });
    }

    function InitPopupSearch() {
        $("#" + Global.Element.PopupSearch).modal({
            keyboard: false,
            show: false
        });

        $('#' + Global.Element.PopupSearch + ' button[app-config-search]').click(function () {
            ReloadList();
            $('#' + Global.Element.PopupSearch + ' #keyword').val('');
        });

        $('#' + Global.Element.PopupSearch + ' button[app-config-close]').click(function () {
            $("#" + Global.Element.PopupSearch).modal("hide");
            $('#' + Global.Element.PopupSearch + ' #app-config-keyword').val('');
        });
    }

    resetForm = () => {
        $('#app-config-id').val(0);
        $('#app-config-name').val('');
        $('#app-config-code').val('');
        $('#app-config-value').val('');
        $('#app-config-note').val('');
    }
}
$(document).ready(function () {
    var obj = new GPRO.AppConfig();
    obj.Init();
})