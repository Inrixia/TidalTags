const style = document.createElement("style");
style.textContent = `
.tag {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    padding: 0 8px;
    height: 18px;
    font-size: 12px;
    line-height: 20px;
    border-radius: 16px;
    color: rgba(0, 0, 0, 0.87); /* Text color */
    box-sizing: border-box;
    transition: background-color 0.2s;
    margin-left: 5px;
}
.tag-mqa {
    background-color: #ffd700; /* Golden color */
}
.tag-hr {
    background-color: #b9f2ff; /* Diamond-like color */
}
.tag-atmos {
	background-color: #003366; /* Dark blue color */
}
.tag:hover {
    background-color: #d0d0d0; /* Change color when mouse is over */
}
`;
document.head.appendChild(style);
