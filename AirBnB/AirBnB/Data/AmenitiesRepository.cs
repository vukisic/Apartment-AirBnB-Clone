using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AirBnB.Dtos;
using AirBnB.Models;
using Microsoft.EntityFrameworkCore;

namespace AirBnB.Data
{
    public class AmenitiesRepository : IAmenitiesRepository
    {
        private readonly DataContext context;

        public AmenitiesRepository(DataContext context)
        {
            this.context = context;
        }

        public async Task<bool> Add(string name)
        {
            if (await Exist(name))
            {
                var items = await context.Amenities.ToListAsync();
                var item = items.First(x => x.Name == name);
                if (item.IsDeleted)
                {
                    item.IsDeleted = false;
                    foreach (var it in items)
                    {
                        if (it.Name == name)
                            it.IsDeleted = false;
                    }
                    await context.SaveChangesAsync();
                    return true;
                }
                return false;
            }
            else
            {
                var newItem = new Amenitie() { IsDeleted = false, Name = name };
                context.Amenities.Add(newItem);
                await context.SaveChangesAsync();
                return true;
            }
        }

        public async Task<List<AmenitieDto>> GetAll()
        {
            var items = await context.Amenities.Where(x => x.IsDeleted == false).Distinct().ToListAsync();
            var dtos = new List<AmenitieDto>();
            var exist = new List<string>();
            foreach (var item in items)
            {
                if (!exist.Contains(item.Name))
                {
                    dtos.Add(new AmenitieDto() { Name = item.Name });
                    exist.Add(item.Name);
                }
                    
            }

            return dtos;
        }
        public async Task<bool> Remove(string name)
        {
            if(await Exist(name))
            {
                var items = await context.Amenities.ToListAsync();
                foreach (var item in items)
                {
                    if (item.Name == name)
                        item.IsDeleted = true;
                }
                await context.SaveChangesAsync();
                return true;
            }
            return false;
        }

        private async Task<bool> Exist(string name)
        {
            var item = await context.Amenities.FirstOrDefaultAsync(x => x.Name == name);
            return item != null;
        }
    }
}
