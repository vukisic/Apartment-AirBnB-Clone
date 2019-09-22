using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Threading.Tasks;
using AirBnB.Dtos;
using AirBnB.Helpers;
using AirBnB.Models;
using AutoMapper;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace AirBnB.Data
{
    public class ApartmentRepository : IApartmentRepository
    {
        private readonly DataContext context;
        private readonly IMapper mapper;
        private Cloudinary cloudinary;
        private readonly IOptions<CloudinarySettings> cloudinarySettings;

        public ApartmentRepository(DataContext context, IMapper mapper, IOptions<CloudinarySettings> cloudinarySettings)
        {
            this.context = context;
            this.mapper = mapper;
            this.cloudinarySettings = cloudinarySettings;
            Account acc = new Account(
                cloudinarySettings.Value.CloudName,
                cloudinarySettings.Value.ApiKey,
                cloudinarySettings.Value.ApiSecret);
            cloudinary = new Cloudinary(acc);
        }

        public async Task<bool> Add(ApartmentToAddDto dto)
        {
            var result = await Exist(dto.Name);
            if(!result)
            {
                Apartment apm = new Apartment()
                {
                    City = dto.City,
                    Country = dto.Country,
                    Guests = dto.Guests,
                    IsDeleted = false,
                    Lat = dto.Lat,
                    Lon = dto.Lon,
                    Name = dto.Name,
                    Number = dto.Number,
                    PostCode = dto.PostCode,
                    Price = dto.Price,
                    Rooms = dto.Rooms,
                    Status = ApartmentStatus.InActive,
                    Street = dto.Street,
                    TimeIn = dto.TimeIn,
                    TimeOut = dto.TimeOut,
                    Type = dto.Type
                };

                apm.Host = await context.Hosts.SingleAsync(x => x.Username == dto.HostUsername);
                apm.HostId = apm.Host.Id;
                apm.Comments = new Collection<Comment>();
                apm.Amenities = new List<Amenitie>();
                foreach (var item in dto.Amenities)
                {
                    var res = context.Amenities.FirstOrDefault(x => x.Name == item.Name);
                    if(res !=null)
                        apm.Amenities.Add(new Amenitie() {Name = res.Name });
                }

                apm.Photos = dto.Photos.ToList();
                apm.Dates = ParseDates(dto.Dates);

                context.Apartments.Add(apm);
                await context.SaveChangesAsync();
                return true;
            }
            return false;
        }

        public async Task<bool> ChangeStatus(string name)
        {
            if(await Exist(name))
            {
                var apartment = await context.Apartments.FirstAsync(x => x.Name == name);
                if (apartment.Status == ApartmentStatus.Active)
                    apartment.Status = ApartmentStatus.InActive;
                else
                    apartment.Status = ApartmentStatus.Active;

                await context.SaveChangesAsync();
                return true;
            }
            return false;
        }

        public async Task<bool> Exist(string name)
        {
            var apartment = await context.Apartments.SingleOrDefaultAsync(x => x.Name == name);
            if(apartment == null)
            {
                return false;
            }
            else
            {
                if (apartment.IsDeleted)
                    return false;
                return true;
            }
        }

        public async Task<List<ApartmentToReturnDto>> GetAll()
        {
            var apartments = await context.Apartments
                .Include(x => x.Host)
                .Include(x => x.Photos)
                .Where(x => x.IsDeleted == false).ToListAsync();
            var apartmentsDto = mapper.Map<List<ApartmentToReturnDto>>(apartments);
            return apartmentsDto;
        }

        public async Task<ApartmentDetailDto> GetSpecific(string name)
        {
            if(await Exist(name))
            {
                var apartment = await context.Apartments
                .Include(x => x.Host)
                .Include(x => x.Photos)
                .Include(x=>x.Amenities)
                .Include(x=>x.Comments)
                .Where(x => x.IsDeleted == false)
                .SingleAsync(x => x.Name == name);
                apartment.Amenities = apartment.Amenities.Where(x => x.IsDeleted == false).ToList();
                foreach (var item in apartment.Comments)
                {
                    item.Guest = context.Guests.First(x => x.Id == item.GuestId);
                }
                var apartmentDto = mapper.Map<ApartmentDetailDto>(apartment);
                return apartmentDto;
            }
            return null;
            
        }

        public async Task<bool> RemoveApartment(string name)
        {
            if (await Exist(name))
            {
                var apartment = await context.Apartments.FirstAsync(x => x.Name == name);
                apartment.IsDeleted = true;
                await context.SaveChangesAsync();
                return true;
            }
            return false;
        }

        public async Task<bool> UpdateApartment(ApartmentForUpdateDto dto)
        {
            var result = await Exist(dto.Name);
            if (result)
            {
                var apm = await context.Apartments.SingleAsync(x => x.Name == dto.Name);
                if (dto.DatesUpdate)
                    apm.Dates = ParseDates(dto.Dates);
                else
                    apm.Dates = apm.Dates;
                apm.Guests = dto.Guests;
                apm.Price = dto.Price;
                apm.Rooms = dto.Rooms;
                apm.TimeIn = dto.TimeIn;
                apm.TimeOut = dto.TimeOut;
                apm.Type = dto.Type;
                string query = "DELETE FROM Amenities WHERE ApartmentId = {0}";
                context.Database.ExecuteSqlCommand(query, apm.Id);
                await context.SaveChangesAsync();
                apm.Amenities = new List<Amenitie>();

                foreach (var item in dto.Amenities)
                {
                    apm.Amenities.Add(new Amenitie() { Name = item.Name });
                }

                await context.SaveChangesAsync();

                return true;
            }
            return false;
        }

        private string ParseDates(string dates)
        {
            string result = "";
            var arr = dates.Split('-');
            var arrStart = arr[0].Split('/');
            var arrEnd = arr[1].Split('/');
            var dateStart = new DateTime(Int32.Parse(arrStart[2]), Int32.Parse(arrStart[1]), Int32.Parse(arrStart[0]));
            var dateEnd = new DateTime(Int32.Parse(arrEnd[2]), Int32.Parse(arrEnd[1]), Int32.Parse(arrEnd[0]));
            result += dateStart.ToString("dd/MM/yyyy") + ";";
            while(dateStart != dateEnd)
            {
                dateStart = dateStart.AddDays(1);
                result += $"{dateStart.Day}/{dateStart.Month}/{dateStart.Year};";
            }
            return result;
        }

        public async Task<List<ApartmentToReturnDto>> Search(SearchDto dto)
        {
            var all = await context.Apartments
               .Include(x => x.Host)
               .Include(x => x.Photos)
               .Where(x => x.IsDeleted == false).ToListAsync();
            if (dto.Dates != null)
                all = CheckForDates(ParseDates(dto.Dates),all);
            if (dto.City != null)
                all = all.Where(x => x.City == dto.City).ToList();
            if (dto.Country != null)
                all = all.Where(x => x.Country == dto.Country).ToList();
            if (dto.Guest != 0 && dto.Guest != 10)
                all = all.Where(x => x.Guests <= dto.Guest).ToList();
            if (dto.Room != 0 && dto.Room != 10)
                all = all.Where(x => x.Rooms <= dto.Room).ToList();
            if(dto.MinPrice != dto.MaxPrice)
            {
                if(dto.MinPrice==0 && dto.MinPrice != 100)
                    all = all.Where(x => x.Price >= dto.MinPrice && x.Price <= dto.MaxPrice).ToList();
                if (dto.MinPrice != 0 && dto.MaxPrice != 100)
                    all = all.Where(x => x.Price >= dto.MinPrice && x.Price <= dto.MaxPrice).ToList();
            }

            var apartmentsDto = mapper.Map<List<ApartmentToReturnDto>>(all);
            return apartmentsDto;

        }

        private List<Apartment> CheckForDates(string dates,List<Apartment> all)
        {
            all = all.Where(x => x.Dates.IndexOf(dates) >= 0).ToList();
            return all;
        }

        public async Task<bool> AddComment(CommentDto dto)
        {
            var apm = await context.Apartments.Include(x=>x.Comments).FirstOrDefaultAsync(x => x.Name == dto.ApartmentName);
            var guest = await context.Guests.FirstOrDefaultAsync(x => x.Username == dto.GuestUsername);
            /* Add logic for reservations */
            if (apm != null && guest != null)
            {
                Comment comment = new Comment()
                {
                    Apartment = apm,
                    ApartmentId = apm.Id,
                    Guest = guest,
                    GuestId = guest.Id,
                    Text = dto.Text,
                    Rating = dto.Rating,
                    Status = CommentStatus.Denied
                };
                apm.Comments.Add(comment);
                await context.SaveChangesAsync();
                return true;
            }
            return false;
        }

        public async Task<bool> ChangeCommentStatus(string name, int id)
        {
            if(await Exist(name))
            {
                var apm = await context.Apartments.Include(x => x.Comments).FirstAsync(x => x.Name == name);
                var comment = apm.Comments.FirstOrDefault(x => x.Id == id);
                if(comment != null)
                {
                    comment.Status = comment.Status == CommentStatus.Accepted ? CommentStatus.Denied : CommentStatus.Accepted;
                    await context.SaveChangesAsync();
                    return true;
                }
                return false;
            }
            return false;
        }
    }
}
