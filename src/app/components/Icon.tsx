/* eslint-disable @typescript-eslint/no-var-requires */
import {h}    from 'preact';
import {cn}   from '../../utils/preact-utils';
import styles from './Icon.module.scss';

// Load icons dynamically
const icons = new Map();
const svgContext = require.context('./icons', false, /\.svg$/);
for (const path of svgContext.keys()) {
    const nameWithExt = path.slice(2);
    const name = nameWithExt.slice(0, -4);
    icons.set(name, require(`./icons/${nameWithExt}`));
}

type Props = {
    name: string;
    className?: string;
};

export default ({name, className = ''}: Props) => {
    const svg = icons.get(name);

    if (!svg) {
        throw new Error(`Icon not found: ${name}`);
    }

    return (
        <div dangerouslySetInnerHTML={{__html: svg}}
             className={cn(className, styles.icon)}/>
    );
};
