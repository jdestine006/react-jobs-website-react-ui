import Hero from '../components/Hero'
import HomeCards from '../components/HomeCards';
import JobListings from '../components/JobListings';
import ViewAllJobs from '../components/ViewAllJobs';
import SearchBar from '../components/SearchBar';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSearchSubmit = () => {
        if (searchTerm.trim()) {
            navigate(`/jobs?search=${encodeURIComponent(searchTerm.trim())}`)
        }
        else {
            navigate('/jobs');
        }
    };

    const handleClearSearch = () => {
        setSearchTerm('');
    };
    return (
    <>
            <Hero />
            <div className="w-full pr-8 search-input rounded-full py-3 px-6 text-lg">
                <div className="max-w-2xl mx-auto px-4">
                <SearchBar
                value={searchTerm}
                onChange={handleSearch}
                onSubmit={handleSearchSubmit}
                placeholder="Search jobs... (e.g., React, Frontend, Remote)"
                onClear={handleClearSearch}
                />
                </div>
            </div>
        <HomeCards />
            <JobListings isHome={ true } />
        <ViewAllJobs />
        
    </>
    
  )
}

export default HomePage