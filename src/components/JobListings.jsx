import JobListing from './JobListing';
import { useState, useEffect, useMemo } from 'react';
import jobsData from '../jobs.json';
import Spinner from '../components/Spinner';
import ErrorAlert, { LoadingSpinner } from './ErrorAlert';
import { jobsAPI } from '../services/jobsAPI';
import { useJobsAPI } from '../hooks/useAPI';

const JobListings = ({isHome = false, searchTerm=''}) => {
    const [jobs, setJobs] = useState([]);
    const { loading, error, clearError, operations } = useJobsAPI();
    
    // Handle empty search request
    const filteredJobs = useMemo(() => {
        if (!searchTerm.trim()) {
            return jobs;
        }
        // convert search term to lowercase for all case-sensitive searches
        const searchLower = searchTerm.toLowerCase();

        //Filter search results to make search term is included 
        return jobs.filter(job => {
            return (
                job.title.toLowerCase().includes(searchLower) ||
                job.description.toLowerCase().includes(searchLower) ||
                job.company.name.toLowerCase().includes(searchLower) ||
                job.location.toLowerCase().includes(searchLower) ||
                job.type.toLowerCase().includes(searchLower)
            );
        });
        
    }, [jobs, searchTerm])

    useEffect(() => {
        const fetchJobs = async () => {
            const limit = isHome ? 3 : null;
            
            await operations.fetchJobs(
                () => jobsAPI.getAllJobs(limit),
                (data) => setJobs(data),
                (error) => {
                    console.error('Failed to fetch jobs:', error);
                    // Error state is handled by useJobsAPI hook
                }
            );
        };
        
        fetchJobs();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isHome]); // operations is memoized and stable, safe to omit
    return (
        <section className="bg-blue-50 px-4 py-10">
            <div className="container-xl lg:container m-auto">
                <h2 className="text-3xl font-bold text-indigo-500 mb-6 text-center">
                    {isHome ? 'Recent Jobs' : 'Browse Jobs'}
                </h2>
                
                {/* Error Alert */}
                {error && (
                    <ErrorAlert 
                        error={error} 
                        onDismiss={clearError}
                        className="mb-6"
                    />
                )}
                
                {searchTerm && !loading && !error && (
                    <div className="text-center mb-4">
                      <span className="text-gray-600">
                        Found {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''} for "{searchTerm}"
                      </span>
                    </div>
                )}
                
                {loading ? (
                    <LoadingSpinner text="Loading jobs..." size="large" className="py-8" />
                ) : error ? (
                    <div className="text-center py-8">
                        <p className="text-gray-500">Unable to load jobs at this time.</p>
                    </div>
                ) : (
                    filteredJobs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {filteredJobs.map((job) => (
                        <JobListing job={job} key={job.id} />
                        ))}
                    </div>
                ) : searchTerm ? (
                <div className="text-center py-8">
                    <div className="text-gray-500 text-lg mb-2">
                        No jobs found for "{searchTerm}"
                    </div>
                <div className="text-gray-400">
                    Try searching with different keywords or check your spelling
                </div>
                </div>
         ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {filteredJobs.map((job) => (
               <JobListing job={job} key={job.id} />
             ))}
            </div>
        ))}                                     
        </div>                           
        </section>
    );
}

export default JobListings