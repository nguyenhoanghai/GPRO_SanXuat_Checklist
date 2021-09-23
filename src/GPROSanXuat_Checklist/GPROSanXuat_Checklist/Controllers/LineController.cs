using GPRO.Core.Mvc;
using GPROCommon.Models;
using GPROCommon.Repository;
using GPROSanXuat_Checklist.App_Global; 
using System;
using System.Web.Mvc;

namespace GPROSanXuat_Checklist.Controllers
{
    public class LineController : BaseController
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
                    responseResult =  LineRepository.Instance.Delete(AppGlobal.ConnectionstringGPROCommon, Id, UserContext.UserID, isOwner);
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

        public JsonResult Gets(string keyword,  int jtStartIndex = 0, int jtPageSize=1000, string jtSorting="")
        {
            try
            {
                if (isAuthenticate)
                {
                    var listLine = LineRepository.Instance.Gets(AppGlobal.ConnectionstringGPROCommon, keyword,  jtStartIndex, jtPageSize, jtSorting, UserContext.CompanyId, UserContext.ChildCompanyId);
                    JsonDataResult.Records = listLine;
                    JsonDataResult.Result = "OK";
                    JsonDataResult.TotalRecordCount = listLine.TotalItemCount;
                }
            }
            catch (Exception ex)
            {
                JsonDataResult.Result = "ERROR";
                JsonDataResult.ErrorMessages.Add(new Error() { MemberName = "Get List ObjectType", Message = "Lỗi: " + ex.Message });
            }
            return Json(JsonDataResult);
        }

        public JsonResult Save(LineModel modelLine)
        {
            ResponseBase responseResult;
            try
            {
                if (isAuthenticate)
                {
                    modelLine.ActionUser = UserContext.UserID;
                    responseResult = LineRepository.Instance.InsertOrUpdate(AppGlobal.ConnectionstringGPROCommon, modelLine, isOwner);
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

        [HttpPost]
        public JsonResult GetSelect(int floorId)
        {
            try
            {
                JsonDataResult.Result = "OK";
                JsonDataResult.Data = LineRepository.Instance.Gets(AppGlobal.ConnectionstringGPROCommon, floorId);
            }
            catch (Exception ex)
            {
                JsonDataResult.Result = "ERROR";
                JsonDataResult.ErrorMessages.Add(new Error() { MemberName = "Get List ObjectType", Message = "Lỗi: " + ex.Message });
            }
            return Json(JsonDataResult);
        }
    }
}