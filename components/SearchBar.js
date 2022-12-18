import { TextField, IconButton } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import axios from 'axios';
import { useState } from 'react';

const instance = axios.create({
  baseURL: 'https://api.github.com',
});

function SearchBar({ posts, setArticles }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await instance.get('/search/code', {
      params: {
        q: query + "+repo:VenusHui/VenusHui_blog/posts/"
      },
    });
    const files = []
    const regex = /^posts\/.+$/;
    response.data.items.map((post) => {
      if (regex.test(post.path)) {
        files.push(post.path.substring(6))
      }
    })
    setResults(files);
    const articles = []
    posts.map((post) => {
      if (results.includes(post.filePath)) {
        console.log(post.filePath)
        articles.push(post);
      }
    });
    setArticles(articles);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', justifyContent: 'space-between' }}>
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
