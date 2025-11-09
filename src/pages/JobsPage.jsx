import JobListings from "../components/JobListings";
import SearchBar from "../components/SearchBar";
import { useState, useEffect } from "react";
import { useDebounce } from "../hooks/useDebounce";
import { useSearchParams } from "react-router-dom";

const JobsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(() => searchParams.get('search') || '');

  
  // Debounce the search term with 300ms delay
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Sync debounced search term with URL
  useEffect(() => {
    if (debouncedSearchTerm) {
      setSearchParams({ search: debouncedSearchTerm });
    } else {
      setSearchParams({});
    }
  }, [debouncedSearchTerm, setSearchParams]);

  const handleSearchChange = (e) => {
    console.log('🔍 Search input changed:', e.target.value);
    setSearchTerm(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
  };
  return (
    <>
    <SearchBar
        value={searchTerm}
        onChange={handleSearchChange}
        onClear={handleClearSearch}
      />
      <section className="bg-blue-50 px-4 py-6">
      <JobListings searchTerm={debouncedSearchTerm} />
      </section>
    </>
  )
}

export default JobsPage