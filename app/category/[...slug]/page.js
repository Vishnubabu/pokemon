'use client'

import { useState, useMemo } from "react";
import Link from 'next/link';
import Loader from "@/app/components/Loader";
import Header from "@/app/components/Header";
import cleanupName from "@/app/utils/cleanupName";
import PokemonImg from "@/app/components/PokemonImg";
import getIdFromUrl from "@/app/utils/getIdFromUrl";
import { POKE_API } from "@/app/Config";
import { useRouter } from "next/navigation";
import SearchBar from "@/app/components/SearchBar";
import { useQuery } from '@tanstack/react-query';

export default function Page({ params }) {
  const [category, id] = params.slug;
  const { replace } = useRouter();
  const { isPending, data: pokemons = [] } = useQuery({
    queryKey: [`type/${id}`],
    queryFn: () => fetch(`${POKE_API}type/${id}`)
      .then(r => r.json())
      .then(({ name, pokemon }) => {
        if (!name || !pokemon) return;

        if (name !== category) { // fix url if not valid
          replace(`/category/${name}/${id}`);
          return;
        }

        return pokemon.map(({ pokemon: { name, url } }) => ({
          name,
          id: getIdFromUrl(url)
        }));
      })
  });

  const [searchTerm, setSearchTerm] = useState('');

  const filteredPokemons = useMemo(() => {
    if (!pokemons?.length || !searchTerm) return pokemons;

    return pokemons.filter(({ name }) => new RegExp(searchTerm, 'gi').test(name));
  }, [pokemons, searchTerm]);

  return <>
    <Header first={category} second="Pokemons" />

    {isPending && <Loader />}

    {!!pokemons?.length && <>
      <SearchBar placeholder="Search pokemon" onTyping={setSearchTerm} />

      <ul data-testid="list" className="space-y-4" >
        {filteredPokemons?.map(({ name, id }, ind) => <li key={ind}>
          <Link prefetch={false} href={`/pokemon/${name}/${id}`} className="capitalize hover:underline inline-flex items-center gap-2">
            <PokemonImg id={id} name={name} />
            {cleanupName(name)}
          </Link>
        </li>)}
      </ul>
    </>}
  </>
}
