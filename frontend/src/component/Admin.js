import React from "react";
import { useState, useEffect, useContext } from "react";
import {
  Typography,
  Box,
  Button
} from "@material-ui/core";

import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import apiList from "../lib/apiList";
import axios from "axios";

const Admin = (props) => {
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));
  const [isBlock, setIsBlock] = useState()
  const handelBolck = async (idUser) => {
    try {
      const result = await axios.post(apiList.blockUser, { idUser })
      const newList = list.map((item)=>{
        return item.userId === idUser ? {...item, status: !item.status} : {...item} 
      })
      setList(newList)
      setIsBlock(result.data)
    } catch (error) {
      console.log(error)
    }
  }

  function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
  }

  const [list, setList] = useState([]);
  useEffect(() => {
    axios
      .get(apiList.RecruiterInfo, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        for (var item of response.data) {
          console.log(item.userId);
        }
        setList(response.data);
      })
      .catch((err) => {
        console.log(err);
      });

  }, [])

  const rows = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
  ];



  return (
    <Box width={'100%'} height={'100%'} border={'1px solid black'} display={'flex'} flexDirection={'column'}
      justifyContent={'center'} alignItems={'center'}
    >

      <Typography variant="h5">Danh sách cựu sinh viên</Typography>
      <Box width={'70%'} height={'100%'}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Họ và Tên</StyledTableCell>
                <StyledTableCell align="right">Khóa</StyledTableCell>
                <StyledTableCell align="right">số điện thoại</StyledTableCell>
                <StyledTableCell align="right">quyền</StyledTableCell>
                <StyledTableCell align="right">trạng thái</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {list.length !== 0 ?
                list.map((row, index) => (
                  <StyledTableRow key={index}>
                    <StyledTableCell component="th" scope="row">
                      {row.name}
                    </StyledTableCell>
                    <StyledTableCell align="right">{row.course}</StyledTableCell>
                    <StyledTableCell align="right">{row.contactNumber}</StyledTableCell>
                    <StyledTableCell align="right">{row.is_admin == true ? "admin" : "alumni"}</StyledTableCell>
                    <StyledTableCell align="right">
                      <Button style={{ backgroundColor: "#f97474", marginRight: "5px" }} variant="contained"
                        onClick={() => handelBolck(row.userId)}
                      >{row.status == true ? 'Khóa' : 'Mở'}</Button>
                    </StyledTableCell>
                  </StyledTableRow>
                )) : <div></div>}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default Admin;
