//@CodeCopy
#if ACCOUNT_ON
namespace SEeToDoList.WebApi.Contracts
{
    partial interface IContextAccessor
    {
        string SessionToken { set; }
    }
}
#endif
