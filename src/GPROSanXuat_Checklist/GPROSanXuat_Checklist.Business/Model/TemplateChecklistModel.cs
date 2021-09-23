using GPROSanXuat_Checklist.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GPROSanXuat_Checklist.Business.Model
{
   public class TemplateChecklistModel :Template_Checklist
    {
        public int ActionUser { get; set; }
    }
}
