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
GPRO.namespace('LaborDivision');
GPRO.LaborDivision = function () {
    var Global = {
        UrlAction: {

            CreateLaborDivisionVersion: '/LaborDivision/Create/' + $('#order').attr('option') + '/' + $('#order').val() + '/' + $('#order').attr('line') + '/' + $('#order').attr('cus') + '/' + $('#order').attr('commo'),
            ActiveVersion: '/LaborDivision/ActiveLaborDivisionVersion',

            DrawImage: '/LaborDivision/Draw/',

            GetListTechProcessVerDetail: '/TechnologyProcess/GetTechProcessVersionDetail',


            Gets: '/ProAna/Gets_TKC',
            GetById: '/ProAna/GetTKCById',
            GetTech: '/ProAna/GetTech',
            Save: '/ProAna/SaveTKC',
            ExportExcel: '/ProAna/ExportDiagramToExcel',
            Delete: '/ProAna/DeleteTKC',
        },
        Element: {
            Jtable: 'jtable_tkc',
            Popup: 'popup_tkc',
            Popup_position: 'tkc_popup_position',
            JtablePhase_Arr: 'Jtable_tkc_Phase',
        },
        Data: {
            LineEmployeeArr: [],
            TechProcessVerDetailArray: [],
            Position_Arr: [],
            EmployeeArr: [],
            Phase_Arr: [],
            PhaseList: [],
            TechProVerId: 0,
            CodeOption: '',
            NameOption: '',
            Code: [],
            Name: [],
            BasePhases: []
        }
    }
    this.GetGlobal = function () {
        return Global;
    }

    this.Init = function () {
        RegisterEvent();
        InitList();
        InitListPhase_Arr();
        GetEmployeeWithSkill('tkc_Employee');
    }

    this.insert_Exit = function (id) {
        insert_Exit(id);
    }

    this.insert_BTP = function (id) {
        insert_BTP(id);
    }

    this.delete_Po = function (id) {
        delete_Po(parseInt(id));
    }

    this.ChooseEmployee = function (id) {
        ChooseEmployee(id);
    }
    this.ChangeIndex = function (id) {
        ChangePositionIndex(id);
    }


    var RegisterEvent = function () {
        // tao line
        $('#tkc_sl_line').change(function () {
            if ($('#tkc_sl_line').val() != '') {
                Draw_LinePosition(parseInt($('#tkc_sl_line').val()));
                $('#tkc_sl_line').prop('disabled', true);
                if (parseInt($('#tkc_sl_line').val()) % 2 != 0)
                    $('#tkc_sl_line').val((parseInt($('#tkc_sl_line').val()) + 1))
            }
        });

        $('[re_line_tkc]').click(function () {
            GetLineSelect('tkc_lineName', parseInt($('#jtable_tkc').attr('wkId')));
            $('#tkc_lineName').change();
        });

        $('#tkc_lineName').change(function () {
            var _option = $('#tkc_lineName').children('option:selected');
            $('#workers').html(_option.attr('labours'));
        });

        $('[re_employ_tkc]').click(function () {
            GetEmployeeWithSkill('tkc_Employee');
        });

        $('#jtable_tkc').change(function () {
            GetTech();
            GetLineSelect('tkc_lineName', parseInt($('#jtable_tkc').attr('wkId')));
            ReloadList();
        });

        $('[add_row]').click(function () {
            if (Global.Data.Position_Arr.length == 0) {
                Draw_Position(1, 2);
                $('#tkc_sl_line').val(2);
            }
            else {
                var last = Global.Data.Position_Arr[Global.Data.Position_Arr.length - 1].OrderIndex;
                Draw_Position(last + 1, last + 2);
                $('#tkc_sl_line').val(parseInt($('#tkc_sl_line').val()) + 2);
            }
            $('#tkc_sl_line').prop('disabled', true);
        });

        $('#' + Global.Element.Popup_position).on('shown.bs.modal', function () {
            $('#' + Global.Element.Popup).hide();
            $('div.divParent').attr('currentPoppup', Global.Element.Popup_position.toUpperCase());

        });

        $('[cancel_tkc_po]').click(function () {
            $('#' + Global.Element.Popup).show();
            $('div.divParent').attr('currentPoppup', Global.Element.Jtable.toUpperCase());
        });

        $('[save_tkc_po]').click(function () {
            // neu co cai cũ thi trả lai gia tri cũ truoc khi them mới
            if (Global.Data.Position_Arr[Global.Data.Index - 1].Details.length > 0 && Global.Data.Phase_Arr.length > 1) {
                $.each(Global.Data.Position_Arr[Global.Data.Index - 1].Details, function (i, item) {
                    $.each(Global.Data.PhaseList, function (ii, phase) {
                        if (phase.Id == item.TechProVerDe_Id) {
                            phase.De_Percent = item.DevisionPercent > phase.De_Percent ? item.DevisionPercent - phase.De_Percent : phase.De_Percent - item.DevisionPercent;
                            return false;
                        }
                    });
                });
            }

            Global.Data.Position_Arr[Global.Data.Index - 1].Details.length = 0;
            $.each(Global.Data.Phase_Arr, function (i, item) {
                item.DevisionPercent = item.DevisionPercent_Temp;
                Global.Data.Position_Arr[Global.Data.Index - 1].Details.push(item);
                $.each(Global.Data.PhaseList, function (ii, phase) {
                    if (phase.Id == item.TechProVerDe_Id) {
                        phase.De_Percent += item.DevisionPercent_Temp;
                        phase.De_Percent = phase.De_Percent > 100 ? 100 : phase.De_Percent;
                        return false;
                    }
                });
            });

            if ($('#tkc_Employee').val() != 0) {
                Global.Data.Position_Arr[Global.Data.Index - 1].EmployeeId = parseInt($('#tkc_Employee').val());
                Global.Data.Position_Arr[Global.Data.Index - 1].EmployeeName = $('#tkc_Employee option:selected').text();
            }
            $('[cancel_tkc_po]').click();
            Add_PhaseIntoPosition();
        });

        $('[cancel_tkc_po]').click(function () {
            Global.Data.Phase_Arr.length = 0;
            $('#' + Global.Element.PopupChoose).modal('hide');
            $('#tkc_Employee').val(0);
            $('div.divParent').attr('currentPoppup', Global.Element.Popup.toUpperCase());
        });

        $('#' + Global.Element.Popup).on('shown.bs.modal', function () {
            $('div.divParent').attr('currentPoppup', Global.Element.Popup.toUpperCase());
            $('#tkc_lineName').change();
        });

        $('[tkc_save]').click(function () {
            if ($('#tkc_sl_line').val().trim() == "" || parseInt($('#tkc_sl_line').val()) == 0) {
                GlobalCommon.ShowMessageDialog("Vui lòng nhập số lượng vị trí phân công.", function () { }, "Lỗi Nhập liệu");
                return false;
            }
            var obj = {
                Id: ($('#tkc_id').val() == '' ? 0 : $('#tkc_id').val()),
                ParentId: $('#jtable_tkc').attr('pId'),
                TechProVer_Id: Global.Data.TechProVerId,
                LineId: $('#tkc_lineName').val(),
                TotalPosition: $('#tkc_sl_line').val(),
                Positions: Global.Data.Position_Arr,
            }
            SaveDiagram(obj);
        });

        $('[tkc_cancel]').click(function () {
            $('#tkc_id').val(0);
            $('#tkc_sl_line').val(0);
            $('#tkc_sl_line').prop('disabled', false);
            $('#tkc_des').val(0);
            Global.Data.Position_Arr.length = 0;
            $('#line-box').empty();

            Global.Data.PhaseList.length = 0;
            $.each(Global.Data.BasePhases, function (i, item) {
                var obj = {
                    Id: item.Id,
                    TechProcessVersionId: item.TechProcessVersionId,
                    OrderIndex: item.OrderIndex,
                    PhaseCode: item.PhaseCode,
                    PhaseName: item.PhaseName,
                    StandardTMU: item.StandardTMU,
                    Percent: item.Percent,
                    TimeByPercent: item.TimeByPercent,
                    Worker: item.Worker,
                    Description: item.Description,
                    EquipmentCode: item.EquipmentCode,
                    TotalTMU: item.TotalTMU,
                    SkillRequired: item.SkillRequired,
                    PhaseGroupId: item.PhaseGroupId,
                    De_Percent: 0
                }
                Global.Data.PhaseList.push(obj);
            });
            $('div.divParent').attr('currentPoppup', '');
        });

        $('.but_new_box').click(function () {
            if ($('.new_box').css('display') == 'none') {
                $('.new_box').delay(10).fadeIn();
                $('.but_new_box i').removeClass('fa-angle-double-right').addClass('fa-angle-double-left');
            }
            else {
                $('.new_box').hide();
                $('.but_new_box i').removeClass('fa-angle-double-left').addClass('fa-angle-double-right');
            }
        });

        $('.tech-info-box-but').click(function () {
            if ($('.tech-info-box-main').css('display') == 'none') {
                $('.tech-info-box-main').delay(10).fadeIn();
                $('.tech-info-box-but i').removeClass('fa-angle-double-right').addClass('fa-angle-double-left');
            }
            else {
                $('.tech-info-box-main').hide();
                $('.tech-info-box-but i').removeClass('fa-angle-double-left').addClass('fa-angle-double-right');
            }
        });

    }


    //---------------------------------------------------------------------------------------
    function InitList() {
        $('#' + Global.Element.Jtable).jtable({
            title: 'Danh sách thiết kế chuyền',
            paging: true,
            pageSize: 1000,
            pageSizeChange: true,
            sorting: true,
            selectShow: true,
            actions: {
                listAction: Global.UrlAction.Gets,
                createAction: Global.Element.Popup,
            },
            messages: {
                selectShow: 'Ẩn hiện cột',
                addNewRecord: 'Thêm mới',
            },
            fields: {
                Id: {
                    key: true,
                    create: false,
                    edit: false,
                    list: false
                },
                LineName: {
                    title: 'Chuyền',
                    width: '7%',
                    edit: false,
                },
                TotalPosition: {
                    title: 'Tổng Vị Trí',
                    width: '7%',
                    edit: false,
                    display: function (data) {
                        var txt = '<span class="red bold">' + data.record.TotalPosition + '</span> Vị Trí.';
                        return txt;
                    }
                },
                LastEditer: {
                    title: 'Cập nhật cuối',
                    width: '7%',
                    edit: false,
                },
                LastEditTime: {
                    title: 'Giờ cập nhật',
                    width: '7%',
                    edit: false,
                    display: function (data) {
                        if (data.record.LastEditTime != null && typeof (data.record.LastEditTime)) {
                            txt = '<span class="bold red">' + ParseDateToString_cl(parseJsonDateToDate(data.record.LastEditTime)) + '</span>';
                            return txt;
                        }
                    }
                },
                excel: {
                    title: '',
                    width: '1%',
                    sorting: false,
                    display: function (data) {
                        var text = $('<i   title="Xuất file Excel" class="fa fa-file-excel-o clickable blue"  ></i>');
                        text.click(function () {
                            window.location.href = Global.UrlAction.ExportExcel + '/' + data.record.Id;
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
                            GetLaborDivisionDiagramById(data.record.Id);
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
        $('#' + Global.Element.Jtable).jtable('load', { 'parentId': $('#jtable_tkc').attr('pId') });
      //  if (Global.Data.TechProVerId == null || Global.Data.TechProVerId == 0)
      //      GlobalCommon.ShowMessageDialog('Quy trình công nghệ chưa được tạo. Bạn cần phải lưu quy trình công nghệ trước rồi mới có thể tạo thiết kế chuyền được !.', function () { }, "Lỗi thao tác");

    }


    function Delete(Id) {
        $.ajax({
            url: Global.UrlAction.Delete,
            type: 'POST',
            data: JSON.stringify({ 'Id': Id }),
            contentType: 'application/json charset=utf-8',
            success: function (data) {
                GlobalCommon.CallbackProcess(data, function () {
                    if (data.Result == "OK") {
                        ReloadList();
                    }
                    else
                        GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình xử lý.");
                }, false, Global.Element.PopupSize, true, true, function () {

                    var msg = GlobalCommon.GetErrorMessage(data);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
                });
            }
        });
    }











    function GetTech(node) {
        $.ajax({
            url: Global.UrlAction.GetTech,
            type: 'post',
            data: JSON.stringify({ 'parentId': (parseInt($('#' + Global.Element.Jtable).attr('parentid')) - 1), 'node': $('#' + Global.Element.Jtable).attr('node') }),
            contentType: 'application/json',
            beforeSend: function () { $('#loading').show(); },
            success: function (result) {
                $('#loading').hide();
                GlobalCommon.CallbackProcess(result, function () {
                    if (result.Result == "OK") {
                        Global.Data.TechProVerId = result.Data.Id;

                        if (result.Data.details != null && result.Data.details.length > 0) {
                            $('#time-per-commo').html(Math.round(result.Data.TimeCompletePerCommo));
                            $('#pro-per-person').html(Math.round(result.Data.ProOfPersonPerDay));
                            $('#pro-group-per-hour').html(Math.round(result.Data.ProOfGroupPerHour));
                            $('#pro-group-per-day').html(Math.round(result.Data.ProOfGroupPerDay));
                            $('#paced-product').html(Math.round(result.Data.PacedProduction));
                            $('#workers').html(result.Data.NumberOfWorkers);
                            $('#time-per-day').html(result.Data.WorkingTimePerDay);
                            $('#note').html(result.Data.Note);

                            var option = '';
                            var code_option = '';
                            $.each(result.Data.details, function (i, item) {
                                var obj = {
                                    Id: item.Id,
                                    TechProcessVersionId: item.TechProcessVersionId,
                                    OrderIndex: item.OrderIndex,
                                    PhaseCode: item.PhaseCode,
                                    PhaseName: item.PhaseName,
                                    StandardTMU: item.StandardTMU,
                                    Percent: item.Percent,
                                    TimeByPercent: item.TimeByPercent,
                                    Worker: item.Worker,
                                    Description: item.Description,
                                    EquipmentCode: item.EquipmentCode,
                                    TotalTMU: item.TotalTMU,
                                    SkillRequired: item.SkillRequired,
                                    PhaseGroupId: item.PhaseGroupId,
                                    Index: item.Index,
                                    De_Percent: 0
                                }
                                Global.Data.TechProcessVerDetailArray.push(obj);
                                Global.Data.PhaseList.push(obj);
                                Global.Data.BasePhases.push(obj);
                                option += '<option value="' + item.PhaseName + '" /> ';
                                code_option += '<option value="' + (item.PhaseCode.trim() + ' (' + item.PhaseName + ')') + '" /> ';
                            });
                            $('#autoCompleteSource').append(option);
                            $('#autoCompleteSource_Code').append(code_option);
                        }
                        else {
                            //GlobalCommon.ShowMessageDialog("Mã hàng này chưa có quy trình công nghệ không thể thiết kế chuyền được. Vui lòng tạo quy trình công nghệ trước.", function () { }, 'Thông báo');
                            $('#' + Global.Element.Jtable).hide();
                        }
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

    /************************************************************************************************************/
    function Draw_LinePosition(positions) {
        if (positions != 0) {
            positions = positions % 2 == 0 ? positions : positions + 1;
            if (positions > 0) {
                for (var i = 1, y = i + 1; i <= positions; i += 2, y += 2) {
                    Draw_Position(i, y);
                }
            }
        }
    }

    function Draw_Position(i, y) {
        var str = '';
        str += '<div id="row_' + i + '" class="line-box" >';
        str += '  <div id="' + i + '" class="line-left">';
        str += '      <div class="child">';
        str += '          <div title="Click Tạo Lối Đi ở Vị Trí này." style="width: 22px;float: left;"><div class="insert-exit" onclick="insert_Exit(\'' + i + '\')"></div>';
        str += '          <div title="Click Tạo đường vào BTP ở Vị Trí này." class="insert-btp" onclick="insert_BTP(\'' + i + '\')"></div> ';
        str += '          <div title="Click Xóa Vị Trí." class="delete" onclick="delete_Po(\'' + i + '\')"></div></div>';
        str += '          <div class="main-info c-left" >';
        str += '              <div  class="line-child-box">';
        str += '              <div class="top"> ';
        str += '                  <div id="phase"></div>';
        str += '                  <div style="clear: both"></div>';
        str += '              </div>';
        str += '             <div><div class="col-md-1"><input type="text" linePo_' + i + ' onchange="ChangeIndex(' + i + ')" value="' + i + '"/></div><div class="col-md-11 bottom bold red" style="background-image: linear-gradient( rgb(247, 234, 236),rgb(255, 236, 239),rgb(255, 236, 239)) !important" onclick="ChooseEmployee(\'' + i + '\')" data-toggle="modal" list="autoCompleteSource" data-target="#' + Global.Element.Popup_position + '">Chọn Nhân Viên ...</div><div class="clearfix"></div></div>';
        str += '          </div>';
        str += '      </div>';
        str += '      <div class="equipment" ><div ></div></div>';
        str += '      <div style="clear: left"></div>';
        str += '      <div class="exit e-left" style="background-image: linear-gradient( #0000FF,#0000FF,#0000FF) !important;">Lối Đi</div>';
        str += '  </div>';
        str += '  </div>';
        str += '  <div class="line-center" style ="background-image: linear-gradient( #FFD700,#FFD700,#FFD700) !important;' + (i == 0 ? "border-top:1px solid #ccc" : "") + '' + (i == 8 ? "border-bottom:1px solid #ccc" : "") + '"></div>';
        str += '      <div id="' + y + '" class="line-right">';
        str += '          <div class="child">';
        str += '              <div class="equipment"><div style="transform:rotate(-90deg); -webkit-transform:rotate(-90deg); -ms-transform:rotate(-90deg); max-width:50px"></div></div>';
        str += '              <div class="main-info c-right"  >';
        str += '                  <div id="' + y + '" class="line-child-box">';
        str += '                  <div class="top"> ';
        str += '                      <div id="phase"></div>';
        str += '                      <div style="clear: both"></div>';
        str += '                  </div>';
        str += '                  <div><div class="col-md-1"><input type="text" linePo_' + y + ' onchange="ChangeIndex(' + y + ')" value="' + y + '"/></div><div class="col-md-11 bottom bold red" style="background-image: linear-gradient( rgb(247, 234, 236),rgb(255, 236, 239),rgb(255, 236, 239)) !important ;" onclick="ChooseEmployee(\'' + y + '\')" data-toggle="modal" data-target="#' + Global.Element.Popup_position + '">Chọn Nhân Viên ...</div><div class="clearfix"></div></div>';
        str += '              </div>';
        str += '          </div>';
        str += '          <div title="Click Tạo đường vào BTP ở Vị Trí này." class="insert-btp" onclick="insert_BTP(\'' + y + '\')"></div>';
        str += '          <div style="clear: left"></div>';
        str += '          <div class="exit e-right" style="background-image: linear-gradient( #0000FF,#0000FF,#0000FF) !important;">Lối Đi</div>';
        str += '      </div>';
        str += '  </div>';
        str += '  <div style="clear: left"></div>';
        str += '</div>';

        var obj = {
            Id: 0,
            TechProVer_Id: parseInt($('#url').attr('TechProVerId')),
            OrderIndex: i,
            EmployeeId: null,
            EmployeeName: '',
            IsHasExitLine: false,
            IsHasBTP: false,
            Details: []
        }
        Global.Data.Position_Arr.push(obj);
        obj = {
            Id: 0,
            TechProVer_Id: parseInt($('#url').attr('TechProVerId')),
            OrderIndex: y,
            EmployeeId: null,
            EmployeeName: '',
            IsHasExitLine: false,
            IsHasBTP: false,
            Details: []
        }
        Global.Data.Position_Arr.push(obj);

        $('#line-box').html(str + $('#line-box').html());

    }

    //draw with detail
    function DrawLinePositionWidthDetail(positions, details) {
        Global.Data.Position_Arr.length = 0;
        $('#line-box').empty();
        if (positions.length > 0) {
            rows = (positions.length - 1) % 2 == 0 ? (positions.length - 1) / 2 : parseInt((positions.length - 1) / 2) + 1;
            str_left = '';
            str_right = '';
            str = '';

            if (rows > 0) {
                for (var i = 1, y = i + 1; i <= positions.length; i += 2, y += 2) {
                    var ul = '';
                    var equip = '';
                    var tongtmu = 0;
                    var numOfLabor = 0;
                    var tb2 = '';
                    var BTP = false;
                    str = '';
                    $.each(positions, function (index, LinePosition) {
                        if (LinePosition.OrderIndex == i) {
                            ul += '<table>';
                            tb2 += '<table style="width:100%"><tr>';
                            var flag = false;
                            var EQUIP = [];
                            $.each(LinePosition.Details, function (iii, detail) {
                                $.each(Global.Data.PhaseList, function (ii, phase) {
                                    if (detail.TechProVerDe_Id == phase.Id) {
                                        phase.De_Percent += detail.DevisionPercent;

                                        ul += '<tr>';
                                        ul += '<td class="code">' + phase.PhaseCode + '</td>';
                                        ul += '<td class="pname">' + phase.PhaseName + '</td>';
                                        ul += '<td class="tmu">' + Math.round(phase.TimeByPercent) + '</td>';
                                        ul += '<td class="per blue">' + detail.DevisionPercent + '</td>';
                                        ul += '<td class="labor red">' + Math.round(detail.NumberOfLabor * 10) / 10 + '</td>';
                                        ul += '</tr>';
                                        if (EQUIP.length > 0) {
                                            $.each(EQUIP, function (e, E) {
                                                if (E == phase.EquipmentCode) {
                                                    flag = true;
                                                    return false;
                                                }
                                            });
                                            if (!flag && phase.EquipmentCode != null) {
                                                equip += phase.EquipmentCode + '<br/>';
                                                EQUIP.push(phase.EquipmentCode);
                                            }
                                        }
                                        else {
                                            if (phase.EquipmentCode != '') {
                                                EQUIP.push(phase.EquipmentCode);
                                                equip += phase.EquipmentCode + '<br/>';
                                            }
                                        }
                                        tongtmu += phase.TimeByPercent;
                                        numOfLabor += detail.NumberOfLabor;
                                        return false;
                                    }
                                });
                            });
                            // add empty object detail
                            var obj = {
                                Id: 0,
                                Line_PositionId: LinePosition.Id,
                                IsPass: false,
                                TechProVerDe_Id: 0,
                                PhaseCode: '',
                                PhaseName: '',
                                EquipmentId: 0,
                                EquipmentCode: '',
                                TotalTMU: 0,
                                PhaseGroupId: 0,
                                SkillRequired: 0,
                                TotalLabor: 0,
                                DevisionPercent: 0,
                                DevisionPercent_Temp: 0,
                                NumberOfLabor: 0,
                                Note: '',
                                OrderIndex: LinePosition.Details.length + 1,
                            }
                            LinePosition.Details.push(obj);
                            var name = LinePosition.EmployeeName + '' == 'null' ? '...  Chọn  Nhân Viên  ...' : LinePosition.EmployeeName;
                            ul += '</table>';
                            tb2 += '<td class="pname" style="width:75%">' + name + '</td>';
                            tb2 += '<td class="tmu" style="width:12%;">' + Math.round(tongtmu) + '</td>';
                            tb2 += '<td class="labor" style="width:12%; border-right:none">' + Math.round(numOfLabor * 10) / 10 + '</td>';
                            tb2 += '</tr></table>';

                            if (LinePosition.IsHasBTP)
                                BTP = true;
                            Global.Data.Position_Arr.push({
                                Id: LinePosition.Id,
                                TechProVer_Id: LinePosition.TechProVer_Id,
                                OrderIndex: LinePosition.OrderIndex,
                                EmployeeId: LinePosition.EmployeeId,
                                EmployeeName: LinePosition.EmployeeName,
                                IsHasExitLine: LinePosition.IsHasExitLine,
                                IsHasBTP: LinePosition.IsHasBTP,
                                Details: LinePosition.Details
                            });
                            return false;
                        }
                    });
                    if (ul == '' && tb2 == '') {
                        tb2 = 'Chọn Nhân Viên ...';
                    }
                    str += '<div id="row_' + i + '" class="line-box" style ="' + (i == 0 ? "margin-top:20px" : "") + '">';
                    str += '  <div id="' + i + '" class="line-left">';
                    str += '      <div class="child">';
                    str += '         <div title="Click Tạo Lối Đi ở Vị Trí này." style="width: 22px;float: left;"> <div class="insert-exit" onclick=insert_Exit(\'' + i + '\')></div>';
                    str += '          <div title="Click Tạo đường vào BTP ở Vị Trí này." class="insert-btp ' + (BTP ? "insert-hover" : "") + '" onclick=insert_BTP(\'' + i + '\')></div>';
                    str += '          <div title="Click Xóa Vị Trí." class="delete" onclick="delete_Po(\'' + i + '\')"></div></div>';
                    str += '          <div class="main-info c-left" >';
                    str += '              <div  class="line-child-box">';
                    str += '              <div class="top"> ';
                    str += '                  <div id="phase">' + ul + '</div>';
                    str += '                  <div style="clear: both"></div>';
                    str += '              </div>';
                    str += '              <div><div class="col-md-1"><input type="text" linePo_' + i + ' onchange="ChangeIndex(' + i + ')" value="' + i + '"/></div><div class="col-md-11 bottom bold red" style="background-image: linear-gradient( rgb(247, 234, 236),rgb(255, 236, 239),rgb(255, 236, 239)) !important" onclick="ChooseEmployee(\'' + i + '\')" data-toggle="modal" list="autoCompleteSource" data-target="#' + Global.Element.Popup_position + '">' + tb2 + '</div><div class="clearfix"></div></div>';
                    str += '          </div>';
                    str += '      </div>';
                    str += '      <div class="equipment" ><div style="transform:rotate(-90deg); -webkit-transform:rotate(-90deg); -ms-transform:rotate(-90deg); max-width:50px ">' + equip + '</div></div>';
                    str += '      <div style="clear: left"></div>';
                    str += '      <div class="exit e-left" style="background-image: linear-gradient( #0000FF,#0000FF,#0000FF) !important;">Lối Đi</div>';
                    str += '  </div>';
                    str += '  </div>';
                    var ul = '';
                    var equip = '';
                    var tongtmu = 0;
                    var numOfLabor = 0;
                    var tb2 = '';
                    var BTP = false;
                    $.each(positions, function (index, LinePosition) {
                        if (LinePosition.OrderIndex == y) {
                            ul += '<table>';
                            tb2 += '<table style="width:100%"><tr>';
                            var flag = false;
                            var EQUIP = [];
                            $.each(LinePosition.Details, function (iii, detail) {
                                $.each(Global.Data.PhaseList, function (ii, phase) {
                                    if (detail.TechProVerDe_Id == phase.Id) {
                                        phase.De_Percent += detail.DevisionPercent;

                                        ul += '<tr>';
                                        ul += '<td class="code">' + phase.PhaseCode + '</td>';
                                        ul += '<td class="pname">' + phase.PhaseName + '</td>';
                                        ul += '<td class="tmu">' + Math.round(phase.TimeByPercent) + '</td>';
                                        ul += '<td class="per blue">' + detail.DevisionPercent + '</td>';
                                        ul += '<td class="labor red">' + Math.round(detail.NumberOfLabor * 10) / 10 + '</td>';
                                        ul += '</tr>';

                                        if (EQUIP.length > 0) {
                                            $.each(EQUIP, function (e, E) {
                                                if (E == phase.EquipmentCode) {
                                                    flag = true;
                                                    return false;
                                                }
                                            });
                                            if (!flag && phase.EquipmentCode != null) {
                                                equip += phase.EquipmentCode + '<br/>';
                                                EQUIP.push(phase.EquipmentCode);
                                            }
                                        }
                                        else {
                                            EQUIP.push(phase.EquipmentCode);
                                            equip += phase.EquipmentCode + '<br/>';
                                        }
                                        tongtmu += phase.TimeByPercent;
                                        numOfLabor += detail.NumberOfLabor;
                                        return false;
                                    }
                                });
                            });
                            // add empty object detail
                            var obj = {
                                Id: 0,
                                Line_PositionId: LinePosition.Id,
                                IsPass: false,
                                TechProVerDe_Id: 0,
                                PhaseCode: '',
                                PhaseName: '',
                                EquipmentId: 0,
                                EquipmentCode: '',
                                TotalTMU: 0,
                                PhaseGroupId: 0,
                                SkillRequired: 0,
                                TotalLabor: 0,
                                DevisionPercent: 0,
                                DevisionPercent_Temp: 0,
                                NumberOfLabor: 0,
                                Note: '',
                                OrderIndex: LinePosition.Details.length + 1,
                            }
                            LinePosition.Details.push(obj);
                            var name = LinePosition.EmployeeName + '' == 'null' ? '...  Chọn  Nhân Viên  ...' : LinePosition.EmployeeName;
                            ul += '</table>';
                            tb2 += '<td class="pname" style="width:75%">' + name + '</td>';
                            tb2 += '<td class="tmu" style="width:12%;">' + Math.round(tongtmu) + '</td>';
                            tb2 += '<td class="labor" style="width:12%; border-right:none">' + Math.round(numOfLabor * 10) / 10 + '</td>';
                            tb2 += '</tr></table>';
                            if (LinePosition.IsHasBTP)
                                BTP = true;
                            Global.Data.Position_Arr.push({
                                Id: LinePosition.Id,
                                TechProVer_Id: LinePosition.TechProVer_Id,
                                OrderIndex: LinePosition.OrderIndex,
                                EmployeeId: LinePosition.EmployeeId,
                                EmployeeName: LinePosition.EmployeeName,
                                IsHasExitLine: LinePosition.IsHasExitLine,
                                IsHasBTP: LinePosition.IsHasBTP,
                                Details: LinePosition.Details
                            });
                            return false;
                        }
                    });
                    if (ul == '' && tb2 == '') {
                        tb2 = 'Chọn Nhân Viên ...';
                    }
                    str += '  <div class="line-center" style ="background-image: linear-gradient( #FFD700,#FFD700,#FFD700) !important;' + (i == 0 ? "border-top:1px solid #ccc" : "") + '' + (i == 8 ? "border-bottom:1px solid #ccc" : "") + '"></div>';
                    str += '      <div id="' + y + '" class="line-right">';
                    str += '          <div class="child">';
                    str += '              <div class="equipment"><div style="transform:rotate(-90deg); -webkit-transform:rotate(-90deg); -ms-transform:rotate(-90deg); max-width:50px ">' + equip + '</div></div>';
                    str += '              <div class="main-info c-right"  >';
                    str += '                  <div id="' + y + '" class="line-child-box">';
                    str += '                  <div class="top"> ';
                    str += '                      <div id="phase">' + ul + '</div>';
                    str += '                      <div style="clear: both"></div>';
                    str += '                  </div>';
                    str += '                  <div><div class="col-md-1"><input type="text" linePo_' + y + ' onchange="ChangeIndex(' + y + ')" value="' + y + '"/></div><div class="col-md-11 bottom bold red" style="background-image: linear-gradient( rgb(247, 234, 236),rgb(255, 236, 239),rgb(255, 236, 239)) !important ;" onclick="ChooseEmployee(\'' + y + '\')" data-toggle="modal" data-target="#' + Global.Element.Popup_position + '">' + tb2 + '</div><div class="clearfix"></div></div>';
                    str += '              </div>';
                    str += '          </div>';
                    str += '          <div title="Click Tạo đường vào BTP ở Vị Trí này." class="insert-btp ' + (BTP ? "insert-hover" : "") + '" onclick=insert_BTP(\'' + y + '\')></div>';
                    str += '          <div style="clear: left"></div>';
                    str += '          <div class="exit e-right" style="background-image: linear-gradient( #0000FF,#0000FF,#0000FF) !important;">Lối Đi</div>';
                    str += '      </div>';
                    str += '  </div>';
                    str += '  <div style="clear: left"></div>';
                    str += '</div>';
                    $('#line-box').html(str + $('#line-box').html());
                }
                Global.Data.Index = 0;
                ResetSize();
            }
        }
    }


    /*************************************************************************************************************/
    function ResetSize() {
        if (Global.Data.Index == 0) {
            for (var i = 1, y = i + 1; i <= (Global.Data.Position_Arr.length); i += 2, y += 2) {
                var left = $($('#' + i).parent().find('.line-left')).find('.main-info #phase').height();
                var right = $($('#' + y).parent().find('.line-right')).find('.main-info #phase').height();
                if (left > right) {
                    var height_b = $($('#' + i).parent().find('.line-left')).find('.main-info').height();
                    $($('#' + i).parent().find('.line-left')).find('.main-info #phase').css('min-height', left);
                    $($('#' + y).parent().find('.line-right')).find('.main-info #phase').css('min-height', left);
                    $('#' + i).parent().find('.equipment').css('height', height_b);
                    $('#' + i).parent().find('.equipment div').css('margin', (height_b / 3) + 'px 0 0 0');
                    $('#row_' + i).find('.line-center').css('min-height', $('#' + i).parent().find('.line-left').css('height'));
                }
                else {
                    var height_b = $($('#' + y).parent().find('.line-right')).find('.main-info').height();
                    $($('#' + i).parent().find('.line-left')).find('.main-info #phase').css('min-height', right);
                    $($('#' + y).parent().find('.line-right')).find('.main-info #phase').css('min-height', right);
                    $('#' + i).parent().find('.equipment').css('height', height_b);
                    $('#' + i).parent().find('.equipment div').css('margin', (height_b / 3) + 'px 0 0 0');
                    $('#row_' + i).find('.line-center').css('min-height', $('#' + i).parent().find('.line-right').css('height'));
                }
                $.each(Global.Data.Position_Arr, function (ii, item) {
                    if (item.OrderIndex == i && item.IsHasExitLine) {
                        insert_Exit(i);
                        return false;
                    }
                });
            }
        }
        else {
            var left = $($('#' + Global.Data.Index).parent().find('.line-left')).find('.main-info #phase').height();
            var right = $($('#' + Global.Data.Index).parent().find('.line-right')).find('.main-info #phase').height();
            if (left > right) {
                var height_b = $($('#' + Global.Data.Index).parent().find('.line-left')).find('.main-info').height();
                $($('#' + Global.Data.Index).parent().find('.line-left')).find('.main-info #phase').css('min-height', left);
                $($('#' + Global.Data.Index).parent().find('.line-right')).find('.main-info #phase').css('min-height', left);
                $('#' + Global.Data.Index).parent().find('.equipment').css('height', height_b);
                $('#' + Global.Data.Index).parent().find('.equipment div').css('margin', (height_b / 3) + 'px 0 0 0');
                $('#row_' + Global.Data.Index).find('.line-center').css('min-height', $('#' + Global.Data.Index).parent().find('.line-left').css('height'));
            }
            else {
                var height_b = $($('#' + Global.Data.Index).parent().find('.line-right')).find('.main-info').height();
                $($('#' + Global.Data.Index).parent().find('.line-left')).find('.main-info #phase').css('min-height', right);
                $($('#' + Global.Data.Index).parent().find('.line-right')).find('.main-info #phase').css('min-height', right);
                $('#' + Global.Data.Index).parent().find('.equipment').css('height', height_b);
                $('#' + Global.Data.Index).parent().find('.equipment div').css('margin', (height_b / 3) + 'px 0 0 0');
                $('#row_' + Global.Data.Index).find('.line-center').css('min-height', $('#' + Global.Data.Index).parent().find('.line-right').css('height'));
            }
        }
    }

    function insert_Exit(id) {
        if ($($('#' + id).find('.exit')).css('display') == 'block') {
            $($('#' + id).parent().find('.exit')).hide();
            $.each(Global.Data.Position_Arr, function (ii, diagram) {
                if (parseInt(id) == diagram.OrderIndex) {
                    diagram.IsHasExitLine = false;
                    $($('#' + id).parent().find('.insert-exit')).removeClass('insert-hover');
                    return false;
                }
            });
        }
        else {
            $($('#' + id).parent().find('.exit')).show();
            $.each(Global.Data.Position_Arr, function (ii, diagram) {
                if (parseInt(id) == diagram.OrderIndex) {
                    diagram.IsHasExitLine = true;
                    $($('#' + id).parent().find('.insert-exit')).addClass('insert-hover');
                    return false;
                }
            });
        }
    }

    function insert_BTP(id) {
        var obj = $('#' + id).find('.insert-btp');
        if (obj.hasClass('insert-hover')) {
            obj.removeClass('insert-hover');
            $.each(Global.Data.Position_Arr, function (ii, diagram) {
                if (parseInt(id) == diagram.OrderIndex) {
                    diagram.IsHasBTP = false;
                    return false;
                }
            });
        }
        else {
            obj.addClass('insert-hover');
            $.each(Global.Data.Position_Arr, function (ii, diagram) {
                if (parseInt(id) == diagram.OrderIndex) {
                    diagram.IsHasBTP = true;
                    return false;
                }
            });
        }
    }

    function delete_Po(id) {
        $('#line-box').find('#row_' + id).remove();
        Global.Data.Position_Arr.splice(id - 1, 2);
        $('#tkc_sl_line').val(parseInt($('#tkc_sl_line').val()) - 2);
    }

    function ChooseEmployee(id) {
        var idd = parseInt(id);
        Global.Data.Index = idd;
        var tong = 0;

        if (Global.Data.Position_Arr[idd - 1].Details.length == 0)
            Add_Empty_Object();
        else {
            $.each(Global.Data.Position_Arr[idd - 1].Details, function (i, item) {
                var obj = {
                    Id: item.Id,
                    Line_PositionId: item.Line_PositionId,
                    IsPass: item.IsPass,
                    TechProVerDe_Id: item.TechProVerDe_Id,
                    PhaseCode: item.PhaseCode,
                    PhaseName: item.PhaseName,
                    EquipmentId: item.EquipmentId,
                    EquipmentCode: item.EquipmentCode,
                    TotalTMU: item.TotalTMU,
                    PhaseGroupId: item.PhaseGroupId,
                    SkillRequired: item.SkillRequired,
                    TotalLabor: item.TotalLabor,
                    DevisionPercent: item.DevisionPercent,
                    DevisionPercent_Temp: item.DevisionPercent_Temp,
                    NumberOfLabor: item.NumberOfLabor,
                    Note: item.Note,
                    OrderIndex: item.OrderIndex,
                    Index: item.Index
                }
                Global.Data.Phase_Arr.push(obj);
                tong += item.NumberOfLabor;
            });
        }
        $('#total_worker').val(Math.round(tong * 100) / 100);
        $('#tkc_Employee').val(Global.Data.Position_Arr[idd - 1].EmployeeId == null ? 0 : Global.Data.Position_Arr[idd - 1].EmployeeId);
        ReloadListPhase_Arr();
    }

    function ChangePositionIndex(index) {
        var Newindex = parseInt($('[linePo_' + index + ']').val());
        var OldIndex = parseInt(index);
        if (Newindex <= 0 || Newindex >= (Global.Data.Position_Arr.length + 1)) {
            GlobalCommon.ShowMessageDialog('Số Thứ Tự vị trí phải lớn hơn 0 và nhỏ hơn ' + Global.Data.Position_Arr.length + '.',
                function () { $('[linePo_' + index + ']').val(index); }, "Số Thứ Tự vị trí không hợp lệ");
        }
        else {
            var objTemp = Global.Data.Position_Arr[OldIndex - 1];
            objTemp.OrderIndex = Newindex;
            Global.Data.Position_Arr.splice(OldIndex - 1, 1);
            Global.Data.Position_Arr.splice(Newindex - 1, 0, objTemp);
            if (Newindex < OldIndex) {
                for (var i = Newindex; i < Global.Data.Position_Arr.length; i++) {
                    Global.Data.Position_Arr[i].OrderIndex = i + 1;
                }
            }
            else {
                for (var i = 0; i < Global.Data.Position_Arr.length; i++) {
                    if (i + 1 != Newindex)
                        Global.Data.Position_Arr[i].OrderIndex = i + 1;
                }
            }

            //sorting array
            Global.Data.Position_Arr.sort(function (a, b) {
                var nameA = a.OrderIndex, nameB = b.OrderIndex;
                if (nameA < nameB)
                    return -1;
                if (nameA > nameB)
                    return 1;
                return 0;
            });

            var arr = [];
            $.each(Global.Data.Position_Arr, function (i, item) {
                arr.push(item);
            });


            DrawLinePositionWidthDetail(arr, null);
        }
    }
    /*************************************************************************************************************/
    /*                                  DANH SACH CONG DOAN PHAN CONG TUNG VI TRI                                */
    /*************************************************************************************************************/
    function InitListPhase_Arr() {
        $('#' + Global.Element.JtablePhase_Arr).jtable({
            title: 'Danh Sách Công Đoạn Được Phân',
            pageSizeChangeSize: true,
            selectShow: true,
            actions: {
                listAction: Global.Data.Phase_Arr,
            },
            messages: {
                selectShow: 'Ẩn hiện cột',
            },
            fields: {
                Id: {
                    key: true,
                    create: false,
                    edit: false,
                    list: false
                },
                //IsPass: {
                //    title: ' ',
                //    width: '3%',
                //    display: function (data) {
                //        var txt = $('<button pPass title="" class="jtable-pass-command-button jtable-command-button"><span></span></button>');
                //        if (!data.record.IsPass)
                //            txt = $('<button pPass title="" class="jtable-fail-command-button jtable-command-button"><span></span></button>');
                //        return txt;
                //    }
                //},
                PhaseCode: {
                    visibility: 'fixed',
                    title: "Mã Công Đoạn",
                    width: "20%",
                    display: function (data) {
                        var vl = data.record.PhaseCode != '' ? (data.record.PhaseCode + ' (' + data.record.PhaseName + ')') : '';
                        var txt = $('<input type="text" code_' + data.record.OrderIndex + ' list="autoCompleteSource_Code" class="form-control" techProVerId="' + data.record.TechProVerDe_Id + '" value="' + vl + '" />');
                        txt.keypress(function (evt) {
                            var charCode = (evt.which) ? evt.which : event.keyCode;
                            if (charCode == 13)
                                txt.change();
                        });
                        txt.change(function () {
                            if (txt.val() != '' && txt.val() != vl) {
                                var isExists = false;
                                var isOutOfRange = true;
                                // kt trùng
                                $.each(Global.Data.Phase_Arr, function (i, item) {
                                    if ((item.PhaseCode.trim() + ' (' + item.PhaseName + ')') == txt.val().trim()) {
                                        isExists = true;
                                        GlobalCommon.ShowMessageDialog('Công Đoạn này đã được Phân Công. Vui lòng chọn Công Đoạn khác.', function () { }, "Thông Báo");
                                        txt.val(data.record.PhaseCode);
                                        return false;
                                    }
                                });

                                if (!isExists) {
                                    $.each(Global.Data.PhaseList, function (i, item) {
                                        if ((item.PhaseCode.trim() + ' (' + item.PhaseName + ')') == txt.val()) {
                                            if (item.De_Percent == 100) {
                                                GlobalCommon.ShowMessageDialog('Số Lao Động của Công Đoạn : <span class="red bold">' + item.PhaseCode + '</span> đã được Phân Công hết.Vui lòng chọn Công Đoạn khác.', function () { }, "Thông Báo");
                                                txt.val(data.record.PhaseCode);
                                                isOutOfRange = false;
                                            }
                                            else {
                                                data.record.TechProVerDe_Id = item.Id;
                                                data.record.PhaseCode = item.PhaseCode;
                                                data.record.PhaseName = item.PhaseName;
                                                data.record.SkillRequired = item.SkillRequired;
                                                data.record.PhaseGroupId = item.PhaseGroupId;
                                                data.record.TotalTMU = item.TimeByPercent;
                                                data.record.TotalLabor = item.Worker;
                                                data.record.NumberOfLabor = 0;
                                                data.record.DevisionPercent = 0;
                                                data.record.EquipmentId = item.EquipmentId;
                                                data.record.EquipmentCode = item.EquipmentCode;
                                                data.record.Index = item.Index;
                                                if (item.De_Percent == 0 || typeof (item.De_Percent) == 'undefined') {
                                                    data.record.DevisionPercent_Temp = 100;
                                                    data.record.NumberOfLabor = item.Worker;
                                                    // item.De_Percent = 100; 
                                                    // data.record.DevisionPercent = 100;
                                                }
                                                else if (((item.Worker * (100 - item.De_Percent)) / 100) < 1.2) {
                                                    data.record.DevisionPercent_Temp = 100 - item.De_Percent;
                                                    data.record.NumberOfLabor = ((item.Worker * (100 - item.De_Percent)) / 100);
                                                }

                                                if (data.record.OrderIndex == Global.Data.Phase_Arr.length)
                                                    Add_Empty_Object();
                                                ReloadListPhase_Arr();
                                                isOutOfRange = false;
                                                CalculatorWorker();
                                                $('[code_' + Global.Data.Phase_Arr.length + ']').focus();
                                            }
                                            return false;
                                        }
                                    });

                                    // thong bao loi neu ko tim thay thong tin cong doan
                                    if (isOutOfRange) {
                                        GlobalCommon.ShowMessageDialog('Không tìm thấy Thông tin của Công Đoạn "<span class="red bold">' + txt.val() + '</span>".\nVui lòng chọn Công Đoạn khác.', function () { }, "Thông Báo");
                                        txt.val(data.record.PhaseCode);
                                    }
                                }
                            }
                        });
                        txt.click(function () {
                            txt.select();
                        });
                        txt.focusout(function () {
                            txt.change();
                        });
                        txt.autocomplete({
                            source: Global.Data.Code
                        });
                        return txt;
                    }
                },
                //PhaseName: {
                //    title: 'Tên Công Đoạn',
                //    width: '15%'
                //},
                EquipmentCode: {
                    title: 'Thiết Bị',
                    width: '3%',
                    display: function (data) {
                        if (data.record.EquipmentCode != null) {
                            var txt = '<span class="red  ">' + data.record.EquipmentCode + '</span>';
                            return txt;
                        }
                    }
                },
                TotalTMU: {
                    title: 'Tổng TG (s)',
                    width: '5%',
                    display: function (data) {
                        var txt = '<span class="blue  ">' + Math.round(data.record.TotalTMU) + '</span>';
                        return txt;
                    }
                },
                //WorkerLevelId: {
                //    title: "Bậc thợ",
                //    width: "5%",
                //    display: function (data) {
                //        var txt = '<span class="red bold">' + data.record.WorkerLevelName + '</span>';
                //        return txt;
                //    }
                //},
                TotalLabor: {
                    title: 'Tổng LĐ có thể PC',
                    width: '5%',
                    display: function (data) {
                        var txt = '<span class="red bold">' + Math.round(data.record.TotalLabor * 1000) / 1000 + '</span>';
                        return txt;
                    }
                },
                DevisionPercent: {
                    title: 'Tỷ Lệ',
                    width: '5%',
                    display: function (data) {
                        var txt = $('<input type="text" class="form-control center" value="' + data.record.DevisionPercent_Temp + '" onkeypress=" return isNumberKey(event)"/>');
                        txt.click(function () { txt.select(); });
                        txt.change(function () {
                            $.each(Global.Data.PhaseList, function (i, item) {
                                if (item.Id == data.record.TechProVerDe_Id) {
                                    if (parseFloat(txt.val()) > 0 && parseFloat(txt.val()) <= 100) {
                                        if ((item.De_Percent - data.record.DevisionPercent) + parseFloat(txt.val()) > 100) {
                                            GlobalCommon.ShowMessageDialog('Số Lao Động của Công Đoạn : <span class="red bold">' + item.PhaseCode + '</span> chỉ còn lại <span class="red bold">' + (100 - item.De_Percent) + '%</span>.\nVui lòng Phân Công trong khoảng cho phép.', function () { }, "Thông Báo");
                                            txt.val(data.record.DevisionPercent_Temp);
                                        }
                                        var labor = (item.Worker * parseFloat(txt.val())) / 100;
                                        data.record.NumberOfLabor = labor;
                                        data.record.DevisionPercent_Temp = parseFloat(txt.val());
                                        ReloadListPhase_Arr();
                                        CalculatorWorker();
                                    }
                                    else {
                                        GlobalCommon.ShowMessageDialog('Tỷ Lệ Phân Công phải lớn hơn <span class="red bold">0</span> và nhỏ hơn <span class="red bold">100%</span>.', function () { }, "Thông Báo");
                                        txt.val(data.record.DevisionPercent_Temp);
                                    }
                                    return false;
                                }
                            });
                        });
                        return txt;
                    }
                },
                NumberOfLabor: {
                    title: 'Số LĐ PC',
                    width: '5%',
                    display: function (data) {
                        var txt = '<span class="red bold">' + Math.round(data.record.NumberOfLabor * 1000) / 1000 + '</span>';
                        return txt;
                    }
                },
                Note: {
                    title: 'Ghi Chú',
                    width: '5%',
                    display: function (data) {
                        var txt = $('<input pNote class="form-control" type="text" value="' + data.record.Note + '"></input>');
                        txt.change(function () { data.record.Note = txt.val(); });
                        return txt;
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
                                $.each(Global.Data.Phase_Arr, function (i, item) {
                                    if (item.TechProVerDe_Id == data.record.TechProVerDe_Id) {
                                        // tra lai data cu
                                        //$.each(Global.Data.PhaseList, function (iii, phase) {
                                        //    if (item.TechProVerDe_Id == phase.Id) {
                                        //        phase.De_Percent -= item.DevisionPercent; 
                                        //        return false;
                                        //    }
                                        //});
                                        // xoa 
                                        Global.Data.Phase_Arr.splice(i, 1);

                                        // sap xiep lai
                                        for (var y = i; y < Global.Data.Phase_Arr.length; y++) {
                                            Global.Data.Phase_Arr[y].OrderIndex = y + 1;
                                        }
                                        ReloadListPhase_Arr();
                                        $('[code_' + Global.Data.Phase_Arr.length + ']').focus();
                                        return false;
                                    }
                                });
                                CalculatorWorker();
                            }, function () { }, 'Đồng ý', 'Hủy bỏ', 'Thông báo');
                        });
                        return text;
                    }
                }
            }
        });
    }

    function ReloadListPhase_Arr() {
        $('#' + Global.Element.JtablePhase_Arr).jtable('load');
    }

    function Add_Empty_Object() {
        var obj = {
            Id: 0,
            Line_PositionId: 0,
            IsPass: false,
            TechProVerDe_Id: 0,
            PhaseCode: '',
            PhaseName: '',
            EquipmentId: 0,
            EquipmentCode: '',
            TotalTMU: 0,
            PhaseGroupId: 0,
            SkillRequired: 0,
            TotalLabor: 0,
            DevisionPercent: 0,
            DevisionPercent_Temp: 0,
            NumberOfLabor: 0,
            Note: '',
            OrderIndex: Global.Data.Phase_Arr.length + 1,
        }
        Global.Data.Phase_Arr.push(obj);
    }

    function CalculatorWorker() {
        var tong = 0;
        $.each(Global.Data.Phase_Arr, function (i, item) {
            tong += item.NumberOfLabor;
        });
        $('#total_worker').val(Math.round(tong * 10) / 10);
        if (tong > 1.2) {
            GlobalCommon.ShowMessageDialog('Tổng Lao Động Phân công cho Vị Trí này đã lớn hơn 1.2 Lao Động.', function () { }, "Thông Báo");
        }
    }

    function Add_PhaseIntoPosition() {
        var ul = '<table>';
        var equip = '';
        var tongtmu = 0;
        var numOfLabor = 0;
        var EQUIP = [];
        $.each(Global.Data.Position_Arr[Global.Data.Index - 1].Details, function (i, item) {
            if (i < (Global.Data.Position_Arr[Global.Data.Index - 1].Details.length - 1)) {
                ul += '<tr>';
                ul += '<td class="code">' + item.PhaseCode + '</td>';
                ul += '<td class="pname">' + item.PhaseName + '</td>';
                ul += '<td class="tmu ">' + Math.round((item.TotalTMU)) + '</td>';
                ul += '<td class="per blue">' + Math.round((item.DevisionPercent)) + '</td>';
                ul += '<td class="labor red">' + Math.round(item.NumberOfLabor * 100) / 100 + '</td>';
                ul += '</tr>';
                if (EQUIP.length > 0 && item.EquipmentCode != '') {
                    var flag = false;
                    $.each(EQUIP, function (e, E) {
                        if (E == item.EquipmentCode.trim()) {
                            flag = true;
                            return false;
                        }
                    });
                    if (!flag) {
                        equip += item.EquipmentCode.trim() + '<br/>';
                        EQUIP.push(item.EquipmentCode.trim());
                    }
                }
                else {
                    if (item.EquipCode != '') {
                        equip += item.EquipmentCode + '<br/>';
                        EQUIP.push(item.EquipmentCode);
                    }
                }
                tongtmu += Math.round(item.TotalTMU);
                numOfLabor += item.NumberOfLabor;
            }
        });
        ul += '</table>';
        var tb2 = '<table style="width:100%"><tr>';
        tb2 += '<td class="pname" style="width:75%">' + Global.Data.Position_Arr[Global.Data.Index - 1].EmployeeName + '</td>';
        tb2 += '<td class="tmu" style="width:12%">' + Math.round((tongtmu)) + '</td>';
        tb2 += '<td class="labor" style="width:12%; border-right:none">' + Math.round(numOfLabor * 100) / 100 + '</td>';
        tb2 += '</tr><table>';
        $('#' + Global.Data.Index).find('#phase').html(ul);
        $('#' + Global.Data.Index).find('.equipment div').html(equip);
        $('#' + Global.Data.Index).find('.bottom').html(tb2);
        ResetSize();
    }

    function GetEmployeeWithSkill(controlName) {
        $.ajax({
            url: '/Employee/GetEmployWithSkill',
            type: 'post',
            data: '',
            contentType: 'application/json',
            beforeSend: function () { $('#loading').show(); },
            success: function (result) {
                GlobalCommon.CallbackProcess(result, function () {
                    if (result.Result == "OK") {
                        var option = '<option value="0" >Không Có Dữ Liệu Nhân Viên</option>';
                        Global.Data.EmployeeArr.length = 0;
                        if (result.Data.length > 0) {
                            option = '';
                            $.each(result.Data, function (i, item) {
                                Global.Data.EmployeeArr.push(item);
                                option += '<option value="' + item.EmployeeId + '" >' + item.EmployeeName + ' (' + item.EmployeeCode + ')</option>';
                            });
                            $('#' + controlName).empty().append(option);
                            $('#loading').hide();
                        }
                    }
                    else
                        GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình xử lý.");
                }, false, '', true, true, function () {
                    var msg = GlobalCommon.GetErrorMessage(result);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình xử lý.");
                });
            }
        });
    }

    /***************************************************************************************************************** 
                                                    Lưu thiết kế chuyền
     *****************************************************************************************************************/
    function SaveDiagram(obj) {
        $.ajax({
            url: Global.UrlAction.Save,
            type: 'post',
            data: JSON.stringify({ 'model': JSON.stringify(obj) }),
            contentType: 'application/json',
            beforeSend: function () { $('#loading').show(); },
            success: function (result) {
                $('#loading').hide();
                GlobalCommon.CallbackProcess(result, function () {
                    if (result.Result == "OK") {
                        //  GlobalCommon.ShowMessageDialog('Lưu Thành Công.', function () { }, "Thông Báo");
                        //   window.location.href = Global.UrlAction.Back;
                        $('[tkc_cancel]').click();
                        ReloadList();
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

    function GetLaborDivisionDiagramById(id) {
        $.ajax({
            url: Global.UrlAction.GetById,
            type: 'post',
            data: JSON.stringify({ 'labourId': id }),
            contentType: 'application/json',
            beforeSend: function () { $('#loading').show(); },
            success: function (result) {
                GlobalCommon.CallbackProcess(result, function () {
                    if (result.Result == "OK") {

                        $('#tkc_id').val(result.Records.Id);
                        $('#tkc_lineName').val(result.Records.LineId);

                        Global.Data.TechProVerId = result.Records.TechProVer_Id;

                        Global.Data.CodeOption = '<option value="0" >Chọn ...</option>';
                        Global.Data.NameOption = '<option value="0" >Chọn ...</option>';
                        Global.Data.Code.length = 0;
                        Global.Data.Name.length = 0;
                        Global.Data.PhaseList.length = 0;
                        if (result.Records.TechProcess != null) {
                            $.each(result.Records.TechProcess.details, function (i, item) {
                                Global.Data.PhaseList.push(item);
                                Global.Data.CodeOption += '<option value="' + item.Id + '" >' + item.PhaseCode + '</option>';
                                Global.Data.NameOption += '<option value="' + item.Id + '" >' + item.PhaseName + '</option>';
                                Global.Data.Code.push(item.PhaseCode.trim());
                                Global.Data.Name.push(item.PhaseName.trim());
                            });
                        }


                        if (result.Records.Positions != null && result.Records.Positions.length > 0) {
                            DrawLinePositionWidthDetail(result.Records.Positions, null);
                            $('#tkc_sl_line').val(result.Records.Positions.length);
                        }

                        //$('#time-per-commo').html(Math.round(result.Records.TechProcess.TimeCompletePerCommo * 1000) / 1000);
                        //$('#pro-per-person').html(Math.round(result.Records.TechProcess.ProOfPersonPerDay * 1000) / 1000);
                        //$('#pro-group-per-hour').html(Math.round(result.Records.TechProcess.ProOfGroupPerHour * 1000) / 1000);
                        //$('#pro-group-per-day').html(Math.round(result.Records.TechProcess.ProOfGroupPerDay * 1000) / 1000);
                        //$('#paced-product').html(Math.round(result.Records.TechProcess.PacedProduction * 1000) / 1000);
                        //$('#workers').html(result.Records.TechProcess.NumberOfWorkers);
                        //$('#time-per-day').html(result.Records.TechProcess.WorkingTimePerDay);
                        //$('#note').html(result.Records.TechProcess.Note);



                        $('#loading').hide();
                    }
                    else
                        GlobalCommon.ShowMessageDialog('', function () { }, "Đã có lỗi xảy ra trong quá trình xử lý.");
                }, false, Global.Element.PopupModule, true, true, function () {
                    var msg = GlobalCommon.GetErrorMessage(result);
                    GlobalCommon.ShowMessageDialog('', function () { }, "Đã có lỗi xảy ra trong quá trình xử lý.");
                });
            }
        });
    }

}