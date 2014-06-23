using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AgroSmart.Contracts.Repository
{
    public interface IUnitOfWork : IDisposable
    {
        DbContext Context { get; }
        IRepository<T> GetRepository<T>() where T : class;

        int SaveChanges();
    }
}
