//@AiCode
#if GENERATEDCODE_ON
using System.Globalization;
using SEeToDoList.ConApp.Apps;
using SEeToDoList.Logic.Contracts;

namespace SEeToDoList.ConApp.Apps
{
	partial class StarterApp
	{
		partial void AfterCreateMenuItems(ref int menuIdx, List<MenuItem> menuItems)
		{
			menuItems.Add(new()
			{
				Key = "----",
				Text = new string('-', 65),
				Action = (self) => { },
				ForegroundColor = ConsoleColor.DarkGreen,
			});

			menuItems.Add(new()
			{
				Key = $"{++menuIdx}",
				Text = ToLabelText($"{nameof(ImportData).ToCamelCaseSplit()}", "Started the import of the csv-data"),
				Action = (self) =>
				{
#if DEBUG && DEVELOP_ON
					ImportData();
#endif
				},
#if DEBUG && DEVELOP_ON
				ForegroundColor = ConsoleApplication.ForegroundColor,
#else
				ForegroundColor = ConsoleColor.Red,
#endif
			});
		}

		private static void ImportData()
		{
			Task.Run(async () =>
			{
				try
				{
					await ImportDataAsync();
				}
				catch (Exception ex)
				{
					var saveColor = ForegroundColor;
					PrintLine();
					ForegroundColor = ConsoleColor.Red;
					PrintLine($"Error during data import: {ex.Message}");
					ForegroundColor = saveColor;
					PrintLine();
					ReadLine("Continue with the Enter key...");
				}
			}).Wait();
		}

		private static async Task ImportDataAsync()
		{
			IContext context = CreateContext();
			var baseDir = AppContext.BaseDirectory;
			var dataDir = Path.Combine(baseDir, "data");
			var listFile = Path.Combine(dataDir, "tdlist_set.csv");
			var taskFile = Path.Combine(dataDir, "tdtask_set.csv");

			if (File.Exists(listFile) == false || File.Exists(taskFile) == false)
			{
				throw new FileNotFoundException($"CSV files not found in {dataDir}");
			}

			// Import Lists first
			var listsByName = new Dictionary<string, Logic.Entities.Data.TdList>(StringComparer.OrdinalIgnoreCase);
			foreach (var line in File.ReadLines(listFile).Skip(1).Where(l => !string.IsNullOrWhiteSpace(l) && !l.TrimStart().StartsWith('#')))
			{
				var parts = line.Split(';');
				var name = parts.ElementAtOrDefault(0)?.Trim() ?? string.Empty;
				var description = parts.ElementAtOrDefault(1)?.Trim();
				var createdStr = parts.ElementAtOrDefault(2)?.Trim();
				var created = DateTime.TryParse(createdStr, CultureInfo.InvariantCulture, DateTimeStyles.AssumeUniversal, out var dt)
					? dt
					: DateTime.UtcNow;

				if (string.IsNullOrWhiteSpace(name)) continue;
				var entity = new Logic.Entities.Data.TdList
				{
					Name = name,
					Description = description,
					CreatedOn = created,
				};
				try
				{
					await context.TdListSet.AddAsync(entity);
					await context.SaveChangesAsync();
					listsByName[name] = entity;
				}
				catch
				{
					await context.RejectChangesAsync();
				}
			}

			// Import Tasks
			foreach (var line in File.ReadLines(taskFile).Skip(1).Where(l => !string.IsNullOrWhiteSpace(l) && !l.TrimStart().StartsWith('#')))
			{
				var parts = line.Split(';');
				var title = parts.ElementAtOrDefault(0)?.Trim() ?? string.Empty;
				var description = parts.ElementAtOrDefault(1)?.Trim();
				var dueStr = parts.ElementAtOrDefault(2)?.Trim();
				var isCompletedStr = parts.ElementAtOrDefault(3)?.Trim();
				var priorityStr = parts.ElementAtOrDefault(4)?.Trim();
				var listName = parts.ElementAtOrDefault(5)?.Trim() ?? string.Empty;
				var completedStr = parts.ElementAtOrDefault(6)?.Trim();

				if (string.IsNullOrWhiteSpace(title) || string.IsNullOrWhiteSpace(listName)) continue;
				if (listsByName.TryGetValue(listName, out var list) == false) continue;

				DateTime? due = DateTime.TryParse(dueStr, CultureInfo.InvariantCulture, DateTimeStyles.AssumeUniversal, out var dueDt) ? dueDt : null;
				bool isCompleted = bool.TryParse(isCompletedStr, out var ic) && ic;
				int priority = int.TryParse(priorityStr, out var pr) ? pr : 2;
				DateTime? completedOn = DateTime.TryParse(completedStr, CultureInfo.InvariantCulture, DateTimeStyles.AssumeUniversal, out var compDt) ? compDt : null;

				var entity = new Logic.Entities.Data.TdTask
				{
					Title = title,
					Description = description,
					DueDate = due,
					IsCompleted = isCompleted,
					Priority = priority,
					CompletedOn = completedOn,
					TdListId = list.Id,
				};
				try
				{
					await context.TdTaskSet.AddAsync(entity);
					await context.SaveChangesAsync();
				}
				catch
				{
					await context.RejectChangesAsync();
				}
			}
		}
	}
}
#endif
