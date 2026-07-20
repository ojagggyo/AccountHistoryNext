// webpack.config.js
import { merge } from 'webpack-merge';
import commonConfig from './webpack.common.js';
import clientConfig from './webpack.client.js';
import serverConfig from './webpack.server.js';

const isServer = process.env.TARGET === 'server';

export default merge(commonConfig, isServer ? serverConfig : clientConfig);
