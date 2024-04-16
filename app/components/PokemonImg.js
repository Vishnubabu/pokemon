import { NOT_FOUND_IMG, POKEMON_IMG_URL } from "../Config";

export default function PokemonImg({ id, name }) {
    return <img
        loading="lazy"
        src={`${POKEMON_IMG_URL}${id}.png`}
        alt={name}
        width={96}
        height={96}
        onError={(e) => {
            e.target.src = NOT_FOUND_IMG;
        }}
    />;
}
