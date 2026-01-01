using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BioAgeCalculator.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "BioAgeCalculations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    ChronologicalAge = table.Column<int>(type: "INTEGER", nullable: false),
                    Height = table.Column<double>(type: "REAL", nullable: false),
                    Weight = table.Column<double>(type: "REAL", nullable: false),
                    Waist = table.Column<double>(type: "REAL", nullable: false),
                    Neck = table.Column<double>(type: "REAL", nullable: false),
                    Hips = table.Column<double>(type: "REAL", nullable: true),
                    IsFemale = table.Column<bool>(type: "INTEGER", nullable: false),
                    FatPercentage = table.Column<double>(type: "REAL", nullable: false),
                    BMI = table.Column<double>(type: "REAL", nullable: false),
                    BiologicalAge = table.Column<double>(type: "REAL", nullable: false),
                    HealthStatus = table.Column<string>(type: "TEXT", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BioAgeCalculations", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BioAgeCalculations");
        }
    }
}
