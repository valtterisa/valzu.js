**Valzu.js** is an open-source, lightweight full‑stack framework built with TypeScript and ES modules. It supports server‑side rendering with file‑based routing and client‑side hydration—allowing you to build modern, dynamic web applications with minimal configuration.

---

## Features

- **File‑Based Routing:**  
  Any file placed in the `/src/pages` directory becomes a route. For example, `index.tsx` maps to `/`, and `about.tsx` maps to `/about`.

- **Server‑Side Rendering (SSR):**  
  Dynamically renders pages on the server by converting your virtual DOM (created via `element`) into HTML.

- **Client‑Side Hydration:**  
  Hydrates the server‑rendered HTML on the client so that the page becomes interactive.

- **Custom Component System:**  
  Write components as plain functions that return virtual DOM nodes using your custom `element` function.

- **CLI Tool:**  
  Use the `create-valzu-app` CLI to quickly scaffold a new project with a pre-configured structure, including a development environment that supports hot reloading.

---

## Installation

### Publishing and Using the CLI

After publishing, you can create a new Valzu.js project using [npx](https://docs.npmjs.com/cli/v7/commands/npx):

```bash
npx create-valzu-app my-new-app
```

This command will:

- Scaffold a new project in the `my-new-app` directory.
- Automatically install all necessary dependencies.
- Provide you with a working development environment.

---

## Project Structure

Once you create a new project, your project folder should look similar to this:

```plaintext
my-new-app/
├── package.json        # Project configuration and scripts
├── tsconfig.json       # TypeScript configuration
├── nodemon.json        # (Optional) nodemon configuration for development
├── public/
│   ├── index.html      # HTML template (includes <link> to your CSS and <script> for the client bundle)
│   └── styles.css      # Your global styles
└── src/
    ├── client.tsx      # Client entry file that calls the hydration function
    ├── server.ts       # Server entry file that starts the Valzu.js server
    └── pages/          # Pages are auto-registered as routes
        ├── index.ts  # Home page
        └── about.ts  # About page
```

---

## Usage

### Development Mode

1. **Navigate to Your Project:**

   ```bash
   cd my-new-app
   ```

2. **Install Dependencies (if not already done):**

   ```bash
   npm install
   ```

3. **Start Development Mode:**

   Run the following command to start both the client and server watchers:

   ```bash
   npm run dev
   ```

   - **Client:**
     Esbuild watches your `src/client.tsx` file and rebuilds your client bundle (located in a hidden folder like `.build` or `dist`, based on your configuration) whenever changes are made.

   - **Server:**
     Nodemon with ts‑node watches your server code and restarts the server automatically on changes.

4. **View Your App:**

   Open your browser at [http://localhost:3000](http://localhost:3000) to see your app live.

### Production Build

To build the production version of your client bundle and start your server from the built files:

1. **Build the Client Bundle:**

   ```bash
   npm run build
   ```

2. **Start the Server:**

   ```bash
   npm start
   ```

   This command will run your server from source (or, if you modify your build process, from a compiled output).

---

## Writing Components

You can write your components by using plain function calls.

```typescript
import { element } from "valzu-core";

export default function WelcomePage() {
  return element(
    "div",
    { class: "home" },
    element("h1", {}, "🚀 Welcome to Valzu.js!"),
    element("p", {}, "Your full-stack framework is ready to go."),
    element("p", {}, "Edit components/WelcomePage.ts to modify this page."),
    element(
      "a",
      { href: "https://github.com/your-username/valzu.js", target: "_blank" },
      "📖 Read the Docs"
    element
  );
}
```

---

## Server-Side Data Fetching

One of the powerful features of Valzu.js is that your page modules run on the server. This means you can perform server‑side data queries directly within your pages before rendering the virtual DOM. For example, you can fetch data from an open API and use the results to dynamically generate your page content.

### Example: Displaying a Random Dog Image

Below is an example of how to create a page that fetches a random dog image from the [Dog CEO API](https://dog.ceo/dog-api/) using a function named `fetchDogPicApi`, and then renders that image on the page.

Create a file at `src/pages/index.ts` (or modify your existing home page) with the following code:

````typescript
import { element } from "valzu-core";

// Function to fetch a random dog image from the Dog CEO API.
async function fetchDogPicApi() {
  const relementit fetch("https://dog.ceo/api/breeds/image/random");
  if (!response.ok) {
    throw new Error("Failed to fetch random dog image");
  }
  const data = await response.json();
  return { data };
}

// Page function that performs server-side data fetching.
export default async function Home() {
  // Fetch data on the server.
  const { data } = await fetchDogPicApi();

  // Render the page using the fetched data.
  return element(
    "div",
    { class: "home" },
    element("h1", {}, "Random Dog Image"),
    createlement", { src: data.message, alt: "Random Dog" }),
    element("p", {}, "Refresh the page to see a new image!")
  );
}element
```element
element
---

## Styling

Place your CSS files (e.g., `styles.css`) in the `public` folder and reference them in your HTML template:

```html
<link rel="stylesheet" href="/styles.css" />
````

This allows your application to load and apply the styles when the HTML is served.

---

## Deployment

You can host your full‑stack application on various platforms, such as:

- **Heroku:**
  Great for Node.js servers with simple Git-based deployments.
- **Vercel or Netlify:**
  Excellent for static and hybrid apps; can also deploy serverless functions.
- **Cloud Providers:**
  AWS, GCP, or Azure provide full control over scaling and infrastructure.
- **Containers:**
  Use Docker and Kubernetes or Docker Compose for container-based deployments.

Refer to your chosen platform’s documentation for specific deployment instructions.

---

## Contributing

Contributions are welcome! If you have suggestions, improvements, or bug fixes, please open an issue or submit a pull request.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENCE.md) file for details.
