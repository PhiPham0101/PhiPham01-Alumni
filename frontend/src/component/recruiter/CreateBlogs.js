import React from "react";
import { useContext, useEffect, useState } from "react";
import {
  Button,
  Grid,
  Typography,
  Modal,
  Paper,
  makeStyles,
  TextField,
  MenuItem,
  Box,
} from "@material-ui/core";
import axios from "axios";
import { SetPopupContext } from "../../App";
import apiList from "../../lib/apiList";

const useStyles = makeStyles((theme) => ({
  body: {
    height: "inherit",
  },
  popupDialog: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    // padding: "30px",
  },
}));

const CreateBlogs = (props) => {
  const classes = useStyles();
  const setPopup = useContext(SetPopupContext);
  const [image, setImage] = useState();
  const [blogDetails, setBlogDetails] = useState({
    title: "",
    postname: "",
    avatar: null,
  });

  const handleInput = (key, value) => {
    setBlogDetails({
      ...blogDetails,
      [key]: value,
    });
  };

  const [inputErrorHandler, setInputErrorHandler] = useState({
    title: {
      untouched: true,
      required: true,
      error: false,
      message: "",
    },
    postname: {
      untouched: true,
      required: true,
      error: false,
      message: "",
    },
    avatar: {
      untouched: true,
      error: false,
      message: "",
    },
  });

  const handleInputError = (key, status, message) => {
    setInputErrorHandler({
      ...inputErrorHandler,
      [key]: {
        required: true,
        untouched: false,
        error: status,
        message: message,
      },
    });
  };

  const getfile = (event) => {
    const file = event.target.files[0];
    setBlogDetails({...blogDetails, avatar: file.name});
    file.preview = URL.createObjectURL(file);
    setImage(file);
  }

  const upImage = () => {
    const anh = new FormData();
    anh.append("fileImage",image);
    axios
    .post(apiList.uploadProfileImage, anh, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        'content-type':'multipart/form-data',
      },
    })
    .then((response) => {
      console.log(response)
    })
    .catch(err => {
      console.log(err)
    }) 
  };

  const handleUpdate = () => {
    upImage();
    console.log(blogDetails);

    axios
      .post(apiList.blogs, blogDetails, {
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
        setBlogDetails({
          title: "",
          postname: "",
          avatar: null,
        });
      })
      .catch((err) => {
        setPopup({
          open: true,
          severity: "error",
          message: 'Lỗi',
        });
        console.log(err.response);
      });
  };

  React.useEffect(() => {
    return () => {
      image && URL.revokeObjectURL(image.preview);
    }
  },[image])

  return (
    <>
      <Grid
        container
        item
        direction="column"
        alignItems="center"
        style={{ padding: "30px", minHeight: "93vh", width: "" }}
      >
        <Grid item>
          <Typography variant="h3">Thêm bài viết chia sẻ kinh nghiệm</Typography>
        </Grid>
        <Grid item container xs direction="column" justify="center">
          <Grid item>
            <Paper
              style={{
                padding: "20px",
                outline: "none",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Grid
                container
                direction="column"
                alignItems="stretch"
                spacing={3}
              >
                <Grid item>
                  <TextField
                    label="Tiêu đề"
                    value={blogDetails.title}
                    onChange={(event) =>
                      handleInput("title", event.target.value)
                    }
                    error={inputErrorHandler.title.error}
                    helperText={inputErrorHandler.title.message}
                    onBlur={(event) => {
                      if (event.target.value === "") {
                        handleInputError("title", true, "Vui lòng nhập tiêu đề!");
                      } else {
                        handleInputError("title", false, "");
                      }
                    }}
                    variant="outlined"
                    fullWidth
                  />
                </Grid>
                <Grid item>
                  <TextField
                    label="Nội dung"
                    multiline
                    rows={8}
                    style={{ width: "100%" }}
                    variant="outlined"
                    value={blogDetails.postname}
                    onChange={(event) => {
                      if (
                        event.target.value.split(" ").filter(function (n) {
                          return n != "";
                        }).length <= 250
                      ) {
                        handleInput("postname", event.target.value);
                      }
                    }}
                  />
                </Grid>
                <Grid>
                  <Box width={'100%'}   display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'}>
                      <img src={image && image.preview} alt='' width={500} height={500} style={{objectFit:'contain',marginBottom:10}} />
                  <Button variant="contained" component="label" sx={{marginTop:2}}>
                      Chọn ảnh
                  <input hidden accept="image/*" onChange={getfile} type="file"/>
                  </Button>
                  </Box>
                 
                </Grid>
              </Grid>
              <Button
                variant="contained"
                color="primary"
                style={{ padding: "10px 50px", marginTop: "30px" }}
                onClick={() => handleUpdate()}
              >
                Tạo bài viết
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default CreateBlogs;
