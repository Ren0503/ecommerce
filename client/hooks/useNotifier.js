const useNotifier = ({ type = "", content = "" }) => {
    let notifierObj = document.getElementById("notifierID")

    if (!notifierObj) {
        const tempObj = document.createElement("div")
        tempObj.id = "notifierID"
        document.body.append(tempObj)
        notifierObj = document.getElementById("notifierID")
    }

    // create new notification content

    const notificationContent = document.createElement("div")
    notificationContent.classList.add("notifierContainer")
    notificationContent.classList.add(type)
    notificationContent.innerHTML = content
    notificationContent.onclick = () => closeNofifier()

    notifierObj.innerHTML = ""
    notifierObj.appendChild(notificationContent)

    // close notifier

    const closeNotifier = () => {
        let notifierObj = document.getElementById("notifierID")
        notifierObj.innerHTML = ""
    }

    setTimeout(() => closeNotifier(), 7000)
}

export default useNotifier