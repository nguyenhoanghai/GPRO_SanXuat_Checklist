using GPRO.Core.Mvc;
using GPROCommon.Models;
using GPROSanXuat_Checklist.App_Global;
using GPROSanXuat_Checklist.Business;
using GPROSanXuat_Checklist.Business.Model;
using GPROSanXuat_Checklist.Controllers;
using GPROSanXuat_Checklist.Mapper;
using Newtonsoft.Json;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using System;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Web.Mvc;

namespace GPROSanXuat_Checklist.Controllers
{
    public class ChecklistController : BaseController
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult AdminInfo(int Id)
        {
            return View(Id);
        }

        public ActionResult ApproveAdminInfo(int Id)
        {
            return View(Id);
        }

        [HttpPost]
        public JsonResult Gets(string keyword)
        {
            try
            {
                if (isAuthenticate)
                {
                    var objs = BLLChecklist.Instance.Gets(AppGlobal.ConnectionstringSanXuatChecklist, keyword);
                    objs = ChecklistMaper.Instance.MapInfoFromGPROCommon(objs);
                    JsonDataResult.Records = JsonConvert.SerializeObject(objs);
                    JsonDataResult.Result = "OK";
                }
            }
            catch (Exception ex)
            {
                JsonDataResult.Result = "ERROR";
                JsonDataResult.ErrorMessages.Add(new Error() { MemberName = "Get List ObjectType", Message = "Lỗi: " + ex.Message });
            }
            return Json(JsonDataResult);
        }

        [HttpPost]
        public JsonResult GetById(int Id, bool isFull)
        {
            try
            {
                if (isAuthenticate)
                {

                    var obj  = BLLChecklist.Instance.Get(AppGlobal.ConnectionstringSanXuatChecklist, Id, (isFull ? 0 : UserContext.UserID));
                    obj  = ChecklistMaper.Instance.MapInfoFromGPROCommon(obj );

                    JsonDataResult.Records = JsonConvert.SerializeObject(obj );
                    JsonDataResult.Result = "OK";
                }
            }
            catch (Exception ex)
            {
                JsonDataResult.Result = "ERROR";
                JsonDataResult.ErrorMessages.Add(new Error() { MemberName = "Get List ObjectType", Message = "Lỗi: " + ex.Message });
            }
            return Json(JsonDataResult);
        }

