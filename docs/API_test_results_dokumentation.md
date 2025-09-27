### API Test Results

```mermaid
flowchart LR
  %% Nodes
  client[[Client]]:::client
  db[(DB)]:::db
  validator[[Validator]]:::svc

  %% GET TdLists/count
  g1([GET /TdLists/count]):::get
  r200a[[200 OK<br/>count: 2]]:::ok

  %% POST /TdLists create
  p1([POST /TdLists]):::post
  p1payload>payload<br/>{ name: Personal,<br/> description: Personal list,<br/> createdOn: ISO-8601 }]:::payload
  r201a[[201 Created<br/>id: 3]]:::ok

  %% POST /TdLists duplicate
  p2([POST /TdLists]):::post
  p2payload>payload<br/>{ name: Inbox,<br/> description: Dup test,<br/> createdOn: ISO-8601 }]:::payload
  r400a[[400 BadRequest<br/>duplicate name]]:::bad

  %% GET /TdLists
  g2([GET /TdLists]):::get
  r200b[[200 OK<br/>3 lists]]:::ok

  %% POST /TdTasks valid
  t1([POST /TdTasks]):::post
  t1payload>payload<br/>{ title: Plan trip,<br/> tdListId: 3,<br/> priority: 2,<br/> dueDate: ISO-8601 }]:::payload
  r201b[[201 Created<br/>task id: 3]]:::ok

  %% POST /TdTasks failures
  t2([POST /TdTasks]):::post
  t2payload>payload<br/>{ title: (empty),<br/> tdListId: 3 }]:::payload
  r400b[[400 BadRequest<br/>title invalid]]:::bad

  t3([POST /TdTasks]):::post
  t3payload>payload<br/>{ title: Finish taxes,<br/> isCompleted: true,<br/> completedOn: (missing) }]:::payload
  r400c[[400 BadRequest<br/>completedOn required]]:::bad

  t4([POST /TdTasks]):::post
  t4payload>payload<br/>{ title: Orphan task,<br/> tdListId: 999999 }]:::payload
  r400d[[400 BadRequest<br/>list not found]]:::bad

  %% PUT /TdTasks/{id}
  u1([PUT /TdTasks/3]):::put
  u1payload>payload<br/>{ title: Plan summer trip,<br/> priority: 1 }]:::payload
  r200c[[200 OK]]:::ok

  %% PATCH /TdTasks/{id}
  pa1([PATCH /TdTasks/3]):::patch
  pa1payload>payload<br/>[ { op: replace, path: /isCompleted, value: true },<br/> { op: replace, path: /completedOn, value: ISO-8601 } ]:::payload
  r200d[[200 OK]]:::ok

  %% DELETE /TdTasks/{id}
  d1([DELETE /TdTasks/3]):::del
  r204a[[204 NoContent]]:::ok

  %% GET TdTasks/count
  g3([GET /TdTasks/count]):::get
  r200e[[200 OK<br/>count: 2]]:::ok

  %% Flows
  client --> g1 --> db --> r200a --> client
  client --> p1 --> validator --> db --> r201a --> client
  p1 -.-> p1payload

  client --> p2 --> validator --> r400a --> client
  p2 -.-> p2payload

  client --> g2 --> db --> r200b --> client

  client --> t1 --> validator --> db --> r201b --> client
  t1 -.-> t1payload

  client --> t2 --> validator --> r400b --> client
  t2 -.-> t2payload

  client --> t3 --> validator --> r400c --> client
  t3 -.-> t3payload

  client --> t4 --> validator --> r400d --> client
  t4 -.-> t4payload

  client --> u1 --> db --> r200c --> client
  u1 -.-> u1payload

  client --> pa1 --> db --> r200d --> client
  pa1 -.-> pa1payload

  client --> d1 --> db --> r204a --> client

  client --> g3 --> db --> r200e --> client

  %% Styles
  classDef client fill:#0b1020,stroke:#60a5fa,color:#e5e7eb,stroke-width:1.5px
  classDef svc fill:#0b0f19,stroke:#a78bfa,color:#e5e7eb,stroke-width:1.5px
  classDef db fill:#111827,stroke:#a78bfa,color:#e5e7eb,stroke-width:1.5px
  classDef get fill:#1f2937,stroke:#60a5fa,color:#e5e7eb,stroke-width:1.5px
  classDef post fill:#111827,stroke:#34d399,color:#e5e7eb,stroke-width:1.5px
  classDef put fill:#0b1020,stroke:#22d3ee,color:#e5e7eb,stroke-width:1.5px
  classDef patch fill:#0f172a,stroke:#f59e0b,color:#e5e7eb,stroke-width:1.5px
  classDef del fill:#111827,stroke:#f87171,color:#e5e7eb,stroke-width:1.5px
  classDef ok fill:#0b1324,stroke:#34d399,color:#e5e7eb,stroke-width:1.2px
  classDef bad fill:#1a1020,stroke:#f87171,color:#fde68a,stroke-width:1.2px
  classDef payload fill:#1f2937,stroke:#9ca3af,color:#e5e7eb,stroke-dasharray: 3 3
```

#### Environment

- Base URL: `https://localhost:7074/api`
- Date/Time (UTC ISO-8601 for payloads): `2025-09-27T16:55:32.1725576Z`
- Note: HTTPS with certificate check disabled during testing.

---

#### Test 01: GET /TdLists/count

- Method: GET
- URL: `/TdLists/count`
- Expected: 200 OK with integer count
- Actual: 200 OK
- Response Body:

```
2
```

---

#### Test 02: POST /TdLists (create Personal)

- Method: POST
- URL: `/TdLists`
- Body:

