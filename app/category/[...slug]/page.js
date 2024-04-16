'use client'

import { useEffect, useState, useMemo } from "react";
import Link from 'next/link';
import Loader from "@/app/components/Loader";
import Header from "@/app/components/Header";
import cleanupName from "@/app/utils/cleanupName";
import PokemonImg from "@/app/components/PokemonImg";
import getIdFromUrl from "@/app/utils/getIdFromUrl";
import { POKE_API } from "@/app/Config";
import { useRouter } from "next/navigation";
import SearchBar from "@/app/components/SearchBar";

const promises = {}; // cache all api responses
function getPokemons(id) {
  if (!promises[id]) {
    promises[id] = fetch(`${POKE_API}type/${id}`)
      .then(r => r.json())
      .then(({ name, pokemon }) => [name, pokemon])
      .catch(e => {
        console.error(e);
        delete promises[id];
        return [];
      });
  }
  return promises[id];
}

export default function Page({ params }) {
  const [category, id] = params.slug;
  const [pokemons, setPokemons] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { replace } = useRouter();

  const filteredPokemons = useMemo(() => {
    if (!pokemons || !searchTerm) return pokemons;

    return pokemons.filter(({ name }) => new RegExp(searchTerm, 'gi').test(name));
  }, [pokemons, searchTerm]);

  useEffect(() => {
    getPokemons(id)
      .then(([name, results]) => {
        if (!name || !results) return;

        if (name !== category) { // fix url if not valid
          replace(`/category/${name}/${id}`);
          return;
        }

        setPokemons(results.map(({ pokemon: { name, url } }) => ({
          name,
          id: getIdFromUrl(url)
        })));
      });
  }, [category, id, replace]);

  return <>
    <Header first={category} second="Pokemons" />

    {!pokemons?.length && <Loader />}

    {!!pokemons?.length && <>
      <SearchBar placeholder="Search pokemon" onTyping={setSearchTerm} />

      <ul data-testid="list" className="space-y-4" >
        {filteredPokemons?.map(({ name, id }, ind) => <li key={ind}>
          <Link href={`/pokemon/${name}/${id}`} className="capitalize hover:underline inline-flex items-center gap-2">
            <PokemonImg id={id} name={name} />
            {cleanupName(name)}
          </Link>
        </li>)}
      </ul>
    </>}
  </>
}