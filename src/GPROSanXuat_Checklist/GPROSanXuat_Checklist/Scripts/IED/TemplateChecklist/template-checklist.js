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
GPRO.namespace('TemplateChecklist');
GPRO.TemplateChecklist = function () {
    var Global = {
        UrlAction: {
            GetLists: '/TemplateChecklist/Gets',
            Save: '/TemplateChecklist/Save',
            Edit: '/TemplateChecklist/Edit',
            Delete: '/TemplateChecklist/Delete',
            GetJobSteps:'/TemplateCL_JobStep/Gets'
        },
        Element: {
            Jtable: 'jtable-template-checklist',
            Popup: 'popup-template-checklist',
            Search: 'template-checklist-search-popup',
            PopupEdit: 'popup-template-checklist-edit'
        },
        Data: {
            IsInsert: true,
            templateId: 0
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
        InitSearchPopup();
        InitPopupEdit();
    }

    var RegisterEvent = function () {

    }

    function CheckValidate() {
        if ($('#template-checklist-name').val().trim() == "") {
            GlobalCommon.ShowMessageDialog("Vui lòng nhập Tên mẫu.", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        return true;
    }

    function Save() {
        var obj = {
            Id: $('#template-checklist-id').val(),
            Name: $('#template-checklist-name').val(),
            Note: $('#template-checklist-note').val(),
        }

        $.ajax({
            url: Global.UrlAction.Save,
            type: 'post',
            data: ko.toJSON(obj),
            contentType: 'application/json',
            beforeSend: function () { $('#loading').show(); },
            success: function (result) {
                $('#loading').hide();
                GlobalCommon.CallbackProcess(result, function () {
                    if (result.Result == "OK") {
                        ReloadList();
                        $('#template-checklist-id').val('0');
                        $('#template-checklist-note').val('');
                        $("#template-checklist-name").val('');
                        if (!Global.Data.IsInsert) {
                            $("#" + Global.Element.PopupTemplateChecklist + ' button[template-checklist-cancel]').click();
                            $('div.divParent').attr('currentPoppup', '');
                        }
                        Global.Data.IsInsert = true;
                    }
                    else
                        GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình xử lý.");
                }, false, Global.Element.PopupModule, true, true, function () {
                    var msg = GlobalCommon.GetErrorMessage(result);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình xử lý.");
                });
            }
        });
    }

    function InitList() {
        $('#' + Global.Element.Jtable).jtable({
            title: 'Quản lý mẫu',
            paging: true,
            pageSize: 1000,
            pageSizeChange: true,
            sorting: true,
            selectShow: false,
            actions: {
                listAction: Global.UrlAction.GetLists,
                createAction: Global.Element.Popup, 
            },
            messages: {
                addNewRecord: 'Thêm mới', 
            },
            searchInput: {
                id: 'template-checklist-keyword',
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
                    title: "Tên mẫu",
                    width: "20%",
                },
                Note: {
                    title: "Mô Tả ",
                    width: "20%",
                    sorting: false,
                },
                edit: {
                    title: '',
                    width: '1%',
                    sorting: false,
                    display: function (data) {
                        var text = $('<i data-toggle="modal" data-target="#' + Global.Element.PopupEdit + '" title="Chỉnh sửa thông tin" class="fa fa-pencil-square-o clickable blue"  ></i>');
                        text.click(function () {
                            //window.location.href = Global.UrlAction.Edit + "?code=" + data.record.Id
                             
                            $("[template-name]").html(data.record.Name);
                            ReloadJobSteps(data.record.Id);
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
        var keySearch = $('#template-checklist-keyword').val();
        $('#' + Global.Element.Jtable).jtable('load', { 'keyword': keySearch });
    }

    function Delete(Id) {
        $.ajax({
            url: Global.UrlAction.Delete,
            type: 'POST',
            data: JSON.stringify({ 'Id': Id }),
            contentType: 'application/json charset=utf-8',
            beforeSend: function () { $('#loading').show(); },
            success: function (data) {
                $('#loading').hide();
                GlobalCommon.CallbackProcess(data, function () {
                    if (data.Result == "OK") {
                        ReloadList();
                    }
                    else
                        GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình xử lý.");
                }, false, Global.Element.Popup, true, true, function () {

                    var msg = GlobalCommon.GetErrorMessage(data);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
                });
            }
        });
    }

    function InitPopup() {
        $("#" + Global.Element.Popup).modal({
            keyboard: false,
            show: false
        });

        $('#' + Global.Element.Popup).on('shown.bs.modal', function () {
            $('div.divParent').attr('currentPoppup', Global.Element.Popup.toUpperCase());
        });

        $("#" + Global.Element.Popup + ' button[template-checklist-save]').click(function () {
            if (CheckValidate()) {
                Save();
            }
        });

        $("#" + Global.Element.Popup + ' button[template-checklist-cancel]').click(function () {
            $("#" + Global.Element.Popup).modal("hide");
            $('#template-checklist-id').val('0');
            $('#template-checklist-note').val('');
            $("#template-checklist-name").val('');
        });
    }

    InitSearchPopup = () => {
        $('#' + Global.Element.Search).on('shown.bs.modal', function () {
            $('div.divParent').attr('currentPoppup', Global.Element.Search.toUpperCase());
        });

        $('[template-checklist-close]').click(function () {
            $('#template-checklist-keyword').val('');
            $('div.divParent').attr('currentPoppup', '');
        });

        $('[template-checklist-search]').click(function () {
            ReloadList();
            $('#template-checklist-keyword').val('');
            $('[template-checklist-close]').click();
        });
    }




    InitPopupEdit = () => {
        $("#" + Global.Element.PopupEdit).modal({
            keyboard: false,
            show: false
        });

        $('#' + Global.Element.PopupEdit).on('shown.bs.modal', function () {
            $('div.divParent').attr('currentPoppup', Global.Element.PopupEdit.toUpperCase());

        });

        $("#" + Global.Element.PopupEdit + ' button[template-checklist-cancel]').click(function () {
            $("#" + Global.Element.PopupEdit).modal("hide");
            //$('#template-checklist-id').val('0');
            //$('#template-checklist-note').val('');
            //$("#template-checklist-name").val('');
        });
    }

 
}

$(document).ready(function () {
    var TemplateChecklist = new GPRO.TemplateChecklist();
    TemplateChecklist.Init();
});
