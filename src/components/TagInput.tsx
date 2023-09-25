import React, { useState } from "react";

interface TagsProps {
    tags: string[];
    setTags: React.Dispatch<React.SetStateAction<string[]>>;
    allTags: string[];
  }
  
  const Tags: React.FC<TagsProps> = ({ allTags, tags, setTags }) => {
    const [tagInput, setTagInput] = useState<string>("");

    const handleTagInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setTagInput(event.target.value);
    };
  
    const handleAddTag = () => {
      if (tagInput.trim() !== "") {
        const trimmedTag = tagInput.trim();
        if (!tags.includes(trimmedTag)) {
          setTags((prevTags) => [...prevTags, trimmedTag]);
        }
        setTagInput("");
      }
    };
  
    const handleTagRemoval = (tag: string) => {
      setTags((prevTags) => prevTags.filter((t) => t !== tag));
    };
  
    const handleSuggestionClick = (suggestion: string) => {
      if (!tags.includes(suggestion)) {
        setTags((prevTags) => [...prevTags, suggestion]);
      }
      setTagInput("");
    };
  
    const tagSuggestions =
      tagInput.length >= 1
        ? allTags.filter((tag) => tag.toLowerCase().includes(tagInput.toLowerCase()))
        : [];
  
  return (
    <div className="mt-12 flex flex-col space-y-4 items-center mx-4 sm:mx-0">
    <div className="py-8 px-8 items-center rounded shadow-lg overflow-hidden w-full sm:w-11/12 md:max-w-xl hover:shadow-xl bg-white dark:bg-gray-800">
      <div className="flex flex-row justify-start items-center">
        <h1 className="text-lg sm:text-2xl font-bold text-gray-800 mr-2 dark:text-gray-100">Tags</h1>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <form action="#" className="mt-8">
        <div className="flex bg-gray-100 p-1 items-center w-full space-x-2 sm:space-x- rounded border border-gray-500 dark:bg-gray-700 dark:border-gray-300">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 opacity-50 dark:text-gray-100 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          <input
            className="bg-gray-100 outline-none text-sm sm:text-base w-full dark:bg-gray-700 dark:text-gray-200 border-transparent focus:border-transparent focus:ring-0"
            type="text"
            placeholder="Add a tag..."
            value={tagInput}
            onChange={handleTagInputChange}
          />
          <button
            type="button"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleAddTag}
          >
            Add Tag
          </button>
        </div>
      </form>
        {tagInput && (
          <div className="my-3 flex flex-wrap -m-1">
            {tagSuggestions.map((suggestion, index) => (
              <span
                key={index}
                className="m-1 flex flex-wrap justify-between items-center text-xs sm:text-sm bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded px-4 py-2 font-bold leading-loose cursor-pointer dark:text-gray-300"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </span>
            ))}
          </div>
        )}

        <div className="my-3 flex flex-wrap -m-1">
          {tags.map((tag, index) => (
            <span key={index} className="m-1 flex flex-wrap justify-between items-center text-xs sm:text-sm bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded px-4 py-2 font-bold leading-loose cursor-pointer dark:text-gray-300">
              {tag}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-3 h-3 sm:h-4 sm:w-4 ml-4 text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
                viewBox="0 0 20 20"
                fill="currentColor"
                onClick={() => handleTagRemoval(tag)}
              >
                <path fillRule="evenodd" d="M6.293 5.293a1 1 0 011.414 0L10 8.586l2.293-2.293a1 1 0 111.414 1.414L11.414 10l2.293 2.293a1 1 0 01-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 01-1.414-1.414L8.586 10 6.293 7.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tags;
