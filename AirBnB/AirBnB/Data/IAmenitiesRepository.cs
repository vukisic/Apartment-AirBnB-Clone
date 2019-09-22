using AirBnB.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AirBnB.Data
{
    public interface IAmenitiesRepository
    {
        Task<bool> Add(string name);
        Task<bool> Remove(string name);
        Task<List<AmenitieDto>> GetAll();
    }
}
