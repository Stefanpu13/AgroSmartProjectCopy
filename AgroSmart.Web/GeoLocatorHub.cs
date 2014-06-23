using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using AgroSmart.Data;
using AgroSmart.Models;

namespace AgroSmart.Web.SignalR
{
    public class GeoLocatorHub : Hub
    {
        public void Send(int unitId, double latitude, double longitude)
        {
            var uow = new UnitOfWorkAgroSmart();
            var prevLocation = uow.Units.GetById(unitId).Locations.SingleOrDefault(x => x.EndTime == null);

            if (prevLocation != null)
            {
                var dX = Math.Pow((latitude - prevLocation.Latitude), 2);
                var dY = Math.Pow((longitude - prevLocation.Longitude), 2);
                var distance = Math.Sqrt(dX + dY);

                //if (distance < 0.001)
                //{
                //    return;
                //}

                prevLocation.EndTime = DateTime.Now;
            }

            var newLocation = new AgroUnitLocation
            {
                Latitude = latitude,
                Longitude = longitude,
                StartTime = DateTime.Now,
                UnitId = unitId
            };

            uow.Locations.Add(newLocation);
            uow.SaveChanges();

            Clients.All.sendNewCoords(unitId, latitude, longitude);
        }
    }
}