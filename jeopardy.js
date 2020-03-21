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

//Categories: http://jservice.io/api/categories?count=10&offset=6
//Clues: http://jservice.io/api/clues?category=11544

let categories = [];

/** Get NUM_CATEGORIES random category from API.
 *
 * Returns array of category ids
 */

async function getCategoryIds() {
    let random = Math.floor(Math.random() * 999);
    let res = await axios.get(`http://jservice.io/api/categories?count=100&offset=${random}`);
    
    let categories = res.data.map(result => ({
        id: result.id,
        title: result.title
    }))
    let randomCategories = _.sampleSize(categories, 6);
   
    return randomCategories
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
    let res = await axios.get(`http://jservice.io/api/clues?category=${catId}`);
   
    let clueArray = res.data.map(result => ({
        question: result.question,
        answer: result.answer,
        showing: null
    }))
   let sampleClueArray = _.sampleSize(clueArray, 5);
 
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

function fillTable() {
    const $jeopardy = $("#jeopardy");
    const $thead = $jeopardy.children('thead');
    $thead.empty();
    let $headerRow = $thead.append('<tr>')
    for (let category of categories) {
        let $header = $(
            `<th>${category.title}</th>`
        );
        $headerRow.append($header);
    }
    
// /* <tbody>
        //     <td id="0-0">?</td>
        //     <td id="1-0">?</td>
        //     <td id="2-0">?</td>
        //     <td id="3-0">?</td>
        //     <td id="4-0">?</td>
        //     <td id="5-0">?</td>
        // </tbody> */
}

/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */

function handleClick(evt) {
}

/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */

async function setupAndStart() {
}

/** On click of restart button, restart game. */
$('#restart').on('click', setupAndStart());



/** On page load, setup and start & add event handler for clicking clues */

// TODO

// categories = [
//     { title: "Math",
//       clues: [
//         {question: "2+2", answer: 4, showing: null},
//         {question: "1+1", answer: 2, showing: null}
//       ],
//     },
//     { title: "Literature",
//       clues: [
//         {question: "Hamlet Author", answer: "Shakespeare", showing: null},
//         {question: "Bell Jar Author", answer: "Plath", showing: null}
//       ],
//     },
//     { title: "Cats",
//       clues: [
//         {question: "Hamlet Author", answer: "Shakespeare", showing: null},
//         {question: "Bell Jar Author", answer: "Plath", showing: null}
//       ],
//     },
//     { title: "Dogs",
//       clues: [
//         {question: "Hamlet Author", answer: "Shakespeare", showing: null},
//         {question: "Bell Jar Author", answer: "Plath", showing: null}
//       ],
//     },{ title: "Violin",
//     clues: [
//       {question: "Hamlet Author", answer: "Shakespeare", showing: null},
//       {question: "Bell Jar Author", answer: "Plath", showing: null}
//     ],
//   },{ title: "Food",
//   clues: [
//     {question: "Hamlet Author", answer: "Shakespeare", showing: null},
//     {question: "Bell Jar Author", answer: "Plath", showing: null}
//   ],
// },

   
//   ]