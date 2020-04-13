module.exports = (api) => {
    api.cache.using(() => process.env.NODE_ENV);

    return {
        'presets': [
            [
                '@babel/preset-typescript',
                {'jsxPragma': 'h'}
            ]
        ],
        'plugins': [
            [
                '@babel/plugin-transform-react-jsx',
                {'pragma': 'h', 'pragmaFrag': 'Fragment'}
            ],
            [
                '@babel/plugin-proposal-decorators',
                {'legacy': true}
            ],
            '@babel/plugin-proposal-class-properties',
            api.env('production') && 'react-refresh/babel'
        ].filter(Boolean)
    };
};
