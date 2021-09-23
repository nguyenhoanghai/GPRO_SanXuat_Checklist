using GPRO.Core.Mvc;
using PagedList;
using GPROSanXuat_Checklist.Business.Model;
using GPROSanXuat_Checklist.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using Hugate.Framework;
using GPROCommon.Models;

namespace GPROSanXuat_Checklist.Business
{
    public class BLLAppConfig
    {

        SanXuatCheckListEntities db;
        static object key = new object();
        private static volatile BLLAppConfig _Instance;
        public static BLLAppConfig Instance
        {
            get
            {
                if (_Instance == null)
                    lock (key)
                        _Instance = new BLLAppConfig();

                return _Instance;
            }
        }
        private BLLAppConfig() { }
         

        public ResponseBase Update(string strConnection, AppConfigModel model)
        {
            var result = new ResponseBase();
            result.IsSuccess = false;
            try
            {
                using (db = new SanXuatCheckListEntities(strConnection))
                {
                    P_Config Config;
                    Config = db.P_Config.FirstOrDefault(x => x.Id == model.Id);
                    if (Config != null)
                    {
                        Config.Note = model.Note;
                        Config.Value = model.Value;
                        result.IsSuccess = true;
                    }
                    else
                    {
                        result.IsSuccess = false;
                        result.Errors.Add(new Error() { MemberName = "Update", Message = "Cấu hình này không tồn tại hoặc đã bị xóa, Vui Lòng kiểm tra lại." });
                    }

                    if (result.IsSuccess)
                    {
                        db.SaveChanges();
                        result.IsSuccess = true;
                    }
                    else
                    {
                        result.IsSuccess = false;
                        result.Errors.Add(new Error() { MemberName = "Update", Message = "Lỗi khi thực hiện SQL, Vui Lòng kiểm tra lại." });
                    }
                }
            }
            catch (Exception ex)
            {
                result.IsSuccess = false;
                result.Errors.Add(new Error() { MemberName = "Update", Message = "Lỗi Exception" });
            }
            return result;
        }
        public PagedList<AppConfigModel> GetList(string strConnection, string keyWord, int startIndexRecord, int pageSize, string sorting)
        {
            try
            {
                using (db = new SanXuatCheckListEntities(strConnection))
                {
                    if (string.IsNullOrEmpty(sorting))
                        sorting = "Id DESC";

                    IQueryable<P_Config> Ilist = null;
                    if (!string.IsNullOrEmpty(keyWord))
                    {
                        keyWord = keyWord.Trim().ToUpper();
                        Ilist = db.P_Config.Where(c => c.Name.Trim().ToUpper().Contains(keyWord) || c.Code.Trim().ToUpper().Contains(keyWord)).OrderBy(sorting);
                    }
                    else
                        Ilist = db.P_Config.OrderBy(sorting);
                    var pageNumber = (startIndexRecord / pageSize) + 1;
                    return new PagedList<AppConfigModel>(Ilist.Select(x => new AppConfigModel()
                    {
                        Id = x.Id,
                        Code = x.Code,
                        Name = x.Name,
                        Value = x.Value,
                        Note = x.Note
                    }).ToList(), pageNumber, pageSize);
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public List<ModelSelectItem> GetSelectList(string strConnection)
        {
            using (db = new SanXuatCheckListEntities(  strConnection ))
            {
                return db.P_Config.Select(x => new ModelSelectItem() { Value = x.Id, Name = x.Name, Code = x.Code }).ToList();
            }
        }

        public List<ModelSelectItem> GetSelectList(string strConnection, string code)
        {
            using (db = new SanXuatCheckListEntities(strConnection))
            {
                return db.P_Config.Where(x => x.Code.Trim().ToUpper().Equals(code.Trim().ToUpper())).Select(x => new ModelSelectItem() { Value = x.Id, Name = x.Name, Code = x.Code }).ToList();
            }
        }

        public P_Config GetById(string strConnection, int Id)
        {
            using (db = new SanXuatCheckListEntities(strConnection))
            {
                return db.P_Config.FirstOrDefault(x => x.Id == Id);
            }
        }

        public string GetConfigByCode(string strConnection, string code)
        {
            using (db = new SanXuatCheckListEntities(strConnection))
            {
                var obj = db.P_Config.FirstOrDefault(x => x.Code.Trim().ToUpper().Equals(code.Trim().ToUpper()));
                if (obj != null)
                    return obj.Value;
                return "";
            }
        }
    }
} 
