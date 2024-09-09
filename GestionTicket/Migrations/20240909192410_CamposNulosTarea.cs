using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GestionTicket.Migrations
{
    /// <inheritdoc />
    public partial class CamposNulosTarea : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Tareas_TipoSistemas_TipoSistemaID",
                table: "Tareas");

            migrationBuilder.AlterColumn<string>(
                name: "UsuarioID",
                table: "Tareas",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<int>(
                name: "TipoSistemaID",
                table: "Tareas",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<decimal>(
                name: "TiempoEstimado",
                table: "Tareas",
                type: "decimal(18,2)",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<DateTime>(
                name: "FechaInicio",
                table: "Tareas",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.AlterColumn<bool>(
                name: "Eliminado",
                table: "Tareas",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AddColumn<bool>(
                name: "Estado",
                table: "Tareas",
                type: "bit",
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Estado",
                table: "SubTareas",
                type: "bit",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddForeignKey(
                name: "FK_Tareas_TipoSistemas_TipoSistemaID",
                table: "Tareas",
                column: "TipoSistemaID",
                principalTable: "TipoSistemas",
                principalColumn: "TipoSistemaID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Tareas_TipoSistemas_TipoSistemaID",
                table: "Tareas");

            migrationBuilder.DropColumn(
                name: "Estado",
                table: "Tareas");

            migrationBuilder.AlterColumn<int>(
                name: "UsuarioID",
                table: "Tareas",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "TipoSistemaID",
                table: "Tareas",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "TiempoEstimado",
                table: "Tareas",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "FechaInicio",
                table: "Tareas",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Eliminado",
                table: "Tareas",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Estado",
                table: "SubTareas",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AddForeignKey(
                name: "FK_Tareas_TipoSistemas_TipoSistemaID",
                table: "Tareas",
                column: "TipoSistemaID",
                principalTable: "TipoSistemas",
                principalColumn: "TipoSistemaID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
