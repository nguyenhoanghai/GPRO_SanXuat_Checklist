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
    public class BLLChecklistJob
    {
        #region constructor
        SanXuatCheckListEntities db;
        static object key = new object();
        private static volatile BLLChecklistJob _Instance;
        public static BLLChecklistJob Instance
        {
            get
            {
                if (_Instance == null)
                    lock (key)
                        _Instance = new BLLChecklistJob();

                return _Instance;
            }
        }
        private BLLChecklistJob() { }
        #endregion

        bool checkPermis(Checklist_Job obj, int actionUser, bool isOwner)
        {
            if (isOwner) return true;
            return obj.CreatedUser == actionUser;
        }

        public string getRelatedEmployeeName(string relatedIds, List<ModelSelectItem> employees)
        {
            if (!string.IsNullOrEmpty(relatedIds))
            {
                var Ids = relatedIds.Split(',').Select(x => Convert.ToInt32(x)).ToArray();
                var relatedEs = employees.Where(x => Ids.Contains(x.Value)).Select(x => x.Name).ToArray();
                return string.Join(",", relatedEs);
            }
            return "";
        }

        public ResponseBase AdminUpdate(string strConnection, Checklist_JobModel model, bool isOwner)
        {
            try
            {
                using (db = new SanXuatCheckListEntities(strConnection))
                {
                    var result = new ResponseBase();
                    Checklist_Job obj = db.Checklist_Job.FirstOrDefault(x => !x.IsDeleted && x.Id == model.Id);
                    if (obj == null)
                    {
                        result.IsSuccess = false;
                        result.Errors.Add(new Error() { MemberName = "Update ", Message = "Công việc bạn đang thao tác đã bị xóa hoặc không tồn tại. Vui lòng kiểm tra lại !." });
                        return result;
                    }
                    else
                    {
                        if (!checkPermis(obj, model.ActionUser, isOwner))
                        {
                            result.IsSuccess = false;
                            result.Errors.Add(new Error() { MemberName = "update", Message = "Bạn không phải là người tạo Công việc này nên bạn không cập nhật được thông tin cho Công việc này." });
                        }
                        else
                        {
                            obj.Name = model.Name;
                            obj.JobContent = model.JobContent;
                            obj.EmployeeId = model.EmployeeId;
                            obj.RelatedEmployees = model.RelatedEmployees;
                            obj.StartDate = model.StartDate;
                            obj.EndDate = model.EndDate;
                            obj.ReminderDate = model.ReminderDate;
                            obj.Quantities = model.Quantities;
                            obj.Note = model.Note;
                            obj.UpdatedUser = model.ActionUser;
                            obj.UpdatedDate = DateTime.Now;
                            db.SaveChanges();
                            result.IsSuccess = true;
                        }
                    }
                    return result;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        private bool CheckExists(string code, int? id)
        {
            try
            {
                var obj = db.Checklist_Job.FirstOrDefault(x => !x.IsDeleted && x.Name.Trim().ToUpper().Equals(code) && x.Id != id);
                if (obj == null)
                    return false;
                return true;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public ResponseBase Delete(string strConnection, int id, int acctionUserId, bool isOwner)
        {
            try
            {
                using (db = new SanXuatCheckListEntities(strConnection))
                {
                    var result = new ResponseBase();
                    var objs = db.Checklist_Job.FirstOrDefault(x => !x.IsDeleted && x.Id == id);
                    if (objs == null)
                    {
                        result.IsSuccess = false;
                        result.Errors.Add(new Error() { MemberName = "Delete ", Message = "Công việc bạn đang thao tác đã bị xóa hoặc không tồn tại. Vui lòng kiểm tra lại !." });
                    }
                    else
                    {
                        if (!checkPermis(objs, acctionUserId, isOwner))
                        {
                            result.IsSuccess = false;
                            result.Errors.Add(new Error() { MemberName = "Delete", Message = "Bạn không phải là người tạo Công việc này nên bạn không xóa được Công việc này." });
                        }
                        else
                        {
                            objs.IsDeleted = true;
                            objs.DeletedUser = acctionUserId;
                            objs.DeletedDate = DateTime.Now;

                            db.SaveChanges();
                            result.IsSuccess = true;
                        }
                    }
                    return result;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public List<Checklist_JobModel> Gets(string strConnection, int jobStepId, List<ModelSelectItem> statuss, List<ModelSelectItem> users)
        {
            var jobs = new List<Checklist_JobModel>();
            try
            {
                using (db = new SanXuatCheckListEntities(strConnection))
                {
                    var allJobs = db.Checklist_Job.Where(x => !x.IsDeleted && x.ChecklistJobStepId == jobStepId)
                         .Select(x => new Checklist_JobModel()
                         {
                             Id = x.Id,
                             ParentId = x.ParentId,
                             FakeId = x.FakeId,
                             ChecklistJobStepId = x.ChecklistJobStepId,
                             JobIndex = x.JobIndex,
                             Name = x.Name,
                             JobContent = x.JobContent,
                             EmployeeId = x.EmployeeId,
                             //Employee = x.Employee,
                             EmployeeName = "",// (x.EmployeeId.HasValue ? string.Format("{0} {1}", x.Employee.FirstName, x.Employee.LastName) : ""),
                             RelatedEmployees = x.RelatedEmployees,
                             StartDate = x.StartDate,
                             EndDate = x.EndDate,
                             RealEndDate = x.RealEndDate,
                             ReminderDate = x.ReminderDate,
                             Quantities = x.Quantities,
                             RealQuantities = x.RealQuantities,
                             StatusId = x.StatusId,
                             StatusName = "",//x.Status.Name,
                             Note = x.Note,
                             UpdatedDate = x.UpdatedDate,
                             HasViewProductivity= x.HasViewProductivity
                         }).ToList();
                    if (allJobs.Count > 0)
                    {
                        ModelSelectItem found = null;
                        for (int i = 0; i < allJobs.Count; i++)
                        {
                            allJobs[i].RelatedEmployeeName = getRelatedEmployeeName(allJobs[i].RelatedEmployees, users);
                            if (allJobs[i].EmployeeId.HasValue)
                            {
                                found = users.FirstOrDefault(x => x.Value == allJobs[i].EmployeeId);
                                if (found != null)
                                    allJobs[i].EmployeeName = found.Name;
                            }

                            found = statuss.FirstOrDefault(x => x.Value == allJobs[i].StatusId);
                            if (found != null)
                                allJobs[i].StatusName = found.Name;
                        }

                        jobs = allJobs.Where(x => !x.ParentId.HasValue).OrderBy(x => x.JobIndex).ToList();

                        foreach (var item in jobs)
                        {
                            item.SubItems = getSubItem(item, allJobs);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return jobs;
        }

        private List<Checklist_JobModel> getSubItem(Checklist_JobModel item, List<Checklist_JobModel> allJobs)
        {
            item.SubItems = allJobs.Where(x => x.ParentId.HasValue && x.ParentId.Value == item.FakeId).ToList();
            if (item.SubItems.Count > 0)
            {
                foreach (var _item in item.SubItems)
                {
                    _item.SubItems = getSubItem(_item, allJobs);
                }
            }
            return item.SubItems;
        }

        public BigChecklistModel GetJobs(string strConnection, int checklistId, int userId, bool isAdmin, List<ModelSelectItem> users)
        {
            using (db = new SanXuatCheckListEntities(strConnection))
            {
                var obj = new BigChecklistModel();
                List<Checklist_JobModel> jobs = new List<Checklist_JobModel>();
                IQueryable<Checklist_Job> _Ijobs = db.Checklist_Job.Where(x => !x.IsDeleted && !x.Checklist_JobStep.IsDeleted && !x.Checklist_JobStep.Checklist.IsDeleted && x.Checklist_JobStep.ChecklistId == checklistId);
                if (isAdmin)
                    jobs.AddRange(_Ijobs.Select(x => new Checklist_JobModel()
                    {
                        #region
                        Id = x.Id,
                        Name = x.Name,
                        StatusId = x.StatusId,
                        JobContent = x.JobContent,
                        JobIndex = x.JobIndex,
                        StartDate = x.StartDate,
                        EndDate = x.EndDate,
                        RealEndDate = x.RealEndDate,
                        EmployeeId = x.EmployeeId,
                        ReminderDate = x.ReminderDate,
                        RelatedEmployees = x.RelatedEmployees,
                        ChecklistJobStepId = x.ChecklistJobStepId,
                        Note = x.Note,
                        Quantities = x.Quantities,
                        RealQuantities = x.RealQuantities,
                        HasViewProductivity = x.HasViewProductivity
                        #endregion
                    }).OrderBy(x => x.JobIndex).ToList());
                else
                {
                    jobs.AddRange(_Ijobs.Where(x => x.EmployeeId.HasValue && x.EmployeeId.Value == userId).Select(x => new Checklist_JobModel()
                    {
                        #region
                        Id = x.Id,
                        Name = x.Name,
                        StatusId = x.StatusId,
                        JobContent = x.JobContent,
                        JobIndex = x.JobIndex,
                        StartDate = x.StartDate,
                        EndDate = x.EndDate,
                        RealEndDate = x.RealEndDate,
                        EmployeeId = x.EmployeeId,
                        ReminderDate = x.ReminderDate,
                        RelatedEmployees = x.RelatedEmployees,
                        ChecklistJobStepId = x.ChecklistJobStepId,
                        Note = x.Note,
                        Quantities = x.Quantities,
                        RealQuantities = x.RealQuantities,
                        HasViewProductivity = x.HasViewProductivity
                        #endregion
                    }).OrderBy(x => x.JobIndex).ToList());

                    var strId = userId.ToString();
                    var relatedJobs = _Ijobs.Where(x => x.RelatedEmployees.Contains(strId))
                        .Select(x => new Checklist_JobModel()
                        {
                            #region
                            Id = x.Id,
                            Name = x.Name,
                            StatusId = x.StatusId,
                            JobContent = x.JobContent,
                            JobIndex = x.JobIndex,
                            StartDate = x.StartDate,
                            EndDate = x.EndDate,
                            RealEndDate = x.RealEndDate,
                            EmployeeId = x.EmployeeId,
                            ReminderDate = x.ReminderDate,
                            RelatedEmployees = x.RelatedEmployees,
                            ChecklistJobStepId = x.ChecklistJobStepId,
                            Note = x.Note,
                            Quantities = x.Quantities,
                            RealQuantities = x.RealQuantities,
                            HasViewProductivity = x.HasViewProductivity
                            #endregion
                        })
                        .OrderBy(x => x.JobIndex).ToList();
                    if (relatedJobs.Count > 0)
                    {
                        foreach (var item in relatedJobs)
                        {
                            var userIds = item.RelatedEmployees.Split(',').ToList();
                            if (userIds.FirstOrDefault(x => x == strId) != null)
                                jobs.Add(item);
                        }
                    }
                }

                if (jobs.Count > 0)
                {
                    for (int i = 0; i < jobs.Count; i++)
                    {
                        jobs[i].RelatedEmployeeName = getRelatedEmployeeName(jobs[i].RelatedEmployees, users);

                        if (jobs[i].EmployeeId.HasValue)
                        {
                            var found = users.FirstOrDefault(x => x.Value == jobs[i].EmployeeId);
                            if (found != null)
                            {
                                jobs[i].EmployeeName = found.Name;
                                jobs[i].CurrentUserIcon = found.Code;
                            }
                            else
                                jobs[i].CurrentUserIcon = "/Content/Img/no-image.png";
                        }
                        else
                            jobs[i].CurrentUserIcon = "/Content/Img/no-image.png";

                        switch (jobs[i].StatusId)
                        {
                            case (int)eStatus.None:
                                obj.EditorJobs.Add(jobs[i]);
                                break;
                            case (int)eStatus.Doing:
                                obj.ProcessJobs.Add(jobs[i]);
                                break;
                            case (int)eStatus.Error:
                                obj.ErrorJobs.Add(jobs[i]);
                                break;
                            case (int)eStatus.Checking:
                                obj.ApproveJobs.Add(jobs[i]);
                                break;
                            case (int)eStatus.Done:
                                obj.DoneJobs.Add(jobs[i]);
                                break;
                        }
                    }
                }
                obj.RelatedEmployees = db.Checklists.FirstOrDefault(x => x.Id == checklistId).RelatedEmployees;
                return obj;
            }
        }

        public Checklist_JobModel GetJobById(string strConnection, int JobId, int currentUserId, List<ModelSelectItem> statuss, List<ModelSelectItem> users)
        {
            try
            {
                using (db = new SanXuatCheckListEntities(strConnection))
                {
                    var job = db.Checklist_Job
                       .Where(x => !x.IsDeleted && x.Id == JobId)
                       .Select(x => new Checklist_JobModel()
                       {
                           Id = x.Id,
                           ParentId = x.ParentId,
                           FakeId = x.FakeId,
                           ChecklistJobStepId = x.ChecklistJobStepId,
                           JobIndex = x.JobIndex,
                           Name = x.Name,
                           JobContent = x.JobContent,
                           EmployeeId = x.EmployeeId,
                           //Employee = x.Employee,
                           EmployeeName = "",// (x.EmployeeId.HasValue ? string.Format("{0} {1}", x.Employee.FirstName, x.Employee.LastName) : ""),
                           RelatedEmployees = x.RelatedEmployees,
                           StartDate = x.StartDate,
                           EndDate = x.EndDate,
                           RealEndDate = x.RealEndDate,
                           ReminderDate = x.ReminderDate,
                           Quantities = x.Quantities,
                           RealQuantities = x.RealQuantities,
                           StatusId = x.StatusId,
                           StatusName = "",// x.Status.Name,
                           Note = x.Note,
                           UpdatedDate = x.UpdatedDate,
                           HasViewProductivity = x.HasViewProductivity
                       })
                   .FirstOrDefault();
                    if (job != null)
                    {
                        #region comment
                        var comments = new List<CommentModel>();
                        comments.AddRange(db.Checklist_Job_Comment.Where(x => !x.IsDeleted && x.JobId == job.Id)
                            .Select(x => new CommentModel()
                        {
                            Id = x.Id,
                            JobId = x.JobId,
                            Comment = x.Comment,
                            CType = 1,
                            IsErrorLog = false,
                            Type = x.Type,
                            CreatedUser = x.CreatedUser, 
                            CreatedDate = x.CreatedDate
                        }).ToList());
                        job.CommentCount = comments.Count;

                        comments.AddRange(db.Checklist_Job_ActionLog.Where(x => x.JobId == job.Id).Select(x => new CommentModel()
                        {
                            Id = x.Id,
                            JobId = x.JobId,
                            Comment = x.ActionInfo,
                            CType = 2,
                            Type = 1,
                            IsErrorLog = false,
                            CreatedUser = x.CreatedUser,
                            CreatedDate = x.CreatedDate
                        }).ToList());

                        var jErrs = db.Checklist_Job_Error.Where(x => !x.IsDeleted && x.JobId == job.Id);
                        if (jErrs != null && jErrs.Count() > 0)
                        {
                            ModelSelectItem user = null;
                            foreach (var item in jErrs)
                            {
                                user = item.UserProcessId.HasValue ? users.FirstOrDefault(x => x.Id == item.UserProcessId) : null;
                                var model = new CommentModel();
                                model.Id = item.Id;
                                model.JobId = item.JobId;
                                model.Comment = "Mã lỗi : <span class='blue'>" + item.Code + "</span><br/>Nội dung : <span class='blue'>" + item.ErrorMessage + "</span><br/>Thời điểm phát sinh : <span class='blue'>" + item.TimeError.ToString("dd/MM/yyyy HH:mm") + "</span><br/>Người xử lý : <span class='blue'>" + (user != null ? (user.Name) : "đang chờ...") + "</span><br/>Hướng giải quyết : <span class='blue'>" + (!string.IsNullOrEmpty(item.Solution) ? item.Solution : "đang chờ...") + "</span><br/>Thời gian kết thúc DK : <span class='blue'>" + (item.TimeFinish_DK != null ? item.TimeFinish_DK.Value.ToString("dd/MM/yyyy HH:mm") : "đang chờ...") + "</span>";
                                switch (item.Status)
                                {
                                    case 0: model.Comment += "<br/>Trạng thái xử lý lỗi : <span class='blue'>Đang chờ xử lý</span>\""; break;
                                    case 1: model.Comment += "<br/>Trạng thái xử lý lỗi : <span class='blue'>Hoàn thành</span>\"<br/>Thời gian kết thúc TT : <span class='blue'>" + (item.TimeFinish_TT != null ? item.TimeFinish_DK.Value.ToString("dd/MM/yyyy HH:mm") : "đang chờ...") + "</span><br/>Cảnh báo : <span class='blue'>" + (!string.IsNullOrEmpty(item.Warning) ? item.Warning : string.Empty) + "</span>"; break;
                                    case 2: model.Comment += "<br/>Trạng thái xử lý lỗi : <span class='blue'>Không hoàn thành</span>\"<br/>Lý do không hoàn thành : <span class='blue'>" + (!string.IsNullOrEmpty(item.ReasonNotFinish) ? item.ReasonNotFinish : string.Empty) + "</span>"; break;
                                }
                                model.UserProcessId = item.UserProcessId ?? 0;
                                model.CType = 1;
                                model.JobErrId = item.Id;
                                model.IsErrorLog = true;
                                model.CreatedUser = item.CreatedUser;
                                model.CreatedDate = item.CreatedDate;
                                model.Status = item.Status;
                                comments.Add(model);
                            }
                        }

                        #endregion

                        #region    attach
                        var attach = db.Checklist_Job_Attachment.Where(x => !x.IsDeleted && x.JobId == JobId).Select(x => new AttachmentModel()
                        {
                            Id = x.Id,
                            Url = x.Url,
                            Name = x.Name,
                            JobId = x.JobId,
                            CreatedDate = x.CreatedDate,
                            CreatedUser = x.CreatedUser
                        });
                        #endregion

                        #region
                        if (users != null && users.Count > 0)
                        {
                            ModelSelectItem eObj;
                            if (comments.Count > 0)
                            {
                                foreach (var cObj in comments.OrderByDescending(x => x.CreatedDate))
                                {
                                    eObj = users.FirstOrDefault(x => x.Id == cObj.CreatedUser);
                                    if (eObj != null)
                                    {
                                        cObj.UserName = eObj.Name;
                                        cObj.Icon = (!string.IsNullOrEmpty(eObj.Code) ? eObj.Code : "/Content/Img/no-image.png");
                                    }
                                    else
                                    {
                                        cObj.UserName = string.Empty;
                                        cObj.Icon = "/Content/Img/no-image.png";
                                    }
                                    job.Comments.Add(cObj);
                                }
                            }

                            if (attach.Count() > 0)
                            {
                                foreach (var att in attach.OrderByDescending(x => x.CreatedDate))
                                {
                                    eObj = users.FirstOrDefault(x => x.Id == att.CreatedUser);
                                    if (eObj != null)
                                        att.UserName = eObj.Name;
                                    else
                                        att.UserName = string.Empty;

                                    job.Attachs.Add(att);
                                }
                            }

                            eObj = users.FirstOrDefault(x => x.Value == job.EmployeeId);
                            if (eObj != null)
                            {
                                job.EmployName = eObj.Name + " (" + eObj.Data1 + ")";
                                job.EmployIcon = (!string.IsNullOrEmpty(eObj.Code) ? eObj.Code : "/Content/Img/no-image.png");
                            }
                            else
                            {
                                job.EmployName = string.Empty;
                                job.CurrentUserIcon = "/Content/Img/no-image.png";
                            }

                            eObj = users.FirstOrDefault(x => x.Id == currentUserId);
                            job.CurrentUserId = currentUserId;
                            if (eObj != null)
                            {
                                job.CurrentUserName = eObj.Name + " (" + eObj.Data1 + ")";
                                job.CurrentUserIcon = (!string.IsNullOrEmpty(eObj.Code) ? eObj.Code : "/Content/Img/no-image.png");
                            }
                            else
                            {
                                job.CurrentUserName = string.Empty;
                                job.CurrentUserIcon = "/Content/Img/no-image.png";
                            }
                        }
                        #endregion
                        return job;
                    }
                }
            }
            catch (Exception)
            { }
            return null;
        }

        #region status
        public ResponseBase UpdateStatus(string strConnection, int JobId, int actionUser, int statusId, string userName)
        {
            var rs = new ResponseBase();
            using (db = new SanXuatCheckListEntities(strConnection))
            {
                try
                {
                    var job = db.Checklist_Job.FirstOrDefault(x => !x.IsDeleted && x.Id == JobId);
                    //  var jobName = repJob.Where(x => !x.IsDeleted && x.Id == JobId).Select(x => x.P_Job.Name).FirstOrDefault();
                    if (job != null)
                    {
                        if (job.StatusId != statusId)
                        {
                            var now = DateTime.Now;
                            var log = new Checklist_Job_ActionLog();
                            log.ActionInfo = "<span>" + userName + "</span> đã di chuyển công việc này từ trạng thái <span class=\"blue\">" + getStatusName(job.StatusId) + "</span> tới trạng thái <span class=\"red\">" + getStatusName(statusId) + "</span>";
                            log.JobId = job.Id;
                            log.CreatedUser = actionUser;
                            log.CreatedDate = now;
                            db.Checklist_Job_ActionLog.Add(log);

                            var alert = new Checklist_Job_Alert();
                            alert.Alert = " đã di chuyển công việc <span class=\"blue bold\">" + job.Name + "</span> từ trạng thái <span class=\"blue\">" + getStatusName(job.StatusId) + "</span> tới trạng thái <span class=\"red\">" + getStatusName(statusId) + "</span>"; ;
                            alert.CreatedDate = now;
                            alert.ObjectType = (int)eObjectType.ChangeStatus;
                            alert.JobId = job.Id;
                            alert.UserSendId = actionUser;
                            alert.Reciever = "," + ((actionUser != job.EmployeeId && job.EmployeeId.HasValue) ? (job.RelatedEmployees + "," + job.EmployeeId) : job.RelatedEmployees) + ",";
                            db.Checklist_Job_Alert.Add(alert);

                            job.StatusId = statusId;
                            job.RealEndDate = now;
                            job.UpdatedDate = now;
                            job.UpdatedUser = actionUser;
                            db.SaveChanges();

                            var jobstep = db.Checklist_JobStep.FirstOrDefault(x => !x.IsDeleted && x.Id == job.ChecklistJobStepId);
                            if (jobstep != null)
                            {
                                if (jobstep.Checklist_Job.FirstOrDefault(x => !x.IsDeleted && x.StatusId == (int)eStatus.Error) != null)
                                    jobstep.StatusId = (int)eStatus.Error;
                                else if (jobstep.Checklist_Job.FirstOrDefault(x => !x.IsDeleted && x.StatusId == (int)eStatus.Doing) != null)
                                    jobstep.StatusId = (int)eStatus.Doing;
                                else
                                {
                                    var alljobs = jobstep.Checklist_Job.Where(x => !x.IsDeleted);
                                    var donejobs = alljobs.Where(x => x.StatusId == (int)eStatus.Done);
                                    if (donejobs.Count() == alljobs.Count())
                                        jobstep.StatusId = (int)eStatus.Done;
                                }
                                jobstep.UpdatedDate = now;
                                jobstep.UpdatedUser = actionUser;
                                db.SaveChanges();
                            }
                            rs.IsSuccess = true;
                        }
                        else
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
            }

            return rs;
        }

        private void foundJob(int value, SanXuatCheckListEntities db)
        {
            var parent = db.Checklist_Job.FirstOrDefault(x => !x.IsDeleted && x.FakeId == value);
            var childs = db.Checklist_Job.Where(x => !x.IsDeleted && x.ParentId.HasValue && x.ParentId.Value == value).ToList();
            var founds = childs.FirstOrDefault(x => x.StatusId == (int)eStatus.Error);
            if (founds != null)
            {
                parent.StatusId = (int)eStatus.Error;
            }
            else
            {
                founds = childs.FirstOrDefault(x => x.StatusId == (int)eStatus.Doing);
                if (founds != null)
                {
                    parent.StatusId = (int)eStatus.Doing;
                }
            }

        }

        private string getStatusName(int statusId)
        {
            string str = string.Empty;
            switch (statusId)
            {
                case 1: str = "Soạn thảo"; break;
                case 2: str = "Đang xử lý"; break;
                case 4: str = "Đang xử lý lỗi phát sinh"; break;
                case 3: str = "Đang chờ duyệt"; break;
                case 5: str = "Hoàn thành"; break;
            }
            return str;
        }

        public Checklist_Job GetJobById(string strConnection, int Id)
        {
            using (db = new SanXuatCheckListEntities(strConnection))
            {
                return db.Checklist_Job.FirstOrDefault(x => x.Id == Id);
            }
        }
        #endregion

        public RequestModel RequestAlarm(string strConnection, int userId, int companyId, List<ModelSelectItem> users)
        {
            try
            {
                var obj = new RequestModel();
                obj.Alarms.AddRange(GetAlarmJob(strConnection, userId, companyId, DateTime.Now, users));
                obj.Refer.AddRange(GetReferAlarmJob(strConnection, userId, companyId, DateTime.Now, users));
                return obj;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public List<Checklist_JobModel> GetAlarmJob(string strConnection, int employId, int companyId, DateTime date, List<ModelSelectItem> users)
        {
            using (db = new SanXuatCheckListEntities(strConnection))
            {
                try
                {
                    // List<ModelSelectItem> users = db.SUser.Where(x => !x.IsDeleted).Select(x => new ModelSelectItem() { Id = x.Id, Value = x.Id, Name = (x.FisrtName + " " + x.LastName), Code = x.ImagePath }).ToList();
                    List<Checklist_JobModel> returnObjs = new List<Checklist_JobModel>();
                    string employIdStr = ("," + employId + ",");
                    var jobs = db.Checklist_Job.Where(x => !x.IsDeleted &&
                    ((x.EmployeeId.HasValue && x.EmployeeId == employId) || ("," + x.RelatedEmployees + ",").Contains(employIdStr)) &&
                    //x.CompanyId == companyId && 
                    date >= x.ReminderDate && date <= x.EndDate).Select(x => new Checklist_JobModel()
                    {
                        Id = x.Id,
                        Name = x.Name,
                        StartDate = x.StartDate,
                        EndDate = x.EndDate,
                        StatusId = x.StatusId,
                        EmployeeId = x.EmployeeId,
                        JobIndex = x.JobIndex,
                        PercentComplete = 0,//x.PercentComplete, 
                        EmployName = "Không rõ",
                        // OrganId = x.P_CL_Organ.OrganId,
                        ProjectName = x.Checklist_JobStep.Checklist.Name,
                        //CommoName = x.Checklist_JobStep.Checklist.Product.Name,
                        JobStepName = x.Checklist_JobStep.Name,
                        IsStopAlarm = false,
                        IsDisabled = false
                    }).ToList();
                    if (jobs != null && jobs.Count > 0)
                    {
                        var ids = jobs.Select(x => x.Id).Distinct();
                        var jobss = db.Checklist_Job.Where(x => ids.Contains(x.Id));
                        var notifyLogs = db.Checklist_Job_NotifyLog.Where(x => ids.Contains(x.JobId) && x.EmployeeId == employId).ToList();
                        Checklist_Job_NotifyLog noObj;
                        Checklist_JobModel jmodel;

                        foreach (var item in jobss)
                        {
                            jmodel = jobs.FirstOrDefault(x => x.Id == item.Id);
                            noObj = notifyLogs.FirstOrDefault(x => x.JobId == item.Id && x.EmployeeId == employId);
                            if (noObj == null)
                            {
                                noObj = new Checklist_Job_NotifyLog() { JobId = item.Id, EmployeeId = employId, IsNotifited = true, IsDisabled = false };
                                db.Checklist_Job_NotifyLog.Add(noObj);
                                returnObjs.Add(jmodel);
                            }
                            else if (noObj != null && !noObj.IsDisabled)
                            {
                                jmodel.IsStopAlarm = true;
                                returnObjs.Add(jmodel);
                            }

                            if (jmodel.EmployeeId.HasValue)
                            {
                                var us = users.FirstOrDefault(x => x.Id == jmodel.EmployeeId.Value);
                                if (us != null)
                                {
                                    jmodel.EmployeeName = us.Name;
                                    jmodel.CurrentUserIcon = us.Code;
                                }
                                else
                                    jmodel.CurrentUserIcon = "/Content/Img/no-image.png";
                            }
                            else
                                jmodel.CurrentUserIcon = "/Content/Img/no-image.png";
                        }

                        //if (notifyLogs.Count() > 0)
                        //{
                        //    foreach (var item in jobss)
                        //    {
                        //        jmodel = jobs.FirstOrDefault(x => x.Id == item.Id);
                        //        noObj = notifyLogs.FirstOrDefault(x => x.JobId == item.Id && x.EmployeeId == employId);
                        //        if (noObj == null)
                        //        {
                        //            noObj = new Checklist_Job_NotifyLog() { JobId = item.Id, EmployeeId = employId, IsNotifited = true, IsDisabled = false };
                        //            db.Checklist_Job_NotifyLog.Add(noObj);
                        //            returnObjs.Add(jmodel);
                        //        }
                        //        else if (noObj != null && !noObj.IsDisabled)
                        //        {
                        //            jmodel.IsStopAlarm = true;
                        //            returnObjs.Add(jmodel);
                        //        }
                        //    }
                        //}
                        //else
                        //{
                        //    foreach (var item in jobs)
                        //    {
                        //        noObj = new Checklist_Job_NotifyLog() { JobId = item.Id, EmployeeId = employId, IsNotifited = true, IsDisabled = false };
                        //        db.Checklist_Job_NotifyLog.Add(noObj);
                        //        returnObjs.Add(item);
                        //    }
                        //}
                        db.SaveChanges();
                    }
                    return returnObjs;
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }

        }

        public List<Checklist_JobModel> GetReferAlarmJob(string strConnection, int employId, int companyId, DateTime date, List<ModelSelectItem> users)
        {
            using (db = new SanXuatCheckListEntities(strConnection))
            {
                try
                {
                    // List<ModelSelectItem> users = db.SUser.Where(x => !x.IsDeleted).Select(x => new ModelSelectItem() { Value = x.Id, Name = (x.FisrtName + " " + x.LastName), Code = x.ImagePath }).ToList();

                    var refers = db.Checklist_Job_EmployeeReference
                        .Where(x => !x.IsDeleted && x.EmployeeId == employId && DateTime.Now >= x.ReminderDate && DateTime.Now <= x.Checklist_Job.EndDate)
                        .Select(x => new Checklist_JobModel()
                        {
                            Id = x.JobId,
                            Name = x.Checklist_Job.Name,
                            StartDate = x.Checklist_Job.StartDate,
                            EndDate = x.Checklist_Job.EndDate,
                            StatusId = x.Checklist_Job.StatusId,
                            EmployeeId = x.Checklist_Job.EmployeeId,
                            JobIndex = x.Checklist_Job.JobIndex,
                            PercentComplete = 0,
                            EmployName = "Không rõ",
                            ReferEmployeeId = x.EmployeeId,
                            ReferEmployeeName = "Không rõ",
                            IsStopAlarm = x.IsStopAlarm,
                            JobId = x.Id,   // mượn jobId de lay id
                            JobStepName = x.Checklist_Job.Checklist_JobStep.Name,
                        }).ToList();
                    if (refers != null && refers.Count > 0)
                    {
                        var ids = refers.Select(x => x.JobId);
                        var jobss = db.Checklist_Job_EmployeeReference.Where(x => ids.Contains(x.Id));
                        foreach (var item in jobss)
                        {
                            item.IsStopAlarm = true;
                        }
                        db.SaveChanges();

                        foreach (var jmodel in refers)
                        {
                            if (jmodel.EmployeeId.HasValue)
                            {
                                var us = users.FirstOrDefault(x => x.Id == jmodel.EmployeeId.Value);
                                if (us != null)
                                {
                                    jmodel.EmployeeName = us.Name;
                                    jmodel.CurrentUserIcon = us.Code;
                                }
                                else
                                    jmodel.CurrentUserIcon = "/Content/Img/no-image.png";
                            }
                            else
                                jmodel.CurrentUserIcon = "/Content/Img/no-image.png";
                        }
                    }
                    return refers;
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public ResponseBase StopAlarm(string strConnection, int pm_JobId, int userId)
        {
            using (db = new SanXuatCheckListEntities(strConnection))
            {
                try
                {
                    var result = new ResponseBase();
                    var obj = db.Checklist_Job.FirstOrDefault(x => x.Id == pm_JobId);
                    if (obj == null)
                    {
                        result.IsSuccess = false;
                        result.Errors.Add(new Error() { MemberName = "StopAlarm", Message = "Dữ liệu bạn đang thao tác đã bị xóa hoặc không tồn tại. Vui lòng kiểm tra lại !." });
                    }
                    else
                    {
                        // obj.IsStopAlarm = true;
                        obj.UpdatedUser = userId;
                        obj.UpdatedDate = DateTime.Now;
                        db.SaveChanges();
                        result.IsSuccess = true;
                    }
                    return result;
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }


        public List<Checklist_JobModel> ReportJobs(string strConnection, int filterType, int currentUserId, List<ModelSelectItem> statuss, List<ModelSelectItem> users)
        {
            try
            {
                using (db = new SanXuatCheckListEntities(strConnection))
                {
                    var _jobs = db.Checklist_Job.Where(x => !x.IsDeleted);
                    switch (filterType)
                    {
                        case 1: //tre han
                            _jobs = _jobs.Where(x => x.RealEndDate > x.EndDate);
                            break;
                        case 2: //dung han
                            _jobs = _jobs.Where(x => x.RealEndDate == x.EndDate);
                            break;
                        case 3: //truoc han
                            _jobs = _jobs.Where(x => x.RealEndDate < x.EndDate);
                            break;
                    }


                    var jobs = _jobs.Select(x => new Checklist_JobModel()
                    {
                        Id = x.Id,
                        ParentId = x.ParentId,
                        FakeId = x.FakeId,
                        ChecklistJobStepId = x.ChecklistJobStepId,
                         JobStepName = x.Checklist_JobStep.Name,
                         ProjectName = x.Checklist_JobStep.Checklist.Name,
                        JobIndex = x.JobIndex,
                        Name = x.Name,
                        JobContent = x.JobContent,
                        EmployeeId = x.EmployeeId,
                        //Employee = x.Employee,
                        EmployeeName = "",// (x.EmployeeId.HasValue ? string.Format("{0} {1}", x.Employee.FirstName, x.Employee.LastName) : ""),
                        RelatedEmployees = x.RelatedEmployees,
                        StartDate = x.StartDate,
                        EndDate = x.EndDate,
                        RealEndDate = x.RealEndDate,
                        ReminderDate = x.ReminderDate,
                        Quantities = x.Quantities,
                        RealQuantities = x.RealQuantities,
                        StatusId = x.StatusId,
                        StatusName = "",// x.Status.Name,
                        Note = x.Note,
                        UpdatedDate = x.UpdatedDate,
                        HasViewProductivity = x.HasViewProductivity
                    })
                  .ToList();
                    if (jobs.Count > 0)
                    {
                        foreach (var item in jobs)
                        {
                            #region comment
                            var comments = new List<CommentModel>();
                            comments.AddRange(db.Checklist_Job_Comment.Where(x => !x.IsDeleted && x.JobId == item.Id).Select(x => new CommentModel()
                            {
                                Id = x.Id,
                                JobId = x.JobId,
                                Comment = x.Comment,
                                CType = 1,
                                IsErrorLog = false,
                                Type = x.Type,
                                CreatedUser = x.CreatedUser,
                                CreatedDate = x.CreatedDate
                            }).ToList());
                            item.CommentCount = comments.Count;

                            comments.AddRange(db.Checklist_Job_ActionLog.Where(x => x.JobId == item.Id).Select(x => new CommentModel()
                            {
                                Id = x.Id,
                                JobId = x.JobId,
                                Comment = x.ActionInfo,
                                CType = 2,
                                Type = 1,
                                IsErrorLog = false,
                                CreatedUser = x.CreatedUser,
                                CreatedDate = x.CreatedDate
                            }).ToList());

                            var jErrs = db.Checklist_Job_Error.Where(x => !x.IsDeleted && x.JobId == item.Id);
                            if (jErrs != null && jErrs.Count() > 0)
                            {
                                ModelSelectItem user = null;
                                foreach (var _item in jErrs)
                                {
                                    user = _item.UserProcessId.HasValue ? users.FirstOrDefault(x => x.Id == _item.UserProcessId) : null;
                                    var model = new CommentModel();
                                    model.Id = item.Id;
                                    model.JobId = item.JobId;
                                    model.Comment = "Mã lỗi : <span class='blue'>" + _item.Code + "</span><br/>Nội dung : <span class='blue'>" + _item.ErrorMessage + "</span><br/>Thời điểm phát sinh : <span class='blue'>" + _item.TimeError.ToString("dd/MM/yyyy HH:mm") + "</span><br/>Người xử lý : <span class='blue'>" + (user != null ? (user.Name) : "đang chờ...") + "</span><br/>Hướng giải quyết : <span class='blue'>" + (!string.IsNullOrEmpty(_item.Solution) ? _item.Solution : "đang chờ...") + "</span><br/>Thời gian kết thúc DK : <span class='blue'>" + (_item.TimeFinish_DK != null ? _item.TimeFinish_DK.Value.ToString("dd/MM/yyyy HH:mm") : "đang chờ...") + "</span>";
                                    switch (_item.Status)
                                    {
                                        case 0: model.Comment += "<br/>Trạng thái xử lý lỗi : <span class='blue'>Đang chờ xử lý</span>\""; break;
                                        case 1: model.Comment += "<br/>Trạng thái xử lý lỗi : <span class='blue'>Hoàn thành</span>\"<br/>Thời gian kết thúc TT : <span class='blue'>" + (_item.TimeFinish_TT != null ? _item.TimeFinish_DK.Value.ToString("dd/MM/yyyy HH:mm") : "đang chờ...") + "</span><br/>Cảnh báo : <span class='blue'>" + (!string.IsNullOrEmpty(_item.Warning) ? _item.Warning : string.Empty) + "</span>"; break;
                                        case 2: model.Comment += "<br/>Trạng thái xử lý lỗi : <span class='blue'>Không hoàn thành</span>\"<br/>Lý do không hoàn thành : <span class='blue'>" + (!string.IsNullOrEmpty(_item.ReasonNotFinish) ? _item.ReasonNotFinish : string.Empty) + "</span>"; break;
                                    }
                                    model.UserProcessId = _item.UserProcessId ?? 0;
                                    model.CType = 1;
                                    model.JobErrId = item.Id;
                                    model.IsErrorLog = true;
                                    model.CreatedUser = item.CreatedUser;
                                    model.CreatedDate = item.CreatedDate;
                                    model.Status = _item.Status;
                                    comments.Add(model);
                                }
                            }

                            #endregion

                            #region    attach
                            var attach = db.Checklist_Job_Attachment.Where(x => !x.IsDeleted && x.JobId == item.Id).Select(x => new AttachmentModel()
                            {
                                Id = x.Id,
                                Url = x.Url,
                                Name = x.Name,
                                JobId = x.JobId,
                                CreatedDate = x.CreatedDate,
                                CreatedUser = x.CreatedUser
                            });
                            #endregion

                            #region
                            if (users != null && users.Count > 0)
                            {
                                ModelSelectItem eObj;
                                /*
                                if (comments.Count > 0)
                                {
                                    foreach (var cObj in comments.OrderByDescending(x => x.CreatedDate))
                                    {
                                        eObj = users.FirstOrDefault(x => x.Id == cObj.CreatedUser);
                                        if (eObj != null)
                                        {
                                            cObj.UserName = eObj.Name;
                                            cObj.Icon = (!string.IsNullOrEmpty(eObj.Code) ? eObj.Code : "/Content/Img/no-image.png");
                                        }
                                        else
                                        {
                                            cObj.UserName = string.Empty;
                                            cObj.Icon = "/Content/Img/no-image.png";
                                        }
                                        job.Comments.Add(cObj);
                                    }
                                }

                                if (attach.Count() > 0)
                                {
                                    foreach (var att in attach.OrderByDescending(x => x.CreatedDate))
                                    {
                                        eObj = users.FirstOrDefault(x => x.Id == att.CreatedUser);
                                        if (eObj != null)
                                            att.UserName = eObj.Name;
                                        else
                                            att.UserName = string.Empty;

                                        job.Attachs.Add(att);
                                    }
                                }
                                */
                                eObj = users.FirstOrDefault(x => x.Value == item.EmployeeId);
                                if (eObj != null)
                                {
                                    item.EmployName = eObj.Name + " (" + eObj.Data1 + ")";
                                    item.EmployIcon = (!string.IsNullOrEmpty(eObj.Code) ? eObj.Code : "/Content/Img/no-image.png");
                                }
                                else
                                {
                                    item.EmployName = string.Empty;
                                    item.CurrentUserIcon = "/Content/Img/no-image.png";
                                }

                                eObj = users.FirstOrDefault(x => x.Id == currentUserId);
                                item.CurrentUserId = currentUserId;
                                if (eObj != null)
                                {
                                    item.CurrentUserName = eObj.Name + " (" + eObj.Data1 + ")";
                                    item.CurrentUserIcon = (!string.IsNullOrEmpty(eObj.Code) ? eObj.Code : "/Content/Img/no-image.png");
                                }
                                else
                                {
                                    item.CurrentUserName = string.Empty;
                                    item.CurrentUserIcon = "/Content/Img/no-image.png";
                                }
                            }
                            #endregion

                            if (statuss.Count > 0)
                            {
                                var eObj = statuss.FirstOrDefault(x => x.Value == item.StatusId);
                                item.StatusName = eObj != null ? eObj.Name : "";
                            }
                        }
                    }
                    return jobs;
                }
            }
            catch (Exception)
            { }
            return new List<Checklist_JobModel>();
        }

    }
}
