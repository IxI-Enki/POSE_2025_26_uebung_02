//@CodeCopy
namespace SEeToDoList.Logic.Contracts
{
    public partial interface IValidatableEntity
    {
        void Validate(IContext context, EntityState entityState);
    }
}
