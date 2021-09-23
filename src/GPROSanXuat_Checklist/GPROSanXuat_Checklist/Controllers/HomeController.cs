using System.Linq;
using System.Web.Mvc;

namespace GPROSanXuat_Checklist.Controllers
{
    public class HomeController : BaseController
    {
        // GET: Home
        public ActionResult Index()
        {
            //   Configuration conf = WebConfigurationManager.OpenWebConfiguration(System.Web.Hosting.HostingEnvironment.ApplicationVirtualPath);
            //   SessionStateSection section = (SessionStateSection)conf.GetSection("system.web/sessionState");
            //  int timeout = (int)section.Timeout.TotalMinutes;
            //  section.Timeout = new TimeSpan(8, 0, 0);
            //System.Web.HttpContext.Current.Session.Timeout

            if (UserContext.Permissions.FirstOrDefault(x => x.Equals("/checklist/Index")) != null)
                return View();
            else
                return Redirect("/checklistuser/index");


        }
    }
}