import React from 'react';
import { Button, Link, Typography } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function HelpDialog(props) {

  return (
    <div>
      <Dialog
        open={props.show}
        onClose={props.toggle}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">{"All Your Stuff In One Place"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Created by Mikel Matticoli 
            <br />
            <br />
            <h4>Questions/Issues? Email <Link href="mailto:mikel@wpi.edu">mikel@wpi.edu</Link></h4>
            <br/>                     
            <br/>                     
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.toggle} color="primary" autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}