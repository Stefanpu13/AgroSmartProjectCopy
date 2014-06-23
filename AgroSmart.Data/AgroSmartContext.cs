using AgroSmart.Models;
using AgroSmart.Data.Mappings;
using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.Entity;

namespace AgroSmart.Data
{
    public class AgroSmartContext : IdentityDbContext<AgroUser>
    {
        public AgroSmartContext()
            :base("DefaultConnection")
        {
        }

        public DbSet<AgroTask> Tasks { get; set; }
        public DbSet<AgroUnit> Units { get; set; }
        public DbSet<AgroRegion> Regions { get; set; }
        public DbSet<AgroPoint> Points { get; set; }
        public DbSet<AgroUnitLocation> Locations { get; set; }

        protected override void OnModelCreating(System.Data.Entity.DbModelBuilder modelBuilder)
        {
            modelBuilder.Configurations.Add(new AgroTaskMappings());
            modelBuilder.Configurations.Add(new AgroRegionMappings());
            base.OnModelCreating(modelBuilder);
        }
    }
}
