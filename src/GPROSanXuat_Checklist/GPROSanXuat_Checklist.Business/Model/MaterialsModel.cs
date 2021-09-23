using SanXuatCheckList.Data;

namespace SanXuatCheckList.Business.Model
{
    public class MaterialsModel : Material 
    {
        public int ActionUser { get; set; }
        public string UnitName { get; set; } 
        public bool IsPrivate { get; set; }
    }
}
