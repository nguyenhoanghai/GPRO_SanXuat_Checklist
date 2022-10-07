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
GPRO.namespace('DeliveryExport');
GPRO.DeliveryExport = function () {
    var Global = {
        UrlAction: {
            GetList: '/Delivery/GetExport_Cust',
            GetChild: '/DeliveryDetail/Gets?Id=',
        },
        Element: {
            Jtable: 'delivery-jtable',
            Popup: 'delivery-popup',
            popupChild: 'delivery-detail-popup',
            JtableChild: 'delivery-detail-jtable',

        },
        Data: {
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
        //ReloadList();
        InitPopup(); 

        InitDatePicker();
        $('[delivery-detail-save],[delivery-save],[delivery-save_d]').show();
        $('[delivery-approve]').hide();
        changeControlStatus(true, true);
    }

    var RegisterEvent = function () {
        $('[re-delivery-order]').click(function () {
            GetOrderSelect('delivery-order', true);
        });

        $('#delivery-order').change(function () {
            GetOrderDetailSelect('delivery-order-detail', $('#delivery-order').val(), Global.Data.orderDetailId);
        });

        $('#delivery-order-detail').change(function () { ReloadList(); });


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
                //createAction: Global.Element.Popup,
            },
            messages: {
               // addNewRecord: 'Thêm mới',
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
                        });
                        $div.append($edit);

                        var $excel = $('<i title="Xuất file excel" class="fa fa-file-excel-o jtable-action green  "  ></i>');
                        $excel.click(function () {
                            window.location.href = '/DeliveryDetail/ExportToExcel?deliveryId=' + (parent.record.Id == null || parent.record.Id == "" ? 0 : parent.record.Id);
                        });
                        $div.append($excel);
                        return $div;
                    }
                }
            }
        });
    }

    function ReloadList() {
        $('#' + Global.Element.Jtable).jtable('load', { 'orderDetailId': $('#delivery-order-detail').val() });
    }

    function InitPopup() {
        $("#" + Global.Element.Popup).modal({
            keyboard: false,
            show: false
        });  

        $('#' + Global.Element.Popup + ' button[delivery-cancel]').click(function () {
            $("#" + Global.Element.Popup).modal("hide");  
        });
    }
       
    function changeControlStatus(approved, disabled) {
        $('#delivery-name,#delivery-total,#delivery-note,#delivery-transactiontype,#delivery-exchangerate,#delivery-warehouse,#delivery-deliverier,#delivery-customer,#delivery-reciever,#delivery-unit').prop('disabled', disabled);
         
        $('#delivery-dateofaccounting').data('kendoDatePicker').enable(!disabled);
        $('#delivery-date').data('kendoDatePicker').enable(!disabled); 
    }
}
$(document).ready(function () {
    var obj = new GPRO.DeliveryExport();
    obj.Init();
})