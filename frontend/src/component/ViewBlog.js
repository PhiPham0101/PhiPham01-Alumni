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
import BinhLuan from "./BinhLuan";

function ViewBlog(props) {

  console.log('props:', props)

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


  const [binhluans, setBinhluans] = useState();
  const [listbinhluan,setListbinhluan] = useState()
  const handleInput = (key, value) => {
    setBinhluans({
      ...binhluans,
      [key]: value,
    });
  };


  const getbinhluan = () => {
    axios.get(`http://localhost:4444/api/getbinhluan/${params.id}`)
    .then(res=>{
      setListbinhluan(res.data)
    }).catch(err=>{
      console.log(err)
    })
  }



    useEffect(() => {
      axios.get(`http://localhost:4444/api/binhluans/${params.id}`)
        .then(res => {
          setBinhluans(res.data)
        })
        .catch(err => {
          console.log(err)
        })
        getbinhluan()
    }, [params.id])

console.log(listbinhluan)

  return (
    <Box width={'90%'} display={'flex'} alignItems={'center'} justifyContent={'center'} padding={5} >
      <Box width={'80%'} height={'100%'} style={{ backgroundColor: 'white' }} padding={3} borderRadius={3}>
        {/* title */}
        <Box width={'100%'} height={'50px'} display={'flex'} alignItems={'center'} justifyContent={'center'}>
          {/* do du lieu tai day */}
          <Typography variant='h3' style={{ color: "#0000FF" }}>{blogs && blogs.title}</Typography>

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

            <Typography variant='h5'><h3>NỘI DUNG</h3></Typography>
            <Typography variant='h7'>{blogs && blogs.postname}</Typography>
          </Box>
          <Box marginTop={3} width={'100%'} display={'flex'} alignItems={'center'} justifyContent={'flex-end'}>
            <Button disabled={userType() === "applicant"} onClick={handleClickOpenCapnhat} style={{ color: "#808080" }}> Cập nhật</Button>
            <Button disabled={userType() === "applicant"} onClick={handleClickOpenXoa} style={{ color: "#EE0000" }}> Xóa</Button>
            <Button onClick={handleClickOpen} style={{ color: "#33CC33" }}> Bình luận</Button>
          </Box>
          <Box marginTop={3} width={'100%'} display={'flex'} alignItems={'center'} flexDirection={'column'}>
            <Box style={{ color: "#444444	" }} alignItems={'left'}><h2>Bình luận</h2></Box>
            <Box width={'80%'} marginTop={2} display={'flex'} flexDirection={'column'} />
            <Box width={'80%'} marginTop={2} display={'flex'} flexDirection={'column'} >
               
               {listbinhluan && listbinhluan.map((ele,index)=>{
                  return(

                    <BinhLuan
                      iduser = {ele.userId}
                      comment = {ele.commentcontent}
                      date = {ele.dateOfPosting}
                      id={ele._id}
                      reloadAPI= {getbinhluan}
                    />
                   
                  )
               })}
              
   
            
            </Box>
            {/* >  */}
          </Box>
        </Box>


      </Box>

      <DanhGiadialog
      open={opendanhgia}
      handleClose={handleClose}
      idblog= {blogs && blogs._id}
      iduser = {blogs && blogs.userId}
      // valueSubmit = {idblog}
      reloadAPI= {getbinhluan}
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
