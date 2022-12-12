import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';    
import axios from 'axios';
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });
function ConfirmDelete(props) {

    console.log(props.id)

    const handleDelete= () => {
        axios.delete(`http://localhost:4444/api/deletebinhluan/${props.id}`).then(res=>{
            console.log(res.data);
            props.reloadAPI()
        }).catch(err=>{
            console.log(err)
        })
    }
  return (
    <Dialog
        open={props.open}
        TransitionComponent={Transition}
        keepMounted
        onClose={props.handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Xác nhận xóa bình luận"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
               Bạn có chắc muốn xóa bình luận ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDelete}>Xác nhận</Button>
          <Button onClick={props.handleClose}>Quay lại</Button>
        </DialogActions>
      </Dialog>
  )
}

export default ConfirmDelete
