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
GPRO.namespace('MType');
GPRO.MType = function () {
	var Global = {
		UrlAction: {
			GetListManipulation: '/MType/Gets_',
			SaveManipulation: '/MType/Save_',
			DeleteManipulation: '/MType/Delete_',

			SaveMType: '/MType/Save',
			DeleteMType: '/MType/Delete',
			GetMTypes: '/MType/GetMTypes',

			GetEquipmentTypes: '/EquipmentType/GetSelects',
			GetEquipmentTypeAttributes: '/MType/GetEquipmentTypeAttributeByEquipmentTypeId',
			GetStopPrecisions: '/MType/GetStopPrecisions',
			GetNatureCuts: '/MType/GetNatureCuts',
			GetApplyPressures: '/MType/GetApplyPressures',
			GetEquipments: '/Equipment/GetEquipmentsByEquipmentType',

			CalculationMachineTMU: '/Equipment/CalculationMachineTMU',
			GetMachineTMUByManipulationId: '/MType/GetManipulationEquipmentByManipulationId',
			GetManipulationFileById: '/MType/GetManipulationFileById'
		},
		Element: {
			PopupMType: 'popup_MType',
			JtableManipulation: 'jtableManipulation',
			PopupManipulation: 'popup_Manipulation',
			PopupManipulationWithoutMachine: 'popup_ManipulationWithoutMachine',
			Search: 'Search_Popup',
			JtableManipulationTMU: 'jtable-maniTMU',
			jtableEquipment: 'jtable-equipment',
			popupEquipment: 'popup_Equipment',
			popupManipulationFile: 'popupManipulationFile'
		},
		Data: {
			ModelMType: {},
			ModelManipulation: {},
			ModelManipulationWithoutMachine: {},
			IsUseMachine: false,
			ParentID: 0,
			Node: '',
			NodeUseToFind: '',
			MTypeId: 0,
			Model: {},
			MTypeArray: [],
			MachineTMUArray: [],
			AttrValues: '',
			ModelFileUploaded: [],
			defaultValue: '',

			MtypeIsInsert: true,
			MIsInsert: true,
		}
	}
	this.GetGlobal = function () {
		return Global;
	}

	this.Init = function () {
		RegisterEvent();
		BindManiTypeData(null);
		LoadMType();
		GetNatureCutSelect();
		GetStopPrecisionSelect();
		GetApplyPressureSelect();
		InitListManipulationTMU();
		ReloadListManipulationTMU();
		InitListEquipment();
		GetEquipmentTypeSelect();
		InitPopup();
		InitPopup_();
	}

	this.reloadListMType = function () {
		ReloadListMType();
	}

	var RegisterEvent = function () {
	    $('#' + Global.Element.PopupManipulation).on('shown.bs.modal', function () {
	        $('div.divParent').attr('currentPoppup', Global.Element.PopupManipulation.toUpperCase());
	    });
	    $('#' + Global.Element.Search).on('shown.bs.modal', function () {
	        $('div.divParent').attr('currentPoppup', Global.Element.Search.toUpperCase());
	    });
		$('[close]').click(function () {
		    ResetData();
		    $('div.divParent').attr('currentPoppup', '');
		});
		$('[search]').click(function () {
			ReloadListManipulation();
			$('#keyword').val('');
			$('#searchBy').val(0);
			$('#Manipulation').val(0);
			$('[close]').click();
		});
         // Register event after upload file done the value of [filelist] will be change => call function save your Data 
		$('[filelist]').change(function () {
			SaveManipulation();
		});


		$('#isUseMachine').click(function () {
			if ($(this).is(':checked')) {
				$('#equipmment-box').show();
			}
			else
				$('#equipmment-box').hide();
		})
 

		$('#equipmentType').change(function () {
			if (Global.Data.MachineTMUArray.length > 0) {
				GlobalCommon.ShowConfirmDialog('Thao Tác này đã có tính chỉ số TMU cho 1 vài thiết bị.\nNếu bạn thay đổi Loại Thiết bị sẽ dẫn đến các \nThông số TMU của Thiết bị sẽ không còn đúng.\nVì vậy các thông số TMU cũ sẽ bị xóa Bạn có muốn thay đổi không ?', function () {
					Global.Data.MachineTMUArray.length = 0;
					ReloadListManipulationTMU();
					Reset_EquipmentType_Change();
				}, function () {
					$('#equipmentType').val(Global.Data.ModelManipulation.EquipmentTypeId);
				}, 'Đồng ý', 'Hủy bỏ', 'Thông báo');
			}
			else {
				Reset_EquipmentType_Change();
			}
		});

		$('#stopPrecision').change(function () {
			flag = true;
			if (Global.Data.MachineTMUArray.length > 0) {
				GlobalCommon.ShowConfirmDialog('Thao Tác này đã có tính chỉ số TMU cho 1 vài thiết bị.\nNếu bạn thay đổi Độ Dừng Chính Xác sẽ dẫn đến các \nThông số TMU của Thiết bị sẽ không còn đúng.\nVì vậy các thông số TMU cũ sẽ bị xóa Bạn có muốn thay đổi không ?', function () {
					Global.Data.MachineTMUArray.length = 0;
					ReloadListManipulationTMU();
				}, function () {
					$('#stopPrecision').val(Global.Data.ModelManipulation.StopPrecisionId);
					flag = false;
				}, 'Đồng ý', 'Hủy bỏ', 'Thông báo');
			}

			if (flag) {
				str = '';
				if ($('#equipmentType option:selected').attr('equip_default') == '1')
					str = Global.Data.defaultValue + $('#distance').val() + $('#stopPrecision option:selected').attr('code');
				else if ($('#equipmentType option:selected').attr('equip_default') == '2')
					str = Global.Data.defaultValue + $('#distance').val() + $('#natureCut option:selected').attr('code') + $('#stopPrecision option:selected').attr('code');
				$('#code-mani').val(str);
			}
		});

		$('#natureCut').change(function () {
			flag = true;
			if (Global.Data.MachineTMUArray.length > 0) {
				GlobalCommon.ShowConfirmDialog('Thao Tác này đã có tính chỉ số TMU cho 1 vài thiết bị.\nNếu bạn thay đổi Tính Chất Cắt sẽ dẫn đến các \nThông số TMU của Thiết bị sẽ không còn đúng.\nVì vậy các thông số TMU cũ sẽ bị xóa Bạn có muốn thay đổi không ?', function () {
					Global.Data.MachineTMUArray.length = 0;
					ReloadListManipulationTMU();
				}, function () {
					$('#natureCut').val(Global.Data.ModelManipulation.NatureCutsId);
					flag = false;
				}, 'Đồng ý', 'Hủy bỏ', 'Thông báo');
			}
			if (flag) {
				str = Global.Data.defaultValue + $('#distance').val() + $('#natureCut option:selected').attr('code') + $('#stopPrecision option:selected').attr('code');
				$('#code-mani').val(str);
			}
		});

		$('#ApplyPressure').change(function () {
			if (Global.Data.MachineTMUArray.length > 0) {
				GlobalCommon.ShowConfirmDialog('Thao Tác này đã có tính chỉ số TMU cho 1 vài thiết bị.\nNếu bạn thay đổi Lực Tác Dụng sẽ dẫn đến các \nThông số TMU của Thiết bị sẽ không còn đúng.\nVì vậy các thông số TMU cũ sẽ bị xóa Bạn có muốn thay đổi không ?', function () {
					Global.Data.MachineTMUArray.length = 0;
					ReloadListManipulationTMU();
				}, function () { $('#ApplyPressure').val(Global.Data.ModelManipulation.ApplyPressureId); }, 'Đồng ý', 'Hủy bỏ', 'Thông báo');
			}
		});

		$('#distance').change(function () {
			flag = true;
			if (Global.Data.MachineTMUArray.length > 0) {
				GlobalCommon.ShowConfirmDialog('Thao Tác này đã có tính chỉ số TMU cho 1 vài thiết bị.\nNếu bạn thay đổi Khoảng Cách sẽ dẫn đến các \nThông số TMU của Thiết bị sẽ không còn đúng.\nVì vậy các thông số TMU cũ sẽ bị xóa Bạn có muốn thay đổi không ?', function () {
					Global.Data.MachineTMUArray.length = 0;
					ReloadListManipulationTMU();
				}, function () {
					$('#distance').val(Global.Data.ModelManipulation.Distance)
					flag = false;
				}, 'Đồng ý', 'Hủy bỏ', 'Thông báo');
			}

			if (flag) {
				str = '';
				if ($('#equipmentType option:selected').attr('equip_default') == '1')
					str = Global.Data.defaultValue + $('#distance').val() + $('#stopPrecision option:selected').attr('code');
				else if ($('#equipmentType option:selected').attr('equip_default') == '2')
					str = Global.Data.defaultValue + $('#distance').val() + $('#natureCut option:selected').attr('code') + $('#stopPrecision option:selected').attr('code');
				$('#code-mani').val(str);
			}
		});

		$('#distance').keypress(function (evt) {
			isNumberKey(evt);
		});
         
		$('#' + Global.Element.popupEquipment).on('shown', function () {
			$('#' + Global.Element.PopupManipulation).css('z-index', 1040);
			ReloadListEquipment();
		});

		$('[cancel-mani]').click(function () {
		    ResetManipulationData();
		    $('div.divParent').attr('currentPoppup', '');
		});


		$('[cancel-equip-popup]').click(function () {
			$('#' + Global.Element.PopupManipulation).css('z-index', 1041);
		});

		$('[closefile]').click(function () {
			$('#manipulationFile').empty();
		});



		$('#TMU-standard-1').keypress(function (evt) {
			isNumberKey(evt);
		});

		$('#TMU-user-1').keypress(function (evt) {
			isNumberKey(evt);
		});

		$('#code-mani-1').on('keypress, keydown', function (event) {
			//var $field = $(this);
			//value = $(this).val();
			//if (Global.Data.defaultValue != '') {
			//	if ((event.which != 37 && (event.which != 39)) && ((this.selectionStart < Global.Data.defaultValue.length) || ((this.selectionStart == Global.Data.defaultValue.length) && (event.which == 8)))) {
			//		return false;
			//	}
			//}
		});

		$('#code-mani').on('keypress, keydown', function (event) {
			var $field = $(this);
			value = $(this).val();
			if (Global.Data.defaultValue != '') {
				if ((event.which != 37 && (event.which != 39)) && ((this.selectionStart < Global.Data.defaultValue.length) || ((this.selectionStart == Global.Data.defaultValue.length) && (event.which == 8)))) {
					return false;
				}
			}
		});

		$('#' + Global.Element.PopupManipulation).on('shown', function () {
			if ((typeof (Global.Data.ModelManipulation.Id) == 'undefined' || Global.Data.ModelManipulation.Id == 0)) {
				if (Global.Data.defaultValue != '') {
					$('#code-mani-1').val(Global.Data.defaultValue);
					$('#code-mani').val(Global.Data.defaultValue);
					$('#distance').val(0);
				}
			}
		});
	}

	/********************************************************************************************************************        
                                                        MANIPULATION  
    ********************************************************************************************************************/
	function InitPopup_() {
		$("#" + Global.Element.PopupManipulation).modal({
			keyboard: false,
			show: false
		});
		$("#" + Global.Element.PopupManipulation + ' button[save-mani]').click(function () {
			if (CheckManipulationValidate())
				SaveManipulation();
		});

		$("#" + Global.Element.PopupManipulation + ' button[cancel-mani]').click(function () {
			$("#" + Global.Element.PopupManipulation).modal("hide");
			ResetManipulationData();
		});
	}

	function InitManiWithMachineViewModel(manipulation) {
		var manipulationViewModel = {
			Id: 0,
			Name: '',
			Code: '',
			MTypeId: 0,
			EquipmentTypeId: null,
			StandardTMU: 0,
			UserTMU: 0,
			StopPrecisionId: null,
			ApplyPressureId: null,
			NatureCutsId: null,
			Distance: null,
			Description: '',
			isListAttachFileChange: false,
			isListMachineTMUChange: false
		};
		if (manipulation != null) {
			manipulationViewModel = {
				Id: ko.observable(manipulation.Id),
				Name: ko.observable(manipulation.Name),
				Code: ko.observable(manipulation.Code),
				MTypeId: ko.observable(manipulation.MTypeId),
				EquipmentTypeId: ko.observable(manipulation.EquipmentTypeId),
				Description: ko.observable(manipulation.Description),
				StandardTMU: manipulation.StandardTMU,
				UserTMU: manipulation.UserTMU,
				StopPrecisionId: manipulation.StopPrecisionId,
				ApplyPressureId: manipulation.ApplyPressureId,
				NatureCutsId: manipulation.NatureCutsId,
				Distance: manipulation.Distance,
				isListAttachFileChange: manipulation.isListAttachFileChange,
				isListMachineTMUChange: manipulation.isListMachineTMUChange,
			};
		}
		return manipulationViewModel;
	}

	function BindManiWithMachineData(manipulation) {
		Global.Data.ModelManipulation = InitManiWithMachineViewModel(manipulation);
		ko.applyBindings(Global.Data.ModelManipulation, document.getElementById(Global.Element.PopupManipulation));
	}

	function InitListManipulation() {
		$('#' + Global.Element.JtableManipulation).jtable({
			title: 'Quản Lý Thư Viện Thao Tác',
			paging: true,
			pageSize: 10,
			pageSizeChangeMType: true,
			sorting: true,
			selectShow: true,
			actions: {
				listAction: Global.UrlAction.GetListManipulation,
				createAction: Global.Element.PopupManipulation,
				createObjDefault: BindManiWithMachineData(null),
				searchAction: Global.Element.Search,
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
				Name: {
					visibility: 'fixed',
					title: "Tên Thao Tác ",
					width: "20%", 
				},
				Code: {
					title: "Mã",
					width: "5%",
				},
				MTypeName: {
                    title: "Loại Thao Tác",
                    sorting: false,
					width: "10%",
				},
				MachineType: {
					title: "Xem TMU Thiết Bị",
					width: "5%",
					edit: false,
					sorting: false,
					display: function (manipulation) {
						if (manipulation.record.EquipmentTypeId != null) {
							var $img = $('<button  class="jtable-command-button jtable-edit-command-button icon list-icon " title="Xem chỉ số TMU của Loại Thao Tác theo nhiểu thiết bị"></button>');
							$img.click(function () {
								$('#' + Global.Element.JtableManipulation).jtable('openChildTable',
                                        $img.closest('tr'),
                                        {
                                        	title: 'Danh sách Thiết bị của Thao Tác ' + manipulation.record.Name,
                                        	paging: true,
                                        	pageSize: 3,
                                        	pageSizeChangeMType: true,
                                        	sorting: true,
                                        	selectShow: true,
                                        	actions: {
                                        		listAction: '/MType/GetManipulationEquipment?Id=' + manipulation.record.Id
                                        	},
                                        	fields: {
                                        		ManipulationId: {
                                        			type: 'hidden',
                                        			defaultValue: manipulation.record.Id
                                        		},
                                        		Id: {
                                        			key: true,
                                        			create: false,
                                        			edit: false,
                                        			list: false
                                        		},
                                        		EquipmentName: {
                                        			title: 'Thiết Bị',
                                        			width: '20%',
                                        		},
                                        		MachineTMU: {
                                        			title: 'TMU Thiết Bị',
                                        			width: '5%'
                                        		},
                                        		UserTMU: {
                                        			title: 'TMU tự Chọn',
                                        			width: '5%',
                                        		},
                                        		Note: {
                                        			title: 'Thông số Thiết Bị',
                                                    width: '20%',
                                                    sorting: false,
                                        		}
                                        	}
                                        }, function (data) { //opened handler
                                        	data.childTable.jtable('load');
                                        });
							});
							return $img;
						}
					}
				},
				//Videos: {
				//	title: "Videos Mẫu",
				//	width: "10%",
				//	display: function (data) {
				//		var $img = $('<button  class="jtable-command-button jtable-edit-command-button icon media-icon" title="Xem chỉ số TMU của Loại Thao Tác theo nhiểu thiết bị"></button>');
				//		$img.click(function () {
				//			LoadManipulationFile(data.record.Id, true);
				//		});
				//		return $img;
				//	}
				//},
				EquipmentName: {
					title: "Loại Thiết Bị",
					width: "10%",
				},
				StandardTMU: {
					title: "TMU chuẩn",
					width: "5%",
					display: function (data) {
						txt = ParseStringToCurrency(data.record.StandardTMU);
						return txt;
					}
				},
				UserTMU: {
					title: "TMU Tự Chọn",
					width: "5%",
					display: function (data) {
						txt = ParseStringToCurrency(data.record.UserTMU);
						return txt;
					}
				},
				Description: {
                    title: "Mô Tả",
                    sorting: false,
					width: "20%"
				},
				edit: {
					title: '',
					width: '1%',
					sorting: false,
					display: function (data) {
						var text = $('<i data-toggle="modal" data-target="#' + Global.Element.PopupManipulation + '" title="Chỉnh sửa thông tin" class="fa fa-pencil-square-o clickable blue"  ></i>');
						text.click(function () {
							Global.Data.MachineTMUArray.splice(0, Global.Data.MachineTMUArray.length);
							SetManipulationData(data.record);
							Global.Data.MIsInsert = false;
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
								DeleteManipulation(data.record.Id);
							}, function () { }, 'Đồng ý', 'Hủy bỏ', 'Thông báo');
						});
						return text;
					}
				}
			}
		});
	}

	function ReloadListManipulation() {
		if (Global.Data.MTypeId != 0) {
			$('#' + Global.Element.JtableManipulation).jtable('load', { 'keyword': $('#keyword').val(), 'searchBy': $('#searchBy').val(), 'maniType': Global.Data.MTypeId });
			$('#' + Global.Element.Search).modal('hide');
		}
	}

	function SaveManipulation() {
		GetManipulationData();
		if (Global.Data.MTypeId != 0) {
			$.ajax({
				url: Global.UrlAction.SaveManipulation,
				type: 'post',
				data: JSON.stringify({ 'ManiModel': Global.Data.ModelManipulation, 'TMUModel': Global.Data.MachineTMUArray, 'isUseMachine': Global.Data.IsUseMachine, 'FileModel': Global.Data.ModelFileUploaded }),
				contentType: 'application/json',
				beforeSend: function () { $('#loading').show(); },
				success: function (result) {
					$('#loading').hide();
					GlobalCommon.CallbackProcess(result, function () {
						if (result.Result == "OK") {
							ReloadListManipulation(); 
							ResetManipulationData();
							if (!Global.Data.MIsInsert)  
								$("#" + Global.Element.PopupManipulation + ' button[cancel-mani]').click();
							Global.Data.MIsInsert = true;
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
		else
			GlobalCommon.ShowMessageDialog('Loại Thao Tác đang được chọn không có giá trị sử dụng không thể tạo được Thao Tác.\nVui lòng chọn Loại Thao Tác khác.', function () { }, "Đã có lỗi xảy ra trong quá trình xử lý.");
	}

	function GetManipulationData() {
		Global.Data.ModelManipulation.Id = $('#MId').val();
		Global.Data.ModelManipulation.ManipulationTypeId = Global.Data.MTypeId;

		if (!Global.Data.IsUseMachine) {
			Global.Data.ModelManipulation.Name = $('#Mname-1').val();
			Global.Data.ModelManipulation.Code = $('#code-mani-1').val();
			Global.Data.ModelManipulation.StandardTMU = $('#TMU-standard-1').val();
			Global.Data.ModelManipulation.UserTMU = $('#TMU-user-1').val();
			Global.Data.ModelManipulation.Description = $('#MDes-1').val();
		}
		else {
			Global.Data.ModelManipulation.Name = $('#Mname').val();
			Global.Data.ModelManipulation.Code = $('#code-mani').val();
			Global.Data.ModelManipulation.EquipmentTypeId = $('#equipmentType').val();

			if ($('#equipmentType option:selected').attr('equip_default') == '1' || $('#equipmentType option:selected').attr('equip_default') == '2') {
				Global.Data.ModelManipulation.NatureCutsId = $('#natureCut').val();
				Global.Data.ModelManipulation.ApplyPressureId = $('#ApplyPressure').val();
				Global.Data.ModelManipulation.StopPrecisionId = $('#stopPrecision').val();
				Global.Data.ModelManipulation.Distance = $('#distance').val();
			}
			else {
				Global.Data.ModelManipulation.NatureCutsId = null;
				Global.Data.ModelManipulation.ApplyPressureId = null;
				Global.Data.ModelManipulation.StopPrecisionId = null;
				Global.Data.ModelManipulation.Distance = null;
			}

			Global.Data.ModelManipulation.StandardTMU = $('#TMU-standard').val();
			Global.Data.ModelManipulation.UserTMU = $('#TMU-user').val();
			Global.Data.ModelManipulation.Description = $('#MDes').val();

			var $ds = $('#' + Global.Element.JtableManipulationTMU + ' tbody').find('tr');
			if (Global.Data.MachineTMUArray.length > 0) {
				$.each($ds, function (i, item) {
					user_tmu = $(item).children().find('#user-tmu').val();
					machine_tmu = $(item).children().find('#machine-tmu').val();
					Global.Data.MachineTMUArray[i].UserTMU = user_tmu;
					Global.Data.MachineTMUArray[i].MachineTMU = machine_tmu;
				});
			}
		}
	}

	function SetManipulationData(manipulation) {
		$('#MId').val(manipulation.Id);
		Global.Data.MTypeId = manipulation.ManipulationTypeId;

		if (!Global.Data.IsUseMachine) {
			$('#Mname-1').val(manipulation.Name);
			$('#code-mani-1').val(manipulation.Code);
			$('#TMU-standard-1').val(manipulation.StandardTMU);
			$('#TMU-user-1').val(manipulation.UserTMU);
			$('#MDes-1').val(manipulation.Description);
		}
		else {
			$('#Mname').val(manipulation.Name);
			$('#code-mani').val(manipulation.Code);
			$('#equipmentType').val(manipulation.EquipmentTypeId);
			$('#TMU-standard').val(manipulation.StandardTMU);
			$('#TMU-user').val(manipulation.UserTMU);
			$('#MDes').val(manipulation.Description);

			$('#natureCut').val(manipulation.NatureCutsId);
			$('#ApplyPressure').val(manipulation.ApplyPressureId);
			$('#stopPrecision').val(manipulation.StopPrecisionId);
			$('#distance').val(manipulation.Distance);
			$('#equipmentType').change();

			Global.Data.MachineTMUArray.length = 0;
			GetManipulationEquipment(manipulation.Id);
			ReloadListManipulationTMU();
		}
		Global.Data.ModelFileUploaded.length = 0;
		Global.Data.ModelManipulation = manipulation;
		LoadManipulationFile(manipulation.Id, false);
	}

	function DeleteManipulation(Id) {
		$.ajax({
			url: Global.UrlAction.DeleteManipulation,
			type: 'POST',
			data: JSON.stringify({ 'Id': Id }),
			contentType: 'application/json charset=utf-8',
			success: function (data) {
				GlobalCommon.CallbackProcess(data, function () {
					if (data.Result == "OK") {
						ReloadListManipulation();
					}
					else
						GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình xử lý.");
				}, false, Global.Element.PopupMType, true, true, function () {

					var msg = GlobalCommon.GetErrorMessage(data);
					GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
				});
			}
		});
	}

	function CheckManipulationValidate() {
		if (!Global.Data.IsUseMachine) {
			if ($('#Mname-1').val().trim() == "") {
				GlobalCommon.ShowMessageDialog("Vui lòng nhập Tên Thao Tác .", function () { }, "Lỗi Nhập liệu");
				return false;
			}
			else if ($('#code-mani-1').val().trim() == "") {
				GlobalCommon.ShowMessageDialog("Vui lòng nhập Mã Thao Tác .", function () { }, "Lỗi Nhập liệu");
				return false;
			}
			else if ($('#TMU-standard-1').val().trim() == "") {
				GlobalCommon.ShowMessageDialog("Vui lòng nhập chỉ số TMU chuẩn.", function () { }, "Lỗi Nhập liệu");
				return false;
			}
		}
		else {
			if ($('#Mname').val().trim() == "") {
				GlobalCommon.ShowMessageDialog("Vui lòng nhập Tên Thao Tác .", function () { }, "Lỗi Nhập liệu");
				return false;
			}
			else if ($('#code-mani').val().trim() == "") {
				GlobalCommon.ShowMessageDialog("Vui lòng nhập Mã Thao Tác .", function () { }, "Lỗi Nhập liệu");
				return false;
			}
			else if ($('#equipmentType').val() == "0") {
				GlobalCommon.ShowMessageDialog("Vui lòng chọn loại Thiết bị.", function () { }, "Lỗi Nhập liệu");
				return false;
			}
			else if ($('#equipmentType option:selected').attr('equip_default') == '2' && $('#natureCut').val() == '0') {
				GlobalCommon.ShowMessageDialog("Vui lòng chọn Tính Chất Cắt.", function () { }, "Lỗi Nhập liệu");
				return false;
			}
			else if ($('#equipmentType option:selected').attr('equip_default') == '2' && $('#ApplyPressure').val() == '0') {
				GlobalCommon.ShowMessageDialog("Vui lòng chọn Lực Tác Dụng.", function () { }, "Lỗi Nhập liệu");
				return false;
			}
			else if ($('#stopPrecision').val() == "0") {
				GlobalCommon.ShowMessageDialog("Vui lòng chọn Độ Dừng Chính Xác.", function () { }, "Lỗi Nhập liệu");
				return false;
			}
			else if (($('#distance').val().trim() == '' || parseInt($('#distance').val()) == 0) && ($('#equipmentType option:selected').attr('equip_default') == '1' || $('#equipmentType option:selected').attr('equip_default') == '2')) {
				GlobalCommon.ShowMessageDialog("Vui lòng Nhập Khoảng Cách. Khoảng Cách phải lớn hơn 0", function () { }, "Lỗi Nhập liệu");
				return false;
			}
		}
		return true;
	}

	function GetNatureCutSelect() {
		$.ajax({
			url: Global.UrlAction.GetNatureCuts,
			type: 'POST',
			data: '',
			contentType: 'application/json charset=utf-8',
			success: function (data) {
				GlobalCommon.CallbackProcess(data, function () {
					if (data.Result == "OK") {
						var str = '<option value="0"> Không có Dữ Liệu </option>';
						if (data.Data.length > 0) {
							str = '';
							$.each(data.Data, function (index, item) {
								str += ' <option value="' + item.Id + '" code="' + item.Code + '" val="' + item.Factor + '">' + item.Name + '</option>';
							});
						}
						$('#natureCut').empty().append(str);
						$('#natureCut').trigger('liszt:updated');
					}
					else
						GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình xử lý.");
				}, false, Global.Element.PopupCommodity, true, true, function () {

					var msg = GlobalCommon.GetErrorMessage(data);
					GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
				});
			}
		});
	}

	function GetStopPrecisionSelect() {
		$.ajax({
			url: Global.UrlAction.GetStopPrecisions,
			type: 'POST',
			data: '',
			contentType: 'application/json charset=utf-8',
			success: function (data) {
				GlobalCommon.CallbackProcess(data, function () {
					if (data.Result == "OK") {
						var str = '<option value="0"> Không có Dữ Liệu </option>';
						if (data.Data.length > 0) {
							str = '';
							$.each(data.Data, function (index, item) {
								str += ' <option value="' + item.Id + '" code="' + item.Code + '" val="' + item.TMUNumber + '">' + item.Name + '</option>';
							});
						}
						$('#stopPrecision').empty().append(str);
						$('#stopPrecision').trigger('liszt:updated');
					}
					else
						GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình xử lý.");
				}, false, Global.Element.PopupCommodity, true, true, function () {

					var msg = GlobalCommon.GetErrorMessage(data);
					GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
				});
			}
		});
	}

	function GetApplyPressureSelect() {
		$.ajax({
			url: Global.UrlAction.GetApplyPressures,
			type: 'POST',
			data: '',
			contentType: 'application/json charset=utf-8',
			success: function (data) {
				GlobalCommon.CallbackProcess(data, function () {
					if (data.Result == "OK") {
						var str = '<option value="0"> Không có Dữ Liệu </option>';
						if (data.Data.length > 0) {
							str = '';
							$.each(data.Data, function (index, item) {
								str += ' <option value="' + item.Id + '" val="' + item.Value + '">' + item.Level + '</option>';
							});
						}
						$('#ApplyPressure').empty().append(str);
						$('#ApplyPressure').trigger('liszt:updated');
					}
					else
						GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình xử lý.");
				}, false, Global.Element.PopupCommodity, true, true, function () {

					var msg = GlobalCommon.GetErrorMessage(data);
					GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
				});
			}
		});
	}

	function GetManipulationEquipment(Id) {
		$.ajax({
			url: Global.UrlAction.GetMachineTMUByManipulationId,
			type: 'POST',
			data: JSON.stringify({ 'Id': Id }),
			contentType: 'application/json charset=utf-8',
			success: function (data) {
				GlobalCommon.CallbackProcess(data, function () {
					if (data.Result == "OK") {
						if (data.Data.length > 0) {
							$.each(data.Data, function (index, item) {
								obj = {
									Id: Global.Data.MachineTMUArray.length + 1,
									ManipulationId: item.ManipulationId,
									EquipmentId: item.EquipmentId,
									EquipmentName: item.EquipmentName,
									MachineTMU: item.MachineTMU,
									UserTMU: item.UserTMU,
									Note: item.Note
								}
								Global.Data.MachineTMUArray.push(obj);
							});
							ReloadListManipulationTMU();

						}
					}
					else
						GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình xử lý.");
				}, false, Global.Element.PopupCommodity, true, true, function () {

					var msg = GlobalCommon.GetErrorMessage(data);
					GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
				});
			}
		});
	}

	function LoadManipulationFile(Id, isSlideShow) {
		$.ajax({
			url: Global.UrlAction.GetManipulationFileById,
			type: 'POST',
			data: JSON.stringify({ 'Id': Id }),
			contentType: 'application/json charset=utf-8',
			success: function (data) {
				GlobalCommon.CallbackProcess(data, function () {
					if (data.Result == "OK") {
						if (isSlideShow) {
							GenSlideShow(data.Data, 'manipulationFile');
							$('#' + Global.Element.popupManipulationFile).modal('show');
						}
						else {
							CreateFileListTable(data.Data);
						}
					}
					else
						GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình xử lý.");
				}, false, Global.Element.PopupCommodity, true, true, function () {

					var msg = GlobalCommon.GetErrorMessage(data);
					GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
				});
			}
		});
	}

	function CreateFileListTable(files) {
		$('#tb-file').empty();
		if (files != null && files.length > 0) {
			$.each(files, function (index, item) {
				obj = {
					Id: item.Id,
					Name: item.Name,
					Path: item.Path,
					FileType: item.FileType,
					Size: item.Size
				};

				Global.Data.ModelFileUploaded.push(obj);
				ID = 'F' + item.Id;
				// tao row
				str = '<tr id="' + ID + '"><td>' + item.Name + '</td><td><img src="/CuteWebUI_Uploader_Resource.axd?type=file&amp;file=stop.png&amp;_ver=null" title="Remove" width="16" height="16" style="cursor: pointer;" onclick="deleteFileList(\'' + ID + '\')"></td></tr>';
				$('#tb-file').append(str);
			});
		}
	}

	function ResetManipulationData() {
		Global.Data.ModelManipulation = {};
		Global.Data.ModelFileUploaded.length = 0;
		Global.Data.MachineTMUArray.length = 0;
		ReloadListManipulationTMU();
		$('#MId').val('0');
		$('#Mname').val('');
		$('#code-mani').val('');
		$('#equipmentType').val('0');
		$('#machineType').val('0');
		$('#rpm').val('0');
		$('#st_cm').val('0');
		$('#weight').val('0');
		$('#stopPrecision').val('1');
		$('#natureCut').val('1');
		$('#ApplyPressure').val('1');
		$('#distance').val('0');
		$('#MDes').val('');
		$('#Mname-1').val('');
		$('#code-mani-1').val('');
		$('#TMU-standard-1').val('0');
		$('#TMU-user-1').val('0');
		$('#MDes-1').val('');
		$('#tb-file').empty();
		uploadobj = document.getElementById('uploader');
	//	uploadobj.cancelall();
	}

	function Reset_EquipmentType_Change() {
		if ($('#equipmentType option:selected').attr('equip_default') == '0') {
			$('#cut-sewing-box').hide();
			$('#code-mani').val(Global.Data.defaultValue);
			$('#code-mani').prop('disabled', false);
		}
		else {
			$('#stopPrecision').val() == null ? $('#stopPrecision').val($('#stopPrecision option:first').val()) : "";
			$('#distance').val().trim() == '' ? $('#distance').val(0) : "";
			$('#natureCut').val() == null ? $('#natureCut').val($('#natureCut option:first').val()) : "";
			$('#ApplyPressure').val() == null ? $('#ApplyPressure').val($('#ApplyPressure option:first').val()) : "";

			str = '';
			if ($('#equipmentType option:selected').attr('equip_default') == '1') {
				// may
				$('#cut-box').hide();
				str = Global.Data.defaultValue + $('#distance').val() + $('#stopPrecision option:selected').attr('code');
			}
			else if ($('#equipmentType option:selected').attr('equip_default') == '2') {
				//cut
				$('#cut-box').show();
				str = Global.Data.defaultValue + $('#distance').val() + $('#natureCut option:selected').attr('code') + $('#stopPrecision option:selected').attr('code');
			}
			$('#cut-sewing-box').show();
			$('#code-mani').val(str);
			$('#code-mani').prop('disabled', true);
		}
	}
	/********************************************************************************************************************        
                                          MANIPULATION  WITHOUT USING MACHINE
    ********************************************************************************************************************/
	function InitManiWithoutMachineViewModel(manipulation) {
		var manipulationViewModel = {
			Id: 0,
			Name: '',
			Code: 'dsd',
			MTypeId: 0,
			EquipmentTypeId: null,
			StandardTMU: 0,
			UserTMU: 0,
			MachineType: 0,
			WeightPropertyId: 0,
			RPMPropertyId: 0,
			StCmPropertyId: 0,
			StopPrecisionId: 0,
			ApplyPressureId: 0,
			NatureCutsId: 0,
			Distance: 0,
			Description: ''
		};
		if (manipulation != null) {
			manipulationViewModel = {
				Id: ko.observable(manipulation.Id),
				Name: ko.observable(manipulation.Name),
				Code: ko.observable(manipulation.Code),
				MTypeId: ko.observable(manipulation.MTypeId),
				EquipmentTypeId: ko.observable(manipulation.EquipmentTypeId),
				Description: ko.observable(manipulation.Description),
				StandardTMU: manipulation.StandardTMU,
				UserTMU: manipulation.UserTMU,
				MachineType: manipulation.MachineType,
				WeightPropertyId: manipulation.WeightPropertyId,
				RPMPropertyId: manipulation.RPMPropertyId,
				StCmPropertyId: manipulation.StCmPropertyId,
				StopPrecisionId: manipulation.StopPrecisionId,
				ApplyPressureId: manipulation.ApplyPressureId,
				NatureCutsId: manipulation.NatureCutsId,
				Distance: manipulation.Distance
			};
		}
		return manipulationViewModel;
	}

	function BindManiWithoutMachineData(manipulation) {
		Global.Data.ModelManipulation = InitManiWithoutMachineViewModel(manipulation);
		ko.applyBindings(Global.Data.ModelManipulation, document.getElementById('without-machine'));
	}




	/********************************************************************************************************************        
                                      MANIPULATION  SMALL GET TMU
    ********************************************************************************************************************/
	function InitListManipulationTMU() {
		$('#' + Global.Element.JtableManipulationTMU).jtable({
			title: 'Danh sách chỉ số TMU Thiết Bị',
			paging: true,
			pageSize: 10,
			pageSizeChangeMType: true,
			sorting: true,
			selectShow: true,

			actions: {
				listAction: Global.Data.MachineTMUArray,
				createAction: Global.Element.popupEquipment,
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
					title: 'STT',
					width: '2%'
				},
				EquipmentId: {
					list: false
				},
				EquipmentName: {
					visibility: 'fixed',
					title: "Tên Thiết Bị",
					width: "20%"
				},
				MachineTMU: {
					title: "số TMU Thiết Bị",
					width: "5%",
					display: function (data) {
						$txt = $('<input id="machine-tmu" machine-tmu onkeypress=" return isNumberKey(event)" type="text" style="max-width:70px; max-height : 20px" value="' + data.record.MachineTMU + '" ></input>');
						return $txt;
					}
				},
				UserTMU: {
					title: "số TMU tự chọn",
					width: "10%",
					display: function (data) {
						$txt = $('<input id="user-tmu" onkeypress=" return isNumberKey(event)" type="text"  style="max-width:70px; max-height : 20px" value="' + data.record.UserTMU + '" ></input>');
						return $txt;
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
								$.each(Global.Data.MachineTMUArray, function (i, item) {
									if (item.Id == data.record.Id) {
										Global.Data.MachineTMUArray.splice(i, 1);
										ReloadListManipulationTMU();
										Global.Data.ModelManipulation.isListMachineTMUChange = true;
										return false;
									}
								});

							}, function () { }, 'Đồng ý', 'Hủy bỏ', 'Thông báo');
						});
						return text;
					}
				}
			}
		});
	}

	function ReloadListManipulationTMU() {
		$('#' + Global.Element.JtableManipulationTMU).jtable('load');
		if ($('#equipmentType option:selected').attr('equip_default') != '1' && $('#equipmentType option:selected').attr('equip_default') != '2') {
			$($('#' + Global.Element.JtableManipulationTMU).find('[machine-tmu]')).prop('disabled', false);
		}
		else {
			$($('#' + Global.Element.JtableManipulationTMU).find('[machine-tmu]')).prop('disabled', true);
		}
	}

	/********************************************************************************************************************        
                                                    EQUIPMENT
    ********************************************************************************************************************/
	function InitListEquipment() {
		$('#' + Global.Element.jtableEquipment).jtable({
			title: 'Danh sách Thiết Bị',
			paging: true,
			pageSize: 10,
			pageSizeChangeEquipment: true,
			sorting: true,
			selectShow: true,
			selecting: true, //Enable selecting
			multiselect: false, //Allow multiple selecting
			selectingCheckboxes: true, //Show checkboxes on first column
			actions: {
				listAction: Global.UrlAction.GetEquipments,
				searchAction: Global.Element.PopupSearch,
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
				Code: {
					title: "Mã Thiết Bị",
					width: "10%",
				},
				Name: {
					visibility: 'fixed',
					title: "Tên Thiết Bị",
					width: "20%",
				},
				EquipmentTypeName: {
					title: "Loại Thiết Bị",
					width: "20%",
					sorting: false
				},
				Description: {
					title: "Mô Tả",
					width: "20%",
					sorting: false
				}
			},
			selectionChanged: function () {
				var $selectedRows = $('#' + Global.Element.jtableEquipment).jtable('selectedRows');
				if ($selectedRows.length > 0) {
					var record = $selectedRows.data('record');
					flag = false;
					$.each(Global.Data.MachineTMUArray, function (i, item) {
						if (item.EquipmentId == record.Id) {
							GlobalCommon.ShowMessageDialog("Thiết Bị này đã được chọn. Vui lòng kiểm tra lại.!", function () { }, "Thông báo Thiết Bị Tồn Tại");
							flag = true;
							return false;
						}
					});
					if (!flag) {
						if ($('#equipmentType option:selected').attr('equip_default') != '1' && $('#equipmentType option:selected').attr('equip_default') != '2') {
							obj = {
								Id: Global.Data.MachineTMUArray.length + 1,
								ManipulationId: 0,
								EquipmentId: record.Id,
								EquipmentName: record.Name,
								MachineTMU: 0,
								UserTMU: 0,
								Note: record.Description
							}
							Global.Data.MachineTMUArray.push(obj);
							$('#' + Global.Element.popupEquipment).modal('hide');
							ReloadListManipulationTMU();
							$($('#' + Global.Element.JtableManipulationTMU).find('#machine-tmu')).prop('disabled', false);
						}
						else {
							Calculation_Machine_TMU(record.Id, record.Name, record.Description);
						}
						$('#' + Global.Element.PopupManipulation).css('z-index', 1041);
						Global.Data.ModelManipulation.isListMachineTMUChange = true;
					}
				}
			}
		});
	}

	function ReloadListEquipment() {
		$('#' + Global.Element.jtableEquipment).jtable('load', { 'keyword': '', 'searchBy': 0, 'equipmentTypeId': $('#equipmentType').val() });
	}

	function Calculation_Machine_TMU(equipId, equipName, note) {
		$.ajax({
			url: Global.UrlAction.CalculationMachineTMU,
			type: 'POST',
			data: JSON.stringify({ 'equipmentId': equipId, 'equipmentType': $('#equipmentType option:selected').attr('equip_default'), 'distance': $('#distance').val(), 'stopPrecision': $('#stopPrecision option:selected').attr('val'), 'applyPressure': $('#ApplyPressure option:selected').attr('val'), 'natureCut': $('#natureCut option:selected').attr('val') }),
			contentType: 'application/json charset=utf-8',
			success: function (data) {
				GlobalCommon.CallbackProcess(data, function () {
					if (data.Result == "OK") {
						obj = {
							Id: Global.Data.MachineTMUArray.length + 1,
							ManipulationId: 0,
							EquipmentId: equipId,
							EquipmentName: equipName,
							MachineTMU: Math.round(data.Data * 100) / 100,
							UserTMU: 0,
							Note: note
						}
						Global.Data.MachineTMUArray.push(obj);
						$('#' + Global.Element.popupEquipment).modal('hide');
						ReloadListManipulationTMU();
						$($('#' + Global.Element.JtableManipulationTMU).find('#machine-tmu')).prop('disabled', true);
					}
					else
						return null;
				}, false, Global.Element.PopupMType, true, true, function () {

					var msg = GlobalCommon.GetErrorMessage(data);
					GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
				});
			}
		});
	}

	function GetEquipmentTypeSelect() {
		$.ajax({
			url: Global.UrlAction.GetEquipmentTypes,
			type: 'POST',
			data: '',
			contentType: 'application/json charset=utf-8',
			success: function (data) {
				GlobalCommon.CallbackProcess(data, function () {
					if (data.Result == "OK") {
						if (data.Data.length > 0) {
							str = '';
							$.each(data.Data, function (index, item) {
								str += ' <option value="' + item.Value + '" equip_default="' + item.Data + '" equip_code>' + item.Name + '</option>';
							});
							$('#equipmentType').empty().append(str);
							$('#equipmentType').trigger('liszt:updated');
						}
					}
					else
						GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình xử lý.");
				}, false, Global.Element.PopupCommodity, true, true, function () {

					var msg = GlobalCommon.GetErrorMessage(data);
					GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
				});
			}
		});
	}


	/********************************************************************************************************************        
                                                    MANIPULATION TYPE
     ********************************************************************************************************************/
	function InitManiTypeViewModel(MType) {
		var MTypeViewModel = {
			Id: 0,
			Name: '',
			Code: '',
			ParentId: '',
			IsUseMachine: false,
			Node: '',
			Description: ''
		};
		if (MType != null) {
			MTypeViewModel = {
				Id: MType.Id,
				Name: MType.Name,
				Code: MType.Code,
				ParentId: MType.ParentId,
				IsUseMachine: MType.IsUseMachine,
				Node: MType.Node,
				Description: MType.Description
			};
		}
		return MTypeViewModel;
	}

	function BindManiTypeData(MType) {
		Global.Data.ModelMType = InitManiTypeViewModel(MType);
		ko.applyBindings(Global.Data.ModelMType, document.getElementById('popup_MType'));
	}

	function SaveMType() {
		Global.Data.ModelMType.ParentId = Global.Data.ParentID;
		Global.Data.ModelMType.Node = Global.Data.Node;
		Global.Data.ModelMType.IsUseMachine = $('#mtIsUseMachine').prop('checked');

		$.ajax({
			url: Global.UrlAction.SaveMType,
			type: 'post',
			data: ko.toJSON(Global.Data.ModelMType),
			contentType: 'application/json',
			beforeSend: function () { $('#loading').show(); },
			success: function (result) {
				$('#loading').hide();
				GlobalCommon.CallbackProcess(result, function () {
					if (result.Result == "OK") {
						LoadMType();
						BindManiTypeData(null);
						Global.Data.ParentId = 0;
						Global.Data.Node = '';
						if (!Global.Data.MtypeIsInsert)
							$("#" + Global.Element.PopupMType + ' button[mtcancel]').click();
						Global.Data.MtypeIsInsert = true;
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
		$.ajax({
			url: Global.UrlAction.DeleteMType,
			type: 'POST',
			data: JSON.stringify({ 'Id': Id }),
			contentType: 'application/json charset=utf-8',
			success: function (data) {
				GlobalCommon.CallbackProcess(data, function () {
					if (data.Result == "OK") {
						LoadMType();
					}
					else
						GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình xử lý.");
				}, false, Global.Element.PopupMType, true, true, function () {

					var msg = GlobalCommon.GetErrorMessage(data);
					GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
				});
			}
		});
	}

	function CheckValidate() {
		if ($('#mtname').val().trim() == "") {
			GlobalCommon.ShowMessageDialog("Vui lòng nhập Tên Loại Thao Tác .", function () { }, "Lỗi Nhập liệu");
			return false;
		}
		return true;
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

	function LoadMType() {
		$.ajax({
			url: Global.UrlAction.GetMTypes,
			type: 'POST',
			data: '',
			contentType: 'application/json charset=utf-8',
			success: function (data) {
				GlobalCommon.CallbackProcess(data, function () {
					if (data.Result == "OK") {
						ResetMTypeTreeView(data.Data);
						//refresh
						$('#jqxTree').jqxTree('refresh');
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

	function InitPopup() {
		$("#" + Global.Element.PopupMType).modal({
			keyboard: false,
			show: false
		});
		$("#" + Global.Element.PopupMType + ' button[mtsave]').click(function () {
			if (CheckValidate()) {
				SaveMType();
			}
		});
		$("#" + Global.Element.PopupMType + ' button[mtcancel]').click(function () {
			$("#" + Global.Element.PopupMType).modal("hide");
			BindManiTypeData(null);
		});
	}

	/*********************************************************************************************
                                                    TREE VIEW
    **********************************************************************************************/
	function ResetMTypeTreeView(maniTypes) {
		//clear old item
		$('#jqxTree').jqxTree('clear');

		//
		var data = [];
		var obj = {
			'id': 0,
			'parentid': -1,
			'text': 'Loại Thư Viện Thao Tác',
			'value': '0',
			'icon': '/Images/recipegroup.png'
		}
		data.push(obj);
		if (maniTypes != null && maniTypes.length > 0) {
			$.each(maniTypes, function (index, item) {
				obj = {
					'id': item.Id,
					'parentid': item.ParentId,
					'text': item.Name,
					'value': item.Node,
					'icon': '/Images/group_config.png'
				}
				data.push(obj);

				// put vao mang 
				Global.Data.MTypeArray.push(item);
			});
		}

		// prepare the data
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
		// create data adapter.
		var dataAdapter = new $.jqx.dataAdapter(source);
		// perform Data Binding.
		dataAdapter.dataBind();
		// get the tree items. The first parameter is the item's id. The second parameter is the parent item's id. The 'items' parameter represents 
		// the sub items collection name. Each jqxTree item has a 'label' property, but in the JSON data, we have a 'text' field. The last parameter 
		// specifies the mapping between the 'text' and 'label' fields.  
		var records = dataAdapter.getRecordsHierarchy('id', 'parentid', 'items', [{ name: 'text', map: 'label' }]);


		// Create jqxTree
		$('#jqxTree').jqxTree({ source: records, width: '100%' });

		//refresh
		$('#jqxTree').jqxTree('refresh');

		$('#jqxTree').css('visibility', 'visible');

		var contextMenu = $("#jqxMenu").jqxMenu({ width: '200px', height: '81px', autoOpenPopup: false, mode: 'popup' });
		var clickedItem = null;

		var attachContextMenu = function () {
			// open the context menu when the user presses the mouse right button.
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
		$("#jqxTree").jqxTree('expandItem', $('#' + Global.Data.ParentID)[0]);
	}

	$("#jqxMenu").on('itemclick', function (event) {
		var item = $.trim($(event.args).text());
		switch (item) {
			case "Thêm Mới Loại Thao Tác":
				var selectedItem = $('#jqxTree').jqxTree('selectedItem');
				if (selectedItem == null)
					Global.Data.ParentID = 0;
				else {
					Global.Data.ParentID = selectedItem.id;
					Global.Data.Node = selectedItem.value;
				}

				$("#jqxMenu").jqxMenu('close');
				$('#' + Global.Element.PopupMType).modal('show');
				BindManiTypeData(null);
				break;
			case "Xóa Loại Thao Tác":
				var selectedItem = $('#jqxTree').jqxTree('selectedItem');
				if (selectedItem != null) {
					Global.Data.ParentID = selectedItem.parentId;
					GlobalCommon.ShowConfirmDialog('Bạn có chắc chắn muốn xóa?', function () {
						Delete(selectedItem.id);
					}, function () { }, 'Đồng ý', 'Hủy bỏ', 'Thông báo');
				}
				break;
			case "Cập Nhật Loại Thao Tác":
				var selectedItem = $('#jqxTree').jqxTree('selectedItem');
				if (selectedItem != null) {
					var obj = {};
					$.each(Global.Data.MTypeArray, function (index, item) {
						if (item.Id == parseInt(selectedItem.id)) {
							obj = item;
							return;
						}
					});
					BindManiTypeData(obj);
					if (obj.IsUseMachine)
						$('#mtIsUseMachine').bootstrapToggle('on');
					else
						$('#mtIsUseMachine').bootstrapToggle('off');
					// $('#code').prop('disabled', true);

					$('#' + Global.Element.PopupMType).modal('show');
					Global.Data.MtypeIsInsert = false;
				}
				break;
		}
	});

	// disable the default browser's context menu.
	$(document).on('contextmenu', function (e) {
		if ($(e.target).parents('.jqx-tree').length > 0) {
			return false;
		}
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
		var selectedItem = $('#jqxTree').jqxTree('getItem', args.element);
		if (selectedItem.value != '0') {
			Global.Data.NodeUseToFind = selectedItem.value + selectedItem.id;
		}
		else {
			Global.Data.NodeUseToFind = selectedItem.id + ',';
		}

		$.each(Global.Data.MTypeArray, function (index, item) {
			if (item.Id == parseInt(selectedItem.id)) {
				if (item.IsUseMachine) {
					$('#machine-box').show();
					$('#distance').prop('disabled', false);
					Global.Data.IsUseMachine = true;
					$('#use-machine').show();
					$('#tb-use-machine').show();
					$('#without-machine').hide();
					$('#' + Global.Element.PopupManipulation).addClass('modal-3-col');
				}
				else {
					$('#machine-box').hide();
					$('#distance').prop('disabled', true);
					Global.Data.IsUseMachine = false;
					$('#use-machine').hide();
					$('#tb-use-machine').hide();
					$('#without-machine').show();
					$('#' + Global.Element.PopupManipulation).removeClass('modal-3-col');

				}
				Global.Data.defaultValue = item.Code;
				return false;
			}
		});
		Global.Data.MTypeId = parseInt(selectedItem.id);

		InitListManipulation();
		ReloadListManipulation();
		$('#' + Global.Element.JtableManipulation).find('.jtable-title-text').html('Thư Viện Thao Tác của Loại : ' + selectedItem.label);
	});

	/********************************************************************************************/

}

