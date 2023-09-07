import React from "react"
import Confetti from "react-confetti"

export default function ExamPage({qid,question,choices,selectAnswer,finalResult,startGame}){
    // Render Multiple Choices
    const renderAnswers = choices.map(item => {
        // Classes for Changing Choices Properties in CSS
        const classShowAnswer = finalResult && "showAnswer"
        const classCorrectAnswer = item.isCorrect && finalResult && "classCorrect"
        const classSelectedAnswer = item.isSelected && item.isCorrect && finalResult && "selectedCorrectAnswer"
        const classIncorrectAnswer = !item.isCorrect && item.isSelected && finalResult && "classIncorrect"
        
        // Rendering Exam Questions
        return (
            <div key={item.id}>
                <input
                    type="radio"
                    className={`
                        examPage--option
                        ${classShowAnswer} 
                        ${classCorrectAnswer} 
                        ${classIncorrectAnswer}
                        ${classSelectedAnswer}
                    `}
                    id={item.id}
                    name={qid}
                    checked={item.isSelected}
                    onChange={() => selectAnswer(qid, item.id)}
                />
                <label htmlFor={item.id}>
                    {item.description}
                </label>
            </div>
        )
    })
    
    // Render All Question 5 only
    return (
        <div className="examPage--item">
            {finalResult && <Confetti />}
            <h2 className="examPage--question">{question}</h2>
            <div className="examPage--choices">
                {renderAnswers}
            </div>
        </div>   
    )
}