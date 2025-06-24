using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GHMS.DAL.Migrations
{
    /// <inheritdoc />
    public partial class AddLastEmailSentDateToMedicationReminderFix : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "LastEmailSentDate",
                table: "MedicationReminders",
                type: "datetime2",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LastEmailSentDate",
                table: "MedicationReminders");
        }
    }
}
