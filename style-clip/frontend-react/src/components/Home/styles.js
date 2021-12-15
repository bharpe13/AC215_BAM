
const styles = theme => ({
    root: {
        flexGrow: 1,
        minHeight: "100vh"
    },
    grow: {
        flexGrow: 1,
    },
    main: {

    },
    container: {
        backgroundColor: "#ffffff",
        paddingTop: "30px",
        paddingBottom: "20px",
    },
    dropzone: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        margin: "20px",
        borderWidth: "2px",
        borderRadius: "2px",
        borderColor: "#cccccc",
        borderStyle: "dashed",
        backgroundColor: "#fafafa",
        outline: "none",
        transition: "border .24s ease-in-out",
        cursor: "pointer",
        backgroundImage: "url('https://storage.googleapis.com/ac215_project_buket/snipsnip.jpg')",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        minHeight: "400px",
    },
    dropzone_new: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        margin: "20px",
        borderWidth: "2px",
        borderRadius: "2px",
        borderColor: "#cccccc",
        borderStyle: "dashed",
        backgroundColor: "#fafafa",
        outline: "none",
        transition: "border .24s ease-in-out",
        cursor: "pointer",
        minHeight: "400px",
    },

    fileInput: {
        display: "none",
    },
    preview: {
        width: "100%",
    },
    photo: {
        maxWidth: "100%",
        height: "auto",
        alignItems: "center",
        verticalAlign: "middle",
        justifyContent: "center",
    },
    help: {
        color: "#302f2f"
    },
    safe: {
        color: "#31a354",
    },
    poisonous: {
        color: "#de2d26",
    },
    input: {
        display: "block",
        margin: "100px",
    },
    label: {
        margin: "100px",
        display: "block",
    },
});

export default styles;
