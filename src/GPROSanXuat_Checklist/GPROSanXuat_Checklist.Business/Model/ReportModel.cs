using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SanXuatCheckList.Business.Model
{
    public class ReportModel
    {
        public string ProjectName { get; set; }
        public string ProductName { get; set; }
        public string ProTimeName { get; set; }
        public float Quantity { get; set; }
        public float QuantityTT { get; set; }
        public string Start { get; set; }
        public string End { get; set; }
        public string RealEnd { get; set; }
        public string InputDate { get; set; }
        public List<JobReportModel> Jobs { get; set; }
        public ReportModel()
        {
            Jobs = new List<JobReportModel>();
        }

    }
    public class JobReportModel
    {
        public int Rows { get; set; }
        public int GroupRows { get; set; }
        public int CheckListId { get; set; }
        public string CheckListName { get; set; }
        public int Id { get; set; }
        public int ProductId { get; set; }
        public int ProTimeId { get; set; }
        public int Index { get; set; }
        public string JobName { get; set; }
        public string JobContent { get; set; }
        public int OrganId { get; set; }
        public string OrganName { get; set; }
        public int GroupId { get; set; }
        public string UserName { get; set; }
        public string Start { get; set; }
        public string End { get; set; }
        public string RealEnd { get; set; }
        public string Note { get; set; }
        public string Result { get; set; }
        public int StatusId { get; set; }
        public int PartOfOrganId { get; set; }
        public string PartOfOrganName { get; set; }
        public int PartOfOrganCount { get; set; }
        public List<ErrorModel> Errors { get; set; }
        public JobReportModel()
        {
            Errors = new List<ErrorModel>();
        }
    }

    public class ErrorModel
    {
        public string sms { get; set; }
        public string Start { get; set; }
        public string End { get; set; }
        public string RealEnd { get; set; }
        public string Solution { get; set; }
        public string Reason { get; set; }
        public string User { get; set; }
        public ErrorModel() { }
    }
}
