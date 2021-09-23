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
    public class BLLLenhSX
    {
        #region constructor
        SanXuatCheckListEntities db;
        static object key = new object();
        private static volatile BLLLenhSX _Instance;
        public static BLLLenhSX Instance
        {
            get
            {
                if (_Instance == null)
                    lock (key)
                        _Instance = new BLLLenhSX();

                return _Instance;
            }
        }
        private BLLLenhSX() { }
        #endregion

        bool checkPermis(LenhSanXuat obj, int actionUser, bool isOwner)
        {
            if (isOwner) return true;
            return obj.CreatedUser == actionUser;
        }

        private bool CheckExists(int Id, string code)
        {
            LenhSanXuat obj;
            obj = db.LenhSanXuats.FirstOrDefault(x => !x.IsDeleted && x.Id != Id && x.Code == code);
            return obj != null ? true : false;
        }

        public LenhSanXuat GetById(string strConnection, int Id)
        {
            if (db != null)
                return db.LenhSanXuats.FirstOrDefault(x => !x.IsDeleted && x.Id == Id);
            else
                using (db = new SanXuatCheckListEntities(strConnection))
                    return db.LenhSanXuats.FirstOrDefault(x => !x.IsDeleted && x.Id == Id);
        }

        public ResponseBase CreateOrUpdate(string strConnection, LenhModel model, bool isOwner)
        {
            using (db = new SanXuatCheckListEntities(strConnection))
            {
                var result = new ResponseBase();
                result.IsSuccess = false;
                try
                {
                    if (!CheckExists(model.Id, model.Code))
                    {
                        LenhSanXuat obj;
                        if (model.Id == 0)  // tao moi
                        {
                            obj = new LenhSanXuat();
                            Parse.CopyObject(model, ref obj);
                            obj.CreatedUser = model.ActionUser;
                            obj.CreatedDate = DateTime.Now;
                            if (model.Products.Count > 0)
                            {
                                obj.Lenh_Products = new List<Lenh_Products>();
                                Lenh_Products lenh_Products;
                                foreach (var item in model.Products)
                                {
                                    lenh_Products = new Lenh_Products();
                                    Parse.CopyObject(item, ref lenh_Products);
                                    lenh_Products.Quantity = item.Quantities_PC;
                                    lenh_Products.LenhSanXuat = obj;
                                    lenh_Products.CreatedDate = obj.CreatedDate;
                                    lenh_Products.CreatedUser = obj.CreatedUser;
                                    obj.Lenh_Products.Add(lenh_Products);

                                    if (item.PODetailId.HasValue && obj.StatusId != (int)eStatus.Draft )
                                    {
                                        var po = db.PO_SellDetail.FirstOrDefault(x => !x.IsDeleted && x.Id == item.PODetailId);
                                        if (po != null)
                                            po.Quantities_Lenh += item.Quantities_PC;
                                    }
                                }
                            }

                            if (model.Materials.Count > 0)
                            {
                                obj.Lenh_VatTu = new List<Lenh_VatTu>();
                                Lenh_VatTu lenh_VatTu;
                                foreach (var item in model.Materials)
                                {
                                    if (item.MaterialId != null && item.MaterialId > 0)
                                    {
                                        lenh_VatTu = new Lenh_VatTu();
                                        Parse.CopyObject(item, ref lenh_VatTu);
                                        lenh_VatTu.LenhSanXuat = obj;
                                        lenh_VatTu.CreatedDate = obj.CreatedDate;
                                        lenh_VatTu.CreatedUser = obj.CreatedUser;
                                        obj.Lenh_VatTu.Add(lenh_VatTu);
                                    }
                                }
                            }
                            db.LenhSanXuats.Add(obj);
                            result.IsSuccess = true;
                        }
                        else // cập nhật
                        {
                            obj = GetById(strConnection, model.Id);
                            if (obj != null)
                            {
                                if (!checkPermis(obj, model.ActionUser, isOwner))
                                {
                                    result.IsSuccess = false;
                                    result.Errors.Add(new Error() { MemberName = "update", Message = "Bạn không phải là người tạo lệnh sản xuất này nên bạn không cập nhật được thông tin ." });
                                }
                                else
                                {
                                    obj.Code = model.Code;
                                    obj.StartDate = model.StartDate;
                                    obj.CreatedDate = model.CreatedDate;
                                    obj.EmployeeId = model.EmployeeId;
                                    obj.Note = model.Note;

                                    obj.StatusId = model.StatusId;
                                    obj.UpdatedDate = DateTime.Now;
                                    obj.UpdatedUser = model.ActionUser;

                                    #region san pham 
                                    var oldProducts = db.Lenh_Products.Where(x => x.LenhId == model.Id).ToList();
                                    if (model.Products.Count > 0)
                                    {
                                        if (oldProducts.Count > 0)
                                        {
                                            for (int i = 0; i < oldProducts.Count; i++)
                                            {
                                                var found = model.Products.FirstOrDefault(x => ((x.PODetailId == 0 && !oldProducts[i].PODetailId.HasValue) || (x.PODetailId == oldProducts[i].PODetailId)) && x.ProductId == oldProducts[i].ProductId);
                                                if (found != null)
                                                {
                                                    oldProducts[i].Quantity = found.Quantities_PC;
                                                    oldProducts[i].UpdatedDate = obj.UpdatedDate;
                                                    oldProducts[i].UpdatedUser = model.ActionUser;
                                                    model.Products.Remove(found);
                                                    if (oldProducts[i].PODetailId.HasValue && obj.StatusId !=(int)eStatus.Draft)
                                                    {
                                                        int id = oldProducts[i].PODetailId.Value;
                                                        var po = db.PO_SellDetail.FirstOrDefault(x => !x.IsDeleted && x.Id == id);
                                                        if (po != null)
                                                            po.Quantities_Lenh += found.Quantities_PC;
                                                    }
                                                }
                                                else
                                                {
                                                    oldProducts[i].IsDeleted = true;
                                                    oldProducts[i].DeletedDate = obj.UpdatedDate;
                                                    oldProducts[i].DeletedUser = model.ActionUser;
                                                }
                                            }
                                        }

                                        if (model.Products.Count > 0)
                                        {
                                            Lenh_Products lenh_Products;
                                            foreach (var item in model.Products)
                                            {
                                                lenh_Products = new Lenh_Products();
                                                Parse.CopyObject(item, ref lenh_Products);
                                                lenh_Products.LenhId = obj.Id;
                                                lenh_Products.Quantity = item.Quantities_PC;
                                                lenh_Products.CreatedDate = obj.UpdatedDate.Value;
                                                lenh_Products.CreatedUser = model.ActionUser;
                                                db.Lenh_Products.Add(lenh_Products);
                                            }
                                        }

                                    }
                                    else
                                    {
                                        if (oldProducts.Count > 0)
                                        {
                                            for (int i = 0; i < oldProducts.Count; i++)
                                            {
                                                oldProducts[i].IsDeleted = true;
                                                oldProducts[i].DeletedDate = obj.UpdatedDate;
                                                oldProducts[i].DeletedUser = model.ActionUser;
                                            }
                                        }
                                    }
                                    #endregion

                                    #region vật tư 

                                    var oldMaterials = db.Lenh_VatTu.Where(x => x.LenhId == model.Id).ToList();
                                    if (model.Materials.Count > 0)
                                    {
                                        if (oldMaterials.Count > 0)
                                        {
                                            for (int i = 0; i < oldMaterials.Count; i++)
                                            {
                                                var found = model.Materials.FirstOrDefault(x => x.MaterialId == oldMaterials[i].MaterialId);
                                                if (found != null)
                                                {
                                                    oldMaterials[i].Quantity = found.Quantity;
                                                    oldMaterials[i].UpdatedDate = obj.UpdatedDate;
                                                    oldMaterials[i].UpdatedUser = model.ActionUser;
                                                    model.Materials.Remove(found);
                                                }
                                                else
                                                {
                                                    oldMaterials[i].IsDeleted = true;
                                                    oldMaterials[i].DeletedDate = obj.UpdatedDate;
                                                    oldMaterials[i].DeletedUser = model.ActionUser;
                                                }
                                            }
                                        }

                                        if (model.Materials.Count > 0)
                                        {
                                            Lenh_VatTu vt;
                                            foreach (var item in model.Materials)
                                            {
                                                if (item.MaterialId > 0)
                                                {
                                                    vt = new Lenh_VatTu();
                                                    Parse.CopyObject(item, ref vt);
                                                    vt.LenhId = obj.Id;
                                                    vt.CreatedDate = obj.UpdatedDate.Value;
                                                    vt.CreatedUser = model.ActionUser;
                                                    db.Lenh_VatTu.Add(vt);
                                                }
                                            }
                                        }

                                    }
                                    else
                                    {
                                        if (oldMaterials.Count > 0)
                                        {
                                            for (int i = 0; i < oldMaterials.Count; i++)
                                            {
                                                oldMaterials[i].IsDeleted = true;
                                                oldMaterials[i].DeletedDate = obj.UpdatedDate;
                                                oldMaterials[i].DeletedUser = model.ActionUser;
                                            }
                                        }
                                    }

                                    #endregion

                                    result.IsSuccess = true;
                                }
                            }
                            else
                            {
                                result.IsSuccess = false;
                                result.Errors.Add(new Error() { MemberName = "Create", Message = "lệnh sản xuất không tồn tại hoặc đã bị xóa, Vui Lòng kiểm tra lại." });
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
                        result.Errors.Add(new Error() { MemberName = "Create", Message = "Mã lệnh Đã Tồn Tại, Vui Lòng nhập mã khác" });
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
                            rs.Errors.Add(new Error() { MemberName = "update", Message = "Bạn không phải là người tạo lệnh sản xuất này nên bạn không cập nhật được thông tin cho lệnh sản xuất này." });
                        }
                        else if (obj.StatusId != (int)eStatus.Draft)
                        {
                            rs.IsSuccess = false;
                            rs.Errors.Add(new Error() { MemberName = "update", Message = "Lệnh sản xuất này đã được duyệt không thể xóa lệnh." });
                        }
                        else
                        {
                            var now = DateTime.Now;
                            obj.IsDeleted = true;
                            obj.DeletedDate = now;
                            obj.DeletedUser = actionUserId;

                            var oldProducts = db.Lenh_Products.Where(x => x.LenhId == obj.Id).ToList();
                            for (int i = 0; i < oldProducts.Count; i++)
                            {
                                oldProducts[i].IsDeleted = true;
                                oldProducts[i].DeletedDate = now;
                                oldProducts[i].DeletedUser = actionUserId;
                            }
                            var oldMaterials = db.Lenh_Products.Where(x => x.LenhId == obj.Id).ToList();
                            for (int i = 0; i < oldMaterials.Count; i++)
                            {
                                oldMaterials[i].IsDeleted = true;
                                oldMaterials[i].DeletedDate = now;
                                oldMaterials[i].DeletedUser = actionUserId;
                            }
                            db.SaveChanges();
                            rs.IsSuccess = true;
                        }
                    }
                    else
                    {
                        rs.IsSuccess = false;
                        rs.Errors.Add(new Error() { MemberName = "Delete", Message = "lệnh sản xuất này không tồn tại hoặc đã bị xóa, Vui Lòng kiểm tra lại." });
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

        public PagedList<LenhModel> Gets(string strConnection, string keyword, int startIndexRecord, int pageSize, string sorting)
        {
            using (db = new SanXuatCheckListEntities(strConnection))
            {
                try
                {
                    if (string.IsNullOrEmpty(sorting))
                        sorting = "CreatedDate DESC";

                    IQueryable<LenhSanXuat> objs = db.LenhSanXuats.Where(c => !c.IsDeleted);

                    if (!string.IsNullOrEmpty(keyword))
                    {
                        keyword = keyword.Trim().ToUpper();
                        objs = objs.Where(c => (c.Code.Trim().ToUpper().Contains(keyword)));
                    }

                    var pageNumber = (startIndexRecord / pageSize) + 1;
                    var pagelist = new PagedList<LenhModel>(objs.OrderBy(sorting).Select(x => new LenhModel()
                    {
                        Id = x.Id,
                        Code = x.Code,
                        StartDate = x.StartDate,
                        CreatedDate = x.CreatedDate,
                        EmployeeId = x.EmployeeId,
                        StatusId = x.StatusId,
                        Note = x.Note,
                    }), pageNumber, pageSize);
                    if (pagelist.Count > 0)
                    {
                        var ids = pagelist.Select(x => x.Id);
                        var products = db.Lenh_Products
                            .Where(x => !x.IsDeleted && ids.Contains(x.LenhId))
                            .Select(x => new LenhProductModel()
                            {
                                Id = x.Id,
                                LenhId = x.LenhId,
                                Quantities_PC = x.Quantity,
                                PODetailId = x.PODetailId ?? 0,
                                POCode = (x.PODetailId.HasValue ? x.PO_SellDetail.PO_Sell.Code : ""),
                                Quantity = (x.PODetailId.HasValue ? (x.PO_SellDetail.Quantities - x.PO_SellDetail.Quantities_Lenh) : 0),
                                ProductId = x.ProductId
                            }).ToList();

                        var materials = db.Lenh_VatTu
                            .Where(x => !x.IsDeleted && ids.Contains(x.LenhId))
                            .Select(x => new LenhMaterialModel()
                            {
                                Id = x.Id,
                                LenhId = x.LenhId,
                                Quantity = x.Quantity,
                                MaterialId = x.MaterialId
                            }).ToList();


                        foreach (var item in pagelist)
                        {
                            item.Products.AddRange(products.Where(x => x.LenhId == item.Id).ToList());
                            item.Materials.AddRange(materials.Where(x => x.LenhId == item.Id).ToList());
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

        public List<string> GetCodes(string strConnection)
        {
            using (db = new SanXuatCheckListEntities(strConnection))
            {
                return db.LenhSanXuats.Where(x => !x.IsDeleted && x.StatusId != (int)eStatus.Draft).Select(x => x.Code.ToLower().Trim()).ToList();
            }
        }

        public LenhModel GetByCode(string strConnection, string code)
        {
            using (db = new SanXuatCheckListEntities(strConnection))
            {
                try
                {
                    LenhModel obj = db.LenhSanXuats
                        .Where(c => !c.IsDeleted && (c.Code.Trim().ToLower().Contains(code)))
                        .Select(x => new LenhModel()
                        {
                            Id = x.Id,
                            Code = x.Code,
                            StartDate = x.StartDate,
                            CreatedDate = x.CreatedDate,
                            EmployeeId = x.EmployeeId,
                            StatusId = x.StatusId,
                            Note = x.Note,
                        }).FirstOrDefault();

                    if (obj != null)
                    {
                        obj.Products.AddRange(db.Lenh_Products
                            .Where(x => !x.IsDeleted && x.LenhId == obj.Id)
                            .Select(x => new LenhProductModel()
                            {
                                Id = x.Id,
                                LenhId = x.LenhId,
                                Quantities_PC = x.Quantity_PC,
                                PODetailId = x.PODetailId??0,
                                POCode = (x.PODetailId.HasValue ? x.PO_SellDetail.PO_Sell.Code:""),
                                Quantity = x.Quantity,
                                ProductId = x.ProductId
                            }));

                        obj.Materials.AddRange(db.Lenh_VatTu
                             .Where(x => !x.IsDeleted && x.LenhId == obj.Id)
                             .Select(x => new LenhMaterialModel()
                             {
                                 Id = x.Id,
                                 LenhId = x.LenhId,
                                 Quantity = x.Quantity,
                                 MaterialId = x.MaterialId
                             }));
                    }
                    return obj;
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public List<ModelSelectItem> GetLenhProducts(string strConnection, List<int> lenhProIds)
        {
            try
            {
                using (db = new SanXuatCheckListEntities(strConnection))
                {
                    return db.Lenh_Products.Where(x => lenhProIds.Contains(x.Id)).Select(
                         x => new ModelSelectItem()
                         {
                             Value = x.LenhId,
                             Code = x.LenhSanXuat.Code,
                             Id = x.Id,
                             Data = x.Quantity_PC,
                             Double = x.Quantity,
                             Name = "" //x.Customer.Name,

                         }).ToList();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public void UpdatePC(string strConnection, int lenhProId, int slCu, int slMoi)
        {
            using (db = new SanXuatCheckListEntities(strConnection))
            {
                var obj = db.Lenh_Products.FirstOrDefault(x => x.Id == lenhProId);
                if (obj != null)
                {
                    obj.Quantity_PC = ((obj.Quantity_PC - slCu) + slMoi);
                    db.SaveChanges();
                }
            }
        }
    }
}
