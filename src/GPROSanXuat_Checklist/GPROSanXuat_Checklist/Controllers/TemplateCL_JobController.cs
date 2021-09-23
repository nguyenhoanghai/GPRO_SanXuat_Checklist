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
    public class TemplateCL_JobController : BaseController
    {
        [HttpPost]
        public JsonResult Gets(int parentId)
        {
            try
            {
                if (isAuthenticate)
                {
                    var objs = BLLTemplateChecklistJob.Instance.Gets(AppGlobal.ConnectionstringSanXuatChecklist, parentId);
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

        //[HttpPost]
        //public JsonResult Gets(int parentId, int jtStartIndex = 0, int jtPageSize = 1000, string jtSorting = "")
        //{
        //    try
        //    {
        //        if (isAuthenticate)
        //        {
        //            var objs = BLLTemplateChecklistJob.Instance.GetList(parentId, jtStartIndex, jtPageSize, jtSorting);
        //            JsonDataResult.Records = objs;
        //            JsonDataResult.Result = "OK";
        //            JsonDataResult.TotalRecordCount = objs.TotalItemCount;
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        throw (ex);
        //    }
        //    return Json(JsonDataResult);
        //}


        [HttpPost]
        public JsonResult Save(TemplateChecklistJobModel model)
        {
            ResponseBase responseResult;
            try
            {
                if (isAuthenticate)
                {
                    model.ActionUser = UserContext.UserID;
                    responseResult = BLLTemplateChecklistJob.Instance.InsertOrUpdate(AppGlobal.ConnectionstringSanXuatChecklist, model, isOwner);
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
                    result = BLLTemplateChecklistJob.Instance.Delete(AppGlobal.ConnectionstringSanXuatChecklist, Id, UserContext.UserID, isOwner);
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

    }
}