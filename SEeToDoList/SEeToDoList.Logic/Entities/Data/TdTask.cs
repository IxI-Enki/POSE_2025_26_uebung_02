//@AiCode
namespace SEeToDoList.Logic.Entities.Data
{
#if SQLITE_ON
    [Table("TdTasks")]
#else
    [Table("TdTasks", Schema = "app")]
#endif
    [Index(nameof(TdListId), nameof(Title), IsUnique = true)]
    /// <summary>
    /// Represents a single task within a to-do list.
    /// </summary>
    public partial class TdTask : EntityObject
    {
        /// <summary>
        /// Gets or sets the title of the task.
        /// </summary>
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the detailed description of the task.
        /// </summary>
        [MaxLength(1000)]
        public string? Description { get; set; }

        /// <summary>
        /// Gets or sets the due date of the task.
        /// </summary>
        public DateTime? DueDate { get; set; }

        /// <summary>
        /// Gets or sets the completion timestamp.
        /// </summary>
        public DateTime? CompletedOn { get; set; }

        /// <summary>
        /// Gets or sets whether the task is completed.
        /// </summary>
        public bool IsCompleted { get; set; }

        /// <summary>
        /// Gets or sets the priority of the task (1=high, 3=low).
        /// </summary>
        public int Priority { get; set; }

        /// <summary>
        /// Gets or sets the foreign key to the owning to-do list.
        /// </summary>
        public IdType TdListId { get; set; }

        #region Navigation properties
        /// <summary>
        /// Gets or sets the owning to-do list.
        /// </summary>
        public SEeToDoList.Logic.Entities.Data.TdList? TdList { get; set; }
        #endregion Navigation properties
    }
}
