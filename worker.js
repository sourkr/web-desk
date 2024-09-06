onmessage = ({ data }) => {
    if(data[0] == 2) eval(data[1])
}