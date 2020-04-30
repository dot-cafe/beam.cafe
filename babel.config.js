const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
    'presets': [
        [
            '@babel/preset-typescript',
            {'jsxPragma': 'h'}
        ]
    ],
    'plugins': [
        ['@babel/plugin-proposal-optional-chaining'],
        ['@babel/plugin-proposal-decorators', {'legacy': true}],
        ['@babel/plugin-proposal-class-properties', {'loose': true}],
        [
            '@babel/plugin-transform-react-jsx',
            {'pragma': 'h', 'pragmaFrag': 'Fragment'}
        ],
        ...(!isProduction ? ['react-refresh/babel'] : [])
    ]
};
