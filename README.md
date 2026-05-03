# Talent Hub (JobBoard)

A responsive job board application built with TanStack Start + React + TypeScript.

## Highlights

- Seeker and Admin role experiences
- Responsive mobile-first UI
- Custom SVG icon system (`BrandIcons`)
- Pill-style mobile navigation (icons only)
- Job browsing, details, bookmarks, and apply flow
- Application tracking with "What's next" actions for Interview/Offered
- Admin CRUD for jobs
- Admin applicant review and status updates
- Role-specific profiles (`/profile` and `/admin/profile`)

## Tech Stack

- React 19
- TypeScript
- TanStack Start / TanStack Router
- Vite
- Tailwind CSS
- Radix UI primitives

## Project Structure

- `src/routes` - route screens
- `src/components/layout` - page shells/layout wrappers
- `src/components/shared` - reusable visual components
- `src/components/ui` - design-system primitives
- `src/context` - app state and role/job/application logic
- `src/data` - mock data and helpers

## Main User Flows

### Job Seeker

1. Browse jobs from `Home` and `Jobs`
2. Open `Job Details`
3. Apply via `Apply Now` or `Open Apply Form`
4. Track status in `My Applications`
5. Use "What's next" actions when status is `Interview` or `Offered`

### Admin

1. Access `Admin Dashboard`
2. Create/Edit/Delete jobs
3. Change job publish state and status
4. View applicant details in `Admin Applications`
5. Update applicant status
6. Use dedicated `Admin Profile`

## Local Development

Install dependencies:

```bash
npm install
```

Run dev server:

```bash
npm run dev
```

Build production output:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## Notes

- The app currently uses in-memory/mock state from `AppContext`.
- Route-level metadata can be expanded for SEO/social cards as needed.
- UI branding is configured in `src/styles.css` with CSS variables and gradients.
