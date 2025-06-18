using GHMS.Common.DAL;
using GHMS.Common.Resp;
using System.Collections.Generic;
using System.Linq;

namespace GHMS.Common.BLL
{
    public class GenericSvc<TRep, T> : IGenericSvc<T>
    where TRep : IGenericRep<T>
    where T : class
    {
        protected readonly TRep _rep;

        public GenericSvc(TRep rep)
        {
            _rep = rep;
        }

        public SingleRsp Get(int id)
        {
            return new SingleRsp { Data = _rep.Read(id) };
        }

        public MultipleRsp List()
        {
            return new MultipleRsp { Data = _rep.All.ToList() };
        }

        public SingleRsp Add(T entity)
        {
            _rep.Create(entity);
            return new SingleRsp { Data = entity };
        }

        public SingleRsp Update(T entity)
        {
            _rep.Update(entity);
            return new SingleRsp { Data = entity };
        }

        public SingleRsp Delete(int id)
        {
            var entity = _rep.Read(id);
            if (entity == null)
                return new SingleRsp { Error = "Not found" };

            _rep.Delete(entity);
            return new SingleRsp { Data = entity };
        }
    }
}
