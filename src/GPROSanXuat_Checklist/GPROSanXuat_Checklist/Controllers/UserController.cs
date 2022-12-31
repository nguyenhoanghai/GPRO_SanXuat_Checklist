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
    public class UserController : BaseController
    { 
        public ActionResult Index()
        {
            List<ModelSelectItem> roles = null;
            List<SelectListItem> rolesItem = new List<SelectListItem>();
            List<SelectListItem> wksItem = new List<SelectListItem>();
            try
            {
                roles =  UserRoleRepository.Instance.GetUserRolesModelByUserId(AppGlobal.ConnectionstringGPROCommon, UserContext.UserID, UserContext.IsOwner, UserContext.CompanyId);
                if (roles == null)
                {
                    //return Error Page

                }
                rolesItem.AddRange(roles.Select(x => new SelectListItem() { Text = x.Name, Value = x.Value.ToString() }).ToList());
                ViewData["roles"] = rolesItem;
               var wks =  WorkshopRepository.Instance.GetListWorkShop(AppGlobal.ConnectionstringGPROCommon);
                if (wks.Count > 0)
                {
                    wksItem.AddRange(wks.Select(x => new SelectListItem() { Text = x.Name, Value = x.Value.ToString() }).ToList());
                }
                ViewData["workshops"] = wksItem;
            }
            catch (Exception ex)
            {
                // add Error
                throw ex;
            }
            return View();
        }
        public ActionResult Profile()
        {
            var obj = UserRepository.Instance.Get(AppGlobal.ConnectionstringGPROCommon, UserContext.UserID);
            return View(obj);
        }

        [HttpPost]
        public JsonResult Gets(string keyWord, int searchBy, bool isBlock, bool isRequiredChangePass, bool isTimeBlock, bool isForgotPass, int jtStartIndex = 0, int jtPageSize = 1000, string jtSorting = "")
        {
            try
            {
                if (isAuthenticate)
                {
                    var Users = UserRepository.Instance.Gets(AppGlobal.ConnectionstringGPROCommon, keyWord, searchBy, isBlock, isRequiredChangePass, isTimeBlock, isForgotPass, jtStartIndex, jtPageSize, jtSorting, UserContext.UserID, UserContext.CompanyId, UserContext.ChildCompanyId);
                    JsonDataResult.Records = Users;
                    JsonDataResult.Result = "OK";
                    JsonDataResult.TotalRecordCount = Users.TotalItemCount;
                }
             }
            catch (Exception ex)
            {
                //add Error
                JsonDataResult.Result = "ERROR";
                JsonDataResult.ErrorMessages.Add(new Error() { MemberName = "Get List ObjectType", Message = "Lỗi: " + ex.Message });
            }
            return Json(JsonDataResult);
        }

        [HttpPost]
        public JsonResult Save(UserModel model)
        {
            ResponseBase responseResult = null;
            try
            {
                if (isAuthenticate)
                {
                    model.CompanyId = UserContext.CompanyId;
                    model.ActionUser = UserContext.UserID;
                    responseResult = UserRepository.Instance.InsertOrUpdate(AppGlobal.ConnectionstringGPROCommon, model);
                    if (!responseResult.IsSuccess)
                    {
                        JsonDataResult.Result = "ERROR";
                        JsonDataResult.ErrorMessages.Add(new Error() { MemberName = responseResult.Errors.First().MemberName, Message = "Lỗi: " + responseResult.Errors.First().Message });
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
        public JsonResult Delete(int id)
        {
            ResponseBase responseResult;
            try
            {
                if (isAuthenticate)
                {
                    responseResult = new ResponseBase();
                    responseResult = UserRepository.Instance.Delete(AppGlobal.ConnectionstringGPROCommon, id, UserContext.UserID);
                    if (!responseResult.IsSuccess)
                    {
                        JsonDataResult.Result = "ERROR";
                        JsonDataResult.ErrorMessages.Add(new Error() { MemberName = responseResult.Errors.First().MemberName, Message = "Lỗi: " + responseResult.Errors.First().Message });
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
        public JsonResult ChangePassword(string id, string Password)
        {
            ResponseBase responseResult = null;
            try
            { 
                    responseResult = UserRepository.Instance.UpdatePassword(AppGlobal.ConnectionstringGPROCommon, UserContext.UserID, int.Parse(id), Password);
                    if (!responseResult.IsSuccess)
                    {
                        JsonDataResult.Result = "ERROR";
                        JsonDataResult.ErrorMessages.Add(new Error() { MemberName = responseResult.Errors.First().MemberName, Message = "Lỗi: " + responseResult.Errors.First().Message });
                    }
                    else
                        JsonDataResult.Result = "OK";
              }
            catch (Exception ex)
            {
                JsonDataResult.Result = "ERROR";
                JsonDataResult.ErrorMessages.Add(new Error() { MemberName = "Lỗi Dữ Liệu", Message = "Lỗi: " + ex.Message });
            }
            return Json(JsonDataResult);
        }

        [HttpPost]
        public JsonResult ChangeAvatar(string img)
        {
            ResponseBase responseResult = null;
            try
            {
                responseResult =  UserRepository.Instance.ChangeAvatar(AppGlobal.ConnectionstringGPROCommon, UserContext.UserID, img);
                if (!responseResult.IsSuccess)
                {
                    JsonDataResult.Result = "ERROR";
                    JsonDataResult.ErrorMessages.Add(new Error() { MemberName = responseResult.Errors.First().MemberName, Message = "Lỗi: " + responseResult.Errors.First().Message });
                }
                else
                    JsonDataResult.Result = "OK";
            }
            catch (Exception ex)
            {
                JsonDataResult.Result = "ERROR";
                JsonDataResult.ErrorMessages.Add(new Error() { MemberName = "Lỗi Dữ Liệu", Message = "Lỗi: " + ex.Message });
            }
            return Json(JsonDataResult);
        }

        public JsonResult ChangeInfo(string name, string email, string avatar)
        {
            ResponseBase responseResult = null;
            try
            {
                responseResult = UserRepository.Instance.ChangeInfo(AppGlobal.ConnectionstringGPROCommon, UserContext.UserID, email, name, avatar );
                if (!responseResult.IsSuccess)
                {
                    JsonDataResult.Result = "ERROR";
                    JsonDataResult.ErrorMessages.Add(new Error() { MemberName = responseResult.Errors.First().MemberName, Message = "Lỗi: " + responseResult.Errors.First().Message });
                }
                else
                {
                    JsonDataResult.Result = "OK";
                    UserContext.Email = email;
                    UserContext.Name = name;
                    if (!string.IsNullOrEmpty(avatar))
                    {
                        UserContext.ImagePath = avatar;
                    }

                    if (!string.IsNullOrEmpty(responseResult.Data))
                    {
                        string a = responseResult.Data;
                        a = a.Replace('/', '\\');

                        var filePath = Server.MapPath(a);
                        if (System.IO.File.Exists(filePath))
                            System.IO.File.Delete(filePath);
                    }
                }
            }
            catch (Exception ex)
            {
                JsonDataResult.Result = "ERROR";
                JsonDataResult.ErrorMessages.Add(new Error() { MemberName = "Lỗi Dữ Liệu", Message = "Lỗi: " + ex.Message });
            }
            return Json(JsonDataResult);
        }

        [HttpPost]
        public JsonResult ChangePass(string oldPass, string newPass)
        {
            ResponseBase responseResult = null;
            try
            {
                responseResult = UserRepository.Instance.ChangePassword(AppGlobal.ConnectionstringGPROCommon, UserContext.UserID, oldPass, newPass);
                if (!responseResult.IsSuccess)
                {
                    JsonDataResult.Result = "ERROR";
                    JsonDataResult.ErrorMessages.Add(new Error() { MemberName = responseResult.Errors.First().MemberName, Message = "Lỗi: " + responseResult.Errors.First().Message });
                }
                else
                    JsonDataResult.Result = "OK";
            }
            catch (Exception ex)
            {
                JsonDataResult.Result = "ERROR";
                JsonDataResult.ErrorMessages.Add(new Error() { MemberName = "Lỗi Dữ Liệu", Message = "Lỗi: " + ex.Message });
            }
            return Json(JsonDataResult);
        }

        [HttpPost]
        public JsonResult GetSelectList(string userIds)
        {
            try
            { 
                JsonDataResult.Result = "OK";
                JsonDataResult.Records = UserRepository.Instance.GetSelectItem(AppGlobal.ConnectionstringGPROCommon, userIds);
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