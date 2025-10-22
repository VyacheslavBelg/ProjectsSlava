using System.Net.Http.Json;
using BioAgeFrontend.Models;

namespace BioAgeFrontend.Services
{
    public class ApiService
    {
        private readonly HttpClient _http;

        public ApiService(HttpClient http)
        {
            _http = http;
        }

        public async Task<CalculationResponse?> CalculateAsync(CalculationRequest request)
        {
            var form = new MultipartFormDataContent
            {
                { new StringContent(request.Name), "Name" },
                { new StringContent(request.ChronologicalAge.ToString()), "ChronologicalAge" },
                { new StringContent(request.Height.ToString()), "Height" },
                { new StringContent(request.Weight.ToString()), "Weight" },
                { new StringContent(request.Waist.ToString()), "Waist" },
                { new StringContent(request.Neck.ToString()), "Neck" },
                { new StringContent(request.IsFemale.ToString()), "IsFemale" }
            };

            if (request.Hips.HasValue)
                form.Add(new StringContent(request.Hips.Value.ToString()), "Hips");

            var response = await _http.PostAsync("api/BioAge/calculate", form);

            if (response.IsSuccessStatusCode)
                return await response.Content.ReadFromJsonAsync<CalculationResponse>();

            var error = await response.Content.ReadAsStringAsync();
            throw new Exception($"Ошибка API: {error}");
        }
    }
}
