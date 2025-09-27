//@AiCode
namespace SEeToDoList.Logic.Entities.Data
{
    using SEeToDoList.Logic.Modules.Exceptions;

    partial class TdList : SEeToDoList.Logic.Contracts.IValidatableEntity
    {
        public void Validate(SEeToDoList.Logic.Contracts.IContext context, EntityState entityState)
        {
            bool handled = false;
            BeforeExecuteValidation(ref handled, context, entityState);

            if (!handled)
            {
                // Name required and not whitespace
                if (!IsNameValid(Name))
                {
                    throw new BusinessRuleException($"The value of {nameof(Name)} '{Name}' is not valid.");
                }

                // Ensure unique Name (case-insensitive) when adding or updating
                if (entityState is EntityState.Added or EntityState.Modified)
                {
                    var db = (Logic.DataContext.ProjectDbContext)context;
                    var exists = db.Set<TdList>().Any(e => e.Id != Id && e.Name.ToLower() == Name.ToLower());
                    if (exists)
                    {
                        throw new BusinessRuleException($"A list with the name '{Name}' already exists.");
                    }
                }
            }
        }

        #region methods
        public static bool IsNameValid(string value)
        {
            return string.IsNullOrWhiteSpace(value) == false;
        }
        #endregion methods

        #region partial methods
        partial void BeforeExecuteValidation(ref bool handled, SEeToDoList.Logic.Contracts.IContext context, EntityState entityState);
        #endregion partial methods
    }
}
