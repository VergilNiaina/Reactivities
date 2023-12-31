using Application.Activities;
using Application.Core;
using Application.Interfaces;
using FluentValidation;
using FluentValidation.AspNetCore;
using Infrastructure.Photos;
using Infrastructure.Security;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Extensions
{
    public static class ApplicationServiceExtension
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services,
                                                                IConfiguration config){
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            services.AddEndpointsApiExplorer();
            services.AddSwaggerGen();
            services.AddDbContext<DataContext>(opt =>
            {
                opt.UseSqlite(config.GetConnectionString("DefaultConnection"));
            });

            // CORS POLYCY: this particular origin is allow to load resources from the this api
            //              CORS header is needed
            //              add CORS before authorization
            services.AddCors(opt =>
            {
                opt.AddPolicy("CorsPolicy", policy =>
                {
                    //allow any http method and header from "http://localhost:3000" which is our react app
                    policy.AllowAnyMethod().AllowAnyHeader().WithOrigins("http://localhost:3000");
                });
            });
            services.AddMediatR(typeof(List.Handler));
            services.AddAutoMapper(typeof(MappingProfiles).Assembly);          

            // Add Fluent Validation 
            services.AddFluentValidationAutoValidation();
            services.AddValidatorsFromAssemblyContaining<ActivityValidator>();

            // In Order to access HttpContext in project apart from the API project Context
            services.AddHttpContextAccessor();
            services.AddScoped<IUserAccessor, UserAccessor>();

            // CloudinaryOptions
            services.Configure<CloudinarySettings>(config.GetSection("Cloudinary"));
            services.AddScoped<IPhotoAccessor, PhotoAccessor>();
            return services;                                             
        }
    }
}