import styles from "@/styles/Contact.module.css";
import { Poppins } from "next/font/google";
import ContactItem from "@/components/ContactItem/ContactItem";
import {
    AiFillTwitterCircle,
    AiFillLinkedin,
    AiFillGithub,
    AiFillInstagram,
    AiFillFacebook,
    AiFillAccountBook,
} from "react-icons/ai";
import Head from "next/head";
import { useState } from "react";

const poppins = Poppins({ weight: "500", subsets: ["latin"] });
const contactInfo: any = [
    { name: "github", link: "https://github.com/onurravli", icon: <AiFillGithub /> },
    { name: "linkedin", link: "https://www.linkedin.com/in/onurravli/", icon: <AiFillLinkedin /> },
    { name: "twitter", link: "https://twitter.com/onurravli", icon: <AiFillTwitterCircle /> },
    { name: "instagram", link: "https://www.instagram.com/onurravli/", icon: <AiFillInstagram /> },
    { name: "facebook", link: "https://www.facebook.com/onurravli", icon: <AiFillFacebook /> },
];

export default function Contact() {
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const fullname: string = name + " " + surname;
        const res = await fetch("/api/sendgrid", {
            body: JSON.stringify({
                email: email,
                fullname: fullname,
                message: message,
            }),
            headers: {
                "Content-Type": "application/json",
            },
            method: "POST",
        });
        const { error } = await res.json();
        if (error) {
            console.log(error);
            return;
        }
        console.log(fullname, email, message);
    };

    return (
        <>
            <Head>
                <title>Onur Ravli - Contact</title>
                <meta name={"description"} content={"Onur Ravli Personal Web Page."} />
                <meta name={"keywords"} content={"onur ravli, onurravli, onur ravlı, ravlico"} />
                <meta name={"author"} content={"Onur Ravli"} />
                <meta
                    name={"viewport"}
                    content={"width=device-width, initial-scale=1.0, max-scale=1.0"}
                />
                <meta name={"theme-color"} content={"#fff"} />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className={styles.main}>
                <div className={styles.section}>
                    <h1 style={poppins.style}>How To Reach Me?</h1>
                    <p style={poppins.style}>You can reach me via the following ways:</p>
                    <div className={styles.contactItems}>
                        {contactInfo.map((item: any) => {
                            return ContactItem(item.icon, item.name, item.link);
                        })}
                    </div>
                    <p className={styles.contactTip} style={poppins.style}>
                        Or you can send me a message via the form below. <br />I don&apos;t
                        recommend it though because <b>it doesn&apos;t work</b> yet.
                    </p>
                    <form method={"POST"} action={""} className={styles.contactForm}>
                        <label>
                            <input
                                style={poppins.style}
                                className={styles.formInput}
                                type={"text"}
                                placeholder={"Your Name"}
                                required={true}
                                name={"name"}
                            />
                        </label>
                        <label>
                            <input
                                style={poppins.style}
                                className={styles.formInput}
                                type={"text"}
                                placeholder={"Your Surname"}
                                required={true}
                                name={"surname"}
                            />
                        </label>
                        <label>
                            <input
                                style={poppins.style}
                                className={styles.formInput}
                                type={"email"}
                                placeholder={"Your Mail Address"}
                                required={true}
                                name={"email"}
                            />
                        </label>
                        <label>
                            <textarea
                                style={poppins.style}
                                className={styles.formInput}
                                placeholder={"Your Message"}
                                required={true}
                                name={"message"}
                            />
                        </label>
                        <hr />
                        <label>
                            <input
                                style={poppins.style}
                                className={styles.sendButton}
                                type={"submit"}
                                value={"Send"}
                                name={"submit"}
                            />
                        </label>
                    </form>
                </div>
            </div>
        </>
    );
}
