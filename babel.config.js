const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
    'presets': [
        [
            '@babel/preset-typescript',
            {'jsxPragma': 'h'}
        ]
    ],
    'plugins': [
        '@babel/plugin-proposal-class-properties',
        [
            '@babel/plugin-transform-react-jsx',
            {'pragma': 'h', 'pragmaFrag': 'Fragment'}
        ],
        [
            '@babel/plugin-proposal-decorators',
            {'legacy': true}
        ],
        ...(!isProduction ? ['react-refresh/babel'] : [])
    ]
};
