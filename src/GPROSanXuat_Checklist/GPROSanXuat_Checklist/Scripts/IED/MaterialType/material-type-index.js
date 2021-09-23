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
GPRO.namespace('MaterialType');
GPRO.MaterialType = function () {
    var Global = {
        UrlAction: {
            GetList: '/MaterialType/Gets',
            Save: '/MaterialType/Save',
            Delete: '/MaterialType/Delete',

            GetMaterials: '/Material/Gets?mTypeId=',
            SaveMaterial: '/Material/Save',
            DeleteMaterial: '/Material/Delete',
            GetNorms: '/Material/GetNorms',
            GetSelect: '/Material/GetSelectList',
        },
        Element: {

            Jtable: 'material-type-jtable',
            JtableNorms: 'material-norms-jtable',
            PopupType: 'material-type-popup',
            PopupTypeSearch: 'material-type-popup-search',

            PopupMaterial: 'material-popup',
            PopupSearchMaterial: 'material-popup-search',
        },
        Data: {
            MaterialType: {},
            ModelMaterial: {},
            MTypeId: 0,
            mtypeLastIndex: 0,
            mtypeCode: '',
            mLastIndex: 0,
            mCode: '',
            Norms: [],
            materialArr: []
        }
    }
    this.GetGlobal = function () {
        return Global;
    }

    this.Init = function () {
        RegisterEvent();
        GetMTypeLastIndex();
        GetMaterialLastIndex();
        InitPopup_Type();
        InitSearchPopup_Type();
        InitList();
        ReloadList();

        GetMaterialTypeSelect('material-type');
        GetUnitSelect('material-unit', 'VATTU');

        InitPopupMaterial();
        //InitMaterialSearchPopup();
        //BindMaterialData(null);

        GetMaterialSelect(0);
        InitListNorms();
        AddEmpty();
    }

    var RegisterEvent = function () {
        $('[re-material-unit]').click(function () {
            GetUnitSelect('material-unit', 'VATTU');
        });

        $('[re-material-type]').click(function () {
            GetMaterialTypeSelect('material-type');
        });

        $('#' + Global.Element.Popup).on('show.bs.modal', function (e) {
            if ($('#mtype_index').val() == '')
                $('#mtype_index').val((Global.Data.mtypeCode + (Global.Data.mtypeLastIndex + 1)));
        });

        $('#' + Global.Element.PopupMaterial).on('show.bs.modal', function (e) {
            if (Global.Data.ModelMaterial.Id == 0) {
                $('#Unit option:first').prop('selected', true);
            }

            if ($('#m_index').val() == '')
                $('#m_index').val((Global.Data.mCode + (Global.Data.mLastIndex + 1)))
            //  ReloadListNorms();
        });

        $('#material-file-upload').change(function () {
            readURL(this);
        });

        $('#material-btn-file-upload').click(function () {
            $('#material-file-upload').click();
        });

        // Register event after upload file done the value of [filelist] will be change => call function save your Data 
        $('#material-file-upload').select(function () {
            SaveMaterial();
        });
    }

    /**********************************************************************************************************************
                                                            MaterialType
    ***********************************************************************************************************************/


    function ResetForm_Type() {
        $('#material-type-id').val('0');
        $('#material-type-name').val('');
        $('#material-type-note').val('');
        GetMaterialLastIndex();
    }

    function InitList() {
        $('#' + Global.Element.Jtable).jtable({
            title: 'Danh Sách Loại Vật Tư',
            paging: true,
            pageSize: 10,
            pageSizeChange: true,
            sorting: true,
            selectShow: false,
            actions: {
                listAction: Global.UrlAction.GetList,
                //createAction: Global.Element.Popup,
                searchAction: Global.Element.PopupSearch,
            },
            messages: {
                //addNewRecord: 'Thêm mới',
                searchRecord: 'Tìm kiếm',
                //selectShow: 'Ẩn hiện cột'
            },
            searchInput: {
                id: 'material-type-keyword',
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
                if (data.record.Id == Global.Data.MTypeId) {
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
                Index: {
                    title: "Mã Loại Vật Tư",
                    width: "10%",
                    display: function (data) {
                        return `<span >${Global.Data.mtypeCode}${data.record.Index}</span>`;
                    }
                },
                Name: {
                    visibility: 'fixed',
                    title: "Tên Loại Vật Tư",
                    width: "15%",
                },
                Note: {
                    title: "Mô Tả",
                    width: "20%",
                    sorting: false
                },
                Detail: {
                    title: 'DS Vật Tư',
                    width: '3%',
                    sorting: false,
                    edit: false,

                    display: function (parent) {
                        var $img = $('<i class="fa fa-list-ol clickable red aaa" title="Click Xem Danh sách vật tư ' + parent.record.Name + '"></i>');
                        $img.click(function () {
                            Global.Data.MTypeId = parent.record.Id;
                            $('#' + Global.Element.Jtable).jtable('openChildTable',
                                $img.closest('tr'),
                                {
                                    title: '<span class="red">Danh sách vật tư của loại : ' + parent.record.Name + '</span>',
                                    paging: true,
                                    pageSize: 10,
                                    pageSizeChange: true,
                                    sorting: true,
                                    selectShow: false,
                                    actions: {
                                        listAction: Global.UrlAction.GetMaterials + '' + parent.record.Id,
                                        createAction: Global.Element.PopupMaterial,
                                    },
                                    messages: {
                                        addNewRecord: 'Thêm vật tư',
                                        //searchRecord: 'Tìm kiếm',
                                        //selectShow: 'Ẩn hiện cột'
                                    },
                                    fields: {
                                        OrderId: {
                                            type: 'hidden',
                                            defaultValue: parent.record.Id
                                        },
                                        Id: {
                                            key: true,
                                            create: false,
                                            edit: false,
                                            list: false
                                        },
                                        Picture: {
                                            title: " ",
                                            width: "3%",
                                            display: function (data) {
                                                var text = $('<img src="' + data.record.Picture + '" width="40"/>');
                                                if (data.record.Picture != null) {
                                                    return text;
                                                }
                                            },
                                            sorting: false,
                                        },
                                        Index: {
                                            title: "Mã Vật Tư",
                                            width: "10%",
                                            display: function (data) {
                                                return '<span >' + data.record.Code + '</span>';
                                            }
                                        },
                                        NameTM: {
                                            title: "Tên Thương Mại",
                                            width: "10%",
                                        },
                                        NameKH: {
                                            title: "Tên Khoa Học",
                                            width: "10%",
                                        },
                                        Quantity: {
                                            title: 'Số lượng tồn',
                                            width: '5%',
                                            display: function (data) {
                                                return `${data.record.Quantity} <span class="red bold" >${data.record.UnitName}</span>`;
                                            }
                                        },
                                        Note: {
                                            title: "Ghi Chú",
                                            width: "20%",
                                            sorting: false,
                                        },
                                        edit: {
                                            title: '',
                                            width: '1%',
                                            sorting: false,
                                            display: function (data) {
                                                var text = $('<i data-toggle="modal" data-target="#' + Global.Element.PopupMaterial + '" title="Chỉnh sửa thông tin" class="fa fa_tb fa-pencil-square-o clickable blue"  ></i>');
                                                text.click(function () {
                                                    GetNorms(data.record.Id);
                                                    $('#material-id').val(data.record.Id);
                                                    $('#material-index').val(data.record.Code);
                                                    $('#material-name-tm').val(data.record.NameTM);
                                                    $('#material-name-kh').val(data.record.NameKH);
                                                    $('#material-unit').val(data.record.UnitId);
                                                    $('#material-type').val(data.record.MTypeId);
                                                    $('#material-note').val(data.record.Note);
                                                    Global.Data.mLastIndex = data.record.Index;
                                                    if (data.record.Picture)
                                                        $('.img-avatar').attr('src', data.record.Picture);
                                                });
                                                return text;
                                            }
                                        },
                                        Delete: {
                                            title: ' ',
                                            width: "3%",
                                            sorting: false,
                                            display: function (data) {
                                                var text = $('<button title="Xóa" class="jtable-command-button jtable-delete-command-button"><span>Xóa</span></button>');
                                                text.click(function () {
                                                    GlobalCommon.ShowConfirmDialog('Bạn có chắc chắn muốn xóa?', function () {
                                                        DeleteMaterial(data.record.Id);
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
                edit: {
                    title: '',
                    width: '1%',
                    sorting: false,
                    display: function (data) {
                        var text = $('<i data-toggle="modal" data-target="#' + Global.Element.PopupType + '" title="Chỉnh sửa thông tin" class="fa fa-pencil-square-o clickable blue"  ></i>');
                        text.click(function () {
                            $('#material-type-id').val(data.record.Id);
                            $('#material-type-name').val(data.record.Name);
                            $('#material-type-note').val(data.record.Note);
                            $('#material-type-code').val(`${Global.Data.mtypeCode}${data.record.Index}`);
                            Global.Data.mtypeLastIndex = data.record.Index;
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
        $('#' + Global.Element.Jtable).jtable('load', { 'keyword': $('#' + Global.Element.PopupTypeSearch + ' #material-type-keyword').val() });
    }

    function InitPopup_Type() {
        $("#" + Global.Element.PopupType).modal({
            keyboard: false,
            show: false
        });
        $('#' + Global.Element.PopupType).on('show.bs.modal', function (e) {
            if ($('#material-type-id').val() == '' || $('#material-type-id').val() == '0')
                GetMTypeLastIndex();
        });

        $("#" + Global.Element.PopupType + ' button[material-type-save]').click(function () {
            if (CheckValidate_Type()) {
                Save_Type();
            }
        });

        $("#" + Global.Element.PopupType + ' button[material-type-cancel]').click(function () {
            $("#" + Global.Element.PopupType).modal("hide");
            ResetForm_Type(null);
        });
    }

    function InitSearchPopup_Type() {
        $('#' + Global.Element.PopupTypeSearch + ' button[material-type-search]').click(function () {
            ReloadList();
            $('#' + Global.Element.PopupTypeSearch + ' button[material-type-close]').click();
        });

        $('#' + Global.Element.PopupTypeSearch + ' button[material-type-close]').click(function () {
            $("#" + Global.Element.PopupTypeSearch).modal("hide");
            $('#material-type-keyword').val('');
        });
    }

    function CheckValidate_Type() {
        if ($('#material-type-name').val().trim() == "") {
            GlobalCommon.ShowMessageDialog("Vui lòng nhập Tên loại vật tư.", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        return true;
    }

    function Save_Type() {
        var obj = {
            Id: $('#material-type-id').val(),
            Name: $('#material-type-name').val(),
            Index: Global.Data.mtypeLastIndex,
            Note: $('#material-type-note').val()
        };
        if (obj.Id == '0' || obj.Id == '')
            obj.Id += 1;
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
                        GetMaterialTypeSelect('material-type');
                        $("#" + Global.Element.PopupType + ' button[material-type-cancel]').click();
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
            url: Global.UrlAction.Delete,
            type: 'POST',
            data: JSON.stringify({ 'Id': Id }),
            contentType: 'application/json charset=utf-8',
            beforeSend: function () { $('#loading').show(); },
            success: function (result) {
                $('#loading').hide();
                GlobalCommon.CallbackProcess(result, function () {
                    if (result.Result == "OK") {
                        GetMaterialTypeSelect('material-type');
                        ReloadList();
                    }
                    else
                        GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình xử lý.");
                }, false, Global.Element.PopupSize, true, true, function () {

                    var msg = GlobalCommon.GetErrorMessage(result);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
                });
            }
        });
    }

    function GetMTypeLastIndex() {
        $.ajax({
            url: '/MaterialType/GetLastIndex',
            type: 'POST',
            contentType: 'application/json',
            beforeSend: function () { $('#loading').show(); },
            success: function (data) {
                $('#loading').hide();
                Global.Data.mtypeLastIndex = parseInt(data.Records);
                Global.Data.mtypeCode = data.Data;
                $('#material-type-index').val((Global.Data.mtypeCode + (Global.Data.mtypeLastIndex + 1)));
            }
        });
    };

    /**********************************************************************************************************************
                                                       Material
    ***********************************************************************************************************************/
    function InitPopupMaterial() {
        $("#" + Global.Element.PopupMaterial).modal({
            keyboard: false,
            show: false
        });

        $('#' + Global.Element.PopupMaterial).on('show.bs.modal', function (e) {
            if ($('#material-id').val() == '' || $('#material-id').val() == '0') {
                GetMaterialLastIndex();
                $('#material-type').val(Global.Data.MTypeId);
            }
        });

        $("#" + Global.Element.PopupMaterial + ' button[material-save]').click(function () {
            if (CheckMaterialValidate()) {
                if ($('#material-file-upload').val() != '')
                    UpSingle("material-form-upload", "material-file-upload");
                else
                    SaveMaterial();
            }
        });
        $("#" + Global.Element.PopupMaterial + ' button[material-cancel]').click(function () {
            $("#" + Global.Element.PopupMaterial).modal("hide");
            ResetForm();
            Global.Data.Norms.length = 0;
            AddEmpty();
        });
    }

    function InitMaterialViewModel(Material) {
        var ViewModel = {
            Id: 0,
            NameTM: '',
            NameKH: '',
            Index: 0,
            Code: '',
            Note: '',
            UnitId: 0,
            TypeId: 0,

        };
        if (Material != null) {
            ViewModel = {
                Id: ko.observable(Material.Id),
                NameTM: ko.observable(Material.NameTM),
                NameKH: ko.observable(Material.NameKH),
                Index: ko.observable(Material.Index),
                Code: ko.observable(Material.Code),
                Note: ko.observable(Material.Note),
                UnitId: ko.observable(Material.UnitId),
                TypeId: ko.observable(Material.TypeId),
            };
        }
        return ViewModel;
    }

    function ResetForm() {
        $('#material-id').val(0);
        $('#material-index').val('');
        $('#material-name-tm').val('');
        $('#material-name-kh').val('');
        $('#material-unit').val(0);
        $('#material-type').val(Global.Data.MTypeId);
        $('#material-note').val('');
        $('.img-avatar').attr('src', '../Content/Img/no-image.png');
        $('#material-file-upload').attr('newurl', '');
        $('#material-file-upload').val('');
    }

    function SaveMaterial() {
        var obj = {
            Id: $('#material-id').val(),
            NameTM: $('#material-name-tm').val(),
            NameKH: $('#material-name-kh').val(),
            Index: Global.Data.mLastIndex,
            Note: $('#material-note').val(),
            UnitId: $('#material-unit').val(),
            MTypeId: $('#material-type').val(),
            Norms: Global.Data.Norms,
            Picture: $('#material-file-upload').attr('newurl')
        };
        if (!obj.Id)
            obj.Index += 1;
        $.ajax({
            url: Global.UrlAction.SaveMaterial,
            type: 'post',
            data: ko.toJSON(obj),
            contentType: 'application/json',
            beforeSend: function () { $('#loading').show(); },
            success: function (result) {
                $('#loading').hide();
                GlobalCommon.CallbackProcess(result, function () {
                    if (result.Result == "OK") {
                        GetMaterialSelect(0);
                        ReloadList();
                        $("#" + Global.Element.PopupMaterial + ' button[material-cancel]').click();
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

    function DeleteMaterial(Id) {
        $.ajax({
            url: Global.UrlAction.DeleteMaterial,
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
                    else
                        GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình xử lý.");
                }, false, Global.Element.PopupSize, true, true, function () {

                    var msg = GlobalCommon.GetErrorMessage(data);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
                });
            }
        });
    }

    function CheckMaterialValidate() {
        if ($('#material-name-tm').val().trim() == "") {
            GlobalCommon.ShowMessageDialog("Vui lòng nhập Tên thương mại.", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        else if ($('#material-unit').val().trim() == "" || $('#material-unit').val().trim() == "0") {
            GlobalCommon.ShowMessageDialog("Vui lòng chọn đơn vị tính.", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        else if ($('#material-type').val().trim() == "" || $('#material-type').val().trim() == "0") {
            GlobalCommon.ShowMessageDialog("Vui lòng chọn loại vật tư.", function () { }, "Lỗi Nhập liệu");
            return false;
        }
        return true;
    }

    function InitAccSearchPopup() {
        $('#' + Global.Element.PopupSearchMaterialType + ' button[search]').click(function () {
            alert(' ');
        });

        $('#' + Global.Element.PopupSearchMaterialType + ' button[close]').click(function () {
            alert('   ');
        });
    }

    function GetMaterialLastIndex() {
        $.ajax({
            url: '/Material/GetLastIndex',
            type: 'POST',
            contentType: 'application/json',
            beforeSend: function () { $('#loading').show(); },
            success: function (data) {
                $('#loading').hide();
                Global.Data.mLastIndex = parseInt(data.Records);
                Global.Data.mCode = data.Data;
                $('#material-index').val((Global.Data.mCode + (Global.Data.mLastIndex + 1)));
            }
        });
    };

    function GetMaterialSelect(MtypeId) {
        $.ajax({
            url: Global.UrlAction.GetSelect,
            type: 'POST',
            data: JSON.stringify({ 'MtypeId': MtypeId }),
            contentType: 'application/json charset=utf-8',
            success: function (result) {
                GlobalCommon.CallbackProcess(result, function () {
                    if (result.Result == "OK") {
                        Global.Data.materialArr.length = 0;
                        var option = '';
                        if (result.Data != null && result.Data.length > 0) {
                            $.each(result.Data, function (i, item) {
                                Global.Data.materialArr.push(item);
                                //  option += '<option value="' + item.Code + '" /> ';
                                option += '<option value="' + item.Name + '" /> ';
                            });
                        }
                        $('#materialSrc').empty().append(option);
                    }
                    else
                        GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình xử lý.");
                }, false, Global.Element.PopupSize, true, true, function () {

                    var msg = GlobalCommon.GetErrorMessage(result);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
                });
            }
        });
    }


    //--------------------------------------------------------------------
    function GetNorms(Id) {
        $.ajax({
            url: Global.UrlAction.GetNorms,
            type: 'POST',
            data: JSON.stringify({ 'mId': Id }),
            contentType: 'application/json charset=utf-8',
            success: function (result) {
                GlobalCommon.CallbackProcess(result, function () {
                    if (result.Result == "OK") {
                        Global.Data.Norms.length = 0;
                        if (result.Records.length > 0) {
                            for (var i = 0; i < result.Records.length; i++) {
                                Global.Data.Norms.push({
                                    Id: result.Records[i].Id,
                                    Index: (i + 1),
                                    MaterialId: result.Records[i].MaterialId,
                                    Name: result.Records[i].Name,
                                    Quantities: result.Records[i].Quantities,
                                    UnitName: result.Records[i].UnitName
                                });
                            }
                        }
                        AddEmpty();
                        ReloadListNorms();
                    }
                    else
                        GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình xử lý.");
                }, false, Global.Element.PopupSize, true, true, function () {

                    var msg = GlobalCommon.GetErrorMessage(result);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra.");
                });
            }
        });
    }

    function InitListNorms() {
        $('#' + Global.Element.JtableNorms).jtable({
            title: 'Danh sách định mức vật tư',
            paging: false,
            pageSize: 50,
            pageSizeChange: false,
            sorting: false,
            actions: {
                listAction: Global.Data.Norms,
                //createAction: Global.Element.Popup,
                //createObjDefault: BindData(null),
                //searchAction: Global.Element.PopupSearch,
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
                    title: "Vật Tư",
                    width: "20%",
                    display: function (data) {
                        var txt = $('<input type="text" list="materialSrc" class="form-control" value="' + data.record.Name + '" />');
                        txt.change(function () {
                            if (Global.Data.materialArr.length > 0) {
                                var found = false;
                                for (var i = 0; i < Global.Data.materialArr.length; i++) {
                                    if (txt.val().trim() == Global.Data.materialArr[i].Name.trim()) {
                                        found = true;
                                        var exists = false;
                                        $.each(Global.Data.Norms, function (y, norms) {
                                            if (Global.Data.materialArr[i].Value == norms.MaterialId && data.record.Index != norms.Index) {
                                                exists = true;
                                                return false;
                                            }
                                        });

                                        $.each(Global.Data.Norms, function (y, obj) {
                                            if (obj.Index == data.record.Index) {
                                                if (exists) {
                                                    GlobalCommon.ShowMessageDialog('Vật tư này đã được khai báo.\nVui lòng kiểm tra lại .', function () {
                                                        txt.val(data.record.Name);
                                                    }, "Trùng vật tư");
                                                }
                                                else {
                                                    obj.MaterialId = Global.Data.materialArr[i].Value;
                                                    obj.Name = Global.Data.materialArr[i].Name.trim();
                                                    obj.UnitName = Global.Data.materialArr[i].Code.trim();
                                                    if (data.record.Index == Global.Data.Norms.length)
                                                        AddEmpty();
                                                    ReloadListNorms();
                                                }
                                                return false;
                                            }
                                        });
                                        return false;
                                    }
                                }
                                if (!found)
                                    GlobalCommon.ShowMessageDialog('Không tìm thấy thông tin Vật tư này.\nVui lòng kiểm tra lại .', function () {
                                        txt.val(data.record.Name);
                                    }, "Không tìm thấy");
                            }

                            ReloadListNorms();
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
                Quantities: {
                    title: "Số lượng",
                    width: "10%",
                    display: function (data) {
                        var txt = $('<input type="text" style="Width:100px;text-align:center" class="form-control" value="' + data.record.Quantities + '" />');
                        txt.change(function () {
                            for (var i = 0; i < Global.Data.Norms.length; i++) {
                                if (data.record.MaterialId == Global.Data.Norms[i].MaterialId) {
                                    Global.Data.Norms[i].Quantities = parseFloat(txt.val());
                                    return false;
                                }
                            }
                            ReloadListNorms();
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
                UnitName: {
                    title: "Đơn vị tính",
                    width: "5%"
                },
                Delete: {
                    title: '',
                    width: "3%",
                    display: function (data) {
                        if (data.record.MaterialId != 0) {
                            var text = $('<button title="Xóa" class="jtable-command-button jtable-delete-command-button"><span>Xóa</span></button>');
                            text.click(function () {
                                GlobalCommon.ShowConfirmDialog('Bạn có chắc chắn muốn xóa?', function () {
                                    for (var i = 0; i < Global.Data.Norms.length; i++) {
                                        if (data.record.MaterialId == Global.Data.Norms[i].MaterialId) {
                                            Global.Data.Norms.splice(i, 1);
                                            ReloadListNorms();
                                            return false;
                                        }
                                    }

                                }, function () { }, 'Đồng ý', 'Hủy bỏ', 'Thông báo');
                            });
                            return text;
                        }
                    }
                }
            }
        });
    }

    function ReloadListNorms() {
        $('#' + Global.Element.JtableNorms).jtable('load');
    }

    function AddEmpty() {
        Global.Data.Norms.push({
            Id: 0,
            Index: Global.Data.Norms.length + 1,
            MaterialId: 0,
            Name: '',
            Quantities: 1,
            UnitName: ''
        });
    }
}

$(document).ready(function () {
    var MaterialType = new GPRO.MaterialType();
    MaterialType.Init();
})