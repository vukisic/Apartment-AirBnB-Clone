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
    [Authorize]
    [Route("api/[controller]")]
    public class UserController : Controller
    {
        private readonly IUserRepository repo;
        private readonly IConfiguration config;
        private readonly IMapper mapper;

        public UserController(IUserRepository repo, IConfiguration config, IMapper mapper)
        {
            this.repo = repo;
            this.config = config;
            this.mapper = mapper;
        }

        [Authorize(Roles = Role.Admin)]
        [HttpGet("{username}")]
        public async Task<IActionResult> GetAllUsers (string username)
        {
            var users = await repo.GetAllUsers(username);
            return Ok(users);
        }

        [Authorize(Roles = Role.Admin)]
        [HttpPost("block/{username}")]
        public async Task<IActionResult> BlockUser(string username)
        {
            var result = await repo.BlockUser(username);
            if (result)
                return Ok();
            return BadRequest();
        }

        [Authorize(Roles = Role.Admin)]
        [HttpPost("unblock/{username}")]
        public async Task<IActionResult> UnBlockUser(string username)
        {
            var result = await repo.UnBlockUser(username);
            if (result)
                return Ok();
            return BadRequest();
        }

        [HttpGet("get/{username}")]
        public async Task<IActionResult> GetUser(string username)
        {
            if (username != User.FindFirst(ClaimTypes.Name).Value)
                return Unauthorized();
            var result = await repo.GetUser(username);
            if (result != null)
                return Ok(result);
            return BadRequest();
        }

        [HttpPut("updateUser")]
        public async Task<IActionResult> UpdateUser([FromBody] UserToUpdateDto dto)
        {
            if (dto.Username != User.FindFirst(ClaimTypes.Name).Value)
                return Unauthorized();
            var result = await repo.UpdateUser(dto);
            if (result)
                return Ok();
            return BadRequest();
        }
    }
}