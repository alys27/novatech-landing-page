(function () {
    const CONFIG = {
        clustersMin: 5,          
        clustersMax: 7,          
        branchesClosed: 4, 
        branchesBroken: 3,   
        branchesSplit: 3,  
        segMin: 3,  
        segMax: 6,     
        stepX: [40, 110],    
        stepY: [30, 90], 
        glowMinDur: getCssNumber('--circuit-min-speed', 5),
        glowMaxDur: getCssNumber('--circuit-max-speed', 11),
    };

    const SVG_NS = 'http://www.w3.org/2000/svg';
    const XLINK_NS = 'http://www.w3.org/1999/xlink';

    function getCssNumber(varName, fallback) {
        const raw = getComputedStyle(document.documentElement)
            .getPropertyValue(varName).trim();
        const n = parseFloat(raw);
        return isNaN(n) ? fallback : n;
    }

    function rand(min, max) {
        return Math.random() * (max - min) + min;
    }
    function randInt(min, max) {
        return Math.floor(rand(min, max + 1));
    }
    function pick(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    function buildManhattanPath(startX, startY) {
        const segments = randInt(CONFIG.segMin, CONFIG.segMax);
        let x = startX, y = startY;
        let d = `M${x.toFixed(1)},${y.toFixed(1)}`;
        for (let i = 0; i < segments; i++) {
            if (i % 2 === 0) {
                x += rand(CONFIG.stepX[0], CONFIG.stepX[1]) * (Math.random() < 0.5 ? -1 : 1);
            } else {
                y += rand(CONFIG.stepY[0], CONFIG.stepY[1]) * (Math.random() < 0.5 ? -1 : 1);
            }
            d += ` L${x.toFixed(1)},${y.toFixed(1)}`;
        }
        return d;
    }

    function createCluster(cx, cy, variant, idPrefix) {
        const g = document.createElementNS(SVG_NS, 'g');
        const branchCount = variant === 'closed' ? CONFIG.branchesClosed
            : variant === 'broken' ? CONFIG.branchesBroken
            : CONFIG.branchesSplit;

        const pathIds = [];

        for (let b = 0; b < branchCount; b++) {
            const offsetX = variant === 'split' ? (b - 1) * rand(60, 140) : rand(-15, 15);
            const offsetY = variant === 'split' ? rand(-20, 20) : rand(-15, 15);
            const d = buildManhattanPath(cx + offsetX, cy + offsetY);

            const path = document.createElementNS(SVG_NS, 'path');
            path.setAttribute('d', d);
            const isDashed = variant === 'broken' && b % 2 === 1;
            path.setAttribute('class', 'cb-line' + (isDashed ? ' cb-line--dashed' : ''));
            const pid = `${idPrefix}-p${b}`;
            path.setAttribute('id', pid);
            g.appendChild(path);
            pathIds.push(pid);

            const node = document.createElementNS(SVG_NS, 'circle');
            node.setAttribute('cx', cx + offsetX);
            node.setAttribute('cy', cy + offsetY);
            node.setAttribute('r', 3.4);
            node.setAttribute('class', 'cb-node');
            g.appendChild(node);
        }


        const centerNode = document.createElementNS(SVG_NS, 'circle');
        centerNode.setAttribute('cx', cx);
        centerNode.setAttribute('cy', cy);
        centerNode.setAttribute('r', 4);
        centerNode.setAttribute('class', 'cb-node');
        g.appendChild(centerNode);


        const glowPathId = pick(pathIds);
        const dot = document.createElementNS(SVG_NS, 'circle');
        dot.setAttribute('r', 4);
        dot.setAttribute('class', 'cb-glow');

        const anim = document.createElementNS(SVG_NS, 'animateMotion');
        const dur = rand(CONFIG.glowMinDur, CONFIG.glowMaxDur);
        anim.setAttribute('dur', dur.toFixed(2) + 's');
        anim.setAttribute('repeatCount', 'indefinite');
        anim.setAttribute('begin', rand(0, 3).toFixed(2) + 's');
        anim.setAttribute('rotate', 'auto');

        const mpath = document.createElementNS(SVG_NS, 'mpath');
        mpath.setAttributeNS(XLINK_NS, 'xlink:href', '#' + glowPathId);
        mpath.setAttribute('href', '#' + glowPathId);
        anim.appendChild(mpath);
        dot.appendChild(anim);
        g.appendChild(dot);

        return g;
    }

    function generateSectionCircuit(section, sectionIndex) {
        const wrapper = document.createElement('div');
        wrapper.className = 'circuit-bg-wrapper';

        const svg = document.createElementNS(SVG_NS, 'svg');
        const w = section.offsetWidth || 1200;
        const h = section.offsetHeight || 600;
        svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
        svg.setAttribute('preserveAspectRatio', 'none');
        svg.setAttribute('aria-hidden', 'true');

        const variants = ['closed', 'broken', 'split'];
        const clusterCount = randInt(CONFIG.clustersMin, CONFIG.clustersMax);

        for (let i = 0; i < clusterCount; i++) {
            const cx = rand(w * 0.08, w * 0.92);
            const cy = rand(h * 0.12, h * 0.88);
            const variant = pick(variants);
            const cluster = createCluster(cx, cy, variant, `circuit-s${sectionIndex}-c${i}`);
            svg.appendChild(cluster);
        }

        wrapper.appendChild(svg);
        section.insertBefore(wrapper, section.firstChild);
    }

    function init() {
        const targets = Array.from(document.querySelectorAll('[data-circuit-bg]'));
        if (!targets.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && !entry.target.dataset.circuitGenerated) {
                    const idx = targets.indexOf(entry.target);
                    generateSectionCircuit(entry.target, idx);
                    entry.target.dataset.circuitGenerated = 'true';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        targets.forEach((t) => observer.observe(t));
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();