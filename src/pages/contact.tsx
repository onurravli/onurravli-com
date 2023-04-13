import styles from "@/styles/Contact.module.css";
import { Poppins } from "next/font/google";
import ContactItem from "@/components/ContactItem/ContactItem";

import {
    AiFillTwitterCircle,
    AiFillLinkedin,
    AiFillGithub,
    AiFillInstagram,
    AiFillFacebook, AiFillAccountBook,
} from "react-icons/ai";

const poppins = Poppins({ weight: "500", subsets: ["latin"] });

const contactInfo: any = [
    { "name": "github", "link": "https://github.com/onurravli", "icon": <AiFillGithub /> },
    { "name": "linkedin", "link": "https://www.linkedin.com/in/onurravli/", "icon": <AiFillLinkedin /> },
    { "name": "twitter", "link": "https://twitter.com/onurravli", "icon": <AiFillTwitterCircle /> },
    { "name": "instagram", "link": "https://www.instagram.com/onurravli/", "icon": <AiFillInstagram /> },
    { "name": "facebook", "link": "https://www.facebook.com/onurravli", "icon": <AiFillFacebook /> },
];

export default function Contact() {
    return (
        <div className={styles.main}>
            <div className={styles.section}>
                <h1 style={poppins.style}>
                    How To Reach Me?
                </h1>
                <p style={poppins.style}>
                    You can reach me via the following ways:
                </p>
                <div className={styles.contactItems}>
                    {
                        contactInfo.map((item: any) => {
                            return ContactItem(item.icon, item.name, item.link);
                        })
                    }
                </div>
                <p className={styles.contactTip} style={poppins.style}>
                    Or you can send me a message via the form below. <br/>I don&apos;t recommend
                    it though because <b>it doesn&apos;t work</b> yet.
                </p>
                <form className={styles.contactForm}>
                    <label>
                        <input
                            style={poppins.style}
                            className={styles.formInput}
                            type={"text"}
                            placeholder={"Your Name"}
                            required={true}
                        />
                    </label>
                    <label>
                        <input
                            style={poppins.style}
                            className={styles.formInput}
                            type={"text"}
                            placeholder={"Your Surname"}
                            required={true}
                        />
                    </label>
                    <label>
                        <input
                            style={poppins.style}
                            className={styles.formInput}
                            type={"email"}
                            placeholder={"Your Mail Address"}
                            required={true}
                        />
                    </label>
                    <label>
                        <textarea
                            style={poppins.style}
                            className={styles.formInput}
                            placeholder={"Your Message"}
                            required={true}
                        />
                    </label>
                    <hr />
                    <label>
                        <input
                            style={poppins.style}
                            className={styles.sendButton}
                            type={"submit"}
                            value={"Send"}
                        />
                    </label>
                </form>
            </div>
        </div>
    )
        ;
}
