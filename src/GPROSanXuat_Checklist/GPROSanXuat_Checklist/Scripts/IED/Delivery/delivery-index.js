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
GPRO.namespace('Delivery');
GPRO.Delivery = function () {
    var Global = {
        UrlAction: {
            GetList: '/Delivery/Gets',
            Delete: '/Delivery/Delete',
            Save: '/Delivery/Save',
            Approve: '/Delivery/approve',

            GetChild: '/DeliveryDetail/Gets?Id=',
            SaveChild: '/DeliveryDetail/Save',
            DeleteChild: '/DeliveryDetail/Delete',

            GetLot: '/LotSupplies/Gets',
        },
        Element: {
            Jtable: 'delivery-jtable',
            PopupSearch: 'delivery-popup-search',
            Popup: 'delivery-popup',

            popupChild: 'delivery-detail-popup',
            JtableChild: 'delivery-detail-jtable',

        },
        Data: {
            DeliveryModel: {},
            DeliveryDetailModel: {},
            parentId: 0,
            QuantityUsed: 0,
            Quantity: 0,
            ObjectId: 0,
            IsApproved: false,
            Index: 0,
            Code: '',
            KhoObj: { Id: 0, Name: '' },
            orderDetailId: 0
        }
    }
    this.GetGlobal = function () {
        return Global;
    }

    this.Init = function () {
        RegisterEvent();
        GetWarehouseSelect('delivery-warehouse');
        GetEmployeeSelect('delivery-deliverier');
        GetUnitSelect('delivery-unit', 'tiente');
        GetCustomerSelect('delivery-customer');  // 0 la tat ca, 1 la khach hang
        GetOrderSelect('delivery-order', true);

        InitList();
        ReloadList();
        InitPopup();
        InitPopupChild();

        InitDatePicker();
        $('[delivery-detail-save],[delivery-save],[delivery-save_d]').show();
        $('[delivery-approve]').hide();
    }

    var RegisterEvent = function () {
        $('[re-delivery-order]').click(function () {
            GetOrderSelect('delivery-order', true);
        });

        $('#delivery-order').change(function () {
            GetOrderDetailSelect('delivery-order-detail', $('#delivery-order').val(), Global.Data.orderDetailId);
        })

        $('[re-delivery-unit]').click(function () {
            GetUnitSelect('delivery-unit', 'tiente');
            $('#moneytype option:first').prop('selected', true);
            $('#moneytype').change();
        });

        $('#delivery-unit').change(function () {
            $('#delivery-exchangerate').val($('#delivery-unit option:selected').attr('tigia'));
        });

        $('[re-delivery-customer]').click(function () {
            GetCustomerSelect('delivery-customer');
        });

        $('[re-delivery-deliverier]').click(function () {
            GetEmployeeSelect('delivery-deliverier');
        });

        $('[re-delivery-warehouse]').click(function () {
            GetWarehouseSelect('delivery-warehouse');
        });



        $('[detailbox]').hide();

        $('#searchDetail').keypress(function (evt) {
            if (evt.keyCode == 13)
                ReloadTableLotSupplies();
        });


        $('[re_approveduser]').click(function () {
            GetEmployeeSelect('approveduser');
        });
    }

    function InitDatePicker() {
        $("#delivery-dateofaccounting, #delivery-date").kendoDatePicker({
            format: "dd/MM/yyyy",
            //min: new Date()
        });
    }


    function InitList() {
        $('#' + Global.Element.Jtable).jtable({
            title: 'Danh Sách Phiếu Xuất Kho',
            paging: true,
            pageSize: 10,
            pageSizeChange: true,
            sorting: true,
            selectShow: true,
            actions: {
                listAction: Global.UrlAction.GetList,
                createAction: Global.Element.Popup,
            },
            messages: {
                addNewRecord: 'Thêm mới',
                selectShow: 'Ẩn hiện cột'
            },
            searchInput: {
                id: 'delivery-keyword',
                className: 'search-input',
                placeHolder: 'Nhập từ khóa ...',
                keyup: function (evt) {
                    if (evt.keyCode == 13)
                        ReloadList();
                }
            },
            datas: {
                jtableId: Global.Element.Jtable
            },
            rowInserted: function (event, data) {
                if (data.record.Id == Global.Data.parentId) {
                    var $a = $('#' + Global.Element.Jtable).jtable('getRowByKey', data.record.Id);
                    $($a.children().find('.aaa')).click();
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
                    title: "Mã - Tên Phiếu",
                    width: "15%",
                    display: function (data) {
                        var txt = '<span>' + data.record.Name + '</span> (<span class="bold red">' + data.record.Code + '</span>)';
                        return txt;
                    }
                },
                WarehouseId: {
                    title: "Kho xuất",
                    width: "15%",
                    display: function (data) {
                        var txt = '<span>' + data.record.strWarehouse + '</span>';
                        return txt;
                    }
                },
                CustomerId: {
                    title: "Khách Hàng",
                    width: "10%",
                    display: function (data) {
                        var txt = '<span>' + data.record.strCustomer + '</span>';
                        return txt;
                    }
                },
                /*  OrderDetailId: {
                      title: "Đ.Hàng - S.Phẩm",
                      width: "15%",
                      display: function (data) {
                          if (data.record.OrderDetailId)
                              return `<span>${data.record.OrderCode} - ${data.record.ProductName}</span>`;
                          return '';
                      }
                  },*/
                /* Reciever: {
                     title: "Người Nhận",
                     width: "10%",
                 },
                 TransactionType: {
                     title: "HT Giao Dịch",
                     width: "7%",
                     display: function (data) {
                         var txt = '';
                         switch (data.record.TransactionType) {
                             case 1:
                                 txt = '<span>' + "GD Trực Tiếp" + '</span>';
                                 break;
                             case 2:
                                 txt = '<span>' + "GD Tại Sở Giao Dịch" + '</span>';
                                 break;
                             case 3:
                                 txt = '<span>' + "Mua Bán Đối Lưu" + '</span>';
                                 break;
                             case 4:
                                 txt = '<span>' + "Mua Bán Tái Xuất" + '</span>';
                                 break;
                         }
                         return txt;
                     }
                 },
                 Total: {
                     title: "Tổng Tiền - Tỷ Giá",
                     width: "15%",
                     sorting: false,
                     display: function (data) {
                         var txt = `<span class="bold red">${ParseStringToCurrency(data.record.Total)}</span> ${data.record.TienTe} <i class="fa fa-arrow-right blue"></i> <span class="bold red">${ParseStringToCurrency(data.record.ExchangeRate)}</span>`;
                         return txt;
                     }
                 },*/
                DateOfAccounting: {
                    title: 'Ngày Hạch Toán',
                    width: '5%',
                    display: function (data) {
                        var txt = "";
                        if (data.record.DateOfAccounting != null) {
                            var date = new Date(parseJsonDateToDate(data.record.DateOfAccounting))
                            txt = '<span  class="bold red">' + ParseDateToString(date) + '</span>';
                        }
                        else
                            txt = '<span class="">' + "" + '</span>';
                        return txt;
                    }
                },
                StatusId: {
                    title: 'Trạng thái',
                    width: "5%",
                    display: function (data) {
                        if (data.record.StatusId == 9)
                            return `<span class="blue">Đã duyệt</span>`;
                        if (data.record.StatusId == 8)
                            return `<span class="red">Chờ duyệt</span>`;
                        return `<span class="">Bản nháp</span>`;
                    }
                },
                //IsApproved: {
                //    title: "TT Duyệt",
                //    width: "5%",
                //    display: function (data) {
                //        var txt = '';
                //        if (data.record.IsApproved)
                //            txt = '<i class="fa fa-check-square-o red  "><i/>';
                //        else
                //            txt = '<i class="fa fa-square-o" ></i>';
                //        return txt;
                //    }
                //},
                ApprovedUser: {
                    title: "Người Duyệt",
                    width: "7%",
                    display: function (data) {
                        var txt = '';
                        if (data.record.ApprovedUser != null)
                            txt = '<span class="red ">' + data.record.strApprover + '</span>';
                        return txt;
                    }
                },
                ApprovedDate: {
                    title: "Ngày Duyệt",
                    width: "5%",
                    display: function (data) {
                        var txt = "";
                        if (data.record.ApprovedDate != null) {
                            var date = new Date(parseJsonDateToDate(data.record.ApprovedDate))
                            txt = '<span  class="bold red">' + ParseDateToString(date) + '</span>';
                        }
                        return txt;
                    }
                },
                Detail: {
                    title: 'Hành động',
                    width: '5%',
                    sorting: false,
                    edit: false,
                    display: function (parent) {
                        var $div = $('<div></div>');

                        var $img = $('<i class="fa fa-list-ol jtable-action red aaa" title="Click Xem Danh Sách Chi Tiết ' + parent.record.Name + '"></i>');
                        $img.click(function () {
                            Global.Data.KhoObj = { Id: parent.record.WarehouseId, Name: parent.record.strWarehouse };
                            Global.Data.parentId = parent.record.Id;
                            InitTableLotSupplies();

                            $('#' + Global.Element.JtableChild + " #selectShow").remove();
                            $('#' + Global.Element.JtableChild + " #delivery-detail-search-key").remove();
                            var searchInput = $('<input class="" type="text" id="delivery-detail-search-key" placeholder="Nhập tên lô vật tư" />');
                            searchInput.keyup(function (evt) {
                                if (evt.keyCode == '13')
                                    ReloadTableLotSupplies()
                            })
                            $('#' + Global.Element.JtableChild + " .jtable-toolbar").append(searchInput);

                            ReloadTableLotSupplies();

                            $('#receiptionid').val(parent.record.Id);
                            Global.Data.IsApproved = parent.record.IsApproved;
                            $('#' + Global.Element.Jtable).jtable('openChildTable',
                                $img.closest('tr'),
                                {
                                    title: '<span class="red">Chi tiết phiếu xuất kho</span>',
                                    paging: true,
                                    pageSize: 10,
                                    pageSizeChange: true,
                                    sorting: true,
                                    selectShow: true,
                                    actions: {
                                        listAction: Global.UrlAction.GetChild + '' + parent.record.Id,
                                        createAction: Global.Element.popupChild,
                                    },
                                    messages: {
                                        addNewRecord: 'Thêm Chi Tiết',
                                        searchRecord: 'Tìm kiếm',
                                        selectShow: 'Ẩn hiện cột'
                                    },
                                    fields: {
                                        ReceiptionId: {
                                            type: 'hidden',
                                            defaultValue: parent.record.Id
                                        },
                                        Id: {
                                            key: true,
                                            create: false,
                                            edit: false,
                                            list: false
                                        },
                                        LotSupliesId: {
                                            title: 'Mã Lô',
                                            width: '10%',
                                            display: function (data) {
                                                var txt = '<span>' + data.record.LotName + '</span>';
                                                return txt;
                                            }
                                        },
                                        MaterialName: {
                                            title: "Vật tư",
                                            width: "15%",
                                            sorting: false,
                                            display: function (data) {
                                                txt = '<span >' + data.record.MaterialName + '</span>';
                                                return txt;
                                            }
                                        },
                                        Quantity: {
                                            title: 'Số Lượng',
                                            width: '10%',
                                            sorting: false,
                                            display: function (data) {
                                                var txt = '<span class="bold red">' + ParseStringToCurrency(data.record.Quantity) + '</span> ' + data.record.UnitName;
                                                return txt;
                                            }
                                        },
                                        Price: {
                                            title: 'Đơn giá',
                                            width: '5%',
                                            sorting: false,
                                            display: function (data) {
                                                var txt = '<span class="bold red">' + ParseStringToCurrency(data.record.Price) + '</span> ';
                                                return txt;
                                            }
                                        },
                                        InputDate: {
                                            title: 'Ngày Nhập',
                                            width: '10%',
                                            sorting: false,
                                            display: function (data) {
                                                var txt = '';
                                                if (data.record.InputDate != null) {
                                                    var date = new Date(parseJsonDateToDate(data.record.InputDate))
                                                    txt = '<span class="">' + ParseDateToString(date) + '</span>';
                                                }
                                                else
                                                    txt = '<span class="">' + "" + '</span>';
                                                return txt;
                                            }
                                        },
                                        ExpiryDate: {
                                            title: 'Ngày hết hạn',
                                            width: '10%',
                                            display: function (data) {
                                                if (data.record.ExpiryDate != null) {
                                                    var date = new Date(parseJsonDateToDate(data.record.ExpiryDate))
                                                    txt = '<span class="">' + ParseDateToString(date) + '</span>';
                                                    return txt;
                                                }
                                            }
                                        },
                                        Edit: {
                                            title: '',
                                            width: '1%',
                                            sorting: false,
                                            display: function (data) {
                                                if (!Global.Data.IsApproved) {
                                                    var text = $('<i data-toggle="modal" data-target="#' + Global.Element.popupChild + '" title="Chỉnh sửa thông tin" class="fa fa_tb fa-pencil-square-o clickable blue"  ></i>');
                                                    text.click(function () {
                                                        ReloadTableLotSupplies();
                                                        $('[jtableBox],[searchbox]').hide();
                                                        $('[detailbox]').show();
                                                        $('#delivery-detail-quantity').val(data.record.Quantity);
                                                        $('#delivery-detail-price').val(data.record.Price);
                                                        Global.Data.ObjectId = data.record.LotSupliesId;
                                                        $('#delivery-detail-id').val(data.record.Id);

                                                        var str = ` <ul class="lot-info-box">
                                <li>Mã lô : <span class="red">${data.record.LotName}  </span></li> 
                                <li>Vật tư : <span class="red">${data.record.MaterialName}</span></li>
                                <li>Kho : <span class="red">${parent.record.strWarehouse}</span></li>
                                <li>Ngày nhập : <span class="red">${ ParseDateToString(parseJsonDateToDate(data.record.InputDate))}</span></li>
                                <li>Số lượng tồn của lô : <span class="red">${(data.record.QuantityLo - data.record.QuantityUsed)}</span > ${data.record.UnitName}</li>`;
                                                        if (data.record.ExpiryDate != null)
                                                            str += ' <li>Ngày hết hạn : <span class="red">' + ParseDateToString(parseJsonDateToDate(data.record.ExpiryDate)) + '</span></li>';
                                                        str += '</ul>';
                                                        $('#LotInfo').html(str);
                                                        changeControlStatus(parent.record.IsApproved, parent.record.StatusId == 8);
                                                    });
                                                    return text;
                                                }
                                            }
                                        },
                                        Delete: {
                                            title: '',
                                            width: "3%",
                                            sorting: false,
                                            display: function (data) {
                                                if (!Global.Data.IsApproved) {
                                                    var text = $('<button title="Xóa" class="jtable-command-button jtable-delete-command-button"><span>Xóa</span></button>');
                                                    text.click(function () {
                                                        GlobalCommon.ShowConfirmDialog('Bạn có chắc chắn muốn xóa?', function () {
                                                            DeleteDetail(data.record.Id);
                                                        }, function () { }, 'Đồng ý', 'Hủy bỏ', 'Thông báo');
                                                    });
                                                    return text;
                                                }
                                            }
                                        }
                                    }
                                }, function (data) { //opened handler
                                    data.childTable.jtable('load');
                                    if (parent.record.StatusId != 7)
                                        $('.jtable-child-table-container .jtable-toolbar-item-add-record').addClass('hide')
                                });
                        });
                        $div.append($img);

                        var $edit = $('<i data-toggle="modal" data-target="#' + Global.Element.Popup + '" title="Chỉnh sửa thông tin" class="fa fa_tb fa-pencil-square-o jtable-action blue"  ></i>');
                        $edit.click(function () {
                            $('#delivery-id').val(parent.record.Id);
                            $('#delivery-name').val(parent.record.Name);
                            $('#delivery-index').val(parent.record.Code);
                            Global.Data.Index = parent.record.Index;
                            $('#delivery-warehouse').val(parent.record.WarehouseId);
                            $('#delivery-date').data("kendoDatePicker").value(parent.record.DeliveryDate ? new Date(moment(parent.record.DeliveryDate)) : null);
                            $('#delivery-deliverier').val(parent.record.Deliverier);
                            $('#delivery-customer').val(parent.record.CustomerId);
                            $('#delivery-reciever').val(parent.record.Reciever);
                            $('#delivery-unit').val(parent.record.UnitId);
                            $('#delivery-exchangerate').val(parent.record.ExchangeRate);

                            $('#delivery-transactiontype').val(parent.record.TransactionType);
                            $('#delivery-dateofaccounting').data("kendoDatePicker").value(parent.record.DateOfAccounting ? new Date(moment(parent.record.DateOfAccounting)) : null);
                            $('#delivery-note').val(parent.record.Note);
                            $('#delivery-total').val(ParseStringToCurrency(parent.record.Total));

                            if (parent.record.OrderDetailId) {
                                Global.Data.orderDetailId = parent.record.OrderDetailId;
                                $('#delivery-order').val(parent.record.OrderId).change();
                            }
                            else {
                                Global.Data.orderDetailId = 0;
                                $('#delivery-order-detail').val(0);
                                $('#delivery-order').val(0)
                            }
                            changeControlStatus(parent.record.IsApproved, parent.record.StatusId == 8);
                        });
                        $div.append($edit);

                        if (parent.record.StatusId == 7) {
                            var $delete = $('<i title="Xóa" class="fa fa-trash-o red jtable-action  "></i>');
                            $delete.click(function () {
                                GlobalCommon.ShowConfirmDialog('Bạn có chắc chắn muốn xóa?', function () {
                                    Delete(parent.record.Id);
                                }, function () { }, 'Đồng ý', 'Hủy bỏ', 'Thông báo');
                            });
                            $div.append($delete);
                        }

                        if (parent.record.StatusId != 7) {
                            var $excel = $('<i title="Xuất file excel" class="fa fa-file-excel-o jtable-action green  "  ></i>');
                            $excel.click(function () {
                                window.location.href = '/DeliveryDetail/ExportToExcel?deliveryId=' + (parent.record.Id == null || parent.record.Id == "" ? 0 : parent.record.Id);
                            });
                            $div.append($excel);
                        }
                        return $div;
                    }
                }
            }
        });
    }

    function ReloadList() {
        $('#' + Global.Element.Jtable).jtable('load', { 'keyword': $('#delivery-keyword').val() });
        $('#' + Global.Element.PopupSearch).modal('hide');
    }

    function InitPopup() {
        $("#" + Global.Element.Popup).modal({
            keyboard: false,
            show: false
        });

        $('#' + Global.Element.Popup).on('shown.bs.modal', function (e) {

            if (Global.Data.DeliveryModel.Id == 0) {
                $('#moneytype option:first').prop('selected', true);
                $('#moneytype').change();

                $('#customer option:first').prop('selected', true).change();
                $('#transactiontype option:first').prop('selected', true).change();
                $("#dateofaccounting").val('').change();
            }
            if ($('#index').val() == '')
                $('#index').val((Global.Data.dCode + (Global.Data.Index + 1)));
        });

        $('#' + Global.Element.Popup).on('show.bs.modal', function (e) {
            if ($('#delivery-id').val() == '' || $('#delivery-id').val() == '0')
                GetLastIndex();

        });

        $('#' + Global.Element.Popup + ' button[delivery-save]').click(function () {
            if (CheckValidate())
                Save(7);
        });

        $('#' + Global.Element.Popup + ' button[delivery-save_d]').click(function () {
            if (CheckValidate()) {
                Save(8);
            }
        });

        $('#' + Global.Element.Popup + ' button[delivery-approve]').click(function () {
            Approve($('#delivery-id').val());
        });

        $('#' + Global.Element.Popup + ' button[delivery-cancel]').click(function () {
            $("#" + Global.Element.Popup).modal("hide");
            ResetForm();
            changeControlStatus(false, false);
        });
    }

    function CheckValidate() {
        if ($('#delivery-name').val().trim() == "") {
            GlobalCommon.ShowMessageDialog("Vui lòng nhập Tên Phiếu.", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        else if ($('#delivery-warehouse').val() == "") {
            GlobalCommon.ShowMessageDialog("Vui lòng chọn kho xuất hàng.", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        else if ($('#delivery-deliverier').val() == "") {
            GlobalCommon.ShowMessageDialog("Vui lòng chọn người xuất kho.", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        else if ($('#delivery-date').val() == "") {
            GlobalCommon.ShowMessageDialog("Vui lòng chọn ngày xuất kho.", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        else if ($('#delivery-customer').val() == "") {
            GlobalCommon.ShowMessageDialog("Vui lòng chọn Khách Hàng.", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        else if ($('#delivery-reciever').val() == "") {
            GlobalCommon.ShowMessageDialog("Vui lòng nhập tên người nhận hàng.", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        else if ($('#delivery-unit').val() == "") {
            GlobalCommon.ShowMessageDialog("Vui lòng chọn Loại Tiền Tệ", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        else if ($('#delivery-exchangerate').val() == "") {
            GlobalCommon.ShowMessageDialog("Vui lòng nhập Tỉ Giá.", function () { $('#delivery-exchangerate').focus(); }, "Lỗi Nhập liệu");
            return false;
        }
        else if (parseFloat($('#delivery-exchangerate').val()) == 0) {
            GlobalCommon.ShowMessageDialog("Tỉ Giá không thể là 0. Vui lòng nhập lại.", function () { $('#delivery-exchangerate').focus(); }, "Lỗi Nhập liệu");
            return false;
        }
        else if ($('#delivery-dateofaccounting').val() == "") {
            GlobalCommon.ShowMessageDialog("Vui lòng chọn Ngày Hoạch Toán.", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        return true;
    }

    function Save(status) {
        var obj = {
            Id: $('#delivery-id').val(),
            Name: $('#delivery-name').val(),
            Index: Global.Data.Index,
            WareHouseId: $('#delivery-warehouse').val(),
            DeliveryDate: ($('#delivery-date').val() == '' ? null : $('#delivery-date').data("kendoDatePicker").value()),
            Deliverier: $('#delivery-deliverier').val(),
            CustomerId: $('#delivery-customer').val(),
            Reciever: $('#delivery-reciever').val(),
            UnitId: $('#delivery-unit').val(),
            StatusId: status,
            ExchangeRate: parseFloat($('#delivery-exchangerate').val()),
            TransactionType: $('#delivery-transactiontype').val(),
            DateOfAccounting: ($('#delivery-dateofaccounting').val() == '' ? null : $('#delivery-dateofaccounting').data("kendoDatePicker").value()),
            IsApproved: false,
            Note: $('#delivery-note').val(),
            OrderDetailId: $('#delivery-order-detail').val()
        };
        if (obj.Id == '0' || obj.Id == '')
            obj.Index += 1;
        $.ajax({
            url: Global.UrlAction.Save,
            type: 'POST',
            data: ko.toJSON(obj),
            contentType: 'application/json charset=utf-8',
            success: function (result) {
                if (result.Result == "OK") {
                    ReloadList();
                    $('#' + Global.Element.Popup + ' button[delivery-cancel]').click();
                }
                else
                    GlobalCommon.ShowMessageDialog(result.ErrorMessages[0].Message, function () { }, 'Lỗi');
            }
        });
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
                }, false, Global.Element.PopupDelivery, true, true, function () {

                    var msg = GlobalCommon.GetErrorMessage(data);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
                });
            }
        });
    }

    function Approve(Id) {
        $.ajax({
            url: Global.UrlAction.Approve,
            type: 'POST',
            data: JSON.stringify({ 'Id': Id }),
            contentType: 'application/json charset=utf-8',
            beforeSend: function () { $('#loading').show(); },
            success: function (data) {
                $('#loading').hide();
                GlobalCommon.CallbackProcess(data, function () {
                    if (data.Result == "OK") {
                        ReloadList();
                        $('#' + Global.Element.Popup + ' button[delivery-cancel]').click();
                    }
                }, false, Global.Element.PopupDelivery, true, true, function () {

                    var msg = GlobalCommon.GetErrorMessage(data);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
                });
            }
        });
    }

    function GetLastIndex() {
        $.ajax({
            url: '/Delivery/GetLastIndex',
            type: 'POST',
            contentType: 'application/json',
            beforeSend: function () { $('#loading').show(); },
            success: function (data) {
                $('#loading').hide();
                Global.Data.Index = parseInt(data.Records);
                Global.Data.Code = data.Data;
                $('#delivery-index').val((Global.Data.Code + (Global.Data.Index + 1)));
            }
        });
    };

    function ResetForm() {
        $('#delivery-id').val(0);
        $('#delivery-index').val('');
        $('#delivery-name').val('');
        $('#delivery-isagency').prop('checked', false).change();
        $('#delivery-transactiontype').val(1);
        $('#delivery-customer').val(0);
        $('#delivery-deliverier').val('');
        $('#delivery-reciever').val(0);

        $('#delivery-exchangerate').val(1);
        $('#delivery-dateofaccounting').data("kendoDatePicker").value('');
        $('#delivery-date').data("kendoDatePicker").value('');
        $('#delivery-total').val(0);
        $('#delivery-note').val('');
        $('#delivery-order').val(0).change();
    }

    function InitPopupChild() {
        $("#" + Global.Element.popupChild).modal({
            keyboard: false,
            show: false
        });

        $('#' + Global.Element.popupChild + ' button[delivery-detail-save]').click(function () {
            var sl = parseFloat($('#delivery-detail-quantity').val());
            if ($('#delivery-detail-quantity').val() == "") {
                GlobalCommon.ShowMessageDialog("Vui lòng nhập số lượng xuất.", function () { $('#delivery-detail-quantity').focus(); }, "Lỗi Nhập liệu");
            }
            else if (parseFloat($('#delivery-detail-quantity').val()) == 0) {
                GlobalCommon.ShowMessageDialog("Số lượng xuất kho phải lớn hơn 0.", function () { $('#delivery-detail-quantity').focus(); }, "Lỗi Nhập liệu");
            }
            //else if (sl > Global.Data.Quantity) {
            //    GlobalCommon.ShowMessageDialog("Số lượng xuất kho vượt quá số lượng tồn kho.", function () { }, "Lỗi Nhập liệu");
            //}
            else if ($('#delivery-detail-price').val() == "") {
                GlobalCommon.ShowMessageDialog("Vui lòng nhập đơn giá xuất kho.", function () { $('#delivery-detail-price').focus(); }, "Lỗi Nhập liệu");
            }
            else if (parseFloat($('#delivery-detail-price').val()) == 0) {
                GlobalCommon.ShowMessageDialog("Đơn giá xuất kho phải lớn hơn 0.", function () { $('#delivery-detail-price').focus(); }, "Lỗi Nhập liệu");
            }
            else {
                SaveDetail();
            }
        });

        $('#' + Global.Element.popupChild + ' button[delivery-detail-cancel]').click(function () {
            $("#" + Global.Element.popupChild).modal("hide");
            $('#delivery-detail-quantity').val(0);
            $('#delivery-detail-price').val(0);
            $('#delivery-detail-id').val(0);
            Global.Data.ObjectId = 0;
            $('#' + Global.Element.popupChild + ' button[btnchonlo]').click();
        });

        $('#' + Global.Element.popupChild + ' button[btnchonlo]').click(function () {
            $('[jtableBox],[searchbox]').show();
            $('[detailbox]').hide();
            ReloadTableLotSupplies();
        });
    }

    function SaveDetail() {
        var obj = {
            Id: $('#delivery-detail-id').val(),
            DeliveryId: Global.Data.parentId,
            LotSupliesId: Global.Data.ObjectId,
            Quantity: $('#delivery-detail-quantity').val(),
            Price: $('#delivery-detail-price').val(),
        }
        $.ajax({
            url: Global.UrlAction.SaveChild,
            type: 'POST',
            data: JSON.stringify({ 'obj': obj }),
            contentType: 'application/json charset=utf-8',
            beforeSend: function () { $('#loading').show(); },
            success: function (data) {
                $('#loading').hide();
                GlobalCommon.CallbackProcess(data, function () {
                    if (data.Result == "OK") {
                        ReloadList();
                        $('#delivery-detail-quantity').val(0);
                        $('#delivery-detail-price').val(0);
                        $('#delivery-detail-id').val(0);
                        $('#' + Global.Element.popupChild + ' button[btnchonlo]').click();
                    }
                }, false, Global.Element.popupChild, true, true, function () {
                    var msg = GlobalCommon.GetErrorMessage(data);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
                });
            }
        });
    }

    function DeleteDetail(Id) {
        $.ajax({
            url: Global.UrlAction.DeleteChild,
            type: 'POST',
            data: JSON.stringify({ 'Id': Id }),
            contentType: 'application/json charset=utf-8',
            beforeSend: function () { $('#loading').show(); },
            success: function (data) {
                GlobalCommon.CallbackProcess(data, function () {
                    if (data.Result == "OK") {
                        ReloadList();
                        $('#loading').hide();
                    }
                }, false, Global.Element.PopupDelivery, true, true, function () {

                    var msg = GlobalCommon.GetErrorMessage(data);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
                });
            }
        });
    }

    function InitTableLotSupplies() {
        $('#' + Global.Element.JtableChild).jtable({
            title: `Danh sách lô vật tư trong kho : ${Global.Data.KhoObj.Name}`,
            paging: true,
            pageSize: 10,
            pageSizeChange: true,
            sorting: true,
            selectShow: true,
            selecting: true, //Enable selecting
            multiselect: false, //Allow multiple selecting
            selectingCheckboxes: true, //Show checkboxes on first column
            actions: {
                listAction: Global.UrlAction.GetLot,
            },
            messages: {
                selectShow: 'Ẩn hiện cột'
            },
            fields: {
                Id: {
                    key: true,
                    create: false,
                    edit: false,
                    list: false
                },
                Index: {
                    title: "Mã Lô",
                    width: "10%",
                    display: function (data) {
                        txt = '<span >' + data.record.Code + ' (' + data.record.Name + ')</span>';
                        return txt;
                    }
                },
                MaterialId: {
                    title: "Vật Tư",
                    width: "15%",
                    display: function (data) {
                        txt = '<span >' + data.record.strMaterial + '</span>';
                        return txt;
                    }
                },
                //WareHouseId: {
                //    title: "Kho",
                //    width: "15%",
                //    display: function (data) {
                //        txt = '<span >' + data.record.strWarehouse + '</span>';
                //        return txt;
                //    }
                //},
                InputDate: {
                    title: 'Ngày Nhập',
                    width: '10%',
                    display: function (data) {
                        var date = new Date(parseJsonDateToDate(data.record.InputDate))
                        txt = '<span class="">' + ParseDateToString(date) + '</span>';
                        return txt;
                    }
                },
                ManufactureDate: {
                    title: 'Ngày Sản Xuất',
                    width: '10%',
                    display: function (data) {
                        var date = new Date(parseJsonDateToDate(data.record.ManufactureDate))
                        txt = '<span class="">' + ParseDateToString(date) + '</span>';
                        return txt;
                    }
                },
                WarrantyDate: {
                    title: 'Ngày Bảo Hành',
                    width: '10%',
                    display: function (data) {
                        if (data.record.WarrantyDate != null) {
                            var date = new Date(parseJsonDateToDate(data.record.WarrantyDate))
                            txt = '<span class="">' + ParseDateToString(date) + '</span>';
                            return txt;
                        }
                    }
                },
                ExpiryDate: {
                    title: 'Ngày Hết Hạn',
                    width: '10%',
                    display: function (data) {
                        if (data.record.ExpiryDate != null) {
                            var date = new Date(parseJsonDateToDate(data.record.ExpiryDate))
                            txt = '<span class="">' + ParseDateToString(date) + '</span>';
                            return txt;
                        }
                    }
                },
                CurrentQuantity: {
                    title: 'SL Tồn',
                    width: '10%',
                    display: function (data) {
                        txt = `<span class="red">${(data.record.Quantity - data.record.QuantityUsed)}</span> ${data.record.strMaterialUnit}`;
                        return txt;
                    }
                },
                //StatusId: {
                //    title: 'Trạng Thái',
                //    width: '1%',
                //    sorting: false,
                //    display: function (data) {
                //        txt = '<span >' + data.record.StatusName + '</span>';
                //        return txt;
                //    }
                //},
                Note: {
                    title: "Ghi Chú",
                    width: "20%",
                    sorting: false
                },
            },
            selectionChanged: function () {
                var $selectedRows = $('#' + Global.Element.JtableChild).jtable('selectedRows');
                if ($selectedRows.length > 0) {
                    var record = $selectedRows.data('record');
                    Global.Data.ObjectId = record.Id;
                    Global.Data.QuantityUsed = record.QuantityUsed;
                    Global.Data.Quantity = record.Quantity - record.QuantityUsed;
                    $('[jtableBox],[searchbox]').hide();
                    $('[detailbox]').show();
                    var str = ` <ul class="lot-info-box">
                                <li>Mã lô : <span class="red">${record.Name} (${record.Code})</span></li> 
                                <li>Vật tư : <span class="red">${record.strMaterial}</span></li>
                                <li>Kho : <span class="red">${record.strWarehouse}</span></li>
                                <li>Ngày nhập : <span class="red">${ ParseDateToString(parseJsonDateToDate(record.InputDate))}</span></li>
                                <li>Số lượng tồn của lô : <span class="red">${(record.Quantity - record.QuantityUsed)}</span > ${record.strMaterialUnit}</li>`;
                    if (record.ExpiryDate != null)
                        str += ' <li>Ngày hết hạn : <span class="red">' + ParseDateToString(parseJsonDateToDate(record.ExpiryDate)) + '</span></li>';
                    str += '</ul>';
                    $('#LotInfo').html(str);
                }
            }
        });
    }

    function ReloadTableLotSupplies() {
        $('#' + Global.Element.JtableChild).jtable('load', { 'whId': Global.Data.KhoObj.Id, 'greaterThan0': true, 'keyword': $('#delivery-detail-search-key').val() });
    }

    function changeControlStatus(approved, disabled) {
        $('#delivery-name,#delivery-order-detail,#delivery-order,#delivery-total,#delivery-note,#delivery-transactiontype,#delivery-exchangerate,#delivery-warehouse,#delivery-deliverier,#delivery-customer,#delivery-reciever,#delivery-unit').prop('disabled', disabled);
        $('#delivery-detail-quantity,#delivery-detail-price').prop('disabled', disabled);

        $('#delivery-dateofaccounting').data('kendoDatePicker').enable(!disabled);
        $('#delivery-date').data('kendoDatePicker').enable(!disabled);

        if (approved) {
            $('[delivery-detail-save],[delivery-save],[delivery-save_d],[delivery-approve],[delivery-detail-save],[btnchonlo]').hide();
            return;
        }
        if (disabled) {
            $('[delivery-detail-save],[delivery-save],[delivery-save_d],[delivery-detail-save],[btnchonlo]').hide();
            $('[delivery-approve]').show();
            return;
        }
        $('[delivery-detail-save],[delivery-save],[delivery-save_d],[delivery-detail-save],[btnchonlo]').show();
        $('[delivery-approve]').hide();
    }
}
$(document).ready(function () {
    var obj = new GPRO.Delivery();
    obj.Init();
})