using GPRO.Core.Mvc;
using GPROCommon.Models;
using GPROCommon.Repository;
using GPROSanXuat_Checklist.App_Global;
using GPROSanXuat_Checklist.Business;
using System;
using System.Web.Mvc;

namespace GPROSanXuat_Checklist.Controllers
{
    public class AlertController : BaseController
    {
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public JsonResult Gets(int jtStartIndex = 0, int jtPageSize = 0, string jtSorting = "")
        {
            try
            {
                var jobs = BLLChecklistJobAlert.Instance.GetList(AppGlobal.ConnectionstringSanXuatChecklist, UserContext.UserID.ToString(), jtStartIndex, jtPageSize, jtSorting, UserRepository.Instance.GetSelectItem(AppGlobal.ConnectionstringGPROCommon));
                JsonDataResult.Records = jobs;
                JsonDataResult.Result = "OK";
                JsonDataResult.TotalRecordCount = jobs.TotalItemCount;
            }
            catch (Exception ex)
            {
                JsonDataResult.Result = "ERROR";
                JsonDataResult.ErrorMessages.Add(new Error() { MemberName = "Get List ObjectType", Message = "Lỗi: " + ex.Message });
            }
            return Json(JsonDataResult);
        }

        public JsonResult ChangeStatus(int Id)
        {
            try
            {
                BLLChecklistJobAlert.Instance.ChangeStatus(AppGlobal.ConnectionstringSanXuatChecklist, Id);
                JsonDataResult.Result = "OK";
            }
            catch (Exception ex)
            {
                //CatchError(ex);
            }
            return Json(JsonDataResult);
        }

        public JsonResult Delete(int Id)
        {
            ResponseBase result;
            try
            {
                result = BLLChecklistJobAlert.Instance.Delete(AppGlobal.ConnectionstringSanXuatChecklist, Id, UserContext.UserID);
                if (!result.IsSuccess)
                {
                    JsonDataResult.Result = "ERROR";
                    JsonDataResult.ErrorMessages.AddRange(result.Errors);
                }
                else
                {
                    JsonDataResult.Result = "OK";
                    JsonDataResult.ErrorMessages.AddRange(result.Errors);
                }
            }
            catch (Exception ex)
            {
                // CatchError(ex);
            }
            return Json(JsonDataResult);
        }

    }
}
