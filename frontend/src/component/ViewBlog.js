import React from "react";
import {
  Grid,
  Button,
  Divider,
  Modal,
  Box,
  makeStyles,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";
import { useEffect, useState, useContext } from 'react'
import axios from "axios";
import { SetPopupContext } from "../App";
import apiList from "../lib/apiList";
import { useParams } from 'react-router-dom'
import DanhGiadialog from './DanhGiadialog'
import CapNhat from './CapNhat'
import Xoa from './Xoa'

import { userType } from "../lib/isAuth";

function ViewBlog(props) {

  const [blogs, setBlogs] = useState();

  const reloadAPI = () => {
    axios.get(`http://localhost:4444/api/blogs/${params.id}`)
        .then(res => {
          setBlogs(res.data)

        })
        .catch(err => {
          console.log(err)
        })
  }

  const reloadAPIDelete = () => {
    axios.get(`http://localhost:4444/api/blogs/`)
        .then(res => {
          setBlogs(res.data)

        })
        .catch(err => {
          console.log(err)
        })
  }

  const setPopup = useContext(SetPopupContext);
  const params = useParams()
  var pathapi =
    useEffect(() => {
      axios.get(`http://localhost:4444/api/blogs/${params.id}`)
        .then(res => {
          setBlogs(res.data)

        })
        .catch(err => {
          console.log(err)
        })
    }, [params.id])
  console.log(blogs)

  const [opendanhgia, setOpendanhgia] = useState(false)
  const [opencapnhat, setOpencapnhat] = useState(false)
  const [openxoa, setOpenxoa] = useState(false)

  const handleClickOpen = () => {
    setOpendanhgia(true);
  };
  const handleClickOpenCapnhat = () => {
    setOpencapnhat(true);
  };
  const handleClickOpenXoa = () => {
    setOpenxoa(true);
  };

  const handleClose = () => {
    setOpendanhgia(false);
  };
  const handleCloseCapnhat = () => {
    setOpencapnhat(false);
  };
  const handleCloseXoa = () => {
    setOpenxoa(false);
  };



  const handleConsole = () => {
    console.log('day la handle moi');
  }

  var image = '';
  var path = "http://localhost:4444/image/"
  if (blogs) {
    if (blogs.avatar !== null) {
      if (blogs.avatar.includes(path) === true) {
        image = blogs.avatar
      } else {
        image = path + blogs.avatar
      }
    }
  }


  return (
    <Box width={'90%'} display={'flex'} alignItems={'center'} justifyContent={'center'} padding={5} >
      <Box width={'80%'} height={'100%'} style={{backgroundColor: 'white'}} padding={3} borderRadius={3}>
        {/* title */}
        <Box width={'100%'} height={'50px'} display={'flex'} alignItems={'center'} justifyContent={'center'}>
          {/* do du lieu tai day */}
          <Typography variant='h5' style={{ color: "#0000FF" }}>{blogs && blogs.title}</Typography>

        </Box>
        <Divider />
        {/* content */}
        <Box widht={'100%'} display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'} l>
          {/* Image */}
          <Box width={'80%'} display={'flex'} alignItems={'center'} justifyContent={'center'} >
            {/* do du lieu tai day */}
            <img src={image} alt='anh' width={'70%'} height={'350px'} />
          </Box>
          <Box marginTop={3} width={'80%'} display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'}>
            {/* size chu */}

            <Typography variant='h5'>NỘI DUNG</Typography>
            <Typography variant='h6'>{blogs && blogs.postname}</Typography>
          </Box>
          <Box marginTop={3} width={'100%'} display={'flex'} alignItems={'center'} justifyContent={'flex-end'}>
            <Button disabled={userType() === "applicant"} onClick={handleClickOpenCapnhat} style={{ color: "#808080" }}> Cập nhật</Button>
            <Button disabled={userType() === "applicant"} onClick={handleClickOpenXoa} style={{ color: "#EE0000" }}> Xóa</Button>
            <Button onClick={handleClickOpen} style={{ color: "#33CC33" }}> Bình luận</Button>
          </Box>
          <Box marginTop={3} width={'100%'} display={'flex'} alignItems={'center'} flexDirection={'column'}>
                 <Box width={'80%'} marginTop={2} display={'flex'} flexDirection={'column'} border={'1px solid black'}>
                      <Typography >le van binh</Typography>
                      <Typography>bai viet nay hin cung hay duoc</Typography>
                </Box>
                <Box width={'80%'} marginTop={2} height={'50px'} border={'1px solid black'}>

                </Box>

          </Box>
        </Box>


      </Box>

      <DanhGiadialog
        open={opendanhgia}
        handleClose={handleClose}
      />

      <CapNhat
        open={opencapnhat}
        handleClose={handleCloseCapnhat}
        blogs={blogs}
        reloadAPI={reloadAPI}
      />

      <Xoa
        open={openxoa}
        handleClose={handleCloseXoa}
        blogs={blogs}
        reloadAPI={reloadAPIDelete}
      />

    </Box>
  )
}

export default ViewBlog
