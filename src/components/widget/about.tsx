import React from "react";
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import IconButton from '@mui/joy/IconButton';
import Typography from '@mui/joy/Typography';
import ListDivider from "@mui/joy/ListDivider";
import {PeopleRounded} from "@mui/icons-material";

export default class About extends React.Component {
    render() {
        return <div style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-30%, -50%)',
            width: '600px',
        }}>
            <div style={{ textAlign: 'center' }}>
                <Typography level="h3">
                    Group 9 Members
                </Typography>
            </div>

            <ListDivider sx={{ m: 2 }}/>

            {
                [
                    {
                        name: 'Zhen Guan',
                        email: 'zguan@mun.ca',
                        role: 'Developer',
                        studentNumber: 202191382
                    },
                    {
                        name: 'Jiabao Guo',
                        email: 'jiabaog@mun.ca',
                        role: 'Developer',
                        studentNumber: 202096888
                    },
                    {
                        name: 'Xin Guan',
                        email: 'xguan@mun.ca',
                        role: 'Developer',
                        studentNumber: 202195156
                    },
                    {
                        name: 'Peixi Zhao',
                        email: 'peixiz@mun.ca',
                        role: 'Developer',
                        studentNumber: 201991333
                    },
                ].map(contributor => (
                    <Card key={contributor.name} sx={{width: 250, ml: 1.5, mt: 1, display: 'inline-block'}}>
                            <Box sx={{ ml: 1.5 }}>
                                <IconButton variant="plain" sx={{display: 'flex'}}>
                                    <PeopleRounded />
                                </IconButton>
                                <Typography level="h3">
                                    {contributor.name}
                                </Typography>

                                <Typography sx={{fontSize: 24}} level="body3">
                                    {contributor.role}
                                </Typography>

                                <Typography sx={{fontSize: 20}} level="body3">
                                    {contributor.email}<br/>
                                    Student#: {contributor.studentNumber}
                                </Typography>
                            </Box>

                        <Button variant="plain">Learn More</Button>
                    </Card>
                ))
            }
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <Typography level="h6">
                    Project written in React.js & SpringBoot
                </Typography>
            </div>

        </div>;
    }
}
