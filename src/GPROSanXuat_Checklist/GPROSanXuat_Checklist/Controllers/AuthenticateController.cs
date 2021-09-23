using GPRO.Core.Mvc;
using GPRO.Core.Security;
using GPRO.Ultilities;
using GPROCommon.Models;
using GPROCommon.Repository;
using GPROSanXuat_Checklist.App_Global;
using System;
using System.Collections;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace GPROSanXuat_Checklist.Controllers
{
    public class AuthenticateController : BaseController
    {

        public ActionResult Login(string token, string url)
        {
            if (UserContext != null)
            {
                if (string.IsNullOrEmpty(token))
                {  
                        if (string.IsNullOrEmpty(url))
                            return Redirect(defaultPage);
                        else
                            return Redirect(url); 
                }
                else
                {
                    ArrayList SSOTokenReceive = (ArrayList)Hugate.Framework.Security.SerializeObject.Deserialize(Hugate.Framework.Security.SerializeObject.Decrypt(token));
                    if (SSOTokenReceive != null)
                    {
                        var sessionId = Convert.ToString(SSOTokenReceive[0]);
                        var returnUrlByToken = Convert.ToString(SSOTokenReceive[1]);
                        if (!string.IsNullOrEmpty(returnUrlByToken))
                        {
                            ArrayList SSOToken = new ArrayList();
                            SSOToken.Add(UserContext.UserID);
                            SSOToken.Add(sessionId);
                            var tokenRedirect = HttpUtility.UrlEncode(Hugate.Framework.Security.SerializeObject.Encrypt(Hugate.Framework.Security.SerializeObject.Serialize(SSOToken)));
                            return Redirect(returnUrlByToken + "?token=" + tokenRedirect);
                        }
                    }
                }

            }
            else
            {
                Session["Url"] = url;
                Session["Token"] = token;
            }
            return View();
        }

        [HttpPost]
        public JsonResult LoginAction(string userName, string password)
        {
            ResponseBase rs;
            string mesage = string.Empty;
            try
            {
                rs =  UserRepository.Instance.Login( AppGlobal.ConnectionstringGPROCommon, userName, password);
                if (!rs.IsSuccess)
                {
                    JsonDataResult.Result = "ERROR";
                    JsonDataResult.ErrorMessages.AddRange(rs.Errors);
                }
                else
                {
                    JsonDataResult.Result = "OK";
                    int userId = (int)rs.Data;
                    LoginSuccessHandle(userId);
                    var tokenEncrypt = Session["Token"] != null ? Session["Token"].ToString() : string.Empty;
                    var url = Session["Url"] != null ? Session["Url"].ToString() : string.Empty;
                    if (!string.IsNullOrEmpty(tokenEncrypt))
                    {
                        ArrayList SSOTokenReceive = (ArrayList)Hugate.Framework.Security.SerializeObject.Deserialize(Hugate.Framework.Security.SerializeObject.Decrypt(tokenEncrypt));
                        if (SSOTokenReceive != null)
                        {
                            var sessionId = Convert.ToString(SSOTokenReceive[0]);
                            var returnUrlByToken = Convert.ToString(SSOTokenReceive[1]);

                            if (!string.IsNullOrEmpty(returnUrlByToken))
                            {
                                ArrayList SSOToken = new ArrayList();
                                SSOToken.Add(Authentication.UserId);
                                SSOToken.Add(sessionId);
                                var token = HttpUtility.UrlEncode(Hugate.Framework.Security.SerializeObject.Encrypt(Hugate.Framework.Security.SerializeObject.Serialize(SSOToken)));
                                JsonDataResult.Data = GlobalFunction.UpdateQueryString("token", token, returnUrlByToken);
                            }
                        }
                    }
                    else
                    {
                        if (!string.IsNullOrEmpty(url))
                            JsonDataResult.Data = url;
                        else
                            JsonDataResult.Data = defaultPage;
                    }

                }
            }
            catch (Exception ex)
            {
                //add Error
                JsonDataResult.Result = "ERROR";
                JsonDataResult.ErrorMessages.Add(new Error() { MemberName = "Lỗi Dữ Liệu", Message = "Lỗi: " + ex.Message });
            }
            return Json(JsonDataResult);
        }
        private void LoginSuccessHandle(int userId)
        {
            try
            {
                Authentication.Login(userId);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public ActionResult Logout()
        {
            Authentication.Logout();
            return RedirectToAction("Login");
        }
    }
}