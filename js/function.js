// JavaScript Document


var boxHeightMax=0;
var tags;
var idCurentApt;
var imgH;
var imgHeight;
var apparts;
var croix=false;

//Constructeur Appart
function Appart(type, desc, prix, adresse, photos){
	this.type = type;
	this.desc = desc;
	this.prix = prix;
	this.adresse = adresse;
	this.photos = photos;
}

//Contstructeur Apparts la list qui contient tous les apparts
function Apparts(studio, T1, T2, T3){
	this.studio=studio;
	this.T1=T1;
	this.T2=T2; 
	this.T3=T3;
}

// IMPORTANT !! Chemin du repertoire courant où se trouve le site
//var pathRepImg = 'file:///C:\\Users\\Lisa\\Documents\\PROGRAMMATION_IMAC_1\\WEB\\AppartCouavouzz';
var pathRepImg = 'file:///C:\\Users\\TonioDeMoreno\\Documents\\Pweb\\AppartCouavouzz';


$(document).ready(function(){
	var nav = navigator.appName ;	
	//chargement des pages header et footer (probleme google chrome)
	$("#block-footer").load('footer.html');
	$("#block-header").load('header.html');

	//document.addEventListener("touchstart", function(){}, true);

	if (window.File && window.FileReader && window.FileList && window.Blob){
		if(typeof(Storage) !== "undefined") {
			recupApparts();

			setTimeout(function(){
				$( "#search-box" ).autocomplete({
			      source: tags
			    });

			    $('#burger img, nav ul li ul li').on('click', function(){
					$('#menu').toggleClass("show");
					if(!croix){
						$("#burger img").attr('src', "images/supp.png");
						croix=true;
					}
					else{
						$("#burger img").attr('src', "images/menu.png");
						croix=false;
					}
				});

				$('#nav ul li').not($( "#rech" )).on('click', function(){
					$('#menu').toggleClass("show");
					if(!croix){
						$("#burger img").attr('src', "images/supp.png");
						croix=true;
					}
					else{
						$("#burger img").attr('src', "images/menu.png");
						croix=false;
					}
				});

				$("#propos").on('click', function(){
					$('html, body').animate({
						scrollTop:$("#footer").offset().top
					}, 'slow');
				});

			}, 0);
			
		}
		else 
			alert("Désolé, mais le Web Storage n'est pas suppoté");
	}
	else
	  document.write('<i>API File non reconnue par ce navigateur.</i>');
});



//Stop defilement carrousel
function stopSlide(){
	clearInterval(interval);
}

// Enregistre les Apparts dans le localStorage
function saveApparts(){
	localStorage.setItem('apparts', JSON.stringify(apparts));
} 	

// Recupère les apparts du localStorage
function recupApparts(){

	//requete ajax récuperation fichier JSON
	/*var getAjax = $.ajax({
        url: JSON_url,
        type: "GET",
        dataType: "json"
    });

	getAjax.done(function(data) {
	    apparts = data;
	});

	getAjax.fail(function(jqXHR, textStatus) {
	    alert('impossible de charge les appartements');
	})*/

	apparts=JSON.parse(localStorage.getItem('apparts'));	
	if(apparts == null || apparts.length == 0){
		idCurentApt = 0;
		apparts=new Apparts(new Array(), new Array(), new Array(), new Array());
	}

	tags = new Array;
	$.each (apparts, function(i, type){
		$.each (type, function(i, apt){
			if(!estDansTags(apt.adresse)){ 
				tags.push(apt.adresse);
			}
		});
	});

}

// Verifie si une adresse se trouve dans le tableau tags
function estDansTags(adr){
	for(var i=0; i<tags.length ; ++i){
		if(tags[i] == adr)
			return true;			
	}
	return false;
}


