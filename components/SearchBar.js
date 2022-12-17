import {useState, useEffect} from "react";
import {Input} from '@chakra-ui/react';
import axios from 'axios';

import './SearchBar.module.css';

function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);

  // useEffect(() => {
  //   const style = document.createElement('style');
  //   style.innerHTML = `
  //     body {
  //       color: red;
  //     }
  //   `;
  //   document.head.appendChild(style);
  // }, []);

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    axios.get(`https://api.github.com/search/code?q=${searchTerm}+repo:VenusHui/VenusHui_blog/posts/`)
      .then((response) => {
        console.log(response)
        setResults(response.data.results);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Input
          className="search-bar"
          type="text"
          placeholder='搜索文本' // 预显示文本
          value={searchTerm}
          onChange={handleChange}
        />
        <button type="submit">Search</button>
      </form>
      {/*{results.map((result) => (*/}
      {/*  <p key={result.id}>{result.title}</p>*/}
      {/*))}*/}
    </div>
  );
}

export default SearchBar;
