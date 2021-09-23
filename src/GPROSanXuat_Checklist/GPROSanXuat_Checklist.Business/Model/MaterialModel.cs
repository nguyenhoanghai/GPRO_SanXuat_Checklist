using SanXuatCheckList.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SanXuatCheckList.Business.Model
{
   public class MaterialModel : Material
    { 
        public string TypeName { get; set; } 
        public string UnitName { get; set; } 
        public int ActionUser { get; set; }
        public string Code { get; set; }

        public List<MaterialNormsModel> Norms { get; set; }
        public MaterialModel()
        {
            Norms = new List<MaterialNormsModel>();
        }
    }
}
