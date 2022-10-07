using GPROCommon.Data;
using GPROSanXuat_Checklist.App_Global;
using PagedList;
using PMS.Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace GPROSanXuat_Checklist.Mapper
{
    public class ProductionPlanMapper
    {
        #region constructor 
        static object key = new object();
        private static volatile ProductionPlanMapper _Instance;
        public static ProductionPlanMapper Instance
        {
            get
            {
                if (_Instance == null)
                    lock (key)
                        _Instance = new ProductionPlanMapper();

                return _Instance;
            }
        }
        private ProductionPlanMapper() { }
        #endregion

        public PagedList<ProductionPlanPerMonthModel> MapInfoFromGPROCommon(PagedList<ProductionPlanPerMonthModel> objs)
        {
            if (objs.Count > 0)
            {
                using (var db = new GPROCommonEntities(AppGlobal.ConnectionstringGPROCommon))
                {
                    var phases = db.Phases.Where(x => !x.IsDeleted).ToList();  

                    for (int i = 0; i < objs.Count; i++)
                    {
                        Phase _phase = phases.FirstOrDefault(x => x.Id == objs[i].PhaseId);
                        if (_phase != null)
                            objs[i].PhaseName = _phase.Name; 
                    }
                }
            }
            return objs;
        }

    }
}