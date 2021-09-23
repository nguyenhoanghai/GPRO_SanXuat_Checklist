using GPRO.Core.Mvc;
using GPRO.Ultilities;
using GPROCommon.Models;
using Hugate.Framework;
using PagedList;
using GPROSanXuat_Checklist.Business.Model;
using GPROSanXuat_Checklist.Data;
using System;
using System.Collections.Generic;
using System.Linq;

namespace GPROSanXuat_Checklist.Business
{
    public class BLLTemplateChecklistJob
    {
        #region constructor
        SanXuatCheckListEntities db;
        static object key = new object();
        private static volatile BLLTemplateChecklistJob _Instance;
        public static BLLTemplateChecklistJob Instance
        {
            get
            {
                if (_Instance == null)
                    lock (key)
                        _Instance = new BLLTemplateChecklistJob();

                return _Instance;
            }
        }
        private BLLTemplateChecklistJob() { }
        #endregion

        bool checkPermis(Template_CL_Job obj, int actionUser, bool isOwner)
        {
            if (isOwner) return true;
            return obj.CreatedUser == actionUser;
        }

        public ResponseBase InsertOrUpdate(string strConnection, TemplateChecklistJobModel model, bool isOwner)
        {
            try
            {
                using (db = new SanXuatCheckListEntities(strConnection))
                {
                    var result = new ResponseBase();
                    if (CheckExists(model.Name.Trim().ToUpper(), model.Id, model.Template_JobStepId))
                    {
                        result.IsSuccess = false;
                        result.Errors.Add(new Error() { MemberName = "Insert ", Message = "Tên Công việc này đã tồn tại. Vui lòng chọn lại Tên khác !." });
                        return result;
                    }
                    else
                    {
                        Template_CL_Job obj;
                        if (model.Id == 0)
                        {
                            obj = new Template_CL_Job();
                            Parse.CopyObject(model, ref obj);
                            obj.CreatedDate = DateTime.Now;
                            obj.CreatedUser = model.ActionUser;
                            db.Template_CL_Job.Add(obj);
                            db.SaveChanges();
                            result.IsSuccess = true;
                        }
                        else
                        {
                            obj = db.Template_CL_Job.FirstOrDefault(x => !x.IsDeleted && x.Id == model.Id);
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
                                    obj.UpdatedUser = model.ActionUser;
                                    obj.UpdatedDate = DateTime.Now;
                                    db.SaveChanges();
                                    result.IsSuccess = true;
                                }
                            }
                        }

                        return result;
                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        private bool CheckExists(string code, int? id, int jobStepId)
        {
            try
            {
                Template_CL_Job obj = null;
                obj = db.Template_CL_Job.FirstOrDefault(x => !x.IsDeleted && x.Name.Trim().ToUpper().Equals(code) && x.Id != id && x.Template_JobStepId == jobStepId);

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
                    var objs = db.Template_CL_Job.FirstOrDefault(x => !x.IsDeleted && x.Id == id);
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

        public List<TemplateChecklistJobModel> Gets(string strConnection, int jobStepId)
        {
            var jobs = new List<TemplateChecklistJobModel>();
            try
            {
                using (db = new SanXuatCheckListEntities(strConnection))
                {
                    var allJobs = db.Template_CL_Job.Where(x => !x.IsDeleted && x.Template_JobStepId == jobStepId)
                         .Select(x => new TemplateChecklistJobModel()
                         {
                             Id = x.Id,
                             ParentId = x.ParentId,
                             Template_JobStepId = x.Template_JobStepId,
                             JobIndex = x.JobIndex,
                             JobContent = x.JobContent,
                             Name = x.Name
                         }).ToList();
                    if (allJobs.Count > 0)
                    { 
                        jobs = allJobs
                             .Where(x => !x.ParentId.HasValue) .OrderBy(x => x.JobIndex).ToList();

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
         
        private List< TemplateChecklistJobModel> getSubItem(TemplateChecklistJobModel item, List<TemplateChecklistJobModel> allJobs)
        {
            item.SubItems = allJobs.Where(x => x.ParentId.HasValue && x.ParentId.Value == item.Id).ToList();
            if (item.SubItems.Count > 0)
            {
                foreach (var _item  in item.SubItems)
                {
                    _item.SubItems = getSubItem(_item, allJobs);
                }
            }
            return item.SubItems;
        }

        public PagedList<TemplateChecklistJobModel> GetList(string strConnection, int jobStepId, int startIndexRecord, int pageSize, string sorting)
        {
            try
            {
                using (db = new SanXuatCheckListEntities(strConnection))
                {
                    if (string.IsNullOrEmpty(sorting))
                        sorting = "Id DESC";

                    IQueryable<Template_CL_Job> objs = null;
                    objs = db.Template_CL_Job.Where(x => !x.IsDeleted && x.Template_JobStepId == jobStepId).OrderBy(sorting);

                    var pageNumber = (startIndexRecord / pageSize) + 1;
                    return new PagedList<TemplateChecklistJobModel>(objs.Select(x => new TemplateChecklistJobModel()
                    {
                        Id = x.Id,
                        Name = x.Name,
                        JobContent = x.JobContent,
                        JobIndex = x.JobIndex
                    }).OrderBy(sorting).ToList(), pageNumber, pageSize);
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

    }
}
