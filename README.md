
# ManaBlog

ManaBlog is a modern, full-featured blogging platform built with React and Firebase. It offers a seamless experience for both readers and authors through a clean, responsive interface and a robust set of features designed for real-world usability.

---

## 🔑 Key Features

### User Authentication

- Full authentication system with email/password login
- Profile management with custom display names and profile photos
- Secure password handling with reauthentication for sensitive operations

### Content Management

- Rich Markdown-based post creation and editing
- Real-time preview while editing blog content
- Image upload with automatic compression for performance optimization
- Author dashboard for post management and content organization

### Interactive Components

- Comment system for engaging discussions
- Custom toast notification system for instant user feedback
- Confirmation dialogs for irreversible or destructive actions
- Responsive data tables with pagination, sorting, and bulk actions

### UI/UX Enhancements

- Fully responsive design with light and dark mode support
- Skeleton screens to improve perceived loading speed
- Loading spinners and fallback loaders for async operations
- Smooth page transitions with Framer Motion
- Breadcrumb navigation for better orientation and usability

---

## 🛠 Technical Stack

### Frontend

- **React** for component architecture and state control
- **React Router** for page navigation
- **Tailwind CSS** for utility-first, responsive styling
- **Framer Motion** for fluid animation and transitions
- **Custom Hooks** for shared logic (loading, notifications, auth, etc.)

### Backend Integration

- **Firebase Authentication** for secure user login and registration
- **Firestore** for real-time NoSQL data storage (posts, comments, profiles)
- **Firebase Storage** for optimized image upload and delivery
- **.env Configuration** for secure API key and project settings management

### Advanced Components

- Reusable toast notifications with variant styling (success, error, warning, info)
- Modular confirmation dialog component
- Dynamic, accessible data tables with real-time updates
- Validated form components with real-time error feedback

---

## 🧩 Developer Experience

- Component-based architecture for modularity and scalability
- Custom React hooks to encapsulate complex, reusable logic
- Fully responsive layout designed for all screen sizes
- Consistent user feedback mechanisms through loaders, skeletons, and toasts
- Seamless UI flow even during async operations with proper loading states

---

This project showcases a practical implementation of modern frontend technologies, demonstrating attention to usability, performance, and clean architecture—all while enabling both technical excellence and user-centric design.
