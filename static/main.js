function set_drag_and_drop_handler(){
	let drop_area = document.querySelector('.upload_form');

	drop_area.addEventListener('dragenter', function(e){
		e.preventDefault();
		this.style.border = '2px dotted black';
	});

	drop_area.addEventListener('drop', function(e){
		e.preventDefault();
		this.style.border = 'none';
		document.querySelector('#chosen_file').files = event.dataTransfer.files;
	});
};

function set_uploaded_files_table_handler(){
	let table = document.querySelector('#uploaded_files_table');
	for(let i = 1; i < table.rows.length; i++){
		table.rows[i].onclick = function(){
			filename = this.cells[0].textContent.trim();
			let params = 'filename=' + encodeURIComponent(filename)
			let xhr = new XMLHttpRequest();
			let url = 'http://127.0.0.1:2019/view_file_content'
			xhr.open('GET', url + '?' + params);
			xhr.onload = xhr.onerror = function() {
				if(this.status == 200){
					console.log(url, this.status);
					let uploaded_files_area = document.querySelector('.view_file_content_area');
					uploaded_files_area.innerHTML = this.responseText;
				}
				else{
					console.log(url, this.status, 'ERROR');
				}
			};
			xhr.send();
		}
	}
};

function refresh_uploaded_files_table(){
	let xhr = new XMLHttpRequest();
	let url = 'http://127.0.0.1:2019/uploaded_files';
	xhr.open('GET', url);
	xhr.onload = xhr.onerror = function() {
		if(this.status == 200){
			console.log(url, this.status);
			let uploaded_files_area = document.querySelector('.uploaded_files_area');
			uploaded_files_area.innerHTML = this.responseText;
			set_uploaded_files_table_handler();
		}
		else{
			console.log(url, this.status, 'ERROR');
		}
	};
	xhr.send();
};

function set_upload_button_handler(){
	let upload_button = document.querySelector('#upload_button');
	upload_button.onclick = function(){
		let file = document.querySelector('#chosen_file').files[0];
		let data = new FormData();
		data.append('file', file, file.name);
		let xhr = new XMLHttpRequest();
		let url = 'http://127.0.0.1:2019/upload';
		xhr.open('POST', url);
		xhr.onload = xhr.onerror = function() {
			if(this.status == 200){
				console.log(url, this.status);
				refresh_uploaded_files_table();
			}
			else{
				console.log(url, this.status, 'ERROR');
			}
		};
		xhr.send(data);
	};
};

window.onload = function(){
	set_upload_button_handler();
	refresh_uploaded_files_table();
	set_drag_and_drop_handler();
};