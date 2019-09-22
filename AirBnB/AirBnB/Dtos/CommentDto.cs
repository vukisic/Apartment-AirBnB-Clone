using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AirBnB.Dtos
{
    public class CommentDto
    {
        public string ApartmentName { get; set; }
        public string GuestUsername { get; set; }
        public string Text { get; set; }
        public int Rating { get; set; }
    }
}
