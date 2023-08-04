using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
    public class DataContext : IdentityDbContext<AppUser>
    {
        public DataContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Activity> Activities { get; set; }
        public DbSet<ActivityAttendee> ActivityAttendees { get; set; }
        public DbSet<Photo> Photos {get;set;}

        // overide the OnModelCreating Method from IdentityDbContext
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // configuring primary key for ActivityAttendee
            builder.Entity<ActivityAttendee>(x => x.HasKey(aa => new{aa.AppUserId, aa.ActivityId}));

            // one appUser => many activities with fq of appuser as AppUserId
            builder.Entity<ActivityAttendee>()
                    .HasOne(u => u.AppUser)
                    .WithMany(a => a.Activities)
                    .HasForeignKey(aa => aa.AppUserId);

            // one activity => many Attendees with fq of appuser as ActivityId
            builder.Entity<ActivityAttendee>()
                    .HasOne(u => u.Activity)
                    .WithMany(a => a.Attendees)
                    .HasForeignKey(aa => aa.ActivityId);
            

        }
    }
}