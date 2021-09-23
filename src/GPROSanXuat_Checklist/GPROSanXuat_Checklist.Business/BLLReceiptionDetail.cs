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
using System.Collections.ObjectModel;
using System.Linq;

namespace GPROSanXuat_Checklist.Business
{
    public class BLLReceiptionDetail
    {
        #region constructor
        SanXuatCheckListEntities db;
        static object key = new object();
        private static volatile BLLReceiptionDetail _Instance;
        public static BLLReceiptionDetail Instance
        {
            get
            {
                if (_Instance == null)
                    lock (key)
                        _Instance = new BLLReceiptionDetail();

                return _Instance;
            }
        }
        private BLLReceiptionDetail() { }
        #endregion

        bool checkPermis(ReceiptionDetail obj, int actionUser, bool isOwner)
        {
            if (isOwner) return true;
            return obj.CreatedUser == actionUser;
        }

        public ResponseBase CreateOrUpdate(string strConnection, ReceiptionDetailModel model)
        {
            using (db = new SanXuatCheckListEntities(strConnection))
            {
                var rs = new ResponseBase();
                rs.IsSuccess = false;
                try
                {
                    ReceiptionDetail detailObj;
                    LotSupply lotSuplies;
                    if (model.Id == 0)
                    {
                        lotSuplies = new LotSupply();
                        Parse.CopyObject(model, ref lotSuplies);
                        lotSuplies.ReceiptionDetails = new Collection<ReceiptionDetail>();

                        detailObj = new ReceiptionDetail();
                        detailObj.ReceiptionId = model.ReceiptionId;
                        detailObj.LotSupply = lotSuplies;
                        detailObj.CreatedDate = model.CreatedDate;
                        detailObj.CreatedUser = model.CreatedUser;
                        lotSuplies.ReceiptionDetails.Add(detailObj);
                        db.LotSupplies.Add(lotSuplies);
                        db.SaveChanges();
                        rs.IsSuccess = true;
                    }
                    else // cập nhật
                    {
                        detailObj = GetById(strConnection, model.Id);
                        if (detailObj != null)
                        {
                            var isApprove = db.ReceiptionDetails.Where(x => x.Id == detailObj.Id).Select(x => x.Receiption.StatusId == (int)eStatus.Approved).FirstOrDefault();
                            if (isApprove)
                            {
                                rs.IsSuccess = false;
                                rs.Errors.Add(new Error() { MemberName = "Create", Message = "Phiếu Nhập Kho này đã được duyệt Bạn sẽ không thể thay đổi thông tin được nữa." });
                            }
                            else
                            {
                                var lotObj = db.LotSupplies.FirstOrDefault(x => !x.IsDeleted && x.Id == detailObj.LotSuppliesId);
                                if (lotObj != null)
                                {
                                    lotObj.Name = model.Name;
                                    lotObj.Index = model.Index;
                                    lotObj.MaterialId = model.MaterialId;
                                    //lotObj.WareHouseId = model.WareHouseId;
                                    lotObj.Quantity = model.Quantity;
                                    lotObj.Price = model.Price;
                                    //lotObj.InputDate = model.InputDate;
                                    lotObj.ManufactureDate = model.ManufactureDate;
                                    lotObj.ExpiryDate = model.ExpiryDate;
                                    lotObj.WarrantyDate = model.WarrantyDate;
                                    //lotObj.StatusId = model.StatusId;
                                    lotObj.Note = model.Note;
                                    lotObj.UpdatedDate = model.UpdatedDate;
                                    lotObj.UpdatedUser = model.UpdatedUser;

                                    rs.IsSuccess = true;
                                }
                            }
                        }
                        else
                        {
                            rs.IsSuccess = false;
                            rs.Errors.Add(new Error() { MemberName = "Create", Message = "Phiếu Nhập Kho Chi Tiết này không tồn tại hoặc đã bị xóa, Vui Lòng kiểm tra lại." });
                        }
                    }
                    if (rs.IsSuccess)
                    {
                        db.SaveChanges();
                        rs.IsSuccess = true;
                    }
                    else
                    {
                        rs.IsSuccess = false;
                        rs.Errors.Add(new Error() { MemberName = "Create", Message = "Lỗi khi thực hiện SQL, Vui Lòng kiểm tra lại." });
                    }
                }
                catch (Exception ex)
                {
                    rs.IsSuccess = false;
                    rs.Errors.Add(new Error() { MemberName = "Create", Message = "Lỗi Exception" });
                }
                return rs;
            }
        }

