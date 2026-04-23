# Smart Resume Analyzer - Frontend

This is the professional React frontend for the Smart Resume Analyzer. It provides a clean, modern interface for users to upload resumes and receive AI-driven insights.

## Tech Stack
- **Framework:** [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Routing:** [React Router](https://reactrouter.com/)
- **HTTP Client:** [Axios](https://axios-http.com/)

## Key Features
- **Drag-and-Drop:** Intuitive file upload zone with immediate validation.
- **Visual Dashboard:** Beautiful analytics dashboard showing skill distributions.
- **Real-time Feedback:** Character counters and immediate error handling.
- **Responsive Design:** Fully optimized for mobile and desktop viewing.

## Local Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the `frontend` root or set the variable:
   ```bash
   VITE_API_URL=http://localhost:5000
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Build for production:**
   ```bash
   npm run build
   ```

## Project Structure
- `src/components/`: Reusable UI components like `UploadForm`.
- `src/pages/`: Main application views (`LandingPage`, `AnalysisResultPage`).
- `src/assets/`: Static images and icons.
- `App.tsx`: Main layout wrapper.
- `main.tsx`: Application entry point and router configuration.
