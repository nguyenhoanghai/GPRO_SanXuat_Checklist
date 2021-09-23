using GPRO.Core.Mvc;
using GPROCommon.Models;
using GPROSanXuat_Checklist.Business.Enum;
using GPROSanXuat_Checklist.Business.Model;
using GPROSanXuat_Checklist.Data;
using System;
using System.Collections.Generic;
using System.Linq;

namespace GPROSanXuat_Checklist.Business
{
    public class BLLChecklistJobAttachment
    {
        #region constructor
        SanXuatCheckListEntities db;
        static object key = new object();
        private static volatile BLLChecklistJobAttachment _Instance;
        public static BLLChecklistJobAttachment Instance
        {
            get
            {
                if (_Instance == null)
                    lock (key)
                        _Instance = new BLLChecklistJobAttachment();

                return _Instance;
            }
        }
        private BLLChecklistJobAttachment() { }
        #endregion

        public ResponseBase InsertOrUpdate(string strConnection, int JobId, int actionUser, string userName, string name, string url, string note, List<ModelSelectItem> users)
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
                        var att = new Checklist_Job_Attachment();
                        att.Name = name;
                        att.Url = url;
                        att.JobId = job.Id;
                        att.Note = alertUsers[alertUsers.Count - 1];
                        att.CreatedUser = actionUser;
                        att.CreatedDate = now;
                        db.Checklist_Job_Attachment.Add(att);
                        db.SaveChanges();
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
                            var alert = " đã nhắc tới bạn trong tệp tin đính kèm ở công việc : <span class='bold blue'>" + job.Name + "</span> \n Sản phẩm: <span class='bold blue'>" + job.CommoName + "</span>\n Checklist: <span class='bold blue'>" + job.ProjectName + "</span>";
                            BLLHelper.CreateAlert(db, new Checklist_Job_Alert() { Alert = alert, JobId = job.Id, Reciever = reciever, UserSendId = actionUser, ObjectId = att.Id, ObjectType = (int)eObjectType.Attach, CreatedDate = now });
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

        public ResponseBase Delete(string strConnection, int JobId, int Id, int actionUser, string userName)
        {
            using (db = new SanXuatCheckListEntities(strConnection))
            {
                var rs = new ResponseBase();
                try
                {
                    var job = db.Checklist_Job.Where(x => !x.IsDeleted && x.Id == JobId).FirstOrDefault();
                    if (job != null)
                    {
                        var att = db.Checklist_Job_Attachment.Where(x => !x.IsDeleted && x.Id == Id).FirstOrDefault();
                        if (att != null)
                        {
                            var now = DateTime.Now;
                            var log = new Checklist_Job_ActionLog();
                            log.ActionInfo = userName + " đã xóa tệp " + att.Name + " khỏi thẻ này.";
                            log.JobId = job.Id;
                            log.CreatedUser = actionUser;
                            log.CreatedDate = now;
                            db.Checklist_Job_ActionLog.Add(log);

                            att.IsDeleted = true;
                            att.DeletedDate = now;
                            att.DeletedUser = actionUser;
                            db.SaveChanges();
                            rs.IsSuccess = true;
                        }
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
