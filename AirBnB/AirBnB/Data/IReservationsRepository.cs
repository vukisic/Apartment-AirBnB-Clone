using AirBnB.Dtos;
using AirBnB.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AirBnB.Data
{
    public interface IReservationsRepository
    {
        Task<List<ReservationToReturnDto>> GetAll(string username, string role);
        Task<bool> AddReservation(ReservationToCreateDto dto);
        Task<bool> Quit(int id);
        Task<bool> Accept(int id);
        Task<bool> Denie(int id);
        Task<bool> Finish(int id);

    }
}
