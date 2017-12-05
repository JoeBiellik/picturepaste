/* eslint-env browser */
/* global $ */

$(function() {
	var $form = $('form');
	var $input = $('input[type="file"]', $form);
	var $expiry = $('select', $form);
	var $progress = $('section#uploading .progress-bar', $form);
	var $progressText = $('section#uploading p', $form);

	function formatSize(bytes, decimals) {
		if (bytes == 0) return '0 Bytes';

		var k = 1024;
		var i = Math.floor(Math.log(bytes) / Math.log(k));

		return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals || 2)) + ['Bytes', 'KB', 'MB'][i];
	}

	function upload(data) {
		$form.addClass('is-uploading');

		$.ajax({
			url: '/',
			type: 'POST',
			data: data,
			contentType: false,
			processData: false,
			xhr: function() {
				var xhr = $.ajaxSettings.xhr();

				xhr.upload.onprogress = function(e) {
					if (e.lengthComputable) {
						$progress.css('width', ((e.loaded / e.total) * 100).toFixed(0) + '%');
						$progressText.text(formatSize(e.loaded) + ' / ' + formatSize(e.total));
					} else {
						$progress.css('width', '100%');
					}
				};

				return xhr;
			},
			success: function(url) {
				$progress.css('width', '100%').addClass('bg-success');

				window.location.href = url;
			},
			error: function(req, msg, ex) {
				$progress.addClass('bg-danger');
				$progressText.text(req.responseText);

				console.error(msg, ex, req.responseText);
			}
		});
	}

	$form
		.on('drag dragstart dragend dragover dragenter dragleave drop', function(e) {
			e.preventDefault();
			e.stopPropagation();
		})
		.on('dragover dragenter', function() {
			$form.addClass('is-dragover');
		})
		.on('dragleave dragend drop', function() {
			$form.removeClass('is-dragover');
		})
		.on('drop', function(e) {
			var file = e.originalEvent.dataTransfer.files[0];

			if (!file || file.type.indexOf('image') == -1 || file.size > 50000000) return false;

			var data = new FormData();
			data.append($input.attr('name'), file);
			data.append($expiry.attr('name'), $expiry.val());

			upload(data);
		})
		.on('submit', function(e) {
			e.preventDefault();

			if ($form.hasClass('is-uploading')) return false;

			upload(new FormData($form.get(0)));
		});

	$input.on('change', function() {
		$form.trigger('submit');
	});

	$(document).on('paste', function(e) {
		e.preventDefault();

		if ($form.hasClass('is-uploading')) return false;
		if (!e.originalEvent.clipboardData) return false;

		var file = e.originalEvent.clipboardData.items[0].getAsFile();

		if (!file || file.type.indexOf('image') == -1 || file.size > 50000000) return false;

		var data = new FormData();
		data.append($input.attr('name'), file);
		data.append($expiry.attr('name'), $expiry.val());

		upload(data);
	});
});
