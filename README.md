# React Playground - Next.js Edition

A rich text editor playground built with Next.js 14, TypeScript, and Tailwind CSS, featuring Slate.js and Quill editors.

## Tech Stack

- **Next.js 14** with App Router (in `src/app`)
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Slate.js** - A completely customizable framework for building rich text editors
- **Quill** - A powerful rich text editor
- **React 18**

## Project Structure

```
src/
├── app/              # Next.js App Router
│   ├── layout.tsx    # Root layout
│   ├── page.tsx      # Home page
│   └── globals.css   # Global styles with Tailwind
├── components/       # React components
│   ├── App.tsx       # Main app component
│   ├── SlateEditor/  # Slate editor implementation
│   └── QuillEditor/  # Quill editor implementation
├── stylesheets/      # Additional styles
└── types/            # TypeScript type definitions
```

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) to see the application.

## Features

- Modern Next.js 14 App Router architecture
- Full TypeScript support
- Tailwind CSS for responsive design
- Rich text editing with Slate.js
- Alternative Quill editor implementation
- LaTeX math rendering with KaTeX

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Configuration

- `tailwind.config.js` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration
- `next.config.js` - Next.js configuration

## Notes

- The project uses `legacy-peer-deps=true` in `.npmrc` due to some package compatibility issues
- TypeScript strict mode is enabled for better type safety
- The app directory is located inside `src/` for better organization
