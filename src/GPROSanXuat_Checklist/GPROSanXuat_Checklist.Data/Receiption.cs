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
    
    public partial class Receiption
    {
        public Receiption()
        {
            this.ReceiptionDetails = new HashSet<ReceiptionDetail>();
        }
    
        public int Id { get; set; }
        public int Index { get; set; }
        public string Name { get; set; }
        public Nullable<int> FromWarehouseId { get; set; }
        public Nullable<int> FromCustomerId { get; set; }
        public int StoreWarehouseId { get; set; }
        public int RecieverId { get; set; }
        public int MoneyTypeId { get; set; }
        public double ExchangeRate { get; set; }
        public int TransactionType { get; set; }
        public System.DateTime DateOfAccounting { get; set; }
        public System.DateTime InputDate { get; set; }
        public string Note { get; set; }
        public int StatusId { get; set; }
        public Nullable<int> ApprovedUser { get; set; }
        public Nullable<System.DateTime> ApprovedDate { get; set; }
        public bool IsDeleted { get; set; }
        public System.DateTime CreatedDate { get; set; }
        public int CreatedUser { get; set; }
        public Nullable<int> UpdatedUser { get; set; }
        public Nullable<System.DateTime> UpdatedDate { get; set; }
        public Nullable<int> DeletedUser { get; set; }
        public Nullable<System.DateTime> DeletedDate { get; set; }
    
        public virtual ICollection<ReceiptionDetail> ReceiptionDetails { get; set; }
    }
}
