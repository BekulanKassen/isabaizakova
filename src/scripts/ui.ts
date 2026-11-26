// Header, menu (keeps focus while open), mobile action bar, in-page smooth scroll, hall chapters.
const one = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => r.querySelector<T>(s);
const all = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => Array.from(r.querySelectorAll<T>(s));

export function initUi(): void {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const head = one('#head')!, bar = one('#actbar'), hero = one('.hero');
  const home = !head.classList.contains('fixed');
  const onScroll = () => {
    const y = scrollY;
    if (home) head.classList.toggle('solid', y > 40);
    bar?.classList.toggle('show', hero ? y > hero.offsetHeight * 0.7 : y > 200);
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const menu = one('#menu')!, burger = one<HTMLButtonElement>('.head .burger')!;
  const openMenu = (o: boolean) => {
    menu.hidden = !o;
    burger.setAttribute('aria-expanded', String(o));
    document.body.style.overflow = o ? 'hidden' : '';
    if (o) one('nav a', menu)?.focus(); else burger.focus();
  };
  burger.addEventListener('click', () => openMenu(true));
  one('[data-close]', menu)!.addEventListener('click', () => openMenu(false));
  all('a', menu).forEach((a) => a.addEventListener('click', () => {
    menu.hidden = true; burger.setAttribute('aria-expanded', 'false'); document.body.style.overflow = '';
  }));
  document.addEventListener('keydown', (e) => {
    if (menu.hidden) return;
    if (e.key === 'Escape') { openMenu(false); return; }
    if (e.key !== 'Tab') return;
    const f = all('a[href],button', menu).filter((x) => x.offsetParent !== null);
    const first = f[0], last = f[f.length - 1], a = document.activeElement;
    if (!menu.contains(a)) { e.preventDefault(); first.focus(); }
    else if (e.shiftKey && a === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && a === last) { e.preventDefault(); first.focus(); }
  });

  all<HTMLAnchorElement>('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => {
    const id = a.getAttribute('href')!;
    if (id.length < 2) return;
    const target = document.querySelector<HTMLElement>(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    if (id === '#main') { target.setAttribute('tabindex', '-1'); target.focus({ preventScroll: true }); }
  }));

  const frames = all('#chframe img');
  if (frames.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((es) => es.forEach((en) => {
      if (en.isIntersecting) frames.forEach((f, k) => f.classList.toggle('on', k === Number((en.target as HTMLElement).dataset.i)));
    }), { rootMargin: '-45% 0px -45% 0px' });
    all('.ch').forEach((c) => io.observe(c));
  }
}
