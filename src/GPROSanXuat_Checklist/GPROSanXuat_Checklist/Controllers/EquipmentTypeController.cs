 using System;
using System.Collections.Generic;
using System.Linq; 
using System.Web.Mvc; 
using GPRO.Core.Mvc;
using GPROCommon.Helper;
using GPROCommon.Models;
using GPROCommon.Repository;
using GPROSanXuat_Checklist.App_Global; 

namespace GPROSanXuat_Checklist.Controllers
{
    public class EquipmentTypeController : BaseController
    { 

        #region EquipmentType
        public ActionResult Index()
        {
            ViewBag.eType_default = CommonFunction.Instance.GetEquipType_DefaultSelectList(AppGlobal.ConnectionstringGPROCommon );
            return View();
        }

        
        [HttpPost]
        public JsonResult Delete(int Id)
        {
            ResponseBase rs;
            try
            {
                if (isAuthenticate)
                {
                    rs = EquipmentTypeRepository.Instance.DeleteById(AppGlobal.ConnectionstringGPROCommon, Id, UserContext.UserID);
                    if (rs.IsSuccess)
                        JsonDataResult.Result = "OK";
                    else
                    {
                        JsonDataResult.Result = "ERROR";
                        JsonDataResult.ErrorMessages.AddRange(rs.Errors);
                    }
                }
            }
            catch (Exception ex)
            {
                //add error
                JsonDataResult.Result = "ERROR";
                JsonDataResult.ErrorMessages.Add(new Error() { MemberName = "Delete EquipmentType", Message = "Lỗi: " + ex.Message });
            }
            return Json(JsonDataResult);
        }

        public JsonResult CheckDelete(int Id)
        {
            ResponseBase responseResult;
            try
            {
                if (isAuthenticate)
                {
                    responseResult = EquipmentTypeRepository.Instance.CheckExistInEquipmentAtt(AppGlobal.ConnectionstringGPROCommon, Id);
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
                JsonDataResult.ErrorMessages.Add(new Error() { MemberName = "Delete EquipmentType", Message = "Lỗi: " + ex.Message });
            }
            return Json(JsonDataResult);
        }

        public JsonResult Gets(string keyword, int searchBy, int jtStartIndex, int jtPageSize, string jtSorting)
        {
            try
            {
                if (isAuthenticate)
                {
                    var listEquipmentType = EquipmentTypeRepository.Instance.GetList(AppGlobal.ConnectionstringGPROCommon, keyword, searchBy, jtStartIndex, jtPageSize, jtSorting, UserContext.CompanyId);
                    JsonDataResult.Records = listEquipmentType;
                    JsonDataResult.Result = "OK";
                    JsonDataResult.TotalRecordCount = listEquipmentType.TotalItemCount;
                }
            }
            catch (Exception ex)
            {
                JsonDataResult.Result = "ERROR";
                JsonDataResult.ErrorMessages.Add(new Error() { MemberName = "Get List ObjectType", Message = "Lỗi: " + ex.Message });
            }
            return Json(JsonDataResult);
        }

        public JsonResult Save(ModelEquipmentType model)
        {
            ResponseBase responseResult;
            try
            {
                if (isAuthenticate)
                {
                    model.CompanyId = UserContext.CompanyId;
                    model.ActionUser = UserContext.UserID;
                    if (model.Id == 0)
                        responseResult = EquipmentTypeRepository.Instance.Create(AppGlobal.ConnectionstringGPROCommon, model);
                    else
                        responseResult = EquipmentTypeRepository.Instance.Update(AppGlobal.ConnectionstringGPROCommon, model);
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
        public JsonResult GetSelects()
        {
            try
            {
                JsonDataResult.Result = "OK";
                JsonDataResult.Data = EquipmentTypeRepository.Instance.GetListEquipmentType(AppGlobal.ConnectionstringGPROCommon);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return Json(JsonDataResult);
        }
        #endregion

        #region attr
        public ActionResult CreateAttibute(int id)
        {
            if (isAuthenticate)
            {
                try
                {
                    var listModelSelect = EquipmentTypeRepository.Instance.GetListEquipmentType(AppGlobal.ConnectionstringGPROCommon);
                    List<SelectListItem> listEquipmentType = new List<SelectListItem>();
                    if (listModelSelect != null && listModelSelect.Count > 0)
                    {
                        listEquipmentType = listModelSelect.Select(c => new SelectListItem
                        {
                            Text = c.Name,
                            Value = c.Value.ToString(),
                        }).ToList();
                    }
                    ViewBag.listEquipmentType = listEquipmentType;
                }
                catch (Exception ex)
                {
                    throw ex;
                }
                Session["equipmentTypeId"] = id;
                ViewBag.equipmentTypeId = id;
                ViewBag.equipmentTypeName = EquipmentTypeRepository.Instance.GetEquipmentTypeNameById(AppGlobal.ConnectionstringGPROCommon, id);
            }
            return View();
        }

        public JsonResult DeleteETypeAttr(int Id)
        {
            ResponseBase responseResult;
            try
            {
                if (isAuthenticate)
                {
                    responseResult = EquipmentTypeAttributeRepository.Instance.DeleteById(AppGlobal.ConnectionstringGPROCommon, Id, UserContext.UserID);
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

        public JsonResult GetETypeAttr(int equipId, int jtStartIndex, int jtPageSize, string jtSorting)
        {
            try
            {
                if (isAuthenticate)
                {
                    var objs = EquipmentTypeAttributeRepository.Instance.GetList(AppGlobal.ConnectionstringGPROCommon, jtStartIndex, jtPageSize, jtSorting, equipId);
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

        public JsonResult SaveETypeAttr(ModelEquipmentTypeAttribute model)
        {
            ResponseBase responseResult;
            try
            {
                if (isAuthenticate)
                {
                    model.ActionUser = UserContext.UserID;
                    if (model.Id == 0)
                        responseResult = EquipmentTypeAttributeRepository.Instance.Create(AppGlobal.ConnectionstringGPROCommon, model);
                    else
                        responseResult = EquipmentTypeAttributeRepository.Instance.Update(AppGlobal.ConnectionstringGPROCommon, model);
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
        #endregion
    }
}