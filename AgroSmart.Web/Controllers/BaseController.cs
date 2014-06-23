using AgroSmart.Contracts.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace AgroSmart.Web.Controllers
{
    public class BaseController : ApiController
    {
        private IUnitOfWorkAgroSmart db;

        protected IUnitOfWorkAgroSmart Db
        {
            get { return db; }
            set { db = value; }
        }

        public BaseController(IUnitOfWorkAgroSmart db)
        {
            this.db = db;
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing && db != null)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}
