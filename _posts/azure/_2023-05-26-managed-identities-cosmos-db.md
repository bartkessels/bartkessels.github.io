---
title: User-assigned managed identities for Cosmos DB RBAC error message
toc: true
mermaid: true
date: 2023-05-26 12:00:00 +02
categories: [Azure, Managed Identities]
permalink: azure/managed-identities-cosmos-error
tags: [Azure, Microsoft, Managed Identities, Bicep, Cosmos DB, RBAC]
---

STEPS:

* Added role assignments for managed identity
* Updated code to reference the user assigned managed identity using the object Id
* Deployed bicep template and service
    * Service deployment failed with the error message below
* Looked for the RBAC role on this page https://learn.microsoft.com/en-us/azure/cosmos-db/role-based-access-control
    * See that we have the roles for */read thus implying we have the Microsoft.DocumentDB/databaseAccounts/readMetadata role as well
* Searched for the problem, found microsoft docs https://learn.microsoft.com/en-us/azure/cosmos-db/how-to-setup-rbac#built-in-role-definitions
    * Added the `00000000-0000-0000-0000-000000000001` role to the bicep template


Error message

```
Response status code does not indicate success: Forbidden (403);
Substatus: 5301;
ActivityId: [REDACTED];
Reason: (Request blocked by Auth [REDACTED] : Request is blocked because principal [REDACTED] does not have required RBAC permissions to perform action [Microsoft.DocumentDB/databaseAccounts/readMetadata] on resource [/].
Learn more: https://aka.ms/cosmos-native-rbac. ActivityId: [REDACTED], Microsoft.Azure.Documents.Common/2.14.0, Windows/10.0.19045 cosmos-netstandard-sdk/3.30.20);
```