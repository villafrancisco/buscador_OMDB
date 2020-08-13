const search = document.getElementById('btn-search');
const result = document.getElementById('result');
const modal = document.getElementById('modal');
const detail = document.getElementById('detail');
const close = document.getElementById('close');
const favorites = document.getElementById('favorites');
const back = document.getElementById('back');

let user = {
	id: '',
	name: '',
	pass: '',
	fav: []
};

user = JSON.parse(localStorage.getItem(uid));

//Busqueda por titulo
searchByTitle = (title) => {
	axios({
		method: 'GET',
		url: `http://www.omdbapi.com/?s=${title}&type=movie&apikey=87ed9d5a`
	})
		.then((res) => {
			const fragment = document.createDocumentFragment();
			for (const film of res.data.Search) {
				//Dibujo cada pelicula
				renderFilm(film, fragment, result);
			}
		})
		.catch((err) => {
			const p = document.createElement('P');
			p.textContent = 'No se ha encontrado ningún resultado';
			p.classList.add('error');
			result.append(p);
			console.log(err);
		});
};

//Busqueda por id
searchById = (id) => {
	axios({
		method: 'GET',
		url: `http://www.omdbapi.com/?i=${id}&apikey=87ed9d5a`
	})
		.then((res) => {
			//Dibujo los detalles de la pelicula
			renderFilmDetail(res.data, detail);
		})
		.catch((err) => {
			console.log(err);
		});
};

//Funcion para dibujar cada pelicula, le pasamos la pelicula, un fragmento, y un elemento donde dibujarla
renderFilm = (film, fragment, divtorender) => {
	const div = document.createElement('DIV');
	div.setAttribute('class', 'film');
	div.setAttribute('id', `${film.imdbID}`);
	const img = document.createElement('IMG');
	if (film.Poster == 'N/A') {
		film.Poster = 'img/no-image.png';
	}
	img.setAttribute('src', `${film.Poster}`);

	let clase = '';

	if (user.fav.indexOf(film.imdbID) != '-1') {
		clase = 'check';
	}
	const i = document.createElement('I');
	i.setAttribute('class', 'fas fa-2x fa-heart ' + clase);

	div.append(i);
	div.append(img);
	const p = document.createElement('P');
	p.textContent = `${film.Title}`;
	const pyear = document.createElement('P');
	pyear.textContent = `${film.Year}`;

	div.append(p);
	div.append(pyear);
	fragment.append(div);

	divtorender.append(fragment);
};
//Dibujamos los detalles de una pelicula, le pasamos la pelicula y el elemento donde dibujarla
renderFilmDetail = (film, divtorender) => {
	showModal();
	detail.lastChild.innerHTML = '';

	const div = document.createElement('DIV');
	div.setAttribute('class', 'film-detail');
	div.setAttribute('data-id', film.imdbID);

	const divDetail1 = document.createElement('DIV');
	divDetail1.setAttribute('class', 'desc_detail');
	const titulo = document.createElement('H2');
	titulo.textContent = `${film.Title} (${film.Year})`;

	divDetail1.append(titulo);

	const img = document.createElement('IMG');
	if (film.Poster == 'N/A') {
		film.Poster = 'img/no-image.png';
	}
	img.setAttribute('src', `${film.Poster}`);
	const divDetail2 = document.createElement('DIV');
	divDetail2.setAttribute('class', 'desc_detail');
	divDetail2.append(img);

	const divDetail3 = document.createElement('DIV');
	divDetail3.setAttribute('class', 'desc_detail');
	const actors = document.createElement('P');
	actors.textContent = 'Actores : ' + film.Actors;
	const director = document.createElement('P');
	director.textContent = 'Director : ' + film.Director;
	const sinopsis = document.createElement('P');
	sinopsis.textContent = 'Sinopsis : ' + film.Plot;
	const genero = document.createElement('P');
	genero.textContent = 'Genero : ' + film.Genre;
	const duracion = document.createElement('P');
	duracion.textContent = 'Duración : ' + film.Runtime;
	const pais = document.createElement('P');
	pais.textContent = 'Pais : ' + film.Country;
	let clase = '';
	if (user.fav.indexOf(film.imdbID) != '-1') {
		clase = 'check';
	}
	const fav = document.createElement('P');
	fav.setAttribute('data-id', film.imdbID);
	fav.innerHTML = '<i class="fas fa-2x fa-heart ' + clase + '"></i>';

	divDetail3.append(director);
	divDetail3.append(actors);
	divDetail3.append(sinopsis);
	divDetail3.append(genero);
	divDetail3.append(duracion);
	divDetail3.append(pais);
	divDetail3.append(fav);

	div.append(divDetail1);
	div.append(divDetail2);
	div.append(divDetail3);

	divtorender.append(div);
};

