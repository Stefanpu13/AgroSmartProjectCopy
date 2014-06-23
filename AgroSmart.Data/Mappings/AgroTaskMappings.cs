using System.Data.Entity.ModelConfiguration;
using AgroSmart.Models;

namespace AgroSmart.Data.Mappings
{
    public class AgroTaskMappings : EntityTypeConfiguration<AgroTask>
    {
        public AgroTaskMappings()
        {
            this.Property(x => x.Name).IsRequired();
            //this.Property(x => x.ActualStartData).IsOptional();
            //this.Property(x => x.ActualEndDate).IsOptional();
        }
    }
}