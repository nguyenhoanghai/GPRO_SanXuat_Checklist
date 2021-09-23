 using System; 
using System.Web.Mvc; 
using GPRO.Core.Mvc;
using GPROCommon.Models;
using GPROCommon.Repository;
using GPROSanXuat_Checklist.App_Global;

namespace GPROSanXuat_Checklist.Controllers
{
    public class ProductController : BaseController
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
                    var productTypes = ProductRepository.Instance.GetList(AppGlobal.ConnectionstringGPROCommon, keyword,   UserContext.CompanyId, UserContext.ChildCompanyId, jtStartIndex, jtPageSize, jtSorting);
                    JsonDataResult.Records = productTypes;
                    JsonDataResult.Result = "OK";
                    JsonDataResult.TotalRecordCount = productTypes.TotalItemCount;
                }
            }
            catch (Exception ex)
            {
                throw (ex);
            }
            return Json(JsonDataResult);
        }

        [HttpPost]
        public JsonResult Save(ProductModel model)
        {
            ResponseBase responseResult;
            try
            {
                if (isAuthenticate)
                {
                    model.CompanyId = null;
                    if (!model.IsPrivate)
                        model.CompanyId = UserContext.CompanyId;
                    model.ActionUser = UserContext.UserID;
                    responseResult = ProductRepository.Instance.InsertOrUpdate(AppGlobal.ConnectionstringGPROCommon, model, isOwner);
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
                    result = ProductRepository.Instance.Delete(AppGlobal.ConnectionstringGPROCommon, Id, UserContext.UserID, isOwner);
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
                JsonDataResult.Data = ProductRepository.Instance.GetSelectItem(AppGlobal.ConnectionstringGPROCommon, UserContext.CompanyId, UserContext.ChildCompanyId);
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