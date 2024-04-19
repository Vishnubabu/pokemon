'use client'

import Link from 'next/link';
import Loader from "./components/Loader";
import Header from "./components/Header";
import LinkSvg from "./components/LinkSvg";
import getIdFromUrl from "./utils/getIdFromUrl";
import { POKE_API } from "./Config";
import { useQuery } from '@tanstack/react-query';
import SearchBar from './components/SearchBar';

export default function Page() {
  const { isPending, data: [categories, pokemons] = [[], []] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => Promise.all([
      fetch(`${POKE_API}type/`)
        .then(r => r.json())
        .then(({ results }) => results.map(({ name, url }) => ({
          name,
          id: getIdFromUrl(url)
        }))),

      fetch(`${POKE_API}pokemon/?offset=0&limit=1302`) // get all pokemons
        .then(r => r.json())
        .then(({ results }) => results.map(({ name, url }) => ({ name, id: getIdFromUrl(url) })))
    ])
  });

  return <>
    <Header first="Pokemon" second="Categories" />

    <SearchBar placeholder="Search pokemon" pokemons={pokemons} />

    {isPending && <Loader />}

    {!!categories.length &&
      <ol data-testid="list" className="space-y-4 list-decimal list-inside mt-4 pt-4 border-t border-neutral-400">
        {categories.map(({ name, id }, ind) => <li key={ind}>
          <Link prefetch={false} href={`/category/${name}/${id}`} className="capitalize hover:underline inline-flex items-center">
            {name}
            <LinkSvg />
          </Link>
        </li>)}
      </ol>}
  </>;
}
