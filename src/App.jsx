import Navbar from './components/Navbar.jsx';
import CommunityForum from './pages/CommunityForum.jsx';

export default function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="app-main">
        <CommunityForum />
      </main>
      <footer className="app-footer">
        <p>© {new Date().getFullYear()} Thinkz Community — built with React.</p>
      </footer>
    </div>
  );
}
