using GPRO.Core.Mvc;
using GPROCommon.Business.Enum;
using GPROCommon.Models;
using GPROSanXuat_Checklist.Business.Enum;
using GPROSanXuat_Checklist.Business.Model;
using GPROSanXuat_Checklist.Data;
using System;
using System.Collections.Generic;
using System.Linq;

namespace GPROSanXuat_Checklist.Business
{
    public class BLLChecklistJobError
    {
        #region constructor
        SanXuatCheckListEntities db;
        static object key = new object();
        private static volatile BLLChecklistJobError _Instance;
        public static BLLChecklistJobError Instance
        {
            get
            {
                if (_Instance == null)
                    lock (key)
                        _Instance = new BLLChecklistJobError();

                return _Instance;
            }
        }
        private BLLChecklistJobError() { }
        #endregion

        #region error phát sinh
        public ResponseBase InsertOrUpdate(string strConnection, int JobId, string code, int actionUser, string note, DateTime time, List<ModelSelectItem> users)
        {
            using (db = new SanXuatCheckListEntities(strConnection))
            {
                var rs = new ResponseBase();
                try
                { 
                    var job = db.Checklist_Job.Where(x => !x.IsDeleted && x.Id == JobId).Select(x => new Checklist_JobModel()
                    {
                        Id = x.Id,
                        RelatedEmployees = x.RelatedEmployees,
                        EmployeeId = x.EmployeeId,
                        Name = x.Name,
                        ProjectName = x.Checklist_JobStep.Checklist.Name,
                        CheckListId = x.Checklist_JobStep.ChecklistId,
                       // CommoName = x.Checklist_JobStep.Checklist.Product.Name,
                        JobStepName = x.Checklist_JobStep.Name
                    }).FirstOrDefault();
                    if (job != null)
                    {
                        var alertUsers = BLLHelper.SubString(note);
                        var now = DateTime.Now;
                        var err = new Checklist_Job_Error();
                        err.Code = code;
                        err.ErrorMessage = alertUsers[alertUsers.Count - 1];
                        err.TimeError = time;
                        err.JobId = job.Id;
                        err.CreatedUser = actionUser;
                        err.CreatedDate = now;
                        db.Checklist_Job_Error.Add(err);
                        db.SaveChanges();
                        var oldJob = db.Checklist_Job.FirstOrDefault(x => !x.IsDeleted && x.Id == JobId);
                        if (oldJob != null)
                        {
                            oldJob.StatusId = (int)eStatus.Error;
                            oldJob.UpdatedDate = now;
                            oldJob.UpdatedUser = actionUser;

                            var jobstep = db.Checklist_JobStep.FirstOrDefault(x => !x.IsDeleted && x.Id == oldJob.ChecklistJobStepId);
                            if (jobstep != null)
                            {
                                jobstep.StatusId = (int)eStatus.Error;
                                jobstep.UpdatedDate = now;
                                jobstep.UpdatedUser = actionUser; 
                            }
                        }
                        string reciever = "," + (!string.IsNullOrEmpty(job.RelatedEmployeeName) ? job.RelatedEmployeeName : "0") + ",";
                        reciever += (job.EmployeeId != actionUser && job.EmployeeId.HasValue ? (job.EmployeeId + ",") : "");
                        if (alertUsers.Count > 1 && users != null && users.Count > 0)
                        {
                            ModelSelectItem us;
                            for (int i = 0; i < alertUsers.Count - 1; i++)
                            {
                                us = users.FirstOrDefault(x => x.Data1.ToUpper().Trim().Equals(alertUsers[i].Trim().ToUpper()));
                                if (us != null)
                                    reciever += us.Id + ",";
                            }
                        }
                        if (reciever != "0")
                        {
                            var alert = " đã nhắc tới bạn trong một lỗi phát sinh \"<span class='bold blue'>" + code + "</span>\" ở công việc : <span class='bold blue'>" + job.Name + "</span>\n Sản phẩm: <span class='bold blue'>" + job.CommoName + "</span>\n Checklist: <span class='bold blue'>" + job.ProjectName + "</span>";// lúc " + now.ToString("dd/MM/yyyy HH:mm");
                            BLLHelper.CreateAlert(db, new Checklist_Job_Alert() { Alert = alert, JobId = job.Id, Reciever = reciever, UserSendId = actionUser, ObjectId = err.Id, ObjectType = (int)eObjectType.Error, CreatedDate = now });
                        }
                        db.SaveChanges();
                        rs.IsSuccess = true;
                    }
                    else
                    {
                        rs.IsSuccess = false;
                        rs.Errors.Add(new Error() { MemberName = "insert", Message = "Công việc này đã bị xóa hoặc không tồn tại. Vui lòng nhấn F5 để làm mới." });
                    }
                }
                catch (Exception)
                {
                }
                return rs;
            }

        }

