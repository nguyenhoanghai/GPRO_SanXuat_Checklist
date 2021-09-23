using SanXuatCheckList.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SanXuatCheckList.Business.Model
{
   public class WareHouseModel : WareHouse
    {
        public string Code { get; set; }
        public int ActionUser { get; set; }
    }
}
