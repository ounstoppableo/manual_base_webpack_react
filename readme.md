### webpack从0开始搭建react环境

#### 初始化package.json

~~~sh
npm init
~~~

#### 安装webpack

~~~sh
npm i webpack webpack-cli -D
~~~

#### 配置webpack-config

##### 配置出入口

~~~json
//配置入口和出口
const path = require("path");
module.exports = {
    entry: {
        app: './src/main.js'
    },
    output: {
        path: path.resolve(__dirname,'./dist'),
        filename: '[name].bundle.js'
    },
}
~~~

##### 区分环境

~~~sh
# 用于区分环境，文件内部可以通过process.env.NODE_ENV来判断当前的环境
npm i cross-env -D
~~~

##### 配置loader

~~~js
module: {
    rules: [{
        test: /\.css$/,
        use: ['css-loader']
    }]
},
~~~

##### 配置plugin

~~~js
plugins: [
    //将生成后的js文件通过script添加到模板中
    //如果没写模板会自动生成
    new HtmlWebpackPlugin({ template: './src/index.html' })
],
~~~

##### 配置服务器

~~~sh
# 安装包
npm i webpack-dev-server
~~~

~~~js
devServer: {
    port: 8000,
    open: true
},
~~~

##### 安装react以及babel

~~~~sh
npm i react
npm i react-dom
npm i @babel/core @babel/preset-env @babel/preset-react babel-loader
~~~~

~~~js
//配置babel，使得webpack能解析jsx语法
module: {
      rules: [{
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
      },
      {
          test: /\.js|jsx$/,
          exclude: /(node_module)/,
          loader: 'babel-loader',
          options: {
              presets: ['@babel/preset-env','@babel/preset-react']
          },
      },
      ]
  },
~~~

**到这里就可以写react了**

#### 自定义需求

##### 使用mini-css-extract-plugin分离css

~~~js
module: {
    rules: [
    {
        test: /\.css|sass|scss$/,
        use: [{loader:MiniCssExtractPlugin.loader},'css-loader','sass-loader']
    },
    {
        test: /\.js|jsx|tsx$/,
        exclude: /(node_module)/,
        loader: 'babel-loader',
        options: {
            presets: ['@babel/preset-env','@babel/preset-react']
        },
    },
    ]
},
plugins: [
    new HtmlWebpackPlugin({ template: './src/index.html' }),
    new MiniCssExtractPlugin()
],
~~~

效果：

![](.\images\QQ截图20231027172025.png)

![](.\images\QQ截图20231027171854.png)

##### 允许输入输出图片

~~~sh
npm i url-loader file-loader -D
~~~

~~~js
//作用就是将import的图片输出到dist中
//如果不做这个配置，直接import图片是会报错的
{
   test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
   exclude: /node_modules/,
   include: [path.resolve("./public/images")],
   use: [{
       loader: 'url-loader',
       options: {
           limit: 8192,
           esModule: false,
       }
   }],
   type: 'javascript/auto'
}
~~~

##### 项目优化

###### 分环境配置

~~~sh
# 每个环境都是基于base-webpack配置合并的
# 所以要下载执行合并的包
npm i  webpack-merge -D
~~~

- webpack.dev.js

  ~~~js
  const webpack = require("webpack");
  const webpackMerge = require("webpack-merge");
  const baseConfig = require("./webpack.config");
  
  const config = {
    mode: "development",
    cache: {
      type: "memory", // 使用内存缓存
    },
  };
  
  const mergedConfig = webpackMerge.merge(baseConfig, config);
  module.exports = mergedConfig;
  ~~~

- webpack.prod.js

  ~~~js
  const webpack = require("webpack");
  const webpackMerge = require("webpack-merge");
  const baseConfig = require("./webpack.config");
  
  const config = {
    mode: "production",
    cache: {
      type: "filesystem",
      buildDependencies: {
        config: [__filename], //使用文件缓存
      },
    },
    optimization: {
      minimize: true,
      moduleIds: "deterministic",
    },
  };
  
  const mergedConfig = webpackMerge.merge(baseConfig, config);
  module.exports = mergedConfig;
  ~~~

- package.json

  ~~~json
    "scripts": {
      "test": "echo \"Error: no test specified\" && exit 1",
      "start": "webpack serve --config webpack/webpack.config.js",
      "build": "webpack --config webpack/webpack.dev.js",
      "build:prod": "cross-env NODE_ENV=production webpack --config webpack/webpack.prod.js"
    },
  ~~~

###### 配置ts环境

~~~sh
npm i typescript ts-loader -D
~~~

~~~js
{
    test: /\.(ts|tsx)$/,
    exclude: /node_module/,
    include: [path.resolve("./src")],
    use: {
        loader: 'ts-loader'
    }
},
~~~

添加tsconfig.json文件

~~~json
{
    "compilerOptions": {
        "target": "es5",
        "lib": [
            "dom",
            "es5",
            "es6",
            "es7",
            "dom.iterable",
            "esnext"
        ],
        "allowJs": true,
        "skipLibCheck": true,
        "esModuleInterop": true,
        "allowSyntheticDefaultImports": true,
        "strict": true,
        "forceConsistentCasingInFileNames": true,
        "noFallthroughCasesInSwitch": true,
        "module": "esnext",
        "moduleResolution": "node",
        "resolveJsonModule": true,
        "isolatedModules": true,
        "noEmit": false,
        "jsx": "react-jsx",
        "downlevelIteration": true
    },
    "include": [
        "src"
    ]
}
~~~

增加类型声明

~~~sh
npm i @types/react @types/react-dom -D
~~~

### 最终配置

webpack.config.js

~~~js
const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
module.exports = {
    entry: {
        app: './src/main.tsx'
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].bundle.js'
    },
    module: {
        rules: [
        {
            test: /\.css|sass|scss$/,
            use: [{loader:MiniCssExtractPlugin.loader},'css-loader','sass-loader']
        },
        {
            test: /\.js|jsx|tsx$/,
            exclude: /(node_module)/,
            loader: 'babel-loader',
            options: {
                presets: ['@babel/preset-env','@babel/preset-react']
            },
        },
        {
            test: /\.(ts|tsx)$/,
            exclude: /node_module/,
            include: [path.resolve("./src")],
            use: {
                loader: 'ts-loader'
            }
        },
        {
            test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
            exclude: /node_modules/,
            include: [path.resolve("./src/assets/images")],
            use: [{
                loader: 'url-loader',
                options: {
                    limit: 8192,
                    esModule: false,
                }
            }],
            type: 'javascript/auto'
        }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({ template: './public/index.html' }),
        new MiniCssExtractPlugin()
    ],
    devServer: {
        port: 8000,
        open: true
    },
    mode: 'development'
}
~~~

最终文件结构：

![](.\images\QQ截图20231027181114.png)
