﻿using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GHMS.DAL.Migrations
{
    /// <inheritdoc />
    public partial class AddCervicalMucus : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CervicalMucus",
                table: "MenstrualPeriodDays",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CervicalMucus",
                table: "MenstrualPeriodDays");
        }
    }
}
