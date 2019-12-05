﻿using Microsoft.AspNetCore.SignalR;
using SnakeGame.Domain.Admin.Models;
using SnakeGame.Infrastructure.Models.Configurations;

namespace SnakeGame.Api.Configurations
{
    public class ConfigurationFilesEntities
    {
        
        public HubOptions HubOptions { get; set; }
        public  string AllowedHosts { get; set; }
        public GameConfigurationsModel GameConfigurations { get; set; }
        public AdminModels.AvailableUsers AvailableUsersConfiguration { get; set; }
        public AdminModels.PasswordEncrypt PasswordEncryptConfiguration { get; set; }

    }
}