using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace AgroSmart.Web.Models
{
    [DataContract]
    public class AgroPointViewModel
    {
        [DataMember(Name="id")]
        public int Id { get; set; }

        [DataMember(Name = "lat")]
        public double Latitude { get; set; }

        [DataMember(Name="lng")]
        public double Longitude { get; set; }

        [DataMember(Name="index")]
        public int? Index { get; set; }
    }
}