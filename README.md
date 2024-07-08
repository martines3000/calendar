# Koledar

## Description

### Libs used

- [Next.js](https://nextjs.org/)
- [Ant Design](https://ant.design/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Supabase](https://supabase.com/)
- [FullCalendar](https://fullcalendar.io/)
- [React Query](https://tanstack.com/query/v3)
- [Radix](https://radix-ui.com/)
- [Supabase](https://supabase.com/)
- [Biome.sh](https://biomejs.dev/)

### Development

```bash
# Run the development server:
pnpm dev
```

### Install dependencies

```bash
pnpm install
```

### Lint

```bash
pnpm lint

# Fix linting issues
pnpm lint:fix
```

### Generate database types

```bash
pnpm supabase:generate
```

### Environment variables

Set the following environment variables in a `.env` file:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Only needed for creating new users
SERVICE_ROLE_KEY=your-service-role-key
```

### Create a new user

```bash
bun scripts/createNewUser.ts
```

### Delete a user

```bash
bun scripts/deleteUserByEmail.ts
```
