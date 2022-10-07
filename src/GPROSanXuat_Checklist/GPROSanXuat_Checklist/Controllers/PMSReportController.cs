using GPROCommon.Repository;
using GPROSanXuat_Checklist.App_Global;
using GPROSanXuat_Checklist.Mapper;
using Newtonsoft.Json;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using PMS.Service.Repository;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace GPROSanXuat_Checklist.Controllers
{
    public class PMSReportController : BaseController
    {  
        #region tien do sản xuất 
        public ActionResult TienDoSX()
        {
            return View();
        }
         
        [HttpPost]
        public JsonResult GetTienDoSX(int cspId)
        {
            if (isAuthenticate)
            {
                var data = AssignmentRepository.Instance.GetProductionProgress(AppGlobal.ConnectionstringPMS, cspId, PhaseRepository.Instance.GetSelectList(AppGlobal.ConnectionstringGPROCommon, 0));
                if (data != null)
                {
                    data = AssignmentMapper.Instance.MapInfoFromGPROCommon(data);
                    return Json(JsonConvert.SerializeObject(data));
                }
            }
            return Json("ERROR");
        }

        public void Excel_TienDoSX(int cspId)
        {
            if (isAuthenticate)
            {
                try
                {
                    var excelPackage = new ExcelPackage();
                    excelPackage.Workbook.Properties.Author = "Checklist";
                    excelPackage.Workbook.Properties.Title = "Báo cáo tiến độ sản xuất";
                    var sheet = excelPackage.Workbook.Worksheets.Add("PTCĐ");
                    sheet.Name = "Sheet1";
                    sheet.Cells.Style.Font.Size = 12;
                    sheet.Cells.Style.Font.Name = "Times New Roman";
                    var _phaseses = PhaseRepository.Instance.GetSelectList(AppGlobal.ConnectionstringGPROCommon, 0);
                    var data = AssignmentRepository.Instance.GetProductionProgress(AppGlobal.ConnectionstringPMS, cspId, PhaseRepository.Instance.GetSelectList(AppGlobal.ConnectionstringGPROCommon, 0));
                    if (data != null)
                        data = AssignmentMapper.Instance.MapInfoFromGPROCommon(data);

                    sheet.Cells[1, 2].Value = ("Theo dõi tiến độ sản xuất đơn hàng: " + data[0].ProName).ToUpper();
                    sheet.Cells[1, 2].Style.Font.Size = 14;
                    sheet.Cells[1, 2, 1, data[0].Months.Count + 5].Merge = true;
                    sheet.Cells[1, 2, 1, data[0].Months.Count + 5].Style.Font.Bold = true;
                    sheet.Cells[1, 2, 1, data[0].Months.Count + 5].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                    // sheet.Cells[1, 2, 1, 7].Style.Fill.PatternType = ExcelFillStyle.Solid;
                    //  sheet.Cells[1, 2, 1, 7].Style.Fill.BackgroundColor.SetColor(Color.FromArgb(65, 149, 221));
                    //  sheet.Cells[1, 2, 1, 7].Style.Font.Color.SetColor(Color.White);

                    //sheet.Cells[2, 2].Value = "Từ Ngày " + from + " đến ngày " + to;
                    //sheet.Cells[2, 2, 2, _phases.Count + 2].Merge = true;
                    //sheet.Cells[2, 2, 2, _lines.Count + 2].Style.Border.BorderAround(ExcelBorderStyle.Thin);

                    sheet.Cells[4, 2].Value = "Chuyền";
                    sheet.Cells[4, 2].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                    sheet.Cells[4, 2].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                    AddStyleHeader(sheet.Cells[4, 2]);
                    sheet.Cells[4, 3].Value = "Thông tin";
                    sheet.Cells[4, 3].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                    sheet.Cells[4, 3].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                    AddStyleHeader(sheet.Cells[4, 3]);
                    sheet.Cells[4, 4].Value = "Kế hoạch";
                    sheet.Cells[4, 4].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                    sheet.Cells[4, 4].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                    AddStyleHeader(sheet.Cells[4, 4]);
                    sheet.Cells[4, 5].Value = "Công đoạn";
                    sheet.Cells[4, 5].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                    sheet.Cells[4, 5].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                    AddStyleHeader(sheet.Cells[4, 5]);

                    for (int i = 0; i < data[0].Months.Count; i++)
                    {
                        sheet.Cells[4, 6 + i].Value = data[0].Months[i].Name;
                        sheet.Cells[4, 6 + i].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                        sheet.Cells[4, 6 + i].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                        AddStyleHeader(sheet.Cells[4, 6 + i]);
                    }

                    if (data.Count > 0)
                    {
                        int row = 5;
                        int phaseCount = _phaseses.Count - 1;
                        for (int i = 0; i < data.Count; i++)
                        {
                            sheet.Cells[row, 2].Value = data[i].LineName;
                            sheet.Cells[row, 2].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                            sheet.Cells[row, 2].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                            sheet.Cells[row, 2, row + phaseCount, 2].Merge = true;
                            AddCellBorder(sheet.Cells[row, 2, row + phaseCount, 2]);

                            if (i == 0)
                            {
                                int _r = (data.Count * _phaseses.Count) + 4;
                                sheet.Cells[row, 3].Value = "Khách hàng: " + data[i].CustName + " | Sản phẩm: " + data[i].ProName;
                                sheet.Cells[row, 3].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                                sheet.Cells[row, 3].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                                sheet.Cells[row, 3, _r, 3].Merge = true;
                                AddCellBorder(sheet.Cells[row, 3, _r, 3]);
                            }

                            sheet.Cells[row, 4].Value = "Sản lượng: " + data[i].ProductionPlan + " | Ngày vào chuyền: " + data[i].StartDate.ToString("dd/MM/yyyy");
                            sheet.Cells[row, 4].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                            sheet.Cells[row, 4].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                            sheet.Cells[row, 4, row + phaseCount, 4].Merge = true;
                            AddCellBorder(sheet.Cells[row, 4, row + phaseCount, 4]);

                            for (int ii = 0; ii < _phaseses.Count; ii++)
                            {
                                sheet.Cells[row, 5].Value = _phaseses[ii].Name;
                                sheet.Cells[row, 5].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                                sheet.Cells[row, 5].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                                AddStylePhase(sheet.Cells[row, 5]);

                                for (int iii = 0; iii < data[i].Months.Count; iii++)
                                {
                                    var f = data[i].Months[iii].Phases.FirstOrDefault(x => x.PhaseId == _phaseses[ii].Value);
                                    if (f != null)
                                    {
                                        sheet.Cells[row, 6 + iii].Value = f.Plan + "/" + f.Products;
                                    }
                                    if (f == null)
                                    {
                                        sheet.Cells[row, 6 + iii].Value = 0;
                                    }
                                    AddCellBorder(sheet.Cells[row, 6 + iii]);
                                }
                                row++;
                            }
                        }

                        //sheet.Cells[row, 2].Value = "Tổng";
                        //sheet.Cells[row, 2].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                        //sheet.Cells[row, 2].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;

                        //for (int ii = 0; ii < _phases.Count; ii++)
                        //{
                        //    sheet.Cells[row, 3 + ii].Value = _phases[ii].Data;
                        //    sheet.Cells[row, 3 + ii].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                        //    sheet.Cells[row, 3 + ii].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                        //}

                        //AddCellBorder(sheet, row);
                    }

                    sheet.Cells.AutoFitColumns();
                    sheet.Column(6).Width = 16;
                    sheet.Column(7).Width = 16;
                    sheet.Column(14).Style.WrapText = true;
                    Response.ClearContent();
                    Response.BinaryWrite(excelPackage.GetAsByteArray());
                    DateTime dateNow = DateTime.Now;
                    string fileName = "TheoDoiTienDoSanXuat_" + dateNow.ToString("yyMMddhhmmss") + ".xlsx";
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

        private void AddCellBorder(ExcelRange cell)
        {
            cell.Style.Border.BorderAround(ExcelBorderStyle.Thin);
            cell.Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
            cell.Style.VerticalAlignment = ExcelVerticalAlignment.Center;
            cell.Style.WrapText = true;
        }

        private void AddStyleHeader(ExcelRange cell)
        {
            cell.Style.Border.BorderAround(ExcelBorderStyle.Thin);
            cell.Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
            cell.Style.VerticalAlignment = ExcelVerticalAlignment.Center;
            cell.Style.WrapText = true;
            cell.Style.Fill.PatternType = ExcelFillStyle.Solid;
            cell.Style.Fill.BackgroundColor.SetColor(Color.FromArgb(65, 149, 221));
            cell.Style.Font.Color.SetColor(Color.White);
            cell.Style.Font.Bold = true;
        }

        private void AddStylePhase(ExcelRange cell)
        {
            cell.Style.Border.BorderAround(ExcelBorderStyle.Thin);
            cell.Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
            cell.Style.VerticalAlignment = ExcelVerticalAlignment.Center;
            cell.Style.WrapText = true;
            cell.Style.Fill.PatternType = ExcelFillStyle.Solid;
            cell.Style.Fill.BackgroundColor.SetColor(Color.FromArgb(0, 146, 0));
            cell.Style.Font.Color.SetColor(Color.White);
        }

        public ActionResult ProductionPlanInYear()
        {
            return View();
        }

        [HttpPost]
        public JsonResult GetProductionPlanInYear( )
        {
            if (isAuthenticate)
            {
                var data = AssignmentRepository.Instance.GetPlan(AppGlobal.ConnectionstringPMS, DateTime.Now.Year);//, PhaseRepository.Instance.GetSelectList(AppGlobal.ConnectionstringGPROCommon, 0));
                if (data != null)
                {
                    data = AssignmentMapper.Instance.MapInfoFromGPROCommon(data);
                    var _objs = data.GroupBy(x => x.LineName).Select(x=> new { LineName = x.Key , Months = x.ToList()}).ToList();
                    return Json(JsonConvert.SerializeObject(_objs));
                }
            }
            return Json("ERROR");
        }

        public ActionResult ProductionPlanInMonth()
        {
            return View();
        }

        [HttpPost]
        public JsonResult GetProductionPlanInMonth()
        {
            if (isAuthenticate)
            {
                var data = AssignmentRepository.Instance.GetPlan(AppGlobal.ConnectionstringPMS, DateTime.Now.Month,DateTime.Now.Year,  LineRepository.Instance.GetLines(AppGlobal.ConnectionstringGPROCommon), ProductRepository.Instance.Gets(AppGlobal.ConnectionstringGPROCommon));
                if (data != null)
                {
                    data = AssignmentMapper.Instance.MapInfoFromGPROCommon(data);
                    var _objs = data.GroupBy(x => x.LineName).Select(x => new { LineName = x.Key, Products = x.ToList() }).ToList();
                    return Json(JsonConvert.SerializeObject(_objs));
                }
            }
            return Json("ERROR");
        }
    }
}