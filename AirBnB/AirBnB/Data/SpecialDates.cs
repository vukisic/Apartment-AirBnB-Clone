using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AirBnB.Data
{
    public class SpecialDates
    {
        private static List<DateTime> specialDates = new List<DateTime>()
        {
            new DateTime(2019,1,1),
            new DateTime(2019,1,2),
            new DateTime(2019,1,7),
            new DateTime(2019,1,27),
            new DateTime(2019,2,15),
            new DateTime(2019,2,16),
            new DateTime(2019,3,31),
            new DateTime(2019,4,19),
            new DateTime(2019,4,20),
            new DateTime(2019,4,21),
            new DateTime(2019,4,22),
            new DateTime(2019,4,26),
            new DateTime(2019,4,27),
            new DateTime(2019,4,28),
            new DateTime(2019,4,29),
            new DateTime(2019,5,1),
            new DateTime(2019,5,2),
            new DateTime(2019,5,9),
            new DateTime(2019,6,4),
            new DateTime(2019,6,28),
            new DateTime(2019,8,11),
            new DateTime(2019,10,18),
            new DateTime(2019,10,21),
            new DateTime(2019,10,27),
            new DateTime(2019,11,11),
            new DateTime(2019,12,25),
        };

        public static Tuple<bool, int> FilterDates(List<DateTime> list)
        {
            bool weekend = false;
            int specialDays = 0;

            foreach (var item in list)
            {
                if (item.DayOfWeek == DayOfWeek.Friday || item.DayOfWeek == DayOfWeek.Saturday || item.DayOfWeek == DayOfWeek.Sunday)
                {
                    weekend = true;
                    break;
                }
            }

            foreach (var item in list)
            {
                var date = specialDates.SingleOrDefault(x => x.Date == item.Date);
                if (date != null)
                    specialDays++;
            }

            return new Tuple<bool, int>(weekend, specialDays);
        }
    }
}
