using GPROCommon.Data;
using GPROCommon.Models;
using GPROSanXuat_Checklist.App_Global;
using GPROSanXuat_Checklist.Business.Model;
using System;
using System.Collections.Generic;
using System.Linq;

namespace GPROSanXuat_Checklist.Mapper
{
    public class ChecklistMaper
    {
        #region constructor 
        static object key = new object();
        private static volatile ChecklistMaper _Instance;
        public static ChecklistMaper Instance
        {
            get
            {
                if (_Instance == null)
                    lock (key)
                        _Instance = new ChecklistMaper();

                return _Instance;
            }
        }
        private ChecklistMaper() { }
        #endregion

        public List<ChecklistModel> MapInfoFromGPROCommon(List<ChecklistModel> objs)
        {
            if (objs.Count > 0)
            {
                using (var db = new GPROCommonEntities(AppGlobal.ConnectionstringGPROCommon))
                {
                    // var lines = db.C_Line.Where(x => !x.IsDeleted).ToList();
                    var customers = db.C_Customer.Where(x => !x.IsDeleted).ToList();
                    var products = db.C_Product.Where(x => !x.IsDeleted).ToList();
                    var status = db.C_Status.Where(x => !x.IsDeleted).ToList();

                    for (int i = 0; i < objs.Count; i++)
                    {
                        //dynamic found = lines.FirstOrDefault(x => x.Id == objs[i].LineId);
                        //if (found != null)
                        //    objs[i].LineName = found.Name;
                        dynamic found;
                        if (objs[i].CustomerId.HasValue)
                        {
                            found = customers.FirstOrDefault(x => x.Id == objs[i].CustomerId.Value);
                            if (found != null)
                                objs[i].CustomerName = found.Name;
                        }

                        found = status.FirstOrDefault(x => x.Id == objs[i].StatusId);
                        if (found != null)
                            objs[i].StatusName = found.Name;

                        if (objs[i].ProductId.HasValue)
                        {
                            var _found = products.FirstOrDefault(x => x.Id == objs[i].ProductId);
                            if (_found != null)
                            {
                                objs[i].SizeName = _found.C_Size.Name;
                                objs[i].ProductUnit = _found.C_Unit.Name;
                                objs[i].ProductName = _found.Name;
                            }
                        }
                    }
                }
            }
            return objs;
        }

        public ChecklistModel MapInfoFromGPROCommon(ChecklistModel obj)
        {
            if (obj != null)
            {
                using (var db = new GPROCommonEntities(AppGlobal.ConnectionstringGPROCommon))
                {
                    // var lines = db.C_Line.Where(x => !x.IsDeleted).ToList();
                    var customers = db.C_Customer.Where(x => !x.IsDeleted).ToList();
                    var products = db.C_Product.Where(x => !x.IsDeleted).ToList();
                    var status = db.C_Status.Where(x => !x.IsDeleted).ToList();
                    var employees = db.SUsers.Where(x => !x.IsDeleted).Select(x => new ModelSelectItem() { Value = x.Id, Name = x.UserName }).ToList();

                    //dynamic found = lines.FirstOrDefault(x => x.Id == obj.LineId);
                    //if (found != null)
                    //    obj.LineName = found.Name;

                    dynamic found;
                    if (obj.CustomerId.HasValue)
                    {
                        found = customers.FirstOrDefault(x => x.Id == obj.CustomerId);
                        if (found != null)
                            obj.CustomerName = found.Name;
                    }

                    found = status.FirstOrDefault(x => x.Id == obj.StatusId);
                    if (found != null)
                        obj.StatusName = found.Name;

                    if (obj.ProductId.HasValue)
                    {
                        var _found = products.FirstOrDefault(x => x.Id == obj.ProductId);
                        if (_found != null)
                        {
                            obj.SizeName = _found.C_Size.Name;
                            obj.ProductUnit = _found.C_Unit.Name;
                            obj.ProductName = _found.Name;
                        }
                    }

                    if (obj.JobSteps.Count > 0)
                    {
                        for (int i = 0; i < obj.JobSteps.Count; i++)
                        {
                            if (obj.JobSteps[i].EmployeeId.HasValue)
                            {
                                found = employees.FirstOrDefault(x => x.Id == obj.JobSteps[i].EmployeeId);
                                if (found != null)
                                    obj.JobSteps[i].EmployeeName = found.Name;
                            }
                            obj.JobSteps[i].RelatedEmployeeName = getRelatedEmployeeName(obj.JobSteps[i].RelatedEmployees, employees);

                            found = status.FirstOrDefault(x => x.Id == obj.JobSteps[i].StatusId);
                            if (found != null)
                                obj.JobSteps[i].StatusName = found.Name;
                        }
                    }

                }
            }
            return obj;
        }

        public string getRelatedEmployeeName(string relatedIds, List<ModelSelectItem> employees)
        {
            if (!string.IsNullOrEmpty(relatedIds))
            {
                var Ids = relatedIds.Split(',').Select(x => Convert.ToInt32(x)).ToArray();
                var relatedEs = employees.Where(x => Ids.Contains(x.Value)).Select(x => x.Name).ToArray();
                return string.Join(",", relatedEs);
            }
            return "";
        }


        public List<Checklist_JobModel> MapInfoFromGPROCommon(List<Checklist_JobModel> objs)
        {
            if (objs.Count > 0)
            {
                using (var db = new GPROCommonEntities(AppGlobal.ConnectionstringGPROCommon))
                {
                    var employees = db.SUsers.Where(x => !x.IsDeleted).Select(x => new ModelSelectItem() { Value = x.Id, Name =  x.Name   }).ToList();
                    var status = db.C_Status.Where(x => !x.IsDeleted).ToList();

                    for (int i = 0; i < objs.Count; i++)
                    {
                        dynamic found = status.FirstOrDefault(x => x.Id == objs[i].StatusId);
                        if (found != null)
                            objs[i].StatusName = found.Name;

                        if (objs[i].EmployeeId.HasValue)
                        {
                            found = employees.FirstOrDefault(x => x.Id == objs[i].EmployeeId);
                            if (found != null)
                                objs[i].EmployeeName = found.Name;
                        }
                        objs[i].RelatedEmployeeName = getRelatedEmployeeName(objs[i].RelatedEmployees, employees);
                    }
                }
            }
            return objs;
        }


    }
}