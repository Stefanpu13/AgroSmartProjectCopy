using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace AgroSmart.Web.Models
{
    [DataContract]
    public class AgroRegionViewModel
    {
        [DataMember(Name="id")]
        public int Id { get; set; }

        [DataMember(Name="description")]
        public string Description { get; set; }

        [DataMember(Name="name")]
        public string Name { get; set; }

        [DataMember(Name="points")]
        public IEnumerable<AgroPointViewModel> Points { get; set; }
    }
}