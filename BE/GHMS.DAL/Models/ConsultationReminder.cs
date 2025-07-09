using Microsoft.EntityFrameworkCore;
using GHMS.DAL.Models;

public class ConsultationReminder
{
    public int Id { get; set; }
    public int ConsultationId { get; set; }
    public int HoursBefore { get; set; } // 24 hoặc 1
    public DateTime SentAt { get; set; }
}
