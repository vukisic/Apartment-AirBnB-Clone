using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AirBnB.Dtos
{
    public class PhotoForCreationDto
    {
        public IFormFile File { get; set; }
    }
}
