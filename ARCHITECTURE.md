# TextGenie: Project Architecture & Flow

This document outlines the core technologies and the end-to-end data flow of the TextGenie application.

## Tech Stack
* **Framework:** [Next.js (App Router)](https://nextjs.org/) (React)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **UI Components:** [Radix UI primitives](https://www.radix-ui.com/) & [lucide-react](https://lucide.dev/)
* **Authentication:** [Clerk](https://clerk.com/)
* **AI Model:** [Google Gemini API](https://ai.google.dev/) (`@google/generative-ai`)
* **Database:** [Neon Serverless Postgres](https://neon.tech/)
* **ORM:** [Drizzle ORM](https://orm.drizzle.team/)
* **Rich Text Editor:** [Toast UI Editor](https://ui.toast.com/tui-editor) (`@toast-ui/react-editor`)

---

## Codebase Flow

### 1. Routing & Authentication
- The application uses the Next.js `app/` router directory structure.
- **Middleware (`middleware.ts`)**: This runs on the edge before any request is completed. It leverages Clerk to check if the user is authenticated. 
- If a user tries to access protected routes (like `/dashboard`), they are seamlessly redirected to the `/sign-in` page. 

### 2. Dashboard & Template Selection
- Once logged in, the user lands on the `/dashboard` route.
- The dashboard acts as a grid/list of available AI Templates (e.g., YouTube Titles, Blog Generators).
- The templates are populated from local static data defined within `app/(data)/Template.tsx`.

### 3. The Content Generation Flow (`/dashboard/content/[slug]`)
When a user clicks on a specific tool (e.g., "YouTube SEO Title" -> slug path: `youtube-seo-title`), the following lifecycle occurs:

1. **Page Load:** Next.js dynamically routes to `app/dashboard/content/[template-slug]/page.tsx`.
2. **Template Match:** The page takes the URL parameter (the slug) and finds the matching template object from your local data, which contains the specific *System Prompt* needed for Gemini.
3. **UI Layout:** The page mounts a split screen:
    - `<FormSection />`: Renders dynamic input fields based on the selected template's requirements.
    - `<OutputSection />`: Mounts the Toast UI Markdown Editor on the right side.
4. **Form Submission:** When the user fills out the form and clicks "Generate", it triggers the `GenerateAIContent` function.
    - **Step A:** It validates the total usage (if the user has generated > 10,000 words/tokens, it halts).
    - **Step B:** It stitches the user's form inputs together with the hidden Prompt from the template file. 

### 4. AI Interaction & Result
- The stitched text string is sent to `app/utils/AiModels.tsx`.
- This utility instantiates a session with `gemini-2.5-flash` using your authenticated API keys.
- The API processes the prompt and returns the generated content.
- The React State variable `aiOutput` is updated.
- `useEffect` inside of the `<OutputSection />` intercepts this state change, firing the local Toast UI Editor to set the markdown content visually for the user.

### 5. Database Logging
- As soon as the AI content resolves safely, an asynchronous call is made to `SaveInDb`.
- This function uses **Drizzle ORM** connected to your **Neon PostgreSQL** server. 
- It logs a new row in the `AIOutput` table that tracks:
    - The original form data inputs
    - Which template slug was used
    - The AI's full text response
    - The user's active Clerk email address (`user?.primaryEmailAddress?.emailAddress`)
    - The timestamp generated securely by the `moment` library.

---

### Folder Structure Summary

*   **`app/(auth)`**: Auth page wrappers for Clerk.
*   **`app/dashboard`**: Protected layout wrapping all internal tools.
*   **`app/utils`**: Core integrations (Gemini config in `AiModels.tsx` and Neon DB config in `db.tsx`).
*   **`app/(data)`**: Configurations & prompt engineering for individual tools.
*   **`components/ui`**: Reusable generic Radix components (Buttons, Inputs, etc).
