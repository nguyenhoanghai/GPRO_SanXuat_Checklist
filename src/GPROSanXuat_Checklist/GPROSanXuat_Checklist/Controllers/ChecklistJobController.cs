using GPRO.Core.Mvc;
using GPROCommon.Business.Enum;
using GPROCommon.Models;
using GPROCommon.Repository;
using GPROSanXuat_Checklist.App_Global;
using GPROSanXuat_Checklist.Business;
using GPROSanXuat_Checklist.Business.Model;
using System;
using System.Web.Mvc;

namespace GPROSanXuat_Checklist.Controllers
{
    public class ChecklistJobController : BaseController
    {
        [HttpPost]
        public JsonResult GetByParentId(int parentId)
        {
            try
            {
                if (isAuthenticate)
                {
                    var objs = BLLChecklistJob.Instance.Gets(AppGlobal.ConnectionstringSanXuatChecklist, parentId, StatusRepository.Instance.GetSelectItem(AppGlobal.ConnectionstringGPROCommon, ""), UserRepository.Instance.GetSelectItem(AppGlobal.ConnectionstringGPROCommon));
                    JsonDataResult.Records = objs;
                    JsonDataResult.Result = "OK";
                }
            }
            catch (Exception ex)
            {
                throw (ex);
            }
            return Json(JsonDataResult);
        }

        public JsonResult AdminUpdate(Checklist_JobModel model)
        {
            ResponseBase responseResult;
            try
            {
                if (isAuthenticate)
                {
                    model.ActionUser = UserContext.UserID;
                    responseResult = BLLChecklistJob.Instance.AdminUpdate(AppGlobal.ConnectionstringSanXuatChecklist, model, isOwner);
                    if (!responseResult.IsSuccess)
                    {
                        JsonDataResult.Result = "ERROR";
                        JsonDataResult.ErrorMessages.AddRange(responseResult.Errors);
                    }
                    else
                        JsonDataResult.Result = "OK";
                }
            }
            catch (Exception ex)
            {
                //add error
                JsonDataResult.Result = "ERROR";
                JsonDataResult.ErrorMessages.Add(new Error() { MemberName = "Update ", Message = "Lỗi: " + ex.Message });
            }
            return Json(JsonDataResult);
        }

        public JsonResult DoneJob(int jobId)
        {
            try
            {
                var rs = BLLChecklistJob.Instance.UpdateStatus(AppGlobal.ConnectionstringSanXuatChecklist, jobId, UserContext.UserID, (int)eStatus.Done, UserContext.EmployeeName);
                if (!rs.IsSuccess)
                {
                    JsonDataResult.Result = "ERROR";
                    JsonDataResult.ErrorMessages.AddRange(rs.Errors);
                }
                else
                    JsonDataResult.Result = "OK";
            }
            catch (Exception ex)
            {
            }
            return Json(JsonDataResult);
        }

        public ActionResult ReportJobs()
        {
            return View();
        }

        public JsonResult GetReports(int filter)
        {
            try
            {
                var objs = BLLChecklistJob.Instance.ReportJobs(AppGlobal.ConnectionstringSanXuatChecklist, filter, UserContext.UserID, StatusRepository.Instance.GetSelectItem(AppGlobal.ConnectionstringGPROCommon, "CheckList"), UserRepository.Instance.GetSelectItem(AppGlobal.ConnectionstringGPROCommon));
                JsonDataResult.Result = "OK";
                JsonDataResult.Records = objs;
            }
            catch (Exception ex)
            {
            }
            return Json(JsonDataResult);
        }

    }
}