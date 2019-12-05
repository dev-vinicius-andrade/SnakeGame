﻿using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi.Models;
using SnakeGame.Api.Configurations;
using SnakeGame.Domain.Admin;
using SnakeGame.Domain.Admin.Models;
using SnakeGame.Services;
using SnakeGame.Services.Entities;

namespace SnakeGame.Api.Helpers
{
    internal static class StartupExtensions
    {
        public static void AddDependencies(this IServiceCollection services, IConfiguration configuration)
        {
            var configurationFilesEntities = configuration.Get<ConfigurationFilesEntities>();

            services.AddScoped<FoodService>();
            services.AddScoped<GameService>();
            services.AddSingleton<GameData>();
            services.AddScoped<RoomService>();
            services.AddScoped<SnakeService>();
            services.AddScoped<PlayerService>();
            services.AddSingleton<AdminService>();
            services.AddSingleton<UserManagement>();
            services.AddSingleton(p=>configurationFilesEntities.GameConfigurations);
            services.AddSingleton(p=>configurationFilesEntities.AvailableUsersConfiguration); 
            services.AddSingleton(p=>configurationFilesEntities.PasswordEncryptConfiguration);
        }
        public static void AddSwagger(this IServiceCollection services , IConfiguration configuration, string apiName, OpenApiInfo apiInfo)
        {
            services.AddControllers();
            services.AddSwaggerGen(
                c =>
                {
                    c.SwaggerDoc(apiName,  apiInfo);
                });
        }
        public static  void ConfigureCors(this IServiceCollection services, string policyName)
        {
            services.AddCors(options
                =>
            {
                options.AddPolicy(policyName,
                    builder =>
                        builder.SetIsOriginAllowed((host) => true).AllowAnyMethod().AllowAnyHeader()
                            .AllowCredentials());
            });
        }
    }
}