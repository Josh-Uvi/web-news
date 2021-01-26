import React, { useContext, useState } from 'react';
import { sortList } from '../helpers/utils';
import categories from '../categories';
import regions from '../countries.json';
import PostContext from '../contexts/PostContext';

const SideBarComponent = () => {
  const {
    storedCategory,
    selectedCountry,
    setStoreCategory,
    setStoreCountry,
  } = useContext(PostContext);

  const [category, setCategory] = useState({
    activeCategory: storedCategory,
    categories,
  });

  //event handler function
  const eventHandler = (event) => {
    event.preventDefault();
    return event.target.value;
  };

  const handleCategory = (event) => {
    setCategory({
      // setState
      ...category, // shallow copy state
      activeCategory: eventHandler(event), //set event handler
    });
    return setStoreCategory(eventHandler(event));
  };

  const handleCountry = (event) => {
    return setStoreCountry(eventHandler(event));
  };

  const toggleCategoryStyles = (index) => {
    const defaultStyle = 'categoriesBtn';

    if (storedCategory === category.categories[index].toLowerCase()) {
      return `${defaultStyle} active`;
    } else {
      return `${defaultStyle} in-active`;
    }
  };

  return (
    <div className='sidebar'>
      <div className='countries'>
        <h3 className='hd-country'>Select Country</h3>
        <select value={selectedCountry} onChange={(e) => handleCountry(e)}>
          {regions.sort(sortList('name')).map((value, key) => (
            <option value={value.code.toLowerCase()} key={key}>
              {value.name}
            </option>
          ))}
        </select>
      </div>
      <div className='categories'>
        <h3 className='hd-categories'>Categories</h3>
        {category.categories.sort().map((value, index) => (
          <div key={index}>
            <button
              className={toggleCategoryStyles(index)}
              onClick={(e) => handleCategory(e)}
              value={value.toLowerCase()}>
              {value}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SideBarComponent;
