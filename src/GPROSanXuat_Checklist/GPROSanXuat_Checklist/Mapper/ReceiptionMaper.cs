using GPROCommon.Data;
using GPROCommon.Repository;
using GPROSanXuat_Checklist.App_Global;
using GPROSanXuat_Checklist.Business.Model;
using PagedList;
using System.Collections.Generic;
using System.Linq;

namespace GPROSanXuat_Checklist.Mapper
{
    public class ReceiptionMaper
    {
        #region constructor 
        static object key = new object();
        private static volatile ReceiptionMaper _Instance;
        public static ReceiptionMaper Instance
        {
            get
            {
                if (_Instance == null)
                    lock (key)
                        _Instance = new ReceiptionMaper();

                return _Instance;
            }
        }
        private ReceiptionMaper() { }
        #endregion

        public PagedList<ReceiptionModel> MapInfoFromGPROCommon(PagedList<ReceiptionModel> objs)
        {
            if (objs.Count > 0)
            {
                using (var db = new GPROCommonEntities(AppGlobal.ConnectionstringGPROCommon))
                {
                    var customers = db.C_Customer.Where(x => !x.IsDeleted).ToList();
                    var status = db.C_Status.Where(x => !x.IsDeleted).ToList();
                    var warehouses = db.WareHouses.Where(x => !x.IsDeleted).ToList();
                    var units = db.C_Unit.Where(x => !x.IsDeleted).ToList();
                    var employees = EmployeeRepository.Instance.GetSelectItem(AppGlobal.ConnectionstringGPROCommon);
                    var users = UserRepository.Instance.GetSelectItem(AppGlobal.ConnectionstringGPROCommon);

                    for (int i = 0; i < objs.Count; i++)
                    {
                        dynamic found = customers.FirstOrDefault(x => x.Id == objs[i].FromCustomerId);
                        if (found != null)
                            objs[i].CustomerName = found.Name;

                        found = warehouses.FirstOrDefault(x => x.Id == objs[i].FromWarehouseId);
                        if (found != null)
                            objs[i].FromWareHouseName = found.Name;

                        found = warehouses.FirstOrDefault(x => x.Id == objs[i].StoreWarehouseId);
                        if (found != null)
                            objs[i].StoreWareHouseName = found.Name;

                        found = units.FirstOrDefault(x => x.Id == objs[i].MoneyTypeId);
                        if (found != null)
                            objs[i].MoneyTypeName = found.Name;

                        found = status.FirstOrDefault(x => x.Id == objs[i].StatusId);
                        if (found != null)
                            objs[i].StatusName = found.Name;

                        found = employees.FirstOrDefault(x => x.Value == objs[i].RecieverId);
                        if (found != null)
                            objs[i].RecieverName = found.Name;


                        if (objs[i].ApprovedUser.HasValue)
                        {
                            found = users.FirstOrDefault(x => x.Value == objs[i].ApprovedUser.Value);
                            if (found != null)
                                objs[i].ApprovedUserName = found.Name;
                        }

                    }
                }
            }
            return objs;
        }
         
    }

    public class ReceiptionDetailsMaper
    {
        #region constructor 
        static object key = new object();
        private static volatile ReceiptionDetailsMaper _Instance;
        public static ReceiptionDetailsMaper Instance
        {
            get
            {
                if (_Instance == null)
                    lock (key)
                        _Instance = new ReceiptionDetailsMaper();

                return _Instance;
            }
        }
        private ReceiptionDetailsMaper() { }
        #endregion

        public PagedList<ReceiptionDetailModel> MapInfoFromGPROCommon(PagedList<ReceiptionDetailModel> objs)
        {
            if (objs.Count > 0)
            {
                using (var db = new GPROCommonEntities(AppGlobal.ConnectionstringGPROCommon))
                {
                    var materials = db.Materials.Where(x => !x.IsDeleted && !x.MaterialType.IsDeleted).ToList();
                    var customers = db.WareHouses.Where(x => !x.IsDeleted).ToList();
                    var warehouses = db.WareHouses.Where(x => !x.IsDeleted).ToList();
                    var units = db.C_Unit.Where(x => !x.IsDeleted).ToList();

                    for (int i = 0; i < objs.Count; i++)
                    {
                        var _found = materials.FirstOrDefault(x => x.Id == objs[i].MaterialId);
                        if (_found != null)
                        {
                            objs[i].MaterialName = _found.NameTM;
                            objs[i].MaterialIndex = _found.Index;

                            objs[i].UnitId = _found.UnitId;
                            objs[i].UnitName = _found.C_Unit.Name;
                        }

                       dynamic found = materials.FirstOrDefault(x => x.Id == objs[i].CustomerId);
                        if (found != null)
                        {
                            objs[i].CustomerName = found.Name ;
                            objs[i].CustomerIndex = found.Index;
                        }

                        found = units.FirstOrDefault(x => x.Id == objs[i].MoneyTypeId);
                        if (found != null)
                            objs[i].MoneyTypeName = found.Name;
                         
                        found = warehouses.FirstOrDefault(x => x.Id == objs[i].WareHouseId);
                        if (found != null)
                        {
                            objs[i].WarehouseName =  found.Name ;
                        }
                    }
                }
            }
            return objs;
        }

        public  List<ReceiptionDetailModel> MapInfoFromGPROCommon( List<ReceiptionDetailModel> objs)
        {
            if (objs.Count > 0)
            {
                using (var db = new GPROCommonEntities(AppGlobal.ConnectionstringGPROCommon))
                {
                    var materials = db.Materials.Where(x => !x.IsDeleted && !x.MaterialType.IsDeleted).ToList();
                    var customers = db.WareHouses.Where(x => !x.IsDeleted).ToList();
                    var warehouses = db.WareHouses.Where(x => !x.IsDeleted).ToList();
                    var units = db.C_Unit.Where(x => !x.IsDeleted).ToList();

                    for (int i = 0; i < objs.Count; i++)
                    {
                        var _found = materials.FirstOrDefault(x => x.Id == objs[i].MaterialId);
                        if (_found != null)
                        {
                            objs[i].MaterialName = _found.NameTM;
                            objs[i].MaterialCode = "" + objs[i].MaterialIndex;
                            objs[i].MaterialIndex = _found.Index;

                            objs[i].UnitId = _found.UnitId;
                            objs[i].UnitName = _found.C_Unit.Name;
                        }

                        dynamic found = materials.FirstOrDefault(x => x.Id == objs[i].CustomerId);
                        if (found != null)
                        {
                            objs[i].CustomerName = found.Name;
                            objs[i].CustomerIndex = found.Index;
                        }

                        found = units.FirstOrDefault(x => x.Id == objs[i].MoneyTypeId);
                        if (found != null)
                            objs[i].MoneyTypeName = found.Name;

                        found = warehouses.FirstOrDefault(x => x.Id == objs[i].WareHouseId);
                        if (found != null)
                        {
                            objs[i].WarehouseName = found.Name + "(" + found.Index + ")"; ;
                            objs[i].WarehouseIndex = found.Index;                           
                        }
                    }
                }
            }
            return objs;
        }

    }
}