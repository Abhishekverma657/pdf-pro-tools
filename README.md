# PDF Pro Web Application

This is a React-based web application port of the PDF Tools Flutter app.

## Features
- **Modern UI**: Built with React and Tailwind CSS, following the original app's theme (Teal/Dark Mode).
- **Tools**: Includes UI for Extract Text, Split PDF, and a directory of other tools.
- **Responsive**: Works on desktop and mobile.
- **Dark Mode**: Fully supported system and manual dark mode.

## Setup

1.  Navigate to this directory:
    ```bash
    cd web_app
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Run the development server:
    ```bash
    npm run dev
    ```

4.  Build for production:
    ```bash
    npm run build
    ```

## Project Structure
- `src/components`: Reusable components (Navbar, FileUploader).
- `src/pages`: Page components (Home, Tools, Settings).
- `src/pages/tools`: Individual tool implementations.
- `src/data`: Static data (tools list).
- `tailwind.config.js`: Theme configuration matching the Flutter app.
