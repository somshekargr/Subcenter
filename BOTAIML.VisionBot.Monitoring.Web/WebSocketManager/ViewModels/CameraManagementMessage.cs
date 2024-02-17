using BOTAIML.VisionBot.Monitoring.Web.Utils;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BOTAIML.VisionBot.Monitoring.Web.WebSocketManager.ViewModels
{
    public class CameraManagementMessage
    {
        public string CameraId { get; set; }

        public CameraManagementMessageType MessageType { get; set; }

        private byte[] _rawMessage;

        public void SetRawMessage(byte[] buffer)
        {
            _rawMessage = buffer;
        }

        public byte[] GetRawMessage()
        {
            return _rawMessage;
        }

        private CameraManagementMessageWithPayload _messageWithPayload;

        public TModel GetPayload<TModel>()
        {
            if (_messageWithPayload == null)
                _messageWithPayload = BsonConvert.Deserialize<CameraManagementMessageWithPayload>(_rawMessage);

            return _messageWithPayload.Payload.ToObject<TModel>();
        }

        public TModel GetValueFromPayload<TModel>(string key)
        {
            if (_messageWithPayload == null)
                _messageWithPayload = BsonConvert.Deserialize<CameraManagementMessageWithPayload>(_rawMessage);

            return _messageWithPayload.Payload.Value<TModel>(key);
        }
    }

    public class CameraManagementMessageWithPayload : CameraManagementMessage
    {
        public JObject Payload { get; set; }
    }
}

