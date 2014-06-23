using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AgroSmart.Models
{
    public class AgroUnit
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public virtual ICollection<AgroUser> Users { get; set; }
        public virtual ICollection<AgroTask> Tasks { get; set; }
        public virtual ICollection<AgroUnitLocation> Locations { get; set; }

        public AgroUnit()
        {
            this.Users = new HashSet<AgroUser>();
            this.Tasks = new HashSet<AgroTask>();
            this.Locations = new HashSet<AgroUnitLocation>();
        }
    }
}
