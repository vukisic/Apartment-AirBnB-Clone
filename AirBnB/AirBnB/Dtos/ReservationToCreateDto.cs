using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AirBnB.Dtos
{
    public class ReservationToCreateDto
    {
        public string Apartment { get; set; }
        public string Guest { get; set; }
        public string StartDate { get; set; }
        public int Days { get; set; }
    }
}
