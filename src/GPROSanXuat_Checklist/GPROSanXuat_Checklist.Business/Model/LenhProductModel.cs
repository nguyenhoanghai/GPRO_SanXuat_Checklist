using GPROSanXuat_Checklist.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GPROSanXuat_Checklist.Business.Model
{
  public  class LenhProductModel : Lenh_Products
    {
        public string POCode { get; set; }
        public int Quantities_PC { get; set; } 
        public string ProductName { get; set; }
        public string UnitName { get; set; }
    }
}
