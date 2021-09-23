using GPRO.Core.Mvc;
using GPROCommon.Models;
using GPROSanXuat_Checklist.Business.Model;
using GPROSanXuat_Checklist.Data;
using System;
using System.Collections.Generic;
using System.Linq;


namespace GPROSanXuat_Checklist.Business
{
    public class BLLChecklistJobStep
    {
        #region constructor
        SanXuatCheckListEntities db;
        static object key = new object();
        private static volatile BLLChecklistJobStep _Instance;
        public static BLLChecklistJobStep Instance
        {
            get
            {
                if (_Instance == null)
                    lock (key)
                        _Instance = new BLLChecklistJobStep();

                return _Instance;
            }
        }
        private BLLChecklistJobStep() { }
        #endregion

        bool checkPermis(Checklist_JobStep obj, int actionUser, bool isOwner)
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


        public ResponseBase AdminUpdate(string strConnection, Checklist_JobStepModel model, bool isOwner)
        {
            try
            {
                using (db = new SanXuatCheckListEntities(strConnection))
                {
                    var result = new ResponseBase();
                    //if (CheckExists(model.Name.Trim().ToUpper(), model.Id))
                    //{
                    //    result.IsSuccess = false;
                    //    result.Errors.Add(new Error() { MemberName = "Insert ", Message = "Tên mẫu này đã tồn tại. Vui lòng chọn lại Tên khác !." });
                    //    return result;
                    //}
                    //else
                    //{
                    Checklist_JobStep obj  = db.Checklist_JobStep.FirstOrDefault(x => !x.IsDeleted && x.Id == model.Id);
                    if (obj == null)
                    {
                        result.IsSuccess = false;
                        result.Errors.Add(new Error() { MemberName = "Update ", Message = "Bước công việc bạn đang thao tác đã bị xóa hoặc không tồn tại. Vui lòng kiểm tra lại !." });
                        return result;
                    }
                    else
                    {
                        if (!checkPermis(obj, model.ActionUser, isOwner))
                        {
                            result.IsSuccess = false;
                            result.Errors.Add(new Error() { MemberName = "update", Message = "Bạn không phải là người tạo bước công việc này nên bạn không cập nhật được thông tin cho bước công việc này." });
                        }
                        else
                        {
                            obj.Name = model.Name;
                            obj.JobStepContent = model.JobStepContent;
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
                    // }
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
                var obj = db.Checklist_JobStep.FirstOrDefault(x => !x.IsDeleted && x.Name.Trim().ToUpper().Equals(code) && x.Id != id);
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
                    var objs = db.Checklist_JobStep.FirstOrDefault(x => !x.IsDeleted && x.Id == id);
                    if (objs == null)
                    {
                        result.IsSuccess = false;
                        result.Errors.Add(new Error() { MemberName = "Delete ", Message = "Bước công việc bạn đang thao tác đã bị xóa hoặc không tồn tại. Vui lòng kiểm tra lại !." });
                    }
                    else
                    {
                        if (!checkPermis(objs, acctionUserId, isOwner))
                        {
                            result.IsSuccess = false;
                            result.Errors.Add(new Error() { MemberName = "Delete", Message = "Bạn không phải là người tạo Bước công việc này nên bạn không xóa được Bước công việc này." });
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

         
    }
}
