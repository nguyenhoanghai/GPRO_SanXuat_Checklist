using GPRO.Core.Mvc;
using GPROCommon.Business.Enum;
using GPROCommon.Models;
using GPROCommon.Repository;
using GPROSanXuat_Checklist.App_Global;
using GPROSanXuat_Checklist.Business;
using GPROSanXuat_Checklist.Business.Model;
using Newtonsoft.Json;
using OfficeOpenXml;
using PMS.Service.Enum;
using PMS.Service.Models;
using PMS.Service.Repository;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web.Mvc;

namespace GPROSanXuat_Checklist.Controllers
{
    public class ChecklistJobController : BaseController
    {
        [HttpPost]
        public JsonResult GetByParentId(int parentId)
        {
            try
            {
                if (isAuthenticate)
                {
                    var objs = BLLChecklistJob.Instance.Gets(AppGlobal.ConnectionstringSanXuatChecklist, parentId, StatusRepository.Instance.GetSelectItem(AppGlobal.ConnectionstringGPROCommon, ""), UserRepository.Instance.GetSelectItem(AppGlobal.ConnectionstringGPROCommon));
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

        public JsonResult AdminUpdate(Checklist_JobModel model)
        {
            ResponseBase responseResult;
            try
            {
                if (isAuthenticate)
                {
                    model.ActionUser = UserContext.UserID;
                    responseResult = BLLChecklistJob.Instance.AdminUpdate(AppGlobal.ConnectionstringSanXuatChecklist, model, isOwner);
                    if (!responseResult.IsSuccess)
                    {
                        JsonDataResult.Result = "ERROR";
                        JsonDataResult.ErrorMessages.AddRange(responseResult.Errors);
                    }
                    else
                        JsonDataResult.Result = "OK";
                }
            }
            catch (Exception ex)
            {
                //add error
                JsonDataResult.Result = "ERROR";
                JsonDataResult.ErrorMessages.Add(new Error() { MemberName = "Update ", Message = "Lỗi: " + ex.Message });
            }
            return Json(JsonDataResult);
        }

        public JsonResult DoneJob(int jobId)
        {
            try
            {
                var rs = BLLChecklistJob.Instance.UpdateStatus(AppGlobal.ConnectionstringSanXuatChecklist, jobId, UserContext.UserID, (int)eStatus.Done, UserContext.EmployeeName);
                if (!rs.IsSuccess)
                {
                    JsonDataResult.Result = "ERROR";
                    JsonDataResult.ErrorMessages.AddRange(rs.Errors);
                }
                else
                    JsonDataResult.Result = "OK";
            }
            catch (Exception ex)
            {
            }
            return Json(JsonDataResult);
        }

        public ActionResult ReportJobs()
        {
            return View();
        }

        public JsonResult GetReports(int filter)
        {
            try
            {
                var objs = BLLChecklistJob.Instance.ReportJobs(AppGlobal.ConnectionstringSanXuatChecklist, filter, UserContext.UserID, StatusRepository.Instance.GetSelectItem(AppGlobal.ConnectionstringGPROCommon, "CheckList"), UserRepository.Instance.GetSelectItem(AppGlobal.ConnectionstringGPROCommon));
                JsonDataResult.Result = "OK";
                JsonDataResult.Records = objs;
            }
            catch (Exception ex)
            {
            }
            return Json(JsonDataResult);
        }

        public JsonResult GetReportNangXuat(int clId)
        {
            try
            {
                List<SonHaReportModel> objs = new List<SonHaReportModel>();
                var lenhProIds = BLLChecklist.Instance.getLenhProductIds(AppGlobal.ConnectionstringSanXuatChecklist, clId);
                if (lenhProIds.Count > 0)
                {
                    var _lines = LineRepository.Instance.GetLines(AppGlobal.ConnectionstringGPROCommon);
                    var _products = ProductRepository.Instance.Gets(AppGlobal.ConnectionstringGPROCommon);
                    var configs = AssignmentRepository.Instance.GetConfigByAppId(AppGlobal.ConnectionstringPMS, 11);
                    int typeOfGetBTPInLine = 1;
                    int.TryParse(configs.FirstOrDefault(c => c.Name.Trim().ToUpper().Equals(eAppConfigName.GETBTPINLINEBYTYPE)).Value.Trim(), out typeOfGetBTPInLine);

                    objs = AssignmentRepository.Instance.GetProductivitiesOfLenhPro(AppGlobal.ConnectionstringPMS, DateTime.Now, lenhProIds, null, typeOfGetBTPInLine, _lines, _products, 5, 6, 4, 1, 2);
                }
                JsonDataResult.Result = "OK";
                JsonDataResult.Records = JsonConvert.SerializeObject(objs);
            }
            catch (Exception ex)
            {
            }
            return Json(JsonDataResult);
        }

        public void Export_ReportNangXuat(int clId)
        {
            if (isAuthenticate)
            {
                var fi = new FileInfo(Server.MapPath(@"~\ReportTemplates\SH_Template.xlsx"));
                using (var package = new ExcelPackage(fi))
                {
                    var workbook = package.Workbook;
                    var worksheet = workbook.Worksheets.First();
                    List<SonHaReportModel> objs = new List<SonHaReportModel>();
                    var lenhProIds = BLLChecklist.Instance.getLenhProductIds(AppGlobal.ConnectionstringSanXuatChecklist, clId);
                    if (lenhProIds.Count > 0)
                    {
                        var _lines = LineRepository.Instance.GetLines(AppGlobal.ConnectionstringGPROCommon);
                        var _products = ProductRepository.Instance.Gets(AppGlobal.ConnectionstringGPROCommon);
                        var configs = AssignmentRepository.Instance.GetConfigByAppId(AppGlobal.ConnectionstringPMS, 11);
                        int typeOfGetBTPInLine = 1;
                        int.TryParse(configs.FirstOrDefault(c => c.Name.Trim().ToUpper().Equals(eAppConfigName.GETBTPINLINEBYTYPE)).Value.Trim(), out typeOfGetBTPInLine);

                        objs = AssignmentRepository.Instance.GetProductivitiesOfLenhPro(AppGlobal.ConnectionstringPMS, DateTime.Now, lenhProIds, null, typeOfGetBTPInLine, _lines, _products, 5, 6, 4, 1, 2);
                    }
                    if (objs.Count > 0)
                    {
                        worksheet.Cells[2, 2].Value = "Ngày " + DateTime.Now.ToString("dd/MM/yyyy");

                        for (int i = 0; i < objs[0].workingTimes.Count; i++)
                        {
                            worksheet.Cells[4, 12 + i].Value = objs[0].workingTimes[i].Name;
                        }

                        int _col = 12, _row = 5;
                        for (int i = 0; i < objs.Count; i++)
                        {
                            worksheet.Cells[_row, 2].Value = objs[i].LineName;
                            worksheet.Cells[_row, 3].Value = objs[i].CurrentLabors;
                            worksheet.Cells[_row, 4].Value = objs[i].CustName;
                            worksheet.Cells[_row, 5].Value = objs[i].CommoName;
                            worksheet.Cells[_row, 6].Value = objs[i].PriceCM;

                            worksheet.Cells[_row, 9].Value = (objs[i].lkCat - objs[i].Cat) > 0 ? (objs[i].lkCat - objs[i].Cat) : objs[i].Cat;
                            worksheet.Cells[_row, 10].Value = (objs[i].lkCat);
                            worksheet.Cells[_row, 11].Value = (objs[i].SanLuongKeHoach - objs[i].lkCat);
                            bindWorkingTimes(worksheet, objs[i], _row, 19);

                            _row++;
                            worksheet.Cells[_row, 9].Value = (objs[i].lkDongBo - objs[i].DongBo) > 0 ? (objs[i].lkDongBo - objs[i].DongBo) : objs[i].lkDongBo;
                            worksheet.Cells[_row, 10].Value = (objs[i].lkDongBo);
                            worksheet.Cells[_row, 11].Value = (objs[i].SanLuongKeHoach - objs[i].lkDongBo);
                            bindWorkingTimes(worksheet, objs[i], _row, 20);

                            _row++;
                            worksheet.Cells[_row, 9].Value = "-";
                            worksheet.Cells[_row, 10].Value = (objs[i].lkDongBo - (objs[i].LK_BTP - objs[i].LK_BTP_G));
                            worksheet.Cells[_row, 11].Value = "-";

                            bindWorkingTimes(worksheet, objs[i], _row, 21);

                            _row++;
                            worksheet.Cells[_row, 9].Value = ((objs[i].LK_BTP - objs[i].LK_BTP_G) - (objs[i].BTP_Day - objs[i].BTP_Day_G));
                            worksheet.Cells[_row, 10].Value = (objs[i].LK_BTP - objs[i].LK_BTP_G);
                            worksheet.Cells[_row, 11].Value = (objs[i].SanLuongKeHoach - (objs[i].LK_BTP - objs[i].LK_BTP_G));

                            bindWorkingTimes(worksheet, objs[i], _row, 0);

                            _row++;
                            bindWorkingTimes(worksheet, objs[i], _row, 1);

                            _row++;
                            bindWorkingTimes(worksheet, objs[i], _row, 2);

                            _row++;
                            worksheet.Cells[_row, 9].Value = objs[i].SanLuongKeHoach;
                            bindWorkingTimes(worksheet, objs[i], _row, 3);

                            _row++;
                            worksheet.Cells[_row, 9].Value = (objs[i].LuyKeBTPThoatChuyen - (objs[i].TC_Day - objs[i].TC_Day_G));
                            worksheet.Cells[_row, 10].Value = objs[i].LuyKeBTPThoatChuyen;
                            worksheet.Cells[_row, 11].Value = (objs[i].SanLuongKeHoach - objs[i].LuyKeBTPThoatChuyen);
                            bindWorkingTimes(worksheet, objs[i], _row, 4);

                            _row++;
                            worksheet.Cells[_row, 9].Value = (objs[i].SanLuongKeHoach - (objs[i].LuyKeBTPThoatChuyen - (objs[i].TC_Day - objs[i].TC_Day_G)));
                            bindWorkingTimes(worksheet, objs[i], _row, 5);

                            _row++;
                            int lktruocHomNay = objs[i].LuyKeBTPThoatChuyen - (objs[i].TC_Day - objs[i].TC_Day_G);
                            double tile = 0;
                            if (lktruocHomNay > 0)
                                tile = Math.Round((lktruocHomNay / (double)objs[i].SanLuongKeHoach) * 100, 2);
                            worksheet.Cells[_row, 9].Value = tile + "%";
                            bindWorkingTimes(worksheet, objs[i], _row, 6);

                            _row++;
                            bindWorkingTimes(worksheet, objs[i], _row, 7);

                            _row++;
                            worksheet.Cells[_row, 9].Value = (objs[i].LuyKeTH - (objs[i].TH_Day - objs[i].TH_Day_G));
                            worksheet.Cells[_row, 10].Value = objs[i].LuyKeTH;
                            worksheet.Cells[_row, 11].Value = (objs[i].SanLuongKeHoach - objs[i].LuyKeTH);
                            bindWorkingTimes(worksheet, objs[i], _row, 8);

                            _row++;
                            bindWorkingTimes(worksheet, objs[i], _row, 9);

                            _row++;
                            worksheet.Cells[_row, 9].Value = (objs[i].LuyKeBTPThoatChuyen - (objs[i].TC_Day - objs[i].TC_Day_G)) - (objs[i].LuyKeTH - (objs[i].TH_Day - objs[i].TH_Day_G));
                            //worksheet.Cells[_row, 7].Value =
                            worksheet.Cells[_row, 11].Value = (objs[i].SanLuongKeHoach - (objs[i].LuyKeBTPThoatChuyen - (objs[i].TC_Day - objs[i].TC_Day_G)));
                            bindWorkingTimes(worksheet, objs[i], _row, 10);

                            _row++;
                            worksheet.Cells[_row, 9].Value = (((objs[i].LuyKeTH - (objs[i].TH_Day - objs[i].TH_Day_G)) > 0 && (objs[i].LuyKeBTPThoatChuyen - (objs[i].TC_Day - objs[i].TC_Day_G)) > 0) ? Math.Round(((objs[i].LuyKeTH - (objs[i].TH_Day - objs[i].TH_Day_G)) / (double)(objs[i].LuyKeBTPThoatChuyen - (objs[i].TC_Day - objs[i].TC_Day_G))) * 100) : 0) + "%";
                            bindWorkingTimes(worksheet, objs[i], _row, 11);

                            _row++;
                            worksheet.Cells[_row, 9].Value = ((objs[i].LuyKeTH - (objs[i].TH_Day - objs[i].TH_Day_G)) > 0 ? Math.Round((((objs[i].LuyKeTH - (objs[i].TH_Day - objs[i].TH_Day_G)) / (double)objs[i].SanLuongKeHoach) * 100)) : 0) + "%";
                            bindWorkingTimes(worksheet, objs[i], _row, 12);

                            _row++;
                            bindWorkingTimes(worksheet, objs[i], _row, 13);

                            _row++;
                            worksheet.Cells[_row, 9].Value = (objs[i].lkUi - objs[i].Ui) > 0 ? (objs[i].lkUi - objs[i].Ui) : objs[i].Ui;
                            worksheet.Cells[_row, 10].Value = (objs[i].lkUi);
                            worksheet.Cells[_row, 11].Value = (objs[i].SanLuongKeHoach - objs[i].lkUi);
                            bindWorkingTimes(worksheet, objs[i], _row, 14);

                            _row++;
                            worksheet.Cells[_row, 9].Value = (objs[i].lkHoanThanh - objs[i].HoanThanh) > 0 ? (objs[i].lkHoanThanh - objs[i].HoanThanh) : objs[i].HoanThanh;
                            worksheet.Cells[_row, 10].Value = (objs[i].lkHoanThanh);
                            worksheet.Cells[_row, 11].Value = (objs[i].SanLuongKeHoach - objs[i].lkHoanThanh);
                            bindWorkingTimes(worksheet, objs[i], _row, 15);

                            _row++;
                            worksheet.Cells[_row, 9].Value = (objs[i].lkDongThung - objs[i].DongThung) > 0 ? (objs[i].lkDongThung - objs[i].DongThung) : objs[i].DongThung;
                            worksheet.Cells[_row, 10].Value = (objs[i].lkDongThung);
                            worksheet.Cells[_row, 11].Value = (objs[i].SanLuongKeHoach - objs[i].lkDongThung);
                            bindWorkingTimes(worksheet, objs[i], _row, 16);

                            _row++;

                            _row++;
                            bindWorkingTimes(worksheet, objs[i], _row, 18);

                            _row++;
                        }
                    }
                    Response.ClearContent();
                    Response.BinaryWrite(package.GetAsByteArray());
                    DateTime dateNow = DateTime.Now;
                    string fileName = "NangXuatNgay_" + dateNow.ToString("yyMMddhhmmss") + ".xlsx";
                    Response.AddHeader("content-disposition", "attachment;filename=" + fileName);
                    Response.ContentType = "application/excel";
                    Response.Flush();
                    Response.End();
                }
            }
        }

        private static void bindWorkingTimes(ExcelWorksheet worksheet, SonHaReportModel line, int _row, int index)
        {
            if (line.workingTimes.Count > 0)
            {
                double TCtoNow = 0, KCSToNow = 0;
                int _fCol = 12;
                for (int ii = 0; ii < line.workingTimes.Count; ii++)
                {
                    TCtoNow += line.workingTimes[ii].TC;
                    KCSToNow += line.workingTimes[ii].KCS;

                    var workTimeToNow = (line.workingTimes[ii].TimeEnd - line.workingTimes[ii].TimeStart).TotalMinutes * (ii + 1);

                    switch (index)
                    {
                        case 0: worksheet.Cells[_row, _fCol].Value = line.workingTimes[ii].BTP; break;
                        case 1: worksheet.Cells[_row, _fCol].Value = line.workingTimes[ii].BTPInLine; break;
                        case 2: worksheet.Cells[_row, _fCol].Value = line.workingTimes[ii].Lean; break;
                        case 3: worksheet.Cells[_row, _fCol].Value = line.workingTimes[ii].NormsHour; break;
                        case 4: worksheet.Cells[_row, _fCol].Value = line.workingTimes[ii].TC; break;
                        case 5:
                            double vl = line.workingTimes[ii].TC - (int)line.workingTimes[ii].NormsHour;
                            //worksheet.Cells[_row, _fCol].Style.Font.Color = ColorTranslator.ToOle(Color.FromArgb(192, 58, 0));
                            //if (vl < 0)
                            //    worksheet.Cells[_row, _fCol].Style.Interior.Color = ColorTranslator.ToOle(Color.FromArgb(255, 255, 0));
                            worksheet.Cells[_row, _fCol].Value = vl; break;
                        case 6: worksheet.Cells[_row, _fCol].Value = (line.workingTimes[ii].TC > 0 && line.workingTimes[ii].NormsHour > 0 ? Math.Round((line.workingTimes[ii].TC / line.workingTimes[ii].NormsHour) * 100) : 0) + "%"; break;
                        case 7:
                            //Hiệu suất = (Tổng sản lượng ra chuyền X thời gian chế tạo) : Số lao động X thời gian làm việc thực tế. 
                            var hieusuat = ((TCtoNow * Math.Round((line.ProductionTime * 100) / line.HieuSuatNgay)) / (line.CurrentLabors * (workTimeToNow * 60)));
                            if (double.IsInfinity(hieusuat))
                                hieusuat = 0;
                            worksheet.Cells[_row, _fCol].Value = Math.Round(hieusuat * 100, 1) + "%"; break;
                        case 8: worksheet.Cells[_row, _fCol].Value = line.workingTimes[ii].KCS; break;
                        case 9: worksheet.Cells[_row, _fCol].Value = line.workingTimes[ii].Error; break;
                        case 10: worksheet.Cells[_row, _fCol].Value = TCtoNow - KCSToNow; break;
                        case 11: worksheet.Cells[_row, _fCol].Value = ((line.workingTimes[ii].TC > 0 && line.workingTimes[ii].KCS > 0) ? Math.Round(((line.workingTimes[ii].KCS / (double)line.workingTimes[ii].TC) * 100)) : 0) + "%"; break;
                        case 12: worksheet.Cells[_row, _fCol].Value = ((line.workingTimes[ii].KCS > 0 && line.workingTimes[ii].NormsHour > 0) ? Math.Round(((line.workingTimes[ii].KCS / (double)line.workingTimes[ii].NormsHour) * 100)) : 0) + "%"; break;
                        case 13:
                            //Hiệu suất = (Tổng sản lượng ra chuyền X thời gian chế tạo) : Số lao động X thời gian làm việc thực tế. 
                            hieusuat = ((KCSToNow * Math.Round((line.ProductionTime * 100) / line.HieuSuatNgay)) / (line.CurrentLabors * (workTimeToNow * 60)));
                            if (double.IsInfinity(hieusuat))
                                hieusuat = 0;
                            worksheet.Cells[_row, _fCol].Value = Math.Round(hieusuat * 100, 1) + "%"; break;

                        case 14: worksheet.Cells[_row, _fCol].Value = line.workingTimes[ii].Ui; break;
                        case 15: worksheet.Cells[_row, _fCol].Value = line.workingTimes[ii].HoanThanh; break;
                        case 16: worksheet.Cells[_row, _fCol].Value = line.workingTimes[ii].DongThung; break;
                        case 18: worksheet.Cells[_row, _fCol].Value = Math.Ceiling((double)(line.workingTimes[ii].KCS * line.Price) / line.CurrentLabors); break;
                        case 19: worksheet.Cells[_row, _fCol].Value = line.workingTimes[ii].Cat; break;
                        case 20: worksheet.Cells[_row, _fCol].Value = line.workingTimes[ii].DongBo; break;
                    }
                    _fCol++;
                }

                switch (index)
                {
                    case 0: worksheet.Cells[_row, _fCol].Value = line.BTP_Day - line.BTP_Day_G; break;
                    case 3: worksheet.Cells[_row, _fCol].Value = line.NormsDay; break;
                    case 4: worksheet.Cells[_row, _fCol].Value = line.TC_Day - line.TC_Day_G; break;
                    case 5:
                        double vl = (line.TC_Day - line.TC_Day_G) - (int)line.NormsDay;
                        worksheet.Cells[_row, _fCol].Value = vl; break;
                    case 6: worksheet.Cells[_row, _fCol].Value = ((line.TC_Day - line.TC_Day_G) > 0 && line.NormsDay > 0 ? Math.Round(((line.TC_Day - line.TC_Day_G) / line.NormsDay) * 100) : 0) + "%"; break;

                    case 8: worksheet.Cells[_row, _fCol].Value = line.TH_Day - line.TH_Day_G; break;
                    case 9: worksheet.Cells[_row, _fCol].Value = line.Err_Day - line.Err_Day_G; break;
                    case 11: worksheet.Cells[_row, _fCol].Value = (((line.TC_Day - line.TC_Day_G) > 0 && (line.TH_Day - line.TH_Day_G) > 0) ? Math.Round((((line.TH_Day - line.TH_Day_G) / (double)(line.TC_Day - line.TC_Day_G)) * 100)) : 0) + "%"; break;
                    case 12: worksheet.Cells[_row, _fCol].Value = ((line.TH_Day - line.TH_Day_G) > 0 && line.NormsDay > 0 ? Math.Round((((line.TH_Day - line.TH_Day_G) / (double)line.NormsDay) * 100)) : 0) + "%"; break;

                    case 14: worksheet.Cells[_row, _fCol].Value = line.Ui; break;
                    case 15: worksheet.Cells[_row, _fCol].Value = line.HoanThanh; break;
                    case 16: worksheet.Cells[_row, _fCol].Value = line.DongThung; break;
                    case 18: worksheet.Cells[_row, _fCol].Value = Math.Ceiling((double)((line.TH_Day - line.TH_Day_G) * line.Price) / line.CurrentLabors); break;
                    case 19: worksheet.Cells[_row, _fCol].Value = line.Cat; break;
                    case 20: worksheet.Cells[_row, _fCol].Value = line.DongBo; break;

                }
            }
        }


    }
}