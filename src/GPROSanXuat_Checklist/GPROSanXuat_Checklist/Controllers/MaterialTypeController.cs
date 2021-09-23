using GPRO.Core.Mvc;
using GPROCommon.Models;
using GPROSanXuat_Checklist.App_Global;
using GPROSanXuat_Checklist.Controllers;
using GPROSanXuat_Checklist.Business;
using System; 
using System.Web.Mvc;
using SanXuatCheckList.Business;

namespace GPROSanXuat_Checklist.Controllers
{
    public class MaterialTypeController : BaseController
    {
        
        public ActionResult Index()
        {
            return View();
        }

        #region MaterialType
        [HttpPost]
        public JsonResult Gets(string keyword, int jtStartIndex = 0, int jtPageSize = 0, string jtSorting = "")
        {
            try
            {
                var objs =  MaterialTypeRepository.Instance.GetList(AppGlobal.ConnectionstringGPROCommon, keyword, jtStartIndex, jtPageSize, jtSorting  );
                JsonDataResult.Records = objs;
                JsonDataResult.Result = "OK";
                JsonDataResult.TotalRecordCount = objs.TotalItemCount;
            }
            catch (Exception ex)
            {
                // CatchError(ex);
            }
            return Json(JsonDataResult);
        }

        [HttpPost]
        public JsonResult Save(MaterialTypeModel obj)
        {
            ResponseBase responseResult;
            try
            {
                obj.CompanyId =   0;
                obj.ActionUser = UserContext.UserID; 
                responseResult = MaterialTypeRepository.Instance.InsertOrUpdate(AppGlobal.ConnectionstringGPROCommon, obj,isOwner);
                if (!responseResult.IsSuccess)
                {
                    JsonDataResult.Result = "ERROR";
                    JsonDataResult.ErrorMessages.AddRange(responseResult.Errors);
                }
                JsonDataResult.Result = "OK";
            }
            catch (Exception ex)
            {
                //CatchError(ex);
                throw ex;
            }
            return Json(JsonDataResult);
        }

        [HttpPost]
        public JsonResult Delete(int Id)
        {
            ResponseBase result;
            try
            {
                result = MaterialTypeRepository.Instance.Delete(AppGlobal.ConnectionstringGPROCommon, Id, UserContext.UserID,  isOwner);
                if (!result.IsSuccess)
                {
                    JsonDataResult.Result = "ERROR";
                    JsonDataResult.ErrorMessages.AddRange(result.Errors);
                }
                else
                    JsonDataResult.Result = "OK";
            }
            catch (Exception ex)
            {
                //CatchError(ex);
                throw ex;
            }
            return Json(JsonDataResult);
        }

        [HttpPost]
        public JsonResult GetSelectList()
        {
            try
            {
                JsonDataResult.Result = "OK";
                JsonDataResult.Data = MaterialTypeRepository.Instance.GetSelectList(AppGlobal.ConnectionstringGPROCommon);
            }
            catch (Exception ex)
            {
                //add error
                JsonDataResult.Result = "ERROR";
                JsonDataResult.ErrorMessages.Add(new Error() { MemberName = "Get Area", Message = "Lỗi: " + ex.Message });
            }
            return Json(JsonDataResult);
        }

        public JsonResult GetLastIndex()
        {
            JsonDataResult.Records = MaterialTypeRepository.Instance.GetLastIndex(AppGlobal.ConnectionstringGPROCommon);
            JsonDataResult.Data = "";// BLLAppConfig.Instance.GetConfigByCode(eConfigCode.MaterialType);
            return Json(JsonDataResult);
        }
        #endregion
    }
}