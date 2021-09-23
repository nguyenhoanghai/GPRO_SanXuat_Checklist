using GPRO.Core.Mvc;
using GPROCommon.Models;
using GPROSanXuat_Checklist.Business.Enum;
using GPROSanXuat_Checklist.Business.Model;
using GPROSanXuat_Checklist.Data;
using PagedList;
using System;
using System.Collections.Generic;
using System.Linq;

namespace GPROSanXuat_Checklist.Business
{
    public class BLLChecklistJobAlert
    {
        #region constructor
        SanXuatCheckListEntities db;
        static object key = new object();
        private static volatile BLLChecklistJobAlert _Instance;
        public static BLLChecklistJobAlert Instance
        {
            get
            {
                if (_Instance == null)
                    lock (key)
                        _Instance = new BLLChecklistJobAlert();

                return _Instance;
            }
        }
        private BLLChecklistJobAlert() { }
        #endregion

        public BigAlertModel GetAlerts(string strConnection, string userId, List<ModelSelectItem> users)
        {
            using (db = new SanXuatCheckListEntities(strConnection))
            {
                var model = new BigAlertModel();
                try
                {
                    userId = "," + userId + ",";
                    var alerts = db.Checklist_Job_Alert.Where(x => !x.IsDeleted && !x.IsViewed && x.Reciever.Contains(userId))
                        .OrderByDescending(x => x.CreatedDate)
                        .Select(x => new ChecklistJobAlertModel()
                        {
                            Id = x.Id,
                            Alert = x.Alert,
                            IsViewed = x.IsViewed,
                            ObjectId = x.ObjectId,
                            ObjectType = x.ObjectType,
                            JobId = x.JobId,
                            Reciever = x.Reciever,
                            UserSendId = x.UserSendId,
                            CreatedDate = x.CreatedDate
                        }).ToList();
                    model.Unread = alerts.Count;
                    alerts = alerts.Take(5).ToList();
                    if (alerts.Count > 0)
                    {
                        List<string> Ids;
                        ModelSelectItem user;
                        var attachmens = db.Checklist_Job_Attachment.Where(x => !x.IsDeleted).ToList();
                        var comments = db.Checklist_Job_Comment.Where(x => !x.IsDeleted).ToList();
                        var errors = db.Checklist_Job_Error.Where(x => !x.IsDeleted).ToList();
                        foreach (var item in alerts)
                        {
                            //Ids = item.Reciever.Split(',').ToList();
                            //if (Ids.FirstOrDefault(x => x == userId) != null)
                            //{
                            user = users.FirstOrDefault(x => x.Id == item.UserSendId);
                            if (user != null)
                            {
                                item.Alert = "<span class='bold'>" + user.Name + "</span>" + item.Alert;
                                item.Icon = (!string.IsNullOrEmpty(user.Code) ? user.Code : "/Content/Img/no-image.png");
                            }
                            else
                                item.Icon = "/Content/Img/no-image.png";
                            if ((int)eObjectType.ChangeStatus != item.ObjectType)
                            {
                                switch (item.ObjectType)
                                {
                                    case (int)eObjectType.Attach:
                                        var jobAttach = attachmens.FirstOrDefault(x => !x.IsDeleted && x.Id == item.ObjectId);
                                        if (jobAttach != null)
                                            item.MainContent = jobAttach.Name;
                                        break;
                                    case (int)eObjectType.Comment:
                                        var jobComment = comments.FirstOrDefault(x => !x.IsDeleted && x.Id == item.ObjectId);
                                        if (jobComment != null)
                                            item.MainContent = jobComment.Comment;
                                        break;
                                    case (int)eObjectType.Error:
                                        var jobError = errors.FirstOrDefault(x => !x.IsDeleted && x.Id == item.ObjectId);
                                        if (jobError != null)
                                            item.MainContent = jobError.ErrorMessage + " thời điểm phát sinh sự cố :" + jobError.TimeError.ToString("dd/MM/yyyy HH:mm");
                                        break;
                                }
                            }
                            model.Alerts.Add(item);
                            //if (model.Alerts.Count == 5)
                            // break;
                            //}
                        }
                        // lúc " + now.ToString("dd/MM/yyyy HH:mm")
                        //model.Alerts.AddRange(alerts);
                    }
                }
                catch (Exception)
                {
                }
                return model;
            }
        }

        public void DisableAlert(string strConnection, int Id)
        {
            using (db = new SanXuatCheckListEntities(strConnection))
            {
                var alert = db.Checklist_Job_Alert.FirstOrDefault(x => !x.IsViewed && x.Id == Id);
                if (alert != null)
                {
                    alert.IsViewed = true;
                    db.SaveChanges();
                }
            }
        }

