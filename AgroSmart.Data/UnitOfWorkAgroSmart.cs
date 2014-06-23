using AgroSmart.Contracts.Repository;
using AgroSmart.Models;
using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AgroSmart.Data
{
    public class UnitOfWorkAgroSmart : UnitOfWorkBase, IUnitOfWorkAgroSmart
    {
        public UnitOfWorkAgroSmart()
            : base(new AgroSmartContext())
        {

        }

        public IRepository<AgroTask> Tasks
        {
            get { return GetRepository<AgroTask>(); }
        }


        public IRepository<AgroUser> Users
        {
            get { return GetRepository<AgroUser>(); }
        }


        public IRepository<AgroRegion> Regions
        {
            get { return GetRepository<AgroRegion>(); }
        }

        public IRepository<AgroUnit> Units
        {
            get { return GetRepository<AgroUnit>(); }
        }

        public IRepository<AgroPoint> Points
        {
            get { return GetRepository<AgroPoint>(); }
        }

        public IRepository<AgroUnitLocation> Locations
        {
            get { return GetRepository<AgroUnitLocation>(); }
        }
        
    }
}
