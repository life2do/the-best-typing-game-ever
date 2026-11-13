/** Build fingerprint written by tools/build-content.ts (absent in plain dev mode). */
interface BuildInfo {
  build: string;
  id: string;
  commit: string;
  builtAt: string;
}
const found = import.meta.glob('../generated/build-info.json', { eager: true, import: 'default' }) as Record<string, BuildInfo>;
const info = Object.values(found)[0];
export const BUILD = info?.build ?? 'dev';
export const BUILD_ID = info?.id ?? 'dev';
export const COMMIT = info?.commit ?? 'dev';
export const REPO_URL = 'https://github.com/life2do/the-best-typing-game-ever';

/** Small "commit abc1234 · build XYZ" badge linking to the commit on GitHub. */
export function versionBadge(): HTMLElement {
  const short = COMMIT === 'dev' || COMMIT === 'unknown' ? COMMIT : COMMIT.slice(0, 7);
  const el = document.createElement(short === 'dev' ? 'span' : 'a');
  el.className = 'version';
  el.textContent = `commit ${short} · build ${BUILD_ID.slice(0, 8)}`;
  el.title = `Build ${BUILD}\nCommit ${COMMIT}`;
  if (el instanceof HTMLAnchorElement) {
    el.href = `${REPO_URL}/commit/${COMMIT}`;
    el.target = '_blank';
    el.rel = 'noopener';
  }
  return el;
}