        public ResponseBase Delete(string strConnection, int Id, int actionUser)
        {
            using (db = new SanXuatCheckListEntities(strConnection))
            {
                try
                {
                    var result = new ResponseBase();
                    var obj = db.Checklist_Job_Alert.FirstOrDefault(x => !x.IsDeleted && x.Id == Id);
                    if (obj != null)
                    {
                        obj.IsDeleted = true;
                        db.SaveChanges();
                        result.IsSuccess = true;
                    }
                    else
                    {
                        result.IsSuccess = false;
                        result.Errors.Add(new Error() { MemberName = "Delete", Message = "Dữ liệu bạn đang thao tác không tồn tại. Vui lòng kiểm tra lại!" });
                    }
                    return result;
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public PagedList<ChecklistJobAlertModel> GetList(string strConnection, string userId, int startIndexRecord, int pageSize, string sorting, List<ModelSelectItem> users)
        {
            using (db = new SanXuatCheckListEntities(strConnection))
            {
                try
                {
                    userId = "," + userId + ",";
                    var pageNumber = (startIndexRecord / pageSize) + 1;
                    if (string.IsNullOrEmpty(sorting))
                        sorting = "CreatedDate DESC";
                    var alerts = db.Checklist_Job_Alert.Where(x => !x.IsDeleted && x.Reciever.Contains(userId)).Select(x => new ChecklistJobAlertModel()
                    {
                        Id = x.Id,
                        Alert = x.Alert,
                        IsViewed = x.IsViewed,
                        ObjectId = x.ObjectId,
                        ObjectType = x.ObjectType,
                        JobId = x.JobId,
                        Reciever = x.Reciever,
                        UserSendId = x.UserSendId,
                        CreatedDate = x.CreatedDate,
                    }).OrderByDescending(x => x.CreatedDate).ToList();
                    if (alerts.Count > 0)
                    {
                        var attachmens = db.Checklist_Job_Attachment.Where(x => !x.IsDeleted).ToList();
                        var comments = db.Checklist_Job_Comment.Where(x => !x.IsDeleted).ToList();
                        var errors = db.Checklist_Job_Error.Where(x => !x.IsDeleted).ToList();
                        ModelSelectItem user;
                        foreach (var item in alerts)
                        {
                            string proName = "";// x.Checklist_JobStep.Checklist.Product.Name;
                            var abc = db.Checklist_Job.Where(x => !x.IsDeleted && x.Id == item.JobId).Select(x => new Checklist_JobModel() { Name = (x.Checklist_JobStep.Checklist.Name + " <i class=\"fa fa-arrow-right red\"></i> " + proName + " <i class=\"fa fa-arrow-right red\"></i> " + x.Checklist_JobStep.Name) }).FirstOrDefault();
                            item.Title = (abc == null ? "" : abc.Name);
                            //Ids = item.Reciever.Split(',').ToList();
                            //if (Ids.FirstOrDefault(x => x == userId) != null)
                            //{
                            user = users.FirstOrDefault(x => x.Id == item.UserSendId);
                            if (user != null)
                            {
                                item.Alert = "<span class='bold'>" + user.Name + "</span>" + item.Alert;
                                item.Icon = (!string.IsNullOrEmpty(user.Code) ? user.Code : "/Content/Img/no-image.png");
                            }
                            else
                                item.Icon = "/Content/Img/no-image.png";
                            if ((int)eObjectType.ChangeStatus != item.ObjectType)
                            {
                                switch (item.ObjectType)
                                {
                                    case (int)eObjectType.Attach:
                                        var jobAttach = attachmens.FirstOrDefault(x => !x.IsDeleted && x.Id == item.ObjectId);
                                        if (jobAttach != null)
                                            item.MainContent = jobAttach.Name;
                                        break;
                                    case (int)eObjectType.Comment:
                                        var jobComment = comments.FirstOrDefault(x => !x.IsDeleted && x.Id == item.ObjectId);
                                        if (jobComment != null)
                                            item.MainContent = jobComment.Comment;
                                        break;
                                    case (int)eObjectType.Error:
                                        var jobError = errors.FirstOrDefault(x => !x.IsDeleted && x.Id == item.ObjectId);
                                        if (jobError != null)
                                            item.MainContent = jobError.ErrorMessage + " thời điểm phát sinh sự cố :" + jobError.TimeError.ToString("dd/MM/yyyy HH:mm");
                                        break;
                                }
                                //}
                            }
                        }
                        return new PagedList<ChecklistJobAlertModel>(alerts, pageNumber, pageSize);
                    }
                    else
                        return new PagedList<ChecklistJobAlertModel>(new List<ChecklistJobAlertModel>(), pageNumber, pageSize);
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public ResponseBase ChangeStatus(string strConnection, int Id)
        {
            using (db = new SanXuatCheckListEntities(strConnection))
            {
                try
                {
                    var result = new ResponseBase();
                    var obj = db.Checklist_Job_Alert.FirstOrDefault(x => !x.IsDeleted && x.Id == Id);
                    if (obj != null)
                    {
                        obj.IsViewed = true;
                        db.SaveChanges();
                        result.IsSuccess = true;
                    }
                    else
                    {
                        result.IsSuccess = false;
                        result.Errors.Add(new Error() { MemberName = "Delete", Message = "Dữ liệu bạn đang thao tác không tồn tại. Vui lòng kiểm tra lại!" });
                    }
                    return result;
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

    }
}
