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
    public class BLLTemplateChecklist
    {
        #region constructor
        SanXuatCheckListEntities db;
        static object key = new object();
        private static volatile BLLTemplateChecklist _Instance;
        public static BLLTemplateChecklist Instance
        {
            get
            {
                if (_Instance == null)
                    lock (key)
                        _Instance = new BLLTemplateChecklist();

                return _Instance;
            }
        }
        private BLLTemplateChecklist() { }
        #endregion

        bool checkPermis(Template_Checklist obj, int actionUser, bool isOwner)
        {
            if (isOwner) return true;
            return obj.CreatedUser == actionUser;
        }

        public TemplateChecklistModel Get(string strConnection, int Id)
        {
            try
            {
                using (db = new SanXuatCheckListEntities(strConnection))
                {

                    return db.Template_Checklist.Where(x => !x.IsDeleted && x.Id == Id)
                        .Select(x => new TemplateChecklistModel()
                        {
                            Id = x.Id,
                            Name = x.Name,
                            Note = x.Note,
                        }).FirstOrDefault();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }


        public PagedList<TemplateChecklistModel> GetList(string strConnection, string keyWord, int startIndexRecord, int pageSize, string sorting)
        {
            try
            {
                using (db = new SanXuatCheckListEntities(strConnection))
                {
                    if (string.IsNullOrEmpty(sorting))
                        sorting = "CreatedDate DESC";

                    IQueryable<Template_Checklist> objs = null;
                    if (string.IsNullOrEmpty(keyWord))
                        objs = db.Template_Checklist.Where(x => !x.IsDeleted).OrderByDescending(x => x.CreatedDate);
                    else
                        objs = db.Template_Checklist.Where(x => !x.IsDeleted && x.Name.Trim().ToUpper().Contains(keyWord.Trim().ToUpper())).OrderByDescending(x => x.CreatedDate);

                    var pageNumber = (startIndexRecord / pageSize) + 1;
                    return new PagedList<TemplateChecklistModel>(objs.Select(x => new TemplateChecklistModel()
                    {
                        Id = x.Id,
                        Name = x.Name,
                        Note = x.Note,
                        CreatedDate = x.CreatedDate
                    }).OrderBy(sorting).ToList(), pageNumber, pageSize);
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public ResponseBase InsertOrUpdate(string strConnection, TemplateChecklistModel model, bool isOwner)
        {
            try
            {
                using (db = new SanXuatCheckListEntities(strConnection))
                {
                    var result = new ResponseBase();
                    if (CheckExists(model.Name.Trim().ToUpper(), model.Id))
                    {
                        result.IsSuccess = false;
                        result.Errors.Add(new Error() { MemberName = "Insert ", Message = "Tên mẫu này đã tồn tại. Vui lòng chọn lại Tên khác !." });
                        return result;
                    }
                    else
                    {
                        Template_Checklist obj;
                        if (model.Id == 0)
                        {
                            obj = new Template_Checklist();
                            Parse.CopyObject(model, ref obj);
                            obj.CreatedDate = DateTime.Now;
                            obj.CreatedUser = model.ActionUser;
                            db.Template_Checklist.Add(obj);
                            db.SaveChanges();
                            result.IsSuccess = true;
                        }
                        else
                        {
                            obj = db.Template_Checklist.FirstOrDefault(x => !x.IsDeleted && x.Id == model.Id);
                            if (obj == null)
                            {
                                result.IsSuccess = false;
                                result.Errors.Add(new Error() { MemberName = "Update ", Message = "Loại mẫu bạn đang thao tác đã bị xóa hoặc không tồn tại. Vui lòng kiểm tra lại !." });
                                return result;
                            }
                            else
                            {
                                if (!checkPermis(obj, model.ActionUser, isOwner))
                                {
                                    result.IsSuccess = false;
                                    result.Errors.Add(new Error() { MemberName = "update", Message = "Bạn không phải là người tạo mã hàng này nên bạn không cập nhật được thông tin cho mã hàng này." });
                                }
                                else
                                {
                                    obj.Name = model.Name;
                                    obj.Note = model.Note;
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

        private bool CheckExists(string code, int? id)
        {
            try
            {
                Template_Checklist obj = null;
                obj = db.Template_Checklist.FirstOrDefault(x => !x.IsDeleted && x.Name.Trim().ToUpper().Equals(code) && x.Id != id);

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
                    var objs = db.Template_Checklist.FirstOrDefault(x => !x.IsDeleted && x.Id == id);
                    if (objs == null)
                    {
                        result.IsSuccess = false;
                        result.Errors.Add(new Error() { MemberName = "Delete ", Message = "Loại mẫu bạn đang thao tác đã bị xóa hoặc không tồn tại. Vui lòng kiểm tra lại !." });
                    }
                    else
                    {
                        if (!checkPermis(objs, acctionUserId, isOwner))
                        {
                            result.IsSuccess = false;
                            result.Errors.Add(new Error() { MemberName = "Delete", Message = "Bạn không phải là người tạo mã hàng này nên bạn không xóa được mã hàng này." });
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

        public List<ModelSelectItem> GetSelectItem(string strConnection)
        {
            try
            {
                using (db = new SanXuatCheckListEntities(strConnection))
                {
                    var selectItems = new List<ModelSelectItem>();
                    var objs = db.Template_Checklist.Where(x => !x.IsDeleted).Select(
                        x => new ModelSelectItem()
                        {
                            Value = x.Id,
                            Name = x.Name
                        }).ToList();

                    if (objs != null && objs.Count() > 0)
                    {
                        selectItems.Add(new ModelSelectItem() { Value = 0, Name = " - -  Chọn mẫu  - - " });
                        selectItems.AddRange(objs);
                    }
                    else
                        selectItems.Add(new ModelSelectItem() { Value = 0, Name = "  Không có mẫu  " });
                    return selectItems;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

    }
}
