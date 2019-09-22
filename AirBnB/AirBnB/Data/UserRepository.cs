using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AirBnB.Dtos;
using AirBnB.Models;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace AirBnB.Data
{
    public class UserRepository : IUserRepository
    {
        private readonly DataContext context;
        private readonly IMapper mapper;

        public UserRepository(DataContext context, IMapper mapper)
        {
            this.context = context;
            this.mapper = mapper;
        }
        public async Task<bool> BlockUser(string username)
        {
            Tuple<bool, string> result = await Exist(username);
            if (result.Item1)
            {
                if (result.Item2 == "Admin")
                {
                    var user = await context.Admins.FirstAsync(x => x.Username == username);
                    user.IsBlocked = true;
                    await context.SaveChangesAsync();
                    return true;
                }
                else if(result.Item2 == "Host")
                {
                    var user = await context.Hosts.FirstAsync(x => x.Username == username);
                    user.IsBlocked = true;
                    await context.SaveChangesAsync();
                    return true;
                }
                else
                {
                    var user = await context.Guests.FirstAsync(x => x.Username == username);
                    user.IsBlocked = true;
                    await context.SaveChangesAsync();
                    return true;
                }
            }
            return false;
        }

        private async Task<Tuple<bool, string>> Exist(string username)
        {
            var admin = await context.Admins.FirstOrDefaultAsync(x => x.Username == username);
            if(admin != null)
            {
                return new Tuple<bool, string>(true, "Admin");
            }
            var host =  await context.Hosts.FirstOrDefaultAsync(x => x.Username == username);
            if (host != null)
            {
                return new Tuple<bool, string>(true, "Host");
            }
            var guest = await context.Guests.FirstOrDefaultAsync(x => x.Username == username);
            if (guest != null)
            {
                return new Tuple<bool, string>(true, "Guest");
            }

            return new Tuple<bool, string>(false, null);
        }

        public async Task<List<UserToReturnDto>> GetAllUsers(string currentUserUsername)
        {
            List<UserToReturnDto> users = new List<UserToReturnDto>();

            var admins = mapper.Map<List<UserToReturnDto>>( await context.Admins.Where(x => x.Username != currentUserUsername).ToListAsync());
            var hosts = mapper.Map<List<UserToReturnDto>>(  await context.Hosts.Where(x => x.Username != currentUserUsername).ToListAsync());
            var guests = mapper.Map<List<UserToReturnDto>>( await context.Guests.Where(x => x.Username != currentUserUsername).ToListAsync());

            users.AddRange(admins);
            users.AddRange(hosts);
            users.AddRange(guests);

            return users;
        }

        public async Task<bool> UnBlockUser(string username)
        {
            Tuple<bool, string> result = await Exist(username);
            if (result.Item1)
            {
                if (result.Item2 == "Admin")
                {
                    var user = await context.Admins.FirstAsync(x => x.Username == username);
                    user.IsBlocked = false;
                    await context.SaveChangesAsync();
                    return true;
                }
                else if (result.Item2 == "Host")
                {
                    var user = await context.Hosts.FirstAsync(x => x.Username == username);
                    user.IsBlocked = false;
                    await context.SaveChangesAsync();
                    return true;
                }
                else
                {
                    var user = await context.Guests.FirstAsync(x => x.Username == username);
                    user.IsBlocked = false;
                    await context.SaveChangesAsync();
                    return true;
                }
            }
            return false;
        }

        public async Task<bool> UpdateUser(UserToUpdateDto userToUpdateDto)
        {
            Tuple<bool, string> result = await Exist(userToUpdateDto.Username);
            if (result.Item1)
            {
                if (result.Item2 == "Admin")
                {
                    var user = await context.Admins.FirstAsync(x => x.Username == userToUpdateDto.Username);
                    byte[] passwordHash, passwordSalt;
                    user.FirstName = userToUpdateDto.FirstName;
                    user.LastName = userToUpdateDto.LastName;
                    if (!String.IsNullOrEmpty(userToUpdateDto.Password))
                    {
                        CreatePasswordHash(userToUpdateDto.Password, out passwordHash, out passwordSalt);
                        user.PasswordHash = passwordHash;
                        user.PasswordSalt = passwordSalt;
                    }
                    user.Gender = user.Gender == "female" ? Gender.Female : Gender.Male;
                    await context.SaveChangesAsync();
                    return true;
                }
                else if (result.Item2 == "Host")
                {
                    var user = await context.Hosts.FirstOrDefaultAsync(x => x.Username == userToUpdateDto.Username);
                    byte[] passwordHash, passwordSalt;
                    user.FirstName = userToUpdateDto.FirstName;
                    user.LastName = userToUpdateDto.LastName;
                    if (!String.IsNullOrEmpty(userToUpdateDto.Password))
                    {
                        CreatePasswordHash(userToUpdateDto.Password, out passwordHash, out passwordSalt);
                        user.PasswordHash = passwordHash;
                        user.PasswordSalt = passwordSalt;
                    }
                    user.Gender = user.Gender == "female" ? Gender.Female : Gender.Male;
                    await context.SaveChangesAsync();
                    return true;
                }
                else
                {
                    var user = await context.Guests.FirstOrDefaultAsync(x => x.Username == userToUpdateDto.Username);
                    byte[] passwordHash, passwordSalt;
                    user.FirstName = userToUpdateDto.FirstName;
                    user.LastName = userToUpdateDto.LastName;
                    if (!String.IsNullOrEmpty(userToUpdateDto.Password))
                    {
                        CreatePasswordHash(userToUpdateDto.Password, out passwordHash, out passwordSalt);
                        user.PasswordHash = passwordHash;
                        user.PasswordSalt = passwordSalt;
                    }
                    user.Gender = userToUpdateDto.Gender == "female" ? Gender.Female : Gender.Male;
                    await context.SaveChangesAsync();
                    return true;
                }
            }

            return false;
        }

        public async Task<UserToReturnDto> GetUser(string username)
        {
            Tuple<bool, string> result = await Exist(username);
            if (result.Item1)
            {
                if (result.Item2 == "Admin")
                {
                    var user = await context.Admins.FirstOrDefaultAsync(x => x.Username == username);
                    if(user != null)
                    {
                        var userToReturn = mapper.Map<UserToReturnDto>(user);
                        return userToReturn;
                    }
                    return null;
                }
                else if (result.Item2 == "Host")
                {
                    var user = await context.Hosts.FirstOrDefaultAsync(x => x.Username == username);
                    if (user != null)
                    {
                        var userToReturn = mapper.Map<UserToReturnDto>(user);
                        return userToReturn;
                    }
                    return null;
                }
                else
                {
                    var user = await context.Guests.FirstOrDefaultAsync(x => x.Username == username);
                    if (user != null)
                    {
                        var userToReturn = mapper.Map<UserToReturnDto>(user);
                        return userToReturn;
                    }
                    return null;
                }
            }

            return null;
        }

        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }
    }
}
