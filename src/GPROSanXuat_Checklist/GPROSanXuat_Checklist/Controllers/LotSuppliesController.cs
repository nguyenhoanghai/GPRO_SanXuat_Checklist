using GPRO.Core.Mvc;
using GPROCommon.Models;
using GPROSanXuat_Checklist.App_Global;
using GPROSanXuat_Checklist.Business;
using GPROSanXuat_Checklist.Business.Model;
using GPROSanXuat_Checklist.Mapper;
using OfficeOpenXml;
using OfficeOpenXml.Style; 
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Web.Mvc;

namespace GPROSanXuat_Checklist.Controllers
{
    public class LotSuppliesController : BaseController
    {
        // GET: LotSupplies
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult ReportInventory()  //Report so luong ton kho  
        {
            return PartialView();
        }

        #region LotSupplies
        [HttpPost]
        public JsonResult Gets(int whId, bool greaterThan0, string keyword, int jtStartIndex = 0, int jtPageSize = 0, string jtSorting = "")
        {
            try
            {
                var objs = BLLLotSupplies.Instance.Gets(AppGlobal.ConnectionstringSanXuatChecklist, whId, greaterThan0, keyword, jtStartIndex, jtPageSize, jtSorting);

                JsonDataResult.Records = LotSupplyMaper.Instance.MapInfoFromGPROCommon( objs);
                JsonDataResult.Result = "OK";
                JsonDataResult.TotalRecordCount = objs.TotalItemCount;
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return Json(JsonDataResult);
        }

        [HttpPost]
        public JsonResult Save(LotSuppliesModel obj)
        {
            ResponseBase rs;
            try
            {
                if (obj.Id == 0)
                {
                    obj.CreatedUser = UserContext.UserID;
                    obj.CreatedDate = DateTime.Now;
                }
                else
                {
                    obj.UpdatedUser = UserContext.UserID;
                    obj.UpdatedDate = DateTime.Now;
                }
                rs = BLLLotSupplies.Instance.CreateOrUpdate(AppGlobal.ConnectionstringSanXuatChecklist, obj);
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
                //CatchError(ex);
                throw ex;
            }
            return Json(JsonDataResult);
        }


        [HttpPost]
        public JsonResult Delete(int Id)
        {
            ResponseBase result;
            try
            {
                result = BLLLotSupplies.Instance.Delete(AppGlobal.ConnectionstringSanXuatChecklist, Id, UserContext.UserID);
                if (!result.IsSuccess)
                {
                    JsonDataResult.Result = "ERROR";
                    JsonDataResult.ErrorMessages.AddRange(result.Errors);
                }
                else
                    JsonDataResult.Result = "OK";
            }
            catch (Exception ex)
            {
                //CatchError(ex);
                throw ex;
            }
            return Json(JsonDataResult);
        }

        [HttpPost]
        public JsonResult GetLotSuppliesSelect()
        {
            try
            {
                JsonDataResult.Result = "OK";
                JsonDataResult.Data = BLLLotSupplies.Instance.GetSelectList(AppGlobal.ConnectionstringSanXuatChecklist);
            }
            catch (Exception ex)
            {
                //add error
                JsonDataResult.Result = "ERROR";
                JsonDataResult.ErrorMessages.Add(new Error() { MemberName = "Get Area", Message = "Lỗi: " + ex.Message });
            }
            return Json(JsonDataResult);
        }

        [HttpPost]
        public JsonResult GetLastIndex()
        {
            JsonDataResult.Records = BLLLotSupplies.Instance.GetLastIndex(AppGlobal.ConnectionstringSanXuatChecklist);
            JsonDataResult.Data = "";//BLLAppConfig.Instance.GetConfigByCode(eConfigCode.LotSupplies);
            return Json(JsonDataResult);
        }

        /// <summary>
        /// Report so luong ton kho theo vat tu
        /// </summary>
        /// <param name="mId"></param>
        /// <param name="whId"></param>
        /// <returns></returns>
        public JsonResult GetReportInventory(string mId, string whId) 
        {
            try
            {
                var listObjs = BLLLotSupplies.Instance.GetReportInventory(AppGlobal.ConnectionstringSanXuatChecklist, mId, whId);

                JsonDataResult.Result = "OK";
                JsonDataResult.Data = LotSupplyMaper.Instance.MapInfoFromGPROCommon(listObjs);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return Json(JsonDataResult);
        }

        /// <summary>
        /// Xuat Excel so luong ton kho theo vat tu
        /// </summary>
        /// <param name="mId"></param>
        /// <param name="whId"></param>
        public void ExportToExcel_Inventory(string mId, string whId) 
        {
            try
            {
                var reportObj = LotSupplyMaper.Instance.MapInfoFromGPROCommon(BLLLotSupplies.Instance.GetReportInventory(AppGlobal.ConnectionstringSanXuatChecklist, mId, whId));
                var excelPackage = new ExcelPackage();
                excelPackage.Workbook.Properties.Author = "GPRO";
                excelPackage.Workbook.Properties.Title = "Báo Cáo Số Lượng Tồn Kho VT";
                var sheet = excelPackage.Workbook.Worksheets.Add("Sheet1");
                sheet.Name = "Sheet1";
                sheet.Cells.Style.Font.Size = 12;
                sheet.Cells.Style.Font.Name = "Times New Roman";

                string title = "BÁO CÁO SỐ LƯỢNG TỒN KHO CỦA VẬT TƯ";
                if (!string.IsNullOrEmpty(reportObj.MaterialName))
                    title += (": " + reportObj.MaterialName.ToUpper());
                if (!string.IsNullOrEmpty(reportObj.WarehouseName))
                    title += (" - KHO : " + reportObj.WarehouseName.ToUpper());

                sheet.Cells[1, 2].Value = title;
                sheet.Cells[1, 2].Style.Font.Size = 14;
                sheet.Cells[1, 2, 1, 15].Merge = true;
                sheet.Cells[1, 2, 1, 15].Style.Font.Bold = true;
                sheet.Cells[1, 2].Style.WrapText = true;
                sheet.Cells[1, 2, 1, 15].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                sheet.Cells[1, 2, 1, 15].Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                sheet.Cells[1, 2, 1, 15].Style.Fill.PatternType = ExcelFillStyle.Solid;
                sheet.Cells[1, 2, 1, 15].Style.Fill.BackgroundColor.SetColor(Color.FromArgb(65, 149, 221));
                sheet.Cells[1, 2, 1, 15].Style.Font.Color.SetColor(Color.White);

                sheet.Row(1).Height = 25;
                sheet.Row(3).Height = 20;
                sheet.Row(3).Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                sheet.Row(3).Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                sheet.Row(3).Style.Font.Bold = true;

                sheet.Cells[3, 2, 3, 15].Style.Fill.PatternType = ExcelFillStyle.Solid;
                sheet.Cells[3, 2, 3, 15].Style.Fill.BackgroundColor.SetColor(Color.FromArgb(65, 149, 221));
                sheet.Cells[3, 2, 3, 15].Style.Font.Color.SetColor(Color.White);

                sheet.Cells[2, 2].Value = "Ngày " + DateTime.Now.Day + " Tháng " + DateTime.Now.Month + " Năm " + DateTime.Now.Year;
                sheet.Cells[2, 2].Style.HorizontalAlignment = ExcelHorizontalAlignment.Right;
                sheet.Cells[2, 2].Style.Font.Bold = true;
                sheet.Cells[2, 2, 2, 15].Merge = true;
                int rowIndex = 3;

                sheet.Cells[rowIndex, 2].Value = "STT";
                sheet.Cells[rowIndex, 2].Style.Border.BorderAround(ExcelBorderStyle.Thin);

                sheet.Cells[rowIndex, 3].Value = "Kho";
                sheet.Cells[rowIndex, 3].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                sheet.Cells[rowIndex, 4].Value = "Vật Tư";
                sheet.Cells[rowIndex, 4].Style.Border.BorderAround(ExcelBorderStyle.Thin);

                sheet.Cells[rowIndex, 5].Value = "Lô vật tư";
                sheet.Cells[rowIndex, 5].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                sheet.Cells[rowIndex, 6].Value = "Ngày nhập kho";
                sheet.Cells[rowIndex, 6].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                sheet.Cells[rowIndex, 7].Value = "Số lượng nhập";
                sheet.Cells[rowIndex, 7].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                sheet.Cells[rowIndex, 8].Value = "Số Lượng Tồn";
                sheet.Cells[rowIndex, 8].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                sheet.Cells[rowIndex, 9].Value = "Đơn Vị Tính";
                sheet.Cells[rowIndex, 9].Style.Border.BorderAround(ExcelBorderStyle.Thin);

                sheet.Cells[rowIndex, 10].Value = "Đơn Giá";
                sheet.Cells[rowIndex, 10].Style.Border.BorderAround(ExcelBorderStyle.Thin);

                sheet.Cells[rowIndex, 11].Value = "Thành Tiền";
                sheet.Cells[rowIndex, 11].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                sheet.Cells[rowIndex, 12].Value = "Đơn vị tiền tệ";
                sheet.Cells[rowIndex, 12].Style.Border.BorderAround(ExcelBorderStyle.Thin);

                sheet.Cells[rowIndex, 13].Value = "Ngày sản xuất";
                sheet.Cells[rowIndex, 13].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                sheet.Cells[rowIndex, 14].Value = "Ngày bảo hành";
                sheet.Cells[rowIndex, 14].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                sheet.Cells[rowIndex, 15].Value = "Ngày Hết Hạn SD";
                sheet.Cells[rowIndex, 15].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                rowIndex++;
                List<IGrouping<int, ReportInventoryDetailModel>> aa = new List<IGrouping<int, ReportInventoryDetailModel>>();
                if (!string.IsNullOrEmpty(reportObj.WarehouseName))
                {
                    aa = reportObj.Details.GroupBy(x => x.StoreWarehouseId).ToList();
                    GenerateReportWithMaterial(aa, ref sheet, ref rowIndex);
                }
                else
                {
                    aa = reportObj.Details.GroupBy(x => x.MaterialId).ToList();
                    GenerateReportWithWarehouse(aa, ref sheet, ref rowIndex);
                }

                sheet.Cells.AutoFitColumns(5);
                sheet.Column(3).Width = 30;
                sheet.Column(4).Width = 20;
                sheet.Column(5).Width = 15;
                sheet.Column(6).Width = 15;
                sheet.Column(7).Width = 15;
                sheet.Column(8).Width = 10;
                sheet.Column(9).Width = 20;
                sheet.Column(10).Width = 20;
                sheet.Column(11).Width = 20;
                sheet.Column(12).Width = 15;
                sheet.Column(13).Width = 20;
                Response.ClearContent();
                Response.BinaryWrite(excelPackage.GetAsByteArray());
                DateTime dateNow = DateTime.Now;
                string fileName = "BaoCaoSoLuongTonKhoVatTu_" + dateNow.ToString("yyMMddhhmmss") + ".xlsx";
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

        private void GenerateReportWithWarehouse(List<IGrouping<int, ReportInventoryDetailModel>> aa, ref ExcelWorksheet sheet, ref int rowIndex)
        {
            foreach (var group in aa)
            {
                var list = group.ToList();
                double total = 0;
                double totalmoney = 0;
                for (int i = 0; i < list.Count; i++)
                {
                    sheet.Cells[rowIndex, 2].Value = (i + 1);
                    sheet.Cells[rowIndex, 2].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                    if (i == 0) // nếu là dòng đầu
                    {
                        sheet.Cells[rowIndex, 3].Value = list[i].StoreWareHouseName + " (" + list[i].StoreWareHouseCode + ")";//kho
                        sheet.Cells[rowIndex, 3].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                        sheet.Cells[rowIndex, 3].Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                        sheet.Cells[rowIndex, 3, rowIndex + (group.Count() - 1), 3].Merge = true;
                        sheet.Cells[rowIndex, 3, rowIndex + (group.Count() - 1), 3].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                    }
                    sheet.Cells[rowIndex, 4].Value = list[i].MaterialName + " (" + list[i].MaterialCode + ")"; // vattu
                    sheet.Cells[rowIndex, 4].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                    sheet.Cells[rowIndex, 5].Value = list[i].Name + " (" + list[i].Code + ")"; // Tên Lô vattu
                    sheet.Cells[rowIndex, 5].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                    sheet.Cells[rowIndex, 6].Value = String.Format("{0:dd/MM/yyyy}", list[i].InputDate);//ngay nhap
                    sheet.Cells[rowIndex, 6].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                    sheet.Cells[rowIndex, 7].Value = list[i].Quantity - list[i].QuantityUsed;//sl nhap
                    sheet.Cells[rowIndex, 7].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                    sheet.Cells[rowIndex, 8].Value = list[i].Quantity - list[i].QuantityUsed;//tong kho
                    sheet.Cells[rowIndex, 8].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                    sheet.Cells[rowIndex, 9].Value = list[i].UnitName;//dvt
                    sheet.Cells[rowIndex, 9].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                    sheet.Cells[rowIndex, 10].Value = list[i].Price;//gia
                    sheet.Cells[rowIndex, 10].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                    sheet.Cells[rowIndex, 11].Value = list[i].TotalMoney;//thanh tien
                    sheet.Cells[rowIndex, 11].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                    sheet.Cells[rowIndex, 12].Value = list[i].MoneyTypeName + " (" + string.Format("{0:0,0}", list[i].ExchangeRate) + ")";//tien te
                    sheet.Cells[rowIndex, 12].Style.Border.BorderAround(ExcelBorderStyle.Thin);

                    sheet.Cells[rowIndex, 13].Value = String.Format("{0:dd/MM/yyyy}", list[i].ManufactureDate);
                    sheet.Cells[rowIndex, 13].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                    sheet.Cells[rowIndex, 14].Value = String.Format("{0:dd/MM/yyyy}", list[i].WarrantyDate);
                    sheet.Cells[rowIndex, 14].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                    sheet.Cells[rowIndex, 15].Value = String.Format("{0:dd/MM/yyyy}", list[i].ExpiryDate);
                    sheet.Cells[rowIndex, 15].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                    total += (list[i].Quantity - list[i].QuantityUsed);
                    totalmoney += list[i].TotalMoney;
                    rowIndex++;
                }

                sheet.Cells[rowIndex, 2].Value = "Tổng tồn";
                sheet.Cells[rowIndex, 2, rowIndex, 7].Merge = true;
                sheet.Cells[rowIndex, 2].Style.HorizontalAlignment = ExcelHorizontalAlignment.Right;

                sheet.Cells[rowIndex, 8].Value = total + " " + (list.Count > 0 ? list[0].UnitName : "");
                sheet.Cells[rowIndex, 8, rowIndex, 9].Merge = true;
                sheet.Cells[rowIndex, 8].Style.Border.BorderAround(ExcelBorderStyle.Thin);

                sheet.Cells[rowIndex, 10].Value = "Tổng tiền";
                sheet.Cells[rowIndex, 10].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                sheet.Cells[rowIndex, 10].Style.HorizontalAlignment = ExcelHorizontalAlignment.Right;

                sheet.Cells[rowIndex, 11].Value = string.Format("{0:0,0}", totalmoney) + " " + (list.Count > 0 ? list[0].MoneyTypeName : "");
                sheet.Cells[rowIndex, 11].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                sheet.Cells[rowIndex, 11, rowIndex, 15].Merge = true;
                sheet.Cells[rowIndex, 11].Style.HorizontalAlignment = ExcelHorizontalAlignment.Left;

                sheet.Cells[rowIndex, 2, rowIndex, 15].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                sheet.Cells[rowIndex, 2, rowIndex, 15].Style.Fill.PatternType = ExcelFillStyle.Solid;
                sheet.Cells[rowIndex, 2, rowIndex, 15].Style.Fill.BackgroundColor.SetColor(Color.FromArgb(222, 222, 222));
                sheet.Cells[rowIndex, 2, rowIndex, 15].Style.Font.Color.SetColor(Color.Red);
                sheet.Cells[rowIndex, 2, rowIndex, 15].Style.Font.Bold = true;
                rowIndex += 2;
            }
        }

        private void GenerateReportWithMaterial(List<IGrouping<int, ReportInventoryDetailModel>> aa, ref ExcelWorksheet sheet, ref int rowIndex)
        {
            foreach (var group in aa)
            {
                var list = group.ToList();
                double total = 0;
                double totalmoney = 0;
                for (int i = 0; i < list.Count; i++)
                {
                    sheet.Cells[rowIndex, 2].Value = (i + 1);
                    sheet.Cells[rowIndex, 2].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                    sheet.Cells[rowIndex, 3].Value = list[i].StoreWareHouseName + " (" + list[i].StoreWareHouseCode + ")"; // vattu
                    sheet.Cells[rowIndex, 3].Style.Border.BorderAround(ExcelBorderStyle.Thin);

                    if (i == 0) // nếu là dòng đầu
                    {
                        sheet.Cells[rowIndex, 4].Value = list[i].MaterialName + " (" + list[i].MaterialCode + ")";//kho
                        sheet.Cells[rowIndex, 4].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                        sheet.Cells[rowIndex, 4].Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                        sheet.Cells[rowIndex, 4, rowIndex + (group.Count() - 1), 4].Merge = true;
                        sheet.Cells[rowIndex, 4, rowIndex + (group.Count() - 1), 4].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                    }

                    sheet.Cells[rowIndex, 5].Value = list[i].Name + " (" + list[i].Code + ")"; // Tên Lô vattu
                    sheet.Cells[rowIndex, 5].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                    sheet.Cells[rowIndex, 6].Value = String.Format("{0:dd/MM/yyyy}", list[i].InputDate);//ngay nhap
                    sheet.Cells[rowIndex, 6].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                    sheet.Cells[rowIndex, 7].Value = list[i].Quantity - list[i].QuantityUsed;//sl nhap
                    sheet.Cells[rowIndex, 7].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                    sheet.Cells[rowIndex, 8].Value = list[i].Quantity - list[i].QuantityUsed;//tong kho
                    sheet.Cells[rowIndex, 8].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                    sheet.Cells[rowIndex, 9].Value = list[i].UnitName;//dvt
                    sheet.Cells[rowIndex, 9].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                    sheet.Cells[rowIndex, 10].Value = list[i].Price;//gia
                    sheet.Cells[rowIndex, 10].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                    sheet.Cells[rowIndex, 11].Value = list[i].TotalMoney;//thanh tien
                    sheet.Cells[rowIndex, 11].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                    sheet.Cells[rowIndex, 12].Value = list[i].MoneyTypeName + " (" + string.Format("{0:0,0}", list[i].ExchangeRate) + ")";//tien te
                    sheet.Cells[rowIndex, 12].Style.Border.BorderAround(ExcelBorderStyle.Thin);

                    sheet.Cells[rowIndex, 13].Value = String.Format("{0:dd/MM/yyyy}", list[i].ManufactureDate);
                    sheet.Cells[rowIndex, 13].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                    sheet.Cells[rowIndex, 14].Value = String.Format("{0:dd/MM/yyyy}", list[i].WarrantyDate);
                    sheet.Cells[rowIndex, 14].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                    sheet.Cells[rowIndex, 15].Value = String.Format("{0:dd/MM/yyyy}", list[i].ExpiryDate);
                    sheet.Cells[rowIndex, 15].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                    total += (list[i].Quantity - list[i].QuantityUsed);
                    totalmoney += list[i].TotalMoney;
                    rowIndex++;
                }
                sheet.Cells[rowIndex, 2].Value = "Tổng tồn";
                sheet.Cells[rowIndex, 2, rowIndex, 7].Merge = true;
                sheet.Cells[rowIndex, 2].Style.HorizontalAlignment = ExcelHorizontalAlignment.Right;

                sheet.Cells[rowIndex, 8].Value = total + " " + (list.Count > 0 ? list[0].UnitName : "");
                sheet.Cells[rowIndex, 8, rowIndex, 9].Merge = true;
                sheet.Cells[rowIndex, 8].Style.Border.BorderAround(ExcelBorderStyle.Thin);

                sheet.Cells[rowIndex, 9].Value = (list.Count > 0 ? list[0].UnitName : "");
                sheet.Cells[rowIndex, 9].Style.Border.BorderAround(ExcelBorderStyle.Thin);

                sheet.Cells[rowIndex, 10].Value = "Tổng tiền";
                sheet.Cells[rowIndex, 10].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                //sheet.Cells[rowIndex, 10, rowIndex, 9].Merge = true;
                sheet.Cells[rowIndex, 10].Style.HorizontalAlignment = ExcelHorizontalAlignment.Right;

                sheet.Cells[rowIndex, 11].Value = string.Format("{0:0,0}", totalmoney) + " " + (list.Count > 0 ? list[0].UnitName : "");
                sheet.Cells[rowIndex, 11].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                sheet.Cells[rowIndex, 11, rowIndex, 15].Merge = true;
                sheet.Cells[rowIndex, 11].Style.HorizontalAlignment = ExcelHorizontalAlignment.Left;

                sheet.Cells[rowIndex, 2, rowIndex, 15].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                sheet.Cells[rowIndex, 2, rowIndex, 15].Style.Fill.PatternType = ExcelFillStyle.Solid;
                sheet.Cells[rowIndex, 2, rowIndex, 15].Style.Fill.BackgroundColor.SetColor(Color.FromArgb(222, 222, 222));
                sheet.Cells[rowIndex, 2, rowIndex, 15].Style.Font.Color.SetColor(Color.Red);
                sheet.Cells[rowIndex, 2, rowIndex, 15].Style.Font.Bold = true;
                rowIndex += 2;
            }
        }
        #endregion

    }
}