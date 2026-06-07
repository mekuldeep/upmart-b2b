# Upmart - B2B Wholesale Storefront

Upmart is a B2B E-commerce storefront built using React, Vite, Tailwind CSS, and TypeScript. It communicates with a FastAPI backend to offer wholesale ordering, volume/group purchases, variant/size selection, and robust profile/order management.

## Tech Stack
- **Framework**: React (Vite-powered)
- **Styling**: Tailwind CSS & shadcn-ui
- **Icons**: Lucide React
- **API Handling**: Centralized Fetch client with support for custom ngrok request routing and credentials

## Development Setup

1. **Install Dependencies**:
   ```sh
   npm install
   ```

2. **Configure Environment Variables**:
   Create or edit `.env` in the root directory:
   ```env
   VITE_API_URL=https://api.upmart.co.in
   ```

3. **Start Development Server**:
   ```sh
   npm run dev
   ```

4. **Build for Production**:
   ```sh
   npm run build
   ```
