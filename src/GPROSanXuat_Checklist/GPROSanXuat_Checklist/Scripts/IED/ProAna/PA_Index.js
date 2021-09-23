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
GPRO.namespace('ProAna');
GPRO.ProAna = function () {
    var Global = {
        UrlAction: {
            GetListnoName: '/ProAna/Gets',
            SaveProAna: '/ProAna/Save',
            DeleteProAna: '/ProAna/Delete',
            GetCommoAnaItem: '/ProAna/GetByParentId',

            SavePhase: '/ProAna/SavePhase',
            DeletePhase: '/ProAna/DeletePhase',
            RemovePhaseVideo: '/ProAna/RemovePhaseVideo',
            CopyPhase: '/ProAna/CopyPhase',
            GetLastIndex: '/ProAna/GetPhaseLastIndex',

            GetPhasesForSugest: '/ProAna/GetPhasesForSuggest',


            GetPhaseGroup: '/PhaseGroup/GetPhaseGroups',

            GetListPhase: '/ProAna/GetPhases',
            GetPhaseById: '/ProAna/GetPhaseById',
            GetPhaseVersionManipulationByManipulationVersionId: '/ProAna/GetPhaseVersionManipulationByManipulationVersionId',
            Copy_CommoAnaPhaseGroup: '/ProAna/Copy_CommoAnaPhaseGroup',

            ActivePhaseVersion: '/ProAna/ActivePhaseVersion',
            SavePhaseVersion: '/ProAna/SavePhaseVersion',
            DeletePhaseVersion: '/ProAna/DeletePhaseVersion',
            GetPhaseVersionById: '/ProAna/GetPhaseVersionById',
            GetPhaseVersionByVerId: '/ProAna/GetPhaseVersionByVerId',


            GetListTimePrepare: '/TimePrepare/GetLists',
            GetListAccessories: '/Equipment/GetListAccessories',
            GetTimeTypePrepare: '/TimePrepare/GetTimeTypePreparesByWorkShopId',

            //thao tac
            GetAllManipulation: '/MType/GetAllManipulation',
            GetListManipulation: '/MType/GetList',
            GetManipulationTypes: '/MType/GetManipulationTypes',
            GetManipulationFileById: '/MType/GetManipulationFileById',
            GetListEquipment: '/Equipment/Gets',
            GetManipulationEquipmentInfoByCode: '/MType/GetManipulationEquipmentInfoByCode',

            SaveManipulationVersion: '/ProAna/SaveManipulationVersion',
            DeletePhaseManiVersion: '/ProAna/DeletePhaseManiVersion',
            ApprovalComoAnaPhaseManiVer: '/ProAna/ApprovalComoAnaPhaseManiVer',
            Active_PhaseManiVersion: '/ProAna/ActiveComoAnaPhaseManiVer',
            GetManipulation: '/MType/GetListSmall',
            GetEquipments: '/Equipment/GetEquipmentByEquipmentTypeId',
            Copy_PhaseManiVersion: '/ProAna/Copy_PhaseManiVersion',
            export_PhaseManiVersion: '/ProAna/export_PhaseManiVersion',
            ActiveComoAnaPhaseManiVer: '/ProAna/Active_PhaseManiVersion',
            GetManiDetails: '/ProAna/GetComoAnaPhaseManiVer',

            GetTech: '/ProAna/GetTech',
            SaveTech: '/ProAna/SaveTech',
            ExportToExcel: '/ProAna/ExportToExcel',

            TinhLaiCode: '/ProAna/TinhLaiCode'
        },
        Element: {
            jtable_Timeprepare_Chooise: 'jtable-timeprepare',
            jtable_timeprepare_arr: 'jtable-timeprepare-arr',
            timeprepare_Popup: 'timeprepare-Popup',
            timeprepare_Popup_Search: 'timePrepare_PopupSearch',
            jtablePhase: 'jtable-phase',
            CreatePhasePopup: 'Create-Phase-Popup',
            JtableManipulationArr: 'jtable_ManipulationArr',
            PopupSearchEquipment: 'POPUP_SEARCHEQUIP',
            JtableEquipment: 'jtable-chooseequipment',
            PopupChooseEquipment: 'ChooseEquipment_Popup',


            JtableComodity: 'jtableComodity',
            ListComodityPopup: 'List-Comodity-Popup',
            CreateCommodityPopup: 'capopup_Commodity',
            SearchComodityPopup: 'Search-Comodity-Popup',

            CreateWorkShopPopup: 'Create-Workshop-popup',
            JtableWorkShop: 'jtable-WorkShop',
            ListWorkShopPopup: 'List-WorkShop-Popup',
            SearchWorkShopPopup: 'Search-WorkShop-Popup',

            CreatePhaseGroupPopup: 'Create-PhaseGroup-Popup',
            ListPhaseGroupPopup: 'List-PhaseGroup-Popup',
            SearchPhaseGroupPopup: 'Search-PhaseGroup-Popup',
            JtablePhaseGroup: 'jtable-PhaseGroup',

            CreatePhaseVersionPopup: 'Create-PhaseVersion-Popup',
            JtablePhaseVerDetailArr: 'jtable-phaseVersionSelected',
            jtablePhase_Chooise: 'jtable-PhaseVersionChooise',
            PopupChooisePhase: 'Popup_ChooisePhase',



            /*******************************************************/

            jtablePhaseVersion: 'techprocess',

            PopupPhaseSearch: 'Phase_PopupSearch',
            JtablePhase: 'jtable-mani-select',

            CreateManipulationVersion: 'Create-ManipulationVersion-Popup',


            jtableManipulation_choose: 'jtableManipulation',
            popupManipulationSearch: 'manipulation_PopupSearch',



            jtable_accessoriess_arr: 'jtable-accessoriess-arr',
            jtable_accessories_Chooise: 'jtable-accessories',
            accessories_Popup: 'accessories-Popup',
            accessories_Popup_Search: 'accessories_PopupSearch',



            /***/
            JtableTech_Cycle: 'Jtable-TechCycle'
        },
        Data: {
            TreeExpand: [],
            year: [],
            month: [],
            customer: [],
            is: false,
            index: 0,
            Images: ['Company.png', 'palet02.png', 'factory.png', 'recipegroup.png', '', 'components.png', 'group_config.png', ''],
            height: 0,
            position: 0,
            isChange: false,
            TreeSelectItem: {},
            ProAnaArray: [],
            ModelProAna: {},
            TimePrepareArray: [],
            Commo_Ana_PhaseId: 0,
            PhaseManiVerDetailArray: [],
            isInsertPhase: true,
            ParentID: 0,
            Node: '',
            ManipulationVersionModel: {},
            PhaseAutoCode: '',
            phaseLastIndex: 1,
            AccessoriesArray: [],
            TMU: 0,
            Video: '',
            yearStr: '0',

            PhasesSuggest: [],
            SuggestPhaseId: 0,
            ObjectType: 0,
            ObjectId: 0,
            PhaseModel: {},
            isUserMachine: false,
            ModelPhaseVersion: {},
            PhaseVersiondetailArray: [],
            isCall: false,
            WorkShopId: 0,
            PhaseNode: '',
            /******************************************************/

            PhaseVerManiDetailModel: {},
            ModelCommo_Anna_Phase: {},
            ManipulationList: [],
            ModelManipulationType: {},
            ModelManipulation: {},
            NodeUseToFind: '',
            ManipulationTypeId: 0,
            Model: {},
            ManipulationTypeArray: [],
            IntGetTMUType: 0,
            GetTMUType: { StandardTMU: 1, UserTMU: 2, All: 3 },
            PhaseManipulationVersionDetailRowId: 0,
            EquipTypeDefaultId: { SE: 1, C: 2 },
            IsClear: false,
            Copy_CommoAnaPhaseGroupId: 0,
            isApproveManiVersion: false,
            isSave_App_Ac_ManiVersion: false,
            SelectRow: 0,
            labelName: '',

            right_position: 0,
            TechCycle_Arr: [],
            TimeProductPerCommodity: 0,
            TechProcessVersion: {},
            productId: 0,
            AfterSave: false,
            warningChuaCoQTCN: true
        }
    }
    this.GetGlobal = function () {
        return Global;
    }

    this.TitleChange = function () {
        var value = $('#tile-parent').val();
        var $selectedRows = $('#' + Global.Element.JtableTech_Cycle).find('tbody tr')
        if ($selectedRows.length > 0) {
            var time_product = 0;
            $selectedRows.each(function (i, item) {
                $(this).find('[percent]').val(value);
                var time = parseFloat(Global.Data.TechCycle_Arr[i].StandardTMU);
                var time_per = Math.round(((time * 100) / parseFloat(value)) * 1000) / 1000;

                $($($(this).find('td'))[6]).html(ParseStringToCurrency(time_per));
                Global.Data.TechCycle_Arr[i].TimeByPercent = time_per;
                time_product += time_per;
            });
            $('#time-product').html(Math.round(time_product * 1000) / 1000);
            Global.Data.TimeProductPerCommodity = time_product;
            ResetWorkingBox(0);
        }
    };

    this.Init = function () {
        RegisterEvent();
        GetPhasesForSuggest();
        GetProductSelect('caproduct');
        GetWorkshopSelect('wk-name');
        GetPhaseGroupSelect('phaseGroup-name');
        ResetProAnaTreeView();
        GetWorkersLevelSelect('workersLevel');
        GetApplyPressureSelect('ApplyPressure');
        GetAllManipulation();
        if ($('#config').attr('tmu') != "");
        Global.Data.TMU = parseFloat($('#config').attr('tmu'));
        if ($('#config').attr('gettmutype') != "")
            Global.Data.IntGetTMUType = parseInt($('#config').attr('gettmutype'));
        InitListTech_Cycle();
        InitListTimePrepare();
        InitListTimePrepare_chooise();
        InitListPhase_View();
        InitListEquipment();
        InitListMani_Arr();
        InitListTech_Cycle();
        $('#jtable_tkc').hide();
        Global.Data.PhaseManiVerDetailArray.length = 0;
        AddEmptyObject();
        ReloadListMani_Arr();
        UpdateIntWaste();
    }

    this.ResetTime_Percent = function (index) {
        ResetTime_Percent(index);
    }

    this.reloadListProAna = function () {
        ReloadListProAna();
    }

    this.removeVideo = function () { removeVideo(); }

    var RegisterEvent = function () {
        $('#jqxTree').on('select', function (event) {
            var args = event.args;
            var selectItem = $('#jqxTree').jqxTree('getItem', args.element);
            Global.Data.TreeSelectItem = selectItem;
            type = parseInt(selectItem.value);
            Global.Data.ObjectType = (type + 1);
            Global.Data.ParentID = selectItem.id;

            var findObj = {};
            $.each(Global.Data.ProAnaArray, function (index, item) {
                if (item.Id == selectItem.id) {
                    Global.Data.ModelProAna.Node = item.Node;
                    Global.Data.Node = item.Node;
                    Global.Data.PhaseNode = item.Node + item.Id + ',';
                    $('#txt_commo_anna_phase').attr('phaseNode', item.Node + item.Id + ',');
                    Global.Data.ObjectId = item.ObjectId;
                    findObj = item;
                    return;
                }
            });

            $('[type="1"]').hide();
            $('[type="1a"]').hide();
            $('[type="2"]').hide();
            $('[type="2a"]').hide();
            $('[type="6"]').hide();
            $('[type="6a"]').hide();
            $('#jqxMenu').css('opacity', '1');
            $('#jqxMenu').css('height', '83px');
            switch (type) {
                case 11:
                case 13:
                    $('#jqxMenu').css('opacity', '0');
                    break;
                case 0:
                    $('[type="' + (type + 1) + '"]').show();
                    $('#jqxMenu').css('height', '30px');
                    break;
                case 1:
                    $('[type="' + (type + 1) + '"]').show();
                    $('[type="' + type + 'a"]').show();
                    break;
                case 2:
                    $('[type="' + type + 'a"]').show();
                    $("#jqxMenu").css('height', '56px');
                    break;
                case 3:
                    $('#jqxMenu').css('opacity', '0');
                    $('#' + Global.Element.jtablePhase + ',#jtable_tkc').hide();
                    $('#' + Global.Element.jtablePhaseVersion).show();
                    $.each(Global.Data.ProAnaArray, function (index, item) {
                        if (item.Id == findObj.ParentId) {
                            workshopId = item.ObjectId;
                            $.each(Global.Data.ProAnaArray, function (ii, item1) {
                                if (item1.Id == item.ParentId) {
                                    Global.Data.productId = item1.ObjectId;
                                    return;
                                }
                            });
                            return;
                        }
                    });
                    Global.Data.warningChuaCoQTCN = false;
                    GetTechProcess(findObj.Node, Global.Data.ParentID);
                    $('div.divParent').attr('currentPoppup', ('techprocess').toUpperCase());
                    break;
                case 5:
                    $('[type="' + (type + 1) + '"]').show();
                    if (Global.Data.Copy_CommoAnaPhaseGroupId != 0) {
                        $('#paste').show();
                        $('#jqxMenu').css('height', '56px');
                    }
                    else
                        $('#jqxMenu').css('height', '30px');
                    break;
                case 6:
                    $("#jqxMenu").css('height', '83px');
                    $('[type="' + type + 'a"]').show();

                    $('#' + Global.Element.jtablePhaseVersion).hide();

                    // dua thong tin ra ngoai 
                    id = parseInt(Global.Data.Node.split(',')[2]);
                    $.each(Global.Data.ProAnaArray, function (index, item) {
                        if (item.Id == id) {
                            //Global.Data.WorkShopId = item.ObjectId;
                            $('#txt_commo_anna_phase').attr('workshop', item.ObjectId);
                            $('#txt_commo_anna_phase').attr('parentid', Global.Data.ParentID);
                            $('#txt_commo_anna_phase').attr('phaseGroup', Global.Data.ObjectId);
                            $('#txt_commo_anna_phase').attr('phaseNode', item.Node);
                            return false;
                        }
                    });
                    $('#txt_commo_anna_phase').change();
                    Global.Data.PhaseAutoCode = findObj.Description;
                    Global.Data.phaseLastIndex = 0;
                    $('#' + Global.Element.jtablePhase).find('.jtable-title-text').html('Danh Sách Công Đoạn của Nhóm : <span class="red"> ' + selectItem.label + '</span>');
                    //  ReloadListAccessories();/
                    ReloadListPhase_View();
                    ReloadListTimePrepare();
                    GetLastPhaseIndex();
                    $('#' + Global.Element.jtablePhase).show();
                    $('#techprocess,#jtable_tkc').hide();
                    $('div.divParent').attr('currentPoppup', Global.Element.jtablePhase.toUpperCase());
                    break;
                case 8:
                    $('#techprocess,#jtable-phase').hide();
                    $('#jtable_tkc').show();
                    $('#jtable_tkc').attr('parentid', Global.Data.ParentID);
                    $('#jtable_tkc').attr('node', findObj.Node);
                    $('#jtable_tkc').attr('pId', findObj.ParentId);

                    $.each(Global.Data.ProAnaArray, function (index, item) {
                        if (item.Id == findObj.ParentId) {
                            $('#jtable_tkc').attr('wkId', item.ObjectId);
                            $('#jtable_tkc').attr('wkName', item.Name);
                            $('#workshop_').html(item.Name);
                            return false;
                        }
                    });
                    $('#jtable_tkc').change();
                    Global.Data.warningChuaCoQTCN = true;
                    var _parentId = parseInt(Global.Data.ParentID) - 1;
                    GetTechProcess(findObj.Node, _parentId);
                    break;
            }
        });

        $('#jqxTree').on('expand', function (event) {
            var selectItem = $('#jqxTree').jqxTree('getItem', event.args.element);
            if (selectItem.level == 1) {
                Global.Data.yearStr = selectItem.label;
            }
            var $element = $(event.args.element);
            var loader = false;
            var loaderItem = null;
            var children = $element.find('ul:first').children();
            $.each(children, function () {
                var item = $('#jqxTree').jqxTree('getItem', this);
                if (item && item.label == 'Loading...') {
                    loaderItem = item;
                    loader = true;
                    return false
                };
            });
            if (loader) {
                if (selectItem.id != '0') { 
                        var type = 0;
                        switch (selectItem.value) {
                            case 2:
                            case 5:
                            case 6: type = 3; break;
                            case 1:
                            case 3:
                            case 4:
                            case 7: type = 2; break;
                            case 11: type = 13; break;
                            case 13: type = 1; break;
                        }
                        GetCommoAnaItems(selectItem.id, selectItem.label, type, loaderItem); 
                }
            }
            var flag = false;
            $.each(Global.Data.TreeExpand, function (i, item) {
                if (parseInt(item) == selectItem.id) {
                    flag = true;
                    return false;
                }
            })
            if (!flag)
                Global.Data.TreeExpand.push(selectItem.id == -10001 ? "-10000" : selectItem.id);
            if (Global.Data.position != 0)
                Global.Data.height = Global.Data.position;
            Global.Data.isChange = true;
        });

        $('#jqxTree').on('collapse', function (event) {
            var selectItem = $('#jqxTree').jqxTree('getItem', event.args.element);
            if (Global.Data.TreeExpand != null && Global.Data.TreeExpand.length > 0) {
                $.each(Global.Data.TreeExpand, function (i, item) {
                    if (item == selectItem.id) {
                        var sl = 1;
                        var flag = false;
                        if (parseInt(item) >= -999 && item < 0) {
                            for (var y = 1; y <= 3; y++) {
                                if (parseInt(Global.Data.TreeExpand[i + y]) > 0 && !flag) {
                                    sl++;
                                }
                                else
                                    flag = true;
                            }
                        }
                        Global.Data.TreeExpand.splice(i, sl);
                        Global.Data.TreeExpand.sort(function (item1, item2) {
                            if (parseInt(item1) > parseInt(item2)) {
                                return item1 - item2;
                            }
                        });
                        return false;
                    }
                });
            }
            $('#left').scrollTop(Global.Data.height >= Global.Data.position ? Global.Data.height + 50 : Global.Data.position);
        });

        $('#left').scroll(function () {
            var position = $('#left').scrollTop();
            if (position != 0)
                Global.Data.position = position;
            if (Global.Data.isChange)
                Global.Data.position += 50;
            $('#left').scrollTop(Global.Data.position);
            Global.Data.isChange = false;
        });


        $('#phase-name').change(() => {
            $('#lbTenCongDoan').html($('#phase-name').val());
        });

        $('#phase-name').keyup(() => {
            $('#phase-name').change();
        });

        $('[filelist]').select(function () {
            SavePhase();
        });
        $('#phase-index').change(function () {
            $('#phase-code').html(((Global.Data.PhaseAutoCode == null || Global.Data.PhaseAutoCode == '' ? '' : (Global.Data.PhaseAutoCode + '-')) + $('#phase-index').val()));
        });

        $('[re_caproduct]').click(function () {
            GetProductSelect('caproduct');
        });
        $('[re_workerslevel]').click(function () {
            GetWorkersLevelSelect('workersLevel');
        });
        /***************************          STEP 1 CREATE COMMODITY        ***************************************/
        $('#' + Global.Element.CreateCommodityPopup).on('shown.bs.modal', function () {
            $('div.divParent').attr('currentPoppup', Global.Element.CreateCommodityPopup.toUpperCase());
        });
        $('#commodity-name').click(function () {
            if ($('#productType').val() == '0' || $('#product').val() == '0') {
                GlobalCommon.ShowMessageDialog('Bạn chưa chọn Loại Mã hàng hoặc Mã hàng.\nBạn phải chọn Loại Mã hàng -> Mã hàng -> mã hàng.', function () { }, "Đã có lỗi xảy ra trong quá trình xử lý.");
            }
            else {
                InitListCommodity();
                ReloadListCommodity();
                $('#' + Global.Element.ListComodityPopup).modal('show');
                $('#' + Global.Element.CreateCommodityPopup).css('z-index', 1040);
            }
        });
        $('#productType').change(function () {
            GetProductsAndSetValueByProductTypeId($(this).val(), 0);
        });

        $('[save-commo]').click(function () {
            if ($('#caproduct option:selected').val() == '0') {
                GlobalCommon.ShowMessageDialog('Bạn chưa chọn Mã hàng.', function () { }, "Lỗi nhập liệu");
            }
            else {
                Global.Data.ModelProAna.Description = $('#Description').val();
                Global.Data.ModelProAna.Name = $('#caproduct option:selected').text();
                Global.Data.ModelProAna.ObjectId = $('#caproduct option:selected').val();
                SaveCommoAnalysis();
                $('[cancel-commo]').click();
            }
        });
        $('[cancel-commo]').click(function () {
            $('#productType').val(0);
            $('#productType').change();
            $('#commodity').val('0');
            $('#commodity-name').val('');
            $('#Description').val('');
            $('#productType').prop('disabled', false);
            $('#product').prop('disabled', false);
            $('#commodity-name').prop('disabled', false);
        });
      
        /*******************            STEP 2 CREATE WORKSHOP          ****************************************/
        $('[re_wk-name]').click(function () {
            GetWorkshopSelect('wk-name');
        });
        $('[save-workshop]').click(function () {
            if ($('#wk-name option:selected').val() == '' || $('#wk-name option:selected').val() == '0') {
                GlobalCommon.ShowMessageDialog('Bạn chưa chọn Phân xưởng.', function () { }, "Lỗi nhập liệu");
            }
            else {
                Global.Data.ModelProAna.Description = $('#workshop-Description').val();
                Global.Data.ModelProAna.Name = $('#wk-name option:selected').text();
                Global.Data.ModelProAna.ObjectId = $('#wk-name option:selected').val();
                SaveCommoAnalysis();
                $('[cancel-workshop]').click();
            }
        });
        $('[cancel-workshop]').click(function () {
            $('#wk-name').val('');
            $('#workshop-Description').val('');
        });
        $('#' + Global.Element.CreateWorkShopPopup).on('shown.bs.modal', function () {
            $('div.divParent').attr('currentPoppup', Global.Element.CreateWorkShopPopup.toUpperCase());
        });
        /*******************            STEP 3 CREATE PHASE GROUP           ****************************************/
        $('#' + Global.Element.CreatePhaseGroupPopup).on('shown.bs.modal', function () {
            $('div.divParent').attr('currentPoppup', Global.Element.CreatePhaseGroupPopup.toUpperCase());
        });
        $('[re_phasegroup-name]').click(function () {
            GetPhaseGroupSelect('phaseGroup-name');
        });
        $('[save-phasegroup]').click(function () {
            if ($('#phaseGroup-name option:selected').val() == '' || $('#phaseGroup-name option:selected').val() == '0') {
                GlobalCommon.ShowMessageDialog('Bạn chưa chọn cụm công đoạn.', function () { }, "Lỗi nhập liệu");
            }
            else {
                Global.Data.ModelProAna.Description = $('#phaseGroup-Description').val();
                Global.Data.ModelProAna.Name = $('#phaseGroup-name option:selected').text();
                Global.Data.ModelProAna.ObjectId = $('#phaseGroup-name option:selected').val();
                SaveCommoAnalysis();
            }
        });
        $('[cancel-phasegroup]').click(function () {
            $('#phaseGroup-name').val(0);
            $('#phaseGroup-Description').val('');
        });
        //#region *************************************************  TIME PREPARE  ***************************************************** */
        // choose
        $('#' + Global.Element.timeprepare_Popup).on('shown.bs.modal', function () {
            $('#' + Global.Element.CreatePhasePopup).hide();
            ReloadListTimePrepare_Chooise();
            $('div.divParent').attr('currentPoppup', Global.Element.timeprepare_Popup.toUpperCase());
        });
        $('#choose-time').click(function () {
            var $selectedRows = $('#' + Global.Element.jtable_Timeprepare_Chooise).jtable('selectedRows');
            if ($selectedRows.length > 0) {
                successCount = 0;
                flag = false;
                //Show selected rows
                $selectedRows.each(function () {
                    var record = $(this).data('record');
                    flag = false;
                    //push record into array 
                    $.each(Global.Data.TimePrepareArray, function (i, item) {
                        if (item.TimePrepareId == record.Id) {
                            GlobalCommon.ShowMessageDialog("Thời Gian Chuẩn Bị này đã được chọn. Vui lòng kiểm tra lại.!", function () { }, "Thông báo Thời Gian Chuẩn Bị Tồn Tại");
                            flag = true;
                            return false;
                        }
                    });
                    if (!flag) {
                        obj = {
                            Id: record.Id,
                            TimePrepareId: record.Id,
                            Name: record.Name,
                            Code: record.Code,
                            TimeTypePrepareName: record.TimeTypePrepareName,
                            Description: record.Description,
                            TMUNumber: record.TMUNumber
                        }
                        Global.Data.TimePrepareArray.push(obj);
                        successCount++;
                    }
                });
                if (successCount > 0) {
                    $('#' + Global.Element.timeprepare_Popup).modal('hide');
                    $('#' + Global.Element.CreatePhasePopup).show();
                    // GlobalCommon.ShowMessageDialog("Đã thêm " + successCount + " Thời Gian Chuẩn Bị thành công.!", function () { }, "Thông báo Thêm Thành Công");
                    ReloadListTimePrepare();
                    // $('#' + Global.Element.jtable_timeprepare_arr).jtable('deselectRows');
                    $('.jtable-row-selected').removeClass('jtable-row-selected');

                    Global.Data.PhaseModel.IsTimePrepareChange = true;
                    UpdateTotalTimeVersion();
                }
                $('div.divParent').attr('currentPoppup', Global.Element.jtablePhase.toUpperCase());
            }
            else {
                GlobalCommon.ShowMessageDialog("Không có Thời Gian Chuẩn Bị nào được chọn. Vui lòng kiểm tra lại.!", function () { }, "Thông báo Chưa chọn Thời Gian Chuẩn Bị");
            }
        });
        $('[close-time]').click(function () {
            $('#' + Global.Element.CreatePhasePopup).show();
            $('div.divParent').attr('currentPoppup', Global.Element.CreatePhasePopup.toUpperCase());
        });
        // search
        $('#' + Global.Element.timeprepare_Popup_Search).on('shown.bs.modal', function () {
            $('#' + Global.Element.timeprepare_Popup).css('z-index', 0);
        });
        $('#search-time').click(function () {
            ReloadListTimePrepare_Chooise();
            $('[close-search-time]').click();
        });
        $('[close-search-time]').click(function () {
            $('#' + Global.Element.timeprepare_Popup).css('z-index', 1040);
            $('#keyword-time').val('');
            $('#searchBy-time').val(0);
            $('#timeType option:eq(0)').prop('selected', true);
        });
        //#endregion

        //#region *************************************************** PHASE ****************************************************/ 
        $('#' + Global.Element.CreatePhasePopup).on('shown.bs.modal', function () {
            $('div.divParent').attr('currentPoppup', Global.Element.CreatePhasePopup.toUpperCase());
        });
        $('#hid_video').change(function () { SavePhase(); });
        $('[save-phase]').click(function () {
            if (Check_Phase_Validate()) {
                if ($('#video').val() != '')
                    UploadVideo();
                else
                    SavePhase();
            }
        });
        $('[cancel-create-phase]').click(function () {
            Global.Data.TimePrepareArray.length = 0;
            ReloadListTimePrepare();
            Global.Data.PhaseManiVerDetailArray.length = 0;
            Global.Data.isInsertPhase = true;
            AddEmptyObject();
            ReloadListMani_Arr();
            $('div.divParent').attr('currentPoppup', Global.Element.jtablePhase.toUpperCase());
            Global.Data.Video = '';
            $('#video').val('');
            $('#phase-index').val('');
            $('#TotalTMU,#TotalMay').html('0');
            $('#phase-code').html(((Global.Data.PhaseAutoCode == null || Global.Data.PhaseAutoCode == '' ? '' : (Global.Data.PhaseAutoCode + '-')) + (Global.Data.phaseLastIndex + 1)));

            var video = document.getElementsByTagName('video')[0];
            var sources = video.getElementsByTagName('source');
            sources[0].src = '';
            sources[1].src = '';
            video.load();

        });

        $('#remove-video').click(() => {
            removeVideo();
        })
        //#endregion

        //#region *********************************************** Equipment ********************************************************/ 
        $('#' + Global.Element.PopupSearchEquipment).on('shown.bs.modal', function () {
            $('#' + Global.Element.PopupChooseEquipment).css('z-index', 0);
            $('div.divParent').attr('currentPoppup', Global.Element.PopupSearchEquipment.toUpperCase());
        });
        $('[searchEquipment]').click(function () {
            ReloadListEquipment();
            $('[cancel_search_equip]').click();
        });
        $('[cancel_search_equip]').click(function () {
            $('#keywordequipment').val('');
            $("#" + Global.Element.PopupSearchEquipment).modal("hide");
            $('#' + Global.Element.PopupChooseEquipment).css('z-index', 1040);
            $('div.divParent').attr('currentPoppup', Global.Element.PopupChooseEquipment.toUpperCase());
        });
        $('#equipmentName').click(function () {
            ReloadListEquipment(); $('#' + Global.Element.CreatePhasePopup).hide();
            $('div.divParent').attr('currentPoppup', Global.Element.PopupChooseEquipment.toUpperCase());
        });
        $('[chooseequipment_popupclose]').click(function () {
            $('#' + Global.Element.CreatePhasePopup).show();
            $('div.divParent').attr('currentPoppup', Global.Element.CreatePhasePopup.toUpperCase());
        });

        $('#' + Global.Element.CreateManipulationVersion).on('hide.bs.modal', function () {
            var $divButton = $('#buttonmanipulation');
            $divButton.html('');
            BindManipulationVersionData(null);
        });

        $('[save-manipulationversion]').click(function () {
            if (Check_ManiVersion_Validate()) {
                obj = {
                    Id: $('#maniVerId').val(),
                    Commo_Ana_PhaseId: Global.Data.Commo_Ana_PhaseId,
                    VersionNumber: $('#version-number').val(),
                    IsActive: Global.Data.isSave_App_Ac_ManiVersion,
                    IsApprove: Global.Data.isApproveManiVersion,
                    Note: $('#mani_ver_note').val(),
                    TotalTMU: $('#mani-ver-TotalTMU').val(),
                    IsDetailChange: Global.Data.ManipulationVersionModel.IsDetailChange,
                    PercentWasteEquipment: $('[percentEquipment]').val(),
                    PercentWasteManipulation: $('[percentManipulation]').val(),
                    PercentWasteSpecial: $('[percentDB]').val(),
                    PercentWasteMaterial: $('[percentNPL]').val(),
                    EquipmentId: $('#equipmentId').val(),
                    ApplyPressuresId: $('#ApplyPressure').val()
                }
                Global.Data.ManipulationVersionModel = obj;
                SaveManipulationVersion();
                Global.Data.IsClear = false;
                Global.Data.isApproveManiVersion = false;
                Global.Data.isSave_App_Ac_ManiVersion = false;
            }
        });

        $('[cancel-create-maniver]').click(function () {
            BindManipulationVersionData(null);
            Global.Data.PhaseManiVerDetailArray.length = 0;
            $('#' + Global.Element.CreateManipulationVersion).modal('hide');
            $('#' + Global.Element.CreatePhasePopup).css('z-index', '1041');
            Global.Data.IsClear = false;
            $('#Create-ManipulationVersion-Popup .modal-footer button:contains("Xuất File Excel")').remove();
        });
        //#endregion

        //#region ******************************* Tech process *****************************************************/
        $('#tile-parent').change(function () {
            value = $(this).val();
            var $selectedRows = $('#' + Global.Element.JtableTech_Cycle).find('tbody tr')
            if ($selectedRows.length > 0) {
                time_product = 0;
                $selectedRows.each(function (i, item) {
                    $(this).find('[percent]').val(value);
                    time = parseFloat(Global.Data.TechCycle_Arr[i].StandardTMU);
                    time_per = Math.round(((time * 100) / parseFloat(value)) * 1000) / 1000;

                    $($($(this).find('td'))[6]).html(ParseStringToCurrency(time_per));
                    Global.Data.TechCycle_Arr[i].TimeByPercent = time_per;
                    time_product += time_per;

                });
                $('#time-product').html(Math.round(time_product * 1000) / 1000);
                Global.Data.TimeProductPerCommodity = time_product;
                ResetWorkingBox(0);
            }
        });
        $('#total-worker').change(function () {
            ResetWorkingBox(0);
        });

        $('#work-time').change(function () {
            ResetWorkingBox(0);
        });

        $('[techsave]').click(function () {
            //if (CheckValidate()) {
            GetData();
            SaveTechVersion();
            // }
        });

        $('[techexport]').click(function () {
            if (Global.Data.AfterSave) {
                window.location.href = Global.UrlAction.ExportToExcel + "?parentId=" + Global.Data.ParentID + "&fileType=" + 3;
                Global.Data.AfterSave = false;
            }
            else {
                Global.Data.AfterSave = true;
                $('[techsave]').click();
            }

        });
        //#endregion

        //#region ********************************************* Waste **********************************************************/ 
        // hao phi thiet bi
        $('input[percentEquipment]').change(function () {
            if ($('input[percentEquipment]').val() != "") {
                UpdateIntWaste();
            }
        });

        //hao phi tay chan
        $('input[percentManipulation]').change(function () {
            if ($('input[percentManipulation]').val() != "") {
                UpdateIntWaste();
            }
        });

        // hao phi dac biet
        $('input[percentDB]').change(function () {
            if ($('input[percentDB]').val() != "") {
                UpdateIntWaste();
            }
        });

        // hao phi nguyen phu lieu
        $('input[percentNPL]').change(function () {
            if ($('input[percentNPL]').val() != "") {
                UpdateIntWaste();
            }
        });
        //#endregion

        //#region *******************            STEP 4 CREATE PHASE          ****************************************/
        // group version + thanh phan
        $('[save-step3]').click(function () {
            Global.Data.ModelProAna.Description = $('#cc-Des').val();
            Global.Data.ModelProAna.Name = $('#cc-name').val();
            SaveCommoAnalysis();
        });

        // save phase version
        $('[save-phase-ver]').click(function () {
            if (CheckPhaseVersionValidate()) {
                vitri = Global.Data.Node.split(',')[1];
                $.each(Global.Data.ProAnaArray, function (index, item) {
                    if (item.Id == vitri) {
                        Global.Data.ModelPhaseVersion.CommodityId = item.ObjectId;
                        return;
                    }
                });
                Global.Data.ModelPhaseVersion.Node = Global.Data.Node + Global.Data.ParentID + ',';
                Global.Data.ModelPhaseVersion.ParentId = Global.Data.ParentID;
                Global.Data.ModelPhaseVersion.IsApprove = false;
                Global.Data.ModelPhaseVersion.IsActive = false;
                CreatePhaseVerion();
            }
        });

        $('[save_app-phase-ver]').click(function () {
            if (CheckPhaseVersionValidate()) {
                vitri = Global.Data.Node.split(',')[1];
                $.each(Global.Data.ProAnaArray, function (index, item) {
                    if (item.Id == vitri) {
                        Global.Data.ModelPhaseVersion.CommodityId = item.ObjectId;
                        return;
                    }
                });
                Global.Data.ModelPhaseVersion.Node = Global.Data.Node + Global.Data.ParentID + ',';
                Global.Data.ModelPhaseVersion.ParentId = Global.Data.ParentID;
                Global.Data.ModelPhaseVersion.IsApprove = true;
                Global.Data.ModelPhaseVersion.IsActive = false;
                CreatePhaseVerion();
            }
        });

        $('#' + Global.Element.PopupChooisePhase).on('shown', function () {
            $('#' + Global.Element.CreatePhaseVersionPopup).css('z-index', 1040);
            ReloadListPhase_Choose();
        });

        $('#' + Global.Element.PopupChooisePhase).on('hide', function () {
            $('#' + Global.Element.CreatePhaseVersionPopup).css('z-index', 1041);
        });

        $('#' + Global.Element.CreatePhaseVersionPopup).on('shown', function () {
            if (Global.Data.ModelPhaseVersion.IsApprove || Global.Data.ModelPhaseVersion.IsActive) {
                $('[save_app-phase-ver]').hide();
                $('[save-phase-ver]').hide();
            }
            else {
                $('[save_app-phase-ver]').show();
                $('[save-phase-ver]').show();
            }
        });

        $('#maniVersion').change(function () {
            if ($(this).val() != '0')
                GetPhaseVersionManipulationByManipulationVersionId($(this).val());
        });

        $('#' + Global.Element.CreatePhasePopup).on('shown.bs.modal', function () {
            if (Global.Data.isInsertPhase) {
                $('#phase-code').html(((Global.Data.PhaseAutoCode == null || Global.Data.PhaseAutoCode == '' ? '' : (Global.Data.PhaseAutoCode + '-')) + (Global.Data.phaseLastIndex + 1)));
                $('#phase-index').val((Global.Data.phaseLastIndex + 1));
                $('[percentequipment],[percentdb],[percentnpl').val(0);
                $('[percentmanipulation]').val($('#config').attr('maniexpenddefault'));
            }
        });

        $('[cancel-create-phase-ver]').click(function () {
            Global.Data.PhaseVersiondetailArray.length = 0;
            ReloadListPhaseVerDetailArr();
            BindPhaseVersionData(null);

        });

        $('[add-phase]').click(function () {
            var $selectedRows = $('#' + Global.Element.jtablePhase_Chooise).jtable('selectedRows');
            if ($selectedRows.length > 0) {
                var successCount = 0;
                var flag = false;
                //Show selected rows
                $selectedRows.each(function () {
                    var record = $(this).data('record');
                    flag = false;
                    // ktra trung
                    $.each(Global.Data.PhaseVersiondetailArray, function (i, item) {
                        if (item.Commo_Ana_PhaseId == record.Id) {
                            GlobalCommon.ShowMessageDialog("Công Đoạn này đã được chọn. Vui lòng kiểm tra lại.!", function () { }, "Thông báo Công Đoạn Tồn Tại");
                            flag = true; return;
                        }
                    });
                    // add new
                    if (!flag) {
                        obj = {
                            Id: record.Id,
                            Commo_Ana_PhaseId: record.Id,
                            Como_Ana_PhaseVerId: 0,
                            OrderIndex: Global.Data.PhaseVersiondetailArray.length + 1,

                            Name: record.Name,
                            WorkerLevelId: record.WorkerLevelId,
                            WorkerLevelName: record.WorkerLevelName,
                            Code: record.Code,
                            TotalTMU: record.TotalTMU,
                            Description: record.Description,
                        }
                        Global.Data.PhaseVersiondetailArray.push(obj);
                        successCount++;
                    }
                });
                if (successCount > 0) {
                    $('#' + Global.Element.PopupChooisePhase).modal('hide');
                    $('#' + Global.Element.CreateManipulationVersion).css('z-index', 1041);
                    GlobalCommon.ShowMessageDialog("Đã thêm " + successCount + " Công Đoạn thành công.!", function () { }, "Thông Báo");
                    ReloadListPhaseVerDetailArr();

                    $('#' + Global.Element.jtablePhase_Chooise).jtable('deselectRows');
                    var total = 0;
                    $.each(Global.Data.PhaseVersiondetailArray, function (index, item) {
                        total += item.TotalTMU;
                        // alert(item.TotalTMU);

                    });
                    $('#pver-tmu').val((Math.round(total * 1000) / 1000));
                    Global.Data.ModelPhaseVersion.TotalTMU = Math.round(total * 1000) / 1000;
                    Global.Data.ModelPhaseVersion.isDetailsChange = true;
                }
            }
            else {
                GlobalCommon.ShowMessageDialog("Không có Công Đoạn nào được chọn. Vui lòng kiểm tra lại.!", function () { }, "Thông báo Chưa chọn Công Đoạn");
            }
        });

        $('#phase-suggest').click(() => {
            $('#phase-suggest').select();
        })

        $('#phase-suggest').change(() => {
            var selectValue = $('#phase-suggest').val();
            if (selectValue != '') {
                var found = Global.Data.PhasesSuggest.filter((item, i) => {
                    return (item.Name == selectValue || item.Code == selectValue);
                })[0];
                if (found != null) {
                    // GlobalCommon.ShowMessageDialog("Thông tin Công Đoạn : " + found.Name + " (<b class='red'>" + found.Code + "</b>) tổng TMU : " + found.Double, function () { }, "Thông báo");

                    $('#phase-suggest').val(found.Name + " ( " + found.Code + " ) tổng TMU : " + found.Double);
                    Global.Data.SuggestPhaseId = found.Value;
                }
                else {
                    GlobalCommon.ShowMessageDialog("Không tìm thấy thông tin Công Đoạn : <b class='red'>" + selectValue + "</b> ", function () { }, "Thông báo");
                }
            }
        });

        $('[save-sugguest-phase]').click(() => {
            var selectValue = $('#phase-suggest').val();
            if (selectValue != '') {
                GetPhasesById();
                // alert(selectValue)
            }
            else {
                GlobalCommon.ShowMessageDialog("Vui lòng nhập tên hoặc mã Công Đoạn vào ô <b class='red'>Tìm Công Đoạn</b>", function () { }, "Thông báo");
            }
        });
        //#endregion
    }

    /********************************************************************************************************************        
                                                   NO NAME
     ********************************************************************************************************************/
    function InitProAnaViewModel(noName) {
        var noNameViewModel = {
            Id: 0,
            Name: '',
            ObjectType: 0,
            ObjectId: 0,
            ParentId: 0,
            Node: '',
            Description: ''
        };
        if (noName != null) {
            noNameViewModel = {
                Id: ko.observable(noName.Id),
                Name: ko.observable(noName.Name),
                ObjectType: ko.observable(noName.ObjectType),
                ObjectId: ko.observable(noName.ObjectId),
                ParentId: ko.observable(noName.ParentId),
                Node: ko.observable(noName.Node),
                Description: ko.observable(noName.Description)
            };
        }
        return noNameViewModel;
    }

    function BindProAnaData(noName) {
        Global.Data.ModelProAna = InitProAnaViewModel(noName);
        ko.applyBindings(Global.Data.ModelProAna, document.getElementById('popup_Commodity'));
    }

    function SaveCommoAnalysis() {
        if (Global.Data.ModelProAna.Id == 0) {
            $.each(Global.Data.ProAnaArray, function (index, item) {
                if (item.Id == Global.Data.ParentID) {
                    Global.Data.ModelProAna.Node = item.Node; return;
                }
            });
        }
        Global.Data.ModelProAna.ObjectType = Global.Data.ObjectType;
        Global.Data.ModelProAna.ParentId = Global.Data.ParentID < 0 ? 0 : Global.Data.ParentID;
        var _url = '';
        switch (Global.Data.ObjectType) {
            case 1: _url = '/ProAna/SaveProduct'; break;
            case 2:
            case 3: _url = '/ProAna/SaveWorkshop'; break;
            case 6:
            case 7: _url = '/ProAna/SavePhaseGroup'; break;
        }
        $.ajax({
            url: _url,
            type: 'post',
            data: ko.toJSON(Global.Data.ModelProAna),
            contentType: 'application/json',
            beforeSend: function () { $('#loading').show(); },
            success: function (result) {
                $('#loading').hide();
                GlobalCommon.CallbackProcess(result, function () {
                    if (result.Result == "OK") {
                        Global.Data.year.length = 0;
                        Global.Data.month.length = 0;
                        Global.Data.ProAnaArray.length = 0;
                        Global.Data.TreeSelectItem = null;
                        ResetProAnaTreeView();
                        $('#' + Global.Element.CreateCommodityPopup).modal('hide');
                        $('#' + Global.Element.CreateWorkShopPopup).modal('hide');
                        $('#' + Global.Element.CreatePhaseVersionPopup).modal('hide');
                        $('#' + Global.Element.CreatePhaseGroupPopup).modal('hide');
                        $('#phaseGroup-name').val('');
                        $('#phaseGroup-Description').val('');
                        $('#caDescription').val('');
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

    function Delete(Id) {
        var _url = '';
        switch (Global.Data.ObjectType) {
            case 2: _url = '/ProAna/DeleteProduct'; break;
            case 3: _url = '/ProAna/DeleteWorkshop'; break;
            case 7: _url = '/ProAna/DeletePhaseGroup'; break;
        }
        $.ajax({
            url: _url,
            type: 'POST',
            data: JSON.stringify({ 'Id': Id }),
            contentType: 'application/json charset=utf-8',
            beforeSend: function () { $('#loading').show(); },
            success: function (data) {
                $('#loading').hide();
                GlobalCommon.CallbackProcess(data, function () {
                    if (data.Result == "OK") {
                        var element = $("#" + Id)[0];
                        $('#jqxTree').jqxTree('removeItem', element);
                        $('#left').scrollTop(Global.Data.position);
                    }
                    else
                        GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình xử lý.");
                }, false, Global.Element.PopupProAna, true, true, function () {
                    var msg = GlobalCommon.GetErrorMessage(data);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
                });
            }
        });
    }

    function ResetData() {
        $('#keyword').val('');
        $('[SearchProductType]').val('0');
        $('[ProductType]').val('0');
        $('#key').hide();
        $('#ProType').hide();
        $('#searchBy').val('0');
        $('#des').val('');
    }

    function LoadProAna() {
        $.ajax({
            url: Global.UrlAction.GetListnoName,
            type: 'POST',
            data: '',
            contentType: 'application/json charset=utf-8',
            success: function (data) {
                GlobalCommon.CallbackProcess(data, function () {
                    if (data.Result == "OK") {
                        Global.Data.year.length = 0;
                        Global.Data.month.length = 0;
                        Global.Data.index = 0;
                        ResetProAnaTreeView();
                        $('#jqxTree').jqxTree('refresh');
                    }
                    else
                        GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình xử lý.");
                }, false, Global.Element.PopupProductType, true, true, function () {

                    var msg = GlobalCommon.GetErrorMessage(data);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
                });
            }
        });
    }

    //#region ***************************************** TREE VIEW *****************************************************/
    function ResetProAnaTreeView() {
        Global.Data.year.length = 0;
        Global.Data.month.length = 0;
        Global.Data.index = 0;
        if (Global.Data.position != 0)
            Global.Data.height = Global.Data.position;
        //clear old item
        $('#jqxTree').jqxTree('clear');
        var data = [];
        if (!Global.Data.is) {
            var obj = {
                'id': -10001,
                'parentid': -10002,
                'text': '<span style=\'color: red; font-weight:bold; font-size:16px\'>Công Ty </span>',
                'value': '0',
                'icon': '/Images/Company.png',
                'iconsize': 14
            }
        }
        else {
            var obj = {
                'id': -10000,
                'parentid': -10002,
                'text': '<span style=\'color: red; font-weight:bold; font-size:16px\'>Công Ty </span>',
                'value': '0',
                'icon': '/Images/Company.png',
                'iconsize': 14
            }
        }
        data.push(obj);
        var source =
        {
            datatype: "json",
            datafields: [
                { name: 'id' },
                { name: 'parentid' },
                { name: 'text' },
                { name: 'value' },
                { name: 'icon' },
            ],
            id: 'id',
            localdata: data
        };
        var dataAdapter = new $.jqx.dataAdapter(source);
        dataAdapter.dataBind();
        var records = dataAdapter.getRecordsHierarchy('id', 'parentid', 'items', [{ name: 'text', map: 'label' }]);
        $('#jqxTree').jqxTree({ source: records, width: '100%' });
        $('#jqxTree').jqxTree('refresh');
        if (Global.Data.TreeSelectItem != null)
            $('#jqxTree').jqxTree('expandItem', Global.Data.TreeSelectItem);
        var contextMenu = $("#jqxMenu").jqxMenu({ width: '250px', height: '86px', autoOpenPopup: false, mode: 'popup' });
        var attachContextMenu = function () {
            $("#jqxTree li").on('mousedown', function (event) {
                var target = $(event.target).parents('li:first')[0];
                var rightClick = isRightClick(event);
                if (rightClick && target != null) {
                    $("#jqxTree").jqxTree('selectItem', target);
                    var scrollTop = $(window).scrollTop();
                    var scrollLeft = $(window).scrollLeft();
                    contextMenu.jqxMenu('open', parseInt(event.clientX) + 5 + scrollLeft, parseInt(event.clientY) + 5 + scrollTop);
                    return false;
                }
            });
        }
        attachContextMenu();
        refresh_Tree();
        if (!Global.Data.is) {
            GetCommoAnaItems(-10001, 0, 11, null);
            Global.Data.is = true;
        }
        else
            GetCommoAnaItems(-10000, 0, 11, null);
    }

    $("#jqxMenu").on('itemclick', function (event) {
        var item = $.trim($(event.args).text());
        var selectedItem = $('#jqxTree').jqxTree('selectedItem');
        switch (item) {
            case "Thêm Mới mã hàng":
                $("#jqxMenu").jqxMenu('close');
                $('#' + Global.Element.CreateCommodityPopup).modal('show');
                BindProAnaData(null);
                $('#caproduct').prop('disabled', false);
                break;
            case "Xóa mã hàng":
                if (selectedItem != null) {
                    Global.Data.ParentID = selectedItem.parentId;
                    GlobalCommon.ShowConfirmDialog('Bạn có chắc chắn muốn xóa?', function () {
                        Delete(selectedItem.id);
                    }, function () { }, 'Đồng ý', 'Hủy bỏ', 'Thông báo');
                }
                break;
            case "Xem Thông Tin mã hàng":
                if (selectedItem != null) {
                    var obj = {};
                    $.each(Global.Data.ProAnaArray, function (index, item) {
                        if (item.Id == parseInt(selectedItem.id)) { obj = item; return; }
                    });
                    BindProAnaData(obj);
                    $('#caproduct').val(obj.ObjectId);
                    $('#Description').val(obj.Description);
                    $('#caproduct').prop('disabled', true);
                    $('#' + Global.Element.CreateCommodityPopup).modal('show');
                }
                break;
            case "Thêm Mới Phân Xưởng":
                $("#jqxMenu").jqxMenu('close');
                $('#' + Global.Element.CreateWorkShopPopup).modal('show');
                BindProAnaData(null);
                $('#wk-name').prop('disabled', false);
                break;
            case "Xóa Phân Xưởng":
                if (selectedItem != null) {
                    GlobalCommon.ShowConfirmDialog('Bạn có chắc chắn muốn xóa?', function () {
                        Delete(selectedItem.id);
                        Global.Data.ParentID = selectedItem.parentId;
                    }, function () { }, 'Đồng ý', 'Hủy bỏ', 'Thông báo');
                }
                break;
            case "Xem Thông Tin Phân Xưởng":
                if (selectedItem != null) {
                    var obj = {};
                    $.each(Global.Data.ProAnaArray, function (index, item) {
                        if (item.Id == parseInt(selectedItem.id)) {
                            obj = item;
                            return;
                        }
                    })
                    BindProAnaData(obj);
                    $('#wk-name').val(obj.ObjectId);
                    $('#wk-name').prop('disabled', true);
                    $('#workshop-Description').val(obj.Description);
                    $('#' + Global.Element.CreateWorkShopPopup).modal('show');
                }
                break;
            case "Thêm Mới cụm công đoạn":
                $("#jqxMenu").jqxMenu('close');
                $('#' + Global.Element.CreatePhaseGroupPopup).modal('show');
                BindProAnaData(null);
                Global.Data.ParentID = selectedItem.id;
                $('#phaseGroup-name').prop('disabled', false);
                break;
            case "Xóa cụm công đoạn":
                if (selectedItem != null) {
                    Global.Data.ParentID = selectedItem.parentId;
                    GlobalCommon.ShowConfirmDialog('Bạn có chắc chắn muốn xóa?', function () {
                        Delete(selectedItem.id);
                    }, function () { }, 'Đồng ý', 'Hủy bỏ', 'Thông báo');
                }
                break;
            case "Xem Thông Tin cụm công đoạn":
                if (selectedItem != null) {
                    var obj = {};
                    $.each(Global.Data.ProAnaArray, function (index, item) {
                        if (item.Id == parseInt(selectedItem.id)) {
                            obj = item;
                            return;
                        }
                    });
                    BindProAnaData(obj);
                    $('#phaseGroup-name').val(obj.ObjectId);
                    $('#phaseGroup-name').prop('disabled', true);
                    $('#phaseGroup-Description').val(obj.Description);
                    $('#' + Global.Element.CreatePhaseGroupPopup).modal('show');
                }
                break;
            case "Sao Chép cụm công đoạn":
                $("#jqxMenu").jqxMenu('close');
                Global.Data.Copy_CommoAnaPhaseGroupId = selectedItem.id;
                break;
            case "Dán cụm công đoạn":
                $("#jqxMenu").jqxMenu('close');
                Global.Data.ParentID = selectedItem.id;
                Copy_CommoAnaPhaseGroup();
                break;
        }
        if (Global.Data.position != 0)
            Global.Data.height = Global.Data.position;
    });

    $(document).on('contextmenu', function (e) {
        if ($(e.target).parents('.jqx-tree').length > 0)
            return false;
        return true;
    });

    function isRightClick(event) {
        var rightclick;
        if (!event) var event = window.event;
        if (event.which) rightclick = (event.which == 3);
        else if (event.button) rightclick = (event.button == 2);
        return rightclick;
    }

    $('#jqxTree').on('select', function (event) {
        var args = event.args;
        var selectItem = $('#jqxTree').jqxTree('getItem', args.element);
        if (selectItem.level == 1)
            Global.Data.yearStr = selectItem.label;
        Global.Data.TreeSelectItem = selectItem;
        type = parseInt(selectItem.value);
        Global.Data.ObjectType = (type + 1);
        Global.Data.ParentID = selectItem.id;

        var findObj = {};
        $.each(Global.Data.ProAnaArray, function (index, item) {
            if (item.Id == selectItem.id) {
                Global.Data.ModelProAna.Node = item.Node;
                Global.Data.Node = item.Node;
                Global.Data.PhaseNode = item.Node + item.Id + ',';
                $('#txt_commo_anna_phase').attr('phaseNode', item.Node + item.Id + ',');
                Global.Data.ObjectId = item.ObjectId;
                findObj = item;
                return;
            }
        });

        $('[type="1"]').hide();
        $('[type="1a"]').hide();
        $('[type="2"]').hide();
        $('[type="2a"]').hide();
        $('[type="6"]').hide();
        $('[type="6a"]').hide();
        $('#jqxMenu').css('opacity', '1');
        $('#jqxMenu').css('height', '83px');
        switch (type) {
            case 11:
            case 13:
                $('#jqxMenu').css('opacity', '0');
                break;
            case 0:
                $('[type="' + (type + 1) + '"]').show();
                $('#jqxMenu').css('height', '30px');
                break;
            case 1:
                $('[type="' + (type + 1) + '"]').show();
                $('[type="' + type + 'a"]').show();
                break;
            case 2:
                $('[type="' + type + 'a"]').show();
                $("#jqxMenu").css('height', '56px');
                break;
            case 3:
                $('#jqxMenu').css('opacity', '0');
                $('#' + Global.Element.jtablePhase + ',#jtable_tkc').hide();
                $('#' + Global.Element.jtablePhaseVersion).show();
                $.each(Global.Data.ProAnaArray, function (index, item) {
                    if (item.Id == findObj.ParentId) {
                        workshopId = item.ObjectId;
                        $.each(Global.Data.ProAnaArray, function (ii, item1) {
                            if (item1.Id == item.ParentId) {
                                Global.Data.productId = item1.ObjectId;
                                return;
                            }
                        });
                        return;
                    }
                });
                Global.Data.warningChuaCoQTCN = false;
                GetTechProcess(findObj.Node, Global.Data.ParentID);
                $('div.divParent').attr('currentPoppup', ('techprocess').toUpperCase());
                break;
            case 5:
                $('[type="' + (type + 1) + '"]').show();
                if (Global.Data.Copy_CommoAnaPhaseGroupId != 0) {
                    $('#paste').show();
                    $('#jqxMenu').css('height', '56px');
                }
                else
                    $('#jqxMenu').css('height', '30px');
                break;
            case 6:
                $("#jqxMenu").css('height', '83px');
                $('[type="' + type + 'a"]').show();

                $('#' + Global.Element.jtablePhaseVersion).hide();

                // dua thong tin ra ngoai 
                id = parseInt(Global.Data.Node.split(',')[2]);
                $.each(Global.Data.ProAnaArray, function (index, item) {
                    if (item.Id == id) {
                        //Global.Data.WorkShopId = item.ObjectId;
                        $('#txt_commo_anna_phase').attr('workshop', item.ObjectId);
                        $('#txt_commo_anna_phase').attr('parentid', Global.Data.ParentID);
                        $('#txt_commo_anna_phase').attr('phaseGroup', Global.Data.ObjectId);
                        $('#txt_commo_anna_phase').attr('phaseNode', item.Node);
                        return false;
                    }
                });
                $('#txt_commo_anna_phase').change();
                Global.Data.PhaseAutoCode = findObj.Description;
                Global.Data.phaseLastIndex = 0;
                $('#' + Global.Element.jtablePhase).find('.jtable-title-text').html('Danh Sách Công Đoạn của Nhóm : <span class="red"> ' + selectItem.label + '</span>');
                //  ReloadListAccessories();/
                ReloadListPhase_View();
                ReloadListTimePrepare();
                GetLastPhaseIndex();
                $('#' + Global.Element.jtablePhase).show();
                $('#techprocess,#jtable_tkc').hide();
                $('div.divParent').attr('currentPoppup', Global.Element.jtablePhase.toUpperCase());
                break;
            case 8:
                $('#techprocess,#jtable-phase').hide();
                $('#jtable_tkc').show();
                $('#jtable_tkc').attr('parentid', Global.Data.ParentID);
                $('#jtable_tkc').attr('node', findObj.Node);
                $('#jtable_tkc').attr('pId', findObj.ParentId);

                $.each(Global.Data.ProAnaArray, function (index, item) {
                    if (item.Id == findObj.ParentId) {
                        $('#jtable_tkc').attr('wkId', item.ObjectId);
                        $('#jtable_tkc').attr('wkName', item.Name);
                        $('#workshop_').html(item.Name);
                        return false;
                    }
                });
                $('#jtable_tkc').change();
                Global.Data.warningChuaCoQTCN = true;
                var _parentId = parseInt(Global.Data.ParentID) - 1;
                GetTechProcess(findObj.Node, _parentId);
                break;
        }
    });

    function GetCommoAnaItems(parentId, value, getType, loaderItem) {
        $.ajax({
            url: Global.UrlAction.GetCommoAnaItem,
            type: 'POST',
            data: JSON.stringify({ 'parentId': parentId, 'value': value, 'Type': getType, 'year': Global.Data.yearStr }),
            contentType: 'application/json charset=utf-8',
            beforeSend: function () { $('#loading').show(); },
            success: function (data) {
                GlobalCommon.CallbackProcess(data, function () {
                    if (data.Result == "OK") {
                        var elementByID = $('#jqxTree').find("#" + parentId)[0];
                        if (getType > 10) {
                            if (data.Data != null && data.Data.years != null && data.Data.years.length > 0) {
                                var id = 0;
                                $.each(data.Data.years, function (i, item) {
                                    switch (getType) {
                                        case 11: id = ((-9999) + Global.Data.year.length); Global.Data.year.push(item); break; //year
                                        case 12: id = ((-9999) + Global.Data.customer.length); Global.Data.customer.push(item); break; // cus
                                        case 13: id = ((-999) + Global.Data.month.length); Global.Data.month.push(item); break; // month
                                    }

                                    var obj = {
                                        'id': id,
                                        'parentid': parentId,
                                        'text': item,
                                        'label': item,
                                        'value': getType,
                                        //'icon': '/Images/note-list.png'
                                    }
                                    $('#jqxTree').jqxTree('addTo', obj, $('#jqxTree').find("#" + parentId)[0]);
                                    //  Global.Data.OrganizationArr.push(item);

                                    obj = {
                                        'id': 'a' + id,
                                        'parentid': id,
                                        'text': 'Loading...',
                                        'label': 'Loading...',
                                        'value': '0',
                                        'icon': ''
                                    }
                                    $('#jqxTree').jqxTree('addTo', obj, $('#jqxTree').find("#" + id)[0]);
                                });
                            }
                        }
                        else {
                            if (data.Data != null && data.Data.CommoAna != null && data.Data.CommoAna.length > 0) {
                                $.each(data.Data.CommoAna, function (i, item) {
                                    //  if (item.Name != 'Thiết kế chuyền') {
                                    var obj = {
                                        'id': item.Id,
                                        'parentid': parentId,
                                        'text': item.Name,
                                        'label': item.Name,
                                        'value': item.ObjectType,
                                        'icon': '/Images/' + Global.Data.Images[item.ObjectType]
                                    }
                                    $('#jqxTree').jqxTree('addTo', obj, $('#jqxTree').find("#" + parentId)[0]);
                                    Global.Data.ProAnaArray.push(item);
                                    if (item.ObjectType != 6 && item.ObjectType != 3 && item.ObjectType != 8) {
                                        obj = {
                                            'id': 'a' + item.Id,
                                            'parentid': item.Id,
                                            'text': 'Loading...',
                                            'label': 'Loading...',
                                            'value': '0',
                                            'icon': ''
                                        }
                                        $('#jqxTree').jqxTree('addTo', obj, $('#jqxTree').find("#" + item.Id)[0]);
                                    }
                                    //}
                                });
                            }
                        }
                        if (loaderItem != null && parentId != 0) {
                            $('#jqxTree').jqxTree('removeItem', loaderItem.element);
                        }
                        $("#jqxTree").jqxTree('expandItem', $('#' + parentId)[0]);
                        $('#loading').hide();
                        //  $('#left').scrollTop(Global.Data.height > Global.Data.position ? Global.Data.height + 50 : Global.Data.position);

                        if (Global.Data.TreeExpand.length > 0) {
                            $.each(Global.Data.TreeExpand, function (i, item) {
                                if (i > Global.Data.index) {
                                    $("#jqxTree").jqxTree('expandItem', $('#' + item)[0]);
                                    Global.Data.index = i;
                                    return false;
                                }
                                else if (i == Global.Data.index && Global.Data.index == Global.Data.TreeExpand.length - 1) {
                                    $('#left').scrollTop(Global.Data.height >= Global.Data.position ? Global.Data.height + 50 : Global.Data.position);
                                }
                            });
                        }
                    }
                }, false, Global.Element.PopupPosition, true, true, function () {
                    var msg = GlobalCommon.GetErrorMessage(data);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
                });
            }
        });
    }
    //#endregion

    /********************************************************************************************************************        
                                                  STEP 1 CREATE  COMMODITY  
    ********************************************************************************************************************/
    function CheckValidate() {
        if ($('#commodity-name').val().trim() == "") {
            GlobalCommon.ShowMessageDialog("Vui lòng Chọn mã hàng .", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        return true;
    }
    function WorkShopValidate() {
        if ($('#wk-name').val().trim() == "") {
            GlobalCommon.ShowMessageDialog("Vui lòng Chọn Phân Xưởng .", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        return true;
    }
    function PhaseGroupValidate() {
        if ($('#phaseGroup-name').val().trim() == "") {
            GlobalCommon.ShowMessageDialog("Vui lòng Chọn cụm công đoạn.", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        return true;
    }

    //#region ********************************           time prepare arr         ******************************************/
    function InitListTimePrepare() {
        $('#' + Global.Element.jtable_timeprepare_arr).jtable({
            title: 'Danh Sách Thời Gian Chuẩn Bị',
            paging: true,
            pageSize: 1000,
            pageSizeChange: true,
            sorting: true,
            selectShow: true,
            actions: {
                listAction: Global.Data.TimePrepareArray,
                createAction: Global.Element.timeprepare_Popup,
            },
            messages: {
                addNewRecord: 'Thêm mới',
                selectShow: 'Ẩn hiện cột'
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
                    title: "Tên ",
                    width: "20%",
                    display: function (data) {
                        var txt = '<span class="blue bold">' + data.record.Name + '</span>';
                        return txt;
                    }
                },
                Code: {
                    title: "Mã",
                    width: "5%",
                },
                TimeTypePrepareName: {
                    title: "Loại Thời Gian Chuẩn Bị",
                    width: "20%",
                },
                TMUNumber: {
                    title: "Chỉ số TMU",
                    width: "5%",
                    display: function (data) {
                        txt = '<span class="blue bold">' + ParseStringToCurrency(data.record.TMUNumber) + '</span>';
                        return txt;
                    }
                },
                Description: {
                    title: "Mô Tả",
                    width: "20%",
                    sorting: false,
                },
                Delete: {
                    title: '',
                    width: "3%",
                    sorting: false,
                    display: function (data) {
                        var text = $('<button title="Xóa" class="jtable-command-button jtable-delete-command-button"><span>Xóa</span></button>');
                        text.click(function () {
                            GlobalCommon.ShowConfirmDialog('Bạn có chắc chắn muốn xóa?', function () {
                                DeleteTimePrepare(data.record.TimePrepareId);
                            }, function () { }, 'Đồng ý', 'Hủy bỏ', 'Thông báo');
                        });
                        return text;
                    }
                }
            }
        });
    }
    function ReloadListTimePrepare() {
        $('#' + Global.Element.jtable_timeprepare_arr).jtable('load');
    }

    function DeleteTimePrepare(id) {
        flag = false;
        if (typeof (Global.Data.TimePrepareArray) != 'undefined' && Global.Data.TimePrepareArray != null && Global.Data.TimePrepareArray.length > 0) {
            $.each(Global.Data.TimePrepareArray, function (i, item) {
                if (item.TimePrepareId == id) {
                    Global.Data.TimePrepareArray.splice(i, 1);
                    ReloadListTimePrepare();
                    flag = true;
                    Global.Data.PhaseModel.IsTimePrepareChange = true;
                    return false;
                }
            });
        }
        if (flag)
            UpdateTotalTimeVersion();
    }
    //#endregion

    //#region *******************************            time prepare choose            *********************************************/
    function InitListTimePrepare_chooise() {
        $('#' + Global.Element.jtable_Timeprepare_Chooise).jtable({
            title: 'Danh Sách Thời Gian Chuẩn Bị',
            paging: true,
            pageSize: 1000,
            pageSizeChange: true,
            sorting: true,
            selectShow: true,
            selecting: true, //Enable selecting
            multiselect: true, //Allow multiple selecting
            selectingCheckboxes: true, //Show checkboxes on first column
            actions: {
                listAction: Global.UrlAction.GetListTimePrepare,
                searchAction: Global.Element.timeprepare_Popup_Search,
            },
            messages: {
                searchRecord: 'Tìm kiếm',
                selectShow: 'Ẩn hiện cột'
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
                    title: "Tên ",
                    width: "20%",
                    display: function (data) {
                        var txt = '<span class="blue bold">' + data.record.Name + '</span>';
                        return txt;
                    }
                },
                Code: {
                    title: "Mã",
                    width: "5%",
                },
                TimeTypePrepareName: {
                    title: "Loại Thời Gian Chuẩn Bị",
                    width: "20%",
                },
                TMUNumber: {
                    title: "Chỉ số TMU",
                    width: "20%",
                    display: function (data) {
                        txt = '<span class="red bold">' + ParseStringToCurrency(data.record.TMUNumber) + '</span>';
                        return txt;
                    }
                },
                Description: {
                    title: "Mô Tả",
                    width: "20%",
                    sorting: false,
                }
            }
        });
    }
    function ReloadListTimePrepare_Chooise() {
        $('#' + Global.Element.jtable_Timeprepare_Chooise).jtable('load', { 'keyword': $('#keyword-time').val(), 'searchBy': $('#searchBy-time').val() });
    }
    //#endregion

    //#region *******************************************      Tao cong doan   **************************************************/     
    function InitListPhase_View() {
        $('#' + Global.Element.jtablePhase).jtable({
            title: 'Danh sách Công Đoạn',
            paging: true,
            pageSize: 1000,
            pageSizeChange: true,
            sorting: true,
            selectShow: true,
            rowInserted: function (event, data) {
                if (data.record.Id == Global.Data.Commo_Ana_PhaseId) {
                    var $a = $('#' + Global.Element.jtablePhase).jtable('getRowByKey', data.record.Id);
                    $($a.children().find('.aaa')).click();
                }
            },
            actions: {
                listAction: Global.UrlAction.GetListPhase,
                createAction: Global.Element.CreatePhasePopup,
            },
            messages: {
                addNewRecord: 'Thêm mới Công Đoạn',
                selectShow: 'Ẩn hiện cột'
            },
            datas: {
                jtableId: Global.Element.jtablePhase,
            },
            fields: {
                Id: {
                    key: true,
                    create: false,
                    edit: false,
                    list: false
                },
                flag: {
                    width: "3%",
                    display: function (data) {
                        var txt = '';
                        if (data.record.IsLibrary)
                            var txt = $('<i title="công đoạn mẫu" class="fa fa-flag red"  ></i>');
                        return txt;
                    }
                },
                Index: {
                    title: "Mã Công Đoạn",
                    width: "7%",
                    display: function (data) {
                        var txt = '<span class="red bold">' + data.record.Code + '</span>';
                        return txt;
                    }
                },
                Name: {
                    visibility: 'fixed',
                    title: "Tên Công Đoạn",
                    width: "25%",
                },
                WorkerLevelId: {
                    title: "Bậc thợ",
                    width: "5%",
                    display: function (data) {
                        var txt = '<span class="red bold">' + data.record.WorkerLevelName + '</span>';
                        return txt;
                    }
                },
                TotalTMU: {
                    title: "Thời gian thực hiện(s)",
                    width: "5%",
                    display: function (data) {
                        txt = '<span class="red bold">' + Math.round((data.record.TotalTMU) * 1000) / 1000 + '</span>';
                        return txt;
                    }
                },
                Description: {
                    title: "Mô Tả",
                    width: "5%",
                    sorting: false
                },
                action: {
                    title: '',
                    width: '1%',
                    sorting: false,
                    display: function (data) {
                        var text = $('<i   title="Copy công đoạn" class="fa fa-files-o clickable blue"  ></i>');
                        text.click(function () {
                            CopyPhase(data.record.Id);
                        });
                        return text;
                    }
                },
                Excel: {
                    title: '',
                    width: '2%',
                    sorting: false,
                    display: function (data) {
                        if (data.record.actions.length > 0) {
                            var txt = $('<i title="Xuất Danh Sách Thao Tác của Công đoạn" class="fa fa-file-excel-o"></i>');
                            txt.click(function () {
                                window.location.href = '/ProAna/export_PhaseManiVersion?Id=' + data.record.Id;
                            });
                            return txt;
                        }
                    }
                },
                edit: {
                    title: '',
                    width: '1%',
                    sorting: false,
                    display: function (data) {
                        var text = $('<i data-toggle="modal" data-target="#' + Global.Element.CreatePhasePopup + '" title="Chỉnh sửa thông tin" class="fa fa-pencil-square-o clickable blue"  ></i>');
                        text.click(function () {
                            data.record.TotalTMU = Math.round(data.record.TotalTMU * 1000) / 1000;
                            $('#workersLevel').val(data.record.WorkerLevelId);
                            $('#TotalTMU').html(data.record.TotalTMU);
                            $('#phase-Des').val(data.record.Description);
                            $('#phaseID').val(data.record.Id);
                            $('#phase-name').val(data.record.Name).change();
                            $('#phase-code').html(data.record.Code);
                            $('#phase-index').val(data.record.Index);

                            if (data.record.timePrepares.length > 0) {
                                $.each(data.record.timePrepares, function (i, item) {
                                    Global.Data.TimePrepareArray.push(item);
                                });
                                ReloadListTimePrepare();
                            }
                            $('#equipmentId').val(data.record.EquipmentId);
                            $('#equipmentName').val(data.record.EquipName);
                            $('#equiptypedefaultId').val(data.record.EquipTypeDefaultId);
                            $('#E_info').val(data.record.EquipDes);
                            $('#ApplyPressure').val(data.record.ApplyPressuresId);
                            $('#islibs').prop('checked', data.record.IsLibrary);
                            $('#chooseApplyPressure').hide();
                            if (data.record.ApplyPressuresId != 0)
                                $('#chooseApplyPressure').show();
                            Global.Data.PhaseManiVerDetailArray.length = 0;

                            if (data.record.actions.length > 0) {
                                $.each(data.record.actions, function (i, item) {
                                    item.OrderIndex = i + 1;
                                });
                                $.each(data.record.actions, function (i, item) {
                                    var obj = {
                                        Id: item.Id,
                                        CA_PhaseId: item.CA_PhaseId,
                                        OrderIndex: item.OrderIndex,
                                        ManipulationId: item.ManipulationId,
                                        ManipulationCode: item.ManipulationCode.trim(),
                                        EquipmentId: item.EquipmentId,
                                        TMUEquipment: item.TMUEquipment,
                                        TMUManipulation: item.TMUManipulation,
                                        Loop: item.Loop,
                                        TotalTMU: item.TotalTMU,
                                        ManipulationName: item.ManipulationName == null ? '' : item.ManipulationName.trim()
                                    }
                                    Global.Data.PhaseManiVerDetailArray.push(obj);
                                });
                            }
                            AddEmptyObject();
                            ReloadListMani_Arr();
                            $('[percentequipment]').val(data.record.PercentWasteEquipment);
                            $('[percentmanipulation]').val(data.record.PercentWasteManipulation);
                            $('[percentdb]').val(data.record.PercentWasteSpecial);
                            $('[percentnpl]').val(data.record.PercentWasteMaterial);
                            UpdateIntWaste();
                            Global.Data.isInsertPhase = false;
                            Global.Data.Video = data.record.Video;
                            var video = document.getElementsByTagName('video')[0];
                            var sources = video.getElementsByTagName('source');
                            if (data.record.Video) {
                                $('#video-info').html(data.record.Video.split('|')[1] + '  <i onclick="removeVideo()" title="Gỡ video" class="fa fa-trash-o red clickable"></i>')

                                sources[0].src = data.record.Video.split('|')[0];
                                sources[1].src = data.record.Video.split('|')[0];
                                video.load();
                            }
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
                                DeletePhase(data.record.Id);
                            }, function () { }, 'Đồng ý', 'Hủy bỏ', 'Thông báo');
                        });
                        return text;
                    }
                }
            },
        });
    }

    function ReloadListPhase_View() {
        $('#' + Global.Element.jtablePhase).jtable('load', { 'node': (Global.Data.Node + Global.Data.ParentID) });
    }

    function SavePhase() {
        var obj = {
            Id: $('#phaseID').val() == '' ? 0 : $('#phaseID').val(),
            Name: $('#phase-name').val(),
            Code: $('#phase-code').html(),
            Description: $('#phase-Des').val(),
            EquipmentId: $('#equipmentId').val(),
            WorkerLevelId: $('#workersLevel').val(),
            PhaseGroupId: Global.Data.ObjectId,
            ParentId: Global.Data.ParentID,
            TotalTMU: parseFloat($('#TotalTMU').html()),
            ApplyPressuresId: $('#ApplyPressure').val(),
            PercentWasteEquipment: $('[percentEquipment]').val(),
            PercentWasteManipulation: $('[percentManipulation]').val(),
            PercentWasteSpecial: $('[percentDB]').val(),
            PercentWasteMaterial: $('[percentNPL]').val(),
            Node: Global.Data.Node,
            ManiVerTMU: 0,
            IsDetailChange: Global.Data.ManipulationVersionModel.IsDetailChange,
            actions: Global.Data.PhaseManiVerDetailArray,
            Index: ($('#phase-index').val() == '' ? (Global.Data.phaseLastIndex + 1) : parseInt($('#phase-index').val())),
            Video: Global.Data.Video,
            IsLibrary: $('#islibs').prop('checked')
        }
        $.ajax({
            url: Global.UrlAction.SavePhase,
            type: 'post',
            data: JSON.stringify({ 'phase': obj, 'accessories': Global.Data.AccessoriesArray, 'timePrepares': Global.Data.TimePrepareArray }),
            contentType: 'application/json',
            beforeSend: function () { $('#loading').show(); },
            success: function (result) {
                $('#loading').hide();
                GlobalCommon.CallbackProcess(result, function () {
                    if (result.Result == "OK") {
                        GetLastPhaseIndex();
                        ReloadListPhase_View();
                        Global.Data.TimePrepareArray.length = 0;
                        ReloadListTimePrepare();
                        $('#phaseName_label').html('');
                        Global.Data.Commo_Ana_PhaseId = 0;
                        if (!Global.Data.isInsertPhase) {
                            $('#' + Global.Element.CreatePhasePopup).modal('hide');
                            Global.Data.isInsertPhase = true;
                        }
                        $('#phase-name').val('').change();
                        $('#lbTenCongDoan').html('');
                        $('#phase-index').val('');
                        $('#TotalTMU').html('0');
                        $('#phase-Des').val('');
                        $('#phaseID').val('0');
                        $('#islibs').prop('checked', false);
                        Global.Data.PhaseManiVerDetailArray.length = 0;
                        AddEmptyObject();
                        ReloadListMani_Arr();
                        $('#phase-code').html(((Global.Data.PhaseAutoCode == null || Global.Data.PhaseAutoCode == '' ? '' : (Global.Data.PhaseAutoCode + '-')) + (Global.Data.phaseLastIndex + 1)));
                        UpdateIntWaste();
                        GetPhasesForSuggest();
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

    function DeletePhase(Id) {
        $.ajax({
            url: Global.UrlAction.DeletePhase,
            type: 'POST',
            data: JSON.stringify({ 'Id': Id }),
            contentType: 'application/json charset=utf-8',
            beforeSend: function () { $('#loading').show(); },
            success: function (data) {
                $('#loading').hide();
                GlobalCommon.CallbackProcess(data, function () {
                    if (data.Result == "OK") {
                        ReloadListPhase_View();
                        GetLastPhaseIndex();
                        GetPhasesForSuggest();
                    }
                    else
                        GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình xử lý.");
                }, false, Global.Element.PopupCommodityAnalysis, true, true, function () {
                    var msg = GlobalCommon.GetErrorMessage(data);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
                });
            }
        });
    }

    function CopyPhase(Id) {
        $.ajax({
            url: Global.UrlAction.CopyPhase,
            type: 'POST',
            data: JSON.stringify({ 'Id': Id }),
            contentType: 'application/json charset=utf-8',
            beforeSend: function () { $('#loading').show(); },
            success: function (data) {
                $('#loading').hide();
                GlobalCommon.CallbackProcess(data, function () {
                    if (data.Result == "OK") {
                        ReloadListPhase_View();
                        GetLastPhaseIndex();
                        GetPhasesForSuggest();
                    }
                    else
                        GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình xử lý.");
                }, false, Global.Element.PopupCommodityAnalysis, true, true, function () {

                    var msg = GlobalCommon.GetErrorMessage(data);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
                });
            }
        });
    }

    function Check_Phase_Validate() {
        if ($('#phase-name').val().trim() == "") {
            GlobalCommon.ShowMessageDialog("Vui Nhập Tên Công Đoạn .", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        else if ($('#workersLevel').val() == "" || $('#workersLevel').val() == "0") {
            GlobalCommon.ShowMessageDialog("Vui Nhập chọn bậc thợ .", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        return true;
    }

    function GetLastPhaseIndex() {
        $.ajax({
            url: Global.UrlAction.GetLastIndex,
            type: 'POST',
            data: JSON.stringify({ 'Id': Global.Data.ParentID }),
            contentType: 'application/json charset=utf-8',
            success: function (data) {
                if (data.Result == "OK") {
                    Global.Data.phaseLastIndex = data.Records;
                    $('#phase-code').html(((Global.Data.PhaseAutoCode == null || Global.Data.PhaseAutoCode == '' ? '' : (Global.Data.PhaseAutoCode + '-')) + (Global.Data.phaseLastIndex + 1)));
                    $('#phase-index').val((Global.Data.phaseLastIndex + 1));
                }
                else
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình xử lý.");
            }
        });
    }

    removeVideo = () => {
        $.ajax({
            url: Global.UrlAction.RemovePhaseVideo,
            type: 'POST',
            data: JSON.stringify({ 'Id': $('#phaseID').val() }),
            contentType: 'application/json charset=utf-8',
            beforeSend: function () { $('#loading').show(); },
            success: function (data) {
                $('#loading').hide();
                GlobalCommon.CallbackProcess(data, function () {
                    if (data.Result == "OK") {
                        $('[cancel-create-phase]').click();
                        $('#' + Global.Element.CreatePhasePopup).modal('hide');
                        Global.Data.isInsertPhase = true;
                        ReloadListPhase_View();
                        GetLastPhaseIndex();
                        GetPhasesForSuggest();
                        $('#video-info').html('');
                    }
                    else
                        GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình xử lý.");
                }, false, Global.Element.PopupCommodityAnalysis, true, true, function () {
                    var msg = GlobalCommon.GetErrorMessage(data);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
                });
            }
        });
    }
    //#endregion

    function UploadVideo() {
        if (window.FormData !== undefined) {
            var fileUpload = $('#video').get(0);
            var files = fileUpload.files;
            var fileData = new FormData();
            for (var i = 0; i < files.length; i++) {
                fileData.append(files[i].name, files[i]);
            }
            $.ajax({
                url: '/ProAna/UploadVideo',
                type: "POST",
                data: fileData,
                contentType: false, // Not to set any content header  
                processData: false, // Not to process data  
                beforeSend: function () { $('#loading').show(); },
                success: function (result) {
                    Global.Data.Video = result;
                    $('#hid_video').val(result).change();
                    $('#loading').hide();
                },
                error: function (err) {
                    alert("Lỗi up hình : " + err.statusText);
                    $('#loading').hide();
                }
            });
        }
        else
            alert("FormData is not supported.");
    }

    //#region Thao tác công đoạn
    function InitListMani_Arr() {
        $('#' + Global.Element.JtableManipulationArr).jtable({
            title: 'Danh Sách Thao Tác',
            pageSize: 100,
            pageSizeChange: true,
            selectShow: true,
            sorting: false,
            actions: {
                listAction: Global.Data.PhaseManiVerDetailArray,
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
                OrderIndex: {
                    title: "STT",
                    width: "5%",
                    display: function (data) {
                        var txt = $('<input class="form-control center" stt type="text" value =\'' + data.record.OrderIndex + '\' />');
                        txt.change(function () {
                            if (data.record.OrderIndex == Global.Data.PhaseManiVerDetailArray.length) {
                                GlobalCommon.ShowMessageDialog('Đây là Thao Tác rỗng không thể thay đỗi Chèn vào vị trí khác được.',
                                    function () { }, "Thao Tác Rỗng");
                                txt.val(data.record.OrderIndex);
                            }
                            else {
                                var Newindex = parseInt(txt.val());
                                var OldIndex = data.record.OrderIndex;
                                if (Newindex <= 0 || Newindex >= Global.Data.PhaseManiVerDetailArray.length) {
                                    GlobalCommon.ShowMessageDialog('Số Thứ Tự Thao Tác phải lớn hơn 0 và nhỏ hơn ' + Global.Data.PhaseManiVerDetailArray.length + '.',
                                        function () { }, "Số Thứ Tự Thao Tác không hợp lệ");
                                    txt.val(data.record.OrderIndex);
                                }
                                else {
                                    var objTemp = Global.Data.PhaseManiVerDetailArray[OldIndex - 1];
                                    objTemp.OrderIndex = Newindex;
                                    Global.Data.PhaseManiVerDetailArray.splice(OldIndex - 1, 1);
                                    Global.Data.PhaseManiVerDetailArray.splice(Newindex - 1, 0, objTemp);
                                    if (Newindex < OldIndex) {
                                        for (var i = Newindex; i < Global.Data.PhaseManiVerDetailArray.length; i++) {
                                            Global.Data.PhaseManiVerDetailArray[i].OrderIndex = i + 1;
                                        }
                                    }
                                    else {
                                        for (var i = 0; i < Global.Data.PhaseManiVerDetailArray.length; i++) {
                                            if (i + 1 != Newindex)
                                                Global.Data.PhaseManiVerDetailArray[i].OrderIndex = i + 1;
                                        }
                                    }

                                    //sorting array
                                    Global.Data.PhaseManiVerDetailArray.sort(function (a, b) {
                                        var nameA = a.OrderIndex, nameB = b.OrderIndex;
                                        if (nameA < nameB)
                                            return -1;
                                        if (nameA > nameB)
                                            return 1;
                                        return 0;
                                    });
                                    ReloadListMani_Arr();
                                }
                            }
                        });
                        txt.click(function () { txt.select(); })
                        return txt;
                    }
                },
                ManipulationCode: {
                    title: "Mã",
                    width: "15%",
                    display: function (data) {
                        var txt = $('<input class="form-control" code_' + data.record.OrderIndex + ' list="manipulations" type="text" value="' + data.record.ManipulationCode + '" />');
                        txt.change(function () {
                            var code = txt.val().trim().toUpperCase();
                            if (Global.Data.ManipulationList.length > 0 && code != '') {
                                code = code.toUpperCase();
                                var IsNormalCode = true;
                                var flag = false;
                                if (code.length >= 4) {
                                    if (code.substring(0, 1) == "C" || code.substring(0, 2) == "SE") {
                                        LoadChooseManipulationPopup(code, function (dataReturn) {
                                            flag = false;
                                            if (typeof (dataReturn) != 'undefined' && dataReturn != null) {
                                                Global.Data.PhaseManiVerDetailArray[data.record.OrderIndex - 1].ManipulationName = dataReturn.Name;
                                                Global.Data.PhaseManiVerDetailArray[data.record.OrderIndex - 1].ManipulationCode = dataReturn.Code;
                                                Global.Data.PhaseManiVerDetailArray[data.record.OrderIndex - 1].TMUEquipment = dataReturn.StandardTMU;
                                                Global.Data.PhaseManiVerDetailArray[data.record.OrderIndex - 1].TMUManipulation = 0;
                                                Global.Data.PhaseManiVerDetailArray[data.record.OrderIndex - 1].TotalTMU = Math.round((Global.Data.PhaseManiVerDetailArray[data.record.OrderIndex - 1].Loop * dataReturn.StandardTMU) * 1000) / 1000;
                                                if (Global.Data.PhaseManiVerDetailArray.length == data.record.OrderIndex) {
                                                    AddEmptyObject();
                                                    $('[code_' + Global.Data.PhaseManiVerDetailArray.length + ']').focus();
                                                    $('#Create-ManipulationVersion-Popup .modal-body').scrollTop($('#Create-ManipulationVersion-Popup .modal-body').height());
                                                }
                                                else
                                                    $('#Create-ManipulationVersion-Popup .modal-body').scrollTop($('#Create-ManipulationVersion-Popup .modal-body').scrollTop());
                                                ReloadListMani_Arr();
                                                UpdateIntWaste();
                                                $('[code_' + Global.Data.PhaseManiVerDetailArray.length + ']').focus();
                                                $('#Create-ManipulationVersion-Popup .modal-body').scrollTop($('#Create-ManipulationVersion-Popup .modal-body').height());
                                            }
                                        });
                                        IsNormalCode = false;
                                    }
                                }
                                if (IsNormalCode) {
                                    $.each(Global.Data.ManipulationList, function (i, item) {
                                        if (item.Code.trim() == code || (item.Name != '' && item.Name.trim().toUpperCase() == code)) {
                                            $.each(Global.Data.PhaseManiVerDetailArray, function (ii, mani) {
                                                if (mani.OrderIndex == data.record.OrderIndex) {
                                                    mani.ManipulationId = item.Id;
                                                    mani.ManipulationCode = item.Code;
                                                    mani.ManipulationName = item.Name;
                                                    mani.TMUManipulation = item.isUseMachine ? 0 : item.StandardTMU;
                                                    mani.TMUEquipment = item.isUseMachine ? item.StandardTMU : 0;
                                                    mani.TotalTMU = Math.round((mani.Loop * item.StandardTMU) * 1000) / 1000;
                                                    flag = true;
                                                    return false;
                                                }
                                            });
                                            return false;
                                        }
                                    });
                                    if (!flag) {
                                        GlobalCommon.ShowMessageDialog('Không tìm thấy thông tin của Thao Tác này trong Thư Viện.\nVui lòng kiểm tra lại Thư Viện thao Tác.', function () { }, "Không Tìm Thấy Thao Tác");
                                    }
                                }
                                if (flag) {
                                    if (Global.Data.PhaseManiVerDetailArray.length == data.record.OrderIndex)
                                        AddEmptyObject();
                                    ReloadListMani_Arr();
                                    UpdateIntWaste();
                                    if (Global.Data.PhaseManiVerDetailArray.length - 1 == data.record.OrderIndex) {
                                        $('[code_' + Global.Data.PhaseManiVerDetailArray.length + ']').focus();
                                        $('#Create-ManipulationVersion-Popup .modal-body').scrollTop($('#Create-ManipulationVersion-Popup .modal-body').height());
                                    }
                                    else
                                        $('#Create-ManipulationVersion-Popup .modal-body').scrollTop($('#Create-ManipulationVersion-Popup .modal-body').scrollTop());
                                }
                            }
                        });
                        txt.keypress(function (e) {
                            var charCode = (e.which) ? e.which : event.keyCode;
                            if (charCode == 13) {
                                txt.change();
                            }
                        });
                        txt.click(function () { txt.select(); })
                        return txt;
                    }
                },
                Description: {
                    title: "Mô Tả",
                    width: "35%",
                    display: function (data) {
                        var txt = $('<input class="form-control" des type="text" value="' + data.record.ManipulationName + '" />');
                        txt.change(function () {
                            Global.Data.PhaseManiVerDetailArray[data.record.OrderIndex - 1].ManipulationName = txt.val();
                        });
                        txt.keypress(function (e) {
                            var charCode = (e.which) ? e.which : event.keyCode;
                            if (charCode == 13) {
                                txt.change();
                            }
                        });
                        txt.click(function () { txt.select(); })
                        return txt;
                    }
                },
                Loop: {
                    title: "Tần Suất",
                    width: "5%",
                    display: function (data) {
                        var txt = $('<input class="form-control center" loop type="text" value="' + data.record.Loop + '"  onkeypress="return isNumberKey(event)"/>');
                        txt.change(function () {
                            var loop = parseFloat(txt.val());
                            Global.Data.PhaseManiVerDetailArray[data.record.OrderIndex - 1].Loop = txt.val();
                            Global.Data.PhaseManiVerDetailArray[data.record.OrderIndex - 1].TotalTMU = Math.round((Global.Data.PhaseManiVerDetailArray[data.record.OrderIndex - 1].TMUEquipment * loop + Global.Data.PhaseManiVerDetailArray[data.record.OrderIndex - 1].TMUManipulation * loop) * 1000) / 1000;
                            ReloadListMani_Arr();
                            UpdateIntWaste();
                        });
                        txt.click(function () { txt.select(); })
                        return txt;
                    }
                },
                TMUEquipment: {
                    title: "TMU Thiết Bị (chuẩn)",
                    width: "5%",
                    display: function (data) {
                        var txt = '<span class="blue bold">' + data.record.TMUEquipment + '</span>';
                        return txt;
                    }
                },
                TMUManipulation: {
                    title: "TMU Thao Tác (chuẩn)",
                    width: "5%",
                    display: function (data) {
                        var txt = '<span class="blue bold">' + data.record.TMUManipulation + '</span>';
                        return txt;
                    }
                },
                TotalTMU: {
                    title: "Tổng TMU",
                    width: "5%",
                    display: function (data) {
                        var txt = '<span class="red bold">' + data.record.TotalTMU + '</span>';
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
                                var oldIndex = data.record.OrderIndex - 1;
                                Global.Data.PhaseManiVerDetailArray.splice(oldIndex, 1);
                                for (var i = oldIndex; i < Global.Data.PhaseManiVerDetailArray.length; i++) {
                                    Global.Data.PhaseManiVerDetailArray[i].OrderIndex = i + 1;
                                }
                                ReloadListMani_Arr();
                                UpdateIntWaste();
                            }, function () { }, 'Đồng ý', 'Hủy bỏ', 'Thông báo');
                        });
                        return text;
                    }
                }
            }
        });
    }

    function ReloadListMani_Arr() {
        var _totalmay = 0;
        if (Global.Data.PhaseManiVerDetailArray.length > 0) {
            $.each(Global.Data.PhaseManiVerDetailArray, function (i, item) {
                if (item.ManipulationCode) {
                    var _code = item.ManipulationCode.trim();
                    if (_code.indexOf('SE') >= 0) {
                        var cd = parseInt(_code.substring(2, _code.length - 1));
                        if (!isNaN(cd)) {
                            _totalmay += (cd * item.Loop);
                        }
                    }
                }
            });
        }
        $('#TotalMay').html(_totalmay);

        $('#' + Global.Element.JtableManipulationArr).jtable('load');
    }

    function AddEmptyObject() {
        var obj = {
            Id: 0,
            CA_PhaseId: 0,
            OrderIndex: Global.Data.PhaseManiVerDetailArray.length + 1,
            ManipulationId: 0,
            ManipulationCode: '',
            EquipmentId: 0,
            TMUEquipment: 0,
            TMUManipulation: 0,
            Loop: 1,
            TotalTMU: 0,
            ManipulationName: ''
        }
        Global.Data.PhaseManiVerDetailArray.push(obj);
    }
    //#endregion

    //#region hao phí
    function LoadChooseManipulationPopup(code, callback) {
        code = code.toUpperCase();
        if (code.length >= 4) {
            if (code.substring(0, 1) == "C" || code.substring(0, 2) == "SE") {
                GetManipulationEquipmentInfoByCode(code, function (dataReturn) {
                    if (callback)
                        callback(dataReturn);
                });
            }
            else {
                ReloadListManipulation_Choose(code, 2, function () {
                    AddManipulationInfoToListChoose();
                });
            }
        }
        else {
            ReloadListManipulation_Choose(code, 2, function () {
                AddManipulationInfoToListChoose();
            });
        }
    }
    function GetTotalPercentWaste() {
        var totalEquipment = 0;
        if ($('input[percentEquipment]').val() != "")
            totalEquipment = parseFloat($('input[percentEquipment]').val());
        var totalManipulation = 0;
        if ($('input[percentManipulation]').val() != "")
            totalManipulation = parseFloat($('input[percentManipulation]').val());
        var totalDB = 0;
        if ($('input[percentDB]').val() != "")
            totalDB = parseFloat($('input[percentDB]').val());
        var totalNPL = 0;
        if ($('input[percentNPL]').val() != "")
            totalNPL = parseFloat($('input[percentNPL]').val());
        $('input[totalPercentWaste]').val(totalEquipment + totalManipulation + totalDB + totalNPL);
    }
    function GetTotalTimeWaste() {
        var totalEquipment = 0;
        if ($('input[totalTimeWasteEquipment]').val() != "")
            totalEquipment = parseFloat($('input[totalTimeWasteEquipment]').val());
        var totalManipulation = 0;
        if ($('input[totalTimeWasteManipulation]').val() != "")
            totalManipulation = parseFloat($('input[totalTimeWasteManipulation]').val());
        var totalDB = 0;
        if ($('input[totalTimeWasteDB]').val() != "")
            totalDB = parseFloat($('input[totalTimeWasteDB]').val());
        var totalNPL = 0;
        if ($('input[totalTimeWasteNPL]').val() != "")
            totalNPL = parseFloat($('input[totalTimeWasteNPL]').val());
        $('input[totalTimeWaste]').val(totalEquipment + totalManipulation + totalDB + totalNPL);
    }
    function GetTotalTMUAndTimeVersion() {
        var totalTimeWaste = 0;
        if ($('input[totalTimeWaste]').val() != "")
            totalTimeWaste = parseFloat($('input[totalTimeWaste]').val());
        var totalTime = 0;
        if ($('input[totalTime]').val() != "")
            totalTime = parseFloat($('input[totalTime]').val());
        $('#mani-ver-TotalTMU').val(Math.round((totalTime + totalTimeWaste) * 1000) / 1000);
    }
    function UpdateIntWaste() {
        if (Global.Data.PhaseManiVerDetailArray != null && Global.Data.PhaseManiVerDetailArray.length > 0) {
            var totalTMUEquipment = 0;
            var totalTMUManipulation = 0;

            $.each(Global.Data.PhaseManiVerDetailArray, function (i, obj) {
                totalTMUEquipment += parseFloat(obj.TMUEquipment) * obj.Loop;
                totalTMUManipulation += parseFloat(obj.TMUManipulation) * obj.Loop;
            });

            $('input[totalTMUEquipment]').val(totalTMUEquipment);
            $('input[totalTMUManipulation]').val(totalTMUManipulation);
            var totalTimeEquipment = totalTMUEquipment / Global.Data.TMU;
            var totalTimeManipulation = totalTMUManipulation / Global.Data.TMU;
            $('input[totalTimeEquipment]').val(totalTimeEquipment);
            $('input[totalTimeManipulation]').val(totalTimeManipulation);
            $('input[totalTMU]').val(totalTMUEquipment + totalTMUManipulation);
            $('input[totalTime]').val(totalTimeEquipment + totalTimeManipulation);

            if ($('input[percentEquipment]').val() != "") {
                var percent = parseInt($('input[percentEquipment]').val());
                var totalTimeEquipment = 0;
                if ($('input[totalTimeEquipment]').val() != "")
                    totalTimeEquipment = parseFloat($('input[totalTimeEquipment]').val());
                $('input[totalTimeWasteEquipment]').val((percent * totalTimeEquipment) / 100);
            }

            if ($('input[percentManipulation]').val() != "") {
                var percent = parseInt($('input[percentManipulation]').val());
                var totalTimeManipulation = 0;
                if ($('input[totalTimeManipulation]').val() != "")
                    totalTimeManipulation = parseFloat($('input[totalTimeManipulation]').val());
                $('input[totalTimeWasteManipulation]').val((percent * totalTimeManipulation) / 100);
            }

            if ($('input[percentDB]').val() != "") {
                var percent = parseInt($('input[percentDB]').val());
                var totalTime = 0;
                if ($('input[totalTime]').val() != "")
                    totalTime = parseFloat($('input[totalTime]').val());
                $('input[totalTimeWasteDB]').val((percent * totalTime) / 100);
            }

            if ($('input[percentNPL]').val() != "") {
                var percent = parseInt($('input[percentNPL]').val());
                var totalTime = 0;
                if ($('input[totalTime]').val() != "")
                    totalTime = parseFloat($('input[totalTime]').val());
                $('input[totalTimeWasteNPL]').val((percent * totalTime) / 100);
            }
            GetTotalPercentWaste();
            GetTotalTimeWaste();
            GetTotalTMUAndTimeVersion();
            UpdateTotalTimeVersion();
        }
    }
    function UpdateTotalTimeVersion() {
        var totalTMUPrepare = 0;
        $.each(Global.Data.TimePrepareArray, function (i, item) {
            totalTMUPrepare += parseFloat(item.TMUNumber);
        });
        var totalTimePrepare = totalTMUPrepare / Global.Data.TMU;
        var totalTimeManiVerTMU = ($('[totaltime]').val() != "" ? parseFloat($('[totaltime]').val()) : 0) + ($('[totaltimewaste]').val() != '' ? parseFloat($('[totaltimewaste]').val()) : 0);
        Global.Data.PhaseModel.TotalTMU = totalTimePrepare + totalTimeManiVerTMU;
        $('#TotalTMU').html(Math.round(Global.Data.PhaseModel.TotalTMU * 1000) / 1000);
    }
    //#endregion

    //#region thiết bị & tính TMU code may va cat
    function InitListEquipment() {
        $('#' + Global.Element.JtableEquipment).jtable({
            title: 'Danh sách Thiết Bị',
            paging: true,
            pageSize: 1000,
            pageSizeChange: true,
            sorting: true,
            selectShow: true,
            actions: {
                listAction: Global.UrlAction.GetListEquipment,
                searchAction: Global.Element.PopupSearchEquipment,
            },
            messages: {
                addNewRecord: 'Thêm mới',
                searchRecord: 'Tìm kiếm',
                selectShow: 'Ẩn hiện cột'
            },
            fields: {
                Id: {
                    key: true,
                    create: false,
                    edit: false,
                    list: false
                },
                Code: {
                    title: "Mã Thiết Bị",
                    width: "10%",
                },
                Name: {
                    visibility: 'fixed',
                    title: "Tên Thiết Bị",
                    width: "20%",
                    display: function (data) {
                        var text = $('<a class="clickable"  data-target="#popup_Equipment" title="Chọn thiết bị cho phiên bản công đoạn.">' + data.record.Name + '</a>');
                        text.click(function () {
                            if (($('#equipmentId').val().trim() == '' || $('#equipmentId').val().trim() == '0') || Global.Data.PhaseManiVerDetailArray.length == 0) {
                                $('#equipmentId').val(data.record.Id);
                                $('#equipmentName').val(data.record.Name);
                                $('#equiptypedefaultId').val(data.record.EquipTypeDefaultId);
                                $('#E_info').val(data.record.Description);

                                $('[percentequipment]').val(data.record.Expend);
                                if (data.record.EquipTypeDefaultId == Global.Data.EquipTypeDefaultId.C)
                                    $('#chooseApplyPressure').show();
                                else
                                    $('#chooseApplyPressure').hide();

                                $('#' + Global.Element.PopupChooseEquipment).modal('hide');
                                $('#' + Global.Element.CreatePhasePopup).show();
                            }
                            else {
                                if (Global.Data.PhaseManiVerDetailArray.length > 0) {
                                    var arr = [];
                                    $.each(Global.Data.PhaseManiVerDetailArray, function (i, item) {
                                        item.ManipulationCode = item.ManipulationCode.trim().toUpperCase();
                                        if (item.ManipulationCode.substring(0, 2) == 'SE' || item.ManipulationCode.substring(0, 1) == 'C')
                                            arr.push(item.OrderIndex);
                                    });
                                    if (arr.length > 0) {
                                        GlobalCommon.ShowConfirmDialog('Khi Bạn thay đổi Thiết Bị, chỉ số TMU các Mã May và Mã Cắt \nđã phân tích trước đó sẽ được tính lại.\nBạn có muốn thay đổi Thiết Bị không ?',
                                            function () {
                                                $('#equipmentId').val(data.record.Id);
                                                $('#equipmentName').val(data.record.Name);
                                                $('#equiptypedefaultId').val(data.record.EquipTypeDefaultId);
                                                $('#E_info').val(data.record.Description);
                                                $('[percentequipment]').val(data.record.Expend);
                                                if (data.record.EquipTypeDefaultId == Global.Data.EquipTypeDefaultId.C) {
                                                    $('#chooseApplyPressure').show();
                                                }
                                                else {
                                                    $('#chooseApplyPressure').hide();
                                                } 

                                                TinhLaiCodeMayCat();
                                                $('#' + Global.Element.PopupChooseEquipment).modal('hide');
                                                $('#' + Global.Element.CreatePhasePopup).show();
                                            },
                                            function () {
                                                $('#' + Global.Element.PopupChooseEquipment).modal('hide');
                                                $('#' + Global.Element.CreatePhasePopup).show();
                                            },
                                            'Đồng ý', 'Hủy bỏ', 'Thông báo');
                                    }
                                    else {
                                        $('#equipmentId').val(data.record.Id);
                                        $('#equipmentName').val(data.record.Name);
                                        $('#equiptypedefaultId').val(data.record.EquipTypeDefaultId);
                                        $('#E_info').val(data.record.Description);

                                        $('[percentequipment]').val(data.record.Expend);
                                        if (data.record.EquipTypeDefaultId == Global.Data.EquipTypeDefaultId.C)
                                            $('#chooseApplyPressure').show();
                                        else
                                            $('#chooseApplyPressure').hide();

                                        $('#' + Global.Element.PopupChooseEquipment).modal('hide');
                                        $('#' + Global.Element.CreatePhasePopup).show();
                                    }
                                }
                            }
                        });
                        return text;
                    }
                },
                EquipmentTypeName: {
                    title: "Loại Thiết Bị",
                    width: "20%",
                },
                Description: {
                    title: "Mô Tả",
                    width: "20%",
                },
            }
        });
    }
    function ReloadListEquipment() {
        $('#' + Global.Element.JtableEquipment).jtable('load', { 'keyword': $('#keywordequipment').val() });
    }
    function InitPopupChooseEquipment() {
        $("#" + Global.Element.PopupChooseEquipment).modal({
            keyboard: false,
            show: false
        });
        $("#" + Global.Element.PopupChooseEquipment + ' button[close]').click(function () {
            $("#" + Global.Element.PopupChooseEquipment).modal("hide");
        });
    }

    function split_Arr() {
        $.each(Global.Data.PhaseManiVerDetailArray, function (i, item) {
            if (i < Global.Data.PhaseManiVerDetailArray.length) {
                if (item.ManipulationCode.substring(0, 2) == 'SE' || item.ManipulationCode.substring(0, 1) == 'C') {
                    Global.Data.PhaseManiVerDetailArray.splice(i, 1);
                    split_Arr();
                    return false;
                }
            }
        });
    }

    function GetManipulationEquipmentInfoByCode(code, callback) {
        var isGetTMU = false;
        var codeType = "";
        if (code.indexOf("C") > -1) {
            codeType = code.substring(0, 1);
            if (codeType == "C")
                isGetTMU = true;
        }
        if (isGetTMU == false && code.indexOf("SE") > -1) {
            codeType = code.substring(0, 2);
            if (codeType == "SE")
                isGetTMU = true;
        }
        if (isGetTMU == true) {
            if ($('#equipmentId').val() == "" || $('#equiptypedefaultId').val() == "") {
                isGetTMU = false;
                GlobalCommon.ShowMessageDialog("Bạn chưa chọn thiết bị. Vui lòng chọn thiết bị trước", function () { }, "Lỗi thao tác.");
            }
            else {
                if (code.substring(0, 1) == "C") {
                    if ($('#equiptypedefaultId').val() != Global.Data.EquipTypeDefaultId.C) {
                        isGetTMU = false;
                        GlobalCommon.ShowMessageDialog("Thiết bị bạn chọn không phải là thiết bị cắt. Vui lòng kiểm tra lại", function () { }, "Lỗi thao tác.");
                    }
                    else {
                        if ($('#ApplyPressure').val() == 0) {
                            isGetTMU = false;
                            GlobalCommon.ShowMessageDialog("Bạn chưa chọn số lớp cắt. Vui lòng kiểm tra lại", function () { }, "Lỗi thao tác.");
                        }
                    }
                }
                else if (code.substring(0, 2) == "SE") {
                    if ($('#equiptypedefaultId').val() != Global.Data.EquipTypeDefaultId.SE) {
                        isGetTMU = false;
                        GlobalCommon.ShowMessageDialog("Thiết bị bạn chọn không phải là thiết bị may. Vui lòng kiểm tra lại", function () { }, "Lỗi thao tác.");
                    }
                }
            }

        }
        if (isGetTMU == true) {
            var equipmentId = $('#equipmentId').val();
            var equiptypedefaultId = $('#equiptypedefaultId').val();
            var applyPressure = $('#ApplyPressure option:selected').attr('val');
            $.ajax({
                url: Global.UrlAction.GetManipulationEquipmentInfoByCode,
                type: 'POST',
                data: JSON.stringify({ 'equipmentId': equipmentId, 'equiptypedefaultId': equiptypedefaultId, 'applyPressure': applyPressure, 'code': code }),
                contentType: 'application/json charset=utf-8',
                beforeSend: function () { $('#loading').show(); },
                success: function (data) {
                    $('#loading').hide();
                    GlobalCommon.CallbackProcess(data, function () {
                        if (data.Result == "OK") {
                            if (callback)
                                callback(data.Data);
                        } else
                            GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình xử lý.");
                    }, false, Global.Element.PopupModule, true, true, function () {
                        var msg = GlobalCommon.GetErrorMessage(data);
                        GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình xử lý.");
                    });
                }
            });
        }
    }

    function TinhLaiCodeMayCat() {
        var equipmentId = $('#equipmentId').val();
        var equiptypedefaultId = $('#equiptypedefaultId').val();
        var applyPressure = $('#ApplyPressure option:selected').attr('val');
        var actions = Global.Data.PhaseManiVerDetailArray;
        actions = actions.splice(0, actions.length - 1);

        $.ajax({
            url: Global.UrlAction.TinhLaiCode,
            type: 'POST',
            data: JSON.stringify({ 'actions': actions, 'equipmentId': equipmentId, 'equiptypedefaultId': equiptypedefaultId, 'applyPressure': applyPressure }),
            contentType: 'application/json charset=utf-8',
            beforeSend: function () { $('#loading').show(); },
            success: function (data) {
                $('#loading').hide();
                Global.Data.PhaseManiVerDetailArray.length = 0; 
                $.each(data.Records, function (i, item) {
                    Global.Data.PhaseManiVerDetailArray.push(item);
                });
                AddEmptyObject();
                //split_Arr();
                ReloadListMani_Arr();
            }
        });
    }
    //#endregion

    //#region gợi y cong đoạn
    function GetPhasesForSuggest() {
        $.ajax({
            url: Global.UrlAction.GetPhasesForSugest,
            type: 'POST',
            contentType: 'application/json charset=utf-8',
            success: function (data) {
                GlobalCommon.CallbackProcess(data, function () {
                    if (data.Result == "OK") {
                        Global.Data.PhasesSuggest.length = 0;
                        var option = '';
                        if (data.Records != null && data.Records.length > 0) {
                            $.each(data.Records, function (i, item) {
                                Global.Data.PhasesSuggest.push(item);
                                option += '<option value="' + item.Code + '" /> ';
                                option += '<option value="' + item.Name + '" /> ';
                            });
                        }
                        $('#suggestPhases').empty().append(option);
                    }
                    else
                        GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình xử lý.");
                }, false, Global.Element.PopupProductType, true, true, function () {

                    var msg = GlobalCommon.GetErrorMessage(data);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
                });
            }
        });
    }

    function GetPhasesById() {
        $.ajax({
            url: Global.UrlAction.GetPhaseById,
            type: 'POST',
            data: JSON.stringify({ 'phaseId': Global.Data.SuggestPhaseId }),
            contentType: 'application/json charset=utf-8',
            success: function (data) {
                GlobalCommon.CallbackProcess(data, function () {
                    $('#phase-suggest').val('');
                    if (data.Result == "OK") {
                        data.Records.TotalTMU = Math.round(data.Records.TotalTMU * 1000) / 1000;
                        $('#workersLevel').val(data.Records.WorkerLevelId);
                        $('#TotalTMU').html(data.Records.TotalTMU);
                        $('#phase-Des').val(data.Records.Description);
                        // $('#phaseID').val(data.Records.Id);
                        $('#phase-name').val(data.Records.Name).change();
                        $('#phase-index').html(data.Records.Index);

                        Global.Data.TimePrepareArray.length = 0;
                        if (data.Records.timePrepares.length > 0) {
                            $.each(data.Records.timePrepares, function (i, item) {
                                Global.Data.TimePrepareArray.push(item);
                            });
                            ReloadListTimePrepare();
                        }
                        $('#equipmentId').val(data.Records.EquipmentId);
                        $('#equipmentName').val(data.Records.EquipName);
                        $('#equiptypedefaultId').val(data.Records.EquipTypeDefaultId);
                        $('#E_info').val(data.Records.EquipDes);
                        $('#ApplyPressure').val(data.Records.ApplyPressuresId);
                        $('#chooseApplyPressure').hide();
                        if (data.Records.ApplyPressuresId != 0)
                            $('#chooseApplyPressure').show();
                        Global.Data.PhaseManiVerDetailArray.length = 0;
                        if (data.Records.actions.length > 0) {
                            $.each(data.Records.actions, function (i, item) {
                                item.OrderIndex = i + 1;
                            });
                            $.each(data.Records.actions, function (i, item) {
                                var obj = {
                                    Id: item.Id,
                                    CA_PhaseId: item.CA_PhaseId,
                                    OrderIndex: item.OrderIndex,
                                    ManipulationId: item.ManipulationId,
                                    ManipulationCode: item.ManipulationCode.trim(),
                                    EquipmentId: item.EquipmentId,
                                    TMUEquipment: item.TMUEquipment,
                                    TMUManipulation: item.TMUManipulation,
                                    Loop: item.Loop,
                                    TotalTMU: item.TotalTMU,
                                    ManipulationName: item.ManipulationName == null ? '' : item.ManipulationName.trim()
                                }
                                Global.Data.PhaseManiVerDetailArray.push(obj);
                            });
                        }
                        AddEmptyObject();
                        ReloadListMani_Arr();
                        $('[percentequipment]').val(data.Records.PercentWasteEquipment);
                        $('[percentmanipulation]').val(data.Records.PercentWasteManipulation);
                        $('[percentdb]').val(data.Records.PercentWasteSpecial);
                        $('[percentnpl]').val(data.Records.PercentWasteMaterial);
                        UpdateIntWaste();
                        Global.Data.isInsertPhase = false;
                        Global.Data.Video = data.Records.Video;
                        var video = document.getElementsByTagName('video')[0];
                        var sources = video.getElementsByTagName('source');
                        if (data.Records.Video != null) {
                            sources[0].src = data.Records.Video.split('|')[0];
                            sources[1].src = data.Records.Video.split('|')[0];
                            video.load();
                        }
                    }
                    else
                        GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình xử lý.");
                }, false, Global.Element.PopupProductType, true, true, function () {

                    var msg = GlobalCommon.GetErrorMessage(data);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
                });
            }
        });
    }
    //#endregion




















    /********************************************************************************************************************        
                                                 STEP 2 CREATE  WORKSHOP  
    ********************************************************************************************************************/


    function Copy_CommoAnaPhaseGroup() {
        $.ajax({
            url: Global.UrlAction.Copy_CommoAnaPhaseGroup,
            type: 'POST',
            data: JSON.stringify({ 'CopyObjectId': Global.Data.Copy_CommoAnaPhaseGroupId, 'ObjectId': Global.Data.ParentID }),
            contentType: 'application/json charset=utf-8',
            beforeSend: function () { $('#loading').show(); },
            success: function (data) {
                $('#loading').hide();
                GlobalCommon.CallbackProcess(data, function () {
                    if (data.Result == "OK") {
                        LoadProAna();
                        Global.Data.Copy_CommoAnaPhaseGroupId = 0;
                    }
                    else
                        GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình xử lý.");
                }, false, Global.Element.PopupProAna, true, true, function () {

                    var msg = GlobalCommon.GetErrorMessage(data);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
                });
            }
        });
    }

















































    function LoadManipulationType() {
        $.ajax({
            url: Global.UrlAction.GetManipulationTypes,
            type: 'POST',
            data: '',
            contentType: 'application/json charset=utf-8',
            success: function (data) {
                GlobalCommon.CallbackProcess(data, function () {
                    if (data.Result == "OK") {
                        ResetManipulationTypeTreeView(data.Data);
                        //refresh
                        $('#jqxTree-M').jqxTree('refresh');
                        // 
                        GenerateManipulatuonTypeSelectBox(data.Data);
                    }
                    else
                        GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình xử lý.");
                }, false, Global.Element.PopupProductType, true, true, function () {

                    var msg = GlobalCommon.GetErrorMessage(data);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
                });
            }
        });
    }

    function GenerateManipulatuonTypeSelectBox(manipulation) {
        str = '<option value="0"> Không có dữ liệu </option>';
        if (manipulation.length > 0) {
            str = '<option value="0">- Chọn Loại Thao Tác - </option>';
            $.each(manipulation, function (index, item) {
                str += '<option value="' + item.Id + '">' + item.Name + '</option>';

            });
        }
        $('#Manipulation').empty().append(str);
        $('#Manipulation').trigger('liszt:updated');
    }

    function GetAllManipulation() {
        $.ajax({
            url: Global.UrlAction.GetAllManipulation,
            type: 'POST',
            data: '',
            contentType: 'application/json charset=utf-8',
            success: function (data) {
                GlobalCommon.CallbackProcess(data, function () {
                    if (data.Result == "OK") {
                        var option = '';
                        if (data.Data != null && data.Data.length > 0) {
                            $.each(data.Data, function (i, item) {
                                Global.Data.ManipulationList.push(item);
                                option += '<option value="' + item.Code + '" /> ';
                                option += '<option value="' + item.Name + '" /> ';
                            });
                        }
                        $('#manipulations').append(option);
                    }
                    else
                        GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình xử lý.");
                }, false, Global.Element.PopupProductType, true, true, function () {

                    var msg = GlobalCommon.GetErrorMessage(data);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
                });
            }
        });
    }

    function SearchManipulation(evt) {
        var charCode = (evt.which) ? evt.which : event.keyCode;
        if (charCode == 13) {
            LoadChooseManipulationPopup();
        }
    }

    /********************************************************************************************************************        
                                          TECHPROCESS 
    ********************************************************************************************************************/
    function InitListTech_Cycle() {
        $('#' + Global.Element.JtableTech_Cycle).jtable({
            title: 'Danh sách Công Đoạn',
            selectShow: true,
            actions: {
                listAction: Global.UrlAction.GetTechCycleOfCommodity,
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
                OrderIndex: {
                    title: "STT",
                    width: "3%",
                },
                PhaseCode: {
                    title: "Mã Công Đoạn",
                    width: "3%",
                },
                Name: {
                    visibility: 'fixed',
                    title: "Tên Công Đoạn",
                    width: "20%",
                    display: function (data) {
                        var txt = '<span class="blue">' + data.record.Name + '</span>';
                        return txt;
                    }
                },
                EquipmentId: {
                    title: "Thiết Bị",
                    width: "5%"
                },
                TotalTMU: {
                    title: "TGian Chuẩn(s)",
                    width: "7%",
                    display: function (data) {
                        var txt = '<span class="red bold">' + data.record.TotalTMU + '</span>';
                        return txt;
                    }
                },
                ti_le: {
                    title: 'Tỉ Lệ <br/><input class="form-control" style="width:55px" value="100" type="text" id="tile-parent" onChange="Change()" /> %',
                    width: "5%",
                },
                Time_Percent: {
                    title: 'TGian Theo %',
                    width: "10%",
                    sorting: false,
                    display: function (data) {
                        var txt = '<span class="red bold">' + data.record.Time_Percent + '</span>';
                        return txt;
                    }
                },
                NumberOfWorker: {
                    title: "Lao Động",
                    width: "5%",
                    sorting: false,
                    display: function (data) {
                        var txt = '<span class="red bold">' + data.record.NumberOfWorker + '</span>';
                        return txt;
                    }
                },
                Description: {
                    title: "Ghi chú",
                    width: "20%",
                    sorting: false,
                    display: function (data) {
                        txt = '<input type="text" value="' + data.record.Description + '" des />';
                        return txt;
                    }
                }
            }
        });
    }

    function GetTechProcess(node, parentID) {
        $.ajax({
            url: Global.UrlAction.GetTech,
            type: 'post',
            data: JSON.stringify({ 'parentId': parentID, 'node': node }),
            contentType: 'application/json',
            beforeSend: function () { $('#loading').show(); },
            success: function (result) {
                $('#loading').hide();
                GlobalCommon.CallbackProcess(result, function () {
                    if (result.Result == "OK") {
                        Global.Data.TechCycle_Arr.length = 0;
                        if (result.Data.Id == 0) {
                            $('#techId').val(0);
                            $('#total-worker').val(0);
                            var str = '';
                            if (result.Data.details.length > 0) {
                                var total_time_Product = 0;
                                $.each(result.Data.details, function (index, item) {
                                    var ii = index + 1;
                                    item.EquipmentCode = item.EquipmentCode == null ? '' : item.EquipmentCode;
                                    str += '<tr>';
                                    str += '<td >' + ii + '</td>';
                                    str += '<td >' + item.PhaseCode + '</td>';
                                    str += '<td class="red">' + item.PhaseName + '</td>';
                                    str += '<td class="blue">' + item.EquipmentCode + '</td>';
                                    str += '<td>' + Math.round((item.StandardTMU) * 1000) / 1000 + '</td>';
                                    str += '<td><input class="form-control" percent type="text" id="percent' + ii + '" value="100" onchange ="ResetTime_Percent(\'' + ii + '\')" /></td>';
                                    str += '<td>' + Math.round(((item.StandardTMU)) * 1000) / 1000 + '</td>';
                                    str += '<td>0</td>';
                                    str += '<td><input class="form-control" description type="text"  value="' + item.Description + '"  /></td>';
                                    str += '</tr>';
                                    obj = {
                                        Id: 0,
                                        TechProcessVersionId: 0,
                                        CA_PhaseId: item.CA_PhaseId,
                                        OrderIndex: ii,
                                        EquipmentId: null,
                                        StandardTMU: item.StandardTMU,
                                        Percent: 100,
                                        TimeByPercent: item.StandardTMU,
                                        Worker: 0,
                                        Description: item.Description
                                    };
                                    Global.Data.TechCycle_Arr.push(obj);
                                    total_time_Product += (obj.TimeByPercent);
                                });
                                $('#' + Global.Element.JtableTech_Cycle).find('tbody').empty().append(str);

                                // alert(total_time_Product);
                                //tong gio sx 1 san pham
                                $('#time-product').html(Math.round((total_time_Product) * 1000) / 1000);
                                Global.Data.TimeProductPerCommodity = Math.round((total_time_Product) * 1000) / 1000;
                                ResetWorkingBox(0);
                            }
                            else
                                GlobalCommon.ShowMessageDialog("Mã hàng này chưa có công đoạn nào được phân tích. Vui lòng kiểm tra lại.", function () { }, 'Thông báo');
                            if (Global.Data.warningChuaCoQTCN)
                                GlobalCommon.ShowMessageDialog('Quy trình công nghệ chưa được tạo. Bạn cần phải lưu quy trình công nghệ trước rồi mới có thể tạo thiết kế chuyền được !.', function () { }, "Lỗi thao tác");

                        }
                        else {
                            $('#techId').val(result.Data.Id);
                            $('#total-worker').val(result.Data.NumberOfWorkers);
                            $('#pricePerSecond').val(result.Data.PricePerSecond);
                            $('#allowance').val(result.Data.Allowance);
                            $('#work-time').val(result.Data.WorkingTimePerDay);
                            $('#paced_production').html(Math.round((result.Data.PacedProduction) * 1000) / 1000);
                            $('#time-product').html(Math.round((result.Data.TimeCompletePerCommo) * 1000) / 1000);
                            Global.Data.TimeProductPerCommodity = result.Data.TimeCompletePerCommo;
                            $('#pro_group_day').html(Math.round(result.Data.ProOfGroupPerDay * 1000) / 1000);
                            $('#productivity').html(Math.round(result.Data.ProOfGroupPerHour * 1000) / 1000);
                            $('#pro_person_day').html(Math.round(result.Data.ProOfPersonPerDay * 1000) / 1000);
                            $('#des').val(result.Data.Note);

                            if (result.Data.details.length > 0) {
                                str = '';
                                var tog = 0
                                $.each(result.Data.details, function (index, item) {
                                    var ii = index + 1;
                                    str += '<tr>';
                                    str += '<td>' + ii + '</td>';
                                    str += '<td>' + item.PhaseCode + '</td>';
                                    str += '<td>' + item.PhaseName + '</td>';
                                    str += '<td><a class="blue" title="' + item.EquipmentName + '">' + item.EquipmentCode + '</a></td>';
                                    str += '<td>' + Math.round((item.StandardTMU) * 1000) / 1000 + '</td>';
                                    str += '<td><input class="form-control" percent type="text" id="percent' + ii + '" value="' + item.Percent + '" onchange ="ResetTime_Percent(\'' + ii + '\')" /></td>';
                                    str += '<td>' + Math.round((item.TimeByPercent) * 1000) / 1000 + '</td>';
                                    str += '<td>' + Math.round(item.Worker * 1000) / 1000 + '</td>';
                                    str += '<td><input class="form-control" description type="text"  value="' + item.Description + '"  /></td>';
                                    str += '</tr>';
                                    obj = {
                                        Id: item.Id,
                                        TechProcessVersionId: item.TechProcessVersionId,
                                        CA_PhaseId: item.CA_PhaseId,
                                        OrderIndex: ii,
                                        EquipmentId: null,
                                        StandardTMU: Math.round((item.StandardTMU) * 1000) / 1000,
                                        Percent: item.Percent,
                                        TimeByPercent: Math.round((item.TimeByPercent) * 1000) / 1000,
                                        Worker: Math.round(item.Worker * 1000) / 1000,
                                        Description: item.Description

                                    };
                                    Global.Data.TechCycle_Arr.push(obj);
                                    tog += item.TimeByPercent;
                                });
                                Global.Data.TimeProductPerCommodity = Math.round((tog) * 1000) / 1000;
                                $('#' + Global.Element.JtableTech_Cycle).find('tbody').empty().append(str);
                                ResetWorkingBox(0);
                                $('#tile-parent').change();
                            }
                        }

                        if (!Global.Data.warningChuaCoQTCN)
                            Global.Data.warningChuaCoQTCN = true;
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

    function SaveTechVersion() {
        var details = JSON.stringify(Global.Data.TechProcessVersion.details);
        var ver = Global.Data.TechProcessVersion;
        ver.details = [];

        $.ajax({
            url: Global.UrlAction.SaveTech,
            type: 'post',
            data: JSON.stringify({ 'version': ver, 'details': details }),//ko.toJSON(Global.Data.TechProcessVersion),
            contentType: 'application/json',
            beforeSend: function () { $('#loading').show(); },
            success: function (result) {
                $('#loading').hide();
                GlobalCommon.CallbackProcess(result, function () {
                    if (result.Result != "ERROR") {
                        $('#techId').val(result.Result)
                        if (Global.Data.AfterSave)
                            $('[techexport]').click();
                        else
                            GlobalCommon.ShowMessageDialog('Lưu thành công.', function () { }, "Thông báo");
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

    function GetData() {
        var version = {
            Id: $('#techId').val(),
            ParentId: Global.Data.ParentID,
            PricePerSecond: $('#pricePerSecond').val(),
            Allowance: $('#allowance').val(),
            NumberOfWorkers: $('#total-worker').val(),
            WorkingTimePerDay: parseFloat($('#work-time').val()),
            PacedProduction: parseFloat($('#paced_production').html()),
            TimeCompletePerCommo: parseFloat($('#time-product').html()),
            ProOfGroupPerDay: parseFloat($('#pro_group_day').html()),
            ProOfGroupPerHour: parseFloat($('#productivity').html()),
            ProOfPersonPerDay: parseFloat($('#pro_person_day').html()),
            Note: $('#des').val(),
            details: null,
            ProductId: Global.Data.productId
        }
        var $selectedRows = $('#' + Global.Element.JtableTech_Cycle).find('tbody tr')
        if ($selectedRows.length > 0) {
            $selectedRows.each(function (i, item) {
                Global.Data.TechCycle_Arr[i].Description = $($(this).find('[description]')).val();
                Global.Data.TechCycle_Arr[i].Percent = $($(this).find('[percent]')).val();
                // Global.Data.TechCycle_Arr[i].Worker = $($($($selectedRows[i]).find('td'))[5]).html();
            });
        }
        Global.Data.TechProcessVersion = version;
        Global.Data.TechProcessVersion.details = Global.Data.TechCycle_Arr;
    }

    function ResetWorkingBox(index) {
        total_worker = parseFloat($('#total-worker').val());
        total_worktime = parseFloat($('#work-time').val());
        total_timePerProduct = Global.Data.TimeProductPerCommodity;

        paced_production = Math.round(((total_timePerProduct / total_worker)) * 1000) / 1000;
        pro_group_per_hour = Math.round(((3600 / total_timePerProduct) * total_worker) * 1000) / 1000;
        pro_group_per_day = Math.round((pro_group_per_hour * total_worktime) * 1000) / 1000;
        pro_person_per_day = Math.round((pro_group_per_day / total_worker) * 1000) / 1000;

        // nhip do sx
        $('#paced_production').html(paced_production);
        //nang xuat to trong 1 gio
        $('#productivity').html(pro_group_per_hour);
        // nag xuat to trong 1 ngay  
        $('#pro_group_day').html(pro_group_per_day);
        // nag xuat 1 nguoi trong 1 ngay 
        $('#pro_person_day').html(pro_person_per_day);

        var tong = 0;
        var $selectedRows = $('#' + Global.Element.JtableTech_Cycle).find('tbody tr')
        if ($selectedRows.length > 0) {
            $selectedRows.each(function (i, item) {
                time_per = Global.Data.TechCycle_Arr[i].TimeByPercent;
                laodong = Math.round(((time_per / paced_production)) * 1000) / 1000;
                $($($(this).find('td'))[7]).html(laodong);
                Global.Data.TechCycle_Arr[i].Worker = laodong;
                tong += laodong;
            });
            // alert(tong);
        }
    }

    function ResetTime_Percent(index) {
        i = parseInt(index);
        value = $('#percent' + i).val();
        var $selectedRows = $('#' + Global.Element.JtableTech_Cycle).find('tbody tr');
        time = parseFloat(Global.Data.TechCycle_Arr[i - 1].StandardTMU);
        timeByPercent = Math.round(((time * 100) / parseFloat(value)) * 1000) / 1000;

        $($($($selectedRows[i - 1]).find('td'))[6]).html(ParseStringToCurrency(timeByPercent));

        oldValue = parseFloat($('#time-product').html());
        oldValue = oldValue - Global.Data.TechCycle_Arr[i - 1].TimeByPercent;
        new_Value = Math.round((oldValue + timeByPercent) * 1000) / 1000;
        $('#time-product').html(Math.round(new_Value * 1000) / 1000);
        Global.Data.TechCycle_Arr[i - 1].TimeByPercent = timeByPercent;
        Global.Data.TimeProductPerCommodity = new_Value;
        ResetWorkingBox(index);
    }

    /************************        thiết kế chuyền           *************************/

    function recursive_offset(aobj) {
        var currOffset = {
            x: 0,
            y: 0
        }
        var newOffset = {
            x: 0,
            y: 0
        }

        if (aobj !== null) {

            if (aobj.scrollLeft) {
                currOffset.x = aobj.scrollLeft;
            }

            if (aobj.scrollTop) {
                currOffset.y = aobj.scrollTop;
            }

            if (aobj.offsetLeft) {
                currOffset.x -= aobj.offsetLeft;
            }

            if (aobj.offsetTop) {
                currOffset.y -= aobj.offsetTop;
            }

            if (aobj.parentNode !== undefined) {
                newOffset = recursive_offset(aobj.parentNode);
            }

            currOffset.x = currOffset.x + newOffset.x;
            currOffset.y = currOffset.y + newOffset.y;
            console.log(aobj.id + ' x' + currOffset.x + ' y' + currOffset.y);
        }
        return currOffset;
    }

}

