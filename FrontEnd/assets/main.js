//Déclaration de toutes les constantes

const apiUrlFilters = "http://localhost:5678/api/categories";
const apiUrlWorks = "http://localhost:5678/api/works";
const tokenUser = sessionStorage.getItem('token');


//Déconnexion
(function() {
const logout = document.getElementById("logout");
logout.addEventListener('click', function() {
    sessionStorage.removeItem('token');
    window.location.reload();
});
})();

//Login et logout buttons

if(tokenUser !== null) {
    const loginBtn = document.getElementById('loginbtn');
    const logoutBtn = document.getElementById('logoutbtn');
    loginBtn.style.display = "none";
    logoutBtn.style.display = "flex";
} 


//Header affiché uniquement lorsque l'utilisateur est connecté

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



//Affichage du bouton modal, permettant la modification de la gallery (uniquement si l'utilisateur est connecté à l'aide du compte administrateur)

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

    
//paramètrages concernant le modal de suppression et d'ajout des images

    const btnOpen = document.getElementById("btnOpen");
    const modalModify = document.getElementById("modalModify");
    const htmlOverflow = document.getElementsByTagName("html")[0];
    const close = document.getElementsByClassName("close")[0];

    btnOpen.addEventListener("click",  function() {
        modalModify.style.display = "block";
        htmlOverflow.style.overflow = "hidden";
    });

    close.addEventListener("click", function() {
        modalModify.style.display = "none";
        htmlOverflow.style.overflow = "auto";
    });

    window.addEventListener("click", function(event) {
        if (event.target == modalModify) {
            modalModify.style.display = "none";
            htmlOverflow.style.overflow = "auto";
        }
    });
}

//Stylisation des inputs

(function() {
const inputTitle = document.getElementById("inputTitle");
const inputImage = document.getElementById("inputImage");
const inputCategory = document.getElementById("inputCategory");
inputTitle.addEventListener("input", validateFields);
inputImage.addEventListener("input", validateFields);
inputCategory.addEventListener("input", validateFields);

function validateFields() {
    const validateButton = document.getElementById("validateButton");
    if (inputTitle.value != "" && inputImage.value != "" && inputCategory.value != "") {
        validateButton.style.backgroundColor = "var(--main-color)";
        validateButton.style.pointerEvents = "fill";
    } else {
        validateButton.style.backgroundColor = ""; 
        validateButton.style.pointerEvents = ""; 
    }
}
})();    

    let previewPicture  = function (e) {
    const [picture] = e.files
    if (picture) {
        const image = document.getElementById("image");
        const dynamicSpanChange = document.getElementById("dynamicSpanChange");
        const dynamicImagePreview = document.getElementById("dynamicImagePreview");
        image.src = URL.createObjectURL(picture);
        dynamicSpanChange.style.display = "none";
        dynamicImagePreview.style.display = "flex";
    }
    } 
    

//affichage des différentes buttons et sections dynamiques dans le modal 
const dynamicDivDeletePhotos = document.getElementById("dynamicDivDeletePhotos");
const dynamicDivAddPhotos = document.getElementById("dynamicDivAddPhotos");
const deletePhotosContainer = document.getElementById("divForGalleryDelete");
const validateButton = document.getElementById("validateButton");

const addPhotosButton = document.getElementById("addPhotosButton");
addPhotosButton.addEventListener("click", function() {
    dynamicDivDeletePhotos.style.display = "none";
    dynamicDivAddPhotos.style.display = "block";
    addPhotosButton.style.display = "none";
    validateButton.style.display = "block";
    backButton.style.display = "block";
});

const backButton = document.getElementById("backButton");
backButton.addEventListener("click", function() {
    dynamicDivDeletePhotos.style.display = "block";
    dynamicDivAddPhotos.style.display = "none";
    addPhotosButton.style.display = "block";
    validateButton.style.display = "none";
    backButton.style.display = "none";
});




// fonction permettant l'affichage des différentes bulles de sélection (chacune correspondant à un filtrage différent en fonction de la catégorie sélectionné)

function showItemsFilters() {
    fetch(apiUrlFilters)
    .then(datasFilters => datasFilters.json())
    .then(dataFilterPieces => {
        const showFilters = document.getElementById("filters");

        const allButton = document.createElement("div");
        allButton.classList.add("filter-case");
        allButton.innerHTML = `
            <input type="radio" id="all" name="filters-name" checked>
            <label for="all">Tous</label>
        `;
        showFilters.appendChild(allButton);
        
        const listenerAll = document.getElementById("all");
        listenerAll.addEventListener("click", function() {
            dependOnFilter(0);
        });

        for (let i = 0; i < dataFilterPieces.length; i++) {
            const bulle_filter = document.createElement("div");
            bulle_filter.classList.add("filter-case");
            bulle_filter.innerHTML = `
            <input type="radio" id="${dataFilterPieces[i].name}" name="filters-name">
            <label for="${dataFilterPieces[i].name}">${dataFilterPieces[i].name}</label>
            `;
            showFilters.appendChild(bulle_filter);

            const listenerOthers = document.getElementById(dataFilterPieces[i].name);
            listenerOthers.addEventListener("click", function() {
                dependOnFilter(dataFilterPieces[i].id);
            });
        }
    })
    .catch(error => {
        console.log('Erreur', error);
    });
}

//fonction permettant le filtrage des images en fonction de leur id de catégorie

let allTheImages = [];

function dependOnFilter(categoryId) {

    let dependOnFilterDatas = allTheImages.slice();
    if(categoryId > 0) {
       dependOnFilterDatas = dependOnFilterDatas.filter(show => show.categoryId === categoryId);
    }
    showOnScreen(dependOnFilterDatas);
}

//fonction permettant l'affichage des images avec le filtre dependOnFilter = 0 (qui correspond à l'affichage de la totalité des données)

function showGallery() {
    fetch(apiUrlWorks)
    .then(imagesData => {
        return imagesData.json()
    })
    .then(dataImages => {
        allTheImages = dataImages;
        dependOnFilter(0);
    })
    .catch(error => {
        console.log("Erreur", error);
    })
}


//fonction permettant l'affichage dépendemment de "dependOnFilter" et de l'ID catégorie sélectionné

function showOnScreen(show) {
    if (show && show.length > 0) { 
        let outputItemsImage = "";
        show.forEach(({id, title, imageUrl}) => {
            outputItemsImage += `
            <figure id="${id}">
                <img src="${imageUrl}" alt="${title}">
                <figcaption>${title}</figcaption>
            </figure>
            `;
        });
        document.getElementById("items").innerHTML = outputItemsImage; 
    }
}


//fonction permettant l'affichage des images dans le modal de modifications

function showGalleryForDelete() {

    fetch(apiUrlWorks)
    .then(imagesData => {
        return imagesData.json();
    })
    .then(imagesWithTrashcan => {
        let outputGalleryForDelete = "";
        const imageForDelete = arr => {
            arr.forEach(({id, imageUrl, title}) => {
                outputGalleryForDelete += `
                <div class="imageFromGallery">
                    <button class="deleteIcon" data-id="${id}"><i class="fa fa-trash-can"></i></button>
                    <img src="${imageUrl}" alt="${title}">
                </div>
            `;
            })
        }
        imageForDelete(imagesWithTrashcan);
        deletePhotosContainer.innerHTML = outputGalleryForDelete;
        
        const deleteIcons = document.querySelectorAll('.deleteIcon');
        deleteIcons.forEach(deleteIcon => {
            deleteIcon.addEventListener('click', function() {
                const imageId = this.getAttribute('data-id');
                deletePhotosFromGallery(imageId);
        });
    });
    })
    .catch(error => {
        console.log("Erreur", error);
    })
}

//Fonction permettant la suppression des images

async function deletePhotosFromGallery(id) {
    await fetch(apiUrlWorks+"/"+id, {
        method: "DELETE",
        headers: {
            "Accept" : "application/json",
            "cache" : "no-cache",
            "Authorization" : "Bearer " + tokenUser
        }
    })
        showGallery();
        showGalleryForDelete();
}


//Ajout d'une photo dans la gallery et actualisation des fonctions

(function() {
    const formAdd = document.getElementById("formAddId");
    formAdd.addEventListener('submit', function(e) {
        e.preventDefault();
        async function addPhotoInGallery() {
            let file = document.getElementById('inputImage').files[0];
            const inputTitleValue = document.getElementById('inputTitle').value;
            const inputCategoryValue = document.getElementById('inputCategory').value;
            const formData = new FormData();

            formData.append("title", inputTitleValue);
            formData.append("category", inputCategoryValue);
            formData.append("image", file);

            await fetch(apiUrlWorks, {
                            method: "POST",
                            headers: {
                                Authorization : "Bearer " + tokenUser
                            },
                            body: formData
            })
            showGallery();
            showGalleryForDelete();
        }

            addPhotoInGallery();

            const inputTitle = document.getElementById("inputTitle");
            const inputImage = document.getElementById("inputImage");
            const inputCategory = document.getElementById("inputCategory");
            const dynamicSpanChange = document.getElementById("dynamicSpanChange");
            const dynamicImagePreview = document.getElementById("dynamicImagePreview");

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
            const modalModify = document.getElementById("modalModify");
            modalModify.style.display = "none";
            const htmlOverflow = document.getElementsByTagName("html")[0];
            htmlOverflow.style.overflow = "auto";
        });
    })();
showItemsFilters();
showGallery();
showGalleryForDelete();
//addPhotoInGallery();