import { Link } from "react-router"
import styles from "./page.module.css"

export default function HomePage() {
  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Rent the Perfect Bike for Your Adventure</h1>
            <p className={styles.heroDescription}>
              Discover our wide range of bikes - from mountain bikes to electric rides. Book instantly and start your
              journey today.
            </p>
            <div className={styles.heroActions}>
              <Link to="/dashboard" className={styles.primaryBtn}>
                Browse Bikes
              </Link>
              <Link to="/register" className={styles.secondaryBtn}>
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.features}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Why Choose BikeRent?</h2>
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🚴</div>
              <h3>Wide Selection</h3>
              <p>Choose from mountain bikes, road bikes, hybrids, and electric bikes</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>⚡</div>
              <h3>Instant Booking</h3>
              <p>Book your bike instantly with our easy-to-use platform</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🔒</div>
              <h3>Secure & Safe</h3>
              <p>All bikes are regularly maintained and safety-checked</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>💰</div>
              <h3>Affordable Rates</h3>
              <p>Competitive hourly rates with no hidden fees</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
