import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function ScrollDialog(props) {
  const [open, setOpen] = React.useState(true);
  const [scroll, setScroll] = React.useState('paper');

  const handleClickOpen = (scrollType) => () => {
    setOpen(true);
    setScroll(scrollType);
  };

  const handleClose = () => {
    setOpen(false);
    props.setGameRules()
  };

  const descriptionElementRef = React.useRef(null);
  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  return (
    <React.Fragment>
      <Dialog
        open={true}
        onClose={handleClose}
        scroll={'paper'}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">See Game Rules</DialogTitle>
        <DialogContent dividers={scroll === 'paper'}>
          <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
          >
            <ul>
                <li>The objective of Wordle is to guess a secret five-letter word within six attempts.</li>
                <li>Players must choose a five-letter word made up of English alphabets (A-Z) within each attempt.</li>
                <l1>After each guess, the game provides feedback by coloring each letter of the guessed word:
                    <ul>
                        <li>Green: Indicates a correct letter in the correct position.</li>
                        <li>Yellow: Indicates a correct letter but in the wrong position.</li>
                        <li>Gray: Indicates a letter that is not present in the secret word.</li>
                    </ul>
                </l1>
                <li>Players use feedback from previous guesses to refine subsequent guesses, eliminating incorrect letters and adjusting the positions of correct letters.</li>
            </ul>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Ok! Let's play now!</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}