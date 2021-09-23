using GPROCommon.Data;
using GPROCommon.Models;
using GPROCommon.Repository;
using GPROSanXuat_Checklist.App_Global;
using System; 
using System.Web.Mvc; 

namespace GPROSanXuat_Checklist.Controllers
{
    public class EquipmentGroupController : BaseController
    {
        // GET: EquipmentGroup
        public ActionResult Index()
        {
            return View();
        }
        #region
        [HttpPost]
        public JsonResult Gets(string keyword, int searchBy, int jtStartIndex = 0, int jtPageSize = 0, string jtSorting = "")
        {
            try
            {
                if (isAuthenticate)
                {
                    var E_Groups = EquipmentGroupRepository.Instance.GetList(AppGlobal.ConnectionstringGPROCommon, keyword, searchBy, jtStartIndex, jtPageSize, jtSorting);
                    JsonDataResult.Records = E_Groups;
                    JsonDataResult.Result = "OK";
                    JsonDataResult.TotalRecordCount = E_Groups.TotalItemCount;
                }
             }
            catch (Exception ex)
            {
                throw ex;
            }
            return Json(JsonDataResult);
        }

        [HttpPost]
        public JsonResult Save(T_EquipmentGroup E_Group)
        {
            ResponseBase rs;
            try
            {
                if (isAuthenticate)
                {
                    if (E_Group.Id == 0)
                    {
                        E_Group.CreatedUser = UserContext.UserID;
                        E_Group.CreatedDate = DateTime.Now;
                    }
                    else
                    {
                        E_Group.UpdatedUser = UserContext.UserID;
                        E_Group.UpdatedDate = DateTime.Now;
                    }
                    rs = EquipmentGroupRepository.Instance.InsertOrUpdate(AppGlobal.ConnectionstringGPROCommon, E_Group, isOwner);
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
                if (isAuthenticate)
                {
                    result = EquipmentGroupRepository.Instance.DeleteById(AppGlobal.ConnectionstringGPROCommon, Id, UserContext.UserID, isOwner);
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
                throw ex;
            }
            return Json(JsonDataResult);
        }
        [HttpPost]
        public JsonResult GetSelects()
        {
            try
            {
                JsonDataResult.Result = "OK";
                JsonDataResult.Data = EquipmentGroupRepository.Instance.GetE_Group_Select(AppGlobal.ConnectionstringGPROCommon);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return Json(JsonDataResult);
        }
        #endregion
    }
}