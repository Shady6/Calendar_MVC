using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace API.Models
{
    public class CalendarEvent
    {
        public string Hour { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Date { get; set; }
        public int Id { get; set; }
        public bool Checked { get; set; }
    }
}