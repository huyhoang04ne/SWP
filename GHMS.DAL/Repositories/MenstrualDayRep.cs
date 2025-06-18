using GHMS.Common.DAL;
using GHMS.DAL.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System;
using System.Collections.Generic;
using System.Linq;

namespace GHMS.DAL.Repositories
{
    public class MenstrualDayRep : GenericRep<MenstrualDay>
    {
        public MenstrualDayRep(GenderHealthContext context) : base(context) { }

        public List<MenstrualDay> GetByMonth(string userId, int month, int year)
        {
            return _dbSet.Where(d => d.UserId == userId &&
                                     d.Date.Month == month &&
                                     d.Date.Year == year)
                         .OrderBy(d => d.Date)
                         .ToList();
        }
    }
}
