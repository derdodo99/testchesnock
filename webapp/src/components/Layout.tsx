import { Link, useLocation } from 'react-router-dom';
import { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
    const { pathname } = useLocation();

    return (
        <div className="app">
            <main>{children}</main>

            <nav className="bottom-nav">
                <Link to="/leaders" className={pathname === '/leaders' ? 'active' : ''}>🏆 Лидеры</Link>
                <Link to="/giveaways" className={pathname === '/giveaways' ? 'active' : ''}>🎁 Розыгрыши</Link>
                <Link to="/play" className={pathname === '/play' ? 'active' : ''}>🎮 Играть</Link>
                <Link to="/tasks" className={pathname === '/tasks' ? 'active' : ''}>📝 Задачи</Link>
                <Link to="/profile" className={pathname === '/profile' ? 'active' : ''}>👤 Профиль</Link>
            </nav>
        </div>
    );
}
