using AgroSmart.Data;
using AgroSmart.Models;
using AgroSmart.Web.Models;
using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Microsoft.AspNet.Identity;

namespace AgroSmart.Web.Controllers
{
    [Authorize]
    [RoutePrefix("api/Unit")]
    public class UnitController : BaseController
    {
        public UnitController()
            : base(new UnitOfWorkAgroSmart())
        {

        }

        [HttpGet]
        [Route("GetAll")]
        public IEnumerable<AgroUnitUserViewModel> GetAll()
        {
            var units = this.Db.Units.All("AgroUsers").Select(u => new AgroUnitUserViewModel
                {
                    Id = u.Id,
                    Name = u.Name,
                    User = u.Users.Select(us => new AgroUserViewModel
                    {
                        Id = us.Id,
                        Username = us.UserName,
                        
                    }).FirstOrDefault()
                });

            return units;
        }

        [HttpGet]
        [Route("GetUnassignedUsers")]
        public IEnumerable<AgroUserViewModel> GetUnassignedUsers()
        {
            var users = this.Db.Users.All()
                .Where(u => u.Unit == null)
                .Select(u => new AgroUserViewModel
                {
                    Id = u.Id,
                    Username = u.UserName
                });

            return users;
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        [ActionName("Create")]
        public void Post(AgroUnitUserViewModel unit)
        {
            if (ModelState.IsValid)
            {
                AgroUnit newUnit = new AgroUnit
                {
                    Name = unit.Name
                };
                Db.Units.Add(newUnit);
                Db.SaveChanges();
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPut]
        [ActionName("ChangeName")]
        public void ChangeName(int id, [FromBody] AgroUnitUserViewModel unit)
        {
            var agroUnit = Db.Units.GetById(id);
            agroUnit.Name = unit.Name;

            Db.Units.Update(agroUnit);
            Db.SaveChanges();
        }

        [HttpPut]
        [ActionName("AssigneUser")]
        public void AssigneUser(string id, [FromBody]AgroUnitUserViewModel unit)
        {
            AgroUser user = Db.Users.All().Single(us=>us.Id==id);
            
            AgroUnit updatedUnit = Db.Units.GetById(unit.Id);

            updatedUnit.Users.Add(user);

            //user.Unit.Id = unit.Id;
            //user.Unit.Name = unit.Name;

            Db.SaveChanges();
        }

        [HttpPut]
        [ActionName("UnassigneUser")]
        public void UnassigneUser(string id)
        {
            AgroUser user = Db.Users.All().Single(us => us.Id == id);

            user.UnitId = null;

            //user.Unit.Id = unit.Id;
            //user.Unit.Name = unit.Name;

            Db.SaveChanges();
        }

        [HttpGet]
        public AdditionalUserDataViewModel GetAdditionalUserData()
        {
            var additionalInfo = new AdditionalUserDataViewModel();
            var userId = User.Identity.GetUserId();
            var currentData = DateTime.Now;
            var RoleManager = new RoleManager<IdentityRole>(new
                                      RoleStore<IdentityRole>(this.Db.Context));

            var role = RoleManager.FindByName("Admin");
            var currentUser = this.Db.Users.All().Single(u => u.Id == userId);
            var currentRole = currentUser.Roles.Any(x => x.RoleId == role.Id);
            if (currentRole)
            {
                additionalInfo.IsAdmin = true;
            }

            additionalInfo.TrackCoordinates = (currentUser.UnitId != null) && (currentUser.Unit.Tasks.Count > 0);
            additionalInfo.UnitId = currentUser.UnitId;

            return additionalInfo;
        }
    }
}
