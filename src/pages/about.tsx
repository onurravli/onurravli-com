import styles from "@/styles/About.module.css";
import { Poppins } from "next/font/google";
import Image from "next/image";
import photo from "public/onurravli_400x400.jpg";
import Head from "next/head";

const poppins = Poppins({ weight: "500", subsets: ["latin"] });

export default function About() {
    return (
        <>
            <Head>
                <title>Onur Ravli - About</title>
                <meta name={"description"} content={"Onur Ravli Personal Web Page."} />
                <meta name={"keywords"} content={"onur ravli, onurravli, onur ravlı, ravlico"} />
                <meta name={"author"} content={"Onur Ravli"} />
                <meta name={"viewport"} content={"width=device-width, initial-scale=1.0, max-scale=1.0"} />
                <meta name={"theme-color"} content={"#fff"} />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className={styles.main}>
                <div className={styles.section}>
                    <h1 style={poppins.style}>
                        About Me.
                    </h1>
                    <Image
                        className={styles.photo}
                        style={{
                            borderRadius: "50%",
                            margin: "20px",
                        }}
                        priority
                        src={photo}
                        alt={"Onur Ravli"}
                    />
                    <p className={styles.aboutMe} style={poppins.style}>Hello! I am Onur.
                        I was born on 23rd June 2001. I am trying to code since when I was 14.
                        Fun fact, I was started with PHP! 😜
                    </p>
                    <p className={styles.aboutMe} style={poppins.style}>
                        Now I am studying Computer Science and Engineering at Konya Technical
                        University Department of Engineering.
                    </p>
                    <p className={styles.aboutMe} style={poppins.style}>
                        As an ambitious and highly motivated computer science and electrical engineering student, I am
                        constantly seeking new challenges to push the boundaries of my abilities. I possess a versatile
                        skill set in various programming languages, including C/C++, JavaScript/TypeScript, Python,
                        Java,
                        Dart, Rust, and Go. With a passion for software development, I have extensive experience working
                        with backend frameworks such as Node.js, Flask, and Express, as well as frontend frameworks and
                        libraries like React, Next.js, Flutter, and Swing.
                    </p>
                    <p className={styles.aboutMe} style={poppins.style}>

                        I am a quick learner and always eager to take on new technologies, which is reflected in my
                        experience working with tools such as Git VCS, REST API, BeautifulSoup, Nmap, Setoolkit, and
                        Wireshark. Alongside my technical skills, I am also adept in graphic design software, including
                        Inkscape, GIMP, Adobe Photoshop, and Adobe Illustrator.
                    </p>
                    <p className={styles.aboutMe} style={poppins.style}>

                        As a student scholar in the TÜBİTAK BİÇABA Scholarship Program, I have worked on the Explosive
                        Circuit Detection from X-Ray Images Using Ensemble and Deep Learning Techniques Project, where I
                        developed and applied new methods to detect explosive circuits in X-ray images.
                    </p>
                    <p className={styles.aboutMe} style={poppins.style}>

                        I am an active member of various organizations, including UCTEA Chamber of Electrical
                        Engineering,
                        Konya Technical University&apos;s Artificial Intelligence and Image Processing Community, Amazon
                        AWS,
                        IEEE Student Branch, and GitHub Developer Program. These experiences have not only broadened my
                        horizons but also given me opportunities to work collaboratively with peers and learn from
                        experienced professionals.
                    </p>
                    <p className={styles.aboutMe} style={poppins.style}>

                        Overall, I am passionate about technology and eager to contribute my skills to meaningful
                        projects.
                        My academic background, technical knowledge, and enthusiasm for innovation make me a valuable
                        addition to any team.
                    </p>
                </div>
                {/*
            <div className={styles.section}>
                <h1 style={poppins.style}>
                    What Am I Doing?
                </h1>
            </div>
            */}
            </div>
        </>
    );
}
