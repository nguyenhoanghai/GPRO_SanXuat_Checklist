using GPROSanXuat_Checklist.Data;

namespace GPROSanXuat_Checklist.Business.Model
{
    public class AttachmentModel : Checklist_Job_Attachment
    {
        public string UserName { get; set; }
        public string UserNameOnly { get; set; }
    }
}
