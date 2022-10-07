using GPROCommon.Data;
using GPROCommon.Models;
using GPROCommon.Repository;
using GPROSanXuat_Checklist.App_Global;
using GPROSanXuat_Checklist.Business.Model;
using PagedList;
using System.Collections.Generic;
using System.Linq;

namespace GPROSanXuat_Checklist.Mapper
{
    public class LenhMaper
    {
        #region constructor 
        static object key = new object();
        private static volatile LenhMaper _Instance;
        public static LenhMaper Instance
        {
            get
            {
                if (_Instance == null)
                    lock (key)
                        _Instance = new LenhMaper();

                return _Instance;
            }
        }
        private LenhMaper() { }
        #endregion

        public PagedList<LenhModel> MapInfoFromGPROCommon(PagedList<LenhModel> objs)
        {
            if (objs.Count > 0)
            {
                using (var db = new GPROCommonEntities(AppGlobal.ConnectionstringGPROCommon))
                {
                    var products = db.C_Product.Where(x => !x.IsDeleted).ToList();
                    var materials = db.Materials.Where(x => !x.IsDeleted).ToList();
                    var employees = EmployeeRepository.Instance.GetSelectItem(AppGlobal.ConnectionstringGPROCommon);
                    var status = db.C_Status.Where(x => !x.IsDeleted).ToList();

                    //var units = db.C_Unit.Where(x => !x.IsDeleted).ToList();
                    //var users = UserRepository.Instance.GetSelectItem(AppGlobal.ConnectionstringGPROCommon);

                    for (int i = 0; i < objs.Count; i++)
                    {
                        dynamic found = employees.FirstOrDefault(x => x.Value == objs[i].EmployeeId);
                        if (found != null)
                            objs[i].EmployeeName = found.Name;

                        var f2 = status.FirstOrDefault(x => x.Id == objs[i].StatusId);
                        if (f2 != null)
                            objs[i].StatusName = f2.Name;

                        if (objs[i].Products.Count > 0)
                        {
                            foreach (var item in objs[i].Products)
                            {
                                var f1 = products.FirstOrDefault(x => x.Id == item.ProductId);
                                if (f1 != null)
                                {
                                    item.ProductName = f1.Name;
                                    item.UnitName = f1.C_Unit.Name;
                                }
                            }
                        }

                        if (objs[i].Materials.Count > 0)
                        {
                            foreach (var item in objs[i].Materials)
                            {
                                var f1 = materials.FirstOrDefault(x => x.Id == item.MaterialId);
                                if (f1 != null)
                                {
                                    item.MaterialName = f1.NameTM;
                                    item.UnitName = f1.C_Unit.Name;
                                }
                            }
                        }



                        //if (objs[i].ApprovedUser.HasValue)
                        //{
                        //    found = users.FirstOrDefault(x => x.Value == objs[i].ApprovedUser.Value);
                        //    if (found != null)
                        //        objs[i].ApprovedUserName = found.Name;
                        //}

                    }
                }
            }
            return objs;
        }

        public LenhModel MapInfoFromGPROCommon(LenhModel obj)
        {
            if (obj != null)
            {
                using (var db = new GPROCommonEntities(AppGlobal.ConnectionstringGPROCommon))
                {
                    var products = db.C_Product.Where(x => !x.IsDeleted).ToList();
                    var materials = db.Materials.Where(x => !x.IsDeleted).ToList();
                    var employees = EmployeeRepository.Instance.GetSelectItem(AppGlobal.ConnectionstringGPROCommon);
                    var status = db.C_Status.Where(x => !x.IsDeleted).ToList();


                    dynamic found = employees.FirstOrDefault(x => x.Value == obj.EmployeeId);
                    if (found != null)
                        obj.EmployeeName = found.Name;

                    var f2 = status.FirstOrDefault(x => x.Id == obj.StatusId);
                    if (f2 != null)
                        obj.StatusName = f2.Name;

                    if (obj.Products.Count > 0)
                    {
                        foreach (var item in obj.Products)
                        {
                            var f1 = products.FirstOrDefault(x => x.Id == item.ProductId);
                            if (f1 != null)
                            {
                                item.ProductName = f1.Name;
                                item.UnitName = f1.C_Unit.Name;
                            }
                        }
                    }

                    if (obj.Materials.Count > 0)
                    {
                        foreach (var item in obj.Materials)
                        {
                            var f1 = materials.FirstOrDefault(x => x.Id == item.MaterialId);
                            if (f1 != null)
                            {
                                item.MaterialName = f1.NameTM;
                                item.UnitName = f1.C_Unit.Name;
                            }
                        }
                    }
                }
            }
            return obj;
        }

        public List<ModelSelectItem> MapInfoFromGPROCommon(List<ModelSelectItem> objs)
        {
            if (objs.Count > 0)
            {
                using (var db = new GPROCommonEntities(AppGlobal.ConnectionstringGPROCommon))
                {
                    var employees = EmployeeRepository.Instance.GetSelectItem(AppGlobal.ConnectionstringGPROCommon);
                    ModelSelectItem _employ;
                    foreach (var item in objs)
                    {
                        _employ = employees.FirstOrDefault(x => x.Value == item.Id);
                        if (_employ != null)
                            item.Name = _employ.Name;
                    }
                }
            }
            return objs;
        }

        public List<ModelSelectItem> MapInfoLenhProducts(List<ModelSelectItem> objs)
        {
            if (objs.Count > 0)
            {
                using (var db = new GPROCommonEntities(AppGlobal.ConnectionstringGPROCommon))
                {
                    var products = db.C_Product.Where(x => !x.IsDeleted).ToList();
                    var custs = db.C_Customer.Where(x => !x.IsDeleted).ToList();
                    C_Product _pro;
                    C_Customer _cust;
                    foreach (var item in objs)
                    {
                        _pro = products.FirstOrDefault(x => x.Id == item.Value);
                        if (_pro != null)
                            item.Code = _pro.Name;

                        _cust = custs.FirstOrDefault(x => x.Id == (int)item.Data1);
                        if (_cust != null)
                            item.Name = _cust.Name;
                    }
                }
            }
            return objs;
        }

    }

}