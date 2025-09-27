### API Test Results

```mermaid
flowchart LR
  classDef dark fill:#0b0f17,stroke:#334155,color:#e5e7eb;
  classDef node fill:#111827,stroke:#4b5563,color:#e5e7eb;
  classDef edge stroke:#64748b,color:#94a3b8;
  %% request method node styles
  classDef getNode fill:#064e3b,stroke:#10b981,color:#d1fae5;
  classDef postNode fill:#0c4a6e,stroke:#38bdf8,color:#e0f2fe;
  classDef putNode fill:#3f2a0d,stroke:#f59e0b,color:#fffbeb;
  classDef patchNode fill:#3b0764,stroke:#a855f7,color:#f3e8ff;
  classDef delNode fill:#450a0a,stroke:#ef4444,color:#fee2e2;
  %% response node styles
  classDef ok200 fill:#052e16,stroke:#22c55e,color:#bbf7d0;
  classDef created201 fill:#042f2e,stroke:#14b8a6,color:#99f6e4;
  classDef err4xx fill:#3f1d1d,stroke:#f87171,color:#fee2e2;
  classDef no204 fill:#1f2937,stroke:#9ca3af,color:#e5e7eb;

  subgraph CLIENT[Client]
    direction LR
    CReq["Compose Request<br>(Invoke-WebRequest)"]:::node
    CRes["Render Response<br>(HTTP Status / JSON)"]:::node
    %% pretty JSON bodies as nested subgraphs under client nodes
    subgraph CReqBody[Request Body (JSON)]
      direction TB
      CReqJson["{<br>  \"title\": \"Plan trip\",<br>  \"description\": \"Book flights\",<br>  \"dueDate\": \"<now>\",<br>  \"isCompleted\": false,<br>  \"priority\": 2,<br>  \"tdListId\": 1<br>}"]:::node
    end
    subgraph CResBody[Response Body (JSON)]
      direction TB
      CResJson["{<br>  \"title\": \"Plan trip\",<br>  \"description\": \"Book flights\",<br>  \"dueDate\": \"2025-09-27T17:39:48.0157651Z\",<br>  \"completedOn\": null,<br>  \"isCompleted\": false,<br>  \"priority\": 2,<br>  \"tdListId\": 1,<br>  \"tdList\": null,<br>  \"id\": 4<br>}"]:::node
    end
  end 

  subgraph API[ ]
    direction LR
    api_ctrl["WebAPI<br>(api/TdLists, api/TdTasks)"]:::node
    Logic["Logic Layer<br>(Validation, EF Core)"]:::node
    DB[("Database<br>(SQLite/EF Core)")]:::node
  
    subgraph req[Request]
      direction LR
      class req getNode
      G[GET]:::getNode
      P[POST]:::postNode
      U[PUT]:::putNode
      H[PATCH]:::patchNode
      D[DELETE]:::delNode
    end
    subgraph res[Response]
      direction LR
      class res ok200
      R200[200 OK]:::ok200
      R201[201 Created]:::created201
      R4xx[4xx Error]:::err4xx
      R204[204 No Content]:::no204
    end
  end


  %% request flows (one per method)
  G[GET]:::getNode
  P[POST]:::postNode
  U[PUT]:::putNode
  H[PATCH]:::patchNode
  D[DELETE]:::delNode

  CReq --> G --> api_ctrl
  CReq --> P --> api_ctrl
  CReq --> U --> api_ctrl
  CReq --> H --> api_ctrl
  CReq --> D --> api_ctrl

  api_ctrl -- Calls --> Logic:::edge
  Logic -- Persist/Query --> DB:::edge

  %% response flows (one per status type)
  R200[200 OK]:::ok200
  R201[201 Created]:::created201
  R4xx[4xx Error]:::err4xx
  R204[204 No Content]:::no204

  api_ctrl --> R200 --> CRes
  api_ctrl --> R201 --> CRes
  api_ctrl --> R4xx --> CRes
  api_ctrl --> R204 --> CRes

  class CLIENT,API dark;
```

#### Context

- Base URL: `https://localhost:7074/api`
- Test time (UTC): see timestamps in responses
- Entities: `TdLists`, `TdTasks`

---

#### T01: GET /TdLists/count

Request:

```http
GET /api/TdLists/count
```

Response:

```http
200 OK
Body: 3
```

Notes: Verifies API is reachable and lists exist.

---

#### T02: POST /TdLists (create Personal)

Request:

```http
POST /api/TdLists
Content-Type: application/json

{
  "name": "Personal",
  "description": "Personal list",
  "createdOn": "<now>"
}
```

Response:

```http
400 BadRequest
Body: [0] BusinessRuleException: A list with the name 'Personal' already exists.
```

