# Usa la imagen oficial de .NET para compilación
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copia los archivos y restaura dependencias
COPY . ./ 
RUN dotnet restore

# Compila la aplicación
RUN dotnet publish -c Release -o out

# Usa la imagen de runtime para ejecutar la aplicación
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/out .

# Expone el puerto de la aplicación
EXPOSE 80
ENTRYPOINT ["dotnet", "GestionTickets.dll"]
