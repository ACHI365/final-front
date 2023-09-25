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
    <div className="mt-2">
      <label className="block text-sm font-medium text-gray-900">Tags</label>
      <div className="mt-1 flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="rounded-full bg-gray-200 px-3 py-1.5 text-gray-800 text-sm"
          >
            {tag}
            <button
              type="button"
              onClick={() => handleTagRemoval(tag)}
              className="ml-2 text-gray-600"
            >
              X
            </button>
          </span>
        ))}
      </div>
      <div className="mt-2">
        <input
          type="text"
          value={tagInput}
          onChange={handleTagInputChange}
          className="block w-full border border-gray-300 rounded-md py-1.5 px-3 text-sm"
          placeholder="Add a tag..."
        />
        {tagInput && (
          <div className="mt-2 flex flex-wrap -m-1">
            {tagSuggestions.map((suggestion, index) => (
              <span
                key={index}
                className="m-1 flex flex-wrap justify-between items-center text-xs bg-gray-200 hover:bg-gray-300 rounded px-4 py-2 font-bold leading-loose cursor-pointer"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </span>
            ))}
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={handleAddTag}
        className="mt-2 bg-blue-500 text-white font-semibold py-1.5 px-3 rounded hover:bg-blue-700"
      >
        Add Tag
      </button>
    </div>
  );
};

export default Tags;
