using AirBnB.Dtos;
using AirBnB.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AirBnB.Data
{
    public interface IUserRepository
    {
        Task<List<UserToReturnDto>> GetAllUsers(string currentUserUsername);
        Task<bool> BlockUser(string username);
        Task<bool> UnBlockUser(string username);
        Task<bool> UpdateUser(UserToUpdateDto userToUpdateDto);
        Task<UserToReturnDto> GetUser(string username);
    }
}
