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


	let	tokenUser = sessionStorage.getItem('token');

	/*window.addEventListener('beforeunload', function() {
    	sessionStorage.removeItem('token');
	});*/

	let logout = document.getElementById("logout");
	logout.addEventListener('click', function() {
		sessionStorage.removeItem('token');
		window.location.reload();
	})

	if(tokenUser !== null) {
		let loginBtn = document.getElementById('loginbtn');
		let logoutBtn = document.getElementById('logoutbtn');
		loginBtn.style.display = "none";
		logoutBtn.style.display = "flex";
	} 

	
	let outputUserHeader = "";
	if(tokenUser !== null) {
		outputUserHeader += `
			<div class="header-modification">
				<p><i class="fa fa-pen-to-square"></i> Mode édition</p>
			</div>
		`
	} else {
		outputUserHeader = "";
	}
	document.getElementById("outputUserHeader_id").innerHTML = outputUserHeader;

	if(tokenUser !== null) {
		let outputModifyBtn = "";
		if(tokenUser !== null) {
			outputModifyBtn +=`
				<span class="openModalButton" id="btnOpen"><i class="fa fa-pen-to-square"></i> modifier</span>
			`
		} else {
			outputModifyBtn = "";
		}
		document.getElementById("modifierBtnId").innerHTML = outputModifyBtn;

		
		let btnOpen = document.getElementById("btnOpen");
		let modalModify = document.getElementById("modalModify");
		let htmlOverflow = document.getElementsByTagName("html")[0];
		let close = document.getElementsByClassName("close")[0];

		btnOpen.onclick = function() {
			modalModify.style.display = "block";
			htmlOverflow.style.overflow = "hidden";
		}

		close.onclick = function() {
			modalModify.style.display = "none";
			htmlOverflow.style.overflow = "auto";
		}

		window.addEventListener("click", function(event) {
			if (event.target == modalModify) {
				modalModify.style.display = "none";
				htmlOverflow.style.overflow = "auto";
			}
		});
	}

	
	validateFields();
	showGallery();



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
			}).then(data => {
				fetch(apiUrlWorks)
					.then(response => {
						if (!response.ok) {
						throw new Error('Erreur lors de la récupération des données -> works');
						}
						return response.json();
					})
					.then(data => {
							window.allProjectsUpdate = data;
							displayShows(allProjectsUpdate);
							showGallery();
							//displayShows(data);
						})
					.catch(error => {
						console.error('Erreur:', error);
					});
			}).catch(error => {
				console.error('Erreur:', error);
			});
			showGallery();
			//displayShows();
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
		//console.log("Données filtrées :", filterShows);
    	displayShows(filterShows);
	}


	function displayShows(shows) {
		if (shows && shows.length > 0) { 
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
			} else {
				console.error("Aucune donnée à afficher");
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
									Authorization : "Bearer " + tokenUserDelete
								},
								body: formData
							})
							.then(response => response.json())
							.then(data => {
								fetch(apiUrlWorks)
								.then(response => {
									if (!response.ok) {
									throw new Error('Erreur lors de la récupération des données -> works');
									}
									return response.json();
								})
								.then(data => {
										window.allProjectsUpdate = data;
										displayShows(allProjectsUpdate);
										showGallery();
										//displayShows(data);
									})
								.catch(error => {
									console.error('Erreur:', error);
								});
							})
							.catch(error => {
								console.log("Erreur:", error);
				});

				inputTitle.value = '';
				inputCategory.value = '';
				inputImage.value = '';
				dynamicSpanChange.style.display = "block";
            	dynamicImagePreview.style.display = "none";

				dynamicDivDeletePhotos.style.display = "block";
				dynamicDivAddPhotos.style.display = "none";
				addPhotosButton.style.display = "block";
				validateButton.style.display = "none";
				backButton.style.display = "none";
				let modalModify = document.getElementById("modalModify");
				modalModify.style.display = "none";
				let htmlOverflow = document.getElementsByTagName("html")[0];
				htmlOverflow.style.overflow = "auto";
			});
