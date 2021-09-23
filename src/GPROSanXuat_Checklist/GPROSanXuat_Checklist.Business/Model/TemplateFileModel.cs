using GPROSanXuat_Checklist.Data;  
using System.Collections.Generic; 

namespace GPROSanXuat_Checklist.Business.Model
{
   public class TemplateFileModel :  TemplateFile
    {
        public int ActionUser { get; set; }
        public string Code { get; set; }
        public string ApproveUserName { get; set; }
        public List<ControlModel> Controls { get; set; }
        public TemplateFileModel()
        {
            Controls = new List<ControlModel>();
        }
    }
}
