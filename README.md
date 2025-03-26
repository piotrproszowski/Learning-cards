# Learning Cards

A modern web application for learning with flashcards, built with TypeScript, Web Components, and Node.js.

## Features

- Create and manage flashcard decks
- Study cards with spaced repetition
- Track learning progress
- User authentication and preferences
- Responsive design with dark mode support
- Modern web technologies and best practices

## Tech Stack

- **Frontend:**

  - TypeScript
  - Web Components (Lit)
  - SCSS
  - RxJS for state management

- **Backend:**
  - Node.js
  - Express
  - RESTful API

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/learning-cards.git
   cd learning-cards
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```
   PORT=3000
   NODE_ENV=development
   API_URL=http://localhost:3000/api
   ```

## Development

1. Start the development server:

   ```bash
   npm start
   ```

2. Build for production:

   ```bash
   npm run build
   ```

3. Run tests:

   ```bash
   npm test
   ```

4. Lint code:
   ```bash
   npm run lint
   ```

## Project Structure

```
learning-cards/
├── src/
│   ├── components/     # Web Components
│   ├── services/       # Application services
│   ├── models/         # TypeScript interfaces
│   ├── styles/         # SCSS styles
│   └── utils/          # Utility functions
├── server/             # Backend API
└── dist/              # Compiled files
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Cards

- `GET /api/cards` - Get all cards
- `GET /api/cards/:id` - Get a specific card
- `POST /api/cards` - Create a new card
- `PUT /api/cards/:id` - Update a card
- `DELETE /api/cards/:id` - Delete a card

### Decks

- `GET /api/decks` - Get all decks
- `GET /api/decks/:id` - Get a specific deck
- `POST /api/decks` - Create a new deck
- `PUT /api/decks/:id` - Update a deck
- `DELETE /api/decks/:id` - Delete a deck

### Users

- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Lit](https://lit.dev/) for Web Components
- [RxJS](https://rxjs.dev/) for reactive programming
- [Express](https://expressjs.com/) for the backend framework
