using GHMS.Common.Resp;
using GHMS.DAL.Models;
using GHMS.DAL.Repositories;
using System.Collections.Generic;
using GHMS.Common.BLL;
using GHMS.Common.Req;

namespace GHMS.BLL.Svc
{
    public class MenstrualDaySvc : GenericSvc<MenstrualDayRep, MenstrualDay>
    {
        private readonly MenstrualDayRep _rep;

        // ✅ Constructor: truyền MenstrualDayRep vào GenericSvc
        public MenstrualDaySvc(MenstrualDayRep rep) : base(rep)
        {
            _rep = rep;
        }

        // ✅ Lấy dữ liệu theo tháng/năm của một người dùng
        public List<MenstrualDay> GetMonthlyData(string userId, int month, int year)
        {
            return _rep.GetByMonth(userId, month, year);
        }

        // ✅ Lưu danh sách bản ghi từng ngày trong tháng
        public SingleRsp SaveMonthlyData(string userId, List<MenstrualDayReq> dailyRecords)
        {
            var res = new SingleRsp();

            foreach (var d in dailyRecords)
            {
                var entity = new MenstrualDay
                {
                    UserId = userId,
                    Date = d.Date,
                    Symptoms = d.Symptoms,
                    Notes = d.Notes,
                    Mood = d.Mood,
                    HasPeriod = d.HasPeriod
                };

                _rep.Create(entity);
            }

            res.Data = true;
            return res;
        }
    }
}
