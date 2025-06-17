using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GHMS.Common.DAL
{
    public interface IGenericRep<T> where T : class
    {
        IQueryable<T> All { get; }      // Queryable for collection
        T Read(int id);                 // Find by primary key
        void Create(T entity);         // Insert new
        void Update(T entity);         // Update existing
        void Delete(T entity);         // Delete existing
    }
}
