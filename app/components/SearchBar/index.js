import { useMemo, useState } from 'react';
import Link from 'next/link';
import styles from "./index.module.css";
import PokemonImg from '../PokemonImg';
import cleanupName from '@/app/utils/cleanupName';

export default function SearchBar({
    pokemons,
    displayAll = false
}) {
    const [val, setVal] = useState("");

    const filteredPokemons = useMemo(() => {
        const searchTerm = val.trim();
        if (!pokemons?.length || !searchTerm) return displayAll ? pokemons : [];

        return pokemons.filter(({ name }) => new RegExp(searchTerm, 'gi').test(name));
    }, [pokemons, val, displayAll]);

    return <>
        <input
            className={styles.input}
            autoFocus={true}
            placeholder="Search pokemon"
            type="text" value={val} onChange={(e) => {
                setVal(e.target.value);
            }} />

        {!!filteredPokemons?.length &&
            <ul data-testid="list" className="space-y-4" >
                {filteredPokemons?.map(({ name, id }, ind) => <li key={ind}>
                    <Link prefetch={false} href={`/pokemon/${name}/${id}`} className="capitalize hover:underline inline-flex items-center gap-2">
                        <PokemonImg id={id} name={name} />
                        {cleanupName(name)}
                    </Link>
                </li>)}
            </ul>}
    </>
}
