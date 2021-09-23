using GPROSanXuat_Checklist.Data;
using System;

namespace GPROSanXuat_Checklist.Business.Model
{
    public class ReceiptionDetailModel :  ReceiptionDetail
    {
        public string Name { get; set; }
        public string Code { get; set; }
        public int Index { get; set; }
        public int MaterialId { get; set; }
        public string MaterialName { get; set; }
        public int MaterialIndex { get; set; }
        public int CustomerId { get; set; }
        public string CustomerName { get; set; }
        public int CustomerIndex { get; set; }
        public int WareHouseId { get; set; }
        public string WarehouseName { get; set; }
        public int WarehouseIndex { get; set; }
        public double Quantity { get; set; }
        public double QuantityUsed { get; set; }
        public double Price { get; set; }
        public DateTime InputDate { get; set; }
        public DateTime ManufactureDate { get; set; }
        public DateTime? ExpiryDate { get; set; }
        public DateTime? WarrantyDate { get; set; }
        public int MoneyTypeId { get; set; }
        public string MoneyTypeName { get; set; }
        public double ExchangeRate { get; set; }
        public int UnitId { get; set; }
        public string UnitName { get; set; }
        public int StatusId { get; set; }
        public string StatusName { get; set; }
        public string Note { get; set; }

        //dung cho xuat file excel
        public string ReceiptionName { get; set; }
        public string ReceiptionCode { get; set; }
        public int ReceiptionIndex { get; set; }
        public string MaterialCode { get; set; }
        public double Total { get; set; }
        public double UnitInStock { get; set; } // so luong ton

        public int Receiver { get; set; }
        public string ReceiverName { get; set; }
        public int? ApprovedUser { get; set; }
        public string ApprovedUserName { get; set; }
        public DateTime? ApprovedDate { get; set; }

    }
}
