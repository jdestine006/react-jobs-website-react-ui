import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from "react-router-dom";
import MainLayout from './layouts/MainLayout'
import HomePage from './pages/HomePage';
import JobsPage from './pages/JobsPage';
import NotFoundPage from './pages/NotFoundPage';
import JobPage, { jobLoader } from './pages/JobPage';
import AddJobPage from './pages/AddJobPage';
import EditJobPage from './pages/EditJobPage';
import ErrorBoundary from './components/ErrorBoundary';
import { jobsAPI } from './services/jobsAPI';

const App = () => {
  const addJob = async (newJob) => {
    try {
      await jobsAPI.createJob(newJob);
    } catch (error) {
      console.error('Failed to add job:', error);
      throw error; // Re-throw so component can handle it
    }
  }
  
  // Delete Job
  const deleteJob = async (id) => {
    try {
      console.log('delete', id);
      await jobsAPI.deleteJob(id);
    } catch (error) {
      console.error('Failed to delete job:', error);
      throw error; // Re-throw so component can handle it
    }
  }

  //Update
  const updateJob = async (job) => {
    try {
      await jobsAPI.updateJob(job.id, job);
    } catch (error) {
      console.error('Failed to update job:', error);
      throw error; // Re-throw so component can handle it
    }
  }
  const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<MainLayout />}>
      <Route index element={<HomePage />} />
      <Route path='/jobs' element={<JobsPage />} />
      <Route path='/jobs/:id' element={<JobPage deleteJob={deleteJob} />} loader={jobLoader} />
      <Route path='/edit-job/:id' element={<EditJobPage updateJobSubmit={updateJob}/>} loader={jobLoader} />
      <Route path='/add-job' element={<AddJobPage addJobSubmit={addJob}/>} />
      <Route path='*' element={<NotFoundPage />} />
    </Route>
    )
);
  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
};

export default App;