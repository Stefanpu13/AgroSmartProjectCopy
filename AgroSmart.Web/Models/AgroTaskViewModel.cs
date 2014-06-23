using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Runtime.Serialization;
using AgroSmart.Models;

namespace AgroSmart.Web.Models
{
    [DataContract]
    public class AgroTaskViewModel
    {
        [DataMember (Name="id")]
        public int Id { get; set; }

        [DataMember (Name="name")]
        public string Name { get; set; }

        [DataMember (Name="description")]
        public string Description { get; set; }

        [DataMember (Name="regions")]
        public IEnumerable<AgroRegionViewModel> Regions { get; set; }

        [DataMember (Name="unit")]
        public AgroUnitViewModel Unit { get; set; }

        [DataMember (Name="assignedDate")]
        public DateTime AssignedDate { get; set; }

        [DataMember(Name = "status")]
        public TaskStatus Status { get; set; }
    }
}