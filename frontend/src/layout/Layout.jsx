import { Outlet, Link } from "react-router-dom";

export function Layout() {
  return (
    <div className="app-layout">
      <header className="app-header">
        <div className="header-content">
          <h1>GEO Quiz</h1>
          <nav>
            <Link to="/">Generate Question</Link>
            <Link to="/history">History</Link>
          </nav>
        </div>
      </header>

      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
