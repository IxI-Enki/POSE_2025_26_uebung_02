//@CodeCopy

#if IDINT_ON
global using IdType = System.Int32;
#elif IDLONG_ON
global using IdType = System.Int64;
#elif IDGUID_ON
global using IdType = System.Guid;
#else
global using IdType = System.Int32;
#endif
global using Common = SEeToDoList.Common;
global using CommonContracts = SEeToDoList.Common.Contracts;
global using CommonModels = SEeToDoList.Common.Models;
global using CommonModules = SEeToDoList.Common.Modules;
global using SEeToDoList.Common.Extensions;
