using SanXuatCheckList.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SanXuatCheckList.Business.Model
{
  public  class AccessoryModel : Accessory
    {
        public int ActionUser { get; set; }
        public string AccessoryTypeName { get; set; }
        public string UnitName { get; set; }
        public bool IsPrivate { get; set; }
    }
}
