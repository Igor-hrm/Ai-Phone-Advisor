import { Link, NavLink } from 'react-router-dom';

import styles from './Header.module.scss';

export const Header = () => {
  return (
    <header className={styles.header}>
      <nav className={styles.header__nav}>
        {/* LOGO */}
        <div className={styles.header__logo}>
          <Link to="/" className={styles['header__logo-link']}>
            <img src="./logo/Logo.svg" alt="Phone catalog Logo" />
          </Link>
        </div>

        {/* PAGES */}
        <div className={styles.header__pages}>
          <NavLink to="/">phones</NavLink>
        </div>
      </nav>
    </header>
  );
};