//enregistre la vente d'un appart
function saveVente(){
	var path = "\\images\\appart\\";
	var defaultPath = path + "none.jpg";
	if(apparts==null)
		return;
	var photos = new Array();
	photos[0] = defaultPath;
	for(i=0; i<3; ++i){
		var pic = "pic"+ (i+1);
		if(document.getElementById(pic).value != '')
			photos[i] = path+document.getElementById(pic).value;
	}
	var type;
	for (i=0 ; i<4 ; i++){
      if (document.vente.type[i].checked){
      	  type = document.vente.type[i].value;
      	  if(type == 'Studio')
      	  	type = type.toLowerCase();
      }
    }
	var desc = $("#desc").val();
	var prix = $("#prix").val();
	var adresse = $("#adresse").val();
	var appart = new Appart( type, desc, prix, adresse, photos);
	if(type == "studio"){
		apparts.studio.push(appart);
	}
	else if (type == "T1")
		apparts.T1.push(appart);
	else if (type == "T2")
		apparts.T2.push(appart);
	else if (type == "T3")
		apparts.T3.push(appart);

	saveApparts();
	affAppart(type);
}

//Recharge le conteneur principal 
function refreshMainConteneur(titre){
	document.getElementById('main-conteneur').innerHTML="";
	$("#main-conteneur").append('<div id="block-main">');
		$("#block-main").append('<div class="conteneur">');
			$(".conteneur").append('<div class="large-conteneur">');
				$(".large-conteneur").append('<section id="section">');
					$('#section').append('<header class="titre"> <h2> '+ titre +' </h2></header>');
}

//affiche la page des types apparts
function affAppart(type){
	var apts = getAppart(type);	
	var titre = "Nos "+ type.charAt(0).toUpperCase() + type.slice(1) + "s";
	refreshMainConteneur(titre);
	if(apts == null || apts.length == 0){
		$('#section').append("Malheureusement aucun "+ type +"s n'est disponible...");
	}
	else{
		affPlsApparts(apts, type);
	}				
}	

//verifie l'égalité entre 2 apparts
function equals(apt1, apt2){
	return (apt1.type == apt1.type && apt1.desc == apt2.desc && apt1.prix == apt2.prix && apt1.adresse == apt2.adresse && apt1.photos === apt2.photos);
}

//retour l'indice de l'appart passer en paramètre
function getIndex(apt){
	var apts = getAppart(apt.type);
	for (var i=0; i<apts.length;++i)
		if(equals(apts[i], apt))
			return i;
}	

//permet de charger les pages de types et de recherches
function affPlsApparts(apts, type){
	var row=0;
	var nbAppartMaxRow=0;
	$('#section').append('<div class="row" id ="row'+row+'">');
		if(apts == null || apts.length == 0 && type == 'rech'){
			$('#section').append("Malheureusement aucun appart' de correspond à la recherche...");
		}
		$.each (apts, function(i, apt){
			$('#row'+row).append('<div class="petit-conteneur" id="pt-cont'+i+'">');
				$('#pt-cont'+i).append('<section class="box" id="box'+i+'">');
					$("#box"+i).append('<div class="supprimer"><a onclick="suppAppart(\''+getIndex(apt)+'\', \''+apt.type+'\')" href="javascript:void(0);"><img src="#" type="button" id=\'supp'+i+'\' class="supp"></a></div>');
					$('#supp' + i).attr('src', pathRepImg+"\\images\\supp.png");
					if(type=='rech')
								$('#box'+i).append('<a onclick="affAnnonce(\''+getIndex(apt)+'\', \''+apt.type+'\')" href="javascript:void(0);"><div class ="image slider" id="slider'+type+"-"+i+'">');
							else
					$('#box'+i).append('<a onclick="affAnnonce(\''+i+'\', \''+type+'\')" href="javascript:void(0);"><div class ="image slider" id="slider'+type+"-"+i+'">');
						var photos =apt.photos;
						if(photos != null){
							
							$('#slider'+type+"-"+i).append('<ul id="ul'+i+'"></ul>');
							$.each (photos, function(j, pho){
								var pathimg = pathRepImg +photos[j]; 
								$('#ul'+i).append('<li><img src="#"id="'+type + i + "-" + j +'" /></li>');
								$('#'+type + i + "-" + j).attr('src', pathimg);
							});
							listenerSlider(type, i);
							redimFenetreImg();
						}
						else
				   			$('#slider'+type+i).append('<ul><li><img></li></ul>'); 
						
				   		    
					$('#box'+i).append("<p id=\"prix\">"+ apt.prix +" &euro; </p>");
					$('#box'+i).append("<header><h3>Description</h3></header>");
					$('#box'+i).append("<p>"+ apt.adresse +"</p>");				
					if(apt.desc.length > 25)
						$('#box'+i).append("<p>"+ apt.desc.slice(0,25)+"..." +"</p>");
					else
						$('#box'+i).append("<p>"+ apt.desc +"</p>");									
					$('#box'+i).append('<footer><a onclick="affAnnonce(\''+getIndex(apt)+'\', \''+apt.type+'\')" href="javascript:void(0);" class=\"button alt\"> Voir l\'annonce </a></footer>');
				$('#pt-cont'+i).append("</section>");
			$('#row'+row).append("</div>");
			nbAppartMaxRow++;
			if(nbAppartMaxRow==3){
				nbAppartMaxRow=0;
				row++;
				$('#section').append('<div class="row" id ="row'+row+'">');
			}
		});
}

