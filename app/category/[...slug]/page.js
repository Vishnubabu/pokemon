'use client'

import Loader from "@/app/components/Loader";
import Header from "@/app/components/Header";
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

  return <>
    <Header first={category} second="Pokemons" />

    {isPending && <Loader />}

    {!!pokemons?.length && <SearchBar pokemons={pokemons} displayAll />}
  </>
}
