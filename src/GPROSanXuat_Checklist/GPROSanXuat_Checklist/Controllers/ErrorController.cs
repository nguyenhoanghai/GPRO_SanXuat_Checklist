using GPROCommon.Enums;
using GPROCommon.Models; 
using System; 
using System.Web.Mvc;

namespace GPROSanXuat_Checklist.Controllers
{
    public class ErrorController : BaseController
    {
        // GET: Error
        public ActionResult Index(int ErrorType, int? ErrorId)
        {
            try
            {
                var errorLog = new ModelErrorLog();
                switch (ErrorType)
                {
                    case 0:
                        //errorLog = repErrorLog.GetMany(x => !x.IsFix && x.Id == ErrorId).Select(
                        //    x => new ModelErrorLog()
                        //    {
                        //        Id = x.Id,
                        //        CompanyId = x.CompanyId,
                        //        ModuleName = x.ModuleName,
                        //        IsFix = x.IsFix,
                        //        ErrorCaption = x.ErrorCaption,
                        //        ErrorClass = x.ErrorClass,
                        //        ErrorMethod = x.ErrorMethod,
                        //        StrackTrace = x.StrackTrace,
                        //        IpError = x.IpError,
                        //        ActionError = x.ActionError,
                        //        TargetSite = x.TargetSite
                        //    }).FirstOrDefault();
                        //errorLog.IsDeveloper = UserContext.Permissions.Contains(eErrorPermissionType.Dev) ? true : false;
                        break;
                    case 1:
                        errorLog.Id = 0;
                        errorLog.ErrorCaption = eErrorMessage.NoPermission;
                        break;
                    case 2:
                        errorLog.Id = 0;
                        errorLog.ErrorCaption = eErrorMessage.Error404;
                        break;
                }
                return View(errorLog);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public ActionResult Expired()
        {
            ViewBag.sms = "Phần mềm của bạn đã hết hạn sử dụng vui lòng liên hệ nhà phát triển Công ty GPRO để được gia hạn sử dụng hoặc gọi số 0918 319714 - Email : trivodai@yahoo.com để được tư vấn thêm. Xin cám ơn Quý Khách !.";
            return View();
        }
    }
}