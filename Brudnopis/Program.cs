using System;

namespace Brudnopis
{
    class Program
    {
        static void Main(string[] args)
        {
            string date = "24-05-1996";
            string sql = "select * from dbo.Event where Date = \""+date+"\"";
            Console.WriteLine(sql);
            Console.WriteLine((new DateTime(47100000)).ToUniversalTime());
            Console.ReadKey();
        }
    }
}
