using AgroSmart.Data;
using AgroSmart.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Microsoft.AspNet.Identity;
using AgroSmart.Web.Models;

namespace AgroSmart.Web.Controllers
{
    [Authorize]
    public class TaskController : BaseController
    {
        public TaskController ()
            :base(new UnitOfWorkAgroSmart())
	    {
        }

        [HttpGet]
        public IEnumerable<AgroTaskViewModel> GetAll()
        {
            var tasks = this.Db.Tasks.All("AgroRegions", "AgroPoints", "AgroUnits")
                .OrderBy(task=> task.Id)
                .Select(t => new AgroTaskViewModel
                {
                    Id = t.Id,
                    Name = t.Name,
                    Status = t.Status,
                    Unit = new AgroUnitViewModel
                    {
                        Id = t.Unit.Id,
                        Name = t.Unit.Name,
                        Latitude = t.Unit.Locations.FirstOrDefault(loc => loc.EndTime == null) == null ? (double?)null : 
                                            t.Unit.Locations.FirstOrDefault(loc => loc.EndTime == null).Latitude,
                    },
                    Description = t.Description,
                    AssignedDate = t.AssignedDate,
                    Regions = t.Regions.Select(r => new AgroRegionViewModel
                    {
                        Id = r.Id,
                        Name = r.Name,
                        Description = r.Description,
                        Points = r.Points.Select(p => new AgroPointViewModel
                        {
                            Id = p.Id,
                            Index = p.Index,
                            Latitude = p.Latitude,
                            Longitude = p.Longitude
                        })
                    })
                });

            return tasks;
        }

        [HttpGet]
        public IEnumerable<AgroTaskViewModel> GetTasksForUserByDate(DateTime date)
        {
            var userId = User.Identity.GetUserId();
            var tasks = this.Db.Tasks.All("AgroRegions", "AgroPoints", "AgroUnits")
                .Where(t => t.Unit.Users.Any(u => u.Id == userId))
                .Where(t => t.AssignedDate == date)
                .Select(t => new AgroTaskViewModel
                {
                    Id = t.Id,
                    Name = t.Name,
                    Status = t.Status,
                    Unit = new AgroUnitViewModel
                    {
                        Id = t.Unit.Id,
                        Name = t.Unit.Name,
                        Latitude = t.Unit.Locations.FirstOrDefault(loc=>loc.EndTime == null).Latitude,
                        Longitude = t.Unit.Locations.FirstOrDefault(loc => loc.EndTime == null).Longitude,

                    },
                    Description = t.Description,
                    AssignedDate = t.AssignedDate,
                    Regions = t.Regions.Select(r => new AgroRegionViewModel
                    {
                        Id = r.Id,
                        Name = r.Name,
                        Description = r.Description,
                        Points = r.Points.Select(p => new AgroPointViewModel
                        {
                            Id = p.Id,
                            Index = p.Index,
                            Latitude = p.Latitude,
                            Longitude = p.Longitude
                        })
                    })
                });

            return tasks;
        }

        [HttpGet]
        public AgroTask GetById(int id)
        {
            var task = Db.Tasks.GetById(id);
            return task;
        }

        // POST api/<controller>
        
        [HttpPost]
        [Authorize (Roles="Admin")]
        [ActionName("Create")]
        public void Post(AgroTaskViewModel task)
        {
            if (ModelState.IsValid)
	        {
                AgroTask newTask = new AgroTask
                {
                    Name = task.Name,
                    Description = task.Description,
                    AssignedDate = task.AssignedDate,
                    UnitId = task.Unit.Id
                };

                Db.Tasks.Add(newTask);

                foreach (AgroRegionViewModel region in task.Regions)
                {
                    AgroRegion updatedRegion = Db.Regions.GetById(region.Id);

                    updatedRegion.Task = newTask;

                    Db.Regions.Update(updatedRegion);                    
                }
                Db.SaveChanges();
	        }
        }

        // PUT api/<controller>/5
        [ActionName("SetStarted")]
        public void PutStarted(int id)
        {
            AgroTask task = this.Db.Tasks.GetById(id);

            task.Status = TaskStatus.Started;
                        
            task.ActualStartData = DateTime.Now;

            Db.SaveChanges();
        }

        [ActionName("SetFinished")]
        public void PutFinished(int id)
        {
            AgroTask task = this.Db.Tasks.GetById(id);

            task.Status = TaskStatus.Finished;

            task.ActualEndDate = DateTime.Now;

            Db.SaveChanges();
        }

        [ActionName("Delete")]
        // DELETE api/<controller>/5
        public void Delete(AgroTaskViewModel taskModel)
        {
            AgroTask task = this.Db.Tasks.GetById(taskModel.Id);

            foreach (AgroRegion region in task.Regions)
            {
                region.TaskId = null;
            }

            Db.Tasks.Delete(task);

            Db.SaveChanges();
        }
    }
}