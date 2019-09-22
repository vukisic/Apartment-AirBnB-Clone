using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AirBnB.Dtos
{
    public class UserToUpdateDto
    {
        public string Username { get; set; }

        public string Password { get; set; }

        public string Gender { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }
    }
}
