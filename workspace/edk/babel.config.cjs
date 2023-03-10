/*
 * @Author: fuRan NgeKaworu@gmail.com
 * @Date: 2023-03-09 18:29:55
 * @LastEditors: fuRan NgeKaworu@gmail.com
 * @LastEditTime: 2023-03-09 18:29:58
 * @FilePath: /monorepo-lab/workspace/edk/babel.config.js
 * @Description: 
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
 */
module.exports = {
    presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
        '@babel/preset-typescript',
    ],
};