using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Threading.Tasks;

namespace AirBnB.Models
{
    public class Guest : User
    {
        public ICollection<Reservation> Reservations { get; set; }

        public Guest()
        {
            this.Role = AirBnB.Models.Role.Guest;
            this.Reservations = new Collection<Reservation>();
        }
    }
}
