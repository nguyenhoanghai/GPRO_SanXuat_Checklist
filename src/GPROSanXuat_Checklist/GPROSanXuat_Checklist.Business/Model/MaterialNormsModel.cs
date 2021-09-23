using SanXuatCheckList.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SanXuatCheckList.Business.Model
{
   public class MaterialNormsModel : MaterialNorms
    { 
        public string Name { get; set; } 
        public int UnitId { get; set; }
        public string UnitName { get; set; }
    }
}
