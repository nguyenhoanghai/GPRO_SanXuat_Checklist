using GPRO.Core.Mvc;
using GPROCommon.Business.Enum;
using GPROCommon.Models;
using GPROSanXuat_Checklist.App_Global;
using GPROSanXuat_Checklist.Business;
using GPROSanXuat_Checklist.Business.Model;
using GPROSanXuat_Checklist.Mapper;
using System; 
using System.Web.Mvc;

namespace GPROSanXuat_Checklist.Controllers
{
    public class ReceiptionController : BaseController
    {
        // GET: Receiption
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public JsonResult Gets(string keyword, int jtStartIndex = 0, int jtPageSize = 0, string jtSorting = "")
        {
            try
            {
                var objs = BLLReceiption.Instance.GetList(AppGlobal.ConnectionstringSanXuatChecklist, keyword, jtStartIndex, jtPageSize, jtSorting);
                
                JsonDataResult.Records =ReceiptionMaper.Instance.MapInfoFromGPROCommon( objs);
                JsonDataResult.Result = "OK";
                JsonDataResult.TotalRecordCount = objs.TotalItemCount;
            }
            catch (Exception ex)
            {
                //CatchError(ex);
                throw ex;
            }
            return Json(JsonDataResult);
        }

        [HttpPost]
        public JsonResult GetReport(int custId, int jtStartIndex = 0, int jtPageSize = 0, string jtSorting = "")
        {
            try
            {
                var objs = BLLReceiption.Instance.GetList(AppGlobal.ConnectionstringSanXuatChecklist, custId, jtStartIndex, jtPageSize, jtSorting);

                JsonDataResult.Records = ReceiptionMaper.Instance.MapInfoFromGPROCommon(objs);
                JsonDataResult.Result = "OK";
                JsonDataResult.TotalRecordCount = objs.TotalItemCount;
            }
            catch (Exception ex)
            {
                //CatchError(ex);
                throw ex;
            }
            return Json(JsonDataResult);
        }

        [HttpPost]
        public JsonResult Save( ReceiptionModel obj)
        {
            ResponseBase rs;
            try
            {
                if (obj.Id == 0)
                {
                    obj.CreatedUser = UserContext.UserID;
                    obj.CreatedDate = DateTime.Now;
                }
                else
                {
                    obj.UpdatedUser = UserContext.UserID;
                    obj.UpdatedDate = DateTime.Now;
                }
                if (obj.IsApproved)
                    obj.StatusId = (int)eStatus.Approved;
                else
                    obj.StatusId = (int)eStatus.Submited;

                rs = BLLReceiption.Instance.CreateOrUpdate(AppGlobal.ConnectionstringSanXuatChecklist, obj,isOwner);
                if (!rs.IsSuccess)
                {
                    JsonDataResult.Result = "ERROR";
                    JsonDataResult.ErrorMessages.AddRange(rs.Errors);
                }
                else
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
        public JsonResult Delete(int Id)
        {
            ResponseBase result;
            try
            {
                result = BLLReceiption.Instance.Delete(AppGlobal.ConnectionstringSanXuatChecklist, Id, UserContext.UserID,isOwner);
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
        public JsonResult GetReceiptionSelect()
        {
            try
            {
                JsonDataResult.Result = "OK";
                JsonDataResult.Data = BLLReceiption.Instance.GetSelectList(AppGlobal.ConnectionstringSanXuatChecklist);
            }
            catch (Exception ex)
            {
                //add error
                JsonDataResult.Result = "ERROR";
                JsonDataResult.ErrorMessages.Add(new Error() { MemberName = "Get Area", Message = "Lỗi: " + ex.Message });
            }
            return Json(JsonDataResult);
        }

        public JsonResult GetById(int Id)
        {
            try
            {
                var obj = BLLReceiption.Instance.GetById(AppGlobal.ConnectionstringSanXuatChecklist, Id);
                JsonDataResult.Result = "OK";
                JsonDataResult.Data =  obj ;
            }
            catch (Exception ex)
            {
                //CatchError(ex);
                throw ex;
            }
            return Json(JsonDataResult);
        }
        public JsonResult GetLastIndex()
        {
            JsonDataResult.Records = BLLReceiption.Instance.GetLastIndex(AppGlobal.ConnectionstringSanXuatChecklist);
            JsonDataResult.Data = "";// BLLAppConfig.Instance.GetConfigByCode(eConfigCode.Receiption);
            return Json(JsonDataResult);
        }
    }
}