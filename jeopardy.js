//Creates the board
$('div').append('<table id="jeopardy" style="display: none">');
$('#jeopardy').append('<thead>', '<tbody>');
$('thead').append('<tr>');
$('tbody').append('<tr id="row0">', '<tr id="row1">', '<tr id="row2">', '<tr id="row3">', '<tr id="row4">');
$('tr').append('<td>?', '<td>?', '<td>?', '<td>?', '<td>?');

//Base Api Link
const apiLink = 'https://jservice.io/api/'; //categories?count=100"

// categories is the main data structure for the app; it looks like this:
//  [
//    { title: "Math",
//      clues: [
//        {question: "2+2", answer: 4, showing: null},
//        {question: "1+1", answer: 2, showing: null}
//        ...
//      ],
//    },
//    { title: "Literature",
//      clues: [
//        {question: "Hamlet Author", answer: "Shakespeare", showing: null},
//        {question: "Bell Jar Author", answer: "Plath", showing: null},
//        ...
//      ],
//    },
//    ...
//  ]

// uncomment this code to test if your axios code is correct separate from other codes.
//     async function test(){
//     let x = await axios.get(categoryApi);
//     console.log(x.data[0].id)
// }
// test()

let categories = [];

/** Get NUM_CATEGORIES random category from API.
 *
 * Returns array of category ids
 */

async function getCategoryIds() {
	categories = _.shuffle((await axios.get(`${apiLink}/categories?count=100`)).data).splice(0, 6);

	// Previous version
	// for (let i = 0; i < 6; i++) {
	// 	let x = Math.floor(Math.random() * 100);
	// 	let categoryId = await axios.get(`${apiLink}/categories?count=100`);
	// 	categories.push(categoryId.data[x].id);
	// 	console.log(categories);
	// }

	return categories;
}
/** Return object with data about a category:
 *
 *  Returns { title: "Math", clues: clue-array }
 *
 * Where clue-array is:
 *   [
 *      {question: "Hamlet Author", answer: "Shakespeare", showing: null},
 *      {question: "Bell Jar Author", answer: "Plath", showing: null},
 *      ...
 *   ]
 */
let catObject = {};
async function getCategory(catId) {
	let x = await axios.get(`${apiLink}/category?id=${catId}`);
	catObject = {
		title: x.data.title,
		clues: x.data.clues
	};
	return catObject;
}

/** Fill the HTML table#jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initally, just show a "?" where the question/answer would go.)
 */

async function fillTable() {
	let num = 0;
	for (let x of categories) {
		let catObject = await getCategory(x.id);
		$('thead td').eq(num).attr('id', x.id).text(catObject.title);
		for (let i = 0; i < $('tbody tr').length; i++) {
			$(`#row${i} td`)
				.eq(num)
				.attr('data-question', `${catObject.clues[i].question}`)
				.attr('data-answer', `${catObject.clues[i].answer}`);
		}

		//previous code
		// $('thead td').eq(num).attr('id', x.id).text(catObject.title);
		// $(`#row${0} td`)
		// 	.eq(num)
		// 	.attr('data-question', `${catObject.clues[0].question}`)
		// 	.attr('data-answer', `${catObject.clues[0].answer}`);
		// $(`#row${1} td`)
		// 	.eq(num)
		// 	.attr('data-question', `${catObject.clues[1].question}`)
		// 	.attr('data-answer', `${catObject.clues[1].answer}`);
		// $(`#row${2} td`)
		// 	.eq(num)
		// 	.attr('data-question', `${catObject.clues[2].question}`)
		// 	.attr('data-answer', `${catObject.clues[2].answer}`);
		// $(`#row${3} td`)
		// 	.eq(num)
		// 	.attr('data-question', `${catObject.clues[3].question}`)
		// 	.attr('data-answer', `${catObject.clues[3].answer}`);
		// $(`#row${4} td`)
		// 	.eq(num)
		// 	.attr('data-question', `${catObject.clues[4].question}`)
		// 	.attr('data-answer', `${catObject.clues[4].answer}`);
		num++;
	}
}

/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */

function handleClick() {
	$('div').bind('click', function(evt) {
		let x = evt.target;
		if ($(x).text() === $(x).attr('data-question')) {
			$(x).text($(x).attr('data-answer'));
		} else if ($(x).text() === $(x).attr('data-answer')) {
		} else {
			$(x).text($(x).attr('data-question'));
		}
	});
}

/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
 */

function showLoadingView() {
	$('table td').text('?');
	$('div').unbind();
	$('#jeopardy').toggle();
}

/** Remove the loading spinner and update the button used to fetch data. */

function hideLoadingView() {
	$('#jeopardy').toggle();
	handleClick();
	$('#loading').toggle();
}

/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */

async function setupAndStart() {
	await getCategoryIds();
	await fillTable();
}

/** On click of start / restart button, set up game. */

// TODO
$('button').on('click', async function() {
	if ($('button').attr('id') === 'restart') {
		showLoadingView();
		$('#loading').toggle();
		await setupAndStart();
	} else {
		$('#start').text('New Game').attr('id', 'restart');
		$('#loading').toggle();
		await setupAndStart();
	}
	hideLoadingView();
});

/** On page load, add event handler for clicking clues */

// TODO
