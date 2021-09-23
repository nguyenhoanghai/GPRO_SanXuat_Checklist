using GPROCommon.Helper;
using GPROCommon.Models;
using System;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web.Mvc;
using System.Xml;
using System.Xml.Linq;

namespace GPROSanXuat_Checklist.Controllers
{
    public class SQLConnectController : Controller
    {
        public string conString = "";

        public ActionResult Index(string system)
        {
            try
            {
                if (string.IsNullOrEmpty(system))
                    system = "0";
                ModelSelectItem item = new ModelSelectItem();
                string info = Database.Instance.GetStringConnectInfo(Server.MapPath("~/Config_XML") + "\\DATA.XML");

                var path = Server.MapPath("~/Config_XML") + "\\DATA.XML";
                XDocument testXML = XDocument.Load(path);
                XElement cStudent = testXML.Descendants("SQLServer").Where(c => c.Attribute("id").Value.Equals(system)).FirstOrDefault();

                if (cStudent != null)
                {
                    item.Data1 = Encryption.Instance.Decrypt(cStudent.Element("Server_Name").Value); //txtServerName.Text
                    item.Data2 = Encryption.Instance.Decrypt(cStudent.Element("Database").Value); //cbDatabases.Text
                    item.Data3 = Encryption.Instance.Decrypt(cStudent.Element("User").Value); //txtLogin.Text
                    item.Data4 = Encryption.Instance.Decrypt(cStudent.Element("Password").Value);//txtPass.Text
                    item.Data5 = bool.Parse(cStudent.Element("Window_Authenticate").Value);
                }
                ViewBag.system = system;
                ViewBag.info = item;
                ViewBag.dbs = getDatabases(item.Data1, item.Data3, item.Data4, item.Data5);
            }
            catch (Exception)
            { }
            return View();
        }

        public string getDatabases(string ip, string uname, string pass, bool isAuthen)
        {
            string _name = "";
            try
            {
                if (checkValid(ip, uname, pass, isAuthen))
                {
                    var conn = new SqlConnection(conString);
                    conn.Open();
                    var ds = new DataSet();
                    string query = "select name from sysdatabases";
                    var da = new SqlDataAdapter(query, conn);
                    da.Fill(ds, "databasenames");
                    // this.cbDatabases.DataSource = ds.Tables["databasenames"];
                    // this.cbDatabases.DisplayMember = "name";
                    var _tb = ds.Tables["databasenames"];
                    for (int i = 0; i < _tb.Rows.Count; i++)
                    {
                        if (i > 0)
                            _name += ",";
                        _name += _tb.Rows[i][0];
                    }
                }
            }
            catch
            {
                //  this.cbDatabases.DataSource = null;
            }
            return _name;
        }

        private bool checkValid(string ip, string uname, string pass, bool isAuthen)
        {
            bool isPass = false;

            // Open connection to the database 
            if (!string.IsNullOrEmpty(ip))
            {
                if (isAuthen)
                {
                    conString = string.Concat(new string[]
                     {
                    "Server = ",
                    ip,
                    ";Trusted_Connection=true;",
                     });
                    isPass = true;
                }
                else
                {
                    conString = string.Concat(new string[]
                    {
                    "Server = ",
                    ip,
                    " ; Uid = ",
                    uname,
                    " ;Pwd= ",
                    pass
                    });
                    if (!string.IsNullOrEmpty(uname) &&
                        !string.IsNullOrEmpty(pass))
                    {
                        isPass = true;
                    }
                }
            }
            return isPass;
        }

        public JsonResult SaveConfig(string ip, string uname, string pass, bool isAuthen, string dbname, string system)
        {
            bool result = false;
            try
            {
                string filepath = Server.MapPath("~/Config_XML");
                if (!System.IO.Directory.Exists(filepath))
                    System.IO.Directory.CreateDirectory(filepath);

                filepath = (Server.MapPath("~/Config_XML") + "\\DATA.XML");
                if (!System.IO.File.Exists(filepath))
                {
                    System.IO.File.Create(filepath).Close();
                }

                ip = Encryption.Instance.Encrypt(ip);
                dbname = Encryption.Instance.Encrypt(dbname);
                uname = Encryption.Instance.Encrypt(uname);
                pass = Encryption.Instance.Encrypt(pass);

                XDocument testXML = XDocument.Load(filepath);
                XElement cStudent = testXML.Descendants("SQLServer").Where(c => c.Attribute("id").Value.Equals(system)).FirstOrDefault();
                if (cStudent != null)
                {
                    cStudent.Element("Server_Name").Value = ip;
                    cStudent.Element("Database").Value = dbname;
                    cStudent.Element("User").Value = uname;
                    cStudent.Element("Password").Value = pass;
                    cStudent.Element("Window_Authenticate").Value = isAuthen.ToString();
                    testXML.Save(filepath);
                }
                else
                {
                    XmlDocument xmlDocument = new XmlDocument();
                    XmlNode newChild = xmlDocument.CreateXmlDeclaration("1.0", "UTF-8", null);
                    xmlDocument.AppendChild(newChild);
                    XmlNode xmlNode = xmlDocument.CreateElement("String_Connect");
                    xmlDocument.AppendChild(xmlNode);

                    XmlNode xmlNode2 = xmlDocument.CreateElement("SQLServer");
                    XmlAttribute xmlAttribute = xmlDocument.CreateAttribute("id");
                    xmlAttribute.Value = system;
                    xmlNode2.Attributes.Append(xmlAttribute);
                    xmlNode.AppendChild(xmlNode2);

                    XmlNode xmlNode3 = xmlDocument.CreateElement("Server_Name");
                    xmlNode3.AppendChild(xmlDocument.CreateTextNode(Encryption.Instance.Encrypt(ip)));
                    xmlNode2.AppendChild(xmlNode3);

                    XmlNode xmlNode4 = xmlDocument.CreateElement("Database");
                    xmlNode4.AppendChild(xmlDocument.CreateTextNode(Encryption.Instance.Encrypt(dbname)));
                    xmlNode2.AppendChild(xmlNode4);

                    XmlNode xmlNode5 = xmlDocument.CreateElement("User");
                    xmlNode5.AppendChild(xmlDocument.CreateTextNode(Encryption.Instance.Encrypt(uname)));
                    xmlNode2.AppendChild(xmlNode5);

                    XmlNode xmlNode6 = xmlDocument.CreateElement("Password");
                    xmlNode6.AppendChild(xmlDocument.CreateTextNode(Encryption.Instance.Encrypt(pass)));
                    xmlNode2.AppendChild(xmlNode6);

                    XmlNode xmlNode7 = xmlDocument.CreateElement("Window_Authenticate");
                    xmlNode7.AppendChild(xmlDocument.CreateTextNode(isAuthen.ToString()));
                    xmlNode2.AppendChild(xmlNode7);

                    xmlDocument.Save(filepath);
                }
                //Environment.Exit(0);
                result = true;
            }
            catch (Exception ex)
            {
                result = false;
            }
            return Json(result);
        }
    }
}