# CLAUDE.md - Pit Display Node Project Guide

## Build/Run Commands
- `npm install` - Install dependencies
- `npm start` - Start server with nodemon (auto-restart on changes)
- `npm run lint` - Run ESLint to check code quality

## Project Structure
- Server-side: Express.js with EJS templates
- Client-side: Vanilla JavaScript
- Data: MongoDB for storage, Network Tables for robot data

## Code Style Guidelines
- Follow Standard JS style (ESLint with standard/prettier configs)
- Use camelCase for variables, functions, and methods
- Use PascalCase for classes (e.g., `class Alliance {}`)
- Comments: JSDoc-style for functions, inline for complex logic
- Error handling: Use try/catch with specific error logging
- Imports: Group by type (core modules, dependencies, local imports)
- Async: Use async/await pattern with proper error handling

## Naming Conventions
- Variables: descriptive, specific nouns/noun phrases
- Functions: action verbs describing what they do
- Files: lowercase with hyphens, match their main export