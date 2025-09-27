//@CodeCopy
using Microsoft.EntityFrameworkCore.ChangeTracking;
using SEeToDoList.Logic.Contracts;
using SEeToDoList.Logic.Modules.EventArgs;

namespace SEeToDoList.Logic.DataContext
{
    partial class ProjectDbContext
    {
        /// <summary>
        /// Saves all changes made in this context to the underlying database.
        /// </summary>
        /// <returns>The number of state entries written to the underlying database.</returns>
        internal int ExecuteSaveChanges()
        {
            var changedEntries = ChangeTracker.Entries()
                .Where(e => e.State is EntityState.Added or EntityState.Modified or EntityState.Deleted)
                .ToList();
            var changedEntriesState = changedEntries.Select(e => e.State).ToList();

            BeforeSaveChangesEvent?.Invoke(this, new EntriesSaveChangesEventArgs(changedEntries));

            foreach (var entry in changedEntries)
            {
                BeforeSaveChanges(entry);
            }

            // Separate validatable entries (subset of changedEntries)
            foreach (var entry in changedEntries.Where(e => e.Entity is IValidatableEntity))
            {
                var entity = (IValidatableEntity)entry.Entity;
                entity.Validate(this, entry.State);
            }

            var result = base.SaveChanges();

            foreach (var entry in changedEntries)
            {
                AfterSaveChanges(entry);
            }

            AfterSavedChangesEvent?.Invoke(this, new EntriesSavedChangesEventArgs(changedEntries, changedEntriesState));

            return result;
        }

        /// <summary>
        /// Asynchronously saves all changes made in this context to the underlying database.
        /// </summary>
        /// <returns>A task that represents the asynchronous save operation. The task result contains the number of state entries written to the underlying database.</returns>
        internal async Task<int> ExecuteSaveChangesAsync()
        {
            var changedEntries = ChangeTracker.Entries()
                                              .Where(e => e.State is EntityState.Added or EntityState.Modified or EntityState.Deleted)
                                              .ToList();
            var changedEntriesState = changedEntries.Select(e => e.State).ToList();

            BeforeSaveChangesEvent?.Invoke(this, new EntriesSaveChangesEventArgs(changedEntries));

            foreach (var entry in changedEntries)
            {
                BeforeSaveChanges(entry);
            }

            // Validate all entities before saving
            var validatableEntries = ChangeTracker.Entries()
                                                  .Where(e => e.Entity is IValidatableEntity 
                                                           && (e.State == EntityState.Added || e.State == EntityState.Modified || e.State == EntityState.Deleted));

            foreach (var entry in validatableEntries)
            {
                var validatableEntity = (IValidatableEntity)entry.Entity;

                validatableEntity.Validate(this, entry.State);
            }

            var result = await base.SaveChangesAsync().ConfigureAwait(false);

            foreach (var entry in changedEntries)
            {
                AfterSaveChanges(entry);
            }

            AfterSavedChangesEvent?.Invoke(this, new EntriesSavedChangesEventArgs(changedEntries, changedEntriesState));

            return result;
        }

        /// <summary>
        /// Checks if a handler for the BeforeSaveChangesEvent is registered with the specified method name.
        /// </summary>
        /// <param name="name">The name of the event handler method to check.</param>
        /// <returns>True if a handler with the specified name is registered; otherwise, false.</returns>
        internal bool IsBeforeSavedChangesEventRegistered(string name)
        {
            return BeforeSaveChangesEvent != null &&
                   BeforeSaveChangesEvent.GetInvocationList().Any(d => d.Method.Name == name);
        }

        /// <summary>
        /// Checks if a handler for the AfterSavedChangesEvent is registered with the specified method name.
        /// </summary>
        /// <param name="name">The name of the event handler method to check.</param>
        /// <returns>True if a handler with the specified name is registered; otherwise, false.</returns>
        internal bool IsAfterSaveChangesEventRegistered(string name)
        {
            return AfterSavedChangesEvent != null &&
                   AfterSavedChangesEvent.GetInvocationList().Any(d => d.Method.Name == name);
        }
        #region partial methods
        /// <summary>
        /// Partial method invoked before saving changes for the specified entity entry.
        /// Allows custom logic to be executed prior to persisting changes to the database.
        /// </summary>
        /// <param name="entityEntry">The entity entry that is about to be saved.</param>
        partial void BeforeSaveChanges(EntityEntry entityEntry);

        /// <summary>
        /// Partial method invoked after saving changes for the specified entity entry.
        /// Allows custom logic to be executed after changes have been persisted to the database.
        /// </summary>
        /// <param name="entityEntry">The entity entry that has been saved.</param>
        partial void AfterSaveChanges(EntityEntry entityEntry);
        #endregion partial methods
    }
}
