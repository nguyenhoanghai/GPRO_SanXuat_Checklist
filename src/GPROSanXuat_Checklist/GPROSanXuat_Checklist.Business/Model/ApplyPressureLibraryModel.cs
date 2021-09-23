using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SanXuatCheckList.Business.Model
{
  public  class ApplyPressureLibraryModel
    {
        public int Id { get; set; }
        public string Level { get; set; }
        public double Value { get; set; }
        public string Description { get; set; }
    }

  public class NatureCutsModel
  {
      public int Id { get; set; }
      public string Name { get; set; }
      public string Code { get; set; }
      public double Percent { get; set; }
      public double Factor { get; set; }
      public string Description { get; set; }
  }
  public class StopPrecisionModel
  {
      public int Id { get; set; }
      public string Code { get; set; }
      public string Name { get; set; }
      public string StopPrecision { get; set; }
      public string MTM_2 { get; set; }
      public double TMUNumber { get; set; }
      public string Description { get; set; }
  }
}
