using GPROCommon.Data;
using GPROSanXuat_Checklist.App_Global;
using GPROSanXuat_Checklist.Business;
using PMS.Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace GPROSanXuat_Checklist.Mapper
{
    public class AssignmentMapper
    {
        #region constructor 
        static object key = new object();
        private static volatile AssignmentMapper _Instance;
        public static AssignmentMapper Instance
        {
            get
            {
                if (_Instance == null)
                    lock (key)
                        _Instance = new AssignmentMapper();

                return _Instance;
            }
        }
        private AssignmentMapper() { }
        #endregion

        public List<TienDoModel> MapInfoFromGPROCommon(List<TienDoModel> objs)
        {
            if (objs.Count > 0)
            {
                using (var db = new GPROCommonEntities(AppGlobal.ConnectionstringGPROCommon))
                {
                    var products = db.C_Product.Where(x => !x.IsDeleted).ToList();
                    var lines = db.C_Line.Where(x => !x.IsDeleted).ToList();
                    var lenhSX = BLLLenhSX.Instance.GetLenhProductById(AppGlobal.ConnectionstringSanXuatChecklist, objs[0].Lenh_ProId.Value);
                    var customers = db.C_Customer.Where(x => !x.IsDeleted).ToList();

                    //var units = db.C_Unit.Where(x => !x.IsDeleted).ToList();
                    //var users = UserRepository.Instance.GetSelectItem(AppGlobal.ConnectionstringGPROCommon);

                    for (int i = 0; i < objs.Count; i++)
                    {
                        dynamic found = products.FirstOrDefault(x => x.Id == objs[i].ProId);
                        if (found != null)
                            objs[i].ProName = found.Name;

                        var _line = lines.FirstOrDefault(x => x.Id == objs[i].LineId);
                        if (_line != null)
                            objs[i].LineName = _line.Name;

                        if (lenhSX != null)
                        {
                            var _cust = customers.FirstOrDefault(x => x.Id == (int)lenhSX.intVal);
                            if (_cust != null)
                                objs[i].CustName = _cust.Name;
                        }

                    }
                }
            }
            return objs;
        }

        public List<ProductionPlanModel> MapInfoFromGPROCommon(List<ProductionPlanModel> objs)
        {
            if (objs.Count > 0)
            {
                using (var db = new GPROCommonEntities(AppGlobal.ConnectionstringGPROCommon))
                {
                    var products = db.C_Product.Where(x => !x.IsDeleted).ToList();
                    var lines = db.C_Line.Where(x => !x.IsDeleted).ToList();
                    //
                    var customers = db.C_Customer.Where(x => !x.IsDeleted).ToList();

                    //var units = db.C_Unit.Where(x => !x.IsDeleted).ToList();
                    //var users = UserRepository.Instance.GetSelectItem(AppGlobal.ConnectionstringGPROCommon);

                    for (int i = 0; i < objs.Count; i++)
                    {  
                            dynamic found = products.FirstOrDefault(x => x.Id == objs[i].ProId);
                            if (found != null)
                                objs[i].ProName = found.Name;

                            var _line = lines.FirstOrDefault(x => x.Id == objs[i].LineId);
                            if (_line != null)
                                objs[i].LineName = _line.Name;

                            if (objs[i].LenhProId.HasValue)
                            {
                                var lenhSX = BLLLenhSX.Instance.GetLenhProductById(AppGlobal.ConnectionstringSanXuatChecklist, objs[i].LenhProId.Value);
                                if (lenhSX != null)
                                {
                                    var _cust = customers.FirstOrDefault(x => x.Id == (int)lenhSX.intVal);
                                    if (_cust != null)
                                        objs[i].CustName = _cust.Name;
                                }

                            }
                     


                    }
                }
            }
            return objs;
        }


        public List<AssignmentModel> MapInfoFromGPROCommon(List<AssignmentModel> objs)
        {
            if (objs.Count > 0)
            {
                using (var db = new GPROCommonEntities(AppGlobal.ConnectionstringGPROCommon))
                {
                    var products = db.C_Product.Where(x => !x.IsDeleted).ToList();
                    var lines = db.C_Line.Where(x => !x.IsDeleted).ToList();

                    var customers = db.C_Customer.Where(x => !x.IsDeleted).ToList();

                    //var units = db.C_Unit.Where(x => !x.IsDeleted).ToList();
                    //var users = UserRepository.Instance.GetSelectItem(AppGlobal.ConnectionstringGPROCommon);

                    for (int i = 0; i < objs.Count; i++)
                    {
                        dynamic found = products.FirstOrDefault(x => x.Id == objs[i].ProductId);
                        if (found != null)
                            objs[i].CommoName = found.Name;

                        var _line = lines.FirstOrDefault(x => x.Id == objs[i].LineId);
                        if (_line != null)
                            objs[i].LineName = _line.Name;

                        if (objs[i].LenhProductId.HasValue)
                        {
                            var lenhSX = BLLLenhSX.Instance.GetLenhProductById(AppGlobal.ConnectionstringSanXuatChecklist, objs[i].LenhProductId.Value);
                            if (lenhSX != null)
                            {
                                var _cust = customers.FirstOrDefault(x => x.Id == (int)lenhSX.intVal);
                                if (_cust != null)
                                    objs[i].CustName = _cust.Name;
                            }
                        }
                    }
                }
            }

            return objs;
        }
    }
}