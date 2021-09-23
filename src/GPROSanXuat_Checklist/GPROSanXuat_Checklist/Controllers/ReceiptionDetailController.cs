using GPROCommon.Models;
using GPROSanXuat_Checklist.App_Global;
using GPROSanXuat_Checklist.Business;
using GPROSanXuat_Checklist.Business.Model;
using GPROSanXuat_Checklist.Helper;
using GPROSanXuat_Checklist.Mapper;
using OfficeOpenXml;
using OfficeOpenXml.Style; 
using System;
using System.Drawing;
using System.Web.Mvc;

namespace GPROSanXuat_Checklist.Controllers
{
    public class ReceiptionDetailController : BaseController
    {
        // GET: ReceiptionDetail
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public JsonResult Gets(int recordId, int jtStartIndex = 0, int jtPageSize = 0, string jtSorting = "")
        {
            try
            {
                var objs = BLLReceiptionDetail.Instance.GetList(AppGlobal.ConnectionstringSanXuatChecklist, recordId, jtStartIndex, jtPageSize, jtSorting);
                 
                JsonDataResult.Records =ReceiptionDetailsMaper.Instance.MapInfoFromGPROCommon( objs);
                JsonDataResult.Result = "OK";
                JsonDataResult.TotalRecordCount = objs.TotalItemCount;
            }
            catch (Exception ex)
            {
                // CatchError(ex);
            }
            return Json(JsonDataResult);
        }

        [HttpPost]
        public JsonResult GetById(int Id)
        {
            try
            {
                var obj = BLLReceiptionDetail.Instance.GetById(AppGlobal.ConnectionstringSanXuatChecklist, Id);
                JsonDataResult.Result = "OK";
                JsonDataResult.Data = obj;
            }
            catch (Exception ex)
            {
                //CatchError(ex);
                throw ex;
            }
            return Json(JsonDataResult);
        }

        [HttpPost]
        public JsonResult Save(ReceiptionDetailModel obj)
        {
            ResponseBase responseResult;
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
                responseResult = BLLReceiptionDetail.Instance.CreateOrUpdate(AppGlobal.ConnectionstringSanXuatChecklist, obj);
                if (!responseResult.IsSuccess)
                {
                    JsonDataResult.Result = "ERROR";
                    JsonDataResult.ErrorMessages.AddRange(responseResult.Errors);
                }
                JsonDataResult.Result = "OK";
            }
            catch (Exception ex)
            {
                //CatchError(ex);
                throw ex;
            }
            return Json(JsonDataResult);
        }

