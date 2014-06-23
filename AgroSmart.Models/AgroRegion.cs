using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AgroSmart.Models
{
    public class AgroRegion
    {
        public int Id { get; set; }
        public string Description { get; set; }
        public string Name { get; set; }
        public virtual ICollection<AgroPoint> Points { get; set; }

        public int? TaskId { get; set; }
        public virtual AgroTask Task { get; set; }

        public AgroRegion()
        {
            this.Points = new HashSet<AgroPoint>();
        }
    }
}
