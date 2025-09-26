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

    function drawSmartLine(from: string, to: string, color1: string, color2: string, fromLineIndex: number, fromTotalLines: number, toLineIndex: number, toTotalLines: number) {
      const fromEl = icons[from as keyof typeof icons];
      const toEl = icons[to as keyof typeof icons];
      if (!fromEl || !toEl) return;

      const cornerRadius = container!.offsetWidth * 0.04;
      const p1_center = getCenter(fromEl);
      const p2_center = getCenter(toEl);
      if ((p1_center.x === 0 && p1_center.y === 0) || (p2_center.x === 0 && p2_center.y === 0)) return;

      let p1 = { ...p1_center };
      let p2 = { ...p2_center };

      const offsetAmount = 12; // The pixel spacing between lines

      // Handle spacing for multiple lines FROM the same source
      if (fromTotalLines > 1) {
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const length = Math.sqrt(dx * dx + dy * dy);
        if (length > 0) {
          const perpX = -dy / length;
          const perpY = dx / length;
          const invertedLineIndex = fromTotalLines - 1 - fromLineIndex;
          const offset = (invertedLineIndex - (fromTotalLines - 1) / 2) * offsetAmount;
          p1.x += offset * perpX;
          p1.y += offset * perpY;
        }
      }

      // Handle spacing for multiple lines TO the same destination
      if (toTotalLines > 1) {
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const length = Math.sqrt(dx * dx + dy * dy);
        if (length > 0) {
          const perpX = -dy / length;
          const perpY = dx / length;
          const invertedLineIndex = toTotalLines - 1 - toLineIndex;
          const offset = (invertedLineIndex - (toTotalLines - 1) / 2) * offsetAmount;
          p2.x += offset * perpX;
          p2.y += offset * perpY;
        }
      }

      const gradId = `grad-${from}-${to}-${fromLineIndex}-${toLineIndex}`;
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
        const linesToCount: { [key: string]: { from: string, to: string, colors: string[] }[] } = {};
        
        scene.lines.forEach(line => {
          if (!linesFromCount[line.from]) linesFromCount[line.from] = [];
          linesFromCount[line.from].push(line);
          
          if (!linesToCount[line.to]) linesToCount[line.to] = [];
          linesToCount[line.to].push(line);
        });

        scene.lines.forEach(line => {
          const fromTotalLines = linesFromCount[line.from].length;
          const fromLineIndex = linesFromCount[line.from].indexOf(line);
          const toTotalLines = linesToCount[line.to].length;
          const toLineIndex = linesToCount[line.to].indexOf(line);
          
          drawSmartLine(line.from, line.to, line.colors[0], line.colors[1], fromLineIndex, fromTotalLines, toLineIndex, toTotalLines);
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
        animationInterval = setInterval(() => runScene(true), 4500);
      }, 200);
    };

    window.addEventListener('resize', handleResize);

    runScene(true);
    animationInterval = setInterval(() => runScene(true), 4500);

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
        <svg className={styles.logo} viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg"><g>  <circle fill="#50A5DC" cx="84.5" cy="417.001" r="74.5" />  <circle fill="#50A5DC" cx="417.5" cy="417.001" r="74.5" />  <circle fill="#50A5DC" cx="251" cy="85.001" r="74.5" />  <g>    <path fill="#6a1ee4" d="M417.5,332.501c-19.7,0-37.832,6.795-52.218,18.14l-25.711-25.711c-3.906-3.905-10.236-3.905-14.143,0c-3.905,3.905-3.905,10.237,0,14.143l25.711,25.711C339.795,379.169,333,397.301,333,417.001c0,46.593,37.906,84.5,84.5,84.5s84.5-37.907,84.5-84.5S464.094,332.501,417.5,332.501z M417.5,481.501c-35.565,0-64.5-28.935-64.5-64.5s28.935-64.5,64.5-64.5s64.5,28.935,64.5,64.5S453.065,481.501,417.5,481.501z"/>    <path fill="#6a1ee4" d="M213.929,272.43l-77.771,77.771c-14.295-11.081-32.213-17.7-51.658-17.7c-46.593,0-84.5,37.907-84.5,84.5s37.907,84.5,84.5,84.5s84.5-37.907,84.5-84.5c0-19.955-6.969-38.305-18.58-52.778l77.651-77.651c3.905-3.905,3.905-10.237,0-14.143C224.166,268.524,217.834,268.524,213.929,272.43z M149,417.001c0,35.565-28.935,64.5-64.5,64.5S20,452.566,20,417.001s28.935-64.5,64.5-64.5c13.925,0,26.822,4.45,37.375,11.982l-44.946,44.946c-3.905,3.905-3.905,10.237,0,14.143c1.953,1.953,4.512,2.929,7.071,2.929s5.119-0.976,7.071-2.929l45.115-45.115C144.231,389.218,149,402.563,149,417.001z"/>    <path fill="#6a1ee4" d="M260.5,245.857v-76.906c42.136-4.738,75-40.571,75-83.952c0-46.593-37.906-84.5-84.5-84.5c-46.593,0-84.5,37.907-84.5,84.5c0,43.036,32.347,78.635,74,83.824v80.677c0,1.805,0.485,3.493,1.321,4.955c0.487,1.131,1.184,2.193,2.107,3.116l55,55c1.953,1.953,4.512,2.929,7.071,2.929s5.118-0.976,7.071-2.929c3.905-3.905,3.905-10.237,0-14.143L260.5,245.857z M186.5,85.001c0-35.565,28.935-64.5,64.5-64.5s64.5,28.935,64.5,64.5s-28.935,64.5-64.5,64.5S186.5,120.566,186.5,85.001z"/>    <path fill="#6a1ee4" d="M222.02,46.109c-12.223,9.12-19.52,23.659-19.52,38.892c0,5.523,4.477,10,10,10s10-4.477,10-10c0-9.086,4.184-17.419,11.479-22.863c4.427-3.303,5.337-9.568,2.035-13.995S226.445,42.806,222.02,46.109z"/>    <path fill="#6a1ee4" d="M256.193,56.971c4.005,0.736,7.735,2.295,11.088,4.634c1.743,1.216,3.737,1.8,5.713,1.8c3.158,0,6.266-1.493,8.21-4.279c3.16-4.529,2.05-10.763-2.479-13.923c-5.715-3.987-12.08-6.646-18.918-7.902c-5.429-1-10.645,2.596-11.642,8.028C247.167,50.761,250.761,55.973,256.193,56.971z"/>  </g></g></svg>
        <span className={styles.label}>Integration</span>
      </div>

      {/* Grid Position: 2,1 */}
      <div className={styles.icon} id={styles['icon-tax']} ref={el => { iconRefs.current['icon-tax'] = el; }}>
        <svg className={styles.logo} fill="currentColor" fill-rule="evenodd" height="1em" style={{flex:'none',lineHeight:1}} viewBox="0 0 24 24" width="1em" xmlns="http://www.w3.org/2000/svg"><title>OpenAI</title><path d="M21.55 10.004a5.416 5.416 0 00-.478-4.501c-1.217-2.09-3.662-3.166-6.05-2.66A5.59 5.59 0 0010.831 1C8.39.995 6.224 2.546 5.473 4.838A5.553 5.553 0 001.76 7.496a5.487 5.487 0 00.691 6.5 5.416 5.416 0 00.477 4.502c1.217 2.09 3.662 3.165 6.05 2.66A5.586 5.586 0 0013.168 23c2.443.006 4.61-1.546 5.361-3.84a5.553 5.553 0 003.715-2.66 5.488 5.488 0 00-.693-6.497v.001zm-8.381 11.558a4.199 4.199 0 01-2.675-.954c.034-.018.093-.05.132-.074l4.44-2.53a.71.71 0 00.364-.623v-6.176l1.877 1.069c.02.01.033.029.036.05v5.115c-.003 2.274-1.87 4.118-4.174 4.123zM4.192 17.78a4.059 4.059 0 01-.498-2.763c.032.02.09.055.131.078l4.44 2.53c.225.13.504.13.73 0l5.42-3.088v2.138a.068.068 0 01-.027.057L9.9 19.288c-1.999 1.136-4.552.46-5.707-1.51h-.001zM3.023 8.216A4.15 4.15 0 015.198 6.41l-.002.151v5.06a.711.711 0 00.364.624l5.42 3.087-1.876 1.07a.067.067 0 01-.063.005l-4.489-2.559c-1.995-1.14-2.679-3.658-1.53-5.63h.001zm15.417 3.54l-5.42-3.088L14.896 7.6a.067.067 0 01.063-.006l4.489 2.557c1.998 1.14 2.683 3.662 1.529 5.633a4.163 4.163 0 01-2.174 1.807V12.38a.71.71 0 00-.363-.623zm1.867-2.773a6.04 6.04 0 00-.132-.078l-4.44-2.53a.731.731 0 00-.729 0l-5.42 3.088V7.325a.068.068 0 01.027-.057L14.1 4.713c2-1.137 4.555-.46 5.707 1.513.487.833.664 1.809.499 2.757h.001zm-11.741 3.81l-1.877-1.068a.065.065 0 01-.036-.051V6.559c.001-2.277 1.873-4.122 4.181-4.12.976 0 1.92.338 2.671.954-.034.018-.092.05-.131.073l-4.44 2.53a.71.71 0 00-.365.623l-.003 6.173v.002zm1.02-2.168L12 9.25l2.414 1.375v2.75L12 14.75l-2.415-1.375v-2.75z"></path></svg>
        <span className={styles.label}>AI</span>
      </div>

      {/* Grid Position: 3,2 */}
      <div className={styles.icon} id={styles['icon-invoicing']} ref={el => { iconRefs.current['icon-invoicing'] = el; }}>
        <svg className={styles.logo} viewBox="0 0 32 32"><path d="M28 16c0-6.6-5.4-12-12-12S4 9.4 4 16c0 5.5 3.7 10.1 8.8 11.6V19.8H9.7v-3.8h3.1v-2.9c0-3.1 1.8-4.8 4.7-4.8 1.3 0 2.8.2 2.8.2v3.2h-1.6c-1.5 0-2 .9-2 1.9v2.3h3.6l-.6 3.8h-3v7.8C24.3 26.1 28 21.5 28 16z" fill="#1877F2"></path></svg>
        <span className={styles.label}>Facebook</span>
      </div>
      {/* Grid Position: 3,3 */}
      <div className={styles.icon} id={styles['icon-radar']} ref={el => { iconRefs.current['icon-radar'] = el; }}>
        <svg className={styles.logo} viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path fill="#E56353" d="M470.519,0H20.999C9.401,0,0,9.401,0,21v70.842h491.52V21C491.52,9.401,482.117,0,470.519,0z" /><path fill="#D5D6DB" d="M0,91.842V470.52c0,11.598,9.401,21,20.999,21h449.52c11.598,0,21.001-9.403,21.001-21V91.842 L0,91.842L0,91.842z"/><path fill="#EBF0F3" d="M0,91.842v360.804c0,11.598,9.401,21,20.999,21h449.52c11.598,0,21.001-9.402,21.001-21V91.842H0z" /><circle fill="#D15241" cx="59.407" cy="69.499" r="12.856" /><circle fill="#D5D6DB" cx="59.407" cy="114.186" r="12.861" /><path fill="#64798A" d="M59.407,61.058c-4.891,0-8.855,3.964-8.855,8.854v43.86c0,4.889,3.964,8.853,8.855,8.853 c4.889,0,8.852-3.964,8.852-8.853v-43.86C68.259,65.021,64.296,61.058,59.407,61.058z"/><circle fill="#D15241" cx="432.128" cy="69.499" r="12.856" /><circle fill="#D5D6DB" cx="432.128" cy="114.186" r="12.856" /><path fill="#64798A" d="M432.114,61.058c-4.89,0-8.854,3.964-8.854,8.854v43.86c0,4.889,3.964,8.853,8.854,8.853	c4.889,0,8.853-3.964,8.853-8.853v-43.86C440.966,65.021,437.003,61.058,432.114,61.058z"/> <circle fill="#D15241" cx="307.866" cy="69.499" r="12.856" /> <circle fill="#D5D6DB" cx="307.866" cy="114.186" r="12.856" /> <path fill="#64798A" d="M307.878,61.058c-4.89,0-8.854,3.964-8.854,8.854v43.86c0,4.889,3.964,8.853,8.854,8.853	c4.889,0,8.853-3.964,8.853-8.853v-43.86C316.731,65.021,312.767,61.058,307.878,61.058z"/><circle fill="#D15241" cx="183.644" cy="69.499" r="12.856" /><circle fill="#D5D6DB" cx="183.644" cy="114.186" r="12.861" /><path fill="#64798A" d="M183.643,61.058c-4.892,0-8.854,3.964-8.854,8.854v43.86c0,4.889,3.962,8.853,8.854,8.853	c4.889,0,8.853-3.964,8.853-8.853v-43.86C192.495,65.021,188.532,61.058,183.643,61.058z"/> <rect x="182.907" y="169.421" fill="#D5D6DB" width="47.565" height="47.565" /> <rect x="261.048" y="169.421" fill="#44C4A1" width="47.56" height="47.565" /> <rect x="339.2" y="169.421" fill="#D5D6DB" width="47.565" height="47.565" /> <rect x="417.331" y="169.421" fill="#E56353" width="47.565" height="47.565" /> <g>   <rect x="26.619" y="244.116" fill="#D5D6DB" width="47.565" height="47.565" />   <rect x="104.76" y="244.116" fill="#D5D6DB" width="47.565" height="47.565" />   <rect x="182.907" y="244.116" fill="#D5D6DB" width="47.565" height="47.565" /> </g> <rect x="261.048" y="244.116" fill="#44C4A1" width="47.56" height="47.565" /> <rect x="339.2" y="244.116" fill="#D5D6DB" width="47.565" height="47.565" /> <rect x="417.331" y="244.116" fill="#E56353" width="47.565" height="47.565" /> <g>   <rect x="26.619" y="318.822" fill="#D5D6DB" width="47.565" height="47.565" />   <rect x="104.76" y="318.822" fill="#D5D6DB" width="47.565" height="47.565" />   <rect x="182.907" y="318.822" fill="#D5D6DB" width="47.565" height="47.565" /> </g> <rect x="261.048" y="318.822" fill="#44C4A1" width="47.56" height="47.565" /> <rect x="339.2" y="318.822" fill="#D5D6DB" width="47.565" height="47.565" /> <rect x="417.331" y="318.822" fill="#E56353" width="47.565" height="47.565" /> <g>   <rect x="26.619" y="393.523" fill="#D5D6DB" width="47.565" height="47.565" />   <rect x="104.76" y="393.523" fill="#D5D6DB" width="47.565" height="47.565" />   <rect x="182.907" y="393.523" fill="#D5D6DB" width="47.565" height="47.565" /> </g></svg>
        <span className={styles.label}>Appointment</span>
      </div>
      {/* Grid Position: 3,4 */}
      <div className={styles.icon} id={styles['icon-issuing']} ref={el => { iconRefs.current['icon-issuing'] = el; }}>
        <svg className={styles.logo} viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0" /><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" /><g id="SVGRepo_iconCarrier"> <g> <path fill="#FFFFFF" d="M263.079,291.922h-12.994c-14.222,12.929-28.444,24.76-42.667,35.362v33.875 C230.109,354.759,250.085,328.641,263.079,291.922z" /> <path fill="#FFFFFF" d="M255.58,40.706c12.541,15.451,22.949,35.749,30.513,59.604h46.222 C313.374,73.546,286.74,52.601,255.58,40.706z" /> <path fill="#FFFFFF" d="M207.354,299.809c3.168-2.521,6.4-5.172,9.568-7.887h-9.568V299.809z" /> <path fill="#FFFFFF" d="M207.354,31.397v68.848h55.531C249.956,63.785,229.98,37.862,207.354,31.397z" /> <path fill="#FFFFFF" d="M207.354,185.191h70.853c-0.776-22.432-3.879-43.83-8.727-63.16h-62.125V185.191z" /> <path d="M286.287,291.922c-7.628,23.984-18.166,44.412-30.772,59.992 c31.289-11.895,58.053-32.97,77.059-59.992H286.287z" /> <path fill="#FFFFFF" d="M292.041,122.161c4.461,19.459,7.24,40.727,7.887,63.16h16.679 c13.059-18.23,24.178-36.331,32.905-53.85c-1.293-3.168-2.715-6.271-4.267-9.244h-53.204V122.161z" /> <path fill="#FFFFFF" d="M358.95,160.367c-4.719,8.275-9.826,16.549-15.321,24.824h18.877 C361.988,176.787,360.76,168.512,358.95,160.367z" /> <path fill="#FFFFFF" d="M300.186,206.977h-0.129c0,0.065,0,0.129,0,0.129S300.057,207.041,300.186,206.977z" /> <path fill="#FFFFFF" d="M256.227,255.979c6.788-6.788,13.382-13.77,19.717-20.687c1.164-9.18,1.939-18.618,2.327-28.251 h-70.917v63.16h34.133C246.465,265.546,251.314,260.827,256.227,255.979z" /> <path fill="#FFFFFF" d="M185.568,122.161h-62.125c-4.848,19.329-7.952,40.663-8.727,63.16h70.853V122.161L185.568,122.161z" /> <path fill="#FFFFFF" d="M60.606,100.375h46.222c7.628-23.79,18.101-44.154,30.513-59.604 C106.311,52.601,79.613,73.546,60.606,100.375z" /> <path fill="#FFFFFF" d="M30.481,185.191h62.513c0.711-22.432,3.426-43.636,7.887-63.16H47.548 C37.916,141.361,31.968,162.694,30.481,185.191z" /> <path fill="#FFFFFF" d="M100.817,270.136c-4.461-19.459-7.176-40.727-7.822-63.16H30.417 c1.487,22.562,7.434,43.895,16.937,63.16H100.817L100.817,270.136z" /> <path fill="#FFFFFF" d="M130.101,100.375h55.531V31.397C163.006,37.862,143.095,63.785,130.101,100.375z" /> <path fill="#FFFFFF" d="M185.568,206.977h-70.853c0.776,22.432,3.814,43.766,8.663,63.16h62.19V206.977z" /> <path fill="#FFFFFF" d="M296.695,244.989c-1.228,8.598-2.715,17.002-4.59,25.083h53.398 c9.568-19.265,15.515-40.598,16.937-63.16h-34.392C318.61,219.647,308.202,232.318,296.695,244.989z" /> <path fill="#FFFFFF" d="M185.568,342.928c-5.43,3.62-10.667,6.982-15.968,10.214c5.107,3.814,10.537,6.465,15.968,8.016 V342.928z" /> <path fill="#FFFFFF" d="M185.568,291.922h-55.661c6.335,18.036,14.481,33.487,23.661,45.253 c10.343-6.077,21.01-13.059,32-20.881V291.922L185.568,291.922z" /> <path fill="#FFFFFF" d="M60.413,291.922c17.778,25.212,42.343,45.123,70.982,57.406c1.034-0.453,1.939-1.034,2.909-1.487 c-11.184-14.998-20.622-33.939-27.669-55.919H60.413z" /> </g> <path fill="#194F82" d="M376.728,15.946c-22.432-22.432-63.612-21.075-116.17,3.297c-20.04-7.24-41.568-11.313-64.129-11.313 C92.671,7.995,8.243,92.488,8.243,196.245c0,22.497,4.008,44.154,11.313,64.129c-24.436,52.622-26.44,94.578-3.362,116.234 c30.772,28.832,83.135,12.671,115.911-3.426c20.105,7.37,41.826,11.378,64.388,11.378c103.758,0,188.25-84.428,188.25-188.251 c0-22.497-3.943-44.024-11.184-64.065C398.384,77.878,398.126,37.344,376.728,15.946z M361.342,31.397 c12.929,12.929,12.671,39.499-0.129,73.891c-17.131-30.901-42.731-56.501-73.632-73.632 C321.649,18.92,348.542,18.597,361.342,31.397z M316.671,185.191h-16.679c-0.711-22.432-3.426-43.636-7.887-63.16h53.333 c1.552,3.038,2.909,6.077,4.267,9.244C340.914,148.86,329.73,167.025,316.671,185.191z M358.95,160.367 c1.745,8.016,2.909,16.291,3.556,24.824h-18.877C349.253,176.916,354.231,168.641,358.95,160.367z M300.186,206.977 c-0.065,0.065-0.065,0.129-0.129,0.129c0-0.065,0-0.129,0-0.129H300.186z M286.158,100.375 c-7.628-23.79-18.101-44.154-30.513-59.604c31.16,11.895,57.794,32.84,76.735,59.604H286.158z M207.354,270.136v-63.16h70.853 c-0.323,9.632-1.164,19.071-2.327,28.251c-6.335,6.982-12.929,13.899-19.717,20.687c-4.848,4.848-9.762,9.568-14.61,14.158h-34.198 V270.136z M217.051,291.922c-3.168,2.715-6.4,5.301-9.568,7.887v-7.887H217.051z M269.479,122.161 c4.848,19.329,7.952,40.663,8.727,63.16h-70.853v-63.16L269.479,122.161L269.479,122.161z M207.354,100.375V31.397 c22.562,6.4,42.602,32.388,55.531,68.848h-55.531V100.375z M207.354,327.284c14.222-10.667,28.444-22.497,42.667-35.362h12.994 c-12.994,36.719-32.97,62.772-55.661,69.236V327.284z M255.516,351.849c12.606-15.515,23.079-36.008,30.772-59.992h46.352 C313.633,318.88,286.804,339.954,255.516,351.849z M345.633,270.136h-53.398c1.875-8.016,3.297-16.485,4.59-25.083 c11.507-12.735,21.915-25.406,31.418-38.012h34.392C361.148,229.538,355.2,250.872,345.633,270.136z M153.633,337.175 c-9.244-11.83-17.325-27.281-23.661-45.253h55.661v24.372C174.707,324.116,164.041,331.098,153.633,337.175z M185.568,342.928v18.23 c-5.495-1.552-10.796-4.331-15.968-8.016C174.901,349.845,180.267,346.484,185.568,342.928z M134.433,347.841 c-1.034,0.517-2.004,1.034-2.909,1.487c-28.703-12.218-53.269-32.259-71.046-57.406h46.352 C113.81,313.902,123.184,332.843,134.433,347.841z M123.378,270.136c-4.848-19.329-7.887-40.663-8.663-63.16h70.853v63.16H123.378 L123.378,270.136z M114.78,185.191c0.776-22.432,3.879-43.83,8.727-63.16h62.125v63.16L114.78,185.191L114.78,185.191z M106.829,100.375H60.606c18.941-26.764,45.576-47.774,76.735-59.604C124.93,56.221,114.457,76.52,106.829,100.375z M100.881,122.161c-4.461,19.459-7.24,40.727-7.887,63.16H30.481c1.487-22.562,7.499-43.895,17.067-63.16L100.881,122.161 L100.881,122.161z M92.994,206.977c0.711,22.432,3.426,43.636,7.822,63.16H47.419c-9.568-19.265-15.515-40.598-16.937-63.16 L92.994,206.977L92.994,206.977z M185.568,100.375h-55.531c13.059-36.525,32.97-62.513,55.531-68.913V100.375z M31.645,361.159 c-12.8-12.8-12.541-39.693,0.129-73.826c17.067,30.836,42.602,56.307,73.309,73.503C70.821,373.506,44.186,373.765,31.645,361.159z" /> <g> <path fill="#56ACE0;" d="M300.186,206.977h-0.129c0,0.065,0,0.129,0,0.129S300.057,207.041,300.186,206.977z" /> <path fill="#56ACE0;" d="M276.914,76.068c3.426,7.564,6.594,15.709,9.244,24.178h18.36 C296.372,91.13,287.128,82.985,276.914,76.068z" /> <path fill="#56ACE0;" d="M292.041,122.161c4.461,19.459,7.24,40.727,7.887,63.16h16.679 c6.853-9.568,13.123-19.071,18.877-28.509c-3.491-12.283-8.598-23.855-14.998-34.651L292.041,122.161L292.041,122.161z" /> <path fill="#56ACE0;" d="M263.079,291.922h-12.994c-14.222,12.929-28.444,24.76-42.667,35.362v13.123 c12.024-0.905,23.725-3.232,34.78-6.982C250.279,322.177,257.261,308.148,263.079,291.922z" /> <path fill="#56ACE0;" d="M185.568,122.161h-62.125c-4.848,19.329-7.952,40.663-8.727,63.16h70.853V122.161L185.568,122.161z" /> <path fill="#56ACE0;" d="M130.101,100.375h55.531V52.148c-12.024,0.905-23.725,3.232-34.78,6.982 C142.837,70.314,135.726,84.278,130.101,100.375z" /> <path fill="#56ACE0;" d="M116.202,316.488c-3.491-7.758-6.659-15.903-9.438-24.566H88.146 C96.421,301.231,105.794,309.506,116.202,316.488z" /> <path fill="#56ACE0;" d="M185.568,316.359v-24.372h-55.661c5.689,16.226,12.8,30.319,20.945,41.568 c1.939,0.646,3.879,1.228,5.818,1.745C166.109,329.611,175.742,323.34,185.568,316.359z" /> <path fill="#56ACE0;" d="M123.378,270.136h62.19v-63.16h-70.853C115.491,229.409,118.594,250.807,123.378,270.136z" /> <path fill="#56ACE0;" d="M100.817,270.136c-4.461-19.459-7.176-40.727-7.822-63.16H52.267 c1.681,22.949,8.727,44.347,19.846,63.16H100.817L100.817,270.136z" /> <path fill="#56ACE0;" d="M88.469,100.375h18.36c2.715-8.598,5.883-16.614,9.244-24.178 C105.924,82.985,96.55,91.13,88.469,100.375z" /> <path fill="#56ACE0;" d="M207.354,100.375h55.531c-5.689-16.097-12.735-30.061-20.816-41.244 c-11.055-3.685-22.691-6.077-34.78-6.982v48.226H207.354z" /> <path fill="#56ACE0;" d="M92.994,185.191c0.711-22.432,3.426-43.636,7.887-63.16H72.372 c-11.184,18.683-18.295,40.21-20.105,63.16L92.994,185.191L92.994,185.191z" /> <path fill="#56ACE0;" d="M304.905,291.922h-18.618c-2.78,8.663-5.947,16.873-9.438,24.566 C287.192,309.506,296.631,301.231,304.905,291.922z" /> <path fill="#56ACE0;" d="M207.354,291.922v7.887c3.168-2.521,6.4-5.172,9.568-7.887H207.354z" /> <path fill="#56ACE0;" d="M328.114,206.977c-9.503,12.606-19.911,25.277-31.418,38.012c-1.228,8.598-2.715,17.002-4.59,25.083 h28.574c11.119-18.683,18.166-40.21,19.846-63.16L328.114,206.977L328.114,206.977z" /> <path fill="#56ACE0;" d="M256.227,255.979c6.788-6.788,13.382-13.77,19.717-20.687c1.164-9.18,1.939-18.618,2.327-28.251 h-70.917v63.16h34.133C246.465,265.546,251.314,260.827,256.227,255.979z" /> <path fill="#56ACE0;" d="M269.479,122.161h-62.125v63.095h70.853C277.431,162.759,274.328,141.49,269.479,122.161z" /> </g> </g></svg>
        <span className={styles.label}>Website</span>
      </div>

      {/* Grid Position: 4,1 (Mapped to 3,1) */}
      <div className={styles.icon} id={styles['icon-capital']} ref={el => { iconRefs.current['icon-capital'] = el; }}>
        <svg className={styles.logo} viewBox="0 0 32 32" fill="none"><defs><radialGradient id="a" cx="25.5" cy="26" r="26.5" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#FD1D1D"/><stop offset=".1" stop-color="#FD1D1D"/><stop offset=".5" stop-color="#C13584"/><stop offset="1" stop-color="#405DE6"/></radialGradient></defs><path fill="url(#a)" d="M22.9 4H9.1C6.3 4 4 6.3 4 9.1v13.7C4 25.7 6.3 28 9.1 28h13.7c2.8 0 5.1-2.3 5.1-5.1V9.1C28 6.3 25.7 4 22.9 4z"/><path fill="#fff" d="M16 21.8c-3.2 0-5.8-2.6-5.8-5.8s2.6-5.8 5.8-5.8 5.8 2.6 5.8 5.8-2.6 5.8-5.8 5.8zm0-9.3c-1.9 0-3.5 1.6-3.5 3.5s1.6 3.5 3.5 3.5 3.5-1.6 3.5-3.5-1.6-3.5-3.5-3.5zm6.4-2.4c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
        <span className={styles.label}>Instagram</span>
      </div>
      {/* Grid Position: 4,3 (Mapped to 4,2) */}
      <div className={styles.icon} id={styles['icon-treasury']} ref={el => { iconRefs.current['icon-treasury'] = el; }}>
        <svg className={styles.logo} viewBox="0 0 160 160"><path d="M9.09091 100H30.303V48.4848L0 25.7576V90.9091C0 95.9394 4.07576 100 9.09091 100Z" fill="#4285F4" /><path d="M103.03 100H124.242C129.273 100 133.333 95.9242 133.333 90.9091V25.7576L103.03 48.4848" fill="#34A853" /><path d="M103.03 9.09091V48.4848L133.333 25.7576V13.6364C133.333 2.39394 120.5 -4.01515 111.515 2.72727" fill="#FBBC04" /><path d="M30.303 48.4848V9.09091L66.6667 36.3636L103.03 9.09091V48.4848L66.6667 75.7576" fill="#EA4335" /><path d="M0 13.6364V25.7576L30.303 48.4848V9.09091L21.8182 2.72727C12.8182 -4.01515 0 2.39394 0 13.6364" fill="#C5221F" /></svg>
        <span className={styles.label}>Email</span>
      </div>
      
      {/* Unused Icons */}
      <div className={styles.icon} id={styles['icon-payments']} ref={el => { iconRefs.current['icon-payments'] = el; }}></div>
      <div className={styles.icon} id={styles['icon-checkout']} ref={el => { iconRefs.current['icon-checkout'] = el; }}></div>
    </div>
  );
};

export default React.memo(StripeAnimatedGrid);