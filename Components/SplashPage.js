import React from "react"

export default function SplashPage(props){
    // Render Splash 
    return (
        <div className="splash-page">
            <h1 className="splash--title">Quizzical</h1>
            <p className="splash--desc">Let's test your Computer Knowledge!</p>
            <button className="splash--button" onClick={props.startGame}>Take Quiz</button>
        </div>
    )
}