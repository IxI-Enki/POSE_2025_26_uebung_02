//@AiCode
namespace SEeToDoList.Logic.Entities.Data
{
#if SQLITE_ON
    [Table("TdLists")]
#else
    [Table("TdLists", Schema = "app")]
#endif
    [Index(nameof(Name), IsUnique = true)]
    /// <summary>
    /// Represents a to-do list that groups tasks.
    /// </summary>
    public partial class TdList : EntityObject
    {
        /// <summary>
        /// Gets or sets the unique name of the list.
        /// </summary>
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the description of the list.
        /// </summary>
        [MaxLength(500)]
        public string? Description { get; set; }

        /// <summary>
        /// Gets or sets the creation timestamp.
        /// </summary>
        public DateTime CreatedOn { get; set; }

        /// <summary>
        /// Gets or sets the completion timestamp if the list is completed.
        /// This value can be computed based on its tasks.
        /// </summary>
        public DateTime? CompletedOn { get; set; }

        #region Navigation properties
        /// <summary>
        /// Gets or sets the tasks that belong to this list.
        /// </summary>
        public List<SEeToDoList.Logic.Entities.Data.TdTask> Tasks { get; set; } = [];
        #endregion Navigation properties
    }
}
