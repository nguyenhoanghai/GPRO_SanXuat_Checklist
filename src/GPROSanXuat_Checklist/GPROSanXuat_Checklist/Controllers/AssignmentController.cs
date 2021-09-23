using GPROCommon.Models;
using GPROCommon.Repository;
using GPROSanXuat_Checklist.App_Global;
using GPROSanXuat_Checklist.Business;
using PMS.Service.Models;
using PMS.Service.Repository;
using System;
using System.Linq;
using System.Web.Mvc;

namespace GPROSanXuat_Checklist.Controllers
{
    public class AssignmentController : BaseController
    {
        public ActionResult Index()
        { 
            return View();
        }

        [HttpPost]
        public JsonResult Gets(int lenhProId, int jtStartIndex = 0, int jtPageSize = 1000, string jtSorting = "")
        {
            try
            {
                if (isAuthenticate)
                {
                    var objs = AssignmentRepository.Instance.Gets(AppGlobal.ConnectionstringPMS, lenhProId, jtStartIndex, jtPageSize, jtSorting);
                    if (objs.Count > 0)
                    {
                        var _products = ProductRepository.Instance.Gets(AppGlobal.ConnectionstringGPROCommon);
                        var _lines = LineRepository.Instance.GetLines(AppGlobal.ConnectionstringGPROCommon);
                        var ids = objs.Where(x => x.LenhProductId.HasValue).Select(x => x.LenhProductId.Value).ToList();
                        var lenhInfos = BLLLenhSX.Instance.GetLenhProducts(AppGlobal.ConnectionstringSanXuatChecklist, ids);

                        for (int i = 0; i < objs.Count; i++)
                        {
                            var f1 = _products.FirstOrDefault(x => x.Id == objs[i].CommoId);
                            if (f1 != null)
                            {
                                objs[i].CommoName = f1.Name;
                                objs[i].TimeProductPerCommo = f1.ProductionTime;
                                objs[i].UnitName = f1.UnitName;
                            }
                            var f2 = _lines.FirstOrDefault(x => x.Id == objs[i].LineId);
                            if (f2 != null)
                                objs[i].LineName = f2.Name;

                            if (objs[i].LenhProductId.HasValue)
                            {
                                var f3 = lenhInfos.FirstOrDefault(x => x.Id == objs[i].LenhProductId);
                                if (f3 != null)
                                {
                                    objs[i].LenhProInfo = f3.Code;
                                    objs[i].LenhProQuantites = (int)f3.Double;
                                    objs[i].LenhProQuantites_PC = f3.Data;
                                }
                            }
                        }
                    }

                    JsonDataResult.Records = objs;
                    JsonDataResult.Result = "OK";
                    JsonDataResult.TotalRecordCount = objs.TotalItemCount;
                }
            }
            catch (Exception ex)
            {
                throw (ex);
            }
            return Json(JsonDataResult);
        }

        [HttpPost]
        public JsonResult Delete(int Id)
        {
            ResponseBase result;
            try
            {
                if (isAuthenticate)
                {
                    result = AssignmentRepository.Instance.Delete(AppGlobal.ConnectionstringPMS, Id);
                    if (!result.IsSuccess)
                    {
                        JsonDataResult.Result = "ERROR";
                        JsonDataResult.ErrorMessages.AddRange(result.Errors);
                    }
                    else
                        result.IsSuccess = true;
                }
            }
            catch (Exception ex)
            {
                throw (ex);
            }
            return Json(JsonDataResult);
        }

        [HttpPost]
        public JsonResult Finish(int Id)
        {
            ResponseBase result;
            try
            {
                if (isAuthenticate)
                {
                    result = AssignmentRepository.Instance.Finish(AppGlobal.ConnectionstringPMS, Id);
                    if (!result.IsSuccess)
                    {
                        JsonDataResult.Result = "ERROR";
                        JsonDataResult.ErrorMessages.AddRange(result.Errors);
                    }
                    else
                        result.IsSuccess = true;
                }
            }
            catch (Exception ex)
            {
                throw (ex);
            }
            return Json(JsonDataResult);
        }