        public JsonResult Delete(int Id)
        {
            ResponseBase result;
            try
            {
                result = BLLReceiptionDetail.Instance.Delete(AppGlobal.ConnectionstringSanXuatChecklist, Id, UserContext.UserID);
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

        public void ExportToExcel(int receiptionId)
        {
            try
            {
                #region get data
                var objModel = ReceiptionDetailsMaper.Instance.MapInfoFromGPROCommon(BLLReceiptionDetail.Instance.GetReceiptionDetails(AppGlobal.ConnectionstringSanXuatChecklist, receiptionId));
                 
                #endregion
                var excelPackage = new ExcelPackage();
                excelPackage.Workbook.Properties.Author = "GPRO";
                excelPackage.Workbook.Properties.Title = "Phiếu Nhập Kho";
                var sheet = excelPackage.Workbook.Worksheets.Add("Sheet1");
                sheet.Name = "Sheet1";
                sheet.Cells.Style.Font.Size = 12;
                sheet.Cells.Style.Font.Name = "Times New Roman";

                if (objModel != null && objModel.Count > 0)
                {
                    sheet.Cells[3, 1].Value = "Đơn vị:";
                    sheet.Cells[3, 1, 3, 3].Merge = true;
                    sheet.Cells[3, 1].Style.Font.Bold = true;

                    sheet.Cells[4, 1].Value = "Bộ phận :";
                    sheet.Cells[4, 1, 4, 3].Merge = true;
                    sheet.Cells[4, 1].Style.Font.Bold = true;

                    sheet.Cells[2, 7].Value = "Mẫu số 02-VT\r\n( Ban hành theo Thông tư số 133/2016 TT-BTC ngày 26/08/2016 của Bộ Tài Chính)";
                    sheet.Cells[2, 7].Style.WrapText = true;
                    sheet.Cells[2, 7, 4, 9].Merge = true;
                    sheet.Column(7).Width = 20;

                    sheet.Cells[7, 1].Value = "PHIẾU NHẬP KHO";
                    sheet.Cells[7, 1].Style.Font.Size = 14;
                    sheet.Cells[7, 1].Style.Font.Bold = true;
                    sheet.Cells[7, 1].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                    sheet.Cells[7, 1].Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                    sheet.Cells[7, 1, 7, 9].Merge = true;

                    sheet.Cells[8, 1].Value = "ngày " + "    " + " tháng " + "    " + " năm " + "    ";
                    sheet.Cells[8, 1].Style.Font.Italic = true;
                    sheet.Cells[8, 1].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                    sheet.Cells[8, 1].Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                    sheet.Cells[8, 1, 8, 9].Merge = true;

                    sheet.Cells[9, 1].Value = "Số : " + objModel[0].ReceiptionCode;
                    sheet.Cells[9, 1].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                    sheet.Cells[9, 1].Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                    sheet.Cells[9, 1, 9, 9].Merge = true;

                    sheet.Cells[10, 7].Value = "Nợ :";
                    sheet.Cells[10, 7, 10, 9].Merge = true;

                    sheet.Cells[11, 7].Value = "Có :";
                    sheet.Cells[11, 7, 11, 9].Merge = true;

                    //sheet.Cells[13, 2].Value = "Họ và tên người giao hàng : " + objModel[0].ReceiverName;
                    sheet.Cells[13, 1].Value = "Họ và tên người giao hàng : ";
                    sheet.Cells[13, 1, 13, 4].Merge = true;

                    sheet.Cells[13, 6].Value = "Địa chỉ (bộ phận) : ";
                    sheet.Cells[13, 6, 13, 9].Merge = true;

                    sheet.Cells[14, 1].Value = "Lý do nhập kho : " + "                                             " + " Theo " + "                             " + " Số " + "                            ";
                    sheet.Cells[14, 1, 14, 9].Merge = true;

                    //string str = "";
                    //str += objModel[0].WareHouseName + " ( ";
                    //for (int i = 0; i < objModel.Count; i++)
                    //{
                    //    if (i == objModel.Count - 1)
                    //        str += objModel[i].LotName + " )";
                    //    else
                    //        str += objModel[i].LotName + ", ";
                    //}
                    sheet.Cells[15, 1].Value = "Nhập tại kho (ngăn lô) : " + objModel[0].WarehouseName;
                    sheet.Cells[15, 1, 15, 4].Merge = true;

                    sheet.Cells[15, 6].Value = "Địa điểm : ";
                    sheet.Cells[15, 6, 15, 9].Merge = true;

                    sheet.Cells[17, 1].Value = "STT";
                    sheet.Cells[17, 1].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                    sheet.Cells[17, 1].Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                    sheet.Column(1).Width = 10;
                    sheet.Cells[17, 1, 18, 1].Merge = true;
                    sheet.Cells[17, 1, 18, 1].Style.Border.BorderAround(ExcelBorderStyle.Thin, Color.Black);

                    sheet.Cells[17, 2].Value = "Tên, nhãn hiệu, quy cách, phẩm chất vật tư, dụng cụ sản phẩm, hàng hóa";
                    sheet.Cells[17, 2].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                    sheet.Cells[17, 2].Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                    sheet.Column(2).Width = 40;
                    sheet.Cells[17, 2, 18, 3].Merge = true;
                    sheet.Cells[17, 2, 18, 3].Style.Border.BorderAround(ExcelBorderStyle.Thin, Color.Black);
                    sheet.Cells[17, 2].Style.WrapText = true;

                    sheet.Cells[17, 4].Value = "Mã số";
                    sheet.Cells[17, 4].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                    sheet.Cells[17, 4].Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                    sheet.Cells[17, 4, 18, 4].Merge = true;
                    sheet.Cells[17, 4, 18, 4].Style.Border.BorderAround(ExcelBorderStyle.Thin, Color.Black);

                    sheet.Cells[17, 5].Value = "Đơn vị tính";
                    sheet.Cells[17, 5].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                    sheet.Cells[17, 5].Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                    sheet.Cells[17, 5, 18, 5].Merge = true;
                    sheet.Cells[17, 5, 18, 5].Style.Border.BorderAround(ExcelBorderStyle.Thin, Color.Black);
                    sheet.Cells[17, 5].Style.WrapText = true;

                    sheet.Cells[17, 6].Value = "Số lượng";
                    sheet.Cells[17, 6].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                    sheet.Cells[17, 6].Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                    sheet.Cells[17, 6, 17, 7].Merge = true;
                    sheet.Cells[17, 6, 17, 7].Style.Border.BorderAround(ExcelBorderStyle.Thin, Color.Black);

                    sheet.Cells[18, 6].Value = "Yêu cầu";
                    sheet.Cells[18, 6].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                    sheet.Cells[18, 6].Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                    sheet.Cells[18, 6].Style.Border.BorderAround(ExcelBorderStyle.Thin, Color.Black);
                    sheet.Column(6).Width = 15;

                    sheet.Cells[18, 7].Value = "Thực nhập";
                    sheet.Cells[18, 7].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                    sheet.Cells[18, 7].Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                    sheet.Cells[18, 7].Style.Border.BorderAround(ExcelBorderStyle.Thin, Color.Black);
                    sheet.Column(7).Width = 15;

                    sheet.Cells[17, 8].Value = "Đơn giá";
                    sheet.Cells[17, 8].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                    sheet.Cells[17, 8].Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                    sheet.Cells[17, 8].Style.Border.BorderAround(ExcelBorderStyle.Thin, Color.Black);
                    sheet.Cells[17, 8, 18, 8].Merge = true;
                    sheet.Cells[17, 8, 18, 8].Style.Border.BorderAround(ExcelBorderStyle.Thin, Color.Black);

                    sheet.Cells[17, 9].Value = "Thành tiền";
                    sheet.Cells[17, 9].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                    sheet.Cells[17, 9].Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                    sheet.Cells[17, 9].Style.Border.BorderAround(ExcelBorderStyle.Thin, Color.Black);
                    sheet.Cells[17, 9, 18, 9].Merge = true;
                    sheet.Cells[17, 9, 18, 9].Style.Border.BorderAround(ExcelBorderStyle.Thin, Color.Black);


                    int rowIndex = 19;
                    double sumofmoney = 0;

                    for (int i = 0; i < objModel.Count; i++)
                    {
                        sheet.Cells[rowIndex, 1].Value = i + 1;
                        sheet.Cells[rowIndex, 1].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                        sheet.Cells[rowIndex, 1].Style.WrapText = true;

                        sheet.Cells[rowIndex, 2].Value = objModel[i].MaterialName + "\r\n" + "( Lô: " + objModel[i].Name + " )"; // \r\n để xuống dòng trong excel
                        sheet.Cells[rowIndex, 2, rowIndex, 3].Merge = true;
                        sheet.Cells[rowIndex, 2, rowIndex, 3].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                        sheet.Cells[rowIndex, 2].Style.WrapText = true;
                        sheet.Row(rowIndex).Height = 30;

                        sheet.Cells[rowIndex, 4].Value = objModel[i].MaterialCode;
                        sheet.Cells[rowIndex, 4].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                        sheet.Column(4).Width = 20;
                        sheet.Cells[rowIndex, 4].Style.WrapText = true;

                        sheet.Cells[rowIndex, 5].Value = objModel[i].UnitName;
                        sheet.Cells[rowIndex, 5].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                        sheet.Cells[rowIndex, 5].Style.WrapText = true;

                        sheet.Cells[rowIndex, 6].Value = objModel[i].Quantity;
                        sheet.Cells[rowIndex, 6].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                        sheet.Cells[rowIndex, 6].Style.WrapText = true;

                        sheet.Cells[rowIndex, 7].Value = objModel[i].Quantity;
                        sheet.Cells[rowIndex, 7].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                        sheet.Cells[rowIndex, 7].Style.WrapText = true;

                        sheet.Cells[rowIndex, 8].Value = objModel[i].Price + " (" + objModel[i].MoneyTypeName + " )"; ;
                        sheet.Cells[rowIndex, 8].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                        sheet.Column(8).Width = 15;
                        sheet.Cells[rowIndex, 8].Style.HorizontalAlignment = ExcelHorizontalAlignment.Right;
                        sheet.Cells[rowIndex, 8].Style.WrapText = true;

                        sheet.Cells[rowIndex, 9].Value = objModel[i].Total;
                        sheet.Cells[rowIndex, 9].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                        sheet.Column(9).Width = 15;
                        sheet.Cells[rowIndex, 9].Style.WrapText = true;

                        sumofmoney += objModel[i].Total;
                        rowIndex++;
                    }

                    sheet.Cells[rowIndex, 2].Value = "Cộng";
                    sheet.Cells[rowIndex, 2].Style.Font.Bold = true;
                    sheet.Cells[rowIndex, 2].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                    sheet.Cells[rowIndex, 2].Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                    sheet.Cells[rowIndex, 2].Style.Border.BorderAround(ExcelBorderStyle.Thin, Color.Black);
                    sheet.Cells[rowIndex, 2, rowIndex, 3].Merge = true;
                    sheet.Cells[rowIndex, 2, rowIndex, 3].Style.Border.BorderAround(ExcelBorderStyle.Thin, Color.Black);

                    sheet.Cells[rowIndex, 9].Value = sumofmoney;
                    sheet.Cells[rowIndex, 9].Style.Font.Bold = true;
                    for (int i = 1; i <= 9; i++)
                    {
                        sheet.Cells[rowIndex, i].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                    }
                    sheet.Cells[17, 1, rowIndex, 9].Style.Border.BorderAround(ExcelBorderStyle.Thin, Color.Black);  // vẽ border toàn khung
                    rowIndex += 2;

                    ExcelRichText boldText, normalText, italicText;  //format một đoạn văn bản nhỏ(trong một đoạn văn bản lớn) thành kiểu bold, normal hoac italic

                    sheet.Cells[rowIndex, 1].RichText.Add("Tổng số tiền (viết bằng chữ) : ");
                    boldText = sheet.Cells[rowIndex, 1].RichText.Add(SoTienBangChu.ChuyenSoTienSangChu(sumofmoney, objModel[0].MoneyTypeId, objModel[0].MoneyTypeName)); //format một đoạn văn bản bold, normal hoac italic
                    boldText.Bold = true;
                    sheet.Cells[rowIndex, 1, rowIndex, 9].Merge = true;
                    rowIndex++;

                    sheet.Cells[rowIndex, 1].Value = "Số chứng từ gốc kèm theo :";
                    sheet.Cells[rowIndex, 1, rowIndex, 9].Merge = true;
                    rowIndex += 2;

                    sheet.Cells[rowIndex, 6].Value = "ngày " + "    " + " tháng " + "    " + " năm " + "    ";
                    sheet.Cells[rowIndex, 6].Style.Font.Italic = true;
                    sheet.Cells[rowIndex, 6].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                    sheet.Cells[rowIndex, 6].Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                    sheet.Cells[rowIndex, 6, rowIndex, 7].Merge = true;
                    rowIndex++;

                    //sheet.Cells[rowIndex, 7].Value = "Kế toán trưởng\r\n(Hoặc bộ phận có nhu cầu nhập\r\n(Ký, họ tên)";

                    boldText = sheet.Cells[rowIndex, 6].RichText.Add("Kế toán trưởng\r\n");
                    boldText.Bold = true;
                    normalText = sheet.Cells[rowIndex, 6].RichText.Add("(Hoặc bộ phận có nhu cầu nhập)\r\n");
                    normalText.Bold = false;
                    italicText = sheet.Cells[rowIndex, 6].RichText.Add("(Ký, họ tên)");
                    italicText.Italic = true;
                    italicText.Bold = false;
                    sheet.Cells[rowIndex, 6].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                    sheet.Cells[rowIndex, 6].Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                    sheet.Cells[rowIndex, 6, rowIndex + 2, 7].Merge = true;
                    sheet.Cells[rowIndex, 6].Style.WrapText = true;
                    rowIndex++;

                    //sheet.Cells[rowIndex, 2].Value = "Người lập phiếu\r\n(Ký, họ tên)";
                    boldText = sheet.Cells[rowIndex, 1].RichText.Add("Người lập phiếu\r\n");
                    boldText.Bold = true;
                    italicText = sheet.Cells[rowIndex, 1].RichText.Add("(Ký, họ tên)");
                    italicText.Italic = true;
                    italicText.Bold = false;
                    sheet.Cells[rowIndex, 1, rowIndex + 1, 2].Merge = true;
                    sheet.Cells[rowIndex, 1].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                    sheet.Cells[rowIndex, 1].Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                    sheet.Cells[rowIndex, 1].Style.WrapText = true;

                    //sheet.Cells[rowIndex, 4].Value = "Người nhận hàng\r\n(Ký, họ tên)";
                    boldText = sheet.Cells[rowIndex, 3].RichText.Add("Người nhận hàng\r\n");
                    boldText.Bold = true;
                    italicText = sheet.Cells[rowIndex, 3].RichText.Add("(Ký, họ tên)");
                    italicText.Italic = true;
                    italicText.Bold = false;
                    sheet.Cells[rowIndex, 3, rowIndex + 1, 3].Merge = true;
                    sheet.Cells[rowIndex, 3].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                    sheet.Cells[rowIndex, 3].Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                    sheet.Cells[rowIndex, 3].Style.WrapText = true;
                    sheet.Column(3).Width = 20;

                    //sheet.Cells[rowIndex, 5].Value = "Thủ kho\r\n(Ký, họ tên)";
                    boldText = sheet.Cells[rowIndex, 4].RichText.Add("Thủ kho\r\n");
                    boldText.Bold = true;
                    italicText = sheet.Cells[rowIndex, 4].RichText.Add("(Ký, họ tên)");
                    italicText.Italic = true;
                    italicText.Bold = false;
                    sheet.Cells[rowIndex, 4, rowIndex + 1, 5].Merge = true;
                    sheet.Cells[rowIndex, 4].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                    sheet.Cells[rowIndex, 4].Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                    sheet.Cells[rowIndex, 4].Style.WrapText = true;

                    //sheet.Cells[rowIndex, 9].Value = "Giám đốc\r\n(Ký, họ tên)";
                    boldText = sheet.Cells[rowIndex, 8].RichText.Add("Giám đốc\r\n");
                    boldText.Bold = true;
                    italicText = sheet.Cells[rowIndex, 8].RichText.Add("(Ký, họ tên)");
                    italicText.Italic = true;
                    italicText.Bold = false;
                    sheet.Cells[rowIndex, 8, rowIndex + 1, 9].Merge = true;
                    sheet.Cells[rowIndex, 8].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                    sheet.Cells[rowIndex, 8].Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                    sheet.Cells[rowIndex, 8].Style.WrapText = true;

                }
                else
                {
                    sheet.Cells[1, 1].Value = "Không có dữ liệu";
                    sheet.Cells[1, 1].Style.Font.Size = 14;
                    sheet.Cells[1, 1].Style.Font.Bold = true;
                    sheet.Cells[1, 1].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                    sheet.Cells[1, 1, 1, 9].Merge = true;
                }

                Response.ClearContent();
                Response.BinaryWrite(excelPackage.GetAsByteArray());
                DateTime dateNow = DateTime.Now;
                string fileName;
                if (objModel != null && objModel.Count > 0)
                    fileName = objModel[0].ReceiptionName + "(" + objModel[0].ReceiptionCode + ")-" + dateNow.ToString("yyMMddhhmmss") + ".xlsx";
                else
                    fileName = "Empty File-" + dateNow.ToString("yyMMddhhmmss") + ".xlsx";
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
}