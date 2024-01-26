function uploadFile() {
    document.getElementById('fileInput').click();
}
function handleFileSelect(input) {
    const file = input.files[0];
    const uploadedImage = document.getElementById('uploadedImage');
    const uploadDiv = document.getElementById('uploadDiv'); //the div that includes the plus icon
    const newImageDiv = document.createElement('div'); //the div with the new image
    newImageDiv.className = "col-md-4 border"

    if (file) {
        const reader = new FileReader();
        const newImage = document.createElement('img');
        const ref = document.createElement('a');
        ref.href = '../public/second.html';
        reader.onload = function (e) {
        newImage.src = e.target.result;
        newImage.classList.add("rounded");
        newImage.classList.add("img-fluid");
        newImage.classList.add("img-thumbnail");
        };
        ref.appendChild(newImage); //add image to the link <a> in order to link to second.html
        newImageDiv.replaceChildren(); //remove all childre
        ref.appendChild(newImage); //add the newImage as a child of the link <a>
        newImageDiv.appendChild(ref); //add the link <a> to the new column div
        document.getElementById('imagesRow').removeChild(uploadDiv); // remove the plus sign div (to be added later)
        document.getElementById('imagesRow').appendChild(newImageDiv); // add the newImage div
        document.getElementById('imagesRow').appendChild(uploadDiv); // add the plus sign div back
        resetHeight();
        reader.readAsDataURL(file);
    } else {
        console.error('No file selected');
        uploadedImage.style.display = 'none';
    }
}
resetHeight();

function resetHeight(){
    var elements = document.getElementsByClassName("img-fluid");
    console.log(elements);
    console.log(elements.length);
    var height = Number.MAX_SAFE_INTEGER;

    for(let i=0; i<elements.length; i++){
        console.log(elements[i].height);
        if (elements[i].height < height){
            height = elements[i].height;
        }
    }
    for(let i=0; i<elements.length; i++){
        elements[i].style.height = height+'px';
        console.log(elements[i].height+'px');
    }
}


