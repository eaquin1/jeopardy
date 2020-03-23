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

let categories = [];
const NUM_CATEGORIES = 6;
const NUM_CLUES = 5;

/** Get NUM_CATEGORIES random category from API.
 *
 * Returns array of category ids
 */

async function getCategoryIds() {
    let random = Math.floor(Math.random() * 999);
    let res = await axios.get(`https://cors-anywhere.herokuapp.com/http://jservice.io/api/categories?count=100&offset=${random}`);

    let randomCategories = res.data.map(result => (
        result['id']
    ))
    let sampleCategories = _.sampleSize(randomCategories, NUM_CATEGORIES);

    return sampleCategories;
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

async function getCategory(catId) {
    let res = await axios.get(`https://cors-anywhere.herokuapp.com/http://jservice.io/api/clues?category=${catId}`);

    let clueArray = res.data.map(result => ({
        question: result.question,
        answer: result.answer,
        showing: null
    }))

    let sampleClueArray = _.sampleSize(clueArray, NUM_CLUES);
    return {
            title: res.data[0].category.title,
            clues: sampleClueArray
        }

}


/** Fill the HTML table#jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initally, just show a "?" where the question/answer would go.)
 */

async function fillTable() {
    const $jeopardy = $("#jeopardy");
    const $thead = $jeopardy.children('thead');
    const $tbody = $jeopardy.children('tbody');
    $thead.empty();
    $tbody.empty();

    let $headerRow = $('<tr>');

    for (let category of categories) {
        let $header = $(
            `<th>${category.title}</th>`
        );
        $headerRow.append($header);
    }

    $thead.append($headerRow);

    // fill cells in table
    for(let x = 0; x < NUM_CLUES; x++){
        let $clueRow = $('<tr>');
         for(let y = 0; y < NUM_CATEGORIES; y++) {
            let $row = $(
                `<td id="${y}-${x}">?</td>`
            )
            $clueRow.append($row);
        }
        $tbody.append($clueRow);
    }
}

/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */

function handleClick(evt) {
    evt.preventDefault();
    let id = evt.target.id;
    let $clue = $(evt.target)
    let selectedCat = parseInt(id.slice(0, 1));
    let selectedQuestion = parseInt(id.slice(2));

    let showing =  categories[selectedCat].clues[selectedQuestion]["showing"];

    if(!showing){
        $clue.html(categories[selectedCat].clues[selectedQuestion].question);
        categories[selectedCat].clues[selectedQuestion]["showing"] = "question";
    } else if (showing === "question") {
       $clue.html(categories[selectedCat].clues[selectedQuestion].answer);
       categories[selectedCat].clues[selectedQuestion]["showing"] = "answer";
    } else {
        return;
    }
}

/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */

async function setupAndStart() {
    let getCatIds = await getCategoryIds();
    categories = [];
    for (let id of getCatIds) {
        categories.push(await getCategory(id));
    }

    fillTable();
}

/** On click of restart button, restart game. */
$('#restart').on('click', async function() {
    await setupAndStart()
});

/** On page load, setup and start & add event handler for clicking clues */
$(window).on("load", async function(){
    await setupAndStart();

$('tbody').on('click', 'td', function(evt){
    handleClick(evt);
    })
})
