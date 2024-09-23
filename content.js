function getIndexByInnerText(className, searchText) {
    const elements = document.getElementsByClassName(className);
    for (let i = 0; i < elements.length; i++) {
        if (elements[i].innerText.trim() === searchText) {
            return i;
        }
    }
    return -1;
}

function getAllInnerText(className) {
    const elements = document.getElementsByClassName(className);
    return Array.from(elements).map(element => element.innerText.trim());
}

function scrollToElement(element, pos) {
    return new Promise((resolve) => {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        setTimeout(resolve, 300); // Adjust the timeout duration as needed
    });
}

function confirmAction(name) {
    return new Promise((resolve) => {
        let proceed = confirm("Okay to remove " + name + "?");
        resolve(proceed);
    });
}

async function processElements() {
    const nameTexts = getAllInnerText("mn-connection-card__name");

    for (const name of nameTexts) {
		if(name == startName){
			found = true;
		}
		if(found === false){
			continue;
		}
        let index = getIndexByInnerText("mn-connection-card__name", name);
        console.log(index + ' - ' + name);

        // Step 1: Scroll to the dropdown trigger at the current index
        let triggerElement = document.getElementsByClassName("artdeco-dropdown__trigger artdeco-dropdown__trigger--placement-bottom ember-view mn-connection-card__dropdown-trigger artdeco-button--tertiary artdeco-button--muted artdeco-button--circle p1")[index];
        
        // Wait for the scroll to complete
        await scrollToElement(triggerElement, index);

        // Get the name and wait for user confirmation
        let currentName = document.getElementsByClassName("mn-connection-card__name")[index].innerText;
        let proceed = await confirmAction(currentName);

        if (proceed) {
            // Perform the three clicks with 300ms delay after each
            triggerElement.click();
            await new Promise(resolve => setTimeout(resolve, 300));

            document.getElementsByClassName("display-flex align-items-center t-14 t-black--light t-normal")[2].click();
            await new Promise(resolve => setTimeout(resolve, 300));

            document.getElementsByClassName("artdeco-button artdeco-button--2 artdeco-button--primary ember-view artdeco-modal__confirm-dialog-btn")[0].click();
            await new Promise(resolve => setTimeout(resolve, 300));

            // Additional delay after the removal process
            await new Promise(resolve => setTimeout(resolve, 300));
            console.log("Removing " + currentName);
        } else {
            console.log("Skipping " + currentName);
        }
    }
}
let found = false;
let startName = prompt("Enter the name to start from:");
processElements();
