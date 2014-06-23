using AgroSmart.Models;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Migrations;
using System.Linq;

namespace AgroSmart.Data.Migrations
{
    public sealed class Configuration : DbMigrationsConfiguration<AgroSmart.Data.AgroSmartContext>
    {
        public Configuration()
        {
            this.AutomaticMigrationsEnabled = true;
//#if DEBUG
            this.AutomaticMigrationDataLossAllowed = true;
//#endif
        }

        protected override void Seed(AgroSmart.Data.AgroSmartContext context)
        {
            //  This method will be called after migrating to the latest version.

            //  You can use the DbSet<T>.AddOrUpdate() helper extension method 
            //  to avoid creating duplicate seed data. E.g.
            //
            //    context.People.AddOrUpdate(
            //      p => p.FullName,
            //      new Person { FullName = "Andrew Peters" },
            //      new Person { FullName = "Brice Lambson" },
            //      new Person { FullName = "Rowan Miller" }
            //    );
            //

            this.CreateAdminRoleAndUser(context);
         //   this.CreateUnits(context);
            //this.CreateRegions(context);

            base.Seed(context);
        }

        private void CreateAdminRoleAndUser(AgroSmart.Data.AgroSmartContext context)
        {
            var UserManager = new UserManager<AgroUser>(new UserStore<AgroUser>(context));

            var RoleManager = new RoleManager<IdentityRole>(new
                                      RoleStore<IdentityRole>(context));

            string name = "AgroAdmin";
            string adminRole = "Admin";
            string password = "123456";


            //Create Role Admin if it does not exist
            if (!RoleManager.RoleExists(name))
            {
                var roleresult = RoleManager.Create(new IdentityRole(name));
            }

            //Create User=Admin with password=123456
            var user = new AgroUser();
            user.UserName = name;
            var adminresult = UserManager.Create(user, password);

            //Add User Admin to Role Admin
            if (adminresult.Succeeded)
            {
                var result = UserManager.AddToRole(user.Id, adminRole);
            }
        }

        private void CreateUnits(AgroSmart.Data.AgroSmartContext context)
        {
            context.Units.AddOrUpdate(
                unit => unit.Name,
                new AgroUnit { Name = "Тр1"},
                new AgroUnit { Name = "Трактор 2" },
                new AgroUnit { Name = "Трактор 3" }
            );            
        }

        private void CreateRegions(AgroSmart.Data.AgroSmartContext context)
        {
            context.Regions.AddOrUpdate(
                task => task.Name,
                new AgroRegion
                {
                    Name = "Блок 1",
                    Description = "в границите на землището на село Опан с размер 43 дк",
                    Points = 
                        {
                            new AgroPoint{ Id = 1, Index = 0, Latitude=42.261049162113856, Longitude = 24.7357177734375}, 
                            new AgroPoint {Id = 2,Index = 1, Latitude = 42.48627657532141, Longitude = 25.2520751953125}, 
                            new AgroPoint {Id = 3,Index = 2, Latitude = 42.5995982130586, Longitude = 24.521484375}, 
                            new AgroPoint {Id = 4,Index = 3, Latitude = 42.51665075361142, Longitude = 24.1314697265625}
                        }
                },
                new AgroRegion
                {
                    Name = "Блок 2",
                    Description = "в границите на землището на село Опан с размер 33 дк",
                    Points =
                        {
                            new AgroPoint{Id = 5,Index = 0,Latitude = 42.032974332441356, Longitude = 26.46881103515625},
                            new AgroPoint {Id = 6,Index = 1, Latitude = 42.413318349422475, Longitude = 26.56494140625},
                            new AgroPoint {Id = 7,Index = 2, Latitude = 42.60768474453004, Longitude = 25.828857421875},
                            new AgroPoint {Id = 8,Index = 3,Latitude = 42.43359304732316, Longitude = 25.8013916015625},
                            new AgroPoint {Id = 9,Index = 4, Latitude = 42.11248648904184, Longitude  = 25.90576171875}
                        }
                },
                new AgroRegion { Name = "Блок 3", Description = "в границите на землището на село Средец с размер 58 дк" },
                new AgroRegion { Name = "Блок 4", Description = "в границите на землището на село Средец с размер 22 дк" },
                new AgroRegion { Name = "Блок 5", Description = "в границите на землището на село Средец с размер 68 дк" },
                new AgroRegion { Name = "Блок 6", Description = "в границите на землището на село Опан с размер 13 дк" },
                new AgroRegion { Name = "Блок 7", Description = "в границите на землището на село Опан с размер 62 дк" },
                new AgroRegion { Name = "Блок 8", Description = "в границите на землището на село Опан с размер 48 дк" }
            );
        }
    }
}
