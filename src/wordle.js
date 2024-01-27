import { useEffect, useRef, useState } from "react"
import { guessWord } from "./api/wordle"
import styles from './worldle.module.css'

const Wordle = (props) => {
    const inputRefs = useRef([]);
    const [currentWord, setCurrentWord] = useState(1)
    const [currentLetter, setCurrentLetter] = useState(1)

    const handleKeyPress = (event) => {
        let keyPressed = event?.key
        if(currentLetter<=props.wordLength && event?.keyCode >= 65 && event.keyCode <= 90 || event.keyCode >= 97 && event?.keyCode <= 122) {
            if (inputRefs?.current[currentWord][currentLetter] && !inputRefs?.current[currentWord][currentLetter].innerHTML) {
                inputRefs.current[currentWord][currentLetter].innerHTML = keyPressed.toUpperCase();
            }
            setCurrentLetter(prevState=>prevState+1)
            
        }else if(keyPressed === "Enter") {
            if(currentLetter==props.wordLength+1) {

            }else {
                alert('Not enough Letters')
            }
        }else if(keyPressed === "Backspace") {
            let newCurrent = currentLetter;
            if(currentLetter-1 >= 1) {
                newCurrent =  currentLetter-1
            }
            setCurrentLetter(newCurrent)
            if (inputRefs?.current[currentWord][newCurrent]?.innerHTML) {
                inputRefs.current[currentWord][newCurrent].innerHTML = '';
            }
        }else {
            console.log('Not a letter or word limit reached', keyPressed)
        }
    }

    useEffect(() => {
        document.addEventListener('keyup', handleKeyPress);
        return () => document.removeEventListener('keyup', handleKeyPress);
    }, [handleKeyPress])


    let guesses=[]
    for(let i=1; i<=props.maxGuesses; i++) {
        let boxes = []
        for(let j=1; j<=props.wordLength; j++) {
            boxes.push(<div ref={(element) => { inputRefs.current[i] = inputRefs.current[i] || []; inputRefs.current[i][j] = element}}  id={`box-${i}-${j}`} className={styles.box}></div>)
        }
        guesses.push(<div id={`guess-${i}`} className={styles.guess}>{boxes}</div>)
    }
    
    return (<div className={styles.wordleContainer} id='wordle-container'>
        <div className={styles.guessContainer}>{guesses}</div>
    </div>)
}

export default Wordle