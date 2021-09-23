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
GPRO.namespace('CustomerReport');
GPRO.CustomerReport = function () {
    var Global = {
        UrlAction: {
            GetReceiptions: '/Receiption/GetReport',
            GetDeliveries: '/Delivery/GetReport',
            Export: '/Customer/Export',

            GetChild: '/DeliveryDetail/Gets?Id=',
            GetReceiptionDetail: '/ReceiptionDetail/Gets?recordId=',
        },
        Element: {
            JtableReceiption: 'cust-report-receiption-table',
            JtableDelivery: 'cust-report-delivery-table',

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
        InitTableReceiption();
        InitDeliveryTable();
        $('#cust-report-receiption-box,#cust-report-delivery-box').hide();
        GetCustomerCombobox('cust-report-name');
    }

    var RegisterEvent = function () {
        $('#cust-report-btn-view').click(() => {
            if (CheckValidate())
                switch ($('#cus-report-type').val()) {
                    case '1':
                        $('#cust-report-receiption-box').show();
                        $('#cust-report-delivery-box').hide();
                        ReloadTableReceiption(); break;
                    case '2':
                        $('#cust-report-delivery-box').show();
                        $('#cust-report-receiption-box').hide();
                        ReloadDeliveryTable(); break;
                }
        });
    }

    function InitTableReceiption() {
        $('#' + Global.Element.JtableReceiption).jtable({
            title: 'Danh Sách Phiếu Nhập Kho',
            paging: true,
            pageSize: 25,
            pageSizeChange: true,
            sorting: true,
            selectShow: true,
            actions: {
                listAction: Global.UrlAction.GetReceiptions,
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
                    title: "Nhà cung cấp",
                    width: "15%",
                    display: function (data) {
                        var txt = '<span>' + data.record.CustomerName + '</span>';
                        return txt;
                    }
                },
                StoreWarehouseId: {
                    title: "Kho nhập",
                    width: "15%",
                    display: function (data) {
                        var txt = '<span>' + data.record.StoreWareHouseName + '</span>';
                        return txt;
                    }
                },
                ReceiverId: {
                    title: "Nhân viên kho",
                    width: "10%",
                    display: function (data) {
                        var txt = '<span>' + data.record.RecieverName + '</span>';
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
                            txt = '<span class="">' + ParseDateToString(date) + '</span>';
                        }
                        return txt;
                    }
                },
                TransactionType: {
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
                Total: {
                    title: "Tổng Tiền",
                    width: "15%",
                    display: function (data) {
                        var txt = `<span  class="bold red">${ParseStringToCurrency(data.record.Total)}</span> ${data.record.MoneyTypeName}`;
                        return txt;
                    }
                },
                ExchangeRate: {
                    title: "Tỷ Giá",
                    width: "5%",
                    display: function (data) {
                        var txt = "";
                        if (data.record.ExchangeRate != null)
                            txt += '<span>' + ParseStringToCurrency(data.record.ExchangeRate) + '</span>';

                        return txt;
                    }
                },
                DateOfAccounting: {
                    title: 'Ngày Hạch Toán',
                    width: '5%',
                    display: function (data) {
                        var txt = "";
                        if (data.record.DateOfAccounting != null) {
                            var date = new Date(parseJsonDateToDate(data.record.DateOfAccounting))
                            txt = '<span class="">' + ParseDateToString(date) + '</span>';
                        }
                        return txt;
                    }
                },
                IsApproved: {
                    title: "TT Duyệt",
                    width: "5%",
                    display: function (data) {
                        var txt = '';
                        if (data.record.StatusId == 9)
                            txt = '<i class="fa fa-check-square-o red"><i/>';
                        else
                            txt = '<i class="fa fa-square-o" ></i>';
                        return txt;
                    }
                },
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
                    title: 'DS Chi Tiết',
                    width: '3%',
                    sorting: false,
                    edit: false,
                    display: function (parent) {
                        var $img = $('<i class="fa fa-list-ol clickable red aaa" title="Click Xem Danh Sách Chi Tiết ' + parent.record.Name + '"></i>');
                        $img.click(function () {
                            Global.Data.parentId = parent.record.Id;
                            $('#' + Global.Element.JtableReceiption).jtable('openChildTable',
                                $img.closest('tr'),
                                {
                                    title: '<span class="red">Chi tiết của phiếu nhập kho : ' + parent.record.Name + '</span>',
                                    paging: true,
                                    pageSize: 10,
                                    pageSizeChange: true,
                                    sorting: true,
                                    //selectShow: true,
                                    actions: {
                                        listAction: Global.UrlAction.GetReceiptionDetail + '' + parent.record.Id, 
                                    },
                                    messages: {  
                                      //  selectShow: 'Ẩn hiện cột'
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
                                            title: 'Số lượng gốc - tồn kho',
                                            width: '15%',
                                            display: function (data) {
                                                var txt = `${data.record.Quantity} - <span class="red">${(data.record.Quantity - data.record.QuantityUsed)}</span> ${data.record.UnitName}`;
                                                return txt;
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
                                        },
                                        Note: {
                                            title: 'Ghi chú',
                                            width: '10%',
                                            sorting: false,
                                        } 
                                    }
                                }, function (data) { //opened handler
                                    data.childTable.jtable('load');
                                });
                        });
                        return $img;
                    }
                },
                Note: {
                    title: 'Ghi chú',
                    width: '10%',
                    sorting: false,
                } 
            }
        });
    }

    function ReloadTableReceiption() {
        $('#' + Global.Element.JtableReceiption).jtable('load', { 'custId': $('#cust-report-name').data("kendoComboBox").value()  });        
    }

    function InitDeliveryTable() {
        $('#' + Global.Element.JtableDelivery).jtable({
            title: 'Danh Sách Phiếu Xuất Kho',
            paging: true,
            pageSize: 10,
            pageSizeChange: true,
            sorting: true,
            selectShow: true,
            actions: {
                listAction: Global.UrlAction.GetDeliveries,
            },
            messages: {
            },
            datas: {
                jtableId: Global.Element.JtableDelivery
            },
            rowInserted: function (event, data) {
                if (data.record.Id == Global.Data.parentId) {
                    var $a = $('#' + Global.Element.JtableDelivery).jtable('getRowByKey', data.record.Id);
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
                    width: "15%",
                    display: function (data) {
                        var txt = '<span>' + data.record.strCustomer + '</span>';
                        return txt;
                    }
                },
                Reciever: {
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
                    display: function (data) {
                        var txt = `<span class="bold red">${ParseStringToCurrency(data.record.Total)}</span> ${data.record.TienTe} <i class="fa fa-arrow-right blue"></i> <span class="bold red">${ParseStringToCurrency(data.record.ExchangeRate)}</span>`;
                        return txt;
                    }
                },
                DateOfAccounting: {
                    title: 'Ngày Hạch Toán',
                    width: '5%',
                    display: function (data) {
                        var txt = "";
                        if (data.record.DateOfAccounting != null) {
                            var date = new Date(parseJsonDateToDate(data.record.DateOfAccounting))
                            txt = '<span  class="bold blue">' + ParseDateToString(date) + '</span>';
                        }
                        else
                            txt = '<span class="">' + "" + '</span>';
                        return txt;
                    }
                },
                IsApproved: {
                    title: "TT Duyệt",
                    width: "5%",
                    display: function (data) {
                        var txt = '';
                        if (data.record.IsApproved)
                            txt = '<i class="fa fa-check-square-o red  "><i/>';
                        else
                            txt = '<i class="fa fa-square-o" ></i>';
                        return txt;
                    }
                },
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
                            txt = '<span  class="bold red">' + ParseDateToString(date) + '</span>';
                        }
                        return txt;
                    }
                },
                Detail: {
                    title: 'DS Chi Tiết',
                    width: '3%',
                    sorting: false,
                    edit: false,
                    display: function (parent) {
                        var $img = $('<i class="fa fa-list-ol clickable red aaa" title="Click Xem Danh Sách Chi Tiết ' + parent.record.Name + '"></i>');
                        $img.click(function () {
                             
                            $('#' + Global.Element.JtableDelivery).jtable('openChildTable',
                                $img.closest('tr'),
                                {
                                    title: '<span class="red">Chi tiết phiếu xuất kho</span>',
                                    paging: true,
                                    pageSize: 10,
                                    pageSizeChange: true,
                                    sorting: true,
                                   // selectShow: true,
                                    actions: {
                                        listAction: Global.UrlAction.GetChild + '' + parent.record.Id, 
                                    },
                                    messages: { 
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
                                            display: function (data) {
                                                txt = '<span >' + data.record.MaterialName + '</span>';
                                                return txt;
                                            }
                                        },
                                        WareHouseName: {
                                            title: "Kho",
                                            width: "15%",
                                            display: function (data) {
                                                txt = '<span >' + data.record.WareHouseName + '</span>';
                                                return txt;
                                            }
                                        },
                                        Quantity: {
                                            title: 'Số Lượng',
                                            width: '10%',
                                            display: function (data) {
                                                var txt = '<span class="bold red">' + ParseStringToCurrency(data.record.Quantity) + '</span> ' + data.record.UnitName;
                                                return txt;
                                            }
                                        },
                                        Price: {
                                            title: 'Đơn giá',
                                            width: '5%',
                                            display: function (data) {
                                                var txt = '<span class="bold red">' + ParseStringToCurrency(data.record.Price) + '</span> ';
                                                return txt;
                                            }
                                        },
                                        InputDate: {
                                            title: 'Ngày Nhập',
                                            width: '10%',
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
                                        Note: {
                                            title: 'Ghi chú',
                                            width: '10%',
                                            sorting: false,
                                        } 
                                    }
                                }, function (data) { //opened handler
                                    data.childTable.jtable('load');
                                });
                        });
                        return $img;
                    }
                },
                Note: {
                    title: 'Ghi chú',
                    width: '10%',
                    sorting: false,
                } 
            }
        });
    }

    function ReloadDeliveryTable() {
        $('#' + Global.Element.JtableDelivery).jtable('load', { 'custId': $('#cust-report-name').data("kendoComboBox").value()  });
    }
       
    function CheckValidate() {
        if ($('#cust-report-name').val().trim() == "") {
            GlobalCommon.ShowMessageDialog("Vui lòng nhập khách hàng.", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        else if ($('#cus-report-type').val().trim() == "" || $('#cus-report-type').val().trim() == "0") {
            GlobalCommon.ShowMessageDialog("Vui lòng chọn loại báo cáo.", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        return true;
    }


    function GetCustomerCombobox(controlId) {
        $('#' + controlId).kendoComboBox({
            dataTextField: "Code",
            dataValueField: "Value",
            suggest: true,
            placeholder: "- Chọn khách hàng -",
            filter: "startswith",
            minLength: 1,
            //dataSource: [{ "Value": "1", "Name": "Thiết Bị 1" }, { "Value": "2", "Name": "Thiết Bị 2" }, { "Value": "3", "Name": "Thiết Bị 3" }],
            dataSource: {
                //serverFiltering: true,  // lọc dữ liệu từ phía server
                transport: {
                    read: {
                        dataType: "json",
                        //type:'GET',
                        //contentType:"application/json charset=utf-8",
                        url: "/Customer/GetSelectList_FilterByText",
                        //data: JSON.stringify({ text: $('#ECHByTimeRange_equipment').val() }),
                        data: {
                            text: function () {
                                return $('#' + controlId).data("kendoComboBox").text();
                            }
                        },

                    }
                }
            },
        });
    }

}

$(document).ready(function () {
    var obj = new GPRO.CustomerReport();
    obj.Init();
});
