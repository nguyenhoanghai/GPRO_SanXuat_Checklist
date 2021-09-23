using GPRO.Core.Mvc;
using GPRO.Ultilities;
using GPROCommon.Business.Enum;
using GPROCommon.Models;
using GPROSanXuat_Checklist.Business.Model;
using GPROSanXuat_Checklist.Data;
using Hugate.Framework;
using PagedList;
using System;
using System.Collections.Generic;
using System.Linq;

namespace GPROSanXuat_Checklist.Business
{
    public class BLLReceiption
    {
        #region constructor
        SanXuatCheckListEntities db;
        static object key = new object();
        private static volatile BLLReceiption _Instance;
        public static BLLReceiption Instance
        {
            get
            {
                if (_Instance == null)
                    lock (key)
                        _Instance = new BLLReceiption();

                return _Instance;
            }
        }
        private BLLReceiption() { }
        #endregion

        bool checkPermis(Receiption obj, int actionUser, bool isOwner)
        {
            if (isOwner) return true;
            return obj.CreatedUser == actionUser;
        }

        private bool CheckExists(int Id, string value, int index, bool isCheckName)
        {
            Receiption obj;
            if (!isCheckName)
                obj = db.Receiptions.FirstOrDefault(x => !x.IsDeleted && x.Id != Id && x.Index == index);
            else
                obj = db.Receiptions.FirstOrDefault(x => !x.IsDeleted && x.Id != Id && x.Name.Trim().Equals(value));
            return obj != null ? true : false;
        }

        public Receiption GetById(string strConnection, int Id)
        {
            if (db != null)
                return db.Receiptions.FirstOrDefault(x => !x.IsDeleted && x.Id == Id);
            else
                using (db = new SanXuatCheckListEntities(strConnection))
                    return db.Receiptions.FirstOrDefault(x => !x.IsDeleted && x.Id == Id);
        }

