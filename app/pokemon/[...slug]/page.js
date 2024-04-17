'use client'

import Link from 'next/link';
import Loader from "@/app/components/Loader";
import cn from "classnames";
import { POKE_API } from "@/app/Config";
import cleanupName from "@/app/utils/cleanupName";
import PokemonImg from "@/app/components/PokemonImg";
import LinkSvg from "@/app/components/LinkSvg";
import Header from "@/app/components/Header";
import dynamic from 'next/dynamic';
import getIdFromUrl from "@/app/utils/getIdFromUrl";
import { useRouter } from "next/navigation";
import { useQuery } from '@tanstack/react-query';


/**
 * Dynamically loading, as it is breaking SSR
 */
const Chart = dynamic(() => import('react-apexcharts'), {
  loading: () => <Loader />,
});

function Row({ name, children, className }) {
  return <li className="py-3 sm:py-4">
    <div className="flex items-center justify-between">
      <p className="text-sm font-medium truncate">
        {name}
      </p>
      <div className={cn(className, "inline-flex items-center text-base text-right font-semibold")}>
        {children}
      </div>
    </div>
  </li>
}

function Section({ hd, children }) {
  return <div className="mt-4 w-full max-w-md p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-bold leading-none">{hd}</h2>
    </div>
    <div className="flow-root">
      {children}
    </div>
  </div>;
}

export default function Page({ params }) {
  const [pokemonName, id] = params.slug;
  const { replace } = useRouter();

  const { isPending, data: pokemon } = useQuery({
    queryKey: [`pokemon/${id}`],
    queryFn: () => fetch(`${POKE_API}pokemon/${id}`)
      .then(r => r.json())
      .then(({ name, abilities, forms, held_items, species, stats, types, height, weight }) => {
        if (name !== pokemonName) { // fix url if not valid
          replace(`/pokemon/${name}/${id}`);
          return;
        }

        return {
          name, abilities, forms, held_items, species, stats, types, height, weight
        };
      })
  });

  return <>
    <Header first={cleanupName(pokemonName)} />

    <PokemonImg id={id} name={pokemonName} />

    {isPending && <Loader />}

    {!!pokemon && <>
      <Section hd="Information">
        <ul data-testid="list" role="list" className="divide-y divide-gray-200">
          <Row name="Species" className="capitalize">
            {cleanupName(pokemon.species?.name)}
          </Row>
          <Row name="Height">{`${pokemon.height / 10} m`}</Row>
          <Row name="Weigth">{`${pokemon.weight / 10} kg`}</Row>
          <Row name="Abilities" className="capitalize">
            {pokemon.abilities
              .map(({ ability }) => cleanupName(ability.name))
              .join(', ')}
          </Row>
          <Row name="Forms" className="capitalize">
            {pokemon.forms
              .map(({ name }) => cleanupName(name))
              .join(', ')}
          </Row>
          {!!pokemon.held_items?.length && <Row name="Held Items" className="capitalize">
            {pokemon.held_items
              .map(({ item }) => cleanupName(item.name))
              .join(', ')}
          </Row>}
          <Row name="Categories" className="flex gap-2">
            {pokemon.types.map(({ type }, ind) => <Link key={ind} className="capitalize hover:underline inline-flex items-center"
              prefetch={false} href={`/category/${type.name}/${getIdFromUrl(type.url)}`}>
              {cleanupName(type.name)}
              <LinkSvg />
            </Link>)}
          </Row>
        </ul>
      </Section>

      <Section hd="Stats">
        <Chart
          options={{
            chart: {
              toolbar: {
                tools: {
                  download: false
                }
              }
            },
            xaxis: {
              categories: pokemon.stats.map(({ stat }) => cleanupName(stat.name))
            },
            yaxis: {
              show: false
            },
            tooltip: {
              enabled: false
            }
          }}
          series={[{
            data: pokemon.stats.map(({ base_stat }) => base_stat)
          }]}
          width="100%"
          height="auto"
          type="bar"
        />
      </Section>
    </>}
  </>
}
