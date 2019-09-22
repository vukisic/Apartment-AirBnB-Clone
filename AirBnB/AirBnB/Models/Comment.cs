using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AirBnB.Models
{
    public class Comment
    {
        public int Id { get; set; }
        public Apartment Apartment { get; set; }
        public int ApartmentId { get; set; }
        public string Status { get; set; }
        public Guest Guest { get; set; }
        public int GuestId { get; set; }
        public string Text { get; set; }
        public int Rating { get; set; }

        public Comment()
        {
            this.Status = CommentStatus.Denied;
        }
    }
}
