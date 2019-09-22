using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AirBnB.Data;
using AirBnB.Dtos;
using AirBnB.Models;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace AirBnB.Controllers
{
    [Route("api/[controller]")]
    public class AuthController : Controller
    {
        private readonly IAuthRepository repo;
        private readonly IConfiguration config;
        private readonly IMapper mapper;

        public AuthController(IAuthRepository repo, IConfiguration config, IMapper mapper)
        {
            this.repo = repo;
            this.config = config;
            this.mapper = mapper;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody]UserForRegistrationDto userDto)
        {
            if (!String.IsNullOrEmpty(userDto.Username))
                userDto.Username = userDto.Username.ToLower();
            if (await repo.UserExist(userDto.Username))
                ModelState.AddModelError("Username", "Username Already Exist");

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = mapper.Map<User>(userDto);

            var createdUser = await repo.Register(user, userDto.Password);

            return Ok();
        }

        [HttpPost("login")]
        public async Task<IActionResult> LogIn([FromBody]UserForLogInDto userDto)
        {
            var result = await repo.LogIn(userDto.Username.ToLower(), userDto.Password);
            if (result == LogInResult.NONE)
                return Unauthorized();

            var tokenHandler = new JwtSecurityTokenHandler();
            string tokenString = "";
            if (result == LogInResult.ADMIN)
            {
                var admin = await repo.GetAdmin(userDto.Username.ToLower());
                var token = MakeToken(admin.Id, admin.Username, admin.Role);
                tokenString = tokenHandler.WriteToken(token);
                var user = mapper.Map<UserToReturnDto>(admin);
                return Ok(new { tokenString, user });
            }
            else if(result == LogInResult.HOST)
            {
                var host = await repo.GetHost(userDto.Username.ToLower());
                var token = MakeToken(host.Id, host.Username, host.Role);
                tokenString = tokenHandler.WriteToken(token);
                var user = mapper.Map<UserToReturnDto>(host);
                return Ok(new { tokenString, user });
            }
            else
            {
                var guest = await repo.GetGuest(userDto.Username.ToLower());
                var token = MakeToken(guest.Id, guest.Username, guest.Role);
                tokenString = tokenHandler.WriteToken(token);
                var user = mapper.Map<UserToReturnDto>(guest);
                return Ok(new { tokenString, user });
            }
        }

        private SecurityToken MakeToken(int id, string username, string role)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(config.GetSection("AppSettings:Token").Value);
            var tokenDescriptor = new SecurityTokenDescriptor()
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.NameIdentifier,id.ToString()),
                    new Claim(ClaimTypes.Name,username),
                    new Claim(ClaimTypes.Role,role)
                }),
                Expires = DateTime.Now.AddDays(1),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha512Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return token;
        }
    }
}