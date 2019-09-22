using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AirBnB.Dtos
{
    public class UserToReturnDto
    {
        public int Id { get; set; }

        public string Username { get; set; }

        public string Gender { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string Role { get; set; }

        public bool IsBlocked { get; set; }
    }
}