        [HttpPost]
        public JsonResult Save(ChuyenSanPhamModel model)
        {
            ResponseBase responseResult;
            try
            {
                if (isAuthenticate)
                {
                    responseResult = AssignmentRepository.Instance.InsertOrUpdate(AppGlobal.ConnectionstringPMS, model);

                    if (!responseResult.IsSuccess)
                    {
                        JsonDataResult.Result = "ERROR";
                        JsonDataResult.ErrorMessages.AddRange(responseResult.Errors);
                    }
                    else
                    {
                        JsonDataResult.Result = "OK";
                        if(model.Lenh_ProductId.HasValue )
                        {
                            BLLLenhSX.Instance.UpdatePC(AppGlobal.ConnectionstringSanXuatChecklist, model.Lenh_ProductId.Value, model.SLCu, model.SLMoi);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw (ex);
            }
            return Json(JsonDataResult);
        }


        [HttpPost]
        public JsonResult GetNXs( int cspId, int jtStartIndex = 0, int jtPageSize = 1000, string jtSorting = "")
        {
            try
            {
                if (isAuthenticate)
                {
                    var objs = DailyInfoRepository.Instance.Gets(AppGlobal.ConnectionstringPMS, cspId, jtStartIndex, jtPageSize, jtSorting);
                    //if (objs.Count > 0)
                    //{
                    //    var _products = ProductRepository.Instance.Gets(AppGlobal.ConnectionstringGPROCommon);
                    //    var _lines = LineRepository.Instance.GetLines(AppGlobal.ConnectionstringGPROCommon);
                    //    var ids = objs.Where(x => x.LenhProductId.HasValue).Select(x => x.LenhProductId.Value).ToList();
                    //    var lenhInfos = BLLLenhSX.Instance.GetLenhProducts(AppGlobal.ConnectionstringSanXuatChecklist, ids);

                    //    for (int i = 0; i < objs.Count; i++)
                    //    {
                    //        var f1 = _products.FirstOrDefault(x => x.Id == objs[i].CommoId);
                    //        if (f1 != null)
                    //        {
                    //            objs[i].CommoName = f1.Name;
                    //            objs[i].TimeProductPerCommo = f1.ProductionTime;
                    //            objs[i].UnitName = f1.UnitName;
                    //        }
                    //        var f2 = _lines.FirstOrDefault(x => x.Id == objs[i].LineId);
                    //        if (f2 != null)
                    //            objs[i].LineName = f2.Name;

                    //        if (objs[i].LenhProductId.HasValue)
                    //        {
                    //            var f3 = lenhInfos.FirstOrDefault(x => x.Id == objs[i].LenhProductId);
                    //            if (f3 != null)
                    //            {
                    //                objs[i].LenhProInfo = f3.Code;
                    //                objs[i].LenhProQuantites = (int)f3.Double;
                    //                objs[i].LenhProQuantites_PC = f3.Data;
                    //            }
                    //        }
                    //    }
                    //}

                    JsonDataResult.Records = objs;
                    JsonDataResult.Result = "OK";
                    JsonDataResult.TotalRecordCount = objs.TotalItemCount;
                }
            }
            catch (Exception ex)
            {
                throw (ex);
            }
            return Json(JsonDataResult);
        }


        [HttpPost]
        public JsonResult GetNXGios(string strDate, int cspId, int lineId)
        {
            try
            {
                if (isAuthenticate)
                {
                    var objs = DailyInfoRepository.Instance.GetInforByDate(AppGlobal.ConnectionstringPMS,strDate, cspId ,lineId);
                      
                    JsonDataResult.Records = objs;
                    JsonDataResult.Result = "OK"; 
                }
            }
            catch (Exception ex)
            {
                throw (ex);
            }
            return Json(JsonDataResult);
        }

    }
}