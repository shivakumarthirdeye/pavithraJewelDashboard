import React from 'react'
import styles from "./error.module.css";

const ErrorPage = () => {
    return (


        <div className={styles.contactCol2}>
            <img width={200} src='https://img.freepik.com/free-vector/hand-drawn-no-data-illustration_23-2150544949.jpg?semt=ais_hybrid' />
            <h2>Oops! No Data Found</h2>
            {/* <p>Ut consequat ac tortor eu vehicula. Aenean accumsan purus eros. Maecenas sagittis tortor at metus mollis</p> */}
            <div className={styles.buttonGroup}>
                <button type="submit" className={styles.saveButton} onClick={() => window.location.reload()}>
                    Refresh
                </button>
            </div>

        </div>
    )
}

export default ErrorPage