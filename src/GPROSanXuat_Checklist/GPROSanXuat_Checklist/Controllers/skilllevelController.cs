using GPRO.Core.Mvc;
using GPROCommon.Models;
using GPROCommon.Repository;
using GPROSanXuat_Checklist.App_Global;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace GPROSanXuat_Checklist.Controllers
{
    public class skilllevelController : BaseController
    {
        [HttpPost]
        public JsonResult Gets(int skillId, int jtStartIndex = 0, int jtPageSize = 1000, string jtSorting = "")
        {
            try
            {
                if (isAuthenticate)
                {
                    var objs = SkillLevelRepository.Instance.GetList(AppGlobal.ConnectionstringGPROCommon, skillId, jtStartIndex, jtPageSize, jtSorting);
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
        public JsonResult Save(SkillLevelModel model)
        {
            ResponseBase responseResult;
            try
            {
                if (isAuthenticate)
                {
                    model.ActionUser = UserContext.UserID;
                    responseResult = SkillLevelRepository.Instance.Update(AppGlobal.ConnectionstringGPROCommon, model, isOwner);
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
        public JsonResult GetSelectList(int skillId)
        {
            try
            {
                JsonDataResult.Result = "OK";
                JsonDataResult.Data = SkillLevelRepository.Instance.GetSelectItem(AppGlobal.ConnectionstringGPROCommon, skillId);
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