import { useState } from "react";
import styles from "./index.module.css";

export default function SearchBar({
    onTyping,
    placeholder = "",
}) {
    const [val, setVal] = useState("");

    return <input
        className={styles.input}
        autoFocus={true}
        placeholder={placeholder}
        type="text" value={val} onChange={(e) => {
            const val = e.target.value;
            setVal(val);
            onTyping(val);
        }} />;
}