Notes: Expected failure due to unique Name constraint.

---

#### T03: POST /TdLists (create Inbox duplicate)

Request:

```http
POST /api/TdLists
Content-Type: application/json

{
  "name": "Inbox",
  "description": "Dup test",
  "createdOn": "<now>"
}
```

Response:

```http
400 BadRequest
Body: [0] BusinessRuleException: A list with the name 'Inbox' already exists.
```

Notes: Expected failure; duplicates are prevented.

---

#### T04: GET /TdLists (list all)

Request:

```http
GET /api/TdLists
```

Response (truncated):

```json
[
  { "name": "Inbox", "id": 1, "tasks": [] },
  { "name": "Work", "id": 2, "tasks": [] },
  { "name": "Personal", "id": 3, "tasks": [] }
]
```

Notes: Confirms existing three lists.

---

#### T05: POST /TdTasks (create Plan trip)

Request:

```http
POST /api/TdTasks
Content-Type: application/json

{
  "title": "Plan trip",
  "description": "Book flights",
  "dueDate": "<now>",
  "isCompleted": false,
  "priority": 2,
  "tdListId": 1
}
```

Response:

```json
{
  "title": "Plan trip",
  "description": "Book flights",
  "dueDate": "2025-09-27T17:39:48.0157651Z",
  "completedOn": null,
  "isCompleted": false,
  "priority": 2,
  "tdListId": 1,
  "tdList": null,
  "id": 4
}
```

Notes: Task created under list `1` (Inbox).

---

#### T06: POST /TdTasks (missing title)

Request:

```http
POST /api/TdTasks
Content-Type: application/json

{
  "title": "",
  "description": "missing title",
  "tdListId": 1,
  "isCompleted": false,
  "priority": 3
}
```

Response:

```http
400 BadRequest
Body: [0] BusinessRuleException: The value of Title '' is not valid.
```

Notes: Expected validation failure.

---

#### T07: POST /TdTasks (completed without completedOn)

Request:

```http
POST /api/TdTasks
Content-Type: application/json

{
  "title": "Finish taxes",
  "description": "no completedOn",
  "isCompleted": true,
  "priority": 1,
  "tdListId": 1
}
```

Response:

```http
400 BadRequest
Body: [0] BusinessRuleException: If IsCompleted is true, CompletedOn must have a value.
```

Notes: Expected validation failure.

---

#### T08: POST /TdTasks (invalid TdListId)

Request:

```http
POST /api/TdTasks
Content-Type: application/json

{
  "title": "Orphan task",
  "description": "invalid list",
  "isCompleted": false,
  "priority": 3,
  "tdListId": 999999
}
```

Response:

```http
400 BadRequest
Body: [0] BusinessRuleException: Referenced TdListId '999999' does not exist.
```

Notes: Expected referential integrity failure.

---

#### T09: PUT /TdTasks/{id} (update task)

Request:

```http
PUT /api/TdTasks/4
Content-Type: application/json

{
  "title": "Plan summer trip",
  "description": "Book and plan",
  "dueDate": "2025-09-27T17:39:48.0157651Z",
  "isCompleted": false,
  "priority": 1,
  "tdListId": 1
}
```

Response (200 OK):

```json
{
  "title": "Plan summer trip",
  "description": "Book and plan",
  "dueDate": "2025-09-27T17:39:48.0157651Z",
  "completedOn": null,
  "isCompleted": false,
  "priority": 1,
  "tdListId": 1,
  "tdList": null,
  "id": 4
}
```

Notes: Update succeeded.

---

#### T10: PATCH /TdTasks/{id} (complete task)

Request:

```http
PATCH /api/TdTasks/4
Content-Type: application/json

[
  { "op": "replace", "path": "/isCompleted", "value": true },
  { "op": "replace", "path": "/completedOn", "value": "2025-09-27T17:39:48.0157651Z" }
]
```

Response (200 OK):

```json
{
  "title": "Plan summer trip",
  "description": "Book and plan",
  "dueDate": "2025-09-27T17:39:48.0157651Z",
  "completedOn": "2025-09-27T17:39:48.0157651Z",
  "isCompleted": true,
  "priority": 1,
  "tdListId": 1,
  "tdList": null,
  "id": 4
}
```

Notes: Task is now completed.

---

#### T11: DELETE /TdTasks/{id}

Request:

```http
DELETE /api/TdTasks/4
```

Response:

```http
204 NoContent
```

Notes: Task deleted successfully.

---

#### T12: GET /TdTasks/count

Request:

```http
GET /api/TdTasks/count
```

Response:

```http
200 OK
Body: 2
```

Notes: Reflects one task removed; remaining count is 2.
