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
    public class BLLLotSupplies
    {
        #region constructor
        SanXuatCheckListEntities db;
        static object key = new object();
        private static volatile BLLLotSupplies _Instance;
        public static BLLLotSupplies Instance
        {
            get
            {
                if (_Instance == null)
                    lock (key)
                        _Instance = new BLLLotSupplies();

                return _Instance;
            }
        }
        private BLLLotSupplies() { }
        #endregion

        public ResponseBase CreateOrUpdate(string strConnection, LotSuppliesModel model)
        {
            using (db = new SanXuatCheckListEntities(strConnection))
            {
                var result = new ResponseBase();
                result.IsSuccess = false;
                try
                {
                    if (!CheckExists(model.Id, model.Name, model.Index, true)) // nếu ko bị trùng tên                
                    {
                        //switch (model.strStatus)
                        //{
                        //    case "Draft": model.StatusId = (int)eStatus.Draft; break;
                        //    case "Submited": model.StatusId = (int)eStatus.Submited; break;
                        //    case "Approved": model.StatusId = (int)eStatus.Approved; break;
                        //}
                        LotSupply obj;
                        if (model.Id == 0)  // tạo một khách hàng mới
                        {
                            obj = new LotSupply();
                            Parse.CopyObject(model, ref obj);

                            db.LotSupplies.Add(obj);
                            result.IsSuccess = true;
                        }
                        else // cập nhật
                        {
                            obj = GetById(strConnection, model.Id);
                            if (obj != null)
                            {
                                var receipt = db.ReceiptionDetails.FirstOrDefault(x => !x.IsDeleted && x.Receiption.StatusId == (int)eStatus.Approved && x.LotSuppliesId == model.Id);
                                if (receipt != null)
                                {
                                    result.IsSuccess = false;
                                    result.Errors.Add(new Error() { MemberName = "Create", Message = "Lô vật tư này đã được duyệt bạn không được thay đổi thông tin." });
                                }
                                else if (model.Quantity < obj.QuantityUsed)
                                {
                                    result.IsSuccess = false;
                                    result.Errors.Add(new Error() { MemberName = "Create", Message = "Số lượng nhập không được nhỏ hơn số lượng tồn kho. Vui Lòng kiểm tra lại." });
                                }
                                else
                                {
                                    obj.Name = model.Name;
                                    obj.Index = model.Index;
                                    obj.MaterialId = model.MaterialId;
                                    // obj.WareHouseId = model.WareHouseId;
                                    obj.Quantity = model.Quantity;
                                    //obj.MaterialUnitId = model.MaterialUnitId;
                                    obj.Price = model.Price;
                                    //obj.MoneyTypeId = model.MoneyTypeId;
                                    //obj.ExchangeRate = model.ExchangeRate;
                                    //obj.InputDate = model.InputDate;
                                    obj.ManufactureDate = model.ManufactureDate;
                                    obj.ExpiryDate = model.ExpiryDate;
                                    obj.WarrantyDate = model.WarrantyDate;
                                    obj.Note = model.Note;
                                    obj.SpecificationsPaking = model.SpecificationsPaking;
                                    //obj.StatusId = model.StatusId;

                                    obj.UpdatedDate = model.UpdatedDate;
                                    obj.UpdatedUser = model.UpdatedUser;
                                    result.IsSuccess = true;
                                }
                            }
                            else
                            {
                                result.IsSuccess = false;
                                result.Errors.Add(new Error() { MemberName = "Create", Message = "Lô vật tư không tồn tại hoặc đã bị xóa, Vui Lòng kiểm tra lại." });
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
                    else
                    {
                        result.IsSuccess = false;
                        result.Errors.Add(new Error() { MemberName = "Create", Message = "Tên lô vật tư đã tồn tại, Xin chọn tên khác" });
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

        private bool CheckExists(int Id, string value, int index, bool isCheckName)
        {
            LotSupply obj;
            if (!isCheckName)
                obj = db.LotSupplies.FirstOrDefault(x => !x.IsDeleted && x.Id != Id && x.Index == index); // kiem tra index có trùng với 1 kh đã tồn tại ?
            else
                obj = db.LotSupplies.FirstOrDefault(x => !x.IsDeleted && x.Id != Id && x.Name.Trim().Equals(value)); //kiem tra name có giống với 1 kh đã tồn tại ?
            return obj != null ? true : false;
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
                        var now = DateTime.Now;
                        obj.IsDeleted = true;
                        obj.DeletedDate = now;
                        obj.DeletedUser = actionUserId;
                        db.SaveChanges();
                        rs.IsSuccess = true;
                    }
                    else
                    {
                        rs.IsSuccess = false;
                        rs.Errors.Add(new Error() { MemberName = "Create", Message = "Vật tư này không Tồn Tại hoặc đã bị xóa, Vui Lòng kiểm tra lại." });
                    }
                }
                catch (Exception)
                {
                    rs.IsSuccess = false;
                    rs.Errors.Add(new Error() { MemberName = "Create", Message = "Lỗi Exception" });
                }
                return rs;
            }
        }

        public List<ModelSelectItem> GetSelectList(string strConnection)
        {
            using (db = new SanXuatCheckListEntities(strConnection))
            {
                var cf = "";
                // cf = BLLAppConfig.Instance.GetConfigByCode(strConnection,eConfigCode.LotSupplies);
                return db.LotSupplies.Where(x => !x.IsDeleted).Select(x => new ModelSelectItem() { Value = x.Id, Name = x.Name, Code = cf, Data = x.Index }).ToList();
            }
        }

        public LotSupply GetById(string strConnection, int Id)
        {
            if (db != null)
                return db.LotSupplies.FirstOrDefault(x => !x.IsDeleted && x.Id == Id);
            else
                using (db = new SanXuatCheckListEntities(strConnection))
                    return db.LotSupplies.FirstOrDefault(x => !x.IsDeleted && x.Id == Id);
        }

        public List<LotSupply> GetFullList(string strConnection)
        {
            using (db = new SanXuatCheckListEntities(strConnection))
            {
                return db.LotSupplies.Where(x => !x.IsDeleted).ToList();
            }
        }

        public int GetLastIndex(string strConnection)
        {
            using (db = new SanXuatCheckListEntities(strConnection))
            {
                var obj = db.LotSupplies.Where(x => !x.IsDeleted).OrderByDescending(x => x.Index).FirstOrDefault();
                return obj != null ? obj.Index : 0;
            }
        }



        public PagedList<LotSuppliesModel> GetList(string strConnection, bool isForMana, string keyword, int startIndexRecord, int pageSize, string sorting)
        {
            using (db = new SanXuatCheckListEntities(strConnection))
            {
                try
                {
                    if (string.IsNullOrEmpty(sorting))
                        sorting = "CreatedDate DESC";

                    IQueryable<ReceiptionDetail> objs = db.ReceiptionDetails.Where(c => !c.IsDeleted && !c.LotSupply.IsDeleted);
                    if (!string.IsNullOrEmpty(keyword))
                    {
                        keyword = keyword.Trim().ToUpper();
                        objs = objs.Where(c => c.LotSupply.Name.Trim().ToUpper().Contains(keyword));
                    }
                    var pageNumber = (startIndexRecord / pageSize) + 1;

                    var pagedList = new PagedList<LotSuppliesModel>(objs.OrderBy(sorting).Select(x => new LotSuppliesModel()
                    {
                        Id = x.LotSupply.Id,

                        Name = x.LotSupply.Name,
                        Index = x.LotSupply.Index,

                        CustomerId = x.Receiption.FromCustomerId ?? 0,
                        //strCustomer = x.Receiption.Customer.Name,
                        WareHouseId = x.Receiption.FromWarehouseId ?? 0,
                        //strWarehouse = x.Receiption.WareHouse.Name,
                        //WareHouseIndex = x.Receiption.WareHouse.Index,

                        MaterialId = x.LotSupply.MaterialId,
                        //strMaterial = x.LotSupply.Material.NameTM,
                        //MaterialIndex = x.LotSupply.Material.Index,

                        Quantity = x.LotSupply.Quantity,
                        QuantityUsed = x.LotSupply.QuantityUsed,
                        //MaterialUnitId = x.LotSupply.Material.UnitId,
                        //strMaterialUnit = x.LotSupply.Material.Unit.Name,

                        Price = x.LotSupply.Price,
                        MoneyTypeId = x.Receiption.MoneyTypeId,
                        //strMoneyType = x.Receiption.Unit.Name,
                        ExchangeRate = x.Receiption.ExchangeRate,

                        ManufactureDate = x.LotSupply.ManufactureDate,
                        WarrantyDate = x.LotSupply.WarrantyDate,
                        ExpiryDate = x.LotSupply.ExpiryDate,

                        IsApproved = x.Receiption.IsApproved,
                        // StatusId = x.LotSupplies.StatusId,
                        Note = x.LotSupply.Note,
                        CreatedDate = x.LotSupply.CreatedDate,
                    }).ToList(), pageNumber, pageSize);
                    if (pagedList.Count > 0)
                    {
                        //var cf = db.P_Config.ToList();
                        string lotvalue = "", mvalue = "", whvalue = "";
                        //var found = cf.FirstOrDefault(x => x.Code == eConfigCode.LotSupplies);
                        //if (found != null)
                        //    lotvalue = found.Value;

                        //found = cf.FirstOrDefault(x => x.Code == eConfigCode.Material);
                        //if (found != null)
                        //    mvalue = found.Value;

                        //found = cf.FirstOrDefault(x => x.Code == eConfigCode.WareHouse);
                        //if (found != null)
                        //    whvalue = found.Value;


                        if (pagedList.Count > 0)
                        {
                            foreach (var item in pagedList)
                            {
                                item.Code = lotvalue + item.Index;
                                //item.strMaterial = "<span >" + item.strMaterial + "</span> (<span class=\"red\">" + mvalue + item.MaterialIndex + "</span>)";
                                //item.strWarehouse = "<span >" + item.strWarehouse + "</span> (<span class=\"red\">" + whvalue + item.WareHouseIndex + "</span>)";
                            }
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

        public PagedList<LotSuppliesModel> Gets(string strConnection, int warehouseId, bool quantityGreaterThan0, string keyword, int startIndexRecord, int pageSize, string sorting)
        {
            using (db = new SanXuatCheckListEntities(strConnection))
            {
                try
                {
                    if (string.IsNullOrEmpty(sorting))
                        sorting = "CreatedDate DESC";

                    IQueryable<ReceiptionDetail> objs = db.ReceiptionDetails.Where(c => !c.IsDeleted && !c.LotSupply.IsDeleted);
                    if (warehouseId != 0)
                    {
                        objs = objs.Where(c => c.Receiption.StoreWarehouseId == warehouseId);
                    }
                    if (!string.IsNullOrEmpty(keyword))
                    {
                        keyword = keyword.Trim().ToUpper();
                        objs = objs.Where(c => c.LotSupply.Name.Trim().ToUpper().Contains(keyword));
                    }
                    if (quantityGreaterThan0)
                    {
                        objs = objs.Where(x => (x.LotSupply.Quantity - x.LotSupply.QuantityUsed) > 0 && x.Receiption.StatusId == (int)eStatus.Approved);
                    }
                    var pageNumber = (startIndexRecord / pageSize) + 1;

                    var pagedList = new PagedList<LotSuppliesModel>(objs.Select(x => new LotSuppliesModel()
                    {
                        Id = x.LotSupply.Id,

                        Name = x.LotSupply.Name,
                        Index = x.LotSupply.Index,

                        CustomerId = x.Receiption.FromCustomerId ?? 0,
                        //strCustomer = x.Receiption.Customer.Name,

                        WareHouseId = x.Receiption.StoreWarehouseId,
                        //strWarehouse = x.Receiption.WareHouse1.Name,
                        //WareHouseIndex = x.Receiption.WareHouse1.Index,

                        MaterialId = x.LotSupply.MaterialId,
                        //strMaterial = x.LotSupply.Material.NameTM,
                        //MaterialIndex = x.LotSupply.Material.Index,

                        Quantity = x.LotSupply.Quantity,
                        QuantityUsed = x.LotSupply.QuantityUsed,
                        //MaterialUnitId = x.LotSupply.Material.UnitId,
                        //strMaterialUnit = x.LotSupply.Material.Unit.Name,

                        Price = x.LotSupply.Price,
                        MoneyTypeId = x.Receiption.MoneyTypeId,
                        //strMoneyType = x.Receiption.Unit.Name,
                        ExchangeRate = x.Receiption.ExchangeRate,

                        InputDate = x.Receiption.InputDate,
                        ManufactureDate = x.LotSupply.ManufactureDate,
                        WarrantyDate = x.LotSupply.WarrantyDate,
                        ExpiryDate = x.LotSupply.ExpiryDate,

                        IsApproved = x.Receiption.IsApproved,
                        StatusId = x.Receiption.StatusId,
                        //strStatus = x.Receiption.Status.Name,
                        Note = x.LotSupply.Note,
                        CreatedDate = x.LotSupply.CreatedDate,
                        SpecificationsPaking = x.LotSupply.SpecificationsPaking
                    }).ToList(), pageNumber, pageSize);
                    if (pagedList.Count > 0)
                    {
                        var cf = db.P_Config.ToList();
                        string lotvalue = "", mvalue = "", whvalue = "";
                        //var found = cf.FirstOrDefault(x => x.Code == eConfigCode.LotSupplies);
                        //if (found != null)
                        //    lotvalue = found.Value;

                        //found = cf.FirstOrDefault(x => x.Code == eConfigCode.Material);
                        //if (found != null)
                        //    mvalue = found.Value;

                        //found = cf.FirstOrDefault(x => x.Code == eConfigCode.WareHouse);
                        //if (found != null)
                        //    whvalue = found.Value;

                        if (pagedList.Count > 0)
                        {
                            foreach (var item in pagedList)
                            {
                                item.Code = lotvalue + item.Index;
                                // item.strMaterial = "<span >" + item.strMaterial + "</span> (<span class=\"red\">" + mvalue + item.MaterialIndex + "</span>)";
                                // item.strWarehouse = "<span >" + item.strWarehouse + "</span> (<span class=\"red\">" + whvalue + item.WareHouseIndex + "</span>)";
                            }
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


        public ReportInventoryModel GetReportInventory(string strConnection, int vattuId, int khoId)  // Báo cáo sl tồn kho vật tư theo vật tư
        {
            using (db = new SanXuatCheckListEntities(strConnection))
            {
                var report = new ReportInventoryModel();
                List<ReportInventoryModel> listObjs = new List<ReportInventoryModel>();
                //int mId = 0, whId = 0;

                //if (!string.IsNullOrEmpty(vattuId))
                //{
                //    int.TryParse(vattuId, out mId);
                //    //var found = db.Material.FirstOrDefault(x => !x.IsDeleted && x.Id == mId);
                //    //if (found != null)
                //    //    report.MaterialName = found.NameTM;
                //}

                //if (!string.IsNullOrEmpty(khoId))
                //{
                //    int.TryParse(khoId, out whId);
                //    //var found = db.WareHouse.FirstOrDefault(x => !x.IsDeleted && x.Id == mId);
                //    //if (found != null)
                //    //    report.WarehouseName = found.Name;
                //}
                report.MaterialId = vattuId;
                report.WarehouseId = khoId;
                var objs = db.ReceiptionDetails
                       .Where(x => !x.IsDeleted && (x.LotSupply.Quantity - x.LotSupply.QuantityUsed) > 0 && x.Receiption.StatusId == (int)eStatus.Approved);

                if (vattuId > 0)
                    objs = objs.Where(x => x.LotSupply.MaterialId == vattuId);
                if (khoId > 0)
                    objs = objs.Where(x => x.Receiption.StoreWarehouseId == khoId);

                report.Details.AddRange(objs.Select(x => new ReportInventoryDetailModel()
                {
                    Id = x.Id,
                    Index = x.LotSupply.Index,
                    Name = x.LotSupply.Name,

                    MaterialId = x.LotSupply.MaterialId,
                    //MaterialIndex = x.LotSupply.Material.Index,
                    //MaterialName = x.LotSupply.Material.NameTM,

                    Quantity = x.LotSupply.Quantity,
                    QuantityUsed = x.LotSupply.QuantityUsed,
                    //UnitId = x.LotSupply.Material.UnitId,
                    //UnitName = x.LotSupply.Material.Unit.Name,

                    StoreWarehouseId = x.Receiption.StoreWarehouseId,
                    //StoreWareHouseIndex = x.Receiption.WareHouse1.Index,
                    //StoreWareHouseName = x.Receiption.WareHouse1.Name,

                    Price = x.LotSupply.Price,
                    MoneyTypeId = x.Receiption.MoneyTypeId,
                    ExchangeRate = x.Receiption.ExchangeRate,
                    TotalMoney = (x.LotSupply.Quantity - x.LotSupply.QuantityUsed) * x.LotSupply.Price * x.Receiption.ExchangeRate,
                    //MoneyTypeName = x.Receiption.Unit.Name,

                    InputDate = x.Receiption.InputDate,
                    ExpiryDate = x.LotSupply.ExpiryDate,
                    ManufactureDate = x.LotSupply.ManufactureDate,
                    WarrantyDate = x.LotSupply.WarrantyDate,
                    SpecificationsPaking = x.LotSupply.SpecificationsPaking, 
                    //  StatusId = x.LotSupplies.StatusId
                })
                .OrderBy(x => x.StoreWarehouseId)
                .ThenByDescending(x => x.MaterialId)
                .ToList());

                string lotvalue = "";// BLLAppConfig.Instance.GetConfigByCode(strConnection,eConfigCode.LotSupplies);
                //string mvalue = BLLAppConfig.Instance.GetConfigByCode(strConnection,eConfigCode.Material);
                //string whvalue = BLLAppConfig.Instance.GetConfigByCode(strConnection,eConfigCode.WareHouse);
                for (int i = 0; i < report.Details.Count; i++)
                {
                    report.Details[i].Code = lotvalue + report.Details[i].Index;
                    // report.Details[i].MaterialCode = mvalue + report.Details[i].MaterialIndex;
                    //report.Details[i].StoreWareHouseCode = whvalue + report.Details[i].StoreWareHouseIndex;
                }
                return report;
            }
        }

        public List<List<ReportInventoryModel>> GetReportInventoryByWH(string strConnection, int wId) // Báo cáo sl tồn kho vật tư theo kho
        {
            using (db = new SanXuatCheckListEntities(strConnection))
            {
                List<List<ReportInventoryModel>> listResult = new List<List<ReportInventoryModel>>();
                List<ReportInventoryModel> listObjs = new List<ReportInventoryModel>();

                var listWId = new List<int>();

                if (wId == 0)
                    listWId = db.ReceiptionDetails
                        .Where(x => !x.IsDeleted && (x.LotSupply.Quantity - x.LotSupply.QuantityUsed) > 0)
                        .OrderBy(x => x.Receiption.StoreWarehouseId)
                        .Select(x => x.Receiption.StoreWarehouseId).Distinct().ToList();
                else
                    listWId.Add(wId);

                //foreach (var w in listWId)
                //{
                //    listObjs = db.ReceiptionDetail
                //    .Where(x => !x.IsDeleted && !x.LotSupplies.IsDeleted && (x.LotSupplies.Quantity - x.LotSupplies.QuantityUsed) > 0 && x.Receiption.StoreWarehouseId == w)
                //    .Select(x => new ReportInventoryDetailModel()
                //    {
                //        Id = x.Id,
                //        Index = x.LotSupplies.Index,
                //        Name = x.LotSupplies.Name,
                //        MaterialId = x.LotSupplies.Material.Id,
                //        MaterialIndex = x.LotSupplies.Material.Index,
                //        MaterialName = x.LotSupplies.Material.NameTM,
                //        Quantity = x.LotSupplies.Quantity,
                //        QuantityUsed = x.LotSupplies.QuantityUsed,
                //        UnitId = x.LotSupplies.Material.UnitId,
                //        // WareHouseId = x.LotSupplies.WareHouse.Id,
                //        StoreWareHouseIndex = x.Receiption.WareHouse.Index,
                //        StoreWareHouseName = x.Receiption.WareHouse.Name,
                //        Price = x.LotSupplies.Price,
                //        MoneyTypeId = x.Receiption.MoneyTypeId,
                //        ExchangeRate = x.Receiption.ExchangeRate,
                //        TotalMoney = (x.LotSupplies.Quantity - x.LotSupplies.QuantityUsed) * x.LotSupplies.Price * x.Receiption.ExchangeRate,
                //        InputDate = x.Receiption.InputDate,
                //        ExpiryDate = x.LotSupplies.ExpiryDate,
                //        //StatusId = x.Receiption.StatusId,
                //    }).ToList();

                //    if (listObjs != null && listObjs.Count > 0)
                //    {
                //        string lotvalue = BLLAppConfig.Instance.GetConfigByCode(strConnection,eConfigCode.LotSupplies);
                //        string mvalue = BLLAppConfig.Instance.GetConfigByCode(strConnection,eConfigCode.Material);
                //        string whvalue = BLLAppConfig.Instance.GetConfigByCode(strConnection,eConfigCode.WareHouse);
                //        foreach (var item in listObjs)
                //        {
                //            item.Code = lotvalue + item.Index;
                //            item.MaterialCode = mvalue + item.MaterialIndex;
                //            item.StoreWareHouseCode = whvalue + item.StoreWareHouseIndex;
                //        }
                //    }
                //    if (listObjs != null && listObjs.Count > 0)
                //        listResult.Add(listObjs);
                //}

                return listResult;
            }
        }

        public List<SuppliesModel> Gets(string strConnection, int materialId)
        {
            using (db = new SanXuatCheckListEntities(strConnection))
            {
                try
                {
                    var objs = db.ReceiptionDetails
                        .Where(c => !c.IsDeleted   && c.LotSupply.MaterialId == materialId && (c.LotSupply.Quantity - c.LotSupply.QuantityUsed > 0))
                        .Select(x => new SuppliesModel()
                        {
                            Index = x.LotSupply.Index,
                            Name = x.LotSupply.Name,
                            StoreWareHouseId = x.Receiption.StoreWarehouseId ,
                            StatusId = x.Receiption.StatusId,
                            //UnitId = x.LotSupply.MaterialId.UnitId,
                            Price = x.LotSupply.Price,
                            Quantity = x.LotSupply.Quantity,
                            QuantityUsed = x.LotSupply.QuantityUsed,
                            InputDate = x.Receiption.InputDate,
                            ExpireDate = x.LotSupply.ExpiryDate,
                            MoneyTypeId = x.Receiption.MoneyTypeId
                        }).OrderBy(x => x.InputDate).ToList();
                    return objs;
                }
                catch (Exception ex)
                {
                    throw ex;
                }
                return null;
            }
        }

        public LotSuppliesModel Get(string strConnection, int Id)
        {
            using (db = new SanXuatCheckListEntities(strConnection))
            {
                var obj = db.ReceiptionDetails
                    .Where(c => !c.IsDeleted && !c.LotSupply.IsDeleted && c.LotSuppliesId == Id)
                    .Select(x => new LotSuppliesModel()
                    {
                        Id = x.LotSuppliesId ,

                        Name = x.LotSupply.Name,
                        Index = x.LotSupply.Index,
                        CustomerId = x.Receiption.FromCustomerId??0 ,
                        // Sửa 
                        WareHouseId = x.Receiption.StoreWarehouseId ,
                        //strWarehouse = x.Receiption.WareHouse.Name,
                        //WareHouseIndex = x.Receiption.WareHouse.Index,

                        //MaterialId = x.LotSupplies.MaterialId,
                        MaterialId = x.LotSupply.MaterialId ,
                        //strMaterial = x.LotSupply.Material.NameTM,
                        //  MateriaNameKH = x.LotSupplies.Material.NameKH,
                        //MaterialIndex = x.LotSupply.Material.Index,
                        // MTypeName = x.LotSupplies.Material.MaterialType.Name,

                        Quantity = x.LotSupply.Quantity,
                        QuantityUsed = x.LotSupply.QuantityUsed,
                       // MaterialUnitId = x.LotSupply.Material.UnitId,
                       // strMaterialUnit = x.LotSupply.Material.Unit.Name,

                        Price = x.LotSupply.Price,
                        MoneyTypeId = x.Receiption.MoneyTypeId, 
                        ExchangeRate = x.Receiption.ExchangeRate,

                        InputDate = x.Receiption.InputDate,
                        ManufactureDate = x.LotSupply.ManufactureDate,
                        WarrantyDate = x.LotSupply.WarrantyDate,
                        ExpiryDate = x.LotSupply.ExpiryDate,

                        // StatusId = x.Receiption.StatusId,
                        Note = x.LotSupply.Note,
                        CreatedDate = x.LotSupply.CreatedDate,
                    })
                .FirstOrDefault();
                if (obj != null)
                {
                    var cf = "";// BLLAppConfig.Instance.GetConfigByCode(strConnection,eConfigCode.LotSupplies);
                    if (!string.IsNullOrEmpty(cf))
                        obj.Code = cf + "_" + obj.Index;
                    else
                        obj.Code = obj.Index.ToString();
                }
                return obj;
            }
        }
    }
}
