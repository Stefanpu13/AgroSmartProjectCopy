using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AgroSmart.Models
{
    public class AgroUser : IdentityUser
    {
        public int? UnitId { get; set; }
        public virtual AgroUnit Unit { get; set; }
    }
}