        public ResponseBase Delete(int JobId, int Id, int actionUser, string userName)
        {
            throw new NotImplementedException();
        }
        #endregion


        public ResponseBase ErrorProcess(string strConnection, int JobId, int JobErrId, int actionUser, string note, DateTime time, List<ModelSelectItem> users)
        {
            using (db = new SanXuatCheckListEntities(strConnection))
            {
                var rs = new ResponseBase();
                try
                { 
                    var job = db.Checklist_Job.Where(x => !x.IsDeleted && x.Id == JobId).Select(x => new Checklist_JobModel()
                    {
                        Id = x.Id,
                        RelatedEmployees = x.RelatedEmployees,
                        EmployeeId = x.EmployeeId,
                        Name = x.Name,
                        ProjectName = x.Checklist_JobStep.Checklist.Name,
                        CheckListId = x.Checklist_JobStep.ChecklistId,
                        //CommoName = x.Checklist_JobStep.Checklist.Product.Name,
                        JobStepName = x.Checklist_JobStep.Name
                    }).FirstOrDefault();
                    if (job != null)
                    {
                        var now = DateTime.Now;
                        var err = db.Checklist_Job_Error.FirstOrDefault(x => !x.IsDeleted && x.Id == JobErrId);
                        if (err != null)
                        {
                            var alertUsers = BLLHelper.SubString(note);
                            var obj = users.FirstOrDefault(x => x.Id == actionUser);
                            err.Solution = alertUsers[alertUsers.Count - 1];
                            err.TimeFinish_DK = time;
                            err.UserProcessId = actionUser;
                            err.UpdatedUser = actionUser;
                            err.UpdatedDate = now;

                            db.SaveChanges();
                            var log = new Checklist_Job_ActionLog();
                            log.ActionInfo = "<span>" + (obj != null ? (obj.Name) : "") + "</span> đã tiếp nhận xử lý lỗi phát sinh \"<span class=\"blue\">" + err.Code + "</span>\" với hướng giải quyết : \"<span class=\"blue\">" + note + "</span>\" Thời điểm kết thúc dự kiến : <span class=\"blue\">" + time.ToString("dd/MM/yyyy HH:mm") + "</span>";
                            log.JobId = job.Id;
                            log.CreatedUser = actionUser;
                            log.CreatedDate = now;
                            db.Checklist_Job_ActionLog.Add(log);

                            string reciever = (!string.IsNullOrEmpty(job.RelatedEmployees) ? job.RelatedEmployees : "0");
                            reciever = (job.EmployeeId != actionUser ? ("," + job.EmployeeId) : "");
                            if (alertUsers.Count > 1 && users != null && users.Count > 0)
                            {
                                ModelSelectItem us;
                                for (int i = 0; i < alertUsers.Count - 1; i++)
                                {
                                    us = users.FirstOrDefault(x => x.Data1.ToUpper().Trim().Equals(alertUsers[i].Trim().ToUpper()));
                                    if (us != null)
                                        reciever += "," + us.Id;
                                }
                            }
                            if (reciever != "0")
                            {
                                var alert = " đã tiếp nhận xữ lý lỗi phát sinh \"<span class=\"blue\">" + err.Code + "</span>\" ở công việc : <span class='bold blue'>" + job.Name + "</span> \nSản phẩm: <span class='bold blue'>" + job.CommoName + "</span>\n Checklist: <span class='bold blue'>" + job.ProjectName + "</span> lúc " + now.ToString("dd/MM/yyyy HH:mm");
                                BLLHelper.CreateAlert(db, new Checklist_Job_Alert() { Alert = alert, JobId = job.Id, Reciever = reciever, UserSendId = actionUser, ObjectId = err.Id, ObjectType = (int)eObjectType.Error, CreatedDate = now });
                            }
                        }
                        rs.IsSuccess = true;
                    }
                    else
                    {
                        rs.IsSuccess = false;
                        rs.Errors.Add(new Error() { MemberName = "insert", Message = "Công việc này đã bị xóa hoặc không tồn tại. Vui lòng nhấn F5 để làm mới." });
                    }
                }
                catch (Exception)
                {
                }
                return rs;
            }
        }

