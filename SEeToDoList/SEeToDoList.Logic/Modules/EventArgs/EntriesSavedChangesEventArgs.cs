//@CodeCopy
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace SEeToDoList.Logic.Modules.EventArgs
{
    /// <summary>
    /// Provides data for the event raised after entries have been saved and their states changed.
    /// </summary>
    internal partial class EntriesSavedChangesEventArgs : SavedChangesEventArgs
    {
        /// <summary>
        /// Gets the list of entity entries that were saved.
        /// </summary>
        public IReadOnlyList<EntityEntry> Entries { get; }

        /// <summary>
        /// Gets the list of states for the changed entries.
        /// </summary>
        public IReadOnlyList<EntityState> ChangedEntriesStates { get; }

        /// <summary>
        /// Initializes a new instance of the <see cref="EntriesSavedChangesEventArgs"/> class.
        /// </summary>
        /// <param name="entries">The entity entries that were saved.</param>
        /// <param name="changedEntriesState">The states of the changed entries.</param>
        public EntriesSavedChangesEventArgs(IReadOnlyList<EntityEntry> entries, IReadOnlyList<EntityState> changedEntriesState)
            : base(acceptAllChangesOnSuccess: true, entries.Count())
        {
            Entries = entries;
            ChangedEntriesStates = changedEntriesState;
        }
    }
}
