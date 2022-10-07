using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace GPROSanXuat_Checklist
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");
            routes.MapRoute(
                name: "OutOfDate",
                url: "OutOfDate",
                defaults: new { controller = "Shared", action = "UnActived" }
            );
            routes.MapRoute(
              name: "khach-hang",
              url: "khach-hang",
              defaults: new { controller = "customer", action = "Index", id = UrlParameter.Optional }
          );
            routes.MapRoute(
              name: "chuyen",
              url: "chuyen",
              defaults: new { controller = "line", action = "Index", id = UrlParameter.Optional }
          );
            routes.MapRoute(
             name: "nhan-vien",
             url: "nhan-vien",
             defaults: new { controller = "employee", action = "Index", id = UrlParameter.Optional }
         );
            routes.MapRoute(
            name: "cau-hinh",
            url: "cau-hinh",
            defaults: new { controller = "appconfig", action = "Index", id = UrlParameter.Optional }
        );
            routes.MapRoute(
              name: "phieu-xuat-kho",
              url: "phieu-xuat-kho",
              defaults: new { controller = "Delivery", action = "Index", id = UrlParameter.Optional });

            routes.MapRoute(
              name: "thiet-bi",
              url: "thiet-bi",
              defaults: new { controller = "equipment", action = "Index", id = UrlParameter.Optional });

            routes.MapRoute(
              name: "nhom-thiet-bi",
              url: "nhom-thiet-bi",
              defaults: new { controller = "equipmentgroup", action = "Index", id = UrlParameter.Optional });

            routes.MapRoute(
              name: "loai-thiet-bi",
              url: "loai-thiet-bi",
              defaults: new { controller = "equipmenttype", action = "Index", id = UrlParameter.Optional });

            routes.MapRoute(
               name: "lo-vat-tu",
               url: "lo-vat-tu",
               defaults: new { controller = "LotSupplies", action = "Index", id = UrlParameter.Optional }
           );

            routes.MapRoute(
             name: "vat-tu",
             url: "vat-tu",
             defaults: new { controller = "materialtype", action = "Index", id = UrlParameter.Optional }
         );

            routes.MapRoute(
               name: "don-hang",
               url: "don-hang",
               defaults: new { controller = "Order", action = "Index", id = UrlParameter.Optional }
           );

            routes.MapRoute(
               name: "po",
               url: "po",
               defaults: new { controller = "po", action = "Index", id = UrlParameter.Optional }
           );

            routes.MapRoute(
               name: "don-vi-tinh",
               url: "don-vi-tinh",
               defaults: new { controller = "unittype", action = "Index", id = UrlParameter.Optional }
           );

            routes.MapRoute(
           name: "mau-bieu-mau",
           url: "mau-bieu-mau",
           defaults: new { controller = "templatefile", action = "Index", id = UrlParameter.Optional }
       );

            routes.MapRoute(
           name: "bieu-mau",
           url: "bieu-mau",
           defaults: new { controller = "productionfile", action = "Index", id = UrlParameter.Optional }
       );

            routes.MapRoute(
              name: "kich-co",
              url: "kich-co",
              defaults: new { controller = "size", action = "Index", id = UrlParameter.Optional }
          );

            routes.MapRoute(
              name: "trang-thai",
              url: "trang-thai",
              defaults: new { controller = "statustype", action = "Index", id = UrlParameter.Optional }
          );

            routes.MapRoute(
                           name: "san-pham",
                           url: "san-pham",
                           defaults: new { controller = "product", action = "Index", id = UrlParameter.Optional }
                       );

            routes.MapRoute(
                          name: "phan-quyen",
                          url: "phan-quyen",
                          defaults: new { controller = "role", action = "UnActived" }
                      );

            routes.MapRoute(
               name: "tai-khoan",
               url: "tai-khoan",
               defaults: new { controller = "user", action = "UnActived" }
           );

            routes.MapRoute(
              name: "mau-checklist",
              url: "mau-checklist",
              defaults: new { controller = "templatechecklist", action = "Index", id = UrlParameter.Optional }
          );

            routes.MapRoute(
             name: "phan-xuong",
             url: "phan-xuong",
             defaults: new { controller = "workshop", action = "Index", id = UrlParameter.Optional }
         );

            routes.MapRoute(
            name: "lau",
            url: "lau",
            defaults: new { controller = "floor", action = "Index", id = UrlParameter.Optional }
        );

            routes.MapRoute(
              name: "kho",
              url: "kho",
              defaults: new { controller = "warehouse", action = "Index", id = UrlParameter.Optional }
          );

            routes.MapRoute(
               name: "phieu-nhap-kho",
               url: "phieu-nhap-kho",
               defaults: new { controller = "Receiption", action = "Index", id = UrlParameter.Optional }
           );

            routes.MapRoute(
               name: "phan-tich-checklist",
               url: "phan-tich-checklist",
               defaults: new { controller = "Checklist", action = "Index", id = UrlParameter.Optional }
           );
            routes.MapRoute(
               name: "duyet-cong-viec",
               url: "duyet-cong-viec",
               defaults: new { controller = "ChecklistApprove", action = "Index", id = UrlParameter.Optional }
           );
            routes.MapRoute(
              name: "bao-cao-vat-tu-kho",
              url: "bao-cao-vat-tu-kho",
              defaults: new { controller = "LotSupplies", action = "ReportInventory", id = UrlParameter.Optional }
          );
            routes.MapRoute(
             name: "bao-cao-ton-kho",
             url: "bao-cao-ton-kho",
             defaults: new { controller = "LotSupplies", action = "ReportInventory_w", id = UrlParameter.Optional }
         );
            routes.MapRoute(
             name: "bao-cao-xuat-kho-ma-hang",
             url: "bao-cao-xuat-kho-ma-hang",
             defaults: new { controller = "Delivery", action = "Export_Cust", id = UrlParameter.Optional }
         );

            routes.MapRoute(
             name: "bao-cao-nhap-kho-ma-hang",
             url: "bao-cao-nhap-kho-ma-hang",
             defaults: new { controller = "Receiption", action = "Export_Cust", id = UrlParameter.Optional }
         );

            routes.MapRoute(
            name: "bao-cao-tien-do-san-xuat",
            url: "bao-cao-tien-do-san-xuat",
            defaults: new { controller = "PMSReport", action = "TienDoSX", id = UrlParameter.Optional }
        );

            routes.MapRoute(
         name: "ke-hoach-san-xuat-nam",
         url: "ke-hoach-san-xuat-nam",
         defaults: new { controller = "PMSReport", action = "ProductionPlanInYear", id = UrlParameter.Optional }
     );
            routes.MapRoute(
        name: "ke-hoach-san-xuat-thang",
        url: "ke-hoach-san-xuat-thang",
        defaults: new { controller = "PMSReport", action = "ProductionPlanInMonth", id = UrlParameter.Optional }
    );

            routes.MapRoute(
             name: "ket-noi-csdl",
             url: "ket-noi-csdl",
             defaults: new { controller = "sqlconnect", action = "index", id = UrlParameter.Optional }
         );

            routes.MapRoute(
           name: "phan-hang-sx",
           url: "phan-hang-sx",
           defaults: new { controller = "Assignment", action = "index", id = UrlParameter.Optional }
       );
            routes.MapRoute(
         name: "cong-doan",
         url: "cong-doan",
         defaults: new { controller = "phase", action = "index", id = UrlParameter.Optional }
     );
            routes.MapRoute(
                     name: "dinh-muc-san-xuat",
                     url: "dinh-muc-san-xuat",
                     defaults: new { controller = "ProductionPlan", action = "index", id = UrlParameter.Optional }
                 );
            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}
