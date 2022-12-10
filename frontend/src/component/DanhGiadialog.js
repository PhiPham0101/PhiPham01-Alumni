import * as React from 'react';
import Button from '@mui/material/Button';
import { useState, useEffect, useContext } from "react";
import {
  Grid,
  Box,
  TextField,
} from "@material-ui/core";
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import { DialogContentText } from '@mui/material';
import axios from 'axios';
function DanhGiadialog(props) {
  const [content, setcontent] = useState(


  );



  const handleDanhgia= () => {

    // const danhgia = {
    //   userId: 1,
    //   blogId: 2,
    //   commentcontent: content
    // }


    // axios.get("http://localhost:4444/api/nhanxet",{danhgia})
    // .then(res=>console.log(res.data))
    // .catch(err=>console.log(err))
  }


  return (
    <Dialog
        open={props.open}
        onClose={props.handleClose}
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
          Bình luận
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
              <TextField multiline row={3} label={'Nhập bình luận'}/>




          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleDanhgia} style={{color: "#33CC33"}}>
            Gửi
          </Button>
          <Button onClick={props.handleClose} style={{color: "#EE0000"}}>Quay lại</Button>
        </DialogActions>
      </Dialog>
  )
}

export default DanhGiadialog
