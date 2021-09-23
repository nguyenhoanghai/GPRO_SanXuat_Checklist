using GPRO.Core.Mvc;
using GPROCommon.Models;
using GPROCommon.Repository;
using GPROSanXuat_Checklist.App_Global; 
using System; 
using System.Web.Mvc;

namespace GPROSanXuat_Checklist.Controllers
{
    public class EmployeeController : BaseController
    {  
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public JsonResult Save(EmployeeModel model)
        {
            ResponseBase rs;
            try
            {
                if (isAuthenticate)
                {
                    model.CompanyId = UserContext.CompanyId;
                    model.ActionUser = UserContext.UserID;
                    if (model.UserId == 0)
                        model.UserId = null;

                    rs = EmployeeRepository.Instance.CreateOrUpdate(AppGlobal.ConnectionstringGPROCommon, model, isOwner);
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
                //add Error
                JsonDataResult.Result = "ERROR";
                JsonDataResult.ErrorMessages.Add(new Error() { MemberName = "Lỗi Dữ Liệu", Message = "Lỗi: " + ex.Message });
            }
            return Json(JsonDataResult);
        }

        [HttpPost]
        public JsonResult Gets(string keyword, int jtStartIndex = 0, int jtPageSize = 1000, string jtSorting = "")
        {
            try
            {
                if (isAuthenticate)
                {
                    var objs = EmployeeRepository.Instance.Gets(AppGlobal.ConnectionstringGPROCommon, keyword, UserContext.CompanyId, jtStartIndex, jtPageSize, jtSorting);
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

        [HttpPost]
        public JsonResult Delete(int Id)
        {
            ResponseBase rs;
            try
            {
                if (isAuthenticate)
                {
                    rs = EmployeeRepository.Instance.Delete(AppGlobal.ConnectionstringGPROCommon, Id, UserContext.UserID, UserContext.CompanyId, isOwner);
                    if (!rs.IsSuccess)
                    {
                        JsonDataResult.Result = "ERROR";
                        JsonDataResult.ErrorMessages.AddRange(rs.Errors);
                    }
                    else
                        rs.IsSuccess = true;
                }
              }
            catch (Exception ex)
            {
                JsonDataResult.Result = "ERROR";
                JsonDataResult.ErrorMessages.Add(new Error() { MemberName = "Lỗi Dữ Liệu", Message = "Lỗi: " + ex.Message });
            }
            return Json(JsonDataResult);
        }

        //[HttpPost]
        //public JsonResult GetEmployWithSkill()
        //{
        //    try
        //    {
        //        JsonDataResult.Result = "OK";
        //        JsonDataResult.Data = EmployeeRepository.Instance.GetEmployeeWithSkills(AppGlobal.ConnectionstringGPROCommon, UserContext.CompanyId);
        //    }
        //    catch (Exception ex)
        //    {
        //        //add Error
        //        JsonDataResult.Result = "ERROR";
        //        JsonDataResult.ErrorMessages.Add(new Error() { MemberName = "Lỗi Dữ Liệu", Message = "Lỗi: " + ex.Message });
        //    }
        //    return Json(JsonDataResult);
        //}
        [HttpPost]
        public JsonResult GetSelectList()
        {
            try
            {
                JsonDataResult.Result = "OK";
                JsonDataResult.Records = EmployeeRepository.Instance.GetSelectItem(AppGlobal.ConnectionstringGPROCommon );
            }
            catch (Exception ex)
            {
                //add Error
                JsonDataResult.Result = "ERROR";
                JsonDataResult.ErrorMessages.Add(new Error() { MemberName = "Lỗi Dữ Liệu", Message = "Lỗi: " + ex.Message });
            }
            return Json(JsonDataResult);
        }
    }
}