import axios  from "axios";

const wordle_guess_endpoint = 'https://wordle-apis.vercel.app/api/validate';

export const guessWord = (word) => {
    const data = {guess:word}
    return axios.post(wordle_guess_endpoint, data)
        .then(res => {
            return res.data
        })
        .catch(err => {
            throw(err)
        })
}