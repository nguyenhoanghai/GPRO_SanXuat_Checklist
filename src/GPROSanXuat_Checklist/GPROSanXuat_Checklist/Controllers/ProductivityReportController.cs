using GPROCommon.Models;
using GPROCommon.Repository;
using GPROSanXuat_Checklist.App_Global;
using GPROSanXuat_Checklist.Business;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using PMS.Service.Enum;
using PMS.Service.Models;
using PMS.Service.Repository;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Web.Mvc;

namespace GPROSanXuat_Checklist.Controllers
{
    public class ProductivityReportController : BaseController
    {
        #region sản luong cắt
        public ActionResult ReportCutting()
        {
            return View();
        }
        #endregion


        public ActionResult ReportComplete()
        {
            return View();
        }

        [HttpPost]
        public JsonResult GetCuttings(int floorId, DateTime from, DateTime to, int type)
        {
            try
            {
                if (isAuthenticate)
                {
                    var _phases = PhaseInDayRepository.Instance.GetPhases(AppGlobal.ConnectionstringPMS, type);
                    List<AddPhaseQuantitiesModel> objs = PhaseInDayRepository.Instance.ReportPhaseDayInfo(AppGlobal.ConnectionstringPMS, type, from, to);
                    for (int i = 0; i < _phases.Count; i++)
                    {
                        int tang = objs.Where(x => x.PhaseId == _phases[i].Value && x.CommandTypeId == (int)eCommandRecive.ProductIncrease).Sum(x => x.Quantity);
                        int giam = objs.Where(x => x.PhaseId == _phases[i].Value && x.CommandTypeId != (int)eCommandRecive.ProductIncrease).Sum(x => x.Quantity);
                        _phases[i].Data = tang - giam;
                    }
                    JsonDataResult.Records = objs.GroupBy(x => x.strDate).Select(x => new { Date = x.Key, Phases = x.ToList() }).ToList();
                    JsonDataResult.Data = _phases;
                    JsonDataResult.Result = "OK";
                }
            }
            catch (Exception ex)
            {
                throw (ex);
            }
            return Json(JsonDataResult);
        }

