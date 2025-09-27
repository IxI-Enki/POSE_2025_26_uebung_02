//@CodeCopy
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace SEeToDoList.Logic.Modules.EventArgs
{
    /// <summary>
    /// Provides event data for save changes operations, including the affected entity entries.
    /// </summary>
    internal partial class EntriesSaveChangesEventArgs : SaveChangesEventArgs
    {
        /// <summary>
        /// Gets the list of entity entries involved in the save changes operation.
        /// </summary>
        public IReadOnlyList<EntityEntry> Entries { get; }

        /// <summary>
        /// Initializes a new instance of the <see cref="EntriesSaveChangesEventArgs"/> class.
        /// </summary>
        /// <param name="entries">The entity entries affected by the save changes operation.</param>
        public EntriesSaveChangesEventArgs(IReadOnlyList<EntityEntry> entries)
            : base(acceptAllChangesOnSuccess: true)
        {
            Entries = entries;
        }
    }
}
