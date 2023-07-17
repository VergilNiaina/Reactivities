namespace Application.Core
{
    // return this exception to the middleware
    public class AppException
    {
        public AppException(int statusCode, string message, string details = null)
        {
            StatusCode = statusCode;
            Message = message;
            // details is not null only if we are in development mode
            Details = details;
        }

        public int StatusCode {get; set;}
        public string Message {get; set;}
        public string Details {get; set;}

    }
}