        public void export_Cuttings(int floorId, string from, string to, int type)
        {
            if (isAuthenticate)
            {
                try
                {
                    var excelPackage = new ExcelPackage();
                    excelPackage.Workbook.Properties.Author = "Checklist";
                    excelPackage.Workbook.Properties.Title = "Theo dõi sản lượng";
                    var sheet = excelPackage.Workbook.Worksheets.Add("PTCĐ");
                    sheet.Name = "Sheet1";
                    sheet.Cells.Style.Font.Size = 12;
                    sheet.Cells.Style.Font.Name = "Times New Roman";

                    DateTime _from = DateTime.Now, _to = DateTime.Now;
                    _from = DateTime.ParseExact(from, "dd/MM/yyyy", CultureInfo.InvariantCulture);
                    _to = DateTime.ParseExact(to, "dd/MM/yyyy", CultureInfo.InvariantCulture);
                    var _phases = PhaseInDayRepository.Instance.GetPhases(AppGlobal.ConnectionstringPMS, type);
                    List<AddPhaseQuantitiesModel> objs = PhaseInDayRepository.Instance.ReportPhaseDayInfo(AppGlobal.ConnectionstringPMS, type, _from, _to);
                    for (int i = 0; i < _phases.Count; i++)
                    {
                        int tang = objs.Where(x => x.PhaseId == _phases[i].Value && x.CommandTypeId == (int)eCommandRecive.ProductIncrease).Sum(x => x.Quantity);
                        int giam = objs.Where(x => x.PhaseId == _phases[i].Value && x.CommandTypeId != (int)eCommandRecive.ProductIncrease).Sum(x => x.Quantity);
                        _phases[i].Data = tang - giam;
                    }

                    var groupList = objs.GroupBy(x => x.strDate).Select(x => new { Date = x.Key, Phases = x.ToList() }).ToList();

                    if (type == 1)
                        sheet.Cells[1, 2].Value = ("Bảng năng xuất sản lượng cắt").ToUpper();
                    else
                        sheet.Cells[1, 2].Value = ("Bảng năng xuất sản lượng hoàn thành").ToUpper();
                    sheet.Cells[1, 2].Style.Font.Size = 14;
                    sheet.Cells[1, 2, 1, _phases.Count + 2].Merge = true;
                    sheet.Cells[1, 2, 1, _phases.Count + 2].Style.Font.Bold = true;
                    sheet.Cells[1, 2, 1, _phases.Count + 2].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                    // sheet.Cells[1, 2, 1, 7].Style.Fill.PatternType = ExcelFillStyle.Solid;
                    //  sheet.Cells[1, 2, 1, 7].Style.Fill.BackgroundColor.SetColor(Color.FromArgb(65, 149, 221));
                    //  sheet.Cells[1, 2, 1, 7].Style.Font.Color.SetColor(Color.White);



                    sheet.Cells[2, 2].Value = "Từ Ngày " + from + " đến ngày " + to;
                    sheet.Cells[2, 2, 2, _phases.Count + 2].Merge = true;
                    //sheet.Cells[2, 2, 2, _lines.Count + 2].Style.Border.BorderAround(ExcelBorderStyle.Thin);

                    sheet.Cells[4, 2].Value = "Ngày";
                    sheet.Cells[4, 2].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                    sheet.Cells[4, 2].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;

                    for (int i = 0; i < _phases.Count; i++)
                    {
                        sheet.Cells[4, 3 + i].Value = _phases[i].Name;
                        sheet.Cells[4, 3 + i].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                        sheet.Cells[4, 3 + i].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                    }
                    if (groupList.Count > 0)
                    {
                        int row = 5;
                        for (int i = 0; i < groupList.Count; i++)
                        {
                            sheet.Cells[row, 2].Value = groupList[i].Date;
                            sheet.Cells[row, 2].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                            sheet.Cells[row, 2].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;

                            for (int ii = 0; ii < _phases.Count; ii++)
                            {
                                var founds = groupList[i].Phases.Where(x => x.PhaseId == _phases[ii].Value);
                                string _value = "0";
                                if (founds != null && founds.Count() > 0)
                                {
                                    int tang = founds.Where(x => x.CommandTypeId == (int)eCommandRecive.ProductIncrease).Sum(x => x.Quantity);
                                    int giam = founds.Where(x => x.CommandTypeId != (int)eCommandRecive.ProductIncrease).Sum(x => x.Quantity);
                                    _value = (tang - giam).ToString();
                                }
                                sheet.Cells[row, 3 + ii].Value = _value;
                                sheet.Cells[row, 3 + ii].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                                sheet.Cells[row, 3 + ii].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                            }
                            row++;
                        }

                        sheet.Cells[row, 2].Value = "Tổng";
                        sheet.Cells[row, 2].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                        sheet.Cells[row, 2].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;

                        for (int ii = 0; ii < _phases.Count; ii++)
                        {
                            sheet.Cells[row, 3 + ii].Value = _phases[ii].Data;
                            sheet.Cells[row, 3 + ii].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                            sheet.Cells[row, 3 + ii].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                        }

                        AddCellBorder(sheet, row);
                    }
                    sheet.Cells.AutoFitColumns();
                    sheet.Column(6).Width = 16;
                    sheet.Column(7).Width = 16;
                    sheet.Column(14).Style.WrapText = true;
                    Response.ClearContent();
                    Response.BinaryWrite(excelPackage.GetAsByteArray());
                    DateTime dateNow = DateTime.Now;
                    string fileName = "SanLuongCat_" + dateNow.ToString("yyMMddhhmmss") + ".xlsx";
                    if (type == 2)
                        fileName = "SanLuongHoanThanh_" + dateNow.ToString("yyMMddhhmmss") + ".xlsx";
                    Response.AddHeader("content-disposition", "attachment;filename=" + fileName);
                    Response.ContentType = "application/excel";
                    Response.Flush();
                    Response.End();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }


        #region BTP        
        public ActionResult ReportBTP()
        {
            return View();
        }

        [HttpPost]
        public JsonResult Gets(int lineId, int jtStartIndex = 0, int jtPageSize = 1000, string jtSorting = "")
        {
            try
            {
                if (isAuthenticate)
                {
                    var objs = AssignmentRepository.Instance.Gets(AppGlobal.ConnectionstringPMS, jtStartIndex, jtPageSize, jtSorting, lineId);
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
        public JsonResult GetBTPs(int floorId, DateTime from, DateTime to)
        {
            try
            {
                if (isAuthenticate)
                {
                    var _lines = LineRepository.Instance.GetLines(AppGlobal.ConnectionstringGPROCommon, floorId);
                    List<NangXuatModel> objs = _GetBTPs(from, to, _lines);
                    for (int i = 0; i < _lines.Count; i++)
                    {
                        _lines[i].IdDen = objs.Where(x => x.LineId == _lines[i].Id).Sum(x => x.BTPTang - x.BTPGiam);
                    }
                    JsonDataResult.Records = objs.GroupBy(x => x.Ngay).Select(x => new { Date = x.Key, Lines = x.ToList() }).ToList();
                    JsonDataResult.Data = _lines;
                    JsonDataResult.Result = "OK";
                }
            }
            catch (Exception ex)
            {
                throw (ex);
            }
            return Json(JsonDataResult);
        }

        private List<NangXuatModel> _GetBTPs(DateTime from, DateTime to, List<LineModel> _lines)
        {
            var objs = ProductivityRespository.Instance.Gets(AppGlobal.ConnectionstringPMS, from, to, _lines.Select(x => x.Id).ToList());
            if (objs.Count > 0)
            {
                var _products = ProductRepository.Instance.Gets(AppGlobal.ConnectionstringGPROCommon);

                var ids = objs.Where(x => x.LenhProId > 0).Select(x => x.LenhProId).ToList();
                var lenhInfos = BLLLenhSX.Instance.GetLenhProducts(AppGlobal.ConnectionstringSanXuatChecklist, ids);

                for (int i = 0; i < objs.Count; i++)
                {
                    var f1 = _products.FirstOrDefault(x => x.Id == objs[i].ProductId);
                    if (f1 != null)
                    {
                        objs[i].ProductName = f1.Name;
                        objs[i].UnitName = f1.UnitName;
                    }
                    var f2 = _lines.FirstOrDefault(x => x.Id == objs[i].LineId);
                    if (f2 != null)
                        objs[i].LineName = f2.Name;

                    if (objs[i].LenhProId > 0)
                    {
                        var f3 = lenhInfos.FirstOrDefault(x => x.Id == objs[i].LenhProId);
                        if (f3 != null)
                        {
                            objs[i].LenhProInfo = f3.Code;
                        }
                    }
                }
            }

            return objs;
        }

        #region export excel
        public void export_btp(int floorId, string from, string to)
        {
            if (isAuthenticate)
            {
                try
                {
                    var excelPackage = new ExcelPackage();
                    excelPackage.Workbook.Properties.Author = "Checklist";
                    excelPackage.Workbook.Properties.Title = "Theo dõi BTP giao chuyền";
                    var sheet = excelPackage.Workbook.Worksheets.Add("PTCĐ");
                    sheet.Name = "Sheet1";
                    sheet.Cells.Style.Font.Size = 12;
                    sheet.Cells.Style.Font.Name = "Times New Roman";



                    DateTime _from = DateTime.Now, _to = DateTime.Now;
                    _from = DateTime.ParseExact(from, "dd/MM/yyyy", CultureInfo.InvariantCulture);
                    _to = DateTime.ParseExact(to, "dd/MM/yyyy", CultureInfo.InvariantCulture);
                    var _lines = LineRepository.Instance.GetLines(AppGlobal.ConnectionstringGPROCommon, floorId);
                    List<NangXuatModel> objs = _GetBTPs(_from, _to, _lines);
                    for (int i = 0; i < _lines.Count; i++)
                    {
                        _lines[i].IdDen = objs.Where(x => x.LineId == _lines[i].Id).Sum(x => x.BTPTang - x.BTPGiam);
                    }
                    var groupList = objs.GroupBy(x => x.Ngay).Select(x => new { Date = x.Key, Lines = x.ToList() }).ToList();

                    sheet.Cells[1, 2].Value = "BÁN THÀNH PHẪM GIAO CHUYỀN  ";
                    sheet.Cells[1, 2].Style.Font.Size = 14;
                    sheet.Cells[1, 2, 1, _lines.Count + 2].Merge = true;
                    sheet.Cells[1, 2, 1, _lines.Count + 2].Style.Font.Bold = true;
                    sheet.Cells[1, 2, 1, _lines.Count + 2].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                    // sheet.Cells[1, 2, 1, 7].Style.Fill.PatternType = ExcelFillStyle.Solid;
                    //  sheet.Cells[1, 2, 1, 7].Style.Fill.BackgroundColor.SetColor(Color.FromArgb(65, 149, 221));
                    //  sheet.Cells[1, 2, 1, 7].Style.Font.Color.SetColor(Color.White);



                    sheet.Cells[2, 2].Value = "Từ Ngày " + from + " đến ngày " + to;
                    sheet.Cells[2, 2, 2, _lines.Count + 2].Merge = true;
                    //sheet.Cells[2, 2, 2, _lines.Count + 2].Style.Border.BorderAround(ExcelBorderStyle.Thin);

                    sheet.Cells[4, 2].Value = "Ngày";
                    sheet.Cells[4, 2].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                    sheet.Cells[4, 2].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;

                    for (int i = 0; i < _lines.Count; i++)
                    {
                        sheet.Cells[4, 3 + i].Value = _lines[i].Name;
                        sheet.Cells[4, 3 + i].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                        sheet.Cells[4, 3 + i].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                    }
                    if (groupList.Count > 0)
                    {
                        int row = 5;
                        for (int i = 0; i < groupList.Count; i++)
                        {
                            sheet.Cells[row, 2].Value = groupList[i].Date;
                            sheet.Cells[row, 2].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                            sheet.Cells[row, 2].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;

                            for (int ii = 0; ii < _lines.Count; ii++)
                            {
                                var found = groupList[i].Lines.FirstOrDefault(x => x.LineId == _lines[ii].Id);
                                sheet.Cells[row, 3 + ii].Value = found != null ? (found.BTPTang - found.BTPGiam) : 0;
                                sheet.Cells[row, 3 + ii].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                                sheet.Cells[row, 3 + ii].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                            }
                            row++;
                        }

                        sheet.Cells[row, 2].Value = "Tổng";
                        sheet.Cells[row, 2].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                        sheet.Cells[row, 2].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;

                        for (int ii = 0; ii < _lines.Count; ii++)
                        {
                            sheet.Cells[row, 3 + ii].Value = _lines[ii].IdDen;
                            sheet.Cells[row, 3 + ii].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                            sheet.Cells[row, 3 + ii].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                        }

                        AddCellBorder(sheet, row);
                    }
                    sheet.Cells.AutoFitColumns();
                    sheet.Column(6).Width = 16;
                    sheet.Column(7).Width = 16;
                    sheet.Column(14).Style.WrapText = true;
                    Response.ClearContent();
                    Response.BinaryWrite(excelPackage.GetAsByteArray());
                    DateTime dateNow = DateTime.Now;
                    string fileName = "BTP_GiaoChuyen_" + dateNow.ToString("yyMMddhhmmss") + ".xlsx";
                    Response.AddHeader("content-disposition", "attachment;filename=" + fileName);
                    Response.ContentType = "application/excel";
                    Response.Flush();
                    Response.End();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        private static void AddCellBorder(ExcelWorksheet sheet, int rowIndex)
        {
            sheet.Cells[rowIndex, 2].Style.Border.BorderAround(ExcelBorderStyle.Thin);
            sheet.Cells[rowIndex, 3].Style.Border.BorderAround(ExcelBorderStyle.Thin);
            sheet.Cells[rowIndex, 4].Style.Border.BorderAround(ExcelBorderStyle.Thin);
            sheet.Cells[rowIndex, 5].Style.Border.BorderAround(ExcelBorderStyle.Thin);
            sheet.Cells[rowIndex, 6].Style.Border.BorderAround(ExcelBorderStyle.Thin);
            sheet.Cells[rowIndex, 7].Style.Border.BorderAround(ExcelBorderStyle.Thin);
            sheet.Cells[rowIndex, 8].Style.Border.BorderAround(ExcelBorderStyle.Thin);
            sheet.Cells[rowIndex, 9].Style.Border.BorderAround(ExcelBorderStyle.Thin);
        }

        #endregion

        #endregion

        #region theo doi TC & KCS hàng giờ      
        public ActionResult ReportProductityInDay()
        {
            return View();
        }

        [HttpPost]
        public JsonResult GetProductityInDay(int floorId, int type)
        {
            try
            {
                if (isAuthenticate)
                {
                    var _lines = LineRepository.Instance.GetLines(AppGlobal.ConnectionstringGPROCommon, floorId);
                    var _products = ProductRepository.Instance.Gets(AppGlobal.ConnectionstringGPROCommon);

                    var objs = ProductivityRespository.Instance.GetProductivityInDay(AppGlobal.ConnectionstringPMS, _lines, _products);
                    var workingTimes = ShiftRepository.Instance.GetListWorkHoursOfLineByLineId(AppGlobal.ConnectionstringPMS, _lines.FirstOrDefault().Id);

                    for (int i = 0; i < workingTimes.Count; i++)
                    {
                        workingTimes[i].KCS = objs.Where(x => x.Name == workingTimes[i].Name).Sum(x => x.KCS);
                        workingTimes[i].TC = objs.Where(x => x.Name == workingTimes[i].Name).Sum(x => x.TC);
                        workingTimes[i].NormsHour = objs.Where(x => x.Name == workingTimes[i].Name).Sum(x => x.NormsHour);
                        workingTimes[i].Error = objs.Where(x => x.Name == workingTimes[i].Name).Sum(x => x.Error);
                    }
                    JsonDataResult.Records = objs.GroupBy(x => x.LineName).Select(x => new { Name = x.Key, Times = x.ToList() }).ToList();
                    JsonDataResult.Data = workingTimes;
                    JsonDataResult.Result = "OK";
                }
            }
            catch (Exception ex)
            {
                throw (ex);
            }
            return Json(JsonDataResult);
        }

        #region export excel
        public void export_ProductityInDay(int floorId, int type)
        {
            if (isAuthenticate)
            {
                try
                {
                    var excelPackage = new ExcelPackage();
                    excelPackage.Workbook.Properties.Author = "Checklist";
                    if (type == 1)
                        excelPackage.Workbook.Properties.Title = "Theo dõi năng xuất thoát chuyền hàng giờ";
                    else
                        excelPackage.Workbook.Properties.Title = "Theo dõi năng xuất kiểm đạt hàng giờ";
                    var sheet = excelPackage.Workbook.Worksheets.Add("PTCĐ");
                    sheet.Name = "Sheet1";
                    sheet.Cells.Style.Font.Size = 12;
                    sheet.Cells.Style.Font.Name = "Times New Roman";

                    var _lines = LineRepository.Instance.GetLines(AppGlobal.ConnectionstringGPROCommon, floorId);
                    var _products = ProductRepository.Instance.Gets(AppGlobal.ConnectionstringGPROCommon);

                    var objs = ProductivityRespository.Instance.GetProductivityInDay(AppGlobal.ConnectionstringPMS, _lines, _products);
                    var workingTimes = ShiftRepository.Instance.GetListWorkHoursOfLineByLineId(AppGlobal.ConnectionstringPMS, _lines.FirstOrDefault().Id);

                    for (int i = 0; i < workingTimes.Count; i++)
                    {
                        workingTimes[i].KCS = objs.Where(x => x.Name == workingTimes[i].Name).Sum(x => x.KCS);
                        workingTimes[i].TC = objs.Where(x => x.Name == workingTimes[i].Name).Sum(x => x.TC);
                        workingTimes[i].NormsHour = objs.Where(x => x.Name == workingTimes[i].Name).Sum(x => x.NormsHour);
                        workingTimes[i].Error = objs.Where(x => x.Name == workingTimes[i].Name).Sum(x => x.Error);
                    }
                    var groupList = objs.GroupBy(x => x.LineName).Select(x => new { Name = x.Key, Times = x.ToList() }).ToList();
                    if (type == 1)
                        sheet.Cells[1, 2].Value = ("Năng xuất thoát chuyền hàng giờ ").ToUpper();
                    else
                        sheet.Cells[1, 2].Value = ("năng xuất kiểm đạt hàng giờ").ToUpper();
                    sheet.Cells[1, 2].Style.Font.Size = 14;
                    sheet.Cells[1, 2, 1, _lines.Count + 2].Merge = true;
                    sheet.Cells[1, 2, 1, _lines.Count + 2].Style.Font.Bold = true;
                    sheet.Cells[1, 2, 1, _lines.Count + 2].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                    // sheet.Cells[1, 2, 1, 7].Style.Fill.PatternType = ExcelFillStyle.Solid;
                    //  sheet.Cells[1, 2, 1, 7].Style.Fill.BackgroundColor.SetColor(Color.FromArgb(65, 149, 221));
                    //  sheet.Cells[1, 2, 1, 7].Style.Font.Color.SetColor(Color.White);



                    sheet.Cells[2, 2].Value = "Ngày " + DateTime.Now.ToString("dd/MM/yyyy");
                    sheet.Cells[2, 2, 2, _lines.Count + 2].Merge = true;
                    //sheet.Cells[2, 2, 2, _lines.Count + 2].Style.Border.BorderAround(ExcelBorderStyle.Thin);

                    sheet.Cells[4, 2].Value = "Chuyền";
                    sheet.Cells[4, 2].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                    sheet.Cells[4, 2].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;

                    for (int i = 0; i < workingTimes.Count; i++)
                    {
                        sheet.Cells[4, 3 + i].Value = workingTimes[i].Name;
                        sheet.Cells[4, 3 + i].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                        sheet.Cells[4, 3 + i].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                    }
                    if (groupList.Count > 0)
                    {
                        int row = 5;
                        for (int i = 0; i < groupList.Count; i++)
                        {
                            sheet.Cells[row, 2].Value = groupList[i].Name;
                            sheet.Cells[row, 2].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                            sheet.Cells[row, 2].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;

                            for (int ii = 0; ii < workingTimes.Count; ii++)
                            {
                                var found = groupList[i].Times.FirstOrDefault(x => x.Name == workingTimes[ii].Name);
                                if (type == 1)
                                    sheet.Cells[row, 3 + ii].Value = found != null ? (found.TC + "/" + found.NormsHour) : "0/0";
                                else
                                    sheet.Cells[row, 3 + ii].Value = found != null ? (found.KCS + "/" + found.NormsHour) : "0/0";
                                sheet.Cells[row, 3 + ii].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                                sheet.Cells[row, 3 + ii].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                            }
                            row++;
                        }

                        sheet.Cells[row, 2].Value = "Tổng";
                        sheet.Cells[row, 2].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                        sheet.Cells[row, 2].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;

                        for (int ii = 0; ii < workingTimes.Count; ii++)
                        {
                            if (type == 1)
                                sheet.Cells[row, 3 + ii].Value = (workingTimes[ii].TC + "/" + workingTimes[ii].NormsHour);
                            else
                                sheet.Cells[row, 3 + ii].Value = (workingTimes[ii].KCS + "/" + workingTimes[ii].NormsHour);
                            sheet.Cells[row, 3 + ii].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                            sheet.Cells[row, 3 + ii].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                        }

                        AddCellBorder(sheet, row);
                    }
                    sheet.Cells.AutoFitColumns();
                    sheet.Column(6).Width = 16;
                    sheet.Column(7).Width = 16;
                    sheet.Column(14).Style.WrapText = true;
                    Response.ClearContent();
                    Response.BinaryWrite(excelPackage.GetAsByteArray());
                    DateTime dateNow = DateTime.Now;
                    string fileName = "ThoatChuyenHangGio_" + dateNow.ToString("yyMMddhhmmss") + ".xlsx";
                    if (type == 2)
                        fileName = "KiemDatHangGio_" + dateNow.ToString("yyMMddhhmmss") + ".xlsx";
                    Response.AddHeader("content-disposition", "attachment;filename=" + fileName);
                    Response.ContentType = "application/excel";
                    Response.Flush();
                    Response.End();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        #endregion
        #endregion

        #region  theo doi nang xuat hang ngày
        public ActionResult ProductityDaily()
        {
            return View();
        }

        [HttpPost]
        public JsonResult GetProductivityDaily(int floorId, DateTime from, DateTime to, int type)
        {
            try
            {
                if (isAuthenticate)
                {
                    var _lines = LineRepository.Instance.GetLines(AppGlobal.ConnectionstringGPROCommon, floorId);
                    List<NangXuatModel> objs = ProductivityRespository.Instance.Gets(AppGlobal.ConnectionstringPMS, from, to, _lines.Select(x => x.Id).ToList());
                    for (int i = 0; i < _lines.Count; i++)
                    {
                        if (type == 1)
                            _lines[i].IdDen = objs.Where(x => x.LineId == _lines[i].Id).Sum(x => x.BTPThoatChuyenNgay - x.BTPThoatChuyenNgayGiam);
                        else
                            _lines[i].IdDen = objs.Where(x => x.LineId == _lines[i].Id).Sum(x => x.ThucHienNgay - x.ThucHienNgayGiam);

                        _lines[i].STTReadNS = (int)objs.Where(x => x.LineId == _lines[i].Id).Sum(x => x.DinhMucNgay);
                    }
                    JsonDataResult.Records = objs.GroupBy(x => x.Ngay).Select(x => new { Date = x.Key, Lines = x.ToList() }).ToList();
                    JsonDataResult.Data = _lines;
                    JsonDataResult.Result = "OK";
                }
            }
            catch (Exception ex)
            {
                throw (ex);
            }
            return Json(JsonDataResult);
        }

        public void export_ProductivityDaily(int floorId, string from, string to, int type)
        {
            if (isAuthenticate)
            {
                try
                {
                    var excelPackage = new ExcelPackage();
                    excelPackage.Workbook.Properties.Author = "Checklist";
                    excelPackage.Workbook.Properties.Title = "Theo dõi BTP giao chuyền";
                    var sheet = excelPackage.Workbook.Worksheets.Add("PTCĐ");
                    sheet.Name = "Sheet1";
                    sheet.Cells.Style.Font.Size = 12;
                    sheet.Cells.Style.Font.Name = "Times New Roman";

                    DateTime _from = DateTime.Now, _to = DateTime.Now;
                    _from = DateTime.ParseExact(from, "dd/MM/yyyy", CultureInfo.InvariantCulture);
                    _to = DateTime.ParseExact(to, "dd/MM/yyyy", CultureInfo.InvariantCulture);
                    var _lines = LineRepository.Instance.GetLines(AppGlobal.ConnectionstringGPROCommon, floorId);
                    List<NangXuatModel> objs = ProductivityRespository.Instance.Gets(AppGlobal.ConnectionstringPMS, _from, _to, _lines.Select(x => x.Id).ToList());
                    for (int i = 0; i < _lines.Count; i++)
                    {
                        if (type == 1)
                            _lines[i].IdDen = objs.Where(x => x.LineId == _lines[i].Id).Sum(x => x.BTPThoatChuyenNgay - x.BTPThoatChuyenNgayGiam);
                        else
                            _lines[i].IdDen = objs.Where(x => x.LineId == _lines[i].Id).Sum(x => x.ThucHienNgay - x.ThucHienNgayGiam);

                        _lines[i].STTReadNS = (int)objs.Where(x => x.LineId == _lines[i].Id).Sum(x => x.DinhMucNgay);
                    }
                    var groupList = objs.GroupBy(x => x.Ngay).Select(x => new { Date = x.Key, Lines = x.ToList() }).ToList();

                    if (type == 1)
                        sheet.Cells[1, 2].Value = ("Bảng năng xuất thoát chuyền").ToUpper();
                    else
                        sheet.Cells[1, 2].Value = ("Bảng năng xuất kiểm đạt").ToUpper();
                    sheet.Cells[1, 2].Style.Font.Size = 14;
                    sheet.Cells[1, 2, 1, _lines.Count + 2].Merge = true;
                    sheet.Cells[1, 2, 1, _lines.Count + 2].Style.Font.Bold = true;
                    sheet.Cells[1, 2, 1, _lines.Count + 2].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                    // sheet.Cells[1, 2, 1, 7].Style.Fill.PatternType = ExcelFillStyle.Solid;
                    //  sheet.Cells[1, 2, 1, 7].Style.Fill.BackgroundColor.SetColor(Color.FromArgb(65, 149, 221));
                    //  sheet.Cells[1, 2, 1, 7].Style.Font.Color.SetColor(Color.White);



                    sheet.Cells[2, 2].Value = "Từ Ngày " + from + " đến ngày " + to;
                    sheet.Cells[2, 2, 2, _lines.Count + 2].Merge = true;
                    //sheet.Cells[2, 2, 2, _lines.Count + 2].Style.Border.BorderAround(ExcelBorderStyle.Thin);

                    sheet.Cells[4, 2].Value = "Ngày";
                    sheet.Cells[4, 2].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                    sheet.Cells[4, 2].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;

                    for (int i = 0; i < _lines.Count; i++)
                    {
                        sheet.Cells[4, 3 + i].Value = _lines[i].Name;
                        sheet.Cells[4, 3 + i].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                        sheet.Cells[4, 3 + i].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                    }
                    if (groupList.Count > 0)
                    {
                        int row = 5;
                        for (int i = 0; i < groupList.Count; i++)
                        {
                            sheet.Cells[row, 2].Value = groupList[i].Date;
                            sheet.Cells[row, 2].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                            sheet.Cells[row, 2].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;

                            for (int ii = 0; ii < _lines.Count; ii++)
                            {
                                var founds = groupList[i].Lines.Where(x => x.LineId == _lines[ii].Id);
                                string _value = "0/0";
                                if (founds != null && founds.Count() > 0)
                                {
                                    if (type == 1)
                                        _value = founds.Sum(x => x.BTPThoatChuyenNgay - x.BTPThoatChuyenNgayGiam) + "/" + founds.Sum(x => x.DinhMucNgay);
                                    else
                                        _value = founds.Sum(x => x.ThucHienNgay - x.ThucHienNgayGiam) + "/" + founds.Sum(x => x.DinhMucNgay);
                                }
                                sheet.Cells[row, 3 + ii].Value = _value;
                                sheet.Cells[row, 3 + ii].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                                sheet.Cells[row, 3 + ii].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                            }
                            row++;
                        }

                        sheet.Cells[row, 2].Value = "Tổng";
                        sheet.Cells[row, 2].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                        sheet.Cells[row, 2].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;

                        for (int ii = 0; ii < _lines.Count; ii++)
                        {
                            sheet.Cells[row, 3 + ii].Value = _lines[ii].IdDen + "/" + _lines[ii].STTReadNS;
                            sheet.Cells[row, 3 + ii].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                            sheet.Cells[row, 3 + ii].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                        }

                        AddCellBorder(sheet, row);
                    }
                    sheet.Cells.AutoFitColumns();
                    sheet.Column(6).Width = 16;
                    sheet.Column(7).Width = 16;
                    sheet.Column(14).Style.WrapText = true;
                    Response.ClearContent();
                    Response.BinaryWrite(excelPackage.GetAsByteArray());
                    DateTime dateNow = DateTime.Now;
                    string fileName = "ThoatChuyen_" + dateNow.ToString("yyMMddhhmmss") + ".xlsx";
                    if (type == 2)
                        fileName = "KiemDat_" + dateNow.ToString("yyMMddhhmmss") + ".xlsx";
                    Response.AddHeader("content-disposition", "attachment;filename=" + fileName);
                    Response.ContentType = "application/excel";
                    Response.Flush();
                    Response.End();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        #endregion


    }
}