using GPROCommon.Data;
using GPROCommon.Repository;
using GPROSanXuat_Checklist.App_Global;
using GPROSanXuat_Checklist.Business.Model;
using PagedList;
using System.Collections.Generic;
using System.Linq;

namespace GPROSanXuat_Checklist.Mapper
{
    public class DeliveryMaper
    {
        #region constructor 
        static object key = new object();
        private static volatile DeliveryMaper _Instance;
        public static DeliveryMaper Instance
        {
            get
            {
                if (_Instance == null)
                    lock (key)
                        _Instance = new DeliveryMaper();

                return _Instance;
            }
        }
        private DeliveryMaper() { }
        #endregion

        public PagedList<DeliveryModel> MapInfoFromGPROCommon(PagedList<DeliveryModel> objs)
        {
            if (objs.Count > 0)
            {
                using (var db = new GPROCommonEntities(AppGlobal.ConnectionstringGPROCommon))
                {
                    var customers = db.C_Customer.Where(x => !x.IsDeleted).ToList();
                    var warehouses = db.WareHouses.Where(x => !x.IsDeleted).ToList();
                    var units = db.C_Unit.Where(x => !x.IsDeleted).ToList();
                    var employees = EmployeeRepository.Instance.GetSelectItem(AppGlobal.ConnectionstringGPROCommon);
                    var users = UserRepository.Instance.GetSelectItem(AppGlobal.ConnectionstringGPROCommon);

                    for (int i = 0; i < objs.Count; i++)
                    {
                        dynamic found = warehouses.FirstOrDefault(x => x.Id == objs[i].WarehouseId);
                        if (found != null)
                            objs[i].strWarehouse = found.Name;

                        found = customers.FirstOrDefault(x => x.Id == objs[i].CustomerId);
                        if (found != null)
                            objs[i].strCustomer = found.Name;

                        found = units.FirstOrDefault(x => x.Id == objs[i].UnitId);
                        if (found != null)
                            objs[i].TienTe = found.Name;

                        found = employees.FirstOrDefault(x => x.Value == objs[i].Deliverier);
                        if (found != null)
                            objs[i].strDeliverier = found.Name;
                        if (objs[i].ApprovedUser.HasValue)
                        {
                            found = users.FirstOrDefault(x => x.Value == objs[i].ApprovedUser.Value);
                            if (found != null)
                                objs[i].strApprover = found.Name;
                        }

                    }
                }
            }
            return objs;
        }

        public PO_SellModel MapInfoFromGPROCommon(PO_SellModel obj)
        {
            if (obj != null)
            {
                using (var db = new GPROCommonEntities(AppGlobal.ConnectionstringGPROCommon))
                {
                    var customers = db.C_Customer.Where(x => !x.IsDeleted).ToList();
                    var products = db.C_Product.Where(x => !x.IsDeleted).ToList();
                    var status = db.C_Status.Where(x => !x.IsDeleted).ToList();
                    var units = db.C_Unit.Where(x => !x.IsDeleted).ToList();

                    dynamic found = customers.FirstOrDefault(x => x.Id == obj.CustomerId);
                    if (found != null)
                        obj.CustomerName = found.Name;

                    found = status.FirstOrDefault(x => x.Id == obj.StatusId);
                    if (found != null)
                        obj.StatusName = found.Name;

                    found = units.FirstOrDefault(x => x.Id == obj.MoneyUnitId);
                    if (found != null)
                        obj.MoneyTypeName = found.Name;

                    if (obj.Details.Count > 0)
                    {
                        for (int i = 0; i < obj.Details.Count; i++)
                        {
                            found = products.FirstOrDefault(x => x.Id == obj.Details[i].ProductId);
                            if (found != null)
                            {
                                obj.Details[i].ProductName = found.Name;
                                obj.Details[i].ProductUnit = found.C_Unit.Name;
                            }
                        }
                    }
                }
            }
            return obj;
        }

    }

    public class DeliveryDetailsMaper
    {
        #region constructor 
        static object key = new object();
        private static volatile DeliveryDetailsMaper _Instance;
        public static DeliveryDetailsMaper Instance
        {
            get
            {
                if (_Instance == null)
                    lock (key)
                        _Instance = new DeliveryDetailsMaper();

                return _Instance;
            }
        }
        private DeliveryDetailsMaper() { }
        #endregion

        public PagedList<DeliveryDetailModel> MapInfoFromGPROCommon(PagedList<DeliveryDetailModel> objs)
        {
            if (objs.Count > 0)
            {
                using (var db = new GPROCommonEntities(AppGlobal.ConnectionstringGPROCommon))
                {
                    var materials = db.Materials.Where(x => !x.IsDeleted && !x.MaterialType.IsDeleted).ToList();
                    var warehouses = db.WareHouses.Where(x => !x.IsDeleted).ToList();
                    var units = db.C_Unit.Where(x => !x.IsDeleted).ToList();

                    for (int i = 0; i < objs.Count; i++)
                    {
                        dynamic found = materials.FirstOrDefault(x => x.Id == objs[i].MaterialId);
                        if (found != null)
                        {
                            objs[i].MaterialName = found.NameTM;
                            objs[i].MaterialIndex = found.Index;

                            objs[i].UnitId = found.UnitId;
                            objs[i].UnitName = found.C_Unit.Name;
                        }

                        found = units.FirstOrDefault(x => x.Id == objs[i].UnitId);
                        if (found != null)
                            objs[i].UnitName = found.Name;

                        objs[i].strLotName = "<span >" + objs[i].LotName + "</span> (<span class=\"red\">" + objs[i].LotIndex + "</span>)";
                        objs[i].strMaterialName = "<span >" + objs[i].MaterialName + "</span> (<span class=\"red\">" + objs[i].MaterialIndex + "</span>)";

                        found = warehouses.FirstOrDefault(x => x.Id == objs[i].WareHouseId);
                        if (found != null)
                        {
                            objs[i].strWareHouseName = "<span>" + found.Name + "</span> (<span class=\"red\">" + found.Index + "</span>)";
                            objs[i].WareHouseName = found.Name;
                            objs[i].WareHouseIndex = found.Index;
                        }
                    }
                }
            }
            return objs;
        }

        public List<DeliveryDetailModel> MapInfoFromGPROCommon(List<DeliveryDetailModel> objs)
        {
            if (objs.Count > 0)
            {
                using (var db = new GPROCommonEntities(AppGlobal.ConnectionstringGPROCommon))
                {
                    var materials = db.Materials.Where(x => !x.IsDeleted && !x.MaterialType.IsDeleted).ToList();
                    var warehouses = db.WareHouses.Where(x => !x.IsDeleted).ToList();
                    var units = db.C_Unit.Where(x => !x.IsDeleted).ToList();
                    var customers = db.C_Customer.Where(x => !x.IsDeleted).ToList();

                    for (int i = 0; i < objs.Count; i++)
                    {
                        var _found = materials.FirstOrDefault(x => x.Id == objs[i].MaterialId);
                        if (_found != null)
                        {
                            objs[i].MaterialName = _found.NameTM;
                            objs[i].MaterialIndex = _found.Index;
                            objs[i].MaterialCode = _found.Index.ToString();
                            objs[i].UnitId = _found.UnitId;
                            objs[i].UnitName = _found.C_Unit.Name;
                        }

                        dynamic found = units.FirstOrDefault(x => x.Id == objs[i].UnitId);
                        if (found != null)
                            objs[i].UnitName = found.Name;

                        found = units.FirstOrDefault(x => x.Id == objs[i].MoneyTypeId);
                        if (found != null)
                            objs[i].MoneyTypeName = found.Name;

                        found = customers.FirstOrDefault(x => x.Id == objs[i].CustomerId);
                        if (found != null)
                            objs[i].CustomerName = found.Name;

                        objs[i].strLotName = "<span >" + objs[i].LotName + "</span> (<span class=\"red\">" + objs[i].LotIndex + "</span>)";
                        objs[i].strMaterialName = "<span >" + objs[i].MaterialName + "</span> (<span class=\"red\">" + objs[i].MaterialIndex + "</span>)";

                        found = warehouses.FirstOrDefault(x => x.Id == objs[i].WareHouseId);
                        if (found != null)
                        {
                            objs[i].strWareHouseName = "<span>" + found.Name + "</span> (<span class=\"red\">" + found.Index + "</span>)";
                            objs[i].WareHouseName = found.Name;
                            objs[i].WareHouseIndex = found.Index;
                        }
                    }
                }
            }
            return objs;
        }

    }
}