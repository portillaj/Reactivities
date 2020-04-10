using System;
using System.Threading;
using System.Threading.Tasks;
using Application.Interfaces;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Unattend
    {
        public class Command : IRequest {
            public Guid Id { get; set; }          
        }
        
                public class Handler : IRequestHandler<Command>
                {
                private readonly DataContext _context;
                private readonly IUserAccessor _userAccessor;
                    public Handler(DataContext context, IUserAccessor userAccessor)
                    {
                        _userAccessor = userAccessor;
                        _context = context;
                    }
        
                    public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
                    {
                        // handler logic
                        var success = await _context.SaveChangesAsync() > 0;
                        if(success) return Unit.Value;
                        throw new Exception("Problem saving changes");
                    }
                }
    }
}