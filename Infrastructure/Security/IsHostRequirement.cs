using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Infrastructure.Security
{
    public class IsHostRequirement : IAuthorizationRequirement
    {
        
    }

    public class IsHostRequirementHandler : AuthorizationHandler<IsHostRequirement>
    {
        private readonly DataContext _dataContext;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public IsHostRequirementHandler(DataContext dataContext, IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
            _dataContext = dataContext;
        }

        // this is a custom auth policy
        /// <summary>
        /// To protect editing activity from someone who is not the host
        /// </summary>
        /// <param name="context"></param>
        /// <param name="requirement"></param>
        /// <returns></returns>
        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, IsHostRequirement requirement)
        {
            // get user Id
            var userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier);

            if(userId == null) return Task.CompletedTask;

            // get the http request route values and get the id attribut 
            var activityId = Guid.Parse(_httpContextAccessor.HttpContext?.Request.RouteValues
                                                                .SingleOrDefault(x => x.Key == "id").Value?.ToString());

            var attendee = _dataContext.ActivityAttendees
                                            .AsNoTracking()// bcs we don't need to track 
                                                .SingleOrDefaultAsync(x => x.AppUserId == userId && x.ActivityId== activityId)
                                                    .Result;

            if(attendee == null) return Task.CompletedTask;


            if(attendee.IsHost)  context.Succeed(requirement);
            // if we return in this point and the context succeed flag is set 
            // the user is authorized to go ahead and edit the activity
            return Task.CompletedTask;
        }
    }
}