# Xapo Frontend Challenge

This project is a frontend for a cryptocurrency exchange, developed with React, TypeScript, and Vite.

## Project Structure

- **src/**: Source code
  - **components/**: Reusable React components
  - **hooks/**: Custom hooks (useExchangeLogic, etc.)
  - **pages/**: Main pages (ExchangePage)
  - **services/**: Services (exchangeRateService)
  - **styles/**: Global styles and CSS variables
  - **utils/**: Utilities and helpers
  - **types/**: TypeScript type definitions
  - **test/**: Test configuration and setup

## Global Styles

- **src/styles/variables.css**: Centralizes CSS variables for colors, spacing, fonts, transitions, z-index, etc.
- **src/index.css**: Base styles and resets, using variables from `variables.css`.
- **src/App.css**: Specific styles for the main app structure.

## CSS Property Order Convention

We use stylelint to maintain a consistent order of CSS properties across all files. Properties are grouped in the following order:

1. **Layout**

   - position, top, right, bottom, left, z-index
   - display, flex, grid properties
   - align-items, justify-content

2. **Box Model**

   - box-sizing, width, height
   - margin, padding
   - border, border-radius

3. **Visual**

   - background, color
   - font properties
   - text-align, text-transform
   - box-shadow, opacity

4. **Motion**

   - transition
   - transform
   - animation

5. **Misc**
   - overflow
   - visibility
   - white-space
   - cursor

To automatically format CSS files according to this convention:

```bash
npm run lint:css      # Check CSS files
npm run lint:css:fix  # Fix CSS files automatically
```

## Tools and Configuration

- **Bundler**: Vite
- **TypeScript**: Strict configuration, no file emission
- **ESLint**: Modern configuration with plugins for React Hooks and React Refresh
- **Stylelint**: CSS property ordering and BEM naming convention
- **Testing**: Vitest with jsdom environment and Testing Library

## Available Scripts

- `npm run dev`: Starts the development server
- `npm run build`: Builds the project for production
- `npm run lint`: Runs ESLint
- `npm run lint:css`: Checks CSS files with stylelint
- `npm run lint:css:fix`: Fixes CSS files automatically with stylelint
- `npm run preview`: Previews the build
- `npm run test`: Runs tests with Vitest

## Development Instructions

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. Run tests: `npm run test`

## Conventions and Best Practices

- Use of centralized CSS variables to maintain design consistency
- Consistent CSS property ordering using stylelint
- BEM naming convention for CSS classes
- Unit and integration tests to ensure code quality
- Modular structure and clear separation of responsibilities

## Features

- Real-time Bitcoin to USD exchange rates from CoinDesk API
- Buy/Sell mode toggle
- Precise decimal handling for both BTC (6 decimals) and USD (2 decimals)
- Input validation and error handling
- Responsive design
- Type-safe with TypeScript

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
