using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GHMS.DAL.Models
{
    public class AppUser : IdentityUser
    {
        public string FullName { get; set; } = default!;
        public string Gender { get; set; } = default!;
        public DateTime DateOfBirth { get; set; }
        public ICollection<MedicationSchedule> Schedules { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}