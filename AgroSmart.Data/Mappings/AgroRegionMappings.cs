using AgroSmart.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity.ModelConfiguration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AgroSmart.Data.Mappings
{
    public class AgroRegionMappings : EntityTypeConfiguration<AgroRegion>
    {
        public AgroRegionMappings()
        {            
            this.HasMany(x => x.Points).WithRequired().WillCascadeOnDelete();
        }
    }
}
