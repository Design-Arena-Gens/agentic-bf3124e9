## FocusFlow – Simple Todo App

FocusFlow is a minimalist todo list that helps you stay organized without leaving your browser. Add tasks, mark them as complete, filter by status, and pick up right where you left off thanks to local storage.

### Features
- ✅ Add, complete, and remove todos with a clean, modern UI
- 🔄 Filter between all, active, and completed tasks
- 💾 Automatic persistence using `localStorage`
- 📱 Responsive design built with Tailwind CSS and Next.js App Router

### Getting Started

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to use the app.

### Available Scripts

- `npm run dev` – start the development server
- `npm run lint` – run ESLint
- `npm run build` – create an optimized production build
- `npm start` – serve the production build

### Deployment

This project is ready to deploy on [Vercel](https://vercel.com). To create a production deployment:

```bash
vercel deploy --prod --yes --token $VERCEL_TOKEN --name agentic-bf3124e9
```

### Tech Stack

- Next.js 14 (App Router)
- React 18 with client components
- Tailwind CSS
- TypeScript
