//------------------------------------------------------------------------------
// <auto-generated>
//    This code was generated from a template.
//
//    Manual changes to this file may cause unexpected behavior in your application.
//    Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace GPROSanXuat_Checklist.Data
{
    using System;
    using System.Collections.Generic;
    
    public partial class Checklist_Job_ActionLog
    {
        public int Id { get; set; }
        public int JobId { get; set; }
        public string ActionInfo { get; set; }
        public int CreatedUser { get; set; }
        public System.DateTime CreatedDate { get; set; }
    
        public virtual Checklist_Job Checklist_Job { get; set; }
    }
}
