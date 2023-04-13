import styles from "@/styles/NavBar.module.css";
import { Poppins } from "next/font/google";

const poppins = Poppins({ weight: "500", subsets: ["latin"] });

export default function NavBar() {
    return (
        <>
            <div className={styles.navbar}>
                <div className={styles.container}>
                    <a className={styles.title} style={poppins.style} href={"/"}>Onur Ravli</a>
                    <div className={styles.links}>
                        <a style={poppins.style} href={"/about"}>About</a>
                        <a style={poppins.style} href={"/contact"}>Contact</a>
                    </div>
                </div>
            </div>
        </>
    );
}