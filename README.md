# Server.js Overview

This document provides an overview of the `server.js` file, which is part of a Node.js application using Express and MySQL for managing program study data.

## Key Components

- **Express Framework**: Used for creating the server and handling API requests.
- **Body-Parser Middleware**: Parses incoming request bodies before they reach the request handler.
- **MySQL Database Connection**: Establishes a connection to the MySQL database using provided credentials.

## Functionality

1. **Database Connection Setup**: Establishes a connection to the MySQL database with the specified host, user, password, and database name.

2. **Middleware Configuration**:
   - Uses `body-parser` to parse JSON request bodies.
   - Serves static files from the `public` directory.

3. **API Endpoints**:
   - `GET /programs`: Fetches all records from the `program_studi` table in the database and returns them as a JSON array.
   - `POST /programs`: Receives program data in the request body and inserts a new record into the `program_studi` table.

## Database Configuration

The MySQL connection is configured with the following details:
- **Host**: localhost
- **User**: root
- **Password**: new_password
- **Database**: ahp_db

## Running the Application

To start the server, run `node server.js`. The server listens on port 3000 and connects to the MySQL database upon starting.