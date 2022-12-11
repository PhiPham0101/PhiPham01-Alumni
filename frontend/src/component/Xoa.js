import * as React from 'react';
import { useState, useEffect, useContext } from "react";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';

import axios from "axios";
import { useParams } from 'react-router-dom'
// import { useParams } from 'react-router-dom'
import apiList from "../lib/apiList";
import { SetPopupContext } from "../App";
import {useHistory, useLocation} from 'react-router-dom'


function Xoa(props) {
    const setPopup = useContext(SetPopupContext);
    let history = useHistory();
    const [blogs, setBlogs] = useState();

    const handleDelete = () => {
        axios
      .delete(`${apiList.blogs}/${blogs._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setPopup({
          open: true,
          severity: "success",
          message: response.data.message,
        });
       props.handleClose();
      history.push('/myblogs')

      })
      .catch((err) => {
        setPopup({
          open: true,
          severity: "error",
          message: "Bạn không có quyền xóa bài viết",
        });
        props.handleClose();
        console.log(err)
      });
    }

    const params = useParams()
    useEffect(() => {
        axios.get(`http://localhost:4444/api/blogs/${params.id}`)
          .then(res => {
            setBlogs(res.data)
  
          })
          .catch(err => {
            console.log(err)
          })
      }, [params.id])


      useEffect(()=>{

        setBlogs(props.blogs)
      },[props.blogs])

    return (
        <Dialog
            open={props.open}
            onClose={props.handleClose}
            aria-labelledby="draggable-dialog-title" 
        >
            <DialogTitle style={{ cursor: 'move', justifyContent: "center"  }} id="draggable-dialog-title">
                Bạn có chắc chắn xóa?
            </DialogTitle>
            <DialogActions style={{ justifyContent: "center" }}>
                <Button autoFocus onClick={handleDelete} style={{ color: "#33CC33" }}>
                    Xóa
                </Button>
                <Button onClick={props.handleClose} style={{ color: "#EE0000" }}>Quay lại</Button>
            </DialogActions>
        </Dialog>
    )
}

export default Xoa
