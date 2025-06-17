using GHMS.Common.Resp;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using GHMS.Common.Resp;
using System.Threading.Tasks;

namespace GHMS.Common.BLL
{
    public interface IGenericSvc<T> where T : class
    {
        SingleRsp Get(int id);        // Retrieve one record
        MultipleRsp List();           // Retrieve all records
        SingleRsp Add(T entity);      // Create a new record
        SingleRsp Update(T entity);   // Update existing record
        SingleRsp Delete(int id);     // Delete by id
    }
}
