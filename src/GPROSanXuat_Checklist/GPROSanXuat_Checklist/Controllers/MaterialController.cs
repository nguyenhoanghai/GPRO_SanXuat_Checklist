using GPRO.Core.Mvc;
using GPROCommon.Models;
using GPROSanXuat_Checklist.App_Global;
using GPROSanXuat_Checklist.Business;
using SanXuatCheckList.Business;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;

namespace GPROSanXuat_Checklist.Controllers
{
    public class MaterialController : BaseController
    {
        #region Material
        [HttpPost]
        public JsonResult Gets(int mTypeId, int jtStartIndex = 0, int jtPageSize = 0, string jtSorting = "")
        {
            try
            {
                var objs = MaterialRepository.Instance.GetList(AppGlobal.ConnectionstringGPROCommon, mTypeId, jtStartIndex, jtPageSize, jtSorting);
                if (objs.Count > 0)
                {
                    var ids = new List<int>();
                    for (int i = 0; i < objs.Count; i++)
                        ids.Add(objs[i].Id);

                    var sl = BLLReceiptionDetail.Instance.GetQuantity(AppGlobal.ConnectionstringSanXuatChecklist, ids);
                    foreach (var item in objs)
                    {
                        item.Quantity = (int)sl.Where(x=>x.Id == item.Id).Sum(x => x.Double);
                    }
                }
                JsonDataResult.Records = objs;
                JsonDataResult.Result = "OK";
                JsonDataResult.TotalRecordCount = objs.TotalItemCount;
            }
            catch (Exception ex)
            {
                // CatchError(ex);
                throw ex;
            }
            return Json(JsonDataResult);
        }

        [HttpPost]
        public JsonResult GetNorms(int mId)
        {
            try
            {
                var objs = MaterialRepository.Instance.GetNorms(AppGlobal.ConnectionstringGPROCommon, mId);
                JsonDataResult.Records = objs;
                JsonDataResult.Result = "OK";
            }
            catch (Exception ex)
            {
                // CatchError(ex);
                throw ex;
            }
            return Json(JsonDataResult);
        }

        [HttpPost]
        public JsonResult Save(MaterialModel obj)
        {
            ResponseBase responseResult;
            try
            {
                obj.ActionUser = UserContext.UserID;
                responseResult = MaterialRepository.Instance.CreateOrUpdate(AppGlobal.ConnectionstringGPROCommon, obj, isOwner);
                if (!responseResult.IsSuccess)
                {
                    JsonDataResult.Result = "ERROR";
                    JsonDataResult.ErrorMessages.AddRange(responseResult.Errors);
                }
                JsonDataResult.Result = "OK";
            }
            catch (Exception ex)
            {
                //CatchError(ex);
                throw ex;
            }
            return Json(JsonDataResult);
        }

        [HttpPost]
        public JsonResult Delete(int Id)
        {
            ResponseBase result;
            try
            {
                result = MaterialRepository.Instance.Delete(AppGlobal.ConnectionstringGPROCommon, Id, UserContext.UserID, isOwner);
                if (!result.IsSuccess)
                {
                    JsonDataResult.Result = "ERROR";
                    JsonDataResult.ErrorMessages.AddRange(result.Errors);
                }
                else
                    JsonDataResult.Result = "OK";
            }
            catch (Exception ex)
            {
                //CatchError(ex);
                throw ex;
            }
            return Json(JsonDataResult);
        }

        [HttpPost]
        public JsonResult GetSelectList(int MtypeId)
        {
            try
            {
                JsonDataResult.Result = "OK";
                var objs = MaterialRepository.Instance.GetSelectList(AppGlobal.ConnectionstringGPROCommon, MtypeId);
                if (objs.Count > 0)
                {
                    var sl = BLLReceiptionDetail.Instance.GetQuantity(AppGlobal.ConnectionstringSanXuatChecklist, objs.Select(x=>x.Value).ToList());
                    foreach (var item in objs)
                    {
                        item.Double = sl.Where(x => x.Id == item.Value).Sum(x => x.Double);
                    }
                }
                JsonDataResult.Data = objs;
            }
            catch (Exception ex)
            {
                //add error
                JsonDataResult.Result = "ERROR";
                JsonDataResult.ErrorMessages.Add(new Error() { MemberName = "Get Area", Message = "Lỗi: " + ex.Message });
            }
            return Json(JsonDataResult);
        }

        public JsonResult GetLastIndex()
        {
            JsonDataResult.Records = MaterialRepository.Instance.GetMaterialLastIndex(AppGlobal.ConnectionstringGPROCommon);
            JsonDataResult.Data = "";// BLLAppConfig.Instance.GetConfigByCode(eConfigCode.Material);
            return Json(JsonDataResult);
        }

        public JsonResult GetMaterialSelect_FilterByTextInput(string text)
        {
            return Json(MaterialRepository.Instance.GetMaterialSelect_FilterByTextInput(AppGlobal.ConnectionstringGPROCommon, text), JsonRequestBehavior.AllowGet);
        }

        #endregion
    }
}