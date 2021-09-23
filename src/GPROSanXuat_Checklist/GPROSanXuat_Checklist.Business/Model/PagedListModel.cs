using System;
using System.Collections.Generic;
using System.Linq; 

namespace SanXuatCheckList.Business.Model
{
   public class PagedListModel
    {
        public dynamic List { get; set; }
        public int TotalItemCount { get; set; } 
    }
}
