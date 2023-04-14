import styles from "@/styles/Home.module.css";
import { Poppins } from "next/font/google";
import Head from "next/head";

const poppins = Poppins({ weight: "500", subsets: ["latin"] });

export default function Home() {
    return (
        <>
            <Head>
                <title>Onur Ravli - Home</title>
                <meta name={"description"} content={"Onur Ravli Personal Web Page."} />
                <meta name={"keywords"} content={"onur ravli, onurravli, onur ravlı, ravlico"} />
                <meta name={"author"} content={"Onur Ravli"} />
                <meta name={"viewport"} content={"width=device-width, initial-scale=1.0, max-scale=1.0"} />
                <meta name={"theme-color"} content={"#fff"} />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className={styles.main}>
                <div className={styles.mainContainer}>
                    <h1 className={styles.helloWorld} style={poppins.style}>
                        Hello World.
                    </h1>
                    <p className={styles.hand}>👋🏻</p>
                </div>
            </div>
        </>
    );
}
