
const SearchBar = ({ value, onChange, onSubmit, onClear, placeholder }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit();
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="search-bar relative">
        <input id="search"
          type="search"
          value={value}
          onChange={onChange}
          placeholder={placeholder || "🔍 Start typing to search..."}
          list="search-suggestions"
          className="w-full pr-12 pl-6 py-4 search-input rounded-full border border-gray-300 shadow-lg hover:shadow-xl focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-lg"
          style={{
            WebkitAppearance: 'none',
            MozAppearance: 'textfield'
          }}
          aria-label="Search for jobs"
          aria-describedby="search-help" />
        {value && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xl bg-white rounded-full p-1 hover:bg-gray-100 transition-colors"
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
        <datalist id="search-suggestions">
          <option value="React" />
          <option value="Frontend" />
          <option value="Backend" />
          <option value="Full Stack" />
          <option value="Remote" />
        </datalist>
        <div id="search-help" className="sr-only">
          Search by job title, company, location, or job type
        </div>
      </form>
      <div className="container">
        <div className="search-display"></div>
      
        <div className="posts-container"></div>
      </div>
    </>
  );
};

export default SearchBar