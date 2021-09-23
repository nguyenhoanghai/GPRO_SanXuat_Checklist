if (typeof GPRO == 'undefined' || !GPRO) var GPRO = {};

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
GPRO.namespace('CL_Index');
GPRO.CL_Index = function () {
    var Global = {
        UrlAction: {
            GetYear: '/CheckList/GetYear',
            Copy: '/CheckList/CopyProtime',

            GetAll: '/CheckList/GetAll',
            SaveOrder: '/CheckList/SaveOrder',
            DeleteOrder: '/CheckList/DeleteOrder',

            SavePro: '/CheckList/SavePro',
            DeletePro: '/CheckList/DeletePro',

            SaveProTime: '/CheckList/SaveProTime',
            DeleteProTime: '/CheckList/DeleteProTime',
            GetProSetting: '/Common/GetProSettingSelect',

            GetListOrder: '/Common/GetOrderDetails'
        },
        Element: {
            PopupOrder: 'Create_OrderAna_popup',
            PopupProduct: 'Create_Commo_popup',
            PopupProductTime: 'Create_ProTimes_popup',
            CopyPopup: 'Copy_popup',
            JtableOrder: 'jtableOrder',
            Popup_choose_order: 'popup_choose_order'
        },
        Data: {
            Projects: [],
            day: 0,
            month: 0,
            year: 0,
            isProductionProject: true,
            ProSettingSRC: [],
            ObjId: 0,
            OrderDetailId: 0,
            MaterialId: 0
        }
    }
    this.GetGlobal = function () {
        return Global;
    }

    this.Init = function () {
        GetProSetting();
        GetYear();
        RegisterEvent();
        GetAll(0, new Date().getFullYear());
        InitPopupOrder();
        InitDate();
        InitPopupProduct();
        InitPopupProductTime();
        InitPopupCopy();
        InitListOrder();
     //   InitPopupOrder();
        var now = new Date();
        Global.Data.day = now.getDate();
        Global.Data.month = now.getMonth();
        Global.Data.year = now.getFullYear();
        //if ($('#ct_Id').attr('isusepmsoff') == 'True') {
        //    $('#ct_quantity_kh').replaceWith('<label class="form-control" id="ct_quantity_kh">0</label');
        //    $('#ct_quantity_tt').replaceWith('<label class="form-control" id="ct_quantity_tt">0</label');
        //    $('#ct_start').replaceWith('<label class="form-control" id="ct_start"></label');
        //    $('#ct_end').replaceWith('<label class="form-control" id="ct_end"></label');
        //    $('#ct_warehouse').replaceWith('<label class="form-control" id="ct_warehouse"></label');
        //}
    }

    this.Edit = function (Id) { Bind(Id); }
    this.Copy = function (id) { $('#copy_Id').val(id); }
    this.Delete = function (Id) { GlobalCommon.ShowConfirmDialog('Bạn có chắc chắn muốn xóa?', function () { DeleteOrder(Id); }, function () { }, 'Đồng ý', 'Hủy bỏ', 'Thông báo'); }
    this.Edit_P = function (ParentId, Id) { Bind_P(ParentId, Id); }
    this.Delete_P = function (Id) { GlobalCommon.ShowConfirmDialog('Bạn có chắc chắn muốn xóa?', function () { DeletePro(Id); }, function () { }, 'Đồng ý', 'Hủy bỏ', 'Thông báo'); }
    this.SetId = function (Id, isProductionProject, materialId) { $('[pt' + Id + ']').prop('itme', '1'); Global.Data.isProductionProject = isProductionProject; Global.Data.MaterialId = materialId; }
    this.Edit_ProTime = function (ParentId, childId, subChildId) { Bind_Pro_Time(ParentId, childId, subChildId); }
    this.Delete_ProTime = function (Id) { GlobalCommon.ShowConfirmDialog('Bạn có chắc chắn muốn xóa?', function () { DeleteProTime(Id); }, function () { }, 'Đồng ý', 'Hủy bỏ', 'Thông báo'); }

    var RegisterEvent = function () {
        $('#IsProductionProject').bootstrapToggle('on');
        $('[re_year]').click(function () { GetYear(); });
        $('[btnAddNew]').click(function () { });
        $('[btnSearch]').click(function () { GetAll($('#month').val(), $('#year').val()); });
        $('#month,#year').change(function () { GetAll($('#month').val(), $('#year').val()); });
        $('#IsProductionProject').change(function () {
            if ($(this).prop('checked')) {
                //   $('[divpro]').show();
                $('[lbten]').html('Mặt Hàng (sản phẩm)<span class="red bold">*</span>');
            }
            else {
                //  $('[divpro]').hide();
                $('[lbten]').html('Tên <span class="red bold">*</span>');
            }
            $('[divpro]').hide();
        });
        $('#C_Name').change(function () {
            if ($('#IsProductionProject').prop('checked')) {
                if (Global.Data.ProSettingSRC.length > 0) {
                    var obj = {};
                    $.each(Global.Data.ProSettingSRC, function (i, item) {
                        if (item.Name == $('#C_Name').val().trim()) {
                            obj = item;
                            return false;
                        }
                    });
                    if (obj != null)
                        Global.Data.ObjId = obj.Value;
                    else
                        GlobalCommon.ShowMessageDialog('Không tìm thấy thông tin sản phẩm trong dữ liệu. Vui lòng kiểm tra lại!', function () { $('#C_Name').select(); }, "Thông báo");
                }
                else
                    GlobalCommon.ShowMessageDialog('Không tìm thấy thông tin sản phẩm trong dữ liệu. Vui lòng kiểm tra lại!', function () { $('#C_Name').select(); }, "Thông báo");
            }
            else
                Global.Data.ObjId = 0;
        });
        $('#' + Global.Element.PopupProductTime).on('shown.bs.modal', function (e) {
            if (Global.Data.isProductionProject) {
                // $('[divprotime]').show();
                $('[lbLoSX]').html('Mã lô sản xuất <span class="red bold">*</span>');
                //  $('[divLast]').removeClass('col-md-6');
            }
            else {
                // $('[divprotime]').hide();
                //  $('[divLast]').addClass('col-md-6');
                $('[lbLoSX]').html('Tên <span class="red bold">*</span>');
            }
            //   $('[divLast]').addClass('col-md-6');
        });
        $('[btn_get_order]').click(function () { ReloadListOrder(); });

        $("#" + Global.Element.PopupOrder + ' button[ordersave]').click(function () {
            // if (CheckValidate()) {
            SaveOrder();
            //}
        });
        $("#" + Global.Element.PopupOrder + ' button[cancel]').click(function () {
            $("#" + Global.Element.PopupOrder).modal("hide");
            $('#O_Id').val(0);
            $('#T_Order').val('');
            $('#OrderMa_Des').val('');
            var startdate = new Date(Global.Data.year, Global.Data.month, Global.Data.day);
            var dp = $("#o_start").data("kendoDatePicker");
            dp.value(startdate);

            dp = $("#o_end").data("kendoDatePicker");
            dp.value(startdate);
            dp.min(startdate);
        });
    }

    function GetYear() {
        $.ajax({
            url: Global.UrlAction.GetYear,
            type: 'POST',
            data: '',
            contentType: 'application/json charset=utf-8',
            success: function (data) {
                GlobalCommon.CallbackProcess(data, function () {
                    if (data.Result == "OK" && data.Data.length > 0) {
                        var obj = $('#year');
                        obj.empty();
                        var option = '';
                        $.each(data.Data, function (i, item) {
                            option += '<option value="' + item.Value + '">' + item.Name + '</option>';
                        });
                        obj.append(option);
                    }
                    else
                        GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình sử lý.");
                }, false, Global.Element.PopupOrder, true, true, function () {

                    var msg = GlobalCommon.GetErrorMessage(data);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
                });
            }
        });
    }
    /*----------------------------------------------------------------------------------------------------------------*/
    /*----------------------------------------------        ORDER       ----------------------------------------------*/
    /*----------------------------------------------------------------------------------------------------------------*/
    function GetAll(month, year) {
        $.ajax({
            url: Global.UrlAction.GetAll,
            type: 'POST',
            data: JSON.stringify({ 'Month': month, 'Year': year }),
            contentType: 'application/json charset=utf-8',
            success: function (data) {
                GlobalCommon.CallbackProcess(data, function () {
                    if (data.Result == "OK")
                        DrawData(data.Data);
                    else
                        GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình sử lý.");
                }, false, Global.Element.PopupOrder, true, true, function () {
                    var msg = GlobalCommon.GetErrorMessage(data);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
                });
            }
        });
    }

    function DrawData(objs) {
        var div = $('#test');
        div.empty();
        Global.Data.Projects.length = 0;
        if (objs.length > 0) {
            var htmlObj = '';
            $.each(objs, function (i, item) {
                htmlObj += '<div class="per-item">';
                htmlObj += '<div class="per-title"><div class="tt-name">' + item.Name + '</div><div class="fa-o"><i class="fa fa-plus " data-toggle="modal" data-target="#Create_Commo_popup" onclick="SetId(' + item.Id + ')" title="Tạo Sản Phẩm"></i><i class="fa fa-pencil " onclick="Edit(' + item.Id + ')" title="Chỉnh sửa thông tin Dự Án"></i><i class="fa fa-trash-o " title="Xóa Dự Án" onclick="Delete(' + item.Id + ')"></i></div></div><div style="clear:right"></div>';
                if (item.Products.length > 0) {
                    htmlObj += '<ul>';
                    $.each(item.Products, function (ii, subObj) {
                        htmlObj += '<li p' + subObj.Id + ' status="0"><div class="li_name aa">' + subObj.Name + '<span class="circle" >' + subObj.ProductTimes.length + '</span></div><div class="fa-pro"><i class="fa fa-clipboard " onclick="Paste( ' + subObj.Id + ' )" title="Dán"></i><i class="fa fa-plus " onclick="SetId_(' + subObj.Id + ',' + subObj.IsProductionProject + ',' + subObj.ObjectId + ')" data-toggle="modal" data-target="#Create_ProTimes_popup" title="Tạo đợt sản xuất"></i><i class="fa fa-pencil " onclick="Edit_P(' + item.Id + ',' + subObj.Id + ')" title="Chỉnh sửa thông tin"></i><i class="fa fa-trash-o "  onclick="Delete_P(' + subObj.Id + ')" title="Xóa"></i></div>';
                        if (subObj.ProductTimes.length > 0) {
                            htmlObj += '<ul>';
                            $.each(subObj.ProductTimes, function (iii, child) {
                                htmlObj += '<li pt' + subObj.Id + ' itme="0"><div class="li_name" onclick="Go(' + child.Id + ')">' + child.Name + '</div><div class="fa-pro"><i class="fa fa-files-o" data-toggle="modal" data-target="#' + Global.Element.CopyPopup + '" onclick="Copy(' + child.Id + ')" title="Sao chép"></i><i class="fa fa-pencil " onclick="Edit_ProTime(' + item.Id + ',' + subObj.Id + ',' + child.Id + ')" title="Chỉnh sửa thông tin"></i><i class="fa fa-trash-o" onclick="Delete_ProTime(' + child.Id + ')" title="Xóa"></i></div></li>';
                            });
                            htmlObj += '</ul>';
                        }
                        htmlObj += '</li>';
                    });
                    htmlObj += '</ul>';
                }
                htmlObj += '</div>';
                Global.Data.Projects.push(item);
            });
            div.append(htmlObj);

            var elem = document.querySelector('#test');
            var msnry = new Masonry(elem, {
                itemSelector: '.per-item',
                columnWidth: 5
            });

            $('.per-item ul li div.aa').click(function () {
                if ($($(this).parent()).attr('status') == '0') {
                    $($($(this).parent()).find('ul')).css('display', 'block');
                    $($(this).parent()).attr('status', '1');
                }
                else {
                    $($($(this).parent()).find('ul')).css('display', 'none');
                    $($(this).parent()).attr('status', '0');
                }

                var elem = document.querySelector('#test');
                var msnry = new Masonry(elem, {
                    itemSelector: '.per-item',
                    columnWidth: 5
                });
            });
        }
    }

    function SaveOrder() {
        var obj = {
            Id: $('#O_Id').val(),
            Name: $('#T_Order').val(),
            StartDate: new Date(),// $("#o_start").data("kendoDatePicker").value(),
            EndDate: new Date(),// $("#o_end").data("kendoDatePicker").value(),
            Note: $('#OrderMa_Des').val(),
        }
        $.ajax({
            url: Global.UrlAction.SaveOrder,
            type: 'post',
            data: ko.toJSON(obj),
            contentType: 'application/json',
            beforeSend: function () { $('#loading').show(); },
            success: function (result) {
                $('#loading').hide();
                GlobalCommon.CallbackProcess(result, function () {
                    if (result.Result == "OK") {
                        GetAll($('#month').val(), $('#year').val());
                        $("#" + Global.Element.PopupOrder + ' button[cancel]').click();
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

    function DeleteOrder(Id) {
        $.ajax({
            url: Global.UrlAction.DeleteOrder,
            type: 'POST',
            data: JSON.stringify({ 'Id': Id }),
            contentType: 'application/json charset=utf-8',
            success: function (data) {
                GlobalCommon.CallbackProcess(data, function () {
                    if (data.Result == "OK")
                        GetAll($('#month').val(), $('#year').val());
                    else
                        GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình sử lý.");
                }, false, Global.Element.PopupOrder, true, true, function () {

                    var msg = GlobalCommon.GetErrorMessage(data);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
                });
            }
        });
    }

    function InitPopupOrder() {
        $("#" + Global.Element.PopupOrder).modal({
            keyboard: false,
            show: false
        });

        $("#" + Global.Element.PopupOrder + ' button[ordersave]').click(function () {
            // if (CheckValidate()) {
            SaveOrder();
            //}
        });
        $("#" + Global.Element.PopupOrder + ' button[cancel]').click(function () {
            $("#" + Global.Element.PopupOrder).modal("hide");
            $('#O_Id').val(0);
            $('#T_Order').val('');
            $('#OrderMa_Des').val('');
            var startdate = new Date(Global.Data.year, Global.Data.month, Global.Data.day);
            var dp = $("#o_start").data("kendoDatePicker");
            dp.value(startdate);

            dp = $("#o_end").data("kendoDatePicker");
            dp.value(startdate);
            dp.min(startdate);
        });
    }

    function InitDate() {
        $("#o_start").kendoDatePicker({
            format: "dd/MM/yyyy ",
            change: function () {
                var value = this.value();
                var dp = $("#o_end").data("kendoDatePicker");
                dp.min(value);
            }
        });

        $("#o_end").kendoDatePicker({
            format: "dd/MM/yyyy ",
        });

        /********************************** PRODUCT ****************************************/
        $("#c_start").kendoDateTimePicker({
            format: "dd/MM/yyyy hh:mm tt",
            change: function () {
                var value = this.value();
                var dp = $("#c_end").data("kendoDateTimePicker");
                dp.min(value);
                dp = $("#c_warehouse").data("kendoDateTimePicker");
                dp.min(value);
            }
        });

        $("#c_end").kendoDateTimePicker({
            format: "dd/MM/yyyy hh:mm tt",
        });

        $("#copy_start").kendoDatePicker({
            format: "dd/MM/yyyy"
        });

        /********************************** PRODUCT TIME ****************************************/
        $("#ct_start").kendoDateTimePicker({
            format: "dd/MM/yyyy hh:mm tt",
            change: function () {
                var value = this.value();
                var dp = $("#ct_end").data("kendoDateTimePicker");
                dp.min(value);
                dp = $("#ct_warehouse").data("kendoDateTimePicker");
                dp.min(value);
            }
        });

        $("#ct_end").kendoDateTimePicker({
            format: "dd/MM/yyyy hh:mm tt",
        });

        $("#ct_warehouse").kendoDateTimePicker({
            format: "dd/MM/yyyy hh:mm tt",
        });
    }

    function Bind(id) {
        $.each(Global.Data.Projects, function (i, item) {
            if (item.Id == id) {
                $('#' + Global.Element.PopupOrder).modal('show');
                $('#O_Id').val(item.Id);
                $('#T_Order').val(item.Name);
                $('#OrderMa_Des').val(item.Note);
                var startdate = new Date(parseJsonDateToDate(item.StartDate));
                var enddate = new Date(parseJsonDateToDate(item.EndDate));
                var dp = $("#o_start").data("kendoDatePicker");
                dp.value(startdate);

                dp = $("#o_end").data("kendoDatePicker");
                dp.value(enddate);
                dp.min(startdate);
            }
        });
    }

    /*----------------------------------------------------------------------------------------------------------------*/
    /*--------------------------------------------       PRODUCT       -----------------------------------------------*/
    /*----------------------------------------------------------------------------------------------------------------*/
    function InitPopupProduct() {
        $("#" + Global.Element.PopupProduct).modal({
            keyboard: false,
            show: false
        });

        $("#" + Global.Element.PopupProduct + ' button[save]').click(function () {
            // if (CheckValidate()) {
            SavePro();
            //}
        });
        $("#" + Global.Element.PopupProduct + ' button[cancel]').click(function () {
            $("#" + Global.Element.PopupProduct).modal("hide");
            $('#c_Id').val(0);
            $('#c_Id').attr('cl_id', 0);
            $('#quantity_kh').val(0);
            $('#quantity_tt').val(0);
            $('#Commo_Des').val('');
            $('#C_Name').val('');
            $('#IsProductionProject').prop('checked', true).change();

            var startdate = new Date(Global.Data.year, Global.Data.month, Global.Data.day);
            var dp = $("#c_start").data("kendoDateTimePicker");
            dp.value(startdate);

            dp = $("#c_end").data("kendoDateTimePicker");
            dp.value(startdate);
            dp.min(startdate);

            dp = $("#c_warehouse").data("kendoDateTimePicker");
            dp.value(startdate);
            dp.min(startdate);
        });
    }

    function SavePro() {
        var obj = {
            Id: $('#c_Id').val(),
            CL_Id: $('#c_Id').attr('cl_Id'),
            ObjectId: Global.Data.ObjId,
            Name: $('#C_Name').val(),
            StartDate: new Date(),// $("#c_start").data("kendoDateTimePicker").value(),
            EndDate: new Date(),// $("#c_end").data("kendoDateTimePicker").value(),
            //  Warehouse_InputDate: $("#c_warehouse").val() == '' ? null : $("#c_warehouse").data("kendoDateTimePicker").value(),
            Quantity_KH: $('#quantity_kh').val(),
            Quantity_TT: $('#quantity_tt').val(),
            Note: $('#Commo_Des').val(),
            IsProductionProject: $('#IsProductionProject').prop('checked')
        }
        $.ajax({
            url: Global.UrlAction.SavePro,
            type: 'post',
            data: ko.toJSON(obj),
            contentType: 'application/json',
            beforeSend: function () { $('#loading').show(); },
            success: function (result) {
                $('#loading').hide();
                GlobalCommon.CallbackProcess(result, function () {
                    if (result.Result == "OK") {
                        GetAll($('#month').val(), $('#year').val());
                        $("#" + Global.Element.PopupProduct + ' button[cancel]').click();
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

    function Bind_P(ParentId, id) {
        $.each(Global.Data.Projects, function (i, item) {
            if (item.Id == ParentId) {
                $.each(item.Products, function (ii, subItem) {
                    if (subItem.Id == id) {
                        $('#' + Global.Element.PopupProduct).modal('show');
                        $('#c_Id').val(subItem.Id);
                        $('#c_Id').attr('cl_id', subItem.CL_Id);
                        $('#quantity_kh').val(subItem.Quantity_KH);
                        $('#quantity_tt').val(subItem.Quantity_TT);
                        $('#Commo_Des').val(subItem.Note);
                        $('#C_Name').val(subItem.Name);
                        $('#C_Name').val(subItem.Name);
                        $('#IsProductionProject').prop('checked', subItem.IsProductionProject).change();

                        var startdate = new Date(parseJsonDateToDate(subItem.StartDate));
                        var enddate = new Date(parseJsonDateToDate(subItem.EndDate));
                        var dp = $("#c_start").data("kendoDateTimePicker");
                        dp.value(startdate);

                        dp = $("#c_end").data("kendoDateTimePicker");
                        dp.value(enddate);
                        dp.min(startdate);

                        if (subItem.Warehouse_InputDate != null && typeof (subItem.Warehouse_InputDate) != 'undefined') {
                            enddate = new Date(parseJsonDateToDate(subItem.Warehouse_InputDate));
                            dp = $("#c_warehouse").data("kendoDateTimePicker");
                            dp.value(enddate);
                            dp.min(startdate);
                        }
                        else
                            $("#c_warehouse").val('');
                        return false;
                    }
                });
                return false;
            }
        });
    }

    function DeletePro(Id) {
        $.ajax({
            url: Global.UrlAction.DeletePro,
            type: 'POST',
            data: JSON.stringify({ 'Id': Id }),
            contentType: 'application/json charset=utf-8',
            success: function (data) {
                GlobalCommon.CallbackProcess(data, function () {
                    if (data.Result == "OK")
                        GetAll($('#month').val(), $('#year').val());
                    else
                        GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình sử lý.");
                }, false, Global.Element.PopupOrder, true, true, function () {

                    var msg = GlobalCommon.GetErrorMessage(data);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
                });
            }
        });
    }
    function GetProSetting() {
        $.ajax({
            url: Global.UrlAction.GetProSetting,
            type: 'POST',
            data: '',
            contentType: 'application/json charset=utf-8',
            success: function (data) {
                GlobalCommon.CallbackProcess(data, function () {
                    if (data.Result == "OK") {
                        Global.Data.ProSettingSRC.length = 0;
                        var option = '';
                        if (data.Records != null && data.Records.length > 0) {
                            $.each(data.Records, function (i, item) {
                                option += '<option  >' + item.Name + '</option>';
                                Global.Data.ProSettingSRC.push(item);
                            });
                        }
                        $('#ProsettingSRC').empty().append(option);
                    }
                    else
                        GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình sử lý.");
                }, false, Global.Element.PopupOrder, true, true, function () {

                    var msg = GlobalCommon.GetErrorMessage(data);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
                });
            }
        });
    }

    /*----------------------------------------------------------------------------------------------------------------*/
    /*----------------------------------------       PRODUCTION TIME       -------------------------------------------*/
    /*----------------------------------------------------------------------------------------------------------------*/

    function InitPopupProductTime() {
        $("#" + Global.Element.PopupProductTime).modal({
            keyboard: false,
            show: false
        });

        $("#" + Global.Element.PopupProductTime + ' button[save]').click(function () {
            // if (CheckValidate()) {
            SaveProTime();
            //}
        });

        $("#" + Global.Element.PopupProductTime + ' button[cancel]').click(function () {
            $("#" + Global.Element.PopupProductTime).modal("hide");
            $('#ct_Id').val(0);
            $('#ct_Id').attr('c_id', 0);
            $('#ct_quantity_kh').val(0);
            $('#ct_quantity_tt').val(0);
            $('#ct_Des').val('');
            $('#ct_Name').val('');

            var ctr = $("#ct_start").data("kendoDateTimePicker");
            ctr.destroy();
            ctr = $("#ct_end").data("kendoDateTimePicker");
            ctr.destroy();
            ctr = $("#ct_warehouse").data("kendoDateTimePicker");
            ctr.destroy();



            $("#ct_start").kendoDateTimePicker({
                format: "dd/MM/yyyy hh:mm tt",
                change: function () {
                    var value = this.value();
                    var dp = $("#ct_end").data("kendoDateTimePicker");
                    dp.min(value);
                    dp = $("#ct_warehouse").data("kendoDateTimePicker");
                    dp.min(value);
                }
            });
            $("#ct_end").kendoDateTimePicker({ format: "dd/MM/yyyy hh:mm tt", });
            $("#ct_warehouse").kendoDateTimePicker({ format: "dd/MM/yyyy hh:mm tt", });
        });
    }

    function SaveProTime() {
        var obj = {
            Id: $('#ct_Id').val(),
            CL_Pro_Id: $('#ct_Id').attr('c_Id'),
            Name: $('#ct_Name').val(),
            StartDate: $("#ct_start").data("kendoDateTimePicker").value(),
            EndDate: $("#ct_end").data("kendoDateTimePicker").value(),
            Warehouse_InputDate: $("#ct_warehouse").val() == '' ? null : $("#ct_warehouse").data("kendoDateTimePicker").value(),
            Quantity_KH: $('#ct_quantity_kh').val(),
            Quantity_TT: $('#ct_quantity_tt').val(),
            Note: $('#ct_Des').val(),
            ObjectId:Global.Data.OrderDetailId
        }
        $.ajax({
            url: Global.UrlAction.SaveProTime,
            type: 'post',
            data: ko.toJSON(obj),
            contentType: 'application/json',
            beforeSend: function () { $('#loading').show(); },
            success: function (result) {
                $('#loading').hide();
                GlobalCommon.CallbackProcess(result, function () {
                    if (result.Result == "OK") {
                        GetAll($('#month').val(), $('#year').val());
                        $("#" + Global.Element.PopupProductTime + ' button[cancel]').click();
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

    function Bind_Pro_Time(ParentId, childId, subChildId) {
        $.each(Global.Data.Projects, function (i, item) {
            if (item.Id == ParentId) {
                $.each(item.Products, function (ii, subItem) {
                    if (subItem.Id == childId) {
                        $.each(subItem.ProductTimes, function (ii, ChildItem) {
                            if (ChildItem.Id == subChildId) {
                                Global.Data.isProductionProject = subItem.IsProductionProject;
                                $('#' + Global.Element.PopupProductTime).modal('show');
                                $('#ct_Id').val(ChildItem.Id);
                                $('#ct_Id').attr('c_id', ChildItem.CL_Id);
                                $('#ct_quantity_kh').val(ChildItem.Quantity_KH);
                                $('#ct_quantity_tt').val(ChildItem.Quantity_TT);
                                $('#ct_Des').val(ChildItem.Note);
                                $('#ct_Name').val(ChildItem.Name);

                                var startdate = new Date(parseJsonDateToDate(ChildItem.StartDate));
                                var enddate = new Date(parseJsonDateToDate(ChildItem.EndDate));
                                var startCtr = $("#ct_start").data("kendoDateTimePicker");
                                startCtr.value(kendo.toString(startdate, 'dd/MM/yyyy hh:mm tt'));
                                startCtr.max(kendo.toString(enddate, 'dd/MM/yyyy hh:mm tt'));

                                var endCtr = $("#ct_end").data("kendoDateTimePicker");
                                endCtr.value(kendo.toString(enddate, 'dd/MM/yyyy hh:mm tt'));
                                endCtr.max(kendo.toString(enddate, 'dd/MM/yyyy hh:mm tt'));
                                endCtr.min(kendo.toString(startdate, 'dd/MM/yyyy hh:mm tt'));

                                if (ChildItem.Warehouse_InputDate != null && typeof (ChildItem.Warehouse_InputDate) != 'undefined') {
                                    var whDate = new Date(parseJsonDateToDate(ChildItem.Warehouse_InputDate));
                                    var whCtr = $("#ct_warehouse").data("kendoDateTimePicker");
                                    whCtr.value(kendo.toString(whDate, 'dd/MM/yyyy hh:mm tt'));
                                    whCtr.max(kendo.toString(whDate, 'dd/MM/yyyy hh:mm tt'));
                                    whCtr.min(kendo.toString(startdate, 'dd/MM/yyyy hh:mm tt'));
                                    endCtr.max(kendo.toString(whDate, 'dd/MM/yyyy hh:mm tt'));
                                    startCtr.max(kendo.toString(whDate, 'dd/MM/yyyy hh:mm tt'));
                                }
                                else
                                    $("#ct_warehouse").val('');
                                startCtr.trigger("change");
                                endCtr.trigger("change");
                                whCtr.trigger("change");
                                return false;
                            }
                        });
                        return false;
                    }
                });
                return false;
            }
        });
    }

    function DeleteProTime(Id) {
        $.ajax({
            url: Global.UrlAction.DeleteProTime,
            type: 'POST',
            data: JSON.stringify({ 'Id': Id }),
            contentType: 'application/json charset=utf-8',
            success: function (data) {
                GlobalCommon.CallbackProcess(data, function () {
                    if (data.Result == "OK")
                        GetAll($('#month').val(), $('#year').val());
                    else
                        GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình sử lý.");
                }, false, Global.Element.PopupOrder, true, true, function () {

                    var msg = GlobalCommon.GetErrorMessage(data);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
                });
            }
        });
    }

    function CheckValidate() {
        if ($('#name').val() == "") {
            GlobalCommon.ShowMessageDialog("Vui lòng nhập tên Công Việc.", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        else if ($('#index').val() == "") {
            GlobalCommon.ShowMessageDialog("Vui lòng nhập số thứ tự hiển thị.", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        return true;
    }

    function InitPopupCopy() {
        $("#" + Global.Element.CopyPopup).modal({
            keyboard: false,
            show: false
        });

        $("#" + Global.Element.CopyPopup + ' button[save]').click(function () {
            Copy();
        });

        $("#" + Global.Element.CopyPopup + ' button[cancel]').click(function () {
            $("#" + Global.Element.CopyPopup).modal("hide");
            $('#copy_Id').val(0);
            $('#protimeCopy').val('');
            $('#copy_start').val('');
        });
    }

    function Copy() {
        $.ajax({
            url: Global.UrlAction.Copy,
            type: 'post',
            data: JSON.stringify({ 'Id': $('#copy_Id').val(), 'Name': $('#protimeCopy').val(), 'Start': $("#copy_start").data("kendoDatePicker").value() }),
            contentType: 'application/json',
            beforeSend: function () { $('#loading').show(); },
            success: function (result) {
                $('#loading').hide();
                GlobalCommon.CallbackProcess(result, function () {
                    if (result.Result == "OK") {
                        $("#" + Global.Element.CopyPopup + ' button[cancel]').click();
                        $('[btnSearch]').click();
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

    function InitListOrder() {
        $('#' + Global.Element.JtableOrder).jtable({
            title: 'Danh Sách Đơn Hàng',
            paging: true,
            pageSize: 25,
            pageSizeChange: true,
            sorting: true,
            selectShow: true,
            selecting: true, //Enable selecting
            multiselect: true, //Allow multiple selecting
            selectingCheckboxes: true, //Show checkboxes on first column
            actions: {
                listAction: Global.UrlAction.GetListOrder,
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
                OrderName: {
                    visibility: 'fixed',
                    title: "Đơn hàng",
                    width: "15%",
                    display: function (data) {
                        var txt = '<span class="blue">' + data.record.OrderName + '</span>';
                        return txt;
                    }
                },
                CustomerName: {
                    title: "Khách Hàng",
                    width: " 10%",
                    display: function (data) {
                        var txt = '<span class="blue">' + data.record.CustomerName + '</span>';
                        return txt;
                    }
                },
                MaterialId: {
                    title: "Sản phẩm",
                    width: "50%",
                    display: function (data) {
                        var found = {};
                        $.each(Global.Data.ProSettingSRC, function (i, item) {
                            if (item.Value == data.record.MaterialId) {
                                found = item;
                                return false;
                            }
                        });

                        var txt = $('<span  >' + found.Name + '</span>');
                        return txt;
                    }
                },
                Quantity: {
                    title: 'Số Lượng',
                    width: '5%',
                    display: function (data) {
                        var txt = '<span class="red">' + ParseStringToCurrency(data.record.Quantity) + '</span>';
                        return txt;
                    }
                },
                Price: {
                    title: 'Đơn Giá',
                    width: '5%',
                    display: function (data) {
                        var txt = '<span class="red">' + ParseStringToCurrency(data.record.Price) + '</span>';
                        return txt;
                    }
                },
                PriceCM: {
                    title: 'Đơn Giá CM',
                    width: '5%',
                    display: function (data) {
                        var txt = '<span class="red">' + ParseStringToCurrency(data.record.PriceCM) + '</span>';
                        return txt;
                    }
                },
                total: {
                    title: 'Tổng Tiền',
                    width: '5%',
                    sorting: false,
                    display: function (data) {
                        var txt = '<span class="bold red">' + ParseStringToCurrency(Math.round((data.record.Price * data.record.Quantity) * 1000) / 1000) + '</span>';
                        return txt;
                    }
                },
                DeliveryDate: {
                    title: 'Ngày Giao',
                    width: "7%",
                    display: function (data) {
                        var txt = '<span class="bold red">' + ParseDateToString(parseJsonDateToDate(data.record.DeliveryDate)) + '</span>';
                        return txt;
                    }
                },
                Note: {
                    title: "Ghi chú",
                    width: "15%",
                    sorting: false,
                }
            },
            selectionChanged: function () {
                var $selectedRows = $('#' + Global.Element.JtableOrder).jtable('selectedRows');
                $('#SelectedRowList').empty();
                if ($selectedRows.length > 0) {
                    $selectedRows.each(function () {
                        var record = $(this).data('record');
                        var des = ('Đơn hàng : ' + record.OrderName + ' | ' + 'Khách hàng :' + record.CustomerName + ' | ' + 'Số lượng :' + record.Quantity + ' | ' + 'Ngày giao hàng :' + ParseDateToString(parseJsonDateToDate(record.DeliveryDate)));
                        $('#ct_Des').val(des);
                        $('#ct_quantity_kh,#ct_quantity_tt').val(record.Quantity);

                        var date = new Date(parseJsonDateToDate(record.DeliveryDate));
                        var start = $("#ct_start").data("kendoDateTimePicker");
                        var end = $("#ct_end").data("kendoDateTimePicker");
                        var remin = $("#ct_warehouse").data("kendoDateTimePicker");
                        start.value(kendo.toString(date, 'dd/MM/yyyy hh:mm tt'));
                        start.max(kendo.toString(date, 'dd/MM/yyyy hh:mm tt'));
                        remin.max(kendo.toString(date, 'dd/MM/yyyy hh:mm tt'));
                        remin.value(kendo.toString(date, 'dd/MM/yyyy hh:mm tt'));
                        end.max(kendo.toString(date, 'dd/MM/yyyy hh:mm tt'));
                        end.value(kendo.toString(date, 'dd/MM/yyyy hh:mm tt'));
                        end.trigger("change");
                        Global.Data.OrderDetailId = record.Id;
                    });
                    $("#" + Global.Element.Popup_choose_order + ' button[cancel]').click();
                }
            },
        });
    }
    function ReloadListOrder() {
        $('#' + Global.Element.JtableOrder).jtable('load', { 'materialId': Global.Data.MaterialId });
    }
    function InitPopupOrder() {
        $("#" + Global.Element.Popup_choose_order).modal({
            keyboard: false,
            show: false
        });

        $("#" + Global.Element.Popup_choose_order + ' button[cancel]').click(function () {
            $("#" + Global.Element.Popup_choose_order).modal("hide");
            var $r = $('#' + Global.Element.JtableOrder).find('.jtable-data-row')
            var record = $(this).data('record');
            $.each($r, function (i, record) {
                $r.removeClass('jtable-row-selected ui-state-highlight');
                $r.find('>td.jtable-selecting-column >input').prop('checked', false);
            });
        });
    }



}




