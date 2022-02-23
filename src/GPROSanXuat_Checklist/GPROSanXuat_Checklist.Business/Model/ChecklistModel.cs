using GPROSanXuat_Checklist.Data;
using System.Collections.Generic;

namespace GPROSanXuat_Checklist.Business.Model
{
    public class ChecklistModel : Checklist
    {
        public int ActionUser { get; set; }
      //  public string LineName { get; set; }
        public string ProductName { get; set; }
        public string CustomerName { get; set; }
        public string SizeName { get; set; }
        public string StatusName { get; set; }
        public string ProductUnit { get; set; }
        public List<Checklist_JobStepModel> JobSteps { get; set; }
        public ChecklistModel()
        {
            JobSteps = new List<Checklist_JobStepModel>();
        }
    }

    public class Checklist_JobStepModel : Checklist_JobStep
    {
        public int ActionUser { get; set; }
        public string StatusName { get; set; }
        public string EmployeeName { get; set; }
        public string RelatedEmployeeName { get; set; }
        public List<Checklist_JobModel> Jobs { get; set; }
        public Checklist_JobStepModel()
        {
            Jobs = new List<Checklist_JobModel>();
        }
    }

    public class Checklist_JobModel : Checklist_Job
    { 
        public int ActionUser { get; set; }
        public string StatusName { get; set; }
        public string EmployeeName { get; set; }
        public string RelatedEmployeeName { get; set; }
      
        public List<Checklist_JobModel> SubItems { get; set; }     

        public List<CommentModel> Comments { get; set; }
        public List<AttachmentModel> Attachs { get; set; }
        public int CommentCount { get; set; }
        public int CurrentUserId { get; set; }
        public string CurrentUserName { get; set; }
        public string CurrentUserIcon { get; set; }
        public double PercentComplete { get; set; }
        public bool IsStopAlarm { get; set; }
        public bool IsDisabled { get; set; }

        public string EmployName { get; set; }
        public string EmployIcon { get; set; }

        public string ProjectName { get; set; }
        public string JobStepName { get; set; }
        public string CommoName { get; set; }
        public int CheckListId { get; set; }

        public int JobId { get; set; }
        public int JobFakeId { get; set; }
        public int ReferEmployeeId { get; set; }
        public string ReferEmployeeName { get; set; }
        public Checklist_JobModel()
        {
            SubItems = new List<Checklist_JobModel>();
            Comments = new List<CommentModel>();
            Attachs = new List<AttachmentModel>();
        }
    }
}
