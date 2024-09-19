import React from 'react';
import Search from './Search';

const handleSearch = (query: string) => {
  // Implement your search logic here
  console.log('Searching for:', query);
};

const ParentComponent = () => {
  return (
    <div>
      <Search onSearch={handleSearch} />
    </div>
  );
};

export default ParentComponent;