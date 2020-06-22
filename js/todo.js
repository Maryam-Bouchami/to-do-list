let listColor = "";
let doneTasks = "";
const getUrl = "http://localhost/ToDoList/list.json?n="+Math.random();
const postUrl = "http://localhost/ToDoList/post_form.php?n="+Math.random();
// le bloc dans lequel se trouve le formulaire d'ajout d'une liste
const addFormBloc = document.querySelector(".add-list");
//le bloc  ne s'affiche pas au debut
addFormBloc.style.display = "none";
//Bouton pour afficher le formulaire d'ajout
const createBtn = document.querySelector(".btnCreerBloc a");
//le clic sur le bouton entraine l'affichage du bloc d'ajout
createBtn.addEventListener("click", function (e) {
	e.target.style.display="none";
	addFormBloc.style.display = "block";
});

//formulaire
const addForm = document.querySelector(".addForm");
//gérer le submit du formulaire
addForm.addEventListener("submit", function (e) {
	e.preventDefault();
	
	createBtn.style.display="block";
   
	let data = new FormData(addForm);
    //appeler la fonction qui empeche l'ajout des éléments vides
    noEmpty(data);
    //ajouter les taches marquées effectuées (en cas de modification de la liste )
	data.append("doneTasks", doneTasks);
    //ajouter la couleur à donner a la liste
	data.append("color", listColor);
    //Verifier si de l'ajout ou de la modification
	if (addForm.id) {

		data.append("listID", addForm.id.slice(9));
	} else {

		data.append("listID", "list" + Date.now());
	}

//  Appel de la focntion ajaxPost
	ajaxPost(postUrl, data, function (reponse) {
		console.log("ok");
		window.location.reload();
	}, false);
});



//le clic sur le plus affiche a nouveau champs à remplir
const addBtn = document.querySelector(".addElt");
addBtn.addEventListener("click", function (e) {
	const inpuList = document.getElementsByClassName("eltinput");
	const curentId = inpuList[inpuList.length - 1].id;
	let index = Number(curentId.slice(3)) + 1;

	e.target.insertAdjacentHTML("beforeBegin", `<input type="text" name="elt${index}" id="elt${index}" class="eltinput" placeholder="Ajouter un élément">`);
	if (!document.getElementById(`delet${curentId}`)) {

		document.getElementById(curentId).insertAdjacentHTML("afterend", `<a href="#" class="delElt" id="delet${curentId}"  onclick='deleteInput("${curentId}","delet${curentId}")'>x</a>`);
	}

});



//Récupérer laz couleur
const colorLink = document.querySelectorAll(".colors-list li a");
for (let i = 0; i < colorLink.length; i++) {
	colorLink[i].addEventListener("click", function () {

		let color = colorLink[i].id;

		switch (color) {
			case "green":
				addFormBloc.style.backgroundColor = "#8abb1f";
				listColor = "#8abb1f";
				break;
			case "yellow":
				addFormBloc.style.backgroundColor = "#ffd800";
				listColor = "#ffd800";
				break;
			case "blue":
				addFormBloc.style.backgroundColor = "#3ee1d1";
				listColor = "#3ee1d1";
				break;
			case "pink":
				addFormBloc.style.backgroundColor = "#f789ef";
				listColor = "#f789ef";
				break;
			case "orange":
				addFormBloc.style.backgroundColor = "#ff8c00";
				listColor = "#ff8c00";
				break;
		}

	});
}

//Suppression d'un élément déjà ajouté à la liste
function deleteInput(id, linkId) {
	document.getElementById(linkId).style.display = "none";
	addForm.removeChild(document.getElementById(id))
}

document.getElementById("hideForm").addEventListener("click", function () {
	addFormBloc.style.display = "none";
	//createBtn.classList.remove("desableLink");
	createBtn.style.display="block";
});


//affichage des listes
let listsTab = "";
const listsContainer = document.querySelector(".listsContainer");
//recupration du tableau listsTab
function showLists() {
	listsContainer.innerHTML = "";
	ajaxGet(getUrl, function (reponse) {
		listsTab = JSON.parse(reponse);

		for (let i = 0; i < listsTab.length; i++) {
			//recuperer les taches dejà faites
			let done = listsTab[i]['doneTasks'];


			//creer le bloc qui va contenir la liste
			let listBloc = document.createElement("div");
			listBloc.classList.add("oneList");
			//récupérer l'id de la liste
			listBloc.id = listsTab[i]['listID'];
			//donner une couleur debackground a la liste
			listBloc.style.backgroundColor = listsTab[i]['color'];
			//créer l'élement titre et lui donner le contenu
			let title = document.createElement("h3");
			title.textContent = listsTab[i]['listTitre'];
			listBloc.appendChild(title);

			//créer un élement liste ul
			let ulList = document.createElement("ul");
			ulList.classList.add("myList");
			//creer des élement <li> et les remplir par les éléments de la liste
			let regex = /elt/;
			for (key in listsTab[i]) {
				const doneTask = done.split(",");
				if (regex.test(key)) {
					let liElt = document.createElement("li");
					liElt.classList.add("listItem");
					liElt.id = "task" + key;

					liElt.innerHTML += `<span>${listsTab[i][key]}</span>`;
					ulList.appendChild(liElt);


					liElt.insertAdjacentHTML("afterBegin", `<input type="checkbox" class="taskDone"  id="check${key}" onclick='done("${key}","${listBloc.id}", "${done}")' >`);


					doneTask.forEach(d => {

						if (d == key) {
							liElt.style.textDecorationLine = "line-through";
							
						}
					});


				}

			}
			listBloc.appendChild(ulList);
			listsContainer.appendChild(listBloc);
			let blocModif = document.createElement("div");
			blocModif.classList.add("modif");
			listBloc.appendChild(blocModif);
			//cocher les taches deja effectuées
				for (key in listsTab[i]){
					checkTaskBox(key,`check${key}`,done.split(","), `${listBloc.id}` );
				}
		
			blocModif.innerHTML += `<a href="#" class="editList" title="Modifier la liste" onclick="modifier('${listBloc.id}','${done}') "><img src="../images/edit.png"></a>`;
			blocModif.innerHTML += `<a href="#" class="delitList"  title="Supprimer la liste" onclick="suppression('${listBloc.id}') "><img src="../images/corbeille.png"></a>`;
		}

	});
}
showLists();


function suppression(id) {
	let formSupp = new FormData();
	formSupp.append("id", id);
	let suppUrl = "http://localhost/ToDoList/delete.php?n="+Math.random();
	ajaxPost(suppUrl, formSupp, function (reponse) {
		window.location.reload();

	}, false);
}

//Modification d'une liste
function modifier(id,doneT) {
	addFormBloc.style.display = "block";
	createBtn.style.display="none";
	addForm.removeChild(document.querySelector("input[name='elt1']"));
	//attribuer un id au formulaire(contenant celui de le liste en question)
	addForm.id = "modifForm" + id;
	//récupérer le titre de la liste
	document.querySelector(`input[name="listTitre"]`).value = document.querySelector("#" + id + "> h3").textContent;
	//récupérer la couleur du background
    
	listColor = getComputedStyle(document.getElementById(id)).backgroundColor;
	addFormBloc.style.backgroundColor = listColor;
	//recupérer les taches done
	doneTasks=doneT;
	//récupère les taches et les afficher comme étant des inputs du fomulaire 
	let listElements = document.querySelectorAll("#" + id + "> ul > li");
	for (let i = 0; i < listElements.length; i++) {
		let inputTask = document.createElement("input");
		let type = "text";
		let inputId = listElements[i].id.slice(4);
		let inputValue = listElements[i].textContent;

		document.querySelector(".addElt").insertAdjacentHTML('beforeBegin', `<input type="text" id="${inputId}" name="${inputId}" class="eltinput" placeholder="Ajouter un élement" value="${inputValue}">`);
		//ajout du lien de suppression devant chaque tache
		document.getElementById(inputId).insertAdjacentHTML("afterend", `<a href="#" class="delElt" id="delet${inputId}"  onclick='deleteInput("${inputId}","delet${inputId}")'>x</a>`);
	}


}


//fonction pour vérifier les taches faites
function done(checkId, listId, doneTasks) {
	doneTasks=doneTasks.split(",");
	let index = doneTasks.length;
	console.log(doneTasks.length);
	let exist=false;
	    for (let i=0;i<doneTasks.length;i++){
			if (doneTasks[i]==checkId){
				doneTasks.splice(i,1);
				exist=true;
			}
		}

		if(!exist){
			doneTasks[index] = checkId;
		}
		

	
	
	let doneData = new FormData();
	doneData.append('listID', listId);
	doneData.append('doneTasks', doneTasks);
	ajaxPost("http://localhost/ToDoList/doneTask.php?n="+Math.random(), doneData, function (reponse) {
		console.log("done sent");
	}, false);

	showLists();   
}


function checkTaskBox(key,idBox,listDone,listId){
	listDone.forEach(ld=>{
		if(ld==key){
	
			
			document.querySelector(`#${listId}>ul>li>#${idBox}`).checked="true";
		}
	});
}

//fonction pour empecher l'ajout des élements vides
function noEmpty(data){
     let mesElts=document.getElementsByClassName("eltinput");
         for (let i=0; i<mesElts.length;i++){
        if (mesElts[i].value==""){
            let nameE=mesElts[i].name;
            console.log(nameE);
            data.delete(nameE);
        }
    }

}
