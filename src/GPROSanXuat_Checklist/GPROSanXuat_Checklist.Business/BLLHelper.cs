using GPROSanXuat_Checklist.Data;
using System.Collections.Generic;
using System.Linq;

namespace GPROSanXuat_Checklist.Business
{
    public static class BLLHelper
    {
        public static List<string> SubString(string str)
        {
            List<string> resource = new List<string>();
            string newStr = string.Empty, text = string.Empty, baseTxt = str, msg = string.Empty;
            int index = 0;
            first:
            index = str.IndexOf('@');
            if (index >= 0)
            {
                newStr = str.Substring(index);
                text = newStr.Substring(1, (newStr.IndexOf(' ') - 1));
                if (resource.FirstOrDefault(x => x == text) == null)
                    resource.Add(text);
                str = newStr.Substring(newStr.IndexOf(' '));
                index = -1;
                if (str.Length > 0)
                    goto first;
            }
            else
            {
                for (int i = 0; i < resource.Count; i++)
                {
                    baseTxt = baseTxt.Replace("@" + resource[i], "");
                }
                resource.Add(baseTxt);
            }
            return resource;
        }

        public static void CreateAlert(SanXuatCheckListEntities db, Checklist_Job_Alert alert)
        {
            db.Checklist_Job_Alert.Add(alert);
            db.SaveChanges();
        }
    }
}
