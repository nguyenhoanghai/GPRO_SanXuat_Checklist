using System;
using System.Collections.Generic;
using System.Linq; 

namespace SanXuatCheckList.Business.Model
{
    public class ExportTechProcessModel : TechProcessVersionModel
    {        
        public List<TechProcessVerDetailGroupModel> ListTechProcessGroup { get; set; }
    }
}
