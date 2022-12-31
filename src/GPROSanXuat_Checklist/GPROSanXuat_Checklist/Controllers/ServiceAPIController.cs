using GPROCommon.Models;
using GPROCommon.Repository;
using GPROSanXuat_Checklist.App_Global;
using GPROSanXuat_Checklist.Business;
using GPROSanXuat_Checklist.Business.Model;
using GPROSanXuat_Checklist.Mapper;
using GPROSanXuat_Checklist.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace GPROSanXuat_Checklist.Controllers
{
    public class ServiceAPIController : ApiController
    {
        [HttpGet]
        public APIResultModel Login(string userName, string password)
        {
            var rs = UserRepository.Instance.Login(AppGlobal.ConnectionstringGPROCommon, userName, password);
            var result = new APIResultModel();
            if (!rs.IsSuccess)
            {
                result.Status = "ERROR";
                result.ResultInfo = rs.Errors[0].Message;
            }
            else
            {
                result.Status = "OK";
                int userId = (int)rs.Data;
                result.ResultInfo = JsonConvert.SerializeObject(UserRepository.Instance.GetUserService(AppGlobal.ConnectionstringGPROCommon, userId, AppGlobal.MODULE_NAME));
            }
            return result;
        }

        [HttpGet]
        public APIResultModel FindChecklistByName(string keyword)
        {
            var objs = BLLChecklist.Instance.Gets(AppGlobal.ConnectionstringSanXuatChecklist, keyword);
            objs = ChecklistMaper.Instance.MapInfoFromGPROCommon(objs);
            var result = new APIResultModel();
            result.Status = "OK";
            result.ResultInfo = JsonConvert.SerializeObject(objs);
            return result;
        }

        [HttpGet]
        public APIResultModel GetChecklistById(int Id, int userId)
        {
            var obj = BLLChecklist.Instance.GetWithJobs(AppGlobal.ConnectionstringSanXuatChecklist, Id, userId, StatusRepository.Instance.GetSelectItem(AppGlobal.ConnectionstringGPROCommon, ""), UserRepository.Instance.GetSelectItem(AppGlobal.ConnectionstringGPROCommon));
            obj = ChecklistMaper.Instance.MapInfoFromGPROCommon(obj);


            var result = new APIResultModel();
            result.Status = "OK";
            result.ResultInfo = JsonConvert.SerializeObject(obj);
            return result;
        }

        public APIResultModel GetJobById(int jobId, int userId)
        {
            var job = BLLChecklistJob.Instance.GetJobById(AppGlobal.ConnectionstringSanXuatChecklist, jobId, userId, StatusRepository.Instance.GetSelectItem(AppGlobal.ConnectionstringGPROCommon, "CHECKLIST"), UserRepository.Instance.GetSelectItem(AppGlobal.ConnectionstringGPROCommon));
            if (job != null && job.Attachs.Count > 0)
            {
                for (int i = 0; i < job.Attachs.Count; i++)
                {
                    //var arr = job.Attachs[i].Url.Split('/').ToList();
                    //var id = arr[arr.Count - 1];
                    //if (job.Attachs[i].Url.ToLower().Contains("sampletickets") || job.Attachs[i].Url.ToLower().Contains("phieu-lay-mau"))
                    //    job.Attachs[i].Name = ProManaApi.Instance.GetFileName(1, int.Parse(id));
                    //else if (job.Attachs[i].Url.ToLower().Contains("testrecords") || job.Attachs[i].Url.ToLower().Contains("ho-so"))
                    //    job.Attachs[i].Name = ProManaApi.Instance.GetFileName(2, int.Parse(id));

                }
            }

            var result = new APIResultModel();
            result.Status = "OK";
            result.ResultInfo = JsonConvert.SerializeObject(job);
            return result;

        }

        public APIResultModel getEmployeeSelect(string userIds)
        {
            var users = UserRepository.Instance.GetSelectItem(AppGlobal.ConnectionstringGPROCommon, userIds);
            var result = new APIResultModel();
            result.Status = "OK";
            result.ResultInfo = JsonConvert.SerializeObject(users);
            return result;
        }

        [HttpGet]
        public APIResultModel AdminUpdate(string model)
        {
           var result = new APIResultModel();
                result.Status = "OK";
            try
            { 
                var obj = JsonConvert.DeserializeObject<Checklist_JobModel>(model);

               // obj.ActionUser = UserContext.UserID;
                bool isOwner = true;
               var rs=   BLLChecklistJob.Instance.AdminUpdate(AppGlobal.ConnectionstringSanXuatChecklist, obj, isOwner);
                if (!rs.IsSuccess)
                {
                    result.Status = "ERROR";
                    result.ResultInfo = rs.Errors.FirstOrDefault().Message;
                }
            }
            catch (Exception ex)
            {
                //add error
                result.Status = "ERROR";
                result.ResultInfo = "Lỗi: " + ex.Message; 
            }
            return result ;
        }

    }
}
