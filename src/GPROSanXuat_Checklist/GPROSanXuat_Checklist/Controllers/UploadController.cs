using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace GPROSanXuat_Checklist.Controllers
{
    public class UploadController : Controller
    {

        [HttpPost]
        public JsonResult Single()
        {
            try
            {
                string returnPath = string.Empty, path = string.Empty, last = string.Empty;
                Guid guid;
                if (Request.Files != null && Request.Files.Count > 0)
                {
                    var file = Request.Files[0];
                    var filename = Path.GetFileName(file.FileName);
                    guid = Guid.NewGuid();
                    returnPath = "~/UploadFile/Files/" + DateTime.Now.Year + "/" + DateTime.Now.Month + "/" + DateTime.Now.Day + "/";
                    string directoryPath = Server.MapPath(returnPath);
                    if (!System.IO.Directory.Exists(directoryPath))
                        System.IO.Directory.CreateDirectory(directoryPath);

                    last = (guid.ToString() + "_" + filename);
                    path = Path.Combine(Server.MapPath(returnPath), last);
                    file.SaveAs(path);
                }
                return Json((returnPath + last).Replace('~', ' '));
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}