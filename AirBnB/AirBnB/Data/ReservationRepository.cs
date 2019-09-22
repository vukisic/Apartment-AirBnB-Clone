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
    public class ReservationRepository : IReservationsRepository
    {
        private readonly DataContext context;
        private readonly IMapper mapper;

        public ReservationRepository(DataContext context, IMapper mapper)
        {
            this.context = context;
            this.mapper = mapper;
        }

        public async Task<bool> Accept(int id)
        {
            var res = await context.Reservations.FirstOrDefaultAsync(x => x.Id == id);
            if(res != null)
            {
                if (res.Status == ReservationStatus.Created)
                {
                    res.Status = ReservationStatus.Accepted;
                    await context.SaveChangesAsync();
                    return true;
                }
                return false;
            }
            return false;
        }

        public async Task<bool> AddReservation(ReservationToCreateDto dto)
        {
            var apm = await context.Apartments.Include(x=> x.Host).FirstOrDefaultAsync(x => x.Name == dto.Apartment);
            var user = await context.Guests.Include(x => x.Reservations).FirstOrDefaultAsync(x => x.Username == dto.Guest);
            if(apm != null && user !=null)
            {
                if(CheckForDates(apm.Dates,dto.StartDate,dto.Days))
                {
                    var newApmDates = RemoveDates(apm.Dates, dto.StartDate, dto.Days);
                    apm.Dates = newApmDates;
                    await context.SaveChangesAsync();
                    var totalPrice = CalaculatePrice(dto.StartDate, dto.Days, apm.Price);
                    var res = new Reservation()
                    {
                        Apartment = apm,
                        ApartmentId = apm.Id,
                        Date = ConvertSingle(dto.StartDate),
                        Guest = user,
                        GuestId = user.Id,
                        Number = dto.Days,
                        Status = ReservationStatus.Created,
                        TotalPrice = totalPrice
                    };

                    user.Reservations.Add(res);
                    await context.SaveChangesAsync();
                    return true;
                }
                return false;
            }
            return false;
        }

        private double CalaculatePrice(string date, int number, double price)
        {
            var startDate = ConvertSingle(date);
            List<DateTime> res = new List<DateTime>();
            for (int i = 0; i < number; ++i)
            {
                var d = startDate.AddDays(i);
                res.Add(d);
            }
            Tuple<bool, int> tuple = SpecialDates.FilterDates(res);
            double total = number * price;
            if (tuple.Item1)
                total -= (total * 0.1);
            total += (total * tuple.Item2 * 0.05);
            return total;

        }

        private string RemoveDates(string apmStrDates, string date, int number)
        {
            List<DateTime> apmDates = ConvertMultiple(apmStrDates);
            var startDate = ConvertSingle(date);
            string ret = "";
            List<DateTime> res = new List<DateTime>();
            List<DateTime> resultArr = new List<DateTime>();
            for (int i = 0; i < number; ++i)
            {
                var d = startDate.AddDays(i);
                res.Add(d);
            }

            foreach (var item in apmDates)
            {
                if (!Exist(res, item))
                    ret += $"{item.Day}/{item.Month}/{item.Year};";
            }
            return ret;
        }

        private bool Exist(List<DateTime> list, DateTime date)
        {
            foreach (var item in list)
            {
                if (item.Day == date.Day && item.Month == date.Month && item.Year == date.Year)
                    return true;
            }
            return false;
        }

        private bool CheckForDates(string apmStrDates, string date,int number)
        {
            List<DateTime> apmDates = ConvertMultiple(apmStrDates);
            var startDate = ConvertSingle(date);
            for(int i=0; i < number;++i)
            {
                var d = startDate.AddDays(i);
                var res = apmDates.SingleOrDefault(x => x.Day == d.Day && x.Month == d.Month && x.Year == d.Year);
                if (res == null)
                    return false;
            }
            return true;
        }

        private DateTime ConvertSingle(string date)
        {
            var args = date.Split('/');
            return new DateTime(Int32.Parse(args[2]), Int32.Parse(args[1]), Int32.Parse(args[0]));
        }
        private List<DateTime> ConvertMultiple(string dates)
        {
            List<DateTime> apmDates = new List<DateTime>();
            var arr = dates.Split(';');
            foreach (var item in arr)
            {
                if(item!="")
                {
                    var args = item.Split('/');
                    var d = new DateTime(Int32.Parse(args[2]), Int32.Parse(args[1]), Int32.Parse(args[0]));
                    apmDates.Add(d);
                }
                
            }
            return apmDates;
        }

        public async Task<bool> Denie(int id)
        {
            var res = await context.Reservations.FirstOrDefaultAsync(x => x.Id == id);
            if (res != null)
            {
                if (res.Status == ReservationStatus.Created || res.Status == ReservationStatus.Accepted)
                {
                    res.Status = ReservationStatus.Denied;
                    await context.SaveChangesAsync();
                    return true;
                }
                return false;
            }
            return false;
        }

        public async Task<bool> Finish(int id)
        {
            var res = await context.Reservations.FirstOrDefaultAsync(x => x.Id == id);
            if(res != null)
            {
                if(res.Date.AddDays(res.Number) < DateTime.Now)
                {
                    res.Status = ReservationStatus.Finished;
                    await context.SaveChangesAsync();
                    return true;
                }
                return false;
            }
            return false;
        }

        public async Task<List<ReservationToReturnDto>> GetAll(string username, string role)
        {
            var res = await context.Reservations
                .Include(x=>x.Guest)
                .Include(x=>x.Apartment)
                .Include(x=>x.Apartment.Host)
                .ToListAsync();
            if(role == Role.Admin)
            {
                var ret = mapper.Map<List<ReservationToReturnDto>>(res);
                return ret;
            }
            else if(role == Role.Host)
            {
                res = res.Where(x => x.Apartment.Host.Username == username).ToList();
                var ret = mapper.Map<List<ReservationToReturnDto>>(res);
                return ret;
            }
            else
            {
                res = res.Where(x => x.Guest.Username == username).ToList();
                var ret = mapper.Map<List<ReservationToReturnDto>>(res);
                return ret;
            }
        }

        public async Task<bool> Quit(int id)
        {
            var res = await context.Reservations.FirstOrDefaultAsync(x => x.Id == id);
            if (res != null)
            {
                if (res.Status == ReservationStatus.Created || res.Status == ReservationStatus.Accepted)
                {
                    res.Status = ReservationStatus.Quited;
                    await context.SaveChangesAsync();
                    return true;
                }
                return false;
            }
            return false;
        }
    }
}
