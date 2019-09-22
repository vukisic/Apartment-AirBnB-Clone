using AirBnB.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AirBnB.Dtos
{
    public class ApartmentToReturnDto
    {
        public string Name { get; set; }
        public string Type { get; set; }
        public string Status { get; set; }
        public ICollection<PhotoForReturnDto> Photos { get; set; }
        public int Rooms { get; set; }
        public int Guests { get; set; }
        public double Price { get; set; }
        public string Country { get; set; }
        public string City { get; set; }
        public string Street { get; set; }
        public string Number { get; set; }
        public string PostCode { get; set; }
        public Host Host { get; set; }

    }
}
