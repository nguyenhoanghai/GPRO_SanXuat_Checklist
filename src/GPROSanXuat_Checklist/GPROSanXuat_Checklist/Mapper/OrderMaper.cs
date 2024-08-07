﻿using GPROCommon.Data;
using GPROCommon.Repository;
using GPROSanXuat_Checklist.App_Global;
using GPROSanXuat_Checklist.Business.Model;
using PagedList;
using System.Collections.Generic;
using System.Linq;

namespace GPROSanXuat_Checklist.Mapper
{
    public class OrderMaper
    {
        #region constructor 
        static object key = new object();
        private static volatile OrderMaper _Instance;
        public static OrderMaper Instance
        {
            get
            {
                if (_Instance == null)
                    lock (key)
                        _Instance = new OrderMaper();

                return _Instance;
            }
        }
        private OrderMaper() { }
        #endregion

        public PagedList<OrderModel> MapInfoFromGPROCommon(PagedList<OrderModel> objs)
        {
            if (objs.Count > 0)
            {
                using (var db = new GPROCommonEntities(AppGlobal.ConnectionstringGPROCommon))
                {
                    var customers = db.C_Customer.Where(x => !x.IsDeleted).ToList();
                    var units = db.C_Unit.Where(x => !x.IsDeleted).ToList();
                    var status = db.C_Status.Where(x => !x.IsDeleted).ToList();
                    var users = UserRepository.Instance.GetSelectItem(AppGlobal.ConnectionstringGPROCommon);

                    for (int i = 0; i < objs.Count; i++)
                    {
                        dynamic found = customers.FirstOrDefault(x => x.Id == objs[i].CustomerId);
                        if (found != null)
                            objs[i].CustomerName = found.Name;

                        found = units.FirstOrDefault(x => x.Id == objs[i].MoneyUnitId);
                        if (found != null)
                            objs[i].MoneyTypeName = found.Name;

                        found = status.FirstOrDefault(x => x.Id == objs[i].StatusId);
                        if (found != null)
                            objs[i].StatusName = found.Name;

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

        public OrderModel MapInfoFromGPROCommon(OrderModel obj)
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
     
}