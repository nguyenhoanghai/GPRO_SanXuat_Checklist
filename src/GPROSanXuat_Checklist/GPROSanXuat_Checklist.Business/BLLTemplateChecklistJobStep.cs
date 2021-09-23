using GPRO.Core.Mvc;
using GPRO.Ultilities;
using GPROCommon.Models;
using GPROSanXuat_Checklist.Business.Model;
using GPROSanXuat_Checklist.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GPROSanXuat_Checklist.Business
{
   public class BLLTemplateChecklistJobStep
    {
        #region constructor
        SanXuatCheckListEntities db;
        static object key = new object();
        private static volatile BLLTemplateChecklistJobStep _Instance;
        public static BLLTemplateChecklistJobStep Instance
        {
            get
            {
                if (_Instance == null)
                    lock (key)
                        _Instance = new BLLTemplateChecklistJobStep();

                return _Instance;
            }
        }
        private BLLTemplateChecklistJobStep() { }
        #endregion

        bool checkPermis(Template_CL_JobStep obj, int actionUser, bool isOwner)
        {
            if (isOwner) return true;
            return obj.CreatedUser == actionUser;
        }
        
        public ResponseBase InsertOrUpdate(string strConnection, TemplateChecklistJobStepModel model, bool isOwner)
        {
            try
            {
                using (db = new SanXuatCheckListEntities(strConnection))
                {
                    var result = new ResponseBase();
                    if (CheckExists(model.Name.Trim().ToUpper(), model.Id, model.TemplateId))
                    {
                        result.IsSuccess = false;
                        result.Errors.Add(new Error() { MemberName = "Insert ", Message = "Tên bước công việc này đã tồn tại. Vui lòng chọn lại Tên khác !." });
                        return result;
                    }
                    else
                    {
                        Template_CL_JobStep obj;
                        if (model.Id == 0)
                        {
                            obj = new Template_CL_JobStep();
                            Parse.CopyObject(model, ref obj);
                            obj.CreatedDate = DateTime.Now;
                            obj.CreatedUser = model.ActionUser;
                            db.Template_CL_JobStep.Add(obj);
                            db.SaveChanges();
                            result.IsSuccess = true;
                        }
                        else
                        {
                            obj = db.Template_CL_JobStep.FirstOrDefault(x => !x.IsDeleted && x.Id == model.Id);
                            if (obj == null)
                            {
                                result.IsSuccess = false;
                                result.Errors.Add(new Error() { MemberName = "Update ", Message = "Loại bước công việc bạn đang thao tác đã bị xóa hoặc không tồn tại. Vui lòng kiểm tra lại !." });
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

        private bool CheckExists(string code, int? id, int templateId)
        {
            try
            {
                Template_CL_JobStep obj = null;
                obj = db.Template_CL_JobStep.FirstOrDefault(x => !x.IsDeleted && x.Name.Trim().ToUpper().Equals(code) && x.Id != id && x.TemplateId == templateId);

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
                    var objs = db.Template_CL_JobStep.FirstOrDefault(x => !x.IsDeleted && x.Id == id);
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
                            result.Errors.Add(new Error() { MemberName = "Delete", Message = "Bạn không phải là người tạo bước công việc này nên bạn không xóa được bước công việc này." });
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

        public List<TemplateChecklistJobStepModel> Gets(string strConnection, int templateId)
        {
            try
            {
                using (db = new SanXuatCheckListEntities(strConnection))
                { 
                    return db.Template_CL_JobStep.Where(x => !x.IsDeleted && x.TemplateId == templateId).Select(
                        x => new TemplateChecklistJobStepModel()
                        {
                            Id = x.Id,
                            StepIndex = x.StepIndex,
                            JobStepContent = x.JobStepContent,
                            Name = x.Name
                        }).OrderBy(x=>x.StepIndex).ToList();  
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

    }
}
