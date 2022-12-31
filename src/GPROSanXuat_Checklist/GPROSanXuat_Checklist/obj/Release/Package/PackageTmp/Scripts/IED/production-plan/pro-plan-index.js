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
GPRO.namespace('ProductionPlan');
GPRO.ProductionPlan = function () {
    var Global = {
        UrlAction: {
            Gets: '/ProductionPlan/Gets',
            Save: '/ProductionPlan/Save',
            Delete: '/ProductionPlan/Delete',
        },
        Element: {
            Jtable: 'jtable-pro-plan',
            Popup: 'popup-pro-plan'
        },
        Data: {
            isInsert: true
        }
    }
    this.GetGlobal = function () {
        return Global;
    }

    this.Init = function () {
        RegisterEvent();
        InitJtable();
        //ReloadJtable();
        InitPopup();
        GetPhaseSelect('pro-plan-phase', 0);
        GetAssignmentSelect('pro-plan-csp');
    }


    var RegisterEvent = function () {
        $('[re-phase]').click(() => {
            GetPhaseSelect('pro-plan-phase',0);
        })

        $('[re-csp]').click(() => {
            GetAssignmentSelect('pro-plan-csp');
        })

        $('#pro-plan-csp').change(() => {
            ReloadJtable();
        })
    }

    function BindData(obj) {
        $('#pro-plan-id').val(0);
        $('#pro-plan-phase').val(0);
        $('#pro-plan-pro').val(0); 
        if (obj) {
            $('#pro-plan-id').val(obj.Id);
            $('#pro-plan-phase').val(obj.PhaseId);
            $('#pro-plan-pro').val(obj.Productivity);
        }
    }

    function Save() {
        var obj = {
            Id: $('#pro-plan-id').val(),
            CSPId: $('#pro-plan-csp').val(),
            PhaseId: $('#pro-plan-phase').val(),
            Productivity: $('#pro-plan-pro').val(),
        };
        $.ajax({
            url: Global.UrlAction.Save,
            type: 'post',
            data: JSON.stringify(obj),
            contentType: 'application/json',
            beforeSend: function () { $('#loading').show(); },
            success: function (result) {
                $('#loading').hide();
                GlobalCommon.CallbackProcess(result, function () {
                    if (result.Result == "OK") {
                        BindData(null);
                        ReloadJtable();
                        if (!Global.Data.isInsert)
                            $("#" + Global.Element.Popup + ' button[pro-plan-cancel]').click();
                        Global.Data.isInsert = true;
                    }
                }, false, Global.Element.PopupWorkShop, true, true, function () {
                    var msg = GlobalCommon.GetErrorMessage(result);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình xử lý.");
                });
            }
        });
    }

    function InitJtable() {
        $('#' + Global.Element.Jtable).jtable({
            title: 'Danh sách định mức',
            paging: true,
            pageSize: 1000,
            pageSizeChange: true,
            sorting: true,
            selectShow: false,
            actions: {
                listAction: Global.UrlAction.Gets,
                createAction: Global.Element.Popup
            },
            messages: {
                addNewRecord: 'Thêm mới',
            },
            //searchInput: {
            //    id: 'pro-plan-keyword',
            //    className: 'search-input',
            //    placeHolder: 'Nhập từ khóa ...',
            //    keyup: function (evt) {
            //        if (evt.keyCode == 13)
            //            ReloadJtable();
            //    }
            //},
            fields: {
                Id: {
                    key: true,
                    create: false,
                    edit: false,
                    list: false
                },
                //Type: {
                //    visibility: 'fixed',
                //    title: "Loại công đoạn",
                //    width: "10%",
                //    display: (data) => {
                //        if (data.record.Type == 1)
                //            return '<span>BTP hoàn chỉnh</span>';
                //        return '<span>Hoàn tất</span>';
                //    }
                //},
                //Index: {
                //    title: "STT",
                //    width: "5%",
                //},
                PhaseId: {
                    title: "Công đoạn",
                    width: "20%",
                    display: (data) => {
                        return data.record.PhaseName;
                    }
                },
                Productivity: {
                    title: "Sản lượng dự kiến/ tháng",
                    width: "20%",
                    sorting: false
                },
                edit: {
                    title: '',
                    width: '5%',
                    sorting: false,
                    display: function (data) {
                        var div = $('<div class="table-action"></div>');
                        var text = $('<i data-toggle="modal" data-target="#' + Global.Element.Popup + '" title="Chỉnh sửa thông tin" class="fa fa-pencil-square-o "  ></i>');
                        text.click(function () {
                            BindData(data.record);
                            Global.Data.isInsert = false;
                        });
                        div.append(text);

                        var btnDelete = $('<i title="Xóa" class="fa fa-trash-o  "> </button>');
                        btnDelete.click(function () {
                            GlobalCommon.ShowConfirmDialog('Bạn có chắc chắn muốn xóa?', function () {
                                Delete(data.record.Id);
                            }, function () { }, 'Đồng ý', 'Hủy bỏ', 'Thông báo');
                        });
                        div.append(btnDelete);
                        return div;
                    }
                } 
            }
        });
    }

    function ReloadJtable() {
        $('#' + Global.Element.Jtable).jtable('load', { 'cspId': $('#pro-plan-csp').val() });
    }

    function Delete(Id) {
        $.ajax({
            url: Global.UrlAction.Delete,
            type: 'POST',
            data: JSON.stringify({ 'Id': Id }),
            contentType: 'application/json charset=utf-8', beforeSend: function () { $('#loading').show(); },
            success: function (data) {
                $('#loading').hide();
                GlobalCommon.CallbackProcess(data, function () {
                    if (data.Result == "OK") {
                        ReloadJtable();
                    }
                }, false, Global.Element.PopupWorkShop, true, true, function () {
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
        $("#" + Global.Element.Popup + ' button[pro-plan-save]').click(function () {
            if (CheckValidate()) {
                Save();
            }
        });
        $("#" + Global.Element.Popup + ' button[pro-plan-cancel]').click(function () {
            $("#" + Global.Element.Popup).modal("hide");
            BindData(null);
            $('div.divParent').attr('currentPoppup', '');
        });

        $('#' + Global.Element.Popup).on('shown.bs.modal', function () {
            $('div.divParent').attr('currentPoppup', Global.Element.Popup.toUpperCase());
        });
    }


    function CheckValidate() {
        if ($('#pro-plan-phase').val().trim() == "") {
            GlobalCommon.ShowMessageDialog("Vui lòng chọn công đoạn.", function () { }, "Lỗi Nhập liệu");
            $('#pro-plan-phase').focus();
            return false;
        }
        else if ($('#pro-plan-pro').val().trim() == "") {
            GlobalCommon.ShowMessageDialog("Vui lòng nhập sản lượng định mức.", function () { }, "Lỗi Nhập liệu");
            $('#pro-plan-pro').focus();
            return false;
        }
        return true;
    }
}
$(document).ready(function () {
    var obj = new GPRO.ProductionPlan();
    obj.Init();
})
