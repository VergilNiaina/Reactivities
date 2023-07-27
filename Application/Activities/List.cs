using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Persistence;

namespace Application.Activities
{
    public class List
    {
        public class Query : IRequest<Result<List<ActivityDto>>> {}

        public class Handler : IRequestHandler<Query, Result<List<ActivityDto>>>
        {
            private readonly DataContext _dataContext;
            private readonly ILogger<List> _logger;
            private readonly IMapper _mapper;

            public Handler(DataContext dataContext, ILogger<List> logger, IMapper mapper)
            {
                _mapper = mapper;
                _dataContext = dataContext;
                _logger = logger;
            }
            public async Task<Result<List<ActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
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

                // RELATED Entities
                // <> Agearly : probably there will be some addtionnal props you dont need 
                // var activities= await _dataContext.Activities
                //                                 .Include(a => a.Attendees)
                //                                     .ThenInclude(aa => aa.AppUser)
                //                                         .ToListAsync(cancellationToken);
                // var acititiesToReturn = _mapper.Map<List<ActivityDto>>(activities);
                
                // <> Projection : better query
                var activities = await _dataContext.Activities
                                            .ProjectTo<ActivityDto>(_mapper.ConfigurationProvider)
                                                .ToListAsync(cancellationToken);


                return Result<List<ActivityDto>>.Success(activities);
            }
        }
    }
}