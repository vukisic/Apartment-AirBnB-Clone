using AirBnB.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AirBnB.Data
{
    public enum RegistrationResult
    {
        NONE,
        HOST,
        GUEST
    }

    public enum LogInResult
    {
        NONE,
        HOST,
        GUEST,
        ADMIN
    }

    public interface IAuthRepository
    {
        Task<RegistrationResult> Register(User user, string password);
        Task<LogInResult> LogIn(string username, string password);
        Task<bool> UserExist(string username);
        Task<Admin> GetAdmin(string username);
        Task<Host> GetHost(string username);
        Task<Guest> GetGuest(string username);
    }
}