        public ResponseBase CreateOrUpdate(string strConnection, Receiption model, bool isOwner)
        {
            using (db = new SanXuatCheckListEntities(strConnection))
            {
                var result = new ResponseBase();
                result.IsSuccess = false;
                try
                {
                    if (!CheckExists(model.Id, model.Name, model.Index, true))
                    {
                        if (!CheckExists(model.Id, model.Name, model.Index, false)) // nếu ko bị trùng index
                            result.IsSuccess = true;
                        else
                        {
                            result.IsSuccess = false;
                            result.Errors.Add(new Error() { MemberName = "Create", Message = "Số thứ tự này đã bị trùng, Xin chọn số thứ tự khác" });
                        }
                        if (result.IsSuccess)
                        {
                            Receiption obj;
                            if (model.Id == 0)  // tao moi
                            {
                                obj = new Receiption();
                                Parse.CopyObject(model, ref obj);
                                db.Receiptions.Add(obj);
                                result.IsSuccess = true;
                            }
                            else // cập nhật
                            {
                                obj = GetById(strConnection, model.Id);
                                if (obj != null)
                                {
                                    if (!checkPermis(obj, model.UpdatedUser.Value, isOwner))
                                    {
                                        result.IsSuccess = false;
                                        result.Errors.Add(new Error() { MemberName = "update", Message = "Bạn không phải là người tạo phiếu nhập kho này nên bạn không cập nhật được thông tin cho phiếu nhập kho này." });
                                    }
                                    else
                                    {
                                        obj.Name = model.Name;
                                        obj.Index = model.Index;
                                        obj.FromWarehouseId = model.FromWarehouseId;
                                        obj.StoreWarehouseId = model.StoreWarehouseId;
                                        obj.FromCustomerId = model.FromCustomerId;
                                        obj.RecieverId = model.RecieverId;
                                        obj.MoneyTypeId = model.MoneyTypeId;
                                        obj.ExchangeRate = model.ExchangeRate;
                                        obj.TransactionType = model.TransactionType;
                                        obj.DateOfAccounting = model.DateOfAccounting;
                                        obj.InputDate = model.InputDate;
                                        obj.StatusId = model.StatusId;
                                        if (model.StatusId == (int)eStatus.Approved)
                                        {
                                            obj.ApprovedUser = model.UpdatedUser;
                                            obj.ApprovedDate = model.UpdatedDate;
                                        }
                                        else
                                        {
                                            obj.ApprovedUser = null;
                                            obj.ApprovedDate = null;
                                        }
                                        obj.Note = model.Note;
                                        obj.UpdatedDate = model.UpdatedDate;
                                        obj.UpdatedUser = model.UpdatedUser;
                                        result.IsSuccess = true;
                                    }
                                }
                                else
                                {
                                    result.IsSuccess = false;
                                    result.Errors.Add(new Error() { MemberName = "Create", Message = "Phiếu Nhập Kho không tồn tại hoặc đã bị xóa, Vui Lòng kiểm tra lại." });
                                }
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
                    else
                    {
                        result.IsSuccess = false;
                        result.Errors.Add(new Error() { MemberName = "Create", Message = "Tên Phiếu Đã Tồn Tại, Vui Lòng Chọn Tên Khác" });
                    }
                }
                catch (Exception ex)
                {
                    result.IsSuccess = false;
                    result.Errors.Add(new Error() { MemberName = "Create", Message = "Lỗi Exception" });
                }
                return result;
            }
        }

        public ResponseBase Delete(string strConnection, int Id, int actionUserId, bool isOwner)
        {
            using (db = new SanXuatCheckListEntities(strConnection))
            {
                var rs = new ResponseBase();
                try
                {
                    var obj = GetById(strConnection, Id);
                    if (obj != null)
                    {
                        if (!checkPermis(obj, actionUserId, isOwner))
                        {
                            rs.IsSuccess = false;
                            rs.Errors.Add(new Error() { MemberName = "update", Message = "Bạn không phải là người tạo phiếu nhập kho này nên bạn không cập nhật được thông tin cho phiếu nhập kho này." });
                        }
                        else
                        {
                            var now = DateTime.Now;
                            obj.IsDeleted = true;
                            obj.DeletedDate = now;
                            obj.DeletedUser = actionUserId;
                            db.SaveChanges();
                            rs.IsSuccess = true;
                        }
                    }
                    else
                    {
                        rs.IsSuccess = false;
                        rs.Errors.Add(new Error() { MemberName = "Delete", Message = "Phiếu Nhập Kho này không tồn tại hoặc đã bị xóa, Vui Lòng kiểm tra lại." });
                    }
                }
                catch (Exception)
                {
                    rs.IsSuccess = false;
                    rs.Errors.Add(new Error() { MemberName = "Delete", Message = "Lỗi Exception" });
                }
                return rs;
            }
        }

        public PagedList<ReceiptionModel> GetList(string strConnection, string keyWord, int startIndexRecord, int pageSize, string sorting)
        {
            using (db = new SanXuatCheckListEntities(strConnection))
            {
                try
                {
                    if (string.IsNullOrEmpty(sorting))
                        sorting = "CreatedDate DESC";

                    IQueryable<Receiption> objs = db.Receiptions.Where(c => !c.IsDeleted);

                    if (!string.IsNullOrEmpty(keyWord))
                    {
                        keyWord = keyWord.Trim().ToUpper();
                        objs = db.Receiptions.Where(c => !c.IsDeleted && (c.Name.Trim().ToUpper().Contains(keyWord)));
                    }

                    var pageNumber = (startIndexRecord / pageSize) + 1;
                    var pagelist = new PagedList<ReceiptionModel>(objs.OrderBy(sorting).Select(x => new ReceiptionModel()
                    {
                        Id = x.Id,
                        Name = x.Name,
                        Index = x.Index,
                        FromWarehouseId = x.FromWarehouseId,
                        //FromWareHouseName = x.WareHouse.Name,
                        StoreWarehouseId = x.StoreWarehouseId,
                        //StoreWareHouseName = x.WareHouse1.Name,
                        FromCustomerId = x.FromCustomerId,
                        //CustomerName = x.Customer.Name,
                        RecieverId = x.RecieverId,
                        MoneyTypeId = x.MoneyTypeId,
                        //MoneyTypeName = x.Unit.Name,
                        ExchangeRate = x.ExchangeRate,
                        TransactionType = x.TransactionType,
                        DateOfAccounting = x.DateOfAccounting,
                        StatusId = x.StatusId,
                        //StatusName = x.Status.Name,
                        InputDate = x.InputDate,
                        ApprovedUser = x.ApprovedUser,
                        ApprovedDate = x.ApprovedDate,
                        Note = x.Note,
                    }), pageNumber, pageSize);
                    if (pagelist.Count > 0)
                    {
                        var ids = pagelist.Select(x => x.Id);
                        var details = db.ReceiptionDetails.Where(x => !x.IsDeleted && ids.Contains(x.ReceiptionId)).Select(x => new ReceiptionDetailModel()
                        {
                            ReceiptionId = x.ReceiptionId,
                            Quantity = x.LotSupply.Quantity,
                            Price = x.LotSupply.Price
                        });

                        string rvalue = "";// BLLAppConfig.Instance.GetConfigByCode(strConnection, eConfigCode.Receiption);
                        //var employees = BLLEmployee.Instance.GetSelectItem(strConnection);
                        //ModelSelectItem found;
                        foreach (var item in pagelist)
                        {
                            item.Code = rvalue + item.Index;
                            //found = employees.FirstOrDefault(x => x.Value == item.RecieverId);
                            //if (found != null)
                            //    item.RecieverName = found.Name;

                            //if (item.StatusId == (int)eStatus.Approved && item.ApprovedUser.HasValue)
                            //{
                            //    found = employees.FirstOrDefault(x => x.Value == item.ApprovedUser.Value);
                            //    if (found != null)
                            //        item.ApprovedUserName = found.Name;
                            //}

                            var dts = details.Where(x => x.ReceiptionId == item.Id);
                            item.Total = (dts != null && dts.Count() > 0 ? Math.Round(dts.Sum(x => x.Price * x.Quantity), 2) : 0);
                        }
                    }
                    return pagelist;
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public PagedList<ReceiptionModel> GetList(string strConnection, int custId, int startIndexRecord, int pageSize, string sorting)
        {
            using (db = new SanXuatCheckListEntities(strConnection))
            {
                try
                {
                    if (string.IsNullOrEmpty(sorting))
                        sorting = "CreatedDate DESC";

                    IQueryable<Receiption> objs = db.Receiptions.Where(c => !c.IsDeleted);
                    if (custId != 0)
                        objs = objs.Where(c => c.FromCustomerId.HasValue && c.FromCustomerId == custId);


                    var pageNumber = (startIndexRecord / pageSize) + 1;
                    var pagelist = new PagedList<ReceiptionModel>(objs.OrderBy(sorting).Select(x => new ReceiptionModel()
                    {
                        Id = x.Id,
                        Name = x.Name,
                        Index = x.Index,
                        FromWarehouseId = x.FromWarehouseId,
                        //FromWareHouseName = x.WareHouse.Name,
                        StoreWarehouseId = x.StoreWarehouseId,
                        //StoreWareHouseName = x.WareHouse1.Name,
                        FromCustomerId = x.FromCustomerId,
                        //CustomerName = x.Customer.Name,
                        RecieverId = x.RecieverId,
                        MoneyTypeId = x.MoneyTypeId,
                        //MoneyTypeName = x.Unit.Name,
                        ExchangeRate = x.ExchangeRate,
                        TransactionType = x.TransactionType,
                        DateOfAccounting = x.DateOfAccounting,
                        StatusId = x.StatusId,
                        //StatusName = x.Status.Name,
                        InputDate = x.InputDate,
                        ApprovedUser = x.ApprovedUser,
                        ApprovedDate = x.ApprovedDate,
                        Note = x.Note,
                    }), pageNumber, pageSize);
                    if (pagelist.Count > 0)
                    {
                        var ids = pagelist.Select(x => x.Id);
                        var details = db.ReceiptionDetails.Where(x => !x.IsDeleted && ids.Contains(x.ReceiptionId)).Select(x => new ReceiptionDetailModel() { ReceiptionId = x.ReceiptionId, Quantity = x.LotSupply.Quantity, Price = x.LotSupply.Price });

                        string rvalue = "";// BLLAppConfig.Instance.GetConfigByCode(strConnection, eConfigCode.Receiption);
                        //var employees = BLLEmployee.Instance.GetSelectItem(strConnection);
                        //ModelSelectItem found;
                        foreach (var item in pagelist)
                        {
                            item.Code = rvalue + item.Index;
                            //found = employees.FirstOrDefault(x => x.Value == item.RecieverId);
                            //if (found != null)
                            //    item.RecieverName = found.Name;

                            //if (item.StatusId == (int)eStatus.Approved && item.ApprovedUser.HasValue)
                            //{
                            //    found = employees.FirstOrDefault(x => x.Value == item.ApprovedUser.Value);
                            //    if (found != null)
                            //        item.ApprovedUserName = found.Name;
                            //}

                            var dts = details.Where(x => x.ReceiptionId == item.Id);
                            item.Total = (dts != null && dts.Count() > 0 ? Math.Round(dts.Sum(x => x.Price * x.Quantity), 2) : 0);
                        }
                    }
                    return pagelist;
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }


        public List<ModelSelectItem> GetSelectList(string strConnection)
        {
            using (db = new SanXuatCheckListEntities(strConnection))
            {
                return db.Receiptions.Where(x => !x.IsDeleted).Select(x => new ModelSelectItem() { Value = x.Id, Name = x.Name }).ToList();
            }
        }

        public int GetLastIndex(string strConnection)
        {
            using (db = new SanXuatCheckListEntities(strConnection))
            {
                var obj = db.Receiptions.Where(x => !x.IsDeleted).OrderByDescending(x => x.Index).FirstOrDefault();
                return obj != null ? obj.Index : 0;
            }

        }

    }
}
