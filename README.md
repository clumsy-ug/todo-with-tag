# Your personalized todo app

[Try in browser](https://todo-with-tag.vercel.app/)

## What you can do
- Signin/Signup/Signout by email and password
- CRUD(Create/Read/Update/Delete) of todo and tag 
- Tie any tag to each todo
- Search todo by tag

## Getting Started

### Prerequisites
- Docker Desktop(includes Docker CLI and Docker Compose)

### Setup

1. Clone the repository
```bash
git clone https://github.com/clumsy-ug/todo-with-tag.git
cd todo-with-tag
```

2. Create an .env.local file based on .env.example
```bash
cp .env.example .env.local
```

3. Add your Supabase credentials to .env.local
```
NEXT_PUBLIC_SUPABASE_URL=<YOUR_SUPABASE_URL>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<YOUR_SUPABASE_ANON_KEY>
```

4. Build and run the app with Docker Compose
```bash
docker compose up --build
```

&nbsp;&nbsp;&nbsp;If you want to rebuild dependencies or the entire system, ignoring the cache, you can use
```bash
docker compose up --build --no-cache
```

5. Open your browser at http://localhost:3000 to view the app.
