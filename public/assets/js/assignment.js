function validate() {
    let streetValue = document.getElementById("street").value;
    let houseNumberValue = document.getElementById("houseNumber").value;
    let houseNumberAdditionValue = document.getElementById("houseNumberAddition").value;
    let postalCodeValue = document.getElementById("postalCode").value;
    let townValue = document.getElementById("town").value;

    let playgroundStreet = document.getElementById("playgroundStreet");
    let playgroundHouseNumber = document.getElementById("playgroundHouseNumber");
    let playgroundHouseNumberAddition = document.getElementById("playgroundHouseNumberAddition");
    let playgroundPostalCode = document.getElementById("playgroundPostalCode");
    let playgroundTown = document.getElementById("playgroundTown");
    let playgroundStreetValue = document.getElementById("playgroundStreet").value;
    let playgroundHouseNumberValue = document.getElementById("playgroundHouseNumber").value;
    let playgroundHouseNumberAdditionValue = document.getElementById("playgroundHouseNumberAddition").value;
    let playgroundPostalCodeValue = document.getElementById("playgroundPostalCode").value;
    let playgroundTownValue = document.getElementById("playgroundTown").value;

    let makeUpStreet = document.getElementById("makeUpStreet");
    let makeUpHouseNumber = document.getElementById("makeUpHouseNumber");
    let makeUpHouseNumberAddition = document.getElementById("makeUpHouseNumberAddition");
    let makeUpPostalCode = document.getElementById("makeUpPostalCode");
    let makeUpTown = document.getElementById("makeUpTown");

    if (document.getElementById("checkedOrNotPlayground").checked) {
        playgroundStreet.setAttribute("value", streetValue);
        playgroundHouseNumber.setAttribute("value", houseNumberValue);
        playgroundHouseNumberAddition.setAttribute("value", houseNumberAdditionValue);
        playgroundPostalCode.setAttribute("value", postalCodeValue);
        playgroundTown.setAttribute("value", townValue);
    } else {
        playgroundStreet.setAttribute("value", "");
        playgroundHouseNumber.setAttribute("value", "");
        playgroundHouseNumberAddition.setAttribute("value", "");
        playgroundPostalCode.setAttribute("value", "");
        playgroundTown.setAttribute("value", "");
    }

    if (document.getElementById("checkedOrNotMakeUp").checked) {
        makeUpStreet.setAttribute("value", playgroundStreetValue);
        makeUpHouseNumber.setAttribute("value", playgroundHouseNumberValue);
        makeUpHouseNumberAddition.setAttribute("value", playgroundHouseNumberAdditionValue);
        makeUpPostalCode.setAttribute("value", playgroundPostalCodeValue);
        makeUpTown.setAttribute("value", playgroundTownValue);
    } else {
        makeUpStreet.setAttribute("value", "");
        makeUpHouseNumber.setAttribute("value", "");
        makeUpHouseNumberAddition.setAttribute("value", "");
        makeUpPostalCode.setAttribute("value", "");
        makeUpTown.setAttribute("value", "");
    }
} 