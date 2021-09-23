using GPROCommon.Repository;
using GPROSanXuat_Checklist.App_Global;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace GPROSanXuat_Checklist.Helper
{
    public class CommonFunction
    {
         
		private static object key = new object();
		private static volatile CommonFunction _Instance;
		public static CommonFunction Instance
		{
			get
			{
				if (CommonFunction._Instance == null)
				{
					lock (CommonFunction.key)
					{
						CommonFunction._Instance = new CommonFunction(); 
					}
				}
				return CommonFunction._Instance;
			}
		}
        private CommonFunction()
		{
		}

        //public   SelectList GetTimeTypePrepareSelect(   )
        //{
        //    var timeType = BLLTimeTypePrepare.Instance.GetListTimeTypePrepareByworkShopId(0);
        //    List<SelectListItem> timeTypeSelectListItem = new List<SelectListItem>();
        //    timeTypeSelectListItem.Add(new SelectListItem() { Text = "- Chọn Loại Thời Gian -", Value = "0" });
        //    if (timeType != null && timeType.Count > 0)
        //    {
        //        var position = timeType.Select(x => new SelectListItem() { Value = x.Value.ToString(), Text = x.Name });
        //        timeTypeSelectListItem.AddRange(position);
        //    }
        //    return new SelectList(timeTypeSelectListItem, "Value", "Text", 0);
        //}


        public SelectList GetMenuCategorySelect(int companyId)
        {
            List<SelectListItem> selectItems = new List<SelectListItem>();
            selectItems.AddRange(MenuCategoryRepository.Instance.GetCategoriesByCompanyIdNotSystem(AppGlobal.ConnectionstringGPROCommon, companyId).Select(x => new SelectListItem() { Text = x.Name, Value = x.Id.ToString() }).ToList());
            return new SelectList(selectItems, "Value", "Text", 0);
        }

        public SelectList GetModuleSelect(int companyId)
        {
            List<SelectListItem> selectItems = new List<SelectListItem>();
            selectItems.AddRange(ModuleRepository.Instance.GetSelectListModuleByCompanyId(AppGlobal.ConnectionstringGPROCommon, companyId).Select(x => new SelectListItem() { Text = x.Name, Value = x.Value.ToString() }).ToList());
            return new SelectList(selectItems, "Value", "Text", 0);
        }

        public SelectList GetEquipType_DefaultSelectList()
        {
            try
            {
                List<SelectListItem> equipType_defaultsSelectListItem = new List<SelectListItem>();
                equipType_defaultsSelectListItem.AddRange(EquipmentTypeRepository.Instance.GetListEquipmentTypeDefault(AppGlobal.ConnectionstringGPROCommon).Select(x => new SelectListItem() { Value = x.Value.ToString(), Text = x.Name }));
                return new SelectList(equipType_defaultsSelectListItem, "Value", "Text", 0);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
         
        public SelectList GetEquipmentTypeSelectItem( )
        {
            var equipmentTypes = EquipmentTypeRepository.Instance.GetListEquipmentType(AppGlobal.ConnectionstringGPROCommon);
            List<SelectListItem> equipmentTypesSelectListItem = new List<SelectListItem>();
            if (equipmentTypes != null && equipmentTypes.Count > 0)
            {
                var equipType = equipmentTypes.Select(x => new SelectListItem() { Value = x.Value.ToString(), Text = x.Name });
                equipmentTypesSelectListItem.AddRange(equipType);
            }
            return new SelectList(equipmentTypesSelectListItem, "Value", "Text", 0);
        }

        public   SelectList GetE_GroupSelect(   )
        {
            try
            {
                List<SelectListItem> eGroupSelectListItem = new List<SelectListItem>();
                eGroupSelectListItem.Add(new SelectListItem() { Text = "- - Chọn Nhóm Thiết Bị - -", Value = "0" });
                eGroupSelectListItem.AddRange( EquipmentGroupRepository.Instance.GetE_Group_Select(AppGlobal.ConnectionstringGPROCommon).Select(x => new SelectListItem() { Value = x.Value.ToString(), Text = x.Name }));
                return new SelectList(eGroupSelectListItem, "Value", "Text", 0);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

    }
}