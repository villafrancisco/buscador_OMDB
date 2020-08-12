const search = document.getElementById('btn-search');
const searchdetail = document.getElementById('result');
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

document.form.addEventListener('submit', (e) => {
	e.preventDefault();
});
searchByTitle = (title) => {
	const fragment = document.createDocumentFragment();
	axios({
		method: 'GET',
		url: `http://www.omdbapi.com/?s=${title}&type=movie&apikey=87ed9d5a`
	})
		.then((res) => {
			for (const film of res.data.Search) {
				const div = document.createElement('DIV');
				div.setAttribute('class', 'film');
				div.setAttribute('id', `${film.imdbID}`);
				const img = document.createElement('IMG');
				if (film.Poster == 'N/A') {
					film.Poster = 'no-image.png';
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
			}
			result.append(fragment);
		})
		.catch((err) => {
			const p = document.createElement('P');
			p.textContent = 'No se ha encontrado ningún resultado';
			p.classList.add('error');
			result.append(p);
			console.log(err);
		});
};
search.addEventListener('click', (e) => {
	const result = document.getElementById('result');
	result.innerHTML = '';
	searchByTitle(form.film.value);
});

searchById = (id) => {
	modal.classList.add('modal--show');
	document.getElementById('searcher').classList.add('modal--open');

	axios({
		method: 'GET',
		url: `http://www.omdbapi.com/?i=${id}&apikey=87ed9d5a`
	})
		.then((res) => {
			// res.data.Title;
			detail.lastChild.innerHTML = '';

			const div = document.createElement('DIV');
			div.setAttribute('class', 'film-detail');
			div.setAttribute('data-id', id);

			const divDetail1 = document.createElement('DIV');
			divDetail1.setAttribute('class', 'desc_detail');
			const titulo = document.createElement('H2');
			titulo.textContent = `${res.data.Title} (${res.data.Year})`;

			divDetail1.append(titulo);

			const img = document.createElement('IMG');
			if (res.data.Poster == 'N/A') {
				res.data.Poster = 'no-image.png';
			}
			img.setAttribute('src', `${res.data.Poster}`);
			const divDetail2 = document.createElement('DIV');
			divDetail2.setAttribute('class', 'desc_detail');
			divDetail2.append(img);

			const divDetail3 = document.createElement('DIV');
			divDetail3.setAttribute('class', 'desc_detail');
			const actors = document.createElement('P');
			actors.textContent = 'Actores : ' + res.data.Actors;
			const director = document.createElement('P');
			director.textContent = 'Director : ' + res.data.Director;
			const sinopsis = document.createElement('P');
			sinopsis.textContent = 'Sinopsis : ' + res.data.Plot;
			const genero = document.createElement('P');
			genero.textContent = 'Genero : ' + res.data.Genre;
			const duracion = document.createElement('P');
			duracion.textContent = 'Duración : ' + res.data.Runtime;
			const pais = document.createElement('P');
			pais.textContent = 'Pais : ' + res.data.Country;
			let clase = '';
			if (user.fav.indexOf(id) != '-1') {
				clase = 'check';
			}
			const fav = document.createElement('P');
			fav.setAttribute('data-id', id);
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

			detail.append(div);
		})
		.catch((err) => {
			console.log(err);
		});
};

addfavorite = (id) => {
	user.fav.push(id);

	localStorage.removeItem(user.id);
	localStorage.setItem(user.id, JSON.stringify(user));
};
removefavorite = (id) => {
	user.fav.splice(user.fav.indexOf(id), 1);

	localStorage.removeItem(user.id);
	localStorage.setItem(user.id, JSON.stringify(user));
};

searchdetail.addEventListener('click', (e) => {
	if (e.target.parentElement.id != 'searcher') {
		if (e.target.parentElement.id == 'result') {
			searchById(e.target.id);
		} else if (e.target.nodeName == 'I') {
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
	modal.classList.remove('modal--show');
	document.getElementById('searcher').classList.remove('modal--open');
});

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
document.getElementById('search').parentElement.classList.remove('hidden');
document.getElementById('back').classList.add('hidden');
document.getElementById('header').firstElementChild.textContent = 'Busca tu pelicula';

favorites.addEventListener('click', (e) => {
	document.getElementById('search').parentElement.classList.add('hidden');
	document.getElementById('back').classList.remove('hidden');
	document.getElementById('header').firstElementChild.textContent = 'Favoritos';
});

back.addEventListener('click', (e) => {
	document.getElementById('search').parentElement.classList.remove('hidden');
	document.getElementById('back').classList.add('hidden');
	document.getElementById('header').firstElementChild.textContent = 'Busca tu pelicula';
});
