using System.Collections.Generic;

namespace GPROSanXuat_Checklist.Business.Model
{
    public class BigChecklistModel
    {
        public List<Checklist_JobModel> EditorJobs { get; set; }
        public List<Checklist_JobModel> ProcessJobs { get; set; }
        public List<Checklist_JobModel> ErrorJobs { get; set; }
        public List<Checklist_JobModel> ApproveJobs { get; set; }
        public List<Checklist_JobModel> DoneJobs { get; set; }
        public string RelatedEmployees { get; set; }

        public BigChecklistModel()
        {
            EditorJobs = new List<Checklist_JobModel>();
            ProcessJobs = new List<Checklist_JobModel>();
            ErrorJobs = new List<Checklist_JobModel>();
            ApproveJobs = new List<Checklist_JobModel>();
            DoneJobs = new List<Checklist_JobModel>();
        }
    }
}
