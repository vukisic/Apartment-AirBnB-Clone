using AirBnB.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AirBnB.Data
{
    public enum SearchResult
    {
        NONE,
        ADMIN,
        HOST,
        GUEST
    }
    public class AuthRepository : IAuthRepository
    {
        private readonly DataContext context;

        public AuthRepository(DataContext context)
        {
            this.context = context;
        }

        public async Task<LogInResult> LogIn(string username, string password)
        {
            if (await UserExist(username))
            {
                SearchResult result = await Search(username);
                if(result == SearchResult.ADMIN)
                {
                    var user = await GetAdmin(username);
                    if (VerifyPasswordHash(password, user.PasswordHash, user.PasswordSalt) && !user.IsBlocked)
                        return LogInResult.ADMIN;
                    return LogInResult.NONE;

                }
                else if(result == SearchResult.HOST)
                {
                    var user = await GetHost(username);
                    if (VerifyPasswordHash(password, user.PasswordHash, user.PasswordSalt) && !user.IsBlocked)
                        return LogInResult.HOST;
                    return LogInResult.NONE;
                }
                else if(result == SearchResult.GUEST)
                {
                    var user = await GetGuest(username);
                    if (VerifyPasswordHash(password, user.PasswordHash, user.PasswordSalt) && !user.IsBlocked)
                        return LogInResult.GUEST;
                    return LogInResult.NONE;
                }

                return LogInResult.NONE;
            }
            else
            {
                return LogInResult.NONE;
            }
        }

        private bool VerifyPasswordHash(string password, byte[] passwordHash, byte[] passwordSalt)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512(passwordSalt))
            {
                var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                for (int i = 0; i < computedHash.Length; ++i)
                {
                    if (computedHash[i] != passwordHash[i])
                        return false;
                }
                return true;
            }
        }

        public async Task<RegistrationResult> Register(User user, string password)
        {
            byte[] passwordHash, passwordSalt;
            CreatePasswordHash(password, out passwordHash, out passwordSalt);
            user.PasswordHash = passwordHash;
            user.PasswordSalt = passwordSalt;
            if(user.Role == Role.Guest)
            {
                Guest guest = new Guest()
                {
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Role = user.Role,
                    Username = user.Username,
                    PasswordHash = user.PasswordHash,
                    PasswordSalt = user.PasswordSalt,
                    Gender = user.Gender,
                    IsBlocked = user.IsBlocked
                };
                await context.Guests.AddAsync(guest);
                await context.SaveChangesAsync();
                return RegistrationResult.GUEST;
            }
            else
            {
                Host host = new Host()
                {
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Role = user.Role,
                    Username = user.Username,
                    PasswordHash = user.PasswordHash,
                    PasswordSalt = user.PasswordSalt,
                    Gender = user.Gender,
                    IsBlocked = user.IsBlocked
                };
                await context.Hosts.AddAsync(host);
                await context.SaveChangesAsync();
                return RegistrationResult.HOST;
            }
        }

        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }

        public async Task<bool> UserExist(string username)
        {
            bool pA = await context.Admins.SingleOrDefaultAsync(x => x.Username == username) != null;
            bool pH = await context.Hosts.SingleOrDefaultAsync(x => x.Username == username) != null;
            bool pG = await context.Guests.SingleOrDefaultAsync(x => x.Username == username) != null;

            if (!pA && !pH && !pG)
                return false;
            return true;
        }

        public async Task<Admin> GetAdmin(string username)
        {
            return await context.Admins.FirstOrDefaultAsync(x => x.Username == username);
        }

        public async Task<Host> GetHost(string username)
        {
            return await context.Hosts.Include(x => x.Apartments).Include(x => x.Reservations).FirstOrDefaultAsync(x => x.Username == username);
        }

        public async Task<Guest> GetGuest(string username)
        {
            return await context.Guests.Include(x => x.Reservations).FirstOrDefaultAsync(x => x.Username == username);
        }

        private async Task<SearchResult> Search(string username)
        {
            var admin = await GetAdmin(username);
            if (admin != null)
                return SearchResult.ADMIN;
            var host = await GetHost(username);
            if (host != null)
                return SearchResult.HOST;
            var guest = await GetGuest(username);
            if (guest != null)
                return SearchResult.GUEST;
            return SearchResult.NONE;
        }
    }
}
