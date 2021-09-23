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
    
    public partial class LotSupply
    {
        public LotSupply()
        {
            this.DeliveryDetails = new HashSet<DeliveryDetail>();
            this.ReceiptionDetails = new HashSet<ReceiptionDetail>();
        }
    
        public int Id { get; set; }
        public string Name { get; set; }
        public int Index { get; set; }
        public int MaterialId { get; set; }
        public double Quantity { get; set; }
        public double QuantityUsed { get; set; }
        public double Price { get; set; }
        public System.DateTime ManufactureDate { get; set; }
        public Nullable<System.DateTime> ExpiryDate { get; set; }
        public Nullable<System.DateTime> WarrantyDate { get; set; }
        public string SpecificationsPaking { get; set; }
        public string Note { get; set; }
        public bool IsDeleted { get; set; }
        public System.DateTime CreatedDate { get; set; }
        public int CreatedUser { get; set; }
        public Nullable<System.DateTime> UpdatedDate { get; set; }
        public Nullable<int> DeletedUser { get; set; }
        public Nullable<int> UpdatedUser { get; set; }
        public Nullable<System.DateTime> DeletedDate { get; set; }
    
        public virtual ICollection<DeliveryDetail> DeliveryDetails { get; set; }
        public virtual ICollection<ReceiptionDetail> ReceiptionDetails { get; set; }
    }
}