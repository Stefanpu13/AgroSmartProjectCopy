using AgroSmart.Models;
using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AgroSmart.Contracts.Repository
{
    public interface IUnitOfWorkAgroSmart : IUnitOfWork
    {
        IRepository<AgroUser> Users { get; }

        IRepository<AgroTask> Tasks { get; }
        IRepository<AgroRegion> Regions { get; }
        IRepository<AgroUnit> Units { get; }
        IRepository<AgroPoint> Points { get; }
    }
}
