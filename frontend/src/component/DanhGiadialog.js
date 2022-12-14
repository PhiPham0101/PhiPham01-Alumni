import * as React from 'react';
import Button from '@mui/material/Button';
import { useState, useEffect, useContext } from "react";
import {
  Grid,
  Box,
  TextField,
} from "@material-ui/core";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { DialogContentText } from '@mui/material';
import axios from 'axios';

// import { SetPopupContext } from "../../App";


import { useParams } from 'react-router-dom'
import apiList from "../lib/apiList";
// import { SetPopupContext } from "../App";


function DanhGiadialog(props) {
  // const [content, setcontent] = useState();
  // const setPopup = useContext(SetPopupContext);

  //const [binhluans, setBinhluans] = useState();
  const [binhluansDetails, setBinhluansDetails] = useState({
    idblog: props.idblog,
    iduser: props.iduser,
    commentcontent: "",
    dateOfPosting : new Date()
  });

  const handleInput = (key, value) => {
    setBinhluansDetails({
      ...binhluansDetails,
      [key]: value,
    });
  };
  // console.log(binhluansDetails);

// console.log(props.idblog)

  const params = useParams()
  const handleDanhgia = () => {
    const iduser = localStorage.getItem("iduser")
     const binhluan = {
      userId : iduser,
       blogId: props.idblog,
       commentcontent: binhluansDetails.commentcontent,
     };
  
     console.log(binhluan)

    axios
      .post(apiList.binhluans, binhluan, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setBinhluansDetails({
          // ...binhluans
          commentcontent: "",
        
        });
        props.reloadAPI()
        console.log(res.data)
        props.handleClose()

      })
      .catch((err) => {
        console.log(err)
      });
    
    // axios
    //   .get("http://localhost:4444/api/binhluans/",{binhluan})
    //   .then((res) => {
    //     console.log(res.data)
    //   })
    //   .catch((err) => {
    //     console.log(err)
    //   });
    // const danhgia = {
    //   userId: 1,
    //   blogId: 2,
    //   commentcontent: content
    // }


    // axios.get("http://localhost:4444/api/nhanxet",{danhgia})
    // .then(res=>console.log(res.data))
    // .catch(err=>console.log(err))
  }

  // const params = useParams()
  // useEffect(() => {
  //     axios.get(`http://localhost:4444/api/binhluans/${params.id}`)
  //       .then(res => {
  //         setBinhluans(res.data)

  //       })
  //       .catch(err => {
  //         console.log(err)
  //       })
  //   }, [params.id])


  //   useEffect(()=>{

  //     setBinhluans(props.binhluans)
  //   },[props.binhluans])


  return (
    <Dialog
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="draggable-dialog-title"
      maxWidth={1000}
    >
      <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
        B??nh lu???n
      </DialogTitle>
      <DialogContent sx={{ width: 600 }}>
        <DialogContentText style={{ margin: "5px" }}>
          <TextField multiline
            row={3}
            label={'Nh???p b??nh lu???n'}
            value={binhluansDetails && binhluansDetails.commentcontent}
            variant="outlined"
            fullWidth
            onChange={(e)=>{
              setBinhluansDetails({...binhluansDetails, commentcontent : e.target.value})
            }}
          />

        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleDanhgia} style={{ color: "#33CC33" }}>
          G???i
        </Button>
        <Button onClick={props.handleClose} style={{ color: "#EE0000" }}>Quay l???i</Button>
      </DialogActions>
    </Dialog>
  )
}

export default DanhGiadialog
