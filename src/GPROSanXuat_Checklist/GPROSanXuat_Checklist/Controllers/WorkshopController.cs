using GPRO.Core.Mvc;
using GPROCommon.Models;
using GPROCommon.Repository;
using GPROSanXuat_Checklist.App_Global;
using System;
using System.Web.Mvc;

namespace GPROSanXuat_Checklist.Controllers
{
    public class WorkShopController : BaseController
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
                    responseResult =  WorkshopRepository.Instance.Delete(AppGlobal.ConnectionstringGPROCommon, Id, UserContext.UserID, isOwner);
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
        public JsonResult Gets(string keyword,  int jtStartIndex=0, int jtPageSize=1000, string jtSorting="")
        {
            try
            {
                if (isAuthenticate)
                {
                    var listWorkShop = WorkshopRepository.Instance.GetList(AppGlobal.ConnectionstringGPROCommon, keyword,  jtStartIndex, jtPageSize, jtSorting, UserContext.CompanyId);
                    JsonDataResult.Records = listWorkShop;
                    JsonDataResult.Result = "OK";
                    JsonDataResult.TotalRecordCount = listWorkShop.TotalItemCount;
                }
            }
            catch (Exception ex)
            {
                JsonDataResult.Result = "ERROR";
                JsonDataResult.ErrorMessages.Add(new Error() { MemberName = "Get List ObjectType", Message = "Lỗi: " + ex.Message });
            }
            return Json(JsonDataResult);
        }

        public JsonResult Save(WorkShopModel model)
        {
            ResponseBase rs;
            try
            {
                if (isAuthenticate)
                {
                    model.CompanyId = UserContext.CompanyId;
                    model.ActionUser = UserContext.UserID;
                    rs = WorkshopRepository.Instance.InsertOrUpdate(AppGlobal.ConnectionstringGPROCommon, model, isOwner);
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
        public JsonResult GetSelect()
        {
            try
            {
                JsonDataResult.Data = WorkshopRepository.Instance.GetListWorkShop(AppGlobal.ConnectionstringGPROCommon );
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