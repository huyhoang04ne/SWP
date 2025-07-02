using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GHMS.DAL.Models
{
    public class WorkingSchedule
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string CounselorId { get; set; }

        [ForeignKey("CounselorId")]
        public AppUser Counselor { get; set; }

        [Required]
        public DateTime WorkDate { get; set; }

        [Required]
        public TimeSlot TimeSlot { get; set; }

        public bool IsAvailable { get; set; } = true;

        public string? Notes { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
