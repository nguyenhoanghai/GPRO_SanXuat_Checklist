using GPRO.Core.Mvc;
using GPROCommon.Helper;
using GPROCommon.Models;
using GPROCommon.Repository;
using GPROSanXuat_Checklist.App_Global;
using System;
using System.Linq;
using System.Web.Mvc;

namespace GPROSanXuat_Checklist.Controllers
{
    public class CategoryController : BaseController
    {
        public ActionResult Index()
        {
            ViewBag.Module = CommonFunction.Instance.GetModuleSelect(AppGlobal.ConnectionstringGPROCommon, UserContext.CompanyId);
            return PartialView();
        }

        [HttpPost]
        public JsonResult Gets(string keyWord,  int jtStartIndex = 0, int jtPageSize = 1000, string jtSorting = "")
        {
            try
            {
                //if (isAuthenticate)
                //{
                    var categories = MenuCategoryRepository.Instance.GetList(AppGlobal.ConnectionstringGPROCommon, keyWord,  jtStartIndex, jtPageSize, jtSorting, UserContext.UserID, UserContext.CompanyId);

                    JsonDataResult.Records = categories;
                    JsonDataResult.Result = "OK";
                    JsonDataResult.TotalRecordCount = categories.TotalItemCount;
               // }
            }
            catch (Exception ex)
            {
                //add Error
                JsonDataResult.Result = "ERROR";
                JsonDataResult.ErrorMessages.Add(new Error() { MemberName = "Get List ObjectType", Message = "Lỗi: " + ex.Message });
            }
            return Json(JsonDataResult);
        }

        public JsonResult Save(CategoryModel model)
        {
            ResponseBase responseResult;
            try
            {
                //if (isAuthenticate)
                //{
                    model.CompanyId = UserContext.CompanyId;
                    if (model.Id == 0)
                    {
                        model.CreatedUser = UserContext.UserID;
                        model.CreatedDate = DateTime.Now;
                    }
                    else
                    {
                        model.UpdatedUser = UserContext.UserID;
                        model.UpdatedDate = DateTime.Now;
                    }
                    responseResult = MenuCategoryRepository.Instance.InsertOrUpdate(AppGlobal.ConnectionstringGPROCommon, model);

                    if (!responseResult.IsSuccess)
                    {
                        JsonDataResult.Result = "ERROR";
                        JsonDataResult.ErrorMessages.AddRange(responseResult.Errors);
                    }
                    else
                        JsonDataResult.Result = "OK";
                //}
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
        public JsonResult Delete(int id)
        {
            ResponseBase responseResult;
            try
            {
                //if (isAuthenticate)
                //{
                    responseResult = new ResponseBase();
                    responseResult = MenuCategoryRepository.Instance.DeleteById(AppGlobal.ConnectionstringGPROCommon, id, UserContext.UserID);
                    if (!responseResult.IsSuccess)
                    {
                        JsonDataResult.Result = "ERROR";
                        JsonDataResult.ErrorMessages.AddRange(responseResult.Errors);
                    }
                    else
                    JsonDataResult.Result = "OK";
                //}
            }
            catch (Exception ex)
            {
                //add Error
                JsonDataResult.Result = "ERROR";
                JsonDataResult.ErrorMessages.Add(new Error() { MemberName = "Lỗi Dữ Liệu", Message = "Lỗi: " + ex.Message });
            }
            return Json(JsonDataResult);
        }

        #region system

        [HttpPost]
        public JsonResult Gets_(string keyWord,  int jtStartIndex = 0, int jtPageSize = 1000, string jtSorting = "")
        {
            try
            {
                //if (isAuthenticate)
                //{
                    var systemCategorys = MenuCategoryRepository.Instance.GetList(AppGlobal.ConnectionstringGPROCommon, keyWord,   jtStartIndex, jtPageSize, jtSorting, UserContext.UserID, 0);
                    JsonDataResult.Records = systemCategorys;
                    JsonDataResult.Result = "OK";
                    JsonDataResult.TotalRecordCount = systemCategorys.TotalItemCount;
        //        }
            }
            catch (Exception ex)
            {
                //add Error
                JsonDataResult.Result = "ERROR";
                JsonDataResult.ErrorMessages.Add(new Error() { MemberName = "Get List ObjectType", Message = "Lỗi: " + ex.Message });
            }
            return Json(JsonDataResult);
        }

        public JsonResult Save_(CategoryModel modelCategory)
        {
            ResponseBase responseResult;
            try
            {
                //if (isAuthenticate)
                //{
                    responseResult = MenuCategoryRepository.Instance.UpdateSystem(AppGlobal.ConnectionstringGPROCommon, modelCategory, UserContext.UserID);
                    if (!responseResult.IsSuccess)
                    {
                        if (modelCategory.Icon != "0")
                        {
                            string path = modelCategory.Icon.Split(',').ToList().First();
                            if (System.IO.File.Exists(Server.MapPath(path)))
                            {
                                System.IO.File.Delete(Server.MapPath(path));
                            }
                        }
                        JsonDataResult.Result = "ERROR";
                        JsonDataResult.ErrorMessages.AddRange(responseResult.Errors);
                    }
                    else
                    JsonDataResult.Result = "OK";
                //}
            }
            catch (Exception ex)
            {
                //add Error
                JsonDataResult.Result = "ERROR";
                JsonDataResult.ErrorMessages.Add(new Error() { MemberName = "Lỗi Dữ Liệu", Message = "Lỗi: " + ex.Message });
            }
            return Json(JsonDataResult);
        }

        #endregion

        [HttpPost]
        public JsonResult GetSelect(int ModuleId)
        {
            try
            {
                //if (isAuthenticate)
                //{
                    var categories = MenuCategoryRepository.Instance.GetMenuCategoriesByModuleId(AppGlobal.ConnectionstringGPROCommon, ModuleId, UserContext.CompanyId);
                    if (categories == null)
                    {
                        JsonDataResult.Result = "ERROR";
                        JsonDataResult.ErrorMessages.Add(new Error() { MemberName = "", Message = "Lỗi lấy danh sách Nhóm Danh Mục" });
                    }
                    else
                    {
                        JsonDataResult.Result = "OK";
                        JsonDataResult.Data = categories;
                    }
                //}
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