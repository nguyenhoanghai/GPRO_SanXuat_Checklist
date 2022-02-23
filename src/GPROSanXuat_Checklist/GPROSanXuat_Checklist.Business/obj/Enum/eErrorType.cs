using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SanXuatCheckList.Business.Enum
{
    public enum eErrorType
    {
        UnKnown = 0,
        NoPermission = 1,
        Error404 = 2

    }

    public static class eErrorMessage
    {
        public const string NoPermission = "Tài khoản của bạn không được phép vào trang này.";
        public const string Error404 = "Trang web bạn đang muốn truy cập không tìm thấy.";
        public const string UnKnowwn = "Hệ Thống xử lý bị lỗi."; 
    }
}
