using System;
using System.Collections.Generic;
using System.Linq;
using api.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace api.Data
{
    public class ApplicationDBContext : DbContext
    {
        public ApplicationDBContext(DbContextOptions options)
            : base(options)
        {

        }

        public DbSet<Offer> Offers { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Table configuration
            modelBuilder.Entity<Offer>(entity =>
            {
                entity.ToTable("Offers");

                // Primary key
                entity.HasKey(o => o.Id);

                // Optional Guid
                entity.Property(o => o.Guid)
                      .HasDefaultValueSql("NEWID()"); // SQL Server auto-generates if null

                // Features stored as comma-separated string
                var featuresConverter = new ValueConverter<List<FeatureType>?, string>(
                    v => v == null ? string.Empty : string.Join(',', v),
                    v => string.IsNullOrEmpty(v)
                        ? new List<FeatureType>()
                        : v.Split(',', StringSplitOptions.RemoveEmptyEntries)
                        .Select(f => Enum.Parse<FeatureType>(f))
                        .ToList()
                );

                entity.Property(o => o.Features)
                      .HasConversion(featuresConverter);

                // Price column type
                entity.Property(o => o.Price)
                      .HasColumnType("decimal(18,2)");

                // MaxLength for strings
                entity.Property(o => o.Title).HasMaxLength(200).IsRequired();
                entity.Property(o => o.Subtitle).HasMaxLength(200).IsRequired();
                entity.Property(o => o.Currency).HasMaxLength(3).IsRequired();
                entity.Property(o => o.Location).IsRequired();
            });
        }
    }
}
