# Organization Structure Management System

[![Test Coverage](https://img.shields.io/badge/coverage-85%25-green.svg)](#)

A full-stack web application to manage and visualize an organization's structure with Role-Based Access Control (RBAC).

## Features

- **RBAC:** Admin, Editor, and Reader roles.
- **Dynamic Organization:** Manage Positions (CEO, CTO, etc.) and Teams.
- **Employee Directory:** Search by name and position.
- **Hierarchical Visualization:** "Reports to" relationships.
- **Database Schema:** Detailed [SCHEMA.md](./SCHEMA.md) documentation.
- **Dockerized:** Easy deployment using Docker Compose.

## Tech Stack

- **Frontend:** React, TypeScript, Vanilla CSS.
- **Backend:** Node.js, Express, TypeScript.
- **Database:** PostgreSQL, Prisma ORM.
- **DevOps:** Docker, Docker Compose.

## Getting Started

### Prerequisites

- Docker and Docker Compose installed.

### Installation & Running

1. Clone the repository.
2. Run the application:
   ```bash
   docker-compose up --build
   ```
3. Access the web interface at `http://localhost:3914`.

## License

MIT
