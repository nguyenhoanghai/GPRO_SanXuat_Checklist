using GPRO.Core.Mvc;
using GPROCommon.Business.Enum;
using GPROCommon.Repository;
using GPROSanXuat_Checklist.App_Global;
using GPROSanXuat_Checklist.Business;
using GPROSanXuat_Checklist.Models;
using System;
using System.Linq;
using System.Web.Mvc;

namespace GPROSanXuat_Checklist.Controllers
{
    public class ChecklistUserController : BaseController
    {
        public ActionResult Index(int? Id)
        {
            ViewData["Id"] = Id ?? 0;
            var modelE = new UserInfoModel();
            modelE.UserId = UserContext.UserID;
            modelE.EmployeeName = UserContext.EmployeeName.ToString();
            modelE.LogoCompany = UserContext.LogoCompany != null ? UserContext.LogoCompany.ToString() : "";
            modelE.Email = UserContext.Email == null ? "" : UserContext.Email.ToString();
            modelE.ImagePath = UserContext.ImagePath == null ? "" : UserContext.ImagePath.ToString();
            ViewData["userInfo"] = modelE;
            return View();
        }


        public JsonResult GetAllCheckList(string keyword)
        {
            try
            {
                JsonDataResult.Result = "OK";
                bool isAdmin = UserContext.IsOwner;
                JsonDataResult.Data = BLLChecklist.Instance.GetSelectItem(AppGlobal.ConnectionstringSanXuatChecklist, keyword, UserContext.UserID, isAdmin);
            }
            catch (Exception ex)
            {
            }
            return Json(JsonDataResult);
        }

        public JsonResult GetAllJob(int checklistId)
        {
            try
            {
                bool isAdmin = true;
                JsonDataResult.Result = "OK";
                if (UserContext.Permissions.FirstOrDefault(x => x.Equals("/Checklist/Index")) == null)
                    isAdmin = false;
                //if (isGetReport)
                //{
                var jobs = BLLChecklistJob.Instance.GetJobs(AppGlobal.ConnectionstringSanXuatChecklist, checklistId, UserContext.UserID, isAdmin, UserRepository.Instance.GetSelectItem(AppGlobal.ConnectionstringGPROCommon));
                JsonDataResult.Data = jobs;
                //}
                //else
                //{
                //    var jobs = bllCL.GetAllJob(UserContext.IsOwner, UserContext.UserID, proTimeId, CommonFunction.GetOrganizationFull(UserContext.CompanyID ?? 0), AppGlobal.Account.GetService().GetUsersBycompanyId(UserContext.CompanyID ?? 0), hostUrl);
                //    JsonDataResult.Data = jobs;
                //}
            }
            catch (Exception ex)
            {
                // CatchError(ex);
            }
            return Json(JsonDataResult);
        }

        public JsonResult GetJobById(int jobId)
        {
            try
            {
                var job = BLLChecklistJob.Instance.GetJobById(AppGlobal.ConnectionstringSanXuatChecklist, jobId, UserContext.UserID, StatusRepository.Instance.GetSelectItem(AppGlobal.ConnectionstringGPROCommon, "CHECKLIST"), UserRepository.Instance.GetSelectItem(AppGlobal.ConnectionstringGPROCommon));
                if (job != null && job.Attachs.Count > 0)
                {
                    for (int i = 0; i < job.Attachs.Count; i++)
                    {
                        //var arr = job.Attachs[i].Url.Split('/').ToList();
                        //var id = arr[arr.Count - 1];
                        //if (job.Attachs[i].Url.ToLower().Contains("sampletickets") || job.Attachs[i].Url.ToLower().Contains("phieu-lay-mau"))
                        //    job.Attachs[i].Name = ProManaApi.Instance.GetFileName(1, int.Parse(id));
                        //else if (job.Attachs[i].Url.ToLower().Contains("testrecords") || job.Attachs[i].Url.ToLower().Contains("ho-so"))
                        //    job.Attachs[i].Name = ProManaApi.Instance.GetFileName(2, int.Parse(id));

                    }
                }
                JsonDataResult.Result = "OK";
                JsonDataResult.Data = job;
            }
            catch (Exception ex)
            {
                // CatchError(ex);
            }
            return Json(JsonDataResult);
        }

