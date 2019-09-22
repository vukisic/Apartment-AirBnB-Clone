using AirBnB.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AirBnB.Data
{
    public class Seed
    {
        private readonly DataContext context;

        public Seed(DataContext context)
        {
            this.context = context;
        }

        public void SeedUsers()
        {
            var users = new List<Admin>()
            {
                new Admin(){FirstName="Vuk",LastName="Isic",Gender=Gender.Male,IsBlocked=false,Role=Role.Admin,Username="admin"}
            };

            foreach (var item in users)
            {
                //create the password hash and salt
                byte[] passwordHash, passwordSalt;
                CreatePasswordHash("admin", out passwordHash, out passwordSalt);
                item.PasswordHash = passwordHash;
                item.PasswordSalt = passwordSalt;
                item.Username = item.Username.ToLower();
                context.Admins.Add(item);
            }

            context.SaveChanges();

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
