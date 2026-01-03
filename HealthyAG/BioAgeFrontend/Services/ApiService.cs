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

        public async Task<List<PhotoFatRange>?> GetPhotoRangesAsync(bool isFemale)
        {
            try
            {
                Console.WriteLine($"🚀 ApiService: Запрос фото для пола: {isFemale}");
                Console.WriteLine($"🔗 URL: api/BioAge/photo-ranges/{isFemale}");

                var response = await _http.GetAsync($"api/BioAge/photo-ranges/{isFemale}");

                Console.WriteLine($"📡 ApiService: Ответ статус: {response.StatusCode}");

                if (response.IsSuccessStatusCode)
                {
                    var result = await response.Content.ReadFromJsonAsync<PhotoFatRangesResponse>();
                    Console.WriteLine($"✅ ApiService: Получено диапазонов: {result?.Ranges?.Count ?? 0}");

                    if (result?.Ranges != null)
                    {
                        foreach (var range in result.Ranges)
                        {
                            Console.WriteLine($"   - {range.Range}: {range.DisplayName}");
                        }
                    }

                    return result?.Ranges;
                }
                else
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    Console.WriteLine($"❌ ApiService: Ошибка HTTP: {response.StatusCode}, {errorContent}");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"💥 ApiService: Исключение: {ex.Message}");
            }
            return new List<PhotoFatRange>();
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
                { new StringContent(request.IsFemale.ToString()), "IsFemale" },
                { new StringContent(request.HasOwnFatPercentage.ToString()), "HasOwnFatPercentage" },
                { new StringContent(request.UsePhotoEstimation.ToString()), "UsePhotoEstimation" }
            };

            if (request.Hips.HasValue)
                form.Add(new StringContent(request.Hips.Value.ToString()), "Hips");

            if (request.HasOwnFatPercentage && request.FatPercentage.HasValue)
                form.Add(new StringContent(request.FatPercentage.Value.ToString()), "FatPercentage");

            if (request.UsePhotoEstimation && !string.IsNullOrEmpty(request.SelectedPhotoRange))
                form.Add(new StringContent(request.SelectedPhotoRange), "SelectedPhotoRange");

            var response = await _http.PostAsync("api/BioAge/calculate", form);

            if (response.IsSuccessStatusCode)
                return await response.Content.ReadFromJsonAsync<CalculationResponse>();

            var error = await response.Content.ReadAsStringAsync();
            throw new Exception($"Ошибка API: {error}");
        }
    }
}