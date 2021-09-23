using GPRO.Core.Mvc;
using GPROCommon.Models;
using GPROCommon.Repository;
using GPROSanXuat_Checklist.App_Global;
using System; 
using System.Web.Mvc;

namespace GPROSanXuat_Checklist.Controllers
{
    public class CustomerController : BaseController
    {         
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Report()
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
                    var objs = CustomerRepository.Instance.GetList(AppGlobal.ConnectionstringGPROCommon, keyword,  UserContext.CompanyId, UserContext.ChildCompanyId, jtStartIndex, jtPageSize, jtSorting);
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
        public JsonResult Save(CustomerModel model)
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
                    responseResult = CustomerRepository.Instance.InsertOrUpdate(AppGlobal.ConnectionstringGPROCommon, model,isOwner);
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
                    result = CustomerRepository.Instance.Delete(AppGlobal.ConnectionstringGPROCommon, Id, UserContext.UserID, isOwner);
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
                JsonDataResult.Data = CustomerRepository.Instance.GetSelectItem(AppGlobal.ConnectionstringGPROCommon, UserContext.CompanyId, UserContext.ChildCompanyId);
            }
            catch (Exception ex)
            {
                //add error
                JsonDataResult.Result = "ERROR";
                JsonDataResult.ErrorMessages.Add(new Error() { MemberName = "Delete Area", Message = "Lỗi: " + ex.Message });
            }
            return Json(JsonDataResult);
        }

        public JsonResult GetLastIndex()
        {
            JsonDataResult.Records = CustomerRepository.Instance.GetLastIndex(AppGlobal.ConnectionstringGPROCommon);
            JsonDataResult.Data = "";// BLLAppConfig.Instance.GetConfigByCode(eConfigCode.Customer);
            return Json(JsonDataResult);
        }

        public JsonResult GetSelectList_FilterByText(string text)
        {
            return Json(CustomerRepository.Instance.GetSelectItem(AppGlobal.ConnectionstringGPROCommon, text), JsonRequestBehavior.AllowGet);
        }
    }
}