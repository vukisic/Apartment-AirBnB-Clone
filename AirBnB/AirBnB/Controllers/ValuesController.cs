using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AirBnB.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AirBnB.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ValuesController : ControllerBase
    {
        // GET api/values
        [Authorize(Roles = Role.Admin)]
        [HttpGet]
        public ActionResult<IEnumerable<string>> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/values/5
        [Authorize(Roles = Role.Admin)]
        [HttpGet("{id}")]
        public ActionResult<string> Get(int id)
        {
            return "value";
        }

        // POST api/values
        [Authorize(Roles = Role.Admin)]
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT api/values/5
        [Authorize(Roles = Role.Admin)]
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/values/5
        [Authorize(Roles = Role.Admin)]
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
