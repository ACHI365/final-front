import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function NavBar(): JSX.Element {
  const auth = useAuth();

  return (
    <div>
      <nav className="navbar navbar-expand navbar-light bg-light">
        <h1 className="navbar-brand ml-3" style={{ marginLeft: '10px' }}>
          <NavLink
            className="nav-link"
            to={auth.isAuthenticated ? 'mainPage' : 'login'}
          >
            Admin Panel
          </NavLink>
        </h1>
        <div
          className="collapse navbar-collapse justify-content-end"
          id="navbarTogglerDemo03"
        >
          <ul className="navbar-nav">
            {auth.isAuthenticated ? (
              <li className="nav-item">
                <button className="btn nav-link" onClick={auth.logout}>
                  <NavLink className="nav-link" to="login">
                    LogOut
                  </NavLink>
                </button>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="login">
                    LogIn
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="signup">
                    SignUp
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>
    </div>
  );
}

export default NavBar;
