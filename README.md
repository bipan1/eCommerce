

### Grocery Store E-Commerce Application

Welcome to the Grocery Store E-Commerce Application! This project is a full-stack e-commerce platform built with Next.js for both the frontend and backend, utilizing AWS RDS for data storage, AWS S3 for image storage, and Redux for state management. The application is deployed on Vercel.[https://e-commerce-pi-liart-21.vercel.app/](https://e-commerce-pi-liart-21.vercel.app/)

## Features
- User Authentication: Users can sign up, log in, and manage their profiles.
- User Roles: Supports both admin and customer roles.
- Admin: Create product categories, manage products, and view all customer orders.
- Customer: Browse and search for products, add products to the cart, and checkout.
- Product Management: Admins can add, update, and delete products and categories.
- Order Management: Customers can place orders, and admins can view all orders.
- Image Upload: Images are stored in AWS S3 for efficient and scalable storage.
- Responsive Design: The mobile-friendly application works well on all devices.


## Tech Stack
- Frontend: Next.js, React, Redux, CSS Modules
- Backend: Next.js API Routes
- Database: AWS RDS (PostgreSQL)
- Storage: AWS S3 for storing images
- State Management: Redux
- Deployment: Vercel
- Other Tools: ESLint, Prettier, Axios

## Architecture
The application follows a modern web architecture pattern, leveraging Next.js for both server-side rendering (SSR) and static site generation (SSG). Here's an overview of the architecture:

- Next.js: Handles the server-side logic and page rendering.
- AWS RDS (PostgreSQL): Serves as the primary data store for application data, such as user information, product details, and order histories.
- AWS S3: Used to store product images securely and efficiently.
- Redux: Manages the global state across the application to provide a seamless user experience.
- Vercel: Hosts the application and provides a fast and scalable environment for deployment.


