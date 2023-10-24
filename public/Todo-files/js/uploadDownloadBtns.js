const uploadText = document.getElementById("upload-text");
const uploadBtn = document.getElementById("upload-btn");
const downloadText = document.getElementById("download-text");
const downloadBtn = document.getElementById("download-btn");

const fileInput = document.getElementById("fileInput");

const uploadHandler = () => {
    fileInput.value = null;
    fileInput.click();

    console.log("upload");
};

fileInput.addEventListener("change", function () {
    const selectedFile = fileInput.files[0];
    if (selectedFile) {
        console.log("Selected file:", selectedFile.name);

        const reader = new FileReader();

        reader.onload = function (event) {
            let fileContent = JSON.parse(event.target.result);
            console.log("File content:", fileContent);

            todoSaves = fileContent;

            console.log("Import successful");
            updateTodos();
            updateHTML(false);
        };

        reader.readAsText(selectedFile);
    }
    fileInput.value = null;
});

const downloadHandler = () => {
    console.log("download");

    let content = JSON.stringify(todoSaves, null, 2);

    // content = content.replace(/},{/g, "}\n{");
    // content = content.replace("[{", "[\n{");
    // content = content.replace("}]", "}\n]");
    // content = content.replace(/{/g, "  {  ");
    // content = content.replace(/}/g, "  }");
    // content = content.replace(/,/g, "\t\t");

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    console.log(url);

    console.log(
        "If you cannot download todos, consider turning off your ad blocker"
    );

    const a = document.createElement("a");
    a.href = url;
    a.download = "save-todos.txt";
    a.textContent = "Download Array";

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

downloadText.addEventListener("click", downloadHandler);
uploadText.addEventListener("click", uploadHandler);

uploadText.addEventListener("mouseover", () => {
    uploadBtn.style.opacity = "0";
});
uploadText.addEventListener("mouseleave", () => {
    uploadBtn.style.opacity = "1";
});
uploadText.style.cursor = "pointer";

downloadText.addEventListener("mouseover", () => {
    downloadBtn.style.opacity = "0";
});
downloadText.addEventListener("mouseleave", () => {
    downloadBtn.style.opacity = "1";
});
downloadText.style.cursor = "pointer";

setTimeout(() => {
    if (!firebaseOnline) {
        loadingPage.innerHTML = `
        <h1>Cannot access Firebase servers</h1>
        <br />
        <p>Maybe turn on your VPN</p>`;
    }
}, 3000);