        public JsonResult Save(ChecklistModel model)
        {
            ResponseBase responseResult;
            try
            {
                if (isAuthenticate)
                {
                    model.ActionUser = UserContext.UserID;
                    responseResult = BLLChecklist.Instance.InsertOrUpdate(AppGlobal.ConnectionstringSanXuatChecklist, model, isOwner);
                    if (!responseResult.IsSuccess)
                    {
                        JsonDataResult.Result = "ERROR";
                        JsonDataResult.ErrorMessages.AddRange(responseResult.Errors);
                    }
                    else
                    {
                        JsonDataResult.Result = "OK";
                        JsonDataResult.Data = responseResult.Data;
                    }

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

        [HttpPost]
        public JsonResult Delete(int Id)
        {
            ResponseBase responseResult;
            try
            {
                if (isAuthenticate)
                {
                    responseResult = BLLChecklist.Instance.Delete(AppGlobal.ConnectionstringSanXuatChecklist, Id, UserContext.UserID, isOwner);
                    if (responseResult.IsSuccess)
                        JsonDataResult.Result = "OK";
                    else
                    {
                        JsonDataResult.Result = "ERROR";
                        JsonDataResult.ErrorMessages.AddRange(responseResult.Errors);
                    }
                }
            }
            catch (Exception ex)
            {
                //add error
                JsonDataResult.Result = "ERROR";
                JsonDataResult.ErrorMessages.Add(new Error() { MemberName = "Delete Area", Message = "Lỗi: " + ex.Message });
            }
            return Json(JsonDataResult);
        }

        /// <summary>
        /// Xuất report checklist
        /// </summary>
        /// <param name="Id"></param>
        /// <returns></returns>
        public void ExportExcel(int Id)
        {
            var fi = new FileInfo(Server.MapPath(@"~\ReportTemplates\admin_checklist.xlsx"));
            using (var package = new ExcelPackage(fi))
            {
                var workbook = package.Workbook;
                var worksheet = workbook.Worksheets.First();

                var obj = BLLChecklist.Instance.Get(AppGlobal.ConnectionstringSanXuatChecklist, Id, 0);
                obj = ChecklistMaper.Instance.MapInfoFromGPROCommon(obj);
                if (obj != null)
                {
                    worksheet.Cells[1, 1].Value = "THÔNG TIN CHECKLIST: " + obj.Name;
                    //worksheet.Cells[12, 2].Value = obj.LineName;
                    worksheet.Cells[12, 6].Value = obj.ProductName;
                    worksheet.Cells[12, 7].Value = obj.Productivity;
                    worksheet.Cells[12, 8].Value = obj.ProductionDays;
                    worksheet.Cells[12, 9].Value = obj.Quantities;
                    worksheet.Cells[12, 10].Value = obj.DeliveryDate;
                    worksheet.Cells[12, 11].Value = obj.InputDate;

                    if (obj.JobSteps.Count > 0)
                    {
                        int _col = 12;
                        for (int i = 0; i < obj.JobSteps.Count; i++)
                        {
                            worksheet.Cells[7, _col].Value = obj.JobSteps[i].StepIndex;
                            worksheet.Cells[7, _col, 7, _col + 1].Merge = true;
                            worksheet.Cells[7, _col, 7, _col + 1].Style.Border.BorderAround(ExcelBorderStyle.Thin);

                            worksheet.Cells[8, _col].Value = obj.JobSteps[i].Name;
                            worksheet.Cells[8, _col, 8, _col + 1].Merge = true;
                            worksheet.Cells[8, _col, 8, _col + 1].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                            worksheet.Cells[8, _col, 8, _col + 1].Style.Font.Color.SetColor(Color.FromArgb(0, 0, 247));
                            worksheet.Cells[8, _col, 8, _col + 1].Style.Fill.PatternType = ExcelFillStyle.Solid;
                            worksheet.Cells[8, _col, 8, _col + 1].Style.Fill.BackgroundColor.SetColor(Color.FromArgb(204, 255, 204));


                            worksheet.Cells[9, _col].Value = obj.JobSteps[i].Note;
                            worksheet.Cells[9, _col, 9, _col + 1].Merge = true;
                            worksheet.Cells[9, _col, 9, _col + 1].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                            worksheet.Cells[9, _col, 9, _col + 1].Style.Font.Color.SetColor(Color.FromArgb(255, 0, 0));
                            worksheet.Cells[9, _col, 9, _col + 1].Style.Fill.PatternType = ExcelFillStyle.Solid;
                            worksheet.Cells[9, _col, 9, _col + 1].Style.Fill.BackgroundColor.SetColor(Color.FromArgb(0, 204, 255));

                            worksheet.Cells[10, _col].Value = "C.Nhật";
                            worksheet.Cells[10, _col].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                            worksheet.Cells[10, _col].Style.Fill.PatternType = ExcelFillStyle.Solid;
                            worksheet.Cells[10, _col].Style.Fill.BackgroundColor.SetColor(Color.FromArgb(204, 255, 204));

                            worksheet.Cells[11, _col].Value = "Update";
                            worksheet.Cells[11, _col].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                            worksheet.Cells[11, _col].Style.Fill.PatternType = ExcelFillStyle.Solid;
                            worksheet.Cells[11, _col].Style.Fill.BackgroundColor.SetColor(Color.FromArgb(204, 255, 204));


                            worksheet.Cells[10, _col + 1].Value = "KH Nhận";
                            worksheet.Cells[10, _col + 1].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                            worksheet.Cells[10, _col + 1].Style.Fill.PatternType = ExcelFillStyle.Solid;
                            worksheet.Cells[10, _col + 1].Style.Fill.BackgroundColor.SetColor(Color.FromArgb(0, 204, 255));

                            worksheet.Cells[11, _col + 1].Value = "Receive";
                            worksheet.Cells[11, _col + 1].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                            worksheet.Cells[11, _col + 1].Style.Fill.PatternType = ExcelFillStyle.Solid;
                            worksheet.Cells[11, _col + 1].Style.Fill.BackgroundColor.SetColor(Color.FromArgb(0, 204, 255));

                            worksheet.Cells[12, _col].Value = obj.JobSteps[i].UpdatedDate;
                            worksheet.Cells[12, _col].Style.Border.BorderAround(ExcelBorderStyle.Thin);

                            worksheet.Cells[12, _col + 1].Value = obj.JobSteps[i].EndDate;
                            worksheet.Cells[12, _col + 1].Style.Border.BorderAround(ExcelBorderStyle.Thin);

                            _col += 2;
                        }
                        worksheet.Cells[7, 12, 12, _col].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                    }
                }



                Response.ClearContent();
                Response.BinaryWrite(package.GetAsByteArray());
                DateTime dateNow = DateTime.Now;
                string fileName = "Checklist_" + dateNow.ToString("yyMMddhhmmss") + ".xlsx";
                Response.AddHeader("content-disposition", "attachment;filename=" + fileName);
                Response.ContentType = "application/excel";
                Response.Flush();
                Response.End();
            }
        }
         
    }
}