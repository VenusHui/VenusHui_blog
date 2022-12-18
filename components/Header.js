import Link from 'next/link';
import MainButton from './MainButton';
import SearchBar from './SearchBar';
import { getGlobalData } from '../utils/global-data';

export default function Header({ name, posts }) {
  return (
    <header className="pt-20 pb-12">
      <div className="w-12 h-12 rounded-full block mx-auto mb-4 bg-gradient-conic from-gradient-3 to-gradient-4" />
      <div style={{display: 'flex', justifyContent: 'space-between'}}>
        <MainButton />
        <SearchBar posts={posts} />
      </div>
    </header>
  );
}
