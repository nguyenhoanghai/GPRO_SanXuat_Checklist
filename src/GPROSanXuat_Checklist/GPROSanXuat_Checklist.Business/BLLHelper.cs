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
                int ending = (newStr.IndexOf(' ') - 1);
                if (ending > 0)
                {
                    text = newStr.Substring(1, ending);
                    str = newStr.Substring(newStr.IndexOf(' '));
                }
                else
                {
                    text = newStr.Substring(1);
                }

                if (resource.FirstOrDefault(x => x == text) == null)
                    resource.Add(text);

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

        public static string ReplaceVietNameseChar(string str)
        {
            if (string.IsNullOrEmpty(str))
                return "";
            string[] VietNamChar = new string[]
   {
        "aAeEoOuUiIdDyY",
        "áàạảãâấầậẩẫăắằặẳẵ",
        "ÁÀẠẢÃÂẤẦẬẨẪĂẮẰẶẲẴ",
        "éèẹẻẽêếềệểễ",
        "ÉÈẸẺẼÊẾỀỆỂỄ",
        "óòọỏõôốồộổỗơớờợởỡ",
        "ÓÒỌỎÕÔỐỒỘỔỖƠỚỜỢỞỠ",
        "úùụủũưứừựửữ",
        "ÚÙỤỦŨƯỨỪỰỬỮ",
        "íìịỉĩ",
        "ÍÌỊỈĨ",
        "đ",
        "Đ",
        "ýỳỵỷỹ",
        "ÝỲỴỶỸ"
   };
            //Thay thế và lọc dấu từng char      
            for (int i = 1; i < VietNamChar.Length; i++)
            {
                for (int j = 0; j < VietNamChar[i].Length; j++)
                    str = str.Replace(VietNamChar[i][j], VietNamChar[0][i - 1]);
            }
            return str;
        }
    }
}
