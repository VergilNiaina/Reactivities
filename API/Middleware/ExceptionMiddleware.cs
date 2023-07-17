using System.Net;
using System.Text.Json;
using Application.Core;

namespace API.Middleware
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly IHostEnvironment _env;
        private readonly ILogger<ExceptionMiddleware> _logger ;

        public ExceptionMiddleware(RequestDelegate next,
                                   ILogger<ExceptionMiddleware> logger,
                                   IHostEnvironment env)
        {
            _logger = logger;
            _next = next;
            _env = env;
        }

        // A middleware must have this method
        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ex.Message); 
                // because we are not in api controller context
                context.Response.ContentType = "application/ json";
                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;  

                var Response = _env.IsDevelopment()
                               ? new AppException(context.Response.StatusCode, ex.Message, ex.StackTrace?.ToString()) 
                               : new AppException(context.Response.StatusCode,"Internal Server Error");

                var options = new JsonSerializerOptions{PropertyNamingPolicy = JsonNamingPolicy.CamelCase};

                var json = JsonSerializer.Serialize(Response, options);  

                await context.Response.WriteAsync(json);         
            }
        }
    }
}