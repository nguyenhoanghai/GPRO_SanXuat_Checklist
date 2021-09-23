using SanXuatCheckList.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SanXuatCheckList.Business.Model
{
   public class AccessoryTypeModel: AccessoryType
    {
        public int ActionUser { get; set; }
        public string UnitName { get; set; }
        public bool IsPrivate { get; set; }
    }
}