        public ResponseBase Delete(string strConnection, int Id, int actionUserId)
        {
            using (db = new SanXuatCheckListEntities(strConnection))
            {
                var rs = new ResponseBase();
                try
                {
                    var obj = GetById(strConnection, Id);
                    if (obj != null)
                    {
                        var isApproved = db.ReceiptionDetails.Where(x => x.Id == obj.Id).Select(x => x.Receiption.StatusId == (int)eStatus.Approved).FirstOrDefault();
                        if (isApproved)
                        {
                            rs.IsSuccess = false;
                            rs.Errors.Add(new Error() { MemberName = "Delete", Message = "Phiếu Nhập Kho này đã được duyệt. Bạn không thể xóa nó" });
                        }
                        else
                        {
                            obj.IsDeleted = true;
                            obj.DeletedDate = DateTime.Now;
                            obj.DeletedUser = actionUserId;
                            if (obj.LotSupply != null)
                            {
                                obj.LotSupply.IsDeleted = true;
                                obj.LotSupply.DeletedDate = obj.DeletedDate;
                                obj.LotSupply.DeletedUser = actionUserId;
                            }
                            db.SaveChanges();
                            rs.IsSuccess = true;
                        }
                    }
                    else
                    {
                        rs.IsSuccess = false;
                        rs.Errors.Add(new Error() { MemberName = "Delete", Message = "Phiếu Nhập Kho Chi Tiết này không tồn tại hoặc đã bị xóa, Vui Lòng kiểm tra lại." });
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

        public PagedList<ReceiptionDetailModel> GetList(string strConnection, int recordId, int startIndexRecord, int pageSize, string sorting)
        {
            using (db = new SanXuatCheckListEntities(strConnection))
            {
                try
                {
                    if (string.IsNullOrEmpty(sorting))
                        sorting = "CreatedDate DESC";
                    var objs = db.ReceiptionDetails.Where(c => !c.IsDeleted && c.ReceiptionId == recordId);
                    var pageNumber = (startIndexRecord / pageSize) + 1;

                    var pagedList = new PagedList<ReceiptionDetailModel>(objs
                        .Select(x => new ReceiptionDetailModel()
                        {
                            Id = x.Id,
                            ReceiptionId = x.ReceiptionId,
                            LotSuppliesId = x.LotSuppliesId,

                            Name = x.LotSupply.Name,
                            Index = x.LotSupply.Index,

                            MaterialId = x.LotSupply.MaterialId,
                            //MaterialName = x.LotSupply.Material.NameTM,
                            //MaterialIndex = x.LotSupply.Material.Index,

                            CustomerId = x.Receiption.FromCustomerId.Value,
                            //CustomerName = x.Receiption.Customer.Name,
                            //CustomerIndex = x.Receiption.Customer.Index,

                            WareHouseId = x.Receiption.StoreWarehouseId,
                            //WarehouseName = x.Receiption.WareHouse.Name,
                            //WarehouseIndex = x.Receiption.WareHouse.Index,

                            Quantity = x.LotSupply.Quantity,
                            QuantityUsed = x.LotSupply.QuantityUsed,
                            //UnitId = x.LotSupply.Material.UnitId,
                            //UnitName = x.LotSupply.Material.Unit.Name,

                            Price = x.LotSupply.Price,
                            ExchangeRate = x.Receiption.ExchangeRate,
                            MoneyTypeId = x.Receiption.MoneyTypeId,
                            //MoneyTypeName = x.Receiption.Unit.Name,

                            //InputDate = x.Receiption.InputDate,
                            ManufactureDate = x.LotSupply.ManufactureDate,
                            ExpiryDate = x.LotSupply.ExpiryDate,
                            WarrantyDate = x.LotSupply.WarrantyDate,

                            StatusId = x.Receiption.StatusId,
                            Note = x.LotSupply.Note,
                            CreatedDate = x.CreatedDate
                        }).OrderBy(sorting).ToList(), pageNumber, pageSize);
                    if (pagedList.Count > 0)
                    {
                        string whvalue = "";// BLLAppConfig.Instance.GetConfigByCode (strConnection, eConfigCode.WareHouse);
                        string cusvalue = "";//BLLAppConfig.Instance.GetConfigByCode(strConnection, eConfigCode.Customer);
                        string mvalue = "";//BLLAppConfig.Instance.GetConfigByCode(strConnection, eConfigCode.Material);
                        string lotvalue = "";//BLLAppConfig.Instance.GetConfigByCode(strConnection, eConfigCode.LotSupplies);

                        foreach (var item in pagedList)
                        {
                            item.Code = lotvalue + item.Index;
                            item.MaterialName = "<span >" + item.MaterialName + "</span> (<span class=\"red\">" + mvalue + item.MaterialIndex + "</span>)";
                            item.CustomerName = "<span >" + item.CustomerName + "</span> (<span class=\"red\">" + cusvalue + item.CustomerIndex + "</span>)";
                            item.WarehouseName = "<span >" + item.WarehouseName + "</span> (<span class=\"red\">" + whvalue + item.WarehouseIndex + "</span>)";
                        }
                    }
                    return pagedList;
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        private bool CheckExists(int Id, int rId)
        {
            ReceiptionDetail obj;
            obj = db.ReceiptionDetails.FirstOrDefault(x => !x.IsDeleted && x.Id != Id && x.ReceiptionId == rId);
            return obj != null ? true : false;
        }

        public ReceiptionDetail GetById(string strConnection, int Id)
        {
            if (db != null)
                return db.ReceiptionDetails.FirstOrDefault(x => !x.IsDeleted && x.Id == Id);
            else
                using (db = new SanXuatCheckListEntities(strConnection))
                    return db.ReceiptionDetails.FirstOrDefault(x => !x.IsDeleted && x.Id == Id);
        }

        public List<ReceiptionDetailModel> GetReceiptionDetails(string strConnection, int receiptionId)
        {
            using (db = new SanXuatCheckListEntities(strConnection))
            {
                try
                {
                    var listObjs = db.ReceiptionDetails.Where(x => !x.IsDeleted && !x.Receiption.IsDeleted && x.ReceiptionId == receiptionId).Select(x => new ReceiptionDetailModel()
                    {
                        Id = x.Id,
                        ReceiptionId = x.ReceiptionId,
                        ReceiptionName = x.Receiption.Name,
                        ReceiptionIndex = x.Receiption.Index,

                        LotSuppliesId = x.LotSuppliesId,

                        Name = x.LotSupply.Name,
                        Index = x.LotSupply.Index,
                        MaterialId = x.LotSupply.MaterialId,
                        //MaterialName = x.LotSupply.Material.NameTM,
                        //MaterialIndex = x.LotSupply.Material.Index,

                        CustomerId = x.Receiption.FromCustomerId.Value,
                        //CustomerName = x.Receiption.Customer.Name,
                        //CustomerIndex = x.Receiption.Customer.Index,

                        WareHouseId = x.Receiption.StoreWarehouseId,
                        //WarehouseName = x.Receiption.WareHouse1.Name,
                        //WarehouseIndex = x.Receiption.WareHouse1.Index,

                        Quantity = x.LotSupply.Quantity,
                        QuantityUsed = x.LotSupply.QuantityUsed,
                        Price = x.LotSupply.Price,
                        InputDate = x.Receiption.InputDate,
                        ManufactureDate = x.LotSupply.ManufactureDate,
                        ExpiryDate = x.LotSupply.ExpiryDate,
                        WarrantyDate = x.LotSupply.WarrantyDate,
                        MoneyTypeId = x.Receiption.MoneyTypeId,
                        //MoneyTypeName = x.Receiption.Unit.Name,
                        ExchangeRate = x.Receiption.ExchangeRate,
                        //UnitId = x.LotSupply.Material.UnitId,
                        StatusId = x.Receiption.StatusId,
                        Receiver = x.Receiption.RecieverId,
                        ApprovedUser = x.Receiption.ApprovedUser,
                        ApprovedDate = x.Receiption.ApprovedDate,
                        Note = x.LotSupply.Note,
                        CreatedDate = x.CreatedDate,
                        Total = x.LotSupply.Quantity * x.LotSupply.Price,
                        UnitInStock = x.LotSupply.Quantity - x.LotSupply.QuantityUsed
                    }).ToList();

                    if (listObjs.Count > 0)
                    {
                        string whvalue = "";// BLLAppConfig.Instance.GetConfigByCode(strConnection, eConfigCode.WareHouse);
                        string cusvalue = "";//  BLLAppConfig.Instance.GetConfigByCode(strConnection, eConfigCode.Customer);
                        string mvalue = "";// BLLAppConfig.Instance.GetConfigByCode(strConnection, eConfigCode.Material);
                        string lotvalue = "";// BLLAppConfig.Instance.GetConfigByCode(strConnection, eConfigCode.LotSupplies);
                        string rvalue = "";//  BLLAppConfig.Instance.GetConfigByCode(strConnection, eConfigCode.Receiption);

                        foreach (var item in listObjs)
                        {
                            item.ReceiptionCode = rvalue + item.ReceiptionIndex;
                            item.Code = lotvalue + item.Index;
                            item.Name = item.Name + "(" + item.Code + ")";
                            //  item.MaterialCode = mvalue + item.MaterialIndex;
                            // item.WarehouseName = item.WarehouseName + "(" + whvalue + item.WarehouseIndex + ")";
                        }
                    }

                    return listObjs;
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public List<ModelSelectItem> GetQuantity(string strConnection, List<int> materialIds)
        {
            var list = new List<ModelSelectItem>();
            using (db = new SanXuatCheckListEntities(strConnection))
            {
                list.AddRange(db.ReceiptionDetails
                    .Where(x => !x.IsDeleted && materialIds.Contains(x.LotSupply.MaterialId) && x.LotSupply.Quantity > x.LotSupply.QuantityUsed)
                    .Select(x => new ModelSelectItem() {
                        Id = x.LotSupply.MaterialId,
                        Double = (x.LotSupply.Quantity - x.LotSupply.QuantityUsed) 
                    })
                    .ToList());
            }
            return list;
        }
    }
}
