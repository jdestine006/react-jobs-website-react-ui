# React Jobs Portal

A modern, responsive job portal application built with React 18 and Vite. This project demonstrates a complete CRUD (Create, Read, Update, Delete) application for managing job listings with a clean, professional user interface.

![React Jobs Portal](https://img.shields.io/badge/React-18.3.1-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-7.1.11-646CFF?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.1.16-38B2AC?logo=tailwind-css)

## 🚀 Features

- **Job Listings**: Browse all available job positions with pagination support
- **Job Details**: View comprehensive job information including company details
- **Add New Jobs**: Create new job listings with a user-friendly form
- **Edit Jobs**: Modify existing job information
- **Delete Jobs**: Remove job listings with confirmation prompts
- **Responsive Design**: Fully responsive UI that works on all device sizes
- **Loading States**: Smooth loading indicators for better user experience
- **Search & Filter**: Easy navigation and job discovery
- **Toast Notifications**: User feedback for actions (success/error messages)
- **Centralized API Layer**: Clean, maintainable API service architecture
- **Error Handling**: Comprehensive error boundaries and user-friendly error messages
- **Testing Suite**: Complete test coverage with 52+ automated tests

## 🛠️ Technologies Used

### Frontend Framework
- **React 18.3.1**: Latest version of React with modern hooks and features
- **Vite 7.1.11**: Fast build tool and development server for optimal performance
- **React Router DOM 6.30.1**: Client-side routing for Single Page Application (SPA) navigation

### Styling & UI
- **Tailwind CSS 4.1.16**: Utility-first CSS framework for rapid UI development
- **@tailwindcss/vite**: Vite integration for Tailwind CSS v4
- **React Icons**: Scalable vector icons including Font Awesome icons

### State Management & Data Fetching
- **React Hooks**: `useState`, `useEffect`, `useNavigate`, `useParams`, `useLoaderData`
- **Fetch API**: Native browser API for HTTP requests
- **React Router Loaders**: Data loading before route rendering

### Development Tools
- **JSON Server 1.0.0-beta.3**: Mock REST API server for development
- **ESLint**: Code linting and formatting
- **React Spinners**: Loading animations and indicators
- **React Toastify**: Toast notification system

### Testing & Quality Assurance
- **Vitest 4.0.5**: Fast unit testing framework with ES module support
- **React Testing Library**: Component testing utilities for user-centric tests
- **@testing-library/jest-dom**: Custom Jest matchers for DOM assertions
- **@testing-library/user-event**: User interaction simulation for testing
- **Happy-DOM**: Lightweight DOM implementation for testing environment

## 📁 Project Structure

```
react-jobs/
├── public/
│   └── assets/
├── src/
│   ├── components/
│   │   ├── Card.jsx              # Reusable card component
│   │   ├── ErrorAlert.jsx        # User-friendly error display with dismissible alerts
│   │   ├── ErrorBoundary.jsx     # React error boundary for error catching
│   │   ├── Hero.jsx              # Homepage hero section
│   │   ├── HomeCards.jsx         # Homepage feature cards
│   │   ├── JobListing.jsx        # Individual job card with truncation logic
│   │   ├── JobListings.jsx       # Job list container with centralized API integration
│   │   ├── Navbar.jsx            # Navigation bar with React Router links
│   │   ├── SearchBar.jsx         # Search functionality with accessibility features
│   │   ├── Spinner.jsx           # Loading spinner component
│   │   └── ViewAllJobs.jsx       # CTA component for viewing all jobs
│   ├── hooks/
│   │   └── useAPI.js             # Custom hooks for API operations and state management
│   ├── layouts/
│   │   └── MainLayout.jsx        # Main layout wrapper with ErrorBoundary
│   ├── pages/
│   │   ├── AddJobPage.jsx        # Job creation form with validation
│   │   ├── EditJobPage.jsx       # Job editing form
│   │   ├── HomePage.jsx          # Landing page composition
│   │   ├── JobPage.jsx           # Job detail view with delete functionality
│   │   ├── JobsPage.jsx          # All jobs listing page
│   │   └── NotFoundPage.jsx      # 404 error page
│   ├── services/
│   │   └── jobsAPI.js            # Centralized API service layer with error handling
│   ├── test/
│   │   ├── basic.test.js         # Basic testing framework validation
│   │   ├── JobListing.test.jsx   # JobListing component tests (11 tests)
│   │   ├── jobsAPI.test.js       # API service tests with mocks (24 tests)
│   │   ├── SearchBar.test.jsx    # SearchBar component tests (13 tests)
│   │   ├── setup.js              # Vitest testing environment configuration
│   │   └── utils.jsx             # Testing utilities and mock data
│   ├── App.jsx                   # Main app component with routing and ErrorBoundary
│   ├── main.jsx                  # Application entry point
│   ├── index.css                 # Global styles and Tailwind imports
│   └── jobs.json                 # Mock data source
├── vitest.config.js              # Vitest testing configuration
├── package.json
├── vite.config.js
└── README.md
```

## 🔧 Key Technical Implementation

### 1. **React Router v6 Implementation**
- **Browser Router**: Client-side routing with `createBrowserRouter`
- **Nested Routes**: Layout-based routing with `Outlet` component
- **Route Loaders**: Pre-loading data before component renders
- **Programmatic Navigation**: Using `useNavigate` for form submissions

```jsx
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<MainLayout />}>
      <Route index element={<HomePage />} />
      <Route path='/jobs' element={<JobsPage />} />
      <Route path='/jobs/:id' element={<JobPage deleteJob={deleteJob} />} loader={jobLoader} />
      <Route path='/add-job' element={<AddJobPage addJobSubmit={addJob}/>} />
      <Route path='*' element={<NotFoundPage />} />
    </Route>
  )
);
```

### 2. **State Management with React Hooks**
- **useState**: Local component state for form data and UI states
- **useEffect**: Side effects for API calls and data fetching
- **Custom State Logic**: Form handling and validation

```jsx
const [jobs, setJobs] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchJobs = async () => {
    try {
      const res = await fetch(apiUrl);
      const data = await res.json();
      setJobs(data);
    } catch (error) {
      console.log('Error fetching data', error);
    } finally {
      setLoading(false);
    }
  };
  fetchJobs();
}, []);
```

### 3. **API Integration with JSON Server**
- **RESTful API**: Full CRUD operations (GET, POST, PUT, DELETE)
- **Proxy Configuration**: Vite proxy setup for API calls
- **Error Handling**: Try-catch blocks for robust error management

```javascript
// Vite proxy configuration
server: {
  port: 3000,
  proxy: {
    '/api': {
      target: 'http://localhost:8000',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, ''),
    },
  },
}
```

### 4. **Tailwind CSS v4 Integration**
- **Vite Plugin**: `@tailwindcss/vite` for seamless integration
- **Utility-First**: Responsive design with utility classes
- **Component Styling**: Consistent design system

```jsx
<div className="bg-white rounded-xl shadow-md relative">
  <div className="p-4">
    <h3 className="text-xl font-bold mb-2">{job.title}</h3>
    <p className="text-gray-700 leading-relaxed break-words overflow-hidden">
      {description}
    </p>
  </div>
</div>
```

### 5. **Form Handling & Validation**
- **Controlled Components**: React-controlled form inputs
- **Form Submission**: Async form handling with navigation
- **Data Validation**: Client-side validation and error handling

### 6. **Centralized API Service Architecture**
- **Service Layer Pattern**: All API calls centralized in `src/services/jobsAPI.js`
- **Error Classification**: Network, validation, and server error handling
- **Type-Safe Responses**: Consistent response processing and error mapping

```javascript
// API service with error handling
const apiRequest = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    
    return response;
  } catch (error) {
    console.error('API Request Failed:', url, error);
    throw error;
  }
};
```

### 7. **Custom React Hooks for API Management**
- **useAPI Hook**: Generic API operation hook with loading/error states
- **useJobsAPI Hook**: Specialized hook for job-related operations
- **State Management**: Automatic loading and error state handling

```javascript
const useAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = async (apiCall, ...args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiCall(...args);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error };
};
```

### 8. **Comprehensive Error Handling System**
- **Error Boundaries**: React error boundaries to catch component tree errors
- **User-Friendly Alerts**: Dismissible error alerts with clear messaging
- **Error Classification**: Different error types with appropriate user feedback

```jsx
// Error boundary implementation
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }
    return this.props.children;
  }
}
```

### 9. **Comprehensive Testing Suite**
- **52+ Automated Tests**: Complete test coverage across components and services
- **Component Testing**: User interaction and behavior testing with React Testing Library
- **API Testing**: Mock-based testing for all CRUD operations and error scenarios
- **Accessibility Testing**: ARIA attributes and keyboard navigation validation

```javascript
// Example component test
it('toggles between More and Less buttons correctly', async () => {
  const user = userEvent.setup();
  const longDescriptionJob = {
    ...mockJob,
    description: 'Very long description that exceeds 90 characters...'
  };
  
  renderWithRouter(<JobListing job={longDescriptionJob} />);
  
  expect(screen.getByText('More')).toBeInTheDocument();
  await user.click(screen.getByText('More'));
  expect(screen.getByText('Less')).toBeInTheDocument();
});
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v20.19+ or v22.12+)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd react-jobs
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the JSON server** (in one terminal)
   ```bash
   npm run server
   ```

4. **Start the development server** (in another terminal)
   ```bash
   npm run dev
   ```

5. **Open your browser**
   - Navigate to `http://localhost:3000` for the React app
   - JSON server runs on `http://localhost:8000`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run server` - Start JSON server for API
- `npm run test` - Run test suite with Vitest
- `npm run lint` - Run ESLint

## 🧪 Testing

The project includes comprehensive testing with **52+ automated tests** covering:

### Test Coverage
- **SearchBar Component**: 13 tests covering input handling, form submission, accessibility
- **JobListing Component**: 11 tests covering truncation logic, click events, styling
- **API Service**: 24 tests covering CRUD operations, error scenarios, search functionality
- **Framework Validation**: 4 tests ensuring proper testing setup

### Testing Technologies
- **Vitest**: Fast unit testing with ES module support and parallel execution
- **React Testing Library**: User-centric component testing approach
- **Happy-DOM**: Lightweight DOM environment for better test performance
- **Mock Functions**: Comprehensive mocking for API calls and user interactions

### Running Tests
```bash
# Run all tests
npm run test

# Run tests in watch mode during development
npm run test -- --watch

# Run tests with coverage report
npm run test -- --coverage
```

### Test Examples
```javascript
// API service test
it('fetches all jobs without limit', async () => {
  const jobs = await jobsAPI.getAllJobs();
  expect(jobs).toHaveLength(2);
  expect(jobs[0]).toHaveProperty('title', 'Senior React Developer');
});

// Component interaction test
it('calls onChange when user types in search input', async () => {
  const mockOnChange = vi.fn();
  const user = userEvent.setup();
  
  renderWithRouter(<SearchBar value="" onChange={mockOnChange} />);
  
  const searchInput = screen.getByRole('combobox');
  await user.type(searchInput, 'React');
  
  expect(mockOnChange).toHaveBeenCalledWith('React');
});
```

## 🌐 API Endpoints

The JSON server provides the following endpoints:

- `GET /api/jobs` - Get all jobs
- `GET /api/jobs/:id` - Get specific job
- `POST /api/jobs` - Create new job
- `PUT /api/jobs/:id` - Update existing job
- `DELETE /api/jobs/:id` - Delete job

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- **Mobile**: Default styles
- **Tablet**: `md:` prefix (768px+)
- **Desktop**: `lg:` prefix (1024px+)

## 🏗️ Architecture Highlights

### Recent Improvements (2025)
- **🔧 Centralized API Layer**: Moved from scattered fetch calls to a unified service architecture
- **🛡️ Error Handling**: Implemented comprehensive error boundaries and user-friendly error messaging
- **🧪 Testing Suite**: Added 52+ automated tests with 100% pass rate for quality assurance
- **🎣 Custom Hooks**: Created reusable hooks for API operations and state management
- **♿ Accessibility**: Enhanced ARIA support and keyboard navigation
- **🎨 UI/UX**: Improved loading states, error alerts, and user feedback systems

### Code Quality
- **ESLint Integration**: Consistent code formatting and best practices
- **Component Architecture**: Modular, reusable components with clear separation of concerns
- **Type Safety**: Consistent error handling and response validation
- **Performance**: Optimized API calls and efficient state management

## 🔮 Future Enhancements

- ~~User authentication and authorization~~ *(in progress)*
- ~~Advanced search and filtering~~ *(partially implemented)*
- Job application functionality
- Company profiles and dashboards
- Real-time notifications
- Integration with external job APIs
- ~~Unit and integration testing~~ ✅ **COMPLETED**
- End-to-end testing with Playwright/Cypress
- Performance optimization and code splitting
- PWA (Progressive Web App) capabilities

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- React team for the amazing framework and testing utilities
- Tailwind CSS for the utility-first approach and responsive design system
- Vite team for the fast build tool and development experience
- JSON Server for easy API mocking and development
- Vitest team for the fast, modern testing framework
- React Testing Library for user-centric testing philosophy
- Open source community for the incredible ecosystem

---

**Built with ❤️ using React, Vite, and Tailwind CSS**
