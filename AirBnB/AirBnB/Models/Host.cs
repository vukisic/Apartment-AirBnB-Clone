using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Threading.Tasks;

namespace AirBnB.Models
{
    public class Host : User
    {
        public ICollection<Apartment> Apartments { get; set; }
        public ICollection<Reservation> Reservations { get; set; }

        public Host()
        {
            this.Reservations = new Collection<Reservation>();
            this.Apartments = new Collection<Apartment>();
        }
    }
}
