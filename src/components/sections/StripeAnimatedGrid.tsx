"use client";
import React, { useEffect, useRef } from 'react';
import styles from './StripeAnimatedGrid.module.css';

const StripeAnimatedGrid = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgCanvasRef = useRef<SVGSVGElement>(null);
  const iconRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    const container = containerRef.current;
    const svgCanvas = svgCanvasRef.current;
    if (!container || !svgCanvas) return;

    const icons = {
      connect: iconRefs.current['icon-connect'],
      capital: iconRefs.current['icon-capital'],
      treasury: iconRefs.current['icon-treasury'],
      terminal: iconRefs.current['icon-terminal'],
      payments: iconRefs.current['icon-payments'],
      tax: iconRefs.current['icon-tax'],
      radar: iconRefs.current['icon-radar'],
      billing: iconRefs.current['icon-billing'],
      invoicing: iconRefs.current['icon-invoicing'],
      issuing: iconRefs.current['icon-issuing'],
      checkout: iconRefs.current['icon-checkout'],
    };

    const namespace = 'http://www.w3.org/2000/svg';
    let animationInterval: NodeJS.Timeout;

    function getCenter(el: HTMLElement) {
      return { x: el.offsetLeft + el.offsetWidth / 2, y: el.offsetTop + el.offsetHeight / 2 };
    }

    function createGradient(defs: SVGDefsElement, id: string, p1: { x: number, y: number }, p2: { x: number, y: number }, c1: string, c2: string) {
      const grad = document.createElementNS(namespace, 'linearGradient');
      grad.setAttribute('id', id);
      grad.setAttribute('x1', String(p1.x));
      grad.setAttribute('y1', String(p1.y));
      grad.setAttribute('x2', String(p2.x));
      grad.setAttribute('y2', String(p2.y));
      grad.setAttribute('gradientUnits', 'userSpaceOnUse');
      const s1 = document.createElementNS(namespace, 'stop');
      s1.setAttribute('offset', '0%');
      s1.setAttribute('stop-color', c1);
      const s2 = document.createElementNS(namespace, 'stop');
      s2.setAttribute('offset', '100%');
      s2.setAttribute('stop-color', c2);
      grad.appendChild(s1);
      grad.appendChild(s2);
      defs.appendChild(grad);
    }

    function createPath(d: string, gradId: string) {
      const path = document.createElementNS(namespace, 'path');
      path.setAttribute('class', styles.line);
      path.setAttribute('d', d);
      path.style.stroke = `url(#${gradId})`;
      svgCanvas!.appendChild(path);
    }

    function drawSmartLine(from: string, to: string, color1: string, color2: string) {
      const fromEl = icons[from as keyof typeof icons];
      const toEl = icons[to as keyof typeof icons];
      if (!fromEl || !toEl) return;

      const cornerRadius = container!.offsetWidth * 0.04;
      const p1 = getCenter(fromEl);
      const p2 = getCenter(toEl);
      if (p1.x === 0 && p1.y === 0) return;
      const gradId = `grad-${from}-${to}`;
      const defs = svgCanvas!.querySelector('defs') || document.createElementNS(namespace, 'defs');
      if (!svgCanvas!.contains(defs)) svgCanvas!.prepend(defs);
      createGradient(defs, gradId, p1, p2, color1, color2);
      if (Math.abs(p1.x - p2.x) < 5 || Math.abs(p1.y - p2.y) < 5) {
        createPath(`M ${p1.x} ${p1.y} L ${p2.x} ${p2.y}`, gradId);
      } else {
        const xSign = p1.x < p2.x ? 1 : -1;
        const ySign = p1.y < p2.y ? 1 : -1;
        const sweepFlag = (xSign === ySign) ? 0 : 1;
        const d = `M ${p1.x} ${p1.y} V ${p2.y - cornerRadius * ySign} A ${cornerRadius} ${cornerRadius} 0 0 ${sweepFlag} ${p1.x + cornerRadius * xSign} ${p2.y} H ${p2.x}`;
        createPath(d, gradId);
      }
    }

    const scenes = [
      () => {
        ['connect', 'capital', 'treasury'].forEach(id => icons[id as keyof typeof icons]?.classList.add(styles.active));
        drawSmartLine('capital', 'treasury', '#3ecf8e', '#00d4ff');
      },
      () => {
        ['connect', 'terminal'].forEach(id => icons[id as keyof typeof icons]?.classList.add(styles.active));
        drawSmartLine('connect', 'terminal', '#00d4ff', '#6a1ee4');
      },
      () => {
        ['payments', 'terminal'].forEach(id => icons[id as keyof typeof icons]?.classList.add(styles.active));
        drawSmartLine('payments', 'terminal', '#8ce8f3', '#6a1ee4');
      },
      () => {
        ['tax', 'payments', 'radar'].forEach(id => icons[id as keyof typeof icons]?.classList.add(styles.active));
        drawSmartLine('tax', 'payments', '#ff69b4', '#8ce8f3');
        drawSmartLine('payments', 'radar', '#8ce8f3', '#6a1ee4');
      },
      () => {
        ['billing', 'invoicing'].forEach(id => icons[id as keyof typeof icons]?.classList.add(styles.active));
        drawSmartLine('billing', 'invoicing', '#f6a44c', '#3ecf8e');
      },
      () => {
        ['connect', 'payments', 'terminal'].forEach(id => icons[id as keyof typeof icons]?.classList.add(styles.active));
        drawSmartLine('connect', 'payments', '#00d4ff', '#8ce8f3');
        drawSmartLine('payments', 'terminal', '#8ce8f3', '#6a1ee4');
      },
    ];

    let currentScene = 0;
    const runScene = (advance = true) => {
      requestAnimationFrame(() => {
        Object.values(icons).forEach(icon => icon?.classList.remove(styles.active));
        if (svgCanvas) {
          const lines = svgCanvas.querySelectorAll(`.${styles.line}`);
          lines.forEach(line => line.remove());
          const defs = svgCanvas.querySelector('defs');
          if (defs) {
            defs.innerHTML = '';
          }
        }
        scenes[currentScene]();
        if (advance) {
          currentScene = (currentScene + 1) % scenes.length;
        }
      });
    };

    let resizeTimer: NodeJS.Timeout;
    const handleResize = () => {
      clearInterval(animationInterval);
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        runScene(false);
        animationInterval = setInterval(() => runScene(true), 2500);
      }, 150);
    };

    window.addEventListener('resize', handleResize);

    runScene(true);
    animationInterval = setInterval(() => runScene(true), 2500);

    return () => {
      clearInterval(animationInterval);
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className={styles.container} ref={containerRef}>
      <svg className={styles.svgCanvas} ref={svgCanvasRef}></svg>

      <div className={styles['faded-icon']} style={{ '--gc': 2, '--gr': 1 } as React.CSSProperties}></div>
      <div className={styles['faded-icon']} style={{ '--gc': 1, '--gr': 1 } as React.CSSProperties}></div>
      <div className={styles['faded-icon']} style={{ '--gc': 3, '--gr': 1 } as React.CSSProperties}></div>
      <div className={styles['faded-icon']} style={{ '--gc': 4, '--gr': 1 } as React.CSSProperties}></div>
      <div className={styles['faded-icon']} style={{ '--gc': 1, '--gr': 2 } as React.CSSProperties}></div>
      <div className={styles['faded-icon']} style={{ '--gc': 2, '--gr': 2 } as React.CSSProperties}></div>
      <div className={styles['faded-icon']} style={{ '--gc': 3, '--gr': 2 } as React.CSSProperties}></div>
      <div className={styles['faded-icon']} style={{ '--gc': 4, '--gr': 2 } as React.CSSProperties}></div>
      <div className={styles['faded-icon']} style={{ '--gc': 1, '--gr': 3 } as React.CSSProperties}></div>
      <div className={styles['faded-icon']} style={{ '--gc': 2, '--gr': 3 } as React.CSSProperties}></div>
      <div className={styles['faded-icon']} style={{ '--gc': 3, '--gr': 3 } as React.CSSProperties}></div>
      <div className={styles['faded-icon']} style={{ '--gc': 1, '--gr': 4 } as React.CSSProperties}></div>
      <div className={styles['faded-icon']} style={{ '--gc': 2, '--gr': 4 } as React.CSSProperties}></div>
      <div className={styles['faded-icon']} style={{ '--gc': 3, '--gr': 4 } as React.CSSProperties}></div>
      <div className={styles['faded-icon']} style={{ '--gc': 4, '--gr': 4 } as React.CSSProperties}></div>

      <div className={styles.icon} id={styles['icon-connect']} ref={el => iconRefs.current['icon-connect'] = el}>
        <svg className={styles.logo} viewBox="0 0 32 32"><circle cx="12" cy="16" r="4" fill="#00d4ff"></circle><circle cx="20" cy="16" r="4" fill="#0a2540" opacity="0.6"></circle></svg>
        <span className={styles.label}>Connect</span>
      </div>
      <div className={styles.icon} id={styles['icon-capital']} ref={el => iconRefs.current['icon-capital'] = el}>
        <svg className={styles.logo} viewBox="0 0 32 32"><path d="M16 4l8 8h-6v16h-4V12H8z" fill="#3ecf8e"></path><path d="M12 12h8v4h-8z" fill="#00d4ff"></path></svg>
        <span className={styles.label}>Capital</span>
      </div>
      <div className={styles.icon} id={styles['icon-treasury']} ref={el => iconRefs.current['icon-treasury'] = el}>
        <svg className={styles.logo} viewBox="0 0 32 32"><path d="M12 8h8v16h-8z" fill="#00d4ff"></path><path d="M20 8h4v16h-4z" fill="#3ecf8e"></path></svg>
        <span className={styles.label}>Treasury</span>
      </div>
      <div className={styles.icon} id={styles['icon-terminal']} ref={el => iconRefs.current['icon-terminal'] = el}>
        <svg className={styles.logo} viewBox="0 0 32 32"><path d="M8 12h16v4H8z" fill="#8ce8f3"></path><path d="M8 18h16v4H8z" fill="#6a1ee4"></path></svg>
        <span className={styles.label}>Terminal</span>
      </div>
      <div className={styles.icon} id={styles['icon-payments']} ref={el => iconRefs.current['icon-payments'] = el}>
        <svg className={styles.logo} viewBox="0 0 32 32"><path d="M16 4l-12 12 12 12 5-5-7-7 7-7z" fill="#6a1ee4"></path><path d="M16 16l7 7 5-5-12-12z" fill="#8ce8f3"></path></svg>
        <span className={styles.label}>Payments</span>
      </div>
      <div className={styles.icon} id={styles['icon-tax']} ref={el => iconRefs.current['icon-tax'] = el}>
        <svg className={styles.logo} viewBox="0 0 32 32"><path d="M16 4A12 12 0 004 16a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0016 4zm0 2a10 10 0 0110 10h-2a8 8 0 00-8-8V6z" fill="#6a1ee4"></path><path d="M16 6a10 10 0 018.6 14.9l-2.8-2.8A6 6 0 0016 10V6z" fill="#ff69b4"></path></svg>
        <span className={styles.label}>Tax</span>
      </div>
      <div className={styles.icon} id={styles['icon-radar']} ref={el => iconRefs.current['icon-radar'] = el}>
        <svg className={styles.logo} viewBox="0 0 32 32"><path d="M16 4L4 28h24L16 4zm0 4.5L22.5 24H9.5L16 8.5z" fill="#ff69b4"></path><path d="M16 12l-6 10h12l-6-10z" fill="#6a1ee4"></path></svg>
        <span className={styles.label}>Radar</span>
      </div>
      <div className={styles.icon} id={styles['icon-billing']} ref={el => iconRefs.current['icon-billing'] = el}>
        <svg className={styles.logo} viewBox="0 0 32 32"><circle cx="16" cy="12" r="6" fill="#f6a44c"></circle><rect x="10" y="20" width="12" height="4" fill="#3ecf8e"></rect></svg>
        <span className={styles.label}>Billing</span>
      </div>
      <div className={styles.icon} id={styles['icon-invoicing']} ref={el => iconRefs.current['icon-invoicing'] = el}>
        <svg className={styles.logo} viewBox="0 0 32 32"><path d="M8 8h16v4H8z" fill="#3ecf8e"></path><path d="M8 14h16v4H8z" fill="#3ecf8e"></path><path d="M8 20h8v4H8z" fill="#3ecf8e"></path></svg>
        <span className={styles.label}>Invoicing</span>
      </div>
      <div className={styles.icon} id={styles['icon-issuing']} ref={el => iconRefs.current['icon-issuing'] = el}>
        <svg className={styles.logo} viewBox="0 0 32 32"><path d="M8 8h16v8H8z" fill="#6a1ee4"></path><path d="M8 18h16v4H8z" fill="#ff69b4"></path></svg>
        <span className={styles.label}>Issuing</span>
      </div>
      <div className={styles.icon} id={styles['icon-checkout']} ref={el => iconRefs.current['icon-checkout'] = el}>
        <svg className={styles.logo} viewBox="0 0 32 32"><path d="M4 8l12 16 12-16H4zm2.5 2h19L16 20.5 6.5 10z" fill="#6a1ee4"></path><path d="M16 24l-4-4h8l-4 4z" fill="#8ce8f3"></path></svg>
        <span className={styles.label}>Checkout</span>
      </div>
    </div>
  );
};

export default StripeAnimatedGrid;