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
} from "@material-ui/core";
import axios from "axios";
import ChipInput from "material-ui-chip-input";

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

const CreateJobs = (props) => {
  const classes = useStyles();
  const setPopup = useContext(SetPopupContext);

  const [jobDetails, setJobDetails] = useState({
    title: "",
    postname: "",
    companyname: "",
    linkwebsite: "",
    deadline: new Date(new Date().getTime() + 10 * 24 * 60 * 60 * 1000)
      .toISOString()
      .substr(0, 16),
    skillsets: [],
    jobType: "Full Time",
    salary: 1000,
    maxApplicants: 1000,
    maxPositions: 0,
    info: "",
  });

  const handleInput = (key, value) => {
    setJobDetails({
      ...jobDetails,
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
    companyname: {
      untouched: true,
      required: true,
      error: false,
      message: "",
    },
    linkwebsite: {
      untouched: true,
      required: true,
      error: false,
      message: "",
    },
    postname: {
      untouched: true,
      error: false,
      message: "",
    },
    deadline: {
      untouched: true,
      required: true,
      error: false,
      message: "",
    },
    skillsets: {
      untouched: true,
      required: true,
      error: false,
      message: "",
    },
    jobType: {
      untouched: true,
      required: true,
      error: false,
      message: "",
    },
    salary: {
      untouched: true,
      required: true,
      error: false,
      message: "",
    },
    info: {
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

  const handleUpdate = () => {
    console.log(jobDetails);
    axios
      .post(apiList.jobs, jobDetails, {
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
        setJobDetails({
          title: "",
          postname: "",
          companyname: "",
          linkwebsite: "",
          deadline: new Date(new Date().getTime() + 10 * 24 * 60 * 60 * 1000)
            .toISOString()
            .substr(0, 16),
          skillsets: [],
          jobType: "Full Time",
          salary: 1000,
          maxApplicants: 1000,
          maxPositions: 0,
          info: "",
        });
      })
      .catch((err) => {
        setPopup({
          open: true,
          severity: "error",
          message: err.response.data.message,
        });
        console.log(err.response);
      });
  };

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
          <Typography variant="h3">Thêm bài đăng</Typography>
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
                    value={jobDetails.title}
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
                    label="Tên công ty"
                    value={jobDetails.companyname}
                    onChange={(event) =>
                      handleInput("companyname", event.target.value)
                    }
                    error={inputErrorHandler.companyname.error}
                    helperText={inputErrorHandler.companyname.message}
                    onBlur={(event) => {
                      if (event.target.value === "") {
                        handleInputError("companyname", true, "Vui lòng nhập tên công ty!");
                      } else {
                        handleInputError("companyname", false, "");
                      }
                    }}
                    variant="outlined"
                    fullWidth
                  />
                </Grid>
                <Grid item>
                  <TextField
                    label="Link liên kết tuyển dụng"
                    value={jobDetails.linkwebsite}
                    onChange={(event) =>
                      handleInput("linkwebsite", event.target.value)
                    }
                    error={inputErrorHandler.linkwebsite.error}
                    helperText={inputErrorHandler.linkwebsite.message}
                    onBlur={(event) => {
                      if (event.target.value === "") {
                        handleInputError("linkwebsite", true, "Vui lòng dán link liên kết tuyển dụng!");
                      } else {
                        handleInputError("linkwebsite", false, "");
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
                    value={jobDetails.postname}
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
                <Grid item>
                  <ChipInput
                    className={classes.inputBox}
                    label="Kỹ năng"
                    variant="outlined"
                    helperText="Nhấn Enter để thêm kỹ năng"
                    value={jobDetails.skillsets}
                    onAdd={(chip) =>
                      setJobDetails({
                        ...jobDetails,
                        skillsets: [...jobDetails.skillsets, chip],
                      })
                    }
                    onDelete={(chip, index) => {
                      let skillsets = jobDetails.skillsets;
                      skillsets.splice(index, 1);
                      setJobDetails({
                        ...jobDetails,
                        skillsets: skillsets,
                      });
                    }}
                    fullWidth
                  />
                </Grid>
                <Grid item>
                  <TextField
                    select
                    label="Loại công việc"
                    variant="outlined"
                    value={jobDetails.jobType}
                    onChange={(event) => {
                      handleInput("jobType", event.target.value);
                    }}
                    fullWidth
                  >
                    <MenuItem value="Full Time">Full Time</MenuItem>
                    <MenuItem value="Part Time">Part Time</MenuItem>
                    <MenuItem value="Work From Home">Work From Home</MenuItem>
                    <MenuItem value="Freelance">Freelance</MenuItem>
                  </TextField>
                </Grid>
                <Grid item>
                  <TextField
                    label="Lương"
                    type="number"
                    variant="outlined"
                    value={jobDetails.salary}
                    onChange={(event) => {
                      handleInput("salary", event.target.value);
                    }}
                    InputProps={{ inputProps: { min: 0 } }}
                    fullWidth
                  />
                </Grid>
                <Grid item>
                  <TextField
                    label="Thời hạn đăng ký"
                    type="datetime-local"
                    value={jobDetails.deadline}
                    onChange={(event) => {
                      handleInput("deadline", event.target.value);
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    variant="outlined"
                    fullWidth
                  />
                </Grid>
                {/* <Grid item>
                  <TextField
                    label="Số lượng tối đa vị trí ứng tuyển"
                    type="number"
                    variant="outlined"
                    value={jobDetails.maxApplicants}
                    onChange={(event) => {
                      handleInput("maxApplicants", event.target.value);
                    }}
                    InputProps={{ inputProps: { min: 1 } }}
                    fullWidth
                  />
                </Grid> */}
                <Grid item>
                  <TextField
                    label="Số lượng cần tuyển"
                    type="number"
                    variant="outlined"
                    value={jobDetails.maxPositions}
                    onChange={(event) => {
                      handleInput("maxPositions", event.target.value);
                    }}
                    InputProps={{ inputProps: { min: 1 } }}
                    fullWidth
                  />
                </Grid>
                <Grid item>
                  <TextField
                    label="Thông tin liên hệ"
                    value={jobDetails.info}
                    onChange={(event) =>
                      handleInput("info", event.target.value)
                    }
                    variant="outlined"
                    fullWidth
                  />
                </Grid>
              </Grid>
              <Button
                variant="contained"
                color="primary"
                style={{ padding: "10px 50px", marginTop: "30px" }}
                onClick={() => handleUpdate()}
              >
                Tạo bài đăng
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default CreateJobs;
