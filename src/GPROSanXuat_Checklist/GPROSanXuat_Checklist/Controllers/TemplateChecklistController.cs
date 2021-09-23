using GPRO.Core.Mvc;
using GPROCommon.Models;
using GPROSanXuat_Checklist.App_Global;
using GPROSanXuat_Checklist.Business;
using GPROSanXuat_Checklist.Business.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace GPROSanXuat_Checklist.Controllers
{
    public class TemplateChecklistController : BaseController
    {
       
        public ActionResult Index()
        {
            return View();
        } 

        [HttpPost]
        public JsonResult Gets(string keyword, int jtStartIndex = 0, int jtPageSize = 1000, string jtSorting = "")
        {
            try
            {
                if (isAuthenticate)
                {
                    var objs = BLLTemplateChecklist.Instance.GetList(AppGlobal.ConnectionstringSanXuatChecklist, keyword, jtStartIndex, jtPageSize, jtSorting);
                    JsonDataResult.Records = objs;
                    JsonDataResult.Result = "OK";
                    JsonDataResult.TotalRecordCount = objs.TotalItemCount;
                }
            }
            catch (Exception ex)
            {
                throw (ex);
            }
            return Json(JsonDataResult);
        }

        [HttpPost]
        public JsonResult Save(TemplateChecklistModel model)
        {
            ResponseBase responseResult;
            try
            {
                if (isAuthenticate)
                {
                    model.ActionUser = UserContext.UserID;
                    responseResult = BLLTemplateChecklist.Instance.InsertOrUpdate(AppGlobal.ConnectionstringSanXuatChecklist, model, isOwner);
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
                throw (ex);
            }
            return Json(JsonDataResult);
        }

        [HttpPost]
        public JsonResult Delete(int Id)
        {
            ResponseBase result;
            try
            {
                if (isAuthenticate)
                {
                    result = BLLTemplateChecklist.Instance.Delete(AppGlobal.ConnectionstringSanXuatChecklist, Id, UserContext.UserID, isOwner);
                    if (!result.IsSuccess)
                    {
                        JsonDataResult.Result = "ERROR";
                        JsonDataResult.ErrorMessages.AddRange(result.Errors);
                    }
                    else
                        result.IsSuccess = true;
                }
            }
            catch (Exception ex)
            {
                throw (ex);
            }
            return Json(JsonDataResult);
        }

        [HttpPost]
        public JsonResult GetSelectList()
        {
            try
            {
                JsonDataResult.Result = "OK";
                JsonDataResult.Data = BLLTemplateChecklist.Instance.GetSelectItem(AppGlobal.ConnectionstringSanXuatChecklist);
            }
            catch (Exception ex)
            {
                //add error
                JsonDataResult.Result = "ERROR";
                JsonDataResult.ErrorMessages.Add(new Error() { MemberName = "Delete ", Message = "Lỗi: " + ex.Message });
            }
            return Json(JsonDataResult);
        }
    }
}