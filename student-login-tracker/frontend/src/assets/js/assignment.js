const urlParams = new URLSearchParams(window.location.search);

id = urlParams.get("id")

async function updateAssignment() {
    response = await fetch("http://BACKEND_HOST/assignment/" + id + "?" + new URLSearchParams({
        sessionToken: localStorage.getItem("sessionToken")
    }))

    assignmentResponse = await response.json()

    document.getElementById("header").innerHTML = assignmentResponse["Assignment"]["assignmentName"]

    response = await fetch("http://BACKEND_HOST/assignment/ " + id + "/submissions?" + new URLSearchParams({
        sessionToken: localStorage.getItem("sessionToken")
    }))

    submissionsResponse = await response.json()

    response = await fetch("http://BACKEND_HOST/studIDFromUserID?" + new URLSearchParams({
        sessionToken: localStorage.getItem("sessionToken")
    }))

    studID = await response.json()

    fileSizeData = []
    lineCountData = []
    scatterData = []
    colors = []
    scatterColors = []

    fileSizeAvg = 0
    lineCountAvg = 0

    submissionsResponse["Submissions"].forEach(element => {
        fileSizeAvg += element["fileSize"]
        lineCountAvg += element["lineCount"]

        fileSizeData.push(element["fileSize"])
        lineCountData.push(element["lineCount"])

        if (element["studentId"] == studID["Student ID"]) {
            document.getElementById("fileSize").innerHTML = "File Size: " + element["fileSize"] + "MB"
            document.getElementById("lineCount").innerHTML = "Line Count: " + element["lineCount"]
            document.getElementById("doneTime").innerHTML = "Submission Time: " + element["doneTime"].replace("T", " ")

            // brick-orange
            colors.push("#f76902")

            if (element["doneTime"] != null) {
                scatterColors.push("#f76902")
            }
        } else if (fileSizeData.length % 2) {
            // black
            colors.push("#000000")

            if (element["doneTime"] != null) {
                scatterColors.push("#000000")
            }
        } else {
            // rit-dark-gray
            colors.push("#7c878e")

            if (element["doneTime"] != null) {
                scatterColors.push("#7c878e")
            }
        }
    })

    fileSizeAvg /= fileSizeData.length
    lineCountAvg /= lineCountData.length

    submissionsResponse["Submissions"].forEach(element => {
        if (element["doneTime"] == null) {
            return
        }

        // https://stackoverflow.com/questions/45071813/time-scatter-plot-w-chart-js
        // https://stackoverflow.com/questions/38777137/modifying-the-x-axis-labels-of-a-scatterplot-in-chart-js-2
        scatterData.push([new Date(element["doneTime"]).getTime(), ((element["lineCount"]/lineCountAvg) + (element["fileSize"]/fileSizeAvg))/2])
    });

    // Use this method for setting my data point to orange and the rest to alternating black/grey - https://stackoverflow.com/questions/28159595/chartjs-different-color-per-data-point

    new Chart(document.getElementById("paChart1"), {
        type: 'polarArea',
        data: {
            labels: Array(lineCountData.length).fill('File Size'),
            datasets: [{
                data: fileSizeData,
                backgroundColor: colors
            }]
        },
        options: {
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    })

    new Chart(document.getElementById("paChart2"), {
        type: 'polarArea',
        data: {
            labels: Array(lineCountData.length).fill('Line Count'),
            datasets: [{
                data: lineCountData,
                backgroundColor: colors
            }]
        },
        options: {
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    })

    new Chart(document.getElementById("scatterChart"), {
        type: 'scatter',
        data: {
            datasets: [{
                data: scatterData,
                backgroundColor: scatterColors
            }]
        },
        options: {
            scales: {
                x: {
                    ticks: {
                        callback: (value, index, values) => {
                            return new Date(value).toLocaleString("en-US")
                        }

                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    })
}


document.addEventListener("DOMContentLoaded", function(){
    updateAssignment()
})