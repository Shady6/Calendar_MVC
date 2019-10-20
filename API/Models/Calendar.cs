using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace API.Models
{
    public class Calendar
    {
        public List<string> YearlyCalendar{ get; set; }
        public int IndexOfCurrentMonth{ get; set; }
    }
}