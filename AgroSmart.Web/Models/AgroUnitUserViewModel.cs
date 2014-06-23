using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace AgroSmart.Web.Models
{
    [DataContract]
    public class AgroUnitUserViewModel
    {
        [DataMember(Name="id")]
        public int Id { get; set; }

        [DataMember(Name="name")]
        public string Name { get; set; }

        [DataMember(Name="long")]
        public double? Longtitude { get; set; }

        [DataMember(Name="lang")]
        public double? Langtitude { get; set; }

        [DataMember(Name = "user")]
        public AgroUserViewModel User { get; set; }
    }
}