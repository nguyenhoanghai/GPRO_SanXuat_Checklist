using GPRO.Core.Mvc;
using GPROCommon.Data;
using GPROCommon.Models;
using GPROCommon.Repository;
using GPROSanXuat_Checklist.App_Global;
using System;
using System.Collections.Generic;
using System.Web.Mvc;

namespace GPROSanXuat_Checklist.Controllers
{
    public class RoleController : BaseController
    {
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public JsonResult Gets(string keyWord, int jtStartIndex = 0, int jtPageSize = 0, string jtSorting = "")
        {
            try
            {
                if (isAuthenticate)
                {
                    var roles = RoleRepository.Instance.GetListRole(AppGlobal.ConnectionstringGPROCommon, keyWord, jtStartIndex, jtPageSize, jtSorting, UserContext.UserID, UserContext.CompanyId, UserContext.IsOwner);
                    JsonDataResult.Records = roles;
                    JsonDataResult.Result = "OK";
                    JsonDataResult.TotalRecordCount = roles.TotalItemCount;
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

        public ActionResult Create(int? id)
        {
            try
            {
                ViewData["Modules"] = RoleRepository.Instance.GetListModuleByUserId(AppGlobal.ConnectionstringGPROCommon, UserContext.UserID);
                ViewData["Features"] = RoleRepository.Instance.GetListFeatureByUserId(AppGlobal.ConnectionstringGPROCommon, UserContext.UserID);
                ViewData["Permissions"] = RoleRepository.Instance.GetListPermissionByUserId(AppGlobal.ConnectionstringGPROCommon, UserContext.UserID);
                int ID = id ?? 0; // nullable  default value is 0;
                if (ID != 0)
                {
                    var roleDetail = RoleRepository.Instance.GetRoleDetailByRoleId(AppGlobal.ConnectionstringGPROCommon, ID);
                    if (roleDetail != null)
                    {
                        ViewData["RoleDetail"] = roleDetail;
                        ViewData["RolePermission"] = RoleRepository.Instance.GetListRolePermissionByRoleId(AppGlobal.ConnectionstringGPROCommon, ID);
                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }

            return View();
        }

        [HttpPost]
        public JsonResult Save(int id, string roleName, string description, List<string> listPermission)
        {
            ResponseBase result;
            try
            {
                if (isAuthenticate)
                {
                    SRole role = new SRole();
                    role.Id = id;
                    role.RoleName = roleName;
                    role.IsSystem = false;
                    role.CompanyId = UserContext.CompanyId;
                    role.CreatedUser = UserContext.UserID;
                    role.CreatedDate = DateTime.Now;
                    role.Description = description;
                    if (id == 0)
                    {
                        result = RoleRepository.Instance.Create(AppGlobal.ConnectionstringGPROCommon, role, listPermission);
                    }
                    else
                    {
                        result = RoleRepository.Instance.Update(AppGlobal.ConnectionstringGPROCommon, role, listPermission);
                    }
                    if (result.IsSuccess)
                    {
                        JsonDataResult.Result = "OK";
                    }
                    else
                    {
                        JsonDataResult.Result = "ERROR";
                        JsonDataResult.ErrorMessages.AddRange(result.Errors);
                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
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
                    responseResult = RoleRepository.Instance.DeleteById(AppGlobal.ConnectionstringGPROCommon, id, UserContext.UserID);
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
                //add Error
                JsonDataResult.Result = "ERROR";
                JsonDataResult.ErrorMessages.Add(new Error() { MemberName = "Lỗi Dữ Liệu", Message = "Lỗi: " + ex.Message });
            }
            return Json(JsonDataResult);
        }
    }
}