//Añadimos el id de la pelicula a favoritos
addfavorite = (id) => {
	user.fav.push(id);

	localStorage.removeItem(user.id);
	localStorage.setItem(user.id, JSON.stringify(user));
};

//Borramos el id de la pelicula de favoritos
removefavorite = (id) => {
	user.fav.splice(user.fav.indexOf(id), 1);

	localStorage.removeItem(user.id);
	localStorage.setItem(user.id, JSON.stringify(user));
};

//Mostrar modal
showModal = () => {
	modal.classList.add('modal--show');
	document.getElementById('searcher').classList.add('modal--open');
};
//Ocultal modal
hideModal = () => {
	modal.classList.remove('modal--show');
	document.getElementById('searcher').classList.remove('modal--open');
};

//Mostramos la pagina de busqueda como al principio de la carga de la pagina, esta funcion es para cuando pulsamos en la tecla de volver que nos muestre el buscador
resetPage = () => {
	document.getElementById('search').parentElement.classList.remove('hidden');
	document.getElementById('back').classList.add('hidden');
	document.getElementById('header').firstElementChild.textContent = 'Busca tu pelicula';
};

//Inicializamos la página de busqueda
resetPage();

//Eliminamos el evento por defecto del formulario
document.form.addEventListener('submit', (e) => {
	e.preventDefault();
});

//Evento al pulsar el boton de buscar
search.addEventListener('click', (e) => {
	result.innerHTML = '';
	searchByTitle(form.film.value);
});

//Evento para comprobar en que pelicula hemos pulsado para ver los detalles y si hemos pulsado para agregar a favoritos
result.addEventListener('click', (e) => {
	if (e.target.parentElement.id != 'searcher') {
		if (e.target.parentElement.id == 'result') {
			searchById(e.target.id);
		} else if (e.target.nodeName == 'I') {
			//Comprueba si hemos echo click en agregar a favoritos
			if (e.target.classList.contains('check')) {
				removefavorite(e.target.parentElement.id);
				e.target.classList.remove('check');
			} else {
				addfavorite(e.target.parentElement.id);
				e.target.classList.add('check');
			}
		} else {
			searchById(e.target.parentElement.id);
		}
	}
});

close.addEventListener('click', (e) => {
	hideModal();
});

//Evento para comprobar si hemos pulsado en agregar favorito dentro de la ventana modal
detail.addEventListener('click', (e) => {
	if (e.target.classList.contains('fa-heart')) {
		if (e.target.classList.contains('check')) {
			removefavorite(e.target.parentElement.dataset.id);
			e.target.classList.remove('check');
			const fav = document.getElementById(e.target.parentElement.dataset.id);
			fav.firstChild.classList.remove('check');
		} else {
			addfavorite(e.target.parentElement.dataset.id);
			e.target.classList.add('check');

			const fav = document.getElementById(e.target.parentElement.dataset.id);
			fav.firstChild.classList.add('check');
		}
	}
});

//Evento para ver los favoritos agregados
favorites.addEventListener('click', (e) => {
	document.getElementById('search').parentElement.classList.add('hidden');
	document.getElementById('back').classList.remove('hidden');
	document.getElementById('header').firstElementChild.textContent = 'Favoritos';
	result.innerHTML = '';
	//Buscar cada pelicula de favoritos
	if (user.fav.length == 0) {
		//No hay favoritos agregados
		result.innerHTML = '<h2>No tienes favoritos añadidos</h2>';
	} else {
		for (const favid of user.fav) {
			axios({
				method: 'GET',
				url: `http://www.omdbapi.com/?i=${favid}&apikey=87ed9d5a`
			})
				.then((res) => {
					const fragment = document.createDocumentFragment();
					renderFilm(res.data, fragment, result);
				})
				.catch((err) => {
					console.log(err);
				});
		}
	}
});

//Evento para el boton de volver
back.addEventListener('click', (e) => {
	resetPage();
	result.innerHTML = '';
	searchByTitle(form.film.value);
});
