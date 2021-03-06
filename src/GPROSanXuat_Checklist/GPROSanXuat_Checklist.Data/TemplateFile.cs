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
    
    public partial class TemplateFile
    {
        public TemplateFile()
        {
            this.ProductionFiles = new HashSet<ProductionFile>();
            this.TemplateControls = new HashSet<TemplateControl>();
        }
    
        public int Id { get; set; }
        public int TemplateFileTypeId { get; set; }
        public string Name { get; set; }
        public int Index { get; set; }
        public string Note { get; set; }
        public string Content { get; set; }
        public bool IsApprove { get; set; }
        public Nullable<System.DateTime> ApprovedDate { get; set; }
        public Nullable<int> ApprovedUser { get; set; }
        public bool IsDeleted { get; set; }
        public System.DateTime CreatedDate { get; set; }
        public int CreatedUser { get; set; }
        public Nullable<System.DateTime> UpdatedDate { get; set; }
        public Nullable<int> UpdatedUser { get; set; }
        public Nullable<System.DateTime> DeletedDate { get; set; }
        public Nullable<int> DeletedUser { get; set; }
    
        public virtual ICollection<ProductionFile> ProductionFiles { get; set; }
        public virtual ICollection<TemplateControl> TemplateControls { get; set; }
        public virtual TemplateFileType TemplateFileType { get; set; }
    }
}