        public ResponseBase ErrorResult(string strConnection, int JobId, int JobErrId, int actionUser, DateTime finishTime, int result, string sms, string reason, string warning, List<ModelSelectItem> users)
        {
            using (db = new SanXuatCheckListEntities(strConnection))
            {
                var rs = new ResponseBase();
                try
                { 
                    var job = db.Checklist_Job.Where(x => !x.IsDeleted && x.Id == JobId).Select(x => new Checklist_JobModel()
                    {
                        Id = x.Id,
                        RelatedEmployees = x.RelatedEmployees,
                        EmployeeId = x.EmployeeId,
                        Name = x.Name,
                        ProjectName = x.Checklist_JobStep.Checklist.Name,
                        CheckListId = x.Checklist_JobStep.ChecklistId,
                        //CommoName = x.Checklist_JobStep.Checklist.Product.Name,
                        JobStepName = x.Checklist_JobStep.Name
                    }).FirstOrDefault();
                    if (job != null)
                    {
                        var now = DateTime.Now;
                        var err = db.Checklist_Job_Error.FirstOrDefault(x => !x.IsDeleted && x.Id == JobErrId);
                        if (err != null)
                        {
                            var obj = users.FirstOrDefault(x => x.Id == actionUser);
                            err.Status = result;
                            if (result == (int)eStatus.Doing)
                            {
                                err.TimeFinish_TT = finishTime;
                                err.Warning = warning;
                                job.StatusId = (int)eStatus.Doing;
                                job.UpdatedDate = now;
                                job.UpdatedUser = actionUser;
                            }
                            else
                            {
                                err.UserProcessId = null;
                                err.ReasonNotFinish = reason;
                            }
                            err.UpdatedUser = actionUser;
                            err.UpdatedDate = now;

                            db.SaveChanges();
                            var log = new Checklist_Job_ActionLog();
                            if (result == 1)
                                log.ActionInfo = "<span>" + (obj != null ? (obj.Name) : "") + "</span> đã trả kết quả xử lý lỗi \"<span class=\"blue\">" + err.Code + "</span>\" kết quả : \"<span class=\"blue\">Hoàn thành</span>\" Thời điểm kết thúc thực tế : <span class=\"blue\">" + finishTime.ToString("dd/MM/yyyy HH:mm") + "</span>";
                            else
                                log.ActionInfo = "<span>" + (obj != null ? (obj.Name) : "") + "</span> đã trả kết quả xử lý lỗi \"<span class=\"blue\">" + err.Code + "</span>\" kết quả : \"<span class=\"blue\">Không hoàn thành</span>\" với lý do : \"<span class=\"blue\">" + reason + "</span>\"";
                            log.JobId = job.Id;
                            log.CreatedUser = actionUser;
                            log.CreatedDate = now;
                            db.Checklist_Job_ActionLog.Add(log);

                            string reciever = (!string.IsNullOrEmpty(job.RelatedEmployees) ? job.RelatedEmployees : "0");
                            reciever = (job.EmployeeId != actionUser ? ("," + job.EmployeeId) : "");
                            var alertUsers = BLLHelper.SubString(sms);
                            if (alertUsers.Count > 1 && users != null && users.Count > 0)
                            {
                                ModelSelectItem us;
                                for (int i = 0; i < alertUsers.Count - 1; i++)
                                {
                                    us = users.FirstOrDefault(x => x.Data1.ToUpper().Trim().Equals(alertUsers[i].Trim().ToUpper()));
                                    if (us != null)
                                        reciever += "," + us.Id;
                                }
                            }
                            if (reciever != "0")
                            {
                                var alert = " đã trả kết quả xử lý lỗi phát sinh \"<span class=\"blue\">" + err.Code + "</span>\" với kết quả : \"<span class=\"blue\">" + (result == 1 ? "Hoàn thành" : "Chưa hoàn thành") + "</span>\" ở công việc : <span class='bold blue'>" + job.Name + "</span> \nSản phẩm: <span class='bold blue'>" + job.CommoName + "</span>\n Checklist: <span class='bold blue'>" + job.ProjectName + "</span> lúc " + now.ToString("dd/MM/yyyy HH:mm");
                                BLLHelper.CreateAlert(db, new Checklist_Job_Alert() { Alert = alert, JobId = job.Id, Reciever = reciever, UserSendId = actionUser, ObjectId = err.Id, ObjectType = (int)eObjectType.Error, CreatedDate = now });
                            }
                        }
                        rs.IsSuccess = true;
                    }
                    else
                    {
                        rs.IsSuccess = false;
                        rs.Errors.Add(new Error() { MemberName = "insert", Message = "Công việc này đã bị xóa hoặc không tồn tại. Vui lòng nhấn F5 để làm mới." });
                    }
                }
                catch (Exception)
                {
                }
                return rs;
            }
        }

    }
}
