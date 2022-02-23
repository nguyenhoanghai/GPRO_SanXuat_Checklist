using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SanXuatCheckList.Business.Enum
{
    public enum ePermissionType
    {
        Add = 1,
        Update = 2,
        Delete = 3,
        View = 4,
        Approve = 5,
        Other = 6,
        Restore = 7,
        LockAccount = 8,
        LockTimeAccount = 9,
        RequirePassword = 10
    }
}
