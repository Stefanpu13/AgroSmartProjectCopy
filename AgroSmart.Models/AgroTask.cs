using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AgroSmart.Models
{
    public class AgroTask
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public virtual ICollection<AgroRegion> Regions { get; set; }
        public int UnitId { get; set; }
        public virtual AgroUnit Unit { get; set; }
        public DateTime AssignedDate { get; set; }
        public DateTime? ActualStartData { get; set; }
        public DateTime? ActualEndDate { get; set; }
        public TaskStatus Status { get; set; }

        public AgroTask()
        {
            this.Regions = new HashSet<AgroRegion>();
        }
    }
}
