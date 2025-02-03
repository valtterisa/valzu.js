# Valzu.js Documentation

## Introduction

Valzu.js is a lightweight, full-stack JavaScript framework designed for simplicity. It supports **server-side rendering (SSR)**, **state management**, and **easy client-server data fetching**.

## Installation

To create a new Valzu.js project, run:

```sh
npx create-valzu-app my-app
cd my-app
npm run dev
```

This will set up a new Valzu.js project and start the development server.

## File Structure

A Valzu.js project follows this structure:

```
my-app/
├── components/
│   ├── WelcomePage.ts    # Editable homepage component
├── pages/
│   ├── index.ts          # Homepage route (uses WelcomePage)
├── public/
│   ├── index.html        # Base HTML file
│   ├── styles.css        # Default styles
├── src/
│   ├── server.ts         # Server setup
├── package.json          # Dependencies & scripts
├── tsconfig.json         # TypeScript configuration
└── README.md             # Project instructions
```

## Creating Components

Components are created using the `createElement` function.

```tsx
import { createElement } from "valzu-core";

export default function WelcomePage() {
  return createElement(
    "div",
    {},
    createElement("h1", {}, "🚀 Welcome to Valzu.js!"),
    createElement(
      "p",
      {},
      "Edit components/WelcomePage.ts to modify this page."
    ),
    createElement(
      "a",
      { href: "https://github.com/your-username/valzu.js", target: "_blank" },
      "📖 Read the Docs"
    )
  );
}
```

## Routing

Routing is handled in the `server.ts` file. Each page component is mapped to a route.

```tsx
import { createServer } from "valzu-core";
import HomePage from "../pages/index";

createServer([{ path: "/", component: HomePage }]);
```

## State Management

Valzu.js provides `useState` for managing component state.

```tsx
import { createElement, useState } from "valzu-core";

export default function Counter() {
  const [count, setCount] = useState(0);

  return createElement(
    "div",
    {},
    createElement("p", {}, `Count: ${count()}`),
    createElement(
      "button",
      { onclick: () => setCount(count() + 1) },
      "Increment"
    )
  );
}
```

## Fetching Data

### **Client-side Fetching**

Use `useClient` to fetch data on the client-side.

```tsx
import { useClient } from "valzu-core";

async function fetchData() {
  const data = await useClient("/api/data");
  console.log(data);
}
fetchData();
```

### **Server-side Fetching**

Use `useServer` to fetch data on the server-side.

```tsx
import { useServer } from "valzu-core";

async function getData() {
  return [
    { id: 1, name: "Item 1" },
    { id: 2, name: "Item 2" },
  ];
}

export default async function DataPage() {
  const data = await useServer(getData);
  return createElement(
    "ul",
    {},
    ...data.map((item) => createElement("li", {}, item.name))
  );
}
```

## Deployment

Valzu.js applications can be deployed to **Vercel, Netlify, or a traditional server**.

### **Deploy to Vercel**

```sh
npm install -g vercel
vercel
```

### **Deploy to a Server**

```sh
npm run build
npm run dev
```

## Conclusion

Valzu.js is a minimal and flexible framework designed for both client and server rendering. Get started today by running:

```sh
npx create-valzu-app my-app
```
