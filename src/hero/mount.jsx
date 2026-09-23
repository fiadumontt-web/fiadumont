import { createRoot } from 'react-dom/client';
import HeroCanvas from './HeroCanvas.jsx';

export function mountHero(container, tier) {
  const root = createRoot(container);
  root.render(<HeroCanvas tier={tier} onReady={() => container.classList.add('is-ready')} />);
  return root;
}
