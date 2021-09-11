const links = [];
let btnCount = 0;
let linkCount = 0;
let shouldUpdateBorder = false;
let isShowingNav = false;

const addNewLink = e => {

	e.preventDefault();

	fetchShortenedLink()
		.then(([link, userInput]) => {

			document.getElementById('submit').disabled = false;

			// console.log(localData);

			localStorage.setItem(btnCount, link.concat(' ' + userInput));

			console.log(localStorage.getItem(btnCount));

			loadAllLinkElements([link, userInput]);

		})
		.catch(err => {

			console.error(err);
			document.getElementById('submit').disabled = false;

			shouldUpdateBorder = true;

			document.getElementById('link-input').style.border = '2px solid red';
			document.getElementById('link-input').style.color = 'red';

		});

}

const fetchShortenedLink = async () => {

	const inputtedLink = document.getElementById('link-input').value;

	document.getElementById('submit').disabled = true;

	const response = await fetch('https://gotiny.cc/api', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			"input": inputtedLink,
		})
	});

	const json = await response.json();

	const full_short_link = await `gotiny.cc/${json[0]['code']}`;

	return await [full_short_link, json[0]['long']];

}


const copyToUser = (input) => {

	const elementToCopy = input.target.id[0] === 'a' ? input.target.id : 'a'.concat(input.target.id.substring(3));
	const buttonToChange = input.target.id[0] === 'a' ? 'btn'.concat(input.target.id.substring(1)) : input.target.id;

	setActiveStatesForCopy(document.getElementById(buttonToChange));

	navigator.clipboard.writeText(document.getElementById(elementToCopy).innerHTML);

}

const loadAllLinkElements = ([link, userInput]) => {

	const clonedNode = document.getElementById('clone-links-container').cloneNode(true);

	clonedNode.getElementsByTagName('p')[0].innerHTML = userInput;
	clonedNode.getElementsByTagName('a')[0].innerHTML = link;
	clonedNode.getElementsByTagName('a')[0].addEventListener('click', copyToUser);

	document.getElementById('user-shortened-links').style.display = 'flex';
	document.getElementById('user-shortened-links').style.flexDirection = 'column-reverse';

	clonedNode.style.display = 'flex';

	links.push([clonedNode.getElementsByTagName('button')[0], clonedNode.getElementsByTagName('a')[0], link]);

	links[btnCount][1].id = `a-copy-${btnCount}`;
	links[btnCount][0].id = `btn-copy-${btnCount}`;
	links[btnCount][0].addEventListener('click', copyToUser);

	btnCount++;

	document.getElementById('user-shortened-links').appendChild(clonedNode);

}

const setActiveStatesForCopy = btn => {

	links.forEach(link => {
		link[0].style.backgroundColor = '#2acfcf';
		link[0].innerHTML = 'Copy';
	});

	btn.style.backgroundColor = '#3b3054';
	btn.innerHTML = 'Copied!';

}

const resetInputField = () => {

	if (shouldUpdateBorder) {

		shouldUpdateBorder = false;

		document.getElementById('link-input').style.border = 'none';
		document.getElementById('link-input').style.color = 'black';
	}

}

const showHideMobileNav = () => {

	if (isShowingNav) {
		document.getElementById('mobile-nav').style.display = 'none';
		isShowingNav = false;
	} else {
		document.getElementById('mobile-nav').style.display = 'flex';
		document.getElementById('mobile-nav').style.flexDirection = 'column';
		isShowingNav = true;
	}

}

const hideNavAndJump = () => {

	document.getElementById('mobile-nav').style.display = 'none';
	isShowingNav = false;

	document.getElementById('footer').scrollIntoView({
		behavior: 'smooth'
	});

}



document.getElementById('link-input-form').addEventListener('submit', addNewLink);

while (localStorage.getItem(linkCount) !== null) {
	linkCount++;
}

for (let i = 0; i < linkCount; i++) {
	loadAllLinkElements([localStorage.getItem(i).split(' ')[0], localStorage.getItem(i).split(' ')[1]]);
}