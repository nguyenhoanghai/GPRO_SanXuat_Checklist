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
GPRO.namespace('PhaseLibs');
GPRO.PhaseLibs = function () {
    var Global = {
        UrlAction: {
            GetWhichNotLibs: '/PhaseLibs/GetWhichNotLibs',
            GetWhichIsLibs: '/PhaseLibs/GetWhichIsLibs',
            Save: '/PhaseLibs/Update',
        },
        Element: {
            tableNotLibs: 'tb-phase',
            tableIsLibs: 'tb-phase-lib',
            search:'phase-lib-search-popup',
            searchNot: 'phase-not-lib-search-popup'
        },
        Data: {
        }
    }
    this.GetGlobal = function () {
        return Global;
    }

    this.Init = function () {
        RegisterEvent();
        InitListLibs();
        ReloadListIsLibs();

        InitListNotLibs();
        ReloadListNotLibs();
    }

    var RegisterEvent = function () {
        $('.bt-save-1').click(() => {
            var ids = "";
            var $selectedRows = $('#' + Global.Element.tableNotLibs).jtable('selectedRows');
            if ($selectedRows.length > 0) {
                //Show selected rows
                $selectedRows.each(function () {
                    var record = $(this).data('record');
                    ids += record.Id + ",";
                });
            }
            else {
                GlobalCommon.ShowMessageDialog("Không có công đoạn nào được chọn. Vui lòng chọn ít nhất 1 công đoạn để thực hiện hành động này.!", () => {
                    // no function
                }, "Thông báo chưa chọn công đoạn");
            }
            if (ids != '')
                Save(ids, false);
        });

        $('.bt-save-2').click(() => {
            var ids = "";
            var $selectedRows = $('#' + Global.Element.tableIsLibs).jtable('selectedRows');
            if ($selectedRows.length > 0) {
                //Show selected rows
                $selectedRows.each(function () {
                    var record = $(this).data('record');
                    ids += record.Id + ",";
                });
            }
            else {
                GlobalCommon.ShowMessageDialog("Không có công đoạn nào được chọn. Vui lòng chọn ít nhất 1 công đoạn để thực hiện hành động này.!", () => {
                    // no function
                }, "Thông báo chưa chọn công đoạn");
            }
            if (ids != '')
                Save(ids, true);
        });

        $('[pgsearch]').click(() => {
            ReloadListIsLibs();
            $('[pgclose]').click();
        });

        $('[pgsearch-not]').click(() => {
            ReloadListNotLibs();
            $('[pgclose-not]').click();
        });

        $('[pgclose]').click(() => { $('#p-l-keyword').val('') });
        $('[pgclose-not]').click(() => { $('#p-n-l-keyword').val('') });
    }

    Save = (ids, isremove) => {
        $.ajax({
            url: Global.UrlAction.Save,
            type: 'post',
            data: JSON.stringify({ 'ids': ids, 'isRemove': isremove }),
            contentType: 'application/json',
            beforeSend: function () { $('#loading').show(); },
            success: function (result) {
                $('#loading').hide();
                GlobalCommon.CallbackProcess(result, function () {
                    if (result.Result == "OK") {
                        ReloadListIsLibs();
                        ReloadListNotLibs();
                    }
                    else
                        GlobalCommon.ShowMessageDialog("Lưu thông tin bị lỗi. Vui lòng thao tác lại.!", function () { }, "Đã có lỗi xảy ra trong quá trình xử lý.");
                }, false, Global.Element.PopupLine, true, true, function () {
                    var msg = GlobalCommon.GetErrorMessage(result);
                    GlobalCommon.ShowMessageDialog(msg, function () { }, "Đã có lỗi xảy ra trong quá trình xử lý.");
                });
            }
        });
    }

    InitListNotLibs = () => {
        $('#' + Global.Element.tableNotLibs).jtable({
            title: 'Danh sách công đoạn không phải mẫu',
            paging: true,
            pageSize: 1000,
            pageSizeChange: true,
            sorting: true,
            selectShow: true,
            sorting: true,
            selecting: true, //Enable selecting
            multiselect: true, //Allow multiple selecting
            selectingCheckboxes: true, //Show checkboxes on first column
            actions: {
                listAction: Global.UrlAction.GetWhichNotLibs,
                searchAction: Global.Element.searchNot,
            },
            messages: {
                selectShow: 'Ẩn hiện cột',
                searchRecord: 'Tìm kiếm',
            },
            fields: {
                Id: {
                    key: true,
                    create: false,
                    edit: false,
                    list: false
                },
                Product: {
                    visibility: 'fixed',
                    title: "Mã hàng",
                    width: "20%",
                },
                GroupPhase: {
                    visibility: 'fixed',
                    title: "Cụm công đoạn",
                    width: "20%",
                },
                Code: {
                    title: "Mã công đoạn",
                    width: "6%",
                },
                Name: {
                    title: "Tên công đoạn",
                    width: "20%",
                },
                EquipName: {
                    title: "Thiết bị",
                    width: "20%",
                },

                TotalTMU: {
                    title: "Tổng TMU",
                    sorting: false,
                    width: "10%",
                    display: function (data) {
                        txt = '<span class="red bold">' + data.record.TotalTMU + '</span>';
                        return txt;
                    }
                }
            }
        });
    }
    ReloadListNotLibs = () => {
        $('#' + Global.Element.tableNotLibs).jtable('load', { 'keyword': $('#p-n-l-keyword').val()   });
    }

    InitListLibs = () => {
        $('#' + Global.Element.tableIsLibs).jtable({
            title: 'Danh sách công đoạn mẫu',
            paging: true,
            pageSize: 1000,
            pageSizeChange: true,
            sorting: true,
            selectShow: true,
            sorting: true,
            selecting: true, //Enable selecting
            multiselect: true, //Allow multiple selecting
            selectingCheckboxes: true, //Show checkboxes on first column
            actions: {
                listAction: Global.UrlAction.GetWhichIsLibs,
                searchAction: Global.Element.search,
            },
            messages: {
                selectShow: 'Ẩn hiện cột',
                searchRecord: 'Tìm kiếm',
            },
            fields: {
                Id: {
                    key: true,
                    create: false,
                    edit: false,
                    list: false
                },
                Product: {
                    visibility: 'fixed',
                    title: "Mã hàng",
                    width: "20%",
                },
                GroupPhase: {
                    visibility: 'fixed',
                    title: "Cụm công đoạn",
                    width: "20%",
                },
                Code: {
                    title: "Mã công đoạn",
                    width: "6%",
                },
                Name: {
                    title: "Tên công đoạn",
                    width: "20%",
                },
                EquipName: {
                    title: "Thiết bị",
                    width: "20%",
                },
                TotalTMU: {
                    sorting: false,
                    title: "Tổng TMU",
                    width: "10%",
                    display: function (data) {
                        txt = '<span class="red bold">' + data.record.TotalTMU + '</span>';
                        return txt;
                    }
                }
            }
        });
    }
    ReloadListIsLibs = () => {
        $('#' + Global.Element.tableIsLibs).jtable('load', { 'keyword': $('#p-l-keyword').val() });
    }

}
$(document).ready(function () {
    var obj = new GPRO.PhaseLibs();
    obj.Init();
});