# React Scheduler with Firestore

This project is a React-based calendar application using DevExtreme Reactive Scheduler with Firestore integration for data persistence.

## Features

- Calendar view with day, week, and month views
- Add, edit, and delete events
- Polish language support
- Firestore integration for data storage
- Notifications for user actions
- Responsive design
- Centralized configuration using constants

## Technologies Used

- React
- TypeScript
- DevExtreme Reactive Scheduler
- Firebase/Firestore
- Material-UI
- React Query
- Vite

## Setup

1. Clone the repository:

```
git clone https://github.com/ziebamikolaj/react-firestore-scheduler
```

2. Install dependencies:

```
npm install
```

3. Create a `.env` file in the root directory and add your Firebase configuration:

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

4. Run the development server:

```
npm run dev
```

## Project Structure

- `src/components`: React components
- `src/hooks`: Custom React hooks
- `src/lib`: Firebase configuration
- `src/constants.ts`: Centralized configuration constants
- `src/Providers.tsx`: Application providers setup
- `src/App.tsx`: Main application component
- `src/main.tsx`: Application entry point

## Key Files

- `src/constants.ts`: Contains all the configuration constants used throughout the application. This includes Firestore collection names, scheduler configuration, view names, and localized messages.
- `src/components/SchedulerComponent.tsx`: The main scheduler component that utilizes the constants for configuration.

## Customization

To customize the application's behavior or appearance:

1. Modify the constants in `src/constants.ts` to change scheduler configuration, view names, or messages.
2. Update the Firebase configuration in the `.env` file to connect to your own Firestore database.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)
