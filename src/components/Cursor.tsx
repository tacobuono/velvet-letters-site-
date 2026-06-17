import { useEffect, useRef } from 'react';

/** Gold radial-glow cursor follower. Hidden on touch / coarse pointers. */
export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const el = ref.current;
    if (!el) return;
    el.style.opacity = '1';
    // Coalesce: mousemove can fire faster than the display refreshes. Stash the
    // latest position and write the transform once per frame so we never queue
    // redundant style writes ahead of paint.
    let raf = 0;
    let x = 0;
    let y = 0;
    const apply = () => {
      raf = 0;
      el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
    };
    const move = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    window.addEventListener('mousemove', move);
    return () => {
      window.removeEventListener('mousemove', move);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[2] h-[300px] w-[300px] rounded-full opacity-0 transition-opacity duration-500"
      style={{
        background: 'radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%)',
      }}
    />
  );
}
