using Microsoft.EntityFrameworkCore;
using PasswordManager.Api.Data;
using PasswordManager.Api.Models;
using System.Security.Cryptography;
using System.Text;

namespace PasswordManager.Api.Services
{
    public class PasswordManagerService : IPasswordManagerService
    {
        private readonly ApplicationDbContext _context;
        private readonly byte[] _encryptionKey;

        public PasswordManagerService(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            // You'll need to add an encryption key to your appsettings.json
            var keyString = configuration["EncryptionKey"];
            _encryptionKey = Convert.FromBase64String(keyString);
        }

        public async Task<byte[]> EncryptPasswordAsync(string password)
        {
            using var aes = Aes.Create();
            aes.Key = _encryptionKey;
            aes.GenerateIV();
            
            using var encryptor = aes.CreateEncryptor();
            using var msEncrypt = new MemoryStream();
            
            // Write IV to the beginning of the stream
            msEncrypt.Write(aes.IV, 0, aes.IV.Length);
            
            using var csEncrypt = new CryptoStream(msEncrypt, encryptor, CryptoStreamMode.Write);
            using var swEncrypt = new StreamWriter(csEncrypt);
            
            swEncrypt.Write(password);
            return msEncrypt.ToArray();
        }

        public async Task<string> DecryptPasswordAsync(byte[] encryptedPassword)
        {
            using var aes = Aes.Create();
            aes.Key = _encryptionKey;
            
            // Extract IV from the beginning of the encrypted data
            var iv = new byte[aes.IV.Length];
            Array.Copy(encryptedPassword, 0, iv, 0, iv.Length);
            aes.IV = iv;
            
            using var decryptor = aes.CreateDecryptor();
            using var msDecrypt = new MemoryStream(encryptedPassword, iv.Length, encryptedPassword.Length - iv.Length);
            using var csDecrypt = new CryptoStream(msDecrypt, decryptor, CryptoStreamMode.Read);
            using var srDecrypt = new StreamReader(csDecrypt);
            
            return srDecrypt.ReadToEnd();
        }

        public async Task<IEnumerable<PasswordEntry>> GetAllPasswordEntriesAsync()
        {
            return await _context.PasswordEntries.ToListAsync();
        }

        public async Task<PasswordEntry> CreatePasswordEntryAsync(string website, string username, string password)
        {
            var encryptedPassword = await EncryptPasswordAsync(password);
            
            var passwordEntry = new PasswordEntry
            {
                Website = website,
                Username = username,
                Password = encryptedPassword,
                CreatedAt = DateTime.UtcNow
            };
            
            _context.PasswordEntries.Add(passwordEntry);
            await _context.SaveChangesAsync();
            return passwordEntry;
        }

        public async Task<PasswordEntry?> GetPasswordEntryByIdAsync(int id)
        {
            return await _context.PasswordEntries.FindAsync(id);
        }

        public async Task<PasswordEntry?> UpdatePasswordEntryAsync(int id, string website, string username, string password)
        {
            var existingEntry = await _context.PasswordEntries.FindAsync(id);
            if (existingEntry == null)
                return null;

            existingEntry.Website = website;
            existingEntry.Username = username;
            existingEntry.Password = await EncryptPasswordAsync(password);

            await _context.SaveChangesAsync();
            return existingEntry;
        }

        public async Task<bool> DeletePasswordEntryAsync(int id)
        {
            var passwordEntry = await _context.PasswordEntries.FindAsync(id);
            if (passwordEntry == null)
                return false;

            _context.PasswordEntries.Remove(passwordEntry);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}