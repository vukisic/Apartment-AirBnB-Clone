using AirBnB.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AirBnB.Dtos
{
    public class ApartmentToAddDto
    {
        public string Name { get; set; }
        public string Type { get; set; }
        public ICollection<Photo> Photos { get; set; }
        public int Rooms { get; set; }
        public int Guests { get; set; }
        public string Dates { get; set; }
        public DateTime TimeIn { get; set; }
        public DateTime TimeOut { get; set; }
        public double Price { get; set; }
        public ICollection<AmenitieDto> Amenities { get; set; }
        public string HostUsername { get; set; }
        public string Country { get; set; }
        public string City { get; set; }
        public string Street { get; set; }
        public string Number { get; set; }
        public string PostCode { get; set; }
        public double Lon { get; set; }
        public double Lat { get; set; }
    }
}
