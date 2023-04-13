import { AiFillAccountBook, AiFillInstagram } from "react-icons/ai";
import styles from "@/styles/ContactItem.module.css";


export default function ContactItem(
    icon: string,
    text: string,
    link: string,
) {
    return (
        <div className={styles.contactItem}>
            <a href={link}>
                <div className={styles.contactItemContainer}>
                    <div className={styles.contactItemIcon}>
                        {icon}
                    </div>
                </div>
            </a>
        </div>
    );
}