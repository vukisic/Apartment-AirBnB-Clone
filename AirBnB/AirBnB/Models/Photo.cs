using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AirBnB.Models
{
    public class Photo
    {
        public int Id { get; set; }

        public string Url { get; set; }

        public string PublicId { get; set; }

        public Apartment Apartment { get; set; }

        public int ApartmentId { get; set; }
    }
}
