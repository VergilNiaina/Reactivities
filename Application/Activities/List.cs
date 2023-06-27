using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Persistence;

namespace Application.Activities
{
    public class List
    {
        public class Query : IRequest<List<Activity>> {}

        public class Handler : IRequestHandler<Query, List<Activity>>
        {
            private readonly DataContext _dataContext;
            private readonly ILogger<List> _logger;

            public Handler(DataContext dataContext, ILogger<List> logger)
            {
                _dataContext = dataContext;
                _logger = logger;
            }
            public async Task<List<Activity>> Handle(Query request, CancellationToken cancellationToken)
            {
                // the cancellationToken here is just to demonstrate how we can cancel task
                // try
                // {
                //     for(var i=0 ; i<10;i++){
                //         // eg: closing the browser, Postman, or quitting the app
                //         cancellationToken.ThrowIfCancellationRequested();
                //         await Task.Delay(1000, cancellationToken);
                //         _logger.LogInformation($"Taks {i} has completed");
                //     }
                // }
                // catch (System.Exception)
                // {
                //     _logger.LogError("Task cancelled!");                    
                // }
                return await _dataContext.Activities.ToListAsync();
            }
        }
    }
}