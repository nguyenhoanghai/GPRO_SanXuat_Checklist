using GPROSanXuat_Checklist.Data;
using System.Collections.Generic;

namespace GPROSanXuat_Checklist.Business.Model
{
    public class LenhModel : LenhSanXuat
    {
        public int ActionUser { get; set; }
        public string EmployeeName { get; set; }
        public string StatusName { get; set; }
        public List<LenhProductModel> Products { get; set; }
        public List<LenhMaterialModel> Materials { get; set; }
        public LenhModel()
        {
            Products = new List<LenhProductModel>();
            Materials = new List<LenhMaterialModel>();
        }
    }


}
