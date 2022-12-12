import * as React from 'react';
import { useState, useEffect, useContext } from "react";
import Button from '@mui/material/Button';
import {
    Grid,
    TextField,
} from "@material-ui/core";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { DialogContentText } from '@mui/material';

import axios from "axios";
import { useParams } from 'react-router-dom'
import apiList from "../lib/apiList";
import { SetPopupContext } from "../App";

function CapNhat(props) {
    // const [openUpdate, setOpenUpdate] = useState(false);
    const setPopup = useContext(SetPopupContext);

    const [blogs, setBlogs] = useState();
    const handleInput = (key, value) => {
        setBlogs({
            ...blogs,
            [key]: value,
        });
    };
    // const handleCloseUpdate = () => {
    //     setOpenUpdate(false);
    //   };

    const handleUpdate = () => {
        axios
      .put(`${apiList.blogs}/${blogs._id}`, blogs, {
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
       props.reloadAPI();
      })
      .catch((err) => {
        setPopup({
          open: true,
          severity: "error",
          message: "Bạn không có quyền cập nhật bài viết",
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
                 maxWidth={700}
            
        >
            <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                Cập nhật bài đăng
            </DialogTitle>
            <DialogContent sx={{width:500}}>
                <DialogContentText>
                    <Grid
                        container
                        direction="column"
                        style={{ margin: "5px" }}
                    >
                        <Grid item>
                            <TextField
                                label="Tiêu đề"
                                type="title-local"
                                value={blogs && blogs.title}
                                onChange={(event) => {
                                    handleInput("title", event.target.value);
                                }}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                variant="outlined"
                                fullWidth
                            />
                        </Grid>
                        <Grid item >
                            <TextField
                                label="Nội dung"
                                type="postname-local"
                                multiline
                                rows={8}
                                style={{ width: "100%" ,marginTop: 10}}
                                variant="outlined"
                            
                                value={blogs && blogs.postname}
                                onChange={(event) => {
                                    if (
                                        event.target.value.split(" ").filter(function (n) {
                                            return n != "";
                                        }).length <= 1000
                                    ) {
                                        handleInput("postname", event.target.value);
                                    }
                                }}
                                InputProps={{ inputProps: { min: 3 } }}
                                fullWidth
                            />
                        </Grid>
                    </Grid>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={handleUpdate} style={{ color: "#33CC33" }}>
                    Cập nhật
                </Button>
                <Button onClick={props.handleClose} style={{ color: "#EE0000" }}>Quay lại</Button>
            </DialogActions>
        </Dialog>
    )
}

export default CapNhat
