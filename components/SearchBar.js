import { TextField, IconButton } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import axios from 'axios';
import { useState } from 'react';

const instance = axios.create({
  baseURL: 'https://api.github.com',
});

function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await instance.get('/search/code', {
      params: {
        q: query + "+repo:VenusHui/VenusHui_blog/posts/"
      },
    });
    setResults(response.data.items);
    console.log(query);
    console.log(results);
  };

  return (
    <form onSubmit={handleSubmit} style={{display: 'flex', justifyContent: 'space-between'}}>
      <TextField
        label="Search"
        variant="outlined"
        size="medium"
        fullWidth
        value={query}
        onChange={(event) => setQuery(event.target
          .value)}
      />
      <IconButton type="submit">
        <SearchIcon />
      </IconButton>
    </form>
  );
}

export default SearchBar