using GPRO.Core.Mvc;
using GPROCommon.Models;
using GPROCommon.Repository;
using GPROSanXuat_Checklist.App_Global;
using GPROSanXuat_Checklist.Business;
using GPROSanXuat_Checklist.Business.Enum;
using GPROSanXuat_Checklist.Business.Model;
using GPROSanXuat_Checklist.Mapper;
using System;
using System.Web.Mvc;

namespace GPROSanXuat_Checklist.Controllers
{
    public class POController : BaseController
    {

        public ActionResult Index()
        {
            return View();
        }

        public JsonResult Gets(string keyword, int jtStartIndex = 0, int jtPageSize = 1000, string jtSorting = "")
        {
            try
            {
                if (isAuthenticate)
                {
                    var objs = BLLPO_Sell.Instance.GetList(AppGlobal.ConnectionstringSanXuatChecklist, keyword, jtStartIndex, jtPageSize, jtSorting);
                    JsonDataResult.Records = POMaper.Instance.MapInfoFromGPROCommon(objs);
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

        public JsonResult GetFilters(string keyword, int jtStartIndex = 0, int jtPageSize = 1000, string jtSorting = "")
        {
            try
            {
                if (isAuthenticate)
                {
                    var objs = BLLPO_Sell.Instance.Gets(AppGlobal.ConnectionstringSanXuatChecklist, keyword, jtStartIndex, jtPageSize, jtSorting);
                    JsonDataResult.Records = POMaper.Instance.MapInfoFromGPROCommon(objs);
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

        public JsonResult Gets_PC(string keyword, int jtStartIndex = 0, int jtPageSize = 1000, string jtSorting = "")
        {
            try
            {
                if (isAuthenticate)
                {
                    var objs = BLLPO_Sell.Instance.Gets_PC(AppGlobal.ConnectionstringSanXuatChecklist, keyword, jtStartIndex, jtPageSize, jtSorting);
                    JsonDataResult.Records = POMaper.Instance.MapInfoFromGPROCommon(objs);
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
        
        [HttpPost]
        public JsonResult GetById(int poid, bool getTemplate)
        {
            try
            {
                JsonDataResult.Result = "OK";
                var data = BLLPO_Sell.Instance.Get(AppGlobal.ConnectionstringSanXuatChecklist, poid);
                JsonDataResult.Data = POMaper.Instance.MapInfoFromGPROCommon(data);
                if (getTemplate)
                    JsonDataResult.Records = BLLTemplateFile.Instance.Get(AppGlobal.ConnectionstringSanXuatChecklist, eTemplateFileType.MauBaoGia);
            }
            catch (Exception ex)
            {
                JsonDataResult.Result = "ERROR";
                JsonDataResult.ErrorMessages.Add(new Error() { MemberName = "Get List ObjectType", Message = "Lỗi: " + ex.Message });
            }
            return Json(JsonDataResult);
        }

        public JsonResult Save(PO_SellModel model)
        {
            ResponseBase responseResult;
            try
            {
                if (isAuthenticate)
                {
                    model.ActionUser = UserContext.UserID;
                    responseResult = BLLPO_Sell.Instance.InsertOrUpdate(AppGlobal.ConnectionstringSanXuatChecklist, model, isOwner);
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
        public JsonResult Delete(int Id)
        {
            ResponseBase responseResult;
            try
            {
                if (isAuthenticate)
                {
                    responseResult = BLLPO_Sell.Instance.Delete(AppGlobal.ConnectionstringSanXuatChecklist, Id, UserContext.UserID, isOwner);
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
        public JsonResult Approve(int Id)
        {
            ResponseBase responseResult;
            try
            {
                if (isAuthenticate)
                {
                    responseResult = BLLPO_Sell.Instance.Approve(AppGlobal.ConnectionstringSanXuatChecklist, Id, UserContext.UserID);
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
        public JsonResult GetSelectList()
        {
            try
            {
                JsonDataResult.Result = "OK";
                JsonDataResult.Data = BLLPO_Sell.Instance.GetSelectItem(AppGlobal.ConnectionstringSanXuatChecklist, CustomerRepository.Instance.GetSelectItem(AppGlobal.ConnectionstringGPROCommon, null));
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