using GPROSanXuat_Checklist.Data; 

namespace GPROSanXuat_Checklist.Business.Model
{
   public class ControlModel :  TemplateControl
    {
        public int proFileId { get; set; }
        public int TemplateControlId { get; set; }
        public int ActionUser { get; set; }
    }
}