```json
{
  "name": "Personal",
  "description": "Personal list",
  "createdOn": "2025-09-27T16:55:32.1725576Z"
}
```

- Expected: 201 Created
- Actual: 201 Created
- Response Body:

```json
{
  "name": "Personal",
  "description": "Personal list",
  "createdOn": "2025-09-27T16:55:32.1725576Z",
  "completedOn": null,
  "tasks": [],
  "id": 3
}
```

---

#### Test 03 (Failure): POST /TdLists (duplicate Inbox)

- Method: POST
- URL: `/TdLists`
- Body:

```json
{
  "name": "Inbox",
  "description": "Dup test",
  "createdOn": "2025-09-27T16:55:32.1725576Z"
}
```

- Expected: 400 BadRequest (duplicate name)
- Actual: 400 BadRequest
- Response Body:

```
[0] BusinessRuleException: A list with the name 'Inbox' already exists.
```

---

#### Test 04: GET /TdLists (list all)

- Method: GET
- URL: `/TdLists`
- Expected: 200 OK with existing lists
- Actual: 200 OK
- Response Body:

```json
[
  {
    "name": "Inbox",
    "description": "Default list",
    "createdOn": "2025-09-27T16:50:24.0004871Z",
    "completedOn": null,
    "tasks": [],
    "id": 1
  },
  {
    "name": "Work",
    "description": "Work related",
    "createdOn": "2025-09-27T16:50:24.0004871Z",
    "completedOn": null,
    "tasks": [],
    "id": 2
  },
  {
    "name": "Personal",
    "description": "Personal list",
    "createdOn": "2025-09-27T16:55:32.1725576Z",
    "completedOn": null,
    "tasks": [],
    "id": 3
  }
]
```

---

#### Test 05: POST /TdTasks (valid on Personal)

- Method: POST
- URL: `/TdTasks`
- Body:

```json
{
  "title": "Plan trip",
  "description": "Book flights",
  "dueDate": "2025-09-27T16:55:32.1725576Z",
  "isCompleted": false,
  "priority": 2,
  "tdListId": 3
}
```

- Expected: 201 Created
- Actual: 201 Created
- Response Body:

```json
{
  "title": "Plan trip",
  "description": "Book flights",
  "dueDate": "2025-09-27T16:55:32.1725576Z",
  "completedOn": null,
  "isCompleted": false,
  "priority": 2,
  "tdListId": 3,
  "tdList": null,
  "id": 3
}
```

---

#### Test 06 (Failure): POST /TdTasks (missing Title)

- Method: POST
- URL: `/TdTasks`
- Body:

```json
{
  "title": "",
  "description": "missing title",
  "tdListId": 3,
  "isCompleted": false,
  "priority": 3
}
```

- Expected: 400 BadRequest
- Actual: 400 BadRequest
- Response Body:

```
[0] BusinessRuleException: The value of Title '' is not valid.
```

---

#### Test 07 (Failure): POST /TdTasks (isCompleted without CompletedOn)

- Method: POST
- URL: `/TdTasks`
- Body:

```json
{
  "title": "Finish taxes",
  "description": "no completedOn",
  "isCompleted": true,
  "priority": 1,
  "tdListId": 3
}
```

- Expected: 400 BadRequest
- Actual: 400 BadRequest
- Response Body:

```
[0] BusinessRuleException: If IsCompleted is true, CompletedOn must have a value.
```

---

#### Test 08 (Failure): POST /TdTasks (non-existent TdListId)

- Method: POST
- URL: `/TdTasks`
- Body:

```json
{
  "title": "Orphan task",
  "description": "invalid list",
  "isCompleted": false,
  "priority": 3,
  "tdListId": 999999
}
```

- Expected: 400 BadRequest
- Actual: 400 BadRequest
- Response Body:

```
[0] BusinessRuleException: Referenced TdListId '999999' does not exist.
```

---

#### Test 09: PUT /TdTasks/{id} (update)

- Method: PUT
- URL: `/TdTasks/3`
- Body:

```json
{
  "title": "Plan summer trip",
  "description": "Book and plan",
  "dueDate": "2025-09-27T16:55:32.1725576Z",
  "isCompleted": false,
  "priority": 1,
  "tdListId": 3
}
```

- Expected: 200 OK
- Actual: 200 OK
- Response Body:

```json
{
  "title": "Plan summer trip",
  "description": "Book and plan",
  "dueDate": "2025-09-27T16:55:32.1725576Z",
  "completedOn": null,
  "isCompleted": false,
  "priority": 1,
  "tdListId": 3,
  "tdList": null,
  "id": 3
}
```

---

#### Test 10: PATCH /TdTasks/{id} (complete task)

- Method: PATCH
- URL: `/TdTasks/3`
- Body:

```json
[
  {
    "op": "replace",
    "path": "/isCompleted",
    "value": true
  },
  {
    "op": "replace",
    "path": "/completedOn",
    "value": "2025-09-27T16:55:32.1725576Z"
  }
]
```

- Expected: 200 OK
- Actual: 200 OK
- Response Body:

```json
{
  "title": "Plan summer trip",
  "description": "Book and plan",
  "dueDate": "2025-09-27T16:55:32.1725576Z",
  "completedOn": "2025-09-27T16:55:32.1725576Z",
  "isCompleted": true,
  "priority": 1,
  "tdListId": 3,
  "tdList": null,
  "id": 3
}
```

---

#### Test 11: DELETE /TdTasks/{id}

- Method: DELETE
- URL: `/TdTasks/3`
- Expected: 204 NoContent
- Actual: 204 NoContent

---

#### Test 12: GET /TdTasks/count

- Method: GET
- URL: `/TdTasks/count`
- Expected: 200 OK
- Actual: 200 OK
- Response Body:

```
2
```
