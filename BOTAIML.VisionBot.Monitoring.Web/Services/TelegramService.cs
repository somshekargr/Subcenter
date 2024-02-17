using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Telegram.Bot.Types.InputFiles;
using Telegram.Bot;
using System.IO;
using Microsoft.AspNetCore.Mvc;
using BOTAIML.VisionBot.Monitoring.Web.ViewModels;
using Microsoft.Extensions.Options;

namespace BOTAIML.VisionBot.Monitoring.Web.Services
{
    public class TelegramService
    {
        private readonly TelegramSettings telegramSettings;
        TelegramBotClient Bot;
        string channel;
        public TelegramService(TelegramSettings telegramSettings)
        {
            this.telegramSettings = telegramSettings;
            this.Bot = new TelegramBotClient(telegramSettings.ClientToken);
            this.channel = telegramSettings.ChannelId;

        }

        public async Task<TelegramServiceResultViewModel> SendAlertToGroup(TelegramViewModel tvm)
        {
            string ContentType = tvm.ContentType.ToString();
            try
            {
                switch (ContentType)
                {
                    case "Text":
                        await SendMessage(tvm.Message);
                        break;
                    case "Image":
                        await SendPhoto(tvm.AlertContentMeta, tvm.Message);
                        break;
                    case "Video":
                        await SendVideo(tvm.AlertContentMeta, tvm.Message);
                        break;
                }
                var result = new TelegramServiceResultViewModel
                {
                    success = true,
                    error = "no error"
                };
                return (result);
            }
            catch
            {
                return new TelegramServiceResultViewModel
                {
                    success = false,
                    error = "error"
                };
            }

        }

        private async Task<TelegramServiceResultViewModel> SendMessage(string message)
        {
            await Bot.SendTextMessageAsync(channel, message);
            return new TelegramServiceResultViewModel
            {
                success = true,
                error = "error"
            };

        }

        private async Task<TelegramServiceResultViewModel> SendPhoto(string photo, string message)
        {

            MemoryStream stream = new MemoryStream(Convert.FromBase64String(photo));

            InputOnlineFile inputOnlineFile = new InputOnlineFile(stream);

            await Bot.SendPhotoAsync(channel, inputOnlineFile);
            await SendMessage(message);
            return new TelegramServiceResultViewModel
            {
                success = true,
                error = "error"
            };
        }

        private async Task<TelegramServiceResultViewModel> SendVideo(string video, string message)
        {

            MemoryStream stream = new MemoryStream(Convert.FromBase64String(video));
            InputOnlineFile inputOnlineFile = new InputOnlineFile(stream);

            await Bot.SendVideoAsync(channel, inputOnlineFile, 0, 0, 0);
            await SendMessage(message);

            return new TelegramServiceResultViewModel
            {
                success = true,
                error = "error"
            };
        }
    }
}
