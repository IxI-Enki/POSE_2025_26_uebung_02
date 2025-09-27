//@AiCode
namespace SEeToDoList.Logic.Entities.Data
{
    using SEeToDoList.Logic.Modules.Exceptions;

    partial class TdTask : SEeToDoList.Logic.Contracts.IValidatableEntity
    {
        public void Validate(SEeToDoList.Logic.Contracts.IContext context, EntityState entityState)
        {
            bool handled = false;
            BeforeExecuteValidation(ref handled, context, entityState);

            if (!handled)
            {
                // Title required and not whitespace
                if (!IsTitleValid(Title))
                {
                    throw new BusinessRuleException($"The value of {nameof(Title)} '{Title}' is not valid.");
                }

                // If IsCompleted then CompletedOn must have a value
                if (IsCompleted && CompletedOn == null)
                {
                    throw new BusinessRuleException($"If {nameof(IsCompleted)} is true, {nameof(CompletedOn)} must have a value.");
                }

                // Ensure (TdListId, Title) is unique when adding or updating
                if (entityState is EntityState.Added or EntityState.Modified)
                {
                    var db = (Logic.DataContext.ProjectDbContext)context;
                    var exists = db.Set<TdTask>().Any(e => e.Id != Id
                                                           && e.TdListId == TdListId
                                                           && e.Title.ToLower() == Title.ToLower());
                    if (exists)
                    {
                        throw new BusinessRuleException($"A task with the title '{Title}' already exists in this list.");
                    }

                    // Ensure referenced list exists
                    var listExists = db.Set<TdList>().Any(l => l.Id == TdListId);
                    if (!listExists)
                    {
                        throw new BusinessRuleException($"Referenced {nameof(TdListId)} '{TdListId}' does not exist.");
                    }
                }
            }
        }

        #region methods
        public static bool IsTitleValid(string value)
        {
            return string.IsNullOrWhiteSpace(value) == false;
        }
        #endregion methods

        #region partial methods
        partial void BeforeExecuteValidation(ref bool handled, SEeToDoList.Logic.Contracts.IContext context, EntityState entityState);
        #endregion partial methods
    }
}
