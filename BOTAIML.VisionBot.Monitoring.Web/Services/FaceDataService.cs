using BOTAIML.VisionBot.Monitoring.Web.Models;
using BOTAIML.VisionBot.Monitoring.Web.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace BOTAIML.VisionBot.Monitoring.Web.Services
{
    public class FaceDataService
    {
        private readonly HttpClient httpClient;
        private readonly string faceEnrolmentEndPoint;
        private readonly Uri faceEnrolment;
        private readonly Uri faceSearch;
        private readonly string faceDelete;

        public FaceDataService(HttpClient httpClient, AppSettings appSettings)
        {
            this.httpClient = httpClient;

            this.httpClient.Timeout = TimeSpan.FromMinutes(15);
            this.faceEnrolmentEndPoint = appSettings.InferenceServerUrl + "/face-enroll";

            this.faceEnrolment = new Uri(new Uri(appSettings.InferenceServerUrl), "/face-enroll");
            this.faceSearch = new Uri(new Uri(appSettings.InferenceServerUrl), "/face-search");
            this.faceDelete = appSettings.InferenceServerUrl + "/delete-index";
        }

        public async Task<FaceDataServiceResultViewModel> Enrol(EnrolRequestViewModel evm)
        {

            var json = JsonConvert.SerializeObject(evm.EnrolRequests);
            var urlTohit = this.faceEnrolmentEndPoint + "?PersonId=" + evm.PersonId;

            var response = await httpClient.PostAsync(new Uri(urlTohit), new StringContent(json, Encoding.UTF8, "application/json"));
            if (!response.IsSuccessStatusCode)
            {
                return new FaceDataServiceResultViewModel
                {
                    Success = false,
                    Error = await response.Content.ReadAsStringAsync(),
                    Data = new List<EnrolmentServiceResultViewModel>()
                };
            }

            var result = new FaceDataServiceResultViewModel();

            var resultJson = await response.Content.ReadAsStringAsync();

            try
            {
                //When Successfully able to enrol, Python code sends the data result
                var data = JsonConvert.DeserializeObject<List<EnrolmentServiceResultViewModel>>(resultJson);
                result.Success = true;
                result.Error = string.Empty;
                result.Data = data;
            }
            catch (Exception ex)
            {
                result = JsonConvert.DeserializeObject<FaceDataServiceResultViewModel>(resultJson);
            }
            return result;
        }

        public async Task<FaceEnrolmentImageDeleteResultViewModel> Delete(List<string> FaceIndexId)
        {
            var json = JsonConvert.SerializeObject(FaceIndexId);

            var response = await httpClient.PostAsync(new Uri(faceDelete), new StringContent(json, Encoding.UTF8, "application/json"));

            if (!response.IsSuccessStatusCode)
            {
                return new FaceEnrolmentImageDeleteResultViewModel
                {
                    Success = false,
                    Error = await response.Content.ReadAsStringAsync()
                };
            }
            return new FaceEnrolmentImageDeleteResultViewModel
            {
                Success = true,
                Error = string.Empty
            };
        }

        //public async Task<IdentifyServiceResultViewModel> Identify(string[] faceImages)
        //{
        //    var json = JsonConvert.SerializeObject(new
        //    {
        //        images = faceImages
        //    });

        //    var response = await httpClient.PostAsync(faceEnrolment, new StringContent(json, Encoding.UTF8, "application/json"));

        //    if (!response.IsSuccessStatusCode)
        //    {
        //        return new IdentifyServiceResultViewModel
        //        {
        //            Success = false,
        //            Error = await response.Content.ReadAsStringAsync()
        //        };
        //    }

        //    var resultJson = await response.Content.ReadAsStringAsync();

        //    var result = JsonConvert.DeserializeObject<SearchResultViewModel>(resultJson);

        //    var retVal = new IdentifyServiceResultViewModel
        //    {
        //        searchResult = result,
        //        Success = true,
        //        Error = string.Empty

        //    };
        //    return retVal;
        //}

    }
}
