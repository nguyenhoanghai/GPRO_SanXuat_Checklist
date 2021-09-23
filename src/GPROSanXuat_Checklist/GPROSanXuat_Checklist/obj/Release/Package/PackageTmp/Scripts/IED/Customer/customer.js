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
GPRO.namespace('Customer');
GPRO.Customer = function () {
    var Global = {
        UrlAction: {
            Gets: '/Customer/Gets',
            Save: '/Customer/Save',
            Delete: '/Customer/Delete',
        },
        Element: {
            Jtable: 'jtableCustomer',
            Popup: 'popup_Customer',
            Search: 'pSearch_Popup'
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
    }

    var RegisterEvent = function () {  
    }

    setToDefault = () => {
        $('#c-id').val(0);
        $('#c-code').val('');
        $('#c-name').val('');
        $('#c-phone').val('');
        $('#c-address').val('');
        $('#c-des').val('');
        $('#c-index').val('');
        $('#c-type').val(1);
        $('#c-email').val('');
        $("#c-IsPrivate").prop('checked', false).change();
        $('#c-telephone').val('');

        $('#c-fax').val('');
        $('#c-representative').val('');
        $('#c-taxcode').val('');

        $('#c-bankaccount').val('');
        $('#c-cardnumber').val('');
        $('#c-defaultaccount').val('');
        $('#c-defaultaccountcode').val('');
        $('#c-creditaccount').val('');
        $('#c-debitlimitallow').val('');
        $('#c-debitlimitstandard').val('');
        $('#c-upadjust').val('');
    }

    function Save() {
        var obj = {
            Id: $('#c-id').val(),
            Name: $('#c-name').val(),
            Code: $('#c-code').val(),
            Phone: $('#c-phone').val(),
            Address: $('#c-address').val(),
            Note: $('#c-des').val(),
            IsPrivate: $("#c-IsPrivate").prop('checked'),
            Index: Global.Data.Index,
            Type: $('#c-type').val(),
            Email: $('#c-email').val(),
            Address: $('#c-address').val(),
            Telephone: $('#c-telephone').val(),
            Fax: $('#c-fax').val(),
            Representative: $('#c-representative').val(),
            TaxCode: $('#c-taxcode').val(),
            BankAccount: $('#c-bankaccount').val(),
            CardNumber: $('#c-cardnumber').val(),
            DefaultAccount: $('#c-defaultaccount').val(),
            DefaultAccountCode: $('#c-defaultaccountcode').val(),
            CreditAccount: $('#c-creditaccount').val(),
            DebitLimitAllow: $('#c-debitlimitallow').val(),
            DebitLimitStandard: $('#c-debitlimitstandard').val(),
            UpAdjust: $('#c-upadjust').val(),
            Index: Global.Data.Index,
        };
        if (obj.Id == 0)
            obj.Index += 1;
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
                        setToDefault();
                        if (!Global.Data.IsInsert) {
                            $("#" + Global.Element.Popup + ' button[c-cancel]').click();
                            $('div.divParent').attr('currentPoppup', '');
                        }
                        else
                            GetLastIndex();
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
            title: 'Quản lý khách hàng',
            paging: true,
            pageSize: 1000,
            pageSizeChange: true,
            sorting: true,
            selectShow: false,
            actions: {
                listAction: Global.UrlAction.Gets,
                createAction: Global.Element.Popup, 
            },
            messages: {
                addNewRecord: 'Thêm mới',  
            },
            searchInput: {
                id: 'c-keyword',
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
                Code: {
                    title: "Mã khách hàng",
                    width: "10%",
                },
                Name: {
                    visibility: 'fixed',
                    title: "Tên khách hàng",
                    width: "20%",
                },
                Phone: {
                    title: "Di động - điện thoại bàn",
                    width: "10%",
                    sorting: false,
                    display: function (data) {
                        return `${data.record.Phone} - ${data.record.Telephone}`
                    }
                },
                Address: {
                    title: "Địa chỉ",
                    width: "20%",
                    sorting: false,
                },
                Note: {
                    title: "Ghi chú",
                    width: "20%",
                    sorting: false,
                },
                edit: {
                    title: '',
                    width: '1%',
                    sorting: false,
                    display: function (data) {
                        var text = $('<i data-toggle="modal" data-target="#' + Global.Element.Popup + '" title="Chỉnh sửa thông tin" class="fa fa-pencil-square-o clickable blue"  ></i>');
                        text.click(function () {
                            $('#c-id').val(data.record.Id);
                            $('#c-code').val(data.record.Code);
                            $('#c-name').val(data.record.Name);
                            $('#c-phone').val(data.record.Phone);
                            $('#c-address').val(data.record.Address);
                            $('#c-des').val(data.record.Note);
                            $("#c-IsPrivate").prop('checked', data.record.IsPrivate).change();

                            $('#c-index').val((data.record.Code));
                            $('#c-type').val(data.record.Type);
                            $('#c-email').val(data.record.Email);

                            $('#c-telephone').val(data.record.Telephone);

                            $('#c-fax').val(data.record.Fax);
                            $('#c-representative').val(data.record.Representative);
                            $('#c-taxcode').val(data.record.TaxCode);

                            $('#c-bankaccount').val(data.record.BankAccount);
                            $('#c-cardnumber').val(data.record.CardNumber);
                            $('#c-defaultaccount').val(data.record.DefaultAccount);
                            $('#c-defaultaccountcode').val(data.record.DefaultAccountCode);
                            $('#c-creditaccount').val(data.record.CreditAccount);
                            $('#c-debitlimitallow').val(data.record.DebitLimitAllow);
                            $('#c-debitlimitstandard').val(data.record.DebitLimitStandard);
                            $('#c-upadjust').val(data.record.UpAdjust);
                            Global.Data.Index = data.record.Index;
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
        var keySearch = $('#c-keyword').val();
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
                        BindData(null);
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
            if ($('#c-id').val() == '' || $('#c-id').val() == '0')
                GetLastIndex();
        });

        $("#" + Global.Element.Popup + ' button[c-save]').click(function () {
            if (CheckValidate()) {
                Save();
            }
        });
        $("#" + Global.Element.Popup + ' button[c-cancel]').click(function () {
            $("#" + Global.Element.Popup).modal("hide");
            setToDefault();
        });
    }

    function CheckValidate() {
         if ($('#c-name').val().trim() == "") {
            GlobalCommon.ShowMessageDialog("Vui lòng nhập Tên khách hàng.", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        return true;
    }

    function GetLastIndex() {
        $.ajax({
            url: '/Customer/GetLastIndex',
            type: 'POST',
            contentType: 'application/json',
            beforeSend: function () { $('#loading').show(); },
            success: function (data) {
                $('#loading').hide();
                Global.Data.Index = parseInt(data.Records);
                Global.Data.Code = data.Data;
                $('#c-index').val((Global.Data.Code + (Global.Data.Index + 1)));
            }
        });
    };
}

$(document).ready(function () {
    var Customer = new GPRO.Customer();
    Customer.Init();
});