//ajouter un listener au hover
function listenerSlider(type, i){
	$("#slider"+type+"-"+i+":has(ul li:gt(0))").hover(
		function (){
			var nbLi = $("#slider"+type+"-"+i+" ul > *").length;
			if(nbLi<=1) return;
			setTimeout(function(){slideImg(type, i)}, 500);
			interval = setInterval(function (){slideImg()}, 4000); 
		}
		,function (){
			stopSlide(); 
	});	
}

//Fait défiler les image au hover
function slideImg(type, i){
	var nbLi = $("#slider"+type+"-"+i+" ul > *").length;
	if(nbLi<=1) return;
	$("#slider"+type+"-"+i+" ul").animate({marginTop:-imgH}, 2000, function(){
		
		$(this).css({marginTop:0}).find("li:last").after($(this).find("li:first"));
		
	});	
}		

//Retourne la listes des apparts du type demandé
function getAppart(type){
	if(apparts == null)
		return;
	if(type == "studio")
		return apparts.studio;
	if(type == "T1")
		return apparts.T1;
	if(type == "T2")
		return apparts.T2;
	if(type == "T3")
		return apparts.T3;
}

//Supprimer un appart
function suppAppart(idApp, type){
	if (confirm("Voulez-vous vraiment supprimer cette annonce ?")) {	   
		getAppart(type).splice(idApp, 1);
		saveApparts();
	}
	affAppart(type);
}

// afficher la page de formulaire
function vendre(){
	refreshMainConteneur("vendre");
	$('#section').load('vendre.html');
}

