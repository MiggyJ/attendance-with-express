$('.toast').toast({
	delay: 5000
})

$('#a_Proof').on('change', () => {
	previewImage.src = URL.createObjectURL(event.target.files[0])
	$('#previewImage').show()
})

$('#a_Date').val(new Date().toISOString().substr(0, 10))


jQuery.validator.addMethod("exactlength", function(value, element, param) {
	return this.optional(element) || value.length == param;
 }, $.validator.format("Please use your Student Number"));
 
$('#logInForm').validate({
	rules: {
		logNumber: {
			required: true,
			exactlength: 10
		},
		logPassword: {
			required: true
		}
	},
	messages: {
		logNumber: {
			required: 'Please enter your Student Number'
		},
		logPassword: {
			required: 'Please enter your Password'
		}
	},
	errorElement: 'span',
	errorPlacement: function (error, element) {
		error.addClass('invalid-feedback')
		element.closest('.form-group').append(error)
	},
	highlight: function (element, errorClass, validClass) {
		$(element).addClass('is-invalid')
	},
	unhighlight: function (element, errorCLass, validCLass) {
		$(element).removeClass('is-invalid')
	}
})

$('#signForm').on('submit', function (e) {
	e.preventDefault()
})
	.validate({
		rules: {
			sFirstName: {
				required: true
			},
			sLastName: {
				required: true
			},
			sNumber: {
				required: true,
				minlength: 10,
				maxlength: 10
			},
			sSection: {
				required: true
			},
			sPassword: {
				required: true,
				minlength: 10
			},
			sPassword2: {
				required: true,
				equalTo: '#signPassword'
			}
		},
		messages: {
			sFirstName: {
				required: 'Please enter your FIRST NAME'
			},
			sLastName: {
				required: 'Please enter your LAST NAME'
			},
			sNumber: {
				required: 'Please enter your STUDENT NUMBER',
				minlength: 'Invalid Student Number',
				maxlength: 'Invalid Student Number',
			},
			sPassword: {
				required: 'Please enter a PASSWORD',
				minlength: 'Minimum of 10 characters'
			},
			sPassword2: {
				required: 'Please confirm your password',
				equalTo: 'PASSWORDS do not match'
			}
		},
		errorElement: 'span',
		errorPlacement: function (error, element) {
			error.addClass('invalid-feedback')
			element.closest('.form-group').append(error)
		},
		highlight: function (element, errorClass, validClass) {
			$(element).addClass('is-invalid')
		},
		unhighlight: function (element, errorCLass, validCLass) {
			$(element).removeClass('is-invalid')
		},
		submitHandler: function () {
			form = $('#signForm').serialize()

			$.ajax({
				xhr: function () {
					var xhr = new window.XMLHttpRequest
					$('#signBtn').attr('disabled', true)
					xhr.upload.addEventListener('progress', () => {
						$('#signBtn').html(`
						<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
						<span class="sr-only">Loading...</span>
						`)
					})
					return xhr
				},
				type: "POST",
				url: "/signup",
				data: form,
				dataType: "html",
				success: function (response) {

					if (response === "1") {
						$('#signToastTitle').text('Error!')
						$('#signAlert .toast-header').addClass('bg-danger').removeClass('bg-success')
						$('#signAlert .toast-body').text('Student Number is ALREADY registered.')
						$('#signAlert').toast('show')
					} else {
						$('#signToastTitle').text('Success!')
						$('#signAlert .toast-header').addClass('bg-success').removeClass('bg-danger')
						$('#signAlert .toast-body').text('You can now Log In.')
						$('#signAlert').toast('show')
					}
					
					$('#SignModal').modal('hide')
					$('#signForm').get(0).reset()
					$('#signBtn').removeAttr('disabled')
					$('#signBtn').html('Submit')
				}
			});
		}
	})

$('#uploadForm').submit((e) => {
	e.preventDefault()
})
	.validate({
		rules: {
			a_Proof: {
				required: true,
				extension: 'jpg|jpeg|png'
			}
		},
		messages: {
			a_Proof: {
				required: 'Please upload an image',
			}
		},
		errorElement: 'div',
		errorPlacement: function (error, element) {
			error.addClass('invalid-tooltip')
			element.closest('.form-group').append(error)
		},
		submitHandler: function () {
			$('#proofBtn').attr('disabled',true)
			var form = new FormData()
			form.append('image', $('#a_Proof').prop('files')[0])

			$.ajax({
				xhr: function () {
					var xhr = new window.XMLHttpRequest()

					$('#logProgress').removeAttr('hidden')

					xhr.upload.addEventListener('progress', (e) => {
						var percentCompleted = e.loaded / e.total * 100
						$('.progress-bar').css('width', percentCompleted + '%')

					})

					return xhr
				},
				type: "POST",
				url: "/upload",
				data: form,
				processData: false,
				contentType: false,
				success: function (response) {
					window.location.reload()
				}
			});
		}
	})



