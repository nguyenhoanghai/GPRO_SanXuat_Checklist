using GPROSanXuat_Checklist.Data;
using System;

namespace GPROSanXuat_Checklist.Business.Model
{
    public class ReceiptionModel :  Receiption
    {
        public string Code { get; set; }
        public string FromWareHouseName { get; set; }
        public string StoreWareHouseName { get; set; }
        public string CustomerName { get; set; }
        public string MoneyTypeName { get; set; }
        public string RecieverName { get; set; }
        public string StatusName { get; set; }
        public string ApprovedUserName { get; set; }
        public string TransactionTypeName { get; set; }
        public double Total { get; set; }
        public bool IsApproved { get; set; }
    }
 
}
