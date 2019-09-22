using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AirBnB.Models
{
    public class Reservation
    {
        public int Id { get; set; }
        public string Status { get; set; }
        public Apartment Apartment { get; set; }
        public int ApartmentId { get; set; }
        public Guest Guest { get; set; }
        public int GuestId { get; set; }
        public DateTime Date { get; set; }
        public int Number { get; set; }
        public double TotalPrice { get; set; }

        public Reservation()
        {
            Status = ReservationStatus.Created;
        }
    }
}
