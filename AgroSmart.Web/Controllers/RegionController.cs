using AgroSmart.Data;
using AgroSmart.Models;
using AgroSmart.Web.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace AgroSmart.Web.Controllers
{
    //[Authorize]   
    public class RegionController : BaseController
    {
        public RegionController()
            : base(new UnitOfWorkAgroSmart())
        {
        }

        [HttpGet] 
        public IEnumerable<AgroRegionViewModel> GetAll()
        {            
            var regions = this.Db.Regions.All().Select(r => new AgroRegionViewModel
                {
                    Id = r.Id,
                    Name = r.Name,
                    Description = r.Description
                });

            return regions;
        }

        [HttpGet]
        public IEnumerable<AgroRegionViewModel> GetAllUnassigned()
        {
            var regions = this.Db.Regions.All().Where(region => region.TaskId == null).Select(r => new AgroRegionViewModel
            {
                Id = r.Id,
                Name = r.Name,
                Description = r.Description
            });

            return regions;
        }

        [HttpGet] 
        public IEnumerable<AgroRegionViewModel> GetRegionsWithPoints() 
        {
            var regions = this.Db.Regions.All().Select(r => new AgroRegionViewModel
            {
                Id = r.Id,
                Name = r.Name,
                Description = r.Description,
                Points = r.Points.Select(p => new AgroPointViewModel
                {
                    Latitude = p.Latitude,
                    Longitude = p.Longitude
                })
            });

            return regions;
        }

        [HttpPost]
        //[Authorize(Roles = "Admin")]
        public HttpResponseMessage Create(IEnumerable<AgroRegionViewModel> blocks)
        {
            HttpResponseMessage message;

            if (ModelState.IsValid)
            {
                foreach (var block in blocks)
                {
                    AgroRegion region = new AgroRegion
                    {
                        Name = block.Name,
                        Description = block.Description,
                        Points = block.Points.Select(p => new AgroPoint
                        {
                            Index = p.Index,
                            Latitude = p.Latitude,
                            Longitude = p.Longitude

                        }).ToList()
                    };

                    Db.Regions.Add(region);
                }

                try
                {
                    Db.SaveChanges();
                }
                catch (Exception ex)
                {
                    message = Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "'Save changes' error.");
                }

                message = Request.CreateResponse(HttpStatusCode.NoContent);
            }
            else
            {
                // TODO: replace message content.
                message = Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "invalid model state");
            }

            return message;
        }

        [HttpDelete]
        public HttpResponseMessage Delete(IEnumerable<AgroRegionViewModel> blocks) {
            HttpResponseMessage message;

            if (ModelState.IsValid)
            {
                foreach (var block in blocks)
                {
                    Db.Regions.Delete(block.Id);
                }

                try
                {
                    Db.SaveChanges();
                }
                catch (Exception)
                {
                    message = Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "'Save changes' error.");
                }

                message = Request.CreateResponse(HttpStatusCode.NoContent);
            }
            else
            {
                // TODO: replace message content.
                message = Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "invalid model state");
            }

            return message;
        }

        [HttpPut]
        public HttpResponseMessage Modify(IEnumerable<AgroRegionViewModel> blocks) 
        {
            HttpResponseMessage message;

            if (ModelState.IsValid)
            {                
                foreach (var block in blocks)
                {
                    var region = Db.Regions.GetById(block.Id);
                    if (region != null)
                    {
                        region.Description = block.Description;
                        region.Name = block.Name;

                        // Delete all region points.
                        var regionPoints = region.Points.ToList();                        

                        for (int i = 0; i < regionPoints.Count; i++)
                        {
                            Db.Points.Delete(regionPoints[i]);
                        }

                        region.Points = block.Points.Select(p => new AgroPoint
                        {
                            Index = p.Index,
                            Id = p.Id,
                            Latitude = p.Latitude,
                            Longitude = p.Longitude
                        }).ToList();

                        Db.Regions.Update(region);
                    }
                }

                try
                {
                    Db.SaveChanges();
                }
                catch (Exception)
                {
                    message = Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "'Save changes' error.");
                }

                message = Request.CreateResponse(HttpStatusCode.NoContent);
            }
            else
            {
                // TODO: replace message content.
                message = Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "invalid model state");
            }

            return message;

        }
    }
}
