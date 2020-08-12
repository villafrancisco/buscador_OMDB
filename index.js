const user = {
	id: '',
	name: '',
	pass: '',
	fav: []
};

const log = document.getElementById('btn-log');

document.form.addEventListener('submit', (e) => {
	e.preventDefault();
});

log.addEventListener('click', (e) => {
	const objValidate = {
		name: false,
		pass: false
	};
	let msgerror = '';
	if (form.name.value == '') {
		objValidate.name = false;

		document.getElementById('name').nextElementSibling.classList.remove('hidden');
		document.getElementById('name').nextElementSibling.classList.add('visible');
	} else {
		objValidate.name = true;
		document.getElementById('name').nextElementSibling.classList.add('hidden');
		document.getElementById('name').nextElementSibling.classList.remove('visible');
	}
	if (form.password.value == '') {
		objValidate.pass = false;
		document.getElementById('password').nextElementSibling.classList.remove('hidden');
		document.getElementById('password').nextElementSibling.classList.add('visible');
	} else {
		objValidate.pass = true;
		document.getElementById('password').nextElementSibling.classList.add('hidden');
		document.getElementById('password').nextElementSibling.classList.remove('visible');
	}

	if (validateForm(objValidate)) {
		const arrayLocalStorage = Object.values(localStorage);
		//Compruebo si existen usuarios almacenados
		if (arrayLocalStorage.length != 0) {
			let flag = 'true';
			//Recorro los usuarios y pregunto si ya hay alguno con ese usuario y contraseña
			arrayLocalStorage.forEach((userlocal) => {
				const userLocalStorage = JSON.parse(userlocal);
				if (userLocalStorage.name == form.name.value && userLocalStorage.pass == form.password.value) {
					user.id = userLocalStorage.id;
					flag = 'false';
				}
			});
			//Si no existe usuario lo creamos
			if (flag == 'true') {
				createUser();
			} else {
				//Si existe lo guardamos en sessionStorage
				sessionStorage.setItem(user.id, user.id);
				window.location = 'buscador.html';
			}
		} else {
			//Si no hay usuarios almacenados, creamos el usuario
			createUser();
		}
	}
});

//Funcion para validar un objeto
const validateForm = (objetovalidar) => {
	const formValues = Object.values(objetovalidar);
	const valid = formValues.findIndex((value) => value == false);
	if (valid == -1) return 'true';
	else return false;
};

//Crear usuario en sessionStorage y en localStorage
const createUser = () => {
	user.id = Math.random().toString(16).substring(2);
	user.name = form.name.value;
	user.pass = form.password.value;
	sessionStorage.setItem(user.id, user.id);
	localStorage.setItem(user.id, JSON.stringify(user));
	window.location = 'buscador.html';
};
