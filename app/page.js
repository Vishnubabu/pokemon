'use client'

import Link from 'next/link';
import Loader from "./components/Loader";
import Header from "./components/Header";
import LinkSvg from "./components/LinkSvg";
import getIdFromUrl from "./utils/getIdFromUrl";
import { POKE_API } from "./Config";
import { useQuery } from '@tanstack/react-query';

export default function Page() {
  const { isPending, data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => fetch(`${POKE_API}type/`)
      .then(r => r.json())
      .then(({ results }) => results.map(({ name, url }) => ({
        name,
        id: getIdFromUrl(url)
      })))
  });

  return <>
    <Header first="Pokemon" second="Categories" />

    {isPending && <Loader />}

    {!!categories.length &&
      <ol data-testid="list" className="space-y-4 list-decimal list-inside">
        {categories.map(({ name, id }, ind) => <li key={ind}>
          <Link prefetch={false} href={`/category/${name}/${id}`} className="capitalize hover:underline inline-flex items-center">
            {name}
            <LinkSvg />
          </Link>
        </li>)}
      </ol>}
  </>;
}
