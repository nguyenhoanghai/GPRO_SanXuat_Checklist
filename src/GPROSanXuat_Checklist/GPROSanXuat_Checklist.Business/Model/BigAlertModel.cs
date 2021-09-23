 using System.Collections.Generic; 

namespace GPROSanXuat_Checklist.Business.Model
{
    public class BigAlertModel
    {
        public int Unread { get; set; }
        public List<ChecklistJobAlertModel> Alerts { get; set; }
        public BigAlertModel()
        {
            Alerts = new List<ChecklistJobAlertModel>();
        }
    }
}
