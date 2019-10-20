using API.Models;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Utilities;
using Utilities.BusinessLogic;
using Utilities.Models;
using System.Reflection;
using System.Web.Http.Cors;

namespace API.Controllers
{
    [EnableCors(origins: "http://localhost:51985", headers: "*", methods: "*")]
    public class CalendarController : ApiController
    {
        public Calendar Get()
        {
            return new Calendar
            {
                YearlyCalendar = CalendarBuilder.buildYearlyCalendar(DateTime.Now),
                IndexOfCurrentMonth = CalendarBuilder.getIndexOfCurrentMonthCalendarHTMLString()
            };
        }

        [Route("api/Calendar/Events")]
        [HttpPost]
        public void CalendarEvent(CalendarEvent ev)
        {
            int recordsCreated = EventProcessor.CreateEvent(ev.Hour, ev.Name, ev.Description, DateConverter.convertDateStringToDate(ev.Date));
        }

        [Route("api/Calendar/Events/{date:length(10)}")]
        [HttpGet]
        public List<CalendarEvent> CalendarEvent(string date)
        {
            List<Utilities.Models.EventModel> eventsDbFormat = EventProcessor.LoadEvents(DateConverter.reverseDateStringAndAddHyphenes(date));

            List<CalendarEvent> frontEndModel = eventsDbFormat.ConvertAll((item) => new CalendarEvent
            {
                Date = item.Date.ToShortDateString(),
                Description = item.Description,
                Hour = item.Hour,
                Name = item.Name,
                Id = item.Id,
                Checked = item.Checked
            });

            return frontEndModel;
        }

        [Route("api/Calendar/Events/{id:int}")]
        [HttpDelete]
        public void CalendarEvent(int id)
        {
            EventProcessor.DeleteEvent(id);
        }

        [Route("api/Calendar/Events/{id:int}")]
        [HttpPut]
        public void CalendarEvent(int id,CalendarEvent ev)
        {
            EventProcessor.EditEvent(id, ev.Checked, ev.Hour, ev.Name, ev.Description, DateConverter.convertDateStringToDate(ev.Date));
        }
    }
}
