//Si estamos en la pagina de buscador y no hay sesionStorage nos manda a la pagina de login
const url = window.location.href;
let uid = '';
if (url.includes('buscador.html')) {
	if (window.sessionStorage.length == '0') {
		window.location = 'index.html';
	} else {
		for (const key of Object.keys(sessionStorage)) {
			if (key == sessionStorage[key]) {
				uid = key;
			}
		}
	}
}
