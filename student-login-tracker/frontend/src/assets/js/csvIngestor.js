class CSVIngestor extends EventTarget {
    // Reads a CSV file and then executes the callback function with a 2D list as a parameter
    // Always skips the first line of the file
    constructor(csvFile, callback) {
        super()

        if (csvFile.type !== "text/csv") {
            throw "File must be CSV"
        }

        let fr = new FileReader()

        fr.readAsText(csvFile)

        fr.addEventListener("load", async (e) => {
            let splitCSV = fr.result.split("\n")

            splitCSV.shift()

            splitCSV.forEach((line, index) => {
                splitCSV[index] = line.split(",")
                splitCSV[index].forEach((column, colIndex) => {
                    splitCSV[index][colIndex] = column.trim()
                })
            })

            try {
                await callback(splitCSV)
                this.dispatchEvent(new Event("load"))
            } catch(error) {
                this.dispatchEvent(new Event("error"))
            } finally {
                this.dispatchEvent(new Event("loadend"))
            }
        })
    }
}