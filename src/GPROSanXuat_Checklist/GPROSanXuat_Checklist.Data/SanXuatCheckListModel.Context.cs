﻿//------------------------------------------------------------------------------
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
    using System.Data.Entity;
    using System.Data.Entity.Infrastructure;
    
    public partial class SanXuatCheckListEntities : DbContext
    {
        public SanXuatCheckListEntities(string nameOrConnectionString)
            : base(nameOrConnectionString)
        {
        }
    
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            throw new UnintentionalCodeFirstException();
        }
    
        public DbSet<Checklist> Checklists { get; set; }
        public DbSet<Checklist_Job_ActionLog> Checklist_Job_ActionLog { get; set; }
        public DbSet<Checklist_Job_Alert> Checklist_Job_Alert { get; set; }
        public DbSet<Checklist_Job_Attachment> Checklist_Job_Attachment { get; set; }
        public DbSet<Checklist_Job_Comment> Checklist_Job_Comment { get; set; }
        public DbSet<Checklist_Job_EmployeeReference> Checklist_Job_EmployeeReference { get; set; }
        public DbSet<Checklist_Job_Error> Checklist_Job_Error { get; set; }
        public DbSet<Checklist_Job_NotifyLog> Checklist_Job_NotifyLog { get; set; }
        public DbSet<Checklist_JobStep> Checklist_JobStep { get; set; }
        public DbSet<Delivery> Deliveries { get; set; }
        public DbSet<DeliveryDetail> DeliveryDetails { get; set; }
        public DbSet<Lenh_Products> Lenh_Products { get; set; }
        public DbSet<Lenh_VatTu> Lenh_VatTu { get; set; }
        public DbSet<LenhSanXuat> LenhSanXuats { get; set; }
        public DbSet<LotSupply> LotSupplies { get; set; }
        public DbSet<MaterialNorm> MaterialNorms { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<P_Config> P_Config { get; set; }
        public DbSet<PO_Sell> PO_Sell { get; set; }
        public DbSet<ProductionBatch> ProductionBatches { get; set; }
        public DbSet<ProductionFile> ProductionFiles { get; set; }
        public DbSet<ProFileControl> ProFileControls { get; set; }
        public DbSet<Receiption> Receiptions { get; set; }
        public DbSet<ReceiptionDetail> ReceiptionDetails { get; set; }
        public DbSet<SConfig> SConfigs { get; set; }
        public DbSet<Template_Checklist> Template_Checklist { get; set; }
        public DbSet<Template_CL_JobStep> Template_CL_JobStep { get; set; }
        public DbSet<TemplateControl> TemplateControls { get; set; }
        public DbSet<TemplateFile> TemplateFiles { get; set; }
        public DbSet<TemplateFileType> TemplateFileTypes { get; set; }
        public DbSet<W_Config> W_Config { get; set; }
        public DbSet<PO_SellDetail> PO_SellDetail { get; set; }
        public DbSet<OrderDetail> OrderDetails { get; set; }
        public DbSet<Checklist_Job> Checklist_Job { get; set; }
        public DbSet<Template_CL_Job> Template_CL_Job { get; set; }
    }
}
