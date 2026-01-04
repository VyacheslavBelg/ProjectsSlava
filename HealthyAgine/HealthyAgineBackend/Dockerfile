
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY ["HealthyAgine.csproj", "./"]
RUN dotnet restore "HealthyAgine.csproj"
COPY . .
RUN dotnet publish "HealthyAgine.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 8080
ENTRYPOINT ["dotnet", "HealthyAgine.dll"]