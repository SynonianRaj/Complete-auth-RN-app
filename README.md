
# Complete Authentication App

A **beginner-level project** that implements a **basic authentication system** using **React Native** for the frontend and **Django** with **Django Rest Framework (DRF)** for the backend. This app demonstrates user registration, login, fetching profile data, and uploading profile images, all stored in a database.

## Features
- **User Registration**: Users can sign up with unique credentials.
- **Login**: Authenticated users can log in using their credentials.
- **Profile Management**: Fetch and update user profile data, including profile image uploads.
- **Token-Based Authentication**: Secure API requests using JWT tokens.

## Tech Stack
- **Frontend**: React Native
- **Backend**: Django, Django Rest Framework (DRF)
- **Storage**: AsyncStorage (for token persistence)

## Disclaimer

This project is not bug-free and may have **minor or major bugs**. Additionally, error handling has not been implemented efficiently. Suggestions for improving the app's flow or fixing bugs are greatly appreciated!

## Setup Instructions

### Backend (Django)
1. Clone the repository and navigate to the `AuthApi-drf` folder:
   ```bash
   git clone https://github.com/SynonianRaj/Complete-auth-RN-app
   cd Complete-auth-RN-app/AuthApi-drf
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Apply migrations:
   ```bash
   python manage.py migrate
   ```
4. Start the Django server:
   ```bash
   python manage.py runserver
   ```

### Frontend (React Native)
1. Navigate to the `myapp01` folder:
   ```bash
   cd ../myapp01
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Run the app on an emulator or connected device:
   ```bash
   npx react-native run-android
   ```

## Usage

- **Login and Register**: Use the app to create an account or log in with existing credentials.
- **Profile Management**: View and update your profile, including uploading a profile picture.

## Contributing
We welcome contributions! Please note that the project may have **bugs** or **unoptimized error handling**. If you find any issues or have suggestions for improvements, feel free to:
1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Submit a pull request with a detailed explanation of changes.
