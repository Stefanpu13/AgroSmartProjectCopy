using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AgroSmart.Models
{
    public class AgroUnitLocation
    {
        public int Id { get; set; }

        public double Latitude { get; set; }
        public double Longitude { get; set; }

        public int UnitId { get; set; }
        public virtual AgroUnit Unit { get; set; }

        public DateTime StartTime { get; set; }
        public DateTime? EndTime { get; set; }
    }
}
