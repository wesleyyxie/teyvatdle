function autocomplete(inp, arr) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function(e) {
        var a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) { return false;}
        currentFocus = 0;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items bg-white z-99 absolute w-[300px]");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        /*for each item in the array...*/
        for (i = 0; i < arr.length; i++) {
          /*check if the item starts with the same letters as the text field value:*/
          characterName = arr[i]["name"]
          characterNameParts = characterName.split(" ")
          if (characterName.substr(0, val.length).toUpperCase() == val.toUpperCase()) {
            /*create a DIV element for each matching element:*/
            container = document.createElement("DIV")
            container.setAttribute("class", "flex cursor-pointer items-center p-[5px] hover:bg-[#e9e9e9]")
            icon = document.createElement("DIV")
            icon.style.backgroundImage = `url('/static/images/character_icons/${arr[i]["id"].toLowerCase()}.png')`
            icon.setAttribute("class", "h-[50px] w-[50px] bg-contain bg-no-repeat bg-center mr-[2px]")
            b = document.createElement("DIV");
            b.setAttribute("class", "flex p-[5px] h-[50px] border-b items-center")
            /*make the matching letters bold:*/
            b.innerHTML = "<strong>" + characterName.substr(0, val.length).replace(" ", "&nbsp;") + "</strong>";
            b.innerHTML += characterName.substr(val.length).replace(" ", "&nbsp;");
            /*insert a input field that will hold the current array item's value:*/
            b.innerHTML += "<input type='hidden' value='" + characterName + "'>";
            /*execute a function when someone clicks on the item value (DIV element):*/
            container.addEventListener("click", function(e) {
                /*insert the value for the autocomplete text field:*/
                inp.value = this.getElementsByTagName("input")[0].value;
                /*close the list of autocompleted values,
                (or any other open lists of autocompleted values:*/
                closeAllLists();
            });
            container.appendChild(icon)
            container.appendChild(b);
            a.appendChild(container)
          }
          if ((characterNameParts.length > 1) && (characterNameParts[1].substr(0, val.length).toUpperCase() == val.toUpperCase())) {
            /*create a DIV element for each matching element:*/
            container = document.createElement("DIV")
            container.setAttribute("class", "flex cursor-pointer items-center p-[5px] hover:bg-[#e9e9e9]")
            icon = document.createElement("DIV")
            icon.style.backgroundImage = `url('/static/images/character_icons/${arr[i]["id"].toLowerCase()}.png')`
            icon.setAttribute("class", "h-[50px] w-[50px] bg-contain bg-no-repeat bg-center mr-[2px]")
            b = document.createElement("DIV");
            b.setAttribute("class", "flex p-[5px] h-[50px] border-b items-center")
            /*make the matching letters bold:*/
            b.innerHTML = characterNameParts[0]
            b.innerHTML += "<strong>&nbsp;" + characterNameParts[1].substr(0, val.length) + "</strong>";
            b.innerHTML += characterNameParts[1].substr(val.length);
            /*insert a input field that will hold the current array item's value:*/
            b.innerHTML += "<input type='hidden' value='" + characterName + "'>";
            /*execute a function when someone clicks on the item value (DIV element):*/
            container.addEventListener("click", function(e) {
                /*insert the value for the autocomplete text field:*/
                inp.value = this.getElementsByTagName("input")[0].value;
                /*close the list of autocompleted values,
                (or any other open lists of autocompleted values:*/
                closeAllLists();
            });
            container.appendChild(icon)
            container.appendChild(b);
            a.appendChild(container)
          }
        }
        console.log(a)
        if (a.innerHTML != "") {
            addActive(a.getElementsByTagName("div"))
        }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
          /*If the arrow DOWN key is pressed,
          increase the currentFocus variable:*/
          currentFocus = currentFocus + 3;
          /*and and make the current item more visible:*/
          addActive(x);
        } else if (e.keyCode == 38) { //up
          /*If the arrow UP key is pressed,
          decrease the currentFocus variable:*/
          currentFocus = currentFocus - 3;
          /*and and make the current item more visible:*/
          addActive(x);
        } else if (e.keyCode == 13) {
          /*If the ENTER key is pressed, prevent the form from being submitted,*/
          e.preventDefault();
          if (currentFocus > -1) {
            /*and simulate a click on the "active" item:*/
            if (x) {
                x[currentFocus].click();
                
            }
          }
        }
    });
    function addActive(x) {
      /*a function to classify an item as "active":*/
      if (!x) return false;
      /*start by removing the "active" class on all items:*/
      removeActive(x);
      if (currentFocus >= x.length) currentFocus = 0;
      if (currentFocus < 0) currentFocus = (x.length - 1);
      /*add class "autocomplete-active":*/
      x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
      /*a function to remove the "active" class from all autocomplete items:*/
      for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("autocomplete-active");
      }
    }
    function closeAllLists(elmnt) {
      /*close all autocomplete lists in the document,
      except the one passed as an argument:*/
      var x = document.getElementsByClassName("autocomplete-items");
      for (var i = 0; i < x.length; i++) {
        if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
      closeAllLists(e.target);
  });
}

window.addEventListener('load', async function () {
    const characterInfoRes = await fetch("/static/data/classicModeInfo.json");
    charactersInfoData = await characterInfoRes.json();
    window.arr = charactersInfoData
    /*initiate the autocomplete function on the "myInput" element, and pass along the countries array as possible autocomplete values:*/
    console.log(document.getElementById("guess"))
    autocomplete(document.getElementById("guess"), window.arr);
});
