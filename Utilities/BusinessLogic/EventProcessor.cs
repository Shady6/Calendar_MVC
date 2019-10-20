using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Utilities.DataAccess;
using Utilities.Models;

namespace Utilities.BusinessLogic
{
    public static class EventProcessor
    {
        public static int CreateEvent(string hour, string name, string description, DateTime date)
        {
            EventModel data = new EventModel
            {
                Hour = hour,
                Name = name,
                Description = description,
                Date = date
            };

            string sql = @"insert into dbo.Event (Hour, Name, Description, Date)
                           values (@Hour, @Name, @Description, @Date);";

            return SqlDataAccess.SaveData(sql, data);
        }

        public static int EditEvent(int id, bool Checked, string hour, string name, string description, DateTime date)
        {
            EventModel data = new EventModel
            {
                Hour = hour,
                Name = name,
                Description = description,
                Date = date,
                Checked = Checked,
                Id = id
            };

            string sql = @"UPDATE dbo.Event SET Hour = @Hour, Name = @Name, Description = @Description,Date = @Date, Checked = @Checked WHERE Id = @Id";

            return SqlDataAccess.SaveData(sql, data);
        }

        public static int DeleteEvent(int id)
        {
            string sql = "delete from dbo.Event where Id = " + id + ";";

            return SqlDataAccess.DeleteData(sql);

        }

        public static List<EventModel> LoadEvents()
        {
            string sql = "select * from dbo.Event;";

            return SqlDataAccess.LoadData<EventModel>(sql);
        }

        public static List<EventModel> LoadEvents(string date)
        {
            string sql = "select * from dbo.Event where Date = '" + date + "';";

            return SqlDataAccess.LoadData<EventModel>(sql);
        }
    }
}
