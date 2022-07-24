import React from "react";
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import IconButton from '@mui/joy/IconButton';
import Typography from '@mui/joy/Typography';
import ListDivider from "@mui/joy/ListDivider";
import {PeopleRounded} from "@mui/icons-material";
import {OverridableStringUnion} from "@mui/types";
import {ColorPaletteProp} from "@mui/joy/styles/types";
import {ButtonPropsColorOverrides} from "@mui/joy/Button/ButtonProps";
import {PromptAction, PromptBox} from "./prompt";

export default class About extends React.Component<{}, {
    /* Prompts */
    shouldShowPrompt: boolean;
    promptCaption: string;
    promptText: string;
    promptSubject: string;
    promptChild: React.ReactNode,
    promptCancelButtonText: string | null;
    promptOkButtonText: string | null;
    promptOkButtonColor: OverridableStringUnion<ColorPaletteProp, ButtonPropsColorOverrides>;
    promptCancelButtonInvisible: boolean;
    promptBackgroundClickCancellable: boolean;
    promptNotDismissible: boolean;
    clickCounter: number;
}> {
    constructor(props: {}) {
        super(props);
        this.state = {
            shouldShowPrompt: false,
            promptCaption: "",
            promptText: "",
            promptSubject: "",
            promptChild: null,
            promptCancelButtonText: null,
            promptOkButtonText: null,
            promptOkButtonColor: "primary",
            promptCancelButtonInvisible: false,
            promptBackgroundClickCancellable: true,
            promptNotDismissible: false,
            clickCounter: 0
        }
    }

    handlePromptAction(subject: string, action: PromptAction) {
        this.setState({
            shouldShowPrompt: false,
        });
    }

    handleRoundedButtonClick() {
        if (this.state.clickCounter >= 2) {
            this.setState({
                clickCounter: 0,
                shouldShowPrompt: true,
                promptCaption: "啦啦啦",
                promptText: "好耶！",
            });
        }
        else {
            this.setState({
                clickCounter: this.state.clickCounter + 1
            });
        }
    }

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
                ].map((contributor, i) => (
                    <Card key={contributor.name} sx={{width: 250, ml: 1.5, mt: 1, display: 'inline-block'}}>
                            <Box sx={{ ml: 1.5 }}>
                                <IconButton variant="plain" sx={{display: 'flex'}}>
                                    <PeopleRounded onClick={
                                        i == 0
                                            ? this.handleRoundedButtonClick.bind(this)
                                            : () => {}
                                    } />
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

            {
                this.state.shouldShowPrompt
                    ? <PromptBox
                        onAction={this.handlePromptAction.bind(this)}
                        caption={this.state.promptCaption}
                        message={this.state.promptText}
                        child={this.state.promptChild}
                        subject={this.state.promptSubject}
                        cancelButtonText={this.state.promptCancelButtonText}
                        okButtonText={this.state.promptOkButtonText}
                        okButtonColor={this.state.promptOkButtonColor}
                        cancelButtonInvisible={this.state.promptCancelButtonInvisible}
                        backgroundClickCancellable={this.state.promptBackgroundClickCancellable}
                        notDismissible={this.state.promptNotDismissible}
                    />
                    : null
            }
        </div>;
    }
}
