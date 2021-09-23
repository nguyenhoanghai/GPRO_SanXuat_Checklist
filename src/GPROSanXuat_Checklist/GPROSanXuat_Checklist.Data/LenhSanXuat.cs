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
    
    public partial class LenhSanXuat
    {
        public LenhSanXuat()
        {
            this.Lenh_Products = new HashSet<Lenh_Products>();
            this.Lenh_VatTu = new HashSet<Lenh_VatTu>();
        }
    
        public int Id { get; set; }
        public string Code { get; set; }
        public int EmployeeId { get; set; }
        public System.DateTime StartDate { get; set; }
        public string Note { get; set; }
        public int StatusId { get; set; }
        public bool IsDeleted { get; set; }
        public System.DateTime CreatedDate { get; set; }
        public int CreatedUser { get; set; }
        public Nullable<int> UpdatedUser { get; set; }
        public Nullable<System.DateTime> UpdatedDate { get; set; }
        public Nullable<int> DeletedUser { get; set; }
        public Nullable<System.DateTime> DeletedDate { get; set; }
    
        public virtual ICollection<Lenh_Products> Lenh_Products { get; set; }
        public virtual ICollection<Lenh_VatTu> Lenh_VatTu { get; set; }
    }
}
