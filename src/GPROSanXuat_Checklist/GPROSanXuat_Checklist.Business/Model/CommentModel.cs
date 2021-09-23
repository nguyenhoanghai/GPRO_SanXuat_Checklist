using GPROSanXuat_Checklist.Data;

namespace GPROSanXuat_Checklist.Business.Model
{
    public class CommentModel : Checklist_Job_Comment
    {
        /// <summary>
        /// 1. comment - 2. actionlog
        /// </summary>
        public int CType { get; set; }
        public bool IsErrorLog { get; set; }
        public string Icon { get; set; }
        public string UserName { get; set; }
        public string UserNameOnly { get; set; }
        public int JobErrId { get; set; }
        public int UserProcessId { get; set; }
        public string ErrorCode { get; set; }
        public int Status { get; set; }
    }
}
