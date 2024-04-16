export default function Header({ first, second }) {
    return <h1 className="mb-4 text-xl font-extrabold md:text-3xl lg:text-4xl">
        <span className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400 capitalize">{first}</span> {second}
    </h1>
}
