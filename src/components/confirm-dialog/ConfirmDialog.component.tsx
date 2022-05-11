import * as React from 'react'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Button } from '@material-ui/core';

type ConfirmDialogProps = {
    title: string;
    message: string;
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
}
const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ title, message, open, onClose, onConfirm }) => <Dialog
    open={open}
    onClose={onClose}
>
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>
        <DialogContentText>
            {message}
        </DialogContentText>
    </DialogContent>
    <DialogActions>
        <Button onClick={onConfirm}>
            Submit
        </Button>
        <Button onClick={onClose} autoFocus>
            Cancel
        </Button>
    </DialogActions>
</Dialog>

export default ConfirmDialog;