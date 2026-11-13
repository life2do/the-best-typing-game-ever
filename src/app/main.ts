import '@/ui/style.css';
import { Game } from './game';

const game = new Game(document.getElementById('world') as HTMLCanvasElement, document.getElementById('ui')!);
void game.boot();
