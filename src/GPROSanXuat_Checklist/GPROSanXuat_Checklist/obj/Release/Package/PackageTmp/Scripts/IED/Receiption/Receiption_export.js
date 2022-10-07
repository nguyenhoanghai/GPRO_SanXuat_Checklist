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
GPRO.namespace('ReceiptionExport');
GPRO.ReceiptionExport = function () {
    var Global = {
        UrlAction: {
            GetList: '/Receiption/GetExport_Cust', 

            //ReceiptionDetail
            GetReceiptionDetail: '/ReceiptionDetail/Gets?recordId=', 
        },
        Element: {
            JtableReceiption: 'receiption-jtable', 
            Popup: 'receiption-popup',
            PopupReceiptionDetail: 'receiption-detail-popup',
        },
        Data: {

            parentId: 0,
            QuantityUsed: 0,
            rLastIndex: 0,
            rCode: '',
            lotId: 0,
            lotLastIndex: 0,
            lotCode: '',
            orderDetailId: 0
        }
    }
    this.GetGlobal = function () {
        return Global;
    }

    this.Init = function () { 
        RegisterEvent();
        InitDateField();
        InitList();
        //ReloadList();

        InitPopup(); 
        InitPopupReceiptionDetail();


        GetCustomerSelect('receiption-customer');  // 0 la tat ca, 2 la nha cung cap
        GetEmployeeSelect('receiption-employee');
        //    GetStatusSelect('receiption-status');
        GetMaterialSelect('receiption-detail-material', 0)
        GetUnitSelect('receiption-moneytype', 'TienTe');
        GetWarehouseSelect('receiption-warehouse');

        GetOrderSelect('receiption-order', true);
        $('[receiption-detail-save],[receiption-save],[receiption-save_d]').show();
        $('[receiption-approve]').hide();
        changeControlStatus(true, true);
    }

    var RegisterEvent = function () {
        $('[re-receiption-order]').click(function () {
            GetOrderSelect('receiption-order', true);
        });

        $('#receiption-order').change(function () {
            GetOrderDetailSelect('receiption-order-detail', $('#receiption-order').val(), Global.Data.orderDetailId);
        })

        $('#receiption-order-detail').change(function () { ReloadList(); });

        $('[re-receiption-detail-material]').click(function () {
            GetMaterialSelect('receiption-detail-material', 0)
        });

        $('[re-receiption-warehouse]').click(function () {
            GetWarehouseSelect('receiption-warehouse');
        });

        $('[re-receiption-employee]').click(function () {
            GetEmployeeSelect('receiption-employee');
        });

        $('[re-receiption-customer]').click(function () {
            GetCustomerSelect('receiption-customer');
        });

        $('[re-receiption-moneytype]').click(function () {
            GetUnitSelect('receiption-moneytype', 'TienTe');
            $('#receiption-detail-moneytype').change();
        });

        //$('[re_status]').click(function () {
        //    GetStatusSelect('status');
        //});

        $('#receiption-detail-quantity').keyup(function () {
            var vl = parseInt($(this).val());
            $('#receiption-detail-currentquantity').val(vl - Global.Data.QuantityUsed);
        });

        $('#receiption-detail-material').change(function () {
            $('#receiption-detail-unit').html($('#receiption-detail-material option:selected').attr('unit'));
        });

        $('#receiption-detail-moneytype').change(function () {
            $('#receiption-detail-exchangerate').val($('#receiption-detail-moneytype option:selected').attr('tigia'));
        });
    }

    function InitDateField() {
        $("#receiption-detail-expirydate,#receiption-detail-inputdate,#receiption-dateofaccounting,#receiption-inputdate")
            .kendoDatePicker({
                format: "dd/MM/yyyy",
            });

        $("#receiption-detail-manufacturedate").kendoDatePicker({
            format: "dd/MM/yyyy ",
            change: function () {
                var value = this.value();
                var dp = $("#receiption-detail-expirydate").data("kendoDatePicker");
                dp.min(value);
                dp = $("#receiption-detail-warrantydate").data("kendoDatePicker");
                dp.min(value);
            }
        });

        $("#receiption-detail-warrantydate").kendoDatePicker({
            format: "dd/MM/yyyy",
            change: function () {
                var value = this.value();
                var dp = $("#receiption-detail-expirydate").data("kendoDatePicker");
                dp.min(value);
            }
        });
    }

    function InitList() {
        $('#' + Global.Element.JtableReceiption).jtable({
            title: 'Danh Sách Phiếu Nhập Kho',
            paging: true,
            pageSize: 25,
            pageSizeChange: true,
            sorting: true,
            selectShow: true,
            actions: {
                listAction: Global.UrlAction.GetList,
               // createAction: Global.Element.Popup,
            },
            messages: {
                //addNewRecord: 'Thêm mới',
                selectShow: 'Ẩn hiện cột'
            },
            searchInput: {
                id: 'receiption-keyword',
                className: 'search-input',
                placeHolder: 'Nhập từ khóa ...',
                keyup: function (evt) {
                    if (evt.keyCode == 13)
                        ReloadList();
                }
            },
            datas: {
                jtableId: Global.Element.JtableReceiption
            },
            rowInserted: function (event, data) {
                if (data.record.Id == Global.Data.parentId) {
                    var $a = $('#' + Global.Element.JtableReceiption).jtable('getRowByKey', data.record.Id);
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
                    title: "Tên - Mã Phiếu Nhập",
                    width: "10%",
                    display: function (data) {
                        var txt = '<span>' + data.record.Name + '</span> (<span class="red">' + data.record.Code + '</span>)';
                        return txt;
                    }
                },
                FromCustomerId: {
                    title: "Khách Hàng",
                    width: "15%",
                    display: function (data) {
                        var txt = '<span>' + data.record.CustomerName + '</span>';
                        return txt;
                    }
                },
                //OrderDetailId: {
                //    title: "Đ.Hàng - S.Phẩm",
                //    width: "15%",
                //    display: function (data) {
                //        if (data.record.OrderDetailId)
                //            return `<span>${data.record.OrderCode} - ${data.record.ProductName}</span>`;
                //        return '';
                //    }
                //},
                StoreWarehouseId: {
                    title: "Kho lưu - nhân viên",
                    width: "15%",
                    display: function (data) {
                        var txt = `<span>${data.record.StoreWareHouseName} - ${data.record.RecieverName}</span>`;
                        return txt;
                    }
                }, 
                InputDate: {
                    title: 'Ngày nhập kho',
                    width: '5%',
                    display: function (data) {
                        var txt = "";
                        if (data.record.InputDate != null) {
                            var date = new Date(parseJsonDateToDate(data.record.InputDate))
                            txt = '<span class="blue">' + ParseDateToString(date) + '</span>';
                        }
                        return txt;
                    }
                },
                /*TransactionType: {
                    title: "HT Giao Dịch",
                    width: "10%",
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
                */
                DateOfAccounting: {
                    title: 'Ngày Hạch Toán',
                    width: '5%',
                    display: function (data) {
                        var txt = "";
                        if (data.record.DateOfAccounting != null) {
                            var date = new Date(parseJsonDateToDate(data.record.DateOfAccounting))
                            txt = '<span class="red">' + ParseDateToString(date) + '</span>';
                        }
                        return txt;
                    }
                },
                Total: {
                    title: "Tổng Tiền (tỷ giá)",
                    width: "10%",
                    display: function (data) {
                        var txt = `<span  class="bold red">${ParseStringToCurrency(data.record.Total)}</span> ${data.record.MoneyTypeName} (<span class="blue">${ParseStringToCurrency(data.record.ExchangeRate)}</span>)`;
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
                //        if (data.record.StatusId == 9)
                //            txt = '<i class="fa fa-check-square-o red"><i/>';
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
                            txt = '<span class="red ">' + data.record.ApprovedUserName + '</span>';

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
                            txt = '<span class="">' + ParseDateToString(date) + '</span>';
                        }
                        return txt;
                    }
                },
                Detail: {
                    title: 'Hành động',
                    width: '7%',
                    sorting: false,
                    edit: false,
                    display: function (parent) {
                        var $div = $('<div></div>');

                        var $detail = $('<i class="fa fa-list-ol jtable-action red aaa" title="Click Xem Danh Sách Chi Tiết ' + parent.record.Name + '"></i>');
                        $detail.click(function () {
                            Global.Data.parentId = parent.record.Id;
                            $('#' + Global.Element.JtableReceiption).jtable('openChildTable',
                                $detail.closest('tr'),
                                {
                                    title: '<span class="red">Chi tiết của phiếu nhập kho : ' + parent.record.Name + '</span>',
                                    paging: true,
                                    pageSize: 10,
                                    pageSizeChange: true,
                                    sorting: true,
                                    selectShow: true,
                                    actions: {
                                        listAction: Global.UrlAction.GetReceiptionDetail + '' + parent.record.Id,
                                        createAction: Global.Element.PopupReceiptionDetail,
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
                                        Name: {
                                            title: 'Tên - Mã Lô',
                                            width: '10%',
                                            display: function (data) {
                                                var txt = '<span >' + data.record.Name + '</span> (<span class="red">' + data.record.Code + '</span>)';
                                                return txt;
                                            }
                                        },
                                        MaterialName: {
                                            title: 'Vật Tư ',
                                            width: '10%',
                                        },

                                        Quantity: {
                                            title: 'SL nhập - tồn của lô',
                                            width: '15%',
                                            display: function (data) {
                                                if (parent.record.IsApproved )
                                                    return `${data.record.Quantity} - <span class="red">${(data.record.Quantity - data.record.QuantityUsed)}</span> ${data.record.UnitName}`;
                                                return `${data.record.Quantity} ${data.record.UnitName} `;
                                              }
                                        },
                                        Price: {
                                            title: 'Đơn Giá ',
                                            width: '10%',
                                            display: function (data) {
                                                var txt = `<span  class="bold red">${ParseStringToCurrency(data.record.Price)}</span> ${parent.record.MoneyTypeName}`;
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
                                                    txt = '<span class="red">' + ParseDateToString(date) + '</span>';
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
                                                    txt = '<span class="red">' + ParseDateToString(date) + '</span>';
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
                        $div.append($detail);

                        var $edit = $('<i data-toggle="modal" data-target="#' + Global.Element.Popup + '" title="Chỉnh sửa thông tin" class="fa fa_tb fa-pencil-square-o jtable-action blue"  ></i>');
                        $edit.click(function () {
                            $('#receiption-id').val(parent.record.Id);
                            $('#receiption-name').val(parent.record.Name)
                            $('#receiption-index').val(parent.record.Code)
                            $('#receiption-customer').val(parent.record.FromCustomerId);
                            $('#receiption-warehouse').val(parent.record.StoreWarehouseId);
                            $('#receiption-moneytype').val(parent.record.MoneyTypeId);
                            $('#receiption-exchangerate').val(parent.record.ExchangeRate);
                            $('#receiption-employee').val(parent.record.RecieverId);
                            $('#receiption-transactiontype').val(parent.record.TransactionType);
                            $('#receiption-dateofaccounting').data("kendoDatePicker").value((parent.record.DateOfAccounting != null ? parseJsonDateToDate(parent.record.DateOfAccounting) : null));
                            $('#receiption-inputdate').data("kendoDatePicker").value((parent.record.InputDate != null ? parseJsonDateToDate(parent.record.InputDate) : null));
                            $('#receiption-note').val(parent.record.Note);
                             
                        });
                        $div.append($edit);
                         
                            var $excel = $('<i title="xuất file excel" class="fa fa-file-excel-o jtable-action green " ></i>');
                            $excel.click(function () {
                                window.location.href = '/ReceiptionDetail/ExportToExcel?receiptionId=' + (parent.record.Id == null || parent.record.Id == "" ? 0 : parent.record.Id);
                            });
                            $div.append($excel);
                         
                        return $div;
                    }
                },  
            }
        });
    }

    function ReloadList() {
        $('#' + Global.Element.JtableReceiption).jtable('load', { 'orderDetailId': $('#receiption-order-detail').val() });
        $('#' + Global.Element.PopupSearch).modal('hide');
    }

    function InitPopup() {
        $("#" + Global.Element.Popup).modal({
            keyboard: false,
            show: false
        }); 

        $('#' + Global.Element.Popup + ' button[receiption-cancel]').click(function () {
            $("#" + Global.Element.Popup).modal("hide");
            ResetFormReceiption(); 
        });
    }
     
    function ResetFormReceiption() {
        $('#receiption-id').val(0);
        $('#receiption-name').val('');
        $('#receiption-note').val('');
        $('#receiption-moneytype,#receiption-customer,#receiption-employee,#receiption-transactiontype,#receiption-warehouse').val(0);
        $('#receiption-dateofaccounting,#receiption-inputdate').val('').change();
    }
     
    /********************************** CHILD *********************************************/
    function InitPopupReceiptionDetail() {
        $("#" + Global.Element.PopupReceiptionDetail).modal({
            keyboard: false,
            show: false,
        });
         
        $("#" + Global.Element.PopupReceiptionDetail + ' button[receiption-detail-cancel]').click(function () {
            $("#" + Global.Element.PopupReceiptionDetail).modal("hide"); 
        });
    }

   
    function changeControlStatus(approved, disabled) {
        $('#receiption-name,#receiption-index,#receiption-customer,#receiption-warehouse,#receiption-moneytype,#receiption-exchangerate,#receiption-employee,#receiption-transactiontype,#receiption-note').prop('disabled', disabled);
        $('#receiption-detail-name,#receiption-detail-material,#receiption-detail-quantity,#receiption-detail-price,#receiption-detail-note,#receiption-detail-specifications-paking').prop('disabled', disabled);
        $('#receiption-inputdate').data('kendoDatePicker').enable(!disabled);
        $('#receiption-dateofaccounting').data('kendoDatePicker').enable(!disabled);
        $('#receiption-detail-manufacturedate').data('kendoDatePicker').enable(!disabled);
        $('#receiption-detail-warrantydate').data('kendoDatePicker').enable(!disabled);
        $('#receiption-detail-expirydate').data('kendoDatePicker').enable(!disabled);
          
    }
}
$(document).ready(function () {
    var obj = new GPRO.ReceiptionExport();
    obj.Init();
})