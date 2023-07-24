using API.Extensions;
using API.Middleware;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.EntityFrameworkCore;
using Persistence;

var builder = WebApplication.CreateBuilder(args);

#region register services to the container

// Add services to the container.

builder.Services.AddControllers(opt => {
    // Every single controller endpoints will require authentication
    var policy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
    opt.Filters.Add(new AuthorizeFilter(policy));
});

builder.Services.AddApplicationServices(builder.Configuration);

builder.Services.AddIdentityServices(builder.Configuration);
#endregion

var app = builder.Build();

#region Middleware: can process http request
// Everytime we send request from client side those middlewares will be call one after the other
// Configure the HTTP request pipeline. (middleware in and out)

app.UseMiddleware<ExceptionMiddleware>();

if (app.Environment.IsDevelopment())
{
    // previously in .net 5 but now it is used even we don't specify it
    // app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("CorsPolicy");
// To check if it is a valide user
app.UseAuthentication();
// Then if valide user then authorize to do something
app.UseAuthorization();

//register the end points in the controllers
app.MapControllers();
#endregion

// once done with the scope anything inside will be desposed
using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;


try
{
    var context = services.GetRequiredService<DataContext>();
    var userManager = services.GetRequiredService<UserManager<AppUser>>();
    // attempt to create the table
    context.Database.Migrate();
    await Seed.SeedData(context,userManager);
}
catch (Exception ex)
{
    var logger = services.GetRequiredService<ILogger<Program>>();
    logger.LogError(ex, "An error occured during migration");
}

app.Run();
