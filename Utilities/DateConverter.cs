using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Utilities
{
    public static class DateConverter
    {
        public static DateTime convertDateStringToDate(string dateString)
        {
            int day = Int32.Parse(dateString.Substring(0, 2));
            int month = Int32.Parse(dateString.Substring(3, 2));
            int year = Int32.Parse(dateString.Substring(6, 4));

            return new DateTime(year, month, day);
        }

        public static string reverseDateStringAndAddHyphenes(string dateString)
        {
            string day = (dateString.Substring(0, 2));
            string month = (dateString.Substring(3, 2));
            string year = (dateString.Substring(6, 4));

            return year + "-" + month + "-" + day;
        }
    }
}
