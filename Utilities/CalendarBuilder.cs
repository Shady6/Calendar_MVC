using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Utilities
{
    public static class CalendarBuilder
    {
        public static readonly string[] monthsTranslation = new string[]{"Styczeń", "Luty", "Marzec", "Kwiecień", "Maj",
            "Czerwiec", "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień" };

        public static readonly string[] daysTranslation = new string[] { "Pn", "Wt", "Śr", "Czw", "Pt", "Sb", "Ndz" };

        public static int getIndexOfCurrentMonthCalendarHTMLString(int yearRadius = 1)
        {
            return yearRadius * 12;
        }

        public static List<string> buildYearlyCalendar(DateTime date, int yearRadius = 1)
        {
            List<string> yearlyCalendar = new List<string>();

            date = date.AddYears(-yearRadius);

            for (int i = 0; i < yearRadius * 2 * 12 ; i++)
            {               
                yearlyCalendar.Add(buildOneMonthCalendarHTMLString(date));
                date = date.AddMonths(1);
            }

            return yearlyCalendar;
        }

        public static string buildOneMonthCalendarHTMLString(DateTime date)
        {
            string calendar = buildHeaderOfCalendarHTMLString(date);

            calendar = buildMeatOfCalendarHTMLString(date, calendar);

            return calendar + "</table>";
        }

        private static string buildMeatOfCalendarHTMLString(DateTime date, string calendar)
        {
            int firstDay = new DateTime(date.Year, date.Month, 1).DayOfWeek == DayOfWeek.Sunday ?
                6 : (int)new DateTime(date.Year, date.Month, 1).DayOfWeek - 1;
            DateTime tempDate = date.AddDays(-date.Day + 1);

            bool shouldCheck = true;
            int j = 1;

            while (j <= getDaysCountInMonth(date))
            {
                calendar += "<tr>";
                for (int i = 0; i < 7; i++)
                {
                    if ((shouldCheck && firstDay != i) || j > getDaysCountInMonth(date))
                    {
                        calendar += "<td></td>";
                    }
                    else
                    {
                        shouldCheck = false;
                        calendar += "<td class=\"dateCell\" id=\"" + tempDate.ToShortDateString() + "\">" + j + "</td>";
                        j++;
                        tempDate = tempDate.AddDays(1);   
                    }                    
                }
                calendar += "</tr>";
            }
            return calendar;
        }

        private static string buildHeaderOfCalendarHTMLString(DateTime date)
        {
            string calendarHeader = "<table border=\"1\">" +
                        "<tr>" +
                        "<th id=\"tableMonthHeader\" colspan = \"7\">" + monthsTranslation[date.Month - 1] + " " + Convert.ToString(date.Year) + "</th>" +
                        "</tr><tr>";
            for (int i = 0; i < 7; i++)
            {
                calendarHeader += "<th>" + daysTranslation[i] + "</th>";
            }
            calendarHeader += "</tr>";
            return calendarHeader;
        }

        private static int getDaysCountInMonth(DateTime date)
        {
            return DateTime.DaysInMonth(date.Year, date.Month);
        }
    }
}
