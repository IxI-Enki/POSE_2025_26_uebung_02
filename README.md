---
title: 'POSE Exercise 02: SEeToDoList'
exercise_name: 'SEeToDoList'
nr: 2
author: 'IxI-Enki'
course: 'Programming and Software Engineering'
created: '2025-09-27 11:41'
due_date: '2025-09-30 00:00'
school_year: '2025/26'
moodle_link: 'https://edufs.edu.htl-leonding.ac.at/moodle/mod/assign/view.php?id=214265'
---

This repository contains the Moodle assignment for SEeToDoList (assignment code: 2526_78ABIF_78ACIF_POS_GEHR)

## 1. Assignment Overview

The exact exercise content (as fetched from Moodle) is available here:

- [Moodle Assignment (exact content)](angabe/moodle_angabe.md)

## 2. Finished Assignment

![dashboard](<.img/Screenshot 2025-09-28 111256.png>)

![to-do-lists](<.img/Screenshot 2025-09-28 111335.png>)

![tasks-cards](<.img/Screenshot 2025-09-28 111346.png>)

![tasks-lists](<.img/Screenshot 2025-09-28 111356.png>)

### 2.1. WebAPI

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
  classDef CResBody fill:#052e16,stroke:#22c55e,color:#bbf7d0;

  classDef CReqb fill:#0c4a6e55,stroke:##0c4a6e,color:#e0f2fe;
  classDef CResb fill:#052e1655,stroke:#22c55e,color:#bbf7d0;
  req:::CReqb
  res:::CResb

  classDef shaddow fill:#052e1677,stroke:#22c55e,color:#bbf7d0;
  CResBody[Response Body]:::shaddow

  classDef CReqBody  fill:#0c4a6e77,stroke:#38bdf8,color:#e0f2fe;
  CReqBody[Request Body]:::CReqBody

  subgraph API[ ]
    direction LR
    api_ctrl["WebAPI<br>(api/TdLists, api/TdTasks)"]:::node
    Logic["Logic Layer<br>(Validation, EF Core)"]:::node
    DB[("Database<br>(SQLite/EF Core)")]:::node
   
    subgraph req[Request]
      direction LR
      class req CReqb
      G[GET]:::getNode
      P[POST]:::postNode
      U[PUT]:::putNode
      H[PATCH]:::patchNode
      D[DELETE]:::delNode

      subgraph CReqBody[*Example POST* <br>Request Body JSON]
        direction TB
        %% To ensure left alignment (LINKSBÜNDIG) in Mermaid, use <div style="text-align:left">...</div> inside the label.
        CReqJson["<div style='text-align:left'>{<br>&nbsp;&nbsp;&quot;title&quot;: &quot;Plan trip&quot;,<br>&nbsp;&nbsp;&quot;description&quot;: &quot;Book flights&quot;,<br>&nbsp;&nbsp;&quot;dueDate&quot;: &quot;2025-09-27T17:39:48&quot;,<br>&nbsp;&nbsp;&quot;isCompleted&quot;: false,<br>&nbsp;&nbsp;&quot;priority&quot;: 2,<br>&nbsp;&nbsp;&quot;tdListId&quot;: 1<br>}</div>"]:::node
      end
    end

    subgraph CLIENT[Client]
      direction LR
      CReq["Compose Request<br>(Invoke-WebRequest)"]:::node
      CRes["Render Response<br>(HTTP Status / JSON)"]:::node
      %% pretty JSON bodies as nested subgraphs under client nodes
    end 


    subgraph res[Response]
      direction LR
      class res CResb
      R200[200 OK]:::ok200
      R201[201 Created]:::created201
      R4xx[4xx Error]:::err4xx
      R204[204 No Content]:::no204

      subgraph CResBody[*Example OK* <br> Response Body JSON]
        direction TB
        CResJson["<div style='text-align:left'>{<br>&nbsp;&nbsp;&quot;title&quot;: &quot;Plan trip&quot;,<br>&nbsp;&nbsp;&quot;description&quot;: &quot;Book flights&quot;,<br>&nbsp;&nbsp;&quot;dueDate&quot;: &quot;2025-09-27T17:39:48.0157651Z&quot;,<br>&nbsp;&nbsp;&quot;completedOn&quot;: null,<br>&nbsp;&nbsp;&quot;isCompleted&quot;: false,<br>&nbsp;&nbsp;&quot;priority&quot;: 2,<br>&nbsp;&nbsp;&quot;tdListId&quot;: 1,<br>&nbsp;&nbsp;&quot;tdList&quot;: null,<br>&nbsp;&nbsp;&quot;id&quot;: 4<br>}</div>"]:::node
      end
    end

end

  %% request flows (one per method)
  G[GET]:::getNode
  P[POST]:::postNode
  H[PATCH]:::patchNode
  U[PUT]:::putNode
  D[DELETE]:::delNode

  CReq --> CReqBody --> P --> api_ctrl
  CReq --> G --> api_ctrl
  CReq --> U --> api_ctrl
  CReq --> H --> api_ctrl
  CReq --> D --> api_ctrl

  api_ctrl <-. Delegate .-> Logic:::edge
  Logic <-. Persist/Query .-> DB:::edge

  %% response flows (one per status type)
  R200[200 OK]:::ok200
  R201[201 Created]:::created201
  R4xx[4xx Error]:::err4xx
  R204[204 No Content]:::no204

  api_ctrl --> R200 --> CResBody --> CRes
  api_ctrl --> R201 ----> CRes
  api_ctrl --> R4xx ----> CRes
  api_ctrl --> R204 ----> CRes

  class CLIENT,API dark;
```


---

## 3. Submission Guidelines

- Submission is done via a Git repository with a clean commit history.

- Diagrams must be embedded as images in Markdown files.

## 4. Recommended Git Workflow

- Keep the `master` branch stable.

- Use feature branches for discrete tasks.

- Write clear, concise, and meaningful commit messages.

## 5. Repository Structure

- `angabe/`: Contains the original assignment description (exact Moodle content).

- `docs/`: Holds diagrams, explanations, other documentation and external sources like PDFs.

- Course specific directories:
  e.g. `<course_specific_directory>/` (for example `sql/` for DDL, DML, and example queries).

### API Test Documentation

- See detailed REST tests, results, and diagram: [docs/API_test_results_dokumentation.md](docs/API_test_results_dokumentation.md)

---

<!--
Update Log
  - Description   : Updated README formatting and clarified assignment structure.
  - Date          : 2025-09-27 12:10
  - Author        : IxI-Enki
  - Version       : 1.1.1
-->
