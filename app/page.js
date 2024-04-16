'use client'

import { useEffect, useState } from "react";
import Link from 'next/link';
import Loader from "./components/Loader";
import Header from "./components/Header";
import LinkSvg from "./components/LinkSvg";
import getIdFromUrl from "./utils/getIdFromUrl";
import { POKE_API } from "./Config";

let promise;  // cache api response
function getCategories() {
  if (!promise) {
    promise = fetch(`${POKE_API}type/`)
      .then(r => r.json())
      .then(({ results }) => results)
      .catch(e => {
        console.error(e);
        promise = undefined;
        return [];
      });
  }
  return promise;
}

export default function Page() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategories()
      .then(results => {
        setCategories(results.map(({ name, url }) => ({
          name,
          id: getIdFromUrl(url)
        })));
      });
  }, []);

  return <>
    <Header first="Pokemon" second="Categories" />

    {!categories?.length && <Loader />}

    {!!categories?.length &&
      <ol data-testid="list" className="space-y-4 list-decimal list-inside">
        {categories.map(({ name, id }, ind) => <li key={ind}>
          <Link href={`/category/${name}/${id}`} className="capitalize hover:underline inline-flex items-center">
            {name}
            <LinkSvg />
          </Link>
        </li>)}
      </ol>}
  </>
}