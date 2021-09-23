using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GPROSanXuat_Checklist.Business.Model
{
   public class SuppliesModel
    {
        public int Index { get; set; }
        public string Name { get; set; }
        public int StoreWareHouseId { get; set; }
        public string WareHouseName { get; set; }
        public int StatusId { get; set; }
        public string StatusName { get; set; }
        public string MoneyTypeName { get; set; }
        public int MoneyTypeId { get; set; }
        public int ReDetailId { get; set; }
        public double ExchangeRate { get; set; }
        public int UnitId { get; set; }
        public string UnitName { get; set; }
        public double Quantity { get; set; }
        public double QuantityUsed { get; set; }
        public double Price { get; set; }
        public DateTime InputDate { get; set; }
        public DateTime? ExpireDate { get; set; }
    }
}
