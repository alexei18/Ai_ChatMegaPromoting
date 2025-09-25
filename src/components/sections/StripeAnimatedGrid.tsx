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

    function drawSmartLine(from: string, to: string, color1: string, color2: string, lineIndex: number, totalLines: number) {
      const fromEl = icons[from as keyof typeof icons];
      const toEl = icons[to as keyof typeof icons];
      if (!fromEl || !toEl) return;

      const cornerRadius = container!.offsetWidth * 0.04;
      const p1_center = getCenter(fromEl);
      const p2_center = getCenter(toEl);
      if ((p1_center.x === 0 && p1_center.y === 0) || (p2_center.x === 0 && p2_center.y === 0)) return;

      let p1 = { ...p1_center };
      const p2 = { ...p2_center };

      const offsetAmount = 5; // The pixel spacing between lines

      if (totalLines > 1) {
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const length = Math.sqrt(dx * dx + dy * dy);
        if (length > 0) {
          const perpX = -dy / length;
          const perpY = dx / length;
          const invertedLineIndex = totalLines - 1 - lineIndex;
          const offset = (invertedLineIndex - (totalLines - 1) / 2) * offsetAmount;
          p1.x += offset * perpX;
          p1.y += offset * perpY;
        }
      }

      const gradId = `grad-${from}-${to}-${lineIndex}`;
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
      // Animation 1: User -> AI -> Instagram & Facebook
      {
        active: ['billing', 'tax', 'capital', 'invoicing'],
        lines: [
          { from: 'billing', to: 'tax', colors: ['#00d4ff', '#6a1ee4'] },
          { from: 'tax', to: 'capital', colors: ['#6a1ee4', '#ff69b4'] },
          { from: 'tax', to: 'invoicing', colors: ['#6a1ee4', '#1877F2'] },
        ],
      },
      // Animation 2: User -> Integration -> Website
      {
        active: ['billing', 'terminal', 'issuing'],
        lines: [
          { from: 'billing', to: 'terminal', colors: ['#00d4ff', '#6a1ee4'] },
          { from: 'terminal', to: 'issuing', colors: ['#6a1ee4', '#3ecf8e'] },
        ],
      },
      // Animation 3: Facebook & Instagram -> AI -> Programare -> Email
      {
        active: ['invoicing', 'capital', 'tax', 'radar', 'treasury'],
        lines: [
          { from: 'invoicing', to: 'tax', colors: ['#1877F2', '#6a1ee4'] },
          { from: 'capital', to: 'tax', colors: ['#ff69b4', '#6a1ee4'] },
          { from: 'tax', to: 'radar', colors: ['#6a1ee4', '#f6a44c'] },
          { from: 'radar', to: 'treasury', colors: ['#f6a44c', '#ff69b4'] },
        ],
      },
      // Animation 4: User -> AI -> Telegram
      {
        active: ['billing', 'tax', 'connect'],
        lines: [
          { from: 'billing', to: 'tax', colors: ['#00d4ff', '#6a1ee4'] },
          { from: 'tax', to: 'connect', colors: ['#6a1ee4', '#0088CC'] },
        ],
      },
      // Animation 5: Telegram -> AI -> Email
      {
        active: ['connect', 'tax', 'treasury'],
        lines: [
          { from: 'connect', to: 'tax', colors: ['#0088CC', '#6a1ee4'] },
          { from: 'tax', to: 'treasury', colors: ['#6a1ee4', '#ff69b4'] },
        ],
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

        const scene = scenes[currentScene];
        scene.active.forEach(id => icons[id as keyof typeof icons]?.classList.add(styles.active));

        const linesFromCount: { [key: string]: { from: string, to: string, colors: string[] }[] } = {};
        scene.lines.forEach(line => {
          if (!linesFromCount[line.from]) linesFromCount[line.from] = [];
          linesFromCount[line.from].push(line);
        });

        scene.lines.forEach(line => {
          const totalLines = linesFromCount[line.from].length;
          const lineIndex = linesFromCount[line.from].indexOf(line);
          drawSmartLine(line.from, line.to, line.colors[0], line.colors[1], lineIndex, totalLines);
        });

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

      {/* Faded background icons for grid structure */}
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

      {/* Grid Position: 1,2 */}
      <div className={styles.icon} id={styles['icon-billing']} ref={el => { iconRefs.current['icon-billing'] = el; }}>
        <svg className={styles.logo} viewBox="0 0 32 32"><path d="M16 17a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0-8a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM16 19c-4.4 0-8 1.8-8 4v3h16v-3c0-2.2-3.6-4-8-4z" fill="#00d4ff"></path></svg>
        <span className={styles.label}>User</span>
      </div>
      {/* Grid Position: 1,3 */}
      <div className={styles.icon} id={styles['icon-connect']} ref={el => { iconRefs.current['icon-connect'] = el; }}>
        <svg className={styles.logo} viewBox="0 0 32 32"><path d="M4 15.9l6.5 2.5 10.1-6.4c.5-.3 1 .1 1.2.3s.2.5 0 .7l-8.2 7.4-1 6.5c.7 0 1-.2 1.3-.5l2.2-2.1 4.1 3c.6.4 1.2.2 1.5-.4L28 6.2c.3-.8-.2-1.4-1-1.2L4 15.9z" fill="#0088CC"></path></svg>
        <span className={styles.label}>Telegram</span>
      </div>
      {/* Grid Position: 1,4 (Mapped to 2,4) */}
      <div className={styles.icon} id={styles['icon-terminal']} ref={el => { iconRefs.current['icon-terminal'] = el; }}>
        <svg className={styles.logo} viewBox="0 0 32 32"><path d="M12 12h-2v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zM12 16h-2v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zM12 20h-2v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2z" fill="#00d4ff"></path><path d="M28 4H4C2.9 4 2 4.9 2 6v20c0 1.1.9 2 2 2h24c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM8 24H4v-4h4v4zm0-6H4v-4h4v4zm0-6H4V8h4v4zm18 12h-4v-4h4v4zm0-6h-4v-4h4v4zm0-6h-4V8h4v4zm6 12h-4v-4h4v4zm0-6h-4v-4h4v4zm0-6h-4V8h4v4z" fill="#6a1ee4"></path></svg>
        <span className={styles.label}>Integration</span>
      </div>

      {/* Grid Position: 2,1 */}
      <div className={styles.icon} id={styles['icon-tax']} ref={el => { iconRefs.current['icon-tax'] = el; }}>
        <svg className={styles.logo} viewBox="0 0 32 32"><path fill="#8ce8f3" d="M21.5 13.9c-.2-1.2-1.6-2.8-2.1-3.3-.6-.6-1.3-1-2.2-1.2-.8-.2-1.6-.1-2.4.2-.7.3-1.4.8-1.9 1.4-.6.6-1 1.3-1.2 2.2-.2.8-.1 1.6.2 2.4.3.7.8 1.4 1.4 1.9.6.6 1.3 1 2.2 1.2.8.2 1.6.1 2.4-.2.7-.3 1.4-.8 1.9-1.4.6-.6 1-1.3 1.2-2.2m-5.1 4.7c-1.1 0-2.1-.4-2.9-1.2-.8-.8-1.2-1.8-1.2-2.9s.4-2.1 1.2-2.9c.8-.8 1.8-1.2 2.9-1.2s2.1.4 2.9 1.2c.8.8 1.2 1.8 1.2 2.9s-.4 2.1-1.2 2.9c-.8.8-1.8 1.2-2.9 1.2z"/><path fill="#6a1ee4" d="M22.3 20.2c-.5-.2-1-.1-1.4.3l-1.5 1.5c-.4.4-.3.9.1 1.3l4.3 4.3c.4.4.9.3 1.3-.1l1.5-1.5c.4-.4.5-1 .3-1.4l-4.6-4.4zM9.8 22.3c.2.5.1 1-.3 1.4l-1.5 1.5c-.4.4-.9.3-1.3-.1l-4.3-4.3c-.4-.4-.5-.9-.1-1.3l1.5-1.5c.4-.4 1-.5 1.4-.3l4.6 4.4zM20.2 9.8c.2-.5.1-1-.3-1.4l-1.5-1.5c-.4-.4-.9-.3-1.3.1L12.8 11c-.4.4-.3.9.1 1.3l1.5 1.5c.4.4 1 .5 1.4.3l4.4-4.3zM9.8 9.8c-.5.2-1 .1-1.4-.3l-1.5-1.5c-.4-.4-.3-.9.1-1.3L11.3 2.4c.4-.4.9-.3 1.3.1l1.5 1.5c.4.4.5 1 .3 1.4l-4.6 4.4z"/></svg>
        <span className={styles.label}>AI</span>
      </div>

      {/* Grid Position: 3,2 */}
      <div className={styles.icon} id={styles['icon-invoicing']} ref={el => { iconRefs.current['icon-invoicing'] = el; }}>
        <svg className={styles.logo} viewBox="0 0 32 32"><path d="M28 16c0-6.6-5.4-12-12-12S4 9.4 4 16c0 5.5 3.7 10.1 8.8 11.6V19.8H9.7v-3.8h3.1v-2.9c0-3.1 1.8-4.8 4.7-4.8 1.3 0 2.8.2 2.8.2v3.2h-1.6c-1.5 0-2 .9-2 1.9v2.3h3.6l-.6 3.8h-3v7.8C24.3 26.1 28 21.5 28 16z" fill="#1877F2"></path></svg>
        <span className={styles.label}>Facebook</span>
      </div>
      {/* Grid Position: 3,3 */}
      <div className={styles.icon} id={styles['icon-radar']} ref={el => { iconRefs.current['icon-radar'] = el; }}>
        <svg className={styles.logo} viewBox="0 0 32 32"><path d="M12.3 5.1L10.2 4 4 10.2l1.1 2.1 5.1-2.6zM21.8 4l-2.1 1.1 2.6 5.1 2.1-1.1zM16 12.3c-2.1 0-3.7 1.7-3.7 3.7s1.7 3.7 3.7 3.7 3.7-1.7 3.7-3.7-1.7-3.7-3.7-3.7zM28 10.2L21.8 4l-1.1 2.1 2.6 5.1L28 10.2zM4 21.8l6.2 6.2 2.1-1.1-5.1-2.6-1.1-5.1-2.1 1.1zM21.8 28l2.1-1.1-5.1-2.6-2.6 5.1 1.1 2.1 4.5-3.5zM10.2 28l6.2-6.2-2.1-1.1-5.1 2.6-1.1 5.1 2.1-1.1z" fill="#f6a44c"></path></svg>
        <span className={styles.label}>Programare</span>
      </div>
      {/* Grid Position: 3,4 */}
      <div className={styles.icon} id={styles['icon-issuing']} ref={el => { iconRefs.current['icon-issuing'] = el; }}>
        <svg className={styles.logo} viewBox="0 0 32 32"><path d="M16 4C9.4 4 4 9.4 4 16s5.4 12 12 12 12-5.4 12-12S22.6 4 16 4zm8.9 10.8h-5.6c-.2-2.8-.6-5.4-1.1-7.8 2.8.9 5 2.9 6.7 5.8zM16 6.1c.8 2.5 1.3 5.2 1.5 8.1h-3c.2-2.9.7-5.6 1.5-8.1zm-3.2 9.9h6.4c-.2 2.9-.7 5.6-1.5 8.1h-3.4c-.8-2.5-1.3-5.2-1.5-8.1zm-1.7 8.1c-.5-2.4-.9-5-1.1-7.8H4.4c1.7 2.9 3.9 4.9 6.7 5.8zm-6.7-2h5.6c.2-2.8.6-5.4 1.1-7.8-2.8-.9-5-2.9-6.7-5.8zM16 25.9c-.8-2.5-1.3-5.2-1.5-8.1h3c-.2 2.9-.7 5.6-1.5 8.1zm3.2-9.9h-6.4c.2-2.9.7-5.6 1.5-8.1h3.4c.8 2.5 1.3 5.2 1.5 8.1zm1.7-8.1c.5 2.4.9 5 1.1 7.8h5.6c-1.7-2.9-3.9-4.9-6.7-5.8z" fill="#3ecf8e"></path></svg>
        <span className={styles.label}>Website</span>
      </div>

      {/* Grid Position: 4,1 (Mapped to 3,1) */}
      <div className={styles.icon} id={styles['icon-capital']} ref={el => { iconRefs.current['icon-capital'] = el; }}>
        <svg className={styles.logo} viewBox="0 0 32 32" fill="none"><defs><radialGradient id="a" cx="25.5" cy="26" r="26.5" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#FD1D1D"/><stop offset=".1" stop-color="#FD1D1D"/><stop offset=".5" stop-color="#C13584"/><stop offset="1" stop-color="#405DE6"/></radialGradient></defs><path fill="url(#a)" d="M22.9 4H9.1C6.3 4 4 6.3 4 9.1v13.7C4 25.7 6.3 28 9.1 28h13.7c2.8 0 5.1-2.3 5.1-5.1V9.1C28 6.3 25.7 4 22.9 4z"/><path fill="#fff" d="M16 21.8c-3.2 0-5.8-2.6-5.8-5.8s2.6-5.8 5.8-5.8 5.8 2.6 5.8 5.8-2.6 5.8-5.8 5.8zm0-9.3c-1.9 0-3.5 1.6-3.5 3.5s1.6 3.5 3.5 3.5 3.5-1.6 3.5-3.5-1.6-3.5-3.5-3.5zm6.4-2.4c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
        <span className={styles.label}>Instagram</span>
      </div>
      {/* Grid Position: 4,3 (Mapped to 4,2) */}
      <div className={styles.icon} id={styles['icon-treasury']} ref={el => { iconRefs.current['icon-treasury'] = el; }}>
        <svg className={styles.logo} viewBox="0 0 32 32"><path d="M28 8H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h24c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-2.1 2L16 16.8 6.1 10h19.8zM4 22V10.4l11.4 8.4c.3.3.8.3 1.1 0L28 10.4V22H4z" fill="#ff69b4"></path></svg>
        <span className={styles.label}>Email</span>
      </div>
      
      {/* Unused Icons */}
      <div className={styles.icon} id={styles['icon-payments']} ref={el => { iconRefs.current['icon-payments'] = el; }}></div>
      <div className={styles.icon} id={styles['icon-checkout']} ref={el => { iconRefs.current['icon-checkout'] = el; }}></div>
    </div>
  );
};

export default StripeAnimatedGrid;