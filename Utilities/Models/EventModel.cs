using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Utilities.Models
{
    public class EventModel
    {
        public int Id { get; set; }
        public string Hour { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime Date { get; set; }
        public bool Checked { get; set; }
    }
}
