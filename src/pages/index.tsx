import styles from "@/styles/Home.module.css";
import { Poppins } from "next/font/google";

const poppins = Poppins({ weight: "500", subsets: ["latin"] });

export default function Home() {
    return (
        <div className={styles.main}>
            <div className={styles.mainContainer}>
                <h1 className={styles.helloWorld} style={poppins.style}>
                    Hello World.
                </h1>
                <p className={styles.hand}>👋🏻</p>
            </div>
        </div>
    );
}
