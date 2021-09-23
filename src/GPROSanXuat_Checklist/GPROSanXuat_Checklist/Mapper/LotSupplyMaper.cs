using GPROCommon.Data;
using GPROSanXuat_Checklist.App_Global;
using GPROSanXuat_Checklist.Business.Model;
using PagedList;
using System.Linq;

namespace GPROSanXuat_Checklist.Mapper
{
    public class LotSupplyMaper
    {
        #region constructor 
        static object key = new object();
        private static volatile LotSupplyMaper _Instance;
        public static LotSupplyMaper Instance
        {
            get
            {
                if (_Instance == null)
                    lock (key)
                        _Instance = new LotSupplyMaper();

                return _Instance;
            }
        }
        private LotSupplyMaper() { }
        #endregion

        public PagedList<LotSuppliesModel> MapInfoFromGPROCommon(PagedList<LotSuppliesModel> objs)
        {
            if (objs.Count > 0)
            {
                using (var db = new GPROCommonEntities(AppGlobal.ConnectionstringGPROCommon))
                {
                    var customers = db.C_Customer.Where(x => !x.IsDeleted).ToList();
                    var warehouses = db.WareHouses.Where(x => !x.IsDeleted).ToList();
                    var materials = db.Materials.Where(x => !x.IsDeleted && !x.MaterialType.IsDeleted).ToList();
                    var units = db.C_Unit.Where(x => !x.IsDeleted).ToList();
                    var status = db.C_Status.Where(x => !x.IsDeleted).ToList();

                    for (int i = 0; i < objs.Count; i++)
                    {
                        dynamic found = customers.FirstOrDefault(x => x.Id == objs[i].CustomerId);
                        if (found != null)
                            objs[i].strCustomer = found.Name;

                        found = warehouses.FirstOrDefault(x => x.Id == objs[i].WareHouseId);
                        if (found != null)
                        {
                            objs[i].strWarehouse = found.Name;
                            objs[i].WareHouseIndex = found.Index;
                        }

                        found = materials.FirstOrDefault(x => x.Id == objs[i].MaterialId);
                        if (found != null)
                        {
                            objs[i].strMaterial = found.NameTM;
                            objs[i].MaterialIndex = found.Index;
                            objs[i].MaterialUnitId = found.UnitId;
                            objs[i].strMaterialUnit = found.C_Unit.Name;
                        }

                        found = customers.FirstOrDefault(x => x.Id == objs[i].CustomerId);
                        if (found != null)
                            objs[i].strCustomer = found.Name;

                        found = units.FirstOrDefault(x => x.Id == objs[i].MoneyTypeId);
                        if (found != null)
                            objs[i].strMoneyType = found.Name;

                        found = status.FirstOrDefault(x => x.Id == objs[i].StatusId);
                        if (found != null)
                            objs[i].strStatus = found.Name;

                        objs[i].strMaterial = "<span >" + objs[i].strMaterial + "</span> (<span class=\"red\">" + objs[i].MaterialIndex + "</span>)";
                        objs[i].strWarehouse = "<span >" + objs[i].strWarehouse + "</span> (<span class=\"red\">" + objs[i].WareHouseIndex + "</span>)";
                    }
                }
            }
            return objs;
        }

        public ReportInventoryModel MapInfoFromGPROCommon(ReportInventoryModel obj)
        {
            if (obj != null)
            {
                using (var db = new GPROCommonEntities(AppGlobal.ConnectionstringGPROCommon))
                {
                    var customers = db.C_Customer.Where(x => !x.IsDeleted).ToList();
                    var products = db.C_Product.Where(x => !x.IsDeleted).ToList();
                    var status = db.C_Status.Where(x => !x.IsDeleted).ToList();
                    var units = db.C_Unit.Where(x => !x.IsDeleted).ToList();
                    var warehouses = db.WareHouses.Where(x => !x.IsDeleted).ToList();
                    var materials = db.Materials.Where(x => !x.IsDeleted && !x.MaterialType.IsDeleted).ToList();

                    dynamic found = warehouses.FirstOrDefault(x => x.Id == obj.WarehouseId);
                    if (found != null)
                        obj.WarehouseName = found.Name;

                    found = materials.FirstOrDefault(x => x.Id == obj.MaterialId);
                    if (found != null)
                        obj.MaterialName = found.Name;

                    if (obj.Details.Count > 0)
                    {
                        foreach (var item in obj.Details)
                        {
                            found = materials.FirstOrDefault(x => x.Id == item.MaterialId);
                            if (found != null)
                            {
                                item.MaterialName = found.NameTM;
                                item.MaterialIndex = found.Index;
                                item.UnitId = found.UnitId;
                                item.UnitName = found.C_Unit.Name;
                            }

                            found = warehouses.FirstOrDefault(x => x.Id == item.StoreWarehouseId);
                            if (found != null)
                            {
                                item.StoreWareHouseName = found.Name;
                                item.StoreWareHouseIndex = found.Index;
                            }

                            found = units.FirstOrDefault(x => x.Id == item.MoneyTypeId);
                            if (found != null)
                                item.MoneyTypeName = found.Name;

                            item.MaterialCode = "" + item.MaterialIndex;
                            item.StoreWareHouseCode = "" + item.StoreWareHouseIndex;
                        }
                    }
                }
            }
            return obj;
        }

        public LotSuppliesModel MapInfoFromGPROCommon(LotSuppliesModel obj)
        {
            if (obj != null)
            {
                using (var db = new GPROCommonEntities(AppGlobal.ConnectionstringGPROCommon))
                {
                    var customers = db.C_Customer.Where(x => !x.IsDeleted).ToList();
                    var warehouses = db.WareHouses.Where(x => !x.IsDeleted).ToList();
                    var materials = db.Materials.Where(x => !x.IsDeleted && !x.MaterialType.IsDeleted).ToList();
                    var units = db.C_Unit.Where(x => !x.IsDeleted).ToList();
                    var status = db.C_Status.Where(x => !x.IsDeleted).ToList();

                    dynamic found = customers.FirstOrDefault(x => x.Id == obj.CustomerId);
                    if (found != null)
                        obj.strCustomer = found.Name;

                    found = warehouses.FirstOrDefault(x => x.Id == obj.WareHouseId);
                    if (found != null)
                    {
                        obj.strWarehouse = found.Name;
                        obj.WareHouseIndex = found.Index;
                    }

                    found = materials.FirstOrDefault(x => x.Id == obj.MaterialId);
                    if (found != null)
                    {
                        obj.strMaterial = found.NameTM;
                        obj.MaterialIndex = found.Index;
                        obj.MaterialUnitId = found.UnitId;
                        obj.strMaterialUnit = found.C_Unit.Name;
                    }

                    found = customers.FirstOrDefault(x => x.Id == obj.CustomerId);
                    if (found != null)
                        obj.strCustomer = found.Name;

                    found = units.FirstOrDefault(x => x.Id == obj.MoneyTypeId);
                    if (found != null)
                        obj.strMoneyType = found.Name;

                    found = status.FirstOrDefault(x => x.Id == obj.StatusId);
                    if (found != null)
                        obj.strStatus = found.Name;  
                }
            }
            return obj ;
        }

    }
}