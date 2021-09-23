using GPROCommon.Enums;
using GPROCommon.Helper;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Hosting;

namespace GPROSanXuat_Checklist.App_Global
{
    public static partial class AppGlobal
    {
        public static string MODULE_NAME = "GPRO_SANXUAT_CHECKLIST";
        public static string ProductCode = "GPRO_SANXUAT_CHECKLIST";
        public static string DatabasePath = (HttpContext.Current.Server.MapPath("~/Config_XML") + "\\DATA.XML");

        private static string _connectionstringSanXuatChecklist;
        public static string ConnectionstringSanXuatChecklist
        {
            get
            {
                if (string.IsNullOrEmpty(_connectionstringSanXuatChecklist))
                {
                    _connectionstringSanXuatChecklist = Database.Instance.GetEntityConnectString(AppGlobal.DatabasePath, eSystemModel.GPROSanXuat_Checklist, eSystem.GPROSanXuat_Checklist);
                }
                return _connectionstringSanXuatChecklist;
            }
        }

        private static string _connectionstringGPROCommon;
        public static string ConnectionstringGPROCommon
        {
            get
            {
                if (string.IsNullOrEmpty(_connectionstringGPROCommon))
                {
                    _connectionstringGPROCommon = Database.Instance.GetEntityConnectString(AppGlobal.DatabasePath, eSystemModel.GPROCommon, eSystem.GPROCommon);
                }
                return _connectionstringGPROCommon;
            }
        }

        private static string _connectionstringPMS;
        public static string ConnectionstringPMS
        {
            get
            {
                if (string.IsNullOrEmpty(_connectionstringPMS))
                {
                    _connectionstringPMS = Database.Instance.GetEntityConnectString(AppGlobal.DatabasePath, eSystemModel.GPROPMS, eSystem.GPROPMS);
                }
                return _connectionstringPMS;
            }
        }

        //private static SqlConnection _sqlConnection;
        //public static SqlConnection sqlConnection
        //{
        //    get
        //    {
        //        if (_sqlConnection == null)
        //        {
        //            _sqlConnection = GPRO.Core.Hai.DatabaseConnection.Instance.Connect(HttpContext.Current.Server.MapPath("~/Config_XML") + "\\DATA.XML");  
        //        }
        //        return _sqlConnection;
        //    }
        //}

    }
}