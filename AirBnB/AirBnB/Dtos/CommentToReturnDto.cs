using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AirBnB.Dtos
{
    public class CommentToReturnDto
    {
        public int Id { get; set; }
        public string Guest { get; set; }
        public string Text { get; set; }
        public int Rating { get; set; }
        public string Status { get; set; }
    }
}
