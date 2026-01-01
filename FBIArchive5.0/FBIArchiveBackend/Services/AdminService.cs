
using FBIArchive.Models;
using Microsoft.EntityFrameworkCore;
using FBIArchive.Data;

namespace FBIArchive.Services
{
    public interface IAdminService
    {
        Task<Document?> UpdateDocumentAsync(int id, UpdateDocumentDto dto);
    }

    public class AdminService : IAdminService
    {
        private readonly FBIArchiveContext _context;

        public AdminService(FBIArchiveContext context)
        {
            _context = context;
        }

        public async Task<Document?> UpdateDocumentAsync(int id, UpdateDocumentDto dto)
        {
            var document = await _context.Documents.FindAsync(id);
            if (document == null) return null;

            if (!string.IsNullOrEmpty(dto.Name))
                document.Name = dto.Name;

            if (!string.IsNullOrEmpty(dto.SecurityLevel))
                document.SecurityLevel = dto.SecurityLevel;

            if (!string.IsNullOrEmpty(dto.DocumentType))
                document.DocumentType = dto.DocumentType;

            if (dto.CaseId.HasValue)
                document.CaseId = dto.CaseId.Value;

            if (dto.SeriesId.HasValue)
                document.SeriesId = dto.SeriesId.Value;

            if (dto.CreateDate.HasValue)
                document.CreateDate = dto.CreateDate.Value;

            await _context.SaveChangesAsync();
            return document;
        }
    }
}