import { Box, Button, Typography } from '@mui/material'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import ConfirmDelete from './ConfirmDelete';

function BinhLuan(props) {

    function getFormattedDatedmy(date) {
        var year = date.getFullYear();

        var month = (1 + date.getMonth()).toString();
        month = month.length > 1 ? month : '0' + month;

        var day = date.getDate().toString();
        day = day.length > 1 ? day : '0' + day;

        return day + '-' + month + '-' + year;
    }

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

   
    const [user, setUser] = useState()
    const getuser = () => {
        axios.get(`http://localhost:4444/api/userpublic/${props.iduser}`)
            .then(res => {
                setUser(res.data)
            }).catch(err => {
                console.log(err)
            })
    }
    useEffect(() => {
        getuser()
    }, [])

    return (
        <Box width={'80%'} marginTop={2} boxShadow={'rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;'}
            display={'flex'} flexDirection={'column'} padding={3} borderRadius={2}
        >
            <Typography variant='h6' color={'Highlight'}>
                Người bình luận : {user && user.name}
            </Typography>
            <Typography variant='h6' color={'GrayText'}>
                Bình luận :  {props.comment}
            </Typography>
            <Typography>
                Ngày bình luận :  {getFormattedDatedmy(new Date(props.date))}
            </Typography>
            <Box width={'100%'} height={'50px'} display={'flex'} alignItems={'center'} justifyContent={'flex-end'}>
                <Button variant='outlined' color={'error'} size={'small'} sx={{ marginRight: 3 }}
                    onClick={handleClickOpen}
                >Xóa bình luận</Button>
            </Box>
            <ConfirmDelete
                open={open}
                handleClose={handleClose}
                id={props.id}
                reloadAPI={props.reloadAPI}
            />

        </Box>
    )
}

export default BinhLuan
