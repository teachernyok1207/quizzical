import React from "react"
import SplashPage from "./Components/SplashPage"
import ExamPage from "./Components/ExamPage"
import { nanoid } from "nanoid"
import { decode } from "html-entities"

export default function App(){
    // Using State for Quizzical
    const [newGame,setNewGame] = React.useState(true)
    const [questionnaires, setQuestionnaires] = React.useState([])
    const [completedAnswers,setCompletedAnswers] = React.useState(false)
    const [finalResult,setFinalResult] = React.useState(false)
    const [finalScore, setFinalScore] = React.useState(0)
    
    // Calling API
    React.useEffect(()=>{
        if(newGame){
            fetch("https://opentdb.com/api.php?amount=5&category=18&type=multiple")
                .then(res => res.json())
                .then(data => fetchQuiz(data.results))
        }
    },[newGame])

    // Function for fetching Quizzes
    function fetchQuiz(data){
        const newQuiz = data.map((quiz, index) => ({
            questionId: index,
            isAnswered: false,
            question: decode(quiz.question),
            answers: shuffleChoices(quiz.incorrect_answers,quiz.correct_answer)
        }))
        setQuestionnaires(newQuiz)
        setGameWaiting(false)
    }
    
    // For Shuffling Multiple Choices
    function shuffleChoices(incorrect,correct){
        const choicesAnswersArr = setIncorrectArray(incorrect)
        const correctAnswerArr = setCorrectArray(correct)
        choicesAnswersArr.splice(shuffleCorrectAnswer(choicesAnswersArr),0,correctAnswerArr)
        return choicesAnswersArr
    }
    
    // Render All Incorrect Answers
    function setIncorrectArray(incorrectChoices){
        return incorrectChoices.map(data => ({
            id: nanoid(),
            description: decode(data),
            isCorrect: false,
            isSelected: false
        }))
    }
    
    // Render the Correct Answer
    function setCorrectArray(correctAnswer){
        return {
            id: nanoid(),
            description: decode(correctAnswer),
            isCorrect: true,
            isSelected: false
        }
    }
    
    // Positioning the Correct Answer in different order
    function shuffleCorrectAnswer(answerArray){
        return Math.floor(Math.random()*(answerArray.length+1))
    }
    
    // Function for selecting Answer
    function selectAnswer(quizId,selectedAnswerId){
        if (!finalResult){
            setQuestionnaires(prevState => {
                const newQuizItem = [...prevState]
                newQuizItem[quizId].isAnswered = true
                newQuizItem[quizId].answers = newQuizItem[quizId].answers.map(item => (
                    item.id === selectedAnswerId ? {id:item.id,description:item.description,isCorrect:item.isCorrect, isSelected: true} : {id:item.id,description:item.description,isCorrect:item.isCorrect, isSelected: false}
                ))
                return newQuizItem
            })
        }
    }
    
    // Try - Checking if all questions have been answered
    React.useEffect(()=>{ 
        const modifyAnswers = questionnaires.filter(function(item){
            return item.isAnswered === false
        })[0]
        
        // Checking if modifyAnswers has contents
        setCompletedAnswers(modifyAnswers ? true : false) 
    },[questionnaires])
    
    // Rendering Result
    function renderResult(){
        if (finalResult){
            setNewGame(newGame => !newGame)
        }else{
            let myScore = 0
            let correctAnswers = ""
            questionnaires.forEach(item => {
                item.answers.forEach(answer => {
                    if (answer.isCorrect){
                        correctAnswers += `${answer.description} :`
                    }
                    if (answer.isSelected && answer.isCorrect){
                        myScore++
                    }
                })
            })
            setFinalScore(myScore)
        }
        // Changing finalResult Value
        setFinalResult(finalResult => !finalResult)
    }
    
    // function to start a game
    function startGame(){
        setNewGame(prevState => !prevState)
    }
    
    // Rendering ExamPage
    const renderExamPage = questionnaires.map(item => {
        return (
            <ExamPage 
                key={item.questionId}
                qid={item.questionId}
                question={item.question}
                choices={item.answers}
                selectAnswer={selectAnswer}
                finalResult = {finalResult}
                startGame={() => startGame()}
            />
        )
    })
    
    // Render Background with Splash or Exam Page
    return (
        <div>
            {   
                newGame ? 
                <SplashPage 
                    startGame={() => startGame()}
                />
                : 
                <div className="examPage">
                    {renderExamPage}   
                    <div className="submit-div">
                    {finalResult && <p className="examPage--remarks">You scored {finalScore}/5 correct answers!</p>}
                    <button className="examPage--submit" disabled={completedAnswers} onClick={renderResult}>
                        {finalResult ? `New Quiz` : `Submit Answers`}
                    </button>
                    </div>
                </div>
            }
            
            <img className="bgstyle-top" src="./images/bgstyle-1.png" />
            <img className="bgstyle-bottom" src="./images/bgstyle-2.png" />
        </div>
    )
}