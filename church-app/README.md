# Church Youth Activities App

A simple web application for managing church youth activities, attendance tracking, and preparation checklists.

## Features

- User management (register, login, role-based permissions)
- Activities planning and management
- Attendance tracking
- Preparation checklists for activities
- Responsive design for mobile and desktop

## Tech Stack

- **Frontend**: SvelteKit, TailwindCSS
- **Backend**: Supabase (PostgreSQL database)

## Setup Instructions

### Prerequisites

- Node.js (v16+)
- npm or yarn
- Supabase account

### Supabase Setup

1. Create a new Supabase project
2. Execute the SQL script in `src/lib/db_schema.sql` in the Supabase SQL Editor
3. Copy your Supabase URL and anon key

### Application Setup

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Update the Supabase configuration in `src/lib/supabase.ts` with your URL and anon key
4. Run the development server:
   ```bash
   npm run dev
   ```

## Deployment

To create a production build:

```bash
npm run build
```

You can then deploy the contents of the `build` directory to your hosting provider of choice.

## License

This project is created for educational purposes as part of a thesis project.
