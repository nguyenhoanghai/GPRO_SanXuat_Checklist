using GPRO.Core.Mvc;
using GPROCommon.Models;
using GPROCommon.Repository;
using GPROSanXuat_Checklist.App_Global;
using GPROSanXuat_Checklist.Mapper;
using PMS.Service.Models;
using PMS.Service.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace GPROSanXuat_Checklist.Controllers
{
    public class ProductionPlanController : BaseController
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
                    responseResult = ProductionPlanPerMonthRepository.Instance.Delete(AppGlobal.ConnectionstringPMS, Id, UserContext.UserID, isOwner);
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
        public JsonResult Gets(int cspId, int jtStartIndex = 0, int jtPageSize = 1000, string jtSorting = "")
        {
            try
            {
                if (isAuthenticate)
                {
                    var objs = ProductionPlanPerMonthRepository.Instance.GetList(AppGlobal.ConnectionstringPMS, cspId, jtStartIndex, jtPageSize, jtSorting);
                    JsonDataResult.Records = ProductionPlanMapper.Instance.MapInfoFromGPROCommon(objs);
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

        public JsonResult Save(ProductionPlanPerMonthModel model)
        {
            ResponseBase rs;
            try
            {
                if (isAuthenticate)
                {
                    rs = ProductionPlanPerMonthRepository.Instance.InsertOrUpdate(AppGlobal.ConnectionstringPMS, model, isOwner);
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

    }
}