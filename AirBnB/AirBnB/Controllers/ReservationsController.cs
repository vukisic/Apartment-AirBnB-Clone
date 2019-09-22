using System;
using System.Collections.Generic;
using System.Linq;
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
    [Authorize]
    [Route("api/[controller]")]
    public class ReservationsController : Controller
    {
        private readonly IReservationsRepository repo;
        private readonly IConfiguration config;
        private readonly IMapper mapper;

        public ReservationsController(IReservationsRepository repo, IConfiguration config, IMapper mapper)
        {
            this.repo = repo;
            this.config = config;
            this.mapper = mapper;
        }

        [HttpGet("all/{role}/{username}")]
        public async Task<IActionResult> GetAll(string role, string username)
        {
            var result = await repo.GetAll(username, role);
            if (result != null)
                return Ok(result);
            return BadRequest();
        }

        [HttpPost("add")]
        [Authorize(Roles = Role.Guest)]
        public async Task<IActionResult> Add([FromBody] ReservationToCreateDto dto)
        {
            var result = await repo.AddReservation(dto);
            if (result)
                return Ok();
            return BadRequest();
        }

        [Authorize(Roles = Role.Host)]
        [HttpPut("accept/{id}")]
        public async Task<IActionResult> Accept(int id)
        {
            var result = await repo.Accept(id);
            if (result)
                return Ok();
            return BadRequest();
        }

        [Authorize(Roles = Role.Guest)]
        [HttpPut("quit/{id}")]
        public async Task<IActionResult> Quit(int id)
        {
            var result = await repo.Quit(id);
            if (result)
                return Ok();
            return BadRequest();
        }

        [Authorize(Roles = Role.Host)]
        [HttpPut("denie/{id}")]
        public async Task<IActionResult> Denie(int id)
        {
            var result = await repo.Denie(id);
            if (result)
                return Ok();
            return BadRequest();
        }

        [Authorize(Roles = Role.Host)]
        [HttpPut("finish/{id}")]
        public async Task<IActionResult> Finish(int id)
        {
            var result = await repo.Finish(id);
            if (result)
                return Ok();
            return BadRequest();
        }


    }
}