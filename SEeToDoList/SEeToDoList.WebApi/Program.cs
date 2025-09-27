using Newtonsoft.Json.Serialization;

namespace SEeToDoList.WebApi
{
    public partial class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddControllers()
                            .AddNewtonsoftJson(options =>
                            {
                                options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
                                options.SerializerSettings.PreserveReferencesHandling = Newtonsoft.Json.PreserveReferencesHandling.None;
                                options.SerializerSettings.DateTimeZoneHandling = Newtonsoft.Json.DateTimeZoneHandling.Utc;
                                options.SerializerSettings.ContractResolver = new DefaultContractResolver()
                                {
                                    NamingStrategy = new CamelCaseNamingStrategy()
                                };
                            });       // Add this to the controllers for PATCH-operation.

            // Add ContextAccessor to the services.
            builder.Services.AddScoped<Contracts.IContextAccessor, Controllers.ContextAccessor>();

            // Added GeGe
            builder.Services.AddCors(options =>
            {
                options.AddDefaultPolicy(policy =>
                {
                    policy.WithOrigins(
                              "http://127.0.0.1:4200",
                              "http://localhost:4200",
                              "http://127.0.0.1:54091",
                              "http://localhost:54091",
                              "https://localhost:54091"
                          )
                          .AllowAnyHeader()
                          .AllowAnyMethod();
                });
            });
            // Added GeGe

            var app = builder.Build();

            // Configure the HTTP request pipeline.

            // Ensure CORS headers are present even on redirects
            app.UseCors();

            app.UseHttpsRedirection();

            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}
