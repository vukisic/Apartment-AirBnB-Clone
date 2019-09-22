using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AirBnB.Dtos
{
    public class ReservationToReturnDto
    {
        public int Id { get; set; }
        public string Guest { get; set; }
        public string Apartment { get; set; }
        public string Host { get; set; }
        public string Date { get; set; }
        public int Number { get; set; }
        public double TotalPrice { get; set; }
        public string Status { get; set; }

    }
}
