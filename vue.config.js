const path = require('path')
const ThemeColorReplacer = require('webpack-theme-color-replacer')

function resolve(dir) {
	return path.join(__dirname, dir)
}

module.exports = {
	publicPath: './', // 公共,基本路径
	outputDir:
	  process.env.NODE_ENV !== 'development'
	    ? '../../server/dms/src/main/resources/static/'
	    : './dist',
	indexPath:
	  process.env.NODE_ENV !== 'development'
	    ? '../templates/index.html'
	    : './',
	chainWebpack: config => {
		// 路径别名
		config.resolve.alias
			.set('@', resolve('src'))
			.set('@images', resolve('src/assets/images'))
			.set('@new', resolve('src/assets/images/new'))
			.set('@api', resolve('src/api'))
			.set('@mixin', resolve('src/mixins'))
		// 自定义换肤
		config.plugin('webpack-theme-color-replacer')
			.use(ThemeColorReplacer)
			.tap(options => {
				options[0] = {
					matchColors: ['#406767', '#3a6a6b', '#232323'], // 需要全css查找的颜色数组, 支持 rgb and hsl.
					fileName: 'css/theme-colors-[contenthash:8].css', //optional. output css file name, suport [contenthash] and [hash].
					injectCss: false, // optional. Inject css text into js file, no need to download `theme-colors-xxx.css` any more.
					isJsUgly: process.env.NODE_ENV !==
						'development', // optional. Set to `true` if your js is uglified. Default is set by process.env.NODE_ENV.
				}
				return options
			})
	},
	css: {
		loaderOptions: {
			less: {
				javascriptEnabled: true,
				globalVars: {
					hack: `true; @import '~@/styles/variable.less';`
				},
			}
		}
	},
	devServer: {
		port: 8080,
		host: '0.0.0.0', // 0.0.0.0
		open: true, // 配置自动启动浏览器
		overlay: {
			warnings: true,
			errors: true
		},
		// 配置代理,
		proxy: {
			"/devProxy": {
				// target: 'http://192.168.122.100:20105/dms/',
				target: 'http://172.16.52.198:9004/dms/',
				// target: 'http://172.16.52.198:9004/dms/',
				changeOrigin: true,
				pathRewrite: {
					'^/devProxy': ''
				}
			}
		},
	}
}
