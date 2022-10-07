using GPROSanXuat_Checklist.Data;
using System;
using System.Collections.Generic;

namespace GPROSanXuat_Checklist.Business.Model
{
    public class PO_SellModel : PO_Sell
    {
        public int ActionUser { get; set; }
        public string CustomerName { get; set; }
        public string MoneyTypeName { get; set; }
        public string StatusName { get; set; }
        public double Total { get; set; }
        public string ApprovedUserName { get; set; }
        public List<PO_SellDetailModel> Details { get; set; }
        public PO_SellModel()
        {
            Details = new List<PO_SellDetailModel>();
        }
    }

    public class PO_SellDetailModel : PO_SellDetail
    {
        public int ActionUser { get; set; }
        public string ProductSize { get; set; }
        public string ProductUnit { get; set; }
        public string ProductName { get; set; }
        public string ProductSpecifications { get; set; }
        public string ProductNote { get; set; }
        public double Total { get; set; }
    }

    public class PO_SellDetailFilterModel
    {
        public int POId { get; set; }
        public int Id { get; set; }
        public string Code { get; set; }

        public int CustomerId { get; set; }
        public string CustomerName { get; set; }
        public string Phone { get; set; }

        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public string ProductUnit { get; set; }
        public string ProductSize { get; set; }
        public string Image { get; set; }

        public int MoneyUnitId { get; set; }
        public string MoneyTypeName { get; set; }

        public DateTime  DeliveryDate { get; set; }
        public double Exchange { get; set; }

        public int StatusId { get; set; }
        public string StatusName { get; set; }

        public int Quantities { get; set; }
        public int Quantities_PC { get; set; }
        public int Quantities_Lenh { get; set; }
        public double Price { get; set; }

        public string Note { get; set; }
    }
}
