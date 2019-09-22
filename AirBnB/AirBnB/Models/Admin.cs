using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AirBnB.Models
{
    public class Admin : User
    {
        public Admin()
        {
            this.Role = AirBnB.Models.Role.Admin;
        }
    }
}
