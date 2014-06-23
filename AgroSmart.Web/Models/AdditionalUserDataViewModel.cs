using System;
using System.Runtime.Serialization;

namespace AgroSmart.Web.Models
{
    [DataContract]
    public class AdditionalUserDataViewModel
    {
        [DataMember (Name="isAdmin")]
        public bool IsAdmin { get; set; }

        [DataMember (Name="trackCoordinates")]
        public bool TrackCoordinates { get; set; }

        [DataMember(Name = "unitId")]
        public int? UnitId { get; set; }
    }
}