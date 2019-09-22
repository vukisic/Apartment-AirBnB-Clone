using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AirBnB.Data;
using AirBnB.Dtos;
using AirBnB.Helpers;
using AirBnB.Models;
using AutoMapper;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;

namespace AirBnB.Controllers
{
    //[Authorize(Roles = Role.Admin)]
    [Route("api/[controller]")]
    public class ApartmentsController : Controller
    {
        private readonly IApartmentRepository repo;
        private readonly IConfiguration config;
        private readonly IMapper mapper;
        private Cloudinary cloudinary;
        private readonly IOptions<CloudinarySettings> cloudinarySettings;

        public ApartmentsController(IApartmentRepository repo, IConfiguration config, IMapper mapper, IOptions<CloudinarySettings> cloudinarySettings)
        {
            this.repo = repo;
            this.config = config;
            this.mapper = mapper;
            this.cloudinarySettings = cloudinarySettings;
            Account acc = new Account(
                cloudinarySettings.Value.CloudName,
                cloudinarySettings.Value.ApiKey,
                cloudinarySettings.Value.ApiSecret);
            cloudinary = new Cloudinary(acc);
        }

        //Add
        [HttpPost("add")]
        [Authorize(Roles = Role.Host)]
        public async Task<IActionResult> Add([FromBody]ApartmentToAddDto dto)
        {
            var result = await repo.Add(dto);
            if (result)
                return Ok();
            return BadRequest();
        }

        [HttpPost("photos")]
        [Authorize(Roles = Role.Host)]
        public IActionResult AddPhotos(IFormFile photo)
        {
            var file = HttpContext.Request.Form.Files[0];
            var uploadResults = new ImageUploadResult();
            if (file.Length > 0)
            {
                using (var stream = file.OpenReadStream())
                {
                    var uploadParams = new ImageUploadParams()
                    {
                        File = new FileDescription(file.Name, stream),
                        Transformation = new Transformation()
                        .Width(1000)
                        .Height(1000)
                        .Crop("fill")
                        .Gravity("face")
                    };

                    uploadResults = cloudinary.Upload(uploadParams);
                    Photo newPhoto = new Photo();
                    newPhoto.Url = uploadResults.Uri.ToString();
                    newPhoto.PublicId = uploadResults.PublicId;
                    if (newPhoto == null)
                        return BadRequest();
                    return Ok(newPhoto);
                }
            }
            return BadRequest();
        }

        //Update
        [HttpPut("update/{name}")]
        [Authorize(Roles = Role.Host)]
        public async Task<IActionResult> Update([FromBody]ApartmentForUpdateDto dto)
        {
            var result = await repo.UpdateApartment(dto);
            if (result)
                return Ok();
            return BadRequest();
        }

        //Remove
        [HttpPost("remove/{name}")]
        [Authorize(Roles = Role.Host)]
        public async Task<IActionResult> Remove(string name)
        {
            var result = await repo.RemoveApartment(name);
            if (result)
                return Ok();
            return BadRequest();
        }

        //Search
        [HttpPost("search")]
        public async Task<IActionResult> Search([FromBody]SearchDto dto)
        {
            var result = await repo.Search(dto);
            if (result != null)
                return Ok(result);
            return BadRequest();
        }

        //ChgStatus
        [HttpGet("status/{name}")]
        [Authorize(Roles = Role.Host)]
        public async Task<IActionResult> ChangeStatus(string name)
        {
            var result = await repo.ChangeStatus(name);
            if (result)
                return Ok();
            return BadRequest();
        }

        //GetAll
        [HttpGet("all")]
        public async Task<IActionResult> GetAll()
        {
            List<ApartmentToReturnDto> list = new List<ApartmentToReturnDto>();
            var all = await repo.GetAll();
            if(!User.IsInRole("Admin") && !User.IsInRole("Guest") && !User.IsInRole("Host"))
            {
                list = all.Where(x => x.Status == ApartmentStatus.Active).ToList();
            }
            else if (User.FindFirst(ClaimTypes.Role).Value == Role.Admin)
            {
                list = all;
            }
            else if(User.FindFirst(ClaimTypes.Role).Value == Role.Host)
            {
                list = all.Where(x => x.Host.Username == User.FindFirst(ClaimTypes.Name).Value).ToList();
            }
            else if(User.FindFirst(ClaimTypes.Role).Value == Role.Guest)
            {
                list = all.Where(x => x.Status == ApartmentStatus.Active).ToList();
            }
            else
            {
                list = all.Where(x => x.Status == ApartmentStatus.Active).ToList();
            }

            return Ok(list);
        }

        //GetOne
        [HttpGet("single/{name}")]
        public async Task<IActionResult> GetSingle(string name)
        {
            var result = await repo.GetSpecific(name);
            if (result != null)
                return Ok(result);
            return BadRequest("Aartment doesn't exist!");
        }

        [HttpPost("comment/status")]
        [Authorize(Roles = Role.Host)]
        public async Task<IActionResult> ChangeStatus([FromBody] CommentStatusDto dto)
        {
            var result = await repo.ChangeCommentStatus(dto.Name, dto.Id);
            if (result)
                return Ok();
            return BadRequest();
        }

        [HttpPost("comment")]
        [Authorize(Roles = Role.Guest)]
        public async Task<IActionResult> ChangeStatus([FromBody] CommentDto dto)
        {
            var result = await repo.AddComment(dto);
            if (result)
                return Ok();
            return BadRequest();
        }


    }
}