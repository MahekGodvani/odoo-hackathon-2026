# AssertFlow - Frontend Application

This directory contains the React 19 single-page client application for AssertFlow, built with TypeScript, Vite, Redux Toolkit, and React Router DOM.

---

## 🎨 Application Architecture

### 1. Routing & Pages (`src/pages/`)
Routing is powered by `react-router-dom` v7. The main pages include:
- **Dashboard**: Core widgets, KPI cards, activity feeds, and asset charts.
- **Assets**: Searchable asset grid, registration form, and category filters.
- **Resource Booking**: Visual calendar/scheduler for reserving company resources.
- **Maintenance**: Logs for scheduling check-ups, repair requests, and active service requests.
- **AI Assistant**: Natural language database agent UI for direct interaction.
- **Organization & Settings**: User profiles, password modification, and system configurations.

### 2. State Management (`src/store/`)
Global application state is managed using **Redux Toolkit**:
- **Auth Slice (`src/store/authSlice.ts`)**: Handles user login status, session tokens, permissions, and roles.
- **Store Configuration (`src/store/index.ts`)**: Combines reducers and configures Redux middleware.

### 3. Reusable UI Components (`src/components/`)
- **Dashboard Modules (`src/components/dashboard/`)**: Specialized widgets like [KPICards], [DashboardCharts], [MaintenanceList], and [RecentActivity].
- **Layout System (`src/components/layout/`)**: [Layout] wrapper providing the responsive [Navbar] and [Sidebar] navigation.
- **UI Elements (`src/components/ui/`)**: Reusable primitives such as [Button], [Badge], [Card], and [Avatar].

### 4. Custom Icon System (`src/icons/`)
- Icons are centralized in [src/icons/index.tsx](file:///d:/assertflow/assetflow-backend/fronted/src/icons/index.tsx) as a single `Icons` dictionary containing custom-styled React SVG rendering functions.

---

## 🚀 Available Scripts

In the `fronted/` directory, you can run:

### `npm run dev`
Starts the Vite development server on `http://localhost:5173`.

### `npm run build`
Compiles TypeScript and bundles the assets for production deployment into the `dist/` directory.

### `npm run lint`
Runs the `oxlint` linter on the codebase to check for code quality and potential issues.

### `npm run preview`
Locally previews the production-built bundle in `dist/`.

---

## 📂 Folder Layout

```text
fronted/
├── public/             # Static public assets (Favicon, SVGs)
├── src/
│   ├── assets/         # App logos and images
│   ├── components/
│   │   ├── dashboard/  # Dashboard-specific child components
│   │   ├── layout/     # Sidebar, Navbar, and General Layout
│   │   └── ui/         # Primary generic UI wrappers (Badge, Card, Button)
│   ├── data/           # Mock data files for preview lists
│   ├── icons/          # Centralized SVG icon helper exports
│   ├── pages/          # View components matching routes
│   ├── store/          # Redux Toolkit global store and slices
│   ├── utils/          # Axios/Fetch API client wrappers
│   ├── App.tsx         # Main entry router shell
│   ├── index.css       # Global stylesheet (Vanilla CSS)
│   └── main.tsx        # React DOM entry mounting file
├── tsconfig.json       # TypeScript configuration files
└── vite.config.ts      # Vite configuration setup
```
