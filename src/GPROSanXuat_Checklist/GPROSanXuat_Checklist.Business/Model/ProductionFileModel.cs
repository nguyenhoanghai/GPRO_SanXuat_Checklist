using SanXuatCheckList.Data;
using System.Collections.Generic;

namespace SanXuatCheckList.Business.Model
{
    public class ProductionFileModel : ProductionFile
    {
        public int TemplateControlId { get; set; }
        public int ActionUser { get; set; }

        public int TemplateFileIndex { get; set; }
        public string TemplateFiletName { get; set; }

        public int ProductionBatchIndex { get; set; }
        public string ProductionBatchName { get; set; }
        public string ApproverName { get; set; }
        public int ProductId { get; set; }

        public List<ControlModel> Controls { get; set; }
        public ProductionFileModel()
        {
            Controls = new List<ControlModel>();
        }
    }
}
