
using GPROSanXuat_Checklist.Data;
using System.Collections.Generic; 

namespace GPROSanXuat_Checklist.Business.Model
{
    public class OrderModel : Order
    {
        public int ActionUser { get; set; }   
        public string CustomerName { get; set; }
        public string MoneyTypeName { get; set; }
        public string StatusName { get; set; }
        public double Total { get; set; }
        public string ApprovedUserName { get; set; }
        public List<OrderDetailModel> Details { get; set; }
        public OrderModel()
        {
            Details = new List<OrderDetailModel>();
        }
    }

    public class OrderDetailModel : OrderDetail
    {
        public int ActionUser { get; set; } 
        public string ProductSize { get; set; }
        public string ProductUnit { get; set; }
        public string ProductName { get; set; }
        public string ProductSpecifications { get; set; }
        public string ProductNote { get; set; } 
        public double Total { get; set; }
    }
}
