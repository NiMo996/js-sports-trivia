// import the utility functions "decodeHtml" and "shuffle"

import { decodeHtml, shuffle } from './utils.js' 

// get the elements from the DOM
const questionElement = document.getElementById('question')

const answersElement = document.querySelector('#answers')

const nextQuestionElement = document.querySelector('#nextQuestion')


// IIFE (so we can use async/await)
(async () => {
	// todo: create your "getNextQuestion" function
	const getNextQuestion = async () => {
		//fetch the question from the API
		try {
		const response = await fetch('https://opentdb.com/api.php?amount=1&category=21&difficulty=easy&type=multiple') //response stores a ReadStream object that represents the response to the request made by fetch
				if (response.status === 429) {
					console.error("Rate limit exceeded. Please wait before trying again.");
					questionElement.textContent = "Error: Too many requests. Please wait a moment and try again."
					answersElement.innerHTML = ''
					return null;  // Return null to indicate failure
				}
		const json = await response.json()
		console.log("Fetched JSON data:", json); // Log the JSON data to inspect it

		const { question, correct_answer: correct, incorrect_answers: incorrect } = json.results[0]
		const answers = shuffle([ ...incorrect, correct ])
		return { question, answers, correct } //return an object with the question, answers, and correct answer
		}
		catch (error) {
			console.error("Failed to fetch the question:", error)
			questionElement.textContent = "Error: Unable to load question. Please try again later."
			answersElement.innerHTML = ''
			return null
		}
	
	}
	// todo: create your "renderQuestion" function
	const renderQuestion = ({question, answers, correct}) => {
		questionElement.innerHTML = decodeHtml(question) //declared at the top of the file and displays the question from getNextQuestion
		answersElement.innerHTML = '' //clear the answers element

		answers.forEach(answer => {
			const button = document.createElement('button')
			button.textContent = decodeHtml(answer)

			button.addEventListener('click', () => {
			if (answer === correct) {
				button.classList.add('correct')
				answersElement.querySelectorAll('button').forEach(b => b.disabled = true)
				alert('Correct!')
				return
			}
				button.disabled = true
				alert('Incorrect!')
		})
			answersElement.appendChild(button)
		})

	}

	// todo: add the event listener to the "nextQuestion" button
	nextQuestionElement.addEventListener('click', async () => {
		const questionData = await getNextQuestion()
		if (questionData) { //only call renderQuestion if questionData is not null
			renderQuestion(questionData)
		}
		nextQuestionElement.disabled = true
		setTimeout(() => nextQuestionElement.disabled = false, 10000)
		
	})

})()

// mimic a click on the "nextQuestion" button to show the first question
nextQuestionElement.click()
