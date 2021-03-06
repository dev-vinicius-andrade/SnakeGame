﻿using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi.Models;
using SnakeGame.Api.Configurations;
using SnakeGame.Application.Handlers;
using SnakeGame.Application.Services;
using SnakeGame.Domain.Admin;
using SnakeGame.Domain.Player;
using SnakeGame.Domain.Player.Helpers;

using SnakeGame.Infrastructure.Helpers;

namespace SnakeGame.Api.Helpers
{
    internal static class StartupExtensions
    {
        public static void AddDependencies(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddGameContext();
            services.RegisterKnowDirections();
            services.AddScoped<FoodService>();
            services.AddScoped<GameService>();
            services.AddScoped<GameHandler>();
            services.AddScoped<SnakeService>();
            services.AddScoped<SnakeGenerator>();
            services.AddSingleton<AdminService>();
            services.AddSingleton<UserManagement>();
            services.AddScoped(p=>configuration.Get<ConfigurationFilesEntities>().GameConfigurations);
            services.AddSingleton(p=>configuration.Get<ConfigurationFilesEntities>().AvailableUsersConfiguration); 
            services.AddSingleton(p=>configuration.Get<ConfigurationFilesEntities>().PasswordEncryptConfiguration);
            services.AddScoped(p=>configuration.Get<ConfigurationFilesEntities>().GameConfigurations.SnakeConfiguration);
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
