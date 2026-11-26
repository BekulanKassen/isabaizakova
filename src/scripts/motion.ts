// GSAP layer, moved from site/index.html. Does nothing under prefers-reduced-motion; the page is whole without it.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const all = (s: string) => Array.from(document.querySelectorAll<HTMLElement>(s));

export function initMotion(): void {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  gsap.registerPlugin(ScrollTrigger);
  document.documentElement.dataset.gsapReady = '';
  const mm = gsap.matchMedia();

  if (document.querySelector('.hero')) {
    gsap.timeline({ defaults: { ease: 'power3.out' } })
      .from('.hero-media img', { scale: 1.16, duration: 2.4, ease: 'power2.out' }, 0)
      .from('.h1-line>span', { yPercent: 105, duration: 1.15, stagger: 0.12 }, 0.15)
      .from('.hero [data-in]', { y: 28, autoAlpha: 0, duration: 0.9, stagger: 0.09 }, 0.55)
      .from('.head', { autoAlpha: 0, y: -12, duration: 0.8 }, 0.5);
    gsap.to('.hero-media img', { yPercent: 14, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.hero-content', { yPercent: -12, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  }

  all('.col-media img').forEach((im) => {
    gsap.fromTo(im, { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: im.closest('.col-media'), start: 'top bottom', end: 'bottom top', scrub: true } });
  });

  if (document.querySelector('.hall-intro')) {
    mm.add({ desk: '(min-width: 900px)', mob: '(max-width: 899px)' }, (ctx) => {
      const d = ctx.conditions!.desk;
      gsap.timeline({ scrollTrigger: { trigger: '.hall-intro', start: 'top top', end: '+=110%', scrub: 0.6, pin: true, anticipatePin: 1 } })
        .fromTo('#arch', { clipPath: d ? 'inset(14% 37% 0% 37% round 999px 999px 0px 0px)' : 'inset(22% 14% 0% 14% round 999px 999px 0px 0px)' }, { clipPath: 'inset(0% 0% 0% 0% round 0px 0px 0px 0px)', ease: 'none', duration: 1 }, 0)
        .fromTo('#arch img', { scale: 1.1 }, { scale: 1, ease: 'none', duration: 1 }, 0)
        .fromTo('.hall-word', { scale: 1 }, { scale: 0.86, ease: 'none', duration: 1 }, 0)
        .fromTo('.hall-cap .wrap>*', { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.06, duration: 0.35, ease: 'power2.out' }, 0.7);

      if (d) {
        const track = document.getElementById('track')!, tl = document.getElementById('tl')!;
        tl.classList.add('tl-h');
        const dist = () => Math.max(0, track.scrollWidth - innerWidth);
        gsap.timeline({ scrollTrigger: { trigger: '#tl', start: 'top top+=72', end: () => '+=' + dist(), scrub: 0.5, pin: true, anticipatePin: 1, invalidateOnRefresh: true } })
          .to(track, { x: () => -dist(), ease: 'none' }, 0)
          .fromTo('#tlbar', { scaleX: 0.08 }, { scaleX: 1, ease: 'none' }, 0);
        return () => tl.classList.remove('tl-h');
      }
    });
  }

  if (document.querySelector('.y85')) {
    all('.arc').forEach((a) => {
      const s = parseFloat(a.dataset.speed ?? '1') || 1;
      gsap.fromTo(a, { y: 60 * s }, { y: -60 * s, ease: 'none', scrollTrigger: { trigger: '.y85', start: 'top bottom', end: 'bottom top', scrub: true } });
    });
    gsap.fromTo('.big85', { yPercent: 12, scale: 0.94 }, { yPercent: -6, scale: 1, ease: 'none', scrollTrigger: { trigger: '.y85', start: 'top bottom', end: 'bottom top', scrub: true } });
  }

  const pv = document.getElementById('preview'), list = document.getElementById('events');
  if (pv && list && matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const pimgs = Array.from(pv.querySelectorAll('img'));
    gsap.set(pv, { xPercent: -50, yPercent: -50, scale: 0.94 });
    const xTo = gsap.quickTo(pv, 'x', { duration: 0.55, ease: 'power3' }), yTo = gsap.quickTo(pv, 'y', { duration: 0.55, ease: 'power3' });
    list.addEventListener('mousemove', (e) => { xTo(e.clientX + 190); yTo(e.clientY); });
    all('#events .ev').forEach((r) => r.addEventListener('mouseenter', () => {
      pimgs.forEach((im, k) => im.classList.toggle('on', k === Number(r.dataset.img)));
      gsap.to(pv, { autoAlpha: 1, scale: 1, duration: 0.35, ease: 'power3.out' });
    }));
    list.addEventListener('mouseleave', () => gsap.to(pv, { autoAlpha: 0, scale: 0.94, duration: 0.2, ease: 'power2.out' }));
  }

  addEventListener('load', () => ScrollTrigger.refresh());
}
