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
    public class WareHouseController : BaseController
    {
        // GET: WareHouse
        public ActionResult Index()
        {
            return View();
        }

        #region WareHouse
        [HttpPost]
        public JsonResult Gets(string keyword, int jtStartIndex = 0, int jtPageSize = 0, string jtSorting = "")
        {
            try
            {
                var objs =  WareHouseRepository.Instance.GetList(AppGlobal.ConnectionstringGPROCommon, keyword, jtStartIndex, jtPageSize, jtSorting);
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
        public JsonResult Save( WareHouseModel obj)
        {
            ResponseBase responseResult;
            try
            {
                obj.ActionUser = UserContext.UserID; 
                responseResult = WareHouseRepository.Instance.CreateOrUpdate(AppGlobal.ConnectionstringGPROCommon, obj);
                if (!responseResult.IsSuccess)
                {
                    JsonDataResult.Result = "ERROR";
                    JsonDataResult.ErrorMessages.AddRange(responseResult.Errors);
                }
                else
                    JsonDataResult.Result = "OK";
            }
            catch (Exception ex)
            {
                //   CatchError(ex);
            }
            return Json(JsonDataResult);
        }


        [HttpPost]
        public JsonResult Delete(int Id)
        {
            ResponseBase result;
            try
            {
                result = WareHouseRepository.Instance.Delete(AppGlobal.ConnectionstringGPROCommon, Id, UserContext.UserID);
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
                // CatchError(ex);
            }
            return Json(JsonDataResult);
        }

        [HttpPost]
        public JsonResult GetSelectList()
        {
            try
            {
                JsonDataResult.Result = "OK";
                JsonDataResult.Data = WareHouseRepository.Instance.GetSelectList(AppGlobal.ConnectionstringGPROCommon);
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
            JsonDataResult.Records = WareHouseRepository.Instance.GetLastIndex(AppGlobal.ConnectionstringGPROCommon);
            JsonDataResult.Data = "";// BLLAppConfig.Instance.GetConfigByCode(eConfigCode.WareHouse);
            return Json(JsonDataResult);
        }

        public JsonResult GetWareHouseSelect_FilterByTextInput(string text)
        {
            return Json(WareHouseRepository.Instance.GetWareHouseSelect_FilterByTextInput(AppGlobal.ConnectionstringGPROCommon, text), JsonRequestBehavior.AllowGet);
        }
        #endregion
    }
}