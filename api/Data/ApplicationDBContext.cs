using api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace api.Data
{
    public class ApplicationDBContext : IdentityDbContext<AppUser>
    {
        public ApplicationDBContext(DbContextOptions options) : base(options)
        {

        }

        public DbSet<Offer> Offers { get; set; }
        public DbSet<Photo> Photos { get; set; }
        public DbSet<FavouriteOffer> FavouriteOffers { get; set; }

        public DbSet<Make> Makes { get; set; }
        public DbSet<Model> Models { get; set; }
        public DbSet<ModelYear> ModelYears { get; set; }

        public DbSet<OfferCount> OfferCounts { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<FavouriteOffer>(x => x.HasKey(fo => new { fo.AppUserId, fo.OfferId }));

            builder.Entity<FavouriteOffer>()
                .HasOne(fo => fo.AppUser)
                .WithMany(u => u.FavouriteOffers)
                .HasForeignKey(fo => fo.AppUserId)
                .OnDelete(DeleteBehavior.NoAction);

            builder.Entity<FavouriteOffer>()
                .HasOne(fo => fo.Offer)
                .WithMany(o => o.FavouriteOffers)
                .HasForeignKey(o => o.OfferId)
                .OnDelete(DeleteBehavior.NoAction);

            var roles = new List<IdentityRole>
            {
                new IdentityRole
                {
                    Id = "0",
                    Name = "Admin",
                    NormalizedName = "ADMIN",
                    ConcurrencyStamp = "0",
                },
                new IdentityRole
                {
                    Id = "1",
                    Name = "User",
                    NormalizedName = "USER",
                    ConcurrencyStamp = "1",
                }
            };

            builder.Entity<IdentityRole>().HasData(roles);

            builder.Entity<Offer>()
                .HasOne(o => o.AppUser)
                .WithMany()
                .HasForeignKey(o => o.AppUserId)
                .OnDelete(DeleteBehavior.Restrict);

            // Table configuration
            builder.Entity<Offer>(entity =>
            {
                entity.ToTable("Offers");

                // Primary key
                entity.HasKey(o => o.Id);

                // Optional Guid
                entity.Property(o => o.Guid)
                    .HasDefaultValueSql(null)
                    .ValueGeneratedOnAdd();

                // Features stored as comma-separated integers
                var featuresConverter = new ValueConverter<List<FeatureType>?, string>(
                    v => v == null ? string.Empty : string.Join(',', v.Select(f => (int)f)),
                    v => string.IsNullOrEmpty(v)
                        ? new List<FeatureType>()
                        : v.Split(',', StringSplitOptions.RemoveEmptyEntries)
                           .Select(f => (FeatureType)int.Parse(f))
                           .ToList()
                );

                entity.Property(o => o.Features)
                    .HasConversion(featuresConverter);

                // Price column type
                entity.Property(o => o.Price)
                    .HasColumnType("decimal(18,2)");

                // MaxLength for strings
                entity.Property(o => o.Title).HasMaxLength(60).IsRequired();
                entity.Property(o => o.Subtitle).HasMaxLength(80).IsRequired(false);
                entity.Property(o => o.Description).HasMaxLength(2000).IsRequired();
                entity.Property(o => o.Currency).HasMaxLength(3).IsRequired();
                // entity.Property(o => o.Location).IsRequired();
            });

            // Table name for Photos
            builder.Entity<Photo>(entity =>
            {
                entity.ToTable("Photos");
            });

            // Configure Offer <-> Photo (one-to-many)
            builder.Entity<Offer>()
                .HasMany(o => o.Photos)
                .WithOne(p => p.Offer)
                .HasForeignKey(p => p.OfferId)
                .OnDelete(DeleteBehavior.Cascade);

            // Makes and Models configuration
            builder.Entity<Make>(entity =>
            {
                entity.ToTable("Makes");
                entity.HasKey(m => m.MakeId);
                entity.HasMany(m => m.Models)
                    .WithOne(mo => mo.Make)
                    .HasForeignKey(mo => mo.MakeId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            builder.Entity<Model>(entity =>
            {
                entity.ToTable("Models");
                entity.HasKey(mo => mo.ModelId);
                entity.HasMany(mo => mo.Years)
                    .WithOne(y => y.Model)
                    .HasForeignKey(y => y.ModelId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            builder.Entity<ModelYear>(entity =>
            {
                entity.ToTable("ModelYears");
                entity.HasKey(y => y.ModelYearId);
            });

            builder.Entity<OfferCount>(entity =>
            {
                entity.ToTable("OfferCounts");
                entity.HasKey(oc => oc.Id);
                entity.Property(oc => oc.OffersCount).IsRequired();
                entity.Property(oc => oc.LastUpdated).IsRequired();
            });

            // Make sure there are only single row for [make,null] and [make,model]
            builder.Entity<OfferCount>()
                .HasIndex(oc => new { oc.MakeId, oc.ModelId })
                .IsUnique();

            //Index for fast lookups
            builder.Entity<OfferCount>()
                .HasIndex(oc => oc.MakeId);

            //Index for fast lookups
            builder.Entity<OfferCount>()
                .HasIndex(oc => oc.ModelId);
        }
    }
}
