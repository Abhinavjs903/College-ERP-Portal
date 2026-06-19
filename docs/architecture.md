# College ERP Lite Architecture

## Overview

College ERP Lite follows a modern full-stack architecture consisting of:

* React Frontend
* Node.js + Express Backend
* MongoDB Database

## System Architecture

```text
+-------------------+
|   React Frontend  |
+-------------------+
          |
          v
+-------------------+
| Express REST API  |
+-------------------+
          |
          v
+-------------------+
|     MongoDB       |
+-------------------+
```

## Frontend Responsibilities

* User Interface
* Routing
* Authentication State
* Dashboard Views
* API Requests

## Backend Responsibilities

* Authentication
* Business Logic
* Validation
* Database Operations
* Authorization

## Database Responsibilities

* User Data
* Attendance Records
* Notices
* Academic Data
* Administrative Data