        public JsonResult ChangeJobStatus(int jobId, int statusId )
        {
            try
            {
                if (UserContext.Permissions.FirstOrDefault(x => x.Equals("AdminUpdateJob")) != null)
                {
                    //admin
                    var rs = BLLChecklistJob.Instance.UpdateStatus(AppGlobal.ConnectionstringSanXuatChecklist, jobId, UserContext.UserID, statusId, UserContext.EmployeeName);
                    if (!rs.IsSuccess)
                    {
                        JsonDataResult.Result = "ERROR";
                        JsonDataResult.ErrorMessages.AddRange(rs.Errors);
                    }
                    else
                        JsonDataResult.Result = "OK";
                }
                else
                {
                    //user 
                    if (statusId != (int)eStatus.Done)
                    {
                        //    if (UserContext.Permissions.FirstOrDefault(x => x.Equals("AdminUpdateJob")) != null)
                        //    {
                        //        var rs = BLLChecklistJob.Instance.UpdateStatus(AppGlobal.ConnectionstringSanXuatChecklist, jobId, UserContext.UserID, statusId, UserContext.EmployeeName);
                        //        if (!rs.IsSuccess)
                        //        {
                        //            JsonDataResult.Result = "ERROR";
                        //            JsonDataResult.ErrorMessages.AddRange(rs.Errors);
                        //        }
                        //        else
                        //            JsonDataResult.Result = "OK";
                        //    }
                        //    else
                        //    {
                        //        JsonDataResult.Result = "NOPERMISSION";
                        //        JsonDataResult.ErrorMessages.Add(new Error() { MemberName = "update", Message = "Tài khoản của bạn không có quyền di chuyển công việc sang trạng thái hoàn tất." });
                        //    }
                        //}
                        //else
                        //{

                        var _job = BLLChecklistJob.Instance.GetJobById(AppGlobal.ConnectionstringSanXuatChecklist, jobId);
                        if (_job != null && _job.EmployeeId.HasValue && UserContext.UserID == _job.EmployeeId.Value)
                        {
                            var rs = BLLChecklistJob.Instance.UpdateStatus(AppGlobal.ConnectionstringSanXuatChecklist, jobId, UserContext.UserID, statusId, UserContext.EmployeeName);
                            if (!rs.IsSuccess)
                            {
                                JsonDataResult.Result = "ERROR";
                                JsonDataResult.ErrorMessages.AddRange(rs.Errors);
                            }
                            else
                                JsonDataResult.Result = "OK";
                        }
                        else
                        {
                            JsonDataResult.Result = "NOPERMISSION";
                            JsonDataResult.ErrorMessages.Add(new Error() { MemberName = "update", Message = "Bạn không phải là người phụ trách công việc này." });
                        } 
                    }
                } 
            }
            catch (Exception ex)
            {
            }
            return Json(JsonDataResult);
        }


        #region comment
        public JsonResult SaveComment(int jobId, string comment)
        {
            try
            {
                var rs = BLLChecklistJobComment.Instance.InsertOrUpdate(AppGlobal.ConnectionstringSanXuatChecklist, jobId, UserContext.UserID, comment, UserContext.EmployeeName, UserRepository.Instance.GetSelectItem(AppGlobal.ConnectionstringGPROCommon));
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
                //CatchError(ex);
            }
            return Json(JsonDataResult);
        }
        #endregion

        #region Loi phat sinh
        public JsonResult SaveError(int jobId, string code, DateTime time, string note)
        {
            try
            {
                var rs = BLLChecklistJobError.Instance.InsertOrUpdate(AppGlobal.ConnectionstringSanXuatChecklist, jobId, code, UserContext.UserID, note, time, UserRepository.Instance.GetSelectItem(AppGlobal.ConnectionstringGPROCommon));
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
            }
            return Json(JsonDataResult);
        }

