using GPROSanXuat_Checklist.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GPROSanXuat_Checklist.Business.Model
{
   public class DeliveryModel : Delivery
    {
        public string strDeliverier { get; set; }
        public string strApprover { get; set; }
        public string strCustomer { get; set; }
        public string strWarehouse { get; set; } 
        public string TienTe { get; set; }
        public string Code { get; set; }
        public double Total { get; set; }
        public int ActionUser { get; set; }

        public int OrderId { get; set; }
        public string OrderCode { get; set; }
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public string StatusName { get; set; }
    }
}
