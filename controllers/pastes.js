const fs = require('fs');
const promisify = require('util').promisify;
const config = require('config');
const mime = require('mime-types');
const imageType = require('image-type');
const requestIp = require('request-ip');
const Paste = require('../models/paste');

module.exports = {
	async index(ctx) {
		ctx.set('Cache-Control', 'no-cache');

		await ctx.render('index', {
			pretty: config.prettyHtml,
			title: config.name,
			url: ctx.request.origin,
			expires: config.expires,
			expiresDefault: config.expiresDefault,
			formats: Object.keys(config.formats).reduce((prev, f) => prev.concat(config.formats[f]), []).reduce((prev, e) => prev + ',.' + e, '').substring(1)
		});
	},

	async view(ctx) {
		try {
			const paste = await Paste.findById(ctx.params.id).exec();

			ctx.type = paste.img.contentType;
			ctx.body = paste.img.data;

			ctx.set('Cache-Control', 'public');
			ctx.set('Expires', paste.expiresAt.toUTCString());
		} catch (ex) {
			ctx.throw(404, 'Paste Not Found');
		}
	},

	async create(ctx) {
		if (ctx.request.body.fields) {
			if (ctx.request.body.fields.expire && ctx.request.body.fields.expire == parseInt(ctx.request.body.fields.expire, 10)) {
				ctx.request.body.expire = ctx.request.body.fields.expire;
			}
		}

		if (!ctx.request.body.expire) {
			ctx.request.body.expire = config.expiresDefault;
		}

		if (Object.keys(ctx.request.body.files).length < 1) {
			ctx.throw(400, 'File not provided');
		}

		let file = ctx.request.body.files[Object.keys(ctx.request.body.files)[0]]; // First key

		if (Object.prototype.toString.call(file) === '[object Array]') {
			file = file[0]; // First file
		}

		const paste = new Paste({
			expiresAt: new Date(Date.now() + ctx.request.body.expire * 1000),
			clientIp: requestIp.getClientIp(ctx.request),
			img: {
				data: await promisify(fs.readFile)(file.path)
			}
		});

		const image = imageType(paste.img.data);
		const type = image ? image.mime : mime.lookup(file.name);

		if (!type || !config.formats.hasOwnProperty(type)) {
			ctx.throw(400, 'Unsupported file type');
		}

		paste.img.contentType = type;
		paste._id += '.' + mime.extension(type).replace('jpeg', 'jpg'); // No one likes the 'e'

		await paste.save();

		await promisify(fs.unlink)(file.path);

		if (Object.keys(ctx.query).includes('redirect')) {
			ctx.redirect(paste.id);
		} else {
			ctx.body = ctx.request.origin + '/' + paste.id;
		}
	}
};
