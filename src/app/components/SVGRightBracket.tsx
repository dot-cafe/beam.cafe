import {createRef, h} from 'preact';
import styles         from './SVGRightBracket.module.scss';

export function SVGRightBracket() {
    const svg = createRef();

    requestAnimationFrame(() => {
        const svgEl = svg.current;

        if (!svgEl) {
            return;
        }

        const bcr = svgEl.getBoundingClientRect();
        const w = Math.round(bcr.width);
        const h = Math.round(bcr.height);

        // Update viewBox
        svgEl.setAttribute('viewBox', `0 0 ${w} ${h}`);

        // Update paths
        const [leftPathEl, rightPathEl] = svgEl.children as [SVGPathElement, SVGPathElement];
        const lew = w * 0.2;
        const leftPath = `M0,${h * 0.5} C${w * 0.8} ${h * 0.5}, ${w * 0.6} 0, ${w - lew} 0 l${lew},0`;
        const rightPath = `M0,${h * 0.5} C${w * 0.8} ${h * 0.5}, ${w * 0.6} ${h}, ${w - lew} ${h} l${lew},0`;

        leftPathEl.setAttribute('d', leftPath);
        rightPathEl.setAttribute('d', rightPath);
    });

    return (
        <div className={styles.svgRightBracketContainer}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 0 0" ref={svg}>
                <path d=""/>
                <path d=""/>
            </svg>
        </div>
    );
}
