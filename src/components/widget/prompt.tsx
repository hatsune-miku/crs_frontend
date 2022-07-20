import React from "react";
import Card from "@mui/joy/Card";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import ListDivider from "@mui/joy/ListDivider";
import Button from "@mui/joy/Button";
import {Stack} from "@mui/material";
import {OverridableStringUnion} from "@mui/types";
import {ColorPaletteProp} from "@mui/joy/styles/types";
import {ButtonPropsColorOverrides} from "@mui/joy/Button/ButtonProps";

type PromptAction = 'cancel' | 'ok';

type PromptBoxProps = {
    onAction: (subject: string, action: PromptAction) => void;
    caption: string;
    message: string;
    subject: string;
    child?: React.ReactNode | null;
    cancelButtonText?: string | null;
    okButtonText?: string | null;
    okButtonColor?: OverridableStringUnion<ColorPaletteProp, ButtonPropsColorOverrides>;
    cancelButtonInvisible?: boolean;
    backgroundClickCancellable?: boolean;
    notDismissible?: boolean;
}

type PromptBoxStates = {}

class PromptBox extends React.Component<PromptBoxProps, PromptBoxStates> {
    constructor(props: PromptBoxProps) {
        super(props);
        this.state = {};
    }

    render(): React.ReactNode {
        return <div>
            <div style={{
                position: 'fixed',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                width: '400px',
                zIndex: 1508,
            }}>
                <Card variant="outlined">
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 0.5,
                        padding: '10px',
                    }}>
                        <Typography level="h2" sx={{fontSize: '20px'}}>
                            {this.props.caption}
                        </Typography>

                        <Typography level="body1" sx={{fontSize: '18px'}}>
                            {this.props.message}
                        </Typography>

                        <Box sx={{display: 'flex'}}>
                            {this.props.child}
                        </Box>

                        {
                            this.props.notDismissible === true
                                ? null
                                : (
                                    <div>
                                        <ListDivider sx={{m: 2}}/>

                                        <Stack direction="row-reverse" gap={1}>
                                            <Button
                                                size="md" color={this.props.okButtonColor}
                                                fullWidth={true}
                                                style={{width: '100px'}}
                                                onClick={() => this.props.onAction(this.props.subject, 'ok')}
                                            >
                                                {this.props.okButtonText || 'OK'}
                                            </Button>

                                            {
                                                this.props.cancelButtonInvisible === true
                                                    ? null
                                                    : <Button
                                                        variant="solid" size="md" color="neutral"
                                                        style={{width: '100px'}}
                                                        onClick={() => this.props.onAction(this.props.subject, 'cancel')}
                                                    >
                                                        {this.props.cancelButtonText || 'Cancel'}
                                                    </Button>
                                            }
                                        </Stack>
                                    </div>
                                )
                        }

                    </Box>
                </Card>
            </div>
            <div
                id="background"
                style={{
                    position: "fixed",
                    left: 0,
                    top: 0,
                    width: "100vw",
                    height: "100vh",
                    background: "rgba(0, 0, 0, 0.85)",
                    zIndex: 1505
                }}
                onMouseDown={
                    () => {
                        if (!this.props.notDismissible && this.props.backgroundClickCancellable === true) {
                            this.props.onAction(this.props.subject, 'cancel');
                        }
                    }
                }
            ></div>
        </div>;
    }
}

export {PromptBox};
export type {PromptAction};

