using GPRO.Core.Mvc;
using GPROCommon.Models;
using GPROCommon.Repository;
using GPROSanXuat_Checklist.App_Global;
using System;
using System.Web.Mvc;

namespace GPROSanXuat_Checklist.Controllers
{
    public class FloorController : BaseController
    {

        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public JsonResult Delete(int Id)
        {
            ResponseBase responseResult;
            try
            {
                if (isAuthenticate)
                {
                    responseResult = FloorRepository.Instance.Delete(AppGlobal.ConnectionstringGPROCommon, Id, UserContext.UserID, isOwner);
                    if (responseResult.IsSuccess)
                        JsonDataResult.Result = "OK";
                    else
                    {
                        JsonDataResult.Result = "ERROR";
                        JsonDataResult.ErrorMessages.AddRange(responseResult.Errors);
                    }
                }
            }
            catch (Exception ex)
            {
                //add error
                JsonDataResult.Result = "ERROR";
                JsonDataResult.ErrorMessages.Add(new Error() { MemberName = "Delete Area", Message = "Lỗi: " + ex.Message });
            }
            return Json(JsonDataResult);
        }

        [HttpPost]
        public JsonResult Gets(string keyword, int jtStartIndex = 0, int jtPageSize = 1000, string jtSorting = "")
        {
            try
            {
                if (isAuthenticate)
                {
                    var objs = FloorRepository.Instance.GetList(AppGlobal.ConnectionstringGPROCommon, keyword, jtStartIndex, jtPageSize, jtSorting, UserContext.CompanyId);
                    JsonDataResult.Records = objs;
                    JsonDataResult.Result = "OK";
                    JsonDataResult.TotalRecordCount = objs.TotalItemCount;
                }
            }
            catch (Exception ex)
            {
                JsonDataResult.Result = "ERROR";
                JsonDataResult.ErrorMessages.Add(new Error() { MemberName = "Get List ObjectType", Message = "Lỗi: " + ex.Message });
            }
            return Json(JsonDataResult);
        }

        public JsonResult Save(FloorModel model)
        {
            ResponseBase rs;
            try
            {
                if (isAuthenticate)
                { 
                    model.ActionUser = UserContext.UserID;
                    rs = FloorRepository.Instance.InsertOrUpdate(AppGlobal.ConnectionstringGPROCommon, model, isOwner);
                    if (!rs.IsSuccess)
                    {
                        JsonDataResult.Result = "ERROR";
                        JsonDataResult.ErrorMessages.AddRange(rs.Errors);
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

        [HttpPost]
        public JsonResult GetSelectList(int workshopId)
        {
            try
            {
                JsonDataResult.Data = FloorRepository.Instance.GetSelectList(AppGlobal.ConnectionstringGPROCommon,workshopId);
                JsonDataResult.Result = "OK";
            }
            catch (Exception ex)
            {
                //add error
                JsonDataResult.Result = "ERROR";
                JsonDataResult.ErrorMessages.Add(new Error() { MemberName = "Delete Area", Message = "Lỗi: " + ex.Message });
            }
            return Json(JsonDataResult);

        }
    }
}