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
GPRO.namespace('Assignment');
GPRO.Assignment = function () {
    var Global = {
        UrlAction: {
            Gets: '/Lenhsx/Gets',

            GetPCSX: '/Assignment/gets',
            Save: '/Assignment/Save',
            Delete: '/Assignment/Delete',
            Finish: '/Assignment/Finish',

            GetPOs: '/PO/Gets_PC',

            GetCodes: '/lenhsx/GetCodes',
            GetByCode: '/lenhsx/GetByCode',

            GetNXs: '/Assignment/GetNXs',
            GetNXGios: '/Assignment/GetNXGios'
        },
        Element: {
            JtableProduct: 'jtable-lenh-product',


            Popup: 'popup-asign',

            PopupNX: 'popup-a-nx',
            JtableNX: 'jtable-a-nx',

            PopupNX_H: 'popup-a-nx-gio',
            JtableNX_H: 'jtable-a-nx-gio',
        },
        Data: {
            Products: [],
            ProductId: 0,
            LenhProductId: 0,
            SLCu: 0,
            Unit: '',
            SLConLai: 0,
            cspId: 0,
            strDate: '',
            lineId:0
        }
    }
    this.GetGlobal = function () {
        return Global;
    }

    this.Init = function () {
        GetLenhCodes();

        GetWorkshopSelect('a-workshop');
        GetProductSelect('a-product');
        RegisterEvent();
        //InitList();
        ////ReloadList();
        InitPopup();

        //InitPopupPO();
        //InitTablePO();

        InitTableProduct();
        // ReloadTable();

        InitPopupNX();
        InitTableNX();
    }

    var RegisterEvent = function () {
        $('#a-workshop').change(function () {
            if ($('#a-workshop').val() != undefined)
                GetFloorSelect('a-floor', $('#a-workshop').val());
        });

        $('#a-floor').change(function () {
            if ($('#a-floor').val() != undefined)
                GetLineSelect('a-line', $('#a-floor').val());
        });

        //$('#a-line').change(function () {
        //    if ($('#a-line').val() != undefined)
        //        ReloadList();
        //});

        $('#a-product').change(function () {
            if ($('#a-product').val() != undefined) {
                var unit = $('#a-product option:selected').attr('unit');
                if (unit)
                    $('#span-pro-unit').html(unit);
                else $('#span-pro-unit').html('');
            }
        });

        $('#a-input-date,#a-output-date').kendoDatePicker({ format: 'dd/MM/yyyy' });

        $("#a-plans").change(() => {
            if ($("#a-plans").val() != '') {
                var sl = parseInt($("#a-plans").val());
                if (sl > Global.Data.SLCu)
                    if ((sl - Global.Data.SLCu) > Global.Data.SLConLai) {
                        GlobalCommon.ShowMessageDialog(`Sản lượng còn lại có thể phân công của sản phẩm này là: ${(Global.Data.SLConLai + Global.Data.SLCu)} ${Global.Data.Unit}`,
                            function () {
                                $("#a-plans").val(0)
                            }, "Lỗi Nhập liệu");
                    }
            }

        });

        $("#lenh-code").keyup(function (evt) {
            if (evt.keyCode == 13)
                if ($("#lenh-code").val())
                    GetLenh();
        })
    }

    function GetLenhCodes() {
        $.ajax({
            url: Global.UrlAction.GetCodes,
            type: 'POST',
            data: '',
            contentType: 'application/json charset=utf-8',
            beforeSend: function () { $('#loading').show(); },
            success: function (data) {
                $('#loading').hide();
                GlobalCommon.CallbackProcess(data, function () { 
                    var option = '';
                    if (data.Data != null && data.Data.length > 0) {
                        $.each(data.Data, function (i, item) {
                            
                            option += '<option value="' + item  + '" /> ';
                        });
                    }
                    $('#lenh-codes').append(option);
                }, false, Global.Element.Popup, true, true, function () {

                    var msg = GlobalCommon.GetErrorMessage(data);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
                });
            }
        });
    }

    function GetLenh() {
        $.ajax({
            url: Global.UrlAction.GetByCode,
            type: 'POST',
            data: JSON.stringify({ 'code': $('#lenh-code').val() }),
            contentType: 'application/json charset=utf-8',
            beforeSend: function () { $('#loading').show(); },
            success: function (data) {
                $('#loading').hide();
                GlobalCommon.CallbackProcess(data, function () {
                    //$('#lenh-info-box').addClass('hide');
                    if (data.Data) {
                        $('#lenh-code').html(data.Data.Code);
                        $('#lenh-date').html(ddMMyyyy(data.Data.CreatedDate));
                        $('#lenh-startdate').html(ddMMyyyy(data.Data.StartDate));
                        $('#lenh-employee').html(data.Data.EmployeeName);
                        $('#lenh-note').html(data.Data.Note);

                      //  $('#lenh-info-box').removeClass('hide');

                        Global.Data.Products.length = 0;
                        if (data.Data.Products)
                            data.Data.Products.map((item, i) => {
                                item.Index = i + 1;
                                Global.Data.Products.push(item);
                            });
                        ReloadTableProduct();
                    }
                    else
                        GlobalCommon.ShowMessageDialog("Không tìm thấy thông tin lệnh. Vui lòng kiểm tra lại.", function () { }, "Thông báo");
                }, false, Global.Element.Popup, true, true, function () {

                    var msg = GlobalCommon.GetErrorMessage(data);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
                });
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
            //if ($('#c-id').val() == '' || $('#c-id').val() == '0')
            //    GetLastIndex();
        });

        $("#" + Global.Element.Popup + ' button[a-save]').click(function () {
            if (CheckValidate()) {
                Save();
            }
        });
        $("#" + Global.Element.Popup + ' button[a-cancel]').click(function () {
            $("#" + Global.Element.Popup).modal("hide");
            setToDefault();
        });

        $("#" + Global.Element.Popup + ' button[a-done]').click(function () {
            if ($('a-stt').val() != '0')
                Finish();
        });
    }

    function CheckValidate() {
        if ($('#a-stt').val().trim() == "") {
            GlobalCommon.ShowMessageDialog("Vui lòng nhập thứ tự thực hiện.", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        else if (Global.Data.LenhProductId == 0 && $('#a-id').val() == '0') {
            GlobalCommon.ShowMessageDialog("Vui lòng chọn sản phẩm", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        else if ($('#a-plans').val().trim() == "") {
            GlobalCommon.ShowMessageDialog("Vui lòng nhập sản lượng kế hoạch.", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        else if (parseInt($('#a-plans').val().trim()) <= 0) {
            GlobalCommon.ShowMessageDialog("Vui lòng nhập sản lượng kế hoạch > 0.", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        else if ($('#a-month').val().trim() == "") {
            GlobalCommon.ShowMessageDialog("Vui lòng chọn tháng", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        else if ($('#a-year').val().trim() == "") {
            GlobalCommon.ShowMessageDialog("Vui lòng chọn năm", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        return true;
    }

    setToDefault = () => {
        $('#c-id').val(0);
        $('#c-stt').val(1);
        $('#c-product').val(0);
        $('#c-year').val(new Date().getFullYear());
        $('#c-month').val((new Date().getMonth() + 1));
        $('#c-plans').val(1);

        $('#a-stt,#a-month,#a-year,#a-product').prop('disabled', false);

        //Global.Data.LenhProductId = 0;
        //Global.Data.ProductId = 0;
        //Global.Data.SLConLai = 0;
        Global.Data.SLCu = 0;
        Global.Data.SLMoi = 0;
        //Global.Data.Unit = '';

        $('#span-pro-unit').html('');
        $('#checklist-product-info').empty().append('');

        var input = $("#a-input-date").data("kendoDatePicker");
        input.value('');
        input.trigger("change");

        var output = $("#a-output-date").data("kendoDatePicker");
        output.value('');
        output.trigger("change");
    }

    Save = () => {
        var obj = {
            STT: $('#a-id').val(),
            MaChuyen: $('#a-line').val(),
            MaSanPham: Global.Data.ProductId,
            Thang: $('#a-month').val(),
            Nam: $('#a-year').val(),
            STTThucHien: $('#a-stt').val(),
            SanLuongKeHoach: $('#a-plans').val(),
            DateInput: $('#a-input-date').data("kendoDatePicker").value(),
            DateOutput: $('#a-output-date').data("kendoDatePicker").value(),
            Lenh_ProductId: Global.Data.LenhProductId,
            SLCu: Global.Data.SLCu,
            SLMoi: $('#a-plans').val()
        };

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
                        GetLenh();
                        setToDefault();
                        //if (!Global.Data.IsInsert) {
                        $("#" + Global.Element.Popup + ' button[a-cancel]').click();
                        $('div.divParent').attr('currentPoppup', '');
                        // }
                        //else
                        //  GetLastIndex();
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

    Finish = () => {
        $.ajax({
            url: Global.UrlAction.Finish,
            type: 'POST',
            data: JSON.stringify({ 'Id': $('#a-id').val() }),
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




    function InitTableProduct() {
        $('#' + Global.Element.JtableProduct).jtable({
            title: 'Danh sách sản phẩm',
            pageSize: 100,
            pageSizeChange: true,
            // selectShow: true,
            sorting: false,
            actions: {
                listAction: Global.Data.Products,
            },
            messages: {
                //  selectShow: 'Ẩn hiện cột'
            },
            rowInserted: function (event, data) {
                if (data.record.Id == Global.Data.LenhProductId) {
                    var $a = $('#' + Global.Element.JtableProduct).jtable('getRowByKey', data.record.Id);
                    $($a.children().find('.aaa')).click();
                }
            },
            datas: {
                jtableId: Global.Element.JtableStatus
            },
            fields: {
                Id: {
                    key: true,
                    create: false,
                    edit: false,
                    list: false
                },

                Index: {
                    title: "STT",
                    width: "3%",
                    columnClass: 'text-center',
                },
                POCode:
                {
                    title: "Mã PO",
                    width: "10%",
                    columnClass: 'text-center',
                },
                ProductName: {
                    title: "Sản phẩm",
                    width: "45%"
                },
                Quantity: {
                    title: "Số lượng yêu cầu",
                    width: "7%",
                    columnClass: 'text-center',
                    display: function (data) {
                        return `${ParseStringToCurrency(data.record.Quantity)} <span class="bold red">${data.record.UnitName}</span>`;
                    }
                },
                Quantities_PC: {
                    title: "Số lượng có thể phân bổ",
                    width: "5%",
                    columnClass: 'text-center',
                    display: function (data) {
                        return `${ParseStringToCurrency(data.record.Quantity - data.record.Quantities_PC)} <span class="bold red">${data.record.UnitName}</span>`;
                    }
                },
                Detail: {
                    title: 'DS phân công',
                    width: '3%',
                    sorting: false,
                    edit: false,
                    columnClass: 'text-center',
                    display: function (parent) {
                        var $img = $('<i class="fa fa-list-ol clickable red aaa" title="Click xem sanh sách trạng thái ' + parent.record.Name + '"></i>');
                        $img.click(function () {
                            Global.Data.ProductId = parent.record.ProductId;
                            Global.Data.LenhProductId = parent.record.Id;
                            Global.Data.Unit = parent.record.UnitName;
                            Global.Data.SLConLai = (parent.record.Quantity - parent.record.Quantities_PC)
                            $('#' + Global.Element.JtableProduct).jtable('openChildTable',
                                $img.closest('tr'),
                                {
                                    title: '<span class="red">Danh sách phân công sản xuất của sản phẩm : ' + parent.record.ProductName + '</span>',
                                    paging: true,
                                    pageSize: 1000,
                                    pageSizeChange: true,
                                    sorting: true,
                                    selectShow: false,
                                    actions: {
                                        listAction: Global.UrlAction.GetPCSX + '?lenhProId=' + parent.record.Id,
                                        createAction: Global.Element.Popup,
                                    },
                                    messages: {
                                        addNewRecord: 'Thêm mới',
                                    },
                                    fields: {
                                        ParentId: {
                                            type: 'hidden',
                                            defaultValue: parent.record.Id
                                        },
                                        STT: {
                                            key: true,
                                            create: false,
                                            edit: false,
                                            list: false
                                        },
                                        //LenhProductId: {
                                        //    title: "Lệnh sản xuất",
                                        //    width: "10%",
                                        //    display: function (data) {
                                        //        if (data.record.LenhInfo)
                                        //            return `${data.record.LenhInfo}`;
                                        //        else
                                        //            return '';
                                        //    }
                                        //},
                                        STT_TH: {
                                            title: "Stt thực hiện",
                                            width: "10%",
                                        },
                                        LineName: {
                                            visibility: 'fixed',
                                            title: "Chuyền",
                                            width: "20%",
                                            sorting: false,
                                        },
                                        ProductionPlans: {
                                            title: "Kế hoạch",
                                            width: "10%",
                                            // sorting: false,
                                            display: function (data) {
                                                return `${data.record.ProductionPlans} <span class="red">${data.record.UnitName}</span>`
                                            }
                                        },
                                        LK_TH: {
                                            title: "Lk thực hiện",
                                            width: "10%",
                                            // sorting: false,
                                            display: function (data) {
                                                return `${data.record.LK_TH} <span class="red">${data.record.UnitName}</span>`
                                            }
                                        },
                                        Month: {
                                            title: "Tháng",
                                            width: "10%",
                                        },
                                        Year: {
                                            title: "Năm",
                                            width: "10%",
                                        },
                                        IsFinishStr: {
                                            title: "Xưởng SX",
                                            width: "10%",
                                        },
                                        IsStopForeverStr: {
                                            title: "Xưởng hoàn tất",
                                            width: "10%",
                                        },
                                        DateInput: {
                                            title: "Vào chuyền",
                                            width: "10%",
                                            // sorting: false,
                                            display: function (data) {
                                                txt = '<span class="">' + ddMMyyyy(data.record.DateInput) + '</span>';
                                                return txt;
                                            }
                                        },
                                        DateOutput: {
                                            title: "Nhập kho",
                                            width: "10%",
                                            //sorting: false,
                                            display: function (data) {
                                                txt = '<span class="">' + ddMMyyyy(data.record.DateOutput) + '</span>';
                                                return txt;
                                            }
                                        },
                                        details: {
                                            title: '',
                                            width: '1%',
                                            sorting: false,
                                            display: function (data) {
                                                var text = $('<i data-toggle="modal" data-target="#' + Global.Element.PopupNX + '" title="Xem thông tin năng xuất" class="fa fa-list-ol clickable red"  ></i>');
                                                text.click(function () {
                                                    Global.Data.cspId = data.record.STT;
                                                    Global.Data.lineId = data.record.LineId;
                                                    ReloadTableNX();
                                                });
                                                return text;
                                            }
                                        },
                                        edit: {
                                            title: '',
                                            width: '1%',
                                            sorting: false,
                                            display: function (data) {
                                                var text = $('<i data-toggle="modal" data-target="#' + Global.Element.Popup + '" title="Chỉnh sửa thông tin" class="fa fa-pencil-square-o clickable blue"  ></i>');
                                                text.click(function () {
                                                    $('#a-id').val(data.record.STT);
                                                    $('#a-stt').val(data.record.STT_TH);
                                                    $('#a-product').val(data.record.CommoId);
                                                    $('#a-plans').val(data.record.ProductionPlans);
                                                    $('#a-month').val(data.record.Month);
                                                    $('#a-year').val(data.record.Year);

                                                    var input = $("#a-input-date").data("kendoDatePicker");
                                                    var output = $("#a-output-date").data("kendoDatePicker");
                                                    var _input = undefined;
                                                    var _output = undefined;
                                                    if (data.record.DateInput) {
                                                        _input = new Date(moment(data.record.DateInput));
                                                        input.value(kendo.toString(_input, 'dd/MM/yyyy'));
                                                        output.min(kendo.toString(_input, 'dd/MM/yyyy'));
                                                    }
                                                    else
                                                        input.value('');

                                                    if (data.record.DateOutput) {
                                                        _output = new Date(moment(data.record.DateOutput));
                                                        output.value(kendo.toString(_output, 'dd/MM/yyyy'));
                                                    }
                                                    else
                                                        output.value('');

                                                    input.trigger("change");
                                                    output.trigger("change");
                                                    $('#a-stt,#a-month,#a-year,#a-product').prop('disabled', true);
                                                    Global.Data.ProductId = data.record.CommoId;
                                                    Global.Data.SLCu = data.record.ProductionPlans;
                                                    //if (data.record.PODetailId) {
                                                    //    Global.Data.POId = data.record.PODetailId;
                                                    //    Global.Data.Quantities = data.record.POQuantites;
                                                    //    Global.Data.Quantities_PC = data.record.POQuantites_PC;
                                                    //    Global.Data.SLConLai = data.record.POQuantites - data.record.POQuantites_PC;
                                                    //}
                                                    //else {
                                                    //    Global.Data.POId = 0;
                                                    //    Global.Data.Quantities = 0;
                                                    //    Global.Data.Quantities_PC = 0;
                                                    //}

                                                    //Global.Data.Unit = data.record.UnitName;
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
                                                        Delete(data.record.STT);
                                                    }, function () { }, 'Đồng ý', 'Hủy bỏ', 'Thông báo');
                                                });
                                                return text;

                                            }
                                        }
                                    }
                                }, function (data) { //opened handler
                                    data.childTable.jtable('load');
                                });
                        });
                        return $img;
                    }
                },
            }
        });
    }

    function ReloadTableProduct() {
        $('#' + Global.Element.JtableProduct).jtable('load');
    }
    


    function InitPopupNX() {
        $("#" + Global.Element.PopupNX).modal({
            keyboard: false,
            show: false
        });

        $('#' + Global.Element.PopupNX).on('shown.bs.modal', function () {
            $('div.divParent').attr('currentPoppup', Global.Element.PopupNX.toUpperCase()); 
        });
         
        $("#" + Global.Element.PopupNX + ' button[a-cancel]').click(function () {
            $("#" + Global.Element.PopupNX).modal("hide"); 
        }); 
    }

    function InitTableNX() {
        $('#' + Global.Element.JtableNX).jtable({
            title: 'Danh sách năng xuất theo ngày',
            pageSize: 100,
            pageSizeChange: true,
            // selectShow: true,
            sorting: false,
            actions: {
                listAction: Global.UrlAction.GetNXs,
            },
            messages: {
                //  selectShow: 'Ẩn hiện cột'
            }, 
            fields: {
                Id: {
                    key: true,
                    create: false,
                    edit: false,
                    list: false
                },
                Ngay: {
                    title: "Ngày",
                    width: "7%",
                    columnClass: 'text-center',
                },
                DinhMucNgay:
                {
                    title: "Định mức ngày",
                    width: "10%",
                    columnClass: 'text-center',
                },
                BTPThoatChuyenNgay: {
                    title: "Thoát chuyền",
                    width: "10%"
                },
                ThucHienNgay: {
                    title: "Kiểm đạt",
                    width: "10%"
                },
                BTPTang: {
                    title: "Bán Thành phẩm",
                    width: "10%"
                },
                BTP_HC_Tang: {
                    title: "BTP hoàn chỉnh",
                    width: "10%"
                },
                SanLuongLoi: {
                    title: "SP Lỗi",
                    width: "10%"
                },
                Detail: {
                    title: 'Chi tiết trong ngày',
                    width: '3%',
                    sorting: false,
                    edit: false,
                    columnClass: 'text-center',
                    display: function (data) {
                        var $img = $('<i data-toggle="modal" data-target="#' + Global.Element.PopupNX_H + '" title="Xem thông tin năng xuất chi tiết trong ngày" class="fa fa-list-ol clickable red"  ></i>');
                        $img.click(function () {
                            Global.Data.strDate = data.record.Ngay;
                            GetNXGio();
                        });
                        return $img;
                    }
                },
            }
        });
    }

    function ReloadTableNX() {
        $('#' + Global.Element.JtableNX).jtable('load', { 'cspId': Global.Data.cspId });
    }

    function InitPopupNX_H() {
        $("#" + Global.Element.PopupNX_H).modal({
            keyboard: false,
            show: false
        });

        $('#' + Global.Element.PopupNX_H).on('shown.bs.modal', function () { 
            $("#" + Global.Element.PopupNX).modal("hide");
        });

        $("#" + Global.Element.PopupNX_H + ' button[a-cancel]').click(function () {
            $("#" + Global.Element.PopupNX).modal("show");
            $("#" + Global.Element.PopupNX_H).modal("hide");
        });
    }

    function GetNXGio() {
        $.ajax({
            url: Global.UrlAction.GetNXGios,
            type: 'POST',
            data: JSON.stringify({ 'strDate': Global.Data.strDate, 'cspId': Global.Data.cspId, 'lineId': Global.Data.lineId }),
            contentType: 'application/json charset=utf-8',
            beforeSend: function () { $('#loading').show(); },
            success: function (data) {
                $('#loading').hide();
                GlobalCommon.CallbackProcess(data, function () { 
                    var tb = $('#tb-nx-gio');
                    tb.empty();
                    if (data.Records.length>0) {
                        var head = $(`<thead></thead>`);
                        var tr = $(`<tr></tr>`);
                        tr.append('<td></td>');
                        data.Records.map(item => {
                            tr.append(`<td>${item.Name}</td>`);
                        })

                        head.append(tr);
                        tb.append(head);

                        var _body = $(`<tbody></tbody>`);
                        tr = $(`<tr></tr>`);
                        tr.append('<td>Thoát chuyền</td>');
                        data.Records.map(item => {
                            tr.append(`<td>${item.TC}</td>`);
                        })
                        _body.append(tr);

                        tr = $(`<tr></tr>`);
                        tr.append('<td>KCS</td>');
                        data.Records.map(item => {
                            tr.append(`<td>${item.KCS}</td>`);
                        })
                        _body.append(tr);

                        tr = $(`<tr></tr>`);
                        tr.append('<td>BTP</td>');
                        data.Records.map(item => {
                            tr.append(`<td>${item.BTP}</td>`);
                        })
                        _body.append(tr);

                        tr = $(`<tr></tr>`);
                        tr.append('<td>BTP hoàn chỉnh</td>');
                        data.Records.map(item => {
                            tr.append(`<td>${item.BTP_HC}</td>`);
                        })
                        _body.append(tr);

                        tr = $(`<tr></tr>`);
                        tr.append('<td>SP Lỗi</td>');
                        data.Records.map(item => {
                            tr.append(`<td>${item.Error}</td>`);
                        })
                        _body.append(tr);

                        tb.append(_body);
                    }                     
                         
                }, false, Global.Element.Popup, true, true, function () {

                    var msg = GlobalCommon.GetErrorMessage(data);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
                });
            }
        });
    }


}

$(document).ready(function () {
    var obj = new GPRO.Assignment();
    obj.Init();
});
