using PasswordManager.Api.Models;

namespace PasswordManager.Api.Services
{
    public interface IPasswordManagerService
    {
        Task<IEnumerable<PasswordEntry>> GetAllPasswordEntriesAsync();
        Task<PasswordEntry> CreatePasswordEntryAsync(string website, string username, string password);
        Task<PasswordEntry?> GetPasswordEntryByIdAsync(int id);
        Task<PasswordEntry?> UpdatePasswordEntryAsync(int id, string website, string username, string password);
        Task<bool> DeletePasswordEntryAsync(int id);
        Task<string> DecryptPasswordAsync(byte[] encryptedPassword);
        Task<byte[]> EncryptPasswordAsync(string password);
    }
}