using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FBIArchive.Migrations
{
    /// <inheritdoc />
    public partial class InitialNewCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Defendants_Organizations_OrganizationId",
                table: "Defendants");

            migrationBuilder.DropForeignKey(
                name: "FK_Employees_InvestigationDepartments_InvestigationDepartmentId",
                table: "Employees");

            migrationBuilder.AlterColumn<int>(
                name: "InvestigationDepartmentId",
                table: "Employees",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "OrganizationId",
                table: "Defendants",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Defendants_Organizations_OrganizationId",
                table: "Defendants",
                column: "OrganizationId",
                principalTable: "Organizations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Employees_InvestigationDepartments_InvestigationDepartmentId",
                table: "Employees",
                column: "InvestigationDepartmentId",
                principalTable: "InvestigationDepartments",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Defendants_Organizations_OrganizationId",
                table: "Defendants");

            migrationBuilder.DropForeignKey(
                name: "FK_Employees_InvestigationDepartments_InvestigationDepartmentId",
                table: "Employees");

            migrationBuilder.AlterColumn<int>(
                name: "InvestigationDepartmentId",
                table: "Employees",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<int>(
                name: "OrganizationId",
                table: "Defendants",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_Defendants_Organizations_OrganizationId",
                table: "Defendants",
                column: "OrganizationId",
                principalTable: "Organizations",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Employees_InvestigationDepartments_InvestigationDepartmentId",
                table: "Employees",
                column: "InvestigationDepartmentId",
                principalTable: "InvestigationDepartments",
                principalColumn: "Id");
        }
    }
}
