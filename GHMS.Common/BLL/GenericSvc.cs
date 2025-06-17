using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GHMS.Common.Resp;
using GHMS.Common.DAL;

namespace GHMS.Common.BLL
{
    public class GenericSvc<T> : IGenericSvc<T> where T : class
    {
        protected readonly IGenericRep<T> _repository;
        public GenericSvc(IGenericRep<T> repository)
        {
            _repository = repository;
        }

        public SingleRsp Get(int id)
        {
            // Wrap repository read in response
            return new SingleRsp { Data = _repository.Read(id) };
        }

        public MultipleRsp List()
        {
            // Return all entities in response
            return new MultipleRsp { Data = _repository.All.ToList() };
        }

        public SingleRsp Add(T entity)
        {
            // Save and return created entity
            _repository.Create(entity);
            return new SingleRsp { Data = entity };
        }

        public SingleRsp Update(T entity)
        {
            _repository.Update(entity);
            return new SingleRsp { Data = entity };
        }

        public SingleRsp Delete(int id)
        {
            var entity = _repository.Read(id);
            if (entity == null)
                return new SingleRsp { Error = "Not found" };

            _repository.Delete(entity);
            return new SingleRsp { Data = entity };
        }
    }
}

