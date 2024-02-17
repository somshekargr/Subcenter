using Newtonsoft.Json;
using Newtonsoft.Json.Bson;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace BOTAIML.VisionBot.Monitoring.Web.Utils
{
    public class BsonConvert
    {
        public static byte[] Serialize(object value)
        {
            using (var ms = new MemoryStream())
            using (var writer = new BsonWriter(ms))
            {
                var serializer = new JsonSerializer();

                serializer.Serialize(writer, value);

                return ms.ToArray();
            }
        }

        public static T Deserialize<T>(byte[] buffer)
        {
            using (var ms = new MemoryStream(buffer))
            using (var reader = new BsonReader(ms))
            {
                var serializer = new JsonSerializer();

                return serializer.Deserialize<T>(reader);
            }
        }
    }
}
