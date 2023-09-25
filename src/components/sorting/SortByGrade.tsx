import React from 'react';

interface SortByGradeProps {
  handleSortByGrade: (value: 'asc' | 'desc') => void;
}

const SortByGrade: React.FC<SortByGradeProps> = ({ handleSortByGrade }) => {
  return (
    <div>
      <label htmlFor="sortByGrade">Sort by Grade: </label>
      <select
        id="sortByGrade"
        onChange={(e) => handleSortByGrade(e.target.value as 'asc' | 'desc')}
      >
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
    </div>
  );
};

export default SortByGrade;