        public JsonResult DeleteError(int jobId, int Id)
        {
            try
            {
                var rs = BLLChecklistJobError.Instance.Delete(jobId, Id, UserContext.UserID, UserContext.EmployeeName);
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
                //CatchError(ex);
            }
            return Json(JsonDataResult);
        }

        public JsonResult SaveErrorPro(int jobId, int JobErrId, DateTime time, string note)
        {
            try
            {
                var rs = BLLChecklistJobError.Instance.ErrorProcess(AppGlobal.ConnectionstringSanXuatChecklist, jobId, JobErrId, UserContext.UserID, note, time, UserRepository.Instance.GetSelectItem(AppGlobal.ConnectionstringGPROCommon));
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
                //CatchError(ex);
            }
            return Json(JsonDataResult);
        }

        public JsonResult SaveErrorResult(int jobId, int JobErrId, int result, DateTime time, string sms, string reason, string warning)
        {
            try
            {
                var rs = BLLChecklistJobError.Instance.ErrorResult(AppGlobal.ConnectionstringSanXuatChecklist, jobId, JobErrId, UserContext.UserID, time, result, sms, reason, warning, UserRepository.Instance.GetSelectItem(AppGlobal.ConnectionstringGPROCommon));
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
            }
            return Json(JsonDataResult);
        }

        #endregion

        #region attach
        public JsonResult SaveAttach(int jobId, string name, string code, string note)
        {
            try
            {
                //   var mahoa = EncryptString(code, "");
                var rs = BLLChecklistJobAttachment.Instance.InsertOrUpdate(AppGlobal.ConnectionstringSanXuatChecklist, jobId, UserContext.UserID, UserContext.EmployeeName, name, code, note, UserRepository.Instance.GetSelectItem(AppGlobal.ConnectionstringGPROCommon));
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
                //CatchError(ex);
            }
            return Json(JsonDataResult);
        }

        public JsonResult DeleteAttach(int jobId, int Id)
        {
            try
            {
                var rs = BLLChecklistJobAttachment.Instance.Delete(AppGlobal.ConnectionstringSanXuatChecklist, jobId, Id, UserContext.UserID, UserContext.EmployeeName);
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
            }
            return Json(JsonDataResult);
        }

        #endregion

        #region Alert
        public JsonResult GetAlerts()
        {
            try
            {
                JsonDataResult.Result = "OK";
                JsonDataResult.Data = BLLChecklistJobAlert.Instance.GetAlerts(AppGlobal.ConnectionstringSanXuatChecklist, UserContext.UserID.ToString(), UserRepository.Instance.GetSelectItem(AppGlobal.ConnectionstringGPROCommon));
            }
            catch (Exception ex)
            {
                //  CatchError(ex);
            }
            return Json(JsonDataResult);
        }

        public JsonResult DisableAlert(int Id)
        {
            try
            {
                BLLChecklistJobAlert.Instance.DisableAlert(AppGlobal.ConnectionstringSanXuatChecklist, Id);
                JsonDataResult.Result = "OK";
            }
            catch (Exception ex)
            {
                //  CatchError(ex);
            }
            return Json(JsonDataResult);
        }

        #endregion

        #region Request Alarm
        public JsonResult RequestAlarm()
        {
            try
            {
                var request = BLLChecklistJob.Instance.RequestAlarm(AppGlobal.ConnectionstringSanXuatChecklist, UserContext.UserID, UserContext.CompanyId, UserRepository.Instance.GetSelectItem(AppGlobal.ConnectionstringGPROCommon));

                return Json(request);
            }
            catch (Exception ex)
            {
            }
            return null;
        }

        public JsonResult StopAlarm(int Id)
        {
            try
            {
                var result = BLLChecklistJob.Instance.StopAlarm(AppGlobal.ConnectionstringSanXuatChecklist, Id, UserContext.UserID);
                if (result.IsSuccess)
                    JsonDataResult.Result = "OK";
                else
                {
                    JsonDataResult.Result = "ERROR";
                    JsonDataResult.ErrorMessages.AddRange(result.Errors);
                }
                return Json(JsonDataResult);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        #endregion
    }
}