using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Threading.Tasks;

namespace AirBnB.Models
{
    public class Apartment
    {
        public int Id { get; set; }

        public string Name { get; set; }
        public bool IsDeleted { get; set; }
        public string Type { get; set; }
        public string Status { get; set; }
        public ICollection<Comment> Comments { get; set; }
        public ICollection<Photo> Photos { get; set; }
        public int Rooms { get; set; }
        public int Guests { get; set; }
        public string Dates { get; set; }
        public DateTime TimeIn { get; set; }
        public DateTime TimeOut { get; set; }
        public double Price { get; set; }
        public ICollection<Amenitie> Amenities { get; set; }
        public Host Host { get; set; }
        public int HostId { get; set; }
        public string Country { get; set; }
        public string City { get; set; }
        public string Street { get; set; }
        public string Number { get; set; }
        public string PostCode { get; set; }
        public double Lon { get; set; }
        public double Lat { get; set; }

        public Apartment()
        {
            Comments = new Collection<Comment>();
            Photos = new Collection<Photo>();
            Amenities = new Collection<Amenitie>();
        }
    }
}
