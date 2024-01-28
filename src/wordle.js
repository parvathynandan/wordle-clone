import { Fragment, useEffect, useRef, useState } from "react"
import { guessWord } from "./api/wordle"
import styles from './worldle.module.css'
import Snackbar from '@mui/material/Snackbar';
import ScrollDialog from "./GameRuleDialog";

const snackbarInitialState = {
    open: false,
    message: '',
    bgcolor: 'black'
}

const fillColorCode = {
    0: '#7077A1', // Grey: Letter Does not Exist
    1: '#E7B10A', // Yellow: Letter exists, but position wrong
    2: '#9DBC98' // Green: Letter exists and in correct position
}

const bgColorCode = {
    errorColor: '#D04848',
    sucessColor: '#96E9C6'
}

const Wordle = (props) => {
    const inputRefs = useRef([]);
    const [currentWord, setCurrentWord] = useState(1)
    const [currentLetter, setCurrentLetter] = useState(1)
    const [snackbarState, setSnackbarState] = useState(snackbarInitialState)
    const [wordsAndStatus, setWordsAndStatus] = useState([])
    const [error, setError] = useState(false)
    const [wordFound, setWordFound] = useState(false)
    const [play, setPlay] = useState(false)
    const [seeGameRules, setSeeGameRules] = useState(false)

    const handleKeyPress = (event) => {
        if(play && !seeGameRules){
        let keyPressed = event?.key
        if(currentLetter<=props.wordLength && event?.keyCode >= 65 && event.keyCode <= 90 || event.keyCode >= 97 && event?.keyCode <= 122) {
            if (inputRefs?.current[currentWord][currentLetter] && !inputRefs?.current[currentWord][currentLetter].innerHTML) {
                inputRefs.current[currentWord][currentLetter].innerHTML = keyPressed.toUpperCase();
            }
            setCurrentLetter(prevState=>prevState+1)
            
        }else if(keyPressed === "Enter") {
            if(currentLetter==props.wordLength+1) {
                let word = findTheWord(currentWord);
                guessWord(word)
                    .then(response => {
                        console.log(response);
                        if (response && !response.is_valid_word) {
                            toast('Not a valid word!!', bgColorCode.errorColor)
                            setError(true)
                            
                        }else if(response && response.score) {
                            setWordsAndStatus([...wordsAndStatus, {word: word, status: response.score}])
                            setColors(currentWord, response.score)
                            if(response.score.reduce((sum,i)=>sum+i) == props.wordLength*2) {
                                toast('Found out the correct word!!', bgColorCode.sucessColor)
                                setWordFound(true)
                            }else {
                                setCurrentWord(prev=> prev+1)
                                setCurrentLetter(1)
                            }
                        }
                    })
                    .catch(error => {
                        console.error(error); // Handle the error here
                    });
            }else {
                toast('Not Enough Letters!!', bgColorCode.errorColor);
                setError(true)
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
    }
    const toast = (msg, bgcolor) => {
        setSnackbarState({open: true, message: msg, bgcolor: bgcolor});
        setTimeout(() => {
            setSnackbarState({...snackbarState, open: false, message: ''});
        }, 3000)
    }
    const findTheWord = (currentWord) => {
        let word = ''
        for (let i=1; i<=props.wordLength; i++) {
            if(inputRefs?.current[currentWord][i]?.innerHTML) {
                word = word + inputRefs?.current[currentWord][i]?.innerHTML
            }
        }
        console.log(word)
        return word
    }

    const setColors = (currentWord, score) => {
        for(let i=1;i<=props.wordLength;i++) {
            inputRefs.current[currentWord][i].style.backgroundColor = fillColorCode[score[i-1]];
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
    
    const handleClose = () => {
        setSeeGameRules(false)
    }

    return (<div className={styles.wordleContainer} id='wordle-container'>
        <p className={styles.gameTitle}><span>W</span>ordle</p>
            <button onClick={() => setSeeGameRules(true)}>See Game Rules</button>
            {seeGameRules && <ScrollDialog setGameRules={handleClose} />}
           {play && <Fragment>
            <p className={`${styles.congratsText} ${wordFound ? '' : styles.hidden}`}>Congratulations! You found out the word in your trial - {currentWord}</p>
            <Snackbar ContentProps={{sx: {background: snackbarState.bgcolor, color: '#0b2027'}
    }} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={snackbarState.open} message={snackbarState.message}  />
            <div onAnimationEnd={()=>setError(false)} className={`${styles.guessContainer} ${error ? styles.shakeAnimation : ''}`}>{guesses}</div>
            </Fragment>}
            {!play && 
            <div className={styles.initialLoad}>
                <div className={styles.letsPlayText}>Let's play?</div>
                <div className={styles.buttonContainer}>
                    <button onClick={()=>setPlay(true)} className={styles.playGameButton}>Yes!!</button>
                    <button onClick={()=>setPlay(true)} className={styles.playGameButton}>Always Yes!!</button>
                </div>
            </div>}
       </div>)
}

export default Wordle