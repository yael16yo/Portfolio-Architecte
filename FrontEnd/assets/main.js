	const apiUrlFilters = "http://localhost:5678/api/categories";
	const apiUrlWorks = "http://localhost:5678/api/works";

	let	tokenUserDelete = sessionStorage.getItem('token');
	let validateButton = document.getElementById("validateButton");
	let dynamicDivDeletePhotos = document.getElementById("dynamicDivDeletePhotos");
	let dynamicDivAddPhotos = document.getElementById("dynamicDivAddPhotos");
	let addPhotosButton = document.getElementById("addPhotosButton");
	let backButton = document.getElementById("backButton");

	let image = document.getElementById("image");
	let dynamicSpanChange = document.getElementById("dynamicSpanChange");
	let formAdd = document.getElementById("formAddId");
     
	let inputTitle = document.getElementById("inputTitle");
	let inputImage = document.getElementById("inputImage");
	let inputCategory = document.getElementById("inputCategory");
	let inputTitleValue = inputTitle.value;
	let inputImageValue = inputImage.value;
	let inputCategoryValue = inputCategory.value;



	inputTitle.addEventListener("input", validateFields);
	inputImage.addEventListener("input", validateFields);
	inputCategory.addEventListener("input", validateFields);

	function validateFields() {
		if (inputTitle.value != "" && inputImage.value != "" && inputCategory.value != "") {
			validateButton.style.backgroundColor = "var(--main-color)";
			validateButton.style.pointerEvents = "fill";
		} else {
			validateButton.style.backgroundColor = ""; 
			validateButton.style.pointerEvents = ""; 
		}
	}



	formAdd.addEventListener('submit', function(e) {
		e.preventDefault();
		
				let file = document.getElementById('inputImage').files[0];
                let inputTitleValue = document.getElementById('inputTitle').value;
                let inputCategoryValue = document.getElementById('inputCategory').value;
				const formData = new FormData();

				formData.append("title", inputTitleValue);
				formData.append("category", inputCategoryValue);
				formData.append("image", file);

				fetch(apiUrlWorks, {
								method: "POST",
								headers: {
									Authorization : "Bearer " + tokenUserDelete,
									"Content-Type" : "multipart/form-data"
								},
								body: formData
							})
							.then(data => {
								console.log(data);
							}).catch(error => {
								console.log("Erreur:", error);
				});
			});

						
        let previewPicture  = function (e) {
        const [picture] = e.files
        if (picture) {
            image.src = URL.createObjectURL(picture);
            dynamicSpanChange.style.display = "none";
            dynamicImagePreview.style.display = "flex";
        }
        } 
        

	addPhotosButton.onclick = function() {
		dynamicDivDeletePhotos.style.display = "none";
		dynamicDivAddPhotos.style.display = "block";
		addPhotosButton.style.display = "none";
		validateButton.style.display = "block";
		backButton.style.display = "block";
	}

	backButton.onclick = function() {
		dynamicDivDeletePhotos.style.display = "block";
		dynamicDivAddPhotos.style.display = "none";
		addPhotosButton.style.display = "block";
		validateButton.style.display = "none";
		backButton.style.display = "none";
	}


	function showGallery() {
	fetch(apiUrlWorks).then(response => {
		if (!response.ok) {
			throw new Error('Erreur lors de la récupération des données -> works');
			}
		return response.json();
	})
		.then(data => {
			const showGalleryPhotos = arr => {
			let outputGalleryForDelete = "";
			arr.forEach(({id, title, categoryId, imageUrl}) =>{
				outputGalleryForDelete += `
					<div class="imageFromGallery">
						<button class="deleteIcon" onclick="deletePhoto(${id})"><i class="fa fa-trash-can"></i></button>
						<img src="${imageUrl}" alt="${title}">
					</div>
				`;
			});
			document.getElementById("divForGallery").innerHTML = outputGalleryForDelete;
			};
			showGalleryPhotos(data);
		}).catch(error => {
			console.error('Erreur:', error);
		});
	}
		
		
		function deletePhoto(id) {
			const apiUrlWorksDelete = 'http://localhost:5678/api/works/'+id;
			fetch(apiUrlWorksDelete, {
				method: 'DELETE',
				headers : {
					"Accept" : "application/json",
					"cache" : "no-cache",
					"Authorization" : "Bearer "+tokenUserDelete
				}
			}).catch(error => {
				console.error('Erreur:', error);
			});
			showGallery();
		}
		

	fetch(apiUrlFilters)

		.then(response => {
			if (!response.ok) {
				throw new Error('Erreur lors de la récupération des données -> categories')
			}
			return response.json();
		})

		.then(data => {
			const showFilters = arr => {
				let outputFilters = `
				<div class="filter-case">
					<input type="radio" id="all" name="filters-name" checked onclick="filterShows(0)">
					<label for="all">Tous</label>
				</div>
				`;
				arr.forEach(({ id, name}) => {
					outputFilters += `
					<div class="filter-case">
						<input type="radio" id="${name}" name="filters-name" onclick="filterShows(${id})">
						<label for="${name}">${name}</label>
					</div>
					`;
				});
				document.getElementById("filters").innerHTML = outputFilters;
			};
			showFilters(data);
		})
		.catch(error => {
			console.error('Erreur:', error);
		  });


	let outputWorks = "";

	fetch(apiUrlWorks)
	.then(response => {
		if (!response.ok) {
		throw new Error('Erreur lors de la récupération des données -> works');
		}
		return response.json();
	})
	.then(data => {
			window.allProjects = data;
			filterShows(0);
		})
	.catch(error => {
		console.error('Erreur:', error);
	});

	function filterShows(categoryId) {
		let filterShows = window.allProjects;

		if(categoryId > 0) {
			filterShows = filterShows.filter(show => show.categoryId === categoryId);
		}
		displayShows(filterShows);
	}

	function displayShows(shows) {
		let outputWorks = "";
		shows.forEach(({id, title, categoryId, imageUrl}) => {
			outputWorks += `
				<figure id="${id}">
					<img src="${imageUrl}" alt="${title}">
					<figcaption>${title}</figcaption>
				</figure>
			`
		})
		document.getElementById("items").innerHTML = outputWorks;
	}