//affiche une annonce
function affAnnonce(indApp, type){
	if(indApp == null || type == null || indApp == 'undefined' || type == 'undefined' || indApp == '' || type == '' )
		return;
	document.getElementById('main-conteneur').innerHTML="";
	$("#main-conteneur").append('<div id="block-main">');
		$("#block-main").append('<div id="conteneur">');
			$("#conteneur").append('<div class="row">');
				$(".row").append('<div class="main-conteneur" id="grand-conteneur">');
					$("#grand-conteneur").append('<article class="box post" id="article">');
						var apts = getAppart(type);
						var appart = apts[indApp];
						if(appart != null){
							$("#article").append("<a href=\"\" onclick =\"return false;\"><div id =\"nexter\" class=\"image\">");
							var photos =appart.photos;
							$("#nexter").append('<ul id="ul"></ul>');	
							$.each (photos, function(j, pho){
								var pathimg = pathRepImg +photos[j]; 
								$('#ul').append('<li><img src="#"id="'+type + j +'" /></li>');
								$('#'+type + j).attr('src', pathimg);
							});
							redimFenetreImg();

							$("#nexter:has(ul li:gt(0))").click(function(){nextImg()});

							$("#article").append("<div id=\"prix\"> <p>"+appart.prix+" &euro;</p></div>");
							$("#article").append("<div id=\"type\"><h3>" + appart.type.charAt(0).toUpperCase() + appart.type.slice(1) +"</h3>");
							$("#article").append("<header><h2>Description</h2></header>");
							$("#article").append("<p>"+ appart.desc +"</p>");
							$("#article").append("<header><h3>Adresse</h3></header>");
							$("#article").append("<p>" + appart.adresse+ "</p>");	
						}
						else {
							$("#article").append("annonce introuvable");
						}
				if((apts.length) > 1){
		            var i = parseInt(Math.random() * (apts.length));
		            while (i == indApp){i = parseInt(Math.random() * (apts.length));}
					var apt = apts[i];
					if(appart!=null){
		                $('.row').append('<div class=\"petit-conteneur\" id="pt-cont">');
		                	$('#pt-cont').append('<section class="box" id="box">');
								$('#box').append('<a onclick="affAnnonce(\''+i+'\', \''+type+'\')" href="javascript:void(0);"><div class ="image slider" id="slider'+type+"-"+i+'">');
								var photos =apt.photos;
								if(photos != null){
									$('#slider'+type+"-"+i).append('<ul id="ul'+i+'"></ul>');
									var nbImg = 0;
									$.each (photos, function(j, pho){
										var pathimg = pathRepImg +photos[j]; 
										$('#ul'+i).append('<li><img src="#"id="'+type + i + "-" + j +'" /></li>');
										$('#'+type + i + "-" + j).attr('src', pathimg);
										nbImg++;
									});
									listenerSlider(type, i);
									redimFenetreImg();
								}
						   		else
						   			$('#slider'+type+"-"+i).append('<ul><li><img></li></ul>');     
								$('#box').append("<p id=\"prix\">"+ apt.prix +" &euro; </p>");
								$('#box').append("<header><h3>Description</h3></header>");
								$('#box').append("<p>"+ apt.adresse +"</p>");			
								if(apt.desc.length > 25)
									$('#box').append("<p>"+ apt.desc.slice(0,25	)+"..." +"</p>");
								else
									$('#box').append("<p>"+ apt.desc +"</p>");										
								$('#box').append('<footer><a onclick="affAnnonce(\''+i+'\', \''+type+'\')" href="javascript:void(0);" class=\"button alt\"> Voir l\'annonce </a></footer>');				
					}
				}
}

//Carrousel Annonce
function nextImg(){
	$("#nexter ul").animate({marginTop:-imgHeight}, 2000, function(){
		$(this).css({marginTop:0}).find("li:last").after($(this).find("li:first"));
	});	
}

//redimentionne la fentre du carrousel 
function redimFenetreImg(){
	$(".slider ul li img").load(function(){
		imgH = $(this).height();
		$(".slider").css({height:imgH});
	});

	$("#nexter ul li img").load(function(){
		imgHeight = $(this).height();
		$(" #nexter").css({height:imgHeight});
	});
}

// affichage de la page resultat de la recherche
function recherche(){
	if($('#burger').is(':visible')){
		$('#menu').toggleClass("show");
		if(!croix){
			$("#burger img").attr('src', "images/supp.png");
			croix=true;
		}
		else{
			$("#burger img").attr('src', "images/menu.png");
			croix=false;
		}
	}
	refreshMainConteneur("Recherche");
	strRech = $("#search-box").val();
	var apts = getAppartsRech(strRech);
	affPlsApparts(apts, 'rech');
}

//retourne les apparts avec l'adresse = str
function getAppartsRech(str){
	var apts = new Array();
	$.each (apparts, function(i, type){
		$.each (type, function(i, apt){
			if(apt.adresse == str)
				apts.push(apt);			
		});
	});
	return apts;
}
