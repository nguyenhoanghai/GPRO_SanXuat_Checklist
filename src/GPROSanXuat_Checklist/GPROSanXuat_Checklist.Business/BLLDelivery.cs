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
    public class BLLDelivery
    {
        #region constructor
        SanXuatCheckListEntities db;
        static object key = new object();
        private static volatile BLLDelivery _Instance;
        public static BLLDelivery Instance
        {
            get
            {
                if (_Instance == null)
                    lock (key)
                        _Instance = new BLLDelivery();

                return _Instance;
            }
        }
        private BLLDelivery() { }
        #endregion

        bool checkPermis(Delivery obj, int actionUser, bool isOwner)
        {
            if (isOwner) return true;
            return obj.CreatedUser == actionUser;
        }

        private bool CheckExists(int Id, string value, int index, bool isCheckName)
        {
            Delivery obj;
            if (!isCheckName)
                obj = db.Deliveries.FirstOrDefault(x => !x.IsDeleted && x.Id != Id && x.Index == index);
            else
                obj = db.Deliveries.FirstOrDefault(x => !x.IsDeleted && x.Id != Id && x.Name.Trim().Equals(value));
            return obj != null ? true : false;
        }

        public Delivery GetById(string strConnection, int Id)
        {
            if (db != null)
                return db.Deliveries.FirstOrDefault(x => !x.IsDeleted && x.Id == Id);
            else
                using (db = new SanXuatCheckListEntities(strConnection))
                    return db.Deliveries.FirstOrDefault(x => !x.IsDeleted && x.Id == Id);
        }

        public ResponseBase CreateOrUpdate(string strConnection, DeliveryModel model)
        {
            using (db = new SanXuatCheckListEntities(strConnection))
            {
                var result = new ResponseBase();
                result.IsSuccess = false;
                try
                {
                    if (!CheckExists(model.Id, model.Name, model.Index, true)) // nếu ko bị trùng tên
                    {
                        if (!CheckExists(model.Id, model.Name, model.Index, false)) // nếu ko bị trùng index
                            result.IsSuccess = true;
                        else
                        {
                            result.IsSuccess = false;
                            result.Errors.Add(new Error() { MemberName = "Create", Message = "Mã phiếu xuất kho đã bị trùng, Xin chọn mã khác" });
                        }
                        if (result.IsSuccess)
                        {
                            if (model.OrderDetailId == 0)
                                model.OrderDetailId = null;

                            Delivery obj;
                            if (model.Id == 0)  // tao moi
                            {
                                obj = new Delivery();
                                Parse.CopyObject(model, ref obj);
                                obj.StatusId = (int)eStatus.Draft;
                                obj.CreatedUser = model.ActionUser;
                                obj.CreatedDate = DateTime.Now;
                                db.Deliveries.Add(obj);
                                result.IsSuccess = true;
                            }
                            else // cập nhật
                            {
                                obj = GetById(strConnection, model.Id);
                                if (obj != null)
                                {
                                    if (obj.StatusId == (int)eStatus.Submited)
                                    {
                                        result.IsSuccess = false;
                                        result.Errors.Add(new Error() { MemberName = "Delete", Message = "Phiếu xuất Kho này đang chờ duyệt bạn không thể cập nhật thông tin. Vui Lòng kiểm tra lại." });
                                    }
                                    else if (obj.IsApproved)
                                    {
                                        result.IsSuccess = false;
                                        result.Errors.Add(new Error() { MemberName = "Delete", Message = "Phiếu Xuất Kho này đã duyệt bạn không thể cập nhật thông tin. Vui Lòng kiểm tra lại." });
                                    }
                                    else
                                    {
                                        var details = obj.DeliveryDetails.Where(x => !x.IsDeleted);
                                        if (model.StatusId == (int)eStatus.Submited && (details == null || details.Count() == 0))
                                        {
                                            result.IsSuccess = false;
                                            result.Errors.Add(new Error() { MemberName = "Delete", Message = "Phiếu Xuất Kho này chưa có thông tin vật tư cần xuất. Vui Lòng nhập thông tin vật tư cần xuất trước khi gửi yêu cầu duyệt phiếu." });
                                            return result;
                                        }
                                        obj.Name = model.Name;
                                        obj.Index = model.Index;
                                        obj.WarehouseId = model.WarehouseId;
                                        obj.Deliverier = model.Deliverier;
                                        obj.DeliveryDate = model.DeliveryDate;
                                        obj.CustomerId = model.CustomerId;
                                        obj.Reciever = model.Reciever;
                                        obj.UnitId = model.UnitId;
                                        obj.ExchangeRate = model.ExchangeRate;
                                        obj.TransactionType = model.TransactionType;
                                        obj.DateOfAccounting = model.DateOfAccounting;
                                        obj.IsApproved = model.IsApproved;
                                        obj.OrderDetailId = model.OrderDetailId;
                                        obj.StatusId = model.StatusId;

                                        obj.Note = model.Note;
                                        obj.UpdatedDate = DateTime.Now;
                                        obj.UpdatedUser = model.ActionUser;
                                        result.IsSuccess = true;
                                    }
                                }
                                else
                                {
                                    result.IsSuccess = false;
                                    result.Errors.Add(new Error() { MemberName = "Create", Message = "Phiếu Xuất Kho không tồn tại hoặc đã bị xóa, Vui Lòng kiểm tra lại." });
                                }
                            }
                            if (result.IsSuccess)
                            {
                                db.SaveChanges();
                                result.IsSuccess = true;
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
                    result.Errors.Add(new Error() { MemberName = "Create", Message = "Lỗi khi thực hiện SQL, Vui Lòng kiểm tra lại." });

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
                    var obj = db.Deliveries.FirstOrDefault(x => !x.IsDeleted && x.Id == Id);
                    if (obj == null)
                    {
                        rs.IsSuccess = false;
                        rs.Errors.Add(new Error() { MemberName = "Delete", Message = "Phiếu Xuất Kho này không tồn tại hoặc đã bị xóa. Vui Lòng kiểm tra lại." });
                        return rs;
                    }
                    if (!checkPermis(obj, actionUserId, isOwner))
                    {
                        rs.IsSuccess = false;
                        rs.Errors.Add(new Error() { MemberName = "update", Message = "Bạn không phải là người tạo phiếu nhập kho này nên bạn không cập nhật được thông tin cho phiếu nhập kho này." });
                        return rs;
                    }
                    if (obj.StatusId != (int)eStatus.Submited)
                    {
                        rs.IsSuccess = false;
                        rs.Errors.Add(new Error() { MemberName = "Delete", Message = "Phiếu xuất Kho này đang chờ duyệt bạn không thể xóa. Vui Lòng kiểm tra lại." });
                        return rs;
                    }
                    if (obj.IsApproved)
                    {
                        rs.IsSuccess = false;
                        rs.Errors.Add(new Error() { MemberName = "Delete", Message = "Phiếu Xuất Kho này đã duyệt bạn không thể xóa. Vui Lòng kiểm tra lại." });
                        return rs;
                    }
                    obj.IsDeleted = true;
                    obj.DeletedDate = DateTime.Now;
                    obj.DeletedUser = actionUserId;
                    db.SaveChanges();
                    rs.IsSuccess = true;
                    return rs;
                }
                catch (Exception ex)
                {
                    rs.IsSuccess = false;
                    rs.Errors.Add(new Error() { MemberName = "Delete", Message = "Lỗi Exception" });
                    return rs;
                }
            }
        }

        public ResponseBase Approve(string strConnection, int Id, int actionUserId)
        {
            using (db = new SanXuatCheckListEntities(strConnection))
            {
                var rs = new ResponseBase();
                try
                {
                    var obj = db.Deliveries.FirstOrDefault(x => !x.IsDeleted && x.Id == Id);
                    if (obj == null)
                    {
                        rs.IsSuccess = false;
                        rs.Errors.Add(new Error() { MemberName = "Delete", Message = "Phiếu Xuất Kho này không tồn tại hoặc đã bị xóa. Vui Lòng kiểm tra lại." });
                        return rs;
                    }
                    var details = db.DeliveryDetails.Where(x => !x.IsDeleted && x.DeliveryId == Id);
                    if (details.Count() > 0)
                    {
                        //hach toán kho
                        foreach (var dObj in details)
                        {
                            if (dObj.Quantity > (dObj.LotSupply.Quantity - dObj.LotSupply.QuantityUsed))
                            {
                                rs.IsSuccess = false;
                                rs.Errors.Add(new Error() { MemberName = "Delete", Message = "Phiếu xuất kho này không thể duyệt do số lượng vật tư trong kho không còn đủ theo số lượng yêu cầu. Vui lòng nhập thêm vật tư trước khi duyệt phiếu"  });
                                return rs;
                            }
                            dObj.LotSupply.QuantityUsed += dObj.Quantity;
                        }
                    }
                      
                    obj.StatusId = (int)eStatus.Approved;
                    obj.IsApproved = true;
                    obj.ApprovedDate = DateTime.Now;
                    obj.ApprovedUser = actionUserId;
                    db.SaveChanges();
                    rs.IsSuccess = true;
                    return rs;
                }
                catch (Exception ex)
                {
                    rs.IsSuccess = false;
                    rs.Errors.Add(new Error() { MemberName = "Delete", Message = "Lỗi Exception" });
                    return rs;
                }
            }
        }

        public PagedList<DeliveryModel> GetList(string strConnection, int orderDetailId, List<ModelSelectItem> products, int startIndexRecord, int pageSize, string sorting)
        {
            using (db = new SanXuatCheckListEntities(strConnection))
            {
                try
                {
                    if (string.IsNullOrEmpty(sorting))
                        sorting = "CreatedDate DESC";

                    IQueryable<Delivery> objs = db.Deliveries.Where(c => !c.IsDeleted && c.OrderDetailId.HasValue && c.OrderDetailId.Value == orderDetailId && c.IsApproved);
                     
                    var pageNumber = (startIndexRecord / pageSize) + 1;
                    var pagelist = new PagedList<DeliveryModel>(objs.OrderBy(sorting).Select(x => new DeliveryModel()
                    {
                        Id = x.Id,
                        Name = x.Name,
                        Index = x.Index,
                        CustomerId = x.CustomerId,
                        //strCustomer = x.Customer.Name,
                        Reciever = x.Reciever,
                        UnitId = x.UnitId,
                        //TienTe = x.Unit.Name,
                        WarehouseId = x.WarehouseId,
                        //strWarehouse = x.WareHouse.Name,
                        ExchangeRate = x.ExchangeRate,
                        TransactionType = x.TransactionType,
                        DateOfAccounting = x.DateOfAccounting,
                        StatusId = x.StatusId,
                        IsApproved = x.IsApproved,
                        ApprovedUser = x.ApprovedUser,
                        ApprovedDate = x.ApprovedDate,
                        Note = x.Note,
                        DeliveryDate = x.DeliveryDate,
                        Deliverier = x.Deliverier,
                        OrderDetailId = x.OrderDetailId,
                        OrderId = x.OrderDetailId.HasValue ? x.OrderDetail.OrderId : 0,
                        OrderCode = x.OrderDetailId.HasValue ? x.OrderDetail.Order.Code : "",
                        ProductId = x.OrderDetailId.HasValue ? x.OrderDetail.ProductId : 0,
                    }), pageNumber, pageSize);
                    if (pagelist.Count > 0)
                    {
                        var ids = pagelist.Select(x => x.Id);
                        var details = db.DeliveryDetails.Where(x => !x.IsDeleted && ids.Contains(x.DeliveryId));

                        string dvalue = "";// BLLAppConfig.Instance.GetConfigByCode(strConnection,eConfigCode.Delivery);
                                           // var employees = BLLEmployee.Instance.GetSelectItem(strConnection);
                                           // var users = BLLUser.Instance.GetSelectItem(strConnection, null);
                        ModelSelectItem found;
                        foreach (var item in pagelist)
                        {
                            var dts = details.Where(x => x.DeliveryId == item.Id);
                            item.Total = (dts != null && dts.Count() > 0 ? Math.Round(dts.Sum(x => x.Price * x.Quantity), 2) : 0);
                            item.Code = dvalue + item.Index;

                            if (item.ProductId > 0 && products.Count > 0)
                            {
                                found = products.FirstOrDefault(x => x.Value == item.ProductId);
                                if (found != null)
                                    item.ProductName = found.Name;
                            }

                            switch (item.StatusId)
                            {
                                case (int)eStatus.Draft: item.StatusName = "Bản nháp"; break;
                                case (int)eStatus.Submited: item.StatusName = "Chờ duyệt"; break;
                                case (int)eStatus.Approved: item.StatusName = "Đã duyệt"; break;
                            }

                            //if (item.ApprovedUser.HasValue)
                            //{
                            //    found = users.FirstOrDefault(x => x.Value == item.ApprovedUser.Value);
                            //    if (found != null)
                            //        item.strApprover = found.Name;
                            //}
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


        public PagedList<DeliveryModel> GetList(string strConnection, string keyword, List<ModelSelectItem> products, int startIndexRecord, int pageSize, string sorting)
        {
            using (db = new SanXuatCheckListEntities(strConnection))
            {
                try
                {
                    if (string.IsNullOrEmpty(sorting))
                        sorting = "CreatedDate DESC";

                    IQueryable<Delivery> objs = db.Deliveries.Where(c => !c.IsDeleted);
                    if (!string.IsNullOrEmpty(keyword))
                    {
                        keyword = keyword.Trim().ToUpper();
                        objs = objs.Where(c => c.Name.Trim().ToUpper().Contains(keyword));
                    }
                    var pageNumber = (startIndexRecord / pageSize) + 1;
                    var pagelist = new PagedList<DeliveryModel>(objs.OrderBy(sorting).Select(x => new DeliveryModel()
                    {
                        Id = x.Id,
                        Name = x.Name,
                        Index = x.Index,
                        CustomerId = x.CustomerId,
                        //strCustomer = x.Customer.Name,
                        Reciever = x.Reciever,
                        UnitId = x.UnitId,
                        //TienTe = x.Unit.Name,
                        WarehouseId = x.WarehouseId,
                        //strWarehouse = x.WareHouse.Name,
                        ExchangeRate = x.ExchangeRate,
                        TransactionType = x.TransactionType,
                        DateOfAccounting = x.DateOfAccounting,
                        StatusId = x.StatusId,
                        IsApproved = x.IsApproved,
                        ApprovedUser = x.ApprovedUser,
                        ApprovedDate = x.ApprovedDate,
                        Note = x.Note,
                        DeliveryDate = x.DeliveryDate,
                        Deliverier = x.Deliverier,
                        OrderDetailId = x.OrderDetailId,
                        OrderId = x.OrderDetailId.HasValue ? x.OrderDetail.OrderId : 0,
                        OrderCode = x.OrderDetailId.HasValue ? x.OrderDetail.Order.Code : "",
                        ProductId = x.OrderDetailId.HasValue ? x.OrderDetail.ProductId : 0,
                    }), pageNumber, pageSize);
                    if (pagelist.Count > 0)
                    {
                        var ids = pagelist.Select(x => x.Id);
                        var details = db.DeliveryDetails.Where(x => !x.IsDeleted && ids.Contains(x.DeliveryId));

                        string dvalue = "";// BLLAppConfig.Instance.GetConfigByCode(strConnection,eConfigCode.Delivery);
                                           // var employees = BLLEmployee.Instance.GetSelectItem(strConnection);
                                           // var users = BLLUser.Instance.GetSelectItem(strConnection, null);
                        ModelSelectItem found;
                        foreach (var item in pagelist)
                        {
                            var dts = details.Where(x => x.DeliveryId == item.Id);
                            item.Total = (dts != null && dts.Count() > 0 ? Math.Round(dts.Sum(x => x.Price * x.Quantity), 2) : 0);
                            item.Code = dvalue + item.Index;

                            if (item.ProductId > 0 && products.Count > 0)
                            {
                                found = products.FirstOrDefault(x => x.Value == item.ProductId);
                                if (found != null)
                                    item.ProductName = found.Name;
                            }

                            switch (item.StatusId)
                            {
                                case (int)eStatus.Draft: item.StatusName = "Bản nháp"; break;
                                case (int)eStatus.Submited: item.StatusName = "Chờ duyệt"; break;
                                case (int)eStatus.Approved: item.StatusName = "Đã duyệt"; break;
                            }

                            //if (item.ApprovedUser.HasValue)
                            //{
                            //    found = users.FirstOrDefault(x => x.Value == item.ApprovedUser.Value);
                            //    if (found != null)
                            //        item.strApprover = found.Name;
                            //}
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

        public PagedList<DeliveryModel> GetList(string strConnection, List<ModelSelectItem> products, int custId, int startIndexRecord, int pageSize, string sorting)
        {
            using (db = new SanXuatCheckListEntities(strConnection))
            {
                try
                {
                    if (string.IsNullOrEmpty(sorting))
                        sorting = "CreatedDate DESC";

                    IQueryable<Delivery> objs = db.Deliveries.Where(c => !c.IsDeleted);
                    if (custId != 0)
                        objs = objs.Where(c => c.CustomerId == custId);

                    var pageNumber = (startIndexRecord / pageSize) + 1;
                    var pagelist = new PagedList<DeliveryModel>(objs.OrderBy(sorting).Select(x => new DeliveryModel()
                    {
                        Id = x.Id,
                        Name = x.Name,
                        Index = x.Index,
                        CustomerId = x.CustomerId,
                        //strCustomer = x.Customer.Name,
                        Reciever = x.Reciever,
                        UnitId = x.UnitId,
                        //TienTe = x.Unit.Name,
                        WarehouseId = x.WarehouseId,
                        //strWarehouse = x.WareHouse.Name,
                        ExchangeRate = x.ExchangeRate,
                        TransactionType = x.TransactionType,
                        DateOfAccounting = x.DateOfAccounting,
                        StatusId = x.StatusId,
                        ApprovedUser = x.ApprovedUser,
                        IsApproved = x.IsApproved,
                        ApprovedDate = x.ApprovedDate,
                        Note = x.Note,
                        DeliveryDate = x.DeliveryDate,
                        Deliverier = x.Deliverier,
                        OrderDetailId = x.OrderDetailId,
                        OrderId = x.OrderDetailId.HasValue ? x.OrderDetail.OrderId : 0,
                        OrderCode = x.OrderDetailId.HasValue ? x.OrderDetail.Order.Code : "",
                        ProductId = x.OrderDetailId.HasValue ? x.OrderDetail.ProductId : 0,
                    }), pageNumber, pageSize);
                    if (pagelist.Count > 0)
                    {
                        var ids = pagelist.Select(x => x.Id);
                        var details = db.DeliveryDetails.Where(x => !x.IsDeleted && ids.Contains(x.DeliveryId));

                        string dvalue = "";// BLLAppConfig.Instance.GetConfigByCode(strConnection,eConfigCode.Delivery);
                        //var employees = BLLEmployee.Instance.GetSelectItem(strConnection);
                        //var users = BLLUser.Instance.GetSelectItem(strConnection, null);
                        ModelSelectItem found;
                        foreach (var item in pagelist)
                        {
                            var dts = details.Where(x => x.DeliveryId == item.Id);
                            item.Total = (dts != null && dts.Count() > 0 ? Math.Round(dts.Sum(x => x.Price * x.Quantity), 2) : 0);
                            item.Code = dvalue + item.Index;

                            if (item.ProductId > 0 && products.Count > 0)
                            {
                                found = products.FirstOrDefault(x => x.Value == item.ProductId);
                                if (found != null)
                                    item.ProductName = found.Name;
                            }

                            switch (item.StatusId)
                            {
                                case (int)eStatus.Draft: item.StatusName = "Lưu nháp"; break;
                                case (int)eStatus.Submited: item.StatusName = "Chờ duyệt"; break;
                                case (int)eStatus.Approved: item.StatusName = "Đã duyệt"; break;
                            }

                            //found = employees.FirstOrDefault(x => x.Value == item.Deliverier);
                            //if (found != null)
                            //    item.strDeliverier = found.Name;
                            //if (item.ApprovedUser.HasValue)
                            //{
                            //    found = users.FirstOrDefault(x => x.Value == item.ApprovedUser.Value);
                            //    if (found != null)
                            //        item.strApprover = found.Name;
                            //}
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
                return db.Deliveries.Where(x => !x.IsDeleted).Select(x => new ModelSelectItem() { Value = x.Id, Name = x.Name }).ToList();
            }
        }

        public int GetLastIndex(string strConnection)
        {
            using (db = new SanXuatCheckListEntities(strConnection))
            {
                var obj = db.Deliveries.OrderByDescending(x => x.Index).FirstOrDefault(x => !x.IsDeleted);
                return obj != null ? obj.Index : 0;
            }
        }
    }
}
