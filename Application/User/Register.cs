using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Persistence;

namespace Application.User
{
    public class Register
    {
        public class Command : IRequest<User>
        {
            public string DisplayName { get; set; }
            public string Username { get; set; }
            public string Email { get; set; }
            public string Password { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator(UserManager<AppUser> userManager)
            {
                RuleFor(x => x.DisplayName).NotEmpty();
                RuleFor(x => x.Username)
                    .NotEmpty()
                    .MustAsync(async (username, cancellation) => (await userManager.FindByNameAsync(username)) == null)
                    .WithMessage("Username already exists");
                ;
                RuleFor(x => x.Email)
                    .NotEmpty()
                    .EmailAddress()
                    .MustAsync(async (email, cancellation) => (await userManager.FindByEmailAsync(email)) == null)
                    .WithMessage("Email already exists");
                RuleFor(x => x.Password).NotEmpty();
            }
        }

        public class Handler : IRequestHandler<Command, User>
        {
            public DataContext _context { get; }
            public UserManager<AppUser> _userManager { get; }
            public IJwtGenerator _jwtGenerator { get; }
            public Handler(DataContext context, UserManager<AppUser> userManager, IJwtGenerator jwtGenerator)
            {
                _jwtGenerator = jwtGenerator;
                _userManager = userManager;
                _context = context;
            }

            public async Task<User> Handle(Command request, CancellationToken cancellationToken)
            {

                // if(await _context.Users.Where(x => x.Email == request.Email).AnyAsync()) {
                //     throw new RestException(HttpStatusCode.BadRequest, new {Email = "Email already exists"});
                // }

                //   if(await _context.Users.Where(x => x.UserName == request.Username).AnyAsync()) {
                //     throw new RestException(HttpStatusCode.BadRequest, new {Username = "Username already exists"});
                // }

                var user = new AppUser
                {
                    DisplayName = request.DisplayName,
                    Email = request.Email,
                    UserName = request.Username
                };

                var result = await _userManager.CreateAsync(user, request.Password);

                if (result.Succeeded) 
                {
                    return new User
                    {
                        DisplayName = user.DisplayName,
                        Token = _jwtGenerator.CreateToken(user),
                        Username = user.UserName,
                        Image = null
                    };
                }

                throw new System.Exception("Problem creating user");
            }

        }
    }
}