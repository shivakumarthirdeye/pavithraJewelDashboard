import { createTheme } from "@mui/material/styles"


export const custom = {
    width: 'fit-content',
    height: '40px',
    padding: '11px 20px',
    borderRadius: '8px',
    color: '#E87819',
    fontSize: '14px',
    textTransform: 'capitalize',
    fontWeight: '600',
    lineHeight: '20px',
    fontFamily: 'Public Sans',
    border: '1px solid #E87819',
    background: 'transparent',
    "&:hover": {
        background: '#E87819',
        color: '#fff'
    }
}

export const save = {
    height: '40px',
    width: '100%',
    padding: '11px 10px',
    borderRadius: '8px',
    color: '#fff',
    textTransform: 'none',
    fontSize: '14px',
    fontWeight: '600',
    lineHeight: '24px', /* 18.2px */
    overflow: 'hidden',
    fontFamily: 'Public Sans',
    background: '#E87819',
    // boxShadow: '0px 1px 1px 0px #fff',
    boxShadow: '0px 8px 16px 0px #8F95B226',
    "&:hover": {
        background: '#E87819'
    }
}
export const saveData = {
    height: '40px',
    width: 'fit-content',
    padding: '11px 20px',
    borderRadius: '5px',
    color: '#fff',
    textTransform: 'none',
    fontSize: '14px',
    fontWeight: '500',
    lineHeight: '20px', /* 18.2px */
    overflow: 'hidden',
    fontFamily: 'Public Sans',
    background: '#E87819',
    "&:hover": {
        background: '#E87819'
    },
}

export const saveChanges = {
    height: '40px',
    width: 'fit-content',
    padding: '11px 20px',
    borderRadius: '5px',
    color: '#fff',
    textTransform: 'none',
    fontSize: '14px',
    fontWeight: '500',
    lineHeight: '20px', /* 18.2px */
    overflow: 'hidden',
    fontFamily: 'Public Sans',
    background: '#E87819',
    "&:hover": {
        background: '#E87819'
    },
    marginRight: '20px'
}
export const googlemap = {
    height: '42px',
    padding: '9px 17px',
    borderRadius: '6px',
    background: 'linear-gradient(0deg, #000 0%, #000 100%), rgba(255, 255, 255, 0.70)',
    color: '#fff',
    textTransform: 'capitalize',
    fontFamily: 'Work Sans',
    fontSize: '14px',
    fontWeight: '500',
    position: 'absolute',
    right: '10px',
    bottom: '8px',
    lineHeight: '130%', /* 18.2px */
    overflow: 'hidden',
    "&:hover": {
        background: 'linear-gradient(0deg, #000 0%, #000 100%), rgba(255, 255, 255, 0.70)',
    }
}
export const formselect = {

    width: "100%",
    height: "40px",
    color: "#858D9D",
    fontFamily: "Public Sans",
    lineHeight: "20px",
    fontSize: "14px",
    outline: "none !important",
    borderRadius: '8px',
    padding: "10px",
    opacity: 1,
    border: "1px solid var(--Gray-100, #E0E2E7) !important",
    ".MuiSelect-select": {
        padding: "12px 1px !important",
    },
    ".MuiOutlinedInput-notchedOutline": {
        border: "none !important",
    },
    "& .MuiOutlinedInput-root": {
        borderRadius: "8px",
        borderColor: "#D9D9D9",
        // height: "100%",
        display: 'flex',
        alignItem: 'center',
    },
    // "& .MuiSelect-select": {
    //     color: "#081735",
    //     fontFamily: "Nunito Sans",
    //     fontSize: "14px",
    //     fontWeight: "600",
    //     outline: "none !important",
    //     borderRadius: '8px',
    //     padding: "10px",
    //     opacity: 1,
    // },
}
export const SelectStyle = {
    backgroundColor: '#fff',
    width: "100%",
    height: "40px",
    color: "#858D9D",
    fontFamily: "Public Sans",
    lineHeight: "20px",
    fontSize: "14px",
    outline: "none !important",
    borderRadius: 2.5,
    padding: "14px",
    opacity: 1,
    border: "1px solid var(--Gray-100, #E0E2E7) !important",
    ".MuiSelect-select": {
        padding: "12px 1px !important",
    },
    ".MuiOutlinedInput-notchedOutline": {
        border: "none !important",
    },
    "& .MuiOutlinedInput-root": {
        borderRadius: "1.1ch",
        borderColor: "#D9D9D9",
        // height: "100%",
        display: 'flex',
        alignItem: 'center',
        "& input": {
            padding: "10px 10px",
            height: "auto",
            color: "#081735",
            fontFamily: "Nunito Sans",
            fontSize: "14px",
            fontWeight: "400",
            lineHeight: "20px",
            textAlign: "left",
            opacity: 1,
            "&::placeholder": {
                color: "#858D9D", // Set your placeholder text color
                fontFamily: "Public Sans",
                fontSize: "14px",
                fontWeight: "400",
                lineHeight: "24px",
                textAlign: "left",
                opacity: 1,
                padding: "10px 4px",
            },
        },
    },

}
export const inputText = {
    height: "54px",
    width: '100%',
    outline: 'none !important',
    borderRadius: '8px',
    border: '1px solid var(--Gray-100, #D8DAE5) !important',

    ".MuiOutlinedInput-notchedOutline": {
        border: "none !important"
    },
    "& .MuiOutlinedInput-root": {
        borderRadius: "1.1ch",
        borderColor: "#D9D9D9",
        // height: "100%",
        display: 'flex',
        alignItem: 'center',
        "& input": {
            padding: "15px 14px",
            height: "auto",
            color: "#081735",
            fontFamily: "Nunito Sans",
            fontSize: "14px",
            fontWeight: "400",
            lineHeight: "20px",
            textAlign: "left",
            opacity: 1,
            "&::placeholder": {
                color: "#081735", // Set your placeholder text color
                fontFamily: "Nunito Sans",
                fontSize: "16px",
                fontWeight: "400",
                lineHeight: "24px",
                textAlign: "left",
                opacity: 1,
            },
        },
    },

}
export const fieldText = {
    height: "40px",
    width: '100%',
    outline: 'none !important',
    borderRadius: '8px',
    border: '1px solid var(--Gray-100, #D8DAE5) !important',

    ".MuiOutlinedInput-notchedOutline": {
        border: "none !important"
    },
    "& .MuiOutlinedInput-root": {
        borderRadius: "1.1ch",
        borderColor: "#D9D9D9",
        // height: "100%",
        display: 'flex',
        alignItem: 'center',
        "& input": {
            padding: "10px 10px",
            height: "auto",
            color: "#081735",
            fontFamily: "Nunito Sans",
            fontSize: "14px",
            fontWeight: "600",
            lineHeight: "20px",
            textAlign: "left",
            opacity: 1,
            "&::placeholder": {
                color: "#858D9D", // Set your placeholder text color
                fontFamily: "Public Sans",
                fontSize: "14px",
                fontWeight: "400",
                lineHeight: "24px",
                textAlign: "left",
                opacity: 1,
                padding: "10px 4px",
            },
        },
    },

}
export const TextInput = {
    height: "40px",
    width: '100%',
    outline: 'none !important',
    borderRadius: '8px',
    border: '1px solid var(--Gray-100, #E0E2E7) !important',
    backgroundColor: '#ffffff',
    ".MuiOutlinedInput-notchedOutline": {
        border: "none !important"
    },
    "& .MuiOutlinedInput-root": {
        borderRadius: "1.1ch",
        borderColor: "#E0E2E7",
        // height: "100%",
        display: 'flex',
        alignItem: 'center',
        padding: '0px !important',
        "& input": {
            padding: "10px 10px",
            height: "auto",
            color: "#081735",
            fontFamily: "Nunito Sans",
            fontSize: "14px",
            fontWeight: "400",
            lineHeight: "20px",
            textAlign: "left",
            opacity: 1,
            "&::placeholder": {
                color: "#858D9D", // Set your placeholder text color
                fontFamily: "Public Sans",
                fontSize: "14px",
                fontWeight: "400",
                lineHeight: "24px",
                textAlign: "left",
                opacity: 1,
                padding: "10px 4px",
            },
        },
    },

}
export const TextArea = {
    // height: "40px",
    width: '100%',
    outline: 'none !important',
    borderRadius: '8px',
    border: '1px solid var(--Gray-100, #E0E2E7) !important',
    backgroundColor: '#ffffff',
    ".MuiOutlinedInput-notchedOutline": {
        border: "none !important"
    },
    "& .MuiOutlinedInput-root": {
        borderRadius: "1.1ch",
        borderColor: "#E0E2E7",
        // height: "100%",
        display: 'flex',
        alignItem: 'center',
        padding: '0px !important',
        "& textarea": {
            padding: "10px 10px",
            height: "auto",
            color: "#081735",
            fontFamily: "Nunito Sans",
            fontSize: "14px",
            fontWeight: "400",
            lineHeight: "20px",
            textAlign: "left",
            opacity: 1,
            "&::placeholder": {
                color: "#858D9D", // Set your placeholder text color
                fontFamily: "Public Sans",
                fontSize: "14px",
                fontWeight: "400",
                lineHeight: "24px",
                textAlign: "left",
                opacity: 1,
                // padding: "10px 4px",
            },
        },
    },

}
export const InputURL = {
    height: '40px',
    width: '100%',
    outline: 'none !important',
    ".MuiOutlinedInput-notchedOutline": {
        border: "none !important"
    },
    "& .MuiOutlinedInput-root": {
        backgroundColor: '#fff',
        borderTop: '1px solid #C2C2C2',
        borderRight: '1px solid #C2C2C2',
        borderBottom: '1px solid #C2C2C2',
        borderLeft: 'none',
        borderTopLeftRadius: '0px',
        borderBottomLeftRadius: '0px',
        borderTopRightRadius: '8px',
        borderBottomRightRadius: '8px',
        display: 'flex',
        alignItem: 'center',
        padding: '0px !important',
        "& input": {
            padding: "10px 10px",
            height: "auto",
            color: "#081735",
            fontFamily: "Nunito Sans",
            fontSize: "14px",
            fontWeight: "400",
            lineHeight: "20px",
            textAlign: "left",
            opacity: 1,
            "&::placeholder": {
                color: "#858D9D", // Set your placeholder text color
                fontFamily: "Public Sans",
                fontSize: "14px",
                fontWeight: "400",
                lineHeight: "24px",
                textAlign: "left",
                opacity: 1,
                padding: "10px 4px",
            },
        },
    },
}
export const delet = {
    height: '40px',
    padding: '5px 20px',
    borderRadius: '8px',
    background: '#E87819',
    color: '#fff',
    textTransform: 'none',
    fontSize: '16px',
    fontWeight: '500',
    lineHeight: '24px', /* 18.2px */
    overflow: 'hidden',
    fontFamily: 'DM Sans',
    "&:hover": {
        background: '#F0142F'
    },
    marginLeft: '10px'
}
export const cancle = {
    width: 'fit-content',
    height: '40px',
    padding: '11px 20px',
    borderRadius: '8px',
    background: '#FFF',
    color: '#1D1F2C',
    textTransform: 'none',
    fontSize: '14px',
    fontWeight: '600',
    lineHeight: '20px', /* 18.2px */
    overflow: 'hidden',
    fontFamily: 'Public Sans',
    border: '1px solid #C2C6CE',
    "&:hover": {
        background: '#E87819',
        color: '#fff'
    },
}
export const accept = {
    height: '42px',
    padding: '11px 20px',
    borderRadius: '6px',
    background: '#0F9A1D',
    color: '#FFFFFF',
    textTransform: 'none',
    fontSize: '16px',
    fontWeight: '500',
    lineHeight: '24px', /* 18.2px */
    overflow: 'hidden',
    fontFamily: 'DM Sans',
    "&:hover": {
        background: '#0F9A1F'
    },
    marginLeft: '10px'
}
export const apply = {
    width: '100%',
    height: '42px',
    padding: '11px 0px 11px 0px',
    borderRadius: '6px',
    background: '#5570F1',
    color: '#FFFFFF',
    textTransform: 'none',
    fontSize: '16px',
    fontWeight: '500',
    lineHeight: '24px', /* 18.2px */
    overflow: 'hidden',
    fontFamily: 'DM Sans',
    "&:hover": {
        background: '#5570F1'
    },
    marginTop: '30px'
}
export const Apply = {
    width: '150px',
    height: '36px',
    padding: '17px 16px 17px 16px',
    gap: '10px',
    borderRadius: '12px',

    background: '#5570F1',
    color: '#FFFFFF',
    textTransform: 'none',
    fontSize: '14px',
    fontWeight: '400',
    lineHeight: '24px', /* 18.2px */
    overflow: 'hidden',
    fontFamily: 'DM Sans',
    "&:hover": {
        background: '#5570F1'
    },
    marginTop: '30px'
}
export const Reset = {
    width: '150px',
    height: '36px',
    padding: '17px 16px 17px 16px',
    gap: '10px',
    borderRadius: '12px',
    background: '#DBDADE',
    color: '#000',
    textTransform: 'none',
    fontSize: '14px',
    fontWeight: '400',
    lineHeight: '24px', /* 18.2px */
    overflow: 'hidden',
    fontFamily: 'DM Sans',
    "&:hover": {
        background: '#5570F1',
        color: '#fff'
    },
    marginTop: '30px',
    marginRight: '10px',
    marginTop: '30px'
}
export const theme = createTheme({
    components: {
        MuiPopover: {
            styleOverrides: {
                root: {
                    borderRadius: '16px',
                    overflow: 'visible',
                },
                paper: {
                    boxShadow: '4px 4px 4px 6px #00000033',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: '8px',
                    boxShadow: '4px 4px 4px 6px #00000033',
                    marginTop: '8px',
                    overflow: 'visible',
                },
            },
        },
        MuiMenuItem: {
            styleOverrides: {
                root: {
                    fontFamily: 'Poppins',
                    fontSize: '12px',
                    color: '#2F2F2F',
                    fontWeight: '400',
                    padding: '10px 16px',
                    // borderRadius: '20px',
                    borderBottom: '1px solid #EFEEF1',
                    overflow: 'visible',
                    marginRight: 'auto',
                    display: 'flex',
                    justifyContent: 'flex-start',
                    // alignItems:'flex-start',
                    gap: '10px',
                    // backgroundColor: '#EFEEF1',
                    '&:hover': {
                        backgroundColor: '#f5f5f5',
                        color: '#2F2F2F',
                    },
                    '&.Mui-selected': {
                        backgroundColor: '#EFEEF1',
                        color: '#2F2F2F',
                        alignItem: 'left',
                        marginLeft: 'auto',
                        '&:hover': {
                            backgroundColor: '#d6dafe',
                        },
                        '&:before': {
                            content: '"✔"', // Add checkmark icon
                            fontSize: '14px',
                            color: '#2F2F2F',
                            // marginRight: 'auto',
                            textAlign: 'left'
                        },
                    },
                    '&.MuiMenu-list': {
                        paddingTop: '0',
                        paddingBottom: '0'
                    }
                },
            },
        },
    },
});
