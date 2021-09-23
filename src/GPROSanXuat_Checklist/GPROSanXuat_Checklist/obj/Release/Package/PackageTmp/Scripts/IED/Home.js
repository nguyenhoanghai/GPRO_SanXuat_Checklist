var body = document.querySelector('body');
body.onkeydown = function (e) {
    if (!e.metaKey)
        e.preventDefault();
    doc_keyUp(e);
};

function doc_keyUp(e) {
    var controller = ($('[ul_tab_list] li.active').length > 0 ? ($('[ul_tab_list] li.active').attr('control')).toUpperCase() : '');
    var currentPopup = $('div.divParent').attr('currentPoppup');
    if (e.shiftKey && e.keyCode == 78) {  // add ctrl + n
        switch (controller) {
            case 'WORKERLEVEL': $('#jtableWorkersLevel .jtable-toolbar-item-add-record').click(); break;
            case 'EQUIPMENTTYPE': $('#jtableEquipmentType .jtable-toolbar-item-add-record').click(); break;
            case 'EQUIPMENTGROUP': $('#jtable_E_Group .jtable-toolbar-item-add-record').click(); break;
            case 'PHASEGROUP': $('#Jtable-PhaseGroup .jtable-toolbar-item-add-record').click(); break;
            case 'EQUIPMENT': $('#jtableEquipment .jtable-toolbar-item-add-record').click(); break;
            case 'PRODUCT': $('#jtableProduct .jtable-toolbar-item-add-record').click(); break;
            case 'TIMEPREPARE': $('#jtable-TimeTypePrepare .jtable-toolbar-item-add-record').click(); break;
            case 'MTYPE': $('#jtableManipulation .jtable-toolbar-item-add-record').click(); break;
            case 'EMPLOYEE': $('#jtableEmployee .jtable-toolbar-item-add-record').click(); break;
            case 'WORKSHOP': $('#jtableWorkShop .jtable-toolbar-item-add-record').click(); break;
            case 'LINE': $('#jtableLine .jtable-toolbar-item-add-record').click(); break;
            case 'ROLE': $('#jtableRole .jtable-toolbar-item-add-record').click(); break;
            case 'USER': $('#jtableUser .jtable-toolbar-item-add-record').click(); break;

            case 'PROANA':
                if ($('#jtable_tkc').css('display') == 'block')
                    $('#jtable_tkc .jtable-toolbar-item-add-record').click();
                else if ($('#jtable-phase').css('display') == 'block' && currentPopup != 'CREATE-PHASE-POPUP')
                    $('#jtable-phase .jtable-toolbar-item-add-record').click();
                else if (currentPopup == 'CREATE-PHASE-POPUP')
                    $('#jtable-timeprepare-arr .jtable-toolbar-item-add-record').click();
                break;

        }
        e.returnValue = false;
        return false;
    }
    else if (e.shiftKey && e.keyCode == 70) {  //search ctrl + f
        switch (controller) {
            case 'WORKERLEVEL': $('#jtableWorkersLevel .jtable-toolbar-item-search-record').click(); break;
            case 'EQUIPMENTTYPE': $('#jtableEquipmentType .jtable-toolbar-item-search-record').click(); break;
            case 'EQUIPMENTGROUP': $('#jtable_E_Group .jtable-toolbar-item-search-record').click(); break;
            case 'PHASEGROUP': $('#Jtable-PhaseGroup .jtable-toolbar-item-search-record').click(); break;
            case 'EQUIPMENT': $('#jtableEquipment .jtable-toolbar-item-search-record').click(); break;
            case 'PRODUCT': $('#jtableProduct .jtable-toolbar-item-search-record').click(); break;
            case 'TIMEPREPARE': $('#jtable-TimeTypePrepare .jtable-toolbar-item-search-record').click(); break;
            case 'MTYPE': $('#jtableManipulation .jtable-toolbar-item-search-record').click(); break;
            case 'EMPLOYEE': $('#jtableEmployee .jtable-toolbar-item-search-record').click(); break;
            case 'WORKSHOP': $('#jtableWorkShop .jtable-toolbar-item-search-record').click(); break;
            case 'LINE': $('#jtableLine .jtable-toolbar-item-search-record').click(); break;
            case 'USER': $('#jtableUser .jtable-toolbar-item-search-record').click(); break;
            case 'PROANA':
                if (currentPopup == 'TIMEPREPARE-POPUP')
                    $('#jtable-timeprepare .jtable-toolbar-item-search-record').click();
                else
                    $('#jtable-chooseequipment .jtable-toolbar-item-search-record').click();

                break;
        }
        e.returnValue = false;
        return false;
    }

    else if (e.shiftKey && e.keyCode == 83) {  // save ctrl + s
        switch (currentPopup) {
            case 'POPUP_WORKERSLEVEL': $('[wlsave]').click(); break;
            case 'POPUP_EQUIPMENTTYPE': $('[etsave]').click(); break;
            case 'POPUP_E_GROUP': $('[egsave]').click(); break;
            case 'POPUP_PHASEGROUP': $('[pgsave]').click(); break;
            case 'POPUP_EQUIPMENT': $('[esave]').click(); break;
            case 'POPUP_PRODUCT': $('[psave]').click(); break;
            case 'POPUP_TIMETYPEPREPARE': $('[save-type]').click(); break;
            case 'POPUP_MANIPULATION': $('[save-mani]').click(); break;
            case 'POPUP_EMPLOYEE': $('[esave]').click(); break;
            case 'POPUP_WORKSHOP': $('[wksave]').click(); break;
            case 'POPUP_LINE': $('[save_line]').click(); break;
            case 'USERMODAL': $('[saveUser]').click(); break;

            case 'TECHPROCESS': if (controller == 'PROANA') $('[techsave]').click(); break;
            case 'CREATE-PHASE-POPUP':
            case 'JTABLE-PHASE': $('[save-phase]').click(); break;
            case 'POPUP_TKC': $('[tkc_save]').click(); break;
            case 'TKC_POPUP_POSITION': $('[save_tkc_po]').click(); break;
            case 'TIMEPREPARE-POPUP': $('#choose-time').click(); break;
            case 'CAPOPUP_COMMODITY': $('[save-commo]').click(); break;
            case 'CREATE-WORKSHOP-POPUP': $('[save-workshop]').click(); break;
            case 'CREATE-PHASEGROUP-POPUP': $('[save-phasegroup]').click(); break;
        }
        e.returnValue = false;
        return false;
    }
    else if (e.keyCode == 27) {  //cancel  phím esc
        switch (currentPopup) {
            case 'POPUP_WORKERSLEVEL': $('[wlcancel]').click(); break;
            case 'POPUP_SEARCHWORKERSLEVEL': $('[wlclose]').click(); break;
            case 'POPUP_EQUIPMENTTYPE': $('[etcancel]').click(); break;
            case 'POPUP_SEARCHEQUIPMENTTYPE': $('[etclose]').click(); break;
            case 'POPUP_E_GROUP': $('[egcancel]').click(); break;
            case 'EGPOPUP_SEARCH': $('[egclose]').click(); break;
            case 'POPUP_PHASEGROUP': $('[pgcancel]').click(); break;
            case 'PGSEARCH_POPUP': $('[pgclose]').click(); break;
            case 'POPUP_EQUIPMENT': $('[ecancel]').click(); break;
            case 'POPUP_SEARCHEQUIPMENT': $('[eclose]').click(); break;
            
            case 'POPUP_PRODUCT': $('[pcancel]').click(); break;
            case 'PSEARCH_POPUP': $('[pclose]').click(); break;
            case 'POPUP_TIMETYPEPREPARE': $('[cancel-type]').click(); break;
            case 'POPUP_TIMETYPEPREPARE-SEARCH': $('[closetype]').click(); break;
            case 'POPUP_MANIPULATION': $('[cancel-mani]').click(); break;
            case 'SEARCH_POPUP': $('[close]').click(); break;
            case 'POPUP_EMPLOYEE': $('[ecancel]').click(); break;
            case 'ESEARCH_POPUP': $('[eclose]').click(); break;
            case 'POPUP_WORKSHOP': $('[wkcancel]').click(); break;
            case 'POPUP_SEARCHWORKSHOP': $('[wkclose]').click(); break;
            case 'POPUP_LINE': $('[cancel_line]').click(); break;
            case 'POPUP_SEARCHLINE': $('[close_search_line]').click(); break;
            case 'USERMODAL': $('[ucancel]').click(); break;
            case 'USEARCH_POPUP': $('[close-search]').click(); break;

            case 'CREATE-PHASE-POPUP':
            case 'JTABLE-PHASE': $('[cancel-create-phase]').click(); break;
            case 'POPUP_TKC': $('[tkc_cancel]').click(); break;
            case 'TKC_POPUP_POSITION': $('[cancel_tkc_po]').click(); break;
            case 'TIMEPREPARE-POPUP': $('[close-time]').click(); break;
            case 'CAPOPUP_COMMODITY': $('[cancel-commo]').click(); break;
            case 'CREATE-WORKSHOP-POPUP': $('[cancel-workshop]').click(); break; 
            case 'CREATE-PHASEGROUP-POPUP': $('[cancel-phasegroup]').click(); break;

            case 'POPUP_SEARCHEQUIP': $('[cancel_search_equip]').click(); break;
            case 'CHOOSEEQUIPMENT_POPUP': $('[chooseequipment_popupclose]').click(); break;
        }
        e.returnValue = false;
        return false;
    }
    else if (e.keyCode == 13) {  //search
        switch (currentPopup) {
            case 'POPUP_SEARCHWORKERSLEVEL': $('[wlsearch]').click(); break;
            case 'POPUP_SEARCHEQUIPMENTTYPE': $('[etsearch]').click(); break;
            case 'EGPOPUP_SEARCH': $('[egsearch]').click(); break;
            case 'PGSEARCH_POPUP': $('[pgsearch]').click(); break;
            case 'POPUP_SEARCHEQUIPMENT': $('[esearch]').click(); break;
            case 'PSEARCH_POPUP': $('[psearch]').click(); break;
            case 'POPUP_TIMETYPEPREPARE-SEARCH': $('[searchtype]').click(); break;
            case 'SEARCH_POPUP': $('[search]').click(); break;
            case 'ESEARCH_POPUP': $('[esearch]').click(); break;
            case 'POPUP_SEARCHWORKSHOP': $('[wksearch]').click(); break;
            case 'POPUP_SEARCHLINE': $('[search_line]').click(); break; 
            case 'USEARCH_POPUP': $('[search]').click(); break;
            case 'POPUP_SEARCHEQUIP': $('[searchequipment]').click(); break;
        }
        e.returnValue = false;
        return false;
    }
    else if (e.shiftKey && e.keyCode == 69) {  //excel  ctrl + e
        switch (currentPopup) {
            case 'TECHPROCESS': $('[techexport]').click(); break;
        }
        e.returnValue = false;
        return false;
    }
    else {
        e.returnValue = true;
        return true;
    }

}