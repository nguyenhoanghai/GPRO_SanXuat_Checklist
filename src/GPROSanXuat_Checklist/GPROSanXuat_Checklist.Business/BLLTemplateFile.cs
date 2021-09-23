using GPRO.Core.Mvc;
using GPRO.Ultilities;
using GPROCommon.Models;
using GPROSanXuat_Checklist.Business.Model;
using GPROSanXuat_Checklist.Data;
using Hugate.Framework;
using PagedList;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;

namespace GPROSanXuat_Checklist.Business
{
    public class BLLTemplateFile
    {
        SanXuatCheckListEntities db;
        static object key = new object();
        private static volatile BLLTemplateFile _Instance;
        public static BLLTemplateFile Instance
        {
            get
            {
                if (_Instance == null)
                    lock (key)
                        _Instance = new BLLTemplateFile();

                return _Instance;
            }
        }
        private BLLTemplateFile() { }

        private bool CheckExists(int Id, string value)
        {
            TemplateFile obj;
            obj = db.TemplateFiles.FirstOrDefault(x => !x.IsDeleted && x.Id != Id && x.Name.Trim().Equals(value)); //kiem tra trung ten ?
            return obj != null ? true : false;
        }

        public TemplateFile GetById(string strConnection, int Id)
        {
            using (db = new SanXuatCheckListEntities(strConnection))
            {
                return db.TemplateFiles.FirstOrDefault(x => !x.IsDeleted && x.Id == Id);
            }
        }

        public int GetTemplateFileTypeIdByCode(string strConnection, string code)
        {
            using (db = new SanXuatCheckListEntities(strConnection))
            {
                var obj = db.TemplateFileTypes.FirstOrDefault(x => !x.IsDeleted && x.Code.Trim().ToUpper() == code.Trim().ToUpper());
                if (obj == null)
                    return 0;
                return obj.Id;
            }
        }

        public ResponseBase CreateOrUpdate(string strConnection, TemplateFileModel model)
        {
            var result = new ResponseBase();
            result.IsSuccess = false;
            try
            {
                using (db = new SanXuatCheckListEntities(strConnection))
                {
                    if (!CheckExists(model.Id, model.Name))
                    {
                        result.IsSuccess = true;
                    }
                    else
                    {
                        result.IsSuccess = false;
                        result.Errors.Add(new Error() { MemberName = "Create", Message = "Tên này đã tồn tại, vui lòng chọn tên khác" });
                    }
                    if (result.IsSuccess)
                    {
                        var now = DateTime.Now;
                        TemplateFile templatefile;
                        TemplateControl controlBox;
                        if (model.Id == 0)
                        {
                            #region insert
                            templatefile = new TemplateFile();
                            Parse.CopyObject(model, ref templatefile);
                            templatefile.CreatedDate = now;
                            templatefile.CreatedUser = model.ActionUser;
                            templatefile.ApprovedDate = null;
                            templatefile.ApprovedUser = null;
                            if (model.IsApprove)
                            {
                                templatefile.ApprovedDate = now;
                                templatefile.ApprovedUser = model.ActionUser;
                            }

                            if (model.Controls != null && model.Controls.Count > 0)
                            {
                                templatefile.TemplateControls = new Collection<TemplateControl>();
                                foreach (var item in model.Controls)
                                {
                                    controlBox = new TemplateControl();
                                    Parse.CopyObject(item, ref controlBox);
                                    controlBox.TemplateFile = templatefile;
                                    controlBox.IsDeleted = false;
                                    templatefile.TemplateControls.Add(controlBox);
                                }
                            }
                            db.TemplateFiles.Add(templatefile);
                            result.IsSuccess = true;
                            #endregion
                        }
                        else
                        {
                            #region update

                            templatefile = db.TemplateFiles.FirstOrDefault(x => !x.IsDeleted && x.Id == model.Id);
                            if (templatefile != null)
                            {
                                if (templatefile.IsApprove)
                                {
                                    result.IsSuccess = false;
                                    result.Errors.Add(new Error() { MemberName = "Create", Message = "Mẫu biểu mẫu này đã được duyệt Bạn sẽ không thể thay đổi thông tin được nữa." });
                                }
                                else
                                {
                                    //templatefile.Code = model.Code;
                                    templatefile.Name = model.Name;
                                    //templatefile.Index = model.Index;
                                    templatefile.Note = model.Note;
                                    templatefile.Content = model.Content;
                                    templatefile.IsApprove = model.IsApprove;
                                    templatefile.ApprovedDate = null;
                                    templatefile.ApprovedUser = null;
                                    if (model.IsApprove)
                                    {
                                        templatefile.ApprovedDate = now;
                                        templatefile.ApprovedUser = model.ActionUser;
                                    }
                                    templatefile.UpdatedDate = now;
                                    templatefile.UpdatedUser = model.ActionUser;
                                    //db.TemplateFiles.Update(templatefile);

                                    var oldControls = db.TemplateControls.Where(x => !x.IsDeleted && x.TemplateId == templatefile.Id);
                                    if (oldControls != null && oldControls.Count() > 0)
                                    {
                                        if (model.Controls == null || model.Controls.Count == 0)
                                        {
                                            #region xoa het neu list control moi ko co cai nao
                                            foreach (var item in oldControls)
                                            {
                                                item.IsDeleted = true;
                                                //db.TemplateControl.Update(item);
                                            }
                                            #endregion
                                        }
                                        else
                                        {
                                            foreach (var item in model.Controls)
                                            {
                                                var exist = oldControls.FirstOrDefault(x => x.ControlName.Trim().Equals(item.ControlName.Trim()));
                                                if (exist != null)
                                                {
                                                    #region   neu co thi update lai value
                                                    exist.Checked = item.Checked;
                                                    exist.ControlType = item.ControlType;
                                                    exist.Value = item.Value;
                                                    //db.TemplateControl.Update(exist);
                                                    #endregion
                                                }
                                                else
                                                {
                                                    #region   ko co thi tao moi
                                                    controlBox = new TemplateControl();
                                                    Parse.CopyObject(item, ref controlBox);
                                                    controlBox.TemplateId = templatefile.Id;
                                                    db.TemplateControls.Add(controlBox);
                                                    #endregion
                                                }
                                            }
                                        }
                                    }
                                    else
                                    {
                                        if (model.Controls != null)
                                        {
                                            #region  truoc do ko co control nao thi tao moi
                                            foreach (var item in model.Controls)
                                            {
                                                controlBox = new TemplateControl();
                                                Parse.CopyObject(item, ref controlBox);
                                                controlBox.TemplateId = templatefile.Id;
                                                db.TemplateControls.Add(controlBox);
                                            }
                                            #endregion
                                        }
                                    }
                                    result.IsSuccess = true;
                                }
                            }
                            else
                            {
                                result.IsSuccess = false;
                                result.Errors.Add(new Error() { MemberName = "Create", Message = "Biểu mẫu không tồn tại hoặc đã bị xóa, Vui Lòng kiểm tra lại." });
                            }
                            #endregion
                        }
                        if (result.IsSuccess)
                        {
                            db.SaveChanges();
                            result.IsSuccess = true;
                        }
                        else
                        {
                            result.IsSuccess = false;
                            result.Errors.Add(new Error() { MemberName = "Create", Message = "Lỗi khi thực hiện SQL, Vui Lòng kiểm tra lại." });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                result.IsSuccess = false;
                result.Errors.Add(new Error() { MemberName = "Create", Message = "Lỗi Exception" });
            }
            return result;
        }

        public ResponseBase Delete(string strConnection, int Id, int actionUserId)
        {
            var rs = new ResponseBase();
            try
            {
                using (db = new SanXuatCheckListEntities(strConnection))
                {
                    var templatefile = db.TemplateFiles.FirstOrDefault(x => !x.IsDeleted && x.Id == Id);
                    if (templatefile != null)
                    {
                        if (templatefile.IsApprove)
                        {
                            rs.IsSuccess = false;
                            rs.Errors.Add(new Error() { MemberName = "Create", Message = "Mẫu biểu mẫu này đã được duyệt Bạn sẽ không thể xóa." });
                        }
                        else
                        {
                            var now = DateTime.Now;
                            templatefile.IsDeleted = true;
                            templatefile.DeletedDate = now;
                            templatefile.DeletedUser = actionUserId;
                            //db.TemplateFiles.Update(templatefile);
                            db.SaveChanges();
                            rs.IsSuccess = true;
                        }
                    }
                    else
                    {
                        rs.IsSuccess = false;
                        rs.Errors.Add(new Error() { MemberName = "Delete", Message = "Khách Hàng này không tồn tại hoặc đã bị xóa, Vui Lòng kiểm tra lại." });
                    }
                }
            }
            catch (Exception)
            {
                rs.IsSuccess = false;
                rs.Errors.Add(new Error() { MemberName = "Delete", Message = "Lỗi Exception" });
            }
            return rs;
        }

        public PagedList<TemplateFileModel> GetList(string strConnection, string type, string keyWord, int startIndexRecord, int pageSize, string sorting)
        {
            try
            {
                using (db = new SanXuatCheckListEntities(strConnection))
                {
                    if (string.IsNullOrEmpty(sorting))
                        sorting = "CreatedDate DESC";

                    IQueryable<TemplateFile> Ilist = db.TemplateFiles.Where(c => !c.IsDeleted);
                    if (!string.IsNullOrEmpty(type))
                        Ilist = Ilist.Where(c => c.TemplateFileType.Code.Trim().ToUpper() == type.Trim().ToUpper());

                    if (!string.IsNullOrEmpty(keyWord))
                        Ilist = Ilist.Where(c => c.Name.Trim().ToUpper().Contains(keyWord.Trim().ToUpper()));

                    var pageNumber = (startIndexRecord / pageSize) + 1;
                    var objs = new PagedList<TemplateFileModel>(Ilist.OrderBy(sorting).Select(x => new TemplateFileModel()
                    {
                        Id = x.Id,
                        ApprovedDate = x.ApprovedDate,
                        ApprovedUser = x.ApprovedUser,
                        IsApprove = x.IsApprove,
                        //Code = x.Code,
                        Name = x.Name,
                        Index = x.Index,
                        //CreatedDate = x.CreatedDate,
                        TemplateFileTypeId = x.TemplateFileTypeId,
                        Note = x.Note
                    }).ToList(), pageNumber, pageSize);

                    if (objs.Count > 0)
                    {
                        string value = "";// BLLAppConfig.Instance.GetConfigByCode(strConnection, eConfigCode.TemplateFiles);
                        foreach (var item in objs)
                        {
                            item.Code = value + item.Index;
                        }
                    }
                    return objs;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public List<ModelSelectItem> GetSelectList(string strConnection, string type)
        {
            using (db = new SanXuatCheckListEntities(strConnection))
            {
                if (!string.IsNullOrEmpty(type))
                    return db.TemplateFiles.Where(x => !x.IsDeleted && x.IsApprove && x.TemplateFileType.Code.Trim().ToUpper() == type.Trim().ToUpper()).Select(x => new ModelSelectItem() { Value = x.Id, Name = x.Name }).ToList();
                return db.TemplateFiles.Where(x => !x.IsDeleted && x.IsApprove).Select(x => new ModelSelectItem() { Value = x.Id, Name = x.Name }).ToList();
            }
        }

        public TemplateFileModel Get(string strConnection, int Id)
        {
            using (db = new SanXuatCheckListEntities(strConnection))
            {
                var obj = db.TemplateFiles.Where(x => !x.IsDeleted && x.Id == Id).Select(x => new TemplateFileModel()
                {
                    Id = x.Id,
                    Name = x.Name,
                    //Code = x.Code,
                    Index = x.Index,
                    Content = x.Content,
                    IsApprove = x.IsApprove,
                    ApprovedDate = x.ApprovedDate,
                    ApprovedUser = x.ApprovedUser,
                    Note = x.Note
                }).FirstOrDefault();
                if (obj != null)
                {
                    obj.Code = "" + obj.Index;// BLLAppConfig.Instance.GetConfigByCode(strConnection, eConfigCode.TemplateFiles) + obj.Index;

                    obj.Controls.AddRange(db.TemplateControls.Where(x => !x.IsDeleted && x.TemplateId == obj.Id).Select(x => new ControlModel()
                    {
                        Id = x.Id,
                        ControlName = x.ControlName,
                        ControlType = x.ControlType,
                        Value = x.Value,
                        Checked = x.Checked,
                        TemplateId = x.TemplateId
                    }));
                    return obj;
                }
                return null;
            }
        }

        public int GetLastIndex(string strConnection)
        {
            using (db = new SanXuatCheckListEntities(strConnection))
            {
                var obj = db.TemplateFiles.Where(x => !x.IsDeleted).OrderByDescending(x => x.Index).FirstOrDefault();
                return obj != null ? obj.Index : 0;
            }
        }

        public TemplateFileModel Get(string strConnection, string tempTypeCode)
        {
            using (db = new SanXuatCheckListEntities(strConnection))
            {
                var obj = db.TemplateFiles.Where(x => !x.IsDeleted && x.TemplateFileType.Code.Trim().ToUpper() == tempTypeCode.Trim().ToUpper() && x.IsApprove).Select(x => new TemplateFileModel()
                {
                    Id = x.Id,
                    Name = x.Name,
                    //Code = x.Code,
                    Index = x.Index,
                    Content = x.Content,
                    IsApprove = x.IsApprove,
                    ApprovedDate = x.ApprovedDate,
                    ApprovedUser = x.ApprovedUser,
                    Note = x.Note
                }).FirstOrDefault();
                if (obj != null)
                {
                    obj.Code = "" + obj.Index;// BLLAppConfig.Instance.GetConfigByCode(strConnection, eConfigCode.TemplateFiles) + obj.Index;

                    obj.Controls.AddRange(db.TemplateControls.Where(x => !x.IsDeleted && x.TemplateId == obj.Id).Select(x => new ControlModel()
                    {
                        Id = x.Id,
                        ControlName = x.ControlName,
                        ControlType = x.ControlType,
                        Value = x.Value,
                        Checked = x.Checked,
                        TemplateId = x.TemplateId
                    }));
                    return obj;
                }
                return null;
            }
        }


    }
}
