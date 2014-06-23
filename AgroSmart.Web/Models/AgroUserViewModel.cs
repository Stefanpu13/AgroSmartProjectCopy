using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace AgroSmart.Web.Models
{
    [DataContract]
    public class AgroUserViewModel
    {
        [DataMember(Name="id")]
        public string Id { get; set; }

        [DataMember(Name="username")]
        public string Username { get; set; }
    }
}