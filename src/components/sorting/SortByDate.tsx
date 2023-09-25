import React from 'react';

interface SortByDateProps {
  handleSortByDate: (value: 'asc' | 'desc') => void;
}

const SortByDate: React.FC<SortByDateProps> = ({ handleSortByDate }) => {
  return (
    <div>
      <label htmlFor="sortByDate">Sort by Date: </label>
      <select
        id="sortByDate"
        onChange={(e) => handleSortByDate(e.target.value as 'asc' | 'desc')}
      >
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
    </div>
  );
};

export default SortByDate;
