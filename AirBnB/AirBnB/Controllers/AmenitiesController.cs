using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AirBnB.Data;
using AirBnB.Dtos;
using AirBnB.Models;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace AirBnB.Controllers
{
    [Route("api/[controller]")]
    public class AmenitiesController : Controller
    {
        private readonly IAmenitiesRepository repo;
        private readonly IConfiguration config;
        private readonly IMapper mapper;

        public AmenitiesController(IAmenitiesRepository repo, IConfiguration config, IMapper mapper)
        {
            this.repo = repo;
            this.config = config;
            this.mapper = mapper;
        }

        [HttpGet("all/{username}")]
        public async Task<IActionResult> GetAll(string username)
        {
            if (username != User.FindFirst(ClaimTypes.Name).Value)
                return Unauthorized();
            var items = await repo.GetAll();
            return Ok(items);
        }

        [Authorize(Roles = Role.Admin)]
        [HttpPost("add/{username}")]
        public async Task<IActionResult> Add(string username, [FromBody]AmenitieDto dto)
        {
            if (username != User.FindFirst(ClaimTypes.Name).Value)
                return Unauthorized();
            var result = await repo.Add(dto.Name);
            if (result)
                return Ok();
            return BadRequest();
        }

        [Authorize(Roles = Role.Admin)]
        [HttpPost("remove/{username}")]
        public async Task<IActionResult> Remove(string username, [FromBody]AmenitieDto dto)
        {
            if (username != User.FindFirst(ClaimTypes.Name).Value)
                return Unauthorized();
            var result = await repo.Remove(dto.Name);
            if (result)
                return Ok();
            return BadRequest();
        }

    }